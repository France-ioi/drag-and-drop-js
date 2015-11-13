"use strict";

if (/MSIE\s([\d.]+)/.test(navigator.userAgent))
    module.exports['ie'+parseInt(RegExp.$1, 10)] = true;

module.exports.notIn = function (elem, elems) {
    for (var i = 0, j = elems.length; i < j; i++) {
        if (elems[i] === elem) return false;
    }
    return true;
};

module.exports.isUndefined = function (val) {
    return typeof val === 'undefined';
};
