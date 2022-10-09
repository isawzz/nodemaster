DA.isystem = -1;
function lsys_init(offx = 0, offy = 0, options = {}) {

	let n=NATURE.lsystems.length;
	let i=DA.isystem=(DA.isystem+1)%n;
	let system = NATURE.lsystems[i]; //if (DA.isystem>10) DA.isystem=0;  //rChoose(NATURE.lsystems);
	let maxdepth = calc_maxdepth(12000, system.rules);

	let root = {
		axiom: system.axiom, //'F',
		sentence: system.axiom,
		rules: system.rules, //[{ aus: 'F', wird: 'FF+[+F-F-F]-[-F+F+F]' },],
		t: 'root',
		p2: { x: CV.width / valf(system.xstart,2), y: CV.height },
		angle: toRadian(90),
		len: valf(system.len, 100),
		age: 0,
		gen: 0,
		id: 0,
		dangle: toRadian(valf(system.angle,25)),
		dlen: valf(system.dlen, .5),
		thickness: valf(options.thick, 1),
		dthickness: 1,
		color: rColor(70), //'seagreen',
		depth: Math.min(valf(system.depth,NATURE.depth), maxdepth), // 6
		animated: false,
		jitter: false,
		done: true,
	};
	return root;
}
function lsys_add() {
	C.items = {};
	let root = C.root; root.gen++; //gen is increased each time lsys_add is called
	let [stack, gen, b, sentence, x, y, angle, len, id] = [[], root.gen, root, root.sentence, root.p2.x, root.p2.y, root.angle, root.len, root.id++];
	for (let i = 0; i < gen; i++) { len *= root.dlen; sentence = generate(sentence); }

	let step = 0;//for testing
	for (var i = 0; i < sentence.length; i++) {
		var ch = sentence[i];
		if ('ABCFVWXYZ'.includes(ch)) {
			b = create_branch(b, angle, len, b.color); lookupAddToList(C.items, ['branch'], b); b.id = id++;
			//console.log(`(${step++}) branch`, toDegree(angle))
		} else if (ch == '+') {
			angle -= root.dangle; //toRadian(25); //console.log(`(${step++}) +`, toDegree(angle))
		} else if (ch == '-') {
			angle += root.dangle; //console.log(`(${step++}) -`, toDegree(angle))
		} else if (ch == '[') {
			stack.push({ x: b.p2.x, y: b.p2.y, angle: angle, b: b }); //console.log(`(${step++}) push`, toDegree(angle))
		} else if (ch == ']') {
			let o = stack.pop();
			angle = o.angle; x = o.x; y = o.y; b = o.b; //console.log(`(${step++}) pop`, toDegree(angle))
		}
	}
	C.changed = true;
	if (root.gen < root.depth) TO.iv1 = setTimeout(lsys_add, 100); else TO.iv1 = setTimeout(() => G_init('lsys'), 5000);
}
function generate(sentence) {
	let root = C.root;
	let rules = root.rules;
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
function calc_maxdepth(maxnodes, rules) {
	//calculate branching factor: 
	let laus = rules.map(x => x.aus).join();
	let lwird = rules.map(x => x.wird).join();
	//console.log('laus', laus, 'lwird', lwird);
	let naus = countAll(laus, 'ABF');
	let nwird = countAll(lwird, 'ABF');
	let ratio = nwird / naus;
	//console.log('naus',naus,'nwird',nwird,'ratio',ratio);
	let pow = 2;
	while (Math.pow(ratio, pow) < maxnodes) pow++;
	//console.log('max depth is:',pow,'bei ratio',ratio)
	return pow - 1;

}

