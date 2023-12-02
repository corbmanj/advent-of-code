const lineReader = require('readline').createInterface({
    input: require('fs').createReadStream('day-3-1.txt')
});

const dataArray = []

function processData(arrayOfData) {
    let currentO2Array = [...arrayOfData]
    let currentCO2Array = [...arrayOfData]
    let bitIndex = 0
    // while there is more than one item in the array, find the mode and filter the array
    while (currentO2Array.length > 1) {
        // find the mode
        const mode = findMode(bitIndex, currentO2Array, true)
        // create a new array of strings that have the mode in current index position
        currentO2Array = filterArray(currentO2Array, bitIndex, mode)
        bitIndex++
    }
    console.log('currentO2Array:', currentO2Array)
    console.log('*******************************')

    // reset bitIndex
    bitIndex = 0
    while (currentCO2Array.length > 1) {
        // find the mode
        const mode = findMode(bitIndex, currentCO2Array)
        // create a new array of strings that have the mode in current index position
        currentCO2Array = filterArray(currentCO2Array, bitIndex, mode)
        bitIndex++
    }
    console.log('currentCO2Array:', currentCO2Array)
    console.log('*******************************')
    convertArraysToDec(currentO2Array[0], currentCO2Array[0])

}

/**
 * converts each string representation of a binary number into a decimal and calculates the product
 * @param {string} O2Binary 
 * @param {string} CO2Binary
 */
function convertArraysToDec(O2Binary, CO2Binary) {
    const O2Dec = parseInt(Number(O2Binary), 2)
    const CO2Dec = parseInt(Number(CO2Binary), 2)
    console.log("O2Dec:", O2Dec, "CO2Dec:", CO2Dec)
    console.log("life support rating:", O2Dec * CO2Dec)
}

/**
 * Filter an array down to the members who have the bit at bitIndex that matches the mode
 * @param {array} arrayOfData 
 * @param {number} bitIndex 
 * @param {0,1} mode 
 */
function filterArray(arrayOfData, bitIndex, mode) {
    return arrayOfData.filter((entry) => +entry[bitIndex] === mode)
}

// function to determine if there are more 0s or 1s
/**
 * 
 * @param {number} bitIndex 
 * @param {array} array 
 * @param {boolean} isO2 
 * @returns 0,1
 */
function findMode(bitIndex, array, isO2 = false) {
    let count = 0
    const defaultMode = isO2 ? 1 : 0
    const otherMode = isO2 ? 0 : 1
    array.forEach((val) => {
        if (val[bitIndex] === '1') {
            count = count + 1
        }
        else {
            count = count - 1
        }
    })
    if (count === 0) {
        return defaultMode
    }
    return count > 0 ? defaultMode : otherMode
}

lineReader.on('line', function (line) {
    // read in the line 11011 => '11011'
    dataArray.push(line)
})

lineReader.on('close', function () {
    processData(dataArray)
})