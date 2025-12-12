/**
 * Array utilities - PHP-compatible for FPDF
 */

function count(arr) {
  if (!arr) return 0;

  // Handle arrays
  if (Array.isArray(arr)) {
    return arr.length;
  }

  // Handle objects (associative arrays in PHP)
  if (typeof arr === 'object') {
    return Object.keys(arr).length;
  }

  return 0;
}

/**
 * Creates a PHP-style associative array
 * Usage: newArray("key1", "value1", "key2", "value2", ...)
 * Returns: {key1: "value1", key2: "value2", ...}
 */
function newArray(...args) {
  const result = {};

  // Parse arguments in pairs
  for (let i = 0; i < args.length; i += 2) {
    if (i + 1 < args.length) {
      result[args[i]] = args[i + 1];
    }
  }

  return result;
}

module.exports = {
  count,
  newArray
};
