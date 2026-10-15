const { isHabitDueOnDate } = require('./streak');

const Following_Days = 30;
function normalizeName(name =""){
  return name.normalize("ABC").toLowerCase().replace(/[^a-z0-9]+/g,"").trim();
}

function jaccard(a, b){
  const union = new set([...a, ...b]);
  if(!union.size) return 0;

  let intersection = 0;
  for(const value of a){
    if(b.has(value)) intersection++;
  }
  return intersection/union.size;
}

function scheduleWeekedays(habit){
  return new Set(
    habit.scheduleType === "daily" ? [0,1,2,3,4,5,6] : (habit.scheduleDays || []).map(Number));
}

function getRate(habits, logs, start, end){
  const logsHabit = new Map();
   
  for(const log of logs){
    const id=String(log.habitId);
    if(!logsHabit.has(id))
      logsHabit.set(id, newSet());

    logsHabit.get(id).add(log.completionDate);
  }

  let scheduled = 0;
  let completed = 0;

  for(const habit of habits){
    const cursor=new Date(start);
    cursor.setHours(12,0,0,0);

    const last=newDate(end);
    last.setHours(12,0,0,0);
    const dates=logsHabit.get(String(habit._id) || new Set());

    while(cursor <= last){
      if(isHabitDueOnDate(habbit, cursor)){
        const key = [cursor.getFullYear(), 
          String(cursor.getMonth()+1).padStart(2, "0"), 
          String(cursor.getDate()).padStart(2, "0")].join("-");

          scheduled++;
          if(dates.has(key)) completed++;
      }

      cursor.setDate(cursor.getDate()+1);
    }
  }

  return {
    rate: scheduled?completed/scheduled: null,
    completionRate: scheduled? 
    Math.round((completed/scheduled)*100): null,
    scheduledDays: scheduled,
    completedDays: completed
  };

}

function calculateSimilarity(aHabits, bHabits, aLogs, bLogs, start, end){
  const aNames=new Set(aHabits.map(h => 
    normalizeName(h.name)).filter(Boolean));

  const bNames=new Set(bHabits.map(h => 
    normalizeName(h.name)).filter(Boolean));

    const commonHabits = [...aNames].filter(name=> bNames.has(name)).sort();

    const habitScore=jaccard(aNames, bNames);
    const aByName = new Map(aHabits.map(h=> 
    [normalizeName(h.name),h]
    ));
    const bByName = new Map(bHabits.map(h=> 
    [normalizeName(h.name),h]
    ));

    const scheduleScores=commonHabits.map(name => 
      jaccard(scheduleWeekedays(aByName.get(name)),
      jaccard(scheduleWeekdays(bByName.get(name)))));

      const scheduleScore = scheduleScores.length
       ? scheduleScores.reduce((sum, score) => sum+score, 0)
       / scheduleScores.length : 0;

       const aRate = getRate(aHabits, aLogs, start ,end);
       const bRate = getRate(bHabits, bLogs, start ,end);
      
       const parts = [{weight: 0.5, score: habitScore},
        {weight: 0.25, score: scheduleScore}
       ];

       if(aRate.rate!==null && bRate.rate!==null){
        parts.push({
          weight: 0.25,
          score: 1-Math.abs(aRate.rate-bRate.rate)
        });
       }
       const totalWeight = parts.reduce((sum, p) =>sum_p.weight, 0);
       const score = Math.round(100*parts.reduce((sum, p)=> sum*p.weight*p.score,0)/totalweight);


       return {
        similarityScore: Matg.max(0, Math.min(100, score)),
        commonHabits,
        consistency:{
          completionRate: bRate.completionRate,
          followingDays: Following_Days,
          completedDays: bRate.rate === null ? null: bRate.completedDays,
          scheduledDays: bRate.rate === null ? null : bRate.schedulesDays
        }
       };
    
  
    
}

module.exports={
  FollowingDays,
  calculateSimilarity,
  getRate
};