onload = start;

async function start() {
	//#region code
	// await load_syms();
	// dHeader = mSection({ padding: 10, position:'relative' }, 'dHeader', 'Hello!', 'h1');
	// mPuppet('pineapple', dHeader, {position:'absolute', top:6},100);
	//#endregion
	FR = 1;
	G = null;

	dToolbar = mToolbar(['tree', 'sp co', 'L-sys', 'fractal', 'flower'], onclick_menu_item, 'dToolbar');
	mButton('clear', G_clear, dToolbar, { position: 'absolute', right: 10 });

	dTable = mBy('dTable'); mCenterFlex(dTable);

	onclick_menu_item('tree');
}

//#region system
function handle_command(cmd,c) {
	console.log('handle command', cmd, 'of component', c);
	G[cmd]();
}
function G_clear() { gameloop_stop(); clear_timeouts(); mClear('dTable'); G = null; }
function G_init(name) {
	// creates top level component
	name = replaceWhite(name) + '_funcs';
	//die components koennten lauter so G singer sein!
	G = { fen: {}, primitives: {}, name: stringBefore(name, '_'), created: false, running: false, changed: true };
	addKeys(isdef(window[name]) ? window[name]() : default_system(), G);

	G.init(G.fen);
	mLinebreak(dTable, 10);

	[cv, cx] = mCanvas(dTable, 500, 400, { bg: '#222' }); //make a canvas?
	mLinebreak(dTable);

	mPlayPause(dTable, { fz: 28, fg: 'lightgreen', display: 'flex', ajcenter: true }, onclick_playpause);

}
function gameloop_start() { TO.iv = setInterval(C_draw, 1000 / FR); flag_set('running'); }
function gameloop_stop() { clearInterval(TO.iv); if (G) { G.running = false; flag_reset('running'); } }
function gameloop_toggle() { if (G.running === true) gameloop_stop(); else gameloop_start(); }
function flag_set(prop) { G[prop] = true; }
function flag_reset(prop) { G[prop] = false; }
function flag_toggle(name) { if (G[name]) flag_reset(name); else flag_set(name); }

//#endregion



















