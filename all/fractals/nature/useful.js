

function create_menu(dParent, dir = 'h') {
	let d;
	if (dir == 'h') {
		d = dMenu = mDiv(dParent, { w: '100%', display: 'flex' }); //,bg:'orange' });
	} else {
		d = dMenu = mDiv(dParent, { padding: 10, gap: 10, h: '100%', display: 'flex', dir: dir }); //,bg:'orange' });
	}
	mToolbar(['grow', 'clear'], handle_command, d, {}, { vmargin: 5 });
	mTogglebar({ jitter: false }, flag_toggle, { bg: 'lightgreen' }, { bg: '#eee' }, d);//, { margin:10,padding:10,h:100,bg: 'blue' });
	mLinebreak(dTable, 10);

}
function flag_set(prop) { G[prop] = true; }
function flag_reset(prop) { G[prop] = false; }
function flag_toggle(name) { if (G[name]) flag_reset(name); else flag_set(name); }
function handle_command(cmd) {
	console.log('handle command', cmd, 'for type', C.name);
	let itemtype = C.name;
	let func = get_func(itemtype, cmd);
	func();
}














