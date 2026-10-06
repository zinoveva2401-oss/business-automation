import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';
import {routeRequest,createContentRun,addCheckpoint,transitionRun,failRun,blockRun,resumeRun,factDisposition,assertNativeAdaptation,authorizeOwnerBatch,matchesOwnerAuthorization} from '../runtime/content-factory-runtime.mjs';
import {createContentSystemStateStore} from '../runtime/content-system-state-store.mjs';
import {toTelegramPublisherInput,fromTelegramPublisherReceipt} from '../runtime/telegram-contract-adapter.mjs';
import {validFixtures,invalidFixtures,telegramIntegrationContract} from './fixtures/contracts.mjs';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const json=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const require=createRequire(import.meta.url);
const Ajv2020=require('ajv/dist/2020').default;
const NOW='2026-10-06T09:00:00.000Z';
const H='a'.repeat(64);

test('valid and invalid fixtures are validated against every Draft 2020-12 schema',()=>{
 const ajv=new Ajv2020({allErrors:true,strict:false,validateFormats:false});
 const names=fs.readdirSync(path.join(root,'schemas')).filter(x=>x.endsWith('.schema.json')).map(x=>x.replace('.schema.json','')).sort();
 assert.equal(names.length,8);
 for(const name of names){
  const schema=json(path.join(root,'schemas',`${name}.schema.json`));
  assert.equal(schema.$schema,'https://json-schema.org/draft/2020-12/schema');
  const validate=ajv.compile(schema);
  const valid=validFixtures[name];
  const invalid=invalidFixtures[name];
  assert.equal(validate(valid),true,`${name} valid fixture: ${ajv.errorsText(validate.errors)}`);
  assert.equal(validate(invalid),false,`${name} invalid fixture unexpectedly passed`);
  if(name==='content-run')assert.equal(validate(createContentRun({runId:'runtime-run',requestFingerprint:'fp',now:NOW})),true,`runtime ContentRun: ${ajv.errorsText(validate.errors)}`);
 }
});

