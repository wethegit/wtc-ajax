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
     * construct and push a URL state
     *
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
     * Sets the document root from a passed URL
     *
     * @param  {string} documentRoot = 'The URL to derive a document root from'
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
    }

    /**
     * return the document root OR a slash
     *
     * @return {string}  returns the saved document root or a `/` if not set
     */
    ,
    get: function get() {
      return this._documentRoot || '/';
    }

    /**
     * provides an error if the user tries to set the history object
     */

  }, {
    key: 'history',
    set: function set(history) {
      throw new Error('The history object is read only');
    }

    /**
     * returns the window history object
     *
     * @return {object}  window.history
     */
    ,
    get: function get() {
      return window.history;
    }

    /**
     * sets the top level domain name
     *
     * @param  {string} TLDN The top level domain name for this history object
     */

  }, {
    key: 'TLDN',
    set: function set(TLDN) {
      // @note We should include some error checking in here
      this._TLDN = TLDN;
    }

    /**
     * returns the TLDN for this history object.
     *
     * @return {string}  The recorded TLDN or, by default, window.location.hostname.
     */
    ,
    get: function get() {
      return this._TLDN || window.location.hostname;
    }

    /**
     * Whether to make the object ovserve the domain
     *
     * @param  {boolean} observe Whether to make the object ovserve the domain
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
    }

    /**
     * STATIC GET observeTLDN - returns the observeTLDN value
     *
     * @return {boolean}  whether to observe the TLDN or `true` (default)
     */
    ,
    get: function get() {
      if (typeof this._observeTLDN === 'boolean') {
        return this._observeTLDN;
      } else {
        return true;
      }
    }

    /**
     * STATIC SET devmode - Sets whether this history object is in devmode
     *
     * @param  {boolean} devmode
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
    }

    /**
     * Returns the devmode value
     *
     * @return {boolean}  The devmode valur or false (default)
     */
    ,
    get: function get() {
      if (typeof this._devmode === 'boolean') {
        return this._devmode;
      } else {
        return false;
      }
    }

    /**
     * Sets whether this history object is initialiased
     *
     * @param  {boolean} initialiased
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
    }

    /**
     * Returns the initialiased value
     *
     * @return {boolean}  The initialiased valur or false (default)
     */
    ,
    get: function get() {
      if (typeof this._initialiased === 'boolean') {
        return this._initialiased;
      } else {
        return false;
      }
    }

    /**
     * provides an error if the user tries to set the support value
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
    }

    /**
     * Returns whether history is supported by the browser or device
     *
     * @return {boolean}  The support valur or true (default)
     */
    ,
    get: function get() {
      return window.history && window.history.pushState;
    }

    /**
     * returns the length of the history stack
     *
     * @return {int}  how many history objects exist in the stack
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJkZW1vL3J1bi5qcyIsInNyYy93dGMtaGlzdG9yeS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0FDQUE7Ozs7OztBQUVBO0FBQ0EscUJBQVEsSUFBUixDQUFhLElBQWI7O0FBRUEsT0FBTyxVQUFQOzs7Ozs7Ozs7Ozs7Ozs7QUNMQTs7OztJQUlNLE87Ozs7Ozs7OztBQUVKOzs7O0FBSUE7Ozs7OzsyQkFNNkI7QUFBQTs7QUFBQSxVQUFqQixPQUFpQix1RUFBUCxLQUFPOztBQUMzQixVQUFHLEtBQUssT0FBUixFQUNBO0FBQ0U7QUFDQSxZQUFJO0FBQ0YsaUJBQU8sZ0JBQVAsQ0FBd0IsVUFBeEIsRUFBb0MsVUFBQyxDQUFELEVBQU07QUFDeEMsZ0JBQUksaUJBQWlCLE1BQUssU0FBTCxDQUFlLENBQWYsQ0FBckI7QUFDQSxtQkFBTyxjQUFQO0FBQ0QsV0FIRDs7QUFLQSxlQUFLLE9BQUwsR0FBb0IsT0FBcEI7QUFFRCxTQVJELENBUUUsT0FBTyxDQUFQLEVBQVU7O0FBRVY7QUFDQSxjQUFHLEtBQUssT0FBUixFQUFpQjtBQUNmLG9CQUFRLElBQVIsQ0FBYSxpQ0FBYjtBQUNBLG9CQUFRLEdBQVIsQ0FBWSxDQUFaO0FBQ0Q7O0FBRUQsaUJBQU8sS0FBUDtBQUNEOztBQUVELGFBQUssV0FBTCxHQUFtQixJQUFuQjtBQUNBLGVBQU8sSUFBUDtBQUNEOztBQUVELGFBQU8sS0FBUDtBQUNEOztBQUVEOzs7Ozs7Ozs7Ozt5QkFRWSxHLEVBQWdDO0FBQUEsVUFBM0IsS0FBMkIsdUVBQW5CLEVBQW1CO0FBQUEsVUFBZixRQUFlLHVFQUFKLEVBQUk7OztBQUUxQyxVQUFJLFlBQVksRUFBaEI7O0FBRUE7QUFDQSxVQUFJO0FBQ0Ysb0JBQVksS0FBSyxPQUFMLENBQWEsR0FBYixFQUFrQixJQUFsQixFQUF3QixJQUF4QixDQUFaO0FBQ0QsT0FGRCxDQUVFLE9BQU8sQ0FBUCxFQUFV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b250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiaW1wb3J0IEhpc3RvcnkgZnJvbSBcIi4uL3NyYy93dGMtaGlzdG9yeVwiO1xuXG4vLyBJbml0aWFsaXNlIHRoZSBoaXN0b3J5IG9iamVjdCBpbiBkZXYgbW9kZVxuSGlzdG9yeS5pbml0KHRydWUpO1xuXG53aW5kb3cuSGlzdG9yeW9iaiA9IEhpc3Rvcnk7XG4iLCIvKipcbiAqIENsYXNzIHJlcHJlc2VuZ2luZyBhbiBhYnN0cmFjdGlvbiBvZiB0aGUgaGlzdG9yeSBBUEkuXG4gKi9cblxuY2xhc3MgSGlzdG9yeSB7XG5cbiAgLyoqXG4gICAqIFB1YmxpYyBtZXRob2RzXG4gICAqL1xuXG4gIC8qKlxuICAgICogSW5pdGlhbGlzZXMgdGhlIEhpc3RvcnkgY2xhc3MuIE5vdGhpbmcgc2hvdWxkIGJlIGFibGUgdG9cbiAgICAqIG9wZXJhdGUgaGVyZSB1bmxlc3MgdGhpcyBoYXMgcnVuIHdpdGggYSBzdXBwb3J0ID0gdHJ1ZS5cbiAgICAqXG4gICAgKiBAcmV0dXJuIHtib29sZWFufSAgICAgICAgIFJldHVybnMgd2hldGhlciBpbml0IHJhbiBvciBub3RcbiAgICAqL1xuICBzdGF0aWMgaW5pdChkZXZtb2RlID0gZmFsc2UpIHtcbiAgICBpZih0aGlzLnN1cHBvcnQpXG4gICAge1xuICAgICAgLy8gVHJ5IHRvIHNldCBldmVyeXRoaW5nIHVwLCBhbmQgaWYgd2UgZmFpbCB0aGVuIHJldHVybiBmYWxzZVxuICAgICAgdHJ5IHtcbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3BvcHN0YXRlJywgKGUpPT4ge1xuICAgICAgICAgIHZhciBoYXNQb3BwZWRTdGF0ZSA9IHRoaXMuX3BvcHN0YXRlKGUpO1xuICAgICAgICAgIHJldHVybiBoYXNQb3BwZWRTdGF0ZTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5kZXZtb2RlICAgICAgPSBkZXZtb2RlO1xuXG4gICAgICB9IGNhdGNoIChlKSB7XG5cbiAgICAgICAgLy8gSWYgd2UncmUgaW4gZGV2bW9kZSwgc2VuZCBvdXIgY29uc29sZSBvdXRwdXRcbiAgICAgICAgaWYodGhpcy5kZXZtb2RlKSB7XG4gICAgICAgICAgY29uc29sZS53YXJuKCdlcnJvciBpbiBoaXN0b3J5IGluaXRpYWxpc2F0aW9uJyk7XG4gICAgICAgICAgY29uc29sZS5sb2coZSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuaW5pdGlhbGlzZWQgPSB0cnVlO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgLyoqXG4gICAqIGNvbnN0cnVjdCBhbmQgcHVzaCBhIFVSTCBzdGF0ZVxuICAgKlxuICAgKiBAcGFyYW0gIHtzdHJpbmd9IFVSTCAgICAgICAgICAgVGhlIFVSTCB0byBwdXNoLCBjYW4gYmUgcmVsYXRpdmUsIGFic29sdXRlIG9yIGZ1bGxcbiAgICogQHBhcmFtICB7c3RyaW5nfSB0aXRsZSAgICAgICAgIFRoZSB0aXRsZSB0byBwdXNoLlxuICAgKiBAcGFyYW0gIHtvYmplY3R9IHN0YXRlT2JqICAgICAgQSBzdGF0ZSB0byBwdXNoIHRvIHRoZSBzdGFjay4gVGhpcyB3aWxsIGJlIHBvcHBlZCB3aGVuIG5hdmlhZ3RpbmcgYmFja1xuICAgKiBAcmV0dXJuIHtib29sZWFufSAgICAgICAgICAgICAgSW5kaWNhdGVzIHdoZXRoZXIgdGhlIHB1c2ggc3VjY2VlZGVkXG4gICAqL1xuICBzdGF0aWMgcHVzaChVUkwsIHRpdGxlID0gJycsIHN0YXRlT2JqID0ge30pIHtcblxuICAgIHZhciBwYXJzZWRVUkwgPSAnJztcblxuICAgIC8vIEZpcnN0IHRyeSB0byBmaXggdGhlIFVSTFxuICAgIHRyeSB7XG4gICAgICBwYXJzZWRVUkwgPSB0aGlzLl9maXhVUkwoVVJMLCB0cnVlLCB0cnVlKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICBpZih0aGlzLmRldm1vZGUpIHtcbiAgICAgICAgY29uc29sZS53YXJuKCdwdXNoIGZhaWxlZCB3aGlsZSB0cnlpbmcgdG8gZml4IHRoZSBVUkwnKTtcbiAgICAgICAgY29uc29sZS5sb2coZSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gZmFsc2VcbiAgICB9XG5cbiAgICAvLyBJZiB3ZSBoYXZlIEFQSSBzdXBwb3J0LCBwdXNoIHRoZSBzdGF0ZSB0byB0aGUgaGlzdG9yeSBvYmplY3RcbiAgICBpZih0aGlzLnN1cHBvcnQpXG4gICAge1xuICAgICAgdHJ5IHtcbiAgICAgICAgdGhpcy5oaXN0b3J5LnB1c2hTdGF0ZShzdGF0ZU9iaiwgdGl0bGUsIHBhcnNlZFVSTCk7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGlmKHRoaXMuZGV2bW9kZSkge1xuICAgICAgICAgIGNvbnNvbGUud2FybigncHVzaCBmYWlsZWQgd2hpbGUgdHJ5aW5nIHRvIHB1c2ggdGhlIHN0YXRlIHRvIHRoZSBoaXN0b3J5IG9iamVjdCcpO1xuICAgICAgICAgIGNvbnNvbGUubG9nKGUpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICAvLyBPdGhlcndpc2VyLCBhZGQgdGhlIFVSTCBhcyBhIGhhc2hiYW5nXG4gICAgfSBlbHNlXG4gICAge1xuICAgICAgd2luZG93LmxvY2F0aW9uLmhhc2ggPSBgIyEke1VSTH1gO1xuICAgIH1cblxuICAgIHJldHVybiB0cnVlO1xuICB9XG5cblxuICAvKipcbiAgICogUHJpdmF0ZSBtZXRob2RzXG4gICAqL1xuXG4gIC8qKlxuICAgKiBUYWtlcyBhIHByb3ZpZGVkIFVSTCBhbmQgcmV0dXJucyB0aGUgdmVyc2lvbiB0aGF0IGlzIHVzYWJsZVxuICAgKlxuICAgKiBAcHJpdmF0ZVxuICAgKiBAcGFyYW0gIHtzdHJpbmd9IFVSTCAgICAgICAgICAgICAgICAgICAgIFRoZSBVUkwgdG8gYmUgcGFzc2VkXG4gICAqIEBwYXJhbSAge2Jvb2xlYW59IGluY2x1ZGVEb2NSb290ID0gdHJ1ZSAgV2hldGhlciB0byBpbmNsdWRlIHRoZSBkb2Nyb290IG9uIHRoZSBwYXNzZWQgVVJMXG4gICAqIEBwYXJhbSAge2Jvb2xlYW59IGluY2x1ZGVUcmFpbHMgPSB0cnVlICAgV2hldGhlciB0byBpbmNsdWRlIGZvdW5kIGhhc2hlcyBhbmQgcGFyYW1zXG4gICAqIEByZXR1cm4ge3N0cmluZ30gICAgICAgICAgICAgICAgICAgICAgICAgVGhlIHBhc3NlZCBhbmQgZm9ybWF0dGVkIFVSTFxuICAgKi9cbiAgc3RhdGljIF9maXhVUkwoVVJMLCBpbmNsdWRlRG9jUm9vdCA9IHRydWUsIGluY2x1ZGVUcmFpbHMgPSB0cnVlKSB7XG5cbiAgICB2YXIgcnRuVVJMO1xuXG4gICAgLyoqXG4gICAgICogVVJMIFJlZ2V4IHdvcmtzIGxpa2UgdGhpczpcbiAgICAgKiBgYGBcbiAgICAgICAgXlxuICAgICAgICAoW146XSs6Ly8gICAgICAgICAgICMgSFRUUChTKSBldGMuXG4gICAgICAgICAgICAoW14vXSspICAgICAgICAgIyBUaGUgVVJMIChpZiBhdmFpbGFibGUpXG4gICAgICAgICk/XG4gICAgICAgICgje0Bkb2N1bWVudFJvb3R9KT8gIyBUaGUgZG9jdW1lbnQgcm9vdCwgd2hpY2ggd2Ugd2FudCB0byBnZXQgcmlkIG9mXG4gICAgICAgICgvKT8gICAgICAgICAgICAgICAgIyBjaGVjayBmb3IgdGhlIHByZXNlbmNlIG9mIGEgbGVhZGluZyBzbGFzaFxuICAgICAgICAoW15cXCNcXD9dKikgICAgICAgICAgIyBUaGUgVVJJIC0gdGhpcyBpcyB3aGF0IHdlIGNhcmUgYWJvdXQuIENoZWNrIGZvciBldmVyeXRoaW5nIGV4Y2VwdCBmb3IgIyBhbmQgP1xuICAgICAgICAoXFw/W15cXCNdKik/ICAgICAgICAgIyBhbnkgYWRkaXRpb25hbCBVUkwgcGFyYW1ldGVycyAob3B0aW9uYWwpXG4gICAgICAgIChcXCNcXCE/LispPyAgICAgICAgICAjIEFueSBoYXNoYmFuZyB0cmFpbGVycyAob3B0aW9uYWwpXG4gICAgICogYGBgXG4gICAgICovXG4gICAgY29uc3QgVVJMUmVnZXggPSBSZWdFeHAoYF4oW146XSs6Ly8oW14vXSspKT8oJHt0aGlzLmRvY3VtZW50Um9vdH0pPygvKT8oW15cXFxcI1xcXFw/XSopKFxcXFw/W15cXFxcI10qKT8oXFxcXCNcXFxcIT8uKyk/YCk7XG4gICAgY29uc3QgW2lucHV0LCBocmVmLCBob3N0bmFtZSwgZG9jdW1lbnRSb290LCByb290LCBwYXRoLCBwYXJhbXMsIGhhc2hiYW5nXSA9IFVSTFJlZ2V4LmV4ZWMoVVJMKTtcblxuICAgIC8vIElmIHdlJ3JlIG9ic2VydmluZyB0aGUgVExETiByZXN0cmFpbnQgYW5kIHRoZSBwcm92aWRlZCBVUkwgZG9lc24ndCBtYXRjaFxuICAgIC8vIHRoZSBkb21haW4ncyBUTEROLCB0aHJvdyBhIFVSSUVycm9yXG4gICAgaWYoIHR5cGVvZiBob3N0bmFtZSA9PT0gJ3N0cmluZycgJiYgaG9zdG5hbWUgIT09IHRoaXMuVExETiAmJiB0aGlzLm9ic2VydmVUTEROID09PSB0cnVlICkge1xuICAgICAgdGhyb3cgbmV3IFVSSUVycm9yKCdUb3AgTGV2ZWwgZG9tYWluIG5hbWUgTVVTVCBtYXRjaCB0aGUgcHJpbWFyeSBkb21haW4gbmFtZScpO1xuICAgIH1cblxuICAgIC8vIElmIG91ciBtYXRjaGVkIFVSTCBoYXMgYSBsZWFkaW5nIHNsYXNoLCB0aGVuIHdlIHdhbnQgdG8gZHJvcCB0aGUgZG9jUm9vdFxuICAgIC8vIGluIHRoZXJlIHVubGVzcyB0aGUgZnVuY3Rpb24gcGFyYW0gXCJpbmNsdWRlRG9jUm9vdFwiIGlzIGZhbHNlLlxuICAgIGlmKFxuICAgICAgKCB0eXBlb2Ygcm9vdCA9PT0gJ3N0cmluZycgJiYgcm9vdCA9PT0gJy8nICkgfHxcbiAgICAgICggdHlwZW9mIGRvY3VtZW50Um9vdCA9PT0gJ3N0cmluZycgJiYgZG9jdW1lbnRSb290ID09PSB0aGlzLmRvY3VtZW50Um9vdCApXG4gICAgKSB7XG4gICAgICBpZiggaW5jbHVkZURvY1Jvb3QgKSB7XG4gICAgICAgIHJ0blVSTCA9IGAke3RoaXMuZG9jdW1lbnRSb290fSR7cGF0aH1gO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcnRuVVJMID0gYC8ke3BhdGh9YDtcbiAgICAgIH1cbiAgICAvLyBFbHNlIGlmIHBhdGggaGFzIHJlc3VsdGVkIGluIGFuIGVtcHR5IHN0cmluZywgYXNzdW1lIHRoZSBwYXRoIGlzIHRoZSByb290XG4gICAgfSBlbHNlIGlmKCBwYXRoID09PSAnJyApIHtcbiAgICAgIHJ0blVSTCA9ICcvJ1xuICAgIC8vIE90aGVyd2lzZSwganVzdCBwYXNzIHRoZSBwYXRoIGNvbXBsZXRlbHkuXG4gICAgfSBlbHNlIHtcbiAgICAgIHJ0blVSTCA9IHBhdGg7XG4gICAgfVxuXG4gICAgLy8gSWYgd2Ugd2FudCB0byBpbmNsdWRlIHRyYWlscyAoaGFzaGVzIGFuZCBwYXJhbXMsIGFzIGRldGVybWluZWQgYnkgYVxuICAgIC8vIGZ1bmNpdG9uIHBhcmFtKSwgdGhlbiBhZGQgdGhlbSB0byB0aGUgVVJMLlxuICAgIGlmKCBpbmNsdWRlVHJhaWxzICkge1xuICAgICAgLy8gQXBwZW5kIGFueSBwYXJhbXNcbiAgICAgIGlmKCB0eXBlb2YgcGFyYW1zID09ICdzdHJpbmcnICkge1xuICAgICAgICBydG5VUkwgKz0gcGFyYW1zO1xuICAgICAgfVxuICAgICAgICAvLyBBcHBlbmQgYW55IGhhc2hlc1xuICAgICAgaWYoIHR5cGVvZiBoYXNoYmFuZyA9PSAnc3RyaW5nJyApIHtcbiAgICAgICAgcnRuVVJMICs9IGhhc2hiYW5nO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBydG5VUkw7XG4gIH1cblxuICAvKipcbiAgICogTGlzdGVuZXIgZm9yIHRoZSBwb3BzdGF0ZSBtZXRob2RcbiAgICpcbiAgICogQHByaXZhdGVcbiAgICogQHBhcmFtICB7b2JqZWN0fSBlIHRoZSBwYXNzZWQgZXZlbnQgb2JqZWN0XG4gICAqIEByZXR1cm4gdm9pZFxuICAgKi9cbiAgc3RhdGljIF9wb3BzdGF0ZShlKSB7XG4gICAgdmFyIGJhc2UsIHN0YXRlO1xuICAgIGNvbnNvbGUubG9nKGUpO1xuICAgIGlmKHRoaXMuc3VwcG9ydClcbiAgICB7XG4gICAgICBzdGF0ZSA9IChiYXNlID0gdGhpcy5oaXN0b3J5KS5zdGF0ZSB8fCAoYmFzZS5zdGF0ZSA9IGUuc3RhdGUgfHwgKGUuc3RhdGUgPSB3aW5kb3cuZXZlbnQuc3RhdGUpKTtcbiAgICAgIGNvbnNvbGUubG9nKHN0YXRlKTtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVycyBhbmQgc2V0dGVyc1xuICAgKi9cblxuICAvKipcbiAgICogU2V0cyB0aGUgZG9jdW1lbnQgcm9vdCBmcm9tIGEgcGFzc2VkIFVSTFxuICAgKlxuICAgKiBAcGFyYW0gIHtzdHJpbmd9IGRvY3VtZW50Um9vdCA9ICdUaGUgVVJMIHRvIGRlcml2ZSBhIGRvY3VtZW50IHJvb3QgZnJvbSdcbiAgICovXG4gIHN0YXRpYyBzZXQgZG9jdW1lbnRSb290KGRvY3VtZW50Um9vdCA9ICcnKSB7XG5cbiAgICAvKipcbiAgICAgKiBkb2Nyb290UmVnZXggd29ya3MgbGlrZSB0aGlzOlxuICAgICAqIGBgYFxuICAgICAgICAgXlxuICAgICAgICAgKFteOl0rOi8vICAgICAgICMgSFRUUChTKSBldGMuXG4gICAgICAgICAgICAgKFteL10rKSAgICAgIyBUaGUgaG9zdG5hbWUgKGlmIGF2YWlsYWJsZSlcbiAgICAgICAgICk/XG4gICAgICAgICAvP1xuICAgICAgICAgKC4qKD89LykpPyAgICAgICMgdGhlIFVSSSB0byB1c2UgYXMgdGhlIGRvY3Jvb3QgbGVzcyBhbnkgYXZhaWxhYmxlIHRyYWlsaW5nIHNsYXNoXG4gICAgICogYGBgXG4gICAgICovXG4gICAgY29uc3QgZG9jcm9vdFJlZ2V4ID0gL14oW146XSs6XFwvXFwvKFteXFwvXSspKT9cXC8/KC4qKD89XFwvKSk/LztcbiAgICAvLyBwYXNzIHRoZSBkb2Nyb290IGFuZCBob3N0bmFtZVxuICAgIGNvbnN0IFtfMSwgXzIsIGhvc3RuYW1lLCBkb2Nyb290XSA9IGRvY3Jvb3RSZWdleC5leGVjKGRvY3VtZW50Um9vdCk7XG5cbiAgICAvLyBFcnJvciBjaGVja1xuICAgIC8vIGNoZWNrIGZvciB0aGUgcHJlc2VuY2Ugb2YgdGhlIHJlcG9ydGVkIFRMRE5cbiAgICBpZihcbiAgICAgIHR5cGVvZiBob3N0bmFtZSA9PT0gJ3N0cmluZycgJiZcbiAgICAgIGhvc3RuYW1lICE9IHRoaXMuVExETiAmJlxuICAgICAgdGhpcy5vYnNlcnZlVExETiA9PT0gdHJ1ZVxuICAgICkge1xuICAgICAgdGhyb3cgbmV3IFVSSUVycm9yKCdUb3AgTGV2ZWwgZG9tYWluIG5hbWUgTVVTVCBtYXRjaCB0aGUgcHJpbWFyeSBkb21haW4gbmFtZScpO1xuICAgIH1cblxuICAgIHRoaXMuX2RvY3VtZW50Um9vdCA9IGAvJHtkb2Nyb290fWA7XG4gIH1cblxuICAvKipcbiAgICogcmV0dXJuIHRoZSBkb2N1bWVudCByb290IE9SIGEgc2xhc2hcbiAgICpcbiAgICogQHJldHVybiB7c3RyaW5nfSAgcmV0dXJucyB0aGUgc2F2ZWQgZG9jdW1lbnQgcm9vdCBvciBhIGAvYCBpZiBub3Qgc2V0XG4gICAqL1xuICBzdGF0aWMgZ2V0IGRvY3VtZW50Um9vdCgpIHtcbiAgICByZXR1cm4gdGhpcy5fZG9jdW1lbnRSb290IHx8ICcvJztcbiAgfVxuXG4gIC8qKlxuICAgKiBwcm92aWRlcyBhbiBlcnJvciBpZiB0aGUgdXNlciB0cmllcyB0byBzZXQgdGhlIGhpc3Rvcnkgb2JqZWN0XG4gICAqL1xuICBzdGF0aWMgc2V0IGhpc3RvcnkoaGlzdG9yeSkge1xuICAgIHRocm93IG5ldyBFcnJvcignVGhlIGhpc3Rvcnkgb2JqZWN0IGlzIHJlYWQgb25seScpO1xuICB9XG5cbiAgLyoqXG4gICAqIHJldHVybnMgdGhlIHdpbmRvdyBoaXN0b3J5IG9iamVjdFxuICAgKlxuICAgKiBAcmV0dXJuIHtvYmplY3R9ICB3aW5kb3cuaGlzdG9yeVxuICAgKi9cbiAgc3RhdGljIGdldCBoaXN0b3J5KCkge1xuICAgIHJldHVybiB3aW5kb3cuaGlzdG9yeTtcbiAgfVxuXG4gIC8qKlxuICAgKiBzZXRzIHRoZSB0b3AgbGV2ZWwgZG9tYWluIG5hbWVcbiAgICpcbiAgICogQHBhcmFtICB7c3RyaW5nfSBUTEROIFRoZSB0b3AgbGV2ZWwgZG9tYWluIG5hbWUgZm9yIHRoaXMgaGlzdG9yeSBvYmplY3RcbiAgICovXG4gIHN0YXRpYyBzZXQgVExETihUTEROKSB7XG4gICAgLy8gQG5vdGUgV2Ugc2hvdWxkIGluY2x1ZGUgc29tZSBlcnJvciBjaGVja2luZyBpbiBoZXJlXG4gICAgdGhpcy5fVExETiA9IFRMRE47XG4gIH1cblxuICAvKipcbiAgICogcmV0dXJucyB0aGUgVExETiBmb3IgdGhpcyBoaXN0b3J5IG9iamVjdC5cbiAgICpcbiAgICogQHJldHVybiB7c3RyaW5nfSAgVGhlIHJlY29yZGVkIFRMRE4gb3IsIGJ5IGRlZmF1bHQsIHdpbmRvdy5sb2NhdGlvbi5ob3N0bmFtZS5cbiAgICovXG4gIHN0YXRpYyBnZXQgVExETigpIHtcbiAgICByZXR1cm4gdGhpcy5fVExETiB8fCB3aW5kb3cubG9jYXRpb24uaG9zdG5hbWU7XG4gIH1cblxuICAvKipcbiAgICogV2hldGhlciB0byBtYWtlIHRoZSBvYmplY3Qgb3ZzZXJ2ZSB0aGUgZG9tYWluXG4gICAqXG4gICAqIEBwYXJhbSAge2Jvb2xlYW59IG9ic2VydmUgV2hldGhlciB0byBtYWtlIHRoZSBvYmplY3Qgb3ZzZXJ2ZSB0aGUgZG9tYWluXG4gICAqL1xuICBzdGF0aWMgc2V0IG9ic2VydmVUTEROKG9ic2VydmUpIHtcbiAgICAvLyBDaGVjayB0byBtYWtlIHN1cmUgdGhhdCB0aGUgYmFzc2VkIHZhbHVlIGlzIG9mIHR5cGUgYm9vbGVhbi5cbiAgICBpZih0eXBlb2Ygb2JzZXJ2ZSA9PT0gJ2Jvb2xlYW4nKVxuICAgIHtcbiAgICAgIHRoaXMuX29ic2VydmVUTEROID0gb2JzZXJ2ZTtcbiAgICB9IGVsc2VcbiAgICB7XG4gICAgICBjb25zb2xlLndhcm4oJ29ic2VydmVUTEROIG11c3QgYmUgb2YgdHlwZSBib29sZWFuJyk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFNUQVRJQyBHRVQgb2JzZXJ2ZVRMRE4gLSByZXR1cm5zIHRoZSBvYnNlcnZlVExETiB2YWx1ZVxuICAgKlxuICAgKiBAcmV0dXJuIHtib29sZWFufSAgd2hldGhlciB0byBvYnNlcnZlIHRoZSBUTEROIG9yIGB0cnVlYCAoZGVmYXVsdClcbiAgICovXG4gIHN0YXRpYyBnZXQgb2JzZXJ2ZVRMRE4oKSB7XG4gICAgaWYodHlwZW9mIHRoaXMuX29ic2VydmVUTEROID09PSAnYm9vbGVhbicpXG4gICAge1xuICAgICAgcmV0dXJuIHRoaXMuX29ic2VydmVUTEROO1xuICAgIH0gZWxzZVxuICAgIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBTVEFUSUMgU0VUIGRldm1vZGUgLSBTZXRzIHdoZXRoZXIgdGhpcyBoaXN0b3J5IG9iamVjdCBpcyBpbiBkZXZtb2RlXG4gICAqXG4gICAqIEBwYXJhbSAge2Jvb2xlYW59IGRldm1vZGVcbiAgICovXG4gIHN0YXRpYyBzZXQgZGV2bW9kZShkZXZtb2RlKSB7XG4gICAgLy8gQ2hlY2sgdG8gbWFrZSBzdXJlIHRoYXQgdGhlIGJhc3NlZCB2YWx1ZSBpcyBvZiB0eXBlIGJvb2xlYW4uXG4gICAgaWYodHlwZW9mIGRldm1vZGUgPT09ICdib29sZWFuJylcbiAgICB7XG4gICAgICB0aGlzLl9kZXZtb2RlID0gZGV2bW9kZTtcbiAgICB9IGVsc2VcbiAgICB7XG4gICAgICBjb25zb2xlLndhcm4oJ2Rldm1vZGUgbXVzdCBiZSBvZiB0eXBlIGJvb2xlYW4nKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgZGV2bW9kZSB2YWx1ZVxuICAgKlxuICAgKiBAcmV0dXJuIHtib29sZWFufSAgVGhlIGRldm1vZGUgdmFsdXIgb3IgZmFsc2UgKGRlZmF1bHQpXG4gICAqL1xuICBzdGF0aWMgZ2V0IGRldm1vZGUoKSB7XG4gICAgaWYodHlwZW9mIHRoaXMuX2Rldm1vZGUgPT09ICdib29sZWFuJylcbiAgICB7XG4gICAgICByZXR1cm4gdGhpcy5fZGV2bW9kZTtcbiAgICB9IGVsc2VcbiAgICB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgd2hldGhlciB0aGlzIGhpc3Rvcnkgb2JqZWN0IGlzIGluaXRpYWxpYXNlZFxuICAgKlxuICAgKiBAcGFyYW0gIHtib29sZWFufSBpbml0aWFsaWFzZWRcbiAgICovXG4gIHN0YXRpYyBzZXQgaW5pdGlhbGlhc2VkKGluaXRpYWxpYXNlZCkge1xuICAgIC8vIENoZWNrIHRvIG1ha2Ugc3VyZSB0aGF0IHRoZSBiYXNzZWQgdmFsdWUgaXMgb2YgdHlwZSBib29sZWFuLlxuICAgIGlmKHR5cGVvZiBpbml0aWFsaWFzZWQgPT09ICdib29sZWFuJylcbiAgICB7XG4gICAgICB0aGlzLl9pbml0aWFsaWFzZWQgPSBpbml0aWFsaWFzZWQ7XG4gICAgfSBlbHNlXG4gICAge1xuICAgICAgY29uc29sZS53YXJuKCdpbml0aWFsaWFzZWQgbXVzdCBiZSBvZiB0eXBlIGJvb2xlYW4nKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgaW5pdGlhbGlhc2VkIHZhbHVlXG4gICAqXG4gICAqIEByZXR1cm4ge2Jvb2xlYW59ICBUaGUgaW5pdGlhbGlhc2VkIHZhbHVyIG9yIGZhbHNlIChkZWZhdWx0KVxuICAgKi9cbiAgc3RhdGljIGdldCBpbml0aWFsaWFzZWQoKSB7XG4gICAgaWYodHlwZW9mIHRoaXMuX2luaXRpYWxpYXNlZCA9PT0gJ2Jvb2xlYW4nKVxuICAgIHtcbiAgICAgIHJldHVybiB0aGlzLl9pbml0aWFsaWFzZWQ7XG4gICAgfSBlbHNlXG4gICAge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBwcm92aWRlcyBhbiBlcnJvciBpZiB0aGUgdXNlciB0cmllcyB0byBzZXQgdGhlIHN1cHBvcnQgdmFsdWVcbiAgICovXG4gIHN0YXRpYyBzZXQgc3VwcG9ydChzdXBwb3J0ID0gZmFsc2UpIHtcbiAgICAvLyBUaGlzIG92ZXJyaWRlc1xuICAgIGlmKCB0aGlzLmRldm1vZGUgJiYgdHlwZW9mIHN1cHBvcnQgPT09ICdib29sZWFuJyApIHtcbiAgICAgIHRoaXMuX3N1cHBvcnQgPSBzdXBwb3J0O1xuICAgIH1cbiAgICB0aHJvdyBuZXcgRXJyb3IoJ1RoZSBzdXBwb3J0IGlzIHJlYWQgb25seScpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgd2hldGhlciBoaXN0b3J5IGlzIHN1cHBvcnRlZCBieSB0aGUgYnJvd3NlciBvciBkZXZpY2VcbiAgICpcbiAgICogQHJldHVybiB7Ym9vbGVhbn0gIFRoZSBzdXBwb3J0IHZhbHVyIG9yIHRydWUgKGRlZmF1bHQpXG4gICAqL1xuICBzdGF0aWMgZ2V0IHN1cHBvcnQoKSB7XG4gICAgcmV0dXJuICh3aW5kb3cuaGlzdG9yeSAmJiB3aW5kb3cuaGlzdG9yeS5wdXNoU3RhdGUpO1xuICB9XG5cbiAgLyoqXG4gICAqIHJldHVybnMgdGhlIGxlbmd0aCBvZiB0aGUgaGlzdG9yeSBzdGFja1xuICAgKlxuICAgKiBAcmV0dXJuIHtpbnR9ICBob3cgbWFueSBoaXN0b3J5IG9iamVjdHMgZXhpc3QgaW4gdGhlIHN0YWNrXG4gICAqL1xuICBzdGF0aWMgZ2V0IGxlbmd0aCgpIHtcbiAgICByZXR1cm4gdGhpcy5oaXN0b3J5Lmxlbmd0aDtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBIaXN0b3J5O1xuIl19
