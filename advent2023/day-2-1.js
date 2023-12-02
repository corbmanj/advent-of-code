import { createReadStream } from 'fs'
import { createInterface } from 'readline'

const lineReader = createInterface({
    input: createReadStream('day-2.txt')
});



let sum = 0


lineReader.on('line', function (line) {
    if (line) {
        const [game, roundsList] = line.split(":");
        const gameNum = game.match(/(\d+)/gm);
        const allCounts = roundsList.match(/(\d+)/gm);
        if (allCounts.every(count => +count <= 12)) {
          sum += +gameNum[0];
        } else if (allCounts.some(count => +count >= 15)) {
          // do nothing
        } else {
          let isValid = true
          let roundCount = 0
          const rounds = roundsList.split(";")
          while (isValid && roundCount < rounds.length) {
            const round = rounds[roundCount];
            const colorsWithCount = round.split(",");
            colorsWithCount.forEach(color => {
              const colorCount = color.match(/(\d+)/gm)[0]
              if (color.includes("red") && colorCount > 12) {
                isValid = false
              }
              if (color.includes("green") && colorCount > 13) {
                isValid = false
              }
            })
            roundCount++
          }
          if (isValid) {
            sum += +gameNum[0];
          }
        }
    }
})

lineReader.on('close', function () {
    console.log('sum', sum)
})