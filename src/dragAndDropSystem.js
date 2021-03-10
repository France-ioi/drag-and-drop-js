'use strict';

/*
  paper: paperRaphael, //le canvas Raphael dans lequel on dessine
  keepLastGoodAction : // ou false, indique si on garde la dernière action valide comme référence. 
                       // (par defaut à true)

Callbacks :
   canBeTaken(containerID, position) : retourne si l'objet peut être attrappé par l'utilisateur

   actionIfDropped(srcContainerID, srcPos, dstContainerID, dstPos, dropType) :
       dropType: “insert” ou “replace”
       retourne :
       - true si l'objet source peut être inséré à cette destination
       - false si on refuse de l’insérer
       - un objet action(otherDstContId, otherDstPos, otherDropType) pour envoyer l’objet source ailleurs

   drop(srcContainerID, srcPos, dstContainerID, dstPos, dropType) :
      dropType: “insert” ou “replace”
      appelé lorsque l'on vient de dropper l'objet

   actionIfEjected(refElement, previousContainerId, previousPos) :
      appelée lorsqu’un objet est éjecté, par exemple parce qu’il vient d’être
      remplacé par un autre ou bien parce qu’il était en dernière position d’un
      conteneur et qu’une insertion le fait sortir.
      retourne :
      - null si l’objet éjecté doit être détruit.
      - un objet action(dstContId, dstPos, dropType) pour envoyer l’objet ailleurs
          (l’action est alors traitée, entrainant notamment un appel a drop).

   ejected(refEl, previousCont, previousPos) : indique qu'il y a eu une ejection
*/

/* TODO: move all references to draggableElements into container.js */

var action = require('./action'),
    container = require('./container'),
    utils = require('./utils'),
    isUndefined = utils.isUndefined,
    notIn = utils.notIn;

module.exports = DragAndDropSystem;

function DragAndDropSystem (params) {
    var overridable, prop;

    if (isUndefined(params.paper)) {
        alert('paper should be defined');
    }
    this.paper = params.paper;
    this.displayHelper = params.displayHelper; 

    this.keepLastGoodAction = true;
    this.containers = [];
    this.lastDisplayedAction = null;
    this.lastOver = -1;

    // Assign each property in params to this, overriding the default behavior / values.
    overridable = ['keepLastGoodAction', 'canBeTaken', 'actionIfDropped', 'drop', 'actionIfEjected', 'ejected', 'over'];
    for (prop in params) {
        if (params.hasOwnProperty(prop) && !notIn(prop, overridable)) {
            this[prop] = params[prop];
        }
    }

    // Create a temporary container, useful for ejection.
    this.addContainer({
        ident: 'temporaryContainer',
        cx: -1000,
        cy: -1000,
        nbPlaces: 1,
        widthPlace: 10,
        heigthPlace: 10,
        direction: 'vertical',
        align: 'top',
        dropMode: 'replace',
        dragDiplayMode: 'marker',
        placeBackgroundArray: null,
        type: 'list'
    });

}

DragAndDropSystem.prototype.addContainer = function (params) {
    var newContainer = container(this, params);
    this.containers.push(newContainer);
    return newContainer;
};

DragAndDropSystem.prototype.removeContainer = function (cont) {
    for (var i = 0; i < this.containers.length; i++) {
        if (this.containers[i] === cont) {
            this.containers[i] = this.containers[this.containers.length - 1];
            this.containers.pop();
        }
    }
};

DragAndDropSystem.prototype.getContainer = function (containerIdent) {
    if (containerIdent === null)
        return null;
    for (var iCont = 0; iCont < this.containers.length; iCont++) {
        var container = this.containers[iCont];
        if (container.ident === containerIdent)
            return container;
    }
    return null;
};

// Return an array containing the (string) identifiers of the container's
// elements.
DragAndDropSystem.prototype.getObjects = function (containerIdent) {
    return this.getContainer(containerIdent).getObjects();
};

DragAndDropSystem.prototype.insertObject = function (containerIdent, pos, elem) {
    return this.getContainer(containerIdent).createAt(pos, elem.ident, elem.elements);
};

