'use strict';

var component = require('./component');

module.exports = DraggableElement;

function DraggableElement(container, iPlace, ident, element) {
    this.dragAndDropSystem = container.dragAndDropSystem;
    this.ident = ident;
    this.container = container;
    this.iPlace = iPlace;
    this.component = component(element);
    this.dragState = null;
    this.crossShape = null;
    var self = this;
    this.component.drag(
        function (dx, dy) {
            return self._moveDragCallback(dx, dy);
        },
        function () {
            return self._startDragCallback();
        },
        function () {
            return self._endDragCallback();
        });
}

DraggableElement.prototype.remove = function () {
    this.component.remove();
};

DraggableElement.prototype.cross = function () {
    this.component.halfHide();
    /*
    var cx = this.component.cx, cy = this.component.cy;
    var w = this.container.widthPlace, h = this.container.heightPlace;
    var paper = this.dragAndDropSystem.paper;
    var p = 'M' + (cx - w/3) + ',' + (cy + h/3) + 'L' + (cx + w/3) + ',' + (cy - h/3) + 'L' + cx + ',' + cy +
       'M' + (cx - w/3) + ',' + (cy - h/3) + 'L' + (cx + w/3) + ',' + (cy + h/3);
    this.crossShape = paper.path(p).attr({'stroke':'red', 'stroke-width' : '3'});
    */
};
DraggableElement.prototype.show = function () {
    if (this.crossShape !== null) {
        this.crossShape.remove();
        this.crossShape = null;
    }
    this.component.show();
};
DraggableElement.prototype.hide = function () {
    if (this.crossShape !== null) {
        this.crossShape.remove();
        this.crossShape = null;
    }
    this.component.hide();
};
DraggableElement.prototype._startDragCallback = function () {
    if (this.dragAndDropSystem.canBeTaken(this.container.ident, this.iPlace)) {
        this.dragState = {
            ox: this.component.cx,
            oy: this.component.cy,
            hasReallyMoved: false
        };
        this.toFront();
    }
};
DraggableElement.prototype._moveDragCallback = function (dx, dy) {
    var state = this.dragState;

    // Ignore events if we are not dragging, or if the coordinates are invalid.
    if (!state || isNaN(dx) || isNaN(dy))
        return;

    // Do not generate events until the user has dragged the component over a
    // certain threshold.
    if (!state.hasReallyMoved) {
        if (Math.abs(dx) <= 5 && Math.abs(dy) <= 5)
            return;
        this.dragState.hasReallyMoved = true;
        this.dragAndDropSystem.hasBeenTaken(this);
    }

    // Move the component and retrieve its new position.
    this.component.placeAt(state.ox + dx, state.oy + dy);
    var cx = this.component.cx;
    var cy = this.component.cy;
    this.dragAndDropSystem.hasBeenMoved(this, cx, cy);
};
DraggableElement.prototype._endDragCallback = function () {
    // Save and clear the drag-state.
    var state = this.dragState;
    if (!state)
        return;
    this.dragState = null;

    // If the item was not dragged over the threshold, reset its position.
    if (!state.hasReallyMoved) {
        this.component.placeAt(state.ox, state.oy);
        return;
    }

    // Otherwise, pass the element and drop position to the drop handler.
    this.dragAndDropSystem.hasBeenDropped(this, this.component.cx, this.component.cy);
};

DraggableElement.prototype.placeAt = function (cx, cy) {
    this.component.placeAt(cx, cy);
};

DraggableElement.prototype.toFront = function () {
    return this.component.toFront();
};
