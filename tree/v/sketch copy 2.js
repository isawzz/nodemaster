var pi, delta, len, xstart, ystart, w, h;
var pts = [],speed=500;
var n = 10,i=0; //total number of branches
var interval_id=null;


function draw() {
	if (i<n) {
		branch();
		i++;
	} else {
		clearInterval(interval_id); interval_id = null;
		console.log('tree is complete w/', n, 'branches!')
	}
	noLoop();
}
var factor=.7;
function branch() {

	//randomly select a point
	//from that point, draw 1|2 branches
	//replace point by 1|2 new points
	let p = rChoose(pts);
	if (i == 0) {
		//just 1 main branch straight up
		let [x, y, l] = [p.x, p.y, p.l];
		let pnew = { x: x, y: y - l, l: l *factor };
		line(x, y, pnew.x, pnew.y);
		arrReplace(pts, [p], [pnew]);
	} else {
		//2 branches left up, right up
		let [x, y, l] = [p.x, p.y, p.l];
		let pnew1 = { x: x - 10, y: y - l, l: l  *factor };
		line(x, y, pnew1.x, pnew1.y);
		let pnew2 = { x: x + 10, y: y - l, l: l  *factor };
		line(x, y, pnew2.x, pnew2.y);
		arrReplace(pts, [p], [pnew1, pnew2]);
	}

}
function setup() {
	[w, h] = [600, 500]; //windowWidth,windowHeight];
	createCanvas(w, h);

	[len, xstart, ystart] = [100, w / 2, h];


	//pi = PI;
	//delta = (pi / 6 + pi / 4) / 2;

	let pt = { x: xstart, y: ystart, l: len };
	pts = [pt];

	background(220);

}

function animate_tree(){
	interval_id = setInterval(next,speed);
}

function next() {
	draw();
}
function start_animation() {
	if (interval_id) {
		//i=0;
		clearInterval(interval_id);
	}
	i=0;
	animate_tree();
}

