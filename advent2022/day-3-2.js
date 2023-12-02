import { createReadStream } from 'fs'
import { createInterface } from 'readline'

const lineReader = createInterface({
    input: createReadStream('day-3.txt')
});

let totalPriority = 0
let groupArray = [];

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

function checkGroup(dupArray) {
    const [first, second, third] = dupArray
    const dup = first.filter(char => second.includes(char) && third.includes(char))[0]
    return getPriority(dup);
}

lineReader.on('line', function (line) {
    if (line) {
        groupArray.push(dedupeString(line.split('')));
        if (groupArray.length === 3) {
            console.log('**', groupArray)
            const dupPriority = checkGroup(groupArray);
            console.log('duppriority', dupPriority)
            totalPriority += dupPriority;
            groupArray = [];
        }
    }
})

lineReader.on('close', function () {
    console.log('done', totalPriority)
})