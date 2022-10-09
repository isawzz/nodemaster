onload = start;
FR = 25;
TESTING = true;
function start() {
	if (nundef(dTable)) dTable = mSection({ padding: 10, hmin: 400, align:'center' }, 'dTable'); //console.log('dTable',dTable)
	G = { running: false, items: [] }; //items sind zB alle canvases!

	let c1 = new CCanvasNoClear(dTable, { w: 500, h: 250 },{},null,null,'tl'); G.items.push(c1);
	//let c2 = new CCanvas(dTable, { w: 500, h: 250 }); G.items.push(c2);
	let c3 = new CCanvasPlot(dTable, { w: 500, h: 250 }); G.items.push(c3);

	//add the play pause button!
	let controls = mPlayPause(dTable, {}, gameloop_start, gameloop_stop);
	[G.play, G.pause] = [controls.play, controls.pause];

	test4();  //test_formula0(); ////test3_cdf(); //test2_nerd(); //test1_nerd(); //test_nerd(); //noc6_simple_gaussian(); //noc4_gaussian(); //noc3_gaussian(); //noc2_explicit_distribution(); //noc1_randomwalkers();

	//G.play();
}

function gameloop_start() { TO.ivdraw = setInterval(gameloop, 1000 / FR); G.items.map(x => x.draw()); G.running = true; }
function gameloop_stop() { clear_timeouts(); if (G) G.running = false; }
function gameloop() {
	for (const item of G.items) {
		let changed = item.update();
		if (changed) item.draw();
	}
}


















