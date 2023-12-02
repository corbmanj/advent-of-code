import { createReadStream } from 'fs'
import { createInterface } from 'readline'

const lineReader = createInterface({
    input: createReadStream('day-3.txt')
});

let totalPriority = 0

function getPriority(char) {
    const charCode = char.charCodeAt(0);
    if (charCode > 90) {
        return charCode - 96;
    }
    return charCode - 38;
}

function dedupeString(input) {
    return [...new Set(input)]
}

function splitInHalf(line) {
    const lineArray = line.split('');
    const right = lineArray.splice(lineArray.length / 2);
    return [dedupeString(lineArray), dedupeString(right)];
}

function checkSides(left, right) {
    const dup = left.filter(char => right.includes(char))[0]
    return getPriority(dup);
}

lineReader.on('line', function (line) {
    if (line) {
        const [left, right] = splitInHalf(line);
        console.log(left,'*', right)
        const dupPriority = checkSides(left, right);
        console.log('duppriority', dupPriority)
        totalPriority += dupPriority
    }
})

lineReader.on('close', function () {
    console.log('done', totalPriority)
})