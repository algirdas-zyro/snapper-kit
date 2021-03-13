/**
 * Recursive function which constructs a CSS variable object
 *
 * 1) Prefixes current key with previousKey, if provided
 * 2) If current value is an object, recurses and passes the prefixed key as previousKey.
 * If it is not an object, there is no deeper nesting,
 * so constructed key and the value is added to the returned object.
 *
 * @param {object} obj Object to be converted to CSS variables
 * @param {string} previousKey Used in recurssion as prefix to current key
 * @returns {object} Object of constructed CSS variables
 */
export const objectToCSSVars = (object, previousKey = "") =>
  Object.entries(object).reduce((accumulator, [key, value]) => {
    const cssVariableKey = previousKey ? `${previousKey}-${key}` : `--${key}`;

    // if value is an object (via @/utils/isObject):
    return Object.prototype.toString.call(value) === "[object Object]"
      ? {
          ...accumulator,
          ...objectToCSSVars(value, cssVariableKey),
        }
      : {
          ...accumulator,
          [cssVariableKey]: value,
        };
  }, {});

export const cssVarsObjectToString = styleObject =>
  Object.entries(objectToCSSVars(styleObject)).reduce((acc, [key, value]) => {
    return (acc += `${key}:${value};`);
  }, "");