test('ordinary demand routes through marketing, strategy, editor, adaptation and QA',()=>{
 const r=routeRequest({intent:'Повторяющиеся вопросы клиентов: подготовить пост',channels:['telegram']});
 for(const lane of ['marketing','strategy','research','human_editor','channel_adaptation','publishing','qa'])assert.ok(r.lanes.includes(lane),lane);
 assert.ok(!r.lanes.includes('affiliate'));assert.equal(r.owner_gate_required,false);
});
test('trend/video/art/SEO/affiliate requests include only the corresponding production lanes',()=>{
 const trend=routeRequest({trend:true});assert.ok(trend.lanes.includes('trend'));
 const video=routeRequest({video:true});assert.ok(video.lanes.includes('hooks_story')&&video.lanes.includes('video'));
 const art=routeRequest({art:true});assert.ok(art.lanes.includes('art'));
 const seo=routeRequest({seo:true});assert.ok(seo.lanes.includes('seo_aeo'));
 const affiliate=routeRequest({affiliate:true});for(const lane of ['research','affiliate','legal_ip','qa'])assert.ok(affiliate.lanes.includes(lane));
});
test('source freshness fails closed for unknown, stale and contradicted evidence',()=>{
 assert.equal(factDisposition({status:'SUPPORTED',sourceRef:'official',checkedAt:NOW,now:new Date(NOW),maxAgeMs:1000}).usable,true);
 assert.equal(factDisposition({status:'UNKNOWN',sourceRef:'x',checkedAt:NOW,maxAgeMs:999999}).disposition,'UNKNOWN');
 assert.equal(factDisposition({status:'SUPPORTED',sourceRef:'x',checkedAt:'2020-01-01T00:00:00Z',now:new Date(NOW),maxAgeMs:1000}).disposition,'STALE');
 assert.equal(factDisposition({status:'CONTRADICTED',sourceRef:'x',checkedAt:NOW,maxAgeMs:999999}).usable,false);
});
test('checkpoint must match current run stage and resume ignores malformed or unproven records',()=>{
 const run=createContentRun({runId:'r1',requestFingerprint:'fp',now:NOW});
 assert.throws(()=>addCheckpoint(run,{checkpointId:'wrong-stage',stage:'source_restore',evidenceRefs:['source']}),/current proven run.stage/);
 let current=addCheckpoint(run,{checkpointId:'cp-intake',stage:'intake',evidenceRefs:['intake'],nextStage:'source_restore'});
 current=transitionRun(current,'source_restore',{now:NOW});
 current=addCheckpoint(current,{checkpointId:'cp-source',evidenceRefs:['source readback'],inputHash:H,outputHash:H,nextStage:'strategy'});
 current=transitionRun(current,'strategy',{now:NOW});
 current={...current,checkpoints:[...current.checkpoints,{checkpoint_id:'bad-latest',stage:'bogus',evidence_refs:['x'],proven:true}, {...current.checkpoints[1],checkpoint_id:'unproven-latest',proven:false}]};
 const recovered=resumeRun(failRun(current,'transient'),{now:NOW});
 assert.equal(recovered.stage,'strategy');assert.equal(recovered.status,'RUNNING');
 const noProof=blockRun({...run,checkpoints:[{checkpoint_id:'bad',stage:'intake',evidence_refs:[],proven:true}]},'recovery');
 assert.throws(()=>resumeRun(noProof),/No valid proven checkpoint/);
});
test('scope-aware owner batch authorization permits exact assets over its validity window only',()=>{
 const run=createContentRun({runId:'r1',requestFingerprint:'fp',now:NOW,request:{channels:['vk-community','vk-personal'],objective:'TRUST'}});
 const batch=authorizeOwnerBatch(run,{authorization_id:'auth1',batch_id:'week1',approved_payload_hashes:[H,'b'.repeat(64)],channels:['vk-community'],valid_from:NOW,valid_until:'2026-10-13T09:00:00.000Z',expires_at:'2026-10-13T10:00:00.000Z',allowed_changes:['typo_fix'],evidence_ref:'owner-record'}, {now:NOW});
 assert.equal(matchesOwnerAuthorization(batch,{payloadHash:H,channel:'vk-community',scheduledAt:'2026-10-08T08:00:00.000Z',now:'2026-10-08T07:00:00.000Z',changeTypes:['typo_fix']}),true);
 assert.equal(matchesOwnerAuthorization(batch,{payloadHash:'b'.repeat(64),channel:'vk-community',scheduledAt:'2026-10-09T08:00:00.000Z',now:'2026-10-09T07:00:00.000Z'}),true);
 assert.equal(matchesOwnerAuthorization(batch,{payloadHash:'c'.repeat(64),channel:'vk-community',scheduledAt:'2026-10-08T08:00:00.000Z',now:'2026-10-08T07:00:00.000Z'}),false);
 assert.equal(matchesOwnerAuthorization(batch,{payloadHash:H,channel:'vk-personal',scheduledAt:'2026-10-08T08:00:00.000Z',now:'2026-10-08T07:00:00.000Z'}),false);
 assert.equal(matchesOwnerAuthorization(batch,{payloadHash:H,channel:'vk-community',scheduledAt:'2026-10-14T08:00:00.000Z',now:'2026-10-14T07:00:00.000Z'}),false);
 assert.equal(matchesOwnerAuthorization(batch,{payloadHash:H,channel:'vk-community',scheduledAt:'2026-10-08T08:00:00.000Z',now:'2026-10-08T07:00:00.000Z',changeTypes:['rewrite']}),false);
 assert.equal(matchesOwnerAuthorization(batch,{payloadHash:H,channel:'vk-community',scheduledAt:'2026-10-08T08:00:00.000Z',now:'2026-10-05T07:00:00.000Z'}),false);
});
test('native adaptation binds exact master revision and is channel-specific',()=>{
 const master={master_id:'m1',revision:2,body:'source master'};
 assert.equal(assertNativeAdaptation({master,channel:'telegram',adaptation:{parent_master_id:'m1',parent_revision:2,format:'post',opening:'Hook',cta:'Reply',body:'Native version'}}),true);
 assert.throws(()=>assertNativeAdaptation({master,channel:'telegram',adaptation:{parent_master_id:'m1',parent_revision:1,format:'post',opening:'Hook',cta:'Reply',body:'Native version'}}),/exact master revision/);
});
test('Content System state store survives adapter recreation and reconciles concurrent writes',async()=>{
 const rows=new Map([['out-1',{output_id:'out-1',note:'owner note'}]]);
 const adapter=()=>createContentSystemStateStore({readOutputRecord:async id=>rows.get(id),writeOutputNote:async(id,note,{expectedNoteHash})=>{const row=rows.get(id);const current=await import('node:crypto').then(({createHash})=>createHash('sha256').update(row.note).digest('hex'));if(current!==expectedNoteHash)return {conflict:true};rows.set(id,{...row,note});return {ok:true};}});
 const store1=adapter();let run=createContentRun({runId:'persisted-run',requestFingerprint:'fp',now:NOW});
 run=addCheckpoint(run,{checkpointId:'persistent-cp',evidenceRefs:['source-row-readback']});
 const first=await store1.save('out-1',{output_id:'out-1',run});assert.equal(first.storage_revision,1);
 assert.match(rows.get('out-1').note,/owner note/);
 const storeAfterRestart=adapter();const restored=await storeAfterRestart.load('out-1');assert.equal(restored.run.run_id,'persisted-run');assert.equal(restored.run.checkpoints[0].checkpoint_id,'persistent-cp');
 await assert.rejects(()=>storeAfterRestart.save('out-1',{output_id:'out-1',storage_revision:0,run}),/Stale state revision/);
});
test('Telegram adapter matches actual output and analytics field contract without touching Publisher',()=>{
 const contract=telegramIntegrationContract;
 const outputFields=new Set(contract.output_fields);const analyticsFields=new Set(contract.analytics_fields);
 for(const f of ['ID выхода','ID материала','Площадка','Формат','Готовый текст / ТЗ','CTA','Визуал','Статус','Плановое время публикации','Фактическое время публикации','ID публикации платформы','URL публикации','TG route','TG media manifest','TG interaction payload','TG publish options'])assert.ok(outputFields.has(f),f);
 for(const f of ['ID материала','ID публикации','Площадка','URL','Статус данных','Telegram message_id'])assert.ok(analyticsFields.has(f),f);
 const input=toTelegramPublisherInput(contract.sample_output);assert.equal(input.output_id,'out-tg-1');assert.equal(input.route.destination,'channel');
 assert.throws(()=>toTelegramPublisherInput({...contract.sample_output,Статус:'Черновик'}),/approved scheduled output/);
 const mapped=fromTelegramPublisherReceipt(contract.sample_receipt,{materialId:contract.sample_output['ID материала']});
 assert.deepEqual(mapped.output_patch,{'Статус':'Опубликовано','ID публикации платформы':'12345','URL публикации':contract.sample_receipt.url,'Фактическое время публикации':NOW});
 for(const field of Object.keys(mapped.analytics_seed))assert.ok(analyticsFields.has(field),field);
 assert.equal(mapped.analytics_seed['Статус данных'],'PENDING_READBACK');
 assert.equal(contract.publisher_mutation,'PROHIBITED');
});

