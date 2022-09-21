

function gaussian(x) {
	return 12 * Math.E ** (-(x ** 2) / 2) / Math.sqrt(2 * Math.PI);
}
function gaussian(x, m = 0, stdev = 2, amp = 1) {
	let v = stdev * stdev;
	return amp * Math.E ** (-((x - m) ** 2) / (2 * v)) / Math.sqrt(v * 2 * Math.PI);
}
function gaussian(x, m = 0, stdev = 1.25, amp = 1) {
	let v = stdev * stdev;
	return amp * Math.E ** (-((x - m) ** 2) / (2 * v)) / Math.sqrt(v * 2 * Math.PI);
}
function draw_ticks(f, canvas) {
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
		let x1 = Math.round(abaxis(x, -4, 4, 50, 150));
		let x2 = Math.round(abaxis(-x, -4, 4, 50, 150));
		canvas.pp(x * sc, 0, 3, `${x1}`);
		canvas.pp(-x * sc, 0, 3, `${x2}`); x += 2;
	}
}
function draw_ticks(f, canvas) {
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
		let x1 = Math.round(abaxis(x, -4, 4, 50, 150));
		let x2 = Math.round(abaxis(-x, -4, 4, 50, 150));
		canvas.pp(x * sc, 0, 3, `${x1}`);
		canvas.pp(-x * sc, 0, 3, `${x2}`); x += 2;
	}
}
function draw_ticks(f, canvas) {
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
		let x1 = Math.round(abaxis(x, -4, 4, 50, 150));
		let x2 = Math.round(abaxis(-x, -4, 4, 50, 150));
		canvas.pp(x * sc, 0, 3, `${x1}`);
		canvas.pp(-x * sc, 0, 3, `${x2}`); x += 2;
	}
}