DragAndDropSystem.prototype.insertObjects = function (containerIdent, pos, elems) {
    // optimized version of insertObject applied to each of the elems
    var container = this.getContainer(containerIdent);
    for (var i = 0; i < elems.length; i++) {
        var elem = elems[i];
        if (elem !== null)
            container.createAt(pos + i, elem.ident, elem.elements);
    }
};

DragAndDropSystem.prototype.removeObject = function (containerIdent, pos) {
    this.getContainer(containerIdent).clearPlace(pos);
};

DragAndDropSystem.prototype.removeAllObjects = function (containerIdent) {
    var container = this.getContainer(containerIdent);
    if (container)
        container.clear();
};

DragAndDropSystem.prototype.userActionToAction = function (act) {
    // The user uses identifier instead of a reference for containers.
    var container = this.getContainer(act.dstCont);
    return action(container, act.dstPos, act.dropType);
};

// return the action object corresponding to what to do if el is dropped here
DragAndDropSystem.prototype.getCorrespondingAction = function (el, cx, cy) {
    var srcCont = el.container,
        srcPos = el.iPlace,
        actUser;

    // We test if one container can receive
    for (var iCont = 0; iCont < this.containers.length; iCont++) {
        var dstCont = this.containers[iCont];
        if (dstCont.isInContainer(cx, cy)) {
            var act = dstCont.getCorrespondingAction(el, cx, cy);
            if (act === null)
                continue;
            actUser = this.actionIfDropped(srcCont.ident, srcPos, act.dstCont.ident, act.dstPos, act.dropType);
            if (typeof actUser === 'object')
                return this.userActionToAction(actUser);
            if (typeof actUser === 'boolean' && actUser)
                return act;
        }
    }

    // Here, no container can receive, we thus call actionIfDropped for an empty dst.
    actUser = this.actionIfDropped(srcCont.ident, srcPos, null, null, 'insert');
    if (typeof actUser === 'object')
        return this.userActionToAction(actUser);
    if (typeof actUser === 'boolean' && actUser)
        return action(null, null, 'insert');

    // Default behaviour
    if (this.keepLastGoodAction && this.lastDisplayedAction !== null)
        return this.lastDisplayedAction;

    return action(srcCont, srcPos, srcCont.dropMode);
};

DragAndDropSystem.prototype.hideIndicators = function () {
    for (var iCont = 0; iCont < this.containers.length; iCont++)
        this.containers[iCont].hideIndicator();
};

DragAndDropSystem.prototype.updateDisplay = function () {
    for (var iCont = 0; iCont < this.containers.length; iCont++)
        this.containers[iCont].updateDisplay();
};

DragAndDropSystem.prototype.updateIntermediateDisplay = function (srcCont, srcPos, dstCont, dstPos, dropType) {
    for (var iCont = 0; iCont < this.containers.length; iCont++)
        this.containers[iCont].updateIntermediateDisplay(srcCont, srcPos, dstCont, dstPos, dropType);
};

DragAndDropSystem.prototype.getElementOver = function (srcEl, x, y) {
    for (var iCont = 0; iCont < this.containers.length; iCont++) {
        var el = this.containers[iCont].getElementOver(srcEl, x, y);
        if (el !== null)
            return el;
    }
    return null;
};

// Internal callbacks

DragAndDropSystem.prototype.hasBeenTaken = function (el) {
    // no-op
};

DragAndDropSystem.prototype.hasBeenMoved = function (el, cx, cy) {
    if(this.disabled) {
        return;
    }
    var action = this.getCorrespondingAction(el, cx, cy);
    var elOver = this.getElementOver(el, cx, cy);
    if (this.lastOver !== elOver) {
        this.lastOver = elOver;
        if (this.lastOver !== null)
            this.over(el.container.ident, el.iPlace, elOver.container.ident, elOver.iPlace);
        else
            this.over(el.container.ident, el.iPlace, null, 0);
    }
    if (this.lastDisplayedAction === null || !action.sameAs(this.lastDisplayedAction)) {
        this.lastDisplayedAction = action;
        this.hideIndicators();
        if (action.dstCont !== null) {
            action.dstCont.showIndicator(action);
            el.toFront();
        }
        this.updateIntermediateDisplay(el.container, el.iPlace, action.dstCont, action.dstPos, action.dropType);
    }
};

