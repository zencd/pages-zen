// https://developers.google.com/youtube/iframe_api_reference
// https://developers.google.com/youtube/player_parameters
function YoutubeSinglePlayer(videoElem) {
    const SMOOTH_STEP = 10
    const SMOOTH_PAUSE = 30
    const yspThis = this;
    this.player = null;
    this.playing = false;
    this.onPlayerObjectCreated = null;
    this.onReady = null;
    this.onStateChange = null;
    this.onPlaying = null;
    this.onPaused = null;
    this.onEnded = null;
    this.timeOffset = 0;
    this.loadById = function (videoId, timeOffset, newYoutubeScriptId) {
        function onYouTubeIframeAPIReady() {
            console.log('onYouTubeIframeAPIReady')
            const playerVars = {
                autoplay: 1,
                start: timeOffset, // has no effect :|
            }
            yspThis.player = new window.YT.Player(videoElem, {
                videoId: videoId,
                events: {
                    'onReady': function () {
                        yspThis.player.setVolume(0);
                    },
                    'onStateChange': onStateChange,
                },
                playerVars: playerVars
            });
            //console.log('seekTo', timeOffset)
            //yspThis.player.seekTo(timeOffset)
        }

        yspThis.timeOffset = timeOffset
        //console.log('loadById', 'timeOffset', timeOffset)
        if (yspThis.player) {
            //console.log('case 1');
            // console.log('player.loadVideoById', yspThis.player.loadVideoById);
            yspThis.player.loadVideoById(videoId);
        } else if (typeof window.YT !== 'undefined') {
            // YT code maybe loaded already (by some other code)
            // so the callback won't be invoked - do it manually
            //console.log('case 2');
            // console.log('window.YT', window.YT);
            onYouTubeIframeAPIReady();
            // XXX implicitly loading video is not needed because of 1) autoplay 2) method `loadVideoById` binds later
            // yspThis.player.loadVideoById(videoId);
        } else {
            //console.log('case 3');
            if (!window.onYouTubeIframeAPIReady) { // this if can be removed
                // console.log('setting window.onYouTubeIframeAPIReady');
                // console.log('  existing window.onYouTubeIframeAPIReady:', window.onYouTubeIframeAPIReady);
                // console.log('  existing window.YT', typeof window.YT);
                window.onYouTubeIframeAPIReady = onYouTubeIframeAPIReady;
            }

            const youtubeScript = document.getElementById(newYoutubeScriptId);
            if (youtubeScript === null) {
                const tag = document.createElement('script');
                const firstScript = document.getElementsByTagName('script')[0];
                tag.src = 'https://www.youtube.com/iframe_api';
                tag.id = newYoutubeScriptId;
                firstScript.parentNode.insertBefore(tag, firstScript);
            }
        }
    };

    this.seekTo = function(t, comment) {
        //console.log("seekTo", t, comment);
        //console.trace();
        this.player.seekTo(t);
    }

    this.isPlaying = function() {
        return this.player && this.player.playerInfo.playerState == 1
    }

    this.getState = function() {
        return this.player ? this.player.playerInfo.playerState : -1
    }

    this.getVideoUrl = function() {
        return this.player ? this.player.getVideoUrl() : null
    }

    function onStateChange(event) {
        if (event.data === YT.PlayerState.PLAYING) {
            const timeOffset = yspThis.timeOffset
            yspThis.timeOffset = 0
            if (timeOffset) {
                yspThis.seekTo(timeOffset, "onStateChange"); // 2
                yspThis.player.setVolume(100)
            } else {
                yspThis.player.setVolume(100)
            }
            if (yspThis.onPlaying) {
                yspThis.onPlaying(event)
            }
        } else if (event.data === YT.PlayerState.PAUSED) {
            if (yspThis.onPaused) {
                yspThis.onPaused(event)
            }
        } else if (event.data === YT.PlayerState.ENDED) {
            if (yspThis.onEnded) {
                yspThis.onEnded(event)
            }
        }
    }

    this.play = function() {
        const player = yspThis.player
        function impl(from, to) {
            from += SMOOTH_STEP
            //console.log('volume', from)
            player.setVolume(from)
            if (from < to) {
                setTimeout(function() { impl(from, to) }, SMOOTH_PAUSE)
            }
        }
        yspThis.playing = true;
        impl(0, 100)
        player.playVideo()
    };

    this.pause = function() {
        pauseOrPause('pause')
    };

    this.stop = function() {
        pauseOrPause('stop')
    };

    function pauseOrPause(action) {
        const player = yspThis.player
        function impl(from, to) {
            from -= SMOOTH_STEP
            //console.log('volume', from)
            player.setVolume(from)
            if (from > to) {
                setTimeout(function() { impl(from, to) }, SMOOTH_PAUSE)
            } else {
                if (action === 'pause') {
                    player.pauseVideo();
                } else {
                    player.stopVideo();
                }
            }
        }
        yspThis.playing = false;
        impl(100, 0)
    };

    return this;
}
