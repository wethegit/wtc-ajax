(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _wtcAjax = require('../src/wtc-ajax');

var _wtcAjax2 = _interopRequireDefault(_wtcAjax);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Initialise the history object in dev mode
_wtcAjax2.default.init(true);
// Set the document root for the application (if necessary)
_wtcAjax2.default.documentRoot = '/demo/';

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

var STATES = {
  'OK': 0,
  'CLICKED': 1,
  'LOADING': 2,
  'TRANSITIONING': 4,
  'LOADED': 8
};

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
     * @static
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
          _this2._triggerAjaxLink(e);

          e.preventDefault();
        });
        console.log(link);
      });
    }

    /**
     * This builds out an AJAX request, normally based on the clicking of a link,
     * but it can alternatively be called directly on the AJAX object.
     *
     * @static
     * @param  {string} URL             The URL to get. This will be parsed into an appropriate fomat by the object.
     * @param  {string} target          The target for the loaded content. This can be a string (selector), or a JSON array of selector strings.
     * @param  {string} selection       This is a selector (or JSON of selectors) that determines what to cut from the loaded content.
     * @param  {object} [data = {}]       The data to pass to the AJAX call.
     * @param  {function} [onload]        The onload function to run (TBI).
     * @param  {object} [onloadcontext]   The context under which to run the onload function.
     */

  }, {
    key: 'ajaxGet',
    value: function ajaxGet(URL, target, selection) {
      var data = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

      var _this3 = this;

      var onload = arguments[4];
      var onloadcontext = arguments[5];


      if (this.state > STATES.CLICKED) {
        if (this.devmode) {
          console.warn("Tried run an AJAX GET when the object wasn't in OK or CLICKED mode");
        }

        return;
      }

      console.log('-----------');
      var req = this.requestObject;
      var parsedURL = this._fixURL(URL);

      console.log('-----------');

      var readyState = 0;
      var status = 0;

      req.addEventListener('readystatechange', function (e) {
        readyState = e.target.readyState;
        status = e.target.status;
      });

      req.addEventListener('load', function (e) {
        if (req.status >= 200 && req.status < 400) {
          _this3._parseResponse(req.responseText, target, selection, onload, onloadcontext);
        } else {
          _this3._error(readyState, req.status);
        }
      });

      req.addEventListener('error', function (e) {
        _this3._error(readyState, status);
      });

      // Save the last parsed URL for the purpose of history interoperability and error correction.
      this.lastParsedURL = parsedURL;

      req.open('GET', parsedURL, true);
      req.send(data);

      // Set the object state
      this.state = STATES.LOADING;

      return req;
    }

    /**
     * Private methods
     */

    /**
     * Trigger an ajax link as determined by a click callback. This should only ever be called
     * from a click event as added via the AJAX object or a child thererof.
     *
     * @static
     * @private
     * @param  {object} e the event object passed from the click event.
     */

  }, {
    key: '_triggerAjaxLink',
    value: function _triggerAjaxLink(e) {
      if (this.state != STATES.OK) {
        if (this.devmode) {
          console.warn("Tried to click an AJAX link when the object wasn't in OK mode");
        }

        return;
      }

      // Find all of the relevant atteibutes
      var link = e.target;
      var href = link.getAttribute('href');
      var target = link.getAttribute(this.attributeTarget);
      var selection = link.getAttribute(this.attributeSelection);

      // Set the object state
      this.state = STATES.CLICKED;

      this.ajaxGet(href, target, selection);
    }

    /**
     * This responds to the ajax load event and is responsible for building the result,
     * injecting it into the page, running callbacks and detecting and delaying
     * transitions and animations as necessary/
     *
     * @static
     * @private
     * @param  {string} content         The loaded page content, this comes from the AJAX call.
     * @param  {string} target          The target for the loaded content. This can be a string (selector), or a JSON array of selector strings.
     * @param  {string} selection       This is a selector (or JSON of selectors) that determines what to cut from the loaded content.
     * @param  {function} [onload]        The onload function to run (TBI).
     * @param  {object} [onloadcontext]   The context under which to run the onload function.
     */

  }, {
    key: '_parseResponse',
    value: function _parseResponse(content, target, selection, onload, onloadcontext) {

      var doc,
          results,
          oldTitle = document.title,
          newTitle,
          targetNodes = document.querySelectorAll(target);

      // Parse the document from the content provided
      doc = document.createElement('div');
      doc.innerHTML = content;

      // Find the new page title
      newTitle = doc.getElementsByTagName('title')[0].text;

      // Find the results of the selection
      // N.B. This will all need to be updated to support the array syntax
      results = doc.querySelectorAll(selection);

      // I need to add a tonne of things here, like support for transition off etc.
      // Currently I'm just statically removing and adding in elements.
      targetNodes.forEach(function (el) {
        el.innerHTML = '';

        console.log(el);

        results.forEach(function (result) {
          el.appendChild(result.cloneNode(true));
        });
      });

      // Update the internal reference to the last target
      this.lastChangedTarget = target;

      // Push the new state to the history.
      this.push(this.lastParsedURL, newTitle, { target: target, selection: selection, onload: onload, onloadcontext: onloadcontext });

      // Set the object state
      this.state = STATES.OK;
    }

    /**
     * Trigger an error log
     *
     * @static
     * @private
     * @param  {type} readyState description
     * @param  {type} status     description
     * @return {type}            description
     */

  }, {
    key: '_error',
    value: function _error(readyState, status) {
      console.warn('%c Error loading AJAX link. readyState: ' + readyState + '. status: ' + status, 'background: #222; color: #ff7c3a');
    }

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

    /**
     * returns a new last changed target. This is used to determine what to changed
     * when navigating back via history.
     *
     * @return {object}  either an array of nodes or a single node.
     * @default null
     */

  }, {
    key: 'lastChangedTarget',
    set: function set(target) {
      this._lastChangedTarget = target;
    },
    get: function get() {
      return this._lastChangedTarget || null;
    }

    /**
     * The state that the AJAX object is in, as determined from a list of constants:
     * - OK             Idle, ready for a state load.
     * - CLICKED        Clicked, but not yet fired.
     * - LOADING        Loading page.
     * - TRANSITIONING  Transitioning state
     * - LOADED         Content loaded.
     *
     * @return {integer}  The state that the object is in. Compare to the state object for description
     * @default STATE.OK
     */

  }, {
    key: 'state',
    set: function set(state) {
      if (typeof state === 'string') {
        if (STATES[state] !== undefined) {
          this._state = STATES[state];
          return;
        }
      } else if (typeof state === 'number') {
        for (var _state in STATES) {
          if (STATES[_state] === state) {
            this._state = state;

            if (this.devmode) {
              console.log('%c AJAX state change: ' + this._state + ' ', 'background: #222; color: #bada55');
            }

            return;
          }
        }
      }
      console.warn('state must be one of OK, CLICKED, LOADING, LOADED.');
    },
    get: function get() {
      return this._state || 0;
    }

    /**
     * The last URL to be parsed by the AJAX object. Generally speaking, this is the
     * last URL to be loaded or attempted loaded.
     *
     * @return {string}  The parsed URL string
     * @default null
     */

  }, {
    key: 'lastParsedURL',
    set: function set(parsedURL) {
      if (typeof parsedURL === 'string') {
        this._lastParsedURL = parsedURL;
      }
    },
    get: function get() {
      return this._lastParsedURL || null;
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

      console.log(this.documentRoot, documentRoot, root, path);

      // If we're observing the TLDN restraint and the provided URL doesn't match
      // the domain's TLDN, throw a URIError
      if (typeof hostname === 'string' && hostname !== this.TLDN && this.observeTLDN === true) {
        throw new URIError('Top Level domain name MUST match the primary domain name');
      }

      // If our matched URL has a leading slash, then we want to drop the docRoot
      // in there unless the function param "includeDocRoot" is false.
      if (typeof root === 'string' && root === '/' || typeof documentRoot === 'string' && documentRoot === this.documentRoot) {
        if (includeDocRoot) {
          rtnURL = this.documentRoot + '/' + path;
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
      console.log(e, document.location);
      if (this.support) {
        try {
          state = (base = this.history).state || (base.state = e.state || (e.state = window.event.state));
          return true;
        } catch (e) {
          return false;
        }
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

      console.log(hostname, docroot);

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJkZW1vL3J1bi5qcyIsInNyYy93dGMtYWpheC5qcyIsInNyYy93dGMtaGlzdG9yeS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0FDQUE7Ozs7OztBQUVBO0FBQ0Esa0JBQUssSUFBTCxDQUFVLElBQVY7QUFDQTtBQUNBLGtCQUFLLFlBQUwsR0FBb0IsUUFBcEI7O0FBRUEsU0FBUyxLQUFULENBQWUsRUFBZixFQUFtQjtBQUNqQixNQUFJLFNBQVMsVUFBVCxJQUF1QixTQUEzQixFQUFzQztBQUNwQztBQUNELEdBRkQsTUFFTztBQUNMLGFBQVMsZ0JBQVQsQ0FBMEIsa0JBQTFCLEVBQThDLEVBQTlDO0FBQ0Q7QUFDRjs7QUFFRCxNQUFNLFlBQ047QUFDRSxvQkFBSyxTQUFMO0FBQ0QsQ0FIRDs7QUFLQSxPQUFPLE9BQVA7Ozs7Ozs7Ozs7O0FDcEJBOzs7Ozs7Ozs7Ozs7QUFFQSxJQUFNLFNBQVM7QUFDYixRQUFzQixDQURUO0FBRWIsYUFBc0IsQ0FGVDtBQUdiLGFBQXNCLENBSFQ7QUFJYixtQkFBc0IsQ0FKVDtBQUtiLFlBQXNCO0FBTFQsQ0FBZjs7QUFRQTs7Ozs7Ozs7Ozs7Ozs7SUFhTSxJOzs7Ozs7Ozs7Ozs7O0FBRUo7Ozs7QUFJQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O2dDQW9DK0M7QUFBQTs7QUFBQSxVQUE5QixZQUE4Qix1RUFBZixTQUFTLElBQU07O0FBQzdDLFVBQU0sUUFBUSxhQUFhLGdCQUFiLE9BQWtDLEtBQUssYUFBdkMsY0FBZDs7QUFFQSxZQUFNLE9BQU4sQ0FBYyxVQUFDLElBQUQsRUFBUztBQUNyQjtBQUNBLGFBQUssZUFBTCxDQUFxQixPQUFLLGFBQTFCOztBQUVBLGFBQUssZ0JBQUwsQ0FBc0IsT0FBdEIsRUFBK0IsVUFBQyxDQUFELEVBQU07QUFDbkMsaUJBQUssZ0JBQUwsQ0FBc0IsQ0FBdEI7O0FBRUEsWUFBRSxj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O0FBQ0UsZUFBTyxLQUFLLGFBQVo7QUFDRCxPQUhELE1BSUE7QUFDRSxlQUFPLEtBQVA7QUFDRDtBQUNGOztBQUVEOzs7Ozs7Ozs7d0JBTW9DO0FBQUEsVUFBakIsT0FBaUIsdUVBQVAsS0FBTzs7QUFDbEM7QUFDQSxVQUFJLEtBQUssT0FBTCxJQUFnQixPQUFPLE9BQVAsS0FBbUIsU0FBdkMsRUFBbUQ7QUFDakQsYUFBSyxRQUFMLEdBQWdCLE9BQWhCO0FBQ0Q7QUFDRCxZQUFNLElBQUksS0FBSixDQUFVLDBCQUFWLENBQU47QUFDRCxLO3dCQUNvQjtBQUNuQixhQUFRLE9BQU8sT0FBUCxJQUFrQixPQUFPLE9BQVAsQ0FBZSxTQUF6QztBQUNEOztBQUVEOzs7Ozs7Ozt3QkFLb0I7QUFDbEIsYUFBTyxLQUFLLE9BQUwsQ0FBYSxNQUFwQjtBQUNEOzs7Ozs7a0JBR1ksTyIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJpbXBvcnQgQUpBWCBmcm9tIFwiLi4vc3JjL3d0Yy1hamF4XCI7XG5cbi8vIEluaXRpYWxpc2UgdGhlIGhpc3Rvcnkgb2JqZWN0IGluIGRldiBtb2RlXG5BSkFYLmluaXQodHJ1ZSk7XG4vLyBTZXQgdGhlIGRvY3VtZW50IHJvb3QgZm9yIHRoZSBhcHBsaWNhdGlvbiAoaWYgbmVjZXNzYXJ5KVxuQUpBWC5kb2N1bWVudFJvb3QgPSAnL2RlbW8vJztcblxuZnVuY3Rpb24gcmVhZHkoZm4pIHtcbiAgaWYgKGRvY3VtZW50LnJlYWR5U3RhdGUgIT0gJ2xvYWRpbmcnKSB7XG4gICAgZm4oKTtcbiAgfSBlbHNlIHtcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgZm4pO1xuICB9XG59XG5cbnJlYWR5KGZ1bmN0aW9uKClcbntcbiAgQUpBWC5pbml0TGlua3MoKTtcbn0pO1xuXG53aW5kb3cuQUpBWE9iaiA9IEFKQVg7XG4iLCJpbXBvcnQgSGlzdG9yeSBmcm9tIFwiLi93dGMtaGlzdG9yeVwiO1xuXG5jb25zdCBTVEFURVMgPSB7XG4gICdPSycgICAgICAgICAgICAgICAgOiAwLFxuICAnQ0xJQ0tFRCcgICAgICAgICAgIDogMSxcbiAgJ0xPQURJTkcnICAgICAgICAgICA6IDIsXG4gICdUUkFOU0lUSU9OSU5HJyAgICAgOiA0LFxuICAnTE9BREVEJyAgICAgICAgICAgIDogOFxufVxuXG4vKipcbiAqIEFuIEFKQVggY2xhc3MgdGhhdCBwaWNrcyB1cCBvbiBsaW5rcyBhbmQgdHVybnMgdGhlbSBpbnRvIEFKQVggbGlua3MuXG4gKlxuICogVGhpcyBjbGFzcyBhc3N1bWVzIHRoYXQgeW91IHdhbnQgdG8gcnVuIHlvdXIgQUpBWCB2aWEgaHRtbCBhdHRyaWJ1dGVzIG9uIHlvdXIgbGlua3NcbiAqIGFuZCB0aGF0IHlvdXIgd2Vic2l0ZSBjYW4gcnVuIGp1c3QgYXMgd2VsbCB3aXRob3V0IHRoZXNlIGxpbmtzLiBJdCBzaG91bGQgYWxzb1xuICogcHJvdmlkZSBhZGRpdGlvbmFsIGZ1bmN0aW9uYWxpdHkgdGhhdCBhbGxvd3MgdGhlIGNsYXNzIHRvIHJ1biBwcm9ncmFtYXRpY2FsbHksXG4gKiB0aGVyZWJ5IGdpdmluZyB0aGUgcHJvZ3JhbW1lciB0aGUgYWJpbGl0eSBhbmQgb3B0aW9ucyB0byBjcmVhdGUgdGhlIHdlYnNvdGVcbiAqIGhvd2V2ZXIgdGhleSB3YW50IHRvLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBuYW1lc3BhY2VcbiAqIEBleHRlbmRzIEhpc3RvcnlcbiAqL1xuY2xhc3MgQUpBWCBleHRlbmRzIEhpc3Rvcnkge1xuXG4gIC8qKlxuICAgKiBQdWJsaWMgbWV0aG9kc1xuICAgKi9cblxuICAvKipcbiAgICogSW5pdGlhbGlzZSB0aGUgbGlua3MgaW4gdGhlIGRvY3VtZW50LlxuICAgKlxuICAgKiBUaGlzIHdpbGwgbG9vayB0aHJvdWdoIHRoZSBsaW5rcyBpbiB0aGUgZG9jdW1lbnQgYXMgZGVub3RlZCBieSB0aGUgYXR0cmlidXRlQWpheFxuICAgKiBwcm9wZXJ0eSBhbmQgYXBwbHkgYSBjbGljayBsaXN0ZW5lciB0byBpdCB0aGF0IHdpbGwgYXR0ZW1wdCB0byBkZXRlcm1pbmUgd2hhdFxuICAgKiBhbmQgaG93IHRvIGxvYWQuXG4gICAqXG4gICAqIEEgc2ltcGxlIG1lY2hhbnNpbSBmb3IgdGhpcyB3b3VsZCBiZSBzb21ldGhpbmcgbGlrZTpcbiAgICogYGBgXG4gICAgIDxhIGhyZWY9XCJwYWdlMS5odG1sXCJcbiAgICAgICAgZGF0YS13dGMtYWpheD1cInRydWVcIlxuICAgICAgICBkYXRhLXd0Yy1hamF4LXRhcmdldD0nI2xpbmsyLXRhcmdldCdcbiAgICAgICAgZGF0YS13dGMtYWpheC1zZWxlY3Rpb249XCIubGluazEtc2VsZWN0aW9uXCJcbiAgICAgICAgZGF0YS13dGMtYWpheC1zaG91bGQtbmF2aWdhdGU9XCJmYWxzZVwiPkxpbmsgMTwvYT5cbiAgICogYGBgXG4gICAqXG4gICAqIFRoZSBhZHRyaWJ1dGVzIGVxdWF0ZSBhcyBmb2xsb3dzOlxuICAgKiAtICgqYXR0cmlidXRlQWpheCopICoqZGF0YS13dGMtYWpheCoqXG4gICAqXG4gICAqICAgIERlbm90ZXMgdGhhdCB0aGlzIGxpbmsgaXMgYW4gQUpBWCBsaW5rLlxuICAgKiAtICgqYXR0cmlidXRlVGFyZ2V0KikgKipkYXRhLXd0Yy1hamF4LXRhcmdldCoqXG4gICAqXG4gICAqICAgIERlbm90ZXMgdGhlIHRhcmdldCBpbnRvIHdoaWNoIHRvIGxvYWQgdGhlIHJlc3VsdC4gU2hvdWxkIHRha2UgdGhlIGZvcm0gb2YgYSBzZWxlY3Rvci5cbiAgICogLSAoKmF0dHJpYnV0ZVNlbGVjdGlvbiopICoqZGF0YS13dGMtYWpheC1zZWxlY3Rpb24qKlxuICAgKlxuICAgKiAgICBEZW5vdGVzIHRoZSBzZWxlY3Rpb24gb2YgZGF0YSB0byBwdWxsIGZyb20gdGhlIGxvYWRlZCBkb2N1bWVudC4gU2hvdWxkIHRha2UgdGhlIGZvcm0gb2YgYSBzZWxlY3Rvci5cbiAgICogLSAoKmF0dHJpYnV0ZVNob3VsZE5hdmlnYXRlKikgKipkYXRhLXd0Yy1hamF4LXNob3VsZC1uYXZpZ2F0ZSoqXG4gICAqXG4gICAqICAgICoqVHJ1ZSoqIC8gRmFsc2UgYXMgdG8gd2hldGhlciB0aGUgbGluayBzaG91bGQgdXBkYXRlIHRoZSBoaXN0b3J5IG9iamVjdC4gT25seSBuZWNlc3NhcnkgaWYgZmFsc2UuXG4gICAqXG4gICAqIEluIGFkZGl0aW9uLCAqYXR0cmlidXRlVGFyZ2V0KiBhbmQgKmF0dHJpYnV0ZVNlbGVjdGlvbiogYWNjZXB0IGJhc2ljIEpTT04gc3ludGF4XG4gICAqIHNvIHRoYXQgeW91IGNhbiBsb2FkIG1vbHRpcGxlIHBpZWNlcyBvZiBjb250ZW50IGZyb20gdGhlIHNvdXJjZS5cbiAgICpcbiAgICogQHN0YXRpY1xuICAgKiBAcGFyYW0gIHtET01FbGVtZW50fSByb290RG9jdW1lbnQgIFRoZSBET00gZWxlbWVudCB0byBmaW5kIGxpbmtzIGluLiBEZWZhdWx0cyB0byBib2R5LlxuICAgKi9cbiAgc3RhdGljIGluaXRMaW5rcyhyb290RG9jdW1lbnQgPSBkb2N1bWVudC5ib2R5KSB7XG4gICAgY29uc3QgbGlua3MgPSByb290RG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChgWyR7dGhpcy5hdHRyaWJ1dGVBamF4fT1cInRydWVcIl1gKTtcblxuICAgIGxpbmtzLmZvckVhY2goKGxpbmspPT4ge1xuICAgICAgLy8gUmVtb3ZpbmcgdGhpcyBhdHRyaWJ1dGUgZW5zdXJlcyB0aGF0IHRoaXMgbGluayBkb2Vzbid0IGdldCBhIHNlY29uZCBBSkFYIGxpc3RlbmVyIGF0dGFjaGVkIHRvIGl0LlxuICAgICAgbGluay5yZW1vdmVBdHRyaWJ1dGUodGhpcy5hdHRyaWJ1dGVBamF4KTtcblxuICAgICAgbGluay5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlKT0+IHtcbiAgICAgICAgdGhpcy5fdHJpZ2dlckFqYXhMaW5rKGUpO1xuXG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgIH0pO1xuICAgICAgY29uc29sZS5sb2cobGluayk7XG4gICAgfSk7XG4gIH1cblxuXG4gIC8qKlxuICAgKiBUaGlzIGJ1aWxkcyBvdXQgYW4gQUpBWCByZXF1ZXN0LCBub3JtYWxseSBiYXNlZCBvbiB0aGUgY2xpY2tpbmcgb2YgYSBsaW5rLFxuICAgKiBidXQgaXQgY2FuIGFsdGVybmF0aXZlbHkgYmUgY2FsbGVkIGRpcmVjdGx5IG9uIHRoZSBBSkFYIG9iamVjdC5cbiAgICpcbiAgICogQHN0YXRpY1xuICAgKiBAcGFyYW0gIHtzdHJpbmd9IFVSTCAgICAgICAgICAgICBUaGUgVVJMIHRvIGdldC4gVGhpcyB3aWxsIGJlIHBhcnNlZCBpbnRvIGFuIGFwcHJvcHJpYXRlIGZvbWF0IGJ5IHRoZSBvYmplY3QuXG4gICAqIEBwYXJhbSAge3N0cmluZ30gdGFyZ2V0ICAgICAgICAgIFRoZSB0YXJnZXQgZm9yIHRoZSBsb2FkZWQgY29udGVudC4gVGhpcyBjYW4gYmUgYSBzdHJpbmcgKHNlbGVjdG9yKSwgb3IgYSBKU09OIGFycmF5IG9mIHNlbGVjdG9yIHN0cmluZ3MuXG4gICAqIEBwYXJhbSAge3N0cmluZ30gc2VsZWN0aW9uICAgICAgIFRoaXMgaXMgYSBzZWxlY3RvciAob3IgSlNPTiBvZiBzZWxlY3RvcnMpIHRoYXQgZGV0ZXJtaW5lcyB3aGF0IHRvIGN1dCBmcm9tIHRoZSBsb2FkZWQgY29udGVudC5cbiAgICogQHBhcmFtICB7b2JqZWN0fSBbZGF0YSA9IHt9XSAgICAgICBUaGUgZGF0YSB0byBwYXNzIHRvIHRoZSBBSkFYIGNhbGwuXG4gICAqIEBwYXJhbSAge2Z1bmN0aW9ufSBbb25sb2FkXSAgICAgICAgVGhlIG9ubG9hZCBmdW5jdGlvbiB0byBydW4gKFRCSSkuXG4gICAqIEBwYXJhbSAge29iamVjdH0gW29ubG9hZGNvbnRleHRdICAgVGhlIGNvbnRleHQgdW5kZXIgd2hpY2ggdG8gcnVuIHRoZSBvbmxvYWQgZnVuY3Rpb24uXG4gICAqL1xuICBzdGF0aWMgYWpheEdldChVUkwsIHRhcmdldCwgc2VsZWN0aW9uLCBkYXRhID0ge30sIG9ubG9hZCwgb25sb2FkY29udGV4dCkge1xuXG4gICAgaWYoIHRoaXMuc3RhdGUgPiBTVEFURVMuQ0xJQ0tFRCApXG4gICAge1xuICAgICAgaWYoIHRoaXMuZGV2bW9kZSApXG4gICAgICB7XG4gICAgICAgIGNvbnNvbGUud2FybiggXCJUcmllZCBydW4gYW4gQUpBWCBHRVQgd2hlbiB0aGUgb2JqZWN0IHdhc24ndCBpbiBPSyBvciBDTElDS0VEIG1vZGVcIiApO1xuICAgICAgfVxuXG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc29sZS5sb2coJy0tLS0tLS0tLS0tJyk7XG4gICAgY29uc3QgcmVxID0gdGhpcy5yZXF1ZXN0T2JqZWN0O1xuICAgIGNvbnN0IHBhcnNlZFVSTCA9IHRoaXMuX2ZpeFVSTChVUkwpO1xuXG4gICAgY29uc29sZS5sb2coJy0tLS0tLS0tLS0tJyk7XG5cbiAgICB2YXIgcmVhZHlTdGF0ZSA9IDA7XG4gICAgdmFyIHN0YXR1cyA9IDA7XG5cbiAgICByZXEuYWRkRXZlbnRMaXN0ZW5lcigncmVhZHlzdGF0ZWNoYW5nZScsIChlKSA9PiB7XG4gICAgICByZWFkeVN0YXRlID0gZS50YXJnZXQucmVhZHlTdGF0ZTtcbiAgICAgIHN0YXR1cyA9IGUudGFyZ2V0LnN0YXR1cztcbiAgICB9KTtcblxuICAgIHJlcS5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgKGUpID0+IHtcbiAgICAgIGlmKCByZXEuc3RhdHVzID49IDIwMCAmJiByZXEuc3RhdHVzIDwgNDAwICkge1xuICAgICAgICB0aGlzLl9wYXJzZVJlc3BvbnNlKHJlcS5yZXNwb25zZVRleHQsIHRhcmdldCwgc2VsZWN0aW9uLCBvbmxvYWQsIG9ubG9hZGNvbnRleHQpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLl9lcnJvcihyZWFkeVN0YXRlLCByZXEuc3RhdHVzKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHJlcS5hZGRFdmVudExpc3RlbmVyKCdlcnJvcicsIChlKSA9PiB7XG4gICAgICB0aGlzLl9lcnJvcihyZWFkeVN0YXRlLCBzdGF0dXMpO1xuICAgIH0pO1xuXG4gICAgLy8gU2F2ZSB0aGUgbGFzdCBwYXJzZWQgVVJMIGZvciB0aGUgcHVycG9zZSBvZiBoaXN0b3J5IGludGVyb3BlcmFiaWxpdHkgYW5kIGVycm9yIGNvcnJlY3Rpb24uXG4gICAgdGhpcy5sYXN0UGFyc2VkVVJMID0gcGFyc2VkVVJMO1xuXG4gICAgcmVxLm9wZW4oJ0dFVCcsIHBhcnNlZFVSTCwgdHJ1ZSk7XG4gICAgcmVxLnNlbmQoZGF0YSk7XG5cbiAgICAvLyBTZXQgdGhlIG9iamVjdCBzdGF0ZVxuICAgIHRoaXMuc3RhdGUgPSBTVEFURVMuTE9BRElORztcblxuICAgIHJldHVybiByZXE7XG4gIH1cblxuICAvKipcbiAgICogUHJpdmF0ZSBtZXRob2RzXG4gICAqL1xuXG4gIC8qKlxuICAgKiBUcmlnZ2VyIGFuIGFqYXggbGluayBhcyBkZXRlcm1pbmVkIGJ5IGEgY2xpY2sgY2FsbGJhY2suIFRoaXMgc2hvdWxkIG9ubHkgZXZlciBiZSBjYWxsZWRcbiAgICogZnJvbSBhIGNsaWNrIGV2ZW50IGFzIGFkZGVkIHZpYSB0aGUgQUpBWCBvYmplY3Qgb3IgYSBjaGlsZCB0aGVyZXJvZi5cbiAgICpcbiAgICogQHN0YXRpY1xuICAgKiBAcHJpdmF0ZVxuICAgKiBAcGFyYW0gIHtvYmplY3R9IGUgdGhlIGV2ZW50IG9iamVjdCBwYXNzZWQgZnJvbSB0aGUgY2xpY2sgZXZlbnQuXG4gICAqL1xuICBzdGF0aWMgX3RyaWdnZXJBamF4TGluayhlKSB7XG4gICAgaWYoIHRoaXMuc3RhdGUgIT0gU1RBVEVTLk9LIClcbiAgICB7XG4gICAgICBpZiggdGhpcy5kZXZtb2RlIClcbiAgICAgIHtcbiAgICAgICAgY29uc29sZS53YXJuKCBcIlRyaWVkIHRvIGNsaWNrIGFuIEFKQVggbGluayB3aGVuIHRoZSBvYmplY3Qgd2Fzbid0IGluIE9LIG1vZGVcIiApO1xuICAgICAgfVxuXG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gRmluZCBhbGwgb2YgdGhlIHJlbGV2YW50IGF0dGVpYnV0ZXNcbiAgICBjb25zdCBsaW5rICAgICAgPSBlLnRhcmdldDtcbiAgICBjb25zdCBocmVmICAgICAgPSBsaW5rLmdldEF0dHJpYnV0ZSgnaHJlZicpO1xuICAgIGNvbnN0IHRhcmdldCAgICA9IGxpbmsuZ2V0QXR0cmlidXRlKHRoaXMuYXR0cmlidXRlVGFyZ2V0KTtcbiAgICBjb25zdCBzZWxlY3Rpb24gPSBsaW5rLmdldEF0dHJpYnV0ZSh0aGlzLmF0dHJpYnV0ZVNlbGVjdGlvbik7XG5cbiAgICAvLyBTZXQgdGhlIG9iamVjdCBzdGF0ZVxuICAgIHRoaXMuc3RhdGUgPSBTVEFURVMuQ0xJQ0tFRDtcblxuICAgIHRoaXMuYWpheEdldChocmVmLCB0YXJnZXQsIHNlbGVjdGlvbik7XG4gIH1cblxuICAvKipcbiAgICogVGhpcyByZXNwb25kcyB0byB0aGUgYWpheCBsb2FkIGV2ZW50IGFuZCBpcyByZXNwb25zaWJsZSBmb3IgYnVpbGRpbmcgdGhlIHJlc3VsdCxcbiAgICogaW5qZWN0aW5nIGl0IGludG8gdGhlIHBhZ2UsIHJ1bm5pbmcgY2FsbGJhY2tzIGFuZCBkZXRlY3RpbmcgYW5kIGRlbGF5aW5nXG4gICAqIHRyYW5zaXRpb25zIGFuZCBhbmltYXRpb25zIGFzIG5lY2Vzc2FyeS9cbiAgICpcbiAgICogQHN0YXRpY1xuICAgKiBAcHJpdmF0ZVxuICAgKiBAcGFyYW0gIHtzdHJpbmd9IGNvbnRlbnQgICAgICAgICBUaGUgbG9hZGVkIHBhZ2UgY29udGVudCwgdGhpcyBjb21lcyBmcm9tIHRoZSBBSkFYIGNhbGwuXG4gICAqIEBwYXJhbSAge3N0cmluZ30gdGFyZ2V0ICAgICAgICAgIFRoZSB0YXJnZXQgZm9yIHRoZSBsb2FkZWQgY29udGVudC4gVGhpcyBjYW4gYmUgYSBzdHJpbmcgKHNlbGVjdG9yKSwgb3IgYSBKU09OIGFycmF5IG9mIHNlbGVjdG9yIHN0cmluZ3MuXG4gICAqIEBwYXJhbSAge3N0cmluZ30gc2VsZWN0aW9uICAgICAgIFRoaXMgaXMgYSBzZWxlY3RvciAob3IgSlNPTiBvZiBzZWxlY3RvcnMpIHRoYXQgZGV0ZXJtaW5lcyB3aGF0IHRvIGN1dCBmcm9tIHRoZSBsb2FkZWQgY29udGVudC5cbiAgICogQHBhcmFtICB7ZnVuY3Rpb259IFtvbmxvYWRdICAgICAgICBUaGUgb25sb2FkIGZ1bmN0aW9uIHRvIHJ1biAoVEJJKS5cbiAgICogQHBhcmFtICB7b2JqZWN0fSBbb25sb2FkY29udGV4dF0gICBUaGUgY29udGV4dCB1bmRlciB3aGljaCB0byBydW4gdGhlIG9ubG9hZCBmdW5jdGlvbi5cbiAgICovXG4gIHN0YXRpYyBfcGFyc2VSZXNwb25zZShjb250ZW50LCB0YXJnZXQsIHNlbGVjdGlvbiwgb25sb2FkLCBvbmxvYWRjb250ZXh0KSB7XG5cbiAgICB2YXIgZG9jLCByZXN1bHRzLCBvbGRUaXRsZSA9IGRvY3VtZW50LnRpdGxlLCBuZXdUaXRsZSwgdGFyZ2V0Tm9kZXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKHRhcmdldCk7XG5cbiAgICAvLyBQYXJzZSB0aGUgZG9jdW1lbnQgZnJvbSB0aGUgY29udGVudCBwcm92aWRlZFxuICAgIGRvYyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIGRvYy5pbm5lckhUTUwgPSBjb250ZW50O1xuXG4gICAgLy8gRmluZCB0aGUgbmV3IHBhZ2UgdGl0bGVcbiAgICBuZXdUaXRsZSA9IGRvYy5nZXRFbGVtZW50c0J5VGFnTmFtZSgndGl0bGUnKVswXS50ZXh0O1xuXG4gICAgLy8gRmluZCB0aGUgcmVzdWx0cyBvZiB0aGUgc2VsZWN0aW9uXG4gICAgLy8gTi5CLiBUaGlzIHdpbGwgYWxsIG5lZWQgdG8gYmUgdXBkYXRlZCB0byBzdXBwb3J0IHRoZSBhcnJheSBzeW50YXhcbiAgICByZXN1bHRzID0gZG9jLnF1ZXJ5U2VsZWN0b3JBbGwoc2VsZWN0aW9uKTtcblxuICAgIC8vIEkgbmVlZCB0byBhZGQgYSB0b25uZSBvZiB0aGluZ3MgaGVyZSwgbGlrZSBzdXBwb3J0IGZvciB0cmFuc2l0aW9uIG9mZiBldGMuXG4gICAgLy8gQ3VycmVudGx5IEknbSBqdXN0IHN0YXRpY2FsbHkgcmVtb3ZpbmcgYW5kIGFkZGluZyBpbiBlbGVtZW50cy5cbiAgICB0YXJnZXROb2Rlcy5mb3JFYWNoKChlbCkgPT4ge1xuICAgICAgZWwuaW5uZXJIVE1MID0gJyc7XG5cbiAgICAgIGNvbnNvbGUubG9nKGVsKVxuXG4gICAgICByZXN1bHRzLmZvckVhY2goZnVuY3Rpb24ocmVzdWx0KSB7XG4gICAgICAgIGVsLmFwcGVuZENoaWxkKHJlc3VsdC5jbG9uZU5vZGUodHJ1ZSkpO1xuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICAvLyBVcGRhdGUgdGhlIGludGVybmFsIHJlZmVyZW5jZSB0byB0aGUgbGFzdCB0YXJnZXRcbiAgICB0aGlzLmxhc3RDaGFuZ2VkVGFyZ2V0ID0gdGFyZ2V0O1xuXG4gICAgLy8gUHVzaCB0aGUgbmV3IHN0YXRlIHRvIHRoZSBoaXN0b3J5LlxuICAgIHRoaXMucHVzaCh0aGlzLmxhc3RQYXJzZWRVUkwsIG5ld1RpdGxlLCB7IHRhcmdldDogdGFyZ2V0LCBzZWxlY3Rpb246IHNlbGVjdGlvbiwgb25sb2FkOiBvbmxvYWQsIG9ubG9hZGNvbnRleHQ6IG9ubG9hZGNvbnRleHQgfSk7XG5cbiAgICAvLyBTZXQgdGhlIG9iamVjdCBzdGF0ZVxuICAgIHRoaXMuc3RhdGUgPSBTVEFURVMuT0s7XG4gIH1cblxuICAvKipcbiAgICogVHJpZ2dlciBhbiBlcnJvciBsb2dcbiAgICpcbiAgICogQHN0YXRpY1xuICAgKiBAcHJpdmF0ZVxuICAgKiBAcGFyYW0gIHt0eXBlfSByZWFkeVN0YXRlIGRlc2NyaXB0aW9uXG4gICAqIEBwYXJhbSAge3R5cGV9IHN0YXR1cyAgICAgZGVzY3JpcHRpb25cbiAgICogQHJldHVybiB7dHlwZX0gICAgICAgICAgICBkZXNjcmlwdGlvblxuICAgKi9cbiAgc3RhdGljIF9lcnJvcihyZWFkeVN0YXRlLCBzdGF0dXMpIHtcbiAgICBjb25zb2xlLndhcm4oYCVjIEVycm9yIGxvYWRpbmcgQUpBWCBsaW5rLiByZWFkeVN0YXRlOiAke3JlYWR5U3RhdGV9LiBzdGF0dXM6ICR7c3RhdHVzfWAsICdiYWNrZ3JvdW5kOiAjMjIyOyBjb2xvcjogI2ZmN2MzYScpXG4gIH1cblxuXG4gIC8qKlxuICAgKiBHZXR0ZXJzIGFuZCBzZXR0ZXJzXG4gICAqL1xuXG4gIC8qKlxuICAgKiAoZ2V0dGVyL3NldHRlcikgVGhlIGF0dHJpYnV0ZSB1c2VkIHRvIGRldGVybWluZSB3aGV0aGVyIGEgbGluayBzaG91bGRcbiAgICogYmUgcnVuIHZpYSB0aGUgQUpBWCBjbGFzcy5cbiAgICpcbiAgICogQHR5cGUge3N0cmluZ31cbiAgICogQGRlZmF1bHQgJ2RhdGEtd3RjLWFqYXgnXG4gICAqL1xuICBzdGF0aWMgc2V0IGF0dHJpYnV0ZUFqYXgoYXR0cmlidXRlKSB7XG4gICAgaWYodHlwZW9mIGF0dHJpYnV0ZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgIHRoaXMuX2F0dHJpYnV0ZUFqYXggPSBhdHRyaWJ1dGU7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnNvbGUud2FybignQWxsIGF0dHJpYnV0ZXMgbXVzdCBiZSBzdHJpbmdzLicpO1xuICAgIH1cbiAgfVxuICBzdGF0aWMgZ2V0IGF0dHJpYnV0ZUFqYXgoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2F0dHJpYnV0ZUFqYXggfHwgJ2RhdGEtd3RjLWFqYXgnO1xuICB9XG5cbiAgLyoqXG4gICAqIChnZXR0ZXIvc2V0dGVyKSBUaGUgYXR0cmlidXRlIHVzZWQgdG8gZGV0ZXJtaW5lIHdoZXJlIGEgbGluayBzaG91bGQgcGxhY2UgaXQnc1xuICAgKiByZXN1bHRhbnQgR0VULiBUaGlzIGF0dHJpYnV0ZSBzaG91bGQgYmUgaW4gdGhlIGZvcm0gb2YgYSBzZWxlY3RvciwgaWU6XG4gICAqIGAuYWpheC10YXJnZXRgXG4gICAqXG4gICAqIEB0eXBlIHtzdHJpbmd9XG4gICAqIEBkZWZhdWx0ICdkYXRhLXd0Yy1hamF4LXRhcmdldCdcbiAgICovXG4gIHN0YXRpYyBzZXQgYXR0cmlidXRlVGFyZ2V0KGF0dHJpYnV0ZSkge1xuICAgIGlmKHR5cGVvZiBhdHRyaWJ1dGUgPT09ICdzdHJpbmcnKSB7XG4gICAgICB0aGlzLl9hdHRyaWJ1dGVUYXJnZXQgPSBhdHRyaWJ1dGU7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnNvbGUud2FybignQWxsIGF0dHJpYnV0ZXMgbXVzdCBiZSBzdHJpbmdzLicpO1xuICAgIH1cbiAgfVxuICBzdGF0aWMgZ2V0IGF0dHJpYnV0ZVRhcmdldCgpIHtcbiAgICByZXR1cm4gdGhpcy5fYXR0cmlidXRlVGFyZ2V0IHx8ICdkYXRhLXd0Yy1hamF4LXRhcmdldCc7XG4gIH1cblxuICAvKipcbiAgICogKGdldHRlci9zZXR0ZXIpIFRoZSBhdHRyaWJ1dGUgdXNlZCB0byBzbGljZSB0aGUgcmVzdWx0YW50IEdFVC5cbiAgICogVGhpcyBhdHRyaWJ1dGUgc2hvdWxkIGJlIGluIHRoZSBmb3JtIG9mIGEgc2VsZWN0b3IsIGllOlxuICAgKiBgLmFqYXgtc2VsZWN0aW9uYFxuICAgKlxuICAgKiBAdHlwZSB7c3RyaW5nfVxuICAgKiBAZGVmYXVsdCAnZGF0YS13dGMtYWpheC1zZWxlY3Rpb24nXG4gICAqL1xuICBzdGF0aWMgc2V0IGF0dHJpYnV0ZVNlbGVjdGlvbihhdHRyaWJ1dGUpIHtcbiAgICBpZih0eXBlb2YgYXR0cmlidXRlID09PSAnc3RyaW5nJykge1xuICAgICAgdGhpcy5fYXR0cmlidXRlU2VsZWN0aW9uID0gYXR0cmlidXRlO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zb2xlLndhcm4oJ0FsbCBhdHRyaWJ1dGVzIG11c3QgYmUgc3RyaW5ncy4nKTtcbiAgICB9XG4gIH1cbiAgc3RhdGljIGdldCBhdHRyaWJ1dGVTZWxlY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuX2F0dHJpYnV0ZVNlbGVjdGlvbiB8fCAnZGF0YS13dGMtYWpheC1zZWxlY3Rpb24nO1xuICB9XG5cbiAgLyoqXG4gICAqIChnZXR0ZXIvc2V0dGVyKSBUaGUgYXR0cmlidXRlIHVzZWQgdG8gc2xpY2UgdGhlIHJlc3VsdGFudCBHRVQuXG4gICAqIFRoaXMgYXR0cmlidXRlIHNob3VsZCBiZSBpbiB0aGUgZm9ybSBvZiBhIHNlbGVjdG9yLCBpZTpcbiAgICogYC5hamF4LXNlbGVjdGlvbmBcbiAgICpcbiAgICogQHR5cGUge3N0cmluZ31cbiAgICogQGRlZmF1bHQgJ2RhdGEtd3RjLWFqYXgtc2VsZWN0aW9uJ1xuICAgKi9cbiAgc3RhdGljIHNldCBhdHRyaWJ1dGVTaG91bGROYXZpZ2F0ZShhdHRyaWJ1dGUpIHtcbiAgICBpZih0eXBlb2YgYXR0cmlidXRlID09PSAnc3RyaW5nJykge1xuICAgICAgdGhpcy5fYXR0cmlidXRlU2hvdWxkTmF2aWdhdGUgPSBhdHRyaWJ1dGU7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnNvbGUud2FybignQWxsIGF0dHJpYnV0ZXMgbXVzdCBiZSBzdHJpbmdzLicpO1xuICAgIH1cbiAgfVxuICBzdGF0aWMgZ2V0IGF0dHJpYnV0ZVNob3VsZE5hdmlnYXRlKCkge1xuICAgIHJldHVybiB0aGlzLl9hdHRyaWJ1dGVTaG91bGROYXZpZ2F0ZSB8fCAnZGF0YS13dGMtYWpheC1zaG91bGQtbmF2aWdhdGUnO1xuICB9XG5cbiAgLyoqXG4gICAqIHJldHVybnMgYSBuZXcgcmVxdWVzdE9iamVjdC4gV3JhcHBpbmcgcGxhY2Vob2xkZXIgZm9yIG5vdyB3YWl0aW5nIG9uIGVuaGFuY2VtZW50cy5cbiAgICpcbiAgICogQHJldHVybiB7b2JqZWN0fSAgcmVxdWVzdE9iamVjdFxuICAgKi9cbiAgc3RhdGljIGdldCByZXF1ZXN0T2JqZWN0KCkge1xuICAgIHJldHVybiBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiByZXR1cm5zIGEgbmV3IGxhc3QgY2hhbmdlZCB0YXJnZXQuIFRoaXMgaXMgdXNlZCB0byBkZXRlcm1pbmUgd2hhdCB0byBjaGFuZ2VkXG4gICAqIHdoZW4gbmF2aWdhdGluZyBiYWNrIHZpYSBoaXN0b3J5LlxuICAgKlxuICAgKiBAcmV0dXJuIHtvYmplY3R9ICBlaXRoZXIgYW4gYXJyYXkgb2Ygbm9kZXMgb3IgYSBzaW5nbGUgbm9kZS5cbiAgICogQGRlZmF1bHQgbnVsbFxuICAgKi9cbiAgc3RhdGljIHNldCBsYXN0Q2hhbmdlZFRhcmdldCh0YXJnZXQpIHtcbiAgICB0aGlzLl9sYXN0Q2hhbmdlZFRhcmdldCA9IHRhcmdldDtcbiAgfVxuICBzdGF0aWMgZ2V0IGxhc3RDaGFuZ2VkVGFyZ2V0KCkge1xuICAgIHJldHVybiB0aGlzLl9sYXN0Q2hhbmdlZFRhcmdldCB8fCBudWxsO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoZSBzdGF0ZSB0aGF0IHRoZSBBSkFYIG9iamVjdCBpcyBpbiwgYXMgZGV0ZXJtaW5lZCBmcm9tIGEgbGlzdCBvZiBjb25zdGFudHM6XG4gICAqIC0gT0sgICAgICAgICAgICAgSWRsZSwgcmVhZHkgZm9yIGEgc3RhdGUgbG9hZC5cbiAgICogLSBDTElDS0VEICAgICAgICBDbGlja2VkLCBidXQgbm90IHlldCBmaXJlZC5cbiAgICogLSBMT0FESU5HICAgICAgICBMb2FkaW5nIHBhZ2UuXG4gICAqIC0gVFJBTlNJVElPTklORyAgVHJhbnNpdGlvbmluZyBzdGF0ZVxuICAgKiAtIExPQURFRCAgICAgICAgIENvbnRlbnQgbG9hZGVkLlxuICAgKlxuICAgKiBAcmV0dXJuIHtpbnRlZ2VyfSAgVGhlIHN0YXRlIHRoYXQgdGhlIG9iamVjdCBpcyBpbi4gQ29tcGFyZSB0byB0aGUgc3RhdGUgb2JqZWN0IGZvciBkZXNjcmlwdGlvblxuICAgKiBAZGVmYXVsdCBTVEFURS5PS1xuICAgKi9cbiAgc3RhdGljIHNldCBzdGF0ZShzdGF0ZSkge1xuICAgIGlmKCB0eXBlb2Ygc3RhdGUgPT09ICdzdHJpbmcnICkge1xuICAgICAgaWYoIFNUQVRFU1tzdGF0ZV0gIT09IHVuZGVmaW5lZCApIHtcbiAgICAgICAgdGhpcy5fc3RhdGUgPSBTVEFURVNbc3RhdGVdO1xuICAgICAgICByZXR1cm5cbiAgICAgIH1cbiAgICB9IGVsc2UgaWYoIHR5cGVvZiBzdGF0ZSA9PT0gJ251bWJlcicgKSB7XG4gICAgICBmb3IodmFyIF9zdGF0ZSBpbiBTVEFURVMpIHtcbiAgICAgICAgaWYoU1RBVEVTW19zdGF0ZV0gPT09IHN0YXRlKSB7XG4gICAgICAgICAgdGhpcy5fc3RhdGUgPSBzdGF0ZTtcblxuICAgICAgICAgIGlmKCB0aGlzLmRldm1vZGUgKVxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGAlYyBBSkFYIHN0YXRlIGNoYW5nZTogJHt0aGlzLl9zdGF0ZX0gYCwgJ2JhY2tncm91bmQ6ICMyMjI7IGNvbG9yOiAjYmFkYTU1Jyk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIGNvbnNvbGUud2Fybignc3RhdGUgbXVzdCBiZSBvbmUgb2YgT0ssIENMSUNLRUQsIExPQURJTkcsIExPQURFRC4nKTtcbiAgfVxuICBzdGF0aWMgZ2V0IHN0YXRlKCkge1xuICAgIHJldHVybiB0aGlzLl9zdGF0ZSB8fCAwO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoZSBsYXN0IFVSTCB0byBiZSBwYXJzZWQgYnkgdGhlIEFKQVggb2JqZWN0LiBHZW5lcmFsbHkgc3BlYWtpbmcsIHRoaXMgaXMgdGhlXG4gICAqIGxhc3QgVVJMIHRvIGJlIGxvYWRlZCBvciBhdHRlbXB0ZWQgbG9hZGVkLlxuICAgKlxuICAgKiBAcmV0dXJuIHtzdHJpbmd9ICBUaGUgcGFyc2VkIFVSTCBzdHJpbmdcbiAgICogQGRlZmF1bHQgbnVsbFxuICAgKi9cbiAgc3RhdGljIHNldCBsYXN0UGFyc2VkVVJMKHBhcnNlZFVSTCkge1xuICAgIGlmKCB0eXBlb2YgcGFyc2VkVVJMID09PSAnc3RyaW5nJyApIHtcbiAgICAgIHRoaXMuX2xhc3RQYXJzZWRVUkwgPSBwYXJzZWRVUkw7XG4gICAgfVxuICB9XG4gIHN0YXRpYyBnZXQgbGFzdFBhcnNlZFVSTCgpIHtcbiAgICByZXR1cm4gdGhpcy5fbGFzdFBhcnNlZFVSTCB8fCBudWxsO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IEFKQVg7XG4iLCIvKipcbiAqIENsYXNzIHJlcHJlc2VudGluZyBhbiBhYnN0cmFjdGlvbiBvZiB0aGUgaGlzdG9yeSBBUEkuXG4gKiBAc3RhdGljXG4gKiBAbmFtZXNwYWNlXG4gKi9cbmNsYXNzIEhpc3Rvcnkge1xuXG4gIC8qKlxuICAgKiBQdWJsaWMgbWV0aG9kc1xuICAgKi9cblxuICAvKipcbiAgICAqIEluaXRpYWxpc2VzIHRoZSBIaXN0b3J5IGNsYXNzLiBOb3RoaW5nIHNob3VsZCBiZSBhYmxlIHRvXG4gICAgKiBvcGVyYXRlIGhlcmUgdW5sZXNzIHRoaXMgaGFzIHJ1biB3aXRoIGEgc3VwcG9ydCA9IHRydWUuXG4gICAgKlxuICAgICogQFB1YmxpY1xuICAgICogQHJldHVybiB7Ym9vbGVhbn0gICAgICAgICBSZXR1cm5zIHdoZXRoZXIgaW5pdCByYW4gb3Igbm90XG4gICAgKi9cbiAgc3RhdGljIGluaXQoZGV2bW9kZSA9IGZhbHNlKSB7XG4gICAgaWYodGhpcy5zdXBwb3J0KVxuICAgIHtcbiAgICAgIC8vIFRyeSB0byBzZXQgZXZlcnl0aGluZyB1cCwgYW5kIGlmIHdlIGZhaWwgdGhlbiByZXR1cm4gZmFsc2VcbiAgICAgIHRyeSB7XG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdwb3BzdGF0ZScsIChlKT0+IHtcbiAgICAgICAgICB2YXIgaGFzUG9wcGVkU3RhdGUgPSB0aGlzLl9wb3BzdGF0ZShlKTtcbiAgICAgICAgICByZXR1cm4gaGFzUG9wcGVkU3RhdGU7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMuZGV2bW9kZSAgICAgID0gZGV2bW9kZTtcblxuICAgICAgfSBjYXRjaCAoZSkge1xuXG4gICAgICAgIC8vIElmIHdlJ3JlIGluIGRldm1vZGUsIHNlbmQgb3VyIGNvbnNvbGUgb3V0cHV0XG4gICAgICAgIGlmKHRoaXMuZGV2bW9kZSkge1xuICAgICAgICAgIGNvbnNvbGUud2FybignZXJyb3IgaW4gaGlzdG9yeSBpbml0aWFsaXNhdGlvbicpO1xuICAgICAgICAgIGNvbnNvbGUubG9nKGUpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuXG4gICAgICB0aGlzLmluaXRpYWxpc2VkID0gdHJ1ZTtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDb25zdHJ1Y3QgYW5kIHB1c2ggYSBVUkwgc3RhdGVcbiAgICpcbiAgICogQHB1YmxpY1xuICAgKiBAcGFyYW0gIHtzdHJpbmd9IFVSTCAgICAgICAgICAgVGhlIFVSTCB0byBwdXNoLCBjYW4gYmUgcmVsYXRpdmUsIGFic29sdXRlIG9yIGZ1bGxcbiAgICogQHBhcmFtICB7c3RyaW5nfSB0aXRsZSAgICAgICAgIFRoZSB0aXRsZSB0byBwdXNoLlxuICAgKiBAcGFyYW0gIHtvYmplY3R9IHN0YXRlT2JqICAgICAgQSBzdGF0ZSB0byBwdXNoIHRvIHRoZSBzdGFjay4gVGhpcyB3aWxsIGJlIHBvcHBlZCB3aGVuIG5hdmlhZ3RpbmcgYmFja1xuICAgKiBAcmV0dXJuIHtib29sZWFufSAgICAgICAgICAgICAgSW5kaWNhdGVzIHdoZXRoZXIgdGhlIHB1c2ggc3VjY2VlZGVkXG4gICAqL1xuICBzdGF0aWMgcHVzaChVUkwsIHRpdGxlID0gJycsIHN0YXRlT2JqID0ge30pIHtcblxuICAgIHZhciBwYXJzZWRVUkwgPSAnJztcblxuICAgIC8vIEZpcnN0IHRyeSB0byBmaXggdGhlIFVSTFxuICAgIHRyeSB7XG4gICAgICBwYXJzZWRVUkwgPSB0aGlzLl9maXhVUkwoVVJMLCB0cnVlLCB0cnVlKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICBpZih0aGlzLmRldm1vZGUpIHtcbiAgICAgICAgY29uc29sZS53YXJuKCdwdXNoIGZhaWxlZCB3aGlsZSB0cnlpbmcgdG8gZml4IHRoZSBVUkwnKTtcbiAgICAgICAgY29uc29sZS5sb2coZSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gZmFsc2VcbiAgICB9XG5cbiAgICAvLyBJZiB3ZSBoYXZlIEFQSSBzdXBwb3J0LCBwdXNoIHRoZSBzdGF0ZSB0byB0aGUgaGlzdG9yeSBvYmplY3RcbiAgICBpZih0aGlzLnN1cHBvcnQpXG4gICAge1xuICAgICAgdHJ5IHtcbiAgICAgICAgdGhpcy5oaXN0b3J5LnB1c2hTdGF0ZShzdGF0ZU9iaiwgdGl0bGUsIHBhcnNlZFVSTCk7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGlmKHRoaXMuZGV2bW9kZSkge1xuICAgICAgICAgIGNvbnNvbGUud2FybigncHVzaCBmYWlsZWQgd2hpbGUgdHJ5aW5nIHRvIHB1c2ggdGhlIHN0YXRlIHRvIHRoZSBoaXN0b3J5IG9iamVjdCcpO1xuICAgICAgICAgIGNvbnNvbGUubG9nKGUpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICAvLyBPdGhlcndpc2VyLCBhZGQgdGhlIFVSTCBhcyBhIGhhc2hiYW5nXG4gICAgfSBlbHNlXG4gICAge1xuICAgICAgd2luZG93LmxvY2F0aW9uLmhhc2ggPSBgIyEke1VSTH1gO1xuICAgIH1cblxuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgLyoqXG4gICAqIFRha2VzIHRoZSB1c2VyIGJhY2sgdG8gdGhlIHByZXZpb3VzIHN0YXRlLiBTaW1wbHkgd3JhcHMgdGhlIGhpc3Rvcnkgb2JqZWN0J3MgYmFjayBtZXRob2QuXG4gICAqXG4gICAqIEBwdWJsaWNcbiAgICovXG4gIHN0YXRpYyBiYWNrKCkge1xuICAgIHRoaXMuaGlzdG9yeS5iYWNrKCk7XG4gIH1cblxuICAvKipcbiAgICogVGFrZXMgdGhlIHVzZXIgZm9yd2FyZCB0byB0aGUgbmV4dCBzdGF0ZS4gU2ltcGx5IHdyYXBzIHRoZSBoaXN0b3J5IG9iamVjdCdzIGZvcndhcmQgbWV0aG9kLlxuICAgKlxuICAgKiBAcHVibGljXG4gICAqL1xuICBzdGF0aWMgZm9yd2FyZCgpIHtcbiAgICB0aGlzLmhpc3RvcnkuZm9yd2FyZCgpO1xuICB9XG5cblxuICAvKipcbiAgICogUHJpdmF0ZSBtZXRob2RzXG4gICAqL1xuXG4gIC8qKlxuICAgKiBUYWtlcyBhIHByb3ZpZGVkIFVSTCBhbmQgcmV0dXJucyB0aGUgdmVyc2lvbiB0aGF0IGlzIHVzYWJsZVxuICAgKlxuICAgKiBAcHJpdmF0ZVxuICAgKiBAcGFyYW0gIHtzdHJpbmd9IFVSTCAgICAgICAgICAgICAgICAgICAgIFRoZSBVUkwgdG8gYmUgcGFzc2VkXG4gICAqIEBwYXJhbSAge2Jvb2xlYW59IGluY2x1ZGVEb2NSb290ID0gdHJ1ZSAgV2hldGhlciB0byBpbmNsdWRlIHRoZSBkb2Nyb290IG9uIHRoZSBwYXNzZWQgVVJMXG4gICAqIEBwYXJhbSAge2Jvb2xlYW59IGluY2x1ZGVUcmFpbHMgPSB0cnVlICAgV2hldGhlciB0byBpbmNsdWRlIGZvdW5kIGhhc2hlcyBhbmQgcGFyYW1zXG4gICAqIEByZXR1cm4ge3N0cmluZ30gICAgICAgICAgICAgICAgICAgICAgICAgVGhlIHBhc3NlZCBhbmQgZm9ybWF0dGVkIFVSTFxuICAgKi9cbiAgc3RhdGljIF9maXhVUkwoVVJMLCBpbmNsdWRlRG9jUm9vdCA9IHRydWUsIGluY2x1ZGVUcmFpbHMgPSB0cnVlKSB7XG5cbiAgICB2YXIgcnRuVVJMO1xuXG4gICAgLyoqXG4gICAgICogVVJMIFJlZ2V4IHdvcmtzIGxpa2UgdGhpczpcbiAgICAgKiBgYGBcbiAgICAgICAgXlxuICAgICAgICAoW146XSs6Ly8gICAgICAgICAgICMgSFRUUChTKSBldGMuXG4gICAgICAgICAgICAoW14vXSspICAgICAgICAgIyBUaGUgVVJMIChpZiBhdmFpbGFibGUpXG4gICAgICAgICk/XG4gICAgICAgICgje0Bkb2N1bWVudFJvb3R9KT8gIyBUaGUgZG9jdW1lbnQgcm9vdCwgd2hpY2ggd2Ugd2FudCB0byBnZXQgcmlkIG9mXG4gICAgICAgICgvKT8gICAgICAgICAgICAgICAgIyBjaGVjayBmb3IgdGhlIHByZXNlbmNlIG9mIGEgbGVhZGluZyBzbGFzaFxuICAgICAgICAoW15cXCNcXD9dKikgICAgICAgICAgIyBUaGUgVVJJIC0gdGhpcyBpcyB3aGF0IHdlIGNhcmUgYWJvdXQuIENoZWNrIGZvciBldmVyeXRoaW5nIGV4Y2VwdCBmb3IgIyBhbmQgP1xuICAgICAgICAoXFw/W15cXCNdKik/ICAgICAgICAgIyBhbnkgYWRkaXRpb25hbCBVUkwgcGFyYW1ldGVycyAob3B0aW9uYWwpXG4gICAgICAgIChcXCNcXCE/LispPyAgICAgICAgICAjIEFueSBoYXNoYmFuZyB0cmFpbGVycyAob3B0aW9uYWwpXG4gICAgICogYGBgXG4gICAgICovXG4gICAgY29uc3QgVVJMUmVnZXggPSBSZWdFeHAoYF4oW146XSs6Ly8oW14vXSspKT8oJHt0aGlzLmRvY3VtZW50Um9vdH0pPygvKT8oW15cXFxcI1xcXFw/XSopKFxcXFw/W15cXFxcI10qKT8oXFxcXCNcXFxcIT8uKyk/YCk7XG4gICAgY29uc3QgW2lucHV0LCBocmVmLCBob3N0bmFtZSwgZG9jdW1lbnRSb290LCByb290LCBwYXRoLCBwYXJhbXMsIGhhc2hiYW5nXSA9IFVSTFJlZ2V4LmV4ZWMoVVJMKTtcblxuICAgIGNvbnNvbGUubG9nKHRoaXMuZG9jdW1lbnRSb290LCBkb2N1bWVudFJvb3QsIHJvb3QsIHBhdGgpO1xuXG4gICAgLy8gSWYgd2UncmUgb2JzZXJ2aW5nIHRoZSBUTEROIHJlc3RyYWludCBhbmQgdGhlIHByb3ZpZGVkIFVSTCBkb2Vzbid0IG1hdGNoXG4gICAgLy8gdGhlIGRvbWFpbidzIFRMRE4sIHRocm93IGEgVVJJRXJyb3JcbiAgICBpZiggdHlwZW9mIGhvc3RuYW1lID09PSAnc3RyaW5nJyAmJiBob3N0bmFtZSAhPT0gdGhpcy5UTEROICYmIHRoaXMub2JzZXJ2ZVRMRE4gPT09IHRydWUgKSB7XG4gICAgICB0aHJvdyBuZXcgVVJJRXJyb3IoJ1RvcCBMZXZlbCBkb21haW4gbmFtZSBNVVNUIG1hdGNoIHRoZSBwcmltYXJ5IGRvbWFpbiBuYW1lJyk7XG4gICAgfVxuXG4gICAgLy8gSWYgb3VyIG1hdGNoZWQgVVJMIGhhcyBhIGxlYWRpbmcgc2xhc2gsIHRoZW4gd2Ugd2FudCB0byBkcm9wIHRoZSBkb2NSb290XG4gICAgLy8gaW4gdGhlcmUgdW5sZXNzIHRoZSBmdW5jdGlvbiBwYXJhbSBcImluY2x1ZGVEb2NSb290XCIgaXMgZmFsc2UuXG4gICAgaWYoXG4gICAgICAoIHR5cGVvZiByb290ID09PSAnc3RyaW5nJyAmJiByb290ID09PSAnLycgKSB8fFxuICAgICAgKCB0eXBlb2YgZG9jdW1lbnRSb290ID09PSAnc3RyaW5nJyAmJiBkb2N1bWVudFJvb3QgPT09IHRoaXMuZG9jdW1lbnRSb290IClcbiAgICApIHtcbiAgICAgIGlmKCBpbmNsdWRlRG9jUm9vdCApIHtcbiAgICAgICAgcnRuVVJMID0gYCR7dGhpcy5kb2N1bWVudFJvb3R9LyR7cGF0aH1gO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcnRuVVJMID0gYC8ke3BhdGh9YDtcbiAgICAgIH1cbiAgICAvLyBFbHNlIGlmIHBhdGggaGFzIHJlc3VsdGVkIGluIGFuIGVtcHR5IHN0cmluZywgYXNzdW1lIHRoZSBwYXRoIGlzIHRoZSByb290XG4gICAgfSBlbHNlIGlmKCBwYXRoID09PSAnJyApIHtcbiAgICAgIHJ0blVSTCA9ICcvJ1xuICAgIC8vIE90aGVyd2lzZSwganVzdCBwYXNzIHRoZSBwYXRoIGNvbXBsZXRlbHkuXG4gICAgfSBlbHNlIHtcbiAgICAgIHJ0blVSTCA9IHBhdGg7XG4gICAgfVxuXG4gICAgLy8gSWYgd2Ugd2FudCB0byBpbmNsdWRlIHRyYWlscyAoaGFzaGVzIGFuZCBwYXJhbXMsIGFzIGRldGVybWluZWQgYnkgYVxuICAgIC8vIGZ1bmNpdG9uIHBhcmFtKSwgdGhlbiBhZGQgdGhlbSB0byB0aGUgVVJMLlxuICAgIGlmKCBpbmNsdWRlVHJhaWxzICkge1xuICAgICAgLy8gQXBwZW5kIGFueSBwYXJhbXNcbiAgICAgIGlmKCB0eXBlb2YgcGFyYW1zID09ICdzdHJpbmcnICkge1xuICAgICAgICBydG5VUkwgKz0gcGFyYW1zO1xuICAgICAgfVxuICAgICAgICAvLyBBcHBlbmQgYW55IGhhc2hlc1xuICAgICAgaWYoIHR5cGVvZiBoYXNoYmFuZyA9PSAnc3RyaW5nJyApIHtcbiAgICAgICAgcnRuVVJMICs9IGhhc2hiYW5nO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBydG5VUkw7XG4gIH1cblxuICAvKipcbiAgICogTGlzdGVuZXIgZm9yIHRoZSBwb3BzdGF0ZSBtZXRob2RcbiAgICpcbiAgICogQHByaXZhdGVcbiAgICogQHBhcmFtICB7b2JqZWN0fSBlIHRoZSBwYXNzZWQgZXZlbnQgb2JqZWN0XG4gICAqIEByZXR1cm4gdm9pZFxuICAgKi9cbiAgc3RhdGljIF9wb3BzdGF0ZShlKSB7XG4gICAgdmFyIGJhc2UsIHN0YXRlO1xuICAgIGNvbnNvbGUubG9nKGUsIGRvY3VtZW50LmxvY2F0aW9uKTtcbiAgICBpZih0aGlzLnN1cHBvcnQpXG4gICAge1xuICAgICAgdHJ5IHtcbiAgICAgICAgc3RhdGUgPSAoYmFzZSA9IHRoaXMuaGlzdG9yeSkuc3RhdGUgfHwgKGJhc2Uuc3RhdGUgPSBlLnN0YXRlIHx8IChlLnN0YXRlID0gd2luZG93LmV2ZW50LnN0YXRlKSk7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXJzIGFuZCBzZXR0ZXJzXG4gICAqL1xuXG4gIC8qKlxuICAgKiAoZ2V0dGVyL3NldHRlcikgU2V0cyB0aGUgZG9jdW1lbnQgcm9vdCBmcm9tIGEgcGFzc2VkIFVSTFxuICAgKiByZXR1cm5zIHRoZSBzYXZlZCBkb2N1bWVudCByb290IG9yIGEgYC9gIGlmIG5vdCBzZXRcbiAgICpcbiAgICogQGRlZmF1bHQgJy8nXG4gICAqIEB0eXBlIHtzdHJpbmd9XG4gICAqL1xuICBzdGF0aWMgc2V0IGRvY3VtZW50Um9vdChkb2N1bWVudFJvb3QgPSAnJykge1xuXG4gICAgLyoqXG4gICAgICogZG9jcm9vdFJlZ2V4IHdvcmtzIGxpa2UgdGhpczpcbiAgICAgKiBgYGBcbiAgICAgICAgIF5cbiAgICAgICAgIChbXjpdKzovLyAgICAgICAjIEhUVFAoUykgZXRjLlxuICAgICAgICAgICAgIChbXi9dKykgICAgICMgVGhlIGhvc3RuYW1lIChpZiBhdmFpbGFibGUpXG4gICAgICAgICApP1xuICAgICAgICAgLz9cbiAgICAgICAgICguKig/PS8pKT8gICAgICAjIHRoZSBVUkkgdG8gdXNlIGFzIHRoZSBkb2Nyb290IGxlc3MgYW55IGF2YWlsYWJsZSB0cmFpbGluZyBzbGFzaFxuICAgICAqIGBgYFxuICAgICAqL1xuICAgIGNvbnN0IGRvY3Jvb3RSZWdleCA9IC9eKFteOl0rOlxcL1xcLyhbXlxcL10rKSk/XFwvPyguKig/PVxcLykpPy87XG4gICAgLy8gcGFzcyB0aGUgZG9jcm9vdCBhbmQgaG9zdG5hbWVcbiAgICBjb25zdCBbXzEsIF8yLCBob3N0bmFtZSwgZG9jcm9vdF0gPSBkb2Nyb290UmVnZXguZXhlYyhkb2N1bWVudFJvb3QpO1xuICAgIGNvbnNvbGUubG9nKGhvc3RuYW1lLCBkb2Nyb290KTtcblxuICAgIC8vIEVycm9yIGNoZWNrXG4gICAgLy8gY2hlY2sgZm9yIHRoZSBwcmVzZW5jZSBvZiB0aGUgcmVwb3J0ZWQgVExETlxuICAgIGlmKFxuICAgICAgdHlwZW9mIGhvc3RuYW1lID09PSAnc3RyaW5nJyAmJlxuICAgICAgaG9zdG5hbWUgIT0gdGhpcy5UTEROICYmXG4gICAgICB0aGlzLm9ic2VydmVUTEROID09PSB0cnVlXG4gICAgKSB7XG4gICAgICB0aHJvdyBuZXcgVVJJRXJyb3IoJ1RvcCBMZXZlbCBkb21haW4gbmFtZSBNVVNUIG1hdGNoIHRoZSBwcmltYXJ5IGRvbWFpbiBuYW1lJyk7XG4gICAgfVxuXG4gICAgdGhpcy5fZG9jdW1lbnRSb290ID0gYC8ke2RvY3Jvb3R9YDtcbiAgfVxuICBzdGF0aWMgZ2V0IGRvY3VtZW50Um9vdCgpIHtcbiAgICByZXR1cm4gdGhpcy5fZG9jdW1lbnRSb290IHx8ICcvJztcbiAgfVxuXG4gIC8qKlxuICAgKiAoZ2V0dGVyL3NldHRlcikgUHJvdmlkZXMgYW4gZXJyb3IgaWYgdGhlIHVzZXIgdHJpZXMgdG8gc2V0IHRoZSBoaXN0b3J5IG9iamVjdFxuICAgKiByZXR1cm5zIHRoZSB3aW5kb3cgaGlzdG9yeSBvYmplY3RcbiAgICpcbiAgICogQHR5cGUge29iamVjdH1cbiAgICovXG4gIHN0YXRpYyBzZXQgaGlzdG9yeShoaXN0b3J5KSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdUaGUgaGlzdG9yeSBvYmplY3QgaXMgcmVhZCBvbmx5Jyk7XG4gIH1cbiAgc3RhdGljIGdldCBoaXN0b3J5KCkge1xuICAgIHJldHVybiB3aW5kb3cuaGlzdG9yeTtcbiAgfVxuXG4gIC8qKlxuICAgKiAoZ2V0dGVyL3NldHRlcikgU2V0cyB0aGUgdG9wIGxldmVsIGRvbWFpbiBuYW1lLlxuICAgKiByZXR1cm5zIHRoZSByZWNvcmRlZCBUTEROIG9yLCBieSBkZWZhdWx0LCB3aW5kb3cubG9jYXRpb24uaG9zdG5hbWUuXG4gICAqXG4gICAqIEB0eXBlIHtzdHJpbmd9XG4gICAqL1xuICBzdGF0aWMgc2V0IFRMRE4oVExETikge1xuICAgIC8vIEBub3RlIFdlIHNob3VsZCBpbmNsdWRlIHNvbWUgZXJyb3IgY2hlY2tpbmcgaW4gaGVyZVxuICAgIHRoaXMuX1RMRE4gPSBUTEROO1xuICB9XG4gIHN0YXRpYyBnZXQgVExETigpIHtcbiAgICByZXR1cm4gdGhpcy5fVExETiB8fCB3aW5kb3cubG9jYXRpb24uaG9zdG5hbWU7XG4gIH1cblxuICAvKipcbiAgICogKGdldHRlci9zZXR0ZXIpIHdoZXRoZXIgdG8gb2JzZXJ2ZSB0aGUgVExETiBvciBgdHJ1ZWAgKGRlZmF1bHQpLlxuICAgKlxuICAgKiBAZGVmYXVsdCB0cnVlXG4gICAqIEB0eXBlIHtib29sZWFufVxuICAgKi9cbiAgc3RhdGljIHNldCBvYnNlcnZlVExETihvYnNlcnZlKSB7XG4gICAgLy8gQ2hlY2sgdG8gbWFrZSBzdXJlIHRoYXQgdGhlIGJhc3NlZCB2YWx1ZSBpcyBvZiB0eXBlIGJvb2xlYW4uXG4gICAgaWYodHlwZW9mIG9ic2VydmUgPT09ICdib29sZWFuJylcbiAgICB7XG4gICAgICB0aGlzLl9vYnNlcnZlVExETiA9IG9ic2VydmU7XG4gICAgfSBlbHNlXG4gICAge1xuICAgICAgY29uc29sZS53YXJuKCdvYnNlcnZlVExETiBtdXN0IGJlIG9mIHR5cGUgYm9vbGVhbicpO1xuICAgIH1cbiAgfVxuICBzdGF0aWMgZ2V0IG9ic2VydmVUTEROKCkge1xuICAgIGlmKHR5cGVvZiB0aGlzLl9vYnNlcnZlVExETiA9PT0gJ2Jvb2xlYW4nKVxuICAgIHtcbiAgICAgIHJldHVybiB0aGlzLl9vYnNlcnZlVExETjtcbiAgICB9IGVsc2VcbiAgICB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogKGdldHRlci9zZXR0ZXIpIFdoZXRoZXIgdGhpcyBoaXN0b3J5IG9iamVjdCBpcyBpbiBkZXZtb2RlLiBEZWZhdWx0cyB0byBmYWxzZVxuICAgKlxuICAgKiBAZGVmYXVsdCBmYWxzZVxuICAgKiBAdHlwZSB7Ym9vbGVhbn1cbiAgICovXG4gIHN0YXRpYyBzZXQgZGV2bW9kZShkZXZtb2RlKSB7XG4gICAgLy8gQ2hlY2sgdG8gbWFrZSBzdXJlIHRoYXQgdGhlIGJhc3NlZCB2YWx1ZSBpcyBvZiB0eXBlIGJvb2xlYW4uXG4gICAgaWYodHlwZW9mIGRldm1vZGUgPT09ICdib29sZWFuJylcbiAgICB7XG4gICAgICB0aGlzLl9kZXZtb2RlID0gZGV2bW9kZTtcbiAgICB9IGVsc2VcbiAgICB7XG4gICAgICBjb25zb2xlLndhcm4oJ2Rldm1vZGUgbXVzdCBiZSBvZiB0eXBlIGJvb2xlYW4nKTtcbiAgICB9XG4gIH1cbiAgc3RhdGljIGdldCBkZXZtb2RlKCkge1xuICAgIGlmKHR5cGVvZiB0aGlzLl9kZXZtb2RlID09PSAnYm9vbGVhbicpXG4gICAge1xuICAgICAgcmV0dXJuIHRoaXMuX2Rldm1vZGU7XG4gICAgfSBlbHNlXG4gICAge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiAoZ2V0dGVyL3NldHRlcikgV2hldGhlciB0aGlzIGhpc3Rvcnkgb2JqZWN0IGlzIGluaXRpYWxpYXNlZC5cbiAgICpcbiAgICogQGRlZmF1bHQgZmFsc2VcbiAgICogQHR5cGUge2Jvb2xlYW59XG4gICAqL1xuICBzdGF0aWMgc2V0IGluaXRpYWxpYXNlZChpbml0aWFsaWFzZWQpIHtcbiAgICAvLyBDaGVjayB0byBtYWtlIHN1cmUgdGhhdCB0aGUgYmFzc2VkIHZhbHVlIGlzIG9mIHR5cGUgYm9vbGVhbi5cbiAgICBpZih0eXBlb2YgaW5pdGlhbGlhc2VkID09PSAnYm9vbGVhbicpXG4gICAge1xuICAgICAgdGhpcy5faW5pdGlhbGlhc2VkID0gaW5pdGlhbGlhc2VkO1xuICAgIH0gZWxzZVxuICAgIHtcbiAgICAgIGNvbnNvbGUud2FybignaW5pdGlhbGlhc2VkIG11c3QgYmUgb2YgdHlwZSBib29sZWFuJyk7XG4gICAgfVxuICB9XG4gIHN0YXRpYyBnZXQgaW5pdGlhbGlhc2VkKCkge1xuICAgIGlmKHR5cGVvZiB0aGlzLl9pbml0aWFsaWFzZWQgPT09ICdib29sZWFuJylcbiAgICB7XG4gICAgICByZXR1cm4gdGhpcy5faW5pdGlhbGlhc2VkO1xuICAgIH0gZWxzZVxuICAgIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogKGdldHRlci9zZXR0ZXIpIFdoZXRoZXIgaGlzdG9yeSBpcyBzdXBwb3J0ZWQgYnkgdGhlIGJyb3dzZXIgb3IgZGV2aWNlLlxuICAgKiBQcm92aWRlcyBhbiBlcnJvciBpZiB0aGUgdXNlciB0cmllcyB0byBzZXQgdGhlIHN1cHBvcnQgdmFsdWUsIHVubGVzcyB0aGUgb2JqZWN0IGlzIGluIGRldm1vZGVcbiAgICpcbiAgICogQHR5cGUge2Jvb2xlYW59XG4gICAqL1xuICBzdGF0aWMgc2V0IHN1cHBvcnQoc3VwcG9ydCA9IGZhbHNlKSB7XG4gICAgLy8gVGhpcyBvdmVycmlkZXNcbiAgICBpZiggdGhpcy5kZXZtb2RlICYmIHR5cGVvZiBzdXBwb3J0ID09PSAnYm9vbGVhbicgKSB7XG4gICAgICB0aGlzLl9zdXBwb3J0ID0gc3VwcG9ydDtcbiAgICB9XG4gICAgdGhyb3cgbmV3IEVycm9yKCdUaGUgc3VwcG9ydCBpcyByZWFkIG9ubHknKTtcbiAgfVxuICBzdGF0aWMgZ2V0IHN1cHBvcnQoKSB7XG4gICAgcmV0dXJuICh3aW5kb3cuaGlzdG9yeSAmJiB3aW5kb3cuaGlzdG9yeS5wdXNoU3RhdGUpO1xuICB9XG5cbiAgLyoqXG4gICAqIChnZXR0ZXIvc2V0dGVyKSBUaGUgbGVuZ3RoIG9mIHRoZSBoaXN0b3J5IHN0YWNrXG4gICAqXG4gICAqIEB0eXBlIHtpbnRlZ2VyfVxuICAgKi9cbiAgc3RhdGljIGdldCBsZW5ndGgoKSB7XG4gICAgcmV0dXJuIHRoaXMuaGlzdG9yeS5sZW5ndGg7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgSGlzdG9yeTtcbiJdfQ==
