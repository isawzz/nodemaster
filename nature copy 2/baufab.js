

function add_branch(b, angle) {
	let len = b.len * .67;
	let x = b.x2 + Math.cos(angle) * len;
	let y = b.y2 - Math.sin(angle) * len;
	let age = b.age + 1;

	let o = {
		done: false,
		x1: b.x2,
		y1: b.y2,
		x2: x,
		y2: y,
		x: x,
		y: y,
		t: 'branch',
		age: age,
		len: len,
		angle: angle,
		thickness: b.thickness * .75,
		color: colorMix(b.color, 'lime', 10), //(b.color,'red',20), //colorLight(b.color, 8),
	};
	go_register(o, b);

}















