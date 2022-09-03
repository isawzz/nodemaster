//variables: A B
//axiom: A
//rules: A->AB, B->A
var axiom, rules, factor, angle, max, sentence, interval_id;;
const Simple = {
	axiom: 'A',
	rules: [
		{ aus: 'A', mach: 'AB' },
		{ aus: 'B', mach: 'A' }
	],
};
const Algae = {
	axiom: 'A',
	rules: [
		{ aus: 'A', mach: 'A+[B]-[A]' },
		{ aus: 'B', mach: 'AA' }
	],
	angle: 25,
	factor: .9,
	max: 5,
};
const Complex = {
	axiom: 'F',
	rules: [
		{ aus: 'F', mach: 'FF+[+F-F-F]-[-F+F+F]' }
	],
	angle: 25,
	factor: .5,
	max: 6,
};
var system = Algae, len = 100, angle;

var numgen=0;
function generate() {

	numgen++;if (numgen>system.max){
		clearInterval(interval_id);
		console.log('done!')
		return;
	}

	len *= factor;
	let nextSentence = '';
	for (let i = 0; i < sentence.length; i++) {
		let current = sentence.charAt(i);
		let done = false;
		for (const rule of rules) {
			if (current == rule.aus) {
				nextSentence += rule.mach;
				done = true;
				break;
			}
		}
		if (!done) nextSentence += current;
	}
	sentence = nextSentence;
	createP(sentence);
	turtle();
}
function setup() {
	axiom = system.axiom;
	rules = system.rules;
	factor = valf(system.factor,1);
	angle = radians(valf(system.angle,60));
	sentence = axiom;
	let button = createButton("generate"); button.mousePressed(generate);

	button = createButton("animate"); button.mousePressed(()=>interval_id=setInterval(generate,500));

	//noCanvas();
	createCanvas(400, 400);
	background(51);

	createP(axiom);
	turtle();
}

function turtle() {
	background(51);
	stroke(255,100); //100 is alpha
	translate(width/2,height);
	for (let i = 0; i < sentence.length; i++) {
		let x = sentence.charAt(i);
		if ('ABF'.includes(x)) {line(0, 0, 0, -len);translate(0,-len);}
		else if (x == '+') rotate(angle);
		else if (x == '-') rotate(-angle);
		else if (x == '[') push(); 
		else if (x == ']') pop();
	}
}

function draw() {

}

























