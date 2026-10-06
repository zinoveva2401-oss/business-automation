import {createHash} from 'node:crypto';

const API='https://platform-api2.max.ru';
const hash=value=>createHash('sha256').update(value).digest('hex');
const jsonHash=value=>hash(JSON.stringify(value));
const known=(value)=>Number.isFinite(value)?{value,quality:'OBSERVED'}:{value:null,quality:'UNKNOWN'};

function payloadIdentity({chatId,text='',media=[]}){
  return jsonHash({channel:'max',chat_id:String(chatId),text,media:media.map(m=>({type:m.type,sha256:m.sha256}))});
}

function assertOwnerAuthorization(authorization,{chatId,payloadHash,now}){
  if(!authorization||authorization.status!=='APPROVED')throw new Error('Owner-approved Content System output is required');
  if(authorization.payload_hash!==payloadHash)throw new Error('Owner authorization payload hash mismatch');
  if(!(authorization.channels??[]).map(String).includes(String(chatId)))throw new Error('Owner authorization does not include this MAX channel');
  const start=Date.parse(authorization.valid_from),expiry=Date.parse(authorization.expires_at),instant=Date.parse(now);
  if(!Number.isFinite(start)||!Number.isFinite(expiry)||instant<start||instant>expiry)throw new Error('Owner authorization is outside its validity period');
  if((authorization.allowed_changes??[]).some(change=>change!=='NONE'))throw new Error('MAX publishing requires the exact approved payload; changes must be NONE');
}

async function responseJson(response,label){
  const body=await response.json().catch(()=>null);
  if(!response.ok)throw Object.assign(new Error(`${label} failed with HTTP ${response.status}`),{status:response.status,body});
  return body;
}

/** Official MAX Bot API adapter. The caller supplies a durable Content System outbox. */
export function createMaxApiAdapter({accessToken,fetchImpl=fetch,baseUrl=API,clock=()=>new Date().toISOString(),outbox,sleep=ms=>new Promise(resolve=>setTimeout(resolve,ms))}){
  if(!accessToken)throw new TypeError('MAX Bot API token is not configured');
  if(typeof fetchImpl!=='function')throw new TypeError('fetch implementation is required');
  if(!outbox||typeof outbox.get!=='function'||typeof outbox.save!=='function')throw new TypeError('A durable publication outbox is required');
  const request=async(path,{method='GET',body,headers={}}={})=>{
    const response=await fetchImpl(`${baseUrl}${path}`,{method,headers:{Authorization:accessToken,...(body?{'Content-Type':'application/json'}:{}),...headers},...(body?{body:JSON.stringify(body)}:{})});
    return responseJson(response,`${method} ${path}`);
  };
  return {
    async inspectChannel(chatId){
      const [chat,membership]=await Promise.all([request(`/chats/${encodeURIComponent(chatId)}`),request(`/chats/${encodeURIComponent(chatId)}/members/me`)]);
      const permissions=membership?.permissions??[];
      return {destination:{id:String(chat.chat_id??chatId),type:chat.type??'UNKNOWN',title:chat.title??null,public:chat.is_public??null},membership_status:membership?.status??'UNKNOWN',admin:Boolean(membership?.is_admin??membership?.role==='admin'),capabilities:{publish:permissions.includes('write')?'PASS':'UNKNOWN',read:permissions.includes('read_all_messages')?'PASS':'UNKNOWN',stats:permissions.includes('view_stats')?'PASS':'UNKNOWN'},checked_at:clock()};
    },
    async uploadMedia({type,filename,bytes,mimeType}){
      if(!['image','video','audio','file'].includes(type))throw new TypeError('Unsupported MAX upload type');
      if(!(bytes instanceof Uint8Array)||!bytes.length)throw new TypeError('Media bytes are required');
      const signed=await request(`/uploads?type=${encodeURIComponent(type)}`,{method:'POST'});
      if(!signed?.url)throw new Error('MAX upload URL missing');
      const form=new FormData();form.append('data',new Blob([bytes],{type:mimeType||'application/octet-stream'}),filename||'content.bin');
      const uploaded=await responseJson(await fetchImpl(signed.url,{method:'POST',body:form}), 'MAX media upload');
      if(!uploaded?.token)throw new Error('MAX upload receipt has no media token');
      return {type,token:uploaded.token,sha256:hash(bytes)};
    },
    async readMessage(messageId){
      const data=await request(`/messages?message_ids=${encodeURIComponent(messageId)}`);
      return data?.messages?.[0]??data?.message??null;
    },
    async readAnalytics(messageId){
      const message=await this.readMessage(messageId);
      if(!message)return {status:'UNKNOWN',message_id:String(messageId),views:known(null),reposts:known(null),checked_at:clock()};
      const stat=message.stat??{};
      return {status:'READBACK',message_id:String(messageId),url:message.url??null,published_at:message.timestamp?new Date(message.timestamp).toISOString():null,views:known(stat.views),reposts:known(stat.forwards??stat.reposts),checked_at:clock()};
    },
    async publish({outputId,chatId,text='',media=[],authorization,idempotencyKey,disableLinkPreview=false}){
      if(!outputId||!chatId||!idempotencyKey)throw new TypeError('outputId, chatId and idempotencyKey are required');
      if(text.length>4000)throw new RangeError('MAX text must not exceed 4000 characters');
      const payloadHash=payloadIdentity({chatId,text,media});
      const now=clock();assertOwnerAuthorization(authorization,{chatId,payloadHash,now});
      const prior=await outbox.get(idempotencyKey);
      if(prior){
        if(prior.payload_hash!==payloadHash)throw new Error('Idempotency key is already bound to a different payload');
        if(prior.status==='PUBLISHED')return prior.receipt;
        if(prior.status==='UNKNOWN'||prior.status==='SENDING'){
          if(prior.message_id){const recovered=await this.readMessage(prior.message_id);if(recovered?.url){const receipt={message_id:String(recovered.body?.mid??prior.message_id),url:recovered.url,published_at:recovered.timestamp?new Date(recovered.timestamp).toISOString():null,readback:true};await outbox.save(idempotencyKey,{...prior,status:'PUBLISHED',receipt});return receipt;}}
          return {status:'UNKNOWN',idempotency_key:idempotencyKey,reconciliation:'REQUIRED',retry_allowed:false};
        }
        throw new Error(`Publication cannot be retried from outbox state ${prior.status}`);
      }
      const capability=await this.inspectChannel(chatId);
      if(capability.destination.type!=='channel'||capability.capabilities.publish!=='PASS')throw new Error('MAX destination is not a writable channel for this bot');
      const intent={output_id:outputId,chat_id:String(chatId),payload_hash:payloadHash,status:'SENDING',attempted_at:now,message_id:null};
      await outbox.save(idempotencyKey,intent);
      let knownMessageId=null;
      try{
        const attachments=[];
        for(const asset of media){
          if(!asset.token)throw new TypeError('Media must be uploaded through the official MAX upload endpoint first');
          attachments.push({type:asset.type,payload:{token:asset.token}});
        }
        const body={...(text?{text}:{}),...(attachments.length?{attachments}:{}),...(disableLinkPreview?{disable_link_preview:true}:{})};
        const created=await request(`/messages?chat_id=${encodeURIComponent(chatId)}`,{method:'POST',body});
        const message=created?.message??created;
        const messageId=message?.body?.mid??message?.mid??message?.message_id;
        knownMessageId=messageId?String(messageId):null;
        await outbox.save(idempotencyKey,{...intent,status:'SENDING',message_id:messageId?String(messageId):null,attempted_at:now});
        if(!messageId)throw new Error('MAX send response has no message ID; result is ambiguous');
        await sleep(250);
        const readback=await this.readMessage(messageId);
        if(!readback?.url)throw new Error('MAX post is not confirmed by public readback');
        const receipt={message_id:String(messageId),url:readback.url,published_at:readback.timestamp?new Date(readback.timestamp).toISOString():null,readback:true};
        await outbox.save(idempotencyKey,{...intent,status:'PUBLISHED',message_id:String(messageId),receipt});
        return receipt;
      }catch(error){
        await outbox.save(idempotencyKey,{...intent,status:'UNKNOWN',error_code:error.status?`HTTP_${error.status}`:'TRANSPORT_OR_READBACK',message_id:knownMessageId});
        return {status:'UNKNOWN',idempotency_key:idempotencyKey,reconciliation:'REQUIRED',retry_allowed:false};
      }
    }
  };
}

