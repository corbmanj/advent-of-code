import { createReadStream } from 'fs'
import { createInterface } from 'readline'

const lineReader = createInterface({
    input: createReadStream('day1-data.txt')
});

let calArray = []
let currentCal = 0

lineReader.on('line', function (line) {
    if (line) {
        currentCal += +line;
    } else {
        calArray.push(currentCal);
        currentCal = 0;
    }
})

lineReader.on('close', function () {
    let currentMax = Math.max(...calArray)
    const max1 = calArray.splice(calArray.findIndex(item => item === currentMax), 1)[0]
    currentMax = Math.max(...calArray)
    const max2 = calArray.splice(calArray.findIndex(item => item === currentMax), 1)[0]
    currentMax = Math.max(...calArray)
    const max3 = calArray.splice(calArray.findIndex(item => item === currentMax), 1)[0]
    console.log('1', max1, '2', max2, '3', max3, 'sum', Number(max1)+Number(max2)+Number(max3))
})