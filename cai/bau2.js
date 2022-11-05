


function createViewerContent(mygames, tables = [], show_key = false) {
	let mydata = uiGetViewerStylesAndStart();
	mydata += uiGetViewer(mygames, tables, show_key);
	return mydata;
}
function uiGetViewerStylesAndStart() {
	let mydata = `
	<style>
		@keyframes appear{

			0%{opacity:0;transform: translateY(50px)}
			100%{opacity:1;transform: translateY(0px)}
 		}

 		.contact{
 			cursor:pointer;
 			transition: all .5s cubic-bezier(0.68, -2, 0.265, 1.55);
	 	}

	 	.contact:hover{
	 		transform: scale(1.1);
	 	}

	</style>
	<div id='game_menu' style="text-align: center; animation: appear 1s ease">
  `;
	return mydata;
}
function uiGetViewerItem(item, tables = [], show_key) {
	let bg = randomColor(); //getColorDictColor(item.color);

	return `
	<div onclick="start_game(event)" gamename=${item.id} style='overflow:hidden;cursor:pointer;border-radius:10px;margin:10px;padding:5px;padding-top:15px;width:120px;min-height:90px;display:inline-block;background:${bg}'>
	<span style='font-size:50px;font-family:${item.family}'>${item.text}</span><br>${show_key ? item.key : item.E}</div>
	`;
}
function uiGetViewer(mygames, tables, show_key) {
	mydata = '';
	for (const row of mygames) {
		mydata += uiGetViewerItem(row, tables, show_key);
	}
	return mydata;
}

















