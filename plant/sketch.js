//variables: A B
//axiom: A
//rules: A->AB, B->A
var axiom = 'A';
var sentence;
var rule1 = { aus: 'A', mach: 'AB' };
var rule2 = { aus: 'B', mach: 'A' };
function generate() {
	let nextSentence = '';
	for (let i = 0; i < sentence.length; i++) {
		var current = sentence.charAt(i);
		if (current == rule1.aus) nextSentence += rule1.mach;
		else if (current == rule2.aus) nextSentence += rule2.mach;
		else nextSentence += current;
	}
	sentence = nextSentence;
	createP(sentence);
}
function setup() {
	sentence = axiom;
	let button = createButton("generate"); button.mousePressed(generate);
	button = createButton("restart"); button.mousePressed(onclick_restart);
	noCanvas();
	createP(axiom);
}
function onclick_generate() { generate(); }
function onclick_restart() { setup(); }

function draw() {

}

























