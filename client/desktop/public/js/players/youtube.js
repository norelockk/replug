(function () {
  /**
   * Class constructor
   * @name Class
   *
   * @function
   * @param {Function} _class - main class function
   * @param {String|Function} [_type] - class type ('static' or 'singleton') or static function
   * @param {Function} [_static] - static function if type is passed through, useful for 'singleton' type
   */
  window.Class = function (_class, _type, _static) {
    const _this = this || window;

    // Function.name ie12+ only
    const _name = _class.name || _class.toString().match(/function ?([^\(]+)/)[1];

    // Polymorphic if no type passed
    if (typeof _type == 'function') {
      _static = _type;
      _type = null;
    }

    _type = (_type || '').toLowerCase();

    // Instanced Class
    if (!_type) {
      _this[_name] = _class;

      // Initiate static function if passed through
      _static && _static();
    } else {

      // Static Class
      if (_type == 'static') {
        _this[_name] = new _class();

        // Singleton Class
      } else if (_type == 'singleton') {
        _this[_name] = _class;

        (function () {
          let _instance;

          _this[_name].instance = function (a, b, c) {
            if (!_instance) _instance = new _class(a, b, c);
            return _instance;
          };
        })();

        // Initiate static function if passed through
        _static && _static();
      }
    }

    // Giving namespace classes reference to namespace
    if (this && this !== window) this[_name]._namespace = this.__namespace;
  };

  /**
   * Object to attach global properties
   * @name window.Global
   */
  window.Global = {};

  Global.Origin = window.location.origin;

  /**
   * Utils
   */
  Global.Utils = {};

  Global.Utils.isStringURL = function (str) {
    const Pattern = /^(https?:\/\/)?([a-zA-Z0-9.-]+\.[a-zA-Z]{2,6})(\/[^\s]*)?$/;

    return Pattern.test(str);
  };

  /**
   * Require dependency
   * @name requireDependency
   * 
   * @function
   * @param {String} url
   */
  Global.Dependencies = {};

  window.requireDependency = function (url) {
    if (typeof url !== 'string')
      return null;

    const isURL = Global.Utils.isStringURL(url);

    if (isURL) {
      if (!(url in Global.Dependencies)) {
        // Create an dependency script
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = url;

        // Add dependency to object list
        Global.Dependencies[url] = script;

        // Insert dependency before the our script
        const firstScript = document.getElementsByTagName('script')[0];
        firstScript.parentNode.insertBefore(script, firstScript);

        return firstScript;
      }

      // Dependency is already inserted so we don't need them anymore
      return false;
    }

    return null;
  };

  /**
   * @copyright (c) dreamy.codes 2023
   * @description Module for YouTube player
   * @example Usage of Module
   * 
   * const iframe = document.getElementById('dyt_iframe');
   * if (iframe) {
   *  iframe.contentWindow.postMessage(
   *    JSON.stringify(
   *      {
   *        data: {
   *          id: '<video id>',
   *          volume: 100 (or 'storage', so it loads from storage),
   *          seek: 0
   *        },
   *        action: 'load'
   *      }
   *    ),
   *    window.location.origin
   *  );
   *  window.addEventListener('message', this.handler, false);
   */

  // modules/DreamyStorage.js
  Class(
    function DreamyStorage() {
      // Vars
      this.ls = window.localStorage;
      this.prefix = 'dreamy.ytp';

      // Storage functions
      this.get = function (key) {
        const content = this.ls.getItem(this.prefix + ':' + key);

        if (typeof content == 'string')
          return content;

        return null;
      }

      this.set = function (key, value) {
        value = String(value);

        const content = this.ls.getItem(this.prefix + ':' + key);

        if (typeof content == 'string') {
          if (content == value)
            return false;

          this.ls.setItem(this.prefix + ':' + key, value);
        } else this.ls.setItem(this.prefix + ':' + key, value);
      }

      this.__init__ = function () {
        const setup = {
          muted: false,
          volume: 100
        }

        for (const [key, value] of Object.entries(setup)) {
          const alreadyExists = this.get(key) !== null;
          if (alreadyExists)
            continue;

          this.set(key, String(value));
        }
      }

      this.__init__();
    }
  );

  // modules/YTPlayer.js
  Class(
    function YTPlayer() {
      // Vars
      this.data = undefined;
      this.player = undefined;
      this.source = undefined;
      this.script = undefined;
      this.storage = new DreamyStorage();

      // YouTube player events
      this.events = {
        onReady: (function (event) {
          if (this.player && this.source) {
            const volume = typeof this.data.volume == 'string' && this.data.volume == 'storage' ?
              Boolean(this.storage.get('muted')) || this.storage.get('volume') == 0 ?
                0 : this.storage.get('volume') : this.data.volume;

            this.player.setVolume(volume);
            this.source.postMessage('yt:ready', Global.Origin);

            event.target.playVideo();
          }
        }).bind(this),
        onError: (function (event) {
          this.source && this.source.postMessage('yt:error=' + event.data, Global.Origin);
        }).bind(this),
        onStateChange: (function (event) {
          console.log('state changed', event.data);

          if (this.player && this.source) {
            const state = event.data;

            if (this.last_state !== YTPlayer.States[state]) {
              if (
                (state == YTPlayer.States[2] || (state == YTPlayer.States[5] && this.last_state == YTPlayer.States[1])) &&
                this.player.getDuration() - this.player.getCurrentTime() > 2
              ) {
                setTimeout(this.player.playVideo, 10);
                this.source.postMessage('yt:ready', Global.Origin);
              }

              if (state == YTPlayer.States[0]) this.source.postMessage('yt:ended', Global.Origin);

              this.last_state = YTPlayer.States[state];
            }
          }
        }).bind(this)
      };

      // YouTube player settings
      this.settings = {
        width: '100%',
        height: '100%',
        events: this.events
      };

      // Function to load new player data
      this.loadPlayerData = function () {
        if (!this.player && typeof this.script == 'undefined') {
          // Load YouTube IFrame API
          this.script = requireDependency(window.location.protocol + '//www.youtube.com/iframe_api');
          return;
        }

        this.player && this.player.loadByVideoId({
          ...this.settings,
          videoId: this.data ? typeof this.data.id == 'string' ? this.data.id : 'QGsPhLVAdlw' : 'QGsPhLVAdlw',
          playerVars: {
            start: this.data ? this.data.seek || 0 : 0,
            ...YTPlayer.Variables
          }
        });
      }

      // Communication between application and player functions
      this.listener = function (event) {
        let json;

        try {
          json = JSON.parse(event.data);
        } catch (e) {
          throw 'Player did not handle the message because it is not a JSON';
        }

        if (json && typeof json == 'object') {
          if (json.action) {
            if (typeof this.source == 'undefined' || this.source !== event.source)
              this.source = event.source;
          }

          switch (json.action) {
            // Load the player or reload it by another video ID
            case 'load': {
              this.data = json.data;

              // Load player
              this.loadPlayerData();
              break;
            }
            // Play the player video
            case 'play': {
              this.player && this.player.playVideo();
              break;
            }
            // Pause/stop player video
            case 'stop': {
              this.player && this.player.stopVideo();
              break;
            }
            // Unmute player
            case 'unmute': {
              this.player && this.player.unMute();
              break;
            }
            // Check player duration
            case 'duration': {
              this.player && this.source && this.source.postMessage('yt:duration=' + this.player.getDuration(), Global.Origin);
              break;
            }
            // Set player volume
            case 'setVolume': {
              const volume = typeof json.data.volume == 'string' && json.data.volume == 'storage' ?
                Boolean(this.storage.get('muted')) || this.storage.get('volume') == 0 ?
                  0 : this.storage.get('volume') : json.data.volume;

              this.player && this.player.setVolume(volume);
              break;
            }
          }
        }
      }

      window.addEventListener('message', this.listener.bind(this), false);
    },
    () => {
      // YouTube player states
      YTPlayer.States = {};

      YTPlayer.States[5] = 5; // CUED
      YTPlayer.States[0] = 0; // ENDED
      YTPlayer.States[2] = 2; // PAUSED
      YTPlayer.States[1] = 1; // PLAYING
      YTPlayer.States[3] = 3; // BUFFERING
      YTPlayer.States[-1] = -1; // UNSTARTED

      // YouTube player variables
      YTPlayer.Variables = {};

      YTPlayer.Variables.hd = 1;
      YTPlayer.Variables.rel = 0;
      YTPlayer.Variables.html5 = 1;
      YTPlayer.Variables.border = 0;
      YTPlayer.Variables.origin = Global.Origin;
      YTPlayer.Variables.showinfo = 0;
      YTPlayer.Variables.controls = 0;
      YTPlayer.Variables.autoplay = 1;
      YTPlayer.Variables.disablekb = 1;
      YTPlayer.Variables.showsearch = 0;
      YTPlayer.Variables.playerapiid = 'player';
      YTPlayer.Variables.enablejsapi = 1;
      YTPlayer.Variables.frameborder = 0;
      YTPlayer.Variables.playsinline = 1;
      YTPlayer.Variables.cc_load_policy = 0;
      YTPlayer.Variables.iv_load_policy = 3;
      YTPlayer.Variables.modestbranding = 1;
    }
  );

  const init = () => {
    const p = new YTPlayer();

    // Set global function to load YouTube Player by IFrame API
    window.onYouTubeIframeAPIReady = function () {
      if (p.player && p.player instanceof YT.Player) return;

      p.player = new YT.Player('player', {
        ...p.settings,
        events: p.events,
        videoId: p.data ? typeof p.data.id == 'string' ? p.data.id : 'QGsPhLVAdlw' : 'QGsPhLVAdlw',
        playerVars: {
          start: p.data ? p.data.seek || 0 : 0,
          ...YTPlayer.Variables
        }
      });
    }

    // Prototype of algorithm to sync players between clients
    const trackDuration = 220.021 * 1000; // Track duration in ms
    console.log(trackDuration);

    const startTime = Date.now();
    console.log('Track started at', new Date(startTime).toLocaleTimeString());
    
    const calculate = () => {
      const now = Date.now();
      const elapsedTime = now - startTime;
      const remainingTime = trackDuration - elapsedTime;
    
      console.log('Elapsed time:', ~~(elapsedTime / 1000), 's');
      console.log('Remaining time:', ~~(remainingTime / 1000), 's');
    
      if (remainingTime <= 0) {
        console.log('Track has ended');
      } else {
        console.log('Track ends in', remainingTime, 'ms');
      }
    };
    
    calculate();
    setInterval(calculate, 1000);
  };

  window.onload = init;
})();