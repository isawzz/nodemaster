
DA.edits = [];
function open_invisible_input(ev) {
	//console.log('ev.target', ev.target)
	if (ev.target.id != 'map') return;
	let [x, y] = [ev.clientX, ev.clientY];
	//console.log('x', x, 'y', y)
	rem=y%20;
	y-=rem;
	let d = mDiv(dTable, { x: x, y: y, position: 'absolute', wmin:10,  }, null); //,'<span contenteditable="true">This is an editable paragraph.</span>');
	DA.edits.push(d);
	d.setAttribute('contentEditable', true);
	d.style.outline = 'none';
	d.onkeydown=function (e) {
		DA.tabKeyPressed = e.keyCode == 9;
		if (DA.tabKeyPressed) {
			e.preventDefault();
			return;
		}
	};

	d.onkeyup=function (e) {
		if (DA.tabKeyPressed) {
			//console.log('TAB!', DA.edits); // Do stuff for TAB
			//what is the index of this div?
			let idx=DA.edits.indexOf(e.target);
			//console.log('i am index',idx);
			let next = (idx+1)%DA.edits.length;
			if (next!=idx) DA.edits[next].focus();
			e.preventDefault();
			return;
		}
		

		//Do other stuff when not TAB
	};
	d.onfocus=e=>{
		if (DA.focusElement != e.target && isdef(DA.focusElement)){
			let el = DA.focusElement;
			if (isEmpty(el.innerHTML)) {
				removeInPlace(DA.edits,el);
				el.remove();
				//console.log('recycled:',el);
			}
		}
		//console.log('focus');
		DA.focusElement = e.target;
		selectText(DA.focusElement);

		//if (isEmpty(d.innerHTML)) {removeInPlace(DA.edits,d);d.remove(); }
	};

	d.focus();

	// d.onkeyup = setFocus;
	// d.onmouseup = setFocus;
}

function cycle_through_editables(ev) {
	console.log('key', ev.key)
}

var selectedElement = null;
function setFocus(e) {
	if (selectedElement)
		selectedElement.style.outline = 'none';

	selectedElement = window.getSelection().focusNode.parentNode;
	// selectedElement.style.outline = '1px solid #f00';
};




















