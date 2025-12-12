/**
 * FPDF Utility Library
 * PHP-compatible functions for Node.js
 */

const string = require('./string');
const type = require('./type');
const array = require('./array');
const file = require('./file');
const sprintf = require('sprintf-js').sprintf;

module.exports = {
  // String operations
  strlen: string.strlen,
  str_replace: string.str_replace,
  substr: string.substr,
  strpos: string.strpos,
  strrpos: string.strrpos,
  substr_count: string.substr_count,

  // Type checking
  is_array: type.is_array,
  is_int: type.is_int,
  is_string: type.is_string,
  isset: type.isset,

  // Array operations
  count: array.count,
  newArray: array.newArray,

  // File I/O
  filesize: file.filesize,
  readtextfile: file.readtextfile,
  readbinfile: file.readbinfile,

  // Formatting
  sprintf: sprintf
};
