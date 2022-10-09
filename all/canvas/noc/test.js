//#region phantasy apps
function a0_functions(){
	
	// make_input_for_math exp eg.: integral(sin(x),dx)
	//make_input_for_operator eg.: integral 
	//make input for operator params: sin(x) dx
	//plot function or eval function at point
}

//#region multiple canvases!
function noc6_simple_gaussian() {
	let canvas = arrFirst(G.items);
	simple_gaussian(canvas);
}
function noc5_draw_text() {
	let canvas = arrLast(G.items);
	let d = mInsert(dTable, mCreate('div'));
	mText('hallo', d, { fz: 40, family: 'algerian' }); //,null,`<h1>HALLO COOLES TEIL!!!!!!!!!!</h1>`);
	draw_text(canvas, 'hallo', { family: 'algerian', fg: 'white', pos: 'tr' }); //,family:'segoe ui'});
}
function noc4_gaussian() {
	let canvas = arrLast(G.items);
	draw_gaussian(canvas, 100, 15, 'lime', 1, 'silver', 'IQ');
	return;
	canvas.draw_axes();
	canvas.scale = 40; console.log('canvas', canvas)
	let f = gaussian_amp(canvas, 1)
	canvas.plot(f, 'orange', 1);
	draw_ticks_gaussian(canvas, f, 100, 15, 'silver');
}
function noc3_gaussian() {
	let canvas = arrLast(G.items);

	let [mean, stdev] = [0, 1]
	let f = x => gaussian1(x, mean, stdev);
	//berechne f(0)
	let y = f(0);
	console.log('y', y);
	//ich will dass f(0) ca 140 ist
	//40 ist bereits die scale!
	//dh, y*40 wird represented
	//y*40*? = 140
	//?= 140/(40*y)
	let amp = .9 * (-canvas.miny) / (40 * y);
	f = x => gaussian1(x, mean, stdev, amp);
	canvas.draw_axes();
	canvas.plot(f, 'orange', 1);

	//1. find x with f(x)<.1, same will be for -x
	//how to find that x?
	let x = 40 * search_end_point(f, 0, canvas.maxx, .1, .01);
	console.log('point x', x, canvas.minx, canvas.maxx);
	y = -40 * f(x / 40)
	console.log('point y', x, 0, canvas.maxy);
	console.log('scale', canvas.scale)

	let xreal = x / 40;
	let yreal = f(xreal) / (40);

	x = 0;
	for (let i = canvas.minx; i < canvas.maxx; i += canvas.scale) {
		//500/40 = 12.5
		//check ob ich bei einem 
		let x1 = Math.round(convert_to_range(x, -4, 4, 50, 150));
		let x2 = Math.round(convert_to_range(-x, -4, 4, 50, 150));
		canvas.pp(x * 40, 0, `${x1}`);
		canvas.pp(-x * 40, 0, `${x2}`); x += 2;
	}


	//starting at x=0



}
function noc2_explicit_distribution() {
	let [c1, c2] = [G.items[0], G.items[1]];

	//wie mach ich das:direkt bei update soll x mit wk80 hinauf und mit wk20 hinunnter gehen
	//let names={x:}
	const sampler = new WeightedSampler([{ x: 1 }, { x: -1 }, { y: 1 }, { y: -1 }], [1, 2, 1, 2]);
	//ja das geht super schnell!
	let randomArray = Array.apply(null, Array(100000)).map(() => sampler.get());
	let randomArray2 = Array.apply(null, Array(100000)).map(() => sampler.get());
	console.log(randomArray);


	// let probs = [{ val: { x: -1, y: 0 }, p: 1 }, { val: { x: 1, y: 0 }, p: 2 }, { val: { x: 0, y: -1 }, p: 3 }, { val: { x: 0, y: 1 }, p: 3 }];
	// c1.add({ probs: probs, update: move_probs, w: 2, h: 2 });


}
function noc1_randomwalkers() {
	let [c1, c2] = [G.items[0], G.items[1]];

	let probs = [{ val: { x: -1, y: 0 }, p: 1 }, { val: { x: 1, y: 0 }, p: 2 }, { val: { x: 0, y: -1 }, p: 3 }, { val: { x: 0, y: 1 }, p: 3 }];
	c1.add({ probs: probs, update: move_probs, w: 2, h: 2 });

	c2.add({ label: 'tom', draw: draw_label, update: move_random });
	//c2.add(new CItemWalker('tim'));

}
function noc0_randomwalkers() {
	let [c1, c2] = [G.items[0], G.items[1]];
	c1.add({ update: move_random, w: 2, h: 2 });
	c2.add({ label: 'tom', draw: draw_label, update: move_random });
	c2.add(new CItemWalker('tim'));

}