export function maxPayloadHash(input){return payloadIdentity(input);}

export function toMaxAnalyticsRow({materialId,publicationId,receipt,analytics,observedAt=new Date().toISOString(),account='max-channel'}){
  if(!materialId||!publicationId||!receipt?.url)throw new TypeError('Material ID, publication ID and public post URL are required');
  const usable=[analytics?.views?.value,analytics?.reposts?.value].some(Number.isFinite);
  return {'Дата':observedAt,'ID материала':materialId,'ID публикации':publicationId,'Площадка':'MAX','URL / объект':receipt.url,'Просмотры / открытия':Number.isFinite(analytics?.views?.value)?analytics.views.value:'UNKNOWN','Репосты':Number.isFinite(analytics?.reposts?.value)?analytics.reposts.value:'UNKNOWN','Время загрузки данных':analytics?.checked_at??observedAt,'Аккаунт':account,'Source detail':'MAX Bot API GET /messages?message_ids — official post readback','Confidence':usable?'OBSERVED':'UNKNOWN','Data status':usable?'PARTIAL':'NO_DATA','Window / age':'publication snapshot; retain observed_at and metric window','Follower delta':'UNKNOWN','Followers / subscribers total':'UNKNOWN'};
}

export function toMaxContentSystemWriteback({output,publicationId,receipt,analytics,observedAt=new Date().toISOString(),channelId}){
  const outputId=output?.['ID выхода'],materialId=output?.['ID материала'];
  if(!outputId||!materialId||!publicationId||!receipt?.url||!receipt?.published_at)throw new TypeError('Exact Content System output/material IDs and verified MAX receipt are required');
  return {output_id:outputId,output_patch:{'Площадка':'MAX','Статус':'Опубликовано','Дата публикации':receipt.published_at.slice(0,10),'Фактическое время публикации':receipt.published_at,'ID публикации платформы':String(publicationId),'URL публикации':receipt.url},analytics_row:toMaxAnalyticsRow({materialId,publicationId,receipt,analytics,observedAt,account:String(channelId??'max-channel')})};
}
