export function economySummary(e){
 const expected=e.weeklyMembers*e.qualifyingMemberRate*e.redemptionRate*e.rewardCost*e.weeks*e.rewardLimitPerMemberPerWeek;
 const maximum=e.weeklyMembers*e.rewardCost*e.weeks*e.rewardLimitPerMemberPerWeek;
 return {expected,maximum,dailyPoints:e.pointsPerActivity*e.rewardedActivitiesPerDay,budget:e.budget,headroom:e.budget-expected,maximumAffordableCost:e.budget/(e.weeklyMembers*e.weeks*e.rewardLimitPerMemberPerWeek)};
}
export function progression(records,action,economy,now=new Date()){
 const start=new Date(now);start.setHours(0,0,0,0);start.setDate(start.getDate()-((start.getDay()+6)%7));
 const end=new Date(start);end.setDate(end.getDate()+7);
 const rewardedByDay=new Map(),days=new Set();let points=0;
 for(const r of records){const date=new Date(r.time);if(date<start||date>=end||r.minutes<action.minimumMinutes)continue;
 const day=[date.getFullYear(),date.getMonth(),date.getDate()].join('-');days.add(day);const count=rewardedByDay.get(day)||0;if(count<economy.rewardedActivitiesPerDay){points+=economy.pointsPerActivity;rewardedByDay.set(day,count+1);}}
 return {points,days:days.size,eligible:points>=economy.weeklyPointsThreshold&&days.size>=action.daysPerWeek};
}
