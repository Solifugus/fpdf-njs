
# FPDF-NJS

**Lightweight PDF generation for Node.js**

Node.js version of FPDF (originally from PHP), providing low-level control over PDF document creation with minimal dependencies. No TypeScript, no CoffeeScript, no bloat - just pure JavaScript PDF generation.

## Features

- ✅ **Secure**: Zero eval() calls, no code execution vulnerabilities
- ✅ **Modern**: Proper Node.js modules and best practices
- ✅ **Compression**: Built-in zlib compression (~40% size reduction)
- ✅ **Images**: JPEG image embedding support
- ✅ **Tested**: 23 automated tests, 100% passing
- ✅ **Compatible**: Maintains PHP FPDF API compatibility
- ✅ **Lightweight**: Only depends on sprintf-js

## Installation

```bash
npm install fpdf-njs
```

## Quick Start

```javascript
const FPDF = require('fpdf-njs');

const pdf = new FPDF();
pdf.CreatePDF();
pdf.AddPage();
pdf.SetFont('Arial', 'B', 16);
pdf.Cell(40, 10, 'Hello World!');
pdf.Output('F', 'example.pdf');
```

## Description

This library exports the FPDF object that implements an API for the creation of PDF documents through low level controls. It provides flexibility without much learning curve. Skills in PHP FPDF are directly translatable to this Node.js module.


## New in Version 2.0

- **Security**: Eliminated all eval() usage
- **Compression**: PDF stream compression with zlib
- **Images**: JPEG image embedding
- **Testing**: Comprehensive test suite
- **Code Quality**: Modern JavaScript, no global pollution
- **Extensions**: Safe extension system

## Documentation

The API is compatible with PHP FPDF. Refer to the [official FPDF documentation](http://fpdf.org) and translate PHP syntax to JavaScript. See examples below:

Differences from PHP Version

While converting, I noticed not everything is identical to the original PHP 
version.  I modified a few things to bring it more into compliance.  I 
completely rewrote the .Output() method for compliance.  And to work with
the Express web framework, I added an extra parameter in which to put the
Express response object.  Of course, that isn't necessary.  The option to
write a file to disk or return as a string could be used, if you are not
using Express.

PHP Version
--------------------------------------

<?php
require('fpdf.php');

$pdf = new FPDF();
$pdf->AddPage();
$pdf->SetFont('Arial','B',16);
$pdf->Cell(40,10,'Hello World!');
$pdf->Output('F','example.pdf');
?>

-------------------------------------

### Node.js Translation

```javascript
const FPDF = require('fpdf-njs');

const pdf = new FPDF();
pdf.CreatePDF();  // Required initialization
pdf.AddPage();
pdf.SetFont('Arial', 'B', 16);
pdf.Cell(40, 10, 'Hello World!');
pdf.Output('F', 'output.pdf');
```

## More Examples

### Multiple Pages with Different Fonts

```javascript
const pdf = new FPDF();
pdf.CreatePDF();

pdf.AddPage();
pdf.SetFont('Helvetica', 'B', 20);
pdf.Cell(0, 10, 'Page 1 - Helvetica Bold', 0, 1);

pdf.AddPage();
pdf.SetFont('Times', 'I', 16);
pdf.Cell(0, 10, 'Page 2 - Times Italic', 0, 1);

pdf.Output('F', 'multipage.pdf');
```

### With Compression

```javascript
const pdf = new FPDF();
pdf.CreatePDF();
pdf.SetCompression(true);  // Enable compression (default)

pdf.AddPage();
pdf.SetFont('Arial', '', 12);
for (let i = 1; i <= 50; i++) {
  pdf.Cell(0, 10, `Line ${i}`, 0, 1);
}

pdf.Output('F', 'compressed.pdf');
// File will be ~40% smaller
```

### Images (JPEG)

```javascript
const pdf = new FPDF();
pdf.CreatePDF();
pdf.AddPage();

// Embed JPEG image at position (10, 10) with width 50mm
pdf.Image('photo.jpg', 10, 10, 50);

pdf.Output('F', 'with-image.pdf');
```

### Shapes and Colors

```javascript
const pdf = new FPDF();
pdf.CreatePDF();
pdf.AddPage();

// Red rectangle
pdf.SetFillColor(255, 0, 0);
pdf.Rect(10, 10, 50, 30, 'F');

// Blue circle (requires circle extension)
pdf.SetDrawColor(0, 0, 255);
pdf.Circle(100, 50, 20);

pdf.Output('F', 'shapes.pdf');
```

## Testing

```bash
npm test              # Run all tests
npm run test:lib      # Test utilities only
npm run test:core     # Test PDF generation
npm run example       # Run basic example
```

## API Differences from PHP

1. **Initialization**: Must call `CreatePDF()` after instantiation
2. **Output**: Fourth parameter accepts Express response object for web apps
3. **require vs include**: Use Node.js `require()` instead of PHP includes

## Credits

- Original PHP version: Olivier Plathey
- ASP version: Lorenzo Abbati
- Node.js conversion: Matthew C. Tedder
- Version 2.0 modernization: Complete JScript to Node.js conversion

## License

MIT

---





