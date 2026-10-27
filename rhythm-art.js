(function(root){'use strict';
const shapes=['M-25-10C-22-27 4-28 20-16C34-5 24 20 8 25C-13 32-33 12-25-10Z','M-24-13C-14-30 13-28 25-9C33 8 14 28-4 26C-25 25-34 4-24-13Z','M-24-8C-24-25-3-32 16-21C35-10 29 15 11 24C-8 34-29 15-24-8Z'];
function pebble(done,i=0,small=false){return `<svg viewBox="-36 -36 72 72" aria-hidden="true"><path class="pebble-shape ${done?'filled':''}" d="${shapes[i%3]}"/>${done?'<path class="pebble-check" d="m-9 0 6 6 13-13"/>':'<circle class="pebble-core" cx="0" cy="0" r="3"/>'}</svg>`;}
function trail(w,clickable=true){const target=w?.target||3,done=Math.min(w?.sessions.length||0,target);return `<div class="rh-trail" style="--slots:${target}"><svg class="rh-thread" viewBox="0 0 300 80" preserveAspectRatio="none" aria-hidden="true"><path d="M22 43C70 13 119 73 165 43S247 17 280 42"/></svg>${Array.from({length:target},(_,i)=>`<${clickable?'button':'span'} ${clickable?'type="button"':''} class="rh-stone ${i<done?'is-done':''}" ${clickable?`data-session-index="${i}" aria-label="${i<done?'View '+esc(w.sessions[i].name):'Session '+(i+1)+' not completed'}"`:''}>${pebble(i<done,i)}<span>${i<done?shortDate(w.sessions[i].date):String(i+1).padStart(2,'0')}</span></${clickable?'button':'span'}>`).join('')}</div>`;}
function shortDate(s){return new Intl.DateTimeFormat('en',{month:'short',day:'numeric',timeZone:'UTC'}).format(new Date(s+'T12:00:00Z'));}
function range(w){return shortDate(w)+' – '+shortDate(FitLensRhythm.shift(w,6));}
function esc(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
root.FitLensRhythmArt={pebble,trail,shortDate,range,esc};
})(window);
