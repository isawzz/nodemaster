onload = start;
var cv, cx;
function start() {
	cv = mSection({ bg: BLUE, position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)' }, 'canvas1')
	cx = cv.getContext('2d');
	let w = cv.width = window.innerWidth * .8;
	let h = cv.height = window.innerHeight * .8;

	cStyle(cx, 'red', 'yellow', 10, 'round');
	//cRect(cx, 0, 0, w, h);


	


	cx.save(); //saves canvas state including transform

	//draw_spiral(cx,w,h,50,10);

	//h-tree fractals!!!!!!!!!!
	cCenterOrigin(cv, cx); //translate origin to center

	draw_fractal(cx, 8, 100, .5, 2, .5, 4);

	cx.restore(); //reverts cv state to last save


}

function draw_fractal(cx, sides, size, angle, branches, scale, maxlevel) {
	function drawBranch(level) {

		if (level <= 0) return;
		cLine(cx, 0, 0, size, 0);

		for (let i = 0; i < branches; i++) {

			let x=size - (size/branches) * i;

			cx.save();
			cx.translate(x, 0);
			cx.rotate(angle);
			cx.scale(scale,scale);
			drawBranch(level - 1);
			cx.restore();

			cx.save();
			cx.translate(x, 0);
			cx.rotate(-angle);
			cx.scale(scale,scale);
			drawBranch(level - 1);
			cx.restore();
		}

	}


	//drawBranch(maxlevel);

	for(let i=0;i<sides;i++){
		cx.rotate((Math.PI*2)/sides);

		drawBranch(maxlevel);
	}


}

function cCenterOrigin(cv, ctx) {
	ctx.translate((cv.width / 2), (cv.height / 2));
}
function draw_spiral(ctx, w, h, sides, trans) {
	//wie berechnet sich center width?
	//10*translated=100
	//draw_spiral(cx,w/2,h/2,180,20,,)
	//cx.rotate(.2); //rotate,translate,scale add up
	//*2 - (20:0,30:5,40:10,50:15,60:20,70:25)
	//let [sides,offs] = [70,115]; // [60,100]; // [50,85]; //[40,70]; //[30,55]; //[20,35] //[10,20]; 

	// let sides = 50;
	// let trans = 10;

	//let offs = sides*2 - (sides-2*trans)/2; //NEIN!!!
	// let offs = sides*2 - (sides-2*trans)/2; //NEIN!!!
	let offs = sides * 2 - (sides - 20) / 2; //NEIN!!!
	offs *= trans / 10;
	ctx.translate((w / 2) + offs, (h / 2) - offs); //translate origin to center
	//cx.scale(.5,.7);
	//cStyle(cx,'green','yellow',3,10,'round');
	let angle = (2 * Math.PI) / sides;
	for (let i = 0; i < sides; i++) {
		cLine(ctx, 0, 0, 130, 20);
		ctx.rotate(angle);
		//cx.scale(.9,.9);
		ctx.translate(trans, trans); //(10,10)
	}

}
function cLine(ctx, x1, y1, x2, y2) {
	ctx.beginPath();
	ctx.moveTo(x1, y1);
	ctx.lineTo(x2, y2)
	ctx.stroke();
}
function cRect(cvx, x, y, w, h) { cvx.fillRect(x, y, w, h); }
function cStyle(cvx, fill, stroke, wline, cap) {
	cvx.fillStyle = fill;
	if (isdef(stroke)) cvx.strokeStyle = stroke;
	if (isdef(wline)) cvx.lineWidth = wline;
	if (isdef(cap)) cvx.lineCap = cap;

}
























