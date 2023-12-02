const lineReader = require('readline').createInterface({
    input: require('fs').createReadStream('day-4-1.txt')
});

let lineIndex = 0
let bingoArray
let boardNumber = 0
let boardObject = {}
let found = false

function handleInputLine(line) {
    if (line === '') {
        boardNumber++
        boardObject[`board${boardNumber}`] = {
            rows: [],
            columns: []
        }

    } else {
        // add a row and add the correct member of each column
        const lineArray = line.split(' ').filter(Boolean)
        boardObject[`board${boardNumber}`].rows.push(lineArray)
        lineArray.forEach((columnItem, columnIndex) => {
            if (!boardObject[`board${boardNumber}`].columns[columnIndex]) {
                boardObject[`board${boardNumber}`].columns[columnIndex] = []
            }
            boardObject[`board${boardNumber}`].columns[columnIndex].push(columnItem)
        })

    }
}

function removeCalledNumber(row, value, name) {
    const foundIndex = row.findIndex(member => member === value)
    if (foundIndex >= 0) {
        console.log('removing value')
        row.splice(foundIndex, 1)
        console.log('row after removal:', row)
        console.log('whole board:', boardObject[name])
        if (row.length === 0) {
            console.log("FOUND IT", name, value)
            const sum = boardObject[name].rows.reduce((acc, curr) => {
                return acc += curr.reduce((ac, cu) => {
                    return ac += +cu
                }, 0)
            }, 0)
            console.log('SUM', sum, sum*value)
            found = true
        }
    }
}

function callNumber(value) {
    const boardNames = Object.keys(boardObject)
    console.log('boardNames:', boardNames)
    let boardCounter = 0
    while (!found && boardCounter<100) {
        boardCounter++
        console.log('boardCounter', boardCounter)
        const name = `board${boardCounter}`
        boardObject[name].rows.forEach((row) => removeCalledNumber(row, value, name))
        boardObject[name].columns.forEach((column) => removeCalledNumber(column, value, name))
    }
}

function readBingoArray() {
    let bingoCounter = 0
    while (!found) {
        callNumber(bingoArray[bingoCounter])
        bingoCounter++
    }
}

lineReader.on('line', function (line) {
    // handle first line of input file
    if (lineIndex === 0) {
        bingoArray = line.split(',')
        lineIndex++
    } else {
    // handle bingo boards
        handleInputLine(line)
    }

})

lineReader.on('close', function () {
    // console.log("boardObject: ", JSON.stringify(boardObject, null, 2))
    readBingoArray()
})