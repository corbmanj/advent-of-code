import { createReadStream } from 'fs'
import { createInterface } from 'readline'

const lineReader = createInterface({
    input: createReadStream('day-4.txt')
});

let totalCount = 0;
let row = 1;

function makeString(elfRange) {
    const [beg, end] = elfRange.split('-');
    const size = Number(end) - Number(beg) + 1
    return [...Array(size).keys()].map(i => i + Number(beg));
}

function checkOverlap(array1, array2) {
    const fullArray = [...array1, ...array2];
    const fullArrayLength = fullArray.length;
    const fullSet = new Set(fullArray)
    const fullSetLength = fullSet.size;
    return fullSetLength != fullArrayLength;
}

lineReader.on('line', function (line) {
    if (line) {
        const [elf1, elf2] = line.split(',')
        const efl1String = makeString(elf1)
        const efl2String = makeString(elf2)
        const hasOverlap = checkOverlap(efl1String, efl2String)
        console.log(hasOverlap, row)
        row++
        if (hasOverlap) {
            totalCount++
        }
    }
})

lineReader.on('close', function () {
    console.log('done', totalCount)
})