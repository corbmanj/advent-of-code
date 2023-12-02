import Papa from 'papaparse';
import fs from 'fs';

const file = fs.readFileSync('rgtRaceData.csv', { encoding: 'utf8', flag: 'r' });
const {data: raceResults} = Papa.parse(file, { header: true });

let riders = {};
const historicalMMRs = [];
let raceNumber = 0;
let currentRaceId = 0;
let currentRaceResults = [];
let headerRow = {'id': 0, 'currentMMR': 0, 'mmr0': 0}

function getRandomRiderIds (count) {
  return new Array(500).fill().map((a, i) => a = i).sort(() => Math.random() - 0.5).slice(0,count);
}

function calcMMRChange(rider, otherRider) {
  if (rider.id === otherRider.id) {
    return 0;
  }
  if (!rider.finish && !otherRider.finish) {
    return 0;
  }
 if (rider.startingMMR + 250 < otherRider.startingMMR) {
  if (!rider.finish) {
    return 0
  }
  if (!otherRider.finish) {
    return 25
  }
  if (rider.finish + 10000 < otherRider.finish) {
    return 25
  }
  if (rider.finish < otherRider.finish) {
    return 10
  }
  if (rider.finish - 10000 > otherRider.finish) {
    return 0
  }
  return 5
 } else if (rider.startingMMR < otherRider.startingMMR) {
  if (!rider.finish) {
    return -2
  }
  if (!otherRider.finish) {
    return 10
  }
  if (rider.finish + 10000 < otherRider.finish) {
    return 10
  }
  if (rider.finish < otherRider.finish) {
    return 5
  }
  if (rider.finish - 10000 > otherRider.finish) {
    return -2
  }
  return 0

 } else if (rider.startingMMR - 250 > otherRider.startingMMR) {
  if (!rider.finish) {
    return -25
  }
  if (!otherRider.finish) {
    return 0
  }
  if (rider.finish + 10000 < otherRider.finish) {
    return 0
  }
  if (rider.finish < otherRider.finish) {
    return -5
  }
  if (rider.finish - 10000 > otherRider.finish) {
    return -25
  }
  return -10
 } else {
  if (!rider.finish) {
    return -10
  }
  if (!otherRider.finish) {
    return 2
  }
  if (rider.finish + 10000 < otherRider.finish) {
    return 2
  }
  if (rider.finish < otherRider.finish) {
    return 0
  }
  if (rider.finish - 10000 > otherRider.finish) {
    return -10
  }
  return -5
 }
}

function calculateNewMMRs(raceResults) {
  raceResults.forEach((finisher) => {
    let mmrChange = 0
    raceResults.forEach((otherFinisher) => {
      mmrChange = mmrChange + calcMMRChange(finisher, otherFinisher)
    })
    riders[finisher.id][`mmr${raceNumber}`] = finisher.startingMMR + mmrChange;
    riders[finisher.id].currentMMR = finisher.startingMMR + mmrChange;
    if (+finisher.id === 4931) {
      console.log(currentRaceId, finisher.id, riders[finisher.id],  mmrChange)
    }
  })
}

// function that simulates 20 random racers
function race20() {
  // get 20 random rider IDs
  const randomArray = getRandomRiderIds(20);
  // get expected performance
  const randomRiders = randomArray.map(idx => ({id: idx, originalMMR: riderMMRs[idx]}));
  // adjust by some random offset
  const adjustedRandomRiders = randomRiders.map(mmr => ({...mmr, value: mmr.originalMMR + (Math.round(Math.random()*1000) - 500)})).sort((a,b) => a.value - b.value);
  // group riders in chunks of .3W/kg
  let low = Math.min(...(adjustedRandomRiders.map(rider => rider.value)))
  const maxWPK = Math.max(...(adjustedRandomRiders.map(rider => rider.value)))
  const groupsArray = [];

  while (low < maxWPK) {
    groupsArray.push(low);
    low += 300;
  }
  groupsArray.push(low);
  const finishGroupsArrays = groupsArray.map((lowMMR, index) => 
    adjustedRandomRiders.filter(mmr => mmr.value >= lowMMR && mmr.value < groupsArray[index + 1])
  )
  // assume that each group on the road has a 10 second gap on the next group
  // within each group randomize the finish order
  const finishGroupsWithSprintPlacings = finishGroupsArrays.map(group => group.sort(() => Math.random() - 0.5))
  calculateNewMMRs(finishGroupsWithSprintPlacings);
  historicalMMRs.push([...riderMMRs]);
}

raceResults.forEach((result) => {
  if (+result.race_id !== currentRaceId) {
    // end race
    // calculate new MMRs
    // clear out current race results
    // set new raceId
    currentRaceId = +result.race_id
    headerRow[`mmr${result.race_id}`] = 0
    calculateNewMMRs(currentRaceResults);
    currentRaceResults = [];
    raceNumber++;
  }
  // if this rider doesn't exist yet, add them to riders
  if (!riders[result.user_id]) {
    const startingMMR = Math.round(+result.ftp/+result.weight * 1000)
    riders[result.user_id] = { mmr0: startingMMR, currentMMR: startingMMR }
  }
  currentRaceResults.push({
    id: result.user_id,
    startingMMR: riders[result.user_id].currentMMR,
    finish: result.finish_time ? (new Date(result.finish_time)).getTime() : undefined,
    rank: +result.finish_rank || undefined,
  })
})

// console.log(riders)
const riderArray = Object.entries(riders).map(([key, value]) => {
  delete value.currentMMR;
  const mmr0 = value.mmr0; 
  delete value.mmr0;
  return ({
  id: key,
  mmr0,
  ...value,
})})
console.log(riderArray.length)
const shallowRiderArray = riderArray.slice(0,200);
fs.writeFile('myjsonfile.json', JSON.stringify(shallowRiderArray), 'utf8', () => { console.log("success")});

// console.log(riderArray[1]);

// const csvData = Papa.unparse(riderArray);
// fs.writeFile('riderList2.csv', csvData, (err, data) => {
//   if (err) {
//     console.error('err', err)
//   } else {
//     console.log('success');
//   }
// });


// todo:
// * implement 20% nearest riders rule evenly split ahead and behind
// * filter data for riders > 20 races
// * data by race for all races only races > 20 people