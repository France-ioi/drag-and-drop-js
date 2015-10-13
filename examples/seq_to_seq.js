var paper = Raphael(10, 10, 500, 300);
var nb = 4, w = 40, h = 40;

var dragAndDrop = DragAndDropSystem({
	paper : paper,
	actionIfDropped : function(srcCont, srcPos, dstCont, dstPos, dropType)
	{
		if(dstCont == 1)
			return true;
		var idEl = this.getObjects(srcCont)[srcPos];
		if(dstCont == 0)
			return action(0,idEl-1,'replace');
		return false;
	},
	actionIfEjected : function(refEl,previousContId, previousPos)
	{
		return action(0,refEl.ident-1,'replace');
	}
});

dragAndDrop.addContainer({
	ident : 0,
	cx : 150, cy : 150,
	widthPlace : w, heightPlace : h, 
	nbPlaces : nb,
	dropMode : 'replace',
	dragDisplayMode : 'preview',
	//placeBackgroundArray : []
});

dragAndDrop.addContainer({
	ident : 1,
	cx : 350, cy : 150,
	widthPlace : w, heightPlace : h, 
	nbPlaces : nb,
	dropMode : 'insertBefore',
	dragDisplayMode : 'preview',
	//placeBackgroundArray : []
});


for(var i = 0; i < nb; i++)
{
	var r = paper.rect(-w/2,-h/2,w,h,12).attr('fill','green');
	var t = paper.text(0,0,i+1)
	dragAndDrop.insertObject(0,i,{ident : i+1, elements : [r,t]});
}


