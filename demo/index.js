(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _wtcAjax = require('../src/wtc-ajax');

// Initialise the history object in dev mode
_wtcAjax.AJAX.init(true);
// Set the document root for the application (if necessary)
_wtcAjax.AJAX.documentRoot = '/demo/';

function ready(fn) {
  if (document.readyState != 'loading') {
    fn();
  } else {
    document.addEventListener('DOMContentLoaded', fn);
  }
}

ready(function () {
  // This initialises any links with AJAX attributes
  _wtcAjax.AJAX.initLinks();

  // This is a manual initialisation of links and is, instead, a demonstration
  // of how programatic AJAX retrieval works.
  var callingObject = {
    onLoad: function onLoad(response, targetLink, args) {
      console.log('onLoad');
      console.log(response, targetLink, args);
    },
    onError: function onError(response, targetLink, args) {
      console.log('onerror');
      console.log(response, targetLink, args);
    }
  };
  window.addEventListener('load', function (e) {
    document.getElementById('link_1').addEventListener('click', function (e) {
      _wtcAjax.AJAX.ajaxGet("/demo/page1.html", "#link1-target", ".link1-selection", e.target).then(function (resolver) {
        console.log('onLoad', resolver);
        return resolver;
      });
    });
  });
});

window.AJAXObj = _wtcAjax.AJAX;

},{"../src/wtc-ajax":3}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

/**
 * This module Provides animation detection and pseudo-listener functionality
 *
 * @module wtc-AnimationEvents
 * @exports Animation
 */

/**
 * This function takes a node and determines the full end time of any transitions
 * on it. Returns the time in milliseconds.
 *
 * @private
 * @param   {HTMLElement} node  The node o detext the transition time for.
 * @return  {Number}            The full transition time for the node, including delays, in milliseconds
 */
var detectAnimationEndTime = function detectAnimationEndTime(node) {
  var fulltime = 0;
  var timeRegex = /(\d+\.?(\d+)?)(s|ms)/;
  var recursiveLoop = function recursiveLoop(el) {
    if (el instanceof Element) {
      var timebreakdown = timeRegex.exec(window.getComputedStyle(el).transitionDuration);
      var delaybreakdown = timeRegex.exec(window.getComputedStyle(el).transitionDelay);
      var time = timebreakdown[1] * (timebreakdown[3] == 's' ? 1000 : 1);
      var delay = delaybreakdown[1] * (delaybreakdown[3] == 's' ? 1000 : 1);
      if (time + delay > fulltime) {
        fulltime = time + delay;
      }
    }
    if (el.childNodes) {
      for (i in el.childNodes) {
        recursiveLoop(el.childNodes[i]);
      }
    }
  };

  recursiveLoop(node);

  if (typeof fulltime !== 'number') {
    fulltime = 0;
  }

  return fulltime;
};

/**
 * Allows us to add an end event listener to the node.
 *
 * @param  {HTMLElement}  node      The element to attach the end event listener to
 * @param  {function}     listener  The function to run when the animation is finished
 * @return {object}                 The utlity object that allows us to cancel or end this
 */
var addEndEventListener = function addEndEventListener(node, listener) {
  if (typeof listener !== 'function') {
    var listener = function listener() {};
  }
  var time = detectAnimationEndTime(node);
  var timeout = setTimeout(listener, time);
  var util = {
    time: time,
    timeout: timeout,
    // target: node, // Removed this so as not to cause leaks.
    cancel: function cancel() {
      clearTimeout(timeout);
    },
    end: function end() {
      this.cancel();
      listener();
    }
  };

  return util;
};

/**
 * The animation object encapsulates all of the basic functionality that allows us
 * to detect animation etc.
 *
 * @export
 */
var Animation = {
  addEndEventListener: addEndEventListener
};

exports.default = Animation;

},{}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.STATES = exports.ERRORS = exports.AJAX = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _wtcHistory = require("./wtc-history");

var _wtcHistory2 = _interopRequireDefault(_wtcHistory);

var _wtcAnimationEvents = require("./wtc-AnimationEvents");

var _wtcAnimationEvents2 = _interopRequireDefault(_wtcAnimationEvents);

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