//#endregion

//#region legacy SimpleCanvas, single global C
function test17_randomwalk() {
	C = new CCanvasNoClear(dTable, {}, {}, gameloop_start, gameloop_stop);
	C.add({ update: move_random, w: 2, h: 2 });
	C.add(new CItemWalker({ label: 'tom' }))
	C.play();

}
function test16_function() {
	C = new Plotter(dTable);
	C.add({ color: 'skyblue', thickness: 1, func: nerdamer('integrate(x,x)').buildFunction() });
	C.draw();
}
function test15_function() {
	C = new Plotter(dTable);
	C.add({ color: 'skyblue', thickness: 1, func: x => Math.sin(x) });
	C.draw();
}
function test14_function() {
	C = new Plotter(dTable, {}, {}, gameloop_start, gameloop_stop, 'cc');
	C.add({ astep: .1, a: 0, bstep: .1, b: 0, color: 'skyblue', thickness: 1, basefunc: x => -x * (-Math.sign(x)), func: x => Math.sin(x), update: oscillator });
	C.play();
}
function test13_nerdamer() {
	nerdamer.setVar('M', 'matrix([1, 5], [4, 4])');
	var x = nerdamer('invert(M)');
	console.log(x.toString(), typeof x, x);

	var r = nerdamer('polarform(b*x+x*c*i)');
	console.log(r.toString());
	var t = nerdamer('polarform(5+i)')
	console.log(t.toString());

	nerdamer.setVar('M', 'matrix([x,y],[a,b])');
	console.log(nerdamer('transpose(M)').toString());

	nerdamer.setVar('M', 'matrix([4,5],[1,7])');
	x = nerdamer('determinant(M)');
	console.log(x.toString(), Number(x), typeof x, typeof Number(x), Number(x) + 1);
	console.log('==>', parseFloat(x));

	var x = nerdamer('limit(x^x-1,x,0)');
	console.log(x.toString());
	var y = nerdamer('limit((x^2+2*x-3)/(x^6+4),x,0)');
	console.log(y.toString());

	var x = nerdamer('solve(x^3+1, x)');
	console.log(x.toString());
	x = nerdamer.solve('x^2+2*x+1', 'x');
	console.log(x.toString());
	x = nerdamer.solve('3*(x+a)*(x-b)', 'x');
	console.log(x.toString());
	x = nerdamer.solve('3*(x+a)*(x-b)', 'x');
	console.log(x.toString());
	// Full equations are also supported.
	x = nerdamer('solve(x^4=1,x)');
	console.log(x.toString());
	x = nerdamer('solve(y=m*x+c, x)');
	console.log(x.toString());

	x = nerdamer.solve('x^2-1', 'x');
	console.log(x.toString());

	x = nerdamer.max(1, 4, 3, 5);
	console.log(x.toString());

	var x = nerdamer('sqcomp(9*x^2-18*x+17)');
	console.log(x.toString());
	var y = nerdamer('sqcomp(a*x^2+b*x-11*c, x)');
	console.log(y.toString());

	var x = nerdamer('roots(x^2-3*x-10)');
	console.log(x.toString())
	var y = nerdamer('roots(x^2+1)');
	console.log(y.toString());

	var x = nerdamer('divide(x^2+2*x+1, x+1)');
	console.log(x.toString())
	var y = nerdamer('divide(-b*z-a*z+b^3+a*b^2+a*b+a^2, b+a)');
	console.log(y.toString());

	var x = nerdamer('gcd(x^2+2*x+1, x^2+6*x+5)');
	console.log(x.toString())
	var y = nerdamer('gcd(b*z+a*z+b^2+a*b, a+b)');
	console.log(y.toString());
	var z = nerdamer('gcd(24,12,552)');
	console.log(z.toString());

	var x = nerdamer('product(x+1, x, 1, 20)');
	console.log(x.toString())
	var y = nerdamer('product(x+y, x, 1, 5)');
	console.log(y.toString());
	var z = nerdamer('product(x, x, 1, 5)');
	console.log(z.toString());

	var x = nerdamer('sum(x+1, x, 1, 5)');
	console.log(x.toString())
	var y = nerdamer('sum(x+y, x, 1, 20)');
	console.log(y.toString());

	console.log('_______simplify')
	var x = nerdamer('simplify((x^2+4*x-45)/(x^2+x-30))');
	console.log(x.toString());
	var y = nerdamer('simplify((17/2)*(-10+8*i)^(-1)-5*(-10+8*i)^(-1)*i)');
	console.log(y.toString());
	var z = nerdamer('simplify(1+1+3+5+13)');
	console.log(z, typeof z, Number(z) + 1);

	console.log('_______ defint')
	var x = nerdamer('defint(e^(cos(x)), 1, 2)');
	console.log(x.text());
	var y = nerdamer('defint(x^2+2*x+1,0, 10)');
	console.log(y.text());
	var y = nerdamer('defint(log(2cos(x/2)),-π,π,x)');
	console.log(y.text());

	console.log('_______ derivative diff')
	var x = nerdamer('diff(cos(x)*sin(x), x)');
	console.log(x.toString());
	var y = nerdamer('diff([x^2, cos(x), 1], x, 2)'); //second derivative
	console.log(y.toString());
	var y = nerdamer('diff(x^3+a*x^3+x^2, x, 2)'); //second derivative
	console.log(y.toString());
	x = nerdamer.diff(nerdamer('x^2').add(1).multiply('tan(x)'), 'x')
	console.log(x.toString());
	x = nerdamer('diff(a+b*x+c*x^2, x)');
	console.log(x.toString());
	x = nerdamer('diff(x^2, x)');
	console.log(x.toString());

	var x = nerdamer('sin(9+5)');
	//the expression is simplified but the functions aren't called.
	console.log(x.toString());
	//force function calls with evaluate
	console.log(x.evaluate().toString());

	var x = nerdamer('integrate(x*2,x)');
	console.log(x.toString());
	y = x.evaluate();
	console.log('eval:', y);

	var x = nerdamer('integrate(10*q/(4*x^2+24*x+20), x)');
	console.log(x.toString());
	var y = nerdamer('integrate(sec(x)^2, x)');
	console.log(y.toString());
	var y = nerdamer('integrate([sec(x)^2, x^2, 2], x)');
	console.log(y.toString());
	var x = nerdamer('integrate(cos(x)*x^6, x)');
	console.log(x.toString());
	//we can use the hasIntegral method to check if it was fully integrated
	console.log(x.hasIntegral());
	x = nerdamer.integrate('sinh(x)*e^x');
	console.log(x.toString());

	var e = nerdamer('x^2+2*(cos(x)+x*x)', { x: 6 }).evaluate();
	var e = nerdamer('x^2+2*(cos(x)+x*x)', { x: 6 });
	var e = nerdamer('x^2+2*(cos(x)+x*x)', { x: 6 }).evaluate();
	console.log(e.text());
	console.log(e);
	var e = nerdamer('x^2+2*(cos(x)+x*x)');

	console.log(e.text());
	console.log(e);

	var result = nerdamer('cos(x)', { x: 6 });
	console.log(result.text());
	//cos(6)

	var result = nerdamer('cos(x)', { x: 6 }, 'numer');
	console.log(result.text());
	//0.960170286650366

	var result = nerdamer('cos(x)', { x: 6 }).evaluate();
	console.log(result.text());
	//0.960170286650366

	var f = nerdamer('integrate(x,x)').buildFunction();

	console.log(f(3));
	//0.960170286650366

	f = nerdamer('diff(x^3,x)').buildFunction();
	console.log(f(20));



}
function test12_fop() {
	let f = fprime('x*x'); let y = f(5); console.log('math.js y', y);
}
function test11_function() {
	C = new Plotter(dTable, {}, {}, gameloop_start, gameloop_stop, 'cc');
	C.add({ astep: .1, a: 0, bstep: .1, b: 0, color: 'skyblue', thickness: 1, basefunc: x => -x * (-Math.sign(x)), func: x => Math.sin(x), update: oscillator });
}
function test10_update(canvas, item) {
	let [astep, a, bstep, b, func] = [item.astep, item.a, item.bstep, item.b, item.func];
	canvas.clear();

	[a, astep] = oscillate_between(a, 0, 5, astep);
	[b, bstep] = oscillate_between(b, 0, 5, bstep);

	[item.astep, item.a, item.bstep, item.b] = [astep, a, bstep, b];

	canvas.plot(x => b * func(a * x), "rgb(11,153,11)", 1);
	return false;
}
function test10_function() {
	C = new Plotter(dTable, {}, {}, gameloop_start, gameloop_stop, 'cc');
	let canvas = C.cv;

	C.add({ astep: .1, a: 0, bstep: .1, b: 0, func: x => Math.sin(x), update: test10_update });

}
function fun1(x) { return Math.sin(x); }
function fun2(x) { return Math.cos(3 * x); }
function geniales_sin_ease(canvas, item) {
	let [cv, ctx, astep, a, bstep, b, func, axes] = [canvas.cv, canvas.cx, item.astep, item.a, item.bstep, item.b, item.func, item.axes];
	cClear(cv, ctx);
	showAxes(ctx, axes);

	[a, astep] = oscillate_between(a, 0, 5, astep);
	[b, bstep] = oscillate_between(b, 0, 5, bstep);

	[item.astep, item.a, item.bstep, item.b] = [astep, a, bstep, b];

	funGraph(ctx, axes, x => b * func(a * x), "rgb(11,153,11)", 1);
	return false;

}
function test9_function() {
	C = new CCanvas(dTable, {}, {}, gameloop_start, gameloop_stop, 'tl');
	let canvas = C.cv;

	let axes = {}, ctx = canvas.getContext("2d");
	axes.x0 = .5 + .5 * canvas.width;  // x0 pixels from left to x=0
	axes.y0 = .5 + .5 * canvas.height; // y0 pixels from top to y=0
	axes.scale = 40;                 // 40 pixels from x=0 to x=1
	axes.doNegativeX = true;
	// C.add({ia:0,ib:0,ifunc:0,axes:axes,update:update_func});
	C.add({ astep: .1, a: 0, bstep: .1, b: 0, func: x => Math.sin(x), axes: axes, update: geniales_sin_ease });

}
function test8_function() {
	C = new CCanvas(dTable, {}, {}, gameloop_start, gameloop_stop, 'tl');
	//let ctx = C.cx; //canvas.getContext("2d");
	let canvas = C.cv;
	//var canvas = document.getElementById("canvas");
	if (null == canvas || !canvas.getContext) return;

	var axes = {}, ctx = canvas.getContext("2d");
	axes.x0 = .5 + .5 * canvas.width;  // x0 pixels from left to x=0
	axes.y0 = .5 + .5 * canvas.height; // y0 pixels from top to y=0
	axes.scale = 40;                 // 40 pixels from x=0 to x=1
	axes.doNegativeX = true;

	console.log('axes', axes)
	showAxes(ctx, axes);
	funGraph(ctx, axes, fun1, "rgb(11,153,11)", 1);
	funGraph(ctx, axes, fun2, "rgb(66,44,255)", 2);
}
function test7_function() {
	C = new CCanvas(dTable, {}, {}, gameloop_start, gameloop_stop, 'cc');
	let ctx = C.cx; //canvas.getContext("2d");
	let canvas = C.cv;
	let h = canvas.height;
	let w = canvas.width;
	let cw = w / 2; // centers
	let ch = h / 2;
	let subStepCount = 10;  // number of sub setps
	let scale = 10;         // scale of the plot

	function plot(func, col, lineWidth) {
		let invScale = 1 / scale;    // inverted scale is the size of a pixel
		let top = ch * invScale;     // get top and bottom
		let bottom = -ch * invScale;
		let subStep = invScale / subStepCount; // get the sub steps between pixels
		let x, y, yy, xx, subX;                    // xx,yy are the coords of prev point
		let start = (-cw - 1) * invScale;      // get the start and end
		let end = (cw + 1) * invScale;
		// set render styles
		ctx.strokeStyle = col;
		ctx.lineWidth = lineWidth * invScale; // scale line to be constant size

		ctx.beginPath();
		for (x = start; x < end; x += invScale) { // pixel steps
			for (subX = 0; subX < invScale; subX += subStep) {  // sub steps
				y = func(x + subX);                    // get y for x 
				if (yy !== undefined) {                // is this not the first point
					if (y > top || y < bottom) {       // this y outside ?
						if (yy < top && yy > bottom) { // last yy inside?
							ctx.lineTo(x + subX, y);
						}
					} else {                         // this y must be inside
						if (yy > top || yy < bottom) { // was last yy outside
							ctx.moveTo(xx, yy);       // start a new path
						}
						if (subX === 0) {              // are we at a pixel 
							if (y > bottom && y < top) {  // are we inside
								// if the step is large then might be a line break
								if (Math.abs(yy - y) > (top - bottom) * (1 / 3)) {
									ctx.moveTo(x, y);
								} else {
									ctx.lineTo(x, y);
								}
							}
						}
					}
				} else {
					if (subX === 0) {
						ctx.moveTo(x, y);
					}
				}
				yy = y;
				xx = x + subX;
			}
		}
		ctx.stroke();


	}

	// set the plot scale and orientation 
	ctx.setTransform(scale, 0, 0, -scale, cw, ch);
	// two example function plots
	//plot((x) => Math.tan(Math.cos(x / 2) * 10), "#F88", 1);
	//plot((x) => Math.tan(x), "blue", 2);
	plot(x => 0, 'white', 2);
	plot(x => 5 * Math.sin(x), 'white', 2);
	plot(x => 5 * Math.sin(x), 'white', 2);
}
//#endregion

