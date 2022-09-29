function rest() {





	styles.al = 'brv'; //letters anordnen oben nach unten, b von pos hinunter, r von pos
	cx.textBaseline = "top";
	cx.fillText("Top", 5, 100);
	cx.textBaseline = "bottom";
	cx.fillText("Bottom", 50, 100);
	cx.textBaseline = "middle";
	cx.fillText("Middle", 120, 100);
	cx.textBaseline = "alphabetic";
	cx.fillText("Alphabetic", 190, 100);
	cx.textBaseline = "hanging";
	cx.fillText("Hanging", 290, 100);
}
function more() {
	//pos is [tcb][lcr] should be pos relative to styles.x,y
	let sz = measureText(text, styles, cx);

	console.log('sz', sz)
	let [v, h] = [pos[0], pos[1]];
	let offy = v == 't' ? -sz.h : 'c' ? -sz.h / 2 : 0;
	let offx = h == 'l' ? -sz.w : 'c' ? -sz.w / 2 : 0;

	let [x, y] = [styles.x + offx, styles.y + offy];
	console.log('pos', pos, styles.x, styles.y, x, y)
	//let offx = pos[0]=='
	cx.fillText(text, x, y);

	return;
	//code von pp:
	//let cx = this.cx;
	if (pos[1] == 'c') cx.textAlign = 'center';
	cx.font = `16px Arial`;
	cx.fillStyle = color;
	cx.fillText(`${label}`, x, y + (pos[0] == 'b' ? 20 : -10));

}

function gaussian_amp(x) {
	return 12 * Math.E ** (-(x ** 2) / 2) / Math.sqrt(2 * Math.PI);
}
function gaussian1(x, m = 0, stdev = 2, amp = 1) {
	let v = stdev * stdev;
	return amp * Math.E ** (-((x - m) ** 2) / (2 * v)) / Math.sqrt(v * 2 * Math.PI);
}
function MUELL() {
	let [mean, stdev] = [0, 1];
	let f = x => gaussian_amp(x, mean, stdev);
	//berechne f(0)
	let y = f(0);
	console.log('y', y);
	//ich will dass f(0) ca 140 ist
	//40 ist bereits die scale!
	//dh, y*40 wird represented
	//y*40*? = 140
	//?= 140/(40*y)
	let amp = .9 * (-canvas.miny) / (40 * y);
	f = x => gaussian_amp(x, mean, stdev, amp);
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
	//canvas.pp(x,y,5,`${xreal.toFixed(1)},${yreal.toFixed(1)}`);

	x = 0;
	for (let i = canvas.minx; i < canvas.maxx; i += canvas.scale) {
		//500/40 = 12.5
		//check ob ich bei einem 
		let x1 = Math.round(convert_to_range(x, -4, 4, 50, 150));
		let x2 = Math.round(convert_to_range(-x, -4, 4, 50, 150));
		canvas.pp(x * 40, 0, 3, `${x1}`);
		canvas.pp(-x * 40, 0, 3, `${x2}`); x += 2;
	}
}

function gaussian_amp(x) {
	return 12 * Math.E ** (-(x ** 2) / 2) / Math.sqrt(2 * Math.PI);
}
function gaussian_amp(x, m = 0, stdev = 2, amp = 1) {
	let v = stdev * stdev;
	return amp * Math.E ** (-((x - m) ** 2) / (2 * v)) / Math.sqrt(v * 2 * Math.PI);
}
function gaussian_amp(x, m = 0, stdev = 1.25, amp = 1) {
	let v = stdev * stdev;
	return amp * Math.E ** (-((x - m) ** 2) / (2 * v)) / Math.sqrt(v * 2 * Math.PI);
}
function draw_ticks(canvas, f) {
	let sc = canvas.scale;
	console.log('scale', sc)
	let x = sc * search_end_point(f, 0, canvas.maxx, .1, .01);
	console.log('point x', x, canvas.minx, canvas.maxx);
	y = -sc * f(x / sc);
	console.log('point y', x, 0, canvas.maxy);
	let xreal = x / sc;
	let yreal = f(xreal) / sc;
	//canvas.pp(x,y,5,`${xreal.toFixed(1)},${yreal.toFixed(1)}`);

	x = 0;
	for (let i = canvas.minx; i < canvas.maxx; i += canvas.scale) {
		//500/40 = 12.5
		//check ob ich bei einem 
		let x1 = Math.round(convert_to_range(x, -4, 4, 50, 150));
		let x2 = Math.round(convert_to_range(-x, -4, 4, 50, 150));
		canvas.pp(x * sc, 0, 3, `${x1}`);
		canvas.pp(-x * sc, 0, 3, `${x2}`); x += 2;
	}
}
function draw_ticks(canvas, f) {
	let sc = canvas.scale;
	console.log('scale', sc)
	let x = sc * search_end_point(f, 0, canvas.maxx, .1, .01);
	console.log('point x', x, canvas.minx, canvas.maxx);
	y = -sc * f(x / sc);
	console.log('point y', x, 0, canvas.maxy);
	let xreal = x / sc;
	let yreal = f(xreal) / sc;
	//canvas.pp(x,y,5,`${xreal.toFixed(1)},${yreal.toFixed(1)}`);

	x = 0;
	for (let i = canvas.minx; i < canvas.maxx; i += canvas.scale) {
		let x1 = Math.round(convert_to_range(x, -4, 4, 50, 150));
		let x2 = Math.round(convert_to_range(-x, -4, 4, 50, 150));
		canvas.pp(x * sc, 0, 3, `${x1}`);
		canvas.pp(-x * sc, 0, 3, `${x2}`); x += 2;
	}
}
function draw_ticks(canvas, f) {
	let sc = canvas.scale;
	console.log('scale', sc);
	let x = search_end_point(f, 0, canvas.maxx, .1, .01);
	console.log('point x', x, canvas.minx, canvas.maxx);
	y = f(x);
	console.log('point y', y, 0, canvas.maxy);
	let xreal = x / sc;
	let yreal = f(xreal) / sc;
	//canvas.pp(x,y,5,`${xreal.toFixed(1)},${yreal.toFixed(1)}`);

	x = 0;
	for (let i = canvas.minx; i < canvas.maxx; i += canvas.scale) {
		let x1 = Math.round(convert_to_range(x, -4, 4, 50, 150));
		let x2 = Math.round(convert_to_range(-x, -4, 4, 50, 150));
		canvas.pp(x * sc, 0, 3, `${x1}`);
		canvas.pp(-x * sc, 0, 3, `${x2}`); x += 2;
	}
}








