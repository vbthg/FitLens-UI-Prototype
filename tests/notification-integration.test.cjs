const assert=require('node:assert/strict'),N=require('../notification-integration.js'),P=require('../notification-preview.js');
(async()=>{
 assert.equal((await N.createService().enable()).status,'unavailable');
 for(const status of ['authorized','provisional','denied','not-determined','unavailable','error','skipped']){
  const result=await N.createService({demo:status}).enable();assert.equal(result.status,status);assert.equal(result.simulated,true);assert.equal(result.canOpenSettings,false);
 }
 let requests=0,reads=0,settings={authorizationStatus:'not-determined',alertSetting:'disabled',soundSetting:'disabled'},release;
 const gate=new Promise(resolve=>release=resolve);
 const adapter={isAvailable:async()=>true,getSettings:async()=>{reads++;return settings},requestAuthorization:async request=>{requests++;assert.deepEqual(request.options,['alert','sound']);await gate;settings={authorizationStatus:'authorized',alertSetting:'enabled',soundSetting:'disabled'};return true},openSettings:async()=>true};
 const service=N.createService({adapter}),a=service.enable(),b=service.enable();assert.equal(a,b);release();
 const allowed=await a;assert.equal(allowed.status,'authorized');assert.equal(requests,1);assert.equal(reads,2);
 await service.enable();assert.equal(requests,1,'already authorized is not prompted again');
 settings={authorizationStatus:'denied'};const denied=await service.enable();assert.equal(denied.status,'denied');assert.equal(requests,1);assert.equal(denied.canOpenSettings,true);assert.equal((await service.openSettings()).opened,true);
 settings={authorizationStatus:'provisional'};assert.equal((await service.enable()).status,'provisional');assert.equal(requests,1);
 settings={authorizationStatus:'not-determined'};
 let deniedReads=0,deniedRequests=0;
 const refused=await N.createService({adapter:{...adapter,requestAuthorization:async()=>{deniedRequests++;return false},getSettings:async()=>({authorizationStatus:++deniedReads===1?'not-determined':'denied'})}}).enable();assert.equal(refused.status,'denied');assert.equal(deniedRequests,1);assert.equal(deniedReads,2);
 const failed=await N.createService({adapter:{...adapter,getSettings:async()=>({authorizationStatus:'not-determined'}),requestAuthorization:async()=>{throw Error('request failed')}}}).enable();assert.equal(failed.status,'error');
 assert.equal((await N.createService({adapter:{...adapter,getSettings:async()=>({authorizationStatus:'surprise'})}}).enable()).status,'error');
 assert.equal((await N.createService({adapter:{...adapter,isAvailable:async()=>false}}).enable()).status,'unavailable');
 const sample=P.example('Ánh Nguyễn');assert.equal(sample.title,'A little time for yourself, Ánh Nguyễn?');assert.equal(sample.body,'Your scheduled workout begins at 6:30 PM.');assert.equal(sample.example,true);
 const workout={id:'session-123',status:'planned',date:'2026-11-01',time:'18:30',reminder:{enabled:true,before:15}};
 const request=P.buildWorkoutRequest(workout,{preferredName:'Ánh',timeZone:'Asia/Ho_Chi_Minh',now:new Date('2026-10-28T00:00:00Z')});
 assert.equal(request.identifier,'fitlens.workout.session-123');assert.equal(request.trigger.components.hour,18);assert.equal(request.trigger.components.minute,15);assert.equal(request.content.example,false);assert.equal(request.content.body,sample.body);assert.equal(request.content.workoutId,'session-123');
 assert.throws(()=>P.buildWorkoutRequest({...workout,reminder:{enabled:false}},{timeZone:'Asia/Ho_Chi_Minh'}));
 assert.throws(()=>P.buildWorkoutRequest({...workout,date:'2026-02-30'},{timeZone:'Asia/Ho_Chi_Minh'}));
 assert.throws(()=>P.buildWorkoutRequest({...workout,example:true},{timeZone:'Asia/Ho_Chi_Minh'}));
 assert.throws(()=>P.buildWorkoutRequest(workout,{timeZone:'Asia/Ho_Chi_Minh',now:new Date('2027-01-01T00:00:00Z')}));
 assert.throws(()=>P.buildWorkoutRequest(workout,{timeZone:'Invalid/Zone'}));
 console.log('PASS notifications: unavailable, seven demo states, native settings before/after request, authorized/provisional/denied no redundant prompts, single-flight, errors, shared sample/real content, stable identifiers, opt-in/calendar validation; nothing scheduled.');
})().catch(error=>{console.error(error);process.exitCode=1});
