import { createReadStream } from 'fs'
import { createInterface } from 'readline'

const lineReader = createInterface({
    input: createReadStream('day-7-1.txt')
});

let numbers;
let sum;
let min;
let max
let diff
let step;
let trial;
let fuelCons;

function calcFuelConsumption(test) {
    return numbers.reduce((acc, cur) => {
        const d = Math.abs(cur - test)
        return acc += (d*(d+1))/2
    }, 0)
}

function findSmallest() {
    while (Math.abs(step) >= 1) {
        // calc feul cons of next step
        trial = trial + step
        const newFuelCons = calcFuelConsumption(trial)
        // if fuel cons went up, then halve step size and switch direction
        // if fuels cons went down, then keep step size and direction the same
        if (newFuelCons > fuelCons) {
            step = Math.floor(step * -1/2)
        }
        fuelCons = newFuelCons
        console.log('fuel', fuelCons, 'step', step, 'trial', trial)
    }
}

lineReader.on('line', function (line) {
    numbers = line.split(',').map(Number)
    min = Math.min(...numbers)
    max = Math.max(...numbers)
    diff = max - min
    step = Math.floor(diff/4)
    trial = min
    fuelCons = calcFuelConsumption(trial)
})

lineReader.on('close', function () {
    // const smallerGroupAvg = getStdDev()
    findSmallest()
    // const fuelCons = calcFuelConsumption(smallerGroupAvg)
    // console.log('avg', numbers, sum, sum/numbers.length)
})