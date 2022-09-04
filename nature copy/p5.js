var P5;

// function starfield_canvas(p) {

// 	let speed;

// 	p.setup = () => {
// 		p.createCanvas(600, 600);
// 		for (let i = 0; i < 800; i++) {
// 			stars[i] = new Star(p);
// 		}
// 	};

// 	p.draw = (p) => {
// 		speed = map(p.mouseX, 0, p.width, 0, 50);
// 		background(0);
// 		translate(p.width / 2, p.height / 2);
// 		for (let i = 0; i < stars.length; i++) {
// 			stars[i].update();
// 			stars[i].show(p);
// 		}
// 	};
// }
function spacecolonization_canvas(p) {

	p.setup = () => {
		p.createCanvas(400, 200);
	};

	p.draw = () => {
		p.background(60);
		p.fill(255);
		console.log('drawing');
		//p.noLoop();
		//p.rect(x, y, 50, 50);
	};
}
function createInstance() {
	console.log('hhhhhhhhhhhhhhh')
	P5 = initP5({ margin: 10, align: 'center' }, spacecolonization_canvas, 'dP5');
}
function deleteInstance() {
	P5.remove();
	//initP5({w:400,h:200,margin:10,align:'center'},space_colon_canvas,'dP5');
}
function initP5(styles, f) {
	let d = mDiv('dP5', styles);
	return new p5(f, d);
	//console.log('P5',P5,typeof P5)
}


















