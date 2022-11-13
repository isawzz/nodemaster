
function toggle_select(pic, selected, clSelected = 'selected', clUnselected = null) {
	//if selected is a list, pic is added or removed from it
	//if selected is an object, it is unselected
	//if selected is not defined or null, ignore
	//	console.log(pic)
	let ui = iDiv(pic);
	console.log('div',ui);

	// mClass(ui,'selected'); //ui.classList.add('selected'); //ui.style.background='blue'; mClass(ui,clSelected);
	// return;

	pic.isSelected = !pic.isSelected;
	if (pic.isSelected) {
		if (isdef(clUnselected)) mClassRemove(ui, clUnselected);
		mClass(ui, clSelected);
	} else {
		mClassRemove(ui, clSelected);
		if (isdef(clUnselected)) mClass(ui, clUnselected);
	}

	//if piclist is given, add or remove pic according to selection state
	if (isdef(selected)) {
		if (isList(selected)) {
			if (pic.isSelected) {
				console.assert(!selected.includes(pic), 'UNSELECTED PIC IN PICLIST!!!!!!!!!!!!')
				selected.push(pic);
			} else {
				console.assert(selected.includes(pic), 'PIC NOT IN PICLIST BUT HAS BEEN SELECTED!!!!!!!!!!!!')
				removeInPlace(selected, pic);

			}
		} else {
			mClassRemove(iDiv(selected), clSelected);
			if (isdef(clUnselected)) mClass(iDiv(selected), clUnselected);
			selected.isSelected = false;
		}
	}
	return pic.isSelected ? pic : null;
}



























