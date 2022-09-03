function onclick_restart() { newtree(); }
function onclick_fork() { add_element(addfork); }
function onclick_leaf() { add_element(addleaf); }
function onclick_layer() { addlayer(); }
function onclick_animate() { interval_id = setInterval(onclick_layer, 500); }
function onclick_jittering() {
	jittering = !jittering;
	if (!jittering) {
		tree.map(x => x.repair()); 
		leaves.map(x => x.current = x.orig.copy());
	}
	show_jittering();
}
function onclick_repair() { }
