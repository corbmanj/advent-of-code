import { createReadStream } from 'fs'
import { createInterface } from 'readline'

const lineReader = createInterface({
    input: createReadStream('day-6-1.txt')
});

let fishies;

let totalFishCount;

function calculateR(P, P0, t) {
    // P = P0e^(rt)
    // P/P0 = e^(rt)
    // ln(P/P0) = rt
    // (ln(P/P0))/t = r
    const r = (Math.log(P/P0))/t
    console.log('r', r)
}

function propogate(days) {
    let i = 0
    while(i < days) {
        let newFishCount = 0
        const newFishies = fishies.map(fish => {
            if (fish === 0) {
                newFishCount++
                return 6
            }
            return fish - 1
        })
        const newFishArray = Array.from(Array(newFishCount)).map(i => 8)
        newFishies.push(...newFishArray)
        fishies = newFishies
        // console.log(i, newFishies)
        i++
    }
}

function createNewFish(daysRemaining) {
    totalFishCount++
    let currentDaysRemaining = daysRemaining
    // after 9 days, this new fish creates a new fish
    currentDaysRemaining = currentDaysRemaining - 9
    if (currentDaysRemaining > 0) {
        createNewFish(currentDaysRemaining)
        // every 7 days it creates another new fish
        // until days remaining < 7
        while(currentDaysRemaining > 7) {
            currentDaysRemaining = currentDaysRemaining - 7
            createNewFish(currentDaysRemaining)
        }
    }
}

lineReader.on('line', function (line) {
    fishies = line.split(',').map(Number)
    // for the one fish in the array
    // (t-9-input)
    // ___________ + 1 = number of fishes created from initial fish
    //     7

    // do the above calculation again for the first fish created
    // (t-9-9-input)
    // ___________ + 1 = number of fishes created from initial fish
    //     7
})

lineReader.on('close', function () {
    // console.log('fishies', fishies, fishies.length)
    totalFishCount = fishies.length;
    const t = 256
    fishies.forEach(fishy => {
        let currentT = t-fishy
        createNewFish(currentT)
        while(currentT > 7) {
            currentT = currentT - 7
            createNewFish(currentT)
        }
    })
    console.log("totalFishCount", totalFishCount)
})