test('representative end-to-end Content Factory run persists and resumes across adapter instances',async()=>{
 const rows=new Map([['output-e2e',{output_id:'output-e2e',note:''}]]);
 const makeStore=()=>createContentSystemStateStore({readOutputRecord:async id=>rows.get(id),writeOutputNote:async(id,note,{expectedNoteHash})=>{const {createHash}=await import('node:crypto');if(createHash('sha256').update(rows.get(id).note).digest('hex')!==expectedNoteHash)return {conflict:true};rows.set(id,{output_id:id,note});return {ok:true};}});
 const request={intent:'Повторяющиеся вопросы владельцев малого бизнеса о ведении канала',channels:['vk-community'],objective:'TRUST',portfolioId:'DOKRUTI',brandId:'DOKRUTI',audienceId:'SMB_FOUNDERS',sourceSetId:'LIVE_DEMAND'};
 const route=routeRequest(request);assert.ok(route.lanes.includes('research'));
 let run=createContentRun({runId:'e2e-1',requestFingerprint:H,request,now:NOW});
 const store=makeStore();
 const master={master_id:'master-1',revision:1,body:'A useful long-form master with one thesis and evidence.'};
 const adaptation={parent_master_id:master.master_id,parent_revision:1,format:'VK community post',opening:'A direct audience hook',cta:'Share your experience',body:'A native concise post with a distinct channel opening.'};
 assert.equal(assertNativeAdaptation({master,adaptation,channel:'vk-community'}),true);
 const authorization={authorization_id:'owner-auth-1',batch_id:'batch-week',approved_payload_hashes:[H],channels:['vk-community'],valid_from:NOW,valid_until:'2026-10-13T09:00:00.000Z',expires_at:'2026-10-13T10:00:00.000Z',allowed_changes:['typo_fix'],evidence_ref:'owner-approval-readback'};
 run=authorizeOwnerBatch(run,authorization,{now:NOW});
 for(const stage of ['intake','source_restore','strategy','research','master','editorial','adaptation','qa']){
  if(run.stage!==stage)run=transitionRun(run,stage,{now:NOW});
  run=addCheckpoint(run,{checkpointId:`cp-${stage}`,evidenceRefs:[`verified:${stage}`],nextStage:stage==='qa'?'approval':undefined});
 }
 const persistedQA=await store.save('output-e2e',{output_id:'output-e2e',run});
 const afterQARestart=makeStore();const savedQA=await afterQARestart.load('output-e2e');
 run=resumeRun(failRun(savedQA.run,'simulated restart after QA'),{now:'2026-10-07T06:00:00.000Z'});
 assert.equal(run.stage,'approval');
 assert.equal(matchesOwnerAuthorization(run,{payloadHash:H,channel:'vk-community',scheduledAt:'2026-10-07T08:00:00.000Z',now:'2026-10-07T07:00:00.000Z'}),true);
 run=transitionRun(run,'publication',{now:'2026-10-07T07:00:00.000Z',payloadHash:H,channel:'vk-community',scheduledAt:'2026-10-07T08:00:00.000Z',idempotencyKey:'pub-e2e'});
 const publication={publication_id:'pub-e2e',method:'API',account:'vk-community-owner-approved',destination:'vk-community',scheduled_at:'2026-10-07T08:00:00.000Z',timezone:'Europe/Moscow',attempts:[],error:null,reconciliation:{status:'PENDING'}};
 assert.equal(publication.reconciliation.status,'PENDING');
 run=addCheckpoint(run,{checkpointId:'cp-publication',evidenceRefs:['publication-record','platform-reconciliation'],nextStage:'analytics'});
 run=transitionRun(run,'analytics',{now:NOW});
 const learning={decision:'INSUFFICIENT_DATA',confidence:0.2,basis:['No verified platform metrics yet'],value:null};assert.equal(learning.value,null);
 run=addCheckpoint(run,{checkpointId:'cp-analytics',evidenceRefs:['analytics-readback-or-unknown'],nextStage:'complete'});
 await store.save('output-e2e',{output_id:'output-e2e',storage_revision:persistedQA.storage_revision,run,artifacts:{publications:[publication],metric_learnings:[learning]}});
 const afterRestart=makeStore();const saved=await afterRestart.load('output-e2e');assert.equal(saved.run.stage,'analytics');assert.equal(saved.artifacts.publications[0].publication_id,'pub-e2e');assert.equal(saved.artifacts.metric_learnings[0].decision,'INSUFFICIENT_DATA');
 const resumed=resumeRun(failRun(saved.run,'simulated process restart'),{now:'2026-10-07T09:00:00.000Z'});assert.equal(resumed.stage,'complete');
});

