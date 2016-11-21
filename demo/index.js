(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

var _wtcHistory = require("../src/wtc-history");

var _wtcHistory2 = _interopRequireDefault(_wtcHistory);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Initialise the history object in dev mode
_wtcHistory2.default.init(true);

window.Historyobj = _wtcHistory2.default;

},{"../src/wtc-history":2}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Class represenging an abstraction of the history API.
 * @static
 * @namespace
 */
var History = function () {
  function History() {
    _classCallCheck(this, History);
  }

  _createClass(History, null, [{
    key: 'init',


    /**
     * Public methods
     */

    /**
      * Initialises the History class. Nothing should be able to
      * operate here unless this has run with a support = true.
      *
      * @Public
      * @return {boolean}         Returns whether init ran or not
      */
    value: function init() {
      var _this = this;

      var devmode = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

      if (this.support) {
        // Try to set everything up, and if we fail then return false
        try {
          window.addEventListener('popstate', function (e) {
            var hasPoppedState = _this._popstate(e);
            return hasPoppedState;
          });

          this.devmode = devmode;
        } catch (e) {

          // If we're in devmode, send our console output
          if (this.devmode) {
            console.warn('error in history initialisation');
            console.log(e);
          }

          return false;
        }

        this.initialised = true;
        return true;
      }

      return false;
    }

    /**
     * Construct and push a URL state
     *
     * @public
     * @param  {string} URL           The URL to push, can be relative, absolute or full
     * @param  {string} title         The title to push.
     * @param  {object} stateObj      A state to push to the stack. This will be popped when naviagting back
     * @return {boolean}              Indicates whether the push succeeded
     */

  }, {
    key: 'push',
    value: function push(URL) {
      var title = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
      var stateObj = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};


      var parsedURL = '';

      // First try to fix the URL
      try {
        parsedURL = this._fixURL(URL, true, true);
      } catch (e) {
        if (this.devmode) {
          console.warn('push failed while trying to fix the URL');
          console.log(e);
        }
        return false;
      }

      // If we have API support, push the state to the history object
      if (this.support) {
        try {
          this.history.pushState(stateObj, title, parsedURL);
        } catch (e) {
          if (this.devmode) {
            console.warn('push failed while trying to push the state to the history object');
            console.log(e);
          }
          return false;
        }
        // Otherwiser, add the URL as a hashbang
      } else {
        window.location.hash = '#!' + URL;
      }

      return true;
    }

    /**
     * Takes the user back to the previous state. Simply wraps the history object's back method.
     *
     * @public
     */

  }, {
    key: 'back',
    value: function back() {
      this.history.back();
    }

    /**
     * Takes the user forward to the next state. Simply wraps the history object's forward method.
     *
     * @public
     */

  }, {
    key: 'forward',
    value: function forward() {
      this.history.forward();
    }

    /**
     * Private methods
     */

    /**
     * Takes a provided URL and returns the version that is usable
     *
     * @private
     * @param  {string} URL                     The URL to be passed
     * @param  {boolean} includeDocRoot = true  Whether to include the docroot on the passed URL
     * @param  {boolean} includeTrails = true   Whether to include found hashes and params
     * @return {string}                         The passed and formatted URL
     */

  }, {
    key: '_fixURL',
    value: function _fixURL(URL) {
      var includeDocRoot = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
      var includeTrails = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;


      var rtnURL;

      /**
       * URL Regex works like this:
       * ```
          ^
          ([^:]+://           # HTTP(S) etc.
              ([^/]+)         # The URL (if available)
          )?
          (#{@documentRoot})? # The document root, which we want to get rid of
          (/)?                # check for the presence of a leading slash
          ([^\#\?]*)          # The URI - this is what we care about. Check for everything except for # and ?
          (\?[^\#]*)?         # any additional URL parameters (optional)
          (\#\!?.+)?          # Any hashbang trailers (optional)
       * ```
       */
      var URLRegex = RegExp('^([^:]+://([^/]+))?(' + this.documentRoot + ')?(/)?([^\\#\\?]*)(\\?[^\\#]*)?(\\#\\!?.+)?');

      var _URLRegex$exec = URLRegex.exec(URL),
          _URLRegex$exec2 = _slicedToArray(_URLRegex$exec, 8),
          input = _URLRegex$exec2[0],
          href = _URLRegex$exec2[1],
          hostname = _URLRegex$exec2[2],
          documentRoot = _URLRegex$exec2[3],
          root = _URLRegex$exec2[4],
          path = _URLRegex$exec2[5],
          params = _URLRegex$exec2[6],
          hashbang = _URLRegex$exec2[7];

      // If we're observing the TLDN restraint and the provided URL doesn't match
      // the domain's TLDN, throw a URIError


      if (typeof hostname === 'string' && hostname !== this.TLDN && this.observeTLDN === true) {
        throw new URIError('Top Level domain name MUST match the primary domain name');
      }

      // If our matched URL has a leading slash, then we want to drop the docRoot
      // in there unless the function param "includeDocRoot" is false.
      if (typeof root === 'string' && root === '/' || typeof documentRoot === 'string' && documentRoot === this.documentRoot) {
        if (includeDocRoot) {
          rtnURL = '' + this.documentRoot + path;
        } else {
          rtnURL = '/' + path;
        }
        // Else if path has resulted in an empty string, assume the path is the root
      } else if (path === '') {
        rtnURL = '/';
        // Otherwise, just pass the path completely.
      } else {
        rtnURL = path;
      }

      // If we want to include trails (hashes and params, as determined by a
      // funciton param), then add them to the URL.
      if (includeTrails) {
        // Append any params
        if (typeof params == 'string') {
          rtnURL += params;
        }
        // Append any hashes
        if (typeof hashbang == 'string') {
          rtnURL += hashbang;
        }
      }

      return rtnURL;
    }

    /**
     * Listener for the popstate method
     *
     * @private
     * @param  {object} e the passed event object
     * @return void
     */

  }, {
    key: '_popstate',
    value: function _popstate(e) {
      var base, state;
      console.log(e);
      if (this.support) {
        state = (base = this.history).state || (base.state = e.state || (e.state = window.event.state));
        console.log(state);
        return true;
      }
      return false;
    }

    /**
     * Getters and setters
     */

    /**
     * (getter/setter) Sets the document root from a passed URL
     * returns the saved document root or a `/` if not set
     *
     * @default '/'
     * @type {string}
     */

  }, {
    key: 'documentRoot',
    set: function set() {
      var documentRoot = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';


      /**
       * docrootRegex works like this:
       * ```
           ^
           ([^:]+://       # HTTP(S) etc.
               ([^/]+)     # The hostname (if available)
           )?
           /?
           (.*(?=/))?      # the URI to use as the docroot less any available trailing slash
       * ```
       */
      var docrootRegex = /^([^:]+:\/\/([^\/]+))?\/?(.*(?=\/))?/;
      // pass the docroot and hostname

      var _docrootRegex$exec = docrootRegex.exec(documentRoot),
          _docrootRegex$exec2 = _slicedToArray(_docrootRegex$exec, 4),
          _1 = _docrootRegex$exec2[0],
          _2 = _docrootRegex$exec2[1],
          hostname = _docrootRegex$exec2[2],
          docroot = _docrootRegex$exec2[3];

      // Error check
      // check for the presence of the reported TLDN


      if (typeof hostname === 'string' && hostname != this.TLDN && this.observeTLDN === true) {
        throw new URIError('Top Level domain name MUST match the primary domain name');
      }

      this._documentRoot = '/' + docroot;
    },
    get: function get() {
      return this._documentRoot || '/';
    }

    /**
     * (getter/setter) Provides an error if the user tries to set the history object
     * returns the window history object
     *
     * @type {object}
     */

  }, {
    key: 'history',
    set: function set(history) {
      throw new Error('The history object is read only');
    },
    get: function get() {
      return window.history;
    }

    /**
     * (getter/setter) Sets the top level domain name.
     * returns the recorded TLDN or, by default, window.location.hostname.
     *
     * @type {string}
     */

  }, {
    key: 'TLDN',
    set: function set(TLDN) {
      // @note We should include some error checking in here
      this._TLDN = TLDN;
    },
    get: function get() {
      return this._TLDN || window.location.hostname;
    }

    /**
     * (getter/setter) whether to observe the TLDN or `true` (default).
     *
     * @default true
     * @type {boolean}
     */

  }, {
    key: 'observeTLDN',
    set: function set(observe) {
      // Check to make sure that the bassed value is of type boolean.
      if (typeof observe === 'boolean') {
        this._observeTLDN = observe;
      } else {
        console.warn('observeTLDN must be of type boolean');
      }
    },
    get: function get() {
      if (typeof this._observeTLDN === 'boolean') {
        return this._observeTLDN;
      } else {
        return true;
      }
    }

    /**
     * (getter/setter) Whether this history object is in devmode. Defaults to false
     *
     * @default false
     * @type {boolean}
     */

  }, {
    key: 'devmode',
    set: function set(devmode) {
      // Check to make sure that the bassed value is of type boolean.
      if (typeof devmode === 'boolean') {
        this._devmode = devmode;
      } else {
        console.warn('devmode must be of type boolean');
      }
    },
    get: function get() {
      if (typeof this._devmode === 'boolean') {
        return this._devmode;
      } else {
        return false;
      }
    }

    /**
     * (getter/setter) Whether this history object is initialiased.
     *
     * @default false
     * @type {boolean}
     */

  }, {
    key: 'initialiased',
    set: function set(initialiased) {
      // Check to make sure that the bassed value is of type boolean.
      if (typeof initialiased === 'boolean') {
        this._initialiased = initialiased;
      } else {
        console.warn('initialiased must be of type boolean');
      }
    },
    get: function get() {
      if (typeof this._initialiased === 'boolean') {
        return this._initialiased;
      } else {
        return false;
      }
    }

    /**
     * (getter/setter) Whether history is supported by the browser or device.
     * Provides an error if the user tries to set the support value, unless the object is in devmode
     *
     * @type {boolean}
     */

  }, {
    key: 'support',
    set: function set() {
      var support = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

      // This overrides
      if (this.devmode && typeof support === 'boolean') {
        this._support = support;
      }
      throw new Error('The support is read only');
    },
    get: function get() {
      return window.history && window.history.pushState;
    }

    /**
     * (getter/setter) The length of the history stack
     *
     * @type {integer}
     */

  }, {
    key: 'length',
    get: function get() {
      return this.history.length;
    }
  }]);

  return History;
}();

