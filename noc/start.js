onload = start;

function start() {
	dTable = mSection({ padding: 10, hmin: 400 }, 'dTable'); //mFlex(dTable);	//test0_fireClick();

	initui();
}
function clearui() {
	gameloop_stop(); clear_timeouts(); mClear('dTable'); G = cv = cx = null;
}
function initui() {

	if (cv) clearui();

	let c = ui_type_canvas(dTable, gameloop_start, gameloop_stop);

	G = { running: false, play: c.play, pause: c.pause, items: {} };

	//C = { changed: true, name: name, items: {}, root: get_func(name, 'init')() };

}

function gameloop_start() { TO.iv = setInterval(C_draw, 1000 / FR); G.running = true; }
function gameloop_stop() { clear_timeouts(); if (G) { G.running = false; G.bPP.show_play(); } }


















