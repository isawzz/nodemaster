
function onclick_menu_item(name) { G_clear(); G_init(name); }
function onclick_playpause() {
	gameloop_toggle();
	if (G.running) get_func(C.name, 'grow')(); else { C.root.animated = false; }
}

