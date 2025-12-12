/**
 * Compression utilities for FPDF
 * Uses Node.js zlib for PDF stream compression
 */

const zlib = require('zlib');

/**
 * Compress data using deflate (PDF's FlateDecode filter)
 * @param {string|Buffer} data - Data to compress
 * @param {number} level - Compression level (0-9, default 6)
 * @returns {Buffer} Compressed data
 */
function gzcompress(data, level = 6) {
  try {
    // Convert string to buffer if needed
    const buffer = Buffer.isBuffer(data) ? data : Buffer.from(data, 'latin1');

    // Use deflate (compatible with PDF's FlateDecode filter)
    return zlib.deflateSync(buffer, { level });
  } catch (err) {
    console.error('Compression error:', err.message);
    // Return uncompressed on error
    return Buffer.isBuffer(data) ? data : Buffer.from(data, 'latin1');
  }
}

/**
 * Decompress deflate-compressed data
 * @param {Buffer} data - Compressed data
 * @returns {Buffer} Decompressed data
 */
function gzuncompress(data) {
  try {
    const buffer = Buffer.isBuffer(data) ? data : Buffer.from(data, 'latin1');
    return zlib.inflateSync(buffer);
  } catch (err) {
    console.error('Decompression error:', err.message);
    return data;
  }
}

module.exports = {
  gzcompress,
  gzuncompress
};
