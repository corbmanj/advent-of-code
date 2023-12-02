import { createReadStream } from 'fs'
import { createInterface } from 'readline'

const lineReader = createInterface({
    input: createReadStream('day-5.txt')
});

let stacks = [[],[],[],[],[],[],[],[],[]]
let row = 1;
const regex = /(\d+)/g;

function populateStacks(line) {
    const lineArray = line.split('');
    lineArray.push(' ');
    let stack = 0;
    while(lineArray.length) {
        const nextStack = lineArray.splice(0, 4);
        if (nextStack[1].trim()) {
            stacks[stack].push(nextStack[1])
        }
        stack++
    }
}

function executeCommand(command) {
    const [size, from, to] = command.match(regex);
    moveStack(size, from, to);
}

function moveStack(size, from, to) {
    const movedStack = stacks[from-1].splice(0,size);
    stacks[to-1].unshift(...movedStack.reverse());
}

lineReader.on('line', function (line) {
    if (line) {
        if (line.includes('[')) {
            populateStacks(line)
        }
        if (line[0] === 'm') {
            executeCommand(line)
        }
    }
})

lineReader.on('close', function () {
    console.log('done', stacks.map(stack => stack[0]).join(''))
})