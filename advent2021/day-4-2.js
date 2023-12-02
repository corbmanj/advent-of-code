const lineReader = require('readline').createInterface({
    input: require('fs').createReadStream('day-4-1.txt')
});

let lineIndex = 0
let bingoArray
let boardNumber = 0
let boardObject = {}
let winnerArray = []

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
        console.log('removing value', value)
        row.splice(foundIndex, 1)
        if (row.length === 0) {
            console.log("WINNER", name, value)
            const sum = boardObject[name].rows.reduce((acc, curr) => {
                return acc += curr.reduce((ac, cu) => {
                    return ac += +cu
                }, 0)
            }, 0)
            const score = sum * value
            winnerArray.push([name, score])
            console.log('winners', winnerArray)
            delete boardObject[name]
        }
    }
}

function callNumber(value) {
    const boardNames = Object.keys(boardObject)
    boardNames.forEach(name => {
        if (boardObject[name]) {
            boardObject[name].rows.forEach((row) => removeCalledNumber(row, value, name))
        }
        if (boardObject[name]) {
            boardObject[name].columns.forEach((column) => removeCalledNumber(column, value, name))
        }
    })
}

function readBingoArray() {
    bingoArray.forEach(callNumber)
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
    console.log('last winner', winnerArray[winnerArray.length-1])
})