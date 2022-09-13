onload = start;

function start() {
	dTable = mSection({ padding: 10, hmin: 400 }, 'dTable'); //mFlex(dTable);	//test0_fireClick();

	game_init();
}
function game_clear() { gameloop_stop(); mClear('dTable'); G = cv = cx = null; }
function game_init() {

	if (cv) game_clear();

	let c = ui_type_canvas(dTable, gameloop_start, gameloop_stop);

	G = { running: false, agents:{}, items: {}, play: c.play, pause: c.pause, changed:true, root: null, draw: draw_canvas };

}
function game_draw(types){
	if (!G.changed) return;
	cClear(cv, cx);
	//console.log('draw')
	if (nundef(types)) types = get_keys(G.items);
	for (const type of types) { let f = get_func(type, 'draw'); for (const item of G.items[type]) { f(item); } }
	G.changed = false;
}
function game_update(types){
	let changed = false;
	if (nundef(types)) types = get_keys(G.agents);
	for (const type of types) { let f = get_func(type, 'update'); for (const agent of G.agents[type]) { changed ||= f(agent); } }
	G.changed = changed;

}
function gameloop_start() { TO.ivdraw = setInterval(game_draw, 1000 / FR); game_update(); G.running = true; }
function gameloop_stop() { clear_timeouts(); if (G) G.running = false; }

function get_func(itemtype, cmd) { return window[`${itemtype}_${cmd}`]; }

















