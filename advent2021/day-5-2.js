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

function increment(current, final) {
    if (current === final) {
        return current
    }
    if (current < final) {
        return current + 1
    }
    return current - 1
}

function drawPoint(i, j){
    if (!grid[j]) {
        grid[j] = []
    }
    if (!grid[j][i]) {
        grid[j][i] = 0
    }
    grid[j][i]++
}

function drawLine(x1, x2, y1, y2) {
    // [[0,2],[2,2]]
    let i = x1 // i starts at x1
    let j = y1 // i starts at y1
    while (i !== x2 || j !== y2) {
        drawPoint(i, j)
        i = increment(i, x2)
        j = increment(j, y2)
    }
    // draw the last point
    drawPoint(i, j)
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
    const x1 = coords[0][0]
    const x2 = coords[1][0]
    const y1 = coords[0][1]
    const y2 = coords[1][1]
    // if (x1 === x2 || y1 === y2) {
        // allPoints.push(coords)
    drawLine(x1, x2, y1, y2)
    // }

})

lineReader.on('close', function () {
    // console.log('closed', grid)
    findHotSpots(grid)
})