exports.default = History;

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJkZW1vL3J1bi5qcyIsInNyYy93dGMtaGlzdG9yeS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0FDQUE7Ozs7OztBQUVBO0FBQ0EscUJBQVEsSUFBUixDQUFhLElBQWI7O0FBRUEsT0FBTyxVQUFQOzs7Ozs7Ozs7Ozs7Ozs7QUNMQTs7Ozs7SUFLTSxPOzs7Ozs7Ozs7QUFFSjs7OztBQUlBOzs7Ozs7OzJCQU82QjtBQUFBOztBQUFBLFVBQWpCLE9BQWlCLHVFQUFQLEtBQU87O0FBQzNCLFVBQUcsS0FBSyxPQUFSLEVBQ0E7QUFDRTtBQUNBLFlBQUk7QUFDRixpQkFBTyxnQkFBUCxDQUF3QixVQUF4QixFQUFvQyxVQUFDLENBQUQsRUFBTTtBQUN4QyxnQkFBSSxpQkFBaUIsTUFBSyxTQUFMLENBQWUsQ0FBZixDQUFyQjtBQUNBLG1CQUFPLGNBQVA7QUFDRCxXQUhEOztBQUtBLGVBQUssT0FBTCxHQUFvQixPQUFwQjtBQUVELFNBUkQsQ0FRRSxPQUFPLENBQVAsRUFBVTs7QUFFVjtBQUNBLGNBQUcsS0FBSyxPQUFSLEVBQWlCO0FBQ2Ysb0JBQVEsSUFBUixDQUFhLGlDQUFiO0FBQ0Esb0JBQVEsR0FBUixDQUFZLENBQVo7QUFDRDs7QUFFRCxpQkFBTyxLQUFQO0FBQ0Q7O0FBRUQsYUFBSyxXQUFMLEdBQW1CLElBQW5CO0FBQ0EsZUFBTyxJQUFQO0FBQ0Q7O0FBRUQsYUFBTyxLQUFQO0FBQ0Q7O0FBRUQ7Ozs7Ozs7Ozs7Ozt5QkFTWSxHLEVBQWdDO0FBQUEsVUFBM0IsS0FBMkIsdUVBQW5CLEVBQW1CO0FBQUEsVUFBZixRQUFlLHVFQUFKLEVBQUk7OztBQUUxQyxVQUFJLFlBQVksRUFBaEI7O0FBRUE7QUFDQSxVQUFJO0FBQ0Ysb0JBQVksS0FBSyxPQUFMLENBQWEsR0FBYixFQUFrQixJQUFsQixFQUF3QixJQUF4QixDQUFaO0FBQ0QsT0FGRCxDQUVFLE9BQU8sQ0FBUCxF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LE8iLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiaW1wb3J0IEhpc3RvcnkgZnJvbSBcIi4uL3NyYy93dGMtaGlzdG9yeVwiO1xuXG4vLyBJbml0aWFsaXNlIHRoZSBoaXN0b3J5IG9iamVjdCBpbiBkZXYgbW9kZVxuSGlzdG9yeS5pbml0KHRydWUpO1xuXG53aW5kb3cuSGlzdG9yeW9iaiA9IEhpc3Rvcnk7XG4iLCIvKipcbiAqIENsYXNzIHJlcHJlc2VuZ2luZyBhbiBhYnN0cmFjdGlvbiBvZiB0aGUgaGlzdG9yeSBBUEkuXG4gKiBAc3RhdGljXG4gKiBAbmFtZXNwYWNlXG4gKi9cbmNsYXNzIEhpc3Rvcnkge1xuXG4gIC8qKlxuICAgKiBQdWJsaWMgbWV0aG9kc1xuICAgKi9cblxuICAvKipcbiAgICAqIEluaXRpYWxpc2VzIHRoZSBIaXN0b3J5IGNsYXNzLiBOb3RoaW5nIHNob3VsZCBiZSBhYmxlIHRvXG4gICAgKiBvcGVyYXRlIGhlcmUgdW5sZXNzIHRoaXMgaGFzIHJ1biB3aXRoIGEgc3VwcG9ydCA9IHRydWUuXG4gICAgKlxuICAgICogQFB1YmxpY1xuICAgICogQHJldHVybiB7Ym9vbGVhbn0gICAgICAgICBSZXR1cm5zIHdoZXRoZXIgaW5pdCByYW4gb3Igbm90XG4gICAgKi9cbiAgc3RhdGljIGluaXQoZGV2bW9kZSA9IGZhbHNlKSB7XG4gICAgaWYodGhpcy5zdXBwb3J0KVxuICAgIHtcbiAgICAgIC8vIFRyeSB0byBzZXQgZXZlcnl0aGluZyB1cCwgYW5kIGlmIHdlIGZhaWwgdGhlbiByZXR1cm4gZmFsc2VcbiAgICAgIHRyeSB7XG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdwb3BzdGF0ZScsIChlKT0+IHtcbiAgICAgICAgICB2YXIgaGFzUG9wcGVkU3RhdGUgPSB0aGlzLl9wb3BzdGF0ZShlKTtcbiAgICAgICAgICByZXR1cm4gaGFzUG9wcGVkU3RhdGU7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMuZGV2bW9kZSAgICAgID0gZGV2bW9kZTtcblxuICAgICAgfSBjYXRjaCAoZSkge1xuXG4gICAgICAgIC8vIElmIHdlJ3JlIGluIGRldm1vZGUsIHNlbmQgb3VyIGNvbnNvbGUgb3V0cHV0XG4gICAgICAgIGlmKHRoaXMuZGV2bW9kZSkge1xuICAgICAgICAgIGNvbnNvbGUud2FybignZXJyb3IgaW4gaGlzdG9yeSBpbml0aWFsaXNhdGlvbicpO1xuICAgICAgICAgIGNvbnNvbGUubG9nKGUpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuXG4gICAgICB0aGlzLmluaXRpYWxpc2VkID0gdHJ1ZTtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDb25zdHJ1Y3QgYW5kIHB1c2ggYSBVUkwgc3RhdGVcbiAgICpcbiAgICogQHB1YmxpY1xuICAgKiBAcGFyYW0gIHtzdHJpbmd9IFVSTCAgICAgICAgICAgVGhlIFVSTCB0byBwdXNoLCBjYW4gYmUgcmVsYXRpdmUsIGFic29sdXRlIG9yIGZ1bGxcbiAgICogQHBhcmFtICB7c3RyaW5nfSB0aXRsZSAgICAgICAgIFRoZSB0aXRsZSB0byBwdXNoLlxuICAgKiBAcGFyYW0gIHtvYmplY3R9IHN0YXRlT2JqICAgICAgQSBzdGF0ZSB0byBwdXNoIHRvIHRoZSBzdGFjay4gVGhpcyB3aWxsIGJlIHBvcHBlZCB3aGVuIG5hdmlhZ3RpbmcgYmFja1xuICAgKiBAcmV0dXJuIHtib29sZWFufSAgICAgICAgICAgICAgSW5kaWNhdGVzIHdoZXRoZXIgdGhlIHB1c2ggc3VjY2VlZGVkXG4gICAqL1xuICBzdGF0aWMgcHVzaChVUkwsIHRpdGxlID0gJycsIHN0YXRlT2JqID0ge30pIHtcblxuICAgIHZhciBwYXJzZWRVUkwgPSAnJztcblxuICAgIC8vIEZpcnN0IHRyeSB0byBmaXggdGhlIFVSTFxuICAgIHRyeSB7XG4gICAgICBwYXJzZWRVUkwgPSB0aGlzLl9maXhVUkwoVVJMLCB0cnVlLCB0cnVlKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICBpZih0aGlzLmRldm1vZGUpIHtcbiAgICAgICAgY29uc29sZS53YXJuKCdwdXNoIGZhaWxlZCB3aGlsZSB0cnlpbmcgdG8gZml4IHRoZSBVUkwnKTtcbiAgICAgICAgY29uc29sZS5sb2coZSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gZmFsc2VcbiAgICB9XG5cbiAgICAvLyBJZiB3ZSBoYXZlIEFQSSBzdXBwb3J0LCBwdXNoIHRoZSBzdGF0ZSB0byB0aGUgaGlzdG9yeSBvYmplY3RcbiAgICBpZih0aGlzLnN1cHBvcnQpXG4gICAge1xuICAgICAgdHJ5IHtcbiAgICAgICAgdGhpcy5oaXN0b3J5LnB1c2hTdGF0ZShzdGF0ZU9iaiwgdGl0bGUsIHBhcnNlZFVSTCk7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGlmKHRoaXMuZGV2bW9kZSkge1xuICAgICAgICAgIGNvbnNvbGUud2FybigncHVzaCBmYWlsZWQgd2hpbGUgdHJ5aW5nIHRvIHB1c2ggdGhlIHN0YXRlIHRvIHRoZSBoaXN0b3J5IG9iamVjdCcpO1xuICAgICAgICAgIGNvbnNvbGUubG9nKGUpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICAvLyBPdGhlcndpc2VyLCBhZGQgdGhlIFVSTCBhcyBhIGhhc2hiYW5nXG4gICAgfSBlbHNlXG4gICAge1xuICAgICAgd2luZG93LmxvY2F0aW9uLmhhc2ggPSBgIyEke1VSTH1gO1xuICAgIH1cblxuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgLyoqXG4gICAqIFRha2VzIHRoZSB1c2VyIGJhY2sgdG8gdGhlIHByZXZpb3VzIHN0YXRlLiBTaW1wbHkgd3JhcHMgdGhlIGhpc3Rvcnkgb2JqZWN0J3MgYmFjayBtZXRob2QuXG4gICAqXG4gICAqIEBwdWJsaWNcbiAgICovXG4gIHN0YXRpYyBiYWNrKCkge1xuICAgIHRoaXMuaGlzdG9yeS5iYWNrKCk7XG4gIH1cblxuICAvKipcbiAgICogVGFrZXMgdGhlIHVzZXIgZm9yd2FyZCB0byB0aGUgbmV4dCBzdGF0ZS4gU2ltcGx5IHdyYXBzIHRoZSBoaXN0b3J5IG9iamVjdCdzIGZvcndhcmQgbWV0aG9kLlxuICAgKlxuICAgKiBAcHVibGljXG4gICAqL1xuICBzdGF0aWMgZm9yd2FyZCgpIHtcbiAgICB0aGlzLmhpc3RvcnkuZm9yd2FyZCgpO1xuICB9XG5cblxuICAvKipcbiAgICogUHJpdmF0ZSBtZXRob2RzXG4gICAqL1xuXG4gIC8qKlxuICAgKiBUYWtlcyBhIHByb3ZpZGVkIFVSTCBhbmQgcmV0dXJucyB0aGUgdmVyc2lvbiB0aGF0IGlzIHVzYWJsZVxuICAgKlxuICAgKiBAcHJpdmF0ZVxuICAgKiBAcGFyYW0gIHtzdHJpbmd9IFVSTCAgICAgICAgICAgICAgICAgICAgIFRoZSBVUkwgdG8gYmUgcGFzc2VkXG4gICAqIEBwYXJhbSAge2Jvb2xlYW59IGluY2x1ZGVEb2NSb290ID0gdHJ1ZSAgV2hldGhlciB0byBpbmNsdWRlIHRoZSBkb2Nyb290IG9uIHRoZSBwYXNzZWQgVVJMXG4gICAqIEBwYXJhbSAge2Jvb2xlYW59IGluY2x1ZGVUcmFpbHMgPSB0cnVlICAgV2hldGhlciB0byBpbmNsdWRlIGZvdW5kIGhhc2hlcyBhbmQgcGFyYW1zXG4gICAqIEByZXR1cm4ge3N0cmluZ30gICAgICAgICAgICAgICAgICAgICAgICAgVGhlIHBhc3NlZCBhbmQgZm9ybWF0dGVkIFVSTFxuICAgKi9cbiAgc3RhdGljIF9maXhVUkwoVVJMLCBpbmNsdWRlRG9jUm9vdCA9IHRydWUsIGluY2x1ZGVUcmFpbHMgPSB0cnVlKSB7XG5cbiAgICB2YXIgcnRuVVJMO1xuXG4gICAgLyoqXG4gICAgICogVVJMIFJlZ2V4IHdvcmtzIGxpa2UgdGhpczpcbiAgICAgKiBgYGBcbiAgICAgICAgXlxuICAgICAgICAoW146XSs6Ly8gICAgICAgICAgICMgSFRUUChTKSBldGMuXG4gICAgICAgICAgICAoW14vXSspICAgICAgICAgIyBUaGUgVVJMIChpZiBhdmFpbGFibGUpXG4gICAgICAgICk/XG4gICAgICAgICgje0Bkb2N1bWVudFJvb3R9KT8gIyBUaGUgZG9jdW1lbnQgcm9vdCwgd2hpY2ggd2Ugd2FudCB0byBnZXQgcmlkIG9mXG4gICAgICAgICgvKT8gICAgICAgICAgICAgICAgIyBjaGVjayBmb3IgdGhlIHByZXNlbmNlIG9mIGEgbGVhZGluZyBzbGFzaFxuICAgICAgICAoW15cXCNcXD9dKikgICAgICAgICAgIyBUaGUgVVJJIC0gdGhpcyBpcyB3aGF0IHdlIGNhcmUgYWJvdXQuIENoZWNrIGZvciBldmVyeXRoaW5nIGV4Y2VwdCBmb3IgIyBhbmQgP1xuICAgICAgICAoXFw/W15cXCNdKik/ICAgICAgICAgIyBhbnkgYWRkaXRpb25hbCBVUkwgcGFyYW1ldGVycyAob3B0aW9uYWwpXG4gICAgICAgIChcXCNcXCE/LispPyAgICAgICAgICAjIEFueSBoYXNoYmFuZyB0cmFpbGVycyAob3B0aW9uYWwpXG4gICAgICogYGBgXG4gICAgICovXG4gICAgY29uc3QgVVJMUmVnZXggPSBSZWdFeHAoYF4oW146XSs6Ly8oW14vXSspKT8oJHt0aGlzLmRvY3VtZW50Um9vdH0pPygvKT8oW15cXFxcI1xcXFw/XSopKFxcXFw/W15cXFxcI10qKT8oXFxcXCNcXFxcIT8uKyk/YCk7XG4gICAgY29uc3QgW2lucHV0LCBocmVmLCBob3N0bmFtZSwgZG9jdW1lbnRSb290LCByb290LCBwYXRoLCBwYXJhbXMsIGhhc2hiYW5nXSA9IFVSTFJlZ2V4LmV4ZWMoVVJMKTtcblxuICAgIC8vIElmIHdlJ3JlIG9ic2VydmluZyB0aGUgVExETiByZXN0cmFpbnQgYW5kIHRoZSBwcm92aWRlZCBVUkwgZG9lc24ndCBtYXRjaFxuICAgIC8vIHRoZSBkb21haW4ncyBUTEROLCB0aHJvdyBhIFVSSUVycm9yXG4gICAgaWYoIHR5cGVvZiBob3N0bmFtZSA9PT0gJ3N0cmluZycgJiYgaG9zdG5hbWUgIT09IHRoaXMuVExETiAmJiB0aGlzLm9ic2VydmVUTEROID09PSB0cnVlICkge1xuICAgICAgdGhyb3cgbmV3IFVSSUVycm9yKCdUb3AgTGV2ZWwgZG9tYWluIG5hbWUgTVVTVCBtYXRjaCB0aGUgcHJpbWFyeSBkb21haW4gbmFtZScpO1xuICAgIH1cblxuICAgIC8vIElmIG91ciBtYXRjaGVkIFVSTCBoYXMgYSBsZWFkaW5nIHNsYXNoLCB0aGVuIHdlIHdhbnQgdG8gZHJvcCB0aGUgZG9jUm9vdFxuICAgIC8vIGluIHRoZXJlIHVubGVzcyB0aGUgZnVuY3Rpb24gcGFyYW0gXCJpbmNsdWRlRG9jUm9vdFwiIGlzIGZhbHNlLlxuICAgIGlmKFxuICAgICAgKCB0eXBlb2Ygcm9vdCA9PT0gJ3N0cmluZycgJiYgcm9vdCA9PT0gJy8nICkgfHxcbiAgICAgICggdHlwZW9mIGRvY3VtZW50Um9vdCA9PT0gJ3N0cmluZycgJiYgZG9jdW1lbnRSb290ID09PSB0aGlzLmRvY3VtZW50Um9vdCApXG4gICAgKSB7XG4gICAgICBpZiggaW5jbHVkZURvY1Jvb3QgKSB7XG4gICAgICAgIHJ0blVSTCA9IGAke3RoaXMuZG9jdW1lbnRSb290fSR7cGF0aH1gO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcnRuVVJMID0gYC8ke3BhdGh9YDtcbiAgICAgIH1cbiAgICAvLyBFbHNlIGlmIHBhdGggaGFzIHJlc3VsdGVkIGluIGFuIGVtcHR5IHN0cmluZywgYXNzdW1lIHRoZSBwYXRoIGlzIHRoZSByb290XG4gICAgfSBlbHNlIGlmKCBwYXRoID09PSAnJyApIHtcbiAgICAgIHJ0blVSTCA9ICcvJ1xuICAgIC8vIE90aGVyd2lzZSwganVzdCBwYXNzIHRoZSBwYXRoIGNvbXBsZXRlbHkuXG4gICAgfSBlbHNlIHtcbiAgICAgIHJ0blVSTCA9IHBhdGg7XG4gICAgfVxuXG4gICAgLy8gSWYgd2Ugd2FudCB0byBpbmNsdWRlIHRyYWlscyAoaGFzaGVzIGFuZCBwYXJhbXMsIGFzIGRldGVybWluZWQgYnkgYVxuICAgIC8vIGZ1bmNpdG9uIHBhcmFtKSwgdGhlbiBhZGQgdGhlbSB0byB0aGUgVVJMLlxuICAgIGlmKCBpbmNsdWRlVHJhaWxzICkge1xuICAgICAgLy8gQXBwZW5kIGFueSBwYXJhbXNcbiAgICAgIGlmKCB0eXBlb2YgcGFyYW1zID09ICdzdHJpbmcnICkge1xuICAgICAgICBydG5VUkwgKz0gcGFyYW1zO1xuICAgICAgfVxuICAgICAgICAvLyBBcHBlbmQgYW55IGhhc2hlc1xuICAgICAgaWYoIHR5cGVvZiBoYXNoYmFuZyA9PSAnc3RyaW5nJyApIHtcbiAgICAgICAgcnRuVVJMICs9IGhhc2hiYW5nO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBydG5VUkw7XG4gIH1cblxuICAvKipcbiAgICogTGlzdGVuZXIgZm9yIHRoZSBwb3BzdGF0ZSBtZXRob2RcbiAgICpcbiAgICogQHByaXZhdGVcbiAgICogQHBhcmFtICB7b2JqZWN0fSBlIHRoZSBwYXNzZWQgZXZlbnQgb2JqZWN0XG4gICAqIEByZXR1cm4gdm9pZFxuICAgKi9cbiAgc3RhdGljIF9wb3BzdGF0ZShlKSB7XG4gICAgdmFyIGJhc2UsIHN0YXRlO1xuICAgIGNvbnNvbGUubG9nKGUpO1xuICAgIGlmKHRoaXMuc3VwcG9ydClcbiAgICB7XG4gICAgICBzdGF0ZSA9IChiYXNlID0gdGhpcy5oaXN0b3J5KS5zdGF0ZSB8fCAoYmFzZS5zdGF0ZSA9IGUuc3RhdGUgfHwgKGUuc3RhdGUgPSB3aW5kb3cuZXZlbnQuc3RhdGUpKTtcbiAgICAgIGNvbnNvbGUubG9nKHN0YXRlKTtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVycyBhbmQgc2V0dGVyc1xuICAgKi9cblxuICAvKipcbiAgICogKGdldHRlci9zZXR0ZXIpIFNldHMgdGhlIGRvY3VtZW50IHJvb3QgZnJvbSBhIHBhc3NlZCBVUkxcbiAgICogcmV0dXJucyB0aGUgc2F2ZWQgZG9jdW1lbnQgcm9vdCBvciBhIGAvYCBpZiBub3Qgc2V0XG4gICAqXG4gICAqIEBkZWZhdWx0ICcvJ1xuICAgKiBAdHlwZSB7c3RyaW5nfVxuICAgKi9cbiAgc3RhdGljIHNldCBkb2N1bWVudFJvb3QoZG9jdW1lbnRSb290ID0gJycpIHtcblxuICAgIC8qKlxuICAgICAqIGRvY3Jvb3RSZWdleCB3b3JrcyBsaWtlIHRoaXM6XG4gICAgICogYGBgXG4gICAgICAgICBeXG4gICAgICAgICAoW146XSs6Ly8gICAgICAgIyBIVFRQKFMpIGV0Yy5cbiAgICAgICAgICAgICAoW14vXSspICAgICAjIFRoZSBob3N0bmFtZSAoaWYgYXZhaWxhYmxlKVxuICAgICAgICAgKT9cbiAgICAgICAgIC8/XG4gICAgICAgICAoLiooPz0vKSk/ICAgICAgIyB0aGUgVVJJIHRvIHVzZSBhcyB0aGUgZG9jcm9vdCBsZXNzIGFueSBhdmFpbGFibGUgdHJhaWxpbmcgc2xhc2hcbiAgICAgKiBgYGBcbiAgICAgKi9cbiAgICBjb25zdCBkb2Nyb290UmVnZXggPSAvXihbXjpdKzpcXC9cXC8oW15cXC9dKykpP1xcLz8oLiooPz1cXC8pKT8vO1xuICAgIC8vIHBhc3MgdGhlIGRvY3Jvb3QgYW5kIGhvc3RuYW1lXG4gICAgY29uc3QgW18xLCBfMiwgaG9zdG5hbWUsIGRvY3Jvb3RdID0gZG9jcm9vdFJlZ2V4LmV4ZWMoZG9jdW1lbnRSb290KTtcblxuICAgIC8vIEVycm9yIGNoZWNrXG4gICAgLy8gY2hlY2sgZm9yIHRoZSBwcmVzZW5jZSBvZiB0aGUgcmVwb3J0ZWQgVExETlxuICAgIGlmKFxuICAgICAgdHlwZW9mIGhvc3RuYW1lID09PSAnc3RyaW5nJyAmJlxuICAgICAgaG9zdG5hbWUgIT0gdGhpcy5UTEROICYmXG4gICAgICB0aGlzLm9ic2VydmVUTEROID09PSB0cnVlXG4gICAgKSB7XG4gICAgICB0aHJvdyBuZXcgVVJJRXJyb3IoJ1RvcCBMZXZlbCBkb21haW4gbmFtZSBNVVNUIG1hdGNoIHRoZSBwcmltYXJ5IGRvbWFpbiBuYW1lJyk7XG4gICAgfVxuXG4gICAgdGhpcy5fZG9jdW1lbnRSb290ID0gYC8ke2RvY3Jvb3R9YDtcbiAgfVxuICBzdGF0aWMgZ2V0IGRvY3VtZW50Um9vdCgpIHtcbiAgICByZXR1cm4gdGhpcy5fZG9jdW1lbnRSb290IHx8ICcvJztcbiAgfVxuXG4gIC8qKlxuICAgKiAoZ2V0dGVyL3NldHRlcikgUHJvdmlkZXMgYW4gZXJyb3IgaWYgdGhlIHVzZXIgdHJpZXMgdG8gc2V0IHRoZSBoaXN0b3J5IG9iamVjdFxuICAgKiByZXR1cm5zIHRoZSB3aW5kb3cgaGlzdG9yeSBvYmplY3RcbiAgICpcbiAgICogQHR5cGUge29iamVjdH1cbiAgICovXG4gIHN0YXRpYyBzZXQgaGlzdG9yeShoaXN0b3J5KSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdUaGUgaGlzdG9yeSBvYmplY3QgaXMgcmVhZCBvbmx5Jyk7XG4gIH1cbiAgc3RhdGljIGdldCBoaXN0b3J5KCkge1xuICAgIHJldHVybiB3aW5kb3cuaGlzdG9yeTtcbiAgfVxuXG4gIC8qKlxuICAgKiAoZ2V0dGVyL3NldHRlcikgU2V0cyB0aGUgdG9wIGxldmVsIGRvbWFpbiBuYW1lLlxuICAgKiByZXR1cm5zIHRoZSByZWNvcmRlZCBUTEROIG9yLCBieSBkZWZhdWx0LCB3aW5kb3cubG9jYXRpb24uaG9zdG5hbWUuXG4gICAqXG4gICAqIEB0eXBlIHtzdHJpbmd9XG4gICAqL1xuICBzdGF0aWMgc2V0IFRMRE4oVExETikge1xuICAgIC8vIEBub3RlIFdlIHNob3VsZCBpbmNsdWRlIHNvbWUgZXJyb3IgY2hlY2tpbmcgaW4gaGVyZVxuICAgIHRoaXMuX1RMRE4gPSBUTEROO1xuICB9XG4gIHN0YXRpYyBnZXQgVExETigpIHtcbiAgICByZXR1cm4gdGhpcy5fVExETiB8fCB3aW5kb3cubG9jYXRpb24uaG9zdG5hbWU7XG4gIH1cblxuICAvKipcbiAgICogKGdldHRlci9zZXR0ZXIpIHdoZXRoZXIgdG8gb2JzZXJ2ZSB0aGUgVExETiBvciBgdHJ1ZWAgKGRlZmF1bHQpLlxuICAgKlxuICAgKiBAZGVmYXVsdCB0cnVlXG4gICAqIEB0eXBlIHtib29sZWFufVxuICAgKi9cbiAgc3RhdGljIHNldCBvYnNlcnZlVExETihvYnNlcnZlKSB7XG4gICAgLy8gQ2hlY2sgdG8gbWFrZSBzdXJlIHRoYXQgdGhlIGJhc3NlZCB2YWx1ZSBpcyBvZiB0eXBlIGJvb2xlYW4uXG4gICAgaWYodHlwZW9mIG9ic2VydmUgPT09ICdib29sZWFuJylcbiAgICB7XG4gICAgICB0aGlzLl9vYnNlcnZlVExETiA9IG9ic2VydmU7XG4gICAgfSBlbHNlXG4gICAge1xuICAgICAgY29uc29sZS53YXJuKCdvYnNlcnZlVExETiBtdXN0IGJlIG9mIHR5cGUgYm9vbGVhbicpO1xuICAgIH1cbiAgfVxuICBzdGF0aWMgZ2V0IG9ic2VydmVUTEROKCkge1xuICAgIGlmKHR5cGVvZiB0aGlzLl9vYnNlcnZlVExETiA9PT0gJ2Jvb2xlYW4nKVxuICAgIHtcbiAgICAgIHJldHVybiB0aGlzLl9vYnNlcnZlVExETjtcbiAgICB9IGVsc2VcbiAgICB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogKGdldHRlci9zZXR0ZXIpIFdoZXRoZXIgdGhpcyBoaXN0b3J5IG9iamVjdCBpcyBpbiBkZXZtb2RlLiBEZWZhdWx0cyB0byBmYWxzZVxuICAgKlxuICAgKiBAZGVmYXVsdCBmYWxzZVxuICAgKiBAdHlwZSB7Ym9vbGVhbn1cbiAgICovXG4gIHN0YXRpYyBzZXQgZGV2bW9kZShkZXZtb2RlKSB7XG4gICAgLy8gQ2hlY2sgdG8gbWFrZSBzdXJlIHRoYXQgdGhlIGJhc3NlZCB2YWx1ZSBpcyBvZiB0eXBlIGJvb2xlYW4uXG4gICAgaWYodHlwZW9mIGRldm1vZGUgPT09ICdib29sZWFuJylcbiAgICB7XG4gICAgICB0aGlzLl9kZXZtb2RlID0gZGV2bW9kZTtcbiAgICB9IGVsc2VcbiAgICB7XG4gICAgICBjb25zb2xlLndhcm4oJ2Rldm1vZGUgbXVzdCBiZSBvZiB0eXBlIGJvb2xlYW4nKTtcbiAgICB9XG4gIH1cbiAgc3RhdGljIGdldCBkZXZtb2RlKCkge1xuICAgIGlmKHR5cGVvZiB0aGlzLl9kZXZtb2RlID09PSAnYm9vbGVhbicpXG4gICAge1xuICAgICAgcmV0dXJuIHRoaXMuX2Rldm1vZGU7XG4gICAgfSBlbHNlXG4gICAge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiAoZ2V0dGVyL3NldHRlcikgV2hldGhlciB0aGlzIGhpc3Rvcnkgb2JqZWN0IGlzIGluaXRpYWxpYXNlZC5cbiAgICpcbiAgICogQGRlZmF1bHQgZmFsc2VcbiAgICogQHR5cGUge2Jvb2xlYW59XG4gICAqL1xuICBzdGF0aWMgc2V0IGluaXRpYWxpYXNlZChpbml0aWFsaWFzZWQpIHtcbiAgICAvLyBDaGVjayB0byBtYWtlIHN1cmUgdGhhdCB0aGUgYmFzc2VkIHZhbHVlIGlzIG9mIHR5cGUgYm9vbGVhbi5cbiAgICBpZih0eXBlb2YgaW5pdGlhbGlhc2VkID09PSAnYm9vbGVhbicpXG4gICAge1xuICAgICAgdGhpcy5faW5pdGlhbGlhc2VkID0gaW5pdGlhbGlhc2VkO1xuICAgIH0gZWxzZVxuICAgIHtcbiAgICAgIGNvbnNvbGUud2FybignaW5pdGlhbGlhc2VkIG11c3QgYmUgb2YgdHlwZSBib29sZWFuJyk7XG4gICAgfVxuICB9XG4gIHN0YXRpYyBnZXQgaW5pdGlhbGlhc2VkKCkge1xuICAgIGlmKHR5cGVvZiB0aGlzLl9pbml0aWFsaWFzZWQgPT09ICdib29sZWFuJylcbiAgICB7XG4gICAgICByZXR1cm4gdGhpcy5faW5pdGlhbGlhc2VkO1xuICAgIH0gZWxzZVxuICAgIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogKGdldHRlci9zZXR0ZXIpIFdoZXRoZXIgaGlzdG9yeSBpcyBzdXBwb3J0ZWQgYnkgdGhlIGJyb3dzZXIgb3IgZGV2aWNlLlxuICAgKiBQcm92aWRlcyBhbiBlcnJvciBpZiB0aGUgdXNlciB0cmllcyB0byBzZXQgdGhlIHN1cHBvcnQgdmFsdWUsIHVubGVzcyB0aGUgb2JqZWN0IGlzIGluIGRldm1vZGVcbiAgICpcbiAgICogQHR5cGUge2Jvb2xlYW59XG4gICAqL1xuICBzdGF0aWMgc2V0IHN1cHBvcnQoc3VwcG9ydCA9IGZhbHNlKSB7XG4gICAgLy8gVGhpcyBvdmVycmlkZXNcbiAgICBpZiggdGhpcy5kZXZtb2RlICYmIHR5cGVvZiBzdXBwb3J0ID09PSAnYm9vbGVhbicgKSB7XG4gICAgICB0aGlzLl9zdXBwb3J0ID0gc3VwcG9ydDtcbiAgICB9XG4gICAgdGhyb3cgbmV3IEVycm9yKCdUaGUgc3VwcG9ydCBpcyByZWFkIG9ubHknKTtcbiAgfVxuICBzdGF0aWMgZ2V0IHN1cHBvcnQoKSB7XG4gICAgcmV0dXJuICh3aW5kb3cuaGlzdG9yeSAmJiB3aW5kb3cuaGlzdG9yeS5wdXNoU3RhdGUpO1xuICB9XG5cbiAgLyoqXG4gICAqIChnZXR0ZXIvc2V0dGVyKSBUaGUgbGVuZ3RoIG9mIHRoZSBoaXN0b3J5IHN0YWNrXG4gICAqXG4gICAqIEB0eXBlIHtpbnRlZ2VyfVxuICAgKi9cbiAgc3RhdGljIGdldCBsZW5ndGgoKSB7XG4gICAgcmV0dXJuIHRoaXMuaGlzdG9yeS5sZW5ndGg7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgSGlzdG9yeTtcbiJdfQ==
