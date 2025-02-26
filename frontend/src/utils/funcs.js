export function isCategorical(arr, uniqueThreshold = 0.1) {
    // ======================
    // // Example usage:
    // const categoricalData = [1, 2, 1, 2, 3, 3, 3]; // Few unique integers
    // const continuousData = [1.1, 2.3, 3.5, 4.7];    // Decimal values
    // const stringData = ["red", "blue", "green"];     // Non-numeric
    //
    // console.log(isCategorical(categoricalData)); // true
    // console.log(isCategorical(continuousData));  // false
    // console.log(isCategorical(stringData));      // true
    // ======================

    // Edge case: Empty array
    if (arr.length === 0) return false;

    // Check if all values are non-numeric
    const allNonNumeric = arr.every(x => typeof x !== 'number');
    if (allNonNumeric) return true; // Definitely categorical

    // Check unique values for numeric arrays
    const uniqueValues = new Set(arr).size;
    let isFewUniques = false
    if(uniqueThreshold < 1 ){
        isFewUniques = uniqueValues / arr.length <= uniqueThreshold;
    }else{
        isFewUniques = uniqueValues <= uniqueThreshold;
    }

    // Check if values are integers (common for categorical data)
    const allIntegers = arr.every(x => Number.isInteger(x));

    return isFewUniques && allIntegers;
}

