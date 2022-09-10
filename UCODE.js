

function create_component(name, cparent, x, y, options) {
	name = replaceWhite(name);
	let funcname = `${name}_init`;
	let c = window[funcname](x, y, options);
	c.name = name;

	if (isdef(cparent)) {
		c.parent = cparent;
		cparent.children.push(c);
	}

	return c;
}


function mTogglew(label, dParent, styles = {}, handler, group_id, is_on) {
	let cursor = styles.cursor; delete styles.cursor;
	let name = replaceWhite(label);
	let d = mDiv(dParent, styles, group_id + '_' + name,null, 'togglebg');
	let id = isdef(group_id) ? `i_${group_id}_${val}` : getUID();
	let type = isdef(group_id) ? 'radio' : 'checkbox';
	let checked = isdef(is_on) ? is_on : false;
	let inp = mCreateFrom(`<input class='invisible' id='${id}' type="${type}" name="${name}">`); 
	if (checked) inp.checked = true;
	let text = mCreateFrom(`<label class='mp0' for='${inp.id}'>${label}</label>`);
	if (isdef(cursor)) { inp.style.cursor = text.style.cursor = cursor; }
	mAppend(d, inp);
	mAppend(d, text);
	if (isdef(handler)) {
		inp.onclick = ev => {
			ev.cancelBubble = true;
			//console.log('inp',inp);
			if (handler == 'toggle') {
				//console.log('hallo!!!!!!',inp.checked)
				//inp.checked = ev.target.checked == true ? false : true;
			} else if (isdef(handler)) {
				handler(name,inp.checked);
			}
		};
	}

	return d;
}


function MUELL() {
	let name = replaceWhite(s);
	let id = name;
	console.log('id', id, 'name', name);
	console.log('initial value is', Flags[name] === true)
	let html = `
				<input class="invisible" checked=${Flags[name] === true} id="${id}" name="${name}" type="checkbox"/>
				<label onclick="setoncheck('${name}',this)" for="${name}">${s}</label>
		`;
	let d = mDiv(dParent, styles, null, html, 'togglebg');
	//d.onclick=setoncheck();
	// let html = `
	// 	<div class="togglebg">
	// 		<input onchecked="setoncheck(${name},this.checked)" class="invisible" id="${name}" name="${name}" type="checkbox"/>
	// 		<label for="option1">${s}</label>
	// 	</div>
	// `;
}
function MUELL() {
	if (inp.value) console.log('YES!')

	return;
	let val = inp.checked;
	console.log('click', val)
	Flags[prop] = val;
	console.log('Flags', Flags);
}



//#region canvas ellipse trials
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
//#endregion

//#region color mixing trials
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


function drawLeaf(ctx, x, y) {
	ctx.beginPath();
	//ctx.rotate(-angle) geht ueberhaupt nicht!!!
	// ctx.arc(200, 150, 50, 0, 0.5 * Math.PI);
	// ctx.arc(250, 200, 50, Math.PI, 1.5 * Math.PI);
	let sz = Math.random() * 10 + 10; //50
	ctx.arc(x, y, sz, 0, 0.5 * Math.PI);
	ctx.arc(x + sz, y + sz, sz, Math.PI, 1.5 * Math.PI);
	//ctx.fillStyle = ("#0f3")
	ctx.fill();
	ctx.stroke()
	ctx.closePath();

}

function cEllipse(cx, x, y, w, h, angle) {
	cx.save(); // save state
	cx.beginPath();

	//cx.translate(x - rx, y - ry);
	//cx.translate(x,y);
	//cx.scale(1, h/w);  //
	//cx.rotate(angle);
	cx.arc(x, y, w, 0, 2 * Math.PI, false);

	cx.restore(); // restore to original state
	cx.stroke();
	cx.fill();
}
function cEllipse(cx, x, y, rx, ry, angle) {
	cx.save(); // save state
	cx.beginPath();

	//cx.translate(x - rx, y - ry);
	cx.translate(x,y);
	cx.scale(rx, ry);
	cx.rotate(angle);
	cx.arc(1, 1, 1, 0, 2 * Math.PI, false);

	cx.restore(); // restore to original state
	cx.stroke();
	cx.fill();
}
function add_fork(b) {
	let pt = b.p[1];
	//let a1 = b.angle + toRadian(25);
	let len = b.len * .67;
	let thickness = b.thickness * .75;
	//let color = colorLight(b.color, .1*
	b.done = true;

	branch_add(pt,b.angle + toRadian(25),len,thickness,color,b.age+1);
	branch_add(pt,b.angle - toRadian(25),len,thickness,b.age+1);
}
