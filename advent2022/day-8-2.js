import { createReadStream } from "fs";
import { createInterface } from "readline";

const lineReader = createInterface({
  input: createReadStream("day-8.txt"),
});

let rows = [];
let columns = [];

function getScoreFromSubRow(subRow, treeHeight) {
  if (!subRow.length) {
    return 0;
  }
  let visibleTreeCount = 1
  for (let i of subRow) {
    if (i < treeHeight) {
      visibleTreeCount++
    } else {
      return visibleTreeCount;
    }
  }
  return Math.min(visibleTreeCount, subRow.length);
}

function getScoreLeft(col, row) {
  const subRow = row.slice(0, col);
  const treeHeight = row[col]
  return getScoreFromSubRow(subRow.reverse(), treeHeight);
}

function getScoreRight(col, row) {
  const subRow = row.slice(col + 1);
  const treeHeight = row[col]
  return getScoreFromSubRow(subRow, treeHeight)
}

function getScoreUp(col, rowIndex) {
  const subCol = columns[col].slice(0, rowIndex)
  const treeHeight = columns[col][rowIndex]
  return getScoreFromSubRow(subCol.reverse(), treeHeight);
}

function getScoreDown(col, rowIndex) {
  const subCol = columns[col].slice(rowIndex + 1)
  const treeHeight = columns[col][rowIndex]
  return getScoreFromSubRow(subCol, treeHeight);
}

function getScore(col, row, rowIndex) {
  return getScoreLeft(col, row)
        * getScoreRight(col, row)
        * getScoreUp(col, rowIndex)
        * getScoreDown(col, rowIndex)
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
  let maxScore = 0
  rows.forEach((row, rowIndex) => {
    row.forEach((tree, index) => {
      // console.log('tree', tree, '**, getScore', getScore(index, row, rowIndex))
      const currentScore = getScore(index, row, rowIndex)
      if (currentScore > maxScore) {
        maxScore = currentScore
      }
    })
  })
  console.log(maxScore);
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