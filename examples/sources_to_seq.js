var paper = Raphael(10, 10, 500, 400);
var dragAndDrop = DragAndDropSystem({
	paper : paper,
	actionIfDropped : function(srcCont, srcPos, dstCont, dstPos, dropType)
	{
		return dstCont == 'seq' || dstCont == null;
	}
});

var nb = 6, w = 60, h = 60;

var cont = dragAndDrop.addContainer({
	ident : 'seq',
	cx : 250, cy: 300, widthPlace : w, heightPlace : h,
	nbPlaces : nb,
	dropMode : 'insertBefore',
	dragDisplayMode : 'preview'
});

var colors = ['pink', 'yellow','orange','white'];
var text = ['HAUT', 'BAS', 'GAUCHE', 'DROITE'];
var source = new Array();
for(var iSource = 0; iSource < 4; iSource++)
{
	var c = paper.circle(0,0,25).attr('fill',colors[iSource]);
	var t = paper.text(0,0,text[iSource]);	
	source[iSource] = dragAndDrop.addContainer({
		ident : iSource,
		cx : 100*(1+iSource), cy: 150, widthPlace : w, heightPlace : h,
		type : 'source',
		sourceElemArray : [c,t]
	});
}




