onload = start;
var cv, cx, w = 600;
var sides, scale, angle, color;
function start() {

	[cv, cx] = mCanvas('dTable', w, w, { bg: '#333', margin: 'auto' });

	cv.onclick = onclick_generate;
	mLinebreak('dTable')
	mButton('clear', onclick_clear, 'dTable', { fx: 20, bg: 'silver' });
	mLinebreak('dTable')
	mDiv('dTable',{},'dInfo');

	onclick_generate();
}
function onclick_clear(){
	cClear(cv,cx);
	mClear('dInfo');
}
function onclick_generate() {
	randomize_fractal();
	cStyle(cx, 'red', color, 10, 'round');
	cShadow(cx, 'silver', 5, 5, 10);

	//cx, sides, size, angle, branches, scale, maxlevel, x, y
	draw_fractal(cx, sides, w / 4, angle, 2, scale, 4, w / 2, w / 2);
}

function randomize_fractal() {
	sides = Math.round(Math.random() * 8 + 2);
	scale = Math.random() * 0.2 + 0.4;
	angle = Math.random() * 2.9 + 0.1;
	color = 'hsla(' + Math.random() * 360 + ', 100%,50%,100%)';

	let txt = `sides:${sides.toFixed(0)} scale:${scale.toFixed(1)} angle:${toDegree(angle).toFixed(0)}`
	console.log('sides', sides, 'scale', scale, 'angle', angle);
	mLinebreak('dTable');
	mText(txt,'dInfo');

}

function draw_fractal(cx, sides, size, angle, branches, scale, maxlevel, x, y) {
	function drawBranch(level) {

		if (level <= 0) return;
		cLine(cx, 0, 0, size, 0);

		for (let i = 0; i < branches; i++) {

			let x = size - (size / branches) * i;

			cx.save();
			cx.translate(x, 0);
			cx.rotate(angle);
			cx.scale(scale, scale);
			drawBranch(level - 1);
			cx.restore();

			cx.save();
			cx.translate(x, 0);
			cx.rotate(-angle);
			cx.scale(scale, scale);
			drawBranch(level - 1);
			cx.restore();
		}

	}


	//drawBranch(maxlevel);

	cx.save();

	//cSetOrigin(cx, x, y);
	cx.translate(x, y);
	cx.scale(1, 1);
	cx.rotate(0);
	for (let i = 0; i < sides; i++) {
		cx.rotate((Math.PI * 2) / sides);

		drawBranch(maxlevel);
	}
	cx.restore();


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























