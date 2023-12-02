import { createReadStream } from "fs";
import { createInterface } from "readline";

const lineReader = createInterface({
  input: createReadStream("day-8.txt"),
});

let rows = [];
let columns = [];

function isVisibleLeft(col, row) {
  const subRow = row.slice(0, col);
  return subRow.every(tree => tree < row[col])
}

function isVisibleRight(col, row) {
  const subRow = row.slice(col + 1);
  return subRow.every(tree => tree < row[col])
}

function isVisibleUp(col, rowIndex) {
  const subCol = columns[col].slice(0, rowIndex)
  return subCol.every(tree => tree < columns[col][rowIndex])
}

function isVisibleDown(col, rowIndex) {
  const subCol = columns[col].slice(rowIndex + 1)
  return subCol.every(tree => tree < columns[col][rowIndex])
}

function isVisible(col, row, rowIndex) {
  return isVisibleLeft(col, row)
        || isVisibleRight(col, row)
        || isVisibleUp(col, rowIndex)
        || isVisibleDown(col, rowIndex)
}

lineReader.on("line", function (line) {
  if (line) {
    let columnIndex = 0;
    rows.push(line.split(''))
    for (let i in line) {
      if (!columns[i]) {
        columns[i] = [];
      }
      columns[i].push(line[i])
    }
    columnIndex++;
  }
});

lineReader.on("close", function () {
  let visibleTreeCount = 0
  rows.forEach((row, rowIndex) => {
    row.forEach((tree, index) => {
      // console.log('tree', tree, '**, isVisible', isVisible(index, row, rowIndex))
      if (isVisible(index, row, rowIndex)) {
        visibleTreeCount++
      }
    })
  })
  console.log(visibleTreeCount);
});
/**
{
  a: {
    e: {
      i: 584
    },
    f: 29116,
    g: 2557,
    h.lst: 62596
  },
  b.txt: 14848514,
  c.dat: 8504156
  d: {
    j: 4060174
    d.log: 8033020,
    d.ext: 5626152,
    k: 7214296,
  }
}
 */