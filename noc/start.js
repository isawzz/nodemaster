onload = start;
FR = 50;
TESTING = true;
function start() {
	if (nundef(dTable)) dTable = mSection({ padding: 10, hmin: 400 }, 'dTable');
	G = { running: false };

	//#region examples & TESTING
	if (TESTING) {
		test1_car_math(); //test16_function(); //test12_fop(); //test11_function(); //test7_function(); //test6_func(); //test5_line(); //test4_range_math(); //test1_car_math();  //test3_point_math(); //test2_point_nomath(); //test0_car_nomath(); 
		return;
	}
	//mFlex(dTable);	//test0_fireClick();
	// C = new Canvas97(dTable, {}, {}, gameloop_start, gameloop_stop, 'cc', null, true);
	// C.add({update: update_move});
	// C.add({x:20,y:20,a:45,draw:draw_walker});
	// C.add({draw:draw_walker});
	//C.add({x:-200,y:100, color: 'pink', draw:draw_point});
	//C.add({x:-200,y:-100, color: 'blue', draw:draw_point});
	//gameloop_start();
	//#endregion

	C = new SimpleCanvas(dTable, {}, {}, gameloop_start, gameloop_stop, {x:100,y:300});
	C.add({ color: 'red', draw: draw_point, update: movedown });
	C.add({ x: 30, y: 30, color: 'white', draw: draw_point });
	C.draw();
	//C.play();

}

function gameloop_start() { TO.ivdraw = setInterval(gameloop, 1000 / FR); G.running = true; }
function gameloop_stop() { clear_timeouts(); if (G) G.running = false; }
function gameloop() {
	let changed = C.update();
	if (changed) C.draw();
}


















