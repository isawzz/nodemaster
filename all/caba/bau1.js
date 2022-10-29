//hier faengt alles an
var meme;
var obstacles = [];
var score;

function startGame() {
	meme = new component(30, 30, 'red', 10, 120);
	meme.gravity = 0.05;
	score = new component('30px', 'Consolas', 'black', 280, 40, 'text');
	myGameArea.start();
}

var myGameArea = {
	canvas: document.createElement('canvas'),
	start: function () {
		this.canvas.width = 480;
		this.canvas.height = 270;
		this.context = this.canvas.getContext('2d');
		document.body.insertBefore(this.canvas, document.body.childNodes[0]);
		this.frameNo = 0;
		this.interval = setInterval(updateGameArea, 20);
	},
	clear: function () {
		this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
	},
};

function updateGameArea() {
	var x, height, gap, minHeight, maxHeight, minGap, maxGap;
	for (i = 0; i < obstacles.length; i += 1) {
		if (meme.crashWith(obstacles[i])) {
			return;
		}
	}
	myGameArea.clear();
	myGameArea.frameNo += 1;
	if (myGameArea.frameNo == 1 || everyinterval(150)) {
		x = myGameArea.canvas.width;
		minHeight = 20;
		maxHeight = 200;
		height = Math.floor(Math.random() * (maxHeight - minHeight + 1) + minHeight);
		minGap = 50;
		maxGap = 200;
		gap = Math.floor(Math.random() * (maxGap - minGap + 1) + minGap);
		obstacles.push(new component(10, height, 'green', x, 0));
		obstacles.push(new component(10, x - height - gap, 'green', x, height + gap));
	}
	for (i = 0; i < obstacles.length; i += 1) {
		obstacles[i].x += -1;
		obstacles[i].draw();
	}
	score.text = 'SCORE: ' + myGameArea.frameNo;
	score.draw();
	meme.newPos();
	meme.draw();
}

function everyinterval(n) {
	if ((myGameArea.frameNo / n) % 1 == 0) {
		return true;
	}
	return false;
}

function accelerate(n) {
	meme.gravity = n;
}
















