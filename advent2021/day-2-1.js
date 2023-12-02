const lineReader = require('readline').createInterface({
    input: require('fs').createReadStream('day-2-1 copy.txt')
});

let x = 0;
let y = 0;

function processCommand(command, value) {
    // handle forward, up, and down commands
    switch (command) {
        case "forward":
            // do the forward thing
            x = x + Number(value)
        break;
        case "up":
            // do the up thing
            y = y - Number(value)
        break;
        case "down":
            // do the down thing
            y = y + Number(value)
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