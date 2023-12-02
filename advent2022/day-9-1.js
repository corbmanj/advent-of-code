import { createReadStream } from "fs";
import { createInterface } from "readline";

const lineReader = createInterface({
  input: createReadStream("day-9.txt"),
});

let hPos = [0,0];
let prevHPos = [0,0];
let tPos = [0,0];
const allTPositions = new Set()
allTPositions.add('0,0')

function moveHead(dir) {
  prevHPos = [...hPos];
  switch(dir) {
    case 'R':
      hPos[0] = hPos[0] + 1;
      break;
    case 'L':
      hPos[0] = hPos[0] - 1;
      break;
    case 'U':
      hPos[1] = hPos[1] + 1;
      break;
    case 'D':
      hPos[1] = hPos[1] - 1;
      break;
  }
}

function checkTail() {
  if (Math.abs(hPos[0] - tPos[0]) > 1 || Math.abs(hPos[1] - tPos[1]) > 1) {
    tPos = prevHPos;
    allTPositions.add(tPos.join(','));
  }
}

function executeCommand(dir, dist) {
  for (let i=0; i<dist; i++) {
    moveHead(dir);
    checkTail();
  }
}

lineReader.on("line", function (line) {
  if (line) {
    const [dir, dist] = line.split(" ");
    executeCommand(dir, Number(dist));
  }
});

lineReader.on("close", function () {
  console.log("full set", allTPositions.size)
});