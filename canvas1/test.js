

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
}

function foscillator() {

}
function combine(combiner, f, g) {
	if (typeof f != 'function') f = x => f; //a constant function
	if (typeof g != 'function') g = x => g; //a constant function
	return combiner(f, g);
}
function fprime(exp) {
	return x => math.derivative(exp, 'x').evaluate({ x: x });
	// math.derivative('x^2', 'x')                     // Node '2 * x'
	// math.derivative('x^2', 'x', {simplify: false})  // Node '2 * 1 * x ^ (2 - 1)'
	// math.derivative('sin(2x)', 'x'))                // Node '2 * cos(2 * x)'
	// math.derivative('2*x', 'x').evaluate()          // number 2
	// math.derivative('x^2', 'x').evaluate({x: 4})   
}
function fpwerer(f, g) { return x => Math.pow(f(x), g(x)); }
function fadder(f, g) { return x => f(x) - g(x); }
function fsubtracter(f, g) { return x => f(x) - g(x); }
function fmultiplier(f, g) { return x => f(x) * g(x); }
function fcomposer(f, g) { return x => f(g(x)); }
function linear_oscillator_ab(item) {
	let [astep, a, bstep, b, basefunc] = [item.astep, item.a, item.bstep, item.b, item.basefunc];
	[a, astep] = oscillate_between(a, 0, 5, astep);
	[b, bstep] = oscillate_between(b, 0, 5, bstep);
	[item.astep, item.a, item.bstep, item.b] = [astep, a, bstep, b];
	item.func = x => b * basefunc(a * x);
	return true;
}
function test12_fop() {
	let f = fprime('x*x'); let y = f(5); console.log('math.js y', y);
}
function test11_function() {
	C = new Plotter(dTable, {}, {}, gameloop_start, gameloop_stop, 'cc');
	C.add({ astep: .1, a: 0, bstep: .1, b: 0, color: 'skyblue', thickness: 1, basefunc: x => -x * (-Math.sign(x)), func: x => Math.sin(x), update: linear_oscillator_ab });
}


function test10_update(item, canvas) {
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
function update_func(item, canvas) {
	let [cv, ctx, ia, ib, ifunc, axes] = [canvas.cv, canvas.cx, item.ia, item.ib, item.ifunc, item.axes];
	cClear(cv, ctx);
	showAxes(ctx, axes);
	let [la, lb, lf] = [[1, 2, 3, 4, 5, 5, 5, 4, 3, 2], [0, .5, 1, 1.5, 2, 2.5, 2.5, 2.5, 2, 1.5, 1, .5], ['sin', 'cos']];
	let [a, b, f] = [la[ia], lb[ib], lf[ifunc]];
	[item.ia, item.ib, item.ifunc] = [(ia + 1) % la.length, (ib + 1) % lb.length, (ifunc + 1) % lf.length];
	funGraph(ctx, axes, x => Math[f](a * x), "rgb(11,153,11)", 1);
	return false;
}


function geniales_sin_ease(item, canvas) {
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
	C = new SimpleCanvas(dTable, {}, {}, gameloop_start, gameloop_stop, 'tl');
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
	C = new SimpleCanvas(dTable, {}, {}, gameloop_start, gameloop_stop, 'tl');
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
	C = new SimpleCanvas(dTable, {}, {}, gameloop_start, gameloop_stop, 'cc');
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
function test6_func() {
	C = new MathCanvas(dTable, {}, {}, gameloop_start, gameloop_stop, 'cc', 10);

	let f = x => Math.sqrt(x), d = .01;
	for (let x = C.minx; x < C.maxx; x += d) {
		let pt = C.point(x, f(x), 'yellow');
		C.add(pt);
	}
	C.draw();
}
function test5_line() {
	C = new MathCanvas(dTable, {}, {}, gameloop_start, gameloop_stop, 'cc', 10);

	let p1 = C.point(5, 3, 'yellow');
	let p2 = C.point(25, 12, 'red');
	for (let i = 0; i < 1; i += .01) {
		let p3 = lerpoint(p1, p2, i);
		C.add(p3);
	}
	C.draw();
}
function test4_range_math() {
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

function test3_point_math() {
	C = new Canvas95(dTable, {}, {}, gameloop_start, gameloop_stop, 'cc', null, true);
	C.add();
	C.add({ x: 50, y: 80, color: 'pink', draw: draw_point, update: update_move });
	C.add({ x: 50, y: -80, color: 'red', draw: draw_car, update: update_car, v: { a: 0, mag: 5 } });
	C.draw();

	C.play();
}
function test2_point_nomath() {
	C = new Canvas95(dTable, {}, {}, gameloop_start, gameloop_stop);
	C.add();
	C.add({ x: -200, y: 100, color: 'pink', draw: draw_point });
	C.draw();
	C.play();

}
function test1_car_math() {
	C = new Canvas95(dTable, {}, {}, gameloop_start, gameloop_stop, 'cc', null, true);
	C.add({ w: 30, h: 25, color: 'red', draw: draw_car, update: update_car, turn_inc: 10, v: { a: 280, mag: 5 } });
	C.add({ x: 30, y: -100, color: 'green', w: 35, h: 25, draw: draw_car, update: update_car, v: { a: 0, mag: 3 } });
	C.draw();
}
function test0_car_nomath() {
	C = new Canvas95(dTable, {}, {}, gameloop_start, gameloop_stop);
	C.add({ w: 30, h: 25, color: 'red', draw: draw_car, update: update_car, turn_inc: 10, v: { a: 280, mag: 5 } });
	C.add({ x: 30, y: -100, color: 'green', w: 35, h: 25, draw: draw_car, update: update_car, v: { a: 0, mag: 3 } });
	C.draw();
}





















