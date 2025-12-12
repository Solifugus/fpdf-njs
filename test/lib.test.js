/**
 * Test lib utility functions
 */

const { TestRunner, assert, assertEqual } = require('./test-runner');
const lib = require('../lib');

const runner = new TestRunner();

// String function tests
runner.addTest('lib.strlen', () => {
  assertEqual(lib.strlen('hello'), 5);
  assertEqual(lib.strlen(''), 0);
  assertEqual(lib.strlen(null), 0);
  assertEqual(lib.strlen(undefined), 0);
});

runner.addTest('lib.str_replace', () => {
  assertEqual(lib.str_replace('a', 'b', 'banana'), 'bbnbnb');
  assertEqual(lib.str_replace('(', '\\(', 'test(1)'), 'test\\(1)');
  assertEqual(lib.str_replace('x', 'y', 'hello'), 'hello');
});

runner.addTest('lib.substr', () => {
  assertEqual(lib.substr('hello', 0, 2), 'he');
  assertEqual(lib.substr('hello', 2), 'llo');
  assertEqual(lib.substr('hello', -2), 'lo');
  assertEqual(lib.substr('hello', 1, 3), 'ell');
});

runner.addTest('lib.strpos', () => {
  assertEqual(lib.strpos('hello', 'l'), 2);
  assertEqual(lib.strpos('hello', 'x'), false);
  assertEqual(lib.strpos('hello', 'l', 3), 3);
});

runner.addTest('lib.strrpos', () => {
  assertEqual(lib.strrpos('hello', 'l'), 3);
  assertEqual(lib.strrpos('hello', 'x'), false);
});

runner.addTest('lib.substr_count', () => {
  assertEqual(lib.substr_count('hello', 'l'), 2);
  assertEqual(lib.substr_count('hello', 'x'), 0);
  assertEqual(lib.substr_count('aaa', 'a'), 3);
});

// Type checking tests
runner.addTest('lib.is_array', () => {
  assert(lib.is_array([]) === true);
  assert(lib.is_array([1, 2, 3]) === true);
  assert(lib.is_array({}) === false);
  assert(lib.is_array('hello') === false);
  assert(lib.is_array(null) === false);
});

runner.addTest('lib.is_int', () => {
  assert(lib.is_int(5) === true);
  assert(lib.is_int(0) === true);
  assert(lib.is_int(-10) === true);
  assert(lib.is_int(3.14) === true); // Numbers in general
  assert(lib.is_int(false) === false);
  assert(lib.is_int(null) === false);
  assert(lib.is_int(undefined) === false);
  assert(lib.is_int('5') === false);
});

runner.addTest('lib.is_string', () => {
  assert(lib.is_string('hello') === true);
  assert(lib.is_string('') === true);
  assert(lib.is_string(5) === false);
  assert(lib.is_string(null) === false);
});

runner.addTest('lib.isset', () => {
  assert(lib.isset('hello') === true);
  assert(lib.isset(0) === true);
  assert(lib.isset(false) === true);
  assert(lib.isset(null) === false);
  assert(lib.isset(undefined) === false);
});

// Array function tests
runner.addTest('lib.count', () => {
  assertEqual(lib.count([1, 2, 3]), 3);
  assertEqual(lib.count([]), 0);
  assertEqual(lib.count({a: 1, b: 2}), 2);
  assertEqual(lib.count({}), 0);
  assertEqual(lib.count(null), 0);
});

runner.addTest('lib.newArray', () => {
  const arr = lib.newArray('a', 1, 'b', 2, 'c', 3);
  assertEqual(arr.a, 1);
  assertEqual(arr.b, 2);
  assertEqual(arr.c, 3);
  assertEqual(lib.count(arr), 3);
});

runner.addTest('lib.sprintf', () => {
  const result = lib.sprintf('Hello %s, you are %d years old', 'John', 25);
  assertEqual(result, 'Hello John, you are 25 years old');
});

// Run tests
if (require.main === module) {
  runner.run().then(success => {
    process.exit(success ? 0 : 1);
  });
}

module.exports = runner;
