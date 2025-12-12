/**
 * File I/O utilities - PHP-compatible for FPDF
 */

const fs = require('fs');

function filesize(filepath) {
  try {
    const stats = fs.statSync(filepath);
    return stats.size;
  } catch (err) {
    return false;
  }
}

function readtextfile(filepath) {
  try {
    return fs.readFileSync(filepath, 'utf8');
  } catch (err) {
    console.error(`Error reading text file ${filepath}:`, err.message);
    return '';
  }
}

function readbinfile(filepath) {
  try {
    return fs.readFileSync(filepath);
  } catch (err) {
    console.error(`Error reading binary file ${filepath}:`, err.message);
    return Buffer.alloc(0);
  }
}

module.exports = {
  filesize,
  readtextfile,
  readbinfile
};
