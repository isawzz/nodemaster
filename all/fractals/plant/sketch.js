// Coding Rainbow
// Daniel Shiffman
// http://patreon.com/codingtrain
// Code for: https://youtu.be/E1B4UoSQMFw

// variables: A B
// axiom: A
// rules: (A → AB), (B → A)
var angle;
var axiom = 'F';
var sentence = axiom;
var len = 100;

var rules = [];
rules[0] = {
	a: 'F',
	b: 'FF+[+F-F-F]-[-F+F+F]'
};

function generate() {
	len *= 0.5;
	var nextSentence = '';
	for (var i = 0; i < sentence.length; i++) {
		var current = sentence.charAt(i);
		var found = false;
		for (var j = 0; j < rules.length; j++) {
			if (current == rules[j].a) {
				found = true;
				nextSentence += rules[j].b;
				break;
			}
		}
		if (!found) {
			nextSentence += current;
		}
	}
	sentence = nextSentence;
	createP(sentence);
	turtle();
}

function turtle() {
	background(51);
	resetMatrix();
	translate(width / 2, height);
	stroke(255, 100);
	let step = 0;
	for (var i = 0; i < sentence.length; i++) {
		var current = sentence.charAt(i);

		if (current == 'F') {
			line(0, 0, 0, -len);
			translate(0, -len); console.log(`(${step++}) branch`);
		} else if (current == '+') {
			rotate(angle); console.log(`(${step++}) rotate +`);
		} else if (current == '-') {
			rotate(-angle); console.log(`(${step++}) rotate -`);
		} else if (current == '[') {
			push(); console.log(`(${step++}) push`);
		} else if (current == ']') {
			pop(); console.log(`(${step++}) pop`);
		}
	}
}

function setup() {
	createCanvas(400, 400);
	angle = radians(25);
	background(51);
	createP(axiom);
	turtle();
	var button = createButton('generate'); button.mousePressed(generate);
	var button1 = createButton('clear'); button1.mousePressed(() => { len = 100; sentence = axiom; removeElements(); clear(); setup(); });
}