//#region legacy MathCanvas, Canvas96

function test6_func_GEHT_NICHT() {
	C = new MathCanvas(dTable, {}, {}, gameloop_start, gameloop_stop, 'cc', 10);

	let f = x => Math.sqrt(x), d = .01;
	for (let x = C.minx; x < C.maxx; x += d) {
		let pt = C.point(x, f(x), 'yellow');
		C.add(pt);
	}
	C.draw();
}
function test5_line_GEHT_NICHT() {
	C = new MathCanvas(dTable, {}, {}, gameloop_start, gameloop_stop, 'cc', 10);

	let p1 = C.point(5, 3, 'yellow');
	let p2 = C.point(25, 12, 'red');
	for (let i = 0; i < 1; i += .01) {
		let p3 = lerpoint(p1, p2, i);
		C.add(p3);
	}
	C.draw();
}
function test4_range_math_GEHT_NICHT() {
	C = new MathCanvas(dTable, {}, {}, gameloop_start, gameloop_stop, 'cc', 10);

	let x = colorMix('yellow', 'red'); console.log('color', x)

	//return;
	let p1 = C.point(5, 3, 'yellow');
	let p2 = C.point(25, 12, 'red');
	for (let i = 0.1; i < .9; i += .1) {
		let p3 = lerpoint(p1, p2, i);
		C.add(p3);
	}
	// let p3 = C.lerp(p1,p2); 
	// console.log('midpoint',p3)
	// C.add(p3);

	//C.add({ x: 50, y: 80, color: 'pink', draw: draw_point });
	//C.add({ x: 50, y: -80, color: 'red', draw: draw_point });
	C.draw();

}

