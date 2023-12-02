import { createReadStream } from 'fs'
import { createInterface } from 'readline'

let specialThings = 0

const lineReader = createInterface({
    input: createReadStream('day-8.txt')
});

lineReader.on('line', function (line) {
    const [_input, output] = line.split('|')
    const lightsArray = output.split(' ')
    lightsArray.forEach(light => {
        if ([2, 3, 4, 7].includes(light.length)) {
            specialThings++
        }
    })
})

lineReader.on('close', function () {
    console.log("specialThings", specialThings)
})