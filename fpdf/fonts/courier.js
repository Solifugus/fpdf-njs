// Courier font character widths
// All characters have the same width (monospace)
const charwidths = [];
for (let i = 0; i <= 255; i++) {
  charwidths[String.fromCharCode(i)] = 600;
}

module.exports = charwidths;
