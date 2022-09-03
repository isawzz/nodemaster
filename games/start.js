onload = start;

TESTING = 'live'; // live | nginx | [false] | true (live for live-server, nginx for nginx) 

async function start() {
	Socket = TESTING == 'live' ? io('http://localhost:2121') : TESTING == 'nginx' ? io('http://216.250.112.218:3000') : io();
	await load_syms();
	initui(); //macht dHeader,dMessage,dTable,dFooter und den monkey: dPuppet

	TO.puppet = setInterval(monkey_jump, rNumber(5000,10000)); //make puppet jump every random seconds


}

function initui() {
	let htop = 105;

	dPuppet = miPic('monkey', document.body, { position: 'fixed', fz: 40, left: 40, top: htop - 45 });
	aRollby(dPuppet, 250);

	dHeader = mBy('dHeader'); mStyle(dHeader, { h: htop - 22, w: '100vw' });

	//mButton('TEST', () => mStyle('dTable', { h: rNumber(500, 1500) }), dHeader);
	// mButton('TEST', monkey_jump, dHeader);

	dMessage = mBy('dMessage'); mStyle(dMessage, { h: 22, w: '100vw' });

	let hmintable = `calc( 90vh - ${htop}px )`;
	dTable = mBy('dTable'); mStyle(dTable, { position: 'relative', hmin: hmintable, wmin: '100%' }); mClass(dTable, 'wood');

	let txt = 'copyright 2022 Vidulus Ludorum';
	let fz = mStyleGet(dTable, 'fz');
	let wprox = mTextWidth(txt, fz);
	dFooter = mDiv(dTable, { position: 'absolute', bottom: -22, left: `calc( 50vw - ${wprox / 2}px )` }, 'dFooter', txt); mCenterFlex(dFooter);

	//console.log('dTable', dTable)
}
function monkey_jump() { aJumpby(dPuppet, rNumber(40,60)); }



