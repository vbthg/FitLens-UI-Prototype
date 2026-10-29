const assert=require('node:assert/strict'),H=require('../health-integration.js');
(async()=>{
 assert.equal((await H.createService().connect()).status,'unavailable');
 for(const status of ['readable','no-data','unavailable','error','skipped']){
  const service=H.createService({demo:status}),result=await service.connect();
  assert.equal(result.status,status);assert.equal(result.simulated,true);
 }
 const samples=H.normalizeData({steps:{value:0,unit:'count'},distanceKm:{value:1.2,unit:'km'},walkingMinutes:{value:30,unit:'min',source:'estimated-from-steps'},heartRate:{value:NaN,unit:'bpm'},activeCalories:{value:-1,unit:'kcal'}});
 assert.deepEqual(Object.keys(samples),['steps','distanceKm']);
 let requests=0,reads=0,release;
 const gate=new Promise(resolve=>release=resolve);
 const adapter={platform:'ios',isAvailable:async()=>true,requestReadAuthorization:async request=>{requests++;assert.deepEqual(request.writeTypes,[]);assert.deepEqual(request.readTypes,H.sources.ios.readTypes);await gate;},readAvailableData:async request=>{reads++;assert.equal(request.walkingTimeSource,'walking-workout');return {walkingMinutes:{value:32,unit:'min',source:'walking-workout'}};}};
 const service=H.createService({adapter}),first=service.connect(),second=service.connect();
 assert.equal(first,second);release();
 const result=await first;assert.equal(result.status,'readable');assert.equal(result.requestCompleted,true);assert.equal(requests,1);assert.equal(reads,1);assert.equal(result.data.heartRate,undefined);
 assert.equal((await H.createService({adapter:{...adapter,readAvailableData:async()=>({})}}).connect()).status,'no-data');
 const deniedUnknown=await H.createService({adapter:{...adapter,requestReadAuthorization:async()=>undefined,readAvailableData:async()=>({})}}).connect();
 assert.equal(deniedUnknown.status,'no-data');assert.equal('denied' in deniedUnknown,false);
 const failure=await H.createService({adapter:{...adapter,requestReadAuthorization:async()=>{throw Error('native failure')}}}).connect();
 assert.equal(failure.status,'error');assert.equal(failure.requestAttempted,true);assert.equal(failure.requestCompleted,false);
 assert.equal((await H.createService({adapter:{...adapter,requestReadAuthorization:async()=>false}}).connect()).status,'error');
 const readFailure=await H.createService({adapter:{...adapter,readAvailableData:async()=>{throw Error('query failed')}}}).connect();
 assert.equal(readFailure.status,'error');assert.equal(readFailure.requestCompleted,true);
 assert.equal((await H.createService({adapter:{...adapter,isAvailable:async()=>false}}).connect()).status,'unavailable');
 const android=H.createService({adapter:{...adapter,platform:'android'}});assert.equal(android.source.label,'Health Connect');
 assert.equal(service.skip().status,'skipped');
 console.log('PASS health boundary: unavailable, five demo outcomes, validated partial samples, no inferred walking duration/denial, read-only types, single request, native/request/read errors, platform labels.');
})().catch(error=>{console.error(error);process.exitCode=1});
