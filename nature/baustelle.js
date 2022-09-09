
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
		x2: isdef(x) ? x : cv.width / 2,
		y2: isdef(y) ? y : cv.height,
		t: 'root',
		age: 0,
		len: valf(options.len, 100),
		angle: toRadian(90),
		thickness: valf(options.thick, 20),
		color: valf(options.color, 'sienna'),
	};
	return o;
}









