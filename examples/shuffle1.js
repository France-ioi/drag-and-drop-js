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

var nb = 6;

var cont = dragAndDrop.addContainer({
	ident : 'seq',
	cx : 250, cy : 150,
	widthPlace : 50, heightPlace : 50, 
	nbPlaces : nb,
	dropMode : 'insertBefore'
});

var colors = ['pink', 'yellow','purple','green','violet','red'];
for(var i = 0; i < nb; i++)
{
	var c = paper.circle(0,0,20).attr('fill',colors[i]);
	var t = paper.text(0,0,i+1);
	cont.createDraggable(i+1, i, [c,t]);
}

