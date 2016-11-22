(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _wtcAjax = require('../src/wtc-ajax');

var _wtcAjax2 = _interopRequireDefault(_wtcAjax);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Initialise the history object in dev mode
_wtcAjax2.default.init(true);

function ready(fn) {
  if (document.readyState != 'loading') {
    fn();
  } else {
    document.addEventListener('DOMContentLoaded', fn);
  }
}

ready(function () {
  _wtcAjax2.default.initLinks();
});

window.AJAXObj = _wtcAjax2.default;

},{"../src/wtc-ajax":2}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _wtcHistory = require('./wtc-history');

var _wtcHistory2 = _interopRequireDefault(_wtcHistory);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * An AJAX class that picks up on links and turns them into AJAX links.
 *
 * This class assumes that you want to run your AJAX via html attributes on your links
 * and that your website can run just as well without these links. It should also
 * provide additional functionality that allows the class to run programatically,
 * thereby giving the programmer the ability and options to create the websote
 * however they want to.
 *
 * @static
 * @namespace
 * @extends History
 */
var AJAX = function (_History) {
  _inherits(AJAX, _History);

  function AJAX() {
    _classCallCheck(this, AJAX);

    return _possibleConstructorReturn(this, (AJAX.__proto__ || Object.getPrototypeOf(AJAX)).apply(this, arguments));
  }

  _createClass(AJAX, null, [{
    key: 'initLinks',


    /**
     * Public methods
     */

    /**
     * Initialise the links in the document.
     *
     * This will look through the links in the document as denoted by the attributeAjax
     * property and apply a click listener to it that will attempt to determine what
     * and how to load.
     *
     * A simple mechansim for this would be something like:
     * ```
       <a href="page1.html"
          data-wtc-ajax="true"
          data-wtc-ajax-target='#link2-target'
          data-wtc-ajax-selection=".link1-selection"
          data-wtc-ajax-should-navigate="false">Link 1</a>
     * ```
     *
     * The adtributes equate as follows:
     * - (*attributeAjax*) **data-wtc-ajax**
     *
     *    Denotes that this link is an AJAX link.
     * - (*attributeTarget*) **data-wtc-ajax-target**
     *
     *    Denotes the target into which to load the result. Should take the form of a selector.
     * - (*attributeSelection*) **data-wtc-ajax-selection**
     *
     *    Denotes the selection of data to pull from the loaded document. Should take the form of a selector.
     * - (*attributeShouldNavigate*) **data-wtc-ajax-should-navigate**
     *
     *    **True** / False as to whether the link should update the history object. Only necessary if false.
     *
     * In addition, *attributeTarget* and *attributeSelection* accept basic JSON syntax
     * so that you can load moltiple pieces of content from the source.
     *
     * @param  {DOMElement} rootDocument  The DOM element to find links in. Defaults to body.
     */
    value: function initLinks() {
      var _this2 = this;

      var rootDocument = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : document.body;

      var links = rootDocument.querySelectorAll('[' + this.attributeAjax + '="true"]');

      links.forEach(function (link) {
        // Removing this attribute ensures that this link doesn't get a second AJAX listener attached to it.
        link.removeAttribute(_this2.attributeAjax);

        link.addEventListener('click', function (e) {
          _this2.triggerAjaxLink(e);

          e.preventDefault();
        });
        console.log(link);
      });
    }
  }, {
    key: 'triggerAjaxLink',
    value: function triggerAjaxLink(e) {
      var link = e.target;
      var href = link.getAttribute('href');
      var target = link.getAttribute(this.attributeTarget);
      var selection = link.getAttribute(this.attributeSelection);

      console.log(link, href, target, selection);

      this.ajaxGet(link, target, selection);
    }
  }, {
    key: 'ajaxGet',
    value: function ajaxGet(URL, target, selection) {
      var data = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

      var _this3 = this;

      var onload = arguments[4];
      var onloadcontext = arguments[5];

      var req = this.requestObject;
      var parsedURL = this._fixURL(URL);

      var readyState = 0;
      var status = 0;

      req.addEventListener('readystatechange', function (e) {
        readyState = e.target.readyState;
        status = e.target.status;
      });

      req.addEventListener('load', function (e) {
        if (req.status >= 200 && req.status < 400) {
          _this3.parseResponse(req.responseText, target, selection, onload, onloadcontext);
        } else {
          _this3.error(req.status, readyState, status);
        }
      });

      req.addEventListener('error', function (e) {
        _this3.error(readyState, status);
      });

      req.open('GET', parsedURL, true);
      req.send(data);

      return req;
    }
  }, {
    key: 'parseResponse',
    value: function parseResponse(content, target, selection, onload, onloadcontext) {

      var results,
          targetNodes = document.querySelectorAll(target);

      var doc = document.createElement('div');
      doc.innerHTML = content;

      results = doc.querySelectorAll(selection);

      console.log(doc);
      console.log(selection);
      console.log(results);

      // I need to add a tonne of things here, like support for transition off etc.
      // Currently I'm just statically removing and adding in elements.
      targetNodes.forEach(function (el) {
        el.innerHTML = '';

        console.log(el);

        results.forEach(function (result) {
          el.appendChild(result.cloneNode(true));
        });
      });

      // document.body.removeChild(iframe);
    }

    /**
     * Private methods
     */

    /**
     * Getters and setters
     */

    /**
     * (getter/setter) The attribute used to determine whether a link should
     * be run via the AJAX class.
     *
     * @type {string}
     * @default 'data-wtc-ajax'
     */

  }, {
    key: 'attributeAjax',
    set: function set(attribute) {
      if (typeof attribute === 'string') {
        this._attributeAjax = attribute;
      } else {
        console.warn('All attributes must be strings.');
      }
    },
    get: function get() {
      return this._attributeAjax || 'data-wtc-ajax';
    }

    /**
     * (getter/setter) The attribute used to determine where a link should place it's
     * resultant GET. This attribute should be in the form of a selector, ie:
     * `.ajax-target`
     *
     * @type {string}
     * @default 'data-wtc-ajax-target'
     */

  }, {
    key: 'attributeTarget',
    set: function set(attribute) {
      if (typeof attribute === 'string') {
        this._attributeTarget = attribute;
      } else {
        console.warn('All attributes must be strings.');
      }
    },
    get: function get() {
      return this._attributeTarget || 'data-wtc-ajax-target';
    }

    /**
     * (getter/setter) The attribute used to slice the resultant GET.
     * This attribute should be in the form of a selector, ie:
     * `.ajax-selection`
     *
     * @type {string}
     * @default 'data-wtc-ajax-selection'
     */

  }, {
    key: 'attributeSelection',
    set: function set(attribute) {
      if (typeof attribute === 'string') {
        this._attributeSelection = attribute;
      } else {
        console.warn('All attributes must be strings.');
      }
    },
    get: function get() {
      return this._attributeSelection || 'data-wtc-ajax-selection';
    }

    /**
     * (getter/setter) The attribute used to slice the resultant GET.
     * This attribute should be in the form of a selector, ie:
     * `.ajax-selection`
     *
     * @type {string}
     * @default 'data-wtc-ajax-selection'
     */

  }, {
    key: 'attributeShouldNavigate',
    set: function set(attribute) {
      if (typeof attribute === 'string') {
        this._attributeShouldNavigate = attribute;
      } else {
        console.warn('All attributes must be strings.');
      }
    },
    get: function get() {
      return this._attributeShouldNavigate || 'data-wtc-ajax-should-navigate';
    }

    /**
     * returns a new requestObject. Wrapping placeholder for now waiting on enhancements.
     *
     * @return {object}  requestObject
     */

  }, {
    key: 'requestObject',
    get: function get() {
      return new XMLHttpRequest();
    }
  }]);

  return AJAX;
}(_wtcHistory2.default);

