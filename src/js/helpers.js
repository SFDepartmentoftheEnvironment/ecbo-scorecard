/** **** helper functions *******/

// Get URL parameters
// see also: http://snipplr.com/view/19838
// Usage: `map = getUrlVars()` while at example.html?foo=asdf&bar=jkls
// sets map['foo']='asdf' and map['bar']='jkls'
function getUrlVars () {
  var vars = {}
  window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi,
    function (m, key, value) {
      vars[key] = value
    })
  return vars
}

function onlyNumbers (val) {
  return (typeof parseInt(val) === 'number' && !isNaN(val)) ? parseInt(val) : -1
}

/** @function objArrayToSortedNumArray
 * given an array of objects, return an array that is just the values of property "key"
 * @param {object[]} objArray
 * @param {string} key - property of object in objArray to find, value pair assumed to be type number
 * @returns {array}
 * @example
 *  // returns [1,2]
 * objArrayToSortedNumArray([{id:2, name:"foo"}, {id:1, name:"bar"}], 'id');
 */
function objArrayToSortedNumArray (objArray, key) {
  return objArray.map(function (el) { return el[key] }).sort(function (a, b) { return a - b })
}

/** @function numberWithCommas
 * add 1000s-place commas to a number
 * @param {number} x
 * @returns {string}
 */
function numberWithCommas (x) {
  if (typeof x === 'undefined') return 'and above'
  var parts = x.toString().split('.')
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  return parts.join('.')
}

/** @function arrayQuartiles
 * find the quartiles of a sorted array of numbers
 * @param {number[]} sortedArr
 * @returns {array}
 */
function arrayQuartiles (sortedArr) {
  return [
    d3.quantile(sortedArr, 0.25),
    d3.quantile(sortedArr, 0.5),
    d3.quantile(sortedArr, 0.75)
  ]
}

export { getUrlVars, objArrayToSortedNumArray, numberWithCommas, arrayQuartiles }
