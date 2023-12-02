import { createReadStream } from 'fs'
import { createInterface } from 'readline'

const lineReader = createInterface({
    input: createReadStream('day-2.txt')
});

const typeMap = {
    'A': 'rock',
    'B': 'paper',
    'C': 'scissors',
    'X': 'lose',
    'Y': 'draw',
    'Z': 'win'
}

const itemMap = {
    rock: { beats: 'scissors', loses: 'paper', points: 1},
    paper: { beats: 'rock', loses: 'scissors', points: 2},
    scissors: { beats: 'paper', loses: 'rock', points: 3},
}

let totalScore = 0

function getPlayed(them, outcome) {
    const themType = typeMap[them];
    switch(outcome) {
        case 'win':
            return [itemMap[themType].loses, 6];
        case 'lose':
            return [itemMap[themType].beats, 0];
        case 'draw':
            return [themType, 3]
        default:
            return ['scissors', 0]
    }
}

function getScore(them, outcome) {
    const [us, outcomePoints] = getPlayed(them, outcome);
    const typeScore = itemMap[us].points;
    return typeScore + outcomePoints;
}

lineReader.on('line', function (line) {
    if (line) {
        const [them, outcome] = line.split(" ");
        const gameScore = getScore(them, typeMap[outcome]);
        console.log('gameScore', gameScore)
        totalScore += gameScore
    }
})

lineReader.on('close', function () {
    console.log('totalScore', totalScore)
})