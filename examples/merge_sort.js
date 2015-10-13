var paper = Raphael(10,10,500,300);
paper.rect(0,0,600,500).attr('fill','gray');

var vals = [[12, 8, 7, 3, 2], [11, 10, 6, 4, 1]];
var wPlace = 40, hPlace = 40;
var size = [5,5];
var nbRec = 0;


var dragAndDrop = DragAndDropSystem({
	paper : paper,
	keepLastGoodAction : false,

	actionIfDropped : function(srcContId, srcPos, dstContId, dstPos, type)
	{
		if(dstContId != 'rec')
			return false;
		return dstPos == nbRec;
	},

	drop : function(srcContId, srcPos, dstContId, dstPos, type)
	{
		if(dstContId != 'rec')
			return false;
		size[srcContId]--;
		nbRec++;
		if(nbRec  < reciever.nbPlaces)
			indicator.attr('x', indicator.attr('x') + wPlace);
		else
			indicator.hide();
	},

	canBeTaken : function(srcContId, srcPos)
	{
		if(srcContId == 'rec')
			return false;
		return srcPos == size[srcContId]-1; 
	}
	
});

var list = new Array(); 
for(var iList = 0; iList < 2; iList++)
{
	list[iList] = dragAndDrop.addContainer({
		ident: iList,
		cx : (500/3)*(iList+1), cy : 100, heightPlace : 15,	
		direction : 'vertical', align : 'top',
		nbPlaces : 5,
		placeBackgroundArray : []
	});

	for(iVal = 0; iVal < 5; iVal++)
	{
		var c = paper.circle(0,0,20).attr('fill','yellow');
		var t = paper.text(0,0,vals[iList][iVal]);
		list[iList].createDraggable(vals[iList][iVal], iVal, [c,t]);
	}
}

var reciever = dragAndDrop.addContainer({
	ident: 'rec',
	cx : 250, cy : 250, widthPlace : wPlace, heightPlace : hPlace,
	nbPlaces : 10,
	dropMode : 'replace',
	dragDiplayMode : 'preview'
});

var indicator = paper.rect( reciever.placeCenter(0)[0]-wPlace/2,reciever.placeCenter(0)[1]+2*hPlace/3,wPlace,1).attr('stroke', 'red');





