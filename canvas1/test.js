
function test4_range_math() {
	C = new MathCanvas(dTable, {}, {}, gameloop_start, gameloop_stop, 'cc',10);
	C.plot(5,3);
	//C.add({ x: 50, y: 80, color: 'pink', draw: draw_point });
	//C.add({ x: 50, y: -80, color: 'red', draw: draw_point });
	C.draw();

}

function test3_point_math() {
	C = new Canvas95(dTable, {}, {}, gameloop_start, gameloop_stop, 'cc', null, true);
	C.add();
	C.add({ x: 50, y: 80, color: 'pink', draw: draw_point, update: update_move });
	C.add({ x: 50, y: -80, color: 'red', draw: draw_car, update: update_car, v: { a: 0, mag: 5 } });
	C.draw();

	C.play();
}
function test2_point_nomath() {
	C = new Canvas95(dTable, {}, {}, gameloop_start, gameloop_stop);
	C.add();
	C.add({ x: -200, y: 100, color: 'pink', draw: draw_point });
	C.draw();
	C.play();

}
function test1_car_math() {
	C = new Canvas95(dTable, {}, {}, gameloop_start, gameloop_stop, 'cc', null, true);
	C.add({ w: 30, h: 25, color: 'red', draw: draw_car, update: update_car, turn_inc: 10, v: { a: 280, mag: 5 } });
	C.add({ x: 30, y: -100, color: 'green', w: 35, h: 25, draw: draw_car, update: update_car, v: { a: 0, mag: 3 } });
	C.draw();
}
function test0_car_nomath() {
	C = new Canvas95(dTable, {}, {}, gameloop_start, gameloop_stop);
	C.add({ w: 30, h: 25, color: 'red', draw: draw_car, update: update_car, turn_inc: 10, v: { a: 280, mag: 5 } });
	C.add({ x: 30, y: -100, color: 'green', w: 35, h: 25, draw: draw_car, update: update_car, v: { a: 0, mag: 3 } });
	C.draw();
}





















