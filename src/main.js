'use strict';

var DragAndDropSystem = require('./dragAndDropSystem');
var action = require('./action');

module.exports = window.DragAndDropSystem = function (params) {
    return new DragAndDropSystem(params);
};

module.exports.action = action;
