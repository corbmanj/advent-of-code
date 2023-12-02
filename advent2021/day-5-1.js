import { createReadStream } from 'fs'
import { createInterface } from 'readline'

const lineReader = createInterface({
    input: createReadStream('day-5-1.txt')
});

const allPoints = [];
// [000]
// [000]
// [000]
const grid = []

function drawHorizontal(coords) {
    // [[0,2],[2,2]]
    const x1 = coords[0][0] // 0
    const x2 = coords[1][0] // 2
    const y = coords[0][1] // 2
    if (!grid[y]) {
        grid[y] = []
    }
    for (let x = x1; x<=x2; x++) {
        if (!grid[y][x]) {
            grid[y][x] = 0
        }
        grid[y][x]++
    }
}

function drawVertical(coords) {
    // [[2,0],[2,2]]
    const x = coords[0][0] // 2
    const y1 = coords[0][1] // 0
    const y2 = coords[1][1] // 2
    for (let y = y1; y<=y2; y++) {
        if (!grid[y]) {
            grid[y] = []
        }
        if (!grid[y][x]) {
            grid[y][x] = 0
        }
        grid[y][x]++
    }
}

// function drawIt(start, end, rowColumn) {
//     for (let i = start; i<=end; i++) {
//         if (!grid[rowColumn]) {
//             grid[rowColumn] = []
//         }
//         if (!grid[y][x]) {
//             grid[y][x] = 0
//         }
//         grid[y][x]++
//     }
// }

function drawLine(coords, slope) {
    // const x1 = coords[0][0]
    // const x2 = coords[1][0]
    // const y1 = coords[0][1]
    // const y2 = coords[1][1]
    if (slope === 'inf') {
        drawVertical(coords)
    } else {
        drawHorizontal(coords)
    }
}

function findHotSpots(finalGrid) {
    const hotSpotCount = finalGrid.reduce((total, row) => {
        const rowTotal = row.filter(item => item > 1).length
        return total + rowTotal
    }, 0)
    console.log('hotSpotCount', hotSpotCount)
}

lineReader.on('line', function (line) {
    // split points into array of two points
    // 661,442 -> 661,592 becomes ['661,442 ', ' 661,592']
    const points = line.split('->')
    // split each point into an array of two coords
    // ['661,442 ', ' 661,592'] becomes [[661, 442], [661, 592]]
    // trim gets rid of any whitespace
    const coords = points.map(point => {
        const trimmedPoint = point.trim()
        return trimmedPoint.split(',').map(Number)
    })
    // only keep the point if x1 === x2 or y1 === y2
    let slope;
    const x1 = coords[0][0]
    const x2 = coords[1][0]
    if (x1 === x2) {
        slope = 'inf'
    } else {
        slope = 0
    }
    const y1 = coords[0][1]
    const y2 = coords[1][1]
    if (x1 === x2 || y1 === y2) {
        // if x1>x2 or y1>y2, then switch the point order
        let finalCoords = coords
        if (x1 > x2 || y1 > y2) {
            finalCoords = [coords[1],coords[0]]
        }
        allPoints.push(finalCoords)
        drawLine(finalCoords, slope)
        console.log('coords', finalCoords)
    }

})

lineReader.on('close', function () {
    console.log('closed', grid)
    findHotSpots(grid)
})