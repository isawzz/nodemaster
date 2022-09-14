onload = start;

function start() {
	if (nundef(dTable)) dTable = mSection({ padding: 10, hmin: 400 }, 'dTable'); //mFlex(dTable);	//test0_fireClick();

	C = new CCanvas(dTable);
	console.log('C', C);

	C.scaleby(.5);
	let i=0;
	while(i++<100){
		C.moveby(3, 1);
		drawfigure(C);
	}

}

function drawfigure(c) {
	C.rect(10, 10, 200, 100, { bg: 'red' })
	C.ellipse(100, 100, 100, 100, { bg: 'blue' })
	C.line(0, 0, 200, 200, { fg: GREEN, thickness: 5, cap: 'round' });
}

class CanvasItem {
	constructor(o) {
		addKeys(o, this);
	}
	draw(canvas) {
		//default ist ein rectangle x,y,20,20,color
	}
}















