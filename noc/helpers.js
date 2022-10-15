
//#region math: probability & statistics, nerdamer
function normalcdf(x, mean, stdev) {   //HASTINGS.  MAX ERROR = .000001
	x = (x - mean) / stdev;
	var a1 = 1 / (1 + .2316419 * Math.abs(x));
	var a2 = .3989423 * Math.exp(-x * x / 2);
	var p = a2 * a1 * (.3193815 + a1 * (-.3565638 + a1 * (1.781478 + a1 * (-1.821256 + a1 * 1.330274))));
	if (x > 0) {
		p = 1 - p
	}
	return p;
}
function cdf0(x) {
	function normal(x, mu, sigma) {
		return stdNormal((x - mu) / sigma);
	}

	function stdNormal(z) {
		var j, k, kMax, m, values, total, subtotal, item, z2, z4, a, b;

		// Power series is not stable at these extreme tail scenarios
		if (z < -6) { return 0; }
		if (z > 6) { return 1; }

		m = 1;        // m(k) == (2**k)/factorial(k)
		b = z;        // b(k) == z ** (2*k + 1)
		z2 = z * z;    // cache of z squared
		z4 = z2 * z2;  // cache of z to the 4th
		values = [];

		// Compute the power series in groups of two terms.
		// This reduces floating point errors because the series
		// alternates between positive and negative.
		for (k = 0; k < 100; k += 2) {
			a = 2 * k + 1;
			item = b / (a * m);
			item *= (1 - (a * z2) / ((a + 1) * (a + 2)));
			values.push(item);
			m *= (4 * (k + 1) * (k + 2));
			b *= z4;
		}

		// Add the smallest terms to the total first that
		// way we minimize the floating point errors.
		total = 0;
		for (k = 49; k >= 0; k--) {
			total += values[k];
		}

		// Multiply total by 1/sqrt(2*PI)
		// Then add 0.5 so that stdNormal(0) === 0.5
		return 0.5 + 0.3989422804014327 * total;
	}
	return normal(x, 100, 15);
}
function cumulative_distribution(from, to, mean, stdev, n = 0) {
	function cdfNormal(x, mean = 100, standardDeviation = 15) {
		return (1 - math.erf((mean - x) / (Math.sqrt(2) * standardDeviation))) / 2;
	}

	let res;
	if (to < from) { let h = from; from = to; to = h; }
	assertion(from <= to, 'MATH!!!!!!!!!!!!!!!??????????????????????')
	if (from <= mean && to >= mean) {
		let kleiner_als_from = cdfNormal(from, mean, stdev); console.log(kleiner_als_from)
		let kleiner_als_mean = cdfNormal(mean, mean, stdev); console.log(kleiner_als_mean)
		let res1 = kleiner_als_mean - kleiner_als_from; console.log('res1', res1);
		let kleiner_als_to = cdfNormal(to, mean, stdev); console.log(kleiner_als_to)
		//let kleiner_als_mean = cdfNormal(mean,mean,stdev); console.log(kleiner_als_mean)
		let res2 = kleiner_als_to - kleiner_als_mean; console.log('res2', res2);
		console.log(res1 + res2); res = res1 + res2;
	} else {
		let kleiner_als_to = cdfNormal(to, mean, stdev); console.log(kleiner_als_to)
		let kleiner_als_from = cdfNormal(from, mean, stdev); console.log(kleiner_als_from)
		res = kleiner_als_to - kleiner_als_from; console.log('res', res);
	}

	return 100 * res.toFixed(n);
}
function gauss(x, mean, standardDeviation) {
	return (1 / standardDeviation * Math.sqrt(2 * (3, 14))) * Math.pow(Math.E, -Math.pow(x - mean, 2) / (2 * (standardDeviation * standardDeviation)));
}
function g5(x, mean, stdev) {
	x = (x - mean) / stdev;
	return Math.pow(Math.E, -Math.pow(x, 2) / 2) / Math.sqrt(2 * Math.PI);
}
function g6(x, mean, stdev) {
	x = (x - mean) / stdev;
	return Math.E ** (-(x ** 2) / 2) / Math.sqrt(2 * Math.PI);
	//Math.pow(Math.E, -Math.pow(x, 2) / 2) / Math.sqrt(2 * Math.PI);
}
function g7(x, mean, stdev) {
	x = (x - mean);
	let v = stdev * stdev;
	return Math.E ** (-(x ** 2) / (2 * v)) / Math.sqrt(v * 2 * Math.PI);
	//Math.pow(Math.E, -Math.pow(x, 2) / 2) / Math.sqrt(2 * Math.PI);
}
function gaussian_amp(canvas, stdev) {
	let v = stdev * stdev;
	function formula(x, v, amp) { return amp * Math.E ** (-(x ** 2) / (2 * v)) / Math.sqrt(v * 2 * Math.PI); }
	let y = 1 / Math.sqrt(v * 2 * Math.PI);
	let amp = .9 * (-canvas.miny) / (canvas.scale * y);
	let f = formula(2, amp);
	f = x => formula(x, v, amp);
	return f;
}
function gaussianRand() {
	var rand = 0;
	for (var i = 0; i < 6; i += 1) { rand += Math.random(); }
	return rand / 6;
}
function gaussianRandom(start, end) { return Math.floor(start + gaussianRand() * (end - start + 1)); }
function ncdf(x, mean = 100, std = 15) {
	var x = (x - mean) / std
	var t = 1 / (1 + .2315419 * Math.abs(x))
	var d = .3989423 * Math.exp(-x * x / 2)
	var prob = d * t * (.3193815 + t * (-.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))))
	if (x > 0) prob = 1 - prob
	return prob
}
function nerd_custom_function() {
	//You can interact with the parser directly by getting the core
	//with nerdamer loaded either in a web page or node.js
	var core = nerdamer.getCore();
	//the parser can be accessed in the core through PARSER. 
	//Make a shortcut using underscore
	var _ = core.PARSER;
	//when parsing the function first looks into the built-in Math object
	//and then into the Math2 object
	//add a custom function
	core.Math2.custom = function (a, b) {
		return (2 * a + b) / a;
	};
	//let nerdamer know that it's ok to access this function
	//we do that using an array. The first parameter is the special handler
	//which we'll leave blank for now. This will only give it numeric capabilities
	_.functions.custom = [, 2];
	//we can now use the function
	var x = nerdamer('custom(2, 6)').evaluate();
	console.log(x.toString()); //5
	//It can't handle symbolics as illustrated next
	var y = nerdamer('custom(a, b)').evaluate();
	console.log(y.toString()); //custom(a, b)                 
}


function convert_to_range(x, min1, max1, min2, max2) {
	//returns x E [min1,max1] abgebildet auf [min2,max2]
	return (x - min1) * ((max2 - min2) / (max1 - min1)) + min2;
}
function clamp(x, min, max) { return Math.min(Math.max(x, min), max); }
function cycle(x, min, max) { let d = max - min; return (x - min) % d + min; }
function decompose_2d_matrix(mat) {
	var a = mat[0];
	var b = mat[1];
	var c = mat[2];
	var d = mat[3];
	var e = mat[4];
	var f = mat[5];

	var delta = a * d - b * c;

	let result = {
		translation: [e, f],
		rotation: 0,
		scale: [0, 0],
		skew: [0, 0],
	};

	// Apply the QR-like decomposition.
	if (a != 0 || b != 0) {
		var r = Math.sqrt(a * a + b * b);
		result.rotation = b > 0 ? Math.acos(a / r) : -Math.acos(a / r);
		result.scale = [r, delta / r];
		result.skew = [Math.atan((a * c + b * d) / (r * r)), 0];
	} else if (c != 0 || d != 0) {
		var s = Math.sqrt(c * c + d * d);
		result.rotation =
			Math.PI / 2 - (d > 0 ? Math.acos(-c / s) : -Math.acos(c / s));
		result.scale = [delta / s, s];
		result.skew = [0, Math.atan((a * c + b * d) / (s * s))];
	} else {
		// a = b = c = d = 0
	}

	return result;
}
function draw_gaussian(canvas, mean, stdev, color, thick, legendcolor, legend) {
	canvas.draw_axes();
	canvas.scale = 40;
	let f = gaussian_amp(canvas, 1)
	canvas.plot(f, color, thick);
	draw_ticks_gaussian(canvas, f, mean, stdev, legendcolor);
	//canvas.pp(0, 0, 100);
	draw_text(canvas, legend, { fg: legendcolor, pos: 'tr', hmargin: 25, vmargin: 12 });

}
function draw_label(canvas, item) {
	let cx = canvas.cx;
	cx.textAlign = 'center';
	cx.font = `${valf(item.fz, 16)}px Arial`;
	cx.fillStyle = item.color;
	cx.fillText(`  ${item.label}`, 0, 0);
}
function draw_point(canvas, item) {
	let cx = canvas.cx;
	cx.font = `${valf(item.fz, 16)}px Arial`;
	cx.fillStyle = item.color;
	if (isdef(item.label)) cx.fillText(`  ${item.label}`, 0, 0);
	cEllipse(0, 0, item.w, item.h, { bg: item.color }, 0, cx);
}
function draw_rect(canvas, item) {
	let cx = canvas.cx;
	cRect(0 - item.w / 2, 0 - item.h / 2, item.w, item.h, { bg: item.color }, cx);
}

function draw_text(canvas, text, styles = {}) {
	let cx = canvas.cx;
	addKeys({ x: 0, y: 0, family: 'opensans', fz: 36 }, styles);
	styles.bg = styles.fg;
	styles.font = `${styles.fz}px ${styles.family}`;
	cStyle(styles, cx);

	//pos aendert wo am canvas
	let [x, y, offx, offy] = [styles.x, styles.y, valf(styles.hmargin, styles.margin, 4), valf(styles.vmargin, styles.margin, 4)];
	if (isdef(styles.pos)) {
		let pos = styles.pos; // = 'tc'; //position on canvas top right with x,y taken as offset!
		if (pos[0] == 't') {
			y += canvas.miny + offy;
			cx.textBaseline = 'hanging';
		} else if (pos[0] == 'c') {
			y += offy;
			cx.textBaseline = 'middle';
		} else {
			y += canvas.maxy - offy;
			cx.textBaseline = 'top';
		}
		if (pos[1] == 'l') {
			x += canvas.minx + offx;
			cx.textAlign = 'start';
		} else if (pos[1] == 'c') {
			x += offx;
			cx.textAlign = 'center';
		} else {
			x += canvas.maxx - offx;
			cx.textAlign = 'end';
		}
	} else {
		cx.textAlign = 'center'; // start | end | left | right | [center]
		cx.textBaseline = 'middle'; // top | hanging | alphabetic | ideographic | bottom | [middle]
	}

	//al aendert wie dargestellt!
	if (isdef(styles.al)) {
		//alternative alignments have been specified!
		//align should be of format: 'hor vert', first letter is enaough since all start with different letter!
		let a = ' ' + styles.al;
		console.log('a', a);
		cx.textAlign = a.includes(' s') ? 'start' : a.includes(' e') ? 'end' : a.includes(' r') ? 'right' : a.includes(' l') ? 'left' : 'center';
		cx.textBaseline = a.includes(' b') ? 'bottom' : a.includes(' t') ? 'top' : a.includes(' h') ? 'hanging' : a.includes(' a') ? 'alpjabetic' : a.includes(' i') ? 'ideographic' : 'middle';


	}

	if (isdef(styles.offy)) {
		if (isNumber(styles.offy)) y += styles.offy;
		else {
			let ws = toWords(styles.offy);
			let di = { below: 'hanging', above: 'bottom', ontop: 'bottom', onbottom: 'hanging', unterhalb: 'hanging', oberhalb: 'bottom', unten: 'hanging', oben: 'bottom' };
			for (const w of ws) {
				if (isNumber(w)) y += Number(w);
				else if (isdef(di[w])) cx.textBaseline = di[w];
				else if (w.length == 1) {
					cx.textBaseline = w == 'b' ? 'bottom' : w == 't' ? 'top' : w == 'a' ? 'alphabetic' : w == 'i' ? 'ideographic' : w == 'm' ? 'middle' : 'hanging';
				} else cx.textBaseline = w;
			}
		}
	}
	if (isdef(styles.offx)) {
		if (isNumber(styles.offx)) y += styles.offx;
		else {
			let ws = toWords(styles.offx);
			for (const w of ws) {
				if (isNumber(w)) x += Number(w);
				else if (w.length == 1) {
					cx.textAlign = w == 's' ? 'start' : w == 'e' ? 'end' : w == 'l' ? 'left' : w == 'r' ? 'right' : 'center';
				} else cx.textAlign = w;
			}
		}
	}
	console.log('x', x, 'y', y, 'elign', cx.textAlign, 'baseline', cx.textBaseline)
	cx.fillText(text, x, y);
}
function draw_ticks_gaussian(canvas, f, mean, dev, color) {
	let sc = canvas.scale;
	let x_end = search_end_point(f, 0, canvas.maxx, .005, .02);
	// let y_end = f(x_end);
	// canvas.pp(x_end * sc, -y_end * sc, 3, `${Math.round(x_end * sc)}`, 'red', 'tc');
	// console.log('endpoint x', x_end, 'y', y_end, 'stdev', x_end / 3);

	let dx = x_end / 3, x = 0;
	for (let i = 0; i <= 3; i++) {
		canvas.pp(x * sc, 0, `${mean + i * dev}`, { bg: color });
		if (x) canvas.pp(-x * sc, 0, `${mean - i * dev}`, { bg: color });
		x += dx;
	}
}
function draw_ticks(canvas, f) {
	let sc = canvas.scale;
	//console.log('======>', f(0),canvas);

	let x_end = search_end_point(f, 0, canvas.maxx, 0.02);
	let y_end = f(x_end);
	canvas.pp(x_end * sc, -y_end * sc, `${Math.round(x_end * sc)}`, 'red', 'tc');
	console.log('endpoint x', x_end, 'y', y_end, canvas.minx, canvas.maxx);
	// console.log('point y', y_end, 0, canvas.maxy);

	//console.log('gegen 0', f(159 / sc));
	console.log('stdev', x_end / 3);
	//also ich will 1 tick bei 1 stdev der sagt
	//bei x_end sollte sein 150
	//normal distrib ticks soll sein: 100,1150
	let label = 100, dx = x_end / 3, x = 0;
	for (let i = 0; i <= 3; i++) {
		let x1 = Math.round(convert_to_range(x, -x_end, x_end, 50, 150));
		let x2 = Math.round(convert_to_range(-x, -x_end, x_end, 50, 150));
		canvas.pp(x * sc, 0, `${label + i * 15}`);
		if (x) canvas.pp(-x * sc, 0, `${label - i * 15}`);
		x += dx;
	}
}
function funGraph(ctx, axes, func, color, thick) {
	var xx, yy, dx = 4, x0 = axes.x0, y0 = axes.y0, scale = axes.scale;
	var iMax = Math.round((ctx.canvas.width - x0) / dx);
	var iMin = axes.doNegativeX ? Math.round(-x0 / dx) : 0;
	ctx.beginPath();
	ctx.lineWidth = thick;
	ctx.strokeStyle = color;

	for (var i = iMin; i <= iMax; i++) {
		xx = dx * i; yy = scale * func(xx / scale);
		if (i == iMin) ctx.moveTo(x0 + xx, y0 - yy);
		else ctx.lineTo(x0 + xx, y0 - yy);
	}
	ctx.stroke();
}
function get_with_prob(probs) {
	//probs: list of {val:p:}
	//eg [{val:{x:-1,y:0},p:50},{val:{x:1,y:0},p:20},{val:{x:0,y:-1},p:20},{val:{x:0,y:1},p:10}];
	//if props.p do NOT add up to 100, they will just be part of sum (im verhaeltnis!)
	let sum = arrSum(probs, 'p');
	let r = Math.random() * sum;
	console.log('sum', sum);
	let np = []; let sofar = 0;
	for (const el of probs) {
		sofar += el.p;
		np.push({ val: el.val, p: el.p, akk: sofar });
		if (r <= sofar) return el.val;
	}
	return arrLast(probs.val);

}
function get_quadrant(a) { return a > 270 ? 4 : a > 180 ? 3 : a > 90 ? 2 : 1; }
function is_turn_counter_clockwise(a1, a2) {
	//calculate turn direction from a1 to a2
	let diff = Math.abs(a2 - a1);
	let q1 = get_quadrant(a1);
	let q2 = get_quadrant(a2);

	let cclock = false;

	if (q1 == q2) { cclock = a2 < a1; }
	else {
		//console.log('diff',diff,a2>a1,diff<180);
		if (a2 > a1 && diff > 180) cclock = true;
		if (a2 < a1 && diff < 180) cclock = true;
		//clockw=(a2>a1)?(diff>180)?true:false;//:((diff>180)?true:false);

	}
	return cclock;
	//console.log('should turn '+clockw?'counter-clockwise':'clockwise',q1,q2,a1,a2);
}

function lerpos(i1, i2, frac = .5) { return { x: lerp(i1.x, i2.x, frac), y: lerp(i1.y, i2.y, frac) }; }
function lerpoint(i1, i2, frac = .5) {
	//return point {x,y} lerped pos between i1 and i2

	let o = { draw: i1.draw, update: i1.update };
	addKeys(i1, o);
	let pos = lerpos(i1, i2, frac);
	o.x = pos.x; o.y = pos.y;

	o.color = colorMix(i1.color, i2.color, frac * 100);

	//wie kann ich ein label lerpen??? von einem point?
	//if label has 2 numbers
	if (isdef(i1.label)) o.label = `${(o.x / i1.ppp).toFixed(1)},${(o.y / i1.ppp).toFixed(1)}`;

	// let mp=lerp(0,10,1); console.log('mp 0 10 1',mp)
	// mp=lerp(0,10,0); console.log('mp 0 10 0',mp)
	//console.log('___________________', o.x, o.y, o.color);
	return o;
}
function move_down(canvas, item) { item.y += 1; canvas.clamp(item); return true; }
function move_random(canvas, item) { item.x += rFloat(-1, 1); item.y += rFloat(-1, 1); canvas.clamp(item); return true; }
function move_probs(canvas, item) {
	let pinc = get_with_prob(item.probs);
	item.x += pinc.x; item.y += pinc.y;
	canvas.clamp(item);
	return true;

}
function oscillator(item) {
	let [astep, a, bstep, b, basefunc] = [item.astep, item.a, item.bstep, item.b, item.basefunc];
	[a, astep] = oscillate_between(a, 0, 5, astep);
	[b, bstep] = oscillate_between(b, 0, 5, bstep);
	[item.astep, item.a, item.bstep, item.b] = [astep, a, bstep, b];
	item.func = x => b * basefunc(a * x);
	return true;
}
var SICHERER = 100;
function search_end_point(f, min, max, lower, upper) {
	if (SICHERER-- < 0) { console.log('!!!!!!!!!!'); return 0; }
	let x = min + (max - min) / 2;
	let y = f(x);
	if (y > upper) { return search_end_point(f, x, max, lower, upper); }
	else if (y < lower) { return search_end_point(f, min, x, lower, upper); }
	else return x;
	//console.log('y',y)

	// if (y>.02){return search_end_point(f,x,max);}
	// else if (y<.005){return search_end_point(f,min,x);}
	// else return x;
}
function showAxes(ctx, axes) {
	var x0 = axes.x0, w = ctx.canvas.width;
	var y0 = axes.y0, h = ctx.canvas.height;
	var xmin = axes.doNegativeX ? 0 : x0;
	ctx.beginPath();
	ctx.strokeStyle = "rgb(128,128,128)";
	ctx.moveTo(xmin, y0); ctx.lineTo(w, y0);  // X axis
	ctx.moveTo(x0, 0); ctx.lineTo(x0, h);  // Y axis
	ctx.stroke();
}
function update_func(canvas, item) {
	let [cv, ctx, ia, ib, ifunc, axes] = [canvas.cv, canvas.cx, item.ia, item.ib, item.ifunc, item.axes];
	cClear(cv, ctx);
	showAxes(ctx, axes);
	let [la, lb, lf] = [[1, 2, 3, 4, 5, 5, 5, 4, 3, 2], [0, .5, 1, 1.5, 2, 2.5, 2.5, 2.5, 2, 1.5, 1, .5], ['sin', 'cos']];
	let [a, b, f] = [la[ia], lb[ib], lf[ifunc]];
	[item.ia, item.ib, item.ifunc] = [(ia + 1) % la.length, (ib + 1) % lb.length, (ifunc + 1) % lf.length];
	funGraph(ctx, axes, x => Math[f](a * x), "rgb(11,153,11)", 1);
	return false;
}
function update_move(canvas, item) {
	//item.x += 1;
	item.y += 1; //Math.random() * (coin() ? 1 : -1);
	item.y = cycle(item.y, canvas.miny, canvas.maxy);
	return true;
}
function update_position(item) {

	let [a1, a2] = [item.a, item.v.a];
	let diff = Math.abs(a2 - a1);
	let inc = valf(item.turn_inc, 0);
	if (inc && diff > inc) {

		let cclock = is_turn_counter_clockwise(a1, a2);
		if (cclock) inc = -inc;
		//console.log('inc',inc);
		let anew = a1 + inc;
		anew = (anew + 360) % 360;

		item.a = anew;

		//console.log('turned to',item.a,item.x,item.y);

	} else {
		item.a = a2 % 360;
		//item.a=item.v.a;
		let angle = toRadian(item.a);
		item.x += Math.cos(angle) * item.v.mag;
		item.y += Math.sin(angle) * item.v.mag;

		//console.log('move to',item.a,item.x,item.y);
	}


}

//#region point
function plot_line(canvas, item) {
	let cx = canvas.cx;
	cx.font = `${valf(item.fz, 16)}px Arial`;
	cx.fillStyle = item.color;
	if (isdef(item.label)) cx.fillText(`  ${item.label}`, 0, 0);
	cLine(item.x1, item.y1, item.x2, item.y2, { bg: item.color }, 0, cx);
}


//#region car
function draw_car(canvas, item) {
	let cx = canvas.cx;
	//if (canvas.math) cx.scale(1,-1);
	cRect(0 - item.w / 2, 0 - item.h / 2, item.w, item.h, { bg: item.color }, cx);
	cRect(item.w - item.w / 2, 0 - item.h / 2, 10, item.h, { bg: 'yellow' }, cx);
}
function update_car(canvas, item) {
	let di = { ArrowUp: canvas.math ? 90 : 270, ArrowDown: canvas.math ? 270 : 90, ArrowLeft: 180, ArrowRight: 0 };
	// let di = { ArrowUp: 270, ArrowDown: 90, ArrowLeft: 180, ArrowRight: 0 };
	for (const key in di) {
		if (is_key_down(key)) {
			item.v.a = di[key];
			update_position(item);
			return true;
		}
	}
	return false;
}









