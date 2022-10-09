onload = start;

async function start() {

	//rotating monkey
	await load_syms();
	let x = miPic('monkey', document.body, { position: 'fixed', fz: 40, left: 100, top: 100 });
	anime({ targets: x, translateX: 250, rotate: '1turn', duration: 3000 });

}



