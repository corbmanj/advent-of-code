import { createReadStream } from 'fs'
import { createInterface } from 'readline'

const lineReader = createInterface({
    input: createReadStream('day-9.txt')
});

const fullArray = []
let riskLevel = 0

function findLows() {
    fullArray.forEach((row, rowIndex) => {
        row.forEach((element, elIndex) => {
          // if it's lower than all it's neighbors, then add it's value+1 to the riskLevel
          if (
            (row[elIndex-1] === undefined || element < row[elIndex-1]) &&
            (row[elIndex+1] === undefined || element < row[elIndex+1]) &&
            (!fullArray[rowIndex-1] || element < fullArray[rowIndex-1][elIndex]) &&
            (!fullArray[rowIndex+1] || element < fullArray[rowIndex+1][elIndex])
          ) {
            riskLevel = riskLevel + element + 1
          }
        })
    })
}

lineReader.on('line', function (line) {
    fullArray.push(line.split('').map(Number))
})

lineReader.on('close', function () {
    findLows()
    console.log('risk', riskLevel)
})