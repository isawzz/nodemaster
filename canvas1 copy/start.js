onload = start;

function start() {
	if (nundef(dTable)) dTable = mSection({ padding: 10, hmin: 400 }, 'dTable'); //mFlex(dTable);	//test0_fireClick();
	C = new CCanvas(dTable,{},200);

	






}


function other(){
	//console.log('C', C);

	C.scaleby(.5);

	let i=0;
	while(++i<=3){
		C.moveby(100, 100);
		C.rotateby(45);
		C.scaleby(2);
		drawfigure(C);
	}
	let m=C.get_matrix();
	console.log('matrix',m);
	let comp=C.decompose();

	console.log('decomposed',comp.translation,toDegree(comp.rotation),comp.scale);

}

function xline(x1,y1,x2,y2,thick){
	//C.line(x+)
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














