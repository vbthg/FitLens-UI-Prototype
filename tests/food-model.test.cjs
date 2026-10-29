const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const F=require('../food-model.js');
const context={window:{}};
vm.runInNewContext(fs.readFileSync(require.resolve('../food-catalog.js'),'utf8'),context);
const catalog=context.window.FitLensCatalog;
const meals=Object.entries(catalog.meals).filter(([id,m])=>id===m.id).map(([,m])=>m);
const prefs=F.defaults().preferences;
assert.equal(meals.length,30);
for(const m of meals){
  assert(m.cookCondition&&Array.isArray(m.tools)&&m.ingredients.length&&m.steps.length,m.id);
  assert(fs.existsSync(require('node:path').join(__dirname,'..',m.image)),m.id);
  assert(catalog.editorial[m.id],m.id);
  if(m.type==='out')assert.equal(m.minutes,null,m.id);
}
for(const occasion of ['Breakfast','Lunch','Dinner','Snack']){
  const list=F.rank(meals,prefs,null,[],occasion);
  assert(list.every(m=>F.forOccasion(m,occasion)));
  assert.equal(new Set(list.map(m=>m.id)).size,list.length);
}
assert.notDeepEqual(F.rank(meals,prefs,null,[],'Lunch').slice(0,5).map(m=>m.id),F.rank(meals,prefs,null,[],'Dinner').slice(0,5).map(m=>m.id));
for(const diet of ['any','vegetarian','plant'])for(const allergen of ['egg','soy','wheat','fish','shellfish','peanut','milk','tree_nut','sesame']){
  const p={...prefs,diet,allergens:[allergen]};
  for(const m of F.rank(meals,p,null,[],'Lunch')){
    assert(!m.allergens.includes(allergen));
    assert.notEqual(m.ingredientsVerified,false);
    if(diet==='plant')assert(m.plant);
    if(diet==='vegetarian')assert(m.vegetarian);
  }
}
assert(F.matches(catalog.meals['m-11'],'dau hu',{budget:'any'}));
assert(F.matches(catalog.meals['m-12'],'sả',{budget:'any'}));
assert(F.matches(catalog.meals['m-12'],'lemongrass',{budget:'any'}));
assert(!F.matches(catalog.meals['b-01'],'sả',{budget:'any'}),'Accented Vietnamese ingredients must not match English sauce/salt');
assert(!F.matches(catalog.meals['b-05'],'',{time:10,budget:'any'}));
assert(!F.matches(catalog.meals['m-12'],'',{budget:'simple'}));
assert(F.matches(catalog.meals['m-20'],'',{budget:'special',type:'home',occasion:'Dinner'}));
assert(!F.matches(catalog.meals['m-20'],'',{budget:'any',type:'out'}));
const data={};let writes=0;
const storage={getItem:k=>data[k]||null,setItem:(k,v)=>{writes++;data[k]=v;}};
let store=F.createStore(storage);
store.log('2026-10-27','b-01','Lunch',1);
store.log('2026-10-27','b-01','Lunch',0.5);
assert.equal(store.day('2026-10-27').length,2,'A second eating event must not overwrite the first');
const key=store.day('2026-10-27')[0].key;
store.log('2026-10-27','b-01','Dinner',1.5,key);
assert.equal(store.day('2026-10-27').length,2);
assert.equal(store.day('2026-10-27')[0].portion,1.5);
store=F.createStore(storage);
assert.equal(store.day('2026-10-27').length,2);
assert.equal(store.day('2026-10-28').length,0);
store.remove('2026-10-27',key);
assert.equal(store.day('2026-10-27').length,1);
store.toggleSave('egg');assert(store.get().saved.includes('b-01'));
store.log('2026-10-27','custom','Breakfast',null,undefined,{name:'  Phở gà  ',amount:'1 tô nhỏ'});
let custom=store.day('2026-10-27').find(e=>e.meal==='custom');
assert.equal(custom.name,'Phở gà');assert.equal(custom.portion,null);
store.log('2026-10-27','custom','Dinner',null,custom.key,{name:'Phở gà',amount:'Nửa tô'});
custom=F.createStore(storage).day('2026-10-27').find(e=>e.meal==='custom');
assert.equal(custom.amount,'Nửa tô');assert.equal(custom.occasion,'Dinner');
assert.equal(store.log('2026-10-27','custom','Lunch',null,undefined,{name:'  '}),false);
store.log('2026-10-27','b-02','Breakfast',null);
assert(store.day('2026-10-27').some(e=>e.meal==='b-02'&&e.portion===null));
assert(store.recent('2026-10-27').some(e=>e.name==='Phở gà'));
store.log('2026-10-27','custom','Lunch',null,undefined,{name:'Phở gà',amount:''});
assert.equal(store.recent('2026-10-27').filter(e=>e.name==='Phở gà').length,1);
const undo={...custom};store.remove('2026-10-27',undo.key);
store.log('2026-10-27',undo.meal,undo.occasion,undo.portion,undo.key,{name:undo.name,amount:undo.amount});
assert.equal(store.day('2026-10-27').find(e=>e.key===undo.key).amount,'Nửa tô');
const before=writes,preview=F.createStore(storage,true);
preview.log('2026-10-27','b-01','Lunch',1);assert.equal(writes,before);
const blocked=F.createStore({getItem(){throw Error();},setItem(){throw Error();}});
assert.equal(blocked.log('2026-10-27','b-01','Lunch',1),false);
assert.equal(blocked.day('2026-10-27').length,1);
data[F.KEY]=JSON.stringify({version:2,preferences:{diet:'invalid',allergens:'bad',time:999},logs:{'2026-10-27':'bad'},saved:'bad'});
const malformed=F.createStore(storage);assert.equal(malformed.get().preferences.diet,'any');assert.equal(malformed.day('2026-10-27').length,0);
console.log('PASS: catalogue integrity, occasion separation, dietary/exclusion combinations, filters, separate eating events, edits, persistence, aliases, preview isolation, storage failure and malformed saved data.');
