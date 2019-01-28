!function(){function t(e,i,n){function r(s,a){if(!i[s]){if(!e[s]){var l="function"==typeof require&&require;if(!a&&l)return l(s,!0);if(o)return o(s,!0);var c=new Error("Cannot find module '"+s+"'");throw c.code="MODULE_NOT_FOUND",c}var p=i[s]={exports:{}};e[s][0].call(p.exports,function(t){var i=e[s][1][t];return r(i||t)},p,p.exports,t,e,i,n)}return i[s].exports}for(var o="function"==typeof require&&require,s=0;s<n.length;s++)r(n[s]);return r}return t}()({1:[function(t,e,i){"use strict";function n(t,e,i){return new r(t,e,i)}function r(t,e,i){this.dstCont=t,this.dstPos=e,this.dropType=i,this.sameAs=function(t){return this.dstCont===t.dstCont&&this.dstPos===t.dstPos&&this.dropType===t.dropType}}e.exports=n},{}],2:[function(t,e,i){"use strict";function n(t){return t.constructor===r?t:new r(t)}function r(t){var e,i,n;if(t instanceof Array)throw"A Raphael element is required";if(this.element=t,this.cx=0,this.cy=0,this.opacity=1,e=this.paper=t.paper,i=e.raphael.el.constructor,e.raphael.vml?(this.vml=!0,n=document.createElement("group"),n.style.position="absolute"):(this.vml=!1,n=document.createElementNS("http://www.w3.org/2000/svg","g")),e.canvas.appendChild(n),this.group=new i(n,e),this.vml){var r=this;this.group.transform=function(t){return"undefined"==typeof t?[["t",r.cx,r.cy]]:1===t.length&&"t"===t[0][0]?void r.placeAt(t[0][1],t[0][2]):void alert("unsupported VML group transform")}}this.addElement(t)}var o=t("./utils");e.exports=n,r.prototype.addElement=function(t){if("set"===t.type)for(var e=0,i=t.length;e<i;e++)this.addElement(t[e]);else if(this.group.node.appendChild(t.node),!this.vml&&"text"===t.type){var n=t.getBBox(),r=this.paper.rect(n.x,n.y,n.width,n.height).attr("fill","red").attr("opacity",0);this.group.node.appendChild(r.node)}},r.prototype.clone=function(){var t=new r(this.element.clone());return t.placeAt(this.cx,this.cy),t},r.prototype.placeAt=function(t,e){return this.cx=t,this.cy=e,this.vml?(this.group.node.style.left=t+"px",this.group.node.style.top=e+"px"):this.group.transform("t"+t+","+e),this},r.prototype.placeAtWithAnim=function(t,e,i){return this.cx=t,this.cy=e,this.group.animate({transform:"t"+t+","+e},i,""),this},r.prototype.remove=function(){this.group.remove()},r.prototype.show=function(){return 1!==this.opacity&&(this.group.attr("opacity",1),this.opacity=1),this.group.show(),this},r.prototype.hide=function(){return this.group.hide(),this},r.prototype.halfHide=function(){return this.group.attr("opacity",.3),this.opacity=.3,this},r.prototype.drag=function(t,e,i){return this.group.drag(t,e,i),this},r.prototype.undrag=function(){return this.group.undrag(),this},r.prototype.toFront=function(){return this.group.toFront(),this},o.ie6&&(r.prototype.placeAtWithAnim=r.prototype.placeAt)},{"./utils":7}],3:[function(t,e,i){"use strict";function n(t,e){var i=t.paper;if(c(e.ident)&&(e.ident=""),c(e.type)&&(e.type="list"),p(e.type,["source","list"])&&alert("type should be 'source' or 'list'"),(c(e.cx)||c(e.cy))&&alert("cx and cy are not specified"),c(e.widthPlace)&&(e.widthPlace=40),c(e.heightPlace)&&(e.heightPlace=40),c(e.align)?c(e.direction)?(e.direction="horizontal",e.align="left"):"vertical"===e.direction?e.align="top":"horizontal"===e.direction?e.align="left":alert("direction should be 'vertical' or 'horizontal' "):(p(e.align,["top","bottom","left","right"])&&alert("align should be 'top' or 'bottom' or 'left' or 'right'"),"top"===e.align||"bottom"===e.align?e.direction="vertical":e.direction="horizontal"),c(e.dragDisplayMode)?e.dragDisplayMode="preview":p(e.dragDisplayMode,["preview","marker"])&&alert("dragDisplayMode should be 'preview' or 'marker' "),c(e.placeBackgroundArray)){var n=e.widthPlace,o=e.heightPlace;e.placeBackgroundArray=[i.rect(-n/2,-o/2,n,o).attr("fill","blue")]}return"source"===e.type&&(c(e.dropMode)&&(e.dropMode="replace"),e.nbPlaces=1,c(e.sourceElemArray)&&alert("sourceElemArray should be defined"),e.sourceElemArray instanceof Array&&(e.sourceElemArray=i.set(e.sourceElemArray))),"list"===e.type&&(c(e.dropMode)&&(e.dropMode="insert"),c(e.nbPlaces)&&(e.nbPlaces=5)),new r(t,e.ident,e.cx,e.cy,e.nbPlaces,e.widthPlace,e.heightPlace,e.direction,e.align,e.dropMode,e.dragDisplayMode,e.placeBackgroundArray,e.type,e.sourceElemArray,e.places)}function r(t,e,i,n,r,o,a,l,c,p,h,d,u,f,g){if(this.dragAndDropSystem=t,this.ident=e,this.cx=i,this.cy=n,this.nbPlaces=r,this.widthPlace=o,this.heightPlace=a,this.direction=l,this.align=c,this.dropMode=p,this.dragDisplayMode=h,this.type=u,this.places=g,this.sanityCheck(),this.placeHolder=s(t.paper.rect(-o/2,-a/2,o,a).attr({stroke:"yellow","stroke-width":"2","stroke-dasharray":"-"})),this.placeHolder.hide(),this.indicator=null,d){for(var y=t.paper.set(d),m=0;m<this.nbPlaces;m++){var v=this.placeCenter(m);s(y.clone()).placeAt(v[0],v[1])}y.hide()}this.draggableElements=[];for(var b=0;b<this.nbPlaces;b++)this.draggableElements[b]=null;if("source"===this.type&&f){var A=this.placeCenter(0);this.sourceComponent=s(f),window.sourceComponents=window.sourceComponents||[],window.sourceComponents.push(this.sourceComponent),this.sourceComponent.placeAt(A[0],A[1]);var P=this.updateSource();this.sourceComponent.draggable=P}this.timeAnim=100}var o=t("./utils"),s=t("./component"),a=t("./draggable_element"),l=t("./action"),c=o.isUndefined,p=o.notIn;e.exports=n,r.prototype.sanityCheck=function(){p(this.direction,["vertical","horizontal"])&&alert("direction should be 'vertical' or 'horizontal'!"),"vertical"===this.direction&&p(this.align,["top","bottom"])&&alert("Since direction is vertical, align should be 'top' or 'bottom'"),"horizontal"===this.direction&&p(this.align,["left","right"])&&alert("Since direction is horizontal, align should be 'left' or 'right'"),p(this.dropMode,["replace","insert-replace","insert","insertBefore"])&&alert("dropMode should be 'replace' or 'insert' or 'insert-replace' or 'insertBefore'"),p(this.dragDisplayMode,["preview","marker"])&&alert("dragDisplayMode should be 'preview' or 'marker' "),p(this.type,["list","source"])&&alert("type should be 'list' or 'source'")},r.prototype.placeCenter=function(t){var e=this.widthPlace,i=this.heightPlace;return c(this.places)?"horizontal"===this.direction?"left"===this.align?[this.cx+(2*t+1-this.nbPlaces)*e/2,this.cy]:[this.cx+(this.nbPlaces-2*t-1)*e/2,this.cy]:"top"===this.align?[this.cx,this.cy+(2*t+1-this.nbPlaces)*i/2]:[this.cx,this.cy+(this.nbPlaces-2*t-1)*i/2]:this.places[t]},r.prototype.placeId=function(t,e){for(var i=0;i<this.nbPlaces;i++){var n=this.placeCenter(i),r=this.widthPlace,o=this.heightPlace;if(t>=n[0]-r/2&&t<=n[0]+r/2&&e>=n[1]-o/2&&e<=n[1]+o/2)return i}return-1},r.prototype.isInContainer=function(t,e){return this.placeId(t,e)!==-1},r.prototype.ratioPositionInPlace=function(t,e){var i=this.placeCenter(0),n=this.placeCenter(1),r=[t-i[0],e-i[1]],o=[n[0]-i[0],n[1]-i[1]],s=r[0]*o[0]+r[1]*o[1],a=parseFloat(s)/parseFloat(o[0]*o[0]+o[1]*o[1])+.5;return a-this.placeId(t,e)},r.prototype.getCorrespondingAction=function(t,e,i){var n=this.placeId(e,i),r=this.ratioPositionInPlace(e,i);return n===-1?null:"replace"===this.dropMode?l(this,n,"replace"):"insert-replace"===this.dropMode?r<.25?l(this,n,"insert"):r>.75&&n+1<this.nbPlaces?l(this,n+1,"insert"):l(this,n,"replace"):"insert"===this.dropMode?r<.25?l(this,n,"insert"):r>.75&&n+1<this.nbPlaces?l(this,n+1,"insert"):null:"insertBefore"===this.dropMode?r<.75?l(this,n,"insert"):r>.75&&n+1<this.nbPlaces?l(this,n+1,"insert"):null:void alert("dropMode ?")},r.prototype.getElementsAfterDrop=function(t,e,i,n,r){for(var o=[],s=0;s<this.nbPlaces;s++)o[s]=this.draggableElements[s];if(o[this.nbPlaces]=null,this===t)if("replace"===this.dropMode)o[e]=null;else for(s=e;s+1<=this.nbPlaces&&null!==this.draggableElements[s];)o[s]=o[s+1],s++;var a=t.draggableElements[e];if(this===i)if("replace"===r)o[n]=a;else{for(var l=n;l<this.nbPlaces&&null!==o[l];)l++;for(s=l;s>n;s--)o[s]=o[s-1];o[n]=a}return o},r.prototype.createAt=function(t,e,i){if(this.draggableElements[t])throw"a draggable element at index "+t+" already exists in container "+this.ident;i instanceof Array&&(i=this.dragAndDropSystem.paper.set(i));var n=new a(this,t,e,i);this.draggableElements[t]=n;var r=this.placeCenter(t);return n.placeAt(r[0],r[1]),n},r.prototype.clearPlace=function(t){var e=this.draggableElements[t];this.draggableElements[t]=null,e.remove()},r.prototype.clear=function(){for(var t=this.draggableElements,e=0;e<t.length;e++){var i=t[e];null!==i&&(t[e]=null,i.remove())}},r.prototype.getObjects=function(){for(var t=[],e=0;e<this.nbPlaces;e++){var i=this.draggableElements[e];t.push(i&&i.ident)}return t},r.prototype.setObjects=function(t){for(var e=0;e<this.nbPlaces;e++){var i=t[e];this.draggableElements[e]=i,null!==i&&(i.container=this,i.iPlace=e)}},r.prototype.getElementOver=function(t,e,i){for(var n=0;n<this.nbPlaces;n++){var r=this.draggableElements[n];if(null!==r&&r!==t&&e>=r.component.cx-this.widthPlace/2-1&&e<=r.component.cx+this.widthPlace/2+1&&i>=r.component.cy-this.heightPlace/2-1&&i<=r.component.cy+this.heightPlace/2+1)return r}return null},r.prototype.showIndicator=function(t){if("marker"==this.dragDisplayMode){var e=this.dragAndDropSystem.paper,i=this.placeCenter(t.dstPos),n=this.widthPlace,r=this.heightPlace;if("replace"===t.dropType&&(this.indicator=e.rect(i[0]-n/2,i[1]-r/2,n,r).attr({stroke:"red","stroke-width":"4"})),"insert"===t.dropType){var o=this.placeCenter(t.dstPos-1);if("vertical"===this.direction){var s=(o[1]+i[1])/2;this.indicator=e.rect(i[0]-3*n/4,s,3*n/2,1).attr({stroke:"red","stroke-width":"4"})}else{var a=(o[0]+i[0])/2;this.indicator=e.rect(a,i[1]-3*r/4,1,3*r/2).attr({stroke:"red","stroke-width":"4"})}}}},r.prototype.hideIndicator=function(){null!==this.indicator&&this.indicator.remove(),this.indicator=null},r.prototype.updateSource=function(){if("source"===this.type&&null===this.draggableElements[0]){var t=this.sourceComponent.clone();return this.createAt(0,this.ident,t)}},r.prototype.updateDisplay=function(){this.updateSource(),this.placeHolder.hide();for(var t=0;t<this.draggableElements.length;t++){var e=this.draggableElements[t];if(null!==e){var i=this.placeCenter(t);e.component.placeAtWithAnim(i[0],i[1],this.timeAnim),e.component.show()}}},r.prototype.updateIntermediateDisplay=function(t,e,i,n,r){this.placeHolder.hide();var o,s,a=this.getElementsAfterDrop(t,e,i,n,r);if("preview"===this.dragDisplayMode)for(o=0;o<=this.nbPlaces;o++)s=this.placeCenter(o),null!==a[o]&&(a[o]===t.draggableElements[e]?(this.placeHolder.show(),this.placeHolder.placeAt(s[0],s[1]),this.placeHolder.toFront(),t.draggableElements[e].show(),t.draggableElements[e].toFront()):(a[o].component.placeAtWithAnim(s[0],s[1],this.timeAnim),a[o].show()));if("marker"===this.dragDisplayMode){if("replace"===this.dropMode)return;for(o=0;o<this.nbPlaces;o++)null!==this.draggableElements[o]&&this.draggableElements[o].show();if(this===t)for(var l=e;l+1<this.nbPlaces&&null!==this.draggableElements[l+1];)s=this.placeCenter(l),this.draggableElements[l+1].component.placeAtWithAnim(s[0],s[1],this.timeAnim),l++}null!==a[this.nbPlaces]&&a[this.nbPlaces].cross()}},{"./action":1,"./component":2,"./draggable_element":5,"./utils":7}],4:[function(t,e,i){"use strict";function n(t){var e,i;a(t.paper)&&alert("paper should be defined"),this.paper=t.paper,this.keepLastGoodAction=!0,this.containers=[],this.lastDisplayedAction=null,this.lastOver=-1,e=["keepLastGoodAction","canBeTaken","actionIfDropped","drop","actionIfEjected","ejected","over"];for(i in t)t.hasOwnProperty(i)&&!l(i,e)&&(this[i]=t[i]);this.addContainer({ident:"temporaryContainer",cx:-1e3,cy:-1e3,nbPlaces:1,widthPlace:10,heigthPlace:10,direction:"vertical",align:"top",dropMode:"replace",dragDiplayMode:"marker",placeBackgroundArray:null,type:"list"})}var r=t("./action"),o=t("./container"),s=t("./utils"),a=s.isUndefined,l=s.notIn;e.exports=n,n.prototype.addContainer=function(t){var e=o(this,t);return this.containers.push(e),e},n.prototype.removeContainer=function(t){for(var e=0;e<this.containers.length;e++)this.containers[e]===t&&(this.containers[e]=this.containers[this.containers.length-1],this.containers.pop())},n.prototype.getContainer=function(t){if(null===t)return null;for(var e=0;e<this.containers.length;e++){var i=this.containers[e];if(i.ident===t)return i}return null},n.prototype.getObjects=function(t){return this.getContainer(t).getObjects()},n.prototype.insertObject=function(t,e,i){return this.getContainer(t).createAt(e,i.ident,i.elements)},n.prototype.insertObjects=function(t,e,i){for(var n=this.getContainer(t),r=0;r<i.length;r++){var o=i[r];null!==o&&n.createAt(e+r,o.ident,o.elements)}},n.prototype.removeObject=function(t,e){this.getContainer(t).clearPlace(e)},n.prototype.removeAllObjects=function(t){var e=this.getContainer(t);e&&e.clear()},n.prototype.userActionToAction=function(t){var e=this.getContainer(t.dstCont);return r(e,t.dstPos,t.dropType)},n.prototype.getCorrespondingAction=function(t,e,i){for(var n,o=t.container,s=t.iPlace,a=0;a<this.containers.length;a++){var l=this.containers[a];if(l.isInContainer(e,i)){var c=l.getCorrespondingAction(t,e,i);if(null===c)continue;if(n=this.actionIfDropped(o.ident,s,c.dstCont.ident,c.dstPos,c.dropType),"object"==typeof n)return this.userActionToAction(n);if("boolean"==typeof n&&n)return c}}return n=this.actionIfDropped(o.ident,s,null,null,"insert"),"object"==typeof n?this.userActionToAction(n):"boolean"==typeof n&&n?r(null,null,"insert"):this.keepLastGoodAction&&null!==this.lastDisplayedAction?this.lastDisplayedAction:r(o,s,o.dropMode)},n.prototype.hideIndicators=function(){for(var t=0;t<this.containers.length;t++)this.containers[t].hideIndicator()},n.prototype.updateDisplay=function(){for(var t=0;t<this.containers.length;t++)this.containers[t].updateDisplay()},n.prototype.updateIntermediateDisplay=function(t,e,i,n,r){for(var o=0;o<this.containers.length;o++)this.containers[o].updateIntermediateDisplay(t,e,i,n,r)},n.prototype.getElementOver=function(t,e,i){for(var n=0;n<this.containers.length;n++){var r=this.containers[n].getElementOver(t,e,i);if(null!==r)return r}return null},n.prototype.hasBeenTaken=function(t){},n.prototype.hasBeenMoved=function(t,e,i){if(!this.disabled){var n=this.getCorrespondingAction(t,e,i),r=this.getElementOver(t,e,i);this.lastOver!==r&&(this.lastOver=r,null!==this.lastOver?this.over(t.container.ident,t.iPlace,r.container.ident,r.iPlace):this.over(t.container.ident,t.iPlace,null,0)),null!==this.lastDisplayedAction&&n.sameAs(this.lastDisplayedAction)||(this.lastDisplayedAction=n,this.hideIndicators(),null!==n.dstCont&&(n.dstCont.showIndicator(n),t.toFront()),this.updateIntermediateDisplay(t.container,t.iPlace,n.dstCont,n.dstPos,n.dropType))}},n.prototype.hasBeenDropped=function(t,e,i){if(!this.disabled){this.hideIndicators();var n=this.getCorrespondingAction(t,e,i),r=t.container,o=t.iPlace;this.handleDrop(r,o,n.dstCont,n.dstPos,n.dropType),this.lastDisplayedAction=null,this.lastOver=-1}},n.prototype.handleDrop=function(t,e,i,n,r){var o,s=[],a=-1,l=null;for(o=0;o<this.containers.length;o++){var c=this.containers[o];s.push(c.getElementsAfterDrop(t,e,i,n,r)),c===i&&(a=o);var p=s[o][c.nbPlaces];null!==p&&(l={refEl:p,previousCont:c,previousPos:c.nbPlaces-1})}for(a!==-1&&"replace"===r&&null!==s[a][n]&&null!==i.draggableElements[n]&&s[a][n]!==i.draggableElements[n]&&(l={refEl:i.draggableElements[n],previousCont:this.containers[a],previousPos:n}),null===i&&(l={refEl:t.draggableElements[e],previousCont:t,previousPos:e}),o=0;o<this.containers.length;o++)this.containers[o].setObjects(s[o]);this.updateDisplay(),null!==i?this.drop(t.ident,e,i.ident,n,r):this.drop(t.ident,e,null),null!==l&&this.handleEjection(l.refEl,l.previousCont,l.previousPos)},n.prototype.handleEjection=function(t,e,i){var n=this.actionIfEjected(t,e.ident,i);t.show(),null===n?t.remove():(n=this.userActionToAction(n),this.containers[0].draggableElements[0]=t,t.container=this.containers[0],t.iPlace=0,this.handleDrop(this.containers[0],0,n.dstCont,n.dstPos,n.dropType)),this.ejected(t,e.ident,i)},n.prototype.canBeTaken=function(t,e){return!0},n.prototype.actionIfDropped=function(t,e,i,n,r){return!0},n.prototype.disable=function(){this.disabled=!0},n.prototype.drop=function(t,e,i,n,r){},n.prototype.over=function(t,e,i,n){},n.prototype.actionIfEjected=function(t,e,i){return null},n.prototype.ejected=function(t,e,i){}},{"./action":1,"./container":3,"./utils":7}],5:[function(t,e,i){"use strict";function n(t,e,i,n){this.dragAndDropSystem=t.dragAndDropSystem,this.ident=i,this.container=t,this.iPlace=e,this.component=o(n),this.dragState=null,this.crossShape=null;var s=this;r(this.component,t,e,s)}function r(t,e,i,n){t.drag(function(t,e){return n._moveDragCallback(t,e)},function(){return n._startDragCallback()},function(){return t.undrag(),r(t,e,i,n),n._endDragCallback()})}var o=t("./component");e.exports=n,n.prototype.remove=function(){this.component.remove()},n.prototype.cross=function(){this.component.halfHide()},n.prototype.show=function(){null!==this.crossShape&&(this.crossShape.remove(),this.crossShape=null),this.component.show()},n.prototype.hide=function(){null!==this.crossShape&&(this.crossShape.remove(),this.crossShape=null),this.component.hide()},n.prototype._startDragCallback=function(){var t=!1;this.dragState&&(t=!0),this.dragAndDropSystem.canBeTaken(this.container.ident,this.iPlace)&&(this.dragState={ox:this.component.cx,oy:this.component.cy,hasReallyMoved:!1,dragNotEnded:t},this.toFront())},n.prototype._moveDragCallback=function(t,e){var i=this.dragState;if(i&&!isNaN(t)&&!isNaN(e)){if(!i.hasReallyMoved){if(Math.abs(t)<=5&&Math.abs(e)<=5)return;this.dragState.hasReallyMoved=!0,this.dragAndDropSystem.hasBeenTaken(this)}this.component.placeAt(i.ox+t,i.oy+e);var n=this.component.cx,r=this.component.cy;this.dragAndDropSystem.hasBeenMoved(this,n,r)}},n.prototype._endDragCallback=function(){var t=this.dragState;if(t)return this.dragState=null,t.hasReallyMoved||t.dragNotEnded?void this.dragAndDropSystem.hasBeenDropped(this,this.component.cx,this.component.cy):void this.component.placeAt(t.ox,t.oy)},n.prototype.placeAt=function(t,e){this.component.placeAt(t,e)},n.prototype.toFront=function(){return this.component.toFront()}},{"./component":2}],6:[function(t,e,i){"use strict";var n=t("./dragAndDropSystem"),r=t("./action");e.exports=window.DragAndDropSystem=function(t){return new n(t)},e.exports.action=r},{"./action":1,"./dragAndDropSystem":4}],7:[function(t,e,i){"use strict";/MSIE\s([\d.]+)/.test(navigator.userAgent)&&(e.exports["ie"+parseInt(RegExp.$1,10)]=!0),e.exports.notIn=function(t,e){for(var i=0,n=e.length;i<n;i++)if(e[i]===t)return!1;return!0},e.exports.isUndefined=function(t){return"undefined"==typeof t}},{}]},{},[6]);
//# sourceMappingURL=drag-and-drop.js.map
