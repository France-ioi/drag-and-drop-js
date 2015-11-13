'use strict';

// A Component is a wrapper around a single Raphael element (which can be
// a set) that allows setting the position the element.
// The implementation relies on the Raphael group extension to move many
// elements as one, which is required in particular for IE6 (which otherwise
// moves elements individually, partially redrawing the canvas between moves).

/*
  Outdated comment:

  Component : Permet de manipuler un objet graphique composé de plusieurs
  petits objets Raphael, donnés dans le tableau arrayElems. Ces sous-objets
  doivent être donnés en coordonnées relatives : si un objet du tableau est
  un objet Raphael centré en (10,20) alors il apparaitra en (cx+10,cy+20),
  (cx,cy) étant le centre du super-objet.
  Notamment, on peut faire:
  - des déplacements, ce qui déplace ensemble tous les sous-objets.
  - du drag&drop, en propageant les fonctions callbacks à tous  les
    sous-objets, de sorte que lorsqu'un des sous-objets et déplacés,
    tous les autres subissent le même déplacement. Ainsi on voit
    tous les objets bouger ensemble, comme si c'était un seul gros objet.
*/

var utils = require('./utils');

module.exports = component;

function component (elem) {
    // If a component is passed, return it unchanged.
    if (elem.constructor === Component)
        return elem;
    return new Component(elem);
}

function Component (element) {
    var paper, nonSetElement, Element, groupNode;
    if (element instanceof Array)
        throw "A Raphael element is required";
    paper = element.paper;
    // Get to the Element constructor so we can build a group.  The loop
    // is required when we are passed nested sets.
    nonSetElement = element;
    while (nonSetElement.type === 'set')
        nonSetElement = nonSetElement[0];
    Element = nonSetElement.constructor;
    this.element = element;
    if (paper.raphael.vml) {
        this.vml = true;
        groupNode = document.createElement("group");
        groupNode.style.position = 'absolute';
    } else {
        this.vml = false;
        groupNode = document.createElementNS("http://www.w3.org/2000/svg", "g");
    }
    paper.canvas.appendChild(groupNode);
    this.group = new Element(groupNode, paper);
    this.addElement(element);
    this.cx = 0;
    this.cy = 0;
    this.opacity = 1;
}

Component.prototype.addElement = function (element) {
    if (element.type === 'set') {
        for (var i = 0, j = element.length; i < j; i++) {
            this.addElement(element[i]);
        }
    } else {
        this.group.node.appendChild(element.node);
    }
};

Component.prototype.clone = function () {
    var clone = new Component(this.element.clone());
    clone.placeAt(this.cx, this.cy);
    return clone;
};

Component.prototype.placeAt = function (cx, cy) {
    this.cx = cx;
    this.cy = cy;
    if (this.vml) {
        this.group.node.style.left = cx + 'px';
        this.group.node.style.top = cy + 'px';
    } else {
        this.group.transform('t' + cx + ',' + cy);
    }
    return this;
};

Component.prototype.placeAtWithAnim = function (cx, cy, time) {
    this.cx = cx;
    this.cy = cy;
    this.group.animate({
        transform: 't' + cx + ',' + cy
    }, time, '');
    return this;
};

Component.prototype.remove = function () {
    // Removing the group will remove the nested element.
    this.group.remove();
};

Component.prototype.show = function () {
    if (this.opacity !== 1) {
        this.attr('opacity', 1);
        this.opacity = 1;
    }
    this.group.show();
    return this;
};

Component.prototype.hide = function () {
    this.group.hide();
    return this;
};

Component.prototype.halfHide = function () {
    this.attr('opacity', 0.3);
    this.opacity = 0.3;
    return this;
};

Component.prototype.drag = function (moveDrag, startDrag, upDrag) {
    this.group.drag(moveDrag, startDrag, upDrag);
    return this;
};

Component.prototype.toFront = function () {
    this.group.toFront();
    return this;
};

if (utils.ie6) {
    // Disable animations, IE6 would animate from (0,0) to the new position,
    // rather than from the old position to the new one.
    Component.prototype.placeAtWithAnim = Component.prototype.placeAt;
}
