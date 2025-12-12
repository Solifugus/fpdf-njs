/**
 * Safe extension loading system for FPDF
 * Replaces eval-based extension loading
 */

/**
 * Load an extension module and apply it to the FPDF instance
 * @param {Object} fpdfInstance - The FPDF instance to extend
 * @param {string} extensionPath - Path to the extension file
 */
function loadExtension(fpdfInstance, extensionPath) {
  try {
    const extension = require(extensionPath);

    if (typeof extension !== 'function') {
      throw new Error('Extension must export a function that receives the FPDF instance');
    }

    // Call the extension function with the FPDF instance as context
    extension.call(fpdfInstance, fpdfInstance);

  } catch (err) {
    // If module doesn't exist or has errors, provide helpful message
    console.error(`Failed to load extension ${extensionPath}:`, err.message);
    throw err;
  }
}

/**
 * Extend an existing method by wrapping it
 * @param {Object} fpdfInstance - The FPDF instance
 * @param {string} methodName - Name of the method to extend
 * @param {Function} wrapper - Wrapper function that receives (original, ...args)
 */
function extendMethod(fpdfInstance, methodName, wrapper) {
  const original = fpdfInstance[methodName];

  if (typeof original !== 'function') {
    throw new Error(`Method ${methodName} does not exist or is not a function`);
  }

  // Create new wrapped method
  fpdfInstance[methodName] = function(...args) {
    // Call wrapper with original function as first argument
    return wrapper.call(this, original, ...args);
  };
}

module.exports = {
  loadExtension,
  extendMethod
};
