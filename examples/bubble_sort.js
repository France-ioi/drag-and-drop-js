var paper = Raphael(10,10,500,200);
paper.rect(0,0,600,500).attr('fill','gray');
var vals = [12, 8, 7, 3, 2, 6, 1, 14, 5, 9];
var wPlace = 40, hPlace = 40;

//tt = paper.text(100,20,'bonjour');
//bb = tt.getBBox();
//if(tt.type == 'text')
//	paper.rect(bb.x,bb.y,bb.width,bb.height).attr('fill','red').attr('opacity',0);

var dragAndDrop = DragAndDropSystem({
	paper : paper,
	actionIfDropped : function(srcContId, srcPos, dstContId, dstPos, type)
	{
		if(dstContId == null)
			return false;
		return srcPos-dstPos  <= 1 && dstPos - srcPos <= 1;
	}	
});

var list = dragAndDrop.addContainer({
	ident: '',
	cx : 250, cy : 100, widthPlace : wPlace, heightPlace : hPlace,	
	direction : 'horizontal', align : 'right',
	nbPlaces : vals.length,
	dropMode : 'insertBefore'
});

var circles = new Array();
for(iVal = 0; iVal < vals.length; iVal++)
{
	circles[iVal] = paper.circle(0,0,20).attr('fill','yellow');
	var t = paper.text(0,0,vals[iVal]);
	list.createAt(iVal, vals[iVal], paper.set([circles[iVal], t]));
}






