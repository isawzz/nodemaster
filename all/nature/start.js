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

function G_clear() { gameloop_stop(); clear_timeouts(); mClear('dTable'); C = G = CV = CX = null; }
function G_init(name) {

	if (CV) G_clear();

	[dLeft, dCenter] = mColFlex(dTable, [0, 5]);
	let res = mCanvas(dCenter, { w:500, h:500, bg: '#222', rounding: 10 });
	[CV, CX] = [res.cv,res.cx];

	let bpp = _mPlayPause(dCenter, { fz: 28, fg: 'lightgreen', display: 'flex', ajcenter: true }, onclick_playpause);

	G = { running: false, bPP: bpp };
	C = { changed: true, name: name, items: {}, root: get_func(name, 'init')() };
}
function C_update() { C.root.animated = true; get_func(C.name, 'add')(); }
function C_draw() {
	if (!C.changed) return;
	cClear(CV, CX);
	//console.log('draw')
	for (const type in C.items) { let f = get_func(type, 'draw'); for (const item of C.items[type]) { f(item); } }
	C.changed = false;
}
function gameloop_start() { C_update(); TO.iv = setInterval(C_draw, 1000 / FR); G.running = true; G.bPP.show_pause(); }
function gameloop_stop() { clear_timeouts(); if (G) { G.running = false; G.bPP.show_play(); } }
function gameloop_toggle() { if (G.running === true) gameloop_stop(); else gameloop_start(); }

function get_func(itemtype, cmd) { return window[`${itemtype}_${cmd}`]; }

//uses deprecated: mPlayPause
function _mPlayPause(dParent, styles = {}, handler = null) {
	if (!handler) handler = audio_onclick_pp;
	//let fname = isdef(handler) ? handler.name : 'audio_onclick_pp';
	//console.log('fname', fname);
	let html = `
		<section id="dButtons">
			<a id="bPlay" href="#" }">
				<i class="fa fa-play fa-2x"></i>
			</a>
			<a id="bPause" href="#" style="display: none">
				<i class="fa fa-pause fa-2x"></i>
			</a>
		</section>
	`;
	let pp = mCreateFrom(html);
	mAppend(dParent, pp);
	mStyle(pp, styles);

	mBy('bPlay').onclick = () => { hide0('bPlay'); show0('bPause'); handler(); }
	mBy('bPause').onclick = () => { hide0('bPause'); show0('bPlay'); handler(); }

	//deprecate:::
	return  { button: pp, show_play: () => { hide0('bPause'); show0('bPlay'); }, show_pause: () => { hide0('bPlay'); show0('bPause'); } };

}


















