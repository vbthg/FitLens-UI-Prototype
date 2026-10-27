(()=>{'use strict';window.FitLensStart=function(item,{plannedId=null}={}){
 const M=FitLensTraining;if(!item?.items?.length)throw new Error('Add an exercise before starting this workout.');
 let areas=[];try{areas=FitLensProfile.createStore(localStorage,sessionStorage).read().body.areas;}catch{}
 if(item.items.some(i=>M.exercises[i.id]?.regions.some(r=>areas.includes(r))))throw new Error('Some exercises use areas you avoid. Open the workout and replace them before starting.');
 const routine=['upper','lower','full'].includes(item.routine)?item.routine:'full';
 sessionStorage.setItem('fitlens-ui-session-plan',JSON.stringify({routine,items:item.items,sessionName:item.name,sessionId:null,plannedId,workoutId:plannedId?null:item.id,minutes:item.minutes,coach:item.coach||null}));sessionStorage.removeItem('fitlens-ui-active');
 location.href='workout-active.html?routine='+routine+(plannedId?'&planned='+encodeURIComponent(plannedId):'');
};})();
