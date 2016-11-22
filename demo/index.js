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

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

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

var SELECTORS = {
  'CHILDREN': 0 // This indicates that the selection should be all children. This assumes that we have a valid target to work with.
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
     * @param  {string} URL               The URL to get. This will be parsed into an appropriate fomat by the object.
     * @param  {string} target            The target for the loaded content. This can be a string (selector), or a JSON array of selector strings.
     * @param  {string} selection         This is a selector (or JSON of selectors) that determines what to cut from the loaded content.
     * @param  {boolean} fromPop          Indicates that this GET is from a pop
     * @param  {object} [data = {}]       The data to pass to the AJAX call.
     * @param  {function} [onload]        The onload function to run (TBI).
     * @param  {object} [onloadcontext]   The context under which to run the onload function.
     */

  }, {
    key: 'ajaxGet',
    value: function ajaxGet(URL, target, selection) {
      var fromPop = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
      var data = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};

      var _this3 = this;

      var onload = arguments[5];
      var onloadcontext = arguments[6];


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
          _this3._parseResponse(req.responseText, target, selection, fromPop, onload, onloadcontext);
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
     * Listener for the popstate method
     *
     * @private
     * @param  {object} e the passed event object
     * @return void
     */

  }, {
    key: '_popstate',
    value: function _popstate(e) {
      var base,
          state = {};
      var hasPoppedState = _get(AJAX.__proto__ || Object.getPrototypeOf(AJAX), '_popstate', this).call(this, e);

      if (hasPoppedState) {
        state = (base = this.history).state || (base.state = e.state || (e.state = window.event.state));
      }

      var href = document.location.href;
      var target = state.target || this.lastChangedTarget;
      var selection = state.selection || SELECTORS.CHILDREN;
      var data = state.data || {};
      var onload = state.onload || function () {};
      var onloadcontext = state.onloadcontext || this;

      console.log(' ');
      console.log('---------');
      console.log(hasPoppedState, document.location.href, 'from AJAX');
      console.log(target, selection, data, onload);
      console.log('---------');
      console.log(' ');

      this.ajaxGet(href, target, selection, true, data, onload, onloadcontext);

      return hasPoppedState;
    }

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
     * @param  {string} content           The loaded page content, this comes from the AJAX call.
     * @param  {string} target            The target for the loaded content. This can be a string (selector), or a JSON array of selector strings.
     * @param  {string} selection         This is a selector (or JSON of selectors) that determines what to cut from the loaded content.
     * @param  {boolean} fromPop          Indicates that this load is from a history pop
     * @param  {function} [onload]        The onload function to run (TBI).
     * @param  {object} [onloadcontext]   The context under which to run the onload function.
     */

  }, {
    key: '_parseResponse',
    value: function _parseResponse(content, target, selection) {
      var fromPop = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
      var onload = arguments[4];
      var onloadcontext = arguments[5];


      var doc,
          results,
          oldTitle = document.title,
          newTitle,
          targetNodes;

      // Parse the document from the content provided
      doc = document.createElement('div');
      doc.innerHTML = content;

      // Find the new page title
      newTitle = doc.getElementsByTagName('title')[0].text;

      targetNodes = document.querySelectorAll(target);

      // I need to add a tonne of things here, like support for transition off etc.
      // Currently I'm just statically removing and adding in elements.
      targetNodes.forEach(function (el) {
        el.innerHTML = '';

        console.log(el);

        // Find the results of the selection
        // N.B. This will all need to be updated to support the array syntax
        console.log('selection: ' + selection);
        if (selection === SELECTORS.CHILDREN) {
          console.log(doc.querySelector(target));
          results = doc.querySelectorAll(target + ' > *');
        } else {
          results = doc.querySelectorAll(selection);
        }

        results.forEach(function (result) {
          el.appendChild(result.cloneNode(true));
        });
      });

      // Update the internal reference to the last target
      this.lastChangedTarget = target;

      if (!fromPop) {
        // Push the new state to the history.
        this.push(this.lastParsedURL, newTitle, { target: target, selection: selection, onload: onload, onloadcontext: onloadcontext });
      }

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJkZW1vL3J1bi5qcyIsInNyYy93dGMtYWpheC5qcyIsInNyYy93dGMtaGlzdG9yeS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0FDQUE7Ozs7OztBQUVBO0FBQ0Esa0JBQUssSUFBTCxDQUFVLElBQVY7QUFDQTtBQUNBLGtCQUFLLFlBQUwsR0FBb0IsUUFBcEI7O0FBRUEsU0FBUyxLQUFULENBQWUsRUFBZixFQUFtQjtBQUNqQixNQUFJLFNBQVMsVUFBVCxJQUF1QixTQUEzQixFQUFzQztBQUNwQztBQUNELEdBRkQsTUFFTztBQUNMLGFBQVMsZ0JBQVQsQ0FBMEIsa0JBQTFCLEVBQThDLEVBQTlDO0FBQ0Q7QUFDRjs7QUFFRCxNQUFNLFlBQ047QUFDRSxvQkFBSyxTQUFMO0FBQ0QsQ0FIRDs7QUFLQSxPQUFPLE9BQVA7Ozs7Ozs7Ozs7Ozs7QUNwQkE7Ozs7Ozs7Ozs7OztBQUVBLElBQU0sU0FBUztBQUNiLFFBQXNCLENBRFQ7QUFFYixhQUFzQixDQUZUO0FBR2IsYUFBc0IsQ0FIVDtBQUliLG1CQUFzQixDQUpUO0FBS2IsWUFBc0I7QUFMVCxDQUFmOztBQVFBLElBQU0sWUFBWTtBQUNoQixjQUFzQixDQUROLENBQ1E7QUFEUixDQUFsQjs7QUFJQTs7Ozs7Ozs7Ozs7Ozs7SUFhTSxJOzs7Ozs7Ozs7Ozs7O0FBRUo7Ozs7QUFJQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O2dDQW9DK0M7QUFBQTs7QUFBQSxVQUE5QixZQUE4Qix1RUFBZixTQUFTLElBQU07O0FBQzdDLFVBQU0sUUFBUSxhQUFhLGdCQUFiLE9BQWtDLEtBQUssYUFBdkMsY0FBZDs7QUFFQSxZQUFNLE9BQU4sQ0FBYyxVQUFDLElBQUQsRUFBUztBQUNyQjtBQUNBLGFBQUssZUFBTCxDQUFxQixPQUFLLGFBQTFCOztBQUVBLGFBQUssZ0JBQUwsQ0FBc0IsT0FBdEIsRUFBK0IsVUFBQyxD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QU8sS0FBSyxRQUFaO0FBQ0QsT0FIRCxNQUlBO0FBQ0UsZUFBTyxLQUFQO0FBQ0Q7QUFDRjs7QUFFRDs7Ozs7Ozs7O3NCQU13QixZLEVBQWM7QUFDcEM7QUFDQSxVQUFHLE9BQU8sWUFBUCxLQUF3QixTQUEzQixFQUNBO0FBQ0UsYUFBSyxhQUFMLEdBQXFCLFlBQXJCO0FBQ0QsT0FIRCxNQUlBO0FBQ0UsZ0JBQVEsSUFBUixDQUFhLHNDQUFiO0FBQ0Q7QUFDRixLO3dCQUN5QjtBQUN4QixVQUFHLE9BQU8sS0FBSyxhQUFaLEtBQThCLFNBQWpDLEVBQ0E7QUFDRSxlQUFPLEtBQUssYUFBWjtBQUNELE9BSEQsTUFJQTtBQUNFLGVBQU8sS0FBUDtBQUNEO0FBQ0Y7O0FBRUQ7Ozs7Ozs7Ozt3QkFNb0M7QUFBQSxVQUFqQixPQUFpQix1RUFBUCxLQUFPOztBQUNsQztBQUNBLFVBQUksS0FBSyxPQUFMLElBQWdCLE9BQU8sT0FBUCxLQUFtQixTQUF2QyxFQUFtRDtBQUNqRCxhQUFLLFFBQUwsR0FBZ0IsT0FBaEI7QUFDRDtBQUNELFlBQU0sSUFBSSxLQUFKLENBQVUsMEJBQVYsQ0FBTjtBQUNELEs7d0JBQ29CO0FBQ25CLGFBQVEsT0FBTyxPQUFQLElBQWtCLE9BQU8sT0FBUCxDQUFlLFNBQXpDO0FBQ0Q7O0FBRUQ7Ozs7Ozs7O3dCQUtvQjtBQUNsQixhQUFPLEtBQUssT0FBTCxDQUFhLE1BQXBCO0FBQ0Q7Ozs7OztrQkFHWSxPIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImltcG9ydCBBSkFYIGZyb20gXCIuLi9zcmMvd3RjLWFqYXhcIjtcblxuLy8gSW5pdGlhbGlzZSB0aGUgaGlzdG9yeSBvYmplY3QgaW4gZGV2IG1vZGVcbkFKQVguaW5pdCh0cnVlKTtcbi8vIFNldCB0aGUgZG9jdW1lbnQgcm9vdCBmb3IgdGhlIGFwcGxpY2F0aW9uIChpZiBuZWNlc3NhcnkpXG5BSkFYLmRvY3VtZW50Um9vdCA9ICcvZGVtby8nO1xuXG5mdW5jdGlvbiByZWFkeShmbikge1xuICBpZiAoZG9jdW1lbnQucmVhZHlTdGF0ZSAhPSAnbG9hZGluZycpIHtcbiAgICBmbigpO1xuICB9IGVsc2Uge1xuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ0RPTUNvbnRlbnRMb2FkZWQnLCBmbik7XG4gIH1cbn1cblxucmVhZHkoZnVuY3Rpb24oKVxue1xuICBBSkFYLmluaXRMaW5rcygpO1xufSk7XG5cbndpbmRvdy5BSkFYT2JqID0gQUpBWDtcbiIsImltcG9ydCBIaXN0b3J5IGZyb20gXCIuL3d0Yy1oaXN0b3J5XCI7XG5cbmNvbnN0IFNUQVRFUyA9IHtcbiAgJ09LJyAgICAgICAgICAgICAgICA6IDAsXG4gICdDTElDS0VEJyAgICAgICAgICAgOiAxLFxuICAnTE9BRElORycgICAgICAgICAgIDogMixcbiAgJ1RSQU5TSVRJT05JTkcnICAgICA6IDQsXG4gICdMT0FERUQnICAgICAgICAgICAgOiA4XG59XG5cbmNvbnN0IFNFTEVDVE9SUyA9IHtcbiAgJ0NISUxEUkVOJyAgICAgICAgICA6IDAgLy8gVGhpcyBpbmRpY2F0ZXMgdGhhdCB0aGUgc2VsZWN0aW9uIHNob3VsZCBiZSBhbGwgY2hpbGRyZW4uIFRoaXMgYXNzdW1lcyB0aGF0IHdlIGhhdmUgYSB2YWxpZCB0YXJnZXQgdG8gd29yayB3aXRoLlxufVxuXG4vKipcbiAqIEFuIEFKQVggY2xhc3MgdGhhdCBwaWNrcyB1cCBvbiBsaW5rcyBhbmQgdHVybnMgdGhlbSBpbnRvIEFKQVggbGlua3MuXG4gKlxuICogVGhpcyBjbGFzcyBhc3N1bWVzIHRoYXQgeW91IHdhbnQgdG8gcnVuIHlvdXIgQUpBWCB2aWEgaHRtbCBhdHRyaWJ1dGVzIG9uIHlvdXIgbGlua3NcbiAqIGFuZCB0aGF0IHlvdXIgd2Vic2l0ZSBjYW4gcnVuIGp1c3QgYXMgd2VsbCB3aXRob3V0IHRoZXNlIGxpbmtzLiBJdCBzaG91bGQgYWxzb1xuICogcHJvdmlkZSBhZGRpdGlvbmFsIGZ1bmN0aW9uYWxpdHkgdGhhdCBhbGxvd3MgdGhlIGNsYXNzIHRvIHJ1biBwcm9ncmFtYXRpY2FsbHksXG4gKiB0aGVyZWJ5IGdpdmluZyB0aGUgcHJvZ3JhbW1lciB0aGUgYWJpbGl0eSBhbmQgb3B0aW9ucyB0byBjcmVhdGUgdGhlIHdlYnNvdGVcbiAqIGhvd2V2ZXIgdGhleSB3YW50IHRvLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBuYW1lc3BhY2VcbiAqIEBleHRlbmRzIEhpc3RvcnlcbiAqL1xuY2xhc3MgQUpBWCBleHRlbmRzIEhpc3Rvcnkge1xuXG4gIC8qKlxuICAgKiBQdWJsaWMgbWV0aG9kc1xuICAgKi9cblxuICAvKipcbiAgICogSW5pdGlhbGlzZSB0aGUgbGlua3MgaW4gdGhlIGRvY3VtZW50LlxuICAgKlxuICAgKiBUaGlzIHdpbGwgbG9vayB0aHJvdWdoIHRoZSBsaW5rcyBpbiB0aGUgZG9jdW1lbnQgYXMgZGVub3RlZCBieSB0aGUgYXR0cmlidXRlQWpheFxuICAgKiBwcm9wZXJ0eSBhbmQgYXBwbHkgYSBjbGljayBsaXN0ZW5lciB0byBpdCB0aGF0IHdpbGwgYXR0ZW1wdCB0byBkZXRlcm1pbmUgd2hhdFxuICAgKiBhbmQgaG93IHRvIGxvYWQuXG4gICAqXG4gICAqIEEgc2ltcGxlIG1lY2hhbnNpbSBmb3IgdGhpcyB3b3VsZCBiZSBzb21ldGhpbmcgbGlrZTpcbiAgICogYGBgXG4gICAgIDxhIGhyZWY9XCJwYWdlMS5odG1sXCJcbiAgICAgICAgZGF0YS13dGMtYWpheD1cInRydWVcIlxuICAgICAgICBkYXRhLXd0Yy1hamF4LXRhcmdldD0nI2xpbmsyLXRhcmdldCdcbiAgICAgICAgZGF0YS13dGMtYWpheC1zZWxlY3Rpb249XCIubGluazEtc2VsZWN0aW9uXCJcbiAgICAgICAgZGF0YS13dGMtYWpheC1zaG91bGQtbmF2aWdhdGU9XCJmYWxzZVwiPkxpbmsgMTwvYT5cbiAgICogYGBgXG4gICAqXG4gICAqIFRoZSBhZHRyaWJ1dGVzIGVxdWF0ZSBhcyBmb2xsb3dzOlxuICAgKiAtICgqYXR0cmlidXRlQWpheCopICoqZGF0YS13dGMtYWpheCoqXG4gICAqXG4gICAqICAgIERlbm90ZXMgdGhhdCB0aGlzIGxpbmsgaXMgYW4gQUpBWCBsaW5rLlxuICAgKiAtICgqYXR0cmlidXRlVGFyZ2V0KikgKipkYXRhLXd0Yy1hamF4LXRhcmdldCoqXG4gICAqXG4gICAqICAgIERlbm90ZXMgdGhlIHRhcmdldCBpbnRvIHdoaWNoIHRvIGxvYWQgdGhlIHJlc3VsdC4gU2hvdWxkIHRha2UgdGhlIGZvcm0gb2YgYSBzZWxlY3Rvci5cbiAgICogLSAoKmF0dHJpYnV0ZVNlbGVjdGlvbiopICoqZGF0YS13dGMtYWpheC1zZWxlY3Rpb24qKlxuICAgKlxuICAgKiAgICBEZW5vdGVzIHRoZSBzZWxlY3Rpb24gb2YgZGF0YSB0byBwdWxsIGZyb20gdGhlIGxvYWRlZCBkb2N1bWVudC4gU2hvdWxkIHRha2UgdGhlIGZvcm0gb2YgYSBzZWxlY3Rvci5cbiAgICogLSAoKmF0dHJpYnV0ZVNob3VsZE5hdmlnYXRlKikgKipkYXRhLXd0Yy1hamF4LXNob3VsZC1uYXZpZ2F0ZSoqXG4gICAqXG4gICAqICAgICoqVHJ1ZSoqIC8gRmFsc2UgYXMgdG8gd2hldGhlciB0aGUgbGluayBzaG91bGQgdXBkYXRlIHRoZSBoaXN0b3J5IG9iamVjdC4gT25seSBuZWNlc3NhcnkgaWYgZmFsc2UuXG4gICAqXG4gICAqIEluIGFkZGl0aW9uLCAqYXR0cmlidXRlVGFyZ2V0KiBhbmQgKmF0dHJpYnV0ZVNlbGVjdGlvbiogYWNjZXB0IGJhc2ljIEpTT04gc3ludGF4XG4gICAqIHNvIHRoYXQgeW91IGNhbiBsb2FkIG1vbHRpcGxlIHBpZWNlcyBvZiBjb250ZW50IGZyb20gdGhlIHNvdXJjZS5cbiAgICpcbiAgICogQHN0YXRpY1xuICAgKiBAcGFyYW0gIHtET01FbGVtZW50fSByb290RG9jdW1lbnQgIFRoZSBET00gZWxlbWVudCB0byBmaW5kIGxpbmtzIGluLiBEZWZhdWx0cyB0byBib2R5LlxuICAgKi9cbiAgc3RhdGljIGluaXRMaW5rcyhyb290RG9jdW1lbnQgPSBkb2N1bWVudC5ib2R5KSB7XG4gICAgY29uc3QgbGlua3MgPSByb290RG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChgWyR7dGhpcy5hdHRyaWJ1dGVBamF4fT1cInRydWVcIl1gKTtcblxuICAgIGxpbmtzLmZvckVhY2goKGxpbmspPT4ge1xuICAgICAgLy8gUmVtb3ZpbmcgdGhpcyBhdHRyaWJ1dGUgZW5zdXJlcyB0aGF0IHRoaXMgbGluayBkb2Vzbid0IGdldCBhIHNlY29uZCBBSkFYIGxpc3RlbmVyIGF0dGFjaGVkIHRvIGl0LlxuICAgICAgbGluay5yZW1vdmVBdHRyaWJ1dGUodGhpcy5hdHRyaWJ1dGVBamF4KTtcblxuICAgICAgbGluay5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlKT0+IHtcbiAgICAgICAgdGhpcy5fdHJpZ2dlckFqYXhMaW5rKGUpO1xuXG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgIH0pO1xuICAgICAgY29uc29sZS5sb2cobGluayk7XG4gICAgfSk7XG4gIH1cblxuXG4gIC8qKlxuICAgKiBUaGlzIGJ1aWxkcyBvdXQgYW4gQUpBWCByZXF1ZXN0LCBub3JtYWxseSBiYXNlZCBvbiB0aGUgY2xpY2tpbmcgb2YgYSBsaW5rLFxuICAgKiBidXQgaXQgY2FuIGFsdGVybmF0aXZlbHkgYmUgY2FsbGVkIGRpcmVjdGx5IG9uIHRoZSBBSkFYIG9iamVjdC5cbiAgICpcbiAgICogQHN0YXRpY1xuICAgKiBAcGFyYW0gIHtzdHJpbmd9IFVSTCAgICAgICAgICAgICAgIFRoZSBVUkwgdG8gZ2V0LiBUaGlzIHdpbGwgYmUgcGFyc2VkIGludG8gYW4gYXBwcm9wcmlhdGUgZm9tYXQgYnkgdGhlIG9iamVjdC5cbiAgICogQHBhcmFtICB7c3RyaW5nfSB0YXJnZXQgICAgICAgICAgICBUaGUgdGFyZ2V0IGZvciB0aGUgbG9hZGVkIGNvbnRlbnQuIFRoaXMgY2FuIGJlIGEgc3RyaW5nIChzZWxlY3RvciksIG9yIGEgSlNPTiBhcnJheSBvZiBzZWxlY3RvciBzdHJpbmdzLlxuICAgKiBAcGFyYW0gIHtzdHJpbmd9IHNlbGVjdGlvbiAgICAgICAgIFRoaXMgaXMgYSBzZWxlY3RvciAob3IgSlNPTiBvZiBzZWxlY3RvcnMpIHRoYXQgZGV0ZXJtaW5lcyB3aGF0IHRvIGN1dCBmcm9tIHRoZSBsb2FkZWQgY29udGVudC5cbiAgICogQHBhcmFtICB7Ym9vbGVhbn0gZnJvbVBvcCAgICAgICAgICBJbmRpY2F0ZXMgdGhhdCB0aGlzIEdFVCBpcyBmcm9tIGEgcG9wXG4gICAqIEBwYXJhbSAge29iamVjdH0gW2RhdGEgPSB7fV0gICAgICAgVGhlIGRhdGEgdG8gcGFzcyB0byB0aGUgQUpBWCBjYWxsLlxuICAgKiBAcGFyYW0gIHtmdW5jdGlvbn0gW29ubG9hZF0gICAgICAgIFRoZSBvbmxvYWQgZnVuY3Rpb24gdG8gcnVuIChUQkkpLlxuICAgKiBAcGFyYW0gIHtvYmplY3R9IFtvbmxvYWRjb250ZXh0XSAgIFRoZSBjb250ZXh0IHVuZGVyIHdoaWNoIHRvIHJ1biB0aGUgb25sb2FkIGZ1bmN0aW9uLlxuICAgKi9cbiAgc3RhdGljIGFqYXhHZXQoVVJMLCB0YXJnZXQsIHNlbGVjdGlvbiwgZnJvbVBvcCA9IGZhbHNlLCBkYXRhID0ge30sIG9ubG9hZCwgb25sb2FkY29udGV4dCkge1xuXG4gICAgaWYoIHRoaXMuc3RhdGUgPiBTVEFURVMuQ0xJQ0tFRCApXG4gICAge1xuICAgICAgaWYoIHRoaXMuZGV2bW9kZSApXG4gICAgICB7XG4gICAgICAgIGNvbnNvbGUud2FybiggXCJUcmllZCBydW4gYW4gQUpBWCBHRVQgd2hlbiB0aGUgb2JqZWN0IHdhc24ndCBpbiBPSyBvciBDTElDS0VEIG1vZGVcIiApO1xuICAgICAgfVxuXG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc29sZS5sb2coJy0tLS0tLS0tLS0tJyk7XG4gICAgY29uc3QgcmVxID0gdGhpcy5yZXF1ZXN0T2JqZWN0O1xuICAgIGNvbnN0IHBhcnNlZFVSTCA9IHRoaXMuX2ZpeFVSTChVUkwpO1xuXG4gICAgY29uc29sZS5sb2coJy0tLS0tLS0tLS0tJyk7XG5cbiAgICB2YXIgcmVhZHlTdGF0ZSA9IDA7XG4gICAgdmFyIHN0YXR1cyA9IDA7XG5cbiAgICByZXEuYWRkRXZlbnRMaXN0ZW5lcigncmVhZHlzdGF0ZWNoYW5nZScsIChlKSA9PiB7XG4gICAgICByZWFkeVN0YXRlID0gZS50YXJnZXQucmVhZHlTdGF0ZTtcbiAgICAgIHN0YXR1cyA9IGUudGFyZ2V0LnN0YXR1cztcbiAgICB9KTtcblxuICAgIHJlcS5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgKGUpID0+IHtcbiAgICAgIGlmKCByZXEuc3RhdHVzID49IDIwMCAmJiByZXEuc3RhdHVzIDwgNDAwICkge1xuICAgICAgICB0aGlzLl9wYXJzZVJlc3BvbnNlKHJlcS5yZXNwb25zZVRleHQsIHRhcmdldCwgc2VsZWN0aW9uLCBmcm9tUG9wLCBvbmxvYWQsIG9ubG9hZGNvbnRleHQpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLl9lcnJvcihyZWFkeVN0YXRlLCByZXEuc3RhdHVzKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHJlcS5hZGRFdmVudExpc3RlbmVyKCdlcnJvcicsIChlKSA9PiB7XG4gICAgICB0aGlzLl9lcnJvcihyZWFkeVN0YXRlLCBzdGF0dXMpO1xuICAgIH0pO1xuXG4gICAgLy8gU2F2ZSB0aGUgbGFzdCBwYXJzZWQgVVJMIGZvciB0aGUgcHVycG9zZSBvZiBoaXN0b3J5IGludGVyb3BlcmFiaWxpdHkgYW5kIGVycm9yIGNvcnJlY3Rpb24uXG4gICAgdGhpcy5sYXN0UGFyc2VkVVJMID0gcGFyc2VkVVJMO1xuXG4gICAgcmVxLm9wZW4oJ0dFVCcsIHBhcnNlZFVSTCwgdHJ1ZSk7XG4gICAgcmVxLnNlbmQoZGF0YSk7XG5cbiAgICAvLyBTZXQgdGhlIG9iamVjdCBzdGF0ZVxuICAgIHRoaXMuc3RhdGUgPSBTVEFURVMuTE9BRElORztcblxuICAgIHJldHVybiByZXE7XG4gIH1cblxuICAvKipcbiAgICogUHJpdmF0ZSBtZXRob2RzXG4gICAqL1xuXG4gIC8qKlxuICAgKiBMaXN0ZW5lciBmb3IgdGhlIHBvcHN0YXRlIG1ldGhvZFxuICAgKlxuICAgKiBAcHJpdmF0ZVxuICAgKiBAcGFyYW0gIHtvYmplY3R9IGUgdGhlIHBhc3NlZCBldmVudCBvYmplY3RcbiAgICogQHJldHVybiB2b2lkXG4gICAqL1xuICBzdGF0aWMgX3BvcHN0YXRlKGUpIHtcbiAgICB2YXIgYmFzZSwgc3RhdGUgPSB7fTtcbiAgICB2YXIgaGFzUG9wcGVkU3RhdGUgPSBzdXBlci5fcG9wc3RhdGUoZSk7XG5cbiAgICBpZiggaGFzUG9wcGVkU3RhdGUgKSB7XG4gICAgICBzdGF0ZSA9IChiYXNlID0gdGhpcy5oaXN0b3J5KS5zdGF0ZSB8fCAoYmFzZS5zdGF0ZSA9IGUuc3RhdGUgfHwgKGUuc3RhdGUgPSB3aW5kb3cuZXZlbnQuc3RhdGUpKTtcbiAgICB9XG5cbiAgICB2YXIgaHJlZiA9IGRvY3VtZW50LmxvY2F0aW9uLmhyZWY7XG4gICAgdmFyIHRhcmdldCA9IHN0YXRlLnRhcmdldCB8fCB0aGlzLmxhc3RDaGFuZ2VkVGFyZ2V0O1xuICAgIHZhciBzZWxlY3Rpb24gPSBzdGF0ZS5zZWxlY3Rpb24gfHwgU0VMRUNUT1JTLkNISUxEUkVOO1xuICAgIHZhciBkYXRhID0gc3RhdGUuZGF0YSB8fCB7fTtcbiAgICB2YXIgb25sb2FkID0gc3RhdGUub25sb2FkIHx8IGZ1bmN0aW9uKCl7fTtcbiAgICB2YXIgb25sb2FkY29udGV4dCA9IHN0YXRlLm9ubG9hZGNvbnRleHQgfHwgdGhpcztcblxuICAgIGNvbnNvbGUubG9nKCcgJylcbiAgICBjb25zb2xlLmxvZygnLS0tLS0tLS0tJylcbiAgICBjb25zb2xlLmxvZyhoYXNQb3BwZWRTdGF0ZSwgZG9jdW1lbnQubG9jYXRpb24uaHJlZiwgJ2Zyb20gQUpBWCcpO1xuICAgIGNvbnNvbGUubG9nKHRhcmdldCwgc2VsZWN0aW9uLCBkYXRhLCBvbmxvYWQpXG4gICAgY29uc29sZS5sb2coJy0tLS0tLS0tLScpXG4gICAgY29uc29sZS5sb2coJyAnKVxuXG4gICAgdGhpcy5hamF4R2V0KGhyZWYsIHRhcmdldCwgc2VsZWN0aW9uLCB0cnVlLCBkYXRhLCBvbmxvYWQsIG9ubG9hZGNvbnRleHQpO1xuXG4gICAgcmV0dXJuIGhhc1BvcHBlZFN0YXRlO1xuICB9XG5cbiAgLyoqXG4gICAqIFRyaWdnZXIgYW4gYWpheCBsaW5rIGFzIGRldGVybWluZWQgYnkgYSBjbGljayBjYWxsYmFjay4gVGhpcyBzaG91bGQgb25seSBldmVyIGJlIGNhbGxlZFxuICAgKiBmcm9tIGEgY2xpY2sgZXZlbnQgYXMgYWRkZWQgdmlhIHRoZSBBSkFYIG9iamVjdCBvciBhIGNoaWxkIHRoZXJlcm9mLlxuICAgKlxuICAgKiBAc3RhdGljXG4gICAqIEBwcml2YXRlXG4gICAqIEBwYXJhbSAge29iamVjdH0gZSB0aGUgZXZlbnQgb2JqZWN0IHBhc3NlZCBmcm9tIHRoZSBjbGljayBldmVudC5cbiAgICovXG4gIHN0YXRpYyBfdHJpZ2dlckFqYXhMaW5rKGUpIHtcbiAgICBpZiggdGhpcy5zdGF0ZSAhPSBTVEFURVMuT0sgKVxuICAgIHtcbiAgICAgIGlmKCB0aGlzLmRldm1vZGUgKVxuICAgICAge1xuICAgICAgICBjb25zb2xlLndhcm4oIFwiVHJpZWQgdG8gY2xpY2sgYW4gQUpBWCBsaW5rIHdoZW4gdGhlIG9iamVjdCB3YXNuJ3QgaW4gT0sgbW9kZVwiICk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBGaW5kIGFsbCBvZiB0aGUgcmVsZXZhbnQgYXR0ZWlidXRlc1xuICAgIGNvbnN0IGxpbmsgICAgICA9IGUudGFyZ2V0O1xuICAgIGNvbnN0IGhyZWYgICAgICA9IGxpbmsuZ2V0QXR0cmlidXRlKCdocmVmJyk7XG4gICAgY29uc3QgdGFyZ2V0ICAgID0gbGluay5nZXRBdHRyaWJ1dGUodGhpcy5hdHRyaWJ1dGVUYXJnZXQpO1xuICAgIGNvbnN0IHNlbGVjdGlvbiA9IGxpbmsuZ2V0QXR0cmlidXRlKHRoaXMuYXR0cmlidXRlU2VsZWN0aW9uKTtcblxuICAgIC8vIFNldCB0aGUgb2JqZWN0IHN0YXRlXG4gICAgdGhpcy5zdGF0ZSA9IFNUQVRFUy5DTElDS0VEO1xuXG4gICAgdGhpcy5hamF4R2V0KGhyZWYsIHRhcmdldCwgc2VsZWN0aW9uKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGlzIHJlc3BvbmRzIHRvIHRoZSBhamF4IGxvYWQgZXZlbnQgYW5kIGlzIHJlc3BvbnNpYmxlIGZvciBidWlsZGluZyB0aGUgcmVzdWx0LFxuICAgKiBpbmplY3RpbmcgaXQgaW50byB0aGUgcGFnZSwgcnVubmluZyBjYWxsYmFja3MgYW5kIGRldGVjdGluZyBhbmQgZGVsYXlpbmdcbiAgICogdHJhbnNpdGlvbnMgYW5kIGFuaW1hdGlvbnMgYXMgbmVjZXNzYXJ5L1xuICAgKlxuICAgKiBAc3RhdGljXG4gICAqIEBwcml2YXRlXG4gICAqIEBwYXJhbSAge3N0cmluZ30gY29udGVudCAgICAgICAgICAgVGhlIGxvYWRlZCBwYWdlIGNvbnRlbnQsIHRoaXMgY29tZXMgZnJvbSB0aGUgQUpBWCBjYWxsLlxuICAgKiBAcGFyYW0gIHtzdHJpbmd9IHRhcmdldCAgICAgICAgICAgIFRoZSB0YXJnZXQgZm9yIHRoZSBsb2FkZWQgY29udGVudC4gVGhpcyBjYW4gYmUgYSBzdHJpbmcgKHNlbGVjdG9yKSwgb3IgYSBKU09OIGFycmF5IG9mIHNlbGVjdG9yIHN0cmluZ3MuXG4gICAqIEBwYXJhbSAge3N0cmluZ30gc2VsZWN0aW9uICAgICAgICAgVGhpcyBpcyBhIHNlbGVjdG9yIChvciBKU09OIG9mIHNlbGVjdG9ycykgdGhhdCBkZXRlcm1pbmVzIHdoYXQgdG8gY3V0IGZyb20gdGhlIGxvYWRlZCBjb250ZW50LlxuICAgKiBAcGFyYW0gIHtib29sZWFufSBmcm9tUG9wICAgICAgICAgIEluZGljYXRlcyB0aGF0IHRoaXMgbG9hZCBpcyBmcm9tIGEgaGlzdG9yeSBwb3BcbiAgICogQHBhcmFtICB7ZnVuY3Rpb259IFtvbmxvYWRdICAgICAgICBUaGUgb25sb2FkIGZ1bmN0aW9uIHRvIHJ1biAoVEJJKS5cbiAgICogQHBhcmFtICB7b2JqZWN0fSBbb25sb2FkY29udGV4dF0gICBUaGUgY29udGV4dCB1bmRlciB3aGljaCB0byBydW4gdGhlIG9ubG9hZCBmdW5jdGlvbi5cbiAgICovXG4gIHN0YXRpYyBfcGFyc2VSZXNwb25zZShjb250ZW50LCB0YXJnZXQsIHNlbGVjdGlvbiwgZnJvbVBvcCA9IGZhbHNlLCBvbmxvYWQsIG9ubG9hZGNvbnRleHQpIHtcblxuICAgIHZhciBkb2MsIHJlc3VsdHMsIG9sZFRpdGxlID0gZG9jdW1lbnQudGl0bGUsIG5ld1RpdGxlLCB0YXJnZXROb2RlcztcblxuICAgIC8vIFBhcnNlIHRoZSBkb2N1bWVudCBmcm9tIHRoZSBjb250ZW50IHByb3ZpZGVkXG4gICAgZG9jID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgZG9jLmlubmVySFRNTCA9IGNvbnRlbnQ7XG5cbiAgICAvLyBGaW5kIHRoZSBuZXcgcGFnZSB0aXRsZVxuICAgIG5ld1RpdGxlID0gZG9jLmdldEVsZW1lbnRzQnlUYWdOYW1lKCd0aXRsZScpWzBdLnRleHQ7XG5cbiAgICB0YXJnZXROb2RlcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwodGFyZ2V0KTtcblxuICAgIC8vIEkgbmVlZCB0byBhZGQgYSB0b25uZSBvZiB0aGluZ3MgaGVyZSwgbGlrZSBzdXBwb3J0IGZvciB0cmFuc2l0aW9uIG9mZiBldGMuXG4gICAgLy8gQ3VycmVudGx5IEknbSBqdXN0IHN0YXRpY2FsbHkgcmVtb3ZpbmcgYW5kIGFkZGluZyBpbiBlbGVtZW50cy5cbiAgICB0YXJnZXROb2Rlcy5mb3JFYWNoKChlbCkgPT4ge1xuICAgICAgZWwuaW5uZXJIVE1MID0gJyc7XG5cbiAgICAgIGNvbnNvbGUubG9nKGVsKTtcblxuICAgICAgLy8gRmluZCB0aGUgcmVzdWx0cyBvZiB0aGUgc2VsZWN0aW9uXG4gICAgICAvLyBOLkIuIFRoaXMgd2lsbCBhbGwgbmVlZCB0byBiZSB1cGRhdGVkIHRvIHN1cHBvcnQgdGhlIGFycmF5IHN5bnRheFxuICAgICAgY29uc29sZS5sb2coYHNlbGVjdGlvbjogJHtzZWxlY3Rpb259YClcbiAgICAgIGlmKCBzZWxlY3Rpb24gPT09IFNFTEVDVE9SUy5DSElMRFJFTiApXG4gICAgICB7XG4gICAgICAgIGNvbnNvbGUubG9nKGRvYy5xdWVyeVNlbGVjdG9yKHRhcmdldCkpO1xuICAgICAgICByZXN1bHRzID0gZG9jLnF1ZXJ5U2VsZWN0b3JBbGwoYCR7dGFyZ2V0fSA+ICpgKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJlc3VsdHMgPSBkb2MucXVlcnlTZWxlY3RvckFsbChzZWxlY3Rpb24pO1xuICAgICAgfVxuXG4gICAgICByZXN1bHRzLmZvckVhY2goZnVuY3Rpb24ocmVzdWx0KSB7XG4gICAgICAgIGVsLmFwcGVuZENoaWxkKHJlc3VsdC5jbG9uZU5vZGUodHJ1ZSkpO1xuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICAvLyBVcGRhdGUgdGhlIGludGVybmFsIHJlZmVyZW5jZSB0byB0aGUgbGFzdCB0YXJnZXRcbiAgICB0aGlzLmxhc3RDaGFuZ2VkVGFyZ2V0ID0gdGFyZ2V0O1xuXG4gICAgaWYoICFmcm9tUG9wICkge1xuICAgICAgLy8gUHVzaCB0aGUgbmV3IHN0YXRlIHRvIHRoZSBoaXN0b3J5LlxuICAgICAgdGhpcy5wdXNoKHRoaXMubGFzdFBhcnNlZFVSTCwgbmV3VGl0bGUsIHsgdGFyZ2V0OiB0YXJnZXQsIHNlbGVjdGlvbjogc2VsZWN0aW9uLCBvbmxvYWQ6IG9ubG9hZCwgb25sb2FkY29udGV4dDogb25sb2FkY29udGV4dCB9KTtcbiAgICB9XG5cbiAgICAvLyBTZXQgdGhlIG9iamVjdCBzdGF0ZVxuICAgIHRoaXMuc3RhdGUgPSBTVEFURVMuT0s7XG4gIH1cblxuICAvKipcbiAgICogVHJpZ2dlciBhbiBlcnJvciBsb2dcbiAgICpcbiAgICogQHN0YXRpY1xuICAgKiBAcHJpdmF0ZVxuICAgKiBAcGFyYW0gIHt0eXBlfSByZWFkeVN0YXRlIGRlc2NyaXB0aW9uXG4gICAqIEBwYXJhbSAge3R5cGV9IHN0YXR1cyAgICAgZGVzY3JpcHRpb25cbiAgICogQHJldHVybiB7dHlwZX0gICAgICAgICAgICBkZXNjcmlwdGlvblxuICAgKi9cbiAgc3RhdGljIF9lcnJvcihyZWFkeVN0YXRlLCBzdGF0dXMpIHtcbiAgICBjb25zb2xlLndhcm4oYCVjIEVycm9yIGxvYWRpbmcgQUpBWCBsaW5rLiByZWFkeVN0YXRlOiAke3JlYWR5U3RhdGV9LiBzdGF0dXM6ICR7c3RhdHVzfWAsICdiYWNrZ3JvdW5kOiAjMjIyOyBjb2xvcjogI2ZmN2MzYScpXG4gIH1cblxuXG4gIC8qKlxuICAgKiBHZXR0ZXJzIGFuZCBzZXR0ZXJzXG4gICAqL1xuXG4gIC8qKlxuICAgKiAoZ2V0dGVyL3NldHRlcikgVGhlIGF0dHJpYnV0ZSB1c2VkIHRvIGRldGVybWluZSB3aGV0aGVyIGEgbGluayBzaG91bGRcbiAgICogYmUgcnVuIHZpYSB0aGUgQUpBWCBjbGFzcy5cbiAgICpcbiAgICogQHR5cGUge3N0cmluZ31cbiAgICogQGRlZmF1bHQgJ2RhdGEtd3RjLWFqYXgnXG4gICAqL1xuICBzdGF0aWMgc2V0IGF0dHJpYnV0ZUFqYXgoYXR0cmlidXRlKSB7XG4gICAgaWYodHlwZW9mIGF0dHJpYnV0ZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgIHRoaXMuX2F0dHJpYnV0ZUFqYXggPSBhdHRyaWJ1dGU7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnNvbGUud2FybignQWxsIGF0dHJpYnV0ZXMgbXVzdCBiZSBzdHJpbmdzLicpO1xuICAgIH1cbiAgfVxuICBzdGF0aWMgZ2V0IGF0dHJpYnV0ZUFqYXgoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2F0dHJpYnV0ZUFqYXggfHwgJ2RhdGEtd3RjLWFqYXgnO1xuICB9XG5cbiAgLyoqXG4gICAqIChnZXR0ZXIvc2V0dGVyKSBUaGUgYXR0cmlidXRlIHVzZWQgdG8gZGV0ZXJtaW5lIHdoZXJlIGEgbGluayBzaG91bGQgcGxhY2UgaXQnc1xuICAgKiByZXN1bHRhbnQgR0VULiBUaGlzIGF0dHJpYnV0ZSBzaG91bGQgYmUgaW4gdGhlIGZvcm0gb2YgYSBzZWxlY3RvciwgaWU6XG4gICAqIGAuYWpheC10YXJnZXRgXG4gICAqXG4gICAqIEB0eXBlIHtzdHJpbmd9XG4gICAqIEBkZWZhdWx0ICdkYXRhLXd0Yy1hamF4LXRhcmdldCdcbiAgICovXG4gIHN0YXRpYyBzZXQgYXR0cmlidXRlVGFyZ2V0KGF0dHJpYnV0ZSkge1xuICAgIGlmKHR5cGVvZiBhdHRyaWJ1dGUgPT09ICdzdHJpbmcnKSB7XG4gICAgICB0aGlzLl9hdHRyaWJ1dGVUYXJnZXQgPSBhdHRyaWJ1dGU7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnNvbGUud2FybignQWxsIGF0dHJpYnV0ZXMgbXVzdCBiZSBzdHJpbmdzLicpO1xuICAgIH1cbiAgfVxuICBzdGF0aWMgZ2V0IGF0dHJpYnV0ZVRhcmdldCgpIHtcbiAgICByZXR1cm4gdGhpcy5fYXR0cmlidXRlVGFyZ2V0IHx8ICdkYXRhLXd0Yy1hamF4LXRhcmdldCc7XG4gIH1cblxuICAvKipcbiAgICogKGdldHRlci9zZXR0ZXIpIFRoZSBhdHRyaWJ1dGUgdXNlZCB0byBzbGljZSB0aGUgcmVzdWx0YW50IEdFVC5cbiAgICogVGhpcyBhdHRyaWJ1dGUgc2hvdWxkIGJlIGluIHRoZSBmb3JtIG9mIGEgc2VsZWN0b3IsIGllOlxuICAgKiBgLmFqYXgtc2VsZWN0aW9uYFxuICAgKlxuICAgKiBAdHlwZSB7c3RyaW5nfVxuICAgKiBAZGVmYXVsdCAnZGF0YS13dGMtYWpheC1zZWxlY3Rpb24nXG4gICAqL1xuICBzdGF0aWMgc2V0IGF0dHJpYnV0ZVNlbGVjdGlvbihhdHRyaWJ1dGUpIHtcbiAgICBpZih0eXBlb2YgYXR0cmlidXRlID09PSAnc3RyaW5nJykge1xuICAgICAgdGhpcy5fYXR0cmlidXRlU2VsZWN0aW9uID0gYXR0cmlidXRlO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zb2xlLndhcm4oJ0FsbCBhdHRyaWJ1dGVzIG11c3QgYmUgc3RyaW5ncy4nKTtcbiAgICB9XG4gIH1cbiAgc3RhdGljIGdldCBhdHRyaWJ1dGVTZWxlY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuX2F0dHJpYnV0ZVNlbGVjdGlvbiB8fCAnZGF0YS13dGMtYWpheC1zZWxlY3Rpb24nO1xuICB9XG5cbiAgLyoqXG4gICAqIChnZXR0ZXIvc2V0dGVyKSBUaGUgYXR0cmlidXRlIHVzZWQgdG8gc2xpY2UgdGhlIHJlc3VsdGFudCBHRVQuXG4gICAqIFRoaXMgYXR0cmlidXRlIHNob3VsZCBiZSBpbiB0aGUgZm9ybSBvZiBhIHNlbGVjdG9yLCBpZTpcbiAgICogYC5hamF4LXNlbGVjdGlvbmBcbiAgICpcbiAgICogQHR5cGUge3N0cmluZ31cbiAgICogQGRlZmF1bHQgJ2RhdGEtd3RjLWFqYXgtc2VsZWN0aW9uJ1xuICAgKi9cbiAgc3RhdGljIHNldCBhdHRyaWJ1dGVTaG91bGROYXZpZ2F0ZShhdHRyaWJ1dGUpIHtcbiAgICBpZih0eXBlb2YgYXR0cmlidXRlID09PSAnc3RyaW5nJykge1xuICAgICAgdGhpcy5fYXR0cmlidXRlU2hvdWxkTmF2aWdhdGUgPSBhdHRyaWJ1dGU7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnNvbGUud2FybignQWxsIGF0dHJpYnV0ZXMgbXVzdCBiZSBzdHJpbmdzLicpO1xuICAgIH1cbiAgfVxuICBzdGF0aWMgZ2V0IGF0dHJpYnV0ZVNob3VsZE5hdmlnYXRlKCkge1xuICAgIHJldHVybiB0aGlzLl9hdHRyaWJ1dGVTaG91bGROYXZpZ2F0ZSB8fCAnZGF0YS13dGMtYWpheC1zaG91bGQtbmF2aWdhdGUnO1xuICB9XG5cbiAgLyoqXG4gICAqIHJldHVybnMgYSBuZXcgcmVxdWVzdE9iamVjdC4gV3JhcHBpbmcgcGxhY2Vob2xkZXIgZm9yIG5vdyB3YWl0aW5nIG9uIGVuaGFuY2VtZW50cy5cbiAgICpcbiAgICogQHJldHVybiB7b2JqZWN0fSAgcmVxdWVzdE9iamVjdFxuICAgKi9cbiAgc3RhdGljIGdldCByZXF1ZXN0T2JqZWN0KCkge1xuICAgIHJldHVybiBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiByZXR1cm5zIGEgbmV3IGxhc3QgY2hhbmdlZCB0YXJnZXQuIFRoaXMgaXMgdXNlZCB0byBkZXRlcm1pbmUgd2hhdCB0byBjaGFuZ2VkXG4gICAqIHdoZW4gbmF2aWdhdGluZyBiYWNrIHZpYSBoaXN0b3J5LlxuICAgKlxuICAgKiBAcmV0dXJuIHtvYmplY3R9ICBlaXRoZXIgYW4gYXJyYXkgb2Ygbm9kZXMgb3IgYSBzaW5nbGUgbm9kZS5cbiAgICogQGRlZmF1bHQgbnVsbFxuICAgKi9cbiAgc3RhdGljIHNldCBsYXN0Q2hhbmdlZFRhcmdldCh0YXJnZXQpIHtcbiAgICB0aGlzLl9sYXN0Q2hhbmdlZFRhcmdldCA9IHRhcmdldDtcbiAgfVxuICBzdGF0aWMgZ2V0IGxhc3RDaGFuZ2VkVGFyZ2V0KCkge1xuICAgIHJldHVybiB0aGlzLl9sYXN0Q2hhbmdlZFRhcmdldCB8fCBudWxsO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoZSBzdGF0ZSB0aGF0IHRoZSBBSkFYIG9iamVjdCBpcyBpbiwgYXMgZGV0ZXJtaW5lZCBmcm9tIGEgbGlzdCBvZiBjb25zdGFudHM6XG4gICAqIC0gT0sgICAgICAgICAgICAgSWRsZSwgcmVhZHkgZm9yIGEgc3RhdGUgbG9hZC5cbiAgICogLSBDTElDS0VEICAgICAgICBDbGlja2VkLCBidXQgbm90IHlldCBmaXJlZC5cbiAgICogLSBMT0FESU5HICAgICAgICBMb2FkaW5nIHBhZ2UuXG4gICAqIC0gVFJBTlNJVElPTklORyAgVHJhbnNpdGlvbmluZyBzdGF0ZVxuICAgKiAtIExPQURFRCAgICAgICAgIENvbnRlbnQgbG9hZGVkLlxuICAgKlxuICAgKiBAcmV0dXJuIHtpbnRlZ2VyfSAgVGhlIHN0YXRlIHRoYXQgdGhlIG9iamVjdCBpcyBpbi4gQ29tcGFyZSB0byB0aGUgc3RhdGUgb2JqZWN0IGZvciBkZXNjcmlwdGlvblxuICAgKiBAZGVmYXVsdCBTVEFURS5PS1xuICAgKi9cbiAgc3RhdGljIHNldCBzdGF0ZShzdGF0ZSkge1xuICAgIGlmKCB0eXBlb2Ygc3RhdGUgPT09ICdzdHJpbmcnICkge1xuICAgICAgaWYoIFNUQVRFU1tzdGF0ZV0gIT09IHVuZGVmaW5lZCApIHtcbiAgICAgICAgdGhpcy5fc3RhdGUgPSBTVEFURVNbc3RhdGVdO1xuICAgICAgICByZXR1cm5cbiAgICAgIH1cbiAgICB9IGVsc2UgaWYoIHR5cGVvZiBzdGF0ZSA9PT0gJ251bWJlcicgKSB7XG4gICAgICBmb3IodmFyIF9zdGF0ZSBpbiBTVEFURVMpIHtcbiAgICAgICAgaWYoU1RBVEVTW19zdGF0ZV0gPT09IHN0YXRlKSB7XG4gICAgICAgICAgdGhpcy5fc3RhdGUgPSBzdGF0ZTtcblxuICAgICAgICAgIGlmKCB0aGlzLmRldm1vZGUgKVxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGAlYyBBSkFYIHN0YXRlIGNoYW5nZTogJHt0aGlzLl9zdGF0ZX0gYCwgJ2JhY2tncm91bmQ6ICMyMjI7IGNvbG9yOiAjYmFkYTU1Jyk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIGNvbnNvbGUud2Fybignc3RhdGUgbXVzdCBiZSBvbmUgb2YgT0ssIENMSUNLRUQsIExPQURJTkcsIExPQURFRC4nKTtcbiAgfVxuICBzdGF0aWMgZ2V0IHN0YXRlKCkge1xuICAgIHJldHVybiB0aGlzLl9zdGF0ZSB8fCAwO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoZSBsYXN0IFVSTCB0byBiZSBwYXJzZWQgYnkgdGhlIEFKQVggb2JqZWN0LiBHZW5lcmFsbHkgc3BlYWtpbmcsIHRoaXMgaXMgdGhlXG4gICAqIGxhc3QgVVJMIHRvIGJlIGxvYWRlZCBvciBhdHRlbXB0ZWQgbG9hZGVkLlxuICAgKlxuICAgKiBAcmV0dXJuIHtzdHJpbmd9ICBUaGUgcGFyc2VkIFVSTCBzdHJpbmdcbiAgICogQGRlZmF1bHQgbnVsbFxuICAgKi9cbiAgc3RhdGljIHNldCBsYXN0UGFyc2VkVVJMKHBhcnNlZFVSTCkge1xuICAgIGlmKCB0eXBlb2YgcGFyc2VkVVJMID09PSAnc3RyaW5nJyApIHtcbiAgICAgIHRoaXMuX2xhc3RQYXJzZWRVUkwgPSBwYXJzZWRVUkw7XG4gICAgfVxuICB9XG4gIHN0YXRpYyBnZXQgbGFzdFBhcnNlZFVSTCgpIHtcbiAgICByZXR1cm4gdGhpcy5fbGFzdFBhcnNlZFVSTCB8fCBudWxsO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IEFKQVg7XG4iLCIvKipcbiAqIENsYXNzIHJlcHJlc2VudGluZyBhbiBhYnN0cmFjdGlvbiBvZiB0aGUgaGlzdG9yeSBBUEkuXG4gKiBAc3RhdGljXG4gKiBAbmFtZXNwYWNlXG4gKi9cbmNsYXNzIEhpc3Rvcnkge1xuXG4gIC8qKlxuICAgKiBQdWJsaWMgbWV0aG9kc1xuICAgKi9cblxuICAvKipcbiAgICAqIEluaXRpYWxpc2VzIHRoZSBIaXN0b3J5IGNsYXNzLiBOb3RoaW5nIHNob3VsZCBiZSBhYmxlIHRvXG4gICAgKiBvcGVyYXRlIGhlcmUgdW5sZXNzIHRoaXMgaGFzIHJ1biB3aXRoIGEgc3VwcG9ydCA9IHRydWUuXG4gICAgKlxuICAgICogQFB1YmxpY1xuICAgICogQHJldHVybiB7Ym9vbGVhbn0gICAgICAgICBSZXR1cm5zIHdoZXRoZXIgaW5pdCByYW4gb3Igbm90XG4gICAgKi9cbiAgc3RhdGljIGluaXQoZGV2bW9kZSA9IGZhbHNlKSB7XG4gICAgaWYodGhpcy5zdXBwb3J0KVxuICAgIHtcbiAgICAgIC8vIFRyeSB0byBzZXQgZXZlcnl0aGluZyB1cCwgYW5kIGlmIHdlIGZhaWwgdGhlbiByZXR1cm4gZmFsc2VcbiAgICAgIHRyeSB7XG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdwb3BzdGF0ZScsIChlKT0+IHtcbiAgICAgICAgICB2YXIgaGFzUG9wcGVkU3RhdGUgPSB0aGlzLl9wb3BzdGF0ZShlKTtcbiAgICAgICAgICByZXR1cm4gaGFzUG9wcGVkU3RhdGU7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMuZGV2bW9kZSAgICAgID0gZGV2bW9kZTtcblxuICAgICAgfSBjYXRjaCAoZSkge1xuXG4gICAgICAgIC8vIElmIHdlJ3JlIGluIGRldm1vZGUsIHNlbmQgb3VyIGNvbnNvbGUgb3V0cHV0XG4gICAgICAgIGlmKHRoaXMuZGV2bW9kZSkge1xuICAgICAgICAgIGNvbnNvbGUud2FybignZXJyb3IgaW4gaGlzdG9yeSBpbml0aWFsaXNhdGlvbicpO1xuICAgICAgICAgIGNvbnNvbGUubG9nKGUpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuXG4gICAgICB0aGlzLmluaXRpYWxpc2VkID0gdHJ1ZTtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDb25zdHJ1Y3QgYW5kIHB1c2ggYSBVUkwgc3RhdGVcbiAgICpcbiAgICogQHB1YmxpY1xuICAgKiBAcGFyYW0gIHtzdHJpbmd9IFVSTCAgICAgICAgICAgVGhlIFVSTCB0byBwdXNoLCBjYW4gYmUgcmVsYXRpdmUsIGFic29sdXRlIG9yIGZ1bGxcbiAgICogQHBhcmFtICB7c3RyaW5nfSB0aXRsZSAgICAgICAgIFRoZSB0aXRsZSB0byBwdXNoLlxuICAgKiBAcGFyYW0gIHtvYmplY3R9IHN0YXRlT2JqICAgICAgQSBzdGF0ZSB0byBwdXNoIHRvIHRoZSBzdGFjay4gVGhpcyB3aWxsIGJlIHBvcHBlZCB3aGVuIG5hdmlhZ3RpbmcgYmFja1xuICAgKiBAcmV0dXJuIHtib29sZWFufSAgICAgICAgICAgICAgSW5kaWNhdGVzIHdoZXRoZXIgdGhlIHB1c2ggc3VjY2VlZGVkXG4gICAqL1xuICBzdGF0aWMgcHVzaChVUkwsIHRpdGxlID0gJycsIHN0YXRlT2JqID0ge30pIHtcblxuICAgIHZhciBwYXJzZWRVUkwgPSAnJztcblxuICAgIC8vIEZpcnN0IHRyeSB0byBmaXggdGhlIFVSTFxuICAgIHRyeSB7XG4gICAgICBwYXJzZWRVUkwgPSB0aGlzLl9maXhVUkwoVVJMLCB0cnVlLCB0cnVlKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICBpZih0aGlzLmRldm1vZGUpIHtcbiAgICAgICAgY29uc29sZS53YXJuKCdwdXNoIGZhaWxlZCB3aGlsZSB0cnlpbmcgdG8gZml4IHRoZSBVUkwnKTtcbiAgICAgICAgY29uc29sZS5sb2coZSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gZmFsc2VcbiAgICB9XG5cbiAgICAvLyBJZiB3ZSBoYXZlIEFQSSBzdXBwb3J0LCBwdXNoIHRoZSBzdGF0ZSB0byB0aGUgaGlzdG9yeSBvYmplY3RcbiAgICBpZih0aGlzLnN1cHBvcnQpXG4gICAge1xuICAgICAgdHJ5IHtcbiAgICAgICAgdGhpcy5oaXN0b3J5LnB1c2hTdGF0ZShzdGF0ZU9iaiwgdGl0bGUsIHBhcnNlZFVSTCk7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGlmKHRoaXMuZGV2bW9kZSkge1xuICAgICAgICAgIGNvbnNvbGUud2FybigncHVzaCBmYWlsZWQgd2hpbGUgdHJ5aW5nIHRvIHB1c2ggdGhlIHN0YXRlIHRvIHRoZSBoaXN0b3J5IG9iamVjdCcpO1xuICAgICAgICAgIGNvbnNvbGUubG9nKGUpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICAvLyBPdGhlcndpc2VyLCBhZGQgdGhlIFVSTCBhcyBhIGhhc2hiYW5nXG4gICAgfSBlbHNlXG4gICAge1xuICAgICAgd2luZG93LmxvY2F0aW9uLmhhc2ggPSBgIyEke1VSTH1gO1xuICAgIH1cblxuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgLyoqXG4gICAqIFRha2VzIHRoZSB1c2VyIGJhY2sgdG8gdGhlIHByZXZpb3VzIHN0YXRlLiBTaW1wbHkgd3JhcHMgdGhlIGhpc3Rvcnkgb2JqZWN0J3MgYmFjayBtZXRob2QuXG4gICAqXG4gICAqIEBwdWJsaWNcbiAgICovXG4gIHN0YXRpYyBiYWNrKCkge1xuICAgIHRoaXMuaGlzdG9yeS5iYWNrKCk7XG4gIH1cblxuICAvKipcbiAgICogVGFrZXMgdGhlIHVzZXIgZm9yd2FyZCB0byB0aGUgbmV4dCBzdGF0ZS4gU2ltcGx5IHdyYXBzIHRoZSBoaXN0b3J5IG9iamVjdCdzIGZvcndhcmQgbWV0aG9kLlxuICAgKlxuICAgKiBAcHVibGljXG4gICAqL1xuICBzdGF0aWMgZm9yd2FyZCgpIHtcbiAgICB0aGlzLmhpc3RvcnkuZm9yd2FyZCgpO1xuICB9XG5cblxuICAvKipcbiAgICogUHJpdmF0ZSBtZXRob2RzXG4gICAqL1xuXG4gIC8qKlxuICAgKiBUYWtlcyBhIHByb3ZpZGVkIFVSTCBhbmQgcmV0dXJucyB0aGUgdmVyc2lvbiB0aGF0IGlzIHVzYWJsZVxuICAgKlxuICAgKiBAcHJpdmF0ZVxuICAgKiBAcGFyYW0gIHtzdHJpbmd9IFVSTCAgICAgICAgICAgICAgICAgICAgIFRoZSBVUkwgdG8gYmUgcGFzc2VkXG4gICAqIEBwYXJhbSAge2Jvb2xlYW59IGluY2x1ZGVEb2NSb290ID0gdHJ1ZSAgV2hldGhlciB0byBpbmNsdWRlIHRoZSBkb2Nyb290IG9uIHRoZSBwYXNzZWQgVVJMXG4gICAqIEBwYXJhbSAge2Jvb2xlYW59IGluY2x1ZGVUcmFpbHMgPSB0cnVlICAgV2hldGhlciB0byBpbmNsdWRlIGZvdW5kIGhhc2hlcyBhbmQgcGFyYW1zXG4gICAqIEByZXR1cm4ge3N0cmluZ30gICAgICAgICAgICAgICAgICAgICAgICAgVGhlIHBhc3NlZCBhbmQgZm9ybWF0dGVkIFVSTFxuICAgKi9cbiAgc3RhdGljIF9maXhVUkwoVVJMLCBpbmNsdWRlRG9jUm9vdCA9IHRydWUsIGluY2x1ZGVUcmFpbHMgPSB0cnVlKSB7XG5cbiAgICB2YXIgcnRuVVJMO1xuXG4gICAgLyoqXG4gICAgICogVVJMIFJlZ2V4IHdvcmtzIGxpa2UgdGhpczpcbiAgICAgKiBgYGBcbiAgICAgICAgXlxuICAgICAgICAoW146XSs6Ly8gICAgICAgICAgICMgSFRUUChTKSBldGMuXG4gICAgICAgICAgICAoW14vXSspICAgICAgICAgIyBUaGUgVVJMIChpZiBhdmFpbGFibGUpXG4gICAgICAgICk/XG4gICAgICAgICgje0Bkb2N1bWVudFJvb3R9KT8gIyBUaGUgZG9jdW1lbnQgcm9vdCwgd2hpY2ggd2Ugd2FudCB0byBnZXQgcmlkIG9mXG4gICAgICAgICgvKT8gICAgICAgICAgICAgICAgIyBjaGVjayBmb3IgdGhlIHByZXNlbmNlIG9mIGEgbGVhZGluZyBzbGFzaFxuICAgICAgICAoW15cXCNcXD9dKikgICAgICAgICAgIyBUaGUgVVJJIC0gdGhpcyBpcyB3aGF0IHdlIGNhcmUgYWJvdXQuIENoZWNrIGZvciBldmVyeXRoaW5nIGV4Y2VwdCBmb3IgIyBhbmQgP1xuICAgICAgICAoXFw/W15cXCNdKik/ICAgICAgICAgIyBhbnkgYWRkaXRpb25hbCBVUkwgcGFyYW1ldGVycyAob3B0aW9uYWwpXG4gICAgICAgIChcXCNcXCE/LispPyAgICAgICAgICAjIEFueSBoYXNoYmFuZyB0cmFpbGVycyAob3B0aW9uYWwpXG4gICAgICogYGBgXG4gICAgICovXG4gICAgY29uc3QgVVJMUmVnZXggPSBSZWdFeHAoYF4oW146XSs6Ly8oW14vXSspKT8oJHt0aGlzLmRvY3VtZW50Um9vdH0pPygvKT8oW15cXFxcI1xcXFw/XSopKFxcXFw/W15cXFxcI10qKT8oXFxcXCNcXFxcIT8uKyk/YCk7XG4gICAgY29uc3QgW2lucHV0LCBocmVmLCBob3N0bmFtZSwgZG9jdW1lbnRSb290LCByb290LCBwYXRoLCBwYXJhbXMsIGhhc2hiYW5nXSA9IFVSTFJlZ2V4LmV4ZWMoVVJMKTtcblxuICAgIGNvbnNvbGUubG9nKHRoaXMuZG9jdW1lbnRSb290LCBkb2N1bWVudFJvb3QsIHJvb3QsIHBhdGgpO1xuXG4gICAgLy8gSWYgd2UncmUgb2JzZXJ2aW5nIHRoZSBUTEROIHJlc3RyYWludCBhbmQgdGhlIHByb3ZpZGVkIFVSTCBkb2Vzbid0IG1hdGNoXG4gICAgLy8gdGhlIGRvbWFpbidzIFRMRE4sIHRocm93IGEgVVJJRXJyb3JcbiAgICBpZiggdHlwZW9mIGhvc3RuYW1lID09PSAnc3RyaW5nJyAmJiBob3N0bmFtZSAhPT0gdGhpcy5UTEROICYmIHRoaXMub2JzZXJ2ZVRMRE4gPT09IHRydWUgKSB7XG4gICAgICB0aHJvdyBuZXcgVVJJRXJyb3IoJ1RvcCBMZXZlbCBkb21haW4gbmFtZSBNVVNUIG1hdGNoIHRoZSBwcmltYXJ5IGRvbWFpbiBuYW1lJyk7XG4gICAgfVxuXG4gICAgLy8gSWYgb3VyIG1hdGNoZWQgVVJMIGhhcyBhIGxlYWRpbmcgc2xhc2gsIHRoZW4gd2Ugd2FudCB0byBkcm9wIHRoZSBkb2NSb290XG4gICAgLy8gaW4gdGhlcmUgdW5sZXNzIHRoZSBmdW5jdGlvbiBwYXJhbSBcImluY2x1ZGVEb2NSb290XCIgaXMgZmFsc2UuXG4gICAgaWYoXG4gICAgICAoIHR5cGVvZiByb290ID09PSAnc3RyaW5nJyAmJiByb290ID09PSAnLycgKSB8fFxuICAgICAgKCB0eXBlb2YgZG9jdW1lbnRSb290ID09PSAnc3RyaW5nJyAmJiBkb2N1bWVudFJvb3QgPT09IHRoaXMuZG9jdW1lbnRSb290IClcbiAgICApIHtcbiAgICAgIGlmKCBpbmNsdWRlRG9jUm9vdCApIHtcbiAgICAgICAgcnRuVVJMID0gYCR7dGhpcy5kb2N1bWVudFJvb3R9LyR7cGF0aH1gO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcnRuVVJMID0gYC8ke3BhdGh9YDtcbiAgICAgIH1cbiAgICAvLyBFbHNlIGlmIHBhdGggaGFzIHJlc3VsdGVkIGluIGFuIGVtcHR5IHN0cmluZywgYXNzdW1lIHRoZSBwYXRoIGlzIHRoZSByb290XG4gICAgfSBlbHNlIGlmKCBwYXRoID09PSAnJyApIHtcbiAgICAgIHJ0blVSTCA9ICcvJ1xuICAgIC8vIE90aGVyd2lzZSwganVzdCBwYXNzIHRoZSBwYXRoIGNvbXBsZXRlbHkuXG4gICAgfSBlbHNlIHtcbiAgICAgIHJ0blVSTCA9IHBhdGg7XG4gICAgfVxuXG4gICAgLy8gSWYgd2Ugd2FudCB0byBpbmNsdWRlIHRyYWlscyAoaGFzaGVzIGFuZCBwYXJhbXMsIGFzIGRldGVybWluZWQgYnkgYVxuICAgIC8vIGZ1bmNpdG9uIHBhcmFtKSwgdGhlbiBhZGQgdGhlbSB0byB0aGUgVVJMLlxuICAgIGlmKCBpbmNsdWRlVHJhaWxzICkge1xuICAgICAgLy8gQXBwZW5kIGFueSBwYXJhbXNcbiAgICAgIGlmKCB0eXBlb2YgcGFyYW1zID09ICdzdHJpbmcnICkge1xuICAgICAgICBydG5VUkwgKz0gcGFyYW1zO1xuICAgICAgfVxuICAgICAgICAvLyBBcHBlbmQgYW55IGhhc2hlc1xuICAgICAgaWYoIHR5cGVvZiBoYXNoYmFuZyA9PSAnc3RyaW5nJyApIHtcbiAgICAgICAgcnRuVVJMICs9IGhhc2hiYW5nO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBydG5VUkw7XG4gIH1cblxuICAvKipcbiAgICogTGlzdGVuZXIgZm9yIHRoZSBwb3BzdGF0ZSBtZXRob2RcbiAgICpcbiAgICogQHByaXZhdGVcbiAgICogQHBhcmFtICB7b2JqZWN0fSBlIHRoZSBwYXNzZWQgZXZlbnQgb2JqZWN0XG4gICAqIEByZXR1cm4gdm9pZFxuICAgKi9cbiAgc3RhdGljIF9wb3BzdGF0ZShlKSB7XG4gICAgdmFyIGJhc2UsIHN0YXRlO1xuICAgIGlmKHRoaXMuc3VwcG9ydClcbiAgICB7XG4gICAgICB0cnkge1xuICAgICAgICBzdGF0ZSA9IChiYXNlID0gdGhpcy5oaXN0b3J5KS5zdGF0ZSB8fCAoYmFzZS5zdGF0ZSA9IGUuc3RhdGUgfHwgKGUuc3RhdGUgPSB3aW5kb3cuZXZlbnQuc3RhdGUpKTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlcnMgYW5kIHNldHRlcnNcbiAgICovXG5cbiAgLyoqXG4gICAqIChnZXR0ZXIvc2V0dGVyKSBTZXRzIHRoZSBkb2N1bWVudCByb290IGZyb20gYSBwYXNzZWQgVVJMXG4gICAqIHJldHVybnMgdGhlIHNhdmVkIGRvY3VtZW50IHJvb3Qgb3IgYSBgL2AgaWYgbm90IHNldFxuICAgKlxuICAgKiBAZGVmYXVsdCAnLydcbiAgICogQHR5cGUge3N0cmluZ31cbiAgICovXG4gIHN0YXRpYyBzZXQgZG9jdW1lbnRSb290KGRvY3VtZW50Um9vdCA9ICcnKSB7XG5cbiAgICAvKipcbiAgICAgKiBkb2Nyb290UmVnZXggd29ya3MgbGlrZSB0aGlzOlxuICAgICAqIGBgYFxuICAgICAgICAgXlxuICAgICAgICAgKFteOl0rOi8vICAgICAgICMgSFRUUChTKSBldGMuXG4gICAgICAgICAgICAgKFteL10rKSAgICAgIyBUaGUgaG9zdG5hbWUgKGlmIGF2YWlsYWJsZSlcbiAgICAgICAgICk/XG4gICAgICAgICAvP1xuICAgICAgICAgKC4qKD89LykpPyAgICAgICMgdGhlIFVSSSB0byB1c2UgYXMgdGhlIGRvY3Jvb3QgbGVzcyBhbnkgYXZhaWxhYmxlIHRyYWlsaW5nIHNsYXNoXG4gICAgICogYGBgXG4gICAgICovXG4gICAgY29uc3QgZG9jcm9vdFJlZ2V4ID0gL14oW146XSs6XFwvXFwvKFteXFwvXSspKT9cXC8/KC4qKD89XFwvKSk/LztcbiAgICAvLyBwYXNzIHRoZSBkb2Nyb290IGFuZCBob3N0bmFtZVxuICAgIGNvbnN0IFtfMSwgXzIsIGhvc3RuYW1lLCBkb2Nyb290XSA9IGRvY3Jvb3RSZWdleC5leGVjKGRvY3VtZW50Um9vdCk7XG4gICAgY29uc29sZS5sb2coaG9zdG5hbWUsIGRvY3Jvb3QpO1xuXG4gICAgLy8gRXJyb3IgY2hlY2tcbiAgICAvLyBjaGVjayBmb3IgdGhlIHByZXNlbmNlIG9mIHRoZSByZXBvcnRlZCBUTEROXG4gICAgaWYoXG4gICAgICB0eXBlb2YgaG9zdG5hbWUgPT09ICdzdHJpbmcnICYmXG4gICAgICBob3N0bmFtZSAhPSB0aGlzLlRMRE4gJiZcbiAgICAgIHRoaXMub2JzZXJ2ZVRMRE4gPT09IHRydWVcbiAgICApIHtcbiAgICAgIHRocm93IG5ldyBVUklFcnJvcignVG9wIExldmVsIGRvbWFpbiBuYW1lIE1VU1QgbWF0Y2ggdGhlIHByaW1hcnkgZG9tYWluIG5hbWUnKTtcbiAgICB9XG5cbiAgICB0aGlzLl9kb2N1bWVudFJvb3QgPSBgLyR7ZG9jcm9vdH1gO1xuICB9XG4gIHN0YXRpYyBnZXQgZG9jdW1lbnRSb290KCkge1xuICAgIHJldHVybiB0aGlzLl9kb2N1bWVudFJvb3QgfHwgJy8nO1xuICB9XG5cbiAgLyoqXG4gICAqIChnZXR0ZXIvc2V0dGVyKSBQcm92aWRlcyBhbiBlcnJvciBpZiB0aGUgdXNlciB0cmllcyB0byBzZXQgdGhlIGhpc3Rvcnkgb2JqZWN0XG4gICAqIHJldHVybnMgdGhlIHdpbmRvdyBoaXN0b3J5IG9iamVjdFxuICAgKlxuICAgKiBAdHlwZSB7b2JqZWN0fVxuICAgKi9cbiAgc3RhdGljIHNldCBoaXN0b3J5KGhpc3RvcnkpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ1RoZSBoaXN0b3J5IG9iamVjdCBpcyByZWFkIG9ubHknKTtcbiAgfVxuICBzdGF0aWMgZ2V0IGhpc3RvcnkoKSB7XG4gICAgcmV0dXJuIHdpbmRvdy5oaXN0b3J5O1xuICB9XG5cbiAgLyoqXG4gICAqIChnZXR0ZXIvc2V0dGVyKSBTZXRzIHRoZSB0b3AgbGV2ZWwgZG9tYWluIG5hbWUuXG4gICAqIHJldHVybnMgdGhlIHJlY29yZGVkIFRMRE4gb3IsIGJ5IGRlZmF1bHQsIHdpbmRvdy5sb2NhdGlvbi5ob3N0bmFtZS5cbiAgICpcbiAgICogQHR5cGUge3N0cmluZ31cbiAgICovXG4gIHN0YXRpYyBzZXQgVExETihUTEROKSB7XG4gICAgLy8gQG5vdGUgV2Ugc2hvdWxkIGluY2x1ZGUgc29tZSBlcnJvciBjaGVja2luZyBpbiBoZXJlXG4gICAgdGhpcy5fVExETiA9IFRMRE47XG4gIH1cbiAgc3RhdGljIGdldCBUTEROKCkge1xuICAgIHJldHVybiB0aGlzLl9UTEROIHx8IHdpbmRvdy5sb2NhdGlvbi5ob3N0bmFtZTtcbiAgfVxuXG4gIC8qKlxuICAgKiAoZ2V0dGVyL3NldHRlcikgd2hldGhlciB0byBvYnNlcnZlIHRoZSBUTEROIG9yIGB0cnVlYCAoZGVmYXVsdCkuXG4gICAqXG4gICAqIEBkZWZhdWx0IHRydWVcbiAgICogQHR5cGUge2Jvb2xlYW59XG4gICAqL1xuICBzdGF0aWMgc2V0IG9ic2VydmVUTEROKG9ic2VydmUpIHtcbiAgICAvLyBDaGVjayB0byBtYWtlIHN1cmUgdGhhdCB0aGUgYmFzc2VkIHZhbHVlIGlzIG9mIHR5cGUgYm9vbGVhbi5cbiAgICBpZih0eXBlb2Ygb2JzZXJ2ZSA9PT0gJ2Jvb2xlYW4nKVxuICAgIHtcbiAgICAgIHRoaXMuX29ic2VydmVUTEROID0gb2JzZXJ2ZTtcbiAgICB9IGVsc2VcbiAgICB7XG4gICAgICBjb25zb2xlLndhcm4oJ29ic2VydmVUTEROIG11c3QgYmUgb2YgdHlwZSBib29sZWFuJyk7XG4gICAgfVxuICB9XG4gIHN0YXRpYyBnZXQgb2JzZXJ2ZVRMRE4oKSB7XG4gICAgaWYodHlwZW9mIHRoaXMuX29ic2VydmVUTEROID09PSAnYm9vbGVhbicpXG4gICAge1xuICAgICAgcmV0dXJuIHRoaXMuX29ic2VydmVUTEROO1xuICAgIH0gZWxzZVxuICAgIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiAoZ2V0dGVyL3NldHRlcikgV2hldGhlciB0aGlzIGhpc3Rvcnkgb2JqZWN0IGlzIGluIGRldm1vZGUuIERlZmF1bHRzIHRvIGZhbHNlXG4gICAqXG4gICAqIEBkZWZhdWx0IGZhbHNlXG4gICAqIEB0eXBlIHtib29sZWFufVxuICAgKi9cbiAgc3RhdGljIHNldCBkZXZtb2RlKGRldm1vZGUpIHtcbiAgICAvLyBDaGVjayB0byBtYWtlIHN1cmUgdGhhdCB0aGUgYmFzc2VkIHZhbHVlIGlzIG9mIHR5cGUgYm9vbGVhbi5cbiAgICBpZih0eXBlb2YgZGV2bW9kZSA9PT0gJ2Jvb2xlYW4nKVxuICAgIHtcbiAgICAgIHRoaXMuX2Rldm1vZGUgPSBkZXZtb2RlO1xuICAgIH0gZWxzZVxuICAgIHtcbiAgICAgIGNvbnNvbGUud2FybignZGV2bW9kZSBtdXN0IGJlIG9mIHR5cGUgYm9vbGVhbicpO1xuICAgIH1cbiAgfVxuICBzdGF0aWMgZ2V0IGRldm1vZGUoKSB7XG4gICAgaWYodHlwZW9mIHRoaXMuX2Rldm1vZGUgPT09ICdib29sZWFuJylcbiAgICB7XG4gICAgICByZXR1cm4gdGhpcy5fZGV2bW9kZTtcbiAgICB9IGVsc2VcbiAgICB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIChnZXR0ZXIvc2V0dGVyKSBXaGV0aGVyIHRoaXMgaGlzdG9yeSBvYmplY3QgaXMgaW5pdGlhbGlhc2VkLlxuICAgKlxuICAgKiBAZGVmYXVsdCBmYWxzZVxuICAgKiBAdHlwZSB7Ym9vbGVhbn1cbiAgICovXG4gIHN0YXRpYyBzZXQgaW5pdGlhbGlhc2VkKGluaXRpYWxpYXNlZCkge1xuICAgIC8vIENoZWNrIHRvIG1ha2Ugc3VyZSB0aGF0IHRoZSBiYXNzZWQgdmFsdWUgaXMgb2YgdHlwZSBib29sZWFuLlxuICAgIGlmKHR5cGVvZiBpbml0aWFsaWFzZWQgPT09ICdib29sZWFuJylcbiAgICB7XG4gICAgICB0aGlzLl9pbml0aWFsaWFzZWQgPSBpbml0aWFsaWFzZWQ7XG4gICAgfSBlbHNlXG4gICAge1xuICAgICAgY29uc29sZS53YXJuKCdpbml0aWFsaWFzZWQgbXVzdCBiZSBvZiB0eXBlIGJvb2xlYW4nKTtcbiAgICB9XG4gIH1cbiAgc3RhdGljIGdldCBpbml0aWFsaWFzZWQoKSB7XG4gICAgaWYodHlwZW9mIHRoaXMuX2luaXRpYWxpYXNlZCA9PT0gJ2Jvb2xlYW4nKVxuICAgIHtcbiAgICAgIHJldHVybiB0aGlzLl9pbml0aWFsaWFzZWQ7XG4gICAgfSBlbHNlXG4gICAge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiAoZ2V0dGVyL3NldHRlcikgV2hldGhlciBoaXN0b3J5IGlzIHN1cHBvcnRlZCBieSB0aGUgYnJvd3NlciBvciBkZXZpY2UuXG4gICAqIFByb3ZpZGVzIGFuIGVycm9yIGlmIHRoZSB1c2VyIHRyaWVzIHRvIHNldCB0aGUgc3VwcG9ydCB2YWx1ZSwgdW5sZXNzIHRoZSBvYmplY3QgaXMgaW4gZGV2bW9kZVxuICAgKlxuICAgKiBAdHlwZSB7Ym9vbGVhbn1cbiAgICovXG4gIHN0YXRpYyBzZXQgc3VwcG9ydChzdXBwb3J0ID0gZmFsc2UpIHtcbiAgICAvLyBUaGlzIG92ZXJyaWRlc1xuICAgIGlmKCB0aGlzLmRldm1vZGUgJiYgdHlwZW9mIHN1cHBvcnQgPT09ICdib29sZWFuJyApIHtcbiAgICAgIHRoaXMuX3N1cHBvcnQgPSBzdXBwb3J0O1xuICAgIH1cbiAgICB0aHJvdyBuZXcgRXJyb3IoJ1RoZSBzdXBwb3J0IGlzIHJlYWQgb25seScpO1xuICB9XG4gIHN0YXRpYyBnZXQgc3VwcG9ydCgpIHtcbiAgICByZXR1cm4gKHdpbmRvdy5oaXN0b3J5ICYmIHdpbmRvdy5oaXN0b3J5LnB1c2hTdGF0ZSk7XG4gIH1cblxuICAvKipcbiAgICogKGdldHRlci9zZXR0ZXIpIFRoZSBsZW5ndGggb2YgdGhlIGhpc3Rvcnkgc3RhY2tcbiAgICpcbiAgICogQHR5cGUge2ludGVnZXJ9XG4gICAqL1xuICBzdGF0aWMgZ2V0IGxlbmd0aCgpIHtcbiAgICByZXR1cm4gdGhpcy5oaXN0b3J5Lmxlbmd0aDtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBIaXN0b3J5O1xuIl19
