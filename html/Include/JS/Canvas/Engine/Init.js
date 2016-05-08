/**
 * Below is an ECMA6 Object.assign polyfill, as shown on mozilla
 * To be honest, i dont agree with the code, but if it works, i guess its ok?
 *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign
 */
if (typeof Object.assign !== 'function') {
    (function () {
        Object.assign = function (target) {
            'use strict';
            if (target === undefined || target === null) {
                throw new TypeError('Cannot convert undefined or null to object');
            }

            var output = Object(target);
            for (var index = 1; index < arguments.length; index++) {
                var source = arguments[index];
                if (source !== undefined && source !== null) {
                    for (var nextKey in source) {
                        if (source.hasOwnProperty(nextKey)) {
                            output[nextKey] = source[nextKey];
                        }
                    }
                }
            }
            return output;
        };
    })();
}


/**
 * This checks if the passed parameter is an object, not an array and not null.
 *
 * http://stackoverflow.com/a/34750146/1507692
 *
 * @param item
 * @returns {boolean}
 */
function isObject(item) {
    return (item && typeof item === 'object' && !Array.isArray(item) && item !== null);
}

/**
 * Deep merge two objects.
 *
 * Modified verison of
 * http://stackoverflow.com/a/34750146/1507692
 *
 * @param target
 * @param source
 */
function mergeDeep(target, source) {
    if (isObject(target) && isObject(source)) {
        for (var key in source) {
            if (isObject(source[key])) {
                if (!isObject(target[key])) {
                    target[key] = {};
                }
                mergeDeep(target[key], source[key]);
            } else if (Array.isArray(source[key])) {
                if (!Array.isArray(target[key])) {
                    target[key] = [];
                }
                for (var akey in source[key]) {
                    if (isObject(source[key][akey])) {
                        target[key][akey] = {};
                        mergeDeep(target[key][akey], source[key][akey]);
                    } else {
                        target[key][akey] = source[key][akey];
                    }
                }
            } else {
                target[key] = source[key];
            }
        }
    } else if (Array.isArray(source)) {
        if (!Array.isArray(target)) {
            target = [];
        }
        for (var akey in source) {
            if (isObject(source[akey])) {
                target[akey] = {};
                mergeDeep(target[key][akey], source[akey]);
            } else {
                target[akey] = source[akey];
            }
        }
    } else {
        target = source;
    }
    
    return target;
}

if (typeof Number.prototype.min !== 'function') {
    Number.prototype.min = function (MinAmount) {
        if (typeof MinAmount !== "number") {
            throw new Error("Input Number.Min not number");
        }

        return (parseFloat(this, 10) < MinAmount) ? MinAmount : parseFloat(this, 10);
    }
}

if (typeof Number.prototype.max !== 'function') {
    Number.prototype.max = function (MaxAmount) {
        if (typeof MaxAmount !== "number") {
            throw new Error("Input Number.Max not number");
        }

        return (parseFloat(this, 10) > MaxAmount) ? MaxAmount : parseFloat(this, 10);
    }
}