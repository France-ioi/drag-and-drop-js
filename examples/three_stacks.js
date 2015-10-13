var paper = Raphael(10, 10, 500, 400);
var dragAndDrop = DragAndDropSystem({
	paper : paper,
	canBeTaken : function(srcContId, srcPos){
		return srcPos == stackSize[srcContId]-1;
	},
	actionIfDropped : function(srcContId, srcPos, dstContId, dstPos, type)
	{
		if(dstContId == null)
			return false;
		if(srcContId == dstContId)
			return dstPos == srcPos;	
		return dstPos == stackSize[dstContId];
	},
	drop : function(srcContId, srcPos, dstContId, dstPos, type)
	{
		stackSize[srcContId]--;
		stackSize[dstContId]++;
	}
});

var nb = 6, w = 60, h = 60;
var colors = ['pink', 'yellow','purple','green','violet','red'];

var cont = new Array();
var stackSize = [3,3,3];
for(var iStack = 0; iStack < 3; iStack++){
	cont[iStack] = dragAndDrop.addContainer({
		cx : 250, cy : 100*(iStack+1), widthPlace : w, heightPlace : h,
		ident : iStack,
		dropMode : 'replace',
		nbPlaces : nb
	});

	for(var iEl = 0; iEl < 3; iEl++){
		var r = paper.rect(-w/2,-h/2,w,h,w/5).attr('fill',colors[iEl]);
		var t = paper.text(0,0,iEl+1);
		cont[iStack].createDraggable([iStack,iEl],iEl, [r,t]);
	}
}