//#endregion

//#region legacy global C mit CCanvas
function test3_point_math() {
	C = new CCanvas(dTable, {}, {}, gameloop_start, gameloop_stop, 'cc', null, true);
	C.add();
	C.add({ x: 50, y: 80, color: 'pink', draw: draw_point, update: update_move });
	C.add({ x: 50, y: -80, color: 'red', draw: draw_car, update: update_car, v: { a: 0, mag: 5 } });
	C.draw();

	C.play();
}
function test2_point_nomath() {
	C = new CCanvas(dTable, {}, {}, gameloop_start, gameloop_stop);
	C.add();
	C.add({ x: -200, y: 100, color: 'pink', draw: draw_point });
	C.draw();
	C.play();

}
function test1_car_math() {
	C = new CCanvas(dTable, {}, {}, gameloop_start, gameloop_stop, 'cc', null, true);
	C.add({ w: 30, h: 25, color: 'red', draw: draw_car, update: update_car, turn_inc: 10, v: { a: 280, mag: 5 } });
	C.add({ x: 30, y: -100, color: 'green', w: 35, h: 25, draw: draw_car, update: update_car, v: { a: 0, mag: 3 } });
	C.draw();
}
function test0_car_nomath() {
	C = new CCanvas(dTable, {}, {}, gameloop_start, gameloop_stop);
	C.add({ w: 30, h: 25, color: 'red', draw: draw_car, update: update_car, turn_inc: 10, v: { a: 280, mag: 5 } });
	C.add({ x: 30, y: -100, color: 'green', w: 35, h: 25, draw: draw_car, update: update_car, v: { a: 0, mag: 3 } });
	C.draw();
}

//#endregion





















