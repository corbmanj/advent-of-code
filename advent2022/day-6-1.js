import { createReadStream } from "fs";
import { createInterface } from "readline";

const lineReader = createInterface({
  input: createReadStream("day-6.txt"),
});

function iterateLine(line) {
  let i = 0
  while (i < line.length) {
    const nextFour = line.substring(i, i+14);
    const deduped = [...new Set(nextFour.split(''))]
    if (deduped.length === 14) {
      break
    }
    i++
  }
  return i;
}

lineReader.on("line", function (line) {
  if (line) {
    console.log(iterateLine(line)+14);
  }
});

lineReader.on("close", function () {
  console.log("done");
});
