import { createReadStream } from "fs";
import { createInterface } from "readline";

const lineReader = createInterface({
  input: createReadStream("day-11.txt"),
});

let monkeyId = 0
const monkeyObject = {}

function parseLine(line) {
  if (line.startsWith("Monkey")) {
    const re = /\d/g;
    monkeyId = line.match(re)[0];
    monkeyObject[monkeyId] = {inspectionCount: 0}
  }
  if (line.startsWith("Starting")) {
    const re = /\d+/g;
    const monkeyItems = line.match(re).map(item => Number(item));
    monkeyObject[monkeyId].items = monkeyItems;
  }
  if (line.startsWith("Operation")) {
    const formula = line.split("=")[1]
    monkeyObject[monkeyId].operation = formula.trim()
  }
  if (line.startsWith("Test")) {
    const re = /\d+/g;
    monkeyObject[monkeyId].test = line.match(re)[0];
  }
  if (line.startsWith("If true")) {
    const re = /\d/g;
    monkeyObject[monkeyId].ifTrue = line.match(re)[0];
  }
  if (line.startsWith("If false")) {
    const re = /\d/g;
    monkeyObject[monkeyId].ifFalse = line.match(re)[0];
  }
}

function doRound() {
  Object.keys(monkeyObject).forEach(monkey => {
    while(monkeyObject[monkey].items.length) {
      monkeyObject[monkey].inspectionCount++
      let old = monkeyObject[monkey].items.shift();
      let newValue = eval(monkeyObject[monkey].operation)
      newValue = Math.floor(newValue / 3)
      const testResult = newValue % monkeyObject[monkey].test === 0
      let nextMonkey = 0
      if (testResult) {
        nextMonkey = monkeyObject[monkey].ifTrue
      } else {
        nextMonkey = monkeyObject[monkey].ifFalse
      }
      monkeyObject[nextMonkey].items.push(newValue);
    }
  })
}

lineReader.on("line", function (line) {
  if (!line) {
    monkeyId++
  } else {
    parseLine(line.trim())
  }
});

lineReader.on("close", function () {
  console.log("done", monkeyObject);
  for (let i = 1; i<=20; i++) {
    doRound();
  }
  console.log("done", monkeyObject);
  const sortedInspectionCounts = Object.values(monkeyObject)
    .map(monkey => monkey.inspectionCount)
    .sort((countA, countB) => countB - countA)
  console.log(sortedInspectionCounts[0], sortedInspectionCounts[1], sortedInspectionCounts[0]*sortedInspectionCounts[1])
});
