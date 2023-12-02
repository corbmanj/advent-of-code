import { createReadStream } from 'fs'
import { createInterface } from 'readline'

const lineReader = createInterface({
    input: createReadStream('day1-data.txt')
});

let maxCal = 0
let currentCal = 0

lineReader.on('line', function (line) {
    if (line) {
        currentCal += +line;
    } else {
        if (currentCal > maxCal) {
            maxCal = currentCal
        }
        currentCal = 0
    }
})

lineReader.on('close', function () {
    console.log('maxCal', maxCal)
})