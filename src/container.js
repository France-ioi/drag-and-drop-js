'use strict';

/*
  Un container est un ensemble de cases (aliginées verticalement ou horizontalement). On peut lui donner
  beaucoup de paramêtre pour spécifier son comportement.
  direction : doit valoir "vertical" ou "horizontal"
  align : dans le cas vertical, peut valoir "left" pour indiquer que la première case est à gauche, ou "right"
          pour indiquer que la première case est à droite. Dans le cas vertical, peut valoir "top" ou "bottom".
  cx, cy : donne le centre de la case la plus haute (pour le vertical) ou la plus a gauche (pour le cas horizontal)
  dropMode :
     - "replace" : lorsqu'un objet est laché sur une case, la case détruit son éventuel objet courant pour recevoir le nouveau.
     - "insert"  : lorsqu'un objet est laché sur la case, l'objet actuel de la case (s'il y en a un) est décalé vers la droite,
                   entrainant éventuellement un autre décalage et ainsi de suite... il peut y avoir une suppression
                   si le dernier objet se fait éjecter du container.
     - "insert-replace" : lorsqu'on lache l'objet, s'il est vers le début de la case, alors on a un comportement insert,
                          sinon un comportement replace.
     - "insertBefore" : comme insert, mais la zone de drop est plus du coté du début de la case, donc ca marche mieux
                        avec dragDisplayMode="marker".
  dragDisplayMode : peut valoir "preview" (pour voir le placeholder avec des tirés jaune)
                    ou "marker" (pour voir le trait rouge).
  placeBackgroundArray : définit le background que l'on met à chaque case (juste pour faire joli).
  type : peut valoir "list", pour un container classique, ou "source" le container peut recréer des objets
         quand on lui prend le sien.
  sourceElemArray : Utile seulement dans le cas type="source", définit l'objet source à dupliquer.
*/

var utils = require('./utils'),
    component = require('./component'),
    DraggableElement = require('./draggable_element'),
    action = require('./action'),
    isUndefined = utils.isUndefined,
    notIn = utils.notIn;

module.exports = container;

function container (dragAndDropSystem, params) {
    var paper = dragAndDropSystem.paper;

    if (isUndefined(params.ident))
        params.ident = '';
    if (isUndefined(params.type))
        params.type = 'list';
    if (notIn(params.type, ['source', 'list']))
        alert('type should be \'source\' or \'list\'');

    if (isUndefined(params.cx) || isUndefined(params.cy))
        alert('cx and cy are not specified');

    if (isUndefined(params.widthPlace))
        params.widthPlace = 40;
    if (isUndefined(params.heightPlace))
        params.heightPlace = 40;

    if (!isUndefined(params.align)) {
        if (notIn(params.align, ['top', 'bottom', 'left', 'right']))
            alert('align should be \'top\' or \'bottom\' or \'left\' or \'right\'');
        if (params.align === 'top' || params.align === 'bottom')
            params.direction = 'vertical';
        else
            params.direction = 'horizontal';
    } else {
        if (isUndefined(params.direction)) {
            params.direction = 'horizontal';
            params.align = 'left';
        } else {
            if (params.direction === 'vertical')
                params.align = 'top';
            else if (params.direction === 'horizontal')
                params.align = 'left';
            else
                alert('direction should be \'vertical\' or \'horizontal\' ');
        }
    }

    if (isUndefined(params.dragDisplayMode))
        params.dragDisplayMode = 'preview';
    else if (notIn(params.dragDisplayMode, ['preview', 'marker']))
        alert('dragDisplayMode should be \'preview\' or \'marker\' ');

    if (isUndefined(params.placeBackgroundArray)) {
        var w = params.widthPlace,
            h = params.heightPlace;
        params.placeBackgroundArray = [paper.rect(-w / 2, -h / 2, w, h).attr('fill', 'blue')];
    }

    if (params.type === 'source') {
        if (isUndefined(params.dropMode))
            params.dropMode = 'replace';
        params.nbPlaces = 1;
        if (isUndefined(params.sourceElemArray))
            alert('sourceElemArray should be defined');
        if (params.sourceElemArray instanceof Array)
            params.sourceElemArray = paper.set(params.sourceElemArray);
    }

    if (params.type === 'list') {
        if (isUndefined(params.dropMode))
            params.dropMode = 'insert';
        if (isUndefined(params.nbPlaces))
            params.nbPlaces = 5;
    }

    return new Container(
        dragAndDropSystem, params.ident,
        params.cx, params.cy, params.nbPlaces, params.widthPlace, params.heightPlace,
        params.direction, params.align,
        params.dropMode, params.dragDisplayMode,
        params.placeBackgroundArray, params.type, params.sourceElemArray, params.places);

}

function Container (
    dragAndDropSystem, ident, cx, cy, nbPlaces, widthPlace, heightPlace,
    direction, align, dropMode, dragDisplayMode, placeBackgroundArray,
    type, sourceElemArray, places) {

    this.dragAndDropSystem = dragAndDropSystem;
    this.ident = ident;
    this.cx = cx;
    this.cy = cy;
    this.nbPlaces = nbPlaces;
    this.widthPlace = widthPlace;
    this.heightPlace = heightPlace;
    this.direction = direction;
    this.align = align;
    this.dropMode = dropMode;
    this.dragDisplayMode = dragDisplayMode;
    this.type = type;
    this.places = places;

    this.sanityCheck();

    this.placeHolder = component(
        dragAndDropSystem.paper.rect(-widthPlace / 2, -heightPlace / 2, widthPlace, heightPlace)
        .attr({
            'stroke': 'yellow',
            'stroke-width': '2',
            'stroke-dasharray': '-'
        }));
    this.placeHolder.hide();

    this.indicator = null;

    //Draw places
    if (placeBackgroundArray) {
        var template = dragAndDropSystem.paper.set(placeBackgroundArray);
        for (var iPlace = 0; iPlace < this.nbPlaces; iPlace++) {
            var c = this.placeCenter(iPlace);
            component(template.clone()).placeAt(c[0], c[1]);
        }
        template.hide();
    }

    // Initialize the places.
    this.draggableElements = [];
    for (var i = 0; i < this.nbPlaces; i++)
        this.draggableElements[i] = null;

    if (this.type === 'source' && sourceElemArray) {
        // Make a background component, which is also used to refill the source.
        var center = this.placeCenter(0);
        this.sourceComponent = component(sourceElemArray);
        window.sourceComponents = (window.sourceComponents || []);
        window.sourceComponents.push(this.sourceComponent);
        this.sourceComponent.placeAt(center[0], center[1]);
        // Fill the source with a draggable element.
        var draggableElement = this.updateSource();
        this.sourceComponent.draggable = draggableElement;
    }

    this.timeAnim = 100;
}

Container.prototype.sanityCheck = function () {
    if (notIn(this.direction, ['vertical', 'horizontal']))
        alert('direction should be \'vertical\' or \'horizontal\'!');

    if (this.direction === 'vertical')
        if (notIn(this.align, ['top', 'bottom']))
            alert('Since direction is vertical, align should be \'top\' or \'bottom\'');
    if (this.direction === 'horizontal')
        if (notIn(this.align, ['left', 'right']))
            alert('Since direction is horizontal, align should be \'left\' or \'right\'');

    if (notIn(this.dropMode, ['replace', 'insert-replace', 'insert', 'insertBefore']))
        alert('dropMode should be \'replace\' or \'insert\' or \'insert-replace\' or \'insertBefore\'');

    if (notIn(this.dragDisplayMode, ['preview', 'marker']))
        alert('dragDisplayMode should be \'preview\' or \'marker\' ');

    if (notIn(this.type, ['list', 'source']))
        alert('type should be \'list\' or \'source\'');
};

/*
  Fonction utilitaire : retourne les coordonnées du centre de la
  case à l'indice iPlace.
*/
Container.prototype.placeCenter = function (iPlace) {
    var w = this.widthPlace,
        h = this.heightPlace;
    if (!isUndefined(this.places))
        return this.places[iPlace];
    if (this.direction === 'horizontal') {
        if (this.align === 'left')
            return [this.cx + ((2 * iPlace + 1 - this.nbPlaces) * w) / 2, this.cy];
        else
            return [this.cx + ((this.nbPlaces - 2 * iPlace - 1) * w) / 2, this.cy];
    } else {
        if (this.align === 'top')
            return [this.cx, this.cy + ((2 * iPlace + 1 - this.nbPlaces) * h) / 2];
        else
            return [this.cx, this.cy + ((this.nbPlaces - 2 * iPlace - 1) * h) / 2];
    }
};

/*
  Retourne l'id de la case contenant les coordonnées (x,y), ou -1 si il n'y
  a pas de case à ces coordonnées.
*/
Container.prototype.placeId = function (x, y) {
    for (var iPlace = 0; iPlace < this.nbPlaces; iPlace++) {
        var c = this.placeCenter(iPlace);
        var w = this.widthPlace,
            h = this.heightPlace;
        if (x >= c[0] - w / 2 && x <= c[0] + w / 2 && y >= c[1] - h / 2 && y <= c[1] + h / 2)
            return iPlace;
    }
    return -1;
};

Container.prototype.isInContainer = function (x, y) {
    return this.placeId(x, y) !== -1;
};

// If the point (x,y) is in place i, return a real number between 0 and 1
// to give its relative position in the place. For example, a value of
// 0.1 means that the point is near from the common border of places i and i-1,
// and a value of 0.5 indicates a position in the middle of the place i.
Container.prototype.ratioPositionInPlace = function (x, y) {
    var c0 = this.placeCenter(0),
        c1 = this.placeCenter(1);
    var c0p = [x - c0[0], y - c0[1]];
    var c0c1 = [c1[0] - c0[0], c1[1] - c0[1]];
    var prodScal = c0p[0] * c0c1[0] + c0p[1] * c0c1[1];
    var posAbs = parseFloat(prodScal) / parseFloat(c0c1[0] * c0c1[0] + c0c1[1] * c0c1[1]) + 0.5;
    return posAbs - this.placeId(x, y);
};

/*
  Renvoie l'action correspondant à ce qu'il faudrait faire si un objet
  l'objet est laché en position (x,y).
 */
Container.prototype.getCorrespondingAction = function (el, x, y) {

    var pos = this.placeId(x, y);
    var ratio = this.ratioPositionInPlace(x, y);
    if (pos === -1)
        return null;

    if (this.dropMode === 'replace')
        return action(this, pos, 'replace');

    if (this.dropMode === 'insert-replace') {
        if (ratio < 0.25)
            return action(this, pos, 'insert');
        if (ratio > 0.75 && pos + 1 < this.nbPlaces)
            return action(this, pos + 1, 'insert');
        return action(this, pos, 'replace');
    }

    if (this.dropMode === 'insert') {
        if (ratio < 0.25)
            return action(this, pos, 'insert');
        if (ratio > 0.75 && pos + 1 < this.nbPlaces)
            return action(this, pos + 1, 'insert');
        return null;
    }

    if (this.dropMode === 'insertBefore') {
        if (ratio < 0.75)
            return action(this, pos, 'insert');
        else if (ratio > 0.75 && pos + 1 < this.nbPlaces)
            return action(this, pos + 1, 'insert');
        else
            return null;
    }

    alert('dropMode ?');
};

/*
  retourne le tableau correspondant à la liste des objets qu'aurait notre container
  s'il l'action correspondant aux paramêtres était effectuée.
*/
Container.prototype.getElementsAfterDrop = function (srcCont, srcPos, dstCont, dstPos, dropType) {

    var res = [];
    for (var i = 0; i < this.nbPlaces; i++)
        res[i] = this.draggableElements[i];
    res[this.nbPlaces] = null;

    //removal
    if (this === srcCont) {
        if (this.dropMode === 'replace')
            res[srcPos] = null;
        else {
            i = srcPos;
            while (i + 1 <= this.nbPlaces && this.draggableElements[i] !== null) {
                res[i] = res[i + 1];
                i++;
            }
        }
    }

    //push
    var el = srcCont.draggableElements[srcPos];
    if (this === dstCont) {
        if (dropType === 'replace')
            res[dstPos] = el;
        else {
            var end = dstPos;
            while (end < this.nbPlaces && res[end] !== null)
                end++;
            for (i = end; i > dstPos; i--)
                res[i] = res[i - 1];
            res[dstPos] = el;
        }
    }

    return res;
};

/* Fill the place at the specified with the given element. */
Container.prototype.createAt = function (iPlace, ident, element) {

    // Complain if there is already an element at the given index.
    if (this.draggableElements[iPlace])
        throw "a draggable element at index " + iPlace + " already exists in container " + this.ident;

    // Compatibility with old interface where element was shapeArray.
    if (element instanceof Array)
        element = this.dragAndDropSystem.paper.set(element);

    // Create a moveable element.
    var draggableElement = new DraggableElement(this, iPlace, ident, element);
    this.draggableElements[iPlace] = draggableElement;

    // Move the element to its initial position.
    var centerPosition = this.placeCenter(iPlace);
    draggableElement.placeAt(centerPosition[0], centerPosition[1]);

    return draggableElement;
};

/* Clear the place with the specified index. */
Container.prototype.clearPlace = function (iPlace) {
    var el = this.draggableElements[iPlace];
    this.draggableElements[iPlace] = null;
    el.remove();
};

Container.prototype.clear = function () {
    // optimized version of: getObjects followed by removeObject on each of them
    var elems = this.draggableElements;
    for (var i = 0; i < elems.length; i++) {
        var el = elems[i];
        if (el !== null) {
            elems[i] = null;
            el.remove();
        }
    }
};

Container.prototype.getObjects = function () {
    var res = [];
    for (var i = 0; i < this.nbPlaces; i++) {
        var el = this.draggableElements[i];
        res.push(el && el.ident);
    }
    return res;
};

