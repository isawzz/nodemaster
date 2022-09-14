
function game_update(types) {
	//wird nur 1 mal bei game_start() aufgerufen!
	let changed = false;
	if (nundef(types)) types = get_keys(G.agents);
	for (const type of types) { let f = get_func(type, 'update'); for (const agent of G.agents[type]) { changed ||= f(agent); } }
	G.need_draw = changed;

}



//#region nature start.js
onload = start;
//const AUTOMATISCH = false;

async function start() {
	//#region optional code
	// await load_syms();
	// dHeader = mSection({ padding: 10, position:'relative' }, 'dHeader', 'Hello!', 'h1');
	// mPuppet('pineapple', dHeader, {position:'absolute', top:6},100);
	//#endregion
	FR = 25;
	G = null;

	dToolbar = mToolbar(['tree', 'lsys', 'spaceco', 'fractal', 'flower'], onclick_menu_item, 'dToolbar', { padding: 10, display: 'flex', gap: 10, bg: 'orange' });
	mButton('clear', G_clear, dToolbar, { position: 'absolute', right: 10 });

	dTable = mSection({ bg: '#ddd', vpadding: 10, hmin: 400 }, 'dTable'); mCenterFlex(dTable);

	onclick_menu_item('lsys');
}

function G_clear() { gameloop_stop(); clear_timeouts(); mClear('dTable'); C = G = CV = CX = null; }
function G_init(name) {

	if (CV) G_clear();

	[dLeft, dCenter] = mColFlex(dTable, [0, 5]);
	[CV, CX] = mCanvas(dCenter, { w:500, h:500, bg: '#222', rounding: 10 });
	//create_menu(dLeft, 'v');
	//mLinebreak(dParent);
	let bpp = _mPlayPause(dCenter, { fz: 28, fg: 'lightgreen', display: 'flex', ajcenter: true }, onclick_playpause); //, AUTOMATISCH); //uncomment to autostart

	G = { running: false, bPP: bpp };
	C = { changed: true, name: name, items: {}, root: get_func(name, 'init')() };
	//if (AUTOMATISCH) onclick_playpause();
}
function C_update() { C.root.animated = true; get_func(C.name, 'add')(); }
function C_draw() {

	//#region test

	//#endregion

	if (!C.changed) return;
	cClear(CV, CX);
	console.log('draw')
	for (const type in C.items) {
		let f = get_func(type, 'draw');
		for (const item of C.items[type]) {
			f(item);
		}
	}
	C.changed = false;

}
function gameloop_start() { C_update(); TO.iv = setInterval(C_draw, 1000 / FR); G.running = true; G.bPP.show_pause(); }
function gameloop_stop() { clear_timeouts(); if (G) { G.running = false; G.bPP.show_play(); } }
function gameloop_toggle() { if (G.running === true) gameloop_stop(); else gameloop_start(); }

function get_func(itemtype, cmd) { return window[`${itemtype}_${cmd}`]; }





















//#endregion

function create_branchL(b, angle, len, color) {
	//let len = b.len * root.dlen;
	let root = C.root;
	//let len=root.len;

	let x = b.p2.x + Math.cos(angle) * len;
	let y = b.p2.y - Math.sin(angle) * len;
	//let age = gen;

	let o = {
		p1: b.p2,
		p2: { x: x, y: y },
		x: x,
		y: y,
		t: 'branch',
		age: b.age + 1,
		gen: b.gen,
		angle: angle,
		len: len,
		thickness: 1,
		color: color,
		done: true,
	};
	return o;

}

//#region lsystem
const AXIOM = 'A';
//const RULES = [{ aus: 'A', wird: 'AB' },{aus:'B', wird:'A'}];
//const RULES = [{ aus: 'A', wird: 'B[+A]-A' }];//,{aus:'B', wird:'A'}];
const RULES = [{ aus: 'A', wird: 'AA+[+A-A-A]-[-A+A+A]' }];

function countAll(s, scount) {
	//usage: countAll('A+[+A-A-A]-[-A+A+A]', toLetters('ABF'))

	//let di = {}; for (let i = 0; i < scount.length; i++) { di[i] }
	let letters = toLetters(scount);
	//console.log('letters', letters);
	function counter(total, ch) {
		if (letters.includes(ch)) return total + 1; else return total;
	}

	let res = [...s].reduce(counter, 0);
	//console.log('res', res);
	return res;
}

function lsys_init(offx = 0, offy = 0, options = {}) {
	//calculate branching factor: 
	let laus = RULES.map(x => x.aus).join();
	let lwird = RULES.map(x => x.wird).join();
	//console.log('laus', laus, 'lwird', lwird);
	let naus = countAll(laus, 'ABF');
	let nwird = countAll(lwird, 'ABF');
	let ratio = nwird / naus;
	//console.log('naus',naus,'nwird',nwird,'ratio',ratio);
	let maxnodes = 3000;
	let pow = 2;
	while (Math.pow(ratio, pow) < maxnodes) pow++;
	//console.log('max depth is:',pow,'bei ratio',ratio)
	let root = {
		axiom: AXIOM, //'F',
		sentence: AXIOM,
		rules: RULES, //[{ aus: 'F', wird: 'FF+[+F-F-F]-[-F+F+F]' },],
		done: false,
		t: 'root',
		age: 0,
		gen: 0,
		dangle: 25,
		thickness: valf(options.thick, 20), //thickness of stem
		color: valf(options.color, 'sienna'), //color of stem
		depth: Math.min(DEPTH, pow - 1), // 6
		branching: BRANCHING, // [25, 5, -25],
		dlen: .7,
		dthickness: .7,
		phase: 'spring',
		speed: { spring: 500, summer: 100, autumn: 25, winter: 100, over: 2000 },
		animated: false,
		jitter: false,
		p2: { x: CV.width / 2, y: CV.height },
		angle: toRadian(90),
		len: 100,
	};
	console.log('depth is', root.depth)
	return root;
}
//'FF+[+F-F-F]-[-F+F+F]'
function lsys_add() {
	let root = C.root = lsys_init(); C.items = {}; let stack = [root], bnew;
	let gens = 4; for (let i = 0; i < gens; i++) { root.len *= .5; root.sentence = generate(); }
	let b = root; copyKeys({ id: 0, angle: toRadian(90), len: root.len, age: 0, gen: gens }, root); let s = root.sentence;
	let [id, angle, len, x, y] = [b.id + 1, b.angle, b.len, b.p2.x, b.p2.y];
	let step = 0;
	for (var i = 0; i < s.length; i++) {
		var ch = s[i];
		if (ch == 'F' || ch == 'A' || ch == 'B') {
			b = create_branchL(b, angle, len, rColor()); lookupAddToList(C.items, ['branch'], b); b.id = id++;
			console.log(`(${step++}) branch`, toDegree(angle))
		} else if (ch == '+') {
			angle -= toRadian(25); console.log(`(${step++}) +`, toDegree(angle))
		} else if (ch == '-') {
			angle += toRadian(25); console.log(`(${step++}) -`, toDegree(angle))
		} else if (ch == '[') {
			stack.push({ x: b.p2.x, y: b.p2.y, angle: angle, b: b }); console.log(`(${step++}) push`, toDegree(angle))
		} else if (ch == ']') {
			let o = stack.pop();
			angle = o.angle; x = o.x; y = o.y; b = o.b; console.log(`(${step++}) pop`, toDegree(angle))
		}
	}
	C.changed = true;
}
function create_branchL(b, angle, len, color) { //p,len, angle,gen) {
	//let len = b.len * root.dlen;
	let root = C.root;
	//let len=root.len;

	let x = b.p2.x + Math.cos(angle) * len;
	let y = b.p2.y - Math.sin(angle) * len;
	//let age = gen;

	let o = {
		done: true,
		p1: b.p2,
		p2: { x: x, y: y },
		x: x,
		y: y,
		t: 'branch',
		age: b.age + 1, //age,
		gen: b.gen,
		len: len,
		angle: angle,
		thickness: 1, //5, //root.thickness,
		color: 'silver', //color, //('red',//root.color,
	};
	return o;

}
function generate() {
	let root = C.root;
	let rules = root.rules;
	//root.len *= 0.5; //??? macht keinen sinn!!!
	let [sentence, len] = [root.sentence, root.len];
	var nextSentence = '';
	for (var i = 0; i < sentence.length; i++) {
		var current = sentence.charAt(i);
		var found = false;
		for (var j = 0; j < rules.length; j++) {
			if (current == rules[j].aus) {
				found = true;
				nextSentence += rules[j].wird;
				break;
			}
		}
		if (!found) {
			nextSentence += current;
		}
	}
	return nextSentence;
}


//#endregion



function lsys_add() {
	let root = C.root; root.gen++; let len = 100; let gens = 2; C.items = {}; const damag = toRadian(25);
	for (let i = 0; i < gens; i++) { root.len = len *= .5; root.sentence = generate(); }
	let [sentence, angle, dlen, da, gen] = [root.sentence, root.angle, 1, toRadian(25), 0];
	let id = 0; angle = toRadian(90); let b = root, stack = []; b.id = id++; b.age = 0;

	for (var i = 0; i < sentence.length; i++) {
		var ch = sentence.charAt(i);
		if (ch == 'F' || ch == 'A' || ch == 'B') {
			// b = create_branchL(b, angle, len / (b.age + 1), rColor()); lookupAddToList(C.items, ['branch'], b);
			b = create_branchL(b, b.angle, len, rColor()); lookupAddToList(C.items, ['branch'], b); b.id = id++;
			console.log('angle', b.id, toDegree(b.angle))

		} else if (ch == '+') {
			b.angle -= toRadian(25); //damag; //da=damag; //angle = b.angle - da; //toRadian(25); //rotate(angle);
		} else if (ch == '-') {
			b.angle += toRadian(25); //damag; //da=-damag; //angle = b.angle + da; //toRadian(25); //da/2; //rotate(-angle);
		} else if (ch == '[') {
			stack.push(b);
			//console.log('stack',stack.map(x=>x.id))
		} else if (ch == ']') {
			b = stack.pop(); //angle = b.angle;
		}
	}
	C.changed = true;
}

function sentence2tree() {
	// background(51);
	// resetMatrix();
	let root = C.root;
	let [sentence, len] = [root.sentence, root.len];
	//let p=root.p={x:cv.width / 2,y:cv.height};
	//let a=root.angle = 90;
	let [dlen, da] = [root.dlen, toRadian(25)]; //root.dangle];
	let b = root, bnew = null;
	let gen = 0;
	//stroke(255, 100);
	let stack = [];
	let a = root.angle;
	for (var i = 0; i < sentence.length; i++) {
		var ch = sentence.charAt(i);

		if (ch == 'F' || ch == 'A' || ch == 'B') {
			b = create_branchL(b, a, b.len); lookupAddToList(C.items, ['branch'], b);

			//p=b.p2;
			//line(0, 0, 0, -len);
			//translate(0, -len);
		} else if (ch == '+') {
			a += b.angle + da; //rotate(angle);
		} else if (ch == '-') {
			a -= da; //rotate(-angle);
		} else if (ch == '[') {
			stack.push(b); gen++;
		} else if (ch == ']') {
			b = stack.pop(); gen--;
		}
	}
}

//#region tree.js
const DEPTH = 6;
const BRANCHING = [-25, 5, 25];

function mutate_colors(type, colors) {
	let items = C.items[type];
	let changed = false;
	let lastcolor = arrLast(colors);
	for (const item of items) {
		if (item.color == lastcolor) continue;
		changed = true;
		if (coin()) continue;
		let i = colors.indexOf(item.color) + 1;
		item.color = colors[i];
		if (type == 'branch') item.thickness -= 1.5;//p2.y+=10;
	}
	return changed;
}

function tree_init(offx = 0, offy = 0, options = {}) {
	let o = {
		done: false,
		t: 'root',
		age: 0,
		p2: { x: offx + CV.width / 2, y: offy + CV.height },
		// x2: offx + cv.width / 2,
		// y2: offy + cv.height,
		len: valf(options.len, 100),
		angle: toRadian(90),
		thickness: valf(options.thick, 20),
		color: valf(options.color, 'sienna'),
		depth: DEPTH,
		branching: BRANCHING, // [25, 5, -25],
		dlen: .7,
		dthickness: .7,
		phase: 'spring',
		speed: { spring: 500, summer: 100, autumn: 25, winter: 100, over: 2000 },
		animated: false,
		jitter: false,
	};
	return o;
}
function tree_add() {
	let root = C.root;
	if (root.phase == 'spring') {
		C.changed = false;
		assertion(root, 'ROOT IS NULL BEI TREE_ADD!!!!!!!!!!!!!')
		if (!root.done) {
			let b = create_branch(root, root.angle, root);
			lookupAddToList(C.items, [b.t], b);
			C.changed = true;
		} else {
			for (const b of C.items.branch.filter(x => !x.done)) {
				if (b.age < root.depth) { //-rNumber(0,1)) {
					let br = root.branching; //rChoose(root.branching,rNumber(2,4));
					for (const a of br) {
						let o = create_branch(b, b.angle + toRadian(a), root); lookupAddToList(C.items, [o.t], o);
					}
				} else {
					let o = create_leaf(b, root); lookupAddToList(C.items, [o.t], o);
				}
				C.changed = true;
				root.maxage = b.age + 1;
				b.done = true;
			}
		}
		if (!C.changed) { root.minage = 0; root.phase = 'summer'; }
	}
	else if (root.phase == 'summer') {
		let colors = ['darkgreen', 'olive', '#8B9216', '#A79F0F', '#EDA421', '#E98604', '#DF3908', '#C91E0A', '#8C584A'];
		let changed = mutate_colors('leaf', colors);
		if (!changed) root.phase = 'autumn';
		root.jitter = true;
		C.changed = true;
	}
	else if (root.phase == 'autumn') {
		root.jitter = false;
		C.changed = true;
		// let falling = C.items.leaf.filter(l => l.y < cv.height);
		let falling = C.items.leaf.filter(l => l.p.y < CV.height);
		if (isEmpty(falling)) {
			C.changed = false; root.phase = 'winter';
		} else {
			//console.log('falling',falling,C.changed)
			// for (const b of falling) { b.y += Math.random() * 3; }
			// for (const b of falling) { b.p.y += Math.random() * 3; } //NOOOOOOOO!!!!!! macht striche
			for (const b of falling) { b.p = { x: b.p.x + Math.random() * .51, y: b.p.y + Math.random() * 3 }; }
		}
	}
	else if (root.phase == 'winter') {
		let colors = ['#8E2100', '#5C1306', '#371C0F', '#1C1B19'];
		let changed = mutate_colors('branch', colors);
		if (!changed) root.phase = 'over';
		C.changed = true;
	}
	else if (root.phase == 'over') { C.changed = false; tree_clear(); }


	if (root.animated) TO.iv1 = setTimeout(tree_add, C.root.speed[C.root.phase]);
}
function tree_grow() {
	//animate tree growth

	C.root.animated = true;
	tree_add();

}
function tree_clear() {
	G_clear();
	onclick_menu_item('tree');
}

function create_branch(b, angle, root) {
	let len = b.len * root.dlen;
	// let x = b.x2 + Math.cos(angle) * len;
	// let y = b.y2 - Math.sin(angle) * len;
	let x = b.p2.x + Math.cos(angle) * len;
	let y = b.p2.y - Math.sin(angle) * len;
	let age = b.age + 1;

	let o = {
		done: false,
		p1: b.p2, //{ x: b.p2.x, y: b.p2.y },
		p2: { x: x, y: y },
		// x1: b.x2,
		// y1: b.y2,
		// x2: x,
		// y2: y,
		x: x,
		y: y,
		t: 'branch',
		age: age,
		len: len,
		angle: angle,
		thickness: b.thickness * root.dthickness,
		color: colorMix(b.color, 'lime', 3), //(b.color,'red',20), //colorLight(b.color, 8),
	};
	b.done = true;
	return o;

}
function branch_draw(o) {
	cStyle(CX, 'white', o.color, o.thickness, 'round');
	// cLine(cx, o.x1, o.y1, o.x2, o.y2);

	if (C.root.jitter) cLine(CX, o.p1.x, o.p1.y, o.p2.x + Math.random() * 2 - 1, o.p2.y + Math.random() * 2 - 1);
	else cLine(CX, o.p1.x, o.p1.y, o.p2.x, o.p2.y);
}

function create_leaf(b, root) {
	//console.log('b.angle', toDegree(b.angle))
	let o = {
		done: true,
		p: b.p2, //{ x: b.p2.x, y: b.p2.y },
		x: b.p2.x,
		y: b.p2.y,
		// x: b.x2,
		// y: b.y2,
		t: 'leaf',
		age: b.age + 1,
		len: b.len * root.dlen,
		angle: b.angle,
		thickness: 20,
		color: 'lawngreen',// colorDark(GREEN,50), //colorTrans('green',.9),
	};
	b.done = true;
	return o;
}
function leaf_draw(o) {
	cStyle(CX, o.color, o.color, 1, null); //o.thickness, 'round');
	// let [x, y] = [o.x, o.y];
	let [x, y] = [o.p.x, o.p.y];
	//console.log('angle', o.angle);

	let [w, h] = [o.len * 1.5, o.len];
	cEllipse(CX, x, y, w, h, o.angle);
	//draw_flower(x, y, 'hotpink', -o.angle, 5, 1);

}





//#endregion

function select_pool(type, percent, layer, func) {
	let root = C.root;
	let res = [];
	let pool = isdef(type) ? C.items[type] : arrFlatten(get_values(C.items));
	//console.log('pool',pool)
	//console.log('the pool has', pool.length, 'members');
	if (layer == 'outer') {
		let pnew = [];
		let max = root.maxage;
		while (max > 0 && isEmpty(pnew)) { pnew = pool.filter(x => x.age == max); max--; }
		if (isEmpty(pool)) return res;
		pool = pnew;
	} else if (layer == 'inner') {
		let pnew = [];
		let min = 0;
		while (min <= root.maxage && isEmpty(pnew)) { pnew = pool.filter(x => x.age == min); min++; }
		if (isEmpty(pool)) return res;
		pool = pnew;
	}
	for (const item of pool) {
		if (isdef(percent) && !coin(percent)) continue;
		if (isdef(func) && !func(item)) continue;
		res.push(item);
	}

	console.log('res', res.length)
	return res;
}

function mutate_color(list, colors) {
	for (const b of list) {
		let icolor = colors.indexOf(b.color) + 1;
		b.color = colors[icolor];
	}
}

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
	let d = mDiv(dParent, styles, group_id + '_' + name, null, 'togglebg');
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
				handler(name, inp.checked);
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

	CX.save(); // save state
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

	CX.restore(); // restore to original state

	ctx.fill();
	ctx.stroke();
}

function ellipse2(ctx, fill, stroke, x, y, w, h, angle) {

	CX.save(); // save state
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

	CX.restore(); // restore to original state

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
	cx.translate(x, y);
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

	branch_add(pt, b.angle + toRadian(25), len, thickness, color, b.age + 1);
	branch_add(pt, b.angle - toRadian(25), len, thickness, b.age + 1);
}
