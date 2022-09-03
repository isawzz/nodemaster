var pi, delta, len, xstart, ystart, w, h;
var PI=Math.pi;
var pts = [],speed=500;
var n = 10,i=0; //total number of branches
var interval_id=null, factor=.7, angle=PI/4;

function setup() {
	[w, h] = [600, 500]; //windowWidth,windowHeight];
	createCanvas(w, h);
	slider = createSlider(0,TWO_PI,PI/4,PI/40);
}
function drawtree(){
	background(51);
	stroke(255);
	translate(w/2,h);
	angle=slider.value();
	branches(100);
	//noLoop();
}
function branches(len){
	line(0,0,0,-len);
	translate(0,-len);
	if (len>4) {
		push();
		rotate(angle);
		branches(len*factor);
		pop();
		push();
		rotate(-angle);
		branches(len*factor);
		pop();
	}
}
function draw() {
	drawtree();
	//drawbranch();
}
function drawbranch(){
	if (i<n) {
		branch();
		i++;
	} else {
		clearInterval(interval_id); interval_id = null;
		console.log('tree is complete w/', n, 'branches!')
	}
	noLoop();
}
function branch() {

	//randomly select a point
	//from that point, draw 1|2 branches
	//replace point by 1|2 new points
	let p = rChoose(pts);
	if (i == 0) {
		//just 1 main branch straight up
		let [x, y, l] = [p.x, p.y, p.l];
		let pnew = { x: x, y: y + l, l: l *factor };
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

