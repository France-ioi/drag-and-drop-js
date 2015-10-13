var paper = Raphael(10,10,500,300);
paper.rect(0,0,600,500).attr('fill','gray');
var vals = [12, 8, 7, 3, 2, 6, 1, 14, 5, 9];
var wPlace = 40, hPlace = 40;
var sizeStack = vals.length;
var nbRec = 0;

var dragAndDrop = DragAndDropSystem({
	paper : paper,
	keepLastGoodAction : false,
	canBeTaken : function(srcContId, srcPos)
	{
		if(srcContId == 'rec')
			return false;
		return true; 
	},
	actionIfDropped : function(srcContId, srcPos, dstContId, dstPos, type)
	{
		if(dstContId != 'rec')
			return false;
		return dstPos == nbRec;
	},
	drop : function(srcContId, srcPos, dstContId, dstPos, type)
	{
		if(dstContId != 'rec')
			return;
		sizeStack--;
		nbRec++;
		if(nbRec  < vals.length)
			indicator.attr('x', indicator.attr('x') + wPlace);
		else
			indicator.hide();
	}
});

var list = dragAndDrop.addContainer({
	ident: 'pile',
	cx : 250, cy : 100, widthPlace : wPlace, heightPlace : hPlace,	
	direction : 'horizontal', align : 'right',
	nbPlaces : vals.length
});

var circles = new Array();
for(iVal = 0; iVal < vals.length; iVal++)
{
	circles[iVal] = paper.circle(0,0,20).attr('fill','yellow');
	var t = paper.text(0,0,vals[iVal]);
	list.createDraggable(vals[iVal], iVal, [circles[iVal],t]);
}

var reciever = dragAndDrop.addContainer({
	ident: 'rec',
	cx : 250, cy : 250, widthPlace : wPlace, heightPlace : hPlace,	
	nbPlaces : 10,
	dropMode : 'replace',
	dragDiplayMode : 'preview'
});

var indicator = paper.rect( reciever.placeCenter(0)[0]-wPlace/2,reciever.placeCenter(0)[1]+2*hPlace/3,wPlace,1).attr('stroke', 'red');





