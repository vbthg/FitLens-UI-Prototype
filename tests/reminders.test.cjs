const assert = require('node:assert/strict');
const test = require('node:test');
const plans = require('../setup-plan-model.js');
const reminders = require('../reminder-model.js');
const form = { goal:'strength', experience:'new', frequency:5, duration:30, place:'gym', body:'no' };
function storage() { const data = new Map(); return {getItem:key=>data.get(key)??null,setItem:(key,value)=>data.set(key,value)}; }
test('moving and swapping weekly occurrences preserves each occurrence’s reminder', () => {
 const plan=plans.build(form); const ids=plan.days.filter(Boolean).map(s=>s.sessionId);
 assert.equal(new Set(ids).size,5);
 plan.days[0].timing={time:'19:00',enabled:true,before:30};
 plan.days[1].timing={time:'08:15',enabled:false,before:0};
 const first=plan.days[0].sessionId, second=plan.days[1].sessionId;
 [plan.days[0],plan.days[1]]=[plan.days[1],plan.days[0]];
 let restored=plans.restore(plan);
 assert.equal(restored.days[1].sessionId,first); assert.equal(restored.days[1].timing.time,'19:00');
 assert.equal(restored.days[0].sessionId,second); assert.equal(restored.days[0].timing.time,'08:15');
 [restored.days[1],restored.days[2]]=[restored.days[2],restored.days[1]];
 restored=plans.restore(restored);
 assert.equal(restored.days[1],null); assert.equal(restored.days[2].timing.before,30);
});
test('reading a plan keeps its calendar week and leaves unset sessions unset', () => {
 const plan=plans.build(form,new Date('2025-01-05T12:00:00Z'));
 plan.days[0].timing={time:'18:30',enabled:true,before:15};
 const restored=plans.restore(JSON.parse(JSON.stringify(plan)));
 assert.equal(restored.weekStart,plan.weekStart); assert.equal(restored.days[1].timing,null);
});
test('two individual sessions on the same date keep independent times', () => {
 const store=storage(),one=reminders.createSingle('Morning'),two=reminders.createSingle('Evening');
 one.schedule={date:'2026-11-02',time:'08:00',enabled:true,before:15};
 two.schedule={date:'2026-11-02',time:'19:30',enabled:false,before:0};
 reminders.saveSingle(store,one); reminders.saveSingle(store,two);
 one.schedule.time='09:00'; reminders.saveSingle(store,one);
 assert.equal(reminders.singles(store).find(s=>s.id===two.id).schedule.time,'19:30');
 one.schedule=null; reminders.saveSingle(store,one);
 assert.equal(reminders.singles(store).find(s=>s.id===one.id).schedule,null);
 assert.equal(reminders.singles(store).length,2);
});
test('early reminders cross day, month and year boundaries correctly', () => {
 const timing={time:'00:10',enabled:true,before:30};
 assert.deepEqual(reminders.notificationDate('2027-01-01',timing),{date:'2026-12-31',time:'23:40'});
 assert.deepEqual(reminders.notificationDate('2026-11-01',timing),{date:'2026-10-31',time:'23:40'});
});
test('invalid dates and times cannot be stored as scheduled sessions', () => {
 const store=storage(),s=reminders.createSingle('Test');
 assert.equal(reminders.validDate('2026-02-30'),false);
 assert.equal(reminders.timing({time:'24:00'}),null);
 s.schedule={date:'2026-02-30',time:'19:00',enabled:true,before:0};
 assert.throws(()=>reminders.saveSingle(store,s));
});
