import test from 'node:test';
import assert from 'node:assert/strict';
import {createVideoProductionPlan,verifyVideoExport} from '../runtime/video-production-pipeline.mjs';

const base={videoJobId:'video-1',masterId:'master-1',topic:'Сократить повторные вопросы команды',angle:'Одно правило границ решений снимает типовой вопрос',script:{hook:'Сотрудники весь день спрашивают, что делать?',setup:'Часто им не хватает понятной границы самостоятельности.',payoff:'Определите один повторяющийся вопрос и задайте порог решения.',cta:'Выберите один вопрос для первого правила.'},platforms:['telegram','max']};

test('video plan builds topic-to-publication workflow and avoids invented owner footage',()=>{
 const plan=createVideoProductionPlan(base);assert.equal(plan.topic,base.topic);assert.equal(plan.angle,base.angle);assert.equal(plan.format.platforms.length,2);assert.equal(plan.shot_card.length,4);assert.equal(plan.owner_footage.required,false);assert.equal(plan.owner_footage.shot_list.length,0);assert.equal(plan.production_route,'AUTOMATED_EDIT_EXPORT');assert.equal(plan.publication_package.status,'DRAFT');assert.equal(plan.qa.status,'PENDING');
});

test('owner footage is requested only when format/story requires it and returns an actionable shot list',()=>{
 const plan=createVideoProductionPlan({...base,format:{talkingHead:true},ownerFootageAvailable:false});assert.equal(plan.owner_footage.required,true);assert.equal(plan.production_route,'WAIT_FOR_REQUIRED_OWNER_FOOTAGE');assert.ok(plan.owner_footage.shot_list.length>0);assert.ok(plan.owner_footage.shot_list.every(shot=>shot.privacy));
});

test('video preflight rejects missing beats and uninspected exports',()=>{
 assert.throws(()=>createVideoProductionPlan({...base,script:{hook:'Only hook'}}),/Script beat is required/);
 assert.throws(()=>verifyVideoExport({sha256:'a'.repeat(64),decodePassed:true}),/Full-play visual QA/);
 assert.throws(()=>verifyVideoExport({sha256:'broken',decodePassed:true,fullPlayReviewRef:'review:1'}),/SHA-256/);
 assert.deepEqual(verifyVideoExport({sha256:'A'.repeat(64),decodePassed:true,fullPlayReviewRef:'review:1',platformInspectionRef:'platform:1'}),{sha256:'a'.repeat(64),verified:true,full_play_review_ref:'review:1',platform_inspection_ref:'platform:1'});
});
