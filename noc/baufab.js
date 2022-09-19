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


function clamp(x, min, max) { return Math.min(Math.max(x, min), max); }
function cycle(x, min, max) { let d = max - min; return (x - min) % d + min; }
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
	
	o.color = colorMix(i1.color, i2.color, frac*100); 

	//wie kann ich ein label lerpen??? von einem point?
	//if label has 2 numbers
	if (isdef(i1.label)) o.label = `${(o.x/i1.ppp).toFixed(1)},${(o.y/i1.ppp).toFixed(1)}`;

	// let mp=lerp(0,10,1); console.log('mp 0 10 1',mp)
	// mp=lerp(0,10,0); console.log('mp 0 10 0',mp)
	//console.log('___________________', o.x, o.y, o.color);
	return o;
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






