import { createReadStream } from 'fs'
import { createInterface } from 'readline'

const lineReader = createInterface({
    input: createReadStream('day-6-1.txt')
});

let fishies;

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

lineReader.on('line', function (line) {
    fishies = [0] //line.split(',').map(Number)
})

lineReader.on('close', function () {
    // console.log('fishies', fishies, fishies.length)
    propogate(100)
    console.log('fishies', fishies, fishies.length)
})