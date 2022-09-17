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






