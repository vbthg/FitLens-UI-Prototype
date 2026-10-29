const {chromium}=require(process.env.FITLENS_PLAYWRIGHT_MODULE || 'playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const http=require('node:http'),path=require('node:path');
const out='private-review/onboarding-task01';
fs.mkdirSync(out,{recursive:true});
(async()=>{
 const server=http.createServer((request,response)=>{
  const file=path.resolve(__dirname,'..','.'+decodeURIComponent(request.url.split('?')[0]));
  if(!file.startsWith(path.resolve(__dirname,'..')+path.sep)){response.writeHead(403).end();return;}
  fs.readFile(file,(error,data)=>{if(error){response.writeHead(404).end();return;}const types={'.html':'text/html; charset=utf-8','.css':'text/css','.js':'text/javascript','.ttf':'font/ttf','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg'};response.setHeader('Content-Type',types[path.extname(file)]||'application/octet-stream');response.end(data);});
 });
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 const base=process.env.FITLENS_TEST_FILE==='1'?require('node:url').pathToFileURL(path.resolve(__dirname,'..')).href.replace(/\/$/,''):'http://127.0.0.1:'+server.address().port;
 const browser=await chromium.launch({channel:'chrome',headless:true,args:['--no-proxy-server']});
 const errors=[], results=[];
 try {
  for(const size of [{width:320,height:568},{width:390,height:844},{width:430,height:932},{width:667,height:375}]) {
   const context=await browser.newContext({viewport:size});
   const page=await context.newPage(); page.on('pageerror',e=>errors.push(e.message));
   await page.goto(base+'/welcome.html');
   await page.evaluate(()=>document.fonts.ready);
   await page.waitForTimeout(950);
   await page.screenshot({path:out+'/welcome-'+size.width+'.png'});
   await page.locator('#get-started').click();
   await page.locator('#preferred-name').fill('   ');
   assert.equal(await page.locator('.confirm-button').isDisabled(),true);
   const name=size.width===320?'Nguyễn Hoàng Minh Anh':size.width===667?'WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW':'Ánh Nguyễn';
   await page.locator('#preferred-name').fill(size.width===430?'  '+name+'  ':name);
   await page.waitForTimeout(450);
   const nameLayout=await page.evaluate(()=>{
    const input=document.querySelector('#preferred-name').getBoundingClientRect(),arrow=document.querySelector('.confirm-button').getBoundingClientRect();
    return {input:input.toJSON(),arrow:arrow.toJSON(),centerDifference:Math.abs(input.top+input.height/2-arrow.top-arrow.height/2),expression:document.querySelector('#welcome-face').dataset.expression};
   });
   assert.ok(nameLayout.centerDifference<1,'arrow and name share a vertical center');
   assert.equal(nameLayout.expression,'onboarding-neutral');
   await page.screenshot({path:out+'/name-'+size.width+'.png'});
   let screencast;
   const motionFrames=[];
   if(size.width===390) {
    fs.mkdirSync(out+'/motion-frames',{recursive:true});
    screencast=await context.newCDPSession(page);
    screencast.on('Page.screencastFrame',frame=>{
     const file='motion-frames/'+String(motionFrames.length).padStart(4,'0')+'.jpg';
     fs.writeFileSync(out+'/'+file,Buffer.from(frame.data,'base64'));
     motionFrames.push({file,time:frame.metadata.timestamp});
     screencast.send('Page.screencastFrameAck',{sessionId:frame.sessionId}).catch(()=>{});
    });
    await screencast.send('Page.startScreencast',{format:'jpeg',quality:90,maxWidth:390,maxHeight:844,everyNthFrame:1});
   }
   await page.evaluate(()=>{
    window.motionTrace=[];
    let started;
    function sample(){
     const overlay=document.querySelector('.name-flight');
     const prefix=document.querySelector('#greeting-prefix');
     window.motionTrace.push({time:performance.now()-started,state:document.querySelector('.onboarding').dataset.state,flight:!!overlay,prefix:Number(getComputedStyle(prefix).opacity),prefixAnimations:prefix.getAnimations().length,expression:document.querySelector('#welcome-face').dataset.expression});
     if(performance.now()-started<1500)requestAnimationFrame(sample);
    }
    document.querySelector('#name-form').addEventListener('submit',()=>{started=performance.now();requestAnimationFrame(sample)},{once:true,capture:true});
   });
   await page.locator('.confirm-button').click();
   await page.waitForFunction(()=>document.querySelector('.name-flight'));
   const first=await page.locator('.name-flight').boundingBox();
   await page.waitForTimeout(330);
   const middle=await page.locator('.name-flight').boundingBox();
   if(first&&middle) assert.ok(middle.y < first.y,'name travels upward');
   await page.screenshot({path:out+'/flight-'+size.width+'.png'});
   await page.waitForFunction(()=>document.querySelector('.onboarding').dataset.state==='name-greeting');
   assert.equal(await page.locator('#greeting-name').textContent(),name);
   assert.equal(await page.locator('.name-flight').count(),0);
   const saved=await page.evaluate(()=>JSON.parse(localStorage.getItem('fitlens:profile:v1')));
   assert.equal(saved.name,name); assert.equal(saved.onboarding,false);
   const geometry=await page.evaluate(()=>{
     const root=document.querySelector('.onboarding').getBoundingClientRect(),h=document.querySelector('#greeting-title').getBoundingClientRect(),button=document.querySelector('#continue-onboarding').getBoundingClientRect();
     return {overflow:document.documentElement.scrollWidth>innerWidth,scrollX,rootScroll:document.querySelector('.onboarding').scrollLeft,sceneScroll:document.querySelector('.onboarding-scenes').scrollLeft,root:root.toJSON(),heading:h.toJSON(),button:button.toJSON(),overlap:h.bottom>button.top};
   });
   assert.equal(geometry.overflow,false);assert.equal(geometry.overlap,false,JSON.stringify(geometry));
   assert.equal(geometry.rootScroll,0,'root must not scroll sideways: '+JSON.stringify(geometry));
   if(geometry.button.bottom>geometry.root.bottom) {
    await page.locator('#continue-onboarding').scrollIntoViewIfNeeded();
    const reachable=await page.locator('#continue-onboarding').boundingBox();
    assert.ok(reachable.y+reachable.height<=geometry.root.bottom);
   }
   await page.waitForTimeout(450);
   const trace=await page.evaluate(()=>window.motionTrace);
   const flying=trace.filter(sample=>sample.flight);
   assert.ok(flying.length>0);
   assert.ok(flying.at(-1).time-flying[0].time>=800,'noticeably slower flight');
   assert.ok(flying[0].time<200,'no keyboard stabilization pause');
   const prefixSamples=trace.filter(sample=>sample.time>=flying[0].time && sample.time<=flying.at(-1).time+300);
   for(let i=1;i<prefixSamples.length;i++) assert.ok(prefixSamples[i].prefix>=prefixSamples[i-1].prefix-.02,'prefix must never fade a second time');
   assert.ok(prefixSamples.every(sample=>sample.prefixAnimations<=1));
   assert.ok(flying.some(sample=>sample.expression==='onboarding-surprised'));
   assert.equal(await page.locator('#welcome-face').getAttribute('data-expression'),'content');
   await page.screenshot({path:out+'/greeting-'+size.width+'.png'});
   if(screencast) {await screencast.send('Page.stopScreencast');fs.writeFileSync(out+'/motion-frames.json',JSON.stringify(motionFrames));await screencast.detach();}
   await page.locator('#continue-onboarding').click();
   await page.waitForFunction(()=>document.querySelector('.onboarding').dataset.state==='health-intro');
   assert.ok(page.url().endsWith('welcome.html'));
   await page.locator('#onboarding-back').click();
   await page.waitForFunction(()=>document.querySelector('.onboarding').dataset.state==='name-greeting');
   await page.locator('#onboarding-back').click();
   await page.waitForFunction(()=>document.querySelector('.onboarding').dataset.state==='name-entry');
   assert.equal(await page.locator('#preferred-name').inputValue(),name);
   await page.locator('#preferred-name').fill('Đức Huy');
   await page.locator('#preferred-name').press('Enter');
   await page.waitForFunction(()=>document.querySelector('.onboarding').dataset.state==='name-greeting');
   await page.locator('#onboarding-back').click();
   await page.waitForFunction(()=>document.querySelector('.onboarding').dataset.state==='name-entry');
   assert.equal(await page.locator('#skip-name').count(),0);
   await page.locator('#preferred-name').fill('   ');
   await page.locator('#preferred-name').press('Enter');
   assert.equal(await page.locator('.onboarding').getAttribute('data-state'),'name-entry');
   results.push({size,name,geometry,nameLayout,flightMs:flying.at(-1).time-flying[0].time});
   await context.close();
  }
  const page=await browser.newPage({viewport:{width:390,height:844}});
  page.on('pageerror',e=>errors.push(e.message));
  await page.goto(base+'/welcome.html');
  await page.locator('#get-started').click();
  await page.locator('#preferred-name').fill('Alex');
  await page.locator('.confirm-button').evaluate(button=>{button.click();button.click();button.click()});
  await page.waitForFunction(()=>document.querySelector('.name-flight'));
  await page.locator('#onboarding-back').click();
  assert.equal(await page.locator('.onboarding').getAttribute('data-state'),'name-entry');
  assert.equal(await page.locator('.name-flight').count(),0);
  await page.waitForTimeout(1300);
  assert.equal(await page.locator('.onboarding').getAttribute('data-state'),'name-entry');
  await page.locator('#preferred-name').focus();
  await page.setViewportSize({width:390,height:420});
  await page.waitForFunction(()=>Math.abs(document.querySelector('.onboarding').getBoundingClientRect().height-404)<1);
  const controls=await page.locator('.name-controls').boundingBox();
  assert.ok(controls.y+controls.height<=420);
  await page.locator('.confirm-button').click();
  await page.waitForFunction(()=>document.querySelector('.name-flight')?.getAnimations().length);
  await page.evaluate(()=>window.keyboardFlight=document.querySelector('.name-flight').getAnimations()[0]);
  for(const height of [438,442,578,582,680,844]) {
   await page.setViewportSize({width:390,height});
   await page.evaluate(()=>{visualViewport.dispatchEvent(new Event('resize'));visualViewport.dispatchEvent(new Event('scroll'))});
   assert.equal(await page.evaluate(()=>keyboardFlight.playState),'running','keyboard events must not cancel or finish the flight');
  }
  await page.waitForFunction(()=>document.querySelector('.onboarding').dataset.state==='name-greeting');
  await page.locator('#onboarding-back').click();
  await page.waitForFunction(()=>document.querySelector('.onboarding').dataset.state==='name-entry');
  await page.locator('#preferred-name').fill('Nguyễn An');
  await page.locator('.confirm-button').click();
  await page.waitForFunction(()=>document.querySelector('.name-flight')?.getAnimations().length);
  await page.setViewportSize({width:667,height:375});
  await page.waitForFunction(()=>document.querySelector('.onboarding').dataset.state==='name-greeting');
  assert.equal(await page.locator('#greeting-name').textContent(),'Nguyễn An');
  await page.setViewportSize({width:390,height:844});
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.goto(base+'/welcome.html');
  await page.locator('#get-started').click();await page.locator('#preferred-name').fill('Trần');
  await page.locator('#preferred-name').press('Enter');
  await page.waitForFunction(()=>document.querySelector('.onboarding').dataset.state==='name-greeting');
  assert.equal(await page.locator('.name-flight').count(),0);
  await page.goto(base+'/profile.html');
  assert.equal(await page.locator('a[href="profile-setup.html"]').count(),1);
  await page.locator('a[href="profile-setup.html"]').click();
  assert.equal(await page.locator('#setup-title').textContent(),'Make it yours.');
  await page.locator('#setup-next').click();
  assert.equal(await page.locator('#setup-title').textContent(),'Your kind of training.');
  await page.goto(base+'/home.html');
  assert.ok(page.url().endsWith('home.html'));
  assert.match(await page.locator('#home-profile-greeting').textContent(),/Trần/);
  // Saving a name must merge with the existing profile, including completed users.
  await page.evaluate(()=>localStorage.setItem('fitlens:profile:v1',JSON.stringify({...FitLensProfile.empty(),name:'Before',onboarding:true,training:{goal:'strength',experience:'regular',frequency:4,duration:45},space:{place:'gym',equipment:['mat']}})));
  await page.goto(base+'/welcome.html?replay=1');await page.locator('#get-started').click();
  await page.locator('#preferred-name').fill('Sau');await page.locator('#preferred-name').press('Enter');
  await page.waitForFunction(()=>document.querySelector('.onboarding').dataset.state==='name-greeting');
  const preserved=await page.evaluate(()=>JSON.parse(localStorage.getItem('fitlens:profile:v1')));
  assert.equal(preserved.onboarding,true);assert.equal(preserved.training.frequency,4);assert.equal(preserved.space.place,'gym');
  await page.goto(base+'/welcome.html?replay=1');await page.locator('#get-started').click();
  await page.evaluate(()=>{Storage.prototype.setItem=function(){throw Error('storage blocked')}});
  await page.locator('#preferred-name').fill('Fail');await page.locator('#preferred-name').press('Enter');
  assert.equal(await page.locator('.onboarding').getAttribute('data-state'),'name-entry');
  assert.match(await page.locator('#name-error').textContent(),/could not be saved/);
  await page.setViewportSize({width:1024,height:1000});
  await page.goto(base+'/welcome.html?replay=1');
  await page.waitForTimeout(950);
  await page.screenshot({path:out+'/welcome-desktop.png'});
  assert.equal(await page.locator('.onboarding').evaluate(node=>getComputedStyle(node).borderRadius),'42px');
  await page.locator('#get-started').click();
  await page.locator('#preferred-name').fill('Alex');
  await page.locator('#preferred-name').blur();
  await page.waitForTimeout(450);
  await page.screenshot({path:out+'/name-desktop.png'});
  assert.deepEqual(errors,[]);
  fs.writeFileSync(out+'/results.json',JSON.stringify({pass:true,results,errors},null,2));
  console.log('PASS: four viewport sizes, Unicode, 40-character name, actual upward flight, Enter, whitespace/mandatory name, 900ms timeline/single prefix fade, Back, rapid submit, interruption, viewport changes, reduced motion, profile setup and Home compatibility.');
 } finally {await browser.close();server.close();}
})().catch(error=>{console.error(error);process.exitCode=1});
