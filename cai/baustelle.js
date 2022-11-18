
DA.edits = [];
function add_edit(x, y, text = '', bg = 'random') {
	let d = mDiv(dTable, { bg: bg, fg: 'contrast', x: x, y: y, position: 'absolute', padding: 10, wmin: 10, }, getUID(), text); //,'<span contenteditable="true">This is an editable paragraph.</span>');
	DA.edits.push(d);
	d.setAttribute('contentEditable', true);
	d.style.outline = 'none';
	d.onkeydown = function (e) {
		DA.tabKeyPressed = e.keyCode == 9;
		if (DA.tabKeyPressed) {
			e.preventDefault();
			return;
		} else {
			//console.log('keyCode',e.keyCode);
			//if (e.keyCode == 13){			save_all();			}
		}
	};
	d.onkeyup = function (e) {
		if (DA.tabKeyPressed) {
			//console.log('TAB!', DA.edits); // Do stuff for TAB
			//what is the index of this div?
			let idx = DA.edits.indexOf(e.target);
			//console.log('i am index',idx);
			let next = (idx + 1) % DA.edits.length;
			if (next != idx) DA.edits[next].focus();
			e.preventDefault();
			return;
		}


		//Do other stuff when not TAB
	};
	d.onfocus = e => {

		//console.log('target',e.target.id);
		//return;
		if (DA.focusElement != e.target && isdef(DA.focusElement)) {
			let el = DA.focusElement;
			if (isEmpty(el.innerHTML)) {
				removeInPlace(DA.edits, el);
				el.remove();
				//console.log('recycled:',el);
			}
		}

		//console.log('target',e.target);
		let id = evToId(e); console.log('id', id); let elem = mBy(id); selectText(elem);

		//console.log('focus');
		DA.focusElement = e.target;
		//if (DA.selectOnClick) selectText(DA.focusElement);

		//if (isEmpty(d.innerHTML)) {removeInPlace(DA.edits,d);d.remove(); }
	};
	d.focus();
}
async function load_all() {
	let o = await route_path_yaml_dict('../y/page.yaml');
	for (const item of o) { add_edit(item.x, item.y - 41, item.text); }
}
function onclick_toobar(name) {
	console.log('clicked', name);
	switch (name) {
		case 'clear': mClear(dTable); DA.edits = []; break;
		case 'magic': break;
		case 'lineup':
			mCenterFlex(dTable); //mStyle(dTable,{display:'grid'});
			DA.edits.map(x => mStyle(x, { position: null, display: 'inline' }));
			break;
		case 'orig': DA.edits.map(x => x.style.position = 'absolute'); break;
	}
}
function open_invisible_input(ev) {
	if (ev.target.id != 'dTable') return;
	let [x, y] = [ev.offsetX, ev.offsetY];
	y = toModulo(y - 10, 20);
	x = toModulo(x, 50);
	add_edit(x, y);
}
function save_all() {
	//console.log('save',Date.now())
	let data = [];
	for (const edit of DA.edits) {
		let rect = getRect(edit);
		let text = edit.innerHTML;
		let o = { x: rect.x, y: rect.y, text: text };
		data.push(o);
	}
	route_post_json('http://localhost:3000/post/json', { data: data, filename: 'page' }, response => {
		//console.log(JSON.stringify(response));
	});
}


















