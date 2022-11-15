let playersObjs = [];

window.onYouTubeIframeAPIReady = () => {
	const playerContainers = document.querySelectorAll('div[id^="player"]');


	playerContainers.forEach((container) => {
		const videoId = container.id.slice(7);

		playersObjs.push(new YT.Player(container.id, {
			height: '200',
			width: '100',
			videoId,
			playerVars: {
				'playsinline': 1
			}
		}))
	})
}

const play = () => {
	playersObjs.forEach((player) => {
		player.playVideo();
	})
}

const stop = () => {
	playersObjs.forEach((player) => {
		player.stopVideo();
	})
}










