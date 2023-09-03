(function() {
  const PLAYER_NAMESPACE = 'codes.dreamy.replug.players.youtube';

  const PLAYER_STATES = {
    [0]: 'ENDED',
    [2]: 'PAUSED',
    [1]: 'PLAYING',
    [3]: 'BUFFERING',
    [5]: 'CUED',
    [-1]: 'UNSTARTED',
  };

  const getCurrentTimestamp = () => new Date().toISOString();

  const LOG_LEVELS = {
    INFO: 'INFO',
    DEBUG: 'DEBUG',
    ERROR: 'ERROR',
    WARNING: 'WARNING',
  };
  
  const log = (level, ...message) => {
    const timestamp = getCurrentTimestamp();

    console.log(`[${timestamp}] [${level}] [${PLAYER_NAMESPACE}]`, ...message);
  };

  const ready = () => {
    source.postMessage(
      JSON.stringify({
        ready: true
      }),
      window.location.origin
    );

    log(LOG_LEVELS.INFO, 'Player is ready', data);
  };

  const playerReady = event => {
    player.setVolume(data.volume);
    event.target.playVideo();

    ready();
  };

  const playerError = event => {
    source.postMessage(
      JSON.stringify({
        error: true,
        details: event.data
      }),
      window.location.origin
    );
    
    log(LOG_LEVELS.ERROR, 'Player error', event.data);
  };

  const playerStateChange = event => {
    if (!player) return;

    const state = event.data;

    if (this.lastState !== state) {
      if (
        (state === 2 || (state === 5 && this.lastState === 1)) &&
        player.getDuration() - player.getCurrentTime() > 2
      ) {
        setTimeout(player.playVideo, 10);

        ready();
      } else if (state === 0) {
        source.postMessage(
          JSON.stringify({
            ended: true
          }),
          window.location.origin
        );
      }

      log(LOG_LEVELS.DEBUG, 'Player state changed from', PLAYER_STATES[this.lastState], 'to', PLAYER_STATES[state]);
      this.lastState = state;
    }
  };

  const playerLoad = () => {
    if (typeof script === 'undefined') {
      const iscript = document.createElement('script');
      iscript.src = '//www.youtube.com/iframe_api';

      const first = document.getElementsByTagName('script')[0];
      first.parentNode.insertBefore(iscript, first);

      script = first;

      log(LOG_LEVELS.INFO, 'Preparing player script');
    } else {
      if (player) {
        player.loadVideoById({
          width: '100%',
          height: '100%',
          events: playerEvents,
          videoId: data.id,
          playerVars: {
            hd: 1,
            rel: 0,
            start: data.seek,
            border: 0,
            origin: window.location.origin,
            autoplay: 1,
            controls: 0,
            showinfo: 0,
            disablekb: 1,
            playerapiid: 'player',
            playsinline: 1,
            enablejsapi: 1,
            frameborder: 0,
            modestbranding: 1,
            iv_load_policy: 3,
            cc_load_policy: 0,
          },
          startSeconds: data.seek,
        });

        ready();

        log(LOG_LEVELS.DEBUG, 'Player loaded data', data);
      }
    }
  };

  const playerEvents = {
    onReady: playerReady,
    onError: playerError,
    onStateChange: playerStateChange
  };

  const message = event => {
    let json;

    try {
      json = JSON.parse(event.data);
    } catch (e) {
      throw e;
    }

    if (json && typeof json === 'object') {
      switch (json.action) {
        case 'load': {
          source = event.source;

          if (json.data) {
            data = json.data;
            playerLoad();
          }
          break;
        }
        case 'play': {
          if (player) player.playVideo();
          break;
        }
        case 'stop': {
          if (player) player.stopVideo();
          break;
        }
        case 'unmute': {
          if (player) player.unMute();
          break;
        }
        case 'setVolume': {
          if (player) player.setVolume(player.data.volume);
          break;
        }
        case 'checkDuration': {
          source.postMessage(
            JSON.stringify({
              duration: player.getDuration()
            }),
            window.location.origin
          );
          break;
        }
        default: if (json.action) return log(LOG_LEVELS.ERROR, 'Unknown message', json);
      }
    }
  };

  let data, player, source, script;

  window.onYouTubeIframeAPIReady = () => {
    player = new YT.Player('player', {
      width: '100%',
      height: '100%',
      events: playerEvents,
      videoId: data.id,
      playerVars: {
        hd: 1,
        rel: 0,
        html5: 1,
        start: data.seek,
        border: 0,
        origin: window.location.origin,
        showinfo: 0,
        controls: 0,
        autoplay: 1,
        disablekb: 1,
        showsearch: 0,
        playerapiid: 'player',
        enablejsapi: 1,
        frameborder: 0,
        playsinline: 1,
        cc_load_policy: 0,
        iv_load_policy: 3,
        modestbranding: 1,
      },
    });

    log(LOG_LEVELS.DEBUG, 'Player created');
  };

  window.addEventListener('message', message, false);
})();
