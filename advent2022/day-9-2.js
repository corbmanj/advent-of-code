import { createReadStream } from "fs";
import { createInterface } from "readline";

const lineReader = createInterface({
  input: createReadStream("day-9.txt"),
});

let ropePositions = [
  [0, 0],
  [0, 0],
  [0, 0],
  [0, 0],
  [0, 0],
  [0, 0],
  [0, 0],
  [0, 0],
  [0, 0],
  [0, 0],
];

const allTPositions = new Set();
allTPositions.add("0,0");

function moveHead(dir) {
  switch (dir) {
    case "R":
      ropePositions[0][0] = ropePositions[0][0] + 1;
      break;
    case "L":
      ropePositions[0][0] = ropePositions[0][0] - 1;
      break;
    case "U":
      ropePositions[0][1] = ropePositions[0][1] + 1;
      break;
    case "D":
      ropePositions[0][1] = ropePositions[0][1] - 1;
      break;
  }
}

function checkNode(nodeIndex) {
  const leadingNode = ropePositions[nodeIndex - 1] // [3,1]
  const trailingNode = ropePositions[nodeIndex] // [1,0]
  const xDif = leadingNode[0] - trailingNode[0];
  const absXDif = Math.abs(xDif);
  const yDif = leadingNode[1] - trailingNode[1];
  const absYDif = Math.abs(yDif);
  // case, left or right 2
  if (absXDif === 2) {
    // move in x-direction of x2 1 unit
    trailingNode[0] = trailingNode[0] + xDif / 2;
    if (absYDif === 1) {
      // move in y-direction 1 unit
      trailingNode[1] = trailingNode[1] + yDif;
    }
  }
  if (absYDif === 2) {
    // move in y-direction 1 unit
    trailingNode[1] = trailingNode[1] + yDif / 2;
    if (absXDif === 1) {
      // move in x-direction 1 unit
      trailingNode[0] = trailingNode[0] + xDif;
    }
  }
  if (nodeIndex === 9) {
    allTPositions.add(trailingNode.join(","))
  }
}

function executeCommand(dir, dist) {
  for (let i = 0; i < dist; i++) {
    moveHead(dir);
    for (let nodeIndex = 1; nodeIndex < 10; nodeIndex++) {
      checkNode(nodeIndex);
    }
  }
}

lineReader.on("line", function (line) {
  if (line) {
    const [dir, dist] = line.split(" ");
    executeCommand(dir, Number(dist));
  }
});

lineReader.on("close", function () {
  console.log("full set", allTPositions, allTPositions.size);
});
