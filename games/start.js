onload = start;

TESTING = 'live'; // live | nginx | [false] | true (live for live-server, nginx for nginx) 

async function start() {
	Socket = TESTING == 'live' ? io('http://localhost:2121') : TESTING == 'nginx' ? io('http://216.250.112.218:3000') : io();
	await load_syms();
	initui(); //macht dHeader,dMessage,dTable,dFooter und den monkey: dPuppet

	//make puppet jump every 10 seconds
	TO.puppet = setInterval(()=>anime({ targets: dPuppet, translateY: -12, rotate: '1turn', direction: 'alternate',duration: 1000 }),5000);
	

}

function initui(){
	let htop=105;

	dPuppet = miPic('monkey', document.body, { position: 'fixed', fz: 40, left: 40, top: htop-45 });
	anime({ targets: dPuppet, translateX: 250, rotate: '1turn', duration: 3000 });

	dHeader = mBy('dHeader'); mStyle(dHeader, { h: htop-22, w: '100vw' });

	mButton('TEST', () => mStyle('dTable', { h: rNumber(500,1500) }), dHeader);

	dMessage = mBy('dMessage'); mStyle(dMessage, { h: 22, w: '100vw' });

	let hmintable=`calc( 90vh - ${htop}px )`;
	dTable = mBy('dTable'); mStyle(dTable, { position: 'relative', hmin: hmintable, wmin: '100%' }); mClass(dTable, 'wood');

	let txt='copyright 2022 Vidulus Ludorum';
	let fz = mStyleGet(dTable,'fz');
	let wprox = mTextWidth(txt,fz);
	dFooter = mDiv(dTable, { position: 'absolute', bottom: -22, left: `calc( 50vw - ${wprox/2}px )` }, 'dFooter', txt); mCenterFlex(dFooter);

	//dFooter = mBy('dFooter'); mStyle(dFooter,{position:'absolute',bottom:-20});dFooter.innerHTML='copyright 2022 vidulusludorum';



	console.log('dTable', dTable)
	//jetzt wie soll eine file upload form aussehen?
	//ich will beliebiges file uploaden koennen, aber nur als admin oder mit authorization
	//specify upload folder default ./base/uploads
	//specify filename (default orig)
	//dTable soll min von 600 haben


	//wie hab ich die texture wood gemacht>



}


