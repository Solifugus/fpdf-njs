# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

fpdf-njs is a Node.js port of FPDF for PHP, originally translated from an ASP (classic) version. **Version 2.0** represents a complete modernization - converting from legacy JScript/ASP patterns to proper Node.js best practices with zero eval() usage, comprehensive testing, and modern features like compression and image support.

**Key Features:**
- ✅ Secure (no eval, no code execution vulnerabilities)
- ✅ Modern Node.js architecture with proper modules
- ✅ Built-in compression (~40% size reduction)
- ✅ JPEG image support
- ✅ 23 automated tests (100% passing)
- ✅ Only one dependency: sprintf-js

## Commands

### Testing
```bash
npm test              # Run all 23 tests (lib + core)
npm run test:lib      # Test lib utility functions only
npm run test:core     # Test PDF generation only
npm run example       # Run basic example (creates example.pdf)
```

The test suite includes:
- 13 lib utility tests (string, array, type checking, file I/O)
- 10 core PDF tests (generation, fonts, shapes, colors, compression)
- All tests use custom test-runner.js (no external test frameworks)

## Architecture

### Core Components

**fpdf.js (1328 lines)**: The main FPDF class containing all PDF generation logic. This is a large, monolithic file implementing the complete FPDF API. Key characteristics:
- Uses function-scoped variables (not ES6 classes)
- Implements a closure-based architecture with internal state
- All public methods are attached to `this` (e.g., `this.CreatePDF`, `this.AddPage`)
- Requires calling `CreatePDF()` after instantiation to initialize the PDF object

**Initialization Pattern**: Unlike the PHP version, you must explicitly call `CreatePDF()`:
```javascript
var pdf = new FPDF();
pdf.CreatePDF();  // Required - initializes internal state
pdf.AddPage();
// ... continue with normal FPDF API calls
```

### Directory Structure

**lib/**: Utility modules (NEW in v2.0)
- `index.js` - Main exports for all utilities
- `string.js` - PHP-compatible string functions (strlen, str_replace, substr, etc.)
- `type.js` - Type checking (is_array, is_int, is_string, isset)
- `array.js` - Array operations (count, newArray for associative arrays)
- `file.js` - File I/O (filesize, readtextfile, readbinfile)
- `extension.js` - Safe extension loading (loadExtension, extendMethod)
- `compression.js` - zlib compression (gzcompress, gzuncompress)
- `image.js` - ImageParser class for JPEG/PNG/GIF parsing

**test/**: Test suite (NEW in v2.0)
- `test-runner.js` - Custom test framework (no dependencies)
- `lib.test.js` - Tests for lib utilities (13 tests)
- `core.test.js` - Tests for PDF generation (10 tests)
- `run-all.js` - Runs complete test suite
- `output/` - Generated test PDFs

**fpdf/fonts/**: Font definition files (.js format)
- Core fonts: Courier, Helvetica, Times, Symbol, ZapfDingbats
- **Note**: `courier.js` uses new module.exports format; others use legacy format (still supported)

**fpdf/extends/**: Extension files (.ext format) - add functionality to FPDF
- bookmarks.ext - PDF bookmarks/outlines
- circle.ext - Circle and ellipse drawing
- roundrect.ext - Rounded rectangles
- tablemulticell.ext - Tables with multi-cell support
- sectors.ext - Pie chart sectors
- **Note**: Use new extension format with `module.exports` function (see Extension System below)

**fpdf/models/**: Template files (.mod format) - currently empty

**fpdf/includes/**: Legacy ASP files (not used, preserved for reference)

### Extension System

Extensions use the `ExtendsCode()` method to inject code into existing methods at runtime:
```javascript
// From bookmarks.ext
code = function tempfunc() {
    this._putbookmarks();
}
this.ExtendsCode("_putresources", code);
```

This dynamically modifies the specified method by appending the new code before the closing brace. Load extensions using:
```javascript
pdf.LoadExtensions("bookmarks");  // Loads fpdf/extends/bookmarks.ext
```

### Output Method

The `Output()` method differs from PHP version with Node.js-specific behavior:
- `Output('F', 'filename.pdf')` - Write to file (uses fs.writeFileSync)
- `Output('I', 'filename.pdf', false, res)` - Send as download via Express response object
- `Output('D', 'filename.pdf', false, res)` - Display inline via Express response object
- `Output('S')` - Return as string (returns this.buffer)

The fourth parameter accepts an Express response object for web framework integration.

### Path Configuration

`SetPath()` configures base paths for resources:
```javascript
pdf.SetPath("./fpdf/");  // Sets FONTPATH, EXTENDSPATH, MODELSPATH
```

This is called automatically by `CreatePDF()` with default "./fpdf/" but can be customized for different directory structures.

## Key Features & Differences from PHP FPDF

### Initialization
Must call `CreatePDF()` after instantiation (unlike PHP version):
```javascript
const pdf = new FPDF();
pdf.CreatePDF();  // REQUIRED - initializes internal state
pdf.AddPage();
```

### Security (v2.0)
- **Zero eval() usage** - all code uses proper `require()` and module loading
- Font loading: Uses `require()` with module.exports
- Extensions: Safe module-based loading with `loadExtension()`
- No arbitrary code execution vulnerabilities

### Compression (v2.0)
- **Built-in support** using Node.js zlib
- Enabled by default: `SetCompression(true)`
- Reduces file size by ~40% for typical documents
- Uses `deflate` algorithm (PDF's FlateDecode filter)

### Image Support (v2.0)
- **JPEG fully supported** via ImageParser class
- PNG and GIF header parsing included
- No external image dependencies
- Usage: `pdf.Image('photo.jpg', x, y, width)`

### Output Method
- Rewritten for Node.js with Express integration
- Fourth parameter accepts Express response object
- Modes: 'F' (file), 'I' (download), 'D' (inline display), 'S' (string)

### lib Module (v2.0)
- Complete PHP-compatible utility library
- Replaces 68+ undefined function calls from original conversion
- All functions properly scoped (no global pollution)

## API Compatibility

The API closely mirrors the PHP FPDF documentation at http://fpdf.org. Translate PHP examples by:
- Removing `<?php ?>` tags
- Using `require()` instead of `require()`
- Calling `new FPDF()` then `CreatePDF()`
- Converting `$pdf->Method()` to `pdf.Method()`
- Adjusting Output() parameters for Node.js environment
