onload = start;
function start() {
	make_favicon();
}


var Emicons = {
	msmaus: "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/microsoft/319/mouse-face_1f42d.png",
	gmaus: "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/google/346/mouse-face_1f42d.png",
	smaus: "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/softbank/145/mouse-face_1f42d.png",
	twmaus: "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/twitter/322/mouse-face_1f42d.png",
	maus: "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/whatsapp/326/mouse-face_1f42d.png",
};

function make_favicon(key) {
	let url = valf(Emicons[key], Emicons.maus);
	var link = document.querySelector("link[rel*='icon']") || document.createElement('link');
	link.type = 'image/png';
	link.rel = 'shortcut icon';
	link.href = url; //'https://ssl.gstatic.com/docs/doclist/images/infinite_arrow_favicon_5.ico';
	document.getElementsByTagName('head')[0].appendChild(link);
}













