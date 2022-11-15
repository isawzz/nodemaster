
function load_yt_in_iframe(dParent) {

	var div = document.createElement('iframe');
	div.id = 'iframe1';
	mStyle(div, { w: 500, h: 300 });
	mAppend(dParent, div);
	div.src = "https://www.youtube.com/embed/3pNpHZ1yv3I"; //YES!
	//iDiv.src = "https://www.youtube.com/embed/3pNpHZ1yv3I?autoplay=1";

}


function playt() {

	var tag = document.createElement('script');
	tag.src = "https://www.youtube.com/iframe_api";
	var firstScriptTag = document.getElementsByTagName('script')[0];
	firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

	var player;
	function onYouTubeIframeAPIReady() {
		player = new YT.Player('player', {
			height: '390',
			width: '640',
			videoId: 'Kopr6Q3oGHw',
			playerVars: {
				'playsinline': 1,
				//autoplay: 1,
				//mute: 1,
			},
			events: {
				'onReady': onPlayerReady,
				'onStateChange': onPlayerStateChange
			}
		});
	}

	// 4. The API will call this function when the video player is ready.
	function onPlayerReady(event) {
		console.log('player is ready - please click anywhere on page')
		onclick = () => event.target.playVideo();
	}

	// 5. The API calls this function when the player's state changes.
	//    The function indicates that when playing a video (state=1),
	//    the player should play for six seconds and then stop.
	var done = false;
	function onPlayerStateChange(event) {
		if (event.data == YT.PlayerState.PLAYING && !done) {
			// setTimeout(stopVideo, 6000);
			setTimeout(volume_up, 2000);
			done = true;
		}
	}
}
















