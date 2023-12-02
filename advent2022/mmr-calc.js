import Papa from 'papaparse';
import  fs, { createReadStream } from 'fs';
import { createInterface } from "readline";

const lineReader = createInterface({
  input: createReadStream("startingMMR.txt"),
});

let riderMMRs = [];
const historicalMMRs = []

function getRandomRiderIds (count) {
  return new Array(500).fill().map((a, i) => a = i).sort(() => Math.random() - 0.5).slice(0,count);
}

function calcMMRChange(rider, riderIndex, groupIndex, compareRider, compareGroupIndex, compareRiderIndex) {
  // if 1 or more groups ahead
  if (groupIndex > compareGroupIndex) {
    // if > 250 mmr ahead
    if (rider.originalMMR - 250 > compareRider.originalMMR) {
      return 0
    }
    // if < 250 mmr ahead
    else if (rider.originalMMR > compareRider.originalMMR) {
      return 2
    }
    // if > 250 mmr behind
    else if (rider.originalMMR + 250 < compareRider.originalMMR) {
      return 25
    }
    // if < 250 mmr behind
    else {
      return 10
    }
  }
  // if same group
  if (groupIndex === compareGroupIndex) {
    // if in front
    if (riderIndex > compareRiderIndex) {
      // if > 250 mmr ahead
      if (rider.originalMMR - 250 > compareRider.originalMMR) {
        return -5
      }
      // if < 250 mmr ahead
      else if (rider.originalMMR > compareRider.originalMMR) {
        return 0
      }
      // if > 250 mmr behind
      else if (rider.originalMMR + 250 < compareRider.originalMMR) {
        return 10
      }
      // if < 250 mmr behind
      else {
        return 5
      }
    }
    // if behind
    else {
      // if > 250 mmr ahead
      if (rider.originalMMR - 250 > compareRider.originalMMR) {
        return -10
      }
      // if < 250 mmr ahead
      else if (rider.originalMMR > compareRider.originalMMR) {
        return -5
      }
      // if > 250 mmr behind
      else if (rider.originalMMR + 250 < compareRider.originalMMR) {
        return 5
      }
      // if < 250 mmr behind
      else {
        return 0
      }
    }
  }
  // if 1 or more groups behind
  if (groupIndex < compareGroupIndex) {
    // if > 250 mmr ahead
    if (rider.originalMMR - 250 > compareRider.originalMMR) {
      return -25
    }
    // if < 250 mmr ahead
    else if (rider.originalMMR > compareRider.originalMMR) {
      return -10
    }
    // if > 250 mmr behind
    else if (rider.originalMMR + 250 < compareRider.originalMMR) {
      return 0
    }
    // if < 250 mmr behind
    else {
      return -2
    }
  }
}

function calculateNewMMRs(finishGroups) {
  finishGroups.forEach((group, groupIndex) => {
    // for each group, map through each rider in every group and calculate their MMR change
    group.forEach((rider, riderIndex) => {
      let mmrChange = 0
      finishGroups.forEach((compareGroup, compareGroupIndex) => {
        compareGroup.forEach((compareRider, compareRiderIndex) => {
          mmrChange = mmrChange += calcMMRChange(rider, riderIndex, groupIndex, compareRider, compareGroupIndex, compareRiderIndex)
        })
      })
      riderMMRs[rider.id] = riderMMRs[rider.id] + mmrChange;
    })
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

function race100() {}

function backCalculateFromRealRace() {}

lineReader.on("line", function (line) {
  riderMMRs.push(Number(line));
});

lineReader.on("close", function () {
  riderMMRs = riderMMRs.sort((a,b) => a - b)
  historicalMMRs.push([...riderMMRs])
  for (let i = 1; i <=200; i++) { 
    race20();
  };
  const csvData = Papa.unparse(
    historicalMMRs[0].map((_, colIndex) => historicalMMRs.map(row => row[colIndex]))
  );
  fs.writeFile('riderList.csv', csvData, (err, data) => {
    if (err) {
      console.error('err', err)
    } else {
      console.log('success');
    }
  });
});


