import { createReadStream } from 'fs'
import { createInterface } from 'readline'

const lineReader = createInterface({
    input: createReadStream('day-2.txt')
});

const typeMap = {
    'A': 'rock',
    'B': 'paper',
    'C': 'scissors',
    'X': 'rock',
    'Y': 'paper',
    'Z': 'scissors'
}

const itemMap = {
    rock: { beats: 'scissors', points: 1},
    paper: { beats: 'rock', points: 2},
    scissors: { beats: 'paper', points: 3},
}

let totalScore = 0

function getScore(them, us) {
    const typeScore = itemMap[typeMap[us]].points;
    // case draw
    if (typeMap[them] === typeMap[us]) {
        return typeScore + 3
    }
    // case win
    if (itemMap[typeMap[us]].beats === typeMap[them]) {
        return typeScore + 6
    }
    // case lose
    return typeScore
}

lineReader.on('line', function (line) {
    if (line) {
        const [them, us] = line.split(" ");
        const gameScore = getScore(them, us);
        console.log('gameScore', gameScore)
        totalScore += gameScore
    }
})

lineReader.on('close', function () {
    console.log('totalScore', totalScore)
})