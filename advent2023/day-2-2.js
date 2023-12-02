import { createReadStream } from 'fs'
import { createInterface } from 'readline'

const lineReader = createInterface({
    input: createReadStream('day-2.txt')
});

let sum = 0

lineReader.on('line', function (line) {
    if (line) {
        const [_game, roundsList] = line.split(":");
        const rounds = roundsList.split(";")
        const colorCountObject = {
          blue: 0,
          red: 0,
          green: 0,
        }
        rounds.forEach(round => {
          // for each round, split into an object of colors
          const colors = round.split(",");
          colors.forEach(color => {
            const colorCount = +color.match(/(\d+)/gm)[0]
            const colorName = color.match(/(red)|(green)|(blue)/gm)[0]
            if (colorCount > colorCountObject[colorName]) {
              colorCountObject[colorName] = colorCount;
            }
          })
        })
        const power = colorCountObject.red * colorCountObject.blue * colorCountObject.green;
        sum += power;
    }
})

lineReader.on('close', function () {
    console.log('sum', sum)
})