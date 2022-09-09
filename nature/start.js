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
	mButton('clear', system_clear, dToolbar, { position: 'absolute', right: 10 });

	dTable = mBy('dTable'); mCenterFlex(dTable);

	onclick_menu_item('tree');
}

//#region system
function create_canvas(){
	[cv, cx] = mCanvas(dTable, 500, 400, { bg: '#222' }); //make a canvas?
	mLinebreak(dTable);

}
function create_menu(){
	dMenu = mDiv(dTable, { w: '100%', display: 'flex' });

}
function handle_command(cmd) {
	console.log('handle command', cmd);
}
function system_clear() { gameloop_stop(); clear_timeouts(); mClear('dTable'); G=cv=cx=null;}
function system_init(name,cparent) {

	if (!cv){
		create_menu();
		create_canvas();
	}
	//ang name is tree
	let c = G = create_component(name,cparent);
	
}
function system_draw(){
	
}
function gameloop_start() { TO.iv = setInterval(system_draw, 1000 / FR); flag_set('running'); }
function gameloop_stop() { clearInterval(TO.iv); if (G) { G.running = false; flag_reset('running'); } }
function gameloop_toggle() { if (G.running === true) gameloop_stop(); else gameloop_start(); }
function flag_set(prop) { G[prop] = true; }
function flag_reset(prop) { G[prop] = false; }
function flag_toggle(name) { if (G[name]) flag_reset(name); else flag_set(name); }

//#endregion



















