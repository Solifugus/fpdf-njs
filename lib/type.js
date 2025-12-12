/**
 * Type checking utilities - PHP-compatible for FPDF
 */

function is_array(value) {
  return Array.isArray(value);
}

function is_int(value) {
  // In PHP context for FPDF, strpos returns int >= 0 or false
  // This function checks if value is a valid number (not false/null/undefined)
  return typeof value === 'number' && isFinite(value) && !isNaN(value);
}

function is_string(value) {
  return typeof value === 'string';
}

function isset(value) {
  return value !== null && value !== undefined;
}

module.exports = {
  is_array,
  is_int,
  is_string,
  isset
};
