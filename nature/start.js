onload = start;

async function start() {
	//#region code
	// await load_syms();
	// dHeader = mSection({ padding: 10, position:'relative' }, 'dHeader', 'Hello!', 'h1');
	// mPuppet('pineapple', dHeader, {position:'absolute', top:6},100);
	//#endregion
	FR = 25;
	G = null;

	dToolbar = mToolbar(['tree', 'sp co', 'L-sys', 'fractal', 'flower'], onclick_menu_item, 'dToolbar', { padding: 10, display: 'flex', gap: 10, bg: 'orange' });
	mButton('clear', G_clear, dToolbar, { position: 'absolute', right: 10 });

	dTable = mSection({ bg: '#ddd', vpadding: 10, hmin: 400 }, 'dTable'); mCenterFlex(dTable);

	onclick_menu_item('tree');
}

//#region system
function create_menu(dParent, dir = 'h') {
	let d;
	if (dir == 'h') {
		d = dMenu = mDiv(dParent, { w: '100%', display: 'flex' }); //,bg:'orange' });
	} else {
		d = dMenu = mDiv(dParent, { padding: 10, gap: 10, h: '100%', display: 'flex', dir: dir }); //,bg:'orange' });
	}
	mToolbar(['grow', 'clear'], handle_command, d, {}, { vmargin: 5 });
	mTogglebar({ jitter: false }, flag_toggle, { bg: 'lightgreen' }, { bg: '#eee' }, d);//, { margin:10,padding:10,h:100,bg: 'blue' });
	mLinebreak(dTable, 10);

}
function handle_command(cmd) {
	console.log('handle command', cmd, 'for type', C.name);
	let itemtype = C.name;
	let func = get_func(itemtype, cmd);
	func();
}
function G_clear() { gameloop_stop(); clear_timeouts(); mClear('dTable'); C = G = cv = cx = null; }
function G_init(name) {

	if (!cv) {
		[dLeft, dCenter] = mColFlex(dTable, [0, 5]);
		[cv, cx] = mCanvas(dCenter, 500, 400, { bg: '#222', rounding: 10 }); //make a canvas?
		//create_menu(dLeft, 'v');
		//mLinebreak(dParent);
		mPlayPause(dCenter, { fz: 28, fg: 'lightgreen', display: 'flex', ajcenter: true }, toggle_growing); //, true);
	}
	//ang name is tree
	G = { running: false };
	C = { changed: true, done: false, jitter: false, name: name, items: {}, root: get_func(name, 'init')() };

}
function C_draw() {

	//#region test

	//#endregion

	if (!C.changed && !C.jitter) return;
	cClear(cv, cx);

	//console.log('draw');
	for (const type in C.items) {
		let f = get_func(type, 'draw');
		for (const item of C.items[type]) {
			f(item);
		}
	}
	C.changed = false;

}
//function C_add() { get_func(C.name, 'add'); }
function toggle_growing(){
	//console.log('haaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa')
	console.log('running',G.running)
	gameloop_toggle();
	console.log('running',G.running)

	if (G.running) tree_grow(); else {C.root.animated=false;}
}
function gameloop_start() { TO.iv = setInterval(C_draw, 1000 / FR); flag_set('running'); }
function gameloop_stop() { clearInterval(TO.iv); if (G) { flag_reset('running'); } }
function gameloop_toggle() { if (G.running === true) gameloop_stop(); else gameloop_start(); }
function flag_set(prop) { G[prop] = true; }
function flag_reset(prop) { G[prop] = false; }
function flag_toggle(name) { if (G[name]) flag_reset(name); else flag_set(name); }

function get_func(itemtype, cmd) { return window[`${itemtype}_${cmd}`]; }

//#endregion



