exports.default = AJAX;

},{"./wtc-history":3}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Class representing an abstraction of the history API.
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJkZW1vL3J1bi5qcyIsInNyYy93dGMtYWpheC5qcyIsInNyYy93dGMtaGlzdG9yeS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0FDQUE7Ozs7OztBQUVBO0FBQ0Esa0JBQUssSUFBTCxDQUFVLElBQVY7O0FBRUEsU0FBUyxLQUFULENBQWUsRUFBZixFQUFtQjtBQUNqQixNQUFJLFNBQVMsVUFBVCxJQUF1QixTQUEzQixFQUFzQztBQUNwQztBQUNELEdBRkQsTUFFTztBQUNMLGFBQVMsZ0JBQVQsQ0FBMEIsa0JBQTFCLEVBQThDLEVBQTlDO0FBQ0Q7QUFDRjs7QUFFRCxNQUFNLFlBQ047QUFDRSxvQkFBSyxTQUFMO0FBQ0QsQ0FIRDs7QUFLQSxPQUFPLE9BQVA7Ozs7Ozs7Ozs7O0FDbEJBOzs7Ozs7Ozs7Ozs7QUFFQTs7Ozs7Ozs7Ozs7OztJQWFNLEk7Ozs7Ozs7Ozs7Ozs7QUFFSjs7OztBQUlBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztnQ0FtQytDO0FBQUE7O0FBQUEsVUFBOUIsWUFBOEIsdUVBQWYsU0FBUyxJQUFNOztBQUM3QyxVQUFNLFFBQVEsYUFBYSxnQkFBYixPQUFrQyxLQUFLLGFBQXZDLGNBQWQ7O0FBRUEsWUFBTSxPQUFOLENBQWMsVUFBQyxJQUFELEVBQVM7QUFDckI7QUFDQSxhQUFLLGVBQUwsQ0FBcUIsT0FBSyxhQUExQjs7QUFFQSxhQUFLLGdCQUFMLENBQXNCLE9BQXRCLEVBQStCLFVBQUMsQ0FBRCxFQUFNO0FBQ25DLGlCQUFLLGVBQUwsQ0FBcUIsQ0FBckI7O0FBRUEsWUFBRSxjQUFGO0FBQ0QsU0FKRDtBQUtBLGdCQUFRLEdBQVIsQ0FBWSxJQUFaO0FBQ0QsT0FWRDtBQVdEOzs7b0NBRXNCLEMsRUFBRztBQUN4QixVQUFNLE9BQVksRUFBRSxNQUFwQjtBQUNBLFVBQU0sT0FBWSxLQUFLLFlBQUwsQ0FBa0IsTUFBbEIsQ0FB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O3dCQUN5QjtBQUN4QixVQUFHLE9BQU8sS0FBSyxhQUFaLEtBQThCLFNBQWpDLEVBQ0E7QUFDRSxlQUFPLEtBQUssYUFBWjtBQUNELE9BSEQsTUFJQTtBQUNFLGVBQU8sS0FBUDtBQUNEO0FBQ0Y7O0FBRUQ7Ozs7Ozs7Ozt3QkFNb0M7QUFBQSxVQUFqQixPQUFpQix1RUFBUCxLQUFPOztBQUNsQztBQUNBLFVBQUksS0FBSyxPQUFMLElBQWdCLE9BQU8sT0FBUCxLQUFtQixTQUF2QyxFQUFtRDtBQUNqRCxhQUFLLFFBQUwsR0FBZ0IsT0FBaEI7QUFDRDtBQUNELFlBQU0sSUFBSSxLQUFKLENBQVUsMEJBQVYsQ0FBTjtBQUNELEs7d0JBQ29CO0FBQ25CLGFBQVEsT0FBTyxPQUFQLElBQWtCLE9BQU8sT0FBUCxDQUFlLFNBQXpDO0FBQ0Q7O0FBRUQ7Ozs7Ozs7O3dCQUtvQjtBQUNsQixhQUFPLEtBQUssT0FBTCxDQUFhLE1BQXBCO0FBQ0Q7Ozs7OztrQkFHWSxPIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImltcG9ydCBBSkFYIGZyb20gXCIuLi9zcmMvd3RjLWFqYXhcIjtcblxuLy8gSW5pdGlhbGlzZSB0aGUgaGlzdG9yeSBvYmplY3QgaW4gZGV2IG1vZGVcbkFKQVguaW5pdCh0cnVlKTtcblxuZnVuY3Rpb24gcmVhZHkoZm4pIHtcbiAgaWYgKGRvY3VtZW50LnJlYWR5U3RhdGUgIT0gJ2xvYWRpbmcnKSB7XG4gICAgZm4oKTtcbiAgfSBlbHNlIHtcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgZm4pO1xuICB9XG59XG5cbnJlYWR5KGZ1bmN0aW9uKClcbntcbiAgQUpBWC5pbml0TGlua3MoKTtcbn0pO1xuXG53aW5kb3cuQUpBWE9iaiA9IEFKQVg7XG4iLCJpbXBvcnQgSGlzdG9yeSBmcm9tIFwiLi93dGMtaGlzdG9yeVwiO1xuXG4vKipcbiAqIEFuIEFKQVggY2xhc3MgdGhhdCBwaWNrcyB1cCBvbiBsaW5rcyBhbmQgdHVybnMgdGhlbSBpbnRvIEFKQVggbGlua3MuXG4gKlxuICogVGhpcyBjbGFzcyBhc3N1bWVzIHRoYXQgeW91IHdhbnQgdG8gcnVuIHlvdXIgQUpBWCB2aWEgaHRtbCBhdHRyaWJ1dGVzIG9uIHlvdXIgbGlua3NcbiAqIGFuZCB0aGF0IHlvdXIgd2Vic2l0ZSBjYW4gcnVuIGp1c3QgYXMgd2VsbCB3aXRob3V0IHRoZXNlIGxpbmtzLiBJdCBzaG91bGQgYWxzb1xuICogcHJvdmlkZSBhZGRpdGlvbmFsIGZ1bmN0aW9uYWxpdHkgdGhhdCBhbGxvd3MgdGhlIGNsYXNzIHRvIHJ1biBwcm9ncmFtYXRpY2FsbHksXG4gKiB0aGVyZWJ5IGdpdmluZyB0aGUgcHJvZ3JhbW1lciB0aGUgYWJpbGl0eSBhbmQgb3B0aW9ucyB0byBjcmVhdGUgdGhlIHdlYnNvdGVcbiAqIGhvd2V2ZXIgdGhleSB3YW50IHRvLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBuYW1lc3BhY2VcbiAqIEBleHRlbmRzIEhpc3RvcnlcbiAqL1xuY2xhc3MgQUpBWCBleHRlbmRzIEhpc3Rvcnkge1xuXG4gIC8qKlxuICAgKiBQdWJsaWMgbWV0aG9kc1xuICAgKi9cblxuICAvKipcbiAgICogSW5pdGlhbGlzZSB0aGUgbGlua3MgaW4gdGhlIGRvY3VtZW50LlxuICAgKlxuICAgKiBUaGlzIHdpbGwgbG9vayB0aHJvdWdoIHRoZSBsaW5rcyBpbiB0aGUgZG9jdW1lbnQgYXMgZGVub3RlZCBieSB0aGUgYXR0cmlidXRlQWpheFxuICAgKiBwcm9wZXJ0eSBhbmQgYXBwbHkgYSBjbGljayBsaXN0ZW5lciB0byBpdCB0aGF0IHdpbGwgYXR0ZW1wdCB0byBkZXRlcm1pbmUgd2hhdFxuICAgKiBhbmQgaG93IHRvIGxvYWQuXG4gICAqXG4gICAqIEEgc2ltcGxlIG1lY2hhbnNpbSBmb3IgdGhpcyB3b3VsZCBiZSBzb21ldGhpbmcgbGlrZTpcbiAgICogYGBgXG4gICAgIDxhIGhyZWY9XCJwYWdlMS5odG1sXCJcbiAgICAgICAgZGF0YS13dGMtYWpheD1cInRydWVcIlxuICAgICAgICBkYXRhLXd0Yy1hamF4LXRhcmdldD0nI2xpbmsyLXRhcmdldCdcbiAgICAgICAgZGF0YS13dGMtYWpheC1zZWxlY3Rpb249XCIubGluazEtc2VsZWN0aW9uXCJcbiAgICAgICAgZGF0YS13dGMtYWpheC1zaG91bGQtbmF2aWdhdGU9XCJmYWxzZVwiPkxpbmsgMTwvYT5cbiAgICogYGBgXG4gICAqXG4gICAqIFRoZSBhZHRyaWJ1dGVzIGVxdWF0ZSBhcyBmb2xsb3dzOlxuICAgKiAtICgqYXR0cmlidXRlQWpheCopICoqZGF0YS13dGMtYWpheCoqXG4gICAqXG4gICAqICAgIERlbm90ZXMgdGhhdCB0aGlzIGxpbmsgaXMgYW4gQUpBWCBsaW5rLlxuICAgKiAtICgqYXR0cmlidXRlVGFyZ2V0KikgKipkYXRhLXd0Yy1hamF4LXRhcmdldCoqXG4gICAqXG4gICAqICAgIERlbm90ZXMgdGhlIHRhcmdldCBpbnRvIHdoaWNoIHRvIGxvYWQgdGhlIHJlc3VsdC4gU2hvdWxkIHRha2UgdGhlIGZvcm0gb2YgYSBzZWxlY3Rvci5cbiAgICogLSAoKmF0dHJpYnV0ZVNlbGVjdGlvbiopICoqZGF0YS13dGMtYWpheC1zZWxlY3Rpb24qKlxuICAgKlxuICAgKiAgICBEZW5vdGVzIHRoZSBzZWxlY3Rpb24gb2YgZGF0YSB0byBwdWxsIGZyb20gdGhlIGxvYWRlZCBkb2N1bWVudC4gU2hvdWxkIHRha2UgdGhlIGZvcm0gb2YgYSBzZWxlY3Rvci5cbiAgICogLSAoKmF0dHJpYnV0ZVNob3VsZE5hdmlnYXRlKikgKipkYXRhLXd0Yy1hamF4LXNob3VsZC1uYXZpZ2F0ZSoqXG4gICAqXG4gICAqICAgICoqVHJ1ZSoqIC8gRmFsc2UgYXMgdG8gd2hldGhlciB0aGUgbGluayBzaG91bGQgdXBkYXRlIHRoZSBoaXN0b3J5IG9iamVjdC4gT25seSBuZWNlc3NhcnkgaWYgZmFsc2UuXG4gICAqXG4gICAqIEluIGFkZGl0aW9uLCAqYXR0cmlidXRlVGFyZ2V0KiBhbmQgKmF0dHJpYnV0ZVNlbGVjdGlvbiogYWNjZXB0IGJhc2ljIEpTT04gc3ludGF4XG4gICAqIHNvIHRoYXQgeW91IGNhbiBsb2FkIG1vbHRpcGxlIHBpZWNlcyBvZiBjb250ZW50IGZyb20gdGhlIHNvdXJjZS5cbiAgICpcbiAgICogQHBhcmFtICB7RE9NRWxlbWVudH0gcm9vdERvY3VtZW50ICBUaGUgRE9NIGVsZW1lbnQgdG8gZmluZCBsaW5rcyBpbi4gRGVmYXVsdHMgdG8gYm9keS5cbiAgICovXG4gIHN0YXRpYyBpbml0TGlua3Mocm9vdERvY3VtZW50ID0gZG9jdW1lbnQuYm9keSkge1xuICAgIGNvbnN0IGxpbmtzID0gcm9vdERvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoYFske3RoaXMuYXR0cmlidXRlQWpheH09XCJ0cnVlXCJdYCk7XG5cbiAgICBsaW5rcy5mb3JFYWNoKChsaW5rKT0+IHtcbiAgICAgIC8vIFJlbW92aW5nIHRoaXMgYXR0cmlidXRlIGVuc3VyZXMgdGhhdCB0aGlzIGxpbmsgZG9lc24ndCBnZXQgYSBzZWNvbmQgQUpBWCBsaXN0ZW5lciBhdHRhY2hlZCB0byBpdC5cbiAgICAgIGxpbmsucmVtb3ZlQXR0cmlidXRlKHRoaXMuYXR0cmlidXRlQWpheCk7XG5cbiAgICAgIGxpbmsuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZSk9PiB7XG4gICAgICAgIHRoaXMudHJpZ2dlckFqYXhMaW5rKGUpO1xuXG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgIH0pO1xuICAgICAgY29uc29sZS5sb2cobGluayk7XG4gICAgfSk7XG4gIH1cblxuICBzdGF0aWMgdHJpZ2dlckFqYXhMaW5rKGUpIHtcbiAgICBjb25zdCBsaW5rICAgICAgPSBlLnRhcmdldDtcbiAgICBjb25zdCBocmVmICAgICAgPSBsaW5rLmdldEF0dHJpYnV0ZSgnaHJlZicpO1xuICAgIGNvbnN0IHRhcmdldCAgICA9IGxpbmsuZ2V0QXR0cmlidXRlKHRoaXMuYXR0cmlidXRlVGFyZ2V0KTtcbiAgICBjb25zdCBzZWxlY3Rpb24gPSBsaW5rLmdldEF0dHJpYnV0ZSh0aGlzLmF0dHJpYnV0ZVNlbGVjdGlvbik7XG5cbiAgICBjb25zb2xlLmxvZyhsaW5rLCBocmVmLCB0YXJnZXQsIHNlbGVjdGlvbik7XG5cbiAgICB0aGlzLmFqYXhHZXQobGluaywgdGFyZ2V0LCBzZWxlY3Rpb24pO1xuICB9XG5cbiAgc3RhdGljIGFqYXhHZXQoVVJMLCB0YXJnZXQsIHNlbGVjdGlvbiwgZGF0YSA9IHt9LCBvbmxvYWQsIG9ubG9hZGNvbnRleHQpIHtcbiAgICBjb25zdCByZXEgPSB0aGlzLnJlcXVlc3RPYmplY3Q7XG4gICAgY29uc3QgcGFyc2VkVVJMID0gdGhpcy5fZml4VVJMKFVSTCk7XG5cbiAgICB2YXIgcmVhZHlTdGF0ZSA9IDA7XG4gICAgdmFyIHN0YXR1cyA9IDA7XG5cbiAgICByZXEuYWRkRXZlbnRMaXN0ZW5lcigncmVhZHlzdGF0ZWNoYW5nZScsIChlKSA9PiB7XG4gICAgICByZWFkeVN0YXRlID0gZS50YXJnZXQucmVhZHlTdGF0ZTtcbiAgICAgIHN0YXR1cyA9IGUudGFyZ2V0LnN0YXR1cztcbiAgICB9KTtcblxuICAgIHJlcS5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgKGUpID0+IHtcbiAgICAgIGlmKCByZXEuc3RhdHVzID49IDIwMCAmJiByZXEuc3RhdHVzIDwgNDAwICkge1xuICAgICAgICB0aGlzLnBhcnNlUmVzcG9uc2UocmVxLnJlc3BvbnNlVGV4dCwgdGFyZ2V0LCBzZWxlY3Rpb24sIG9ubG9hZCwgb25sb2FkY29udGV4dClcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuZXJyb3IocmVxLnN0YXR1cywgcmVhZHlTdGF0ZSwgc3RhdHVzKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHJlcS5hZGRFdmVudExpc3RlbmVyKCdlcnJvcicsIChlKSA9PiB7XG4gICAgICB0aGlzLmVycm9yKHJlYWR5U3RhdGUsIHN0YXR1cyk7XG4gICAgfSk7XG5cbiAgICByZXEub3BlbignR0VUJywgcGFyc2VkVVJMLCB0cnVlKTtcbiAgICByZXEuc2VuZChkYXRhKTtcblxuICAgIHJldHVybiByZXE7XG4gIH1cblxuICBzdGF0aWMgcGFyc2VSZXNwb25zZShjb250ZW50LCB0YXJnZXQsIHNlbGVjdGlvbiwgb25sb2FkLCBvbmxvYWRjb250ZXh0KSB7XG5cbiAgICB2YXIgcmVzdWx0cywgdGFyZ2V0Tm9kZXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKHRhcmdldCk7XG5cbiAgICB2YXIgZG9jID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgZG9jLmlubmVySFRNTCA9IGNvbnRlbnQ7XG5cbiAgICByZXN1bHRzID0gZG9jLnF1ZXJ5U2VsZWN0b3JBbGwoc2VsZWN0aW9uKTtcblxuICAgIGNvbnNvbGUubG9nKGRvYyk7XG4gICAgY29uc29sZS5sb2coc2VsZWN0aW9uKTtcbiAgICBjb25zb2xlLmxvZyhyZXN1bHRzKTtcblxuICAgIC8vIEkgbmVlZCB0byBhZGQgYSB0b25uZSBvZiB0aGluZ3MgaGVyZSwgbGlrZSBzdXBwb3J0IGZvciB0cmFuc2l0aW9uIG9mZiBldGMuXG4gICAgLy8gQ3VycmVudGx5IEknbSBqdXN0IHN0YXRpY2FsbHkgcmVtb3ZpbmcgYW5kIGFkZGluZyBpbiBlbGVtZW50cy5cbiAgICB0YXJnZXROb2Rlcy5mb3JFYWNoKChlbCkgPT4ge1xuICAgICAgZWwuaW5uZXJIVE1MID0gJyc7XG5cbiAgICAgIGNvbnNvbGUubG9nKGVsKVxuXG4gICAgICByZXN1bHRzLmZvckVhY2goZnVuY3Rpb24ocmVzdWx0KSB7XG4gICAgICAgIGVsLmFwcGVuZENoaWxkKHJlc3VsdC5jbG9uZU5vZGUodHJ1ZSkpO1xuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICAvLyBkb2N1bWVudC5ib2R5LnJlbW92ZUNoaWxkKGlmcmFtZSk7XG5cbiAgfVxuXG4gIC8qKlxuICAgKiBQcml2YXRlIG1ldGhvZHNcbiAgICovXG5cblxuICAvKipcbiAgICogR2V0dGVycyBhbmQgc2V0dGVyc1xuICAgKi9cblxuICAvKipcbiAgICogKGdldHRlci9zZXR0ZXIpIFRoZSBhdHRyaWJ1dGUgdXNlZCB0byBkZXRlcm1pbmUgd2hldGhlciBhIGxpbmsgc2hvdWxkXG4gICAqIGJlIHJ1biB2aWEgdGhlIEFKQVggY2xhc3MuXG4gICAqXG4gICAqIEB0eXBlIHtzdHJpbmd9XG4gICAqIEBkZWZhdWx0ICdkYXRhLXd0Yy1hamF4J1xuICAgKi9cbiAgc3RhdGljIHNldCBhdHRyaWJ1dGVBamF4KGF0dHJpYnV0ZSkge1xuICAgIGlmKHR5cGVvZiBhdHRyaWJ1dGUgPT09ICdzdHJpbmcnKSB7XG4gICAgICB0aGlzLl9hdHRyaWJ1dGVBamF4ID0gYXR0cmlidXRlO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zb2xlLndhcm4oJ0FsbCBhdHRyaWJ1dGVzIG11c3QgYmUgc3RyaW5ncy4nKTtcbiAgICB9XG4gIH1cbiAgc3RhdGljIGdldCBhdHRyaWJ1dGVBamF4KCkge1xuICAgIHJldHVybiB0aGlzLl9hdHRyaWJ1dGVBamF4IHx8ICdkYXRhLXd0Yy1hamF4JztcbiAgfVxuXG4gIC8qKlxuICAgKiAoZ2V0dGVyL3NldHRlcikgVGhlIGF0dHJpYnV0ZSB1c2VkIHRvIGRldGVybWluZSB3aGVyZSBhIGxpbmsgc2hvdWxkIHBsYWNlIGl0J3NcbiAgICogcmVzdWx0YW50IEdFVC4gVGhpcyBhdHRyaWJ1dGUgc2hvdWxkIGJlIGluIHRoZSBmb3JtIG9mIGEgc2VsZWN0b3IsIGllOlxuICAgKiBgLmFqYXgtdGFyZ2V0YFxuICAgKlxuICAgKiBAdHlwZSB7c3RyaW5nfVxuICAgKiBAZGVmYXVsdCAnZGF0YS13dGMtYWpheC10YXJnZXQnXG4gICAqL1xuICBzdGF0aWMgc2V0IGF0dHJpYnV0ZVRhcmdldChhdHRyaWJ1dGUpIHtcbiAgICBpZih0eXBlb2YgYXR0cmlidXRlID09PSAnc3RyaW5nJykge1xuICAgICAgdGhpcy5fYXR0cmlidXRlVGFyZ2V0ID0gYXR0cmlidXRlO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zb2xlLndhcm4oJ0FsbCBhdHRyaWJ1dGVzIG11c3QgYmUgc3RyaW5ncy4nKTtcbiAgICB9XG4gIH1cbiAgc3RhdGljIGdldCBhdHRyaWJ1dGVUYXJnZXQoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2F0dHJpYnV0ZVRhcmdldCB8fCAnZGF0YS13dGMtYWpheC10YXJnZXQnO1xuICB9XG5cbiAgLyoqXG4gICAqIChnZXR0ZXIvc2V0dGVyKSBUaGUgYXR0cmlidXRlIHVzZWQgdG8gc2xpY2UgdGhlIHJlc3VsdGFudCBHRVQuXG4gICAqIFRoaXMgYXR0cmlidXRlIHNob3VsZCBiZSBpbiB0aGUgZm9ybSBvZiBhIHNlbGVjdG9yLCBpZTpcbiAgICogYC5hamF4LXNlbGVjdGlvbmBcbiAgICpcbiAgICogQHR5cGUge3N0cmluZ31cbiAgICogQGRlZmF1bHQgJ2RhdGEtd3RjLWFqYXgtc2VsZWN0aW9uJ1xuICAgKi9cbiAgc3RhdGljIHNldCBhdHRyaWJ1dGVTZWxlY3Rpb24oYXR0cmlidXRlKSB7XG4gICAgaWYodHlwZW9mIGF0dHJpYnV0ZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgIHRoaXMuX2F0dHJpYnV0ZVNlbGVjdGlvbiA9IGF0dHJpYnV0ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc29sZS53YXJuKCdBbGwgYXR0cmlidXRlcyBtdXN0IGJlIHN0cmluZ3MuJyk7XG4gICAgfVxuICB9XG4gIHN0YXRpYyBnZXQgYXR0cmlidXRlU2VsZWN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLl9hdHRyaWJ1dGVTZWxlY3Rpb24gfHwgJ2RhdGEtd3RjLWFqYXgtc2VsZWN0aW9uJztcbiAgfVxuXG4gIC8qKlxuICAgKiAoZ2V0dGVyL3NldHRlcikgVGhlIGF0dHJpYnV0ZSB1c2VkIHRvIHNsaWNlIHRoZSByZXN1bHRhbnQgR0VULlxuICAgKiBUaGlzIGF0dHJpYnV0ZSBzaG91bGQgYmUgaW4gdGhlIGZvcm0gb2YgYSBzZWxlY3RvciwgaWU6XG4gICAqIGAuYWpheC1zZWxlY3Rpb25gXG4gICAqXG4gICAqIEB0eXBlIHtzdHJpbmd9XG4gICAqIEBkZWZhdWx0ICdkYXRhLXd0Yy1hamF4LXNlbGVjdGlvbidcbiAgICovXG4gIHN0YXRpYyBzZXQgYXR0cmlidXRlU2hvdWxkTmF2aWdhdGUoYXR0cmlidXRlKSB7XG4gICAgaWYodHlwZW9mIGF0dHJpYnV0ZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgIHRoaXMuX2F0dHJpYnV0ZVNob3VsZE5hdmlnYXRlID0gYXR0cmlidXRlO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zb2xlLndhcm4oJ0FsbCBhdHRyaWJ1dGVzIG11c3QgYmUgc3RyaW5ncy4nKTtcbiAgICB9XG4gIH1cbiAgc3RhdGljIGdldCBhdHRyaWJ1dGVTaG91bGROYXZpZ2F0ZSgpIHtcbiAgICByZXR1cm4gdGhpcy5fYXR0cmlidXRlU2hvdWxkTmF2aWdhdGUgfHwgJ2RhdGEtd3RjLWFqYXgtc2hvdWxkLW5hdmlnYXRlJztcbiAgfVxuXG4gIC8qKlxuICAgKiByZXR1cm5zIGEgbmV3IHJlcXVlc3RPYmplY3QuIFdyYXBwaW5nIHBsYWNlaG9sZGVyIGZvciBub3cgd2FpdGluZyBvbiBlbmhhbmNlbWVudHMuXG4gICAqXG4gICAqIEByZXR1cm4ge29iamVjdH0gIHJlcXVlc3RPYmplY3RcbiAgICovXG4gIHN0YXRpYyBnZXQgcmVxdWVzdE9iamVjdCgpIHtcbiAgICByZXR1cm4gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgQUpBWDtcbiIsIi8qKlxuICogQ2xhc3MgcmVwcmVzZW50aW5nIGFuIGFic3RyYWN0aW9uIG9mIHRoZSBoaXN0b3J5IEFQSS5cbiAqIEBzdGF0aWNcbiAqIEBuYW1lc3BhY2VcbiAqL1xuY2xhc3MgSGlzdG9yeSB7XG5cbiAgLyoqXG4gICAqIFB1YmxpYyBtZXRob2RzXG4gICAqL1xuXG4gIC8qKlxuICAgICogSW5pdGlhbGlzZXMgdGhlIEhpc3RvcnkgY2xhc3MuIE5vdGhpbmcgc2hvdWxkIGJlIGFibGUgdG9cbiAgICAqIG9wZXJhdGUgaGVyZSB1bmxlc3MgdGhpcyBoYXMgcnVuIHdpdGggYSBzdXBwb3J0ID0gdHJ1ZS5cbiAgICAqXG4gICAgKiBAUHVibGljXG4gICAgKiBAcmV0dXJuIHtib29sZWFufSAgICAgICAgIFJldHVybnMgd2hldGhlciBpbml0IHJhbiBvciBub3RcbiAgICAqL1xuICBzdGF0aWMgaW5pdChkZXZtb2RlID0gZmFsc2UpIHtcbiAgICBpZih0aGlzLnN1cHBvcnQpXG4gICAge1xuICAgICAgLy8gVHJ5IHRvIHNldCBldmVyeXRoaW5nIHVwLCBhbmQgaWYgd2UgZmFpbCB0aGVuIHJldHVybiBmYWxzZVxuICAgICAgdHJ5IHtcbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3BvcHN0YXRlJywgKGUpPT4ge1xuICAgICAgICAgIHZhciBoYXNQb3BwZWRTdGF0ZSA9IHRoaXMuX3BvcHN0YXRlKGUpO1xuICAgICAgICAgIHJldHVybiBoYXNQb3BwZWRTdGF0ZTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5kZXZtb2RlICAgICAgPSBkZXZtb2RlO1xuXG4gICAgICB9IGNhdGNoIChlKSB7XG5cbiAgICAgICAgLy8gSWYgd2UncmUgaW4gZGV2bW9kZSwgc2VuZCBvdXIgY29uc29sZSBvdXRwdXRcbiAgICAgICAgaWYodGhpcy5kZXZtb2RlKSB7XG4gICAgICAgICAgY29uc29sZS53YXJuKCdlcnJvciBpbiBoaXN0b3J5IGluaXRpYWxpc2F0aW9uJyk7XG4gICAgICAgICAgY29uc29sZS5sb2coZSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuaW5pdGlhbGlzZWQgPSB0cnVlO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgLyoqXG4gICAqIENvbnN0cnVjdCBhbmQgcHVzaCBhIFVSTCBzdGF0ZVxuICAgKlxuICAgKiBAcHVibGljXG4gICAqIEBwYXJhbSAge3N0cmluZ30gVVJMICAgICAgICAgICBUaGUgVVJMIHRvIHB1c2gsIGNhbiBiZSByZWxhdGl2ZSwgYWJzb2x1dGUgb3IgZnVsbFxuICAgKiBAcGFyYW0gIHtzdHJpbmd9IHRpdGxlICAgICAgICAgVGhlIHRpdGxlIHRvIHB1c2guXG4gICAqIEBwYXJhbSAge29iamVjdH0gc3RhdGVPYmogICAgICBBIHN0YXRlIHRvIHB1c2ggdG8gdGhlIHN0YWNrLiBUaGlzIHdpbGwgYmUgcG9wcGVkIHdoZW4gbmF2aWFndGluZyBiYWNrXG4gICAqIEByZXR1cm4ge2Jvb2xlYW59ICAgICAgICAgICAgICBJbmRpY2F0ZXMgd2hldGhlciB0aGUgcHVzaCBzdWNjZWVkZWRcbiAgICovXG4gIHN0YXRpYyBwdXNoKFVSTCwgdGl0bGUgPSAnJywgc3RhdGVPYmogPSB7fSkge1xuXG4gICAgdmFyIHBhcnNlZFVSTCA9ICcnO1xuXG4gICAgLy8gRmlyc3QgdHJ5IHRvIGZpeCB0aGUgVVJMXG4gICAgdHJ5IHtcbiAgICAgIHBhcnNlZFVSTCA9IHRoaXMuX2ZpeFVSTChVUkwsIHRydWUsIHRydWUpO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIGlmKHRoaXMuZGV2bW9kZSkge1xuICAgICAgICBjb25zb2xlLndhcm4oJ3B1c2ggZmFpbGVkIHdoaWxlIHRyeWluZyB0byBmaXggdGhlIFVSTCcpO1xuICAgICAgICBjb25zb2xlLmxvZyhlKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBmYWxzZVxuICAgIH1cblxuICAgIC8vIElmIHdlIGhhdmUgQVBJIHN1cHBvcnQsIHB1c2ggdGhlIHN0YXRlIHRvIHRoZSBoaXN0b3J5IG9iamVjdFxuICAgIGlmKHRoaXMuc3VwcG9ydClcbiAgICB7XG4gICAgICB0cnkge1xuICAgICAgICB0aGlzLmhpc3RvcnkucHVzaFN0YXRlKHN0YXRlT2JqLCB0aXRsZSwgcGFyc2VkVVJMKTtcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgaWYodGhpcy5kZXZtb2RlKSB7XG4gICAgICAgICAgY29uc29sZS53YXJuKCdwdXNoIGZhaWxlZCB3aGlsZSB0cnlpbmcgdG8gcHVzaCB0aGUgc3RhdGUgdG8gdGhlIGhpc3Rvcnkgb2JqZWN0Jyk7XG4gICAgICAgICAgY29uc29sZS5sb2coZSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgIC8vIE90aGVyd2lzZXIsIGFkZCB0aGUgVVJMIGFzIGEgaGFzaGJhbmdcbiAgICB9IGVsc2VcbiAgICB7XG4gICAgICB3aW5kb3cubG9jYXRpb24uaGFzaCA9IGAjISR7VVJMfWA7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICAvKipcbiAgICogVGFrZXMgdGhlIHVzZXIgYmFjayB0byB0aGUgcHJldmlvdXMgc3RhdGUuIFNpbXBseSB3cmFwcyB0aGUgaGlzdG9yeSBvYmplY3QncyBiYWNrIG1ldGhvZC5cbiAgICpcbiAgICogQHB1YmxpY1xuICAgKi9cbiAgc3RhdGljIGJhY2soKSB7XG4gICAgdGhpcy5oaXN0b3J5LmJhY2soKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUYWtlcyB0aGUgdXNlciBmb3J3YXJkIHRvIHRoZSBuZXh0IHN0YXRlLiBTaW1wbHkgd3JhcHMgdGhlIGhpc3Rvcnkgb2JqZWN0J3MgZm9yd2FyZCBtZXRob2QuXG4gICAqXG4gICAqIEBwdWJsaWNcbiAgICovXG4gIHN0YXRpYyBmb3J3YXJkKCkge1xuICAgIHRoaXMuaGlzdG9yeS5mb3J3YXJkKCk7XG4gIH1cblxuXG4gIC8qKlxuICAgKiBQcml2YXRlIG1ldGhvZHNcbiAgICovXG5cbiAgLyoqXG4gICAqIFRha2VzIGEgcHJvdmlkZWQgVVJMIGFuZCByZXR1cm5zIHRoZSB2ZXJzaW9uIHRoYXQgaXMgdXNhYmxlXG4gICAqXG4gICAqIEBwcml2YXRlXG4gICAqIEBwYXJhbSAge3N0cmluZ30gVVJMICAgICAgICAgICAgICAgICAgICAgVGhlIFVSTCB0byBiZSBwYXNzZWRcbiAgICogQHBhcmFtICB7Ym9vbGVhbn0gaW5jbHVkZURvY1Jvb3QgPSB0cnVlICBXaGV0aGVyIHRvIGluY2x1ZGUgdGhlIGRvY3Jvb3Qgb24gdGhlIHBhc3NlZCBVUkxcbiAgICogQHBhcmFtICB7Ym9vbGVhbn0gaW5jbHVkZVRyYWlscyA9IHRydWUgICBXaGV0aGVyIHRvIGluY2x1ZGUgZm91bmQgaGFzaGVzIGFuZCBwYXJhbXNcbiAgICogQHJldHVybiB7c3RyaW5nfSAgICAgICAgICAgICAgICAgICAgICAgICBUaGUgcGFzc2VkIGFuZCBmb3JtYXR0ZWQgVVJMXG4gICAqL1xuICBzdGF0aWMgX2ZpeFVSTChVUkwsIGluY2x1ZGVEb2NSb290ID0gdHJ1ZSwgaW5jbHVkZVRyYWlscyA9IHRydWUpIHtcblxuICAgIHZhciBydG5VUkw7XG5cbiAgICAvKipcbiAgICAgKiBVUkwgUmVnZXggd29ya3MgbGlrZSB0aGlzOlxuICAgICAqIGBgYFxuICAgICAgICBeXG4gICAgICAgIChbXjpdKzovLyAgICAgICAgICAgIyBIVFRQKFMpIGV0Yy5cbiAgICAgICAgICAgIChbXi9dKykgICAgICAgICAjIFRoZSBVUkwgKGlmIGF2YWlsYWJsZSlcbiAgICAgICAgKT9cbiAgICAgICAgKCN7QGRvY3VtZW50Um9vdH0pPyAjIFRoZSBkb2N1bWVudCByb290LCB3aGljaCB3ZSB3YW50IHRvIGdldCByaWQgb2ZcbiAgICAgICAgKC8pPyAgICAgICAgICAgICAgICAjIGNoZWNrIGZvciB0aGUgcHJlc2VuY2Ugb2YgYSBsZWFkaW5nIHNsYXNoXG4gICAgICAgIChbXlxcI1xcP10qKSAgICAgICAgICAjIFRoZSBVUkkgLSB0aGlzIGlzIHdoYXQgd2UgY2FyZSBhYm91dC4gQ2hlY2sgZm9yIGV2ZXJ5dGhpbmcgZXhjZXB0IGZvciAjIGFuZCA/XG4gICAgICAgIChcXD9bXlxcI10qKT8gICAgICAgICAjIGFueSBhZGRpdGlvbmFsIFVSTCBwYXJhbWV0ZXJzIChvcHRpb25hbClcbiAgICAgICAgKFxcI1xcIT8uKyk/ICAgICAgICAgICMgQW55IGhhc2hiYW5nIHRyYWlsZXJzIChvcHRpb25hbClcbiAgICAgKiBgYGBcbiAgICAgKi9cbiAgICBjb25zdCBVUkxSZWdleCA9IFJlZ0V4cChgXihbXjpdKzovLyhbXi9dKykpPygke3RoaXMuZG9jdW1lbnRSb290fSk/KC8pPyhbXlxcXFwjXFxcXD9dKikoXFxcXD9bXlxcXFwjXSopPyhcXFxcI1xcXFwhPy4rKT9gKTtcbiAgICBjb25zdCBbaW5wdXQsIGhyZWYsIGhvc3RuYW1lLCBkb2N1bWVudFJvb3QsIHJvb3QsIHBhdGgsIHBhcmFtcywgaGFzaGJhbmddID0gVVJMUmVnZXguZXhlYyhVUkwpO1xuXG4gICAgLy8gSWYgd2UncmUgb2JzZXJ2aW5nIHRoZSBUTEROIHJlc3RyYWludCBhbmQgdGhlIHByb3ZpZGVkIFVSTCBkb2Vzbid0IG1hdGNoXG4gICAgLy8gdGhlIGRvbWFpbidzIFRMRE4sIHRocm93IGEgVVJJRXJyb3JcbiAgICBpZiggdHlwZW9mIGhvc3RuYW1lID09PSAnc3RyaW5nJyAmJiBob3N0bmFtZSAhPT0gdGhpcy5UTEROICYmIHRoaXMub2JzZXJ2ZVRMRE4gPT09IHRydWUgKSB7XG4gICAgICB0aHJvdyBuZXcgVVJJRXJyb3IoJ1RvcCBMZXZlbCBkb21haW4gbmFtZSBNVVNUIG1hdGNoIHRoZSBwcmltYXJ5IGRvbWFpbiBuYW1lJyk7XG4gICAgfVxuXG4gICAgLy8gSWYgb3VyIG1hdGNoZWQgVVJMIGhhcyBhIGxlYWRpbmcgc2xhc2gsIHRoZW4gd2Ugd2FudCB0byBkcm9wIHRoZSBkb2NSb290XG4gICAgLy8gaW4gdGhlcmUgdW5sZXNzIHRoZSBmdW5jdGlvbiBwYXJhbSBcImluY2x1ZGVEb2NSb290XCIgaXMgZmFsc2UuXG4gICAgaWYoXG4gICAgICAoIHR5cGVvZiByb290ID09PSAnc3RyaW5nJyAmJiByb290ID09PSAnLycgKSB8fFxuICAgICAgKCB0eXBlb2YgZG9jdW1lbnRSb290ID09PSAnc3RyaW5nJyAmJiBkb2N1bWVudFJvb3QgPT09IHRoaXMuZG9jdW1lbnRSb290IClcbiAgICApIHtcbiAgICAgIGlmKCBpbmNsdWRlRG9jUm9vdCApIHtcbiAgICAgICAgcnRuVVJMID0gYCR7dGhpcy5kb2N1bWVudFJvb3R9JHtwYXRofWA7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBydG5VUkwgPSBgLyR7cGF0aH1gO1xuICAgICAgfVxuICAgIC8vIEVsc2UgaWYgcGF0aCBoYXMgcmVzdWx0ZWQgaW4gYW4gZW1wdHkgc3RyaW5nLCBhc3N1bWUgdGhlIHBhdGggaXMgdGhlIHJvb3RcbiAgICB9IGVsc2UgaWYoIHBhdGggPT09ICcnICkge1xuICAgICAgcnRuVVJMID0gJy8nXG4gICAgLy8gT3RoZXJ3aXNlLCBqdXN0IHBhc3MgdGhlIHBhdGggY29tcGxldGVseS5cbiAgICB9IGVsc2Uge1xuICAgICAgcnRuVVJMID0gcGF0aDtcbiAgICB9XG5cbiAgICAvLyBJZiB3ZSB3YW50IHRvIGluY2x1ZGUgdHJhaWxzIChoYXNoZXMgYW5kIHBhcmFtcywgYXMgZGV0ZXJtaW5lZCBieSBhXG4gICAgLy8gZnVuY2l0b24gcGFyYW0pLCB0aGVuIGFkZCB0aGVtIHRvIHRoZSBVUkwuXG4gICAgaWYoIGluY2x1ZGVUcmFpbHMgKSB7XG4gICAgICAvLyBBcHBlbmQgYW55IHBhcmFtc1xuICAgICAgaWYoIHR5cGVvZiBwYXJhbXMgPT0gJ3N0cmluZycgKSB7XG4gICAgICAgIHJ0blVSTCArPSBwYXJhbXM7XG4gICAgICB9XG4gICAgICAgIC8vIEFwcGVuZCBhbnkgaGFzaGVzXG4gICAgICBpZiggdHlwZW9mIGhhc2hiYW5nID09ICdzdHJpbmcnICkge1xuICAgICAgICBydG5VUkwgKz0gaGFzaGJhbmc7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHJ0blVSTDtcbiAgfVxuXG4gIC8qKlxuICAgKiBMaXN0ZW5lciBmb3IgdGhlIHBvcHN0YXRlIG1ldGhvZFxuICAgKlxuICAgKiBAcHJpdmF0ZVxuICAgKiBAcGFyYW0gIHtvYmplY3R9IGUgdGhlIHBhc3NlZCBldmVudCBvYmplY3RcbiAgICogQHJldHVybiB2b2lkXG4gICAqL1xuICBzdGF0aWMgX3BvcHN0YXRlKGUpIHtcbiAgICB2YXIgYmFzZSwgc3RhdGU7XG4gICAgY29uc29sZS5sb2coZSk7XG4gICAgaWYodGhpcy5zdXBwb3J0KVxuICAgIHtcbiAgICAgIHN0YXRlID0gKGJhc2UgPSB0aGlzLmhpc3RvcnkpLnN0YXRlIHx8IChiYXNlLnN0YXRlID0gZS5zdGF0ZSB8fCAoZS5zdGF0ZSA9IHdpbmRvdy5ldmVudC5zdGF0ZSkpO1xuICAgICAgY29uc29sZS5sb2coc3RhdGUpO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXJzIGFuZCBzZXR0ZXJzXG4gICAqL1xuXG4gIC8qKlxuICAgKiAoZ2V0dGVyL3NldHRlcikgU2V0cyB0aGUgZG9jdW1lbnQgcm9vdCBmcm9tIGEgcGFzc2VkIFVSTFxuICAgKiByZXR1cm5zIHRoZSBzYXZlZCBkb2N1bWVudCByb290IG9yIGEgYC9gIGlmIG5vdCBzZXRcbiAgICpcbiAgICogQGRlZmF1bHQgJy8nXG4gICAqIEB0eXBlIHtzdHJpbmd9XG4gICAqL1xuICBzdGF0aWMgc2V0IGRvY3VtZW50Um9vdChkb2N1bWVudFJvb3QgPSAnJykge1xuXG4gICAgLyoqXG4gICAgICogZG9jcm9vdFJlZ2V4IHdvcmtzIGxpa2UgdGhpczpcbiAgICAgKiBgYGBcbiAgICAgICAgIF5cbiAgICAgICAgIChbXjpdKzovLyAgICAgICAjIEhUVFAoUykgZXRjLlxuICAgICAgICAgICAgIChbXi9dKykgICAgICMgVGhlIGhvc3RuYW1lIChpZiBhdmFpbGFibGUpXG4gICAgICAgICApP1xuICAgICAgICAgLz9cbiAgICAgICAgICguKig/PS8pKT8gICAgICAjIHRoZSBVUkkgdG8gdXNlIGFzIHRoZSBkb2Nyb290IGxlc3MgYW55IGF2YWlsYWJsZSB0cmFpbGluZyBzbGFzaFxuICAgICAqIGBgYFxuICAgICAqL1xuICAgIGNvbnN0IGRvY3Jvb3RSZWdleCA9IC9eKFteOl0rOlxcL1xcLyhbXlxcL10rKSk/XFwvPyguKig/PVxcLykpPy87XG4gICAgLy8gcGFzcyB0aGUgZG9jcm9vdCBhbmQgaG9zdG5hbWVcbiAgICBjb25zdCBbXzEsIF8yLCBob3N0bmFtZSwgZG9jcm9vdF0gPSBkb2Nyb290UmVnZXguZXhlYyhkb2N1bWVudFJvb3QpO1xuXG4gICAgLy8gRXJyb3IgY2hlY2tcbiAgICAvLyBjaGVjayBmb3IgdGhlIHByZXNlbmNlIG9mIHRoZSByZXBvcnRlZCBUTEROXG4gICAgaWYoXG4gICAgICB0eXBlb2YgaG9zdG5hbWUgPT09ICdzdHJpbmcnICYmXG4gICAgICBob3N0bmFtZSAhPSB0aGlzLlRMRE4gJiZcbiAgICAgIHRoaXMub2JzZXJ2ZVRMRE4gPT09IHRydWVcbiAgICApIHtcbiAgICAgIHRocm93IG5ldyBVUklFcnJvcignVG9wIExldmVsIGRvbWFpbiBuYW1lIE1VU1QgbWF0Y2ggdGhlIHByaW1hcnkgZG9tYWluIG5hbWUnKTtcbiAgICB9XG5cbiAgICB0aGlzLl9kb2N1bWVudFJvb3QgPSBgLyR7ZG9jcm9vdH1gO1xuICB9XG4gIHN0YXRpYyBnZXQgZG9jdW1lbnRSb290KCkge1xuICAgIHJldHVybiB0aGlzLl9kb2N1bWVudFJvb3QgfHwgJy8nO1xuICB9XG5cbiAgLyoqXG4gICAqIChnZXR0ZXIvc2V0dGVyKSBQcm92aWRlcyBhbiBlcnJvciBpZiB0aGUgdXNlciB0cmllcyB0byBzZXQgdGhlIGhpc3Rvcnkgb2JqZWN0XG4gICAqIHJldHVybnMgdGhlIHdpbmRvdyBoaXN0b3J5IG9iamVjdFxuICAgKlxuICAgKiBAdHlwZSB7b2JqZWN0fVxuICAgKi9cbiAgc3RhdGljIHNldCBoaXN0b3J5KGhpc3RvcnkpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ1RoZSBoaXN0b3J5IG9iamVjdCBpcyByZWFkIG9ubHknKTtcbiAgfVxuICBzdGF0aWMgZ2V0IGhpc3RvcnkoKSB7XG4gICAgcmV0dXJuIHdpbmRvdy5oaXN0b3J5O1xuICB9XG5cbiAgLyoqXG4gICAqIChnZXR0ZXIvc2V0dGVyKSBTZXRzIHRoZSB0b3AgbGV2ZWwgZG9tYWluIG5hbWUuXG4gICAqIHJldHVybnMgdGhlIHJlY29yZGVkIFRMRE4gb3IsIGJ5IGRlZmF1bHQsIHdpbmRvdy5sb2NhdGlvbi5ob3N0bmFtZS5cbiAgICpcbiAgICogQHR5cGUge3N0cmluZ31cbiAgICovXG4gIHN0YXRpYyBzZXQgVExETihUTEROKSB7XG4gICAgLy8gQG5vdGUgV2Ugc2hvdWxkIGluY2x1ZGUgc29tZSBlcnJvciBjaGVja2luZyBpbiBoZXJlXG4gICAgdGhpcy5fVExETiA9IFRMRE47XG4gIH1cbiAgc3RhdGljIGdldCBUTEROKCkge1xuICAgIHJldHVybiB0aGlzLl9UTEROIHx8IHdpbmRvdy5sb2NhdGlvbi5ob3N0bmFtZTtcbiAgfVxuXG4gIC8qKlxuICAgKiAoZ2V0dGVyL3NldHRlcikgd2hldGhlciB0byBvYnNlcnZlIHRoZSBUTEROIG9yIGB0cnVlYCAoZGVmYXVsdCkuXG4gICAqXG4gICAqIEBkZWZhdWx0IHRydWVcbiAgICogQHR5cGUge2Jvb2xlYW59XG4gICAqL1xuICBzdGF0aWMgc2V0IG9ic2VydmVUTEROKG9ic2VydmUpIHtcbiAgICAvLyBDaGVjayB0byBtYWtlIHN1cmUgdGhhdCB0aGUgYmFzc2VkIHZhbHVlIGlzIG9mIHR5cGUgYm9vbGVhbi5cbiAgICBpZih0eXBlb2Ygb2JzZXJ2ZSA9PT0gJ2Jvb2xlYW4nKVxuICAgIHtcbiAgICAgIHRoaXMuX29ic2VydmVUTEROID0gb2JzZXJ2ZTtcbiAgICB9IGVsc2VcbiAgICB7XG4gICAgICBjb25zb2xlLndhcm4oJ29ic2VydmVUTEROIG11c3QgYmUgb2YgdHlwZSBib29sZWFuJyk7XG4gICAgfVxuICB9XG4gIHN0YXRpYyBnZXQgb2JzZXJ2ZVRMRE4oKSB7XG4gICAgaWYodHlwZW9mIHRoaXMuX29ic2VydmVUTEROID09PSAnYm9vbGVhbicpXG4gICAge1xuICAgICAgcmV0dXJuIHRoaXMuX29ic2VydmVUTEROO1xuICAgIH0gZWxzZVxuICAgIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiAoZ2V0dGVyL3NldHRlcikgV2hldGhlciB0aGlzIGhpc3Rvcnkgb2JqZWN0IGlzIGluIGRldm1vZGUuIERlZmF1bHRzIHRvIGZhbHNlXG4gICAqXG4gICAqIEBkZWZhdWx0IGZhbHNlXG4gICAqIEB0eXBlIHtib29sZWFufVxuICAgKi9cbiAgc3RhdGljIHNldCBkZXZtb2RlKGRldm1vZGUpIHtcbiAgICAvLyBDaGVjayB0byBtYWtlIHN1cmUgdGhhdCB0aGUgYmFzc2VkIHZhbHVlIGlzIG9mIHR5cGUgYm9vbGVhbi5cbiAgICBpZih0eXBlb2YgZGV2bW9kZSA9PT0gJ2Jvb2xlYW4nKVxuICAgIHtcbiAgICAgIHRoaXMuX2Rldm1vZGUgPSBkZXZtb2RlO1xuICAgIH0gZWxzZVxuICAgIHtcbiAgICAgIGNvbnNvbGUud2FybignZGV2bW9kZSBtdXN0IGJlIG9mIHR5cGUgYm9vbGVhbicpO1xuICAgIH1cbiAgfVxuICBzdGF0aWMgZ2V0IGRldm1vZGUoKSB7XG4gICAgaWYodHlwZW9mIHRoaXMuX2Rldm1vZGUgPT09ICdib29sZWFuJylcbiAgICB7XG4gICAgICByZXR1cm4gdGhpcy5fZGV2bW9kZTtcbiAgICB9IGVsc2VcbiAgICB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIChnZXR0ZXIvc2V0dGVyKSBXaGV0aGVyIHRoaXMgaGlzdG9yeSBvYmplY3QgaXMgaW5pdGlhbGlhc2VkLlxuICAgKlxuICAgKiBAZGVmYXVsdCBmYWxzZVxuICAgKiBAdHlwZSB7Ym9vbGVhbn1cbiAgICovXG4gIHN0YXRpYyBzZXQgaW5pdGlhbGlhc2VkKGluaXRpYWxpYXNlZCkge1xuICAgIC8vIENoZWNrIHRvIG1ha2Ugc3VyZSB0aGF0IHRoZSBiYXNzZWQgdmFsdWUgaXMgb2YgdHlwZSBib29sZWFuLlxuICAgIGlmKHR5cGVvZiBpbml0aWFsaWFzZWQgPT09ICdib29sZWFuJylcbiAgICB7XG4gICAgICB0aGlzLl9pbml0aWFsaWFzZWQgPSBpbml0aWFsaWFzZWQ7XG4gICAgfSBlbHNlXG4gICAge1xuICAgICAgY29uc29sZS53YXJuKCdpbml0aWFsaWFzZWQgbXVzdCBiZSBvZiB0eXBlIGJvb2xlYW4nKTtcbiAgICB9XG4gIH1cbiAgc3RhdGljIGdldCBpbml0aWFsaWFzZWQoKSB7XG4gICAgaWYodHlwZW9mIHRoaXMuX2luaXRpYWxpYXNlZCA9PT0gJ2Jvb2xlYW4nKVxuICAgIHtcbiAgICAgIHJldHVybiB0aGlzLl9pbml0aWFsaWFzZWQ7XG4gICAgfSBlbHNlXG4gICAge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiAoZ2V0dGVyL3NldHRlcikgV2hldGhlciBoaXN0b3J5IGlzIHN1cHBvcnRlZCBieSB0aGUgYnJvd3NlciBvciBkZXZpY2UuXG4gICAqIFByb3ZpZGVzIGFuIGVycm9yIGlmIHRoZSB1c2VyIHRyaWVzIHRvIHNldCB0aGUgc3VwcG9ydCB2YWx1ZSwgdW5sZXNzIHRoZSBvYmplY3QgaXMgaW4gZGV2bW9kZVxuICAgKlxuICAgKiBAdHlwZSB7Ym9vbGVhbn1cbiAgICovXG4gIHN0YXRpYyBzZXQgc3VwcG9ydChzdXBwb3J0ID0gZmFsc2UpIHtcbiAgICAvLyBUaGlzIG92ZXJyaWRlc1xuICAgIGlmKCB0aGlzLmRldm1vZGUgJiYgdHlwZW9mIHN1cHBvcnQgPT09ICdib29sZWFuJyApIHtcbiAgICAgIHRoaXMuX3N1cHBvcnQgPSBzdXBwb3J0O1xuICAgIH1cbiAgICB0aHJvdyBuZXcgRXJyb3IoJ1RoZSBzdXBwb3J0IGlzIHJlYWQgb25seScpO1xuICB9XG4gIHN0YXRpYyBnZXQgc3VwcG9ydCgpIHtcbiAgICByZXR1cm4gKHdpbmRvdy5oaXN0b3J5ICYmIHdpbmRvdy5oaXN0b3J5LnB1c2hTdGF0ZSk7XG4gIH1cblxuICAvKipcbiAgICogKGdldHRlci9zZXR0ZXIpIFRoZSBsZW5ndGggb2YgdGhlIGhpc3Rvcnkgc3RhY2tcbiAgICpcbiAgICogQHR5cGUge2ludGVnZXJ9XG4gICAqL1xuICBzdGF0aWMgZ2V0IGxlbmd0aCgpIHtcbiAgICByZXR1cm4gdGhpcy5oaXN0b3J5Lmxlbmd0aDtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBIaXN0b3J5O1xuIl19
