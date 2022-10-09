var PI=Math.pi,w=600,h=500,angle,factor=.67;

function setup() {
	[w, h] = [600, 500]; //windowWidth,windowHeight];
	createCanvas(w, h);
	slider = createSlider(0,TWO_PI,PI/4,PI/40);
}
function draw(){
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
