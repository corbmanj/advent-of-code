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
    const string = [...Array(size).keys()].map(i => i + Number(beg)).join("z,a");
    return `a${string}z`;
}

function checkContains(string1, string2) {
    return string1.includes(string2) || string2.includes(string1);
}

lineReader.on('line', function (line) {
    if (line) {
        const [elf1, elf2] = line.split(',')
        const efl1String = makeString(elf1)
        const efl2String = makeString(elf2)
        const doesContain = checkContains(efl1String, efl2String)
        console.log(doesContain, row)
        row++
        if (doesContain) {
            totalCount++
        }
    }
})

lineReader.on('close', function () {
    console.log('done', totalCount)
})