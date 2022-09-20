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
function draw_label(item, canvas) {
	let cx = canvas.cx;
	cx.textAlign = 'center';
	cx.font = `${valf(item.fz, 16)}px Arial`;
	cx.fillStyle = item.color;
	cx.fillText(`  ${item.label}`, 0, 0);
}
function draw_point(item, canvas) {
	let cx = canvas.cx;
	cx.font = `${valf(item.fz, 16)}px Arial`;
	cx.fillStyle = item.color;
	if (isdef(item.label)) cx.fillText(`  ${item.label}`, 0, 0);
	cEllipse(0, 0, item.w, item.h, { bg: item.color }, 0, cx);
}
function draw_rect(item, canvas) {
	let cx = canvas.cx;
	cRect(0 - item.w / 2, 0 - item.h / 2, item.w, item.h, { bg: item.color }, cx);
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
	let r = Math.random() * arrSum(probs, 'p');
	//console.log('r', r);
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
function lerp(a, b, t) { return a + (b - a) * t; }
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
function move_down(item, canvas) { item.y += 1; canvas.clamp(item); return true; }
function move_random(item, canvas) { item.x += rFloat(-1, 1); item.y += rFloat(-1, 1); canvas.clamp(item); return true; }
function move_probs(item, canvas) {
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
function update_move(item, canvas) {
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
function plot_line(item, canvas) {
	let cx = canvas.cx;
	cx.font = `${valf(item.fz, 16)}px Arial`;
	cx.fillStyle = item.color;
	if (isdef(item.label)) cx.fillText(`  ${item.label}`, 0, 0);
	cLine(item.x1, item.y1, item.x2, item.y2, { bg: item.color }, 0, cx);
}


//#region car
function draw_car(item, canvas) {
	let cx = canvas.cx;
	//if (canvas.math) cx.scale(1,-1);
	cRect(0 - item.w / 2, 0 - item.h / 2, item.w, item.h, { bg: item.color }, cx);
	cRect(item.w - item.w / 2, 0 - item.h / 2, 10, item.h, { bg: 'yellow' }, cx);
}
function update_car(item, canvas) {
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