Container.prototype.setObjects = function (objects) {
    for (var iPlace = 0; iPlace < this.nbPlaces; iPlace++) {
        var object = objects[iPlace];
        this.draggableElements[iPlace] = object;
        if (object !== null) {
            object.container = this;
            object.iPlace = iPlace;
        }
    }
};

Container.prototype.getElementOver = function (srcEl, x, y) {
    for (var i = 0; i < this.nbPlaces; i++) {
        var el = this.draggableElements[i];
        if (el !== null && el !== srcEl) {
            if (x >= el.component.cx - this.widthPlace / 2 - 1 && x <= el.component.cx + this.widthPlace / 2 + 1)
                if (y >= el.component.cy - this.heightPlace / 2 - 1 && y <= el.component.cy + this.heightPlace / 2 + 1)
                    return el;
        }
    }
    return null;
};

/*
  Fait apparaitre le trait rouge ou le carré jaune en pointillé.
*/
Container.prototype.showIndicator = function (act) {
    if (this.dragDisplayMode != 'marker')
        return;

    var paper = this.dragAndDropSystem.paper;
    var c = this.placeCenter(act.dstPos);
    var w = this.widthPlace,
        h = this.heightPlace;

    if (act.dropType === 'replace')
        this.indicator = paper.rect(c[0] - w / 2, c[1] - h / 2, w, h).attr({
            'stroke': 'red',
            'stroke-width': '4'
        });

    if (act.dropType === 'insert') {
        var prevC = this.placeCenter(act.dstPos - 1);
        if (this.direction === 'vertical') {
            var y = (prevC[1] + c[1]) / 2;
            this.indicator = paper.rect(c[0] - 3 * w / 4, y, 3 * w / 2, 1).attr({
                'stroke': 'red',
                'stroke-width': '4'
            });
        } else {
            var x = (prevC[0] + c[0]) / 2;
            this.indicator = paper.rect(x, c[1] - 3 * h / 4, 1, 3 * h / 2).attr({
                'stroke': 'red',
                'stroke-width': '4'
            });
        }
    }
};

Container.prototype.hideIndicator = function () {
    if (this.indicator !== null)
        this.indicator.remove();
    this.indicator = null;
};

Container.prototype.updateSource = function () {
    if (this.type === 'source' && this.draggableElements[0] === null) {
        // Fill the source container's single place using a copy of the source
        // component.
        var component = this.sourceComponent.clone();
        return this.createAt(0, this.ident, component);
    }
};

/*
  Demande de faire un affichage correspondant à l'état actuel
  du container (et dessinant chacun de ses objets contenus à la bonne place)
*/
Container.prototype.updateDisplay = function () {
    this.updateSource();
    this.placeHolder.hide();
    for (var i = 0; i < this.draggableElements.length; i++) {
        var el = this.draggableElements[i];
        if (el !== null) {
            var center = this.placeCenter(i);
            el.component.placeAtWithAnim(center[0], center[1], this.timeAnim);
            el.component.show();
        }
    }
};

/*
  Demande de montrer un affichage correspondant à l'état dans lequel deviendrait
  le container si on faisait la manipulation passée en paramêtre.
*/
Container.prototype.updateIntermediateDisplay = function (srcCont, srcPos, dstCont, dstPos, dropType) {
    this.placeHolder.hide();
    var intermed = this.getElementsAfterDrop(srcCont, srcPos, dstCont, dstPos, dropType);
    var i, center;

    if (this.dragDisplayMode === 'preview') {
        for (i = 0; i <= this.nbPlaces; i++) {
            center = this.placeCenter(i);
            if (intermed[i] !== null) {
                if (intermed[i] === srcCont.draggableElements[srcPos]) {
                    this.placeHolder.show();
                    this.placeHolder.placeAt(center[0], center[1]);
                    this.placeHolder.toFront();
                    srcCont.draggableElements[srcPos].show();
                    srcCont.draggableElements[srcPos].toFront();
                } else {
                    intermed[i].component.placeAtWithAnim(center[0], center[1], this.timeAnim);
                    intermed[i].show();
                }
            }
        }
    }

    if (this.dragDisplayMode === 'marker') {
        if (this.dropMode === 'replace')
            return;

        for (i = 0; i < this.nbPlaces; i++) {
            if (this.draggableElements[i] !== null)
                this.draggableElements[i].show();
        }

        if (this === srcCont) {
            var iPlaceIns = srcPos;
            while (iPlaceIns + 1 < this.nbPlaces && this.draggableElements[iPlaceIns + 1] !== null) {
                center = this.placeCenter(iPlaceIns);
                this.draggableElements[iPlaceIns + 1].component.placeAtWithAnim(center[0], center[1], this.timeAnim);
                iPlaceIns++;
            }
        }
    }

    if (intermed[this.nbPlaces] !== null)
        intermed[this.nbPlaces].cross();
};
