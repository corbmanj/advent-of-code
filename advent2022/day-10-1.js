import { createReadStream } from "fs";
import { createInterface } from "readline";

const lineReader = createInterface({
  input: createReadStream("day-10.txt"),
});

let lineCount = 1
let spritePos = 1;
let cycle = 1;
let pixel = 0;
let image = [[], [], [], [], [], [], [], [], [], []];
let row = 0;

function checkPixel() {
  if (pixel > 39) {
    pixel = 0;
    row++;
  }
  if (Math.abs(pixel - spritePos) < 2) {
    image[row].push('#')
  } else {
    image[row].push('.')
  }
}

function executeCommand(command, inc) {
  const commandLength = command === "noop" ? 1 : 2;
  const cycleToFinishCommand = cycle + commandLength;
  while (cycle < cycleToFinishCommand) {
    checkPixel();
    cycle++;
    pixel++;
  }
  if (command === "addx") {
    spritePos += inc;
  }
}

lineReader.on("line", function (line) {
  if (line) {
    // console.log(lineCount, line)
    lineCount++
    const [command, inc] = line.split(" ");
    executeCommand(command, Number(inc));
  }
});

lineReader.on("close", function () {
  console.log("done");
  image.forEach(row => {
    console.log(row.join(''))
  })
});
