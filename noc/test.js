function test1_canvas() {

	let res = mCanvas(dTable, { w:500, h:500, bg: '#222', rounding: 10 });
	[CV, CX] = [res.cv,res.cx];
	
	cStyle({ bg: 'blue' });
	CX.fillRect(10, 10, CV.width - 20, CV.height - 20);

	//setTimeout(()=>CX.clearRect(0, 0, CV.width, CV.height),1000);	return;
	//setTimeout(()=>cClear(),1000);  //ok

	cRect(15, 15, 100, 100, { bg: 'green', fg: 'red', thickness: 10 });
	cEllipse(65, 65, 100, 100, { bg: 'red', fg: 'white', thickness: 10 });

	
}
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






