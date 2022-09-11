const AXIOM = 'F';
// const RULES = [{ aus: 'A', wird: 'AB' },{aus:'B', wird:'A'}];
//const RULES = [{ aus: 'A', wird: 'B[+A]-A' }];//,{aus:'B', wird:'A'}];
// const RULES = [{ aus: 'A', wird: 'A+[+A-A-A]-[-A+A+A]' }];//,{aus:'B', wird:'A'}];
const RULES = [{ aus: 'F', wird: 'FF+[+F-F-F]-[-F+F+F]' }];

let BF = 7;

function countAll(s, scount) {
	//usage: countAll('A+[+A-A-A]-[-A+A+A]', toLetters('ABF'))

	//let di = {}; for (let i = 0; i < scount.length; i++) { di[i] }
	let letters = toLetters(scount);
	//console.log('letters', letters);
	function counter(total, ch) {
		if (letters.includes(ch)) return total + 1; else return total;
	}

	let res = [...s].reduce(counter, 0);
	//console.log('res', res);
	return res;
}

function lsys_init(offx = 0, offy = 0, options = {}) {

	//calculate branching factor: 
	let laus = RULES.map(x => x.aus).join();
	let lwird = RULES.map(x => x.wird).join();
	//console.log('laus', laus, 'lwird', lwird);
	let naus = countAll(laus, 'ABF');
	let nwird = countAll(lwird, 'ABF');
	let ratio = nwird / naus;
	//console.log('naus',naus,'nwird',nwird,'ratio',ratio);

	//2^7 ist ok

	let maxnodes = 3000;
	let pow = 2;
	while (Math.pow(ratio, pow) < maxnodes) pow++;
	//console.log('max depth is:',pow,'bei ratio',ratio)

	let root = {
		p2: { x: cv.width / 2, y: cv.height },
		angle: toRadian(90),
		len: 200,
		axiom: AXIOM, //'F',
		sentence: AXIOM,
		rules: RULES, //[{ aus: 'F', wird: 'FF+[+F-F-F]-[-F+F+F]' },],
		done: false,
		t: 'root',
		age: 0,
		gen: 0,
		dangle: 25,
		thickness: valf(options.thick, 20), //thickness of stem
		color: valf(options.color, 'sienna'), //color of stem
		depth: 7, //Math.min(DEPTH,pow-1), // 6
		branching: BRANCHING, // [25, 5, -25],
		dlen: .7,
		dthickness: .7,
		phase: 'spring',
		speed: { spring: 500, summer: 100, autumn: 25, winter: 100, over: 2000 },
		animated: false,
		jitter: false,
	};

	console.log('depth is', root.depth)
	return root;
}
function lsys_add() {
	let root = C.root;	root.gen++;	let len = 100;	let gens = 1;
	for (let i = 0; i < gens; i++) {		root.len = len *= .5;		root.sentence = generate();	}

	// root.len*=.10;	root.sentence = generate();	root.sentence = generate();
	sentence2tree();
	console.log('root', root.gen, root.sentence, C.items.branch);
	//C.changed = true;
	//if (root.gen >= root.depth) console.log('DONE!'); else setTimeout(lsys_add, 100);
}
function sentence2tree() {
	C.items = {};
	let root = C.root;
	const damag = toRadian(25);
	let [sentence, len, angle, dlen, da, gen] = [root.sentence, root.len, root.angle, 1, toRadian(25), 0];
	let id = 0;
	angle = toRadian(90);
	let b = root, stack = []; b.id = id++; b.age = 0;
	for (var i = 0; i < sentence.length; i++) {
		var ch = sentence.charAt(i);
		if (ch == 'F' || ch == 'A' || ch == 'B') {
			// b = create_branchL(b, angle, len / (b.age + 1), rColor()); lookupAddToList(C.items, ['branch'], b);
			b = create_branchL(b, b.angle, len, rColor()); lookupAddToList(C.items, ['branch'], b); b.id = id++;
			console.log('angle',b.id,toDegree(b.angle))
			
		} else if (ch == '+') {
			b.angle -= toRadian(20); //damag; //da=damag; //angle = b.angle - da; //toRadian(25); //rotate(angle);
		} else if (ch == '-') {
			b.angle += toRadian(28); //damag; //da=-damag; //angle = b.angle + da; //toRadian(25); //da/2; //rotate(-angle);
		} else if (ch == '[') {
			stack.push(b);
			//console.log('stack',stack.map(x=>x.id))
		} else if (ch == ']') {
			b = stack.pop(); //angle = b.angle;
		}
	}
	C.changed = true;
}
function create_branchL(b, angle, len, color) { //p,len, angle,gen) {
	//let len = b.len * root.dlen;
	let root = C.root;
	//let len=root.len;

	let x = b.p2.x + Math.cos(angle) * len;
	let y = b.p2.y - Math.sin(angle) * len;
	//let age = gen;

	let o = {
		done: true,
		p1: b.p2,
		p2: { x: x, y: y },
		x: x,
		y: y,
		t: 'branch',
		age: b.age + 1, //age,
		gen: b.gen,
		len: len,
		angle: angle,
		thickness: 1, //5, //root.thickness,
		color: 'silver', //color, //('red',//root.color,
	};
	return o;

}
function generate() {
	let root = C.root;
	let rules = root.rules;
	//root.len *= 0.5; //??? macht keinen sinn!!!
	let [sentence, len] = [root.sentence, root.len];
	var nextSentence = '';
	for (var i = 0; i < sentence.length; i++) {
		var current = sentence.charAt(i);
		var found = false;
		for (var j = 0; j < rules.length; j++) {
			if (current == rules[j].aus) {
				found = true;
				nextSentence += rules[j].wird;
				break;
			}
		}
		if (!found) {
			nextSentence += current;
		}
	}
	return nextSentence;
}








