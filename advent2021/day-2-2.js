const lineReader = require('readline').createInterface({
    input: require('fs').createReadStream('day-2-1 copy.txt')
});

let x = 0;
let y = 0;
let aim = 0;

function processCommand(command, value) {
    // handle forward, up, and down commands
    switch (command) {
        case "forward":
            // increase x by value
            // increases y by aim*value
            x = x + Number(value)
            y = y + aim * Number(value)
        break;
        case "up":
            // decrease aim by value
            aim = aim - Number(value)
        break;
        case "down":
            // increase aim by value
            aim = aim + Number(value)
        break;
        default:
            // do nothing
    }
}

lineReader.on('line', function (line) {
    // split the command on a space, e.g. forward 0 => ["forward", "0"]
    const [command, value] = line.split(' ');
    processCommand(command, value)
})

lineReader.on('close', function () {
    // report x, y and x*y
    console.log("x:", x)
    console.log("y:", y)
    console.log("x*y:", x*y)
})