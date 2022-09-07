






function ellipse4w(ctx, fill, stroke, x, y, w, h, angle) {

	x -= w / 2;
	y -= h / 2;
	ctx.save(); // save state

	const kappa = 0.5522847498,

		ox = w / 2 * kappa, // control point offset horizontal
		oy = h / 2 * kappa, // control point offset vertical

		xe = x + w, // x-end
		ye = y + h, // y-end

		xm = x + w / 2, // x-middle
		ym = y + h / 2; // y-middle
	ctx.beginPath();
	ctx.moveTo(x, ym);
	ctx.bezierCurveTo(x, ym - oy, xm - ox, y, xm, y);
	ctx.bezierCurveTo(xm + ox, y, xe, ym - oy, xe, ym);
	ctx.bezierCurveTo(xe, ym + oy, xm + ox, ye, xm, ye);
	ctx.bezierCurveTo(xm - ox, ye, x, ym + oy, x, ym);

	ctx.restore(); // restore to original state

	ctx.fill();
	ctx.stroke();
}

function ellipse3(ctx, fill, stroke, x, y, w, h, angle) {

	cx.save(); // save state
	//cx.rotate(1);

	const kappa = 0.5522847498,

		// ox = w * kappa, //w / 2 * kappa, // control point offset horizontal
		// oy = h * kappa, //h / 2 * kappa, // control point offset vertical
		ox = w / 2 * kappa, // control point offset horizontal
		oy = h / 2 * kappa, // control point offset vertical

		xs = x - w / 2,
		ys = y - w / 2,

		xe = x + w / 2, // x-end
		ye = y + h / 2, // y-end

		xm = x, // + w / 2, // x-middle
		ym = y; // + h / 2; // y-middle
	ctx.beginPath();
	ctx.moveTo(xs, ym);
	ctx.bezierCurveTo(xs, ym - oy, xm - ox, ys, xm, ys);
	ctx.bezierCurveTo(xm + ox, ys, xe, ym - oy, xe, ym);
	ctx.bezierCurveTo(xe, ym + oy, xm + ox, ye, xm, ye);
	ctx.bezierCurveTo(xm - ox, ye, xs, ym + oy, xs, ym);

	cx.restore(); // restore to original state

	ctx.fill();
	ctx.stroke();
}

function ellipse2(ctx, fill, stroke, x, y, w, h, angle) {

	cx.save(); // save state
	//cx.rotate(1);

	const kappa = 0.5522847498,

		ox = w / 2 * kappa, // control point offset horizontal
		oy = h / 2 * kappa, // control point offset vertical

		xe = x + w, // x-end
		ye = y + h, // y-end

		xm = x + w / 2, // x-middle
		ym = y + h / 2; // y-middle
	ctx.beginPath();
	ctx.moveTo(x, ym);
	ctx.bezierCurveTo(x, ym - oy, xm - ox, y, xm, y);
	ctx.bezierCurveTo(xm + ox, y, xe, ym - oy, xe, ym);
	ctx.bezierCurveTo(xe, ym + oy, xm + ox, ye, xm, ye);
	ctx.bezierCurveTo(xm - ox, ye, x, ym + oy, x, ym);

	cx.restore(); // restore to original state

	ctx.fill();
	ctx.stroke();
}
















//#region zeug
function colorMix1(c1, c2) {
	return mix_hexes(colorHex(c1), colorHex(c2));
}
function colorMix2(c1, c2, percent = 50) {
	c1 = colorHex(c1); c2 = colorHex(c2); return pSBC(percent / 100, c1, c2);
}
console.log(colorMix2('red', 'yellow')); //'#3890b9', '#f6ff00')); // #8cc46f

function hex2dec(hex) {
	return hex.replace('#', '').match(/.{2}/g).map(n => parseInt(n, 16));
}

function rgb2hex(r, g, b) {
	r = Math.round(r);
	g = Math.round(g);
	b = Math.round(b);
	r = Math.min(r, 255);
	g = Math.min(g, 255);
	b = Math.min(b, 255);
	return '#' + [r, g, b].map(c => c.toString(16).padStart(2, '0')).join('');
}

function rgb2cmyk(r, g, b) {
	let c = 1 - (r / 255);
	let m = 1 - (g / 255);
	let y = 1 - (b / 255);
	let k = Math.min(c, m, y);
	c = (c - k) / (1 - k);
	m = (m - k) / (1 - k);
	y = (y - k) / (1 - k);
	return [c, m, y, k];
}

function cmyk2rgb(c, m, y, k) {
	let r = c * (1 - k) + k;
	let g = m * (1 - k) + k;
	let b = y * (1 - k) + k;
	r = (1 - r) * 255 + .5;
	g = (1 - g) * 255 + .5;
	b = (1 - b) * 255 + .5;
	return [r, g, b];
}


function mix_cmyks(...cmyks) {
	let c = cmyks.map(cmyk => cmyk[0]).reduce((a, b) => a + b, 0) / cmyks.length;
	let m = cmyks.map(cmyk => cmyk[1]).reduce((a, b) => a + b, 0) / cmyks.length;
	let y = cmyks.map(cmyk => cmyk[2]).reduce((a, b) => a + b, 0) / cmyks.length;
	let k = cmyks.map(cmyk => cmyk[3]).reduce((a, b) => a + b, 0) / cmyks.length;
	return [c, m, y, k];
}

function mix_hexes(...hexes) {
	let rgbs = hexes.map(hex => hex2dec(hex));
	let cmyks = rgbs.map(rgb => rgb2cmyk(...rgb));
	let mixture_cmyk = mix_cmyks(...cmyks);
	let mixture_rgb = cmyk2rgb(...mixture_cmyk);
	let mixture_hex = rgb2hex(...mixture_rgb);
	return mixture_hex;
}
//#endregion








