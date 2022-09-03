
var PI = Math.pi, interval_id, angle, factor = .67, tree = [], leaves=[], pointer = 0, jittering = false;

function setup() {
	show_jittering();
	createCanvas(600, 500); //windowWidth
	newtree();
}
function newtree() {
	tree = [];leaves=[]; pointer = numlayers = 0; 
	let a = createVector(width / 2, height);
	let b = createVector(width / 2, height - 100);
	let root = tree[0] = new Branch(a, b);

	//tree[1] = root.branch(PI / 4);
	//tree[2] = root.branch(-PI / 4);
	// slider = createSlider(0,TWO_PI,PI/4,PI/40);
}
function draw() {
	background(51);

	for (let i = 0; i < tree.length; i++) {
		tree[i].show();
		if (jittering) tree[i].jitter();
	}
	// angle=slider.value();
	for (let i = 0; i < leaves.length; i++) {
		let l=leaves[i];
		noStroke();
		fill(0,255,100,100); //last one is alpha!
		ellipse(l.x,l.y,8,8);
		leaves[i].y += random(0,2);
	}

	//noLoop();
}
function show_jittering() { let b = mBy('bJittering'); b.innerHTML = jittering ? 'krank' : 'gesund'; if (!jittering) onclick_repair(); }
function onclick_jittering() { jittering = !jittering; show_jittering(); }
function onclick_repair() { tree.map(x => x.repair()); }
function onclick_restart() { newtree(); }
function onclick_fork() {
	while (pointer < tree.length && tree[pointer].finished) { pointer++; }
	//assertion(pointer < tree.length, 'skuril!!!!!! und unmoeglich!!!!!');
	if (pointer >= tree.length){
		console.log('no more free branches!!! tree is done!');
		return;
	}
	let root = tree[pointer];
	addfork(root);
	pointer++;
}
function onclick_leaf() {
	while (pointer < tree.length && tree[pointer].finished) { pointer++; }
	assertion(pointer < tree.length, 'skuril!!!!!! und unmoeglich!!!!!');
	let root = tree[pointer];
	addleaf(root);
}
function onclick_layer() { addlayer(); }
function addleaf(root) {
	let leaf = root.get_healthy_end().copy(); //copy the vector
	leaves.push(leaf);
	root.finished = true;
}
function addfork(root) {
	for (const a of [PI / 4, -PI / 6]) {
		let b = root.branch(a);
		root.children.push(b);
		tree.push(b);
	}
	root.finished = true;
}
var numlayers = 0;
function addlayer() {
	if (numlayers === 6) {
		for (let i = tree.length - 1; i >= 0; i--) {
			if (!tree[i].finished) addleaf(tree[i]);
		}
		clearInterval(interval_id);


	} else {
		for (let i = tree.length - 1; i >= 0; i--) {
			if (!tree[i].finished) addfork(tree[i]);
		}
		numlayers++;
	}


}

function onclick_animate(){
	interval_id = setInterval(onclick_layer,500);
}








