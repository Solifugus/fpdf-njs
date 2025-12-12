/**
 * Lightweight image parser for FPDF
 * Replaces ASP-specific cImage class
 * Supports: JPEG (fully), PNG (basic)
 */

const fs = require('fs');

class ImageParser {
  constructor() {
    this.data = null;
    this.width = 0;
    this.height = 0;
    this.type = null;
    this.bits = 8;
    this.channels = 3;
    this.size = 0;
  }

  /**
   * Open and parse an image file
   * @param {string} filepath - Path to image file
   * @returns {boolean} Success status
   */
  open(filepath) {
    try {
      this.data = fs.readFileSync(filepath);
      this.size = this.data.length;

      // Detect image type from magic bytes
      if (this.data[0] === 0xFF && this.data[1] === 0xD8) {
        this.type = 'jpeg';
        this.parseJPEG();
      } else if (this.data[0] === 0x89 && this.data[1] === 0x50 &&
                 this.data[2] === 0x4E && this.data[3] === 0x47) {
        this.type = 'png';
        this.parsePNG();
      } else if (this.data[0] === 0x47 && this.data[1] === 0x49 &&
                 this.data[2] === 0x46) {
        this.type = 'gif';
        this.parseGIF();
      } else {
        throw new Error('Unsupported image format (not JPEG, PNG, or GIF)');
      }

      return true;
    } catch (err) {
      console.error(`Error opening image ${filepath}:`, err.message);
      return false;
    }
  }

  /**
   * Parse JPEG image headers
   */
  parseJPEG() {
    let pos = 2; // Skip SOI marker (0xFFD8)

    while (pos < this.data.length) {
      // Find next marker
      if (this.data[pos] !== 0xFF) break;

      const marker = this.data[pos + 1];
      pos += 2;

      // Skip padding bytes
      while (this.data[pos] === 0xFF) pos++;

      // SOF markers (Start Of Frame) - these contain image dimensions
      if ((marker >= 0xC0 && marker <= 0xC3) ||
          (marker >= 0xC5 && marker <= 0xC7) ||
          (marker >= 0xC9 && marker <= 0xCB) ||
          (marker >= 0xCD && marker <= 0xCF)) {

        // Read segment length (big-endian)
        const segmentLength = (this.data[pos] << 8) | this.data[pos + 1];
        pos += 2;

        // Read precision (bits per component)
        this.bits = this.data[pos++];

        // Read dimensions (big-endian)
        this.height = (this.data[pos] << 8) | this.data[pos + 1];
        pos += 2;
        this.width = (this.data[pos] << 8) | this.data[pos + 1];
        pos += 2;

        // Read number of components (channels)
        this.channels = this.data[pos];

        break;
      } else if (marker === 0xD8 || marker === 0xD9) {
        // SOI/EOI markers have no length
        continue;
      } else if (marker === 0x01 || (marker >= 0xD0 && marker <= 0xD7)) {
        // Standalone markers
        continue;
      } else {
        // Read segment length and skip segment
        const segmentLength = (this.data[pos] << 8) | this.data[pos + 1];
        pos += segmentLength;
      }
    }
  }

  /**
   * Parse PNG image headers
   */
  parsePNG() {
    // PNG signature is 8 bytes, followed by IHDR chunk
    // IHDR chunk structure:
    // - 4 bytes: length (always 13 for IHDR)
    // - 4 bytes: chunk type "IHDR"
    // - 13 bytes: chunk data
    // - 4 bytes: CRC

    const ihdrStart = 8; // After PNG signature
    const ihdrData = 16; // 8 (sig) + 4 (len) + 4 (type)

    // Read IHDR chunk
    this.width = this.data.readUInt32BE(ihdrData);
    this.height = this.data.readUInt32BE(ihdrData + 4);
    this.bits = this.data[ihdrData + 8];

    const colorType = this.data[ihdrData + 9];
    // Color type: 0=grayscale, 2=RGB, 3=indexed, 4=gray+alpha, 6=RGBA
    switch (colorType) {
      case 0:
      case 3:
        this.channels = 1;
        break;
      case 2:
        this.channels = 3;
        break;
      case 4:
        this.channels = 2;
        break;
      case 6:
        this.channels = 4;
        break;
      default:
        this.channels = 3;
    }
  }

  /**
   * Parse GIF image headers
   */
  parseGIF() {
    // GIF header: 6 bytes (GIF89a or GIF87a)
    // Logical Screen Descriptor starts at byte 6

    // Width and height are little-endian 16-bit integers
    this.width = this.data[6] | (this.data[7] << 8);
    this.height = this.data[8] | (this.data[9] << 8);

    const packed = this.data[10];
    // Bits 0-2 contain the size of the global color table
    this.bits = (packed & 0x07) + 1;
    this.channels = 3; // GIF is always RGB (palette-based)
  }

  /**
   * Get the raw image data buffer
   * @returns {Buffer} Image data
   */
  getBuffer() {
    return this.data;
  }

  /**
   * Close and cleanup
   */
  close() {
    this.data = null;
  }

  /**
   * Get image type ID for legacy compatibility
   * @returns {number} Type ID (1=GIF, 2=JPEG, 3=PNG)
   */
  get id() {
    switch (this.type) {
      case 'jpeg': return 2;
      case 'png': return 3;
      case 'gif': return 1;
      default: return 0;
    }
  }

  /**
   * Legacy property accessors for compatibility
   */
  get ['id']() { return this.id; }
  get ['width']() { return this.width; }
  get ['height']() { return this.height; }
  get ['bits']() { return this.bits; }
  get ['channels']() { return this.channels; }

  /**
   * Legacy method for compatibility
   */
  Open(filepath) {
    return this.open(filepath);
  }

  GetBuffer() {
    return this.getBuffer();
  }

  Close() {
    return this.close();
  }
}

module.exports = ImageParser;
