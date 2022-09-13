function test0_fireClick() {
	function wiebitte(ev) {
		evNoBubble(ev);
		console.log('target', ev.target, 'classes', ev.target.classList);
		//ev.target.classList.toggle('anders');
		let d = ev.target;
		mClassToggle(d, 'bgblue bgred');
	}

	let b = mButton('TEST', wiebitte, dTable, { fg: 'white' }, 'bgblue');
	fireClick(b);

	onclick = (ev) => { evNoBubble(ev); fireClick(b); }
}