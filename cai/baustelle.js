
DA.edits = [];
function open_invisible_input(ev) {
	//console.log('ev.target', ev.target)
	if (ev.target.id != 'dTable') return;
	let [x, y] = [ev.offsetX, ev.offsetY];
	//console.log('x', x, 'y', y, ev)
	rem=y%20;
	y=y-rem-10; if (y<0) y=0;

	let d = mDiv(dTable, { x: x, y: y, padding:10, position: 'absolute', wmin:10,  }, null); //,'<span contenteditable="true">This is an editable paragraph.</span>');
	DA.edits.push(d);
	d.setAttribute('contentEditable', true);
	d.style.outline = 'none';
	d.onkeydown=function (e) {
		DA.tabKeyPressed = e.keyCode == 9;
		if (DA.tabKeyPressed) {
			e.preventDefault();
			return;
		}else {
			//console.log('keyCode',e.keyCode);
			//if (e.keyCode == 13){			save_all();			}
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
		if (DA.selectOnClick) selectText(DA.focusElement);

		//if (isEmpty(d.innerHTML)) {removeInPlace(DA.edits,d);d.remove(); }
	};
	d.ondblclick = ev=>{selectText(ev.target); console.log('dblclick!')}
	d.focus();

	// d.onkeyup = setFocus;
	// d.onmouseup = setFocus;
}

function cycle_through_editables(ev) {
	//console.log('key', ev.key)
}

var selectedElement = null;
function setFocus(e) {
	if (selectedElement)
		selectedElement.style.outline = 'none';

	selectedElement = window.getSelection().focusNode.parentNode;
	// selectedElement.style.outline = '1px solid #f00';
};

function save_all(){
	//console.log('save',Date.now())
	let data = [];
	for(const edit of DA.edits){
		let rect = getRect(edit);
		let text = edit.innerHTML;
		let o = {x:rect.x,y:rect.y,text:text};
		data.push(o);
	}
	route_post_json('http://localhost:3000/post/json', {data:data,filename:'page'}, response => {
		//console.log(JSON.stringify(response));
	});
}


















