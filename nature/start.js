onload = start;

async function start() {
	//#region optional code
	// await load_syms();
	// dHeader = mSection({ padding: 10, position:'relative' }, 'dHeader', 'Hello!', 'h1');
	// mPuppet('pineapple', dHeader, {position:'absolute', top:6},100);
	//#endregion
	FR = 25;
	G = null;

	let menulist=['tree', 'lsys']; //, 'flower', 'spaceco', 'fractal'];
	dToolbar = mToolbar(menulist, onclick_menu_item, 'dToolbar', { padding: 10, display: 'flex', gap: 10, bg: 'orange' });
	mButton('clear', G_clear, dToolbar, { position: 'absolute', right: 10 });

	dTable = mSection({ bg: '#ddd', vpadding: 10, hmin: 400 }, 'dTable'); mCenterFlex(dTable);

	onclick_menu_item('lsys');
}

function G_clear() { gameloop_stop(); clear_timeouts(); mClear('dTable'); C = G = cv = cx = null; }
function G_init(name) {

	if (cv) G_clear();

	[dLeft, dCenter] = mColFlex(dTable, [0, 5]);
	[cv, cx] = mCanvas(dCenter, 500, 400, { bg: '#222', rounding: 10 });
	let bpp = mPlayPause(dCenter, { fz: 28, fg: 'lightgreen', display: 'flex', ajcenter: true }, onclick_playpause);

	G = { running: false, bPP: bpp };
	C = { changed: true, name: name, items: {}, root: get_func(name, 'init')() };
}
function C_update() { C.root.animated = true; get_func(C.name, 'add')(); }
function C_draw() {
	if (!C.changed) return;
	cClear(cv, cx);
	//console.log('draw')
	for (const type in C.items) { let f = get_func(type, 'draw'); for (const item of C.items[type]) { f(item); } }
	C.changed = false;
}
function gameloop_start() { C_update(); TO.iv = setInterval(C_draw, 1000 / FR); G.running = true; G.bPP.show_pause(); }
function gameloop_stop() { clear_timeouts(); if (G) { G.running = false; G.bPP.show_play(); } }
function gameloop_toggle() { if (G.running === true) gameloop_stop(); else gameloop_start(); }

function get_func(itemtype, cmd) { return window[`${itemtype}_${cmd}`]; }




















