import { createReadStream } from 'fs'
import { createInterface } from 'readline'

let specialThings = 0

const lineReader = createInterface({
    input: createReadStream('day-8.txt')
});

//  a a
// b   c
// b   c
//  d d
// e   f
// e   f
//  g g
//
const letters = ['a','b','c','d','e','f', 'g']

function decodeWires(wiresArray) {
    const map = {}
    // find the 2 letter code, that's the 1 (c, f)
    const one = wiresArray.filter(wire => wire.length === 2)[0].split('')
    // find the 3 letter code, that's the 7 (a, c, f)
    const seven = wiresArray.filter(wire => wire.length === 3)[0].split('')
    map.a = seven.find(letter => !one.includes(letter))
    // find the 4 letter code, that's the 4 (b, d, c, f)
    const four = wiresArray.filter(wire => wire.length === 4)[0].split('')
    // find the 6 letter codes (there can be up to 3 (0, 6, 9)
    const sixes = wiresArray.filter(wire => wire.length === 6).map(six => six.split(''))
      // the one that has b, d, c, and f is the 9. The letter missing is the e (now we know e)
    const nine = sixes.splice(sixes.findIndex(six => four.every(letter => six.includes(letter))), 1)[0]
    letters.forEach(letter => {
      if (!nine.includes(letter)) {
        map.e = letter
      }
    })
    // the one that is missing c or f is the 6. The letter missing is the c (now we know a, c, e)
    const six = sixes.splice(sixes.findIndex(thisSix => !one.every(letter => thisSix.includes(letter))), 1)[0]
    letters.forEach(letter => {
      if (!six.includes(letter)) {
        map.c = letter
        // since we know c we also know f (now we know a, c, d, e, f)
        map.f = one.join('').replace(letter, '')
      }
    })
    // the other one is the 0. The letter missing is d (now we know a, c, d, e)
    const zero = sixes[0]
    letters.forEach(letter => {
      if (!zero.includes(letter)) {
        map.d = letter
      }
    })
    // find the 5 letter codes (there can be up to 3 (2, 3, 5))
    const fives = wiresArray.filter(wire => wire.length === 5).map(six => six.split(''))
    // the one that is missing e and c is the 5
    const five = fives.splice(fives.findIndex(thisFive => ![map.e, map.c].some(letter => thisFive.includes(letter))), 1)[0]
    // the one that is missing f is the 2 (the other one it's missing is b) (we know a,b,c,d,e,f)
    const two = fives.splice(fives.findIndex(thisFive => !thisFive.includes(map.f)), 1)[0]
    const twoWithF = two.concat(map.f)
    letters.forEach(letter => {
      if (!twoWithF.includes(letter)) {
        map.b = letter
      }
    })
    // the one that is missing b and e is the 3
    // the letter not mapped yet is g
    letters.forEach(letter => {
      if (!Object.values(map).includes(letter)) {
        map.g = letter
      }
      
    })
    console.log('map', map)
    return map
}

const mappie = {
    // 1 [c,f] = [b,e]
    // 7 [a,c,f] = [e,d,b]
    // 4 [b,c,d,f] = [c,g,e,b]
    // 9 = [cbdgef]
    // 6 = [fgaecd]
    // 0 = [agebfd]
    // 5's = [fdcge], [fecdb], [fabcd]
    // 5 = [fdcge]
    // 2 = [fabcd]
    // 2withF = [fabcde]
    // 3 = [fecdb]

    a: 'd',
    e: 'a',
    c: 'b',
    f: 'e',
    d: 'c',
    b: 'g',
    g: 'f'
}

function buildBackMap(map) {
  const backMap = {}
  letters.forEach(letter => {
    backMap[map[letter]] = letter
  })
  return backMap
}

const numberMap = {
  'abcefg': 0,
  'cf': 1,
  'acdeg': 2,
  'acdfg': 3,
  'bcdf': 4,
  'abdfg': 5,
  'abdefg': 6,
  'acf': 7,
  'abcdefg': 8,
  'abcdfg': 9
}

function decodeLight(map, light) {
  console.log('light', light)
  const lightString = light
    .split('')
    .map(letter => map[letter])
    .sort()
    .join('')
  const number = numberMap[lightString]
  return number
}

lineReader.on('line', function (line) {
    const [input, output] = line.split('|').map(str => str.trim())
    const wiresArray = input.split(' ')
    const map = decodeWires(wiresArray)
    const backMap = buildBackMap(map)
    console.log('backmap', backMap)
    const lightsArray = output.split(' ')
    let lineCode = ''
    lightsArray.forEach(light => {
        const code = decodeLight(backMap, light)
        console.log('code', code)
        lineCode = lineCode.concat(String(code))
        console.log('lineCode', lineCode)
    })
    specialThings+= +lineCode
})

lineReader.on('close', function () {
    console.log("specialThings", specialThings)
})