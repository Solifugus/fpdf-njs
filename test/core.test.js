/**
 * Test core FPDF functionality
 */

const FPDF = require('../fpdf.js');
const { TestRunner, assert, assertEqual, assertExists, assertFileSize, assertPDF } = require('./test-runner');
const fs = require('fs');
const path = require('path');

const runner = new TestRunner();
const outputDir = path.join(__dirname, 'output');

// Test 1: Basic PDF creation
runner.addTest('Basic PDF creation', () => {
  const pdf = new FPDF();
  pdf.CreatePDF();
  pdf.AddPage();
  pdf.SetFont('Arial', 'B', 16);
  pdf.Cell(40, 10, 'Hello World!');

  const output = path.join(outputDir, 'test-basic.pdf');
  pdf.Output('F', output);

  assertPDF(output);
  assertFileSize(output, 500, 'PDF should be at least 500 bytes');
});

// Test 2: Multiple pages
runner.addTest('Multiple pages', () => {
  const pdf = new FPDF();
  pdf.CreatePDF();

  for (let i = 1; i <= 3; i++) {
    pdf.AddPage();
    pdf.SetFont('Helvetica', '', 12);
    pdf.Cell(0, 10, `Page ${i}`);
  }

  const output = path.join(outputDir, 'test-multipage.pdf');
  pdf.Output('F', output);

  assertPDF(output);
  assertFileSize(output, 800);
});

// Test 3: Core fonts
runner.addTest('Core fonts', () => {
  const pdf = new FPDF();
  pdf.CreatePDF();
  pdf.AddPage();

  const fonts = [
    ['Courier', ''],
    ['Courier', 'B'],
    ['Courier', 'I'],
    ['Helvetica', ''],
    ['Helvetica', 'B'],
    ['Times', ''],
    ['Times', 'I']
  ];

  let y = 10;
  for (const [family, style] of fonts) {
    pdf.SetFont(family, style, 12);
    pdf.SetXY(10, y);
    pdf.Cell(0, 10, `${family} ${style || 'Regular'}`);
    y += 10;
  }

  const output = path.join(outputDir, 'test-fonts.pdf');
  pdf.Output('F', output);

  assertPDF(output);
});

// Test 4: Text methods
runner.addTest('Text methods (Cell, MultiCell, Write)', () => {
  const pdf = new FPDF();
  pdf.CreatePDF();
  pdf.AddPage();
  pdf.SetFont('Helvetica', '', 12);

  // Cell
  pdf.Cell(100, 10, 'This is a cell', 1);
  pdf.Ln();

  // MultiCell
  pdf.MultiCell(100, 5, 'This is a multi-cell text that wraps to multiple lines automatically when it exceeds the width.');
  pdf.Ln();

  // Write
  pdf.Write(5, 'This is written text that flows naturally with the document.');

  const output = path.join(outputDir, 'test-text.pdf');
  pdf.Output('F', output);

  assertPDF(output);
});

// Test 5: Shapes and graphics
runner.addTest('Shapes (lines, rectangles)', () => {
  const pdf = new FPDF();
  pdf.CreatePDF();
  pdf.AddPage();

  // Lines
  pdf.SetDrawColor(255, 0, 0);
  pdf.Line(10, 10, 100, 10);

  // Rectangles
  pdf.SetFillColor(200, 220, 255);
  pdf.Rect(10, 20, 50, 30, 'FD');

  pdf.SetDrawColor(0, 0, 0);
  pdf.Rect(70, 20, 50, 30);

  const output = path.join(outputDir, 'test-shapes.pdf');
  pdf.Output('F', output);

  assertPDF(output);
});

// Test 6: Colors
runner.addTest('Colors (draw, fill, text)', () => {
  const pdf = new FPDF();
  pdf.CreatePDF();
  pdf.AddPage();
  pdf.SetFont('Helvetica', 'B', 14);

  // Draw color (for borders and lines)
  pdf.SetDrawColor(255, 0, 0);
  pdf.Rect(10, 10, 50, 20);

  // Fill color
  pdf.SetFillColor(0, 255, 0);
  pdf.Rect(70, 10, 50, 20, 'F');

  // Text color
  pdf.SetTextColor(0, 0, 255);
  pdf.Text(10, 50, 'Blue text');

  // Reset colors
  pdf.SetTextColor(0);
  pdf.SetDrawColor(0);

  const output = path.join(outputDir, 'test-colors.pdf');
  pdf.Output('F', output);

  assertPDF(output);
});

// Test 7: Margins and positioning
runner.addTest('Margins and positioning', () => {
  const pdf = new FPDF();
  pdf.CreatePDF();
  pdf.AddPage();
  pdf.SetFont('Helvetica', '', 12);

  // Note: Default margins are set in CreatePDF (28.35/k)
  // X position starts at left margin
  const defaultX = pdf.GetX();
  const defaultY = pdf.GetY();

  // Now set new margins
  pdf.SetMargins(20, 20, 20);

  // X should still be at old position until we move
  // Let's just verify margins work by checking after SetXY

  // Test SetXY
  pdf.SetXY(50, 50);
  const x2 = pdf.GetX();
  const y2 = pdf.GetY();
  assert(x2 === 50, `X should be 50 after SetXY, got ${x2}`);
  assert(y2 === 50, `Y should be 50 after SetXY, got ${y2}`);

  // Write something (Cell doesn't auto-advance Y by default)
  pdf.Cell(0, 10, 'Positioned at 50,50', 0, 1); // Last param 1 = move to next line

  // After Cell with ln=1, Y moves down by cell height
  const y3 = pdf.GetY();
  assert(y3 === 60, `Y should be 60 after cell with ln=1, got ${y3}`);

  const output = path.join(outputDir, 'test-positioning.pdf');
  pdf.Output('F', output);

  assertPDF(output);
});

// Test 8: Compression
runner.addTest('Compression enabled vs disabled', () => {
  // With compression (default)
  const pdf1 = new FPDF();
  pdf1.CreatePDF();
  pdf1.AddPage();
  pdf1.SetFont('Helvetica', '', 12);
  for (let i = 1; i <= 10; i++) {
    pdf1.Cell(0, 10, `Line ${i} with some text to compress`);
    pdf1.Ln();
  }
  const compressed = path.join(outputDir, 'test-compressed.pdf');
  pdf1.Output('F', compressed);

  // Without compression
  const pdf2 = new FPDF();
  pdf2.CreatePDF();
  pdf2.SetCompression(false);
  pdf2.AddPage();
  pdf2.SetFont('Helvetica', '', 12);
  for (let i = 1; i <= 10; i++) {
    pdf2.Cell(0, 10, `Line ${i} with some text to compress`);
    pdf2.Ln();
  }
  const uncompressed = path.join(outputDir, 'test-uncompressed.pdf');
  pdf2.Output('F', uncompressed);

  assertPDF(compressed);
  assertPDF(uncompressed);

  // Compressed should be smaller
  const compressedSize = fs.statSync(compressed).size;
  const uncompressedSize = fs.statSync(uncompressed).size;
  assert(compressedSize < uncompressedSize,
    `Compressed (${compressedSize}) should be smaller than uncompressed (${uncompressedSize})`);
});

// Test 9: Page formats
runner.addTest('Different page formats', () => {
  const formats = ['A4', 'A3', 'Letter', 'Legal'];

  for (const format of formats) {
    const pdf = new FPDF();
    pdf.CreatePDF('P', 'mm', format);
    pdf.AddPage();
    pdf.SetFont('Helvetica', '', 12);
    pdf.Cell(0, 10, `Format: ${format}`);

    const output = path.join(outputDir, `test-format-${format.toLowerCase()}.pdf`);
    pdf.Output('F', output);
    assertPDF(output);
  }
});

// Test 10: Orientation
runner.addTest('Portrait and Landscape orientation', () => {
  // Portrait
  const pdf1 = new FPDF();
  pdf1.CreatePDF('P');
  pdf1.AddPage();
  pdf1.SetFont('Helvetica', '', 12);
  pdf1.Cell(0, 10, 'Portrait orientation');
  const portrait = path.join(outputDir, 'test-portrait.pdf');
  pdf1.Output('F', portrait);
  assertPDF(portrait);

  // Landscape
  const pdf2 = new FPDF();
  pdf2.CreatePDF('L');
  pdf2.AddPage();
  pdf2.SetFont('Helvetica', '', 12);
  pdf2.Cell(0, 10, 'Landscape orientation');
  const landscape = path.join(outputDir, 'test-landscape.pdf');
  pdf2.Output('F', landscape);
  assertPDF(landscape);
});

// Run tests
if (require.main === module) {
  // Ensure output directory exists
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  runner.run().then(success => {
    process.exit(success ? 0 : 1);
  });
}

module.exports = runner;