var ERRORS = {
  'GENERIC_ERROR': 0,
  'BAD_PROMISE': 1,
  'LOAD_ERROR': 2
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
 * @author Liam Egan <liam@wethecollective.com>
 * @version 0.5
 * @created Nov 19, 2016
 */

var AJAX = function (_History) {
  _inherits(AJAX, _History);

  function AJAX() {
    _classCallCheck(this, AJAX);

    return _possibleConstructorReturn(this, (AJAX.__proto__ || Object.getPrototypeOf(AJAX)).apply(this, arguments));
  }

  _createClass(AJAX, null, [{
    key: "initLinks",


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

      var links = rootDocument.querySelectorAll("[" + this.attributeAjax + "=\"true\"]");

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
     * The resolving object. This is the object that is passed to AJAX GET promise thens
     * and should be passed onto subsequent THENable calls.
     *
     * @callback AJAXGetResolver
     * @param {string} response           The response from the AJAX call
     * @param {array} arguments           The arguments array originally passed to the {@link AJAX.ajaxGet} method
     * @param {DOMElement} linkTarget     The target element that fired the {@link AJAX.ajaxGet} 
     */
    /**
     * Callback for AJAX GET onload. This is called when the content is loaded.
     *
     * @callback loadResolve
     * @param {AJAXGetResolver} resolver  The resolving object for the AJAX request
     * @return {AJAXGetResolver}          The ongoing resolving object for the AJAX request
     */
    /**
     * Callback for AJAX GET error. This is called when an error occurs after
     * calling an ajax GET.
     *
     * @callback loadReject
     * @param {object} error              The error that occurred
     * @param {array} args                The arguments that were passed to the request
     * @param {DOMElement} [targetLink]   The link that spawned the ajax request
     */

    /**
     * This builds out an AJAX request, normally based on the clicking of a link,
     * but it can alternatively be called directly on the AJAX object.
     *
     * @static
     * @param  {string} URL                     The URL to get. This will be parsed into an appropriate fomat by the object.
     * @param  {string} target                  The target for the loaded content. This can be a string (selector), or a JSON array of selector strings.
     * @param  {string} selection               This is a selector (or JSON of selectors) that determines what to cut from the loaded content.
     * @param  {DOMElement} [linkTarget]        The target of the link. This is useful for setting active states in callback.
     * @param  {boolean} fromPop                Indicates that this GET is from a pop
     * @param  {object} [data = {}]             The data to pass to the AJAX call.
     * @return {Promise}
     * @return {loadResolve}
     * @return {loadReject}                     A promise that represents the GET
     */

  }, {
    key: "ajaxGet",
    value: function ajaxGet(URL, target, selection, linkTarget) {
      var fromPop = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;
      var data = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : {};


      // Set the state of the AJAX class to clicked, incidating something is loading
      if (this.state > STATES.CLICKED) {
        if (this.devmode) {
          console.warn("Tried run an AJAX GET when the object wasn't in OK or CLICKED mode");
        }

        return;
      }

      // Retrieve a request object and construct a valid URL
      var req = this.requestObject;
      var parsedURL = this._fixURL(URL);

      var readyState = 0;
      var status = 0;
      var args = arguments;

      var requestPromise = new Promise(function handler(resolve, reject) {

        // Listen for the ready state
        req.addEventListener('readystatechange', function (e) {
          readyState = e.target.readyState;
          status = e.target.status;
        });

        // Listem for the load event
        req.addEventListener('load', function (e) {
          // If we have a ready state that indicated that the load was a success, continue
          if (req.status >= 200 && req.status < 400) {
            // Get the request response text
            var responseText = req.responseText;
            var resolver = {
              responseText: responseText,
              arguments: args,
              linkTarget: linkTarget || null
            };
            resolve(resolver);
          } else {
            reject(ERRORS.LOAD_ERROR);
          }
        });

        req.addEventListener('error', function (e) {
          reject(ERRORS.LOAD_ERROR);
        });
      }.bind(this));

      // This promise takes the returned promise and runs the equivalent of a "finally"
      Promise.resolve(requestPromise).then(function (resolver) {
        if (resolver.error) {
          throw resolver.error;
        } else if (!resolver.responseText) {
          throw ERRORS.BAD_PROMISE;
        } else {
          // Finally, pass the result.
          this._parseResponse(resolver.responseText, target, selection, fromPop, linkTarget);
        }
      }.bind(this)).catch(function (err) {
        this._error(readyState, req.status, err || 0);
      }.bind(this));

      // Save the last parsed URL for the purpose of history interoperability and error correction.
      this.lastParsedURL = parsedURL;

      req.open('GET', parsedURL, true);
      req.send(data);

      // Set the object state
      this.state = STATES.LOADING;

      return requestPromise;
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
    key: "_popstate",
    value: function _popstate(e) {
      var base,
          state = {};
      var hasPoppedState = _get(AJAX.__proto__ || Object.getPrototypeOf(AJAX), "_popstate", this).call(this, e);

      if (hasPoppedState) {
        state = (base = this.history).state || (base.state = e.state || (e.state = window.event.state));
      }

      var href = document.location.href;
      var target = state.target || this.lastChangedTarget;
      var selection = state.selection || SELECTORS.CHILDREN;
      var data = state.data || {};
      var onload = state.onload || function () {};
      var onerror = state.onerror || this;

      this.ajaxGet(href, target, selection, onload, onerror, true, data);

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
    key: "_triggerAjaxLink",
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
     * @param  {function} [onerror]       The on error function
     * @param  {DOMElement} [linkTarget]  The target of the link. This is useful for setting active states in callback.
     */

  }, {
    key: "_parseResponse",
    value: function _parseResponse(content, target, selection) {
      var fromPop = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
      var onload = arguments[4];
      var onerror = arguments[5];
      var linkTarget = arguments[6];


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
        // Wokflow will go like this:
        // Add the transition class to the element
        // Time out a bit (10ms) and then add the transition end class
        // Once complete, remove the transition classes and replace the old elements with the new (innerHTML)
        // Then add the transition class to the element
        // Time out a bit (10ms) and then add the transition end class

        el.innerHTML = '';

        // Find the results of the selection
        // N.B. This will all need to be updated to support the array syntax
        if (selection === SELECTORS.CHILDREN) {
          results = doc.querySelectorAll(target + " > *");
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
        this.push(this.lastParsedURL, newTitle, { target: target, selection: selection, onload: onload, onerror: onerror });
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
    key: "_error",
    value: function _error(readyState, status) {
      var errorState = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : ERRORS.GENERIC_ERROR;

      var errorStateConst = function (val) {
        for (key in ERRORS) {
          if (ERRORS[key] == val) return key;
        }return 'GENERIC_ERROR';
      }(errorState);
      console.warn("%c Error loading AJAX link. readyState: " + readyState + ". status: " + status + ". errorState: " + errorStateConst, 'background: #222; color: #ff7c3a');
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
    key: "attributeAjax",
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
    key: "attributeTarget",
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
    key: "attributeSelection",
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
     * (getter/setter) The classname to use as the basis for transitions. Default
     * will be *wtc-transition*. So this will then be used for all 3 states:
     * *.wtc-transition*
     * *.wtc-transition-out*
     * *.wtc-transition-out-start*
     * *.wtc-transition-out-end*
     * *.wtc-transition-in*
     * *.wtc-transition-in-start*
     * *.wtc-transition-in-end*
     *
     * @type {string}
     * @default 'wtc-transition'
     */

  }, {
    key: "classBaseTransition",
    set: function set(classBase) {
      if (typeof classBase === 'string') {
        this._classBaseTransition = classBase;
      } else {
        console.warn('All attributes must be strings.');
      }
    },
    get: function get() {
      return this._classBaseTransition || 'wtc-transition';
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
    key: "attributeShouldNavigate",
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
     * @readonly
     * @return {object}  requestObject
     */

  }, {
    key: "requestObject",
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
    key: "lastChangedTarget",
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
    key: "state",
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
              console.log("%c AJAX state change: " + this._state + " ", 'background: #222; color: #bada55');
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
    key: "lastParsedURL",
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

exports.AJAX = AJAX;
exports.ERRORS = ERRORS;
exports.STATES = STATES;

},{"./wtc-AnimationEvents":2,"./wtc-history":4}],4:[function(require,module,exports){
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
 * @author Liam Egan <liam@wethecollective.com>
 * @version 0.8
 * @created Nov 19, 2016
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJkZW1vL3J1bi5qcyIsInNyYy93dGMtQW5pbWF0aW9uRXZlbnRzLmpzIiwic3JjL3d0Yy1hamF4LmpzIiwic3JjL3d0Yy1oaXN0b3J5LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUNBQTs7QUFFQTtBQUNBLGNBQUssSUFBTCxDQUFVLElBQVY7QUFDQTtBQUNBLGNBQUssWUFBTCxHQUFvQixRQUFwQjs7QUFFQSxTQUFTLEtBQVQsQ0FBZSxFQUFmLEVBQW1CO0FBQ2pCLE1BQUksU0FBUyxVQUFULElBQXVCLFNBQTNCLEVBQXNDO0FBQ3BDO0FBQ0QsR0FGRCxNQUVPO0FBQ0wsYUFBUyxnQkFBVCxDQUEwQixrQkFBMUIsRUFBOEMsRUFBOUM7QUFDRDtBQUNGOztBQUVELE1BQU0sWUFDTjtBQUNFO0FBQ0EsZ0JBQUssU0FBTDs7QUFFQTtBQUNBO0FBQ0EsTUFBSSxnQkFBZ0I7QUFDbEIsWUFBUSxnQkFBUyxRQUFULEVBQW1CLFVBQW5CLEVBQStCLElBQS9CLEVBQXFDO0FBQzNDLGNBQVEsR0FBUixDQUFZLFFBQVo7QUFDQSxjQUFRLEdBQVIsQ0FBWSxRQUFaLEVBQXNCLFVBQXRCLEVBQWtDLElBQWxDO0FBQ0QsS0FKaUI7QUFLbEIsYUFBUyxpQkFBUyxRQUFULEVBQW1CLFVBQW5CLEVBQStCLElBQS9CLEVBQXFDO0FBQzVDLGNBQVEsR0FBUixDQUFZLFNBQVo7QUFDQSxjQUFRLEdBQVIsQ0FBWSxRQUFaLEVBQXNCLFVBQXRCLEVBQWtDLElBQWxDO0FBQ0Q7QUFSaUIsR0FBcEI7QUFVQSxTQUFPLGdCQUFQLENBQXdCLE1BQXhCLEVBQWdDLFVBQVMsQ0FBVCxFQUFZO0FBQzFDLGFBQVMsY0FBVCxDQUF3QixRQUF4QixFQUFrQyxnQkFBbEMsQ0FBbUQsT0FBbkQsRUFBNEQsVUFBUyxDQUFULEVBQVk7QUFDdEUsb0JBQ0UsT0FERixDQUNVLGtCQURWLEVBQzhCLGVBRDlCLEVBQytDLGtCQUQvQyxFQUNtRSxFQUFFLE1BRHJFLEVBRUUsSUFGRixDQUVPLFVBQVMsUUFBVCxFQUFtQjtBQUN0QixnQkFBUSxHQUFSLENBQVksUUFBWixFQUFzQixRQUF0QjtBQUNBLGVBQU8sUUFBUDtBQUNELE9BTEg7QUFNRCxLQVBEO0FBUUQsR0FURDtBQVVELENBM0JEOztBQTZCQSxPQUFPLE9BQVA7Ozs7Ozs7OztBQzNDQTs7Ozs7OztBQVFBOzs7Ozs7OztBQVFBLElBQUkseUJBQXlCLFNBQXpCLHNCQUF5QixDQUFTLElBQVQsRUFDN0I7QUFDRSxNQUFJLFdBQVcsQ0FBZjtBQUNBLE1BQUksWUFBWSxzQkFBaEI7QUFDQSxNQUFJLGdCQUFnQixTQUFoQixhQUFnQixDQUFTLEVBQVQsRUFBYTtBQUMvQixRQUFHLGNBQWMsT0FBakIsRUFBMEI7QUFDeEIsVUFBSSxnQkFBZ0IsVUFBVSxJQUFWLENBQWUsT0FBTyxnQkFBUCxDQUF3QixFQUF4QixFQUE0QixrQkFBM0MsQ0FBcEI7QUFDQSxVQUFJLGlCQUFpQixVQUFVLElBQVYsQ0FBZSxPQUFPLGdCQUFQLENBQXdCLEVBQXhCLEVBQTRCLGVBQTNDLENBQXJCO0FBQ0EsVUFBSSxPQUFPLGNBQWMsQ0FBZCxLQUFvQixjQUFjLENBQWQsS0FBb0IsR0FBcEIsR0FBMEIsSUFBMUIsR0FBaUMsQ0FBckQsQ0FBWDtBQUNBLFVBQUksUUFBUSxlQUFlLENBQWYsS0FBcUIsZUFBZSxDQUFmLEtBQXFCLEdBQXJCLEdBQTJCLElBQTNCLEdBQWtDLENBQXZELENBQVo7QUFDQSxVQUFHLE9BQU8sS0FBUCxHQUFlLFFBQWxCLEVBQTRCO0FBQzFCLG1CQUFXLE9BQU8sS0FBbEI7QUFDRDtBQUNGO0FBQ0QsUUFBRyxHQUFHLFVBQU4sRUFBa0I7QUFDaEIsV0FBSSxDQUFKLElBQVMsR0FBRyxVQUFaLEVBQXdCO0FBQ3RCLHNCQUFjLEdBQUcsVUFBSCxDQUFjLENBQWQsQ0FBZDtBQUNEO0FBQ0Y7QUFDRixHQWZEOztBQWlCQSxnQkFBYyxJQUFkOztBQUVBLE1BQUcsT0FBTyxRQUFQLEtBQW9CLFFBQXZCLEVBQWlDO0FBQy9CLGVBQVcsQ0FBWDtBQUNEOztBQUVELFNBQU8sUUFBUDtBQUNELENBNUJEOztBQThCQTs7Ozs7OztBQU9BLElBQUksc0JBQXNCLFNBQXRCLG1CQUFzQixDQUFTLElBQVQsRUFBZSxRQUFmLEVBQXlCO0FBQ2pELE1BQUcsT0FBTyxRQUFQLEtBQW9CLFVBQXZCLEVBQ0E7QUFDRSxRQUFJLFdBQVcsU0FBWCxRQUFXLEdBQVUsQ0FBRSxDQUEzQjtBQUNEO0FBQ0QsTUFBSSxPQUFPLHVCQUF1QixJQUF2QixDQUFYO0FBQ0EsTUFBSSxVQUFVLFdBQVcsUUFBWCxFQUFxQixJQUFyQixDQUFkO0FBQ0EsTUFBSSxPQUFPO0FBQ1QsVUFBTSxJQURHO0FBRVQsYUFBUyxPQUZBO0FBR1Q7QUFDQSxZQUFRLGtCQUFXO0FBQ2pCLG1CQUFhLE9BQWI7QUFDRCxLQU5RO0FBT1QsU0FBSyxlQUFXO0FBQ2QsV0FBSyxNQUFMO0FBQ0E7QUFDRDtBQVZRLEdBQVg7O0FBYUEsU0FBTyxJQUFQO0FBQ0QsQ0FyQkQ7O0FBdUJBOzs7Ozs7QUFNQSxJQUFJLFlBQVk7QUFDZCx1QkFBcUI7QUFEUCxDQUFoQjs7a0JBS2UsUzs7Ozs7Ozs7Ozs7Ozs7QUN4RmY7Ozs7QUFDQTs7Ozs7Ozs7Ozs7O0FBRUEsSUFBTSxTQUFTO0FBQ2IsUUFBc0IsQ0FEVDtBQUViLGFBQXNCLENBRlQ7QUFHYixhQUFzQixDQUhUO0FBSWIsbUJBQXNCLENBSlQ7QUFLYixZQUFzQjtBQUxULENBQWY7O0FBUUEsSUFBTSxZQUFZO0FBQ2hCLGNBQXNCLENBRE4sQ0FDUTtBQURSLENBQWxCOztBQUlBLElBQU0sU0FBUztBQUNiLG1CQUFzQixDQURUO0FBRWIsaUJBQXNCLENBRlQ7QUFHYixnQkFBc0I7QUFIVCxDQUFmOztBQU1BOzs7Ozs7Ozs7Ozs7Ozs7OztJQWdCTSxJOzs7Ozs7Ozs7Ozs7O0FBRUo7Ozs7QUFJQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O2dDQW9DK0M7QUFBQTs7QUFBQSxVQUE5QixZQUE4Qix1RUFBZixTQUFTLElBQU07O0FBQzdDLFVBQU0sUUFBUSxhQUFhLGdCQUFiLE9BQWtDLEtBQUssYUFBdkMsZ0JBQWQ7O0FBRUEsWUFBTSxPQUFOLENBQWMsVUFBQyxJQUFELEVBQVM7QUFDckI7QUFDQSxhQUFLLGVBQUwsQ0FBcUIsT0FBSyxhQUExQjs7QUFFQSxhQUFLLGdCQUFMLENBQXNCLE9BQXRCLEVBQStCLFVBQUMsQ0FBRCxFQUFNO0FBQ25DLGlCQUFLLGdCQUFMLENBQXNCLENBQXRCOztBQUVBLFlBQUUsY0FBRjtBQUNELFNBSkQ7QUFLQSxnQkFBUSxHQUFSLENBQVksSUFBWjtBQUNELE9BVkQ7QUFXRDs7QUFFRDs7Ozs7Ozs7O0FBU0E7Ozs7Ozs7QUFPQTs7Ozs7Ozs7OztBQVVBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7NEJBZWUsRyxFQUFLLE0sRUFBUSxTLEVBQVcsVSxFQUF3QztBQUFBLFVBQTVCLE9BQTRCLHVFQUFsQixLQUFrQjtBQUFBLFVBQVgsSUFBVyx1RUFBSixFQUFJOzs7QUFFN0U7QUFDQSxVQUFJLEtBQUssS0FBTCxHQUFhLE9BQU8sT0FBeEIsRUFDQTtBQUNFLFlBQUksS0FBSyxPQUFULEVBQ0E7QUFDRSxrQkFBUSxJQUFSLENBQWMsb0VBQWQ7QUFDRDs7QUFFRDtBQUNEOztBQUVEO0FBQ0EsVUFBTSxNQUFNLEtBQUssYUFBakI7QUFDQSxVQUFNLFlBQVksS0FBSyxPQUFMLENBQWEsR0FBYixDQUFsQjs7QUFFQSxVQUFJLGFBQWEsQ0FBakI7QUFDQSxVQUFJLFNBQVMsQ0FBYjtBQUNBLFVBQUksT0FBTyxTQUFYOztBQUVBLFVBQUksaUJBQWlCLElBQUksT0FBSixDQUFZLFNBQVMsT0FBVCxDQUFpQixPQUFqQixFQUEwQixNQUExQixFQUFrQzs7QUFFakU7QUFDQSxZQUFJLGdCQUFKLENBQXFCLGtCQUFyQixFQUF5QyxVQUFDLENBQUQsRUFBTztBQUM5Qyx1QkFBYSxFQUFFLE1BQUYsQ0FBUyxVQUF0QjtBQUNBLG1CQUFTLEVBQUUsTUFBRixDQUFTLE1BQWxCO0FBQ0QsU0FIRDs7QUFLQTtBQUNBLFlBQUksZ0JBQUosQ0FBcUIsTUFBckIsRUFBNkIsVUFBQyxDQUFELEVBQU87QUFDbEM7QUFDQSxjQUFJLElBQUksTUFBSixJQUFjLEdBQWQsSUFBcUIsSUFBSSxNQUFKLEdBQWEsR0FBdEMsRUFBNEM7QUFDMUM7QUFDQSxnQkFBSSxlQUFlLElBQUksWUFBdkI7QUFDQSxnQkFBSSxXQUFXO0FBQ2IsNEJBQWMsWUFERDtBQUViLHlCQUFXLElBRkU7QUFHYiwwQkFBWSxjQUFjO0FBSGIsYUFBZjtBQUtBLG9CQUFRLFFBQVI7QUFDRCxXQVRELE1BU087QUFDTCxtQkFBTyxPQUFPLFVBQWQ7QUFDRDtBQUNGLFNBZEQ7O0FBZ0JBLFlBQUksZ0JBQUosQ0FBcUIsT0FBckIsRUFBOEIsVUFBQyxDQUFELEVBQU87QUFDbkMsaUJBQU8sT0FBTyxVQUFkO0FBQ0QsU0FGRDtBQUdELE9BNUJnQyxDQTRCL0IsSUE1QitCLENBNEIxQixJQTVCMEIsQ0FBWixDQUFyQjs7QUE4QkE7QUFDQSxjQUFRLE9BQVIsQ0FBZ0IsY0FBaEIsRUFBZ0MsSUFBaEMsQ0FBcUMsVUFBUyxRQUFULEVBQW1CO0FBQ3RELFlBQUcsU0FBUyxLQUFaLEVBQW1CO0FBQ2pCLGdCQUFNLFNBQVMsS0FBZjtBQUNELFNBRkQsTUFFTyxJQUFHLENBQUMsU0FBUyxZQUFiLEVBQTJCO0FBQ2hDLGdCQUFNLE9BQU8sV0FBYjtBQUNELFNBRk0sTUFFQTtBQUNMO0FBQ0EsZUFBSyxjQUFMLENBQW9CLFNBQVMsWUFBN0IsRUFBMkMsTUFBM0MsRUFBbUQsU0FBbkQsRUFBOEQsT0FBOUQsRUFBdUUsVUFBdkU7QUFDRDtBQUNGLE9BVG9DLENBU25DLElBVG1DLENBUzlCLElBVDhCLENBQXJDLEVBU2MsS0FUZCxDQVNvQixVQUFTLEdBQVQsRUFBYztBQUNoQyxhQUFLLE1BQUwsQ0FBWSxVQUFaLEVBQXdCLElBQUksTUFBNUIsRUFBb0MsT0FBTyxDQUEzQztBQUNELE9BRm1CLENBRWxCLElBRmtCLENBRWIsSUFGYSxDQVRwQjs7QUFhQTtBQUNBLFdBQUssYUFBTCxHQUFxQixTQUFyQjs7QUFFQSxVQUFJLElBQUosQ0FBUyxLQUFULEVBQWdCLFNBQWhCLEVBQTJCLElBQTNCO0FBQ0EsVUFBSSxJQUFKLENBQVMsSUFBVDs7QUFFQTtBQUNBLFdBQUssS0FBTCxHQUFhLE9BQU8sT0FBcEI7O0FBRUEsYUFBTyxjQUFQO0FBQ0Q7O0FBRUQ7Ozs7QUFJQTs7Ozs7Ozs7Ozs4QkFPaUIsQyxFQUFHO0FBQ2xCLFVBQUksSUFBSjtBQUFBLFVBQVUsUUFBUSxFQUFsQjtBQUNBLFVBQUksbUdBQWlDLENBQWpDLENBQUo7O0FBRUEsVUFBSSxjQUFKLEVBQXFCO0FBQ25CLGdCQUFRLENBQUMsT0FBTyxLQUFLLE9BQWIsRUFBc0IsS0FBdEIsS0FBZ0MsS0FBSyxLQUFMLEdBQWEsRUFBRSxLQUFGLEtBQVksRUFBRSxLQUFGLEdBQVUsT0FBTyxLQUFQLENBQWEsS0FBbkMsQ0FBN0MsQ0FBUjtBQUNEOztBQUVELFVBQUksT0FBTyxTQUFTLFFBQVQsQ0FBa0IsSUFBN0I7QUFDQSxVQUFJLFNBQVMsTUFBTSxNQUFOLElBQWdCLEtBQUssaUJBQWxDO0FBQ0EsVUFBSSxZQUFZLE1BQU0sU0FBTixJQUFtQixVQUFVLFFBQTdDO0FBQ0EsVUFBSSxPQUFPLE1BQU0sSUFBTixJQUFjLEVBQXpCO0FBQ0EsVUFBSSxTQUFTLE1BQU0sTUFBTixJQUFnQixZQUFVLENBQUUsQ0FBekM7QUFDQSxVQUFJLFVBQVUsTUFBTSxPQUFOLElBQWlCLElBQS9COztBQUVBLFdBQUssT0FBTCxDQUFhLElBQWIsRUFBbUIsTUFBbkIsRUFBMkIsU0FBM0IsRUFBc0MsTUFBdEMsRUFBOEMsT0FBOUMsRUFBdUQsSUFBdkQsRUFBNkQsSUFBN0Q7O0FBRUEsYUFBTyxjQUFQO0FBQ0Q7O0FBRUQ7Ozs7Ozs7Ozs7O3FDQVF3QixDLEVBQUc7QUFDekIsVUFBSSxLQUFLLEtBQUwsSUFBYyxPQUFPLEVBQXpCLEVBQ0E7QUFDRSxZQUFJLEtBQUssT0FBVCxFQUNBO0FBQ0Usa0JBQVEsSUFBUixDQUFjLCtEQUFkO0FBQ0Q7O0FBRUQ7QUFDRDs7QUFFRDtBQUNBLFVBQU0sT0FBWSxFQUFFLE1BQXBCO0FBQ0EsVUFBTSxPQUFZLEtBQUssWUFBTCxDQUFrQixNQUFsQixDQUFsQjtBQUNBLFVBQU0sU0FBWSxLQUFLLFlBQUwsQ0FBa0IsS0FBSyxlQUF2QixDQUFsQjtBQUNBLFVBQU0sWUFBWSxLQUFLLFlBQUwsQ0FBa0IsS0FBSyxrQkFBdkIsQ0FBbEI7O0FBRUE7QUFDQSxXQUFLLEtBQUwsR0FBYSxPQUFPLE9BQXBCOztBQUVBLFdBQUssT0FBTCxDQUFhLElBQWIsRUFBbUIsTUFBbkIsRUFBMkIsU0FBM0I7QUFDRDs7QUFFRDs7Ozs7Ozs7Ozs7Ozs7Ozs7O21DQWVzQixPLEVBQVMsTSxFQUFRLFMsRUFBeUQ7QUFBQSxVQUE5QyxPQUE4Qyx1RUFBcEMsS0FBb0M7QUFBQSxVQUE3QixNQUE2QjtBQUFBLFVBQXJCLE9BQXFCO0FBQUEsVUFBWixVQUFZOzs7QUFFOUYsVUFBSSxHQUFKO0FBQUEsVUFBUyxPQUFUO0FBQUEsVUFBa0IsV0FBVyxTQUFTLEtBQXRDO0FBQUEsVUFBNkMsUUFBN0M7QUFBQSxVQUF1RCxXQUF2RDs7QUFFQTtBQUNBLFlBQU0sU0FBUyxhQUFULENBQXVCLEtBQXZCLENBQU47QUFDQSxVQUFJLFNBQUosR0FBZ0IsT0FBaEI7O0FBRUE7QUFDQSxpQkFBVyxJQUFJLG9CQUFKLENBQXlCLE9BQXpCLEVBQWtDLENBQWxDLEVBQXFDLElBQWhEOztBQUVBLG9CQUFjLFNBQVMsZ0JBQVQsQ0FBMEIsTUFBMUIsQ0FBZDs7QUFFQTtBQUNBO0FBQ0Esa0JBQVksT0FBWixDQUFvQixVQUFDLEVBQUQsRUFBUTtBQUMxQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsV0FBRyxTQUFILEdBQWUsRUFBZjs7QUFFQTtBQUNBO0FBQ0EsWUFBSSxjQUFjLFVBQVUsUUFBNUIsRUFDQTtBQUNFLG9CQUFVLElBQUksZ0JBQUosQ0FBd0IsTUFBeEIsVUFBVjtBQUNELFNBSEQsTUFHTztBQUNMLG9CQUFVLElBQUksZ0JBQUosQ0FBcUIsU0FBckIsQ0FBVjtBQUNEOztBQUVELGdCQUFRLE9BQVIsQ0FBZ0IsVUFBUyxNQUFULEVBQWlCO0FBQy9CLGFBQUcsV0FBSCxDQUFlLE9BQU8sU0FBUCxDQUFpQixJQUFqQixDQUFmO0FBQ0QsU0FGRDtBQUdELE9BdEJEOztBQXdCQTtBQUNBLFdBQUssaUJBQUwsR0FBeUIsTUFBekI7O0FBRUEsVUFBSSxDQUFDLE9BQUwsRUFBZTtBQUNiO0FBQ0EsYUFBSyxJQUFMLENBQVUsS0FBSyxhQUFmLEVBQThCLFFBQTlCLEVBQXdDLEVBQUUsUUFBUSxNQUFWLEVBQWtCLFdBQVcsU0FBN0IsRUFBd0MsUUFBUSxNQUFoRCxFQUF3RCxTQUFTLE9BQWpFLEVBQXhDO0FBQ0Q7O0FBRUQ7QUFDQSxXQUFLLEtBQUwsR0FBYSxPQUFPLEVBQXBCO0FBQ0Q7O0FBRUQ7Ozs7Ozs7Ozs7OzsyQkFTYyxVLEVBQVksTSxFQUEyQztBQUFBLFVBQW5DLFVBQW1DLHVFQUF0QixPQUFPLGFBQWU7O0FBQ25FLFVBQUksa0JBQW1CLFVBQVMsR0FBVCxFQUFjO0FBQUUsYUFBSSxHQUFKLElBQVcsTUFBWCxFQUFtQjtBQUFFLGNBQUcsT0FBTyxHQUFQLEtBQWUsR0FBbEIsRUFBdUIsT0FBTyxHQUFQO0FBQVksU0FBQyxPQUFPLGVBQVA7QUFBd0IsT0FBbEcsQ0FBb0csVUFBcEcsQ0FBdEI7QUFDQSxjQUFRLElBQVIsOENBQXdELFVBQXhELGtCQUErRSxNQUEvRSxzQkFBc0csZUFBdEcsRUFBeUgsa0NBQXpIO0FBQ0Q7O0FBR0Q7Ozs7QUFJQTs7Ozs7Ozs7OztzQkFPeUIsUyxFQUFXO0FBQ2xDLFVBQUcsT0FBTyxTQUFQLEtBQXFCLFFBQXhCLEVBQWtDO0FBQ2hDLGFBQUssY0FBTCxHQUFzQixTQUF0QjtBQUNELE9BRkQsTUFFTztBQUNMLGdCQUFRLElBQVIsQ0FBYSxpQ0FBYjtBQUNEO0FBQ0YsSzt3QkFDMEI7QUFDekIsYUFBTyxLQUFLLGNBQUwsSUFBdUIsZUFBOUI7QUFDRDs7QUFFRDs7Ozs7Ozs7Ozs7c0JBUTJCLFMsRUFBVztBQUNwQyxVQUFHLE9BQU8sU0FBUCxLQUFxQixRQUF4QixFQUFrQztBQUNoQyxhQUFLLGdCQUFMLEdBQXdCLFNBQXhCO0FBQ0QsT0FGRCxNQUVPO0FBQ0wsZ0JBQVEsSUFBUixDQUFhLGlDQUFiO0FBQ0Q7QUFDRixLO3dCQUM0QjtBQUMzQixhQUFPLEtBQUssZ0JBQUwsSUFBeUIsc0JBQWhDO0FBQ0Q7O0FBRUQ7Ozs7Ozs7Ozs7O3NCQVE4QixTLEVBQVc7QUFDdkMsVUFBRyxPQUFPLFNBQVAsS0FBcUIsUUFBeEIsRUFBa0M7QUFDaEMsYUFBSyxtQkFBTCxHQUEyQixTQUEzQjtBQUNELE9BRkQsTUFFTztBQUNMLGdCQUFRLElBQVIsQ0FBYSxpQ0FBYjtBQUNEO0FBQ0YsSzt3QkFDK0I7QUFDOUIsYUFBTyxLQUFLLG1CQUFMLElBQTRCLHlCQUFuQztBQUNEOztBQUVEOzs7Ozs7Ozs7Ozs7Ozs7OztzQkFjK0IsUyxFQUFXO0FBQ3hDLFVBQUcsT0FBTyxTQUFQLEtBQXFCLFFBQXhCLEVBQWtDO0FBQ2hDLGFBQUssb0JBQUwsR0FBNEIsU0FBNUI7QUFDRCxPQUZELE1BRU87QUFDTCxnQkFBUSxJQUFSLENBQWEsaUNBQWI7QUFDRDtBQUNGLEs7d0JBQ2dDO0FBQy9CLGFBQU8sS0FBSyxvQkFBTCxJQUE2QixnQkFBcEM7QUFDRDs7QUFFRDs7Ozs7Ozs7Ozs7c0JBUW1DLFMsRUFBVztBQUM1QyxVQUFHLE9BQU8sU0FBUCxLQUFxQixRQUF4QixFQUFrQztBQUNoQyxhQUFLLHdCQUFMLEdBQWdDLFNBQWhDO0FBQ0QsT0FGRCxNQUVPO0FBQ0wsZ0JBQVEsSUFBUixDQUFhLGlDQUFiO0FBQ0Q7QUFDRixLO3dCQUNvQztBQUNuQyxhQUFPLEtBQUssd0JBQUwsSUFBaUMsK0JBQXhDO0FBQ0Q7O0FBRUQ7Ozs7Ozs7Ozt3QkFNMkI7QUFDekIsYUFBTyxJQUFJLGNBQUosRUFBUDtBQUNEOztBQUVEOzs7Ozs7Ozs7O3NCQU82QixNLEVBQVE7QUFDbkMsV0FBSyxrQkFBTCxHQUEwQixNQUExQjtBQUNELEs7d0JBQzhCO0FBQzdCLGFBQU8sS0FBSyxrQkFBTCxJQUEyQixJQUFsQztBQUNEOztBQUVEOzs7Ozs7Ozs7Ozs7OztzQkFXaUIsSyxFQUFPO0FBQ3RCLFVBQUksT0FBTyxLQUFQLEtBQWlCLFFBQXJCLEVBQWdDO0FBQzlCLFlBQUksT0FBTyxLQUFQLE1BQWtCLFNBQXRCLEVBQWtDO0FBQ2hDLGVBQUssTUFBTCxHQUFjLE9BQU8sS0FBUCxDQUFkO0FBQ0E7QUFDRDtBQUNGLE9BTEQsTUFLTyxJQUFJLE9BQU8sS0FBUCxLQUFpQixRQUFyQixFQUFnQztBQUNyQyxhQUFJLElBQUksTUFBUixJQUFrQixNQUFsQixFQUEwQjtBQUN4QixjQUFHLE9BQU8sTUFBUCxNQUFtQixLQUF0QixFQUE2QjtBQUMzQixpQkFBSyxNQUFMLEdBQWMsS0FBZDs7QUFFQSxnQkFBSSxLQUFLLE9BQVQsRUFDQTtBQUNFLHNCQUFRLEdBQVIsNEJBQXFDLEtBQUssTUFBMUMsUUFBcUQsa0NBQXJEO0FBQ0Q7O0FBRUQ7QUFDRDtBQUNGO0FBQ0Y7QUFDRCxjQUFRLElBQVIsQ0FBYSxvREFBYjtBQUNELEs7d0JBQ2tCO0FBQ2pCLGFBQU8sS0FBSyxNQUFMLElBQWUsQ0FBdEI7QUFDRDs7QUFFRDs7Ozs7Ozs7OztzQkFPeUIsUyxFQUFXO0FBQ2xDLFVBQUksT0FBTyxTQUFQLEtBQXFCLFFBQXpCLEVBQW9DO0FBQ2xDLGFBQUssY0FBTCxHQUFzQixTQUF0QjtBQUNEO0FBQ0YsSzt3QkFDMEI7QUFDekIsYUFBTyxLQUFLLGNBQUwsSUFBdUIsSUFBOUI7QUFDRDs7Ozs7O1FBR00sSSxHQUFBLEk7UUFBTSxNLEdBQUEsTTtRQUFRLE0sR0FBQSxNOzs7Ozs7Ozs7Ozs7Ozs7QUMxaEJ2Qjs7Ozs7Ozs7SUFRTSxPOzs7Ozs7Ozs7QUFFSjs7OztBQUlBOzs7Ozs7OzJCQU82QjtBQUFBOztBQUFBLFVBQWpCLE9BQWlCLHVFQUFQLEtBQU87O0FBQzNCLFVBQUcsS0FBSyxPQUFSLEVBQ0E7QUFDRTtBQUNBLFlBQUk7QUFDRixpQkFBTyxnQkFBUCxDQUF3QixVQUF4QixFQUFvQyxVQUFDLENBQUQsRUFBTTtBQUN4QyxnQkFBSSxpQkFBaUIsTUFBSyxTQUFMLENBQWUsQ0FBZixDQUFyQjtBQUNBLG1CQUFPLGNBQVA7QUFDRCxXQUhEOztBQUtBLGVBQUssT0FBTCxHQUFvQixPQUFwQjtBQUVELFNBUkQsQ0FRRSxPQUFPLENBQVAsRUFBVTs7QUFFVjtBQUNBLGNBQUcsS0FBSyxPQUFSLEVBQWlCO0FBQ2Ysb0JBQVEsSUFBUixDQUFhLGlDQUFiO0FBQ0Esb0JBQVEsR0FBUixDQUFZLENBQVo7QUFDRDs7QUFFRCxpQkFBTyxLQUFQO0FBQ0Q7O0FBRUQsYUFBSyxXQUFMLEdBQW1CLElBQW5CO0FBQ0EsZUFBTyxJQUFQO0FBQ0Q7O0FBRUQsYUFBTyxLQUFQO0FBQ0Q7O0FBRUQ7Ozs7Ozs7Ozs7Ozt5QkFTWSxHLEVBQWdDO0FBQUEsVUFBM0IsS0FBMkIsdUVBQW5CLEVBQW1CO0FBQUEsVUFBZixRQUFlLHVFQUFKLEVBQUk7OztBQUUxQyxVQUFJLFlBQVksRUFBaEI7O0FBRUE7QUFDQSxVQUFJO0FBQ0Ysb0JBQVksS0FBSyxPQUFMLENBQWEsR0FBYixFQUFrQixJQUFsQixFQUF3QixJQUF4QixDQUFaO0FBQ0QsT0FGRCxDQUVFLE9BQU8sQ0FBUCxFQUFVO0FBQ1YsWUFBRyxLQUFLLE9BQVIsRUFBaUI7QUFDZixrQkFBUSxJQUFSLENBQWEseUNBQWI7QUFDQSxrQkFBUSxHQUFSLENBQVksQ0FBWjtBQUNEO0FBQ0QsZUFBTyxLQUFQO0FBQ0Q7O0FBRUQ7QUFDQSxVQUFHLEtBQUssT0FBUixFQUNBO0FBQ0UsWUFBSTtBQUNGLGVBQUssT0FBTCxDQUFhLFNBQWIsQ0FBdUIsUUFBdkIsRUFBaUMsS0FBakMsRUFBd0MsU0FBeEM7QUFDRCxTQUZELENBRUUsT0FBTyxDQUFQLEVBQVU7QUFDVixjQUFHLEtBQUssT0FBUixFQUFpQjtBQUNmLG9CQUFRLElBQVIsQ0FBYSxrRUFBYjtBQUNBLG9CQUFRLEdBQVIsQ0FBWSxDQUFaO0FBQ0Q7QUFDRCxpQkFBTyxLQUFQO0FBQ0Q7QUFDSDtBQUNDLE9BWkQsTUFhQTtBQUNFLGVBQU8sUUFBUCxDQUFnQixJQUFoQixVQUE0QixHQUE1QjtBQUNEOztBQUVELGFBQU8sSUFBUDtBQUNEOztBQUVEOzs7Ozs7OzsyQkFLYztBQUNaLFdBQUssT0FBTCxDQUFhLElBQWI7QUFDRDs7QUFFRDs7Ozs7Ozs7OEJBS2lCO0FBQ2YsV0FBSyxPQUFMLENBQWEsT0FBYjtBQUNEOztBQUdEOzs7O0FBSUE7Ozs7Ozs7Ozs7Ozs0QkFTZSxHLEVBQWtEO0FBQUEsVUFBN0MsY0FBNkMsdUVBQTVCLElBQTRCO0FBQUEsVUFBdEIsYUFBc0IsdUVBQU4sSUFBTTs7O0FBRS9ELFVBQUksTUFBSjs7QUFFQTs7Ozs7Ozs7Ozs7Ozs7QUFjQSxVQUFNLFdBQVcsZ0NBQThCLEtBQUssWUFBbkMsaURBQWpCOztBQWxCK0QsMkJBbUJhLFNBQVMsSUFBVCxDQUFjLEdBQWQsQ0FuQmI7QUFBQTtBQUFBLFVBbUJ4RCxLQW5Cd0Q7QUFBQSxVQW1CakQsSUFuQmlEO0FBQUEsVUFtQjNDLFFBbkIyQztBQUFBLFVBbUJqQyxZQW5CaUM7QUFBQSxVQW1CbkIsSUFuQm1CO0FBQUEsVUFtQmIsSUFuQmE7QUFBQSxVQW1CUCxNQW5CTztBQUFBLFVBbUJDLFFBbkJEOztBQXFCL0QsY0FBUSxHQUFSLENBQVksS0FBSyxZQUFqQixFQUErQixZQUEvQixFQUE2QyxJQUE3QyxFQUFtRCxJQUFuRDs7QUFFQTtBQUNBO0FBQ0EsVUFBSSxPQUFPLFFBQVAsS0FBb0IsUUFBcEIsSUFBZ0MsYUFBYSxLQUFLLElBQWxELElBQTBELEtBQUssV0FBTCxLQUFxQixJQUFuRixFQUEwRjtBQUN4RixjQUFNLElBQUksUUFBSixDQUFhLDBEQUFiLENBQU47QUFDRDs7QUFFRDtBQUNBO0FBQ0EsVUFDSSxPQUFPLElBQVAsS0FBZ0IsUUFBaEIsSUFBNEIsU0FBUyxHQUF2QyxJQUNFLE9BQU8sWUFBUCxLQUF3QixRQUF4QixJQUFvQyxpQkFBaUIsS0FBSyxZQUY5RCxFQUdFO0FBQ0EsWUFBSSxjQUFKLEVBQXFCO0FBQ25CLG1CQUFZLEtBQUssWUFBakIsU0FBaUMsSUFBakM7QUFDRCxTQUZELE1BRU87QUFDTCx5QkFBYSxJQUFiO0FBQ0Q7QUFDSDtBQUNDLE9BVkQsTUFVTyxJQUFJLFNBQVMsRUFBYixFQUFrQjtBQUN2QixpQkFBUyxHQUFUO0FBQ0Y7QUFDQyxPQUhNLE1BR0E7QUFDTCxpQkFBUyxJQUFUO0FBQ0Q7O0FBRUQ7QUFDQTtBQUNBLFVBQUksYUFBSixFQUFvQjtBQUNsQjtBQUNBLFlBQUksT0FBTyxNQUFQLElBQWlCLFFBQXJCLEVBQWdDO0FBQzlCLG9CQUFVLE1BQVY7QUFDRDtBQUNDO0FBQ0YsWUFBSSxPQUFPLFFBQVAsSUFBbUIsUUFBdkIsRUFBa0M7QUFDaEMsb0JBQVUsUUFBVjtBQUNEO0FBQ0Y7O0FBRUQsYUFBTyxNQUFQO0FBQ0Q7O0FBRUQ7Ozs7Ozs7Ozs7OEJBT2lCLEMsRUFBRztBQUNsQixVQUFJLElBQUosRUFBVSxLQUFWO0FBQ0EsVUFBRyxLQUFLLE9BQVIsRUFDQTtBQUNFLFlBQUk7QUFDRixrQkFBUSxDQUFDLE9BQU8sS0FBSyxPQUFiLEVBQXNCLEtBQXRCLEtBQWdDLEtBQUssS0FBTCxHQUFhLEVBQUUsS0FBRixLQUFZLEVBQUUsS0FBRixHQUFVLE9BQU8sS0FBUCxDQUFhLEtBQW5DLENBQTdDLENBQVI7QUFDQSxpQkFBTyxJQUFQO0FBQ0QsU0FIRCxDQUdFLE9BQU8sQ0FBUCxFQUFVO0FBQ1YsaUJBQU8sS0FBUDtBQUNEO0FBQ0Y7QUFDRCxhQUFPLEtBQVA7QUFDRDs7QUFFRDs7OztBQUlBOzs7Ozs7Ozs7O3dCQU8yQztBQUFBLFVBQW5CLFlBQW1CLHVFQUFKLEVBQUk7OztBQUV6Qzs7Ozs7Ozs7Ozs7QUFXQSxVQUFNLGVBQWUsc0NBQXJCO0FBQ0E7O0FBZHlDLCtCQWVMLGFBQWEsSUFBYixDQUFrQixZQUFsQixDQWZLO0FBQUE7QUFBQSxVQWVsQyxFQWZrQztBQUFBLFVBZTlCLEVBZjhCO0FBQUEsVUFlMUIsUUFmMEI7QUFBQSxVQWVoQixPQWZnQjs7QUFnQnpDLGNBQVEsR0FBUixDQUFZLFFBQVosRUFBc0IsT0FBdEI7O0FBRUE7QUFDQTtBQUNBLFVBQ0UsT0FBTyxRQUFQLEtBQW9CLFFBQXBCLElBQ0EsWUFBWSxLQUFLLElBRGpCLElBRUEsS0FBSyxXQUFMLEtBQXFCLElBSHZCLEVBSUU7QUFDQSxjQUFNLElBQUksUUFBSixDQUFhLDBEQUFiLENBQU47QUFDRDs7QUFFRCxXQUFLLGFBQUwsU0FBeUIsT0FBekI7QUFDRCxLO3dCQUN5QjtBQUN4QixhQUFPLEtBQUssYUFBTCxJQUFzQixHQUE3QjtBQUNEOztBQUVEOzs7Ozs7Ozs7c0JBTW1CLE8sRUFBUztBQUMxQixZQUFNLElBQUksS0FBSixDQUFVLGlDQUFWLENBQU47QUFDRCxLO3dCQUNvQjtBQUNuQixhQUFPLE9BQU8sT0FBZDtBQUNEOztBQUVEOzs7Ozs7Ozs7c0JBTWdCLEksRUFBTTtBQUNwQjtBQUNBLFdBQUssS0FBTCxHQUFhLElBQWI7QUFDRCxLO3dCQUNpQjtBQUNoQixhQUFPLEtBQUssS0FBTCxJQUFjLE9BQU8sUUFBUCxDQUFnQixRQUFyQztBQUNEOztBQUVEOzs7Ozs7Ozs7c0JBTXVCLE8sRUFBUztBQUM5QjtBQUNBLFVBQUcsT0FBTyxPQUFQLEtBQW1CLFNBQXRCLEVBQ0E7QUFDRSxhQUFLLFlBQUwsR0FBb0IsT0FBcEI7QUFDRCxPQUhELE1BSUE7QUFDRSxnQkFBUSxJQUFSLENBQWEscUNBQWI7QUFDRDtBQUNGLEs7d0JBQ3dCO0FBQ3ZCLFVBQUcsT0FBTyxLQUFLLFlBQVosS0FBNkIsU0FBaEMsRUFDQTtBQUNFLGVBQU8sS0FBSyxZQUFaO0FBQ0QsT0FIRCxNQUlBO0FBQ0UsZUFBTyxJQUFQO0FBQ0Q7QUFDRjs7QUFFRDs7Ozs7Ozs7O3NCQU1tQixPLEVBQVM7QUFDMUI7QUFDQSxVQUFHLE9BQU8sT0FBUCxLQUFtQixTQUF0QixFQUNBO0FBQ0UsYUFBSyxRQUFMLEdBQWdCLE9BQWhCO0FBQ0QsT0FIRCxNQUlBO0FBQ0UsZ0JBQVEsSUFBUixDQUFhLGlDQUFiO0FBQ0Q7QUFDRixLO3dCQUNvQjtBQUNuQixVQUFHLE9BQU8sS0FBSyxRQUFaLEtBQXlCLFNBQTVCLEVBQ0E7QUFDRSxlQUFPLEtBQUssUUFBWjtBQUNELE9BSEQsTUFJQTtBQUNFLGVBQU8sS0FBUDtBQUNEO0FBQ0Y7O0FBRUQ7Ozs7Ozs7OztzQkFNd0IsWSxFQUFjO0FBQ3BDO0FBQ0EsVUFBRyxPQUFPLFlBQVAsS0FBd0IsU0FBM0IsRUFDQTtBQUNFLGFBQUssYUFBTCxHQUFxQixZQUFyQjtBQUNELE9BSEQsTUFJQTtBQUNFLGdCQUFRLElBQVIsQ0FBYSxzQ0FBYjtBQUNEO0FBQ0YsSzt3QkFDeUI7QUFDeEIsVUFBRyxPQUFPLEtBQUssYUFBWixLQUE4QixTQUFqQyxFQUNBO0FBQ0UsZUFBTyxLQUFLLGFBQVo7QUFDRCxPQUhELE1BSUE7QUFDRSxlQUFPLEtBQVA7QUFDRDtBQUNGOztBQUVEOzs7Ozs7Ozs7d0JBTW9DO0FBQUEsVUFBakIsT0FBaUIsdUVBQVAsS0FBTzs7QUFDbEM7QUFDQSxVQUFJLEtBQUssT0FBTCxJQUFnQixPQUFPLE9BQVAsS0FBbUIsU0FBdkMsRUFBbUQ7QUFDakQsYUFBSyxRQUFMLEdBQWdCLE9BQWhCO0FBQ0Q7QUFDRCxZQUFNLElBQUksS0FBSixDQUFVLDBCQUFWLENBQU47QUFDRCxLO3dCQUNvQjtBQUNuQixhQUFRLE9BQU8sT0FBUCxJQUFrQixPQUFPLE9BQVAsQ0FBZSxTQUF6QztBQUNEOztBQUVEOzs7Ozs7Ozt3QkFLb0I7QUFDbEIsYUFBTyxLQUFLLE9BQUwsQ0FBYSxNQUFwQjtBQUNEOzs7Ozs7a0JBR1ksTyIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJpbXBvcnQgeyBBSkFYIH0gZnJvbSBcIi4uL3NyYy93dGMtYWpheFwiO1xuXG4vLyBJbml0aWFsaXNlIHRoZSBoaXN0b3J5IG9iamVjdCBpbiBkZXYgbW9kZVxuQUpBWC5pbml0KHRydWUpO1xuLy8gU2V0IHRoZSBkb2N1bWVudCByb290IGZvciB0aGUgYXBwbGljYXRpb24gKGlmIG5lY2Vzc2FyeSlcbkFKQVguZG9jdW1lbnRSb290ID0gJy9kZW1vLyc7XG5cbmZ1bmN0aW9uIHJlYWR5KGZuKSB7XG4gIGlmIChkb2N1bWVudC5yZWFkeVN0YXRlICE9ICdsb2FkaW5nJykge1xuICAgIGZuKCk7XG4gIH0gZWxzZSB7XG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsIGZuKTtcbiAgfVxufVxuXG5yZWFkeShmdW5jdGlvbigpXG57XG4gIC8vIFRoaXMgaW5pdGlhbGlzZXMgYW55IGxpbmtzIHdpdGggQUpBWCBhdHRyaWJ1dGVzXG4gIEFKQVguaW5pdExpbmtzKCk7XG5cbiAgLy8gVGhpcyBpcyBhIG1hbnVhbCBpbml0aWFsaXNhdGlvbiBvZiBsaW5rcyBhbmQgaXMsIGluc3RlYWQsIGEgZGVtb25zdHJhdGlvblxuICAvLyBvZiBob3cgcHJvZ3JhbWF0aWMgQUpBWCByZXRyaWV2YWwgd29ya3MuXG4gIGxldCBjYWxsaW5nT2JqZWN0ID0ge1xuICAgIG9uTG9hZDogZnVuY3Rpb24ocmVzcG9uc2UsIHRhcmdldExpbmssIGFyZ3MpIHtcbiAgICAgIGNvbnNvbGUubG9nKCdvbkxvYWQnKTtcbiAgICAgIGNvbnNvbGUubG9nKHJlc3BvbnNlLCB0YXJnZXRMaW5rLCBhcmdzKTtcbiAgICB9LFxuICAgIG9uRXJyb3I6IGZ1bmN0aW9uKHJlc3BvbnNlLCB0YXJnZXRMaW5rLCBhcmdzKSB7XG4gICAgICBjb25zb2xlLmxvZygnb25lcnJvcicpO1xuICAgICAgY29uc29sZS5sb2cocmVzcG9uc2UsIHRhcmdldExpbmssIGFyZ3MpO1xuICAgIH1cbiAgfTtcbiAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCBmdW5jdGlvbihlKSB7XG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2xpbmtfMScpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oZSkge1xuICAgICAgQUpBWC5cbiAgICAgICAgYWpheEdldChcIi9kZW1vL3BhZ2UxLmh0bWxcIiwgXCIjbGluazEtdGFyZ2V0XCIsIFwiLmxpbmsxLXNlbGVjdGlvblwiLCBlLnRhcmdldCkuXG4gICAgICAgIHRoZW4oZnVuY3Rpb24ocmVzb2x2ZXIpIHtcbiAgICAgICAgICBjb25zb2xlLmxvZygnb25Mb2FkJywgcmVzb2x2ZXIpO1xuICAgICAgICAgIHJldHVybiByZXNvbHZlcjtcbiAgICAgICAgfSk7XG4gICAgfSk7XG4gIH0pO1xufSk7XG5cbndpbmRvdy5BSkFYT2JqID0gQUpBWDtcbiIsIlxuLyoqXG4gKiBUaGlzIG1vZHVsZSBQcm92aWRlcyBhbmltYXRpb24gZGV0ZWN0aW9uIGFuZCBwc2V1ZG8tbGlzdGVuZXIgZnVuY3Rpb25hbGl0eVxuICpcbiAqIEBtb2R1bGUgd3RjLUFuaW1hdGlvbkV2ZW50c1xuICogQGV4cG9ydHMgQW5pbWF0aW9uXG4gKi9cblxuXG4vKipcbiAqIFRoaXMgZnVuY3Rpb24gdGFrZXMgYSBub2RlIGFuZCBkZXRlcm1pbmVzIHRoZSBmdWxsIGVuZCB0aW1lIG9mIGFueSB0cmFuc2l0aW9uc1xuICogb24gaXQuIFJldHVybnMgdGhlIHRpbWUgaW4gbWlsbGlzZWNvbmRzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0gICB7SFRNTEVsZW1lbnR9IG5vZGUgIFRoZSBub2RlIG8gZGV0ZXh0IHRoZSB0cmFuc2l0aW9uIHRpbWUgZm9yLlxuICogQHJldHVybiAge051bWJlcn0gICAgICAgICAgICBUaGUgZnVsbCB0cmFuc2l0aW9uIHRpbWUgZm9yIHRoZSBub2RlLCBpbmNsdWRpbmcgZGVsYXlzLCBpbiBtaWxsaXNlY29uZHNcbiAqL1xudmFyIGRldGVjdEFuaW1hdGlvbkVuZFRpbWUgPSBmdW5jdGlvbihub2RlKVxue1xuICB2YXIgZnVsbHRpbWUgPSAwO1xuICB2YXIgdGltZVJlZ2V4ID0gLyhcXGQrXFwuPyhcXGQrKT8pKHN8bXMpLztcbiAgdmFyIHJlY3Vyc2l2ZUxvb3AgPSBmdW5jdGlvbihlbCkge1xuICAgIGlmKGVsIGluc3RhbmNlb2YgRWxlbWVudCkge1xuICAgICAgdmFyIHRpbWVicmVha2Rvd24gPSB0aW1lUmVnZXguZXhlYyh3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShlbCkudHJhbnNpdGlvbkR1cmF0aW9uKVxuICAgICAgdmFyIGRlbGF5YnJlYWtkb3duID0gdGltZVJlZ2V4LmV4ZWMod2luZG93LmdldENvbXB1dGVkU3R5bGUoZWwpLnRyYW5zaXRpb25EZWxheSlcbiAgICAgIHZhciB0aW1lID0gdGltZWJyZWFrZG93blsxXSAqICh0aW1lYnJlYWtkb3duWzNdID09ICdzJyA/IDEwMDAgOiAxKVxuICAgICAgdmFyIGRlbGF5ID0gZGVsYXlicmVha2Rvd25bMV0gKiAoZGVsYXlicmVha2Rvd25bM10gPT0gJ3MnID8gMTAwMCA6IDEpXG4gICAgICBpZih0aW1lICsgZGVsYXkgPiBmdWxsdGltZSkge1xuICAgICAgICBmdWxsdGltZSA9IHRpbWUgKyBkZWxheVxuICAgICAgfVxuICAgIH1cbiAgICBpZihlbC5jaGlsZE5vZGVzKSB7XG4gICAgICBmb3IoaSBpbiBlbC5jaGlsZE5vZGVzKSB7XG4gICAgICAgIHJlY3Vyc2l2ZUxvb3AoZWwuY2hpbGROb2Rlc1tpXSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmVjdXJzaXZlTG9vcChub2RlKTtcblxuICBpZih0eXBlb2YgZnVsbHRpbWUgIT09ICdudW1iZXInKSB7XG4gICAgZnVsbHRpbWUgPSAwO1xuICB9XG5cbiAgcmV0dXJuIGZ1bGx0aW1lO1xufVxuXG4vKipcbiAqIEFsbG93cyB1cyB0byBhZGQgYW4gZW5kIGV2ZW50IGxpc3RlbmVyIHRvIHRoZSBub2RlLlxuICpcbiAqIEBwYXJhbSAge0hUTUxFbGVtZW50fSAgbm9kZSAgICAgIFRoZSBlbGVtZW50IHRvIGF0dGFjaCB0aGUgZW5kIGV2ZW50IGxpc3RlbmVyIHRvXG4gKiBAcGFyYW0gIHtmdW5jdGlvbn0gICAgIGxpc3RlbmVyICBUaGUgZnVuY3Rpb24gdG8gcnVuIHdoZW4gdGhlIGFuaW1hdGlvbiBpcyBmaW5pc2hlZFxuICogQHJldHVybiB7b2JqZWN0fSAgICAgICAgICAgICAgICAgVGhlIHV0bGl0eSBvYmplY3QgdGhhdCBhbGxvd3MgdXMgdG8gY2FuY2VsIG9yIGVuZCB0aGlzXG4gKi9cbnZhciBhZGRFbmRFdmVudExpc3RlbmVyID0gZnVuY3Rpb24obm9kZSwgbGlzdGVuZXIpIHtcbiAgaWYodHlwZW9mIGxpc3RlbmVyICE9PSAnZnVuY3Rpb24nKVxuICB7XG4gICAgdmFyIGxpc3RlbmVyID0gZnVuY3Rpb24oKXt9O1xuICB9XG4gIHZhciB0aW1lID0gZGV0ZWN0QW5pbWF0aW9uRW5kVGltZShub2RlKTtcbiAgdmFyIHRpbWVvdXQgPSBzZXRUaW1lb3V0KGxpc3RlbmVyLCB0aW1lKVxuICB2YXIgdXRpbCA9IHtcbiAgICB0aW1lOiB0aW1lLFxuICAgIHRpbWVvdXQ6IHRpbWVvdXQsXG4gICAgLy8gdGFyZ2V0OiBub2RlLCAvLyBSZW1vdmVkIHRoaXMgc28gYXMgbm90IHRvIGNhdXNlIGxlYWtzLlxuICAgIGNhbmNlbDogZnVuY3Rpb24oKSB7XG4gICAgICBjbGVhclRpbWVvdXQodGltZW91dCk7XG4gICAgfSxcbiAgICBlbmQ6IGZ1bmN0aW9uKCkge1xuICAgICAgdGhpcy5jYW5jZWwoKTtcbiAgICAgIGxpc3RlbmVyKCk7XG4gICAgfVxuICB9O1xuXG4gIHJldHVybiB1dGlsO1xufVxuXG4vKipcbiAqIFRoZSBhbmltYXRpb24gb2JqZWN0IGVuY2Fwc3VsYXRlcyBhbGwgb2YgdGhlIGJhc2ljIGZ1bmN0aW9uYWxpdHkgdGhhdCBhbGxvd3MgdXNcbiAqIHRvIGRldGVjdCBhbmltYXRpb24gZXRjLlxuICpcbiAqIEBleHBvcnRcbiAqL1xudmFyIEFuaW1hdGlvbiA9IHtcbiAgYWRkRW5kRXZlbnRMaXN0ZW5lcjogYWRkRW5kRXZlbnRMaXN0ZW5lclxufTtcblxuXG5leHBvcnQgZGVmYXVsdCBBbmltYXRpb247XG4iLCJpbXBvcnQgSGlzdG9yeSBmcm9tIFwiLi93dGMtaGlzdG9yeVwiO1xuaW1wb3J0IEFuaW1hdGlvbiBmcm9tIFwiLi93dGMtQW5pbWF0aW9uRXZlbnRzXCI7XG5cbmNvbnN0IFNUQVRFUyA9IHtcbiAgJ09LJyAgICAgICAgICAgICAgICA6IDAsXG4gICdDTElDS0VEJyAgICAgICAgICAgOiAxLFxuICAnTE9BRElORycgICAgICAgICAgIDogMixcbiAgJ1RSQU5TSVRJT05JTkcnICAgICA6IDQsXG4gICdMT0FERUQnICAgICAgICAgICAgOiA4XG59XG5cbmNvbnN0IFNFTEVDVE9SUyA9IHtcbiAgJ0NISUxEUkVOJyAgICAgICAgICA6IDAgLy8gVGhpcyBpbmRpY2F0ZXMgdGhhdCB0aGUgc2VsZWN0aW9uIHNob3VsZCBiZSBhbGwgY2hpbGRyZW4uIFRoaXMgYXNzdW1lcyB0aGF0IHdlIGhhdmUgYSB2YWxpZCB0YXJnZXQgdG8gd29yayB3aXRoLlxufVxuXG5jb25zdCBFUlJPUlMgPSB7XG4gICdHRU5FUklDX0VSUk9SJyAgICAgOiAwLFxuICAnQkFEX1BST01JU0UnICAgICAgIDogMSxcbiAgJ0xPQURfRVJST1InICAgICAgICA6IDJcbn1cblxuLyoqXG4gKiBBbiBBSkFYIGNsYXNzIHRoYXQgcGlja3MgdXAgb24gbGlua3MgYW5kIHR1cm5zIHRoZW0gaW50byBBSkFYIGxpbmtzLlxuICpcbiAqIFRoaXMgY2xhc3MgYXNzdW1lcyB0aGF0IHlvdSB3YW50IHRvIHJ1biB5b3VyIEFKQVggdmlhIGh0bWwgYXR0cmlidXRlcyBvbiB5b3VyIGxpbmtzXG4gKiBhbmQgdGhhdCB5b3VyIHdlYnNpdGUgY2FuIHJ1biBqdXN0IGFzIHdlbGwgd2l0aG91dCB0aGVzZSBsaW5rcy4gSXQgc2hvdWxkIGFsc29cbiAqIHByb3ZpZGUgYWRkaXRpb25hbCBmdW5jdGlvbmFsaXR5IHRoYXQgYWxsb3dzIHRoZSBjbGFzcyB0byBydW4gcHJvZ3JhbWF0aWNhbGx5LFxuICogdGhlcmVieSBnaXZpbmcgdGhlIHByb2dyYW1tZXIgdGhlIGFiaWxpdHkgYW5kIG9wdGlvbnMgdG8gY3JlYXRlIHRoZSB3ZWJzb3RlXG4gKiBob3dldmVyIHRoZXkgd2FudCB0by5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbmFtZXNwYWNlXG4gKiBAZXh0ZW5kcyBIaXN0b3J5XG4gKiBAYXV0aG9yIExpYW0gRWdhbiA8bGlhbUB3ZXRoZWNvbGxlY3RpdmUuY29tPlxuICogQHZlcnNpb24gMC41XG4gKiBAY3JlYXRlZCBOb3YgMTksIDIwMTZcbiAqL1xuY2xhc3MgQUpBWCBleHRlbmRzIEhpc3Rvcnkge1xuXG4gIC8qKlxuICAgKiBQdWJsaWMgbWV0aG9kc1xuICAgKi9cblxuICAvKipcbiAgICogSW5pdGlhbGlzZSB0aGUgbGlua3MgaW4gdGhlIGRvY3VtZW50LlxuICAgKlxuICAgKiBUaGlzIHdpbGwgbG9vayB0aHJvdWdoIHRoZSBsaW5rcyBpbiB0aGUgZG9jdW1lbnQgYXMgZGVub3RlZCBieSB0aGUgYXR0cmlidXRlQWpheFxuICAgKiBwcm9wZXJ0eSBhbmQgYXBwbHkgYSBjbGljayBsaXN0ZW5lciB0byBpdCB0aGF0IHdpbGwgYXR0ZW1wdCB0byBkZXRlcm1pbmUgd2hhdFxuICAgKiBhbmQgaG93IHRvIGxvYWQuXG4gICAqXG4gICAqIEEgc2ltcGxlIG1lY2hhbnNpbSBmb3IgdGhpcyB3b3VsZCBiZSBzb21ldGhpbmcgbGlrZTpcbiAgICogYGBgXG4gICAgIDxhIGhyZWY9XCJwYWdlMS5odG1sXCJcbiAgICAgICAgZGF0YS13dGMtYWpheD1cInRydWVcIlxuICAgICAgICBkYXRhLXd0Yy1hamF4LXRhcmdldD0nI2xpbmsyLXRhcmdldCdcbiAgICAgICAgZGF0YS13dGMtYWpheC1zZWxlY3Rpb249XCIubGluazEtc2VsZWN0aW9uXCJcbiAgICAgICAgZGF0YS13dGMtYWpheC1zaG91bGQtbmF2aWdhdGU9XCJmYWxzZVwiPkxpbmsgMTwvYT5cbiAgICogYGBgXG4gICAqXG4gICAqIFRoZSBhZHRyaWJ1dGVzIGVxdWF0ZSBhcyBmb2xsb3dzOlxuICAgKiAtICgqYXR0cmlidXRlQWpheCopICoqZGF0YS13dGMtYWpheCoqXG4gICAqXG4gICAqICAgIERlbm90ZXMgdGhhdCB0aGlzIGxpbmsgaXMgYW4gQUpBWCBsaW5rLlxuICAgKiAtICgqYXR0cmlidXRlVGFyZ2V0KikgKipkYXRhLXd0Yy1hamF4LXRhcmdldCoqXG4gICAqXG4gICAqICAgIERlbm90ZXMgdGhlIHRhcmdldCBpbnRvIHdoaWNoIHRvIGxvYWQgdGhlIHJlc3VsdC4gU2hvdWxkIHRha2UgdGhlIGZvcm0gb2YgYSBzZWxlY3Rvci5cbiAgICogLSAoKmF0dHJpYnV0ZVNlbGVjdGlvbiopICoqZGF0YS13dGMtYWpheC1zZWxlY3Rpb24qKlxuICAgKlxuICAgKiAgICBEZW5vdGVzIHRoZSBzZWxlY3Rpb24gb2YgZGF0YSB0byBwdWxsIGZyb20gdGhlIGxvYWRlZCBkb2N1bWVudC4gU2hvdWxkIHRha2UgdGhlIGZvcm0gb2YgYSBzZWxlY3Rvci5cbiAgICogLSAoKmF0dHJpYnV0ZVNob3VsZE5hdmlnYXRlKikgKipkYXRhLXd0Yy1hamF4LXNob3VsZC1uYXZpZ2F0ZSoqXG4gICAqXG4gICAqICAgICoqVHJ1ZSoqIC8gRmFsc2UgYXMgdG8gd2hldGhlciB0aGUgbGluayBzaG91bGQgdXBkYXRlIHRoZSBoaXN0b3J5IG9iamVjdC4gT25seSBuZWNlc3NhcnkgaWYgZmFsc2UuXG4gICAqXG4gICAqIEluIGFkZGl0aW9uLCAqYXR0cmlidXRlVGFyZ2V0KiBhbmQgKmF0dHJpYnV0ZVNlbGVjdGlvbiogYWNjZXB0IGJhc2ljIEpTT04gc3ludGF4XG4gICAqIHNvIHRoYXQgeW91IGNhbiBsb2FkIG1vbHRpcGxlIHBpZWNlcyBvZiBjb250ZW50IGZyb20gdGhlIHNvdXJjZS5cbiAgICpcbiAgICogQHN0YXRpY1xuICAgKiBAcGFyYW0gIHtET01FbGVtZW50fSByb290RG9jdW1lbnQgIFRoZSBET00gZWxlbWVudCB0byBmaW5kIGxpbmtzIGluLiBEZWZhdWx0cyB0byBib2R5LlxuICAgKi9cbiAgc3RhdGljIGluaXRMaW5rcyhyb290RG9jdW1lbnQgPSBkb2N1bWVudC5ib2R5KSB7XG4gICAgY29uc3QgbGlua3MgPSByb290RG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChgWyR7dGhpcy5hdHRyaWJ1dGVBamF4fT1cInRydWVcIl1gKTtcblxuICAgIGxpbmtzLmZvckVhY2goKGxpbmspPT4ge1xuICAgICAgLy8gUmVtb3ZpbmcgdGhpcyBhdHRyaWJ1dGUgZW5zdXJlcyB0aGF0IHRoaXMgbGluayBkb2Vzbid0IGdldCBhIHNlY29uZCBBSkFYIGxpc3RlbmVyIGF0dGFjaGVkIHRvIGl0LlxuICAgICAgbGluay5yZW1vdmVBdHRyaWJ1dGUodGhpcy5hdHRyaWJ1dGVBamF4KTtcblxuICAgICAgbGluay5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlKT0+IHtcbiAgICAgICAgdGhpcy5fdHJpZ2dlckFqYXhMaW5rKGUpO1xuXG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgIH0pO1xuICAgICAgY29uc29sZS5sb2cobGluayk7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogVGhlIHJlc29sdmluZyBvYmplY3QuIFRoaXMgaXMgdGhlIG9iamVjdCB0aGF0IGlzIHBhc3NlZCB0byBBSkFYIEdFVCBwcm9taXNlIHRoZW5zXG4gICAqIGFuZCBzaG91bGQgYmUgcGFzc2VkIG9udG8gc3Vic2VxdWVudCBUSEVOYWJsZSBjYWxscy5cbiAgICpcbiAgICogQGNhbGxiYWNrIEFKQVhHZXRSZXNvbHZlclxuICAgKiBAcGFyYW0ge3N0cmluZ30gcmVzcG9uc2UgICAgICAgICAgIFRoZSByZXNwb25zZSBmcm9tIHRoZSBBSkFYIGNhbGxcbiAgICogQHBhcmFtIHthcnJheX0gYXJndW1lbnRzICAgICAgICAgICBUaGUgYXJndW1lbnRzIGFycmF5IG9yaWdpbmFsbHkgcGFzc2VkIHRvIHRoZSB7QGxpbmsgQUpBWC5hamF4R2V0fSBtZXRob2RcbiAgICogQHBhcmFtIHtET01FbGVtZW50fSBsaW5rVGFyZ2V0ICAgICBUaGUgdGFyZ2V0IGVsZW1lbnQgdGhhdCBmaXJlZCB0aGUge0BsaW5rIEFKQVguYWpheEdldH0gXG4gICAqL1xuICAvKipcbiAgICogQ2FsbGJhY2sgZm9yIEFKQVggR0VUIG9ubG9hZC4gVGhpcyBpcyBjYWxsZWQgd2hlbiB0aGUgY29udGVudCBpcyBsb2FkZWQuXG4gICAqXG4gICAqIEBjYWxsYmFjayBsb2FkUmVzb2x2ZVxuICAgKiBAcGFyYW0ge0FKQVhHZXRSZXNvbHZlcn0gcmVzb2x2ZXIgIFRoZSByZXNvbHZpbmcgb2JqZWN0IGZvciB0aGUgQUpBWCByZXF1ZXN0XG4gICAqIEByZXR1cm4ge0FKQVhHZXRSZXNvbHZlcn0gICAgICAgICAgVGhlIG9uZ29pbmcgcmVzb2x2aW5nIG9iamVjdCBmb3IgdGhlIEFKQVggcmVxdWVzdFxuICAgKi9cbiAgLyoqXG4gICAqIENhbGxiYWNrIGZvciBBSkFYIEdFVCBlcnJvci4gVGhpcyBpcyBjYWxsZWQgd2hlbiBhbiBlcnJvciBvY2N1cnMgYWZ0ZXJcbiAgICogY2FsbGluZyBhbiBhamF4IEdFVC5cbiAgICpcbiAgICogQGNhbGxiYWNrIGxvYWRSZWplY3RcbiAgICogQHBhcmFtIHtvYmplY3R9IGVycm9yICAgICAgICAgICAgICBUaGUgZXJyb3IgdGhhdCBvY2N1cnJlZFxuICAgKiBAcGFyYW0ge2FycmF5fSBhcmdzICAgICAgICAgICAgICAgIFRoZSBhcmd1bWVudHMgdGhhdCB3ZXJlIHBhc3NlZCB0byB0aGUgcmVxdWVzdFxuICAgKiBAcGFyYW0ge0RPTUVsZW1lbnR9IFt0YXJnZXRMaW5rXSAgIFRoZSBsaW5rIHRoYXQgc3Bhd25lZCB0aGUgYWpheCByZXF1ZXN0XG4gICAqL1xuXG4gIC8qKlxuICAgKiBUaGlzIGJ1aWxkcyBvdXQgYW4gQUpBWCByZXF1ZXN0LCBub3JtYWxseSBiYXNlZCBvbiB0aGUgY2xpY2tpbmcgb2YgYSBsaW5rLFxuICAgKiBidXQgaXQgY2FuIGFsdGVybmF0aXZlbHkgYmUgY2FsbGVkIGRpcmVjdGx5IG9uIHRoZSBBSkFYIG9iamVjdC5cbiAgICpcbiAgICogQHN0YXRpY1xuICAgKiBAcGFyYW0gIHtzdHJpbmd9IFVSTCAgICAgICAgICAgICAgICAgICAgIFRoZSBVUkwgdG8gZ2V0LiBUaGlzIHdpbGwgYmUgcGFyc2VkIGludG8gYW4gYXBwcm9wcmlhdGUgZm9tYXQgYnkgdGhlIG9iamVjdC5cbiAgICogQHBhcmFtICB7c3RyaW5nfSB0YXJnZXQgICAgICAgICAgICAgICAgICBUaGUgdGFyZ2V0IGZvciB0aGUgbG9hZGVkIGNvbnRlbnQuIFRoaXMgY2FuIGJlIGEgc3RyaW5nIChzZWxlY3RvciksIG9yIGEgSlNPTiBhcnJheSBvZiBzZWxlY3RvciBzdHJpbmdzLlxuICAgKiBAcGFyYW0gIHtzdHJpbmd9IHNlbGVjdGlvbiAgICAgICAgICAgICAgIFRoaXMgaXMgYSBzZWxlY3RvciAob3IgSlNPTiBvZiBzZWxlY3RvcnMpIHRoYXQgZGV0ZXJtaW5lcyB3aGF0IHRvIGN1dCBmcm9tIHRoZSBsb2FkZWQgY29udGVudC5cbiAgICogQHBhcmFtICB7RE9NRWxlbWVudH0gW2xpbmtUYXJnZXRdICAgICAgICBUaGUgdGFyZ2V0IG9mIHRoZSBsaW5rLiBUaGlzIGlzIHVzZWZ1bCBmb3Igc2V0dGluZyBhY3RpdmUgc3RhdGVzIGluIGNhbGxiYWNrLlxuICAgKiBAcGFyYW0gIHtib29sZWFufSBmcm9tUG9wICAgICAgICAgICAgICAgIEluZGljYXRlcyB0aGF0IHRoaXMgR0VUIGlzIGZyb20gYSBwb3BcbiAgICogQHBhcmFtICB7b2JqZWN0fSBbZGF0YSA9IHt9XSAgICAgICAgICAgICBUaGUgZGF0YSB0byBwYXNzIHRvIHRoZSBBSkFYIGNhbGwuXG4gICAqIEByZXR1cm4ge1Byb21pc2V9XG4gICAqIEByZXR1cm4ge2xvYWRSZXNvbHZlfVxuICAgKiBAcmV0dXJuIHtsb2FkUmVqZWN0fSAgICAgICAgICAgICAgICAgICAgIEEgcHJvbWlzZSB0aGF0IHJlcHJlc2VudHMgdGhlIEdFVFxuICAgKi9cbiAgc3RhdGljIGFqYXhHZXQoVVJMLCB0YXJnZXQsIHNlbGVjdGlvbiwgbGlua1RhcmdldCwgZnJvbVBvcCA9IGZhbHNlLCBkYXRhID0ge30pIHtcblxuICAgIC8vIFNldCB0aGUgc3RhdGUgb2YgdGhlIEFKQVggY2xhc3MgdG8gY2xpY2tlZCwgaW5jaWRhdGluZyBzb21ldGhpbmcgaXMgbG9hZGluZ1xuICAgIGlmKCB0aGlzLnN0YXRlID4gU1RBVEVTLkNMSUNLRUQgKVxuICAgIHtcbiAgICAgIGlmKCB0aGlzLmRldm1vZGUgKVxuICAgICAge1xuICAgICAgICBjb25zb2xlLndhcm4oIFwiVHJpZWQgcnVuIGFuIEFKQVggR0VUIHdoZW4gdGhlIG9iamVjdCB3YXNuJ3QgaW4gT0sgb3IgQ0xJQ0tFRCBtb2RlXCIgKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIFJldHJpZXZlIGEgcmVxdWVzdCBvYmplY3QgYW5kIGNvbnN0cnVjdCBhIHZhbGlkIFVSTFxuICAgIGNvbnN0IHJlcSA9IHRoaXMucmVxdWVzdE9iamVjdDtcbiAgICBjb25zdCBwYXJzZWRVUkwgPSB0aGlzLl9maXhVUkwoVVJMKTtcblxuICAgIHZhciByZWFkeVN0YXRlID0gMDtcbiAgICB2YXIgc3RhdHVzID0gMDtcbiAgICB2YXIgYXJncyA9IGFyZ3VtZW50cztcblxuICAgIHZhciByZXF1ZXN0UHJvbWlzZSA9IG5ldyBQcm9taXNlKGZ1bmN0aW9uIGhhbmRsZXIocmVzb2x2ZSwgcmVqZWN0KSB7XG5cbiAgICAgIC8vIExpc3RlbiBmb3IgdGhlIHJlYWR5IHN0YXRlXG4gICAgICByZXEuYWRkRXZlbnRMaXN0ZW5lcigncmVhZHlzdGF0ZWNoYW5nZScsIChlKSA9PiB7XG4gICAgICAgIHJlYWR5U3RhdGUgPSBlLnRhcmdldC5yZWFkeVN0YXRlO1xuICAgICAgICBzdGF0dXMgPSBlLnRhcmdldC5zdGF0dXM7XG4gICAgICB9KTtcblxuICAgICAgLy8gTGlzdGVtIGZvciB0aGUgbG9hZCBldmVudFxuICAgICAgcmVxLmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCAoZSkgPT4ge1xuICAgICAgICAvLyBJZiB3ZSBoYXZlIGEgcmVhZHkgc3RhdGUgdGhhdCBpbmRpY2F0ZWQgdGhhdCB0aGUgbG9hZCB3YXMgYSBzdWNjZXNzLCBjb250aW51ZVxuICAgICAgICBpZiggcmVxLnN0YXR1cyA+PSAyMDAgJiYgcmVxLnN0YXR1cyA8IDQwMCApIHtcbiAgICAgICAgICAvLyBHZXQgdGhlIHJlcXVlc3QgcmVzcG9uc2UgdGV4dFxuICAgICAgICAgIHZhciByZXNwb25zZVRleHQgPSByZXEucmVzcG9uc2VUZXh0XG4gICAgICAgICAgdmFyIHJlc29sdmVyID0ge1xuICAgICAgICAgICAgcmVzcG9uc2VUZXh0OiByZXNwb25zZVRleHQsIFxuICAgICAgICAgICAgYXJndW1lbnRzOiBhcmdzLCBcbiAgICAgICAgICAgIGxpbmtUYXJnZXQ6IGxpbmtUYXJnZXQgfHwgbnVsbFxuICAgICAgICAgIH1cbiAgICAgICAgICByZXNvbHZlKHJlc29sdmVyKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZWplY3QoRVJST1JTLkxPQURfRVJST1IpO1xuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgcmVxLmFkZEV2ZW50TGlzdGVuZXIoJ2Vycm9yJywgKGUpID0+IHtcbiAgICAgICAgcmVqZWN0KEVSUk9SUy5MT0FEX0VSUk9SKTtcbiAgICAgIH0pO1xuICAgIH0uYmluZCh0aGlzKSk7XG5cbiAgICAvLyBUaGlzIHByb21pc2UgdGFrZXMgdGhlIHJldHVybmVkIHByb21pc2UgYW5kIHJ1bnMgdGhlIGVxdWl2YWxlbnQgb2YgYSBcImZpbmFsbHlcIlxuICAgIFByb21pc2UucmVzb2x2ZShyZXF1ZXN0UHJvbWlzZSkudGhlbihmdW5jdGlvbihyZXNvbHZlcikge1xuICAgICAgaWYocmVzb2x2ZXIuZXJyb3IpIHtcbiAgICAgICAgdGhyb3cgcmVzb2x2ZXIuZXJyb3JcbiAgICAgIH0gZWxzZSBpZighcmVzb2x2ZXIucmVzcG9uc2VUZXh0KSB7XG4gICAgICAgIHRocm93IEVSUk9SUy5CQURfUFJPTUlTRVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gRmluYWxseSwgcGFzcyB0aGUgcmVzdWx0LlxuICAgICAgICB0aGlzLl9wYXJzZVJlc3BvbnNlKHJlc29sdmVyLnJlc3BvbnNlVGV4dCwgdGFyZ2V0LCBzZWxlY3Rpb24sIGZyb21Qb3AsIGxpbmtUYXJnZXQpXG4gICAgICB9XG4gICAgfS5iaW5kKHRoaXMpKS5jYXRjaChmdW5jdGlvbihlcnIpIHtcbiAgICAgIHRoaXMuX2Vycm9yKHJlYWR5U3RhdGUsIHJlcS5zdGF0dXMsIGVyciB8fCAwKTtcbiAgICB9LmJpbmQodGhpcykpO1xuXG4gICAgLy8gU2F2ZSB0aGUgbGFzdCBwYXJzZWQgVVJMIGZvciB0aGUgcHVycG9zZSBvZiBoaXN0b3J5IGludGVyb3BlcmFiaWxpdHkgYW5kIGVycm9yIGNvcnJlY3Rpb24uXG4gICAgdGhpcy5sYXN0UGFyc2VkVVJMID0gcGFyc2VkVVJMO1xuXG4gICAgcmVxLm9wZW4oJ0dFVCcsIHBhcnNlZFVSTCwgdHJ1ZSk7XG4gICAgcmVxLnNlbmQoZGF0YSk7XG5cbiAgICAvLyBTZXQgdGhlIG9iamVjdCBzdGF0ZVxuICAgIHRoaXMuc3RhdGUgPSBTVEFURVMuTE9BRElORztcblxuICAgIHJldHVybiByZXF1ZXN0UHJvbWlzZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBQcml2YXRlIG1ldGhvZHNcbiAgICovXG5cbiAgLyoqXG4gICAqIExpc3RlbmVyIGZvciB0aGUgcG9wc3RhdGUgbWV0aG9kXG4gICAqXG4gICAqIEBwcml2YXRlXG4gICAqIEBwYXJhbSAge29iamVjdH0gZSB0aGUgcGFzc2VkIGV2ZW50IG9iamVjdFxuICAgKiBAcmV0dXJuIHZvaWRcbiAgICovXG4gIHN0YXRpYyBfcG9wc3RhdGUoZSkge1xuICAgIHZhciBiYXNlLCBzdGF0ZSA9IHt9O1xuICAgIHZhciBoYXNQb3BwZWRTdGF0ZSA9IHN1cGVyLl9wb3BzdGF0ZShlKTtcblxuICAgIGlmKCBoYXNQb3BwZWRTdGF0ZSApIHtcbiAgICAgIHN0YXRlID0gKGJhc2UgPSB0aGlzLmhpc3RvcnkpLnN0YXRlIHx8IChiYXNlLnN0YXRlID0gZS5zdGF0ZSB8fCAoZS5zdGF0ZSA9IHdpbmRvdy5ldmVudC5zdGF0ZSkpO1xuICAgIH1cblxuICAgIHZhciBocmVmID0gZG9jdW1lbnQubG9jYXRpb24uaHJlZjtcbiAgICB2YXIgdGFyZ2V0ID0gc3RhdGUudGFyZ2V0IHx8IHRoaXMubGFzdENoYW5nZWRUYXJnZXQ7XG4gICAgdmFyIHNlbGVjdGlvbiA9IHN0YXRlLnNlbGVjdGlvbiB8fCBTRUxFQ1RPUlMuQ0hJTERSRU47XG4gICAgdmFyIGRhdGEgPSBzdGF0ZS5kYXRhIHx8IHt9O1xuICAgIHZhciBvbmxvYWQgPSBzdGF0ZS5vbmxvYWQgfHwgZnVuY3Rpb24oKXt9O1xuICAgIHZhciBvbmVycm9yID0gc3RhdGUub25lcnJvciB8fCB0aGlzO1xuXG4gICAgdGhpcy5hamF4R2V0KGhyZWYsIHRhcmdldCwgc2VsZWN0aW9uLCBvbmxvYWQsIG9uZXJyb3IsIHRydWUsIGRhdGEpO1xuXG4gICAgcmV0dXJuIGhhc1BvcHBlZFN0YXRlO1xuICB9XG5cbiAgLyoqXG4gICAqIFRyaWdnZXIgYW4gYWpheCBsaW5rIGFzIGRldGVybWluZWQgYnkgYSBjbGljayBjYWxsYmFjay4gVGhpcyBzaG91bGQgb25seSBldmVyIGJlIGNhbGxlZFxuICAgKiBmcm9tIGEgY2xpY2sgZXZlbnQgYXMgYWRkZWQgdmlhIHRoZSBBSkFYIG9iamVjdCBvciBhIGNoaWxkIHRoZXJlcm9mLlxuICAgKlxuICAgKiBAc3RhdGljXG4gICAqIEBwcml2YXRlXG4gICAqIEBwYXJhbSAge29iamVjdH0gZSB0aGUgZXZlbnQgb2JqZWN0IHBhc3NlZCBmcm9tIHRoZSBjbGljayBldmVudC5cbiAgICovXG4gIHN0YXRpYyBfdHJpZ2dlckFqYXhMaW5rKGUpIHtcbiAgICBpZiggdGhpcy5zdGF0ZSAhPSBTVEFURVMuT0sgKVxuICAgIHtcbiAgICAgIGlmKCB0aGlzLmRldm1vZGUgKVxuICAgICAge1xuICAgICAgICBjb25zb2xlLndhcm4oIFwiVHJpZWQgdG8gY2xpY2sgYW4gQUpBWCBsaW5rIHdoZW4gdGhlIG9iamVjdCB3YXNuJ3QgaW4gT0sgbW9kZVwiICk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBGaW5kIGFsbCBvZiB0aGUgcmVsZXZhbnQgYXR0ZWlidXRlc1xuICAgIGNvbnN0IGxpbmsgICAgICA9IGUudGFyZ2V0O1xuICAgIGNvbnN0IGhyZWYgICAgICA9IGxpbmsuZ2V0QXR0cmlidXRlKCdocmVmJyk7XG4gICAgY29uc3QgdGFyZ2V0ICAgID0gbGluay5nZXRBdHRyaWJ1dGUodGhpcy5hdHRyaWJ1dGVUYXJnZXQpO1xuICAgIGNvbnN0IHNlbGVjdGlvbiA9IGxpbmsuZ2V0QXR0cmlidXRlKHRoaXMuYXR0cmlidXRlU2VsZWN0aW9uKTtcblxuICAgIC8vIFNldCB0aGUgb2JqZWN0IHN0YXRlXG4gICAgdGhpcy5zdGF0ZSA9IFNUQVRFUy5DTElDS0VEO1xuXG4gICAgdGhpcy5hamF4R2V0KGhyZWYsIHRhcmdldCwgc2VsZWN0aW9uKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGlzIHJlc3BvbmRzIHRvIHRoZSBhamF4IGxvYWQgZXZlbnQgYW5kIGlzIHJlc3BvbnNpYmxlIGZvciBidWlsZGluZyB0aGUgcmVzdWx0LFxuICAgKiBpbmplY3RpbmcgaXQgaW50byB0aGUgcGFnZSwgcnVubmluZyBjYWxsYmFja3MgYW5kIGRldGVjdGluZyBhbmQgZGVsYXlpbmdcbiAgICogdHJhbnNpdGlvbnMgYW5kIGFuaW1hdGlvbnMgYXMgbmVjZXNzYXJ5L1xuICAgKlxuICAgKiBAc3RhdGljXG4gICAqIEBwcml2YXRlXG4gICAqIEBwYXJhbSAge3N0cmluZ30gY29udGVudCAgICAgICAgICAgVGhlIGxvYWRlZCBwYWdlIGNvbnRlbnQsIHRoaXMgY29tZXMgZnJvbSB0aGUgQUpBWCBjYWxsLlxuICAgKiBAcGFyYW0gIHtzdHJpbmd9IHRhcmdldCAgICAgICAgICAgIFRoZSB0YXJnZXQgZm9yIHRoZSBsb2FkZWQgY29udGVudC4gVGhpcyBjYW4gYmUgYSBzdHJpbmcgKHNlbGVjdG9yKSwgb3IgYSBKU09OIGFycmF5IG9mIHNlbGVjdG9yIHN0cmluZ3MuXG4gICAqIEBwYXJhbSAge3N0cmluZ30gc2VsZWN0aW9uICAgICAgICAgVGhpcyBpcyBhIHNlbGVjdG9yIChvciBKU09OIG9mIHNlbGVjdG9ycykgdGhhdCBkZXRlcm1pbmVzIHdoYXQgdG8gY3V0IGZyb20gdGhlIGxvYWRlZCBjb250ZW50LlxuICAgKiBAcGFyYW0gIHtib29sZWFufSBmcm9tUG9wICAgICAgICAgIEluZGljYXRlcyB0aGF0IHRoaXMgbG9hZCBpcyBmcm9tIGEgaGlzdG9yeSBwb3BcbiAgICogQHBhcmFtICB7ZnVuY3Rpb259IFtvbmxvYWRdICAgICAgICBUaGUgb25sb2FkIGZ1bmN0aW9uIHRvIHJ1biAoVEJJKS5cbiAgICogQHBhcmFtICB7ZnVuY3Rpb259IFtvbmVycm9yXSAgICAgICBUaGUgb24gZXJyb3IgZnVuY3Rpb25cbiAgICogQHBhcmFtICB7RE9NRWxlbWVudH0gW2xpbmtUYXJnZXRdICBUaGUgdGFyZ2V0IG9mIHRoZSBsaW5rLiBUaGlzIGlzIHVzZWZ1bCBmb3Igc2V0dGluZyBhY3RpdmUgc3RhdGVzIGluIGNhbGxiYWNrLlxuICAgKi9cbiAgc3RhdGljIF9wYXJzZVJlc3BvbnNlKGNvbnRlbnQsIHRhcmdldCwgc2VsZWN0aW9uLCBmcm9tUG9wID0gZmFsc2UsIG9ubG9hZCwgb25lcnJvciwgbGlua1RhcmdldCkge1xuXG4gICAgdmFyIGRvYywgcmVzdWx0cywgb2xkVGl0bGUgPSBkb2N1bWVudC50aXRsZSwgbmV3VGl0bGUsIHRhcmdldE5vZGVzO1xuXG4gICAgLy8gUGFyc2UgdGhlIGRvY3VtZW50IGZyb20gdGhlIGNvbnRlbnQgcHJvdmlkZWRcbiAgICBkb2MgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBkb2MuaW5uZXJIVE1MID0gY29udGVudDtcblxuICAgIC8vIEZpbmQgdGhlIG5ldyBwYWdlIHRpdGxlXG4gICAgbmV3VGl0bGUgPSBkb2MuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ3RpdGxlJylbMF0udGV4dDtcblxuICAgIHRhcmdldE5vZGVzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCh0YXJnZXQpO1xuXG4gICAgLy8gSSBuZWVkIHRvIGFkZCBhIHRvbm5lIG9mIHRoaW5ncyBoZXJlLCBsaWtlIHN1cHBvcnQgZm9yIHRyYW5zaXRpb24gb2ZmIGV0Yy5cbiAgICAvLyBDdXJyZW50bHkgSSdtIGp1c3Qgc3RhdGljYWxseSByZW1vdmluZyBhbmQgYWRkaW5nIGluIGVsZW1lbnRzLlxuICAgIHRhcmdldE5vZGVzLmZvckVhY2goKGVsKSA9PiB7XG4gICAgICAvLyBXb2tmbG93IHdpbGwgZ28gbGlrZSB0aGlzOlxuICAgICAgLy8gQWRkIHRoZSB0cmFuc2l0aW9uIGNsYXNzIHRvIHRoZSBlbGVtZW50XG4gICAgICAvLyBUaW1lIG91dCBhIGJpdCAoMTBtcykgYW5kIHRoZW4gYWRkIHRoZSB0cmFuc2l0aW9uIGVuZCBjbGFzc1xuICAgICAgLy8gT25jZSBjb21wbGV0ZSwgcmVtb3ZlIHRoZSB0cmFuc2l0aW9uIGNsYXNzZXMgYW5kIHJlcGxhY2UgdGhlIG9sZCBlbGVtZW50cyB3aXRoIHRoZSBuZXcgKGlubmVySFRNTClcbiAgICAgIC8vIFRoZW4gYWRkIHRoZSB0cmFuc2l0aW9uIGNsYXNzIHRvIHRoZSBlbGVtZW50XG4gICAgICAvLyBUaW1lIG91dCBhIGJpdCAoMTBtcykgYW5kIHRoZW4gYWRkIHRoZSB0cmFuc2l0aW9uIGVuZCBjbGFzc1xuXG4gICAgICBlbC5pbm5lckhUTUwgPSAnJztcblxuICAgICAgLy8gRmluZCB0aGUgcmVzdWx0cyBvZiB0aGUgc2VsZWN0aW9uXG4gICAgICAvLyBOLkIuIFRoaXMgd2lsbCBhbGwgbmVlZCB0byBiZSB1cGRhdGVkIHRvIHN1cHBvcnQgdGhlIGFycmF5IHN5bnRheFxuICAgICAgaWYoIHNlbGVjdGlvbiA9PT0gU0VMRUNUT1JTLkNISUxEUkVOIClcbiAgICAgIHtcbiAgICAgICAgcmVzdWx0cyA9IGRvYy5xdWVyeVNlbGVjdG9yQWxsKGAke3RhcmdldH0gPiAqYCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXN1bHRzID0gZG9jLnF1ZXJ5U2VsZWN0b3JBbGwoc2VsZWN0aW9uKTtcbiAgICAgIH1cblxuICAgICAgcmVzdWx0cy5mb3JFYWNoKGZ1bmN0aW9uKHJlc3VsdCkge1xuICAgICAgICBlbC5hcHBlbmRDaGlsZChyZXN1bHQuY2xvbmVOb2RlKHRydWUpKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgLy8gVXBkYXRlIHRoZSBpbnRlcm5hbCByZWZlcmVuY2UgdG8gdGhlIGxhc3QgdGFyZ2V0XG4gICAgdGhpcy5sYXN0Q2hhbmdlZFRhcmdldCA9IHRhcmdldDtcblxuICAgIGlmKCAhZnJvbVBvcCApIHtcbiAgICAgIC8vIFB1c2ggdGhlIG5ldyBzdGF0ZSB0byB0aGUgaGlzdG9yeS5cbiAgICAgIHRoaXMucHVzaCh0aGlzLmxhc3RQYXJzZWRVUkwsIG5ld1RpdGxlLCB7IHRhcmdldDogdGFyZ2V0LCBzZWxlY3Rpb246IHNlbGVjdGlvbiwgb25sb2FkOiBvbmxvYWQsIG9uZXJyb3I6IG9uZXJyb3IgfSk7XG4gICAgfVxuXG4gICAgLy8gU2V0IHRoZSBvYmplY3Qgc3RhdGVcbiAgICB0aGlzLnN0YXRlID0gU1RBVEVTLk9LO1xuICB9XG5cbiAgLyoqXG4gICAqIFRyaWdnZXIgYW4gZXJyb3IgbG9nXG4gICAqXG4gICAqIEBzdGF0aWNcbiAgICogQHByaXZhdGVcbiAgICogQHBhcmFtICB7dHlwZX0gcmVhZHlTdGF0ZSBkZXNjcmlwdGlvblxuICAgKiBAcGFyYW0gIHt0eXBlfSBzdGF0dXMgICAgIGRlc2NyaXB0aW9uXG4gICAqIEByZXR1cm4ge3R5cGV9ICAgICAgICAgICAgZGVzY3JpcHRpb25cbiAgICovXG4gIHN0YXRpYyBfZXJyb3IocmVhZHlTdGF0ZSwgc3RhdHVzLCBlcnJvclN0YXRlID0gRVJST1JTLkdFTkVSSUNfRVJST1IpIHtcbiAgICB2YXIgZXJyb3JTdGF0ZUNvbnN0ID0gKGZ1bmN0aW9uKHZhbCkgeyBmb3Ioa2V5IGluIEVSUk9SUykgeyBpZihFUlJPUlNba2V5XSA9PSB2YWwpIHJldHVybiBrZXkgfSByZXR1cm4gJ0dFTkVSSUNfRVJST1InIH0pKGVycm9yU3RhdGUpXG4gICAgY29uc29sZS53YXJuKGAlYyBFcnJvciBsb2FkaW5nIEFKQVggbGluay4gcmVhZHlTdGF0ZTogJHtyZWFkeVN0YXRlfS4gc3RhdHVzOiAke3N0YXR1c30uIGVycm9yU3RhdGU6ICR7ZXJyb3JTdGF0ZUNvbnN0fWAsICdiYWNrZ3JvdW5kOiAjMjIyOyBjb2xvcjogI2ZmN2MzYScpXG4gIH1cblxuXG4gIC8qKlxuICAgKiBHZXR0ZXJzIGFuZCBzZXR0ZXJzXG4gICAqL1xuXG4gIC8qKlxuICAgKiAoZ2V0dGVyL3NldHRlcikgVGhlIGF0dHJpYnV0ZSB1c2VkIHRvIGRldGVybWluZSB3aGV0aGVyIGEgbGluayBzaG91bGRcbiAgICogYmUgcnVuIHZpYSB0aGUgQUpBWCBjbGFzcy5cbiAgICpcbiAgICogQHR5cGUge3N0cmluZ31cbiAgICogQGRlZmF1bHQgJ2RhdGEtd3RjLWFqYXgnXG4gICAqL1xuICBzdGF0aWMgc2V0IGF0dHJpYnV0ZUFqYXgoYXR0cmlidXRlKSB7XG4gICAgaWYodHlwZW9mIGF0dHJpYnV0ZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgIHRoaXMuX2F0dHJpYnV0ZUFqYXggPSBhdHRyaWJ1dGU7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnNvbGUud2FybignQWxsIGF0dHJpYnV0ZXMgbXVzdCBiZSBzdHJpbmdzLicpO1xuICAgIH1cbiAgfVxuICBzdGF0aWMgZ2V0IGF0dHJpYnV0ZUFqYXgoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2F0dHJpYnV0ZUFqYXggfHwgJ2RhdGEtd3RjLWFqYXgnO1xuICB9XG5cbiAgLyoqXG4gICAqIChnZXR0ZXIvc2V0dGVyKSBUaGUgYXR0cmlidXRlIHVzZWQgdG8gZGV0ZXJtaW5lIHdoZXJlIGEgbGluayBzaG91bGQgcGxhY2UgaXQnc1xuICAgKiByZXN1bHRhbnQgR0VULiBUaGlzIGF0dHJpYnV0ZSBzaG91bGQgYmUgaW4gdGhlIGZvcm0gb2YgYSBzZWxlY3RvciwgaWU6XG4gICAqIGAuYWpheC10YXJnZXRgXG4gICAqXG4gICAqIEB0eXBlIHtzdHJpbmd9XG4gICAqIEBkZWZhdWx0ICdkYXRhLXd0Yy1hamF4LXRhcmdldCdcbiAgICovXG4gIHN0YXRpYyBzZXQgYXR0cmlidXRlVGFyZ2V0KGF0dHJpYnV0ZSkge1xuICAgIGlmKHR5cGVvZiBhdHRyaWJ1dGUgPT09ICdzdHJpbmcnKSB7XG4gICAgICB0aGlzLl9hdHRyaWJ1dGVUYXJnZXQgPSBhdHRyaWJ1dGU7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnNvbGUud2FybignQWxsIGF0dHJpYnV0ZXMgbXVzdCBiZSBzdHJpbmdzLicpO1xuICAgIH1cbiAgfVxuICBzdGF0aWMgZ2V0IGF0dHJpYnV0ZVRhcmdldCgpIHtcbiAgICByZXR1cm4gdGhpcy5fYXR0cmlidXRlVGFyZ2V0IHx8ICdkYXRhLXd0Yy1hamF4LXRhcmdldCc7XG4gIH1cblxuICAvKipcbiAgICogKGdldHRlci9zZXR0ZXIpIFRoZSBhdHRyaWJ1dGUgdXNlZCB0byBzbGljZSB0aGUgcmVzdWx0YW50IEdFVC5cbiAgICogVGhpcyBhdHRyaWJ1dGUgc2hvdWxkIGJlIGluIHRoZSBmb3JtIG9mIGEgc2VsZWN0b3IsIGllOlxuICAgKiBgLmFqYXgtc2VsZWN0aW9uYFxuICAgKlxuICAgKiBAdHlwZSB7c3RyaW5nfVxuICAgKiBAZGVmYXVsdCAnZGF0YS13dGMtYWpheC1zZWxlY3Rpb24nXG4gICAqL1xuICBzdGF0aWMgc2V0IGF0dHJpYnV0ZVNlbGVjdGlvbihhdHRyaWJ1dGUpIHtcbiAgICBpZih0eXBlb2YgYXR0cmlidXRlID09PSAnc3RyaW5nJykge1xuICAgICAgdGhpcy5fYXR0cmlidXRlU2VsZWN0aW9uID0gYXR0cmlidXRlO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zb2xlLndhcm4oJ0FsbCBhdHRyaWJ1dGVzIG11c3QgYmUgc3RyaW5ncy4nKTtcbiAgICB9XG4gIH1cbiAgc3RhdGljIGdldCBhdHRyaWJ1dGVTZWxlY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuX2F0dHJpYnV0ZVNlbGVjdGlvbiB8fCAnZGF0YS13dGMtYWpheC1zZWxlY3Rpb24nO1xuICB9XG5cbiAgLyoqXG4gICAqIChnZXR0ZXIvc2V0dGVyKSBUaGUgY2xhc3NuYW1lIHRvIHVzZSBhcyB0aGUgYmFzaXMgZm9yIHRyYW5zaXRpb25zLiBEZWZhdWx0XG4gICAqIHdpbGwgYmUgKnd0Yy10cmFuc2l0aW9uKi4gU28gdGhpcyB3aWxsIHRoZW4gYmUgdXNlZCBmb3IgYWxsIDMgc3RhdGVzOlxuICAgKiAqLnd0Yy10cmFuc2l0aW9uKlxuICAgKiAqLnd0Yy10cmFuc2l0aW9uLW91dCpcbiAgICogKi53dGMtdHJhbnNpdGlvbi1vdXQtc3RhcnQqXG4gICAqICoud3RjLXRyYW5zaXRpb24tb3V0LWVuZCpcbiAgICogKi53dGMtdHJhbnNpdGlvbi1pbipcbiAgICogKi53dGMtdHJhbnNpdGlvbi1pbi1zdGFydCpcbiAgICogKi53dGMtdHJhbnNpdGlvbi1pbi1lbmQqXG4gICAqXG4gICAqIEB0eXBlIHtzdHJpbmd9XG4gICAqIEBkZWZhdWx0ICd3dGMtdHJhbnNpdGlvbidcbiAgICovXG4gIHN0YXRpYyBzZXQgY2xhc3NCYXNlVHJhbnNpdGlvbihjbGFzc0Jhc2UpIHtcbiAgICBpZih0eXBlb2YgY2xhc3NCYXNlID09PSAnc3RyaW5nJykge1xuICAgICAgdGhpcy5fY2xhc3NCYXNlVHJhbnNpdGlvbiA9IGNsYXNzQmFzZTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc29sZS53YXJuKCdBbGwgYXR0cmlidXRlcyBtdXN0IGJlIHN0cmluZ3MuJyk7XG4gICAgfVxuICB9XG4gIHN0YXRpYyBnZXQgY2xhc3NCYXNlVHJhbnNpdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5fY2xhc3NCYXNlVHJhbnNpdGlvbiB8fCAnd3RjLXRyYW5zaXRpb24nO1xuICB9XG5cbiAgLyoqXG4gICAqIChnZXR0ZXIvc2V0dGVyKSBUaGUgYXR0cmlidXRlIHVzZWQgdG8gc2xpY2UgdGhlIHJlc3VsdGFudCBHRVQuXG4gICAqIFRoaXMgYXR0cmlidXRlIHNob3VsZCBiZSBpbiB0aGUgZm9ybSBvZiBhIHNlbGVjdG9yLCBpZTpcbiAgICogYC5hamF4LXNlbGVjdGlvbmBcbiAgICpcbiAgICogQHR5cGUge3N0cmluZ31cbiAgICogQGRlZmF1bHQgJ2RhdGEtd3RjLWFqYXgtc2VsZWN0aW9uJ1xuICAgKi9cbiAgc3RhdGljIHNldCBhdHRyaWJ1dGVTaG91bGROYXZpZ2F0ZShhdHRyaWJ1dGUpIHtcbiAgICBpZih0eXBlb2YgYXR0cmlidXRlID09PSAnc3RyaW5nJykge1xuICAgICAgdGhpcy5fYXR0cmlidXRlU2hvdWxkTmF2aWdhdGUgPSBhdHRyaWJ1dGU7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnNvbGUud2FybignQWxsIGF0dHJpYnV0ZXMgbXVzdCBiZSBzdHJpbmdzLicpO1xuICAgIH1cbiAgfVxuICBzdGF0aWMgZ2V0IGF0dHJpYnV0ZVNob3VsZE5hdmlnYXRlKCkge1xuICAgIHJldHVybiB0aGlzLl9hdHRyaWJ1dGVTaG91bGROYXZpZ2F0ZSB8fCAnZGF0YS13dGMtYWpheC1zaG91bGQtbmF2aWdhdGUnO1xuICB9XG5cbiAgLyoqXG4gICAqIHJldHVybnMgYSBuZXcgcmVxdWVzdE9iamVjdC4gV3JhcHBpbmcgcGxhY2Vob2xkZXIgZm9yIG5vdyB3YWl0aW5nIG9uIGVuaGFuY2VtZW50cy5cbiAgICpcbiAgICogQHJlYWRvbmx5XG4gICAqIEByZXR1cm4ge29iamVjdH0gIHJlcXVlc3RPYmplY3RcbiAgICovXG4gIHN0YXRpYyBnZXQgcmVxdWVzdE9iamVjdCgpIHtcbiAgICByZXR1cm4gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gIH1cblxuICAvKipcbiAgICogcmV0dXJucyBhIG5ldyBsYXN0IGNoYW5nZWQgdGFyZ2V0LiBUaGlzIGlzIHVzZWQgdG8gZGV0ZXJtaW5lIHdoYXQgdG8gY2hhbmdlZFxuICAgKiB3aGVuIG5hdmlnYXRpbmcgYmFjayB2aWEgaGlzdG9yeS5cbiAgICpcbiAgICogQHJldHVybiB7b2JqZWN0fSAgZWl0aGVyIGFuIGFycmF5IG9mIG5vZGVzIG9yIGEgc2luZ2xlIG5vZGUuXG4gICAqIEBkZWZhdWx0IG51bGxcbiAgICovXG4gIHN0YXRpYyBzZXQgbGFzdENoYW5nZWRUYXJnZXQodGFyZ2V0KSB7XG4gICAgdGhpcy5fbGFzdENoYW5nZWRUYXJnZXQgPSB0YXJnZXQ7XG4gIH1cbiAgc3RhdGljIGdldCBsYXN0Q2hhbmdlZFRhcmdldCgpIHtcbiAgICByZXR1cm4gdGhpcy5fbGFzdENoYW5nZWRUYXJnZXQgfHwgbnVsbDtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUgc3RhdGUgdGhhdCB0aGUgQUpBWCBvYmplY3QgaXMgaW4sIGFzIGRldGVybWluZWQgZnJvbSBhIGxpc3Qgb2YgY29uc3RhbnRzOlxuICAgKiAtIE9LICAgICAgICAgICAgIElkbGUsIHJlYWR5IGZvciBhIHN0YXRlIGxvYWQuXG4gICAqIC0gQ0xJQ0tFRCAgICAgICAgQ2xpY2tlZCwgYnV0IG5vdCB5ZXQgZmlyZWQuXG4gICAqIC0gTE9BRElORyAgICAgICAgTG9hZGluZyBwYWdlLlxuICAgKiAtIFRSQU5TSVRJT05JTkcgIFRyYW5zaXRpb25pbmcgc3RhdGVcbiAgICogLSBMT0FERUQgICAgICAgICBDb250ZW50IGxvYWRlZC5cbiAgICpcbiAgICogQHJldHVybiB7aW50ZWdlcn0gIFRoZSBzdGF0ZSB0aGF0IHRoZSBvYmplY3QgaXMgaW4uIENvbXBhcmUgdG8gdGhlIHN0YXRlIG9iamVjdCBmb3IgZGVzY3JpcHRpb25cbiAgICogQGRlZmF1bHQgU1RBVEUuT0tcbiAgICovXG4gIHN0YXRpYyBzZXQgc3RhdGUoc3RhdGUpIHtcbiAgICBpZiggdHlwZW9mIHN0YXRlID09PSAnc3RyaW5nJyApIHtcbiAgICAgIGlmKCBTVEFURVNbc3RhdGVdICE9PSB1bmRlZmluZWQgKSB7XG4gICAgICAgIHRoaXMuX3N0YXRlID0gU1RBVEVTW3N0YXRlXTtcbiAgICAgICAgcmV0dXJuXG4gICAgICB9XG4gICAgfSBlbHNlIGlmKCB0eXBlb2Ygc3RhdGUgPT09ICdudW1iZXInICkge1xuICAgICAgZm9yKHZhciBfc3RhdGUgaW4gU1RBVEVTKSB7XG4gICAgICAgIGlmKFNUQVRFU1tfc3RhdGVdID09PSBzdGF0ZSkge1xuICAgICAgICAgIHRoaXMuX3N0YXRlID0gc3RhdGU7XG5cbiAgICAgICAgICBpZiggdGhpcy5kZXZtb2RlIClcbiAgICAgICAgICB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhgJWMgQUpBWCBzdGF0ZSBjaGFuZ2U6ICR7dGhpcy5fc3RhdGV9IGAsICdiYWNrZ3JvdW5kOiAjMjIyOyBjb2xvcjogI2JhZGE1NScpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICBjb25zb2xlLndhcm4oJ3N0YXRlIG11c3QgYmUgb25lIG9mIE9LLCBDTElDS0VELCBMT0FESU5HLCBMT0FERUQuJyk7XG4gIH1cbiAgc3RhdGljIGdldCBzdGF0ZSgpIHtcbiAgICByZXR1cm4gdGhpcy5fc3RhdGUgfHwgMDtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUgbGFzdCBVUkwgdG8gYmUgcGFyc2VkIGJ5IHRoZSBBSkFYIG9iamVjdC4gR2VuZXJhbGx5IHNwZWFraW5nLCB0aGlzIGlzIHRoZVxuICAgKiBsYXN0IFVSTCB0byBiZSBsb2FkZWQgb3IgYXR0ZW1wdGVkIGxvYWRlZC5cbiAgICpcbiAgICogQHJldHVybiB7c3RyaW5nfSAgVGhlIHBhcnNlZCBVUkwgc3RyaW5nXG4gICAqIEBkZWZhdWx0IG51bGxcbiAgICovXG4gIHN0YXRpYyBzZXQgbGFzdFBhcnNlZFVSTChwYXJzZWRVUkwpIHtcbiAgICBpZiggdHlwZW9mIHBhcnNlZFVSTCA9PT0gJ3N0cmluZycgKSB7XG4gICAgICB0aGlzLl9sYXN0UGFyc2VkVVJMID0gcGFyc2VkVVJMO1xuICAgIH1cbiAgfVxuICBzdGF0aWMgZ2V0IGxhc3RQYXJzZWRVUkwoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2xhc3RQYXJzZWRVUkwgfHwgbnVsbDtcbiAgfVxufVxuXG5leHBvcnQgeyBBSkFYLCBFUlJPUlMsIFNUQVRFUyB9O1xuIiwiLyoqXG4gKiBDbGFzcyByZXByZXNlbnRpbmcgYW4gYWJzdHJhY3Rpb24gb2YgdGhlIGhpc3RvcnkgQVBJLlxuICogQHN0YXRpY1xuICogQG5hbWVzcGFjZVxuICogQGF1dGhvciBMaWFtIEVnYW4gPGxpYW1Ad2V0aGVjb2xsZWN0aXZlLmNvbT5cbiAqIEB2ZXJzaW9uIDAuOFxuICogQGNyZWF0ZWQgTm92IDE5LCAyMDE2XG4gKi9cbmNsYXNzIEhpc3Rvcnkge1xuXG4gIC8qKlxuICAgKiBQdWJsaWMgbWV0aG9kc1xuICAgKi9cblxuICAvKipcbiAgICAqIEluaXRpYWxpc2VzIHRoZSBIaXN0b3J5IGNsYXNzLiBOb3RoaW5nIHNob3VsZCBiZSBhYmxlIHRvXG4gICAgKiBvcGVyYXRlIGhlcmUgdW5sZXNzIHRoaXMgaGFzIHJ1biB3aXRoIGEgc3VwcG9ydCA9IHRydWUuXG4gICAgKlxuICAgICogQFB1YmxpY1xuICAgICogQHJldHVybiB7Ym9vbGVhbn0gICAgICAgICBSZXR1cm5zIHdoZXRoZXIgaW5pdCByYW4gb3Igbm90XG4gICAgKi9cbiAgc3RhdGljIGluaXQoZGV2bW9kZSA9IGZhbHNlKSB7XG4gICAgaWYodGhpcy5zdXBwb3J0KVxuICAgIHtcbiAgICAgIC8vIFRyeSB0byBzZXQgZXZlcnl0aGluZyB1cCwgYW5kIGlmIHdlIGZhaWwgdGhlbiByZXR1cm4gZmFsc2VcbiAgICAgIHRyeSB7XG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdwb3BzdGF0ZScsIChlKT0+IHtcbiAgICAgICAgICB2YXIgaGFzUG9wcGVkU3RhdGUgPSB0aGlzLl9wb3BzdGF0ZShlKTtcbiAgICAgICAgICByZXR1cm4gaGFzUG9wcGVkU3RhdGU7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMuZGV2bW9kZSAgICAgID0gZGV2bW9kZTtcblxuICAgICAgfSBjYXRjaCAoZSkge1xuXG4gICAgICAgIC8vIElmIHdlJ3JlIGluIGRldm1vZGUsIHNlbmQgb3VyIGNvbnNvbGUgb3V0cHV0XG4gICAgICAgIGlmKHRoaXMuZGV2bW9kZSkge1xuICAgICAgICAgIGNvbnNvbGUud2FybignZXJyb3IgaW4gaGlzdG9yeSBpbml0aWFsaXNhdGlvbicpO1xuICAgICAgICAgIGNvbnNvbGUubG9nKGUpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuXG4gICAgICB0aGlzLmluaXRpYWxpc2VkID0gdHJ1ZTtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDb25zdHJ1Y3QgYW5kIHB1c2ggYSBVUkwgc3RhdGVcbiAgICpcbiAgICogQHB1YmxpY1xuICAgKiBAcGFyYW0gIHtzdHJpbmd9IFVSTCAgICAgICAgICAgVGhlIFVSTCB0byBwdXNoLCBjYW4gYmUgcmVsYXRpdmUsIGFic29sdXRlIG9yIGZ1bGxcbiAgICogQHBhcmFtICB7c3RyaW5nfSB0aXRsZSAgICAgICAgIFRoZSB0aXRsZSB0byBwdXNoLlxuICAgKiBAcGFyYW0gIHtvYmplY3R9IHN0YXRlT2JqICAgICAgQSBzdGF0ZSB0byBwdXNoIHRvIHRoZSBzdGFjay4gVGhpcyB3aWxsIGJlIHBvcHBlZCB3aGVuIG5hdmlhZ3RpbmcgYmFja1xuICAgKiBAcmV0dXJuIHtib29sZWFufSAgICAgICAgICAgICAgSW5kaWNhdGVzIHdoZXRoZXIgdGhlIHB1c2ggc3VjY2VlZGVkXG4gICAqL1xuICBzdGF0aWMgcHVzaChVUkwsIHRpdGxlID0gJycsIHN0YXRlT2JqID0ge30pIHtcblxuICAgIHZhciBwYXJzZWRVUkwgPSAnJztcblxuICAgIC8vIEZpcnN0IHRyeSB0byBmaXggdGhlIFVSTFxuICAgIHRyeSB7XG4gICAgICBwYXJzZWRVUkwgPSB0aGlzLl9maXhVUkwoVVJMLCB0cnVlLCB0cnVlKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICBpZih0aGlzLmRldm1vZGUpIHtcbiAgICAgICAgY29uc29sZS53YXJuKCdwdXNoIGZhaWxlZCB3aGlsZSB0cnlpbmcgdG8gZml4IHRoZSBVUkwnKTtcbiAgICAgICAgY29uc29sZS5sb2coZSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gZmFsc2VcbiAgICB9XG5cbiAgICAvLyBJZiB3ZSBoYXZlIEFQSSBzdXBwb3J0LCBwdXNoIHRoZSBzdGF0ZSB0byB0aGUgaGlzdG9yeSBvYmplY3RcbiAgICBpZih0aGlzLnN1cHBvcnQpXG4gICAge1xuICAgICAgdHJ5IHtcbiAgICAgICAgdGhpcy5oaXN0b3J5LnB1c2hTdGF0ZShzdGF0ZU9iaiwgdGl0bGUsIHBhcnNlZFVSTCk7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGlmKHRoaXMuZGV2bW9kZSkge1xuICAgICAgICAgIGNvbnNvbGUud2FybigncHVzaCBmYWlsZWQgd2hpbGUgdHJ5aW5nIHRvIHB1c2ggdGhlIHN0YXRlIHRvIHRoZSBoaXN0b3J5IG9iamVjdCcpO1xuICAgICAgICAgIGNvbnNvbGUubG9nKGUpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICAvLyBPdGhlcndpc2VyLCBhZGQgdGhlIFVSTCBhcyBhIGhhc2hiYW5nXG4gICAgfSBlbHNlXG4gICAge1xuICAgICAgd2luZG93LmxvY2F0aW9uLmhhc2ggPSBgIyEke1VSTH1gO1xuICAgIH1cblxuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgLyoqXG4gICAqIFRha2VzIHRoZSB1c2VyIGJhY2sgdG8gdGhlIHByZXZpb3VzIHN0YXRlLiBTaW1wbHkgd3JhcHMgdGhlIGhpc3Rvcnkgb2JqZWN0J3MgYmFjayBtZXRob2QuXG4gICAqXG4gICAqIEBwdWJsaWNcbiAgICovXG4gIHN0YXRpYyBiYWNrKCkge1xuICAgIHRoaXMuaGlzdG9yeS5iYWNrKCk7XG4gIH1cblxuICAvKipcbiAgICogVGFrZXMgdGhlIHVzZXIgZm9yd2FyZCB0byB0aGUgbmV4dCBzdGF0ZS4gU2ltcGx5IHdyYXBzIHRoZSBoaXN0b3J5IG9iamVjdCdzIGZvcndhcmQgbWV0aG9kLlxuICAgKlxuICAgKiBAcHVibGljXG4gICAqL1xuICBzdGF0aWMgZm9yd2FyZCgpIHtcbiAgICB0aGlzLmhpc3RvcnkuZm9yd2FyZCgpO1xuICB9XG5cblxuICAvKipcbiAgICogUHJpdmF0ZSBtZXRob2RzXG4gICAqL1xuXG4gIC8qKlxuICAgKiBUYWtlcyBhIHByb3ZpZGVkIFVSTCBhbmQgcmV0dXJucyB0aGUgdmVyc2lvbiB0aGF0IGlzIHVzYWJsZVxuICAgKlxuICAgKiBAcHJpdmF0ZVxuICAgKiBAcGFyYW0gIHtzdHJpbmd9IFVSTCAgICAgICAgICAgICAgICAgICAgIFRoZSBVUkwgdG8gYmUgcGFzc2VkXG4gICAqIEBwYXJhbSAge2Jvb2xlYW59IGluY2x1ZGVEb2NSb290ID0gdHJ1ZSAgV2hldGhlciB0byBpbmNsdWRlIHRoZSBkb2Nyb290IG9uIHRoZSBwYXNzZWQgVVJMXG4gICAqIEBwYXJhbSAge2Jvb2xlYW59IGluY2x1ZGVUcmFpbHMgPSB0cnVlICAgV2hldGhlciB0byBpbmNsdWRlIGZvdW5kIGhhc2hlcyBhbmQgcGFyYW1zXG4gICAqIEByZXR1cm4ge3N0cmluZ30gICAgICAgICAgICAgICAgICAgICAgICAgVGhlIHBhc3NlZCBhbmQgZm9ybWF0dGVkIFVSTFxuICAgKi9cbiAgc3RhdGljIF9maXhVUkwoVVJMLCBpbmNsdWRlRG9jUm9vdCA9IHRydWUsIGluY2x1ZGVUcmFpbHMgPSB0cnVlKSB7XG5cbiAgICB2YXIgcnRuVVJMO1xuXG4gICAgLyoqXG4gICAgICogVVJMIFJlZ2V4IHdvcmtzIGxpa2UgdGhpczpcbiAgICAgKiBgYGBcbiAgICAgICAgXlxuICAgICAgICAoW146XSs6Ly8gICAgICAgICAgICMgSFRUUChTKSBldGMuXG4gICAgICAgICAgICAoW14vXSspICAgICAgICAgIyBUaGUgVVJMIChpZiBhdmFpbGFibGUpXG4gICAgICAgICk/XG4gICAgICAgICgje0Bkb2N1bWVudFJvb3R9KT8gIyBUaGUgZG9jdW1lbnQgcm9vdCwgd2hpY2ggd2Ugd2FudCB0byBnZXQgcmlkIG9mXG4gICAgICAgICgvKT8gICAgICAgICAgICAgICAgIyBjaGVjayBmb3IgdGhlIHByZXNlbmNlIG9mIGEgbGVhZGluZyBzbGFzaFxuICAgICAgICAoW15cXCNcXD9dKikgICAgICAgICAgIyBUaGUgVVJJIC0gdGhpcyBpcyB3aGF0IHdlIGNhcmUgYWJvdXQuIENoZWNrIGZvciBldmVyeXRoaW5nIGV4Y2VwdCBmb3IgIyBhbmQgP1xuICAgICAgICAoXFw/W15cXCNdKik/ICAgICAgICAgIyBhbnkgYWRkaXRpb25hbCBVUkwgcGFyYW1ldGVycyAob3B0aW9uYWwpXG4gICAgICAgIChcXCNcXCE/LispPyAgICAgICAgICAjIEFueSBoYXNoYmFuZyB0cmFpbGVycyAob3B0aW9uYWwpXG4gICAgICogYGBgXG4gICAgICovXG4gICAgY29uc3QgVVJMUmVnZXggPSBSZWdFeHAoYF4oW146XSs6Ly8oW14vXSspKT8oJHt0aGlzLmRvY3VtZW50Um9vdH0pPygvKT8oW15cXFxcI1xcXFw/XSopKFxcXFw/W15cXFxcI10qKT8oXFxcXCNcXFxcIT8uKyk/YCk7XG4gICAgY29uc3QgW2lucHV0LCBocmVmLCBob3N0bmFtZSwgZG9jdW1lbnRSb290LCByb290LCBwYXRoLCBwYXJhbXMsIGhhc2hiYW5nXSA9IFVSTFJlZ2V4LmV4ZWMoVVJMKTtcblxuICAgIGNvbnNvbGUubG9nKHRoaXMuZG9jdW1lbnRSb290LCBkb2N1bWVudFJvb3QsIHJvb3QsIHBhdGgpO1xuXG4gICAgLy8gSWYgd2UncmUgb2JzZXJ2aW5nIHRoZSBUTEROIHJlc3RyYWludCBhbmQgdGhlIHByb3ZpZGVkIFVSTCBkb2Vzbid0IG1hdGNoXG4gICAgLy8gdGhlIGRvbWFpbidzIFRMRE4sIHRocm93IGEgVVJJRXJyb3JcbiAgICBpZiggdHlwZW9mIGhvc3RuYW1lID09PSAnc3RyaW5nJyAmJiBob3N0bmFtZSAhPT0gdGhpcy5UTEROICYmIHRoaXMub2JzZXJ2ZVRMRE4gPT09IHRydWUgKSB7XG4gICAgICB0aHJvdyBuZXcgVVJJRXJyb3IoJ1RvcCBMZXZlbCBkb21haW4gbmFtZSBNVVNUIG1hdGNoIHRoZSBwcmltYXJ5IGRvbWFpbiBuYW1lJyk7XG4gICAgfVxuXG4gICAgLy8gSWYgb3VyIG1hdGNoZWQgVVJMIGhhcyBhIGxlYWRpbmcgc2xhc2gsIHRoZW4gd2Ugd2FudCB0byBkcm9wIHRoZSBkb2NSb290XG4gICAgLy8gaW4gdGhlcmUgdW5sZXNzIHRoZSBmdW5jdGlvbiBwYXJhbSBcImluY2x1ZGVEb2NSb290XCIgaXMgZmFsc2UuXG4gICAgaWYoXG4gICAgICAoIHR5cGVvZiByb290ID09PSAnc3RyaW5nJyAmJiByb290ID09PSAnLycgKSB8fFxuICAgICAgKCB0eXBlb2YgZG9jdW1lbnRSb290ID09PSAnc3RyaW5nJyAmJiBkb2N1bWVudFJvb3QgPT09IHRoaXMuZG9jdW1lbnRSb290IClcbiAgICApIHtcbiAgICAgIGlmKCBpbmNsdWRlRG9jUm9vdCApIHtcbiAgICAgICAgcnRuVVJMID0gYCR7dGhpcy5kb2N1bWVudFJvb3R9LyR7cGF0aH1gO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcnRuVVJMID0gYC8ke3BhdGh9YDtcbiAgICAgIH1cbiAgICAvLyBFbHNlIGlmIHBhdGggaGFzIHJlc3VsdGVkIGluIGFuIGVtcHR5IHN0cmluZywgYXNzdW1lIHRoZSBwYXRoIGlzIHRoZSByb290XG4gICAgfSBlbHNlIGlmKCBwYXRoID09PSAnJyApIHtcbiAgICAgIHJ0blVSTCA9ICcvJ1xuICAgIC8vIE90aGVyd2lzZSwganVzdCBwYXNzIHRoZSBwYXRoIGNvbXBsZXRlbHkuXG4gICAgfSBlbHNlIHtcbiAgICAgIHJ0blVSTCA9IHBhdGg7XG4gICAgfVxuXG4gICAgLy8gSWYgd2Ugd2FudCB0byBpbmNsdWRlIHRyYWlscyAoaGFzaGVzIGFuZCBwYXJhbXMsIGFzIGRldGVybWluZWQgYnkgYVxuICAgIC8vIGZ1bmNpdG9uIHBhcmFtKSwgdGhlbiBhZGQgdGhlbSB0byB0aGUgVVJMLlxuICAgIGlmKCBpbmNsdWRlVHJhaWxzICkge1xuICAgICAgLy8gQXBwZW5kIGFueSBwYXJhbXNcbiAgICAgIGlmKCB0eXBlb2YgcGFyYW1zID09ICdzdHJpbmcnICkge1xuICAgICAgICBydG5VUkwgKz0gcGFyYW1zO1xuICAgICAgfVxuICAgICAgICAvLyBBcHBlbmQgYW55IGhhc2hlc1xuICAgICAgaWYoIHR5cGVvZiBoYXNoYmFuZyA9PSAnc3RyaW5nJyApIHtcbiAgICAgICAgcnRuVVJMICs9IGhhc2hiYW5nO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBydG5VUkw7XG4gIH1cblxuICAvKipcbiAgICogTGlzdGVuZXIgZm9yIHRoZSBwb3BzdGF0ZSBtZXRob2RcbiAgICpcbiAgICogQHByaXZhdGVcbiAgICogQHBhcmFtICB7b2JqZWN0fSBlIHRoZSBwYXNzZWQgZXZlbnQgb2JqZWN0XG4gICAqIEByZXR1cm4gdm9pZFxuICAgKi9cbiAgc3RhdGljIF9wb3BzdGF0ZShlKSB7XG4gICAgdmFyIGJhc2UsIHN0YXRlO1xuICAgIGlmKHRoaXMuc3VwcG9ydClcbiAgICB7XG4gICAgICB0cnkge1xuICAgICAgICBzdGF0ZSA9IChiYXNlID0gdGhpcy5oaXN0b3J5KS5zdGF0ZSB8fCAoYmFzZS5zdGF0ZSA9IGUuc3RhdGUgfHwgKGUuc3RhdGUgPSB3aW5kb3cuZXZlbnQuc3RhdGUpKTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlcnMgYW5kIHNldHRlcnNcbiAgICovXG5cbiAgLyoqXG4gICAqIChnZXR0ZXIvc2V0dGVyKSBTZXRzIHRoZSBkb2N1bWVudCByb290IGZyb20gYSBwYXNzZWQgVVJMXG4gICAqIHJldHVybnMgdGhlIHNhdmVkIGRvY3VtZW50IHJvb3Qgb3IgYSBgL2AgaWYgbm90IHNldFxuICAgKlxuICAgKiBAZGVmYXVsdCAnLydcbiAgICogQHR5cGUge3N0cmluZ31cbiAgICovXG4gIHN0YXRpYyBzZXQgZG9jdW1lbnRSb290KGRvY3VtZW50Um9vdCA9ICcnKSB7XG5cbiAgICAvKipcbiAgICAgKiBkb2Nyb290UmVnZXggd29ya3MgbGlrZSB0aGlzOlxuICAgICAqIGBgYFxuICAgICAgICAgXlxuICAgICAgICAgKFteOl0rOi8vICAgICAgICMgSFRUUChTKSBldGMuXG4gICAgICAgICAgICAgKFteL10rKSAgICAgIyBUaGUgaG9zdG5hbWUgKGlmIGF2YWlsYWJsZSlcbiAgICAgICAgICk/XG4gICAgICAgICAvP1xuICAgICAgICAgKC4qKD89LykpPyAgICAgICMgdGhlIFVSSSB0byB1c2UgYXMgdGhlIGRvY3Jvb3QgbGVzcyBhbnkgYXZhaWxhYmxlIHRyYWlsaW5nIHNsYXNoXG4gICAgICogYGBgXG4gICAgICovXG4gICAgY29uc3QgZG9jcm9vdFJlZ2V4ID0gL14oW146XSs6XFwvXFwvKFteXFwvXSspKT9cXC8/KC4qKD89XFwvKSk/LztcbiAgICAvLyBwYXNzIHRoZSBkb2Nyb290IGFuZCBob3N0bmFtZVxuICAgIGNvbnN0IFtfMSwgXzIsIGhvc3RuYW1lLCBkb2Nyb290XSA9IGRvY3Jvb3RSZWdleC5leGVjKGRvY3VtZW50Um9vdCk7XG4gICAgY29uc29sZS5sb2coaG9zdG5hbWUsIGRvY3Jvb3QpO1xuXG4gICAgLy8gRXJyb3IgY2hlY2tcbiAgICAvLyBjaGVjayBmb3IgdGhlIHByZXNlbmNlIG9mIHRoZSByZXBvcnRlZCBUTEROXG4gICAgaWYoXG4gICAgICB0eXBlb2YgaG9zdG5hbWUgPT09ICdzdHJpbmcnICYmXG4gICAgICBob3N0bmFtZSAhPSB0aGlzLlRMRE4gJiZcbiAgICAgIHRoaXMub2JzZXJ2ZVRMRE4gPT09IHRydWVcbiAgICApIHtcbiAgICAgIHRocm93IG5ldyBVUklFcnJvcignVG9wIExldmVsIGRvbWFpbiBuYW1lIE1VU1QgbWF0Y2ggdGhlIHByaW1hcnkgZG9tYWluIG5hbWUnKTtcbiAgICB9XG5cbiAgICB0aGlzLl9kb2N1bWVudFJvb3QgPSBgLyR7ZG9jcm9vdH1gO1xuICB9XG4gIHN0YXRpYyBnZXQgZG9jdW1lbnRSb290KCkge1xuICAgIHJldHVybiB0aGlzLl9kb2N1bWVudFJvb3QgfHwgJy8nO1xuICB9XG5cbiAgLyoqXG4gICAqIChnZXR0ZXIvc2V0dGVyKSBQcm92aWRlcyBhbiBlcnJvciBpZiB0aGUgdXNlciB0cmllcyB0byBzZXQgdGhlIGhpc3Rvcnkgb2JqZWN0XG4gICAqIHJldHVybnMgdGhlIHdpbmRvdyBoaXN0b3J5IG9iamVjdFxuICAgKlxuICAgKiBAdHlwZSB7b2JqZWN0fVxuICAgKi9cbiAgc3RhdGljIHNldCBoaXN0b3J5KGhpc3RvcnkpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ1RoZSBoaXN0b3J5IG9iamVjdCBpcyByZWFkIG9ubHknKTtcbiAgfVxuICBzdGF0aWMgZ2V0IGhpc3RvcnkoKSB7XG4gICAgcmV0dXJuIHdpbmRvdy5oaXN0b3J5O1xuICB9XG5cbiAgLyoqXG4gICAqIChnZXR0ZXIvc2V0dGVyKSBTZXRzIHRoZSB0b3AgbGV2ZWwgZG9tYWluIG5hbWUuXG4gICAqIHJldHVybnMgdGhlIHJlY29yZGVkIFRMRE4gb3IsIGJ5IGRlZmF1bHQsIHdpbmRvdy5sb2NhdGlvbi5ob3N0bmFtZS5cbiAgICpcbiAgICogQHR5cGUge3N0cmluZ31cbiAgICovXG4gIHN0YXRpYyBzZXQgVExETihUTEROKSB7XG4gICAgLy8gQG5vdGUgV2Ugc2hvdWxkIGluY2x1ZGUgc29tZSBlcnJvciBjaGVja2luZyBpbiBoZXJlXG4gICAgdGhpcy5fVExETiA9IFRMRE47XG4gIH1cbiAgc3RhdGljIGdldCBUTEROKCkge1xuICAgIHJldHVybiB0aGlzLl9UTEROIHx8IHdpbmRvdy5sb2NhdGlvbi5ob3N0bmFtZTtcbiAgfVxuXG4gIC8qKlxuICAgKiAoZ2V0dGVyL3NldHRlcikgd2hldGhlciB0byBvYnNlcnZlIHRoZSBUTEROIG9yIGB0cnVlYCAoZGVmYXVsdCkuXG4gICAqXG4gICAqIEBkZWZhdWx0IHRydWVcbiAgICogQHR5cGUge2Jvb2xlYW59XG4gICAqL1xuICBzdGF0aWMgc2V0IG9ic2VydmVUTEROKG9ic2VydmUpIHtcbiAgICAvLyBDaGVjayB0byBtYWtlIHN1cmUgdGhhdCB0aGUgYmFzc2VkIHZhbHVlIGlzIG9mIHR5cGUgYm9vbGVhbi5cbiAgICBpZih0eXBlb2Ygb2JzZXJ2ZSA9PT0gJ2Jvb2xlYW4nKVxuICAgIHtcbiAgICAgIHRoaXMuX29ic2VydmVUTEROID0gb2JzZXJ2ZTtcbiAgICB9IGVsc2VcbiAgICB7XG4gICAgICBjb25zb2xlLndhcm4oJ29ic2VydmVUTEROIG11c3QgYmUgb2YgdHlwZSBib29sZWFuJyk7XG4gICAgfVxuICB9XG4gIHN0YXRpYyBnZXQgb2JzZXJ2ZVRMRE4oKSB7XG4gICAgaWYodHlwZW9mIHRoaXMuX29ic2VydmVUTEROID09PSAnYm9vbGVhbicpXG4gICAge1xuICAgICAgcmV0dXJuIHRoaXMuX29ic2VydmVUTEROO1xuICAgIH0gZWxzZVxuICAgIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiAoZ2V0dGVyL3NldHRlcikgV2hldGhlciB0aGlzIGhpc3Rvcnkgb2JqZWN0IGlzIGluIGRldm1vZGUuIERlZmF1bHRzIHRvIGZhbHNlXG4gICAqXG4gICAqIEBkZWZhdWx0IGZhbHNlXG4gICAqIEB0eXBlIHtib29sZWFufVxuICAgKi9cbiAgc3RhdGljIHNldCBkZXZtb2RlKGRldm1vZGUpIHtcbiAgICAvLyBDaGVjayB0byBtYWtlIHN1cmUgdGhhdCB0aGUgYmFzc2VkIHZhbHVlIGlzIG9mIHR5cGUgYm9vbGVhbi5cbiAgICBpZih0eXBlb2YgZGV2bW9kZSA9PT0gJ2Jvb2xlYW4nKVxuICAgIHtcbiAgICAgIHRoaXMuX2Rldm1vZGUgPSBkZXZtb2RlO1xuICAgIH0gZWxzZVxuICAgIHtcbiAgICAgIGNvbnNvbGUud2FybignZGV2bW9kZSBtdXN0IGJlIG9mIHR5cGUgYm9vbGVhbicpO1xuICAgIH1cbiAgfVxuICBzdGF0aWMgZ2V0IGRldm1vZGUoKSB7XG4gICAgaWYodHlwZW9mIHRoaXMuX2Rldm1vZGUgPT09ICdib29sZWFuJylcbiAgICB7XG4gICAgICByZXR1cm4gdGhpcy5fZGV2bW9kZTtcbiAgICB9IGVsc2VcbiAgICB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIChnZXR0ZXIvc2V0dGVyKSBXaGV0aGVyIHRoaXMgaGlzdG9yeSBvYmplY3QgaXMgaW5pdGlhbGlhc2VkLlxuICAgKlxuICAgKiBAZGVmYXVsdCBmYWxzZVxuICAgKiBAdHlwZSB7Ym9vbGVhbn1cbiAgICovXG4gIHN0YXRpYyBzZXQgaW5pdGlhbGlhc2VkKGluaXRpYWxpYXNlZCkge1xuICAgIC8vIENoZWNrIHRvIG1ha2Ugc3VyZSB0aGF0IHRoZSBiYXNzZWQgdmFsdWUgaXMgb2YgdHlwZSBib29sZWFuLlxuICAgIGlmKHR5cGVvZiBpbml0aWFsaWFzZWQgPT09ICdib29sZWFuJylcbiAgICB7XG4gICAgICB0aGlzLl9pbml0aWFsaWFzZWQgPSBpbml0aWFsaWFzZWQ7XG4gICAgfSBlbHNlXG4gICAge1xuICAgICAgY29uc29sZS53YXJuKCdpbml0aWFsaWFzZWQgbXVzdCBiZSBvZiB0eXBlIGJvb2xlYW4nKTtcbiAgICB9XG4gIH1cbiAgc3RhdGljIGdldCBpbml0aWFsaWFzZWQoKSB7XG4gICAgaWYodHlwZW9mIHRoaXMuX2luaXRpYWxpYXNlZCA9PT0gJ2Jvb2xlYW4nKVxuICAgIHtcbiAgICAgIHJldHVybiB0aGlzLl9pbml0aWFsaWFzZWQ7XG4gICAgfSBlbHNlXG4gICAge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiAoZ2V0dGVyL3NldHRlcikgV2hldGhlciBoaXN0b3J5IGlzIHN1cHBvcnRlZCBieSB0aGUgYnJvd3NlciBvciBkZXZpY2UuXG4gICAqIFByb3ZpZGVzIGFuIGVycm9yIGlmIHRoZSB1c2VyIHRyaWVzIHRvIHNldCB0aGUgc3VwcG9ydCB2YWx1ZSwgdW5sZXNzIHRoZSBvYmplY3QgaXMgaW4gZGV2bW9kZVxuICAgKlxuICAgKiBAdHlwZSB7Ym9vbGVhbn1cbiAgICovXG4gIHN0YXRpYyBzZXQgc3VwcG9ydChzdXBwb3J0ID0gZmFsc2UpIHtcbiAgICAvLyBUaGlzIG92ZXJyaWRlc1xuICAgIGlmKCB0aGlzLmRldm1vZGUgJiYgdHlwZW9mIHN1cHBvcnQgPT09ICdib29sZWFuJyApIHtcbiAgICAgIHRoaXMuX3N1cHBvcnQgPSBzdXBwb3J0O1xuICAgIH1cbiAgICB0aHJvdyBuZXcgRXJyb3IoJ1RoZSBzdXBwb3J0IGlzIHJlYWQgb25seScpO1xuICB9XG4gIHN0YXRpYyBnZXQgc3VwcG9ydCgpIHtcbiAgICByZXR1cm4gKHdpbmRvdy5oaXN0b3J5ICYmIHdpbmRvdy5oaXN0b3J5LnB1c2hTdGF0ZSk7XG4gIH1cblxuICAvKipcbiAgICogKGdldHRlci9zZXR0ZXIpIFRoZSBsZW5ndGggb2YgdGhlIGhpc3Rvcnkgc3RhY2tcbiAgICpcbiAgICogQHR5cGUge2ludGVnZXJ9XG4gICAqL1xuICBzdGF0aWMgZ2V0IGxlbmd0aCgpIHtcbiAgICByZXR1cm4gdGhpcy5oaXN0b3J5Lmxlbmd0aDtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBIaXN0b3J5O1xuIl19
