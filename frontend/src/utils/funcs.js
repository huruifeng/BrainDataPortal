export function isCategorical(arr, uniqueThreshold = 20) {
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

    const hasStrings = arr.some(x => typeof x === 'string');
    if (hasStrings) return true;

    // Check unique values for numeric arrays
    const uniqueValues = new Set(arr).size;
    let isFewUniques = false
    if (uniqueThreshold < 1) {
        isFewUniques = uniqueValues / arr.length <= uniqueThreshold;
    } else {
        isFewUniques = uniqueValues <= uniqueThreshold;
    }

    // Check if values are integers (common for categorical data)
    const allIntegers = arr.every(x => Number.isInteger(x));

    return isFewUniques && allIntegers;
}


// Safe calculation for min/max
export const calculateMinMax = (arr) => {
  if (arr.length === 0) return [0, 0];

  let min = Infinity;
  let max = -Infinity;

  for (const val of arr) {
    if (typeof val === 'number' && !isNaN(val)) {
      if (val < min) min = val;
      if (val > max) max = val;
    }
  }

  return [min === Infinity ? 0 : min, max === -Infinity ? 0 : max];
};

