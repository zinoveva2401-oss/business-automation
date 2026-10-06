import test from 'node:test';
import assert from 'node:assert/strict';
import {createMaxApiAdapter,maxPayloadHash,toMaxAnalyticsRow,toMaxContentSystemWriteback} from '../runtime/max-api-adapter.mjs';

const response=(body,status=200)=>({ok:status>=200&&status<300,status,json:async()=>body});
function setup(fetchImpl){const rows=new Map();const outbox={get:async id=>rows.get(id)??null,save:async(id,value)=>rows.set(id,structuredClone(value))};return {adapter:createMaxApiAdapter({accessToken:'test-token',fetchImpl,outbox,clock:()=> '2026-10-06T12:00:00.000Z',sleep:async()=>{}}),rows};}
const auth=hash=>({status:'APPROVED',payload_hash:hash,channels:['channel-1'],valid_from:'2026-10-06T00:00:00.000Z',expires_at:'2026-10-07T00:00:00.000Z',allowed_changes:[]});

test('MAX community capability distinguishes publish/read/stats permissions',async()=>{
 const calls=[];const {adapter}=setup(async(url,options)=>{calls.push({url,options});if(url.endsWith('/chats/channel-1'))return response({chat_id:'channel-1',type:'channel',title:'DOKRUTI',is_public:true});if(url.endsWith('/members/me'))return response({status:'active',is_admin:true,permissions:['write','read_all_messages','view_stats']});throw new Error(url)});
 const r=await adapter.inspectChannel('channel-1');assert.equal(r.destination.type,'channel');assert.deepEqual(r.capabilities,{publish:'PASS',read:'PASS',stats:'PASS'});assert.ok(calls.every(c=>c.options.headers.Authorization==='test-token'));
});

test('MAX text publish requires scoped approval, durable outbox and public readback; retries are idempotent',async()=>{
 let sends=0;const {adapter,rows}=setup(async(url,options)=>{if(url.endsWith('/chats/channel-1'))return response({chat_id:'channel-1',type:'channel'});if(url.endsWith('/members/me'))return response({is_admin:true,permissions:['write']});if(options.method==='POST'){sends++;return response({message:{body:{mid:'m-1'}}})}if(url.includes('/messages?message_ids=m-1'))return response({messages:[{body:{mid:'m-1',text:'Approved text'},url:'https://max.ru/channel/post',timestamp:1791288000000,stat:{views:8,forwards:2}}]});throw new Error(url)});
 const args={outputId:'out-1',chatId:'channel-1',text:'Approved text',media:[],idempotencyKey:'idem-1'};const authorization=auth(maxPayloadHash(args));
 const receipt=await adapter.publish({...args,authorization});assert.deepEqual(receipt,{message_id:'m-1',url:'https://max.ru/channel/post',published_at:new Date(1791288000000).toISOString(),readback:true});
 assert.equal((await adapter.publish({...args,authorization})).message_id,'m-1');assert.equal(sends,1);assert.equal((await rows.get('idem-1')).status,'PUBLISHED');
});

test('MAX refuses unapproved/altered output and never blindly retries ambiguous send',async()=>{
 let sends=0;const {adapter,rows}=setup(async(url,options)=>{if(url.endsWith('/chats/channel-1'))return response({chat_id:'channel-1',type:'channel'});if(url.endsWith('/members/me'))return response({is_admin:true,permissions:['write']});if(options.method==='POST'){sends++;throw new Error('timeout')}throw new Error('readback unavailable')});
 const args={outputId:'out-1',chatId:'channel-1',text:'One approved text',media:[],idempotencyKey:'idem-ambiguous'};const authorization=auth(maxPayloadHash(args));
 await assert.rejects(adapter.publish({...args,authorization:{...authorization,payload_hash:'wrong'}}),/hash mismatch/);
 assert.equal((await adapter.publish({...args,authorization})).status,'UNKNOWN');
 assert.deepEqual(await adapter.publish({...args,authorization}),{status:'UNKNOWN',idempotency_key:'idem-ambiguous',reconciliation:'REQUIRED',retry_allowed:false});assert.equal(sends,1);assert.equal((await rows.get('idem-ambiguous')).status,'UNKNOWN');
});

test('MAX analytics preserves unavailable metrics as UNKNOWN rather than zero',async()=>{
 const {adapter}=setup(async()=>response({messages:[{body:{mid:'m-2'},url:'https://max.ru/p/2',timestamp:1791288000000}]}));
 const stats=await adapter.readAnalytics('m-2');assert.deepEqual(stats.views,{value:null,quality:'UNKNOWN'});assert.deepEqual(stats.reposts,{value:null,quality:'UNKNOWN'});
 const row=toMaxAnalyticsRow({materialId:'CNT-1',publicationId:'MAX-P1',receipt:{url:'https://max.ru/p/2'},analytics:stats});assert.equal(row['ID материала'],'CNT-1');assert.equal(row['Площадка'],'MAX');assert.equal(row['Просмотры / открытия'],'UNKNOWN');assert.equal(row['Data status'],'NO_DATA');
 const writeback=toMaxContentSystemWriteback({output:{'ID выхода':'OUT-1','ID материала':'CNT-1'},publicationId:'MAX-P1',receipt:{url:'https://max.ru/p/2',published_at:'2026-10-06T12:00:00.000Z'},analytics:stats,channelId:'channel-1'});assert.equal(writeback.output_patch['ID публикации платформы'],'MAX-P1');assert.equal(writeback.output_patch['URL публикации'],'https://max.ru/p/2');assert.equal(writeback.analytics_row['ID публикации'],'MAX-P1');
});
