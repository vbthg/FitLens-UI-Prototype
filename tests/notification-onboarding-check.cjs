const {chromium}=require(process.env.FITLENS_PLAYWRIGHT_MODULE || 'playwright');
const assert=require('node:assert/strict'),fs=require('node:fs'),http=require('node:http'),path=require('node:path');
const out='private-review/onboarding-task03';fs.mkdirSync(out,{recursive:true});
(async()=>{
 const root=path.resolve(__dirname,'..'),server=http.createServer((req,res)=>{
  const file=path.resolve(root,'.'+decodeURIComponent(req.url.split('?')[0]));if(!file.startsWith(root+path.sep)){res.writeHead(403).end();return;}
  fs.readFile(file,(error,data)=>{if(error){res.writeHead(404).end();return;}res.setHeader('Content-Type',({'.html':'text/html; charset=utf-8','.js':'text/javascript','.css':'text/css','.ttf':'font/ttf','.svg':'image/svg+xml'})[path.extname(file)]||'application/octet-stream');res.end(data)});
 });
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 const base=process.env.FITLENS_TEST_FILE==='1'?require('node:url').pathToFileURL(path.resolve(__dirname,'..')).href.replace(/\/$/,''):'http://127.0.0.1:'+server.address().port;
 const browser=await chromium.launch({channel:'chrome',headless:true,args:['--no-proxy-server']});
 const errors=[],report=[];
 const state=(page,value)=>page.waitForFunction(value=>document.querySelector('.onboarding').dataset.state===value,value);
 let recorder=null;
 async function enter(page,{query='',name='Ánh',motion=false}={}){
  await page.emulateMedia({reducedMotion:'reduce'});await page.goto(base+'/welcome.html'+(query?query+'&replay=1':'?replay=1'));await page.evaluate(()=>document.fonts.ready);
  await page.locator('#get-started').click();await page.locator('#preferred-name').fill(name);await page.locator('#preferred-name').press('Enter');
  await state(page,'name-greeting');await page.locator('#continue-onboarding').click();await state(page,'health-intro');
  await page.locator('#skip-health').click();await state(page,'health-response');
  if(motion)await page.emulateMedia({reducedMotion:'no-preference'});
  if(recorder)await recorder(page);
  await page.locator('#continue-health').click();await state(page,'notifications-intro');
  await page.waitForTimeout(motion?850:30);
 }
 try{
  for(const size of [{width:320,height:568},{width:375,height:667},{width:390,height:844},{width:430,height:932},{width:1024,height:1000}]){
   const context=await browser.newContext({viewport:size}),page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));
   const name=size.width===320?'An':size.width===375?'Alex':size.width===390?'Nguyễn Hoàng Minh Anh':size.width===430?'WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW':'Ánh';
   let screencast;
   const frames=[];
   if(size.width===390){
    recorder=async page=>{
     fs.mkdirSync(out+'/motion-frames',{recursive:true});
     screencast=await context.newCDPSession(page);
     screencast.on('Page.screencastFrame',frame=>{
      const file='motion-frames/'+String(frames.length).padStart(4,'0')+'.jpg';
      fs.writeFileSync(out+'/'+file,Buffer.from(frame.data,'base64'));frames.push({file,time:frame.metadata.timestamp});
      screencast.send('Page.screencastFrameAck',{sessionId:frame.sessionId}).catch(()=>{});
     });
     await screencast.send('Page.startScreencast',{format:'jpeg',quality:90,maxWidth:390,maxHeight:844,everyNthFrame:2});
    };
   }
   await enter(page,{name,motion:true});recorder=null;
   assert.equal(await page.locator('.notification-card').count(),1);
   assert.equal(await page.locator('.notification-card-title').textContent(),'A little time for yourself, '+name+'?');
   assert.equal(await page.locator('.notification-card-body').textContent(),'Your scheduled workout begins at 6:30 PM.');
   assert.match(await page.locator('figcaption').textContent(),/EXAMPLE NOTIFICATION/);
   assert.equal(await page.locator('.notification-card button').count(),0);
   const geometry=await page.evaluate(()=>{
    const rect=selector=>document.querySelector(selector).getBoundingClientRect().toJSON();
    return {root:rect('.onboarding'),heading:rect('.notifications-heading'),face:rect('#welcome-face'),enable:rect('#enable-notifications'),skip:rect('#skip-notifications'),card:rect('.notification-card'),stage:rect('.notification-preview-stage'),stageBackground:getComputedStyle(document.querySelector('.notification-preview-stage')).backgroundColor,overflow:document.documentElement.scrollWidth>innerWidth,cardOverflow:document.querySelector('.notification-card').scrollWidth>document.querySelector('.notification-card').clientWidth,backdrop:getComputedStyle(document.querySelector('.notification-card')).backdropFilter};
   });
   assert.equal(geometry.stageBackground,'rgba(0, 0, 0, 0)','ambient stage has no solid panel');
   assert.ok(Math.abs(geometry.stage.width-geometry.root.width)<1,'ambient area remains full phone width');
   assert.ok(Math.abs(geometry.card.left-geometry.root.left-16)<1,'one 16px card gutter');
   assert.equal(geometry.overflow,false);assert.equal(geometry.cardOverflow,false);
   assert.ok(geometry.skip.bottom<=geometry.root.bottom);
   assert.ok(geometry.heading.top>=geometry.face.bottom-2,JSON.stringify(geometry));
   await page.screenshot({path:out+'/intro-'+size.width+'.png'});
   await page.locator('.notification-card').scrollIntoViewIfNeeded();await page.screenshot({path:out+'/card-'+size.width+'.png'});
   const before=await page.evaluate(()=>localStorage.getItem('fitlens:profile:v1'));
   if(size.width===390){
    await page.locator('#enable-notifications').click();await state(page,'notifications-response');await page.waitForTimeout(700);
    assert.equal(await page.locator('.onboarding').getAttribute('data-notification-outcome'),'unavailable');
    await page.locator('#onboarding-back').click();await state(page,'notifications-intro');await page.waitForTimeout(450);
   }
   await page.locator('#skip-notifications').click();await state(page,'notifications-response');await page.waitForTimeout(700);
   assert.equal(await page.locator('#notification-response-title').textContent(),'No worries, '+name+'!');
   assert.equal(await page.locator('#retry-notifications').isVisible(),false);
   assert.equal(await page.locator('#notification-settings').isVisible(),false);
   await page.screenshot({path:out+'/skipped-'+size.width+'.png'});
   if(screencast){await page.waitForTimeout(450);await screencast.send('Page.stopScreencast');fs.writeFileSync(out+'/motion-frames.json',JSON.stringify(frames));await screencast.detach();}
   assert.equal(await page.evaluate(()=>localStorage.getItem('fitlens:profile:v1')),before);
   assert.deepEqual(await page.evaluate(()=>Object.keys(localStorage)),['fitlens:profile:v1']);
   await page.locator('#onboarding-back').click();await state(page,'notifications-intro');
   await page.locator('#onboarding-back').click();await state(page,'health-response');
   assert.equal(await page.locator('.name-flight').count(),0);
   await page.locator('#continue-health').click();await state(page,'notifications-intro');await page.locator('#skip-notifications').click();await state(page,'notifications-response');await page.locator('#continue-notifications').click();await page.waitForURL('**/home.html');assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('fitlens:profile:v1')).onboarding),true);
   report.push({size,geometry});await context.close();
  }
  const page=await browser.newPage({viewport:{width:390,height:844}});page.on('pageerror',e=>errors.push(e.message));
  await enter(page);await page.locator('#enable-notifications').click();await state(page,'notifications-response');
  assert.equal(await page.locator('.onboarding').getAttribute('data-notification-outcome'),'unavailable');
  assert.match(await page.locator('#notification-response-caption').textContent(),/aren't available in this preview/);
  await page.screenshot({path:out+'/unavailable.png'});
  for(const status of ['authorized','provisional','denied','not-determined','unavailable','error','skipped']){
   await enter(page,{query:'?notificationsDemo=1'});
   await page.locator('#notification-demo-scenario').selectOption(status);await page.locator('#enable-notifications').click();await state(page,'notifications-response');
   assert.equal(await page.locator('.onboarding').getAttribute('data-notification-outcome'),status);
   assert.equal(await page.locator('.notification-demo-badge').isVisible(),true);
   if(status==='provisional')assert.match(await page.locator('#notification-response-caption').textContent(),/quietly/);
   assert.equal(await page.locator('#retry-notifications').isVisible(),['error','not-determined'].includes(status));
   await page.evaluate(()=>scrollTo(0,0));await page.screenshot({path:out+'/demo-'+status+'.png'});
   await page.locator('#continue-notifications').click();await page.waitForURL('**/home.html');await page.waitForSelector('#home-profile-greeting');assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('fitlens:profile:v1')).onboarding),true);
  }
  const native=await browser.newPage({viewport:{width:390,height:844}});native.on('pageerror',e=>errors.push(e.message));
  await native.addInitScript(()=>{
   window.notificationCalls={requests:0,settings:0,schedules:0,opens:0};window.currentPermission='not-determined';
   window.FitLensNativeNotifications={isAvailable:async()=>true,getSettings:async()=>{notificationCalls.settings++;return {authorizationStatus:currentPermission,alertSetting:currentPermission==='authorized'?'enabled':'disabled',soundSetting:'disabled'}},requestAuthorization:async options=>{notificationCalls.requests++;if(JSON.stringify(options.options)!=='["alert","sound"]')throw Error('unexpected capabilities');await new Promise(resolve=>window.finishNotificationRequest=resolve);currentPermission='authorized';return true},openSettings:async()=>{notificationCalls.opens++;return true},scheduleLocalNotification:async()=>{notificationCalls.schedules++}};
   window.Notification={requestPermission:()=>{throw Error('Web notification permission must never be called')}};
  });
  await enter(native);
  await native.locator('#skip-notifications').click();await state(native,'notifications-response');
  assert.equal(await native.evaluate(()=>notificationCalls.requests),0);
  assert.equal(await native.evaluate(()=>notificationCalls.settings),0);
  assert.equal(await native.locator('#notification-response-title').textContent(),'No worries, Ánh!');
  await native.locator('#onboarding-back').click();await state(native,'notifications-intro');
  await native.locator('#enable-notifications').evaluate(button=>{button.click();button.click();button.click()});await state(native,'notifications-requesting');
  assert.equal(await native.evaluate(()=>notificationCalls.requests),1);
  await native.locator('#onboarding-back').click();await state(native,'health-response');await native.evaluate(()=>finishNotificationRequest());
  await native.waitForTimeout(100);assert.equal(await native.locator('.onboarding').getAttribute('data-state'),'health-response');
  await native.locator('#continue-health').click();await state(native,'notifications-intro');
  await native.locator('#enable-notifications').click();await state(native,'notifications-response');
  assert.equal(await native.locator('.onboarding').getAttribute('data-notification-outcome'),'authorized');
  assert.equal(await native.evaluate(()=>notificationCalls.requests),1);
  await native.locator('#onboarding-back').click();await state(native,'notifications-intro');
  await native.evaluate(()=>currentPermission='denied');await native.locator('#enable-notifications').click();await state(native,'notifications-response');
  assert.equal(await native.locator('#notification-settings').isVisible(),true);await native.locator('#notification-settings').click();
  assert.equal(await native.evaluate(()=>notificationCalls.opens),1);assert.equal(await native.evaluate(()=>notificationCalls.requests),1);assert.equal(await native.evaluate(()=>notificationCalls.schedules),0);
  await enter(page);await page.emulateMedia({contrast:'more'});
  assert.equal(await page.locator('.notification-card').evaluate(node=>getComputedStyle(node).backdropFilter),'none');
  await page.screenshot({path:out+'/opaque.png'});
  await page.emulateMedia({contrast:'no-preference'});await page.evaluate(()=>document.documentElement.dataset.reduceTransparency='true');
  assert.equal(await page.locator('.notification-card').evaluate(node=>getComputedStyle(node).backdropFilter),'none');
  await page.evaluate(()=>{delete document.documentElement.dataset.reduceTransparency;document.querySelector('.notification-preview-stage').style.setProperty('--notification-ambient-base','#24392f')});
  await page.screenshot({path:out+'/dark-background.png'});
  await page.addStyleTag({content:'.notifications-heading>p{font-size:22px}.notification-card-title{font-size:23px}.notification-card-body{font-size:21px}'});
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
  await page.locator('#skip-notifications').click();await state(page,'notifications-response');
  assert.deepEqual(errors,[]);
  fs.writeFileSync(out+'/results.json',JSON.stringify({pass:true,report,errors},null,2));
  console.log('PASS Task 03: five viewports/long names, one shared-model card, honest browser result, seven labelled demo states, native settings/request/single-flight/Back/denied recovery, zero scheduling, reduced motion/transparency, contrast/dark background and larger text.');
 }finally{await browser.close();server.close();}
})().catch(error=>{console.error(error);process.exitCode=1});
