onload = start;

function start() {
	if (nundef(dTable)) dTable = mSection({ padding: 10, hmin: 400 }, 'dTable'); //mFlex(dTable);	//test0_fireClick();

	if (CV) game_clear();
	//test1_canvas(); return;

	let o = ui_type_canvas(dTable, gameloop_start, gameloop_stop);

	G = { running: false, agents: {}, items: {}, play: o.play, pause: o.pause, need_draw: true, root: null, draw: game_draw };
	G.play();
}
function game_clear() { gameloop_stop(); mClear('dTable'); G = CV = CX = null; }
function game_draw(types) {
	if (!G.need_draw) return;
	cClear();
	console.log('draw')
	if (nundef(types)) types = get_keys(G.items);
	for (const type of types) { let f = get_func(type, 'draw'); for (const item of G.items[type]) { f(item); } }
	G.need_draw = false;
}
function game_update() {
	let o = walker_create();
	//add_agent('walker',o);
	add_item('walker', o);

	G.need_draw = true;

}
function gameloop_start() { TO.ivdraw = setInterval(game_draw, 1000 / FR); game_update(); G.running = true; }
function gameloop_stop() { clear_timeouts(); if (G) G.running = false; }

function add_agent(type, o) { lookupAddToList(G.agents, [type], o); G.need_draw = true; }
function add_item(type, o) { lookupAddToList(G.items, [type], o); G.need_draw = true; }
function get_func(itemtype, cmd) { return window[`${itemtype}_${cmd}`]; }

















