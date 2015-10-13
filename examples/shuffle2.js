var paper = Raphael(10, 10, 500, 300);
var dragAndDrop = DragAndDropSystem({
	paper : paper,
	actionIfDropped : function(srcCont, srcPos, dstCont, dstPos, type)
	{
		if(dstCont == null)
			return false;
		return true;
	}
});

var nb = 6, w = 60, h = 60;

var cont = dragAndDrop.addContainer({
	cx : 250, cy : 150,
	widthPlace : w, heightPlace : h, 
	nbPlaces : nb,
	dropMode : 'insert',
	dragDisplayMode : 'marker',
	placeBackgroundArray : []
});

var colors = ['pink', 'yellow','purple','green','violet','red'];
for(var i = 0; i < nb; i++)
{
	var r = paper.rect(-w/2,-h/2,w,h,w/5).attr('fill',colors[i]);
	var t = paper.text(0,0,i+1);
	cont.createDraggable(i+1, i, [r,t]);
}

