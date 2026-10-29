const {chromium}=require(process.env.FITLENS_PLAYWRIGHT_MODULE || 'playwright');
const assert=require('node:assert/strict');
(async()=>{const browser=await chromium.launch({channel:'chrome',headless:true});try{
 for(const mode of ['skip','unavailable','demo','blocked']){
  const context=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true,reducedMotion:'reduce'}),page=await context.newPage(),errors=[];page.setDefaultTimeout(10000);page.on('pageerror',e=>errors.push(e.message));
  const base=require('node:url').pathToFileURL(require('node:path').resolve(__dirname,'..')).href+'/';await page.goto(base+'home.html');await page.evaluate(()=>{FitLensTraining.add('upper',FitLensTraining.today());});const original=await page.evaluate(()=>localStorage.getItem('fitlens:training:v1'));
  await page.goto(base+'welcome.html'+(mode==='demo'?'?healthDemo=1&notificationsDemo=1':''));await page.locator('#get-started').click();await page.locator('#preferred-name').fill('Minh Anh');await page.locator('#preferred-name').press('Enter');await page.locator('#continue-onboarding').click();await page.locator(mode==='unavailable'?'#connect-health':'#skip-health').click();await page.locator('#continue-health').click();await page.locator(mode==='skip'||mode==='blocked'?'#skip-notifications':'#enable-notifications').click();await page.waitForFunction(()=>document.querySelector('.onboarding').dataset.state==='notifications-response');
  if(mode==='blocked')await page.evaluate(()=>{Storage.prototype.setItem=()=>{throw Error('Blocked');};});
  await page.locator('#continue-notifications').click();
  if(mode==='blocked'){await page.waitForFunction(()=>document.querySelector('#notification-settings-status').textContent.includes('could not be saved'));assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('fitlens:profile:v1')).onboarding),false);assert.match(page.url(),/welcome.html/);}
  else{await page.waitForURL('**/home.html');await page.waitForSelector('#home-profile-greeting');assert.match(await page.locator('#home-profile-greeting').textContent(),/Minh Anh/);assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('fitlens:profile:v1')).onboarding),true);assert.equal(await page.evaluate(()=>localStorage.getItem('fitlens:training:v1')),original);await page.reload();await page.waitForSelector('#home-profile-greeting');await page.goto(base+'welcome.html');await page.waitForURL('**/home.html');await page.goto(base+'welcome.html?replay=1');await page.locator('#get-started').waitFor();}
  assert.deepEqual(errors,[]);await context.close();console.log('PASS welcome → Today:',mode);
 }
 }finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
