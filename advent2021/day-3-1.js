const lineReader = require('readline').createInterface({
    input: require('fs').createReadStream('day-3-1.txt')
});

countArray = [0,0,0,0,0,0,0,0,0,0,0,0]

function processLine(array) {
    array.forEach((val, index) => {
        if (val === '1') {
            countArray[index] = countArray[index] + 1
        }
        else {
            countArray[index] = countArray[index] - 1
        }
    })
}

function convertCountArray(value) {
    // create an array from countArray, 
    // for each value in countArray if the value is positive return 1 
    // otherwise return 0
    const gammaBinary = Number(value.map((val) => val > 0 ? 1 : 0).join(''))
    const epsilonBinary = Number(value.map((val) => val > 0 ? 0 : 1).join(''))
    const gammaDec = parseInt(gammaBinary, 2)
    const epsilonDec = parseInt(epsilonBinary, 2)
    console.log("gammaBinary:", gammaBinary, "gammaDec:", gammaDec)
    console.log("epslionBinary:", epsilonBinary, "epsilonDec:", epsilonDec)
    console.log("power consumption:", epsilonDec * gammaDec)
}

lineReader.on('line', function (line) {
    // split the entry on each digit ex: 11011 => ['1','1','0','1','1']
    const array = line.split('');
    processLine(array)
})

lineReader.on('close', function () {
    // report x, y and x*y
    console.log("countArray: ", countArray)
    convertCountArray(countArray)
})