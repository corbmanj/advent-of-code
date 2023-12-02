import { createReadStream } from 'fs'
import { createInterface } from 'readline'

const lineReader = createInterface({
    input: createReadStream('day-1.txt')
});

const regex = /(?=(zero)|(one)|(two)|(three)|(four)|(five)|(six)|(seven)|(eight)|(nine)|([0-9]))/g;



let total = 0
const letterNums = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine']


lineReader.on('line', function (line) {
    if (line) {
        const matches = line.matchAll(regex)
        const prenums = Array.from(matches, x => x.filter(Boolean)[0])
        const nums = prenums.map(num => {
            if (letterNums.includes(num)) {
                return String(letterNums.findIndex(a => a === num))
            }
            return num
        })
        let num = +(nums[0] + nums[nums.length - 1])
        console.log('num', num)
        total += num
    }
})

lineReader.on('close', function () {
    console.log('total', total)
})