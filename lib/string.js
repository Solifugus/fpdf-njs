/**
 * String utility functions - PHP-compatible for FPDF
 */

function strlen(str) {
  if (str === null || str === undefined) return 0;
  return String(str).length;
}

function str_replace(search, replace, subject) {
  if (typeof search === 'string') {
    // Escape regex special characters
    const escaped = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return subject.replace(new RegExp(escaped, 'g'), replace);
  }
  // Handle array of searches
  let result = subject;
  for (let i = 0; i < search.length; i++) {
    result = str_replace(search[i], replace[i] || '', result);
  }
  return result;
}

function substr(str, start, length) {
  if (str === null || str === undefined) return '';
  str = String(str);

  // Handle negative start
  if (start < 0) {
    start = str.length + start;
  }

  // No length specified - return rest of string
  if (length === undefined) {
    return str.substring(start);
  }

  // Handle negative length
  if (length < 0) {
    length = str.length + length - start;
  }

  return str.substring(start, start + length);
}

function strpos(haystack, needle, offset = 0) {
  if (haystack === null || haystack === undefined) return false;
  const pos = String(haystack).indexOf(needle, offset);
  return pos === -1 ? false : pos;
}

function strrpos(haystack, needle) {
  if (haystack === null || haystack === undefined) return false;
  const pos = String(haystack).lastIndexOf(needle);
  return pos === -1 ? false : pos;
}

function substr_count(haystack, needle) {
  if (!haystack || !needle) return 0;
  const escaped = needle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const matches = String(haystack).match(new RegExp(escaped, 'g'));
  return matches ? matches.length : 0;
}

module.exports = {
  strlen,
  str_replace,
  substr,
  strpos,
  strrpos,
  substr_count
};
