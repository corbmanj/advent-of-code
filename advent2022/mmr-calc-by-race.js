import Papa from "papaparse";
import fs from "fs";

const file = fs.readFileSync("rgtRaceData.csv", {
  encoding: "utf8",
  flag: "r",
});
const { data: raceResults } = Papa.parse(file, { header: true });

let riders = {};
let raceNumber = 0;
let currentRaceId = 0;
let currentRaceResults = [];
let mmrByRace = {};

function calcMMRChange(rider, otherRider) {
  if (rider.id === otherRider.id) {
    return 0;
  }
  if (!rider.finish && !otherRider.finish) {
    return 0;
  }
  if (rider.startingMMR + 250 < otherRider.startingMMR) {
    if (!rider.finish) {
      return 0;
    }
    if (!otherRider.finish) {
      return 25;
    }
    if (rider.finish + 10000 < otherRider.finish) {
      return 25;
    }
    if (rider.finish < otherRider.finish) {
      return 10;
    }
    if (rider.finish - 10000 > otherRider.finish) {
      return 0;
    }
    return 5;
  } else if (rider.startingMMR < otherRider.startingMMR) {
    if (!rider.finish) {
      return -2;
    }
    if (!otherRider.finish) {
      return 10;
    }
    if (rider.finish + 10000 < otherRider.finish) {
      return 10;
    }
    if (rider.finish < otherRider.finish) {
      return 5;
    }
    if (rider.finish - 10000 > otherRider.finish) {
      return -2;
    }
    return 0;
  } else if (rider.startingMMR - 250 > otherRider.startingMMR) {
    if (!rider.finish) {
      return -25;
    }
    if (!otherRider.finish) {
      return 0;
    }
    if (rider.finish + 10000 < otherRider.finish) {
      return 0;
    }
    if (rider.finish < otherRider.finish) {
      return -5;
    }
    if (rider.finish - 10000 > otherRider.finish) {
      return -25;
    }
    return -10;
  } else {
    if (!rider.finish) {
      return -10;
    }
    if (!otherRider.finish) {
      return 2;
    }
    if (rider.finish + 10000 < otherRider.finish) {
      return 2;
    }
    if (rider.finish < otherRider.finish) {
      return 0;
    }
    if (rider.finish - 10000 > otherRider.finish) {
      return -10;
    }
    return -5;
  }
}

function calculateNewMMRs(raceResults) {
  mmrByRace[currentRaceId] = {};
  raceResults.forEach((finisher) => {
    let mmrChange = 0;
    raceResults.forEach((otherFinisher) => {
      mmrChange = mmrChange + calcMMRChange(finisher, otherFinisher);
    });
    riders[finisher.id][`mmr${raceNumber}`] = finisher.startingMMR + mmrChange;
    riders[finisher.id].currentMMR = finisher.startingMMR + mmrChange;
    mmrByRace[currentRaceId][finisher.id] = finisher.startingMMR + mmrChange;
  });
}

raceResults.forEach((result) => {
  if (raceNumber < 26) {
    if (+result.race_id !== currentRaceId) {
      // end race
      // calculate new MMRs
      // clear out current race results
      // set new raceId
      if (currentRaceId !== 0) {
        calculateNewMMRs(currentRaceResults);
      }
      currentRaceId = +result.race_id;
      currentRaceResults = [];
      raceNumber++;
    }
    // if this rider doesn't exist yet, add them to riders
    if (!riders[result.user_id]) {
      const startingMMR = Math.round((+result.ftp / +result.weight) * 1000);
      riders[result.user_id] = { mmr0: startingMMR, currentMMR: startingMMR };
    }
    currentRaceResults.push({
      id: result.user_id,
      startingMMR: riders[result.user_id].currentMMR,
      finish: result.finish_time
        ? new Date(result.finish_time).getTime()
        : undefined,
      rank: +result.finish_rank || undefined,
    });
  }
});

const raceArray = Object.entries(mmrByRace).map(([key, value]) => {
  return {
    raceId: key,
    racers: value,
  }
})
console.log(mmrByRace);

fs.writeFile('myjsonfile.json', JSON.stringify(mmrByRace), 'utf8', () => { console.log("success")});