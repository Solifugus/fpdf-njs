/**
 * Run all test suites
 */

const coreTests = require('./core.test.js');
const libTests = require('./lib.test.js');

async function runAllTests() {
  console.log('\n' + '='.repeat(60));
  console.log('  FPDF-NJS Test Suite');
  console.log('='.repeat(60));

  let allPassed = true;

  console.log('\n📚 Library Tests');
  console.log('-'.repeat(60));
  allPassed = await libTests.run() && allPassed;

  console.log('\n📄 Core PDF Tests');
  console.log('-'.repeat(60));
  allPassed = await coreTests.run() && allPassed;

  console.log('\n' + '='.repeat(60));
  if (allPassed) {
    console.log('  ✅ ALL TESTS PASSED');
  } else {
    console.log('  ❌ SOME TESTS FAILED');
  }
  console.log('='.repeat(60) + '\n');

  process.exit(allPassed ? 0 : 1);
}

runAllTests();