DragAndDropSystem.prototype.hasBeenDropped = function (el, cx, cy) {
    if(this.disabled) {
        return;
    }
    this.hideIndicators();
    var action = this.getCorrespondingAction(el, cx, cy);
    var srcCont = el.container,
        srcPos = el.iPlace;
    this.handleDrop(srcCont, srcPos, action.dstCont, action.dstPos, action.dropType);
    this.lastDisplayedAction = null;
    this.lastOver = -1;
};

DragAndDropSystem.prototype.handleDrop = function (srcCont, srcPos, dstCont, dstPos, dropType) {

    var newObjects = [];
    var iDstCont = -1;
    var ejected = null;
    var iCont;

    // Build each container's array of elements after the drop.
    for (iCont = 0; iCont < this.containers.length; iCont++) {
        var container = this.containers[iCont];
        newObjects.push(container.getElementsAfterDrop(srcCont, srcPos, dstCont, dstPos, dropType));

        // Save the index of the destination container, if any.
        if (container === dstCont)
            iDstCont = iCont;

        // If an element was pushed past the end of the container, it will be ejected.
        var elPastEnd = newObjects[iCont][container.nbPlaces];
        if (elPastEnd !== null) {
            ejected = {
                refEl: elPastEnd,
                previousCont: container,
                previousPos: container.nbPlaces - 1
            };
        }

    }

    // If an element was overwritten, it will be ejected.
    if (iDstCont !== -1 && dropType === 'replace' && newObjects[iDstCont][dstPos] !== null && dstCont.draggableElements[dstPos] !== null && newObjects[iDstCont][dstPos] !== dstCont.draggableElements[dstPos]) {
        ejected = {
            refEl: dstCont.draggableElements[dstPos],
            previousCont: this.containers[iDstCont],
            previousPos: dstPos
        };
    }

    // If an element was dropped outside any container, it will be ejected.
    if (dstCont === null) {
        ejected = {
            refEl: srcCont.draggableElements[srcPos],
            previousCont: srcCont,
            previousPos: srcPos
        };
    }

    // Overwrite the old state with the new state.
    for (iCont = 0; iCont < this.containers.length; iCont++) {
        this.containers[iCont].setObjects(newObjects[iCont]);
    }

    // Move each element to its new position.
    this.updateDisplay();

    if (dstCont !== null) {
        this.drop(srcCont.ident, srcPos, dstCont.ident, dstPos, dropType);
    } else {
        this.drop(srcCont.ident, srcPos, null);
    }

    //If needed, we process the ejection
    if (ejected !== null) {
        this.handleEjection(ejected.refEl, ejected.previousCont, ejected.previousPos);
    }

};

DragAndDropSystem.prototype.handleEjection = function (refEl, previousCont, previousPos) {
    var act = this.actionIfEjected(refEl, previousCont.ident, previousPos);
    refEl.show(); // why?
    if (act === null) {
        refEl.remove();
    } else {
        //push in temporary container, little hack
        act = this.userActionToAction(act);
        this.containers[0].draggableElements[0] = refEl;
        refEl.container = this.containers[0];
        refEl.iPlace = 0;
        this.handleDrop(this.containers[0], 0, act.dstCont, act.dstPos, act.dropType);
    }

    this.ejected(refEl, previousCont.ident, previousPos);
};

// Authorization callbacks, user-overridable.

DragAndDropSystem.prototype.canBeTaken = function (containerId, iPlace) {
    return true;
};
DragAndDropSystem.prototype.actionIfDropped = function (srcContId, srcPos, dstContId, dstPos, dropType) {
    return true;
};

DragAndDropSystem.prototype.disable = function () {
    this.disabled = true;
};

// User callbacks

DragAndDropSystem.prototype.drop = function (srcContId, srcPos, dstContId, dstPos, dropType) {};
DragAndDropSystem.prototype.over = function (srcContId, srcPos, dstContId, dstPos) {};
DragAndDropSystem.prototype.actionIfEjected = function (refEl, previousCont, previousPos) {
    return null;
};
DragAndDropSystem.prototype.ejected = function (refEl, previousCont, previousPos) {};
