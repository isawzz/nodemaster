
function create_component(name, cparent, x, y, options) {
	let c = window[`init_${replaceWhite(name)}`](x, y, options);

	if (isdef(cparent)) {
		c.parent = cparent;
		cparent.children.push(c);
	}

	return c;
}

function init_tree(options={},x,y) {
	let o = {
		done: false,
		x1: isdef(x) ? x : cv.width / 2,
		y1: isdef(y) ? y : cv.height,
		x: x,
		y: y,
		t: 'branch',
		age: 0,
		len: valf(options.len, 100),
		angle: toRadian(90),
		thickness: valf(options.thick, 20),
		color: valf(options.color, 'sienna'),
	};
	o.x2 = o.x1;
	o.y2 = o.y1 - o.len;
	return o;
}