test('front door routes expert depth to Business OS without copying it into execution contracts',()=>{
 const map=fs.readFileSync(path.join(root,'references/business-os-routing.md'),'utf8');
 const coreSkill=path.resolve(root,'..','ai-business-os');
 assert.ok(fs.existsSync(path.join(coreSkill,'SKILL.md')),'shared Business OS entrypoint must resolve in the inherited Core');
 assert.equal(fs.existsSync(path.join(root,'references','ai-business-os')),false,'Content Factory must not contain a copied Business OS');
 const routingTable=map.split('## Portfolio isolation')[0];
 const rows=routingTable.split(/\r?\n/).filter(line=>line.startsWith('|')&&!line.startsWith('| ---')&&!line.includes('Глубокий владелец'));
 const refs=new Set();
 for(const line of rows){const ownerCell=line.split('|')[2]??'';for(const match of ownerCell.matchAll(/`([^`]+\.md)`/g))refs.add(match[1]);}
 assert.ok(refs.size>0,'routing must declare shared owner modules');
 for(const ref of refs)assert.ok(fs.existsSync(path.join(coreSkill,'references',ref)),`unresolved shared Core reference ${ref}`);
 const skill=fs.readFileSync(path.join(root,'SKILL.md'),'utf8');assert.ok(skill.includes('business-os-routing.md'));assert.ok(skill.includes('demand-intake.md'));
 const metadata=fs.readFileSync(path.join(root,'agents/openai.yaml'),'utf8');assert.match(metadata,/default_prompt:/);assert.match(metadata,/durable Content System checkpoint writeback/);assert.match(metadata,/scope-aware batch owner authorization/);
});
