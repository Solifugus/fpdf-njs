/**
 * Simple test runner for fpdf-njs
 * No external dependencies
 */

const fs = require('fs');
const path = require('path');

class TestRunner {
  constructor() {
    this.tests = [];
    this.results = {
      passed: 0,
      failed: 0,
      errors: []
    };
  }

  addTest(name, testFn) {
    this.tests.push({ name, testFn });
  }

  async run() {
    console.log(`\nRunning ${this.tests.length} tests...\n`);

    for (const test of this.tests) {
      try {
        await test.testFn();
        this.results.passed++;
        console.log(`  ✓ ${test.name}`);
      } catch (err) {
        this.results.failed++;
        this.results.errors.push({ test: test.name, error: err.message, stack: err.stack });
        console.log(`  ✗ ${test.name}`);
        console.log(`    Error: ${err.message}`);
      }
    }

    console.log(`\n${'='.repeat(60)}`);
    console.log(`Results: ${this.results.passed} passed, ${this.results.failed} failed`);
    console.log(`${'='.repeat(60)}\n`);

    return this.results.failed === 0;
  }
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message || 'Assertion failed');
  }
}

function assertEqual(actual, expected, message) {
  if (actual !== expected) {
    throw new Error(message || `Expected ${expected}, got ${actual}`);
  }
}

function assertExists(filepath, message) {
  if (!fs.existsSync(filepath)) {
    throw new Error(message || `File does not exist: ${filepath}`);
  }
}

function assertFileSize(filepath, minSize, message) {
  const stats = fs.statSync(filepath);
  if (stats.size < minSize) {
    throw new Error(message || `File too small: ${filepath} (${stats.size} bytes, expected >= ${minSize})`);
  }
}

function assertPDF(filepath) {
  assertExists(filepath);
  const content = fs.readFileSync(filepath, 'utf8');
  assert(content.startsWith('%PDF-'), `File ${filepath} is not a PDF (missing %PDF- header)`);
}

module.exports = {
  TestRunner,
  assert,
  assertEqual,
  assertExists,
  assertFileSize,
  assertPDF
};
