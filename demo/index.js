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

  _wtcAjax.AJAX.resolveTimeout = 1000; // Remove this when not 

  // This is a manual initialisation of links and is, instead, a demonstration
  // of how programatic AJAX retrieval works.
  window.addEventListener('load', function (e) {
    document.getElementById('link_1').addEventListener('click', function (e) {
      _wtcAjax.AJAX.ajaxGet("/demo/page1.html", "#link1-target", ".link1-selection", e.target).then(function (resolver) {
        // console.log('onLoad', resolver);
        return resolver;
      });
    });
  });
});

window.AJAXObj = _wtcAjax.AJAX;

},{"../src/wtc-ajax":4}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var utilities = {};

/**
 * randomBetween
 * Generate a random integer number max and min.
 * @min {number} Minimum value.
 * @max {number} Maximum value.
 * return {number} Random integer.
 */
utilities.randomBetween = function (min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

/**
 * getStyle
 * Get the current style value from an element.
 * @el {DOMNode} Target element.
 * @prop {string} CSS property name.
 * @stripUnit {boolean} Remove units.
 * return {string} Current CSS value WITH unit.
 */
utilities.getStyle = function (el, prop, stripUnit) {
  var strValue = "";

  if (window.getComputedStyle) {
    strValue = getComputedStyle(el).getPropertyValue(prop);
  }
  //IE
  else if (el.currentStyle) {
      try {
        strValue = el.currentStyle[prop];
      } catch (e) {}
    }

  if (stripUnit) {
    strValue = parseInt(strValue);
  }

  return strValue;
};

/**
 * Log
 * Simple log function to show different colors on the console.
 * @status {string} Status type.
 * @msg {string} Message to show.
 */
utilities.log = function (status, msg) {
  var bgc, color;

  switch (status) {
    case "success":
      color = "Green";
      bgc = "LimeGreen";
      break;
    case "info":
      color = "DodgerBlue";
      bgc = "Turquoise";
      break;
    case "error":
      color = "Black";
      bgc = "Red";
      break;
    case "warning":
      color = "Tomato";
      bgc = "Gold";
      break;
    default:
      color = "black";
      bgc = "White";
  }

  if ((typeof msg === "undefined" ? "undefined" : _typeof(msg)) === "object") {
    console.log(msg);
  } else {
    console.log("%c" + msg, "color:" + color + ";font-weight:bold; background-color: " + bgc + ";");
  }
};

/**
 * once
 * Fires an event only once and executes the callback.
 * @node {DOMElement} Dom element to attach event.
 * @type {String} Type of event.
 * @callback {function} Callback.
 */
utilities.once = function (node, type, callback) {
  node.addEventListener(type, function (e) {
    e.target.removeEventListener(e.type, arguments.callee);
    return callback(e);
  });
};

/**
 * shuffleArray
 * Shuffle an array.
 * @array Arrray to be shuffled.
 * return {array} Shuffled array.
 */
utilities.shuffleArray = function (array) {
  var currentIndex = array.length,
      temporaryValue,
      randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
};

/**
 * fireCustomEvent
 * Fire a custom event.
 * @name {string} Name of the event.
 * @data {object} Object to be passed to the event.
 */
utilities.fireCustomEvent = function (name, data, bubbles, cancelable) {
  var ev;
  var params = {
    bubbles: bubbles || true,
    cancelable: cancelable || true,
    detail: data || null
  };

  if (typeof window.CustomEvent === "function") {
    ev = new CustomEvent(name, params);
  } else {
    ev = document.createEvent('CustomEvent');
    ev.initCustomEvent(name, params.bubbles, params.cancelable, params.detail);
  }

  window.dispatchEvent(ev);
};

/**
 * forEachNode
 * Loop through and array of DOM elements.
 * @array {DOM Node List} List of elements.
 * @callback {function} Callback.
 * @scope *optional {function} Scope to pass to callback.
 */
utilities.forEachNode = function (array, callback, scope) {
  for (var i = 0; i < array.length; i++) {
    callback.call(scope, i, array[i]); // passes back stuff we need
  }
};

/**
 * getElementPosition
 * Get the position of the element relative to document.
 * @element {DOM Node} Element.
 * returns Object with element coordinates.
 */
utilities.getElementPosition = function (element) {
  var positionToViewport = element.getBoundingClientRect();

  var scrollTop = window.pageYOffset;
  var scrollLeft = window.pageXOffset;

  var clientTop = document.body.clientTop || 0;
  var clientLeft = document.body.clientLeft || 0;

  var top = positionToViewport.top + scrollTop - clientTop;
  var left = positionToViewport.left + scrollLeft - clientLeft;

  return {
    top: Math.round(top),
    left: Math.round(left)
  };
};

/**
 * getViewportDimensions
 * Get the browser window size.
 * retuns Object with dimensions.
 */
utilities.getViewportDimensions = function () {
  return {
    width: Math.max(document.documentElement.clientWidth, window.innerWidth || 0),
    height: Math.max(document.documentElement.clientHeight, window.innerHeight || 0)
  };
};

/**
 * classExtend
 * Extends a parent class.
 * @child {function} Child class.
 * @parent {function} Parent class.
 * returns updated Child class;
 */
utilities.classExtend = function (child, parent) {
  var hasProp = {}.hasOwnProperty;

  for (var key in parent) {
    if (hasProp.call(parent, key)) child[key] = parent[key];
  }

  function ctor() {
    this.constructor = child;
  }

  ctor.prototype = parent.prototype;
  child.prototype = new ctor();
  child.__super__ = parent.prototype;

  return child;
};

/**
 * HasClass
 * Checks for class on element.
 * @cl {string} Names. You can split the names with a space
 * @e {DOM Element} Element
 */
utilities.hasClass = function (cl, e) {

  var c, classes, i, j, len, len1;
  classes = cl.split(' ');

  if (e.classList) {
    for (i = 0, len = classes.length; i < len; i++) {
      c = classes[i];
      if (e.classList.contains(c) === true) {
        return true;
      }
    }
  } else {
    for (j = 0, len1 = classes.length; j < len1; j++) {
      c = classes[j];
      if (new RegExp('(^| )' + c + '( |$)', 'gi').test(e.c)) {
        return true;
      }
    }
  }

  return false;
};

/**
 * RemoveClass
 * Remove class from element.
 * @c {string} name of the class
 * @e {DOM Element} Element
 */
utilities.removeClass = function (c, e) {

  var classes, i, j, len, len1;
  classes = c.split(' ');
  if (e.classList) {
    for (i = 0, len = classes.length; i < len; i++) {
      c = classes[i];
      e.classList.remove(c);
    }
  } else {
    for (j = 0, len1 = classes.length; j < len1; j++) {
      c = classes[j];
      e.className = e.className.replace(new RegExp('(^|\\b)' + c.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
    }
  }
};

/**
 * AddClass
 * Add class to element.
 * @c {string} Name of the class
 * @e {DOM Element} Element
 */
utilities.addClass = function (c, e) {

  var classes, i, j, len, len1;
  classes = c.split(' ');

  if (e.classList) {
    for (i = 0, len = classes.length; i < len; i++) {
      c = classes[i];
      e.classList.add(c);
    }
  } else {
    for (j = 0, len1 = classes.length; j < len1; j++) {
      c = classes[j];
      e.className += ' ' + c;
    }
  }
};

/**
 * GetSiblings
 * Get siblings from element
 * @e {DOM Element} Element
 * @return Array of DOM Elements
 */
utilities.getSiblings = function (e) {

  return Array.prototype.filter.call(e.parentNode.children, function (child) {
    return child !== e;
  });
};

/**
 * Function to normalize the selctor 'matchesSelector' across browsers
 */
utilities.matches = function () {

  var doc, matches;
  doc = document.documentElement;
  matches = doc.matchesSelector || doc.webkitMatchesSelector || doc.mozMatchesSelector || doc.oMatchesSelector || doc.msMatchesSelector;

  return matches;
};

/**
 * Extend
 * Similar to jquery.extend, it appends the properties from 'options' to default and overwrite the ones that already exist in 'defaults'
 * @defaults {Object} Default values
 * @options {Object} New values
 */
utilities.extend = function (defaults, options) {

  var extended = {},
      key = null;

  for (key in defaults) {
    if (defaults.hasOwnProperty(key)) extended[key] = defaults[key];
  }

  for (key in options) {
    if (options.hasOwnProperty(key)) extended[key] = options[key];
  }

  return extended;
};

exports.default = utilities;
},{}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

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
      for (var i in el.childNodes) {
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
 * The resolving object for the {@link wtc-AnimationEvents.addEndEventListener}
 *
 * @callback timerResolve
 * @param {string} response           The response from the AJAX call
 * @param {array} arguments           The arguments array originally passed to the {@link AJAX.ajaxGet} method
 * @param {DOMElement} linkTarget     The target element that fired the {@link AJAX.ajaxGet} 
 */

/**
 * Allows us to add an end event listener to the node.
 *
 * @param  {HTMLElement}  node      The element to attach the end event listener to
 * @param  {function}     listener  The function to run when the animation is finished. This allows us to construct an object to pass back through the promise chain of the parent.
 * @return {Promise}                A promise that represents the animation timeout.
 * @return {timerResolve}           The resolve method. Passes the coerced variables (if any) from the listening object back to the chain.
 * @return {timerReject}            The reject method. Null.
 */
var addEndEventListener = function addEndEventListener(node, listener) {
  console.log('---- addEndEventListener ----');
  console.log(node, listener, typeof listener === 'undefined' ? 'undefined' : _typeof(listener));
  console.log('   ');
  if (typeof listener !== 'function') {
    var listener = function listener() {
      return {};
    };
  }
  return new Promise(function (resolve, reject) {
    var time = detectAnimationEndTime(node);
    var timeout = setTimeout(function () {
      var returner = listener();
      returner.time = time;
      resolve(returner);
    }, time);
  });
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

},{}],4:[function(require,module,exports){
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

var _wtcUtilityHelpers = require("wtc-utility-helpers");

var _wtcUtilityHelpers2 = _interopRequireDefault(_wtcUtilityHelpers);

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
     * @return {Promise}                        A promise that represents the GET.
     * @return {loadResolve}                    The resolve method. Passes the loaded content down through it's thenables, finally resolving to the parse commend via a second, private Promise.
     * @return {loadReject}                     The reject method. Results in an error
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
          // Find the target node
          var targetNode = document.querySelectorAll(target)[0];
          // add the class to it
          _wtcUtilityHelpers2.default.addClass(this.classBaseTransition + '-out-start', targetNode);
          _wtcUtilityHelpers2.default.addClass(this.classBaseTransition + '-out', targetNode);
          // Add the animation end listener to the target node
          return _wtcAnimationEvents2.default.addEndEventListener(targetNode, function () {
            return resolver;
          });
        }
      }.bind(this)).then(function (resolver) {
        // Find the target node
        var targetNode = document.querySelectorAll(target)[0];
        // Modify its classes
        _wtcUtilityHelpers2.default.removeClass(this.classBaseTransition + '-out-start', targetNode);
        _wtcUtilityHelpers2.default.addClass(this.classBaseTransition + '-out-end', targetNode);
        // Set a null timeout to repaint on classchange
        return new Promise(function (resolve, reject) {
          setTimeout(function () {
            resolve(resolver);
          }, this.resolveTimeout);
        }.bind(this));
      }.bind(this)).then(function (resolver) {
        // Find the target node
        var targetNode = document.querySelectorAll(target)[0];
        // Modify its classes
        _wtcUtilityHelpers2.default.removeClass(this.classBaseTransition + '-out-end', targetNode);
        _wtcUtilityHelpers2.default.addClass(this.classBaseTransition + '-out', targetNode);
        // Finally. Parse the result
        this._parseResponse(resolver.responseText, target, selection, fromPop, linkTarget);
      }.bind(this)).catch(function (err) {
        console.log(err);
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

      this.ajaxGet(href, target, selection, true, data);

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
     * @param  {DOMElement} [linkTarget]  The target of the link. This is useful for setting active states in callback.
     */

  }, {
    key: "_parseResponse",
    value: function _parseResponse(content, target, selection) {
      var fromPop = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
      var linkTarget = arguments[4];


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
        console.clear();
        console.log({ target: target, selection: selection });
        this.push(this.lastParsedURL, newTitle, { target: target, selection: selection });
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
        for (var key in ERRORS) {
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
     * The resolve timeout. This is the time that is to ellapse between an transition
     * completing and the new content being added. This is applied both to the outward
     * element and the inward.
     *
     * @return {int}  A number, in MS, greater than 0
     * @default 0
     */

  }, {
    key: "resolveTimeout",
    set: function set(timeout) {
      this._resolveTimeout = timeout > 0 ? timeout : null;
    },
    get: function get() {
      return this._resolveTimeout > 0 ? this._resolveTimeout : 0;
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

},{"./wtc-AnimationEvents":3,"./wtc-history":5,"wtc-utility-helpers":2}],5:[function(require,module,exports){
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJkZW1vL3J1bi5qcyIsIm5vZGVfbW9kdWxlcy93dGMtdXRpbGl0eS1oZWxwZXJzL2Rpc3Qvd3RjLXV0aWxpdHktaGVscGVycy5qcyIsInNyYy93dGMtQW5pbWF0aW9uRXZlbnRzLmpzIiwic3JjL3d0Yy1hamF4LmpzIiwic3JjL3d0Yy1oaXN0b3J5LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUNBQTs7QUFFQTtBQUNBLGNBQUssSUFBTCxDQUFVLElBQVY7QUFDQTtBQUNBLGNBQUssWUFBTCxHQUFvQixRQUFwQjs7QUFFQSxTQUFTLEtBQVQsQ0FBZSxFQUFmLEVBQW1CO0FBQ2pCLE1BQUksU0FBUyxVQUFULElBQXVCLFNBQTNCLEVBQXNDO0FBQ3BDO0FBQ0QsR0FGRCxNQUVPO0FBQ0wsYUFBUyxnQkFBVCxDQUEwQixrQkFBMUIsRUFBOEMsRUFBOUM7QUFDRDtBQUNGOztBQUVELE1BQU0sWUFDTjtBQUNFO0FBQ0EsZ0JBQUssU0FBTDs7QUFFQSxnQkFBSyxjQUFMLEdBQXNCLElBQXRCLENBSkYsQ0FJOEI7O0FBRTVCO0FBQ0E7QUFDQSxTQUFPLGdCQUFQLENBQXdCLE1BQXhCLEVBQWdDLFVBQVMsQ0FBVCxFQUFZO0FBQzFDLGFBQVMsY0FBVCxDQUF3QixRQUF4QixFQUFrQyxnQkFBbEMsQ0FBbUQsT0FBbkQsRUFBNEQsVUFBUyxDQUFULEVBQVk7QUFDdEUsb0JBQ0UsT0FERixDQUNVLGtCQURWLEVBQzhCLGVBRDlCLEVBQytDLGtCQUQvQyxFQUNtRSxFQUFFLE1BRHJFLEVBRUUsSUFGRixDQUVPLFVBQVMsUUFBVCxFQUFtQjtBQUN0QjtBQUNBLGVBQU8sUUFBUDtBQUNELE9BTEg7QUFNRCxLQVBEO0FBUUQsR0FURDtBQVVELENBbkJEOztBQXFCQSxPQUFPLE9BQVA7OztBQ3BDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7QUM3VkE7Ozs7Ozs7QUFRQTs7Ozs7Ozs7QUFRQSxJQUFJLHlCQUF5QixTQUF6QixzQkFBeUIsQ0FBUyxJQUFULEVBQzdCO0FBQ0UsTUFBSSxXQUFXLENBQWY7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Q0UsZUFBTyxLQUFLLFFBQVo7QUFDRCxPQUhELE1BSUE7QUFDRSxlQUFPLEtBQVA7QUFDRDtBQUNGOztBQUVEOzs7Ozs7Ozs7c0JBTXdCLFksRUFBYztBQUNwQztBQUNBLFVBQUcsT0FBTyxZQUFQLEtBQXdCLFNBQTNCLEVBQ0E7QUFDRSxhQUFLLGFBQUwsR0FBcUIsWUFBckI7QUFDRCxPQUhELE1BSUE7QUFDRSxnQkFBUSxJQUFSLENBQWEsc0NBQWI7QUFDRDtBQUNGLEs7d0JBQ3lCO0FBQ3hCLFVBQUcsT0FBTyxLQUFLLGFBQVosS0FBOEIsU0FBakMsRUFDQTtBQUNFLGVBQU8sS0FBSyxhQUFaO0FBQ0QsT0FIRCxNQUlBO0FBQ0UsZUFBTyxLQUFQO0FBQ0Q7QUFDRjs7QUFFRDs7Ozs7Ozs7O3dCQU1vQztBQUFBLFVBQWpCLE9BQWlCLHVFQUFQLEtBQU87O0FBQ2xDO0FBQ0EsVUFBSSxLQUFLLE9BQUwsSUFBZ0IsT0FBTyxPQUFQLEtBQW1CLFNBQXZDLEVBQW1EO0FBQ2pELGFBQUssUUFBTCxHQUFnQixPQUFoQjtBQUNEO0FBQ0QsWUFBTSxJQUFJLEtBQUosQ0FBVSwwQkFBVixDQUFOO0FBQ0QsSzt3QkFDb0I7QUFDbkIsYUFBUSxPQUFPLE9BQVAsSUFBa0IsT0FBTyxPQUFQLENBQWUsU0FBekM7QUFDRDs7QUFFRDs7Ozs7Ozs7d0JBS29CO0FBQ2xCLGFBQU8sS0FBSyxPQUFMLENBQWEsTUFBcEI7QUFDRDs7Ozs7O2tCQUdZLE8iLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiaW1wb3J0IHsgQUpBWCB9IGZyb20gXCIuLi9zcmMvd3RjLWFqYXhcIjtcblxuLy8gSW5pdGlhbGlzZSB0aGUgaGlzdG9yeSBvYmplY3QgaW4gZGV2IG1vZGVcbkFKQVguaW5pdCh0cnVlKTtcbi8vIFNldCB0aGUgZG9jdW1lbnQgcm9vdCBmb3IgdGhlIGFwcGxpY2F0aW9uIChpZiBuZWNlc3NhcnkpXG5BSkFYLmRvY3VtZW50Um9vdCA9ICcvZGVtby8nO1xuXG5mdW5jdGlvbiByZWFkeShmbikge1xuICBpZiAoZG9jdW1lbnQucmVhZHlTdGF0ZSAhPSAnbG9hZGluZycpIHtcbiAgICBmbigpO1xuICB9IGVsc2Uge1xuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ0RPTUNvbnRlbnRMb2FkZWQnLCBmbik7XG4gIH1cbn1cblxucmVhZHkoZnVuY3Rpb24oKVxue1xuICAvLyBUaGlzIGluaXRpYWxpc2VzIGFueSBsaW5rcyB3aXRoIEFKQVggYXR0cmlidXRlc1xuICBBSkFYLmluaXRMaW5rcygpO1xuXG4gIEFKQVgucmVzb2x2ZVRpbWVvdXQgPSAxMDAwOyAvLyBSZW1vdmUgdGhpcyB3aGVuIG5vdCBcblxuICAvLyBUaGlzIGlzIGEgbWFudWFsIGluaXRpYWxpc2F0aW9uIG9mIGxpbmtzIGFuZCBpcywgaW5zdGVhZCwgYSBkZW1vbnN0cmF0aW9uXG4gIC8vIG9mIGhvdyBwcm9ncmFtYXRpYyBBSkFYIHJldHJpZXZhbCB3b3Jrcy5cbiAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCBmdW5jdGlvbihlKSB7XG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2xpbmtfMScpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oZSkge1xuICAgICAgQUpBWC5cbiAgICAgICAgYWpheEdldChcIi9kZW1vL3BhZ2UxLmh0bWxcIiwgXCIjbGluazEtdGFyZ2V0XCIsIFwiLmxpbmsxLXNlbGVjdGlvblwiLCBlLnRhcmdldCkuXG4gICAgICAgIHRoZW4oZnVuY3Rpb24ocmVzb2x2ZXIpIHtcbiAgICAgICAgICAvLyBjb25zb2xlLmxvZygnb25Mb2FkJywgcmVzb2x2ZXIpO1xuICAgICAgICAgIHJldHVybiByZXNvbHZlcjtcbiAgICAgICAgfSk7XG4gICAgfSk7XG4gIH0pO1xufSk7XG5cbndpbmRvdy5BSkFYT2JqID0gQUpBWDtcbiIsIlwidXNlIHN0cmljdFwiO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuXG52YXIgX3R5cGVvZiA9IHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiB0eXBlb2YgU3ltYm9sLml0ZXJhdG9yID09PSBcInN5bWJvbFwiID8gZnVuY3Rpb24gKG9iaikgeyByZXR1cm4gdHlwZW9mIG9iajsgfSA6IGZ1bmN0aW9uIChvYmopIHsgcmV0dXJuIG9iaiAmJiB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgb2JqLmNvbnN0cnVjdG9yID09PSBTeW1ib2wgJiYgb2JqICE9PSBTeW1ib2wucHJvdG90eXBlID8gXCJzeW1ib2xcIiA6IHR5cGVvZiBvYmo7IH07XG5cbnZhciB1dGlsaXRpZXMgPSB7fTtcblxuLyoqXG4gKiByYW5kb21CZXR3ZWVuXG4gKiBHZW5lcmF0ZSBhIHJhbmRvbSBpbnRlZ2VyIG51bWJlciBtYXggYW5kIG1pbi5cbiAqIEBtaW4ge251bWJlcn0gTWluaW11bSB2YWx1ZS5cbiAqIEBtYXgge251bWJlcn0gTWF4aW11bSB2YWx1ZS5cbiAqIHJldHVybiB7bnVtYmVyfSBSYW5kb20gaW50ZWdlci5cbiAqL1xudXRpbGl0aWVzLnJhbmRvbUJldHdlZW4gPSBmdW5jdGlvbiAobWluLCBtYXgpIHtcbiAgcmV0dXJuIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIChtYXggLSBtaW4gKyAxKSArIG1pbik7XG59O1xuXG4vKipcbiAqIGdldFN0eWxlXG4gKiBHZXQgdGhlIGN1cnJlbnQgc3R5bGUgdmFsdWUgZnJvbSBhbiBlbGVtZW50LlxuICogQGVsIHtET01Ob2RlfSBUYXJnZXQgZWxlbWVudC5cbiAqIEBwcm9wIHtzdHJpbmd9IENTUyBwcm9wZXJ0eSBuYW1lLlxuICogQHN0cmlwVW5pdCB7Ym9vbGVhbn0gUmVtb3ZlIHVuaXRzLlxuICogcmV0dXJuIHtzdHJpbmd9IEN1cnJlbnQgQ1NTIHZhbHVlIFdJVEggdW5pdC5cbiAqL1xudXRpbGl0aWVzLmdldFN0eWxlID0gZnVuY3Rpb24gKGVsLCBwcm9wLCBzdHJpcFVuaXQpIHtcbiAgdmFyIHN0clZhbHVlID0gXCJcIjtcblxuICBpZiAod2luZG93LmdldENvbXB1dGVkU3R5bGUpIHtcbiAgICBzdHJWYWx1ZSA9IGdldENvbXB1dGVkU3R5bGUoZWwpLmdldFByb3BlcnR5VmFsdWUocHJvcCk7XG4gIH1cbiAgLy9JRVxuICBlbHNlIGlmIChlbC5jdXJyZW50U3R5bGUpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIHN0clZhbHVlID0gZWwuY3VycmVudFN0eWxlW3Byb3BdO1xuICAgICAgfSBjYXRjaCAoZSkge31cbiAgICB9XG5cbiAgaWYgKHN0cmlwVW5pdCkge1xuICAgIHN0clZhbHVlID0gcGFyc2VJbnQoc3RyVmFsdWUpO1xuICB9XG5cbiAgcmV0dXJuIHN0clZhbHVlO1xufTtcblxuLyoqXG4gKiBMb2dcbiAqIFNpbXBsZSBsb2cgZnVuY3Rpb24gdG8gc2hvdyBkaWZmZXJlbnQgY29sb3JzIG9uIHRoZSBjb25zb2xlLlxuICogQHN0YXR1cyB7c3RyaW5nfSBTdGF0dXMgdHlwZS5cbiAqIEBtc2cge3N0cmluZ30gTWVzc2FnZSB0byBzaG93LlxuICovXG51dGlsaXRpZXMubG9nID0gZnVuY3Rpb24gKHN0YXR1cywgbXNnKSB7XG4gIHZhciBiZ2MsIGNvbG9yO1xuXG4gIHN3aXRjaCAoc3RhdHVzKSB7XG4gICAgY2FzZSBcInN1Y2Nlc3NcIjpcbiAgICAgIGNvbG9yID0gXCJHcmVlblwiO1xuICAgICAgYmdjID0gXCJMaW1lR3JlZW5cIjtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJpbmZvXCI6XG4gICAgICBjb2xvciA9IFwiRG9kZ2VyQmx1ZVwiO1xuICAgICAgYmdjID0gXCJUdXJxdW9pc2VcIjtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJlcnJvclwiOlxuICAgICAgY29sb3IgPSBcIkJsYWNrXCI7XG4gICAgICBiZ2MgPSBcIlJlZFwiO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcIndhcm5pbmdcIjpcbiAgICAgIGNvbG9yID0gXCJUb21hdG9cIjtcbiAgICAgIGJnYyA9IFwiR29sZFwiO1xuICAgICAgYnJlYWs7XG4gICAgZGVmYXVsdDpcbiAgICAgIGNvbG9yID0gXCJibGFja1wiO1xuICAgICAgYmdjID0gXCJXaGl0ZVwiO1xuICB9XG5cbiAgaWYgKCh0eXBlb2YgbXNnID09PSBcInVuZGVmaW5lZFwiID8gXCJ1bmRlZmluZWRcIiA6IF90eXBlb2YobXNnKSkgPT09IFwib2JqZWN0XCIpIHtcbiAgICBjb25zb2xlLmxvZyhtc2cpO1xuICB9IGVsc2Uge1xuICAgIGNvbnNvbGUubG9nKFwiJWNcIiArIG1zZywgXCJjb2xvcjpcIiArIGNvbG9yICsgXCI7Zm9udC13ZWlnaHQ6Ym9sZDsgYmFja2dyb3VuZC1jb2xvcjogXCIgKyBiZ2MgKyBcIjtcIik7XG4gIH1cbn07XG5cbi8qKlxuICogb25jZVxuICogRmlyZXMgYW4gZXZlbnQgb25seSBvbmNlIGFuZCBleGVjdXRlcyB0aGUgY2FsbGJhY2suXG4gKiBAbm9kZSB7RE9NRWxlbWVudH0gRG9tIGVsZW1lbnQgdG8gYXR0YWNoIGV2ZW50LlxuICogQHR5cGUge1N0cmluZ30gVHlwZSBvZiBldmVudC5cbiAqIEBjYWxsYmFjayB7ZnVuY3Rpb259IENhbGxiYWNrLlxuICovXG51dGlsaXRpZXMub25jZSA9IGZ1bmN0aW9uIChub2RlLCB0eXBlLCBjYWxsYmFjaykge1xuICBub2RlLmFkZEV2ZW50TGlzdGVuZXIodHlwZSwgZnVuY3Rpb24gKGUpIHtcbiAgICBlLnRhcmdldC5yZW1vdmVFdmVudExpc3RlbmVyKGUudHlwZSwgYXJndW1lbnRzLmNhbGxlZSk7XG4gICAgcmV0dXJuIGNhbGxiYWNrKGUpO1xuICB9KTtcbn07XG5cbi8qKlxuICogc2h1ZmZsZUFycmF5XG4gKiBTaHVmZmxlIGFuIGFycmF5LlxuICogQGFycmF5IEFycnJheSB0byBiZSBzaHVmZmxlZC5cbiAqIHJldHVybiB7YXJyYXl9IFNodWZmbGVkIGFycmF5LlxuICovXG51dGlsaXRpZXMuc2h1ZmZsZUFycmF5ID0gZnVuY3Rpb24gKGFycmF5KSB7XG4gIHZhciBjdXJyZW50SW5kZXggPSBhcnJheS5sZW5ndGgsXG4gICAgICB0ZW1wb3JhcnlWYWx1ZSxcbiAgICAgIHJhbmRvbUluZGV4O1xuXG4gIC8vIFdoaWxlIHRoZXJlIHJlbWFpbiBlbGVtZW50cyB0byBzaHVmZmxlLi4uXG4gIHdoaWxlICgwICE9PSBjdXJyZW50SW5kZXgpIHtcblxuICAgIC8vIFBpY2sgYSByZW1haW5pbmcgZWxlbWVudC4uLlxuICAgIHJhbmRvbUluZGV4ID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogY3VycmVudEluZGV4KTtcbiAgICBjdXJyZW50SW5kZXggLT0gMTtcblxuICAgIC8vIEFuZCBzd2FwIGl0IHdpdGggdGhlIGN1cnJlbnQgZWxlbWVudC5cbiAgICB0ZW1wb3JhcnlWYWx1ZSA9IGFycmF5W2N1cnJlbnRJbmRleF07XG4gICAgYXJyYXlbY3VycmVudEluZGV4XSA9IGFycmF5W3JhbmRvbUluZGV4XTtcbiAgICBhcnJheVtyYW5kb21JbmRleF0gPSB0ZW1wb3JhcnlWYWx1ZTtcbiAgfVxuXG4gIHJldHVybiBhcnJheTtcbn07XG5cbi8qKlxuICogZmlyZUN1c3RvbUV2ZW50XG4gKiBGaXJlIGEgY3VzdG9tIGV2ZW50LlxuICogQG5hbWUge3N0cmluZ30gTmFtZSBvZiB0aGUgZXZlbnQuXG4gKiBAZGF0YSB7b2JqZWN0fSBPYmplY3QgdG8gYmUgcGFzc2VkIHRvIHRoZSBldmVudC5cbiAqL1xudXRpbGl0aWVzLmZpcmVDdXN0b21FdmVudCA9IGZ1bmN0aW9uIChuYW1lLCBkYXRhLCBidWJibGVzLCBjYW5jZWxhYmxlKSB7XG4gIHZhciBldjtcbiAgdmFyIHBhcmFtcyA9IHtcbiAgICBidWJibGVzOiBidWJibGVzIHx8IHRydWUsXG4gICAgY2FuY2VsYWJsZTogY2FuY2VsYWJsZSB8fCB0cnVlLFxuICAgIGRldGFpbDogZGF0YSB8fCBudWxsXG4gIH07XG5cbiAgaWYgKHR5cGVvZiB3aW5kb3cuQ3VzdG9tRXZlbnQgPT09IFwiZnVuY3Rpb25cIikge1xuICAgIGV2ID0gbmV3IEN1c3RvbUV2ZW50KG5hbWUsIHBhcmFtcyk7XG4gIH0gZWxzZSB7XG4gICAgZXYgPSBkb2N1bWVudC5jcmVhdGVFdmVudCgnQ3VzdG9tRXZlbnQnKTtcbiAgICBldi5pbml0Q3VzdG9tRXZlbnQobmFtZSwgcGFyYW1zLmJ1YmJsZXMsIHBhcmFtcy5jYW5jZWxhYmxlLCBwYXJhbXMuZGV0YWlsKTtcbiAgfVxuXG4gIHdpbmRvdy5kaXNwYXRjaEV2ZW50KGV2KTtcbn07XG5cbi8qKlxuICogZm9yRWFjaE5vZGVcbiAqIExvb3AgdGhyb3VnaCBhbmQgYXJyYXkgb2YgRE9NIGVsZW1lbnRzLlxuICogQGFycmF5IHtET00gTm9kZSBMaXN0fSBMaXN0IG9mIGVsZW1lbnRzLlxuICogQGNhbGxiYWNrIHtmdW5jdGlvbn0gQ2FsbGJhY2suXG4gKiBAc2NvcGUgKm9wdGlvbmFsIHtmdW5jdGlvbn0gU2NvcGUgdG8gcGFzcyB0byBjYWxsYmFjay5cbiAqL1xudXRpbGl0aWVzLmZvckVhY2hOb2RlID0gZnVuY3Rpb24gKGFycmF5LCBjYWxsYmFjaywgc2NvcGUpIHtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcnJheS5sZW5ndGg7IGkrKykge1xuICAgIGNhbGxiYWNrLmNhbGwoc2NvcGUsIGksIGFycmF5W2ldKTsgLy8gcGFzc2VzIGJhY2sgc3R1ZmYgd2UgbmVlZFxuICB9XG59O1xuXG4vKipcbiAqIGdldEVsZW1lbnRQb3NpdGlvblxuICogR2V0IHRoZSBwb3NpdGlvbiBvZiB0aGUgZWxlbWVudCByZWxhdGl2ZSB0byBkb2N1bWVudC5cbiAqIEBlbGVtZW50IHtET00gTm9kZX0gRWxlbWVudC5cbiAqIHJldHVybnMgT2JqZWN0IHdpdGggZWxlbWVudCBjb29yZGluYXRlcy5cbiAqL1xudXRpbGl0aWVzLmdldEVsZW1lbnRQb3NpdGlvbiA9IGZ1bmN0aW9uIChlbGVtZW50KSB7XG4gIHZhciBwb3NpdGlvblRvVmlld3BvcnQgPSBlbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuXG4gIHZhciBzY3JvbGxUb3AgPSB3aW5kb3cucGFnZVlPZmZzZXQ7XG4gIHZhciBzY3JvbGxMZWZ0ID0gd2luZG93LnBhZ2VYT2Zmc2V0O1xuXG4gIHZhciBjbGllbnRUb3AgPSBkb2N1bWVudC5ib2R5LmNsaWVudFRvcCB8fCAwO1xuICB2YXIgY2xpZW50TGVmdCA9IGRvY3VtZW50LmJvZHkuY2xpZW50TGVmdCB8fCAwO1xuXG4gIHZhciB0b3AgPSBwb3NpdGlvblRvVmlld3BvcnQudG9wICsgc2Nyb2xsVG9wIC0gY2xpZW50VG9wO1xuICB2YXIgbGVmdCA9IHBvc2l0aW9uVG9WaWV3cG9ydC5sZWZ0ICsgc2Nyb2xsTGVmdCAtIGNsaWVudExlZnQ7XG5cbiAgcmV0dXJuIHtcbiAgICB0b3A6IE1hdGgucm91bmQodG9wKSxcbiAgICBsZWZ0OiBNYXRoLnJvdW5kKGxlZnQpXG4gIH07XG59O1xuXG4vKipcbiAqIGdldFZpZXdwb3J0RGltZW5zaW9uc1xuICogR2V0IHRoZSBicm93c2VyIHdpbmRvdyBzaXplLlxuICogcmV0dW5zIE9iamVjdCB3aXRoIGRpbWVuc2lvbnMuXG4gKi9cbnV0aWxpdGllcy5nZXRWaWV3cG9ydERpbWVuc2lvbnMgPSBmdW5jdGlvbiAoKSB7XG4gIHJldHVybiB7XG4gICAgd2lkdGg6IE1hdGgubWF4KGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGllbnRXaWR0aCwgd2luZG93LmlubmVyV2lkdGggfHwgMCksXG4gICAgaGVpZ2h0OiBNYXRoLm1heChkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xpZW50SGVpZ2h0LCB3aW5kb3cuaW5uZXJIZWlnaHQgfHwgMClcbiAgfTtcbn07XG5cbi8qKlxuICogY2xhc3NFeHRlbmRcbiAqIEV4dGVuZHMgYSBwYXJlbnQgY2xhc3MuXG4gKiBAY2hpbGQge2Z1bmN0aW9ufSBDaGlsZCBjbGFzcy5cbiAqIEBwYXJlbnQge2Z1bmN0aW9ufSBQYXJlbnQgY2xhc3MuXG4gKiByZXR1cm5zIHVwZGF0ZWQgQ2hpbGQgY2xhc3M7XG4gKi9cbnV0aWxpdGllcy5jbGFzc0V4dGVuZCA9IGZ1bmN0aW9uIChjaGlsZCwgcGFyZW50KSB7XG4gIHZhciBoYXNQcm9wID0ge30uaGFzT3duUHJvcGVydHk7XG5cbiAgZm9yICh2YXIga2V5IGluIHBhcmVudCkge1xuICAgIGlmIChoYXNQcm9wLmNhbGwocGFyZW50LCBrZXkpKSBjaGlsZFtrZXldID0gcGFyZW50W2tleV07XG4gIH1cblxuICBmdW5jdGlvbiBjdG9yKCkge1xuICAgIHRoaXMuY29uc3RydWN0b3IgPSBjaGlsZDtcbiAgfVxuXG4gIGN0b3IucHJvdG90eXBlID0gcGFyZW50LnByb3RvdHlwZTtcbiAgY2hpbGQucHJvdG90eXBlID0gbmV3IGN0b3IoKTtcbiAgY2hpbGQuX19zdXBlcl9fID0gcGFyZW50LnByb3RvdHlwZTtcblxuICByZXR1cm4gY2hpbGQ7XG59O1xuXG4vKipcbiAqIEhhc0NsYXNzXG4gKiBDaGVja3MgZm9yIGNsYXNzIG9uIGVsZW1lbnQuXG4gKiBAY2wge3N0cmluZ30gTmFtZXMuIFlvdSBjYW4gc3BsaXQgdGhlIG5hbWVzIHdpdGggYSBzcGFjZVxuICogQGUge0RPTSBFbGVtZW50fSBFbGVtZW50XG4gKi9cbnV0aWxpdGllcy5oYXNDbGFzcyA9IGZ1bmN0aW9uIChjbCwgZSkge1xuXG4gIHZhciBjLCBjbGFzc2VzLCBpLCBqLCBsZW4sIGxlbjE7XG4gIGNsYXNzZXMgPSBjbC5zcGxpdCgnICcpO1xuXG4gIGlmIChlLmNsYXNzTGlzdCkge1xuICAgIGZvciAoaSA9IDAsIGxlbiA9IGNsYXNzZXMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgIGMgPSBjbGFzc2VzW2ldO1xuICAgICAgaWYgKGUuY2xhc3NMaXN0LmNvbnRhaW5zKGMpID09PSB0cnVlKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBmb3IgKGogPSAwLCBsZW4xID0gY2xhc3Nlcy5sZW5ndGg7IGogPCBsZW4xOyBqKyspIHtcbiAgICAgIGMgPSBjbGFzc2VzW2pdO1xuICAgICAgaWYgKG5ldyBSZWdFeHAoJyhefCApJyArIGMgKyAnKCB8JCknLCAnZ2knKS50ZXN0KGUuYykpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGZhbHNlO1xufTtcblxuLyoqXG4gKiBSZW1vdmVDbGFzc1xuICogUmVtb3ZlIGNsYXNzIGZyb20gZWxlbWVudC5cbiAqIEBjIHtzdHJpbmd9IG5hbWUgb2YgdGhlIGNsYXNzXG4gKiBAZSB7RE9NIEVsZW1lbnR9IEVsZW1lbnRcbiAqL1xudXRpbGl0aWVzLnJlbW92ZUNsYXNzID0gZnVuY3Rpb24gKGMsIGUpIHtcblxuICB2YXIgY2xhc3NlcywgaSwgaiwgbGVuLCBsZW4xO1xuICBjbGFzc2VzID0gYy5zcGxpdCgnICcpO1xuICBpZiAoZS5jbGFzc0xpc3QpIHtcbiAgICBmb3IgKGkgPSAwLCBsZW4gPSBjbGFzc2VzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICBjID0gY2xhc3Nlc1tpXTtcbiAgICAgIGUuY2xhc3NMaXN0LnJlbW92ZShjKTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgZm9yIChqID0gMCwgbGVuMSA9IGNsYXNzZXMubGVuZ3RoOyBqIDwgbGVuMTsgaisrKSB7XG4gICAgICBjID0gY2xhc3Nlc1tqXTtcbiAgICAgIGUuY2xhc3NOYW1lID0gZS5jbGFzc05hbWUucmVwbGFjZShuZXcgUmVnRXhwKCcoXnxcXFxcYiknICsgYy5zcGxpdCgnICcpLmpvaW4oJ3wnKSArICcoXFxcXGJ8JCknLCAnZ2knKSwgJyAnKTtcbiAgICB9XG4gIH1cbn07XG5cbi8qKlxuICogQWRkQ2xhc3NcbiAqIEFkZCBjbGFzcyB0byBlbGVtZW50LlxuICogQGMge3N0cmluZ30gTmFtZSBvZiB0aGUgY2xhc3NcbiAqIEBlIHtET00gRWxlbWVudH0gRWxlbWVudFxuICovXG51dGlsaXRpZXMuYWRkQ2xhc3MgPSBmdW5jdGlvbiAoYywgZSkge1xuXG4gIHZhciBjbGFzc2VzLCBpLCBqLCBsZW4sIGxlbjE7XG4gIGNsYXNzZXMgPSBjLnNwbGl0KCcgJyk7XG5cbiAgaWYgKGUuY2xhc3NMaXN0KSB7XG4gICAgZm9yIChpID0gMCwgbGVuID0gY2xhc3Nlcy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgYyA9IGNsYXNzZXNbaV07XG4gICAgICBlLmNsYXNzTGlzdC5hZGQoYyk7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIGZvciAoaiA9IDAsIGxlbjEgPSBjbGFzc2VzLmxlbmd0aDsgaiA8IGxlbjE7IGorKykge1xuICAgICAgYyA9IGNsYXNzZXNbal07XG4gICAgICBlLmNsYXNzTmFtZSArPSAnICcgKyBjO1xuICAgIH1cbiAgfVxufTtcblxuLyoqXG4gKiBHZXRTaWJsaW5nc1xuICogR2V0IHNpYmxpbmdzIGZyb20gZWxlbWVudFxuICogQGUge0RPTSBFbGVtZW50fSBFbGVtZW50XG4gKiBAcmV0dXJuIEFycmF5IG9mIERPTSBFbGVtZW50c1xuICovXG51dGlsaXRpZXMuZ2V0U2libGluZ3MgPSBmdW5jdGlvbiAoZSkge1xuXG4gIHJldHVybiBBcnJheS5wcm90b3R5cGUuZmlsdGVyLmNhbGwoZS5wYXJlbnROb2RlLmNoaWxkcmVuLCBmdW5jdGlvbiAoY2hpbGQpIHtcbiAgICByZXR1cm4gY2hpbGQgIT09IGU7XG4gIH0pO1xufTtcblxuLyoqXG4gKiBGdW5jdGlvbiB0byBub3JtYWxpemUgdGhlIHNlbGN0b3IgJ21hdGNoZXNTZWxlY3RvcicgYWNyb3NzIGJyb3dzZXJzXG4gKi9cbnV0aWxpdGllcy5tYXRjaGVzID0gZnVuY3Rpb24gKCkge1xuXG4gIHZhciBkb2MsIG1hdGNoZXM7XG4gIGRvYyA9IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudDtcbiAgbWF0Y2hlcyA9IGRvYy5tYXRjaGVzU2VsZWN0b3IgfHwgZG9jLndlYmtpdE1hdGNoZXNTZWxlY3RvciB8fCBkb2MubW96TWF0Y2hlc1NlbGVjdG9yIHx8IGRvYy5vTWF0Y2hlc1NlbGVjdG9yIHx8IGRvYy5tc01hdGNoZXNTZWxlY3RvcjtcblxuICByZXR1cm4gbWF0Y2hlcztcbn07XG5cbi8qKlxuICogRXh0ZW5kXG4gKiBTaW1pbGFyIHRvIGpxdWVyeS5leHRlbmQsIGl0IGFwcGVuZHMgdGhlIHByb3BlcnRpZXMgZnJvbSAnb3B0aW9ucycgdG8gZGVmYXVsdCBhbmQgb3ZlcndyaXRlIHRoZSBvbmVzIHRoYXQgYWxyZWFkeSBleGlzdCBpbiAnZGVmYXVsdHMnXG4gKiBAZGVmYXVsdHMge09iamVjdH0gRGVmYXVsdCB2YWx1ZXNcbiAqIEBvcHRpb25zIHtPYmplY3R9IE5ldyB2YWx1ZXNcbiAqL1xudXRpbGl0aWVzLmV4dGVuZCA9IGZ1bmN0aW9uIChkZWZhdWx0cywgb3B0aW9ucykge1xuXG4gIHZhciBleHRlbmRlZCA9IHt9LFxuICAgICAga2V5ID0gbnVsbDtcblxuICBmb3IgKGtleSBpbiBkZWZhdWx0cykge1xuICAgIGlmIChkZWZhdWx0cy5oYXNPd25Qcm9wZXJ0eShrZXkpKSBleHRlbmRlZFtrZXldID0gZGVmYXVsdHNba2V5XTtcbiAgfVxuXG4gIGZvciAoa2V5IGluIG9wdGlvbnMpIHtcbiAgICBpZiAob3B0aW9ucy5oYXNPd25Qcm9wZXJ0eShrZXkpKSBleHRlbmRlZFtrZXldID0gb3B0aW9uc1trZXldO1xuICB9XG5cbiAgcmV0dXJuIGV4dGVuZGVkO1xufTtcblxuZXhwb3J0cy5kZWZhdWx0ID0gdXRpbGl0aWVzOyIsIlxuLyoqXG4gKiBUaGlzIG1vZHVsZSBQcm92aWRlcyBhbmltYXRpb24gZGV0ZWN0aW9uIGFuZCBwc2V1ZG8tbGlzdGVuZXIgZnVuY3Rpb25hbGl0eVxuICpcbiAqIEBtb2R1bGUgd3RjLUFuaW1hdGlvbkV2ZW50c1xuICogQGV4cG9ydHMgQW5pbWF0aW9uXG4gKi9cblxuXG4vKipcbiAqIFRoaXMgZnVuY3Rpb24gdGFrZXMgYSBub2RlIGFuZCBkZXRlcm1pbmVzIHRoZSBmdWxsIGVuZCB0aW1lIG9mIGFueSB0cmFuc2l0aW9uc1xuICogb24gaXQuIFJldHVybnMgdGhlIHRpbWUgaW4gbWlsbGlzZWNvbmRzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0gICB7SFRNTEVsZW1lbnR9IG5vZGUgIFRoZSBub2RlIG8gZGV0ZXh0IHRoZSB0cmFuc2l0aW9uIHRpbWUgZm9yLlxuICogQHJldHVybiAge051bWJlcn0gICAgICAgICAgICBUaGUgZnVsbCB0cmFuc2l0aW9uIHRpbWUgZm9yIHRoZSBub2RlLCBpbmNsdWRpbmcgZGVsYXlzLCBpbiBtaWxsaXNlY29uZHNcbiAqL1xudmFyIGRldGVjdEFuaW1hdGlvbkVuZFRpbWUgPSBmdW5jdGlvbihub2RlKVxue1xuICB2YXIgZnVsbHRpbWUgPSAwO1xuICB2YXIgdGltZVJlZ2V4ID0gLyhcXGQrXFwuPyhcXGQrKT8pKHN8bXMpLztcbiAgdmFyIHJlY3Vyc2l2ZUxvb3AgPSBmdW5jdGlvbihlbCkge1xuICAgIGlmKGVsIGluc3RhbmNlb2YgRWxlbWVudCkge1xuICAgICAgdmFyIHRpbWVicmVha2Rvd24gPSB0aW1lUmVnZXguZXhlYyh3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShlbCkudHJhbnNpdGlvbkR1cmF0aW9uKVxuICAgICAgdmFyIGRlbGF5YnJlYWtkb3duID0gdGltZVJlZ2V4LmV4ZWMod2luZG93LmdldENvbXB1dGVkU3R5bGUoZWwpLnRyYW5zaXRpb25EZWxheSlcbiAgICAgIHZhciB0aW1lID0gdGltZWJyZWFrZG93blsxXSAqICh0aW1lYnJlYWtkb3duWzNdID09ICdzJyA/IDEwMDAgOiAxKVxuICAgICAgdmFyIGRlbGF5ID0gZGVsYXlicmVha2Rvd25bMV0gKiAoZGVsYXlicmVha2Rvd25bM10gPT0gJ3MnID8gMTAwMCA6IDEpXG4gICAgICBpZih0aW1lICsgZGVsYXkgPiBmdWxsdGltZSkge1xuICAgICAgICBmdWxsdGltZSA9IHRpbWUgKyBkZWxheVxuICAgICAgfVxuICAgIH1cbiAgICBpZihlbC5jaGlsZE5vZGVzKSB7XG4gICAgICBmb3IodmFyIGkgaW4gZWwuY2hpbGROb2Rlcykge1xuICAgICAgICByZWN1cnNpdmVMb29wKGVsLmNoaWxkTm9kZXNbaV0pO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJlY3Vyc2l2ZUxvb3Aobm9kZSk7XG5cbiAgaWYodHlwZW9mIGZ1bGx0aW1lICE9PSAnbnVtYmVyJykge1xuICAgIGZ1bGx0aW1lID0gMDtcbiAgfVxuXG4gIHJldHVybiBmdWxsdGltZTtcbn1cblxuLyoqXG4gKiBUaGUgcmVzb2x2aW5nIG9iamVjdCBmb3IgdGhlIHtAbGluayB3dGMtQW5pbWF0aW9uRXZlbnRzLmFkZEVuZEV2ZW50TGlzdGVuZXJ9XG4gKlxuICogQGNhbGxiYWNrIHRpbWVyUmVzb2x2ZVxuICogQHBhcmFtIHtzdHJpbmd9IHJlc3BvbnNlICAgICAgICAgICBUaGUgcmVzcG9uc2UgZnJvbSB0aGUgQUpBWCBjYWxsXG4gKiBAcGFyYW0ge2FycmF5fSBhcmd1bWVudHMgICAgICAgICAgIFRoZSBhcmd1bWVudHMgYXJyYXkgb3JpZ2luYWxseSBwYXNzZWQgdG8gdGhlIHtAbGluayBBSkFYLmFqYXhHZXR9IG1ldGhvZFxuICogQHBhcmFtIHtET01FbGVtZW50fSBsaW5rVGFyZ2V0ICAgICBUaGUgdGFyZ2V0IGVsZW1lbnQgdGhhdCBmaXJlZCB0aGUge0BsaW5rIEFKQVguYWpheEdldH0gXG4gKi9cblxuLyoqXG4gKiBBbGxvd3MgdXMgdG8gYWRkIGFuIGVuZCBldmVudCBsaXN0ZW5lciB0byB0aGUgbm9kZS5cbiAqXG4gKiBAcGFyYW0gIHtIVE1MRWxlbWVudH0gIG5vZGUgICAgICBUaGUgZWxlbWVudCB0byBhdHRhY2ggdGhlIGVuZCBldmVudCBsaXN0ZW5lciB0b1xuICogQHBhcmFtICB7ZnVuY3Rpb259ICAgICBsaXN0ZW5lciAgVGhlIGZ1bmN0aW9uIHRvIHJ1biB3aGVuIHRoZSBhbmltYXRpb24gaXMgZmluaXNoZWQuIFRoaXMgYWxsb3dzIHVzIHRvIGNvbnN0cnVjdCBhbiBvYmplY3QgdG8gcGFzcyBiYWNrIHRocm91Z2ggdGhlIHByb21pc2UgY2hhaW4gb2YgdGhlIHBhcmVudC5cbiAqIEByZXR1cm4ge1Byb21pc2V9ICAgICAgICAgICAgICAgIEEgcHJvbWlzZSB0aGF0IHJlcHJlc2VudHMgdGhlIGFuaW1hdGlvbiB0aW1lb3V0LlxuICogQHJldHVybiB7dGltZXJSZXNvbHZlfSAgICAgICAgICAgVGhlIHJlc29sdmUgbWV0aG9kLiBQYXNzZXMgdGhlIGNvZXJjZWQgdmFyaWFibGVzIChpZiBhbnkpIGZyb20gdGhlIGxpc3RlbmluZyBvYmplY3QgYmFjayB0byB0aGUgY2hhaW4uXG4gKiBAcmV0dXJuIHt0aW1lclJlamVjdH0gICAgICAgICAgICBUaGUgcmVqZWN0IG1ldGhvZC4gTnVsbC5cbiAqL1xudmFyIGFkZEVuZEV2ZW50TGlzdGVuZXIgPSBmdW5jdGlvbihub2RlLCBsaXN0ZW5lcikge1xuICBjb25zb2xlLmxvZygnLS0tLSBhZGRFbmRFdmVudExpc3RlbmVyIC0tLS0nKTtcbiAgY29uc29sZS5sb2cobm9kZSwgbGlzdGVuZXIsIHR5cGVvZiBsaXN0ZW5lcilcbiAgY29uc29sZS5sb2coJyAgICcpO1xuICBpZih0eXBlb2YgbGlzdGVuZXIgIT09ICdmdW5jdGlvbicpXG4gIHtcbiAgICB2YXIgbGlzdGVuZXIgPSBmdW5jdGlvbigpeyByZXR1cm4ge30gfTtcbiAgfVxuICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgdmFyIHRpbWUgPSBkZXRlY3RBbmltYXRpb25FbmRUaW1lKG5vZGUpO1xuICAgIHZhciB0aW1lb3V0ID0gc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgIHZhciByZXR1cm5lciA9IGxpc3RlbmVyKCk7XG4gICAgICByZXR1cm5lci50aW1lID0gdGltZTtcbiAgICAgIHJlc29sdmUocmV0dXJuZXIpO1xuICAgIH0sIHRpbWUpO1xuICB9KTtcbn1cblxuLyoqXG4gKiBUaGUgYW5pbWF0aW9uIG9iamVjdCBlbmNhcHN1bGF0ZXMgYWxsIG9mIHRoZSBiYXNpYyBmdW5jdGlvbmFsaXR5IHRoYXQgYWxsb3dzIHVzXG4gKiB0byBkZXRlY3QgYW5pbWF0aW9uIGV0Yy5cbiAqXG4gKiBAZXhwb3J0XG4gKi9cbnZhciBBbmltYXRpb24gPSB7XG4gIGFkZEVuZEV2ZW50TGlzdGVuZXI6IGFkZEVuZEV2ZW50TGlzdGVuZXJcbn07XG5cblxuZXhwb3J0IGRlZmF1bHQgQW5pbWF0aW9uO1xuIiwiaW1wb3J0IEhpc3RvcnkgZnJvbSBcIi4vd3RjLWhpc3RvcnlcIjtcbmltcG9ydCBBbmltYXRpb24gZnJvbSBcIi4vd3RjLUFuaW1hdGlvbkV2ZW50c1wiO1xuaW1wb3J0IF91IGZyb20gJ3d0Yy11dGlsaXR5LWhlbHBlcnMnO1xuXG5jb25zdCBTVEFURVMgPSB7XG4gICdPSycgICAgICAgICAgICAgICAgOiAwLFxuICAnQ0xJQ0tFRCcgICAgICAgICAgIDogMSxcbiAgJ0xPQURJTkcnICAgICAgICAgICA6IDIsXG4gICdUUkFOU0lUSU9OSU5HJyAgICAgOiA0LFxuICAnTE9BREVEJyAgICAgICAgICAgIDogOFxufVxuXG5jb25zdCBTRUxFQ1RPUlMgPSB7XG4gICdDSElMRFJFTicgICAgICAgICAgOiAwIC8vIFRoaXMgaW5kaWNhdGVzIHRoYXQgdGhlIHNlbGVjdGlvbiBzaG91bGQgYmUgYWxsIGNoaWxkcmVuLiBUaGlzIGFzc3VtZXMgdGhhdCB3ZSBoYXZlIGEgdmFsaWQgdGFyZ2V0IHRvIHdvcmsgd2l0aC5cbn1cblxuY29uc3QgRVJST1JTID0ge1xuICAnR0VORVJJQ19FUlJPUicgICAgIDogMCxcbiAgJ0JBRF9QUk9NSVNFJyAgICAgICA6IDEsXG4gICdMT0FEX0VSUk9SJyAgICAgICAgOiAyXG59XG5cbi8qKlxuICogQW4gQUpBWCBjbGFzcyB0aGF0IHBpY2tzIHVwIG9uIGxpbmtzIGFuZCB0dXJucyB0aGVtIGludG8gQUpBWCBsaW5rcy5cbiAqXG4gKiBUaGlzIGNsYXNzIGFzc3VtZXMgdGhhdCB5b3Ugd2FudCB0byBydW4geW91ciBBSkFYIHZpYSBodG1sIGF0dHJpYnV0ZXMgb24geW91ciBsaW5rc1xuICogYW5kIHRoYXQgeW91ciB3ZWJzaXRlIGNhbiBydW4ganVzdCBhcyB3ZWxsIHdpdGhvdXQgdGhlc2UgbGlua3MuIEl0IHNob3VsZCBhbHNvXG4gKiBwcm92aWRlIGFkZGl0aW9uYWwgZnVuY3Rpb25hbGl0eSB0aGF0IGFsbG93cyB0aGUgY2xhc3MgdG8gcnVuIHByb2dyYW1hdGljYWxseSxcbiAqIHRoZXJlYnkgZ2l2aW5nIHRoZSBwcm9ncmFtbWVyIHRoZSBhYmlsaXR5IGFuZCBvcHRpb25zIHRvIGNyZWF0ZSB0aGUgd2Vic290ZVxuICogaG93ZXZlciB0aGV5IHdhbnQgdG8uXG4gKlxuICogQHN0YXRpY1xuICogQG5hbWVzcGFjZVxuICogQGV4dGVuZHMgSGlzdG9yeVxuICogQGF1dGhvciBMaWFtIEVnYW4gPGxpYW1Ad2V0aGVjb2xsZWN0aXZlLmNvbT5cbiAqIEB2ZXJzaW9uIDAuNVxuICogQGNyZWF0ZWQgTm92IDE5LCAyMDE2XG4gKi9cbmNsYXNzIEFKQVggZXh0ZW5kcyBIaXN0b3J5IHtcblxuICAvKipcbiAgICogUHVibGljIG1ldGhvZHNcbiAgICovXG5cbiAgLyoqXG4gICAqIEluaXRpYWxpc2UgdGhlIGxpbmtzIGluIHRoZSBkb2N1bWVudC5cbiAgICpcbiAgICogVGhpcyB3aWxsIGxvb2sgdGhyb3VnaCB0aGUgbGlua3MgaW4gdGhlIGRvY3VtZW50IGFzIGRlbm90ZWQgYnkgdGhlIGF0dHJpYnV0ZUFqYXhcbiAgICogcHJvcGVydHkgYW5kIGFwcGx5IGEgY2xpY2sgbGlzdGVuZXIgdG8gaXQgdGhhdCB3aWxsIGF0dGVtcHQgdG8gZGV0ZXJtaW5lIHdoYXRcbiAgICogYW5kIGhvdyB0byBsb2FkLlxuICAgKlxuICAgKiBBIHNpbXBsZSBtZWNoYW5zaW0gZm9yIHRoaXMgd291bGQgYmUgc29tZXRoaW5nIGxpa2U6XG4gICAqIGBgYFxuICAgICA8YSBocmVmPVwicGFnZTEuaHRtbFwiXG4gICAgICAgIGRhdGEtd3RjLWFqYXg9XCJ0cnVlXCJcbiAgICAgICAgZGF0YS13dGMtYWpheC10YXJnZXQ9JyNsaW5rMi10YXJnZXQnXG4gICAgICAgIGRhdGEtd3RjLWFqYXgtc2VsZWN0aW9uPVwiLmxpbmsxLXNlbGVjdGlvblwiXG4gICAgICAgIGRhdGEtd3RjLWFqYXgtc2hvdWxkLW5hdmlnYXRlPVwiZmFsc2VcIj5MaW5rIDE8L2E+XG4gICAqIGBgYFxuICAgKlxuICAgKiBUaGUgYWR0cmlidXRlcyBlcXVhdGUgYXMgZm9sbG93czpcbiAgICogLSAoKmF0dHJpYnV0ZUFqYXgqKSAqKmRhdGEtd3RjLWFqYXgqKlxuICAgKlxuICAgKiAgICBEZW5vdGVzIHRoYXQgdGhpcyBsaW5rIGlzIGFuIEFKQVggbGluay5cbiAgICogLSAoKmF0dHJpYnV0ZVRhcmdldCopICoqZGF0YS13dGMtYWpheC10YXJnZXQqKlxuICAgKlxuICAgKiAgICBEZW5vdGVzIHRoZSB0YXJnZXQgaW50byB3aGljaCB0byBsb2FkIHRoZSByZXN1bHQuIFNob3VsZCB0YWtlIHRoZSBmb3JtIG9mIGEgc2VsZWN0b3IuXG4gICAqIC0gKCphdHRyaWJ1dGVTZWxlY3Rpb24qKSAqKmRhdGEtd3RjLWFqYXgtc2VsZWN0aW9uKipcbiAgICpcbiAgICogICAgRGVub3RlcyB0aGUgc2VsZWN0aW9uIG9mIGRhdGEgdG8gcHVsbCBmcm9tIHRoZSBsb2FkZWQgZG9jdW1lbnQuIFNob3VsZCB0YWtlIHRoZSBmb3JtIG9mIGEgc2VsZWN0b3IuXG4gICAqIC0gKCphdHRyaWJ1dGVTaG91bGROYXZpZ2F0ZSopICoqZGF0YS13dGMtYWpheC1zaG91bGQtbmF2aWdhdGUqKlxuICAgKlxuICAgKiAgICAqKlRydWUqKiAvIEZhbHNlIGFzIHRvIHdoZXRoZXIgdGhlIGxpbmsgc2hvdWxkIHVwZGF0ZSB0aGUgaGlzdG9yeSBvYmplY3QuIE9ubHkgbmVjZXNzYXJ5IGlmIGZhbHNlLlxuICAgKlxuICAgKiBJbiBhZGRpdGlvbiwgKmF0dHJpYnV0ZVRhcmdldCogYW5kICphdHRyaWJ1dGVTZWxlY3Rpb24qIGFjY2VwdCBiYXNpYyBKU09OIHN5bnRheFxuICAgKiBzbyB0aGF0IHlvdSBjYW4gbG9hZCBtb2x0aXBsZSBwaWVjZXMgb2YgY29udGVudCBmcm9tIHRoZSBzb3VyY2UuXG4gICAqXG4gICAqIEBzdGF0aWNcbiAgICogQHBhcmFtICB7RE9NRWxlbWVudH0gcm9vdERvY3VtZW50ICBUaGUgRE9NIGVsZW1lbnQgdG8gZmluZCBsaW5rcyBpbi4gRGVmYXVsdHMgdG8gYm9keS5cbiAgICovXG4gIHN0YXRpYyBpbml0TGlua3Mocm9vdERvY3VtZW50ID0gZG9jdW1lbnQuYm9keSkge1xuICAgIGNvbnN0IGxpbmtzID0gcm9vdERvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoYFske3RoaXMuYXR0cmlidXRlQWpheH09XCJ0cnVlXCJdYCk7XG5cbiAgICBsaW5rcy5mb3JFYWNoKChsaW5rKT0+IHtcbiAgICAgIC8vIFJlbW92aW5nIHRoaXMgYXR0cmlidXRlIGVuc3VyZXMgdGhhdCB0aGlzIGxpbmsgZG9lc24ndCBnZXQgYSBzZWNvbmQgQUpBWCBsaXN0ZW5lciBhdHRhY2hlZCB0byBpdC5cbiAgICAgIGxpbmsucmVtb3ZlQXR0cmlidXRlKHRoaXMuYXR0cmlidXRlQWpheCk7XG5cbiAgICAgIGxpbmsuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZSk9PiB7XG4gICAgICAgIHRoaXMuX3RyaWdnZXJBamF4TGluayhlKTtcblxuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICB9KTtcbiAgICAgIGNvbnNvbGUubG9nKGxpbmspO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoZSByZXNvbHZpbmcgb2JqZWN0LiBUaGlzIGlzIHRoZSBvYmplY3QgdGhhdCBpcyBwYXNzZWQgdG8gQUpBWCBHRVQgcHJvbWlzZSB0aGVuc1xuICAgKiBhbmQgc2hvdWxkIGJlIHBhc3NlZCBvbnRvIHN1YnNlcXVlbnQgVEhFTmFibGUgY2FsbHMuXG4gICAqXG4gICAqIEBjYWxsYmFjayBBSkFYR2V0UmVzb2x2ZXJcbiAgICogQHBhcmFtIHtzdHJpbmd9IHJlc3BvbnNlICAgICAgICAgICBUaGUgcmVzcG9uc2UgZnJvbSB0aGUgQUpBWCBjYWxsXG4gICAqIEBwYXJhbSB7YXJyYXl9IGFyZ3VtZW50cyAgICAgICAgICAgVGhlIGFyZ3VtZW50cyBhcnJheSBvcmlnaW5hbGx5IHBhc3NlZCB0byB0aGUge0BsaW5rIEFKQVguYWpheEdldH0gbWV0aG9kXG4gICAqIEBwYXJhbSB7RE9NRWxlbWVudH0gbGlua1RhcmdldCAgICAgVGhlIHRhcmdldCBlbGVtZW50IHRoYXQgZmlyZWQgdGhlIHtAbGluayBBSkFYLmFqYXhHZXR9IFxuICAgKi9cbiAgLyoqXG4gICAqIENhbGxiYWNrIGZvciBBSkFYIEdFVCBvbmxvYWQuIFRoaXMgaXMgY2FsbGVkIHdoZW4gdGhlIGNvbnRlbnQgaXMgbG9hZGVkLlxuICAgKlxuICAgKiBAY2FsbGJhY2sgbG9hZFJlc29sdmVcbiAgICogQHBhcmFtIHtBSkFYR2V0UmVzb2x2ZXJ9IHJlc29sdmVyICBUaGUgcmVzb2x2aW5nIG9iamVjdCBmb3IgdGhlIEFKQVggcmVxdWVzdFxuICAgKiBAcmV0dXJuIHtBSkFYR2V0UmVzb2x2ZXJ9ICAgICAgICAgIFRoZSBvbmdvaW5nIHJlc29sdmluZyBvYmplY3QgZm9yIHRoZSBBSkFYIHJlcXVlc3RcbiAgICovXG4gIC8qKlxuICAgKiBDYWxsYmFjayBmb3IgQUpBWCBHRVQgZXJyb3IuIFRoaXMgaXMgY2FsbGVkIHdoZW4gYW4gZXJyb3Igb2NjdXJzIGFmdGVyXG4gICAqIGNhbGxpbmcgYW4gYWpheCBHRVQuXG4gICAqXG4gICAqIEBjYWxsYmFjayBsb2FkUmVqZWN0XG4gICAqIEBwYXJhbSB7b2JqZWN0fSBlcnJvciAgICAgICAgICAgICAgVGhlIGVycm9yIHRoYXQgb2NjdXJyZWRcbiAgICogQHBhcmFtIHthcnJheX0gYXJncyAgICAgICAgICAgICAgICBUaGUgYXJndW1lbnRzIHRoYXQgd2VyZSBwYXNzZWQgdG8gdGhlIHJlcXVlc3RcbiAgICogQHBhcmFtIHtET01FbGVtZW50fSBbdGFyZ2V0TGlua10gICBUaGUgbGluayB0aGF0IHNwYXduZWQgdGhlIGFqYXggcmVxdWVzdFxuICAgKi9cblxuICAvKipcbiAgICogVGhpcyBidWlsZHMgb3V0IGFuIEFKQVggcmVxdWVzdCwgbm9ybWFsbHkgYmFzZWQgb24gdGhlIGNsaWNraW5nIG9mIGEgbGluayxcbiAgICogYnV0IGl0IGNhbiBhbHRlcm5hdGl2ZWx5IGJlIGNhbGxlZCBkaXJlY3RseSBvbiB0aGUgQUpBWCBvYmplY3QuXG4gICAqXG4gICAqIEBzdGF0aWNcbiAgICogQHBhcmFtICB7c3RyaW5nfSBVUkwgICAgICAgICAgICAgICAgICAgICBUaGUgVVJMIHRvIGdldC4gVGhpcyB3aWxsIGJlIHBhcnNlZCBpbnRvIGFuIGFwcHJvcHJpYXRlIGZvbWF0IGJ5IHRoZSBvYmplY3QuXG4gICAqIEBwYXJhbSAge3N0cmluZ30gdGFyZ2V0ICAgICAgICAgICAgICAgICAgVGhlIHRhcmdldCBmb3IgdGhlIGxvYWRlZCBjb250ZW50LiBUaGlzIGNhbiBiZSBhIHN0cmluZyAoc2VsZWN0b3IpLCBvciBhIEpTT04gYXJyYXkgb2Ygc2VsZWN0b3Igc3RyaW5ncy5cbiAgICogQHBhcmFtICB7c3RyaW5nfSBzZWxlY3Rpb24gICAgICAgICAgICAgICBUaGlzIGlzIGEgc2VsZWN0b3IgKG9yIEpTT04gb2Ygc2VsZWN0b3JzKSB0aGF0IGRldGVybWluZXMgd2hhdCB0byBjdXQgZnJvbSB0aGUgbG9hZGVkIGNvbnRlbnQuXG4gICAqIEBwYXJhbSAge0RPTUVsZW1lbnR9IFtsaW5rVGFyZ2V0XSAgICAgICAgVGhlIHRhcmdldCBvZiB0aGUgbGluay4gVGhpcyBpcyB1c2VmdWwgZm9yIHNldHRpbmcgYWN0aXZlIHN0YXRlcyBpbiBjYWxsYmFjay5cbiAgICogQHBhcmFtICB7Ym9vbGVhbn0gZnJvbVBvcCAgICAgICAgICAgICAgICBJbmRpY2F0ZXMgdGhhdCB0aGlzIEdFVCBpcyBmcm9tIGEgcG9wXG4gICAqIEBwYXJhbSAge29iamVjdH0gW2RhdGEgPSB7fV0gICAgICAgICAgICAgVGhlIGRhdGEgdG8gcGFzcyB0byB0aGUgQUpBWCBjYWxsLlxuICAgKiBAcmV0dXJuIHtQcm9taXNlfSAgICAgICAgICAgICAgICAgICAgICAgIEEgcHJvbWlzZSB0aGF0IHJlcHJlc2VudHMgdGhlIEdFVC5cbiAgICogQHJldHVybiB7bG9hZFJlc29sdmV9ICAgICAgICAgICAgICAgICAgICBUaGUgcmVzb2x2ZSBtZXRob2QuIFBhc3NlcyB0aGUgbG9hZGVkIGNvbnRlbnQgZG93biB0aHJvdWdoIGl0J3MgdGhlbmFibGVzLCBmaW5hbGx5IHJlc29sdmluZyB0byB0aGUgcGFyc2UgY29tbWVuZCB2aWEgYSBzZWNvbmQsIHByaXZhdGUgUHJvbWlzZS5cbiAgICogQHJldHVybiB7bG9hZFJlamVjdH0gICAgICAgICAgICAgICAgICAgICBUaGUgcmVqZWN0IG1ldGhvZC4gUmVzdWx0cyBpbiBhbiBlcnJvclxuICAgKi9cbiAgc3RhdGljIGFqYXhHZXQoVVJMLCB0YXJnZXQsIHNlbGVjdGlvbiwgbGlua1RhcmdldCwgZnJvbVBvcCA9IGZhbHNlLCBkYXRhID0ge30pIHtcblxuICAgIC8vIFNldCB0aGUgc3RhdGUgb2YgdGhlIEFKQVggY2xhc3MgdG8gY2xpY2tlZCwgaW5jaWRhdGluZyBzb21ldGhpbmcgaXMgbG9hZGluZ1xuICAgIGlmKCB0aGlzLnN0YXRlID4gU1RBVEVTLkNMSUNLRUQgKVxuICAgIHtcbiAgICAgIGlmKCB0aGlzLmRldm1vZGUgKVxuICAgICAge1xuICAgICAgICBjb25zb2xlLndhcm4oIFwiVHJpZWQgcnVuIGFuIEFKQVggR0VUIHdoZW4gdGhlIG9iamVjdCB3YXNuJ3QgaW4gT0sgb3IgQ0xJQ0tFRCBtb2RlXCIgKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIFJldHJpZXZlIGEgcmVxdWVzdCBvYmplY3QgYW5kIGNvbnN0cnVjdCBhIHZhbGlkIFVSTFxuICAgIGNvbnN0IHJlcSA9IHRoaXMucmVxdWVzdE9iamVjdDtcbiAgICBjb25zdCBwYXJzZWRVUkwgPSB0aGlzLl9maXhVUkwoVVJMKTtcblxuICAgIHZhciByZWFkeVN0YXRlID0gMDtcbiAgICB2YXIgc3RhdHVzID0gMDtcbiAgICB2YXIgYXJncyA9IGFyZ3VtZW50cztcblxuICAgIHZhciByZXF1ZXN0UHJvbWlzZSA9IG5ldyBQcm9taXNlKGZ1bmN0aW9uIGhhbmRsZXIocmVzb2x2ZSwgcmVqZWN0KSB7XG5cbiAgICAgIC8vIExpc3RlbiBmb3IgdGhlIHJlYWR5IHN0YXRlXG4gICAgICByZXEuYWRkRXZlbnRMaXN0ZW5lcigncmVhZHlzdGF0ZWNoYW5nZScsIChlKSA9PiB7XG4gICAgICAgIHJlYWR5U3RhdGUgPSBlLnRhcmdldC5yZWFkeVN0YXRlO1xuICAgICAgICBzdGF0dXMgPSBlLnRhcmdldC5zdGF0dXM7XG4gICAgICB9KTtcblxuICAgICAgLy8gTGlzdGVtIGZvciB0aGUgbG9hZCBldmVudFxuICAgICAgcmVxLmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCAoZSkgPT4ge1xuICAgICAgICAvLyBJZiB3ZSBoYXZlIGEgcmVhZHkgc3RhdGUgdGhhdCBpbmRpY2F0ZWQgdGhhdCB0aGUgbG9hZCB3YXMgYSBzdWNjZXNzLCBjb250aW51ZVxuICAgICAgICBpZiggcmVxLnN0YXR1cyA+PSAyMDAgJiYgcmVxLnN0YXR1cyA8IDQwMCApIHtcbiAgICAgICAgICAvLyBHZXQgdGhlIHJlcXVlc3QgcmVzcG9uc2UgdGV4dFxuICAgICAgICAgIHZhciByZXNwb25zZVRleHQgPSByZXEucmVzcG9uc2VUZXh0XG4gICAgICAgICAgdmFyIHJlc29sdmVyID0ge1xuICAgICAgICAgICAgcmVzcG9uc2VUZXh0OiByZXNwb25zZVRleHQsIFxuICAgICAgICAgICAgYXJndW1lbnRzOiBhcmdzLCBcbiAgICAgICAgICAgIGxpbmtUYXJnZXQ6IGxpbmtUYXJnZXQgfHwgbnVsbFxuICAgICAgICAgIH1cbiAgICAgICAgICByZXNvbHZlKHJlc29sdmVyKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZWplY3QoRVJST1JTLkxPQURfRVJST1IpO1xuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgcmVxLmFkZEV2ZW50TGlzdGVuZXIoJ2Vycm9yJywgKGUpID0+IHtcbiAgICAgICAgcmVqZWN0KEVSUk9SUy5MT0FEX0VSUk9SKTtcbiAgICAgIH0pO1xuICAgIH0uYmluZCh0aGlzKSk7XG5cbiAgICAvLyBUaGlzIHByb21pc2UgdGFrZXMgdGhlIHJldHVybmVkIHByb21pc2UgYW5kIHJ1bnMgdGhlIGVxdWl2YWxlbnQgb2YgYSBcImZpbmFsbHlcIlxuICAgIFByb21pc2UuXG4gICAgICByZXNvbHZlKHJlcXVlc3RQcm9taXNlKS5cbiAgICAgIHRoZW4oIGZ1bmN0aW9uKHJlc29sdmVyKSB7XG4gICAgICAgIGlmKHJlc29sdmVyLmVycm9yKSB7XG4gICAgICAgICAgdGhyb3cgcmVzb2x2ZXIuZXJyb3JcbiAgICAgICAgfSBlbHNlIGlmKCFyZXNvbHZlci5yZXNwb25zZVRleHQpIHtcbiAgICAgICAgICB0aHJvdyBFUlJPUlMuQkFEX1BST01JU0VcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvLyBGaW5kIHRoZSB0YXJnZXQgbm9kZVxuICAgICAgICAgIGxldCB0YXJnZXROb2RlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCh0YXJnZXQpWzBdO1xuICAgICAgICAgIC8vIGFkZCB0aGUgY2xhc3MgdG8gaXRcbiAgICAgICAgICBfdS5hZGRDbGFzcyh0aGlzLmNsYXNzQmFzZVRyYW5zaXRpb24rJy1vdXQtc3RhcnQnLCB0YXJnZXROb2RlKTtcbiAgICAgICAgICBfdS5hZGRDbGFzcyh0aGlzLmNsYXNzQmFzZVRyYW5zaXRpb24rJy1vdXQnLCB0YXJnZXROb2RlKTtcbiAgICAgICAgICAvLyBBZGQgdGhlIGFuaW1hdGlvbiBlbmQgbGlzdGVuZXIgdG8gdGhlIHRhcmdldCBub2RlXG4gICAgICAgICAgcmV0dXJuIEFuaW1hdGlvbi5hZGRFbmRFdmVudExpc3RlbmVyKHRhcmdldE5vZGUsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuIHJlc29sdmVyO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9LmJpbmQodGhpcykgKS5cbiAgICAgIHRoZW4oIGZ1bmN0aW9uKHJlc29sdmVyKSB7XG4gICAgICAgIC8vIEZpbmQgdGhlIHRhcmdldCBub2RlXG4gICAgICAgIGxldCB0YXJnZXROb2RlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCh0YXJnZXQpWzBdO1xuICAgICAgICAvLyBNb2RpZnkgaXRzIGNsYXNzZXNcbiAgICAgICAgX3UucmVtb3ZlQ2xhc3ModGhpcy5jbGFzc0Jhc2VUcmFuc2l0aW9uKyctb3V0LXN0YXJ0JywgdGFyZ2V0Tm9kZSk7XG4gICAgICAgIF91LmFkZENsYXNzKHRoaXMuY2xhc3NCYXNlVHJhbnNpdGlvbisnLW91dC1lbmQnLCB0YXJnZXROb2RlKTtcbiAgICAgICAgLy8gU2V0IGEgbnVsbCB0aW1lb3V0IHRvIHJlcGFpbnQgb24gY2xhc3NjaGFuZ2VcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXNvbHZlKHJlc29sdmVyKTtcbiAgICAgICAgICB9LCB0aGlzLnJlc29sdmVUaW1lb3V0KTtcbiAgICAgICAgfS5iaW5kKHRoaXMpKTtcbiAgICAgIH0uYmluZCh0aGlzKSApLlxuICAgICAgdGhlbihmdW5jdGlvbihyZXNvbHZlcikge1xuICAgICAgICAvLyBGaW5kIHRoZSB0YXJnZXQgbm9kZVxuICAgICAgICBsZXQgdGFyZ2V0Tm9kZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwodGFyZ2V0KVswXTtcbiAgICAgICAgLy8gTW9kaWZ5IGl0cyBjbGFzc2VzXG4gICAgICAgIF91LnJlbW92ZUNsYXNzKHRoaXMuY2xhc3NCYXNlVHJhbnNpdGlvbisnLW91dC1lbmQnLCB0YXJnZXROb2RlKTtcbiAgICAgICAgX3UuYWRkQ2xhc3ModGhpcy5jbGFzc0Jhc2VUcmFuc2l0aW9uKyctb3V0JywgdGFyZ2V0Tm9kZSk7XG4gICAgICAgIC8vIEZpbmFsbHkuIFBhcnNlIHRoZSByZXN1bHRcbiAgICAgICAgdGhpcy5fcGFyc2VSZXNwb25zZShyZXNvbHZlci5yZXNwb25zZVRleHQsIHRhcmdldCwgc2VsZWN0aW9uLCBmcm9tUG9wLCBsaW5rVGFyZ2V0KVxuICAgICAgfS5iaW5kKHRoaXMpKS5cbiAgICAgIGNhdGNoKCBmdW5jdGlvbihlcnIpIHtcbiAgICAgICAgY29uc29sZS5sb2coZXJyKVxuICAgICAgICB0aGlzLl9lcnJvcihyZWFkeVN0YXRlLCByZXEuc3RhdHVzLCBlcnIgfHwgMCk7XG4gICAgICB9LmJpbmQodGhpcykgKTtcblxuICAgIC8vIFNhdmUgdGhlIGxhc3QgcGFyc2VkIFVSTCBmb3IgdGhlIHB1cnBvc2Ugb2YgaGlzdG9yeSBpbnRlcm9wZXJhYmlsaXR5IGFuZCBlcnJvciBjb3JyZWN0aW9uLlxuICAgIHRoaXMubGFzdFBhcnNlZFVSTCA9IHBhcnNlZFVSTDtcblxuICAgIHJlcS5vcGVuKCdHRVQnLCBwYXJzZWRVUkwsIHRydWUpO1xuICAgIHJlcS5zZW5kKGRhdGEpO1xuXG4gICAgLy8gU2V0IHRoZSBvYmplY3Qgc3RhdGVcbiAgICB0aGlzLnN0YXRlID0gU1RBVEVTLkxPQURJTkc7XG5cbiAgICByZXR1cm4gcmVxdWVzdFByb21pc2U7XG4gIH1cblxuICAvKipcbiAgICogUHJpdmF0ZSBtZXRob2RzXG4gICAqL1xuXG4gIC8qKlxuICAgKiBMaXN0ZW5lciBmb3IgdGhlIHBvcHN0YXRlIG1ldGhvZFxuICAgKlxuICAgKiBAcHJpdmF0ZVxuICAgKiBAcGFyYW0gIHtvYmplY3R9IGUgdGhlIHBhc3NlZCBldmVudCBvYmplY3RcbiAgICogQHJldHVybiB2b2lkXG4gICAqL1xuICBzdGF0aWMgX3BvcHN0YXRlKGUpIHtcbiAgICB2YXIgYmFzZSwgc3RhdGUgPSB7fTtcbiAgICB2YXIgaGFzUG9wcGVkU3RhdGUgPSBzdXBlci5fcG9wc3RhdGUoZSk7XG5cbiAgICBpZiggaGFzUG9wcGVkU3RhdGUgKSB7XG4gICAgICBzdGF0ZSA9IChiYXNlID0gdGhpcy5oaXN0b3J5KS5zdGF0ZSB8fCAoYmFzZS5zdGF0ZSA9IGUuc3RhdGUgfHwgKGUuc3RhdGUgPSB3aW5kb3cuZXZlbnQuc3RhdGUpKTtcbiAgICB9XG5cbiAgICB2YXIgaHJlZiA9IGRvY3VtZW50LmxvY2F0aW9uLmhyZWY7XG4gICAgdmFyIHRhcmdldCA9IHN0YXRlLnRhcmdldCB8fCB0aGlzLmxhc3RDaGFuZ2VkVGFyZ2V0O1xuICAgIHZhciBzZWxlY3Rpb24gPSBzdGF0ZS5zZWxlY3Rpb24gfHwgU0VMRUNUT1JTLkNISUxEUkVOO1xuICAgIHZhciBkYXRhID0gc3RhdGUuZGF0YSB8fCB7fTtcblxuICAgIHRoaXMuYWpheEdldChocmVmLCB0YXJnZXQsIHNlbGVjdGlvbiwgdHJ1ZSwgZGF0YSk7XG5cbiAgICByZXR1cm4gaGFzUG9wcGVkU3RhdGU7XG4gIH1cblxuICAvKipcbiAgICogVHJpZ2dlciBhbiBhamF4IGxpbmsgYXMgZGV0ZXJtaW5lZCBieSBhIGNsaWNrIGNhbGxiYWNrLiBUaGlzIHNob3VsZCBvbmx5IGV2ZXIgYmUgY2FsbGVkXG4gICAqIGZyb20gYSBjbGljayBldmVudCBhcyBhZGRlZCB2aWEgdGhlIEFKQVggb2JqZWN0IG9yIGEgY2hpbGQgdGhlcmVyb2YuXG4gICAqXG4gICAqIEBzdGF0aWNcbiAgICogQHByaXZhdGVcbiAgICogQHBhcmFtICB7b2JqZWN0fSBlIHRoZSBldmVudCBvYmplY3QgcGFzc2VkIGZyb20gdGhlIGNsaWNrIGV2ZW50LlxuICAgKi9cbiAgc3RhdGljIF90cmlnZ2VyQWpheExpbmsoZSkge1xuICAgIGlmKCB0aGlzLnN0YXRlICE9IFNUQVRFUy5PSyApXG4gICAge1xuICAgICAgaWYoIHRoaXMuZGV2bW9kZSApXG4gICAgICB7XG4gICAgICAgIGNvbnNvbGUud2FybiggXCJUcmllZCB0byBjbGljayBhbiBBSkFYIGxpbmsgd2hlbiB0aGUgb2JqZWN0IHdhc24ndCBpbiBPSyBtb2RlXCIgKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIEZpbmQgYWxsIG9mIHRoZSByZWxldmFudCBhdHRlaWJ1dGVzXG4gICAgY29uc3QgbGluayAgICAgID0gZS50YXJnZXQ7XG4gICAgY29uc3QgaHJlZiAgICAgID0gbGluay5nZXRBdHRyaWJ1dGUoJ2hyZWYnKTtcbiAgICBjb25zdCB0YXJnZXQgICAgPSBsaW5rLmdldEF0dHJpYnV0ZSh0aGlzLmF0dHJpYnV0ZVRhcmdldCk7XG4gICAgY29uc3Qgc2VsZWN0aW9uID0gbGluay5nZXRBdHRyaWJ1dGUodGhpcy5hdHRyaWJ1dGVTZWxlY3Rpb24pO1xuXG4gICAgLy8gU2V0IHRoZSBvYmplY3Qgc3RhdGVcbiAgICB0aGlzLnN0YXRlID0gU1RBVEVTLkNMSUNLRUQ7XG5cbiAgICB0aGlzLmFqYXhHZXQoaHJlZiwgdGFyZ2V0LCBzZWxlY3Rpb24pO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoaXMgcmVzcG9uZHMgdG8gdGhlIGFqYXggbG9hZCBldmVudCBhbmQgaXMgcmVzcG9uc2libGUgZm9yIGJ1aWxkaW5nIHRoZSByZXN1bHQsXG4gICAqIGluamVjdGluZyBpdCBpbnRvIHRoZSBwYWdlLCBydW5uaW5nIGNhbGxiYWNrcyBhbmQgZGV0ZWN0aW5nIGFuZCBkZWxheWluZ1xuICAgKiB0cmFuc2l0aW9ucyBhbmQgYW5pbWF0aW9ucyBhcyBuZWNlc3NhcnkvXG4gICAqXG4gICAqIEBzdGF0aWNcbiAgICogQHByaXZhdGVcbiAgICogQHBhcmFtICB7c3RyaW5nfSBjb250ZW50ICAgICAgICAgICBUaGUgbG9hZGVkIHBhZ2UgY29udGVudCwgdGhpcyBjb21lcyBmcm9tIHRoZSBBSkFYIGNhbGwuXG4gICAqIEBwYXJhbSAge3N0cmluZ30gdGFyZ2V0ICAgICAgICAgICAgVGhlIHRhcmdldCBmb3IgdGhlIGxvYWRlZCBjb250ZW50LiBUaGlzIGNhbiBiZSBhIHN0cmluZyAoc2VsZWN0b3IpLCBvciBhIEpTT04gYXJyYXkgb2Ygc2VsZWN0b3Igc3RyaW5ncy5cbiAgICogQHBhcmFtICB7c3RyaW5nfSBzZWxlY3Rpb24gICAgICAgICBUaGlzIGlzIGEgc2VsZWN0b3IgKG9yIEpTT04gb2Ygc2VsZWN0b3JzKSB0aGF0IGRldGVybWluZXMgd2hhdCB0byBjdXQgZnJvbSB0aGUgbG9hZGVkIGNvbnRlbnQuXG4gICAqIEBwYXJhbSAge2Jvb2xlYW59IGZyb21Qb3AgICAgICAgICAgSW5kaWNhdGVzIHRoYXQgdGhpcyBsb2FkIGlzIGZyb20gYSBoaXN0b3J5IHBvcFxuICAgKiBAcGFyYW0gIHtET01FbGVtZW50fSBbbGlua1RhcmdldF0gIFRoZSB0YXJnZXQgb2YgdGhlIGxpbmsuIFRoaXMgaXMgdXNlZnVsIGZvciBzZXR0aW5nIGFjdGl2ZSBzdGF0ZXMgaW4gY2FsbGJhY2suXG4gICAqL1xuICBzdGF0aWMgX3BhcnNlUmVzcG9uc2UoY29udGVudCwgdGFyZ2V0LCBzZWxlY3Rpb24sIGZyb21Qb3AgPSBmYWxzZSwgbGlua1RhcmdldCkge1xuXG4gICAgdmFyIGRvYywgcmVzdWx0cywgb2xkVGl0bGUgPSBkb2N1bWVudC50aXRsZSwgbmV3VGl0bGUsIHRhcmdldE5vZGVzO1xuXG4gICAgLy8gUGFyc2UgdGhlIGRvY3VtZW50IGZyb20gdGhlIGNvbnRlbnQgcHJvdmlkZWRcbiAgICBkb2MgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBkb2MuaW5uZXJIVE1MID0gY29udGVudDtcblxuICAgIC8vIEZpbmQgdGhlIG5ldyBwYWdlIHRpdGxlXG4gICAgbmV3VGl0bGUgPSBkb2MuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ3RpdGxlJylbMF0udGV4dDtcblxuICAgIHRhcmdldE5vZGVzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCh0YXJnZXQpO1xuXG4gICAgLy8gSSBuZWVkIHRvIGFkZCBhIHRvbm5lIG9mIHRoaW5ncyBoZXJlLCBsaWtlIHN1cHBvcnQgZm9yIHRyYW5zaXRpb24gb2ZmIGV0Yy5cbiAgICAvLyBDdXJyZW50bHkgSSdtIGp1c3Qgc3RhdGljYWxseSByZW1vdmluZyBhbmQgYWRkaW5nIGluIGVsZW1lbnRzLlxuICAgIHRhcmdldE5vZGVzLmZvckVhY2goKGVsKSA9PiB7XG4gICAgICAvLyBXb2tmbG93IHdpbGwgZ28gbGlrZSB0aGlzOlxuICAgICAgLy8gQWRkIHRoZSB0cmFuc2l0aW9uIGNsYXNzIHRvIHRoZSBlbGVtZW50XG4gICAgICAvLyBUaW1lIG91dCBhIGJpdCAoMTBtcykgYW5kIHRoZW4gYWRkIHRoZSB0cmFuc2l0aW9uIGVuZCBjbGFzc1xuICAgICAgLy8gT25jZSBjb21wbGV0ZSwgcmVtb3ZlIHRoZSB0cmFuc2l0aW9uIGNsYXNzZXMgYW5kIHJlcGxhY2UgdGhlIG9sZCBlbGVtZW50cyB3aXRoIHRoZSBuZXcgKGlubmVySFRNTClcbiAgICAgIC8vIFRoZW4gYWRkIHRoZSB0cmFuc2l0aW9uIGNsYXNzIHRvIHRoZSBlbGVtZW50XG4gICAgICAvLyBUaW1lIG91dCBhIGJpdCAoMTBtcykgYW5kIHRoZW4gYWRkIHRoZSB0cmFuc2l0aW9uIGVuZCBjbGFzc1xuXG4gICAgICBlbC5pbm5lckhUTUwgPSAnJztcblxuICAgICAgLy8gRmluZCB0aGUgcmVzdWx0cyBvZiB0aGUgc2VsZWN0aW9uXG4gICAgICAvLyBOLkIuIFRoaXMgd2lsbCBhbGwgbmVlZCB0byBiZSB1cGRhdGVkIHRvIHN1cHBvcnQgdGhlIGFycmF5IHN5bnRheFxuICAgICAgaWYoIHNlbGVjdGlvbiA9PT0gU0VMRUNUT1JTLkNISUxEUkVOIClcbiAgICAgIHtcbiAgICAgICAgcmVzdWx0cyA9IGRvYy5xdWVyeVNlbGVjdG9yQWxsKGAke3RhcmdldH0gPiAqYCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXN1bHRzID0gZG9jLnF1ZXJ5U2VsZWN0b3JBbGwoc2VsZWN0aW9uKTtcbiAgICAgIH1cblxuICAgICAgcmVzdWx0cy5mb3JFYWNoKGZ1bmN0aW9uKHJlc3VsdCkge1xuICAgICAgICBlbC5hcHBlbmRDaGlsZChyZXN1bHQuY2xvbmVOb2RlKHRydWUpKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgLy8gVXBkYXRlIHRoZSBpbnRlcm5hbCByZWZlcmVuY2UgdG8gdGhlIGxhc3QgdGFyZ2V0XG4gICAgdGhpcy5sYXN0Q2hhbmdlZFRhcmdldCA9IHRhcmdldDtcblxuICAgIGlmKCAhZnJvbVBvcCApIHtcbiAgICAgIC8vIFB1c2ggdGhlIG5ldyBzdGF0ZSB0byB0aGUgaGlzdG9yeS5cbiAgICAgIGNvbnNvbGUuY2xlYXIoKTtcbiAgICAgIGNvbnNvbGUubG9nKHsgdGFyZ2V0OiB0YXJnZXQsIHNlbGVjdGlvbjogc2VsZWN0aW9uIH0pO1xuICAgICAgdGhpcy5wdXNoKHRoaXMubGFzdFBhcnNlZFVSTCwgbmV3VGl0bGUsIHsgdGFyZ2V0OiB0YXJnZXQsIHNlbGVjdGlvbjogc2VsZWN0aW9uIH0pO1xuICAgIH1cblxuICAgIC8vIFNldCB0aGUgb2JqZWN0IHN0YXRlXG4gICAgdGhpcy5zdGF0ZSA9IFNUQVRFUy5PSztcbiAgfVxuXG4gIC8qKlxuICAgKiBUcmlnZ2VyIGFuIGVycm9yIGxvZ1xuICAgKlxuICAgKiBAc3RhdGljXG4gICAqIEBwcml2YXRlXG4gICAqIEBwYXJhbSAge3R5cGV9IHJlYWR5U3RhdGUgZGVzY3JpcHRpb25cbiAgICogQHBhcmFtICB7dHlwZX0gc3RhdHVzICAgICBkZXNjcmlwdGlvblxuICAgKiBAcmV0dXJuIHt0eXBlfSAgICAgICAgICAgIGRlc2NyaXB0aW9uXG4gICAqL1xuICBzdGF0aWMgX2Vycm9yKHJlYWR5U3RhdGUsIHN0YXR1cywgZXJyb3JTdGF0ZSA9IEVSUk9SUy5HRU5FUklDX0VSUk9SKSB7XG4gICAgdmFyIGVycm9yU3RhdGVDb25zdCA9IChmdW5jdGlvbih2YWwpIHsgZm9yKHZhciBrZXkgaW4gRVJST1JTKSB7IGlmKEVSUk9SU1trZXldID09IHZhbCkgcmV0dXJuIGtleSB9IHJldHVybiAnR0VORVJJQ19FUlJPUicgfSkoZXJyb3JTdGF0ZSlcbiAgICBjb25zb2xlLndhcm4oYCVjIEVycm9yIGxvYWRpbmcgQUpBWCBsaW5rLiByZWFkeVN0YXRlOiAke3JlYWR5U3RhdGV9LiBzdGF0dXM6ICR7c3RhdHVzfS4gZXJyb3JTdGF0ZTogJHtlcnJvclN0YXRlQ29uc3R9YCwgJ2JhY2tncm91bmQ6ICMyMjI7IGNvbG9yOiAjZmY3YzNhJylcbiAgfVxuXG5cbiAgLyoqXG4gICAqIEdldHRlcnMgYW5kIHNldHRlcnNcbiAgICovXG5cbiAgLyoqXG4gICAqIChnZXR0ZXIvc2V0dGVyKSBUaGUgYXR0cmlidXRlIHVzZWQgdG8gZGV0ZXJtaW5lIHdoZXRoZXIgYSBsaW5rIHNob3VsZFxuICAgKiBiZSBydW4gdmlhIHRoZSBBSkFYIGNsYXNzLlxuICAgKlxuICAgKiBAdHlwZSB7c3RyaW5nfVxuICAgKiBAZGVmYXVsdCAnZGF0YS13dGMtYWpheCdcbiAgICovXG4gIHN0YXRpYyBzZXQgYXR0cmlidXRlQWpheChhdHRyaWJ1dGUpIHtcbiAgICBpZih0eXBlb2YgYXR0cmlidXRlID09PSAnc3RyaW5nJykge1xuICAgICAgdGhpcy5fYXR0cmlidXRlQWpheCA9IGF0dHJpYnV0ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc29sZS53YXJuKCdBbGwgYXR0cmlidXRlcyBtdXN0IGJlIHN0cmluZ3MuJyk7XG4gICAgfVxuICB9XG4gIHN0YXRpYyBnZXQgYXR0cmlidXRlQWpheCgpIHtcbiAgICByZXR1cm4gdGhpcy5fYXR0cmlidXRlQWpheCB8fCAnZGF0YS13dGMtYWpheCc7XG4gIH1cblxuICAvKipcbiAgICogKGdldHRlci9zZXR0ZXIpIFRoZSBhdHRyaWJ1dGUgdXNlZCB0byBkZXRlcm1pbmUgd2hlcmUgYSBsaW5rIHNob3VsZCBwbGFjZSBpdCdzXG4gICAqIHJlc3VsdGFudCBHRVQuIFRoaXMgYXR0cmlidXRlIHNob3VsZCBiZSBpbiB0aGUgZm9ybSBvZiBhIHNlbGVjdG9yLCBpZTpcbiAgICogYC5hamF4LXRhcmdldGBcbiAgICpcbiAgICogQHR5cGUge3N0cmluZ31cbiAgICogQGRlZmF1bHQgJ2RhdGEtd3RjLWFqYXgtdGFyZ2V0J1xuICAgKi9cbiAgc3RhdGljIHNldCBhdHRyaWJ1dGVUYXJnZXQoYXR0cmlidXRlKSB7XG4gICAgaWYodHlwZW9mIGF0dHJpYnV0ZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgIHRoaXMuX2F0dHJpYnV0ZVRhcmdldCA9IGF0dHJpYnV0ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc29sZS53YXJuKCdBbGwgYXR0cmlidXRlcyBtdXN0IGJlIHN0cmluZ3MuJyk7XG4gICAgfVxuICB9XG4gIHN0YXRpYyBnZXQgYXR0cmlidXRlVGFyZ2V0KCkge1xuICAgIHJldHVybiB0aGlzLl9hdHRyaWJ1dGVUYXJnZXQgfHwgJ2RhdGEtd3RjLWFqYXgtdGFyZ2V0JztcbiAgfVxuXG4gIC8qKlxuICAgKiAoZ2V0dGVyL3NldHRlcikgVGhlIGF0dHJpYnV0ZSB1c2VkIHRvIHNsaWNlIHRoZSByZXN1bHRhbnQgR0VULlxuICAgKiBUaGlzIGF0dHJpYnV0ZSBzaG91bGQgYmUgaW4gdGhlIGZvcm0gb2YgYSBzZWxlY3RvciwgaWU6XG4gICAqIGAuYWpheC1zZWxlY3Rpb25gXG4gICAqXG4gICAqIEB0eXBlIHtzdHJpbmd9XG4gICAqIEBkZWZhdWx0ICdkYXRhLXd0Yy1hamF4LXNlbGVjdGlvbidcbiAgICovXG4gIHN0YXRpYyBzZXQgYXR0cmlidXRlU2VsZWN0aW9uKGF0dHJpYnV0ZSkge1xuICAgIGlmKHR5cGVvZiBhdHRyaWJ1dGUgPT09ICdzdHJpbmcnKSB7XG4gICAgICB0aGlzLl9hdHRyaWJ1dGVTZWxlY3Rpb24gPSBhdHRyaWJ1dGU7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnNvbGUud2FybignQWxsIGF0dHJpYnV0ZXMgbXVzdCBiZSBzdHJpbmdzLicpO1xuICAgIH1cbiAgfVxuICBzdGF0aWMgZ2V0IGF0dHJpYnV0ZVNlbGVjdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5fYXR0cmlidXRlU2VsZWN0aW9uIHx8ICdkYXRhLXd0Yy1hamF4LXNlbGVjdGlvbic7XG4gIH1cblxuICAvKipcbiAgICogKGdldHRlci9zZXR0ZXIpIFRoZSBjbGFzc25hbWUgdG8gdXNlIGFzIHRoZSBiYXNpcyBmb3IgdHJhbnNpdGlvbnMuIERlZmF1bHRcbiAgICogd2lsbCBiZSAqd3RjLXRyYW5zaXRpb24qLiBTbyB0aGlzIHdpbGwgdGhlbiBiZSB1c2VkIGZvciBhbGwgMyBzdGF0ZXM6XG4gICAqICoud3RjLXRyYW5zaXRpb24qXG4gICAqICoud3RjLXRyYW5zaXRpb24tb3V0KlxuICAgKiAqLnd0Yy10cmFuc2l0aW9uLW91dC1zdGFydCpcbiAgICogKi53dGMtdHJhbnNpdGlvbi1vdXQtZW5kKlxuICAgKiAqLnd0Yy10cmFuc2l0aW9uLWluKlxuICAgKiAqLnd0Yy10cmFuc2l0aW9uLWluLXN0YXJ0KlxuICAgKiAqLnd0Yy10cmFuc2l0aW9uLWluLWVuZCpcbiAgICpcbiAgICogQHR5cGUge3N0cmluZ31cbiAgICogQGRlZmF1bHQgJ3d0Yy10cmFuc2l0aW9uJ1xuICAgKi9cbiAgc3RhdGljIHNldCBjbGFzc0Jhc2VUcmFuc2l0aW9uKGNsYXNzQmFzZSkge1xuICAgIGlmKHR5cGVvZiBjbGFzc0Jhc2UgPT09ICdzdHJpbmcnKSB7XG4gICAgICB0aGlzLl9jbGFzc0Jhc2VUcmFuc2l0aW9uID0gY2xhc3NCYXNlO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zb2xlLndhcm4oJ0FsbCBhdHRyaWJ1dGVzIG11c3QgYmUgc3RyaW5ncy4nKTtcbiAgICB9XG4gIH1cbiAgc3RhdGljIGdldCBjbGFzc0Jhc2VUcmFuc2l0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLl9jbGFzc0Jhc2VUcmFuc2l0aW9uIHx8ICd3dGMtdHJhbnNpdGlvbic7XG4gIH1cblxuICAvKipcbiAgICogKGdldHRlci9zZXR0ZXIpIFRoZSBhdHRyaWJ1dGUgdXNlZCB0byBzbGljZSB0aGUgcmVzdWx0YW50IEdFVC5cbiAgICogVGhpcyBhdHRyaWJ1dGUgc2hvdWxkIGJlIGluIHRoZSBmb3JtIG9mIGEgc2VsZWN0b3IsIGllOlxuICAgKiBgLmFqYXgtc2VsZWN0aW9uYFxuICAgKlxuICAgKiBAdHlwZSB7c3RyaW5nfVxuICAgKiBAZGVmYXVsdCAnZGF0YS13dGMtYWpheC1zZWxlY3Rpb24nXG4gICAqL1xuICBzdGF0aWMgc2V0IGF0dHJpYnV0ZVNob3VsZE5hdmlnYXRlKGF0dHJpYnV0ZSkge1xuICAgIGlmKHR5cGVvZiBhdHRyaWJ1dGUgPT09ICdzdHJpbmcnKSB7XG4gICAgICB0aGlzLl9hdHRyaWJ1dGVTaG91bGROYXZpZ2F0ZSA9IGF0dHJpYnV0ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc29sZS53YXJuKCdBbGwgYXR0cmlidXRlcyBtdXN0IGJlIHN0cmluZ3MuJyk7XG4gICAgfVxuICB9XG4gIHN0YXRpYyBnZXQgYXR0cmlidXRlU2hvdWxkTmF2aWdhdGUoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2F0dHJpYnV0ZVNob3VsZE5hdmlnYXRlIHx8ICdkYXRhLXd0Yy1hamF4LXNob3VsZC1uYXZpZ2F0ZSc7XG4gIH1cblxuICAvKipcbiAgICogcmV0dXJucyBhIG5ldyByZXF1ZXN0T2JqZWN0LiBXcmFwcGluZyBwbGFjZWhvbGRlciBmb3Igbm93IHdhaXRpbmcgb24gZW5oYW5jZW1lbnRzLlxuICAgKlxuICAgKiBAcmVhZG9ubHlcbiAgICogQHJldHVybiB7b2JqZWN0fSAgcmVxdWVzdE9iamVjdFxuICAgKi9cbiAgc3RhdGljIGdldCByZXF1ZXN0T2JqZWN0KCkge1xuICAgIHJldHVybiBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiByZXR1cm5zIGEgbmV3IGxhc3QgY2hhbmdlZCB0YXJnZXQuIFRoaXMgaXMgdXNlZCB0byBkZXRlcm1pbmUgd2hhdCB0byBjaGFuZ2VkXG4gICAqIHdoZW4gbmF2aWdhdGluZyBiYWNrIHZpYSBoaXN0b3J5LlxuICAgKlxuICAgKiBAcmV0dXJuIHtvYmplY3R9ICBlaXRoZXIgYW4gYXJyYXkgb2Ygbm9kZXMgb3IgYSBzaW5nbGUgbm9kZS5cbiAgICogQGRlZmF1bHQgbnVsbFxuICAgKi9cbiAgc3RhdGljIHNldCBsYXN0Q2hhbmdlZFRhcmdldCh0YXJnZXQpIHtcbiAgICB0aGlzLl9sYXN0Q2hhbmdlZFRhcmdldCA9IHRhcmdldDtcbiAgfVxuICBzdGF0aWMgZ2V0IGxhc3RDaGFuZ2VkVGFyZ2V0KCkge1xuICAgIHJldHVybiB0aGlzLl9sYXN0Q2hhbmdlZFRhcmdldCB8fCBudWxsO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoZSByZXNvbHZlIHRpbWVvdXQuIFRoaXMgaXMgdGhlIHRpbWUgdGhhdCBpcyB0byBlbGxhcHNlIGJldHdlZW4gYW4gdHJhbnNpdGlvblxuICAgKiBjb21wbGV0aW5nIGFuZCB0aGUgbmV3IGNvbnRlbnQgYmVpbmcgYWRkZWQuIFRoaXMgaXMgYXBwbGllZCBib3RoIHRvIHRoZSBvdXR3YXJkXG4gICAqIGVsZW1lbnQgYW5kIHRoZSBpbndhcmQuXG4gICAqXG4gICAqIEByZXR1cm4ge2ludH0gIEEgbnVtYmVyLCBpbiBNUywgZ3JlYXRlciB0aGFuIDBcbiAgICogQGRlZmF1bHQgMFxuICAgKi9cbiAgc3RhdGljIHNldCByZXNvbHZlVGltZW91dCh0aW1lb3V0KSB7XG4gICAgdGhpcy5fcmVzb2x2ZVRpbWVvdXQgPSB0aW1lb3V0ID4gMCA/IHRpbWVvdXQgOiBudWxsO1xuICB9XG4gIHN0YXRpYyBnZXQgcmVzb2x2ZVRpbWVvdXQoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3Jlc29sdmVUaW1lb3V0ID4gMCA/IHRoaXMuX3Jlc29sdmVUaW1lb3V0IDogMDtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUgc3RhdGUgdGhhdCB0aGUgQUpBWCBvYmplY3QgaXMgaW4sIGFzIGRldGVybWluZWQgZnJvbSBhIGxpc3Qgb2YgY29uc3RhbnRzOlxuICAgKiAtIE9LICAgICAgICAgICAgIElkbGUsIHJlYWR5IGZvciBhIHN0YXRlIGxvYWQuXG4gICAqIC0gQ0xJQ0tFRCAgICAgICAgQ2xpY2tlZCwgYnV0IG5vdCB5ZXQgZmlyZWQuXG4gICAqIC0gTE9BRElORyAgICAgICAgTG9hZGluZyBwYWdlLlxuICAgKiAtIFRSQU5TSVRJT05JTkcgIFRyYW5zaXRpb25pbmcgc3RhdGVcbiAgICogLSBMT0FERUQgICAgICAgICBDb250ZW50IGxvYWRlZC5cbiAgICpcbiAgICogQHJldHVybiB7aW50ZWdlcn0gIFRoZSBzdGF0ZSB0aGF0IHRoZSBvYmplY3QgaXMgaW4uIENvbXBhcmUgdG8gdGhlIHN0YXRlIG9iamVjdCBmb3IgZGVzY3JpcHRpb25cbiAgICogQGRlZmF1bHQgU1RBVEUuT0tcbiAgICovXG4gIHN0YXRpYyBzZXQgc3RhdGUoc3RhdGUpIHtcbiAgICBpZiggdHlwZW9mIHN0YXRlID09PSAnc3RyaW5nJyApIHtcbiAgICAgIGlmKCBTVEFURVNbc3RhdGVdICE9PSB1bmRlZmluZWQgKSB7XG4gICAgICAgIHRoaXMuX3N0YXRlID0gU1RBVEVTW3N0YXRlXTtcbiAgICAgICAgcmV0dXJuXG4gICAgICB9XG4gICAgfSBlbHNlIGlmKCB0eXBlb2Ygc3RhdGUgPT09ICdudW1iZXInICkge1xuICAgICAgZm9yKHZhciBfc3RhdGUgaW4gU1RBVEVTKSB7XG4gICAgICAgIGlmKFNUQVRFU1tfc3RhdGVdID09PSBzdGF0ZSkge1xuICAgICAgICAgIHRoaXMuX3N0YXRlID0gc3RhdGU7XG5cbiAgICAgICAgICBpZiggdGhpcy5kZXZtb2RlIClcbiAgICAgICAgICB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhgJWMgQUpBWCBzdGF0ZSBjaGFuZ2U6ICR7dGhpcy5fc3RhdGV9IGAsICdiYWNrZ3JvdW5kOiAjMjIyOyBjb2xvcjogI2JhZGE1NScpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICBjb25zb2xlLndhcm4oJ3N0YXRlIG11c3QgYmUgb25lIG9mIE9LLCBDTElDS0VELCBMT0FESU5HLCBMT0FERUQuJyk7XG4gIH1cbiAgc3RhdGljIGdldCBzdGF0ZSgpIHtcbiAgICByZXR1cm4gdGhpcy5fc3RhdGUgfHwgMDtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUgbGFzdCBVUkwgdG8gYmUgcGFyc2VkIGJ5IHRoZSBBSkFYIG9iamVjdC4gR2VuZXJhbGx5IHNwZWFraW5nLCB0aGlzIGlzIHRoZVxuICAgKiBsYXN0IFVSTCB0byBiZSBsb2FkZWQgb3IgYXR0ZW1wdGVkIGxvYWRlZC5cbiAgICpcbiAgICogQHJldHVybiB7c3RyaW5nfSAgVGhlIHBhcnNlZCBVUkwgc3RyaW5nXG4gICAqIEBkZWZhdWx0IG51bGxcbiAgICovXG4gIHN0YXRpYyBzZXQgbGFzdFBhcnNlZFVSTChwYXJzZWRVUkwpIHtcbiAgICBpZiggdHlwZW9mIHBhcnNlZFVSTCA9PT0gJ3N0cmluZycgKSB7XG4gICAgICB0aGlzLl9sYXN0UGFyc2VkVVJMID0gcGFyc2VkVVJMO1xuICAgIH1cbiAgfVxuICBzdGF0aWMgZ2V0IGxhc3RQYXJzZWRVUkwoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2xhc3RQYXJzZWRVUkwgfHwgbnVsbDtcbiAgfVxufVxuXG5leHBvcnQgeyBBSkFYLCBFUlJPUlMsIFNUQVRFUyB9O1xuIiwiLyoqXG4gKiBDbGFzcyByZXByZXNlbnRpbmcgYW4gYWJzdHJhY3Rpb24gb2YgdGhlIGhpc3RvcnkgQVBJLlxuICogQHN0YXRpY1xuICogQG5hbWVzcGFjZVxuICogQGF1dGhvciBMaWFtIEVnYW4gPGxpYW1Ad2V0aGVjb2xsZWN0aXZlLmNvbT5cbiAqIEB2ZXJzaW9uIDAuOFxuICogQGNyZWF0ZWQgTm92IDE5LCAyMDE2XG4gKi9cbmNsYXNzIEhpc3Rvcnkge1xuXG4gIC8qKlxuICAgKiBQdWJsaWMgbWV0aG9kc1xuICAgKi9cblxuICAvKipcbiAgICAqIEluaXRpYWxpc2VzIHRoZSBIaXN0b3J5IGNsYXNzLiBOb3RoaW5nIHNob3VsZCBiZSBhYmxlIHRvXG4gICAgKiBvcGVyYXRlIGhlcmUgdW5sZXNzIHRoaXMgaGFzIHJ1biB3aXRoIGEgc3VwcG9ydCA9IHRydWUuXG4gICAgKlxuICAgICogQFB1YmxpY1xuICAgICogQHJldHVybiB7Ym9vbGVhbn0gICAgICAgICBSZXR1cm5zIHdoZXRoZXIgaW5pdCByYW4gb3Igbm90XG4gICAgKi9cbiAgc3RhdGljIGluaXQoZGV2bW9kZSA9IGZhbHNlKSB7XG4gICAgaWYodGhpcy5zdXBwb3J0KVxuICAgIHtcbiAgICAgIC8vIFRyeSB0byBzZXQgZXZlcnl0aGluZyB1cCwgYW5kIGlmIHdlIGZhaWwgdGhlbiByZXR1cm4gZmFsc2VcbiAgICAgIHRyeSB7XG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdwb3BzdGF0ZScsIChlKT0+IHtcbiAgICAgICAgICB2YXIgaGFzUG9wcGVkU3RhdGUgPSB0aGlzLl9wb3BzdGF0ZShlKTtcbiAgICAgICAgICByZXR1cm4gaGFzUG9wcGVkU3RhdGU7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMuZGV2bW9kZSAgICAgID0gZGV2bW9kZTtcblxuICAgICAgfSBjYXRjaCAoZSkge1xuXG4gICAgICAgIC8vIElmIHdlJ3JlIGluIGRldm1vZGUsIHNlbmQgb3VyIGNvbnNvbGUgb3V0cHV0XG4gICAgICAgIGlmKHRoaXMuZGV2bW9kZSkge1xuICAgICAgICAgIGNvbnNvbGUud2FybignZXJyb3IgaW4gaGlzdG9yeSBpbml0aWFsaXNhdGlvbicpO1xuICAgICAgICAgIGNvbnNvbGUubG9nKGUpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuXG4gICAgICB0aGlzLmluaXRpYWxpc2VkID0gdHJ1ZTtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDb25zdHJ1Y3QgYW5kIHB1c2ggYSBVUkwgc3RhdGVcbiAgICpcbiAgICogQHB1YmxpY1xuICAgKiBAcGFyYW0gIHtzdHJpbmd9IFVSTCAgICAgICAgICAgVGhlIFVSTCB0byBwdXNoLCBjYW4gYmUgcmVsYXRpdmUsIGFic29sdXRlIG9yIGZ1bGxcbiAgICogQHBhcmFtICB7c3RyaW5nfSB0aXRsZSAgICAgICAgIFRoZSB0aXRsZSB0byBwdXNoLlxuICAgKiBAcGFyYW0gIHtvYmplY3R9IHN0YXRlT2JqICAgICAgQSBzdGF0ZSB0byBwdXNoIHRvIHRoZSBzdGFjay4gVGhpcyB3aWxsIGJlIHBvcHBlZCB3aGVuIG5hdmlhZ3RpbmcgYmFja1xuICAgKiBAcmV0dXJuIHtib29sZWFufSAgICAgICAgICAgICAgSW5kaWNhdGVzIHdoZXRoZXIgdGhlIHB1c2ggc3VjY2VlZGVkXG4gICAqL1xuICBzdGF0aWMgcHVzaChVUkwsIHRpdGxlID0gJycsIHN0YXRlT2JqID0ge30pIHtcblxuICAgIHZhciBwYXJzZWRVUkwgPSAnJztcblxuICAgIC8vIEZpcnN0IHRyeSB0byBmaXggdGhlIFVSTFxuICAgIHRyeSB7XG4gICAgICBwYXJzZWRVUkwgPSB0aGlzLl9maXhVUkwoVVJMLCB0cnVlLCB0cnVlKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICBpZih0aGlzLmRldm1vZGUpIHtcbiAgICAgICAgY29uc29sZS53YXJuKCdwdXNoIGZhaWxlZCB3aGlsZSB0cnlpbmcgdG8gZml4IHRoZSBVUkwnKTtcbiAgICAgICAgY29uc29sZS5sb2coZSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gZmFsc2VcbiAgICB9XG5cbiAgICAvLyBJZiB3ZSBoYXZlIEFQSSBzdXBwb3J0LCBwdXNoIHRoZSBzdGF0ZSB0byB0aGUgaGlzdG9yeSBvYmplY3RcbiAgICBpZih0aGlzLnN1cHBvcnQpXG4gICAge1xuICAgICAgdHJ5IHtcbiAgICAgICAgdGhpcy5oaXN0b3J5LnB1c2hTdGF0ZShzdGF0ZU9iaiwgdGl0bGUsIHBhcnNlZFVSTCk7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGlmKHRoaXMuZGV2bW9kZSkge1xuICAgICAgICAgIGNvbnNvbGUud2FybigncHVzaCBmYWlsZWQgd2hpbGUgdHJ5aW5nIHRvIHB1c2ggdGhlIHN0YXRlIHRvIHRoZSBoaXN0b3J5IG9iamVjdCcpO1xuICAgICAgICAgIGNvbnNvbGUubG9nKGUpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICAvLyBPdGhlcndpc2VyLCBhZGQgdGhlIFVSTCBhcyBhIGhhc2hiYW5nXG4gICAgfSBlbHNlXG4gICAge1xuICAgICAgd2luZG93LmxvY2F0aW9uLmhhc2ggPSBgIyEke1VSTH1gO1xuICAgIH1cblxuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgLyoqXG4gICAqIFRha2VzIHRoZSB1c2VyIGJhY2sgdG8gdGhlIHByZXZpb3VzIHN0YXRlLiBTaW1wbHkgd3JhcHMgdGhlIGhpc3Rvcnkgb2JqZWN0J3MgYmFjayBtZXRob2QuXG4gICAqXG4gICAqIEBwdWJsaWNcbiAgICovXG4gIHN0YXRpYyBiYWNrKCkge1xuICAgIHRoaXMuaGlzdG9yeS5iYWNrKCk7XG4gIH1cblxuICAvKipcbiAgICogVGFrZXMgdGhlIHVzZXIgZm9yd2FyZCB0byB0aGUgbmV4dCBzdGF0ZS4gU2ltcGx5IHdyYXBzIHRoZSBoaXN0b3J5IG9iamVjdCdzIGZvcndhcmQgbWV0aG9kLlxuICAgKlxuICAgKiBAcHVibGljXG4gICAqL1xuICBzdGF0aWMgZm9yd2FyZCgpIHtcbiAgICB0aGlzLmhpc3RvcnkuZm9yd2FyZCgpO1xuICB9XG5cblxuICAvKipcbiAgICogUHJpdmF0ZSBtZXRob2RzXG4gICAqL1xuXG4gIC8qKlxuICAgKiBUYWtlcyBhIHByb3ZpZGVkIFVSTCBhbmQgcmV0dXJucyB0aGUgdmVyc2lvbiB0aGF0IGlzIHVzYWJsZVxuICAgKlxuICAgKiBAcHJpdmF0ZVxuICAgKiBAcGFyYW0gIHtzdHJpbmd9IFVSTCAgICAgICAgICAgICAgICAgICAgIFRoZSBVUkwgdG8gYmUgcGFzc2VkXG4gICAqIEBwYXJhbSAge2Jvb2xlYW59IGluY2x1ZGVEb2NSb290ID0gdHJ1ZSAgV2hldGhlciB0byBpbmNsdWRlIHRoZSBkb2Nyb290IG9uIHRoZSBwYXNzZWQgVVJMXG4gICAqIEBwYXJhbSAge2Jvb2xlYW59IGluY2x1ZGVUcmFpbHMgPSB0cnVlICAgV2hldGhlciB0byBpbmNsdWRlIGZvdW5kIGhhc2hlcyBhbmQgcGFyYW1zXG4gICAqIEByZXR1cm4ge3N0cmluZ30gICAgICAgICAgICAgICAgICAgICAgICAgVGhlIHBhc3NlZCBhbmQgZm9ybWF0dGVkIFVSTFxuICAgKi9cbiAgc3RhdGljIF9maXhVUkwoVVJMLCBpbmNsdWRlRG9jUm9vdCA9IHRydWUsIGluY2x1ZGVUcmFpbHMgPSB0cnVlKSB7XG5cbiAgICB2YXIgcnRuVVJMO1xuXG4gICAgLyoqXG4gICAgICogVVJMIFJlZ2V4IHdvcmtzIGxpa2UgdGhpczpcbiAgICAgKiBgYGBcbiAgICAgICAgXlxuICAgICAgICAoW146XSs6Ly8gICAgICAgICAgICMgSFRUUChTKSBldGMuXG4gICAgICAgICAgICAoW14vXSspICAgICAgICAgIyBUaGUgVVJMIChpZiBhdmFpbGFibGUpXG4gICAgICAgICk/XG4gICAgICAgICgje0Bkb2N1bWVudFJvb3R9KT8gIyBUaGUgZG9jdW1lbnQgcm9vdCwgd2hpY2ggd2Ugd2FudCB0byBnZXQgcmlkIG9mXG4gICAgICAgICgvKT8gICAgICAgICAgICAgICAgIyBjaGVjayBmb3IgdGhlIHByZXNlbmNlIG9mIGEgbGVhZGluZyBzbGFzaFxuICAgICAgICAoW15cXCNcXD9dKikgICAgICAgICAgIyBUaGUgVVJJIC0gdGhpcyBpcyB3aGF0IHdlIGNhcmUgYWJvdXQuIENoZWNrIGZvciBldmVyeXRoaW5nIGV4Y2VwdCBmb3IgIyBhbmQgP1xuICAgICAgICAoXFw/W15cXCNdKik/ICAgICAgICAgIyBhbnkgYWRkaXRpb25hbCBVUkwgcGFyYW1ldGVycyAob3B0aW9uYWwpXG4gICAgICAgIChcXCNcXCE/LispPyAgICAgICAgICAjIEFueSBoYXNoYmFuZyB0cmFpbGVycyAob3B0aW9uYWwpXG4gICAgICogYGBgXG4gICAgICovXG4gICAgY29uc3QgVVJMUmVnZXggPSBSZWdFeHAoYF4oW146XSs6Ly8oW14vXSspKT8oJHt0aGlzLmRvY3VtZW50Um9vdH0pPygvKT8oW15cXFxcI1xcXFw/XSopKFxcXFw/W15cXFxcI10qKT8oXFxcXCNcXFxcIT8uKyk/YCk7XG4gICAgY29uc3QgW2lucHV0LCBocmVmLCBob3N0bmFtZSwgZG9jdW1lbnRSb290LCByb290LCBwYXRoLCBwYXJhbXMsIGhhc2hiYW5nXSA9IFVSTFJlZ2V4LmV4ZWMoVVJMKTtcblxuICAgIGNvbnNvbGUubG9nKHRoaXMuZG9jdW1lbnRSb290LCBkb2N1bWVudFJvb3QsIHJvb3QsIHBhdGgpO1xuXG4gICAgLy8gSWYgd2UncmUgb2JzZXJ2aW5nIHRoZSBUTEROIHJlc3RyYWludCBhbmQgdGhlIHByb3ZpZGVkIFVSTCBkb2Vzbid0IG1hdGNoXG4gICAgLy8gdGhlIGRvbWFpbidzIFRMRE4sIHRocm93IGEgVVJJRXJyb3JcbiAgICBpZiggdHlwZW9mIGhvc3RuYW1lID09PSAnc3RyaW5nJyAmJiBob3N0bmFtZSAhPT0gdGhpcy5UTEROICYmIHRoaXMub2JzZXJ2ZVRMRE4gPT09IHRydWUgKSB7XG4gICAgICB0aHJvdyBuZXcgVVJJRXJyb3IoJ1RvcCBMZXZlbCBkb21haW4gbmFtZSBNVVNUIG1hdGNoIHRoZSBwcmltYXJ5IGRvbWFpbiBuYW1lJyk7XG4gICAgfVxuXG4gICAgLy8gSWYgb3VyIG1hdGNoZWQgVVJMIGhhcyBhIGxlYWRpbmcgc2xhc2gsIHRoZW4gd2Ugd2FudCB0byBkcm9wIHRoZSBkb2NSb290XG4gICAgLy8gaW4gdGhlcmUgdW5sZXNzIHRoZSBmdW5jdGlvbiBwYXJhbSBcImluY2x1ZGVEb2NSb290XCIgaXMgZmFsc2UuXG4gICAgaWYoXG4gICAgICAoIHR5cGVvZiByb290ID09PSAnc3RyaW5nJyAmJiByb290ID09PSAnLycgKSB8fFxuICAgICAgKCB0eXBlb2YgZG9jdW1lbnRSb290ID09PSAnc3RyaW5nJyAmJiBkb2N1bWVudFJvb3QgPT09IHRoaXMuZG9jdW1lbnRSb290IClcbiAgICApIHtcbiAgICAgIGlmKCBpbmNsdWRlRG9jUm9vdCApIHtcbiAgICAgICAgcnRuVVJMID0gYCR7dGhpcy5kb2N1bWVudFJvb3R9LyR7cGF0aH1gO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcnRuVVJMID0gYC8ke3BhdGh9YDtcbiAgICAgIH1cbiAgICAvLyBFbHNlIGlmIHBhdGggaGFzIHJlc3VsdGVkIGluIGFuIGVtcHR5IHN0cmluZywgYXNzdW1lIHRoZSBwYXRoIGlzIHRoZSByb290XG4gICAgfSBlbHNlIGlmKCBwYXRoID09PSAnJyApIHtcbiAgICAgIHJ0blVSTCA9ICcvJ1xuICAgIC8vIE90aGVyd2lzZSwganVzdCBwYXNzIHRoZSBwYXRoIGNvbXBsZXRlbHkuXG4gICAgfSBlbHNlIHtcbiAgICAgIHJ0blVSTCA9IHBhdGg7XG4gICAgfVxuXG4gICAgLy8gSWYgd2Ugd2FudCB0byBpbmNsdWRlIHRyYWlscyAoaGFzaGVzIGFuZCBwYXJhbXMsIGFzIGRldGVybWluZWQgYnkgYVxuICAgIC8vIGZ1bmNpdG9uIHBhcmFtKSwgdGhlbiBhZGQgdGhlbSB0byB0aGUgVVJMLlxuICAgIGlmKCBpbmNsdWRlVHJhaWxzICkge1xuICAgICAgLy8gQXBwZW5kIGFueSBwYXJhbXNcbiAgICAgIGlmKCB0eXBlb2YgcGFyYW1zID09ICdzdHJpbmcnICkge1xuICAgICAgICBydG5VUkwgKz0gcGFyYW1zO1xuICAgICAgfVxuICAgICAgICAvLyBBcHBlbmQgYW55IGhhc2hlc1xuICAgICAgaWYoIHR5cGVvZiBoYXNoYmFuZyA9PSAnc3RyaW5nJyApIHtcbiAgICAgICAgcnRuVVJMICs9IGhhc2hiYW5nO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBydG5VUkw7XG4gIH1cblxuICAvKipcbiAgICogTGlzdGVuZXIgZm9yIHRoZSBwb3BzdGF0ZSBtZXRob2RcbiAgICpcbiAgICogQHByaXZhdGVcbiAgICogQHBhcmFtICB7b2JqZWN0fSBlIHRoZSBwYXNzZWQgZXZlbnQgb2JqZWN0XG4gICAqIEByZXR1cm4gdm9pZFxuICAgKi9cbiAgc3RhdGljIF9wb3BzdGF0ZShlKSB7XG4gICAgdmFyIGJhc2UsIHN0YXRlO1xuICAgIGlmKHRoaXMuc3VwcG9ydClcbiAgICB7XG4gICAgICB0cnkge1xuICAgICAgICBzdGF0ZSA9IChiYXNlID0gdGhpcy5oaXN0b3J5KS5zdGF0ZSB8fCAoYmFzZS5zdGF0ZSA9IGUuc3RhdGUgfHwgKGUuc3RhdGUgPSB3aW5kb3cuZXZlbnQuc3RhdGUpKTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlcnMgYW5kIHNldHRlcnNcbiAgICovXG5cbiAgLyoqXG4gICAqIChnZXR0ZXIvc2V0dGVyKSBTZXRzIHRoZSBkb2N1bWVudCByb290IGZyb20gYSBwYXNzZWQgVVJMXG4gICAqIHJldHVybnMgdGhlIHNhdmVkIGRvY3VtZW50IHJvb3Qgb3IgYSBgL2AgaWYgbm90IHNldFxuICAgKlxuICAgKiBAZGVmYXVsdCAnLydcbiAgICogQHR5cGUge3N0cmluZ31cbiAgICovXG4gIHN0YXRpYyBzZXQgZG9jdW1lbnRSb290KGRvY3VtZW50Um9vdCA9ICcnKSB7XG5cbiAgICAvKipcbiAgICAgKiBkb2Nyb290UmVnZXggd29ya3MgbGlrZSB0aGlzOlxuICAgICAqIGBgYFxuICAgICAgICAgXlxuICAgICAgICAgKFteOl0rOi8vICAgICAgICMgSFRUUChTKSBldGMuXG4gICAgICAgICAgICAgKFteL10rKSAgICAgIyBUaGUgaG9zdG5hbWUgKGlmIGF2YWlsYWJsZSlcbiAgICAgICAgICk/XG4gICAgICAgICAvP1xuICAgICAgICAgKC4qKD89LykpPyAgICAgICMgdGhlIFVSSSB0byB1c2UgYXMgdGhlIGRvY3Jvb3QgbGVzcyBhbnkgYXZhaWxhYmxlIHRyYWlsaW5nIHNsYXNoXG4gICAgICogYGBgXG4gICAgICovXG4gICAgY29uc3QgZG9jcm9vdFJlZ2V4ID0gL14oW146XSs6XFwvXFwvKFteXFwvXSspKT9cXC8/KC4qKD89XFwvKSk/LztcbiAgICAvLyBwYXNzIHRoZSBkb2Nyb290IGFuZCBob3N0bmFtZVxuICAgIGNvbnN0IFtfMSwgXzIsIGhvc3RuYW1lLCBkb2Nyb290XSA9IGRvY3Jvb3RSZWdleC5leGVjKGRvY3VtZW50Um9vdCk7XG4gICAgY29uc29sZS5sb2coaG9zdG5hbWUsIGRvY3Jvb3QpO1xuXG4gICAgLy8gRXJyb3IgY2hlY2tcbiAgICAvLyBjaGVjayBmb3IgdGhlIHByZXNlbmNlIG9mIHRoZSByZXBvcnRlZCBUTEROXG4gICAgaWYoXG4gICAgICB0eXBlb2YgaG9zdG5hbWUgPT09ICdzdHJpbmcnICYmXG4gICAgICBob3N0bmFtZSAhPSB0aGlzLlRMRE4gJiZcbiAgICAgIHRoaXMub2JzZXJ2ZVRMRE4gPT09IHRydWVcbiAgICApIHtcbiAgICAgIHRocm93IG5ldyBVUklFcnJvcignVG9wIExldmVsIGRvbWFpbiBuYW1lIE1VU1QgbWF0Y2ggdGhlIHByaW1hcnkgZG9tYWluIG5hbWUnKTtcbiAgICB9XG5cbiAgICB0aGlzLl9kb2N1bWVudFJvb3QgPSBgLyR7ZG9jcm9vdH1gO1xuICB9XG4gIHN0YXRpYyBnZXQgZG9jdW1lbnRSb290KCkge1xuICAgIHJldHVybiB0aGlzLl9kb2N1bWVudFJvb3QgfHwgJy8nO1xuICB9XG5cbiAgLyoqXG4gICAqIChnZXR0ZXIvc2V0dGVyKSBQcm92aWRlcyBhbiBlcnJvciBpZiB0aGUgdXNlciB0cmllcyB0byBzZXQgdGhlIGhpc3Rvcnkgb2JqZWN0XG4gICAqIHJldHVybnMgdGhlIHdpbmRvdyBoaXN0b3J5IG9iamVjdFxuICAgKlxuICAgKiBAdHlwZSB7b2JqZWN0fVxuICAgKi9cbiAgc3RhdGljIHNldCBoaXN0b3J5KGhpc3RvcnkpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ1RoZSBoaXN0b3J5IG9iamVjdCBpcyByZWFkIG9ubHknKTtcbiAgfVxuICBzdGF0aWMgZ2V0IGhpc3RvcnkoKSB7XG4gICAgcmV0dXJuIHdpbmRvdy5oaXN0b3J5O1xuICB9XG5cbiAgLyoqXG4gICAqIChnZXR0ZXIvc2V0dGVyKSBTZXRzIHRoZSB0b3AgbGV2ZWwgZG9tYWluIG5hbWUuXG4gICAqIHJldHVybnMgdGhlIHJlY29yZGVkIFRMRE4gb3IsIGJ5IGRlZmF1bHQsIHdpbmRvdy5sb2NhdGlvbi5ob3N0bmFtZS5cbiAgICpcbiAgICogQHR5cGUge3N0cmluZ31cbiAgICovXG4gIHN0YXRpYyBzZXQgVExETihUTEROKSB7XG4gICAgLy8gQG5vdGUgV2Ugc2hvdWxkIGluY2x1ZGUgc29tZSBlcnJvciBjaGVja2luZyBpbiBoZXJlXG4gICAgdGhpcy5fVExETiA9IFRMRE47XG4gIH1cbiAgc3RhdGljIGdldCBUTEROKCkge1xuICAgIHJldHVybiB0aGlzLl9UTEROIHx8IHdpbmRvdy5sb2NhdGlvbi5ob3N0bmFtZTtcbiAgfVxuXG4gIC8qKlxuICAgKiAoZ2V0dGVyL3NldHRlcikgd2hldGhlciB0byBvYnNlcnZlIHRoZSBUTEROIG9yIGB0cnVlYCAoZGVmYXVsdCkuXG4gICAqXG4gICAqIEBkZWZhdWx0IHRydWVcbiAgICogQHR5cGUge2Jvb2xlYW59XG4gICAqL1xuICBzdGF0aWMgc2V0IG9ic2VydmVUTEROKG9ic2VydmUpIHtcbiAgICAvLyBDaGVjayB0byBtYWtlIHN1cmUgdGhhdCB0aGUgYmFzc2VkIHZhbHVlIGlzIG9mIHR5cGUgYm9vbGVhbi5cbiAgICBpZih0eXBlb2Ygb2JzZXJ2ZSA9PT0gJ2Jvb2xlYW4nKVxuICAgIHtcbiAgICAgIHRoaXMuX29ic2VydmVUTEROID0gb2JzZXJ2ZTtcbiAgICB9IGVsc2VcbiAgICB7XG4gICAgICBjb25zb2xlLndhcm4oJ29ic2VydmVUTEROIG11c3QgYmUgb2YgdHlwZSBib29sZWFuJyk7XG4gICAgfVxuICB9XG4gIHN0YXRpYyBnZXQgb2JzZXJ2ZVRMRE4oKSB7XG4gICAgaWYodHlwZW9mIHRoaXMuX29ic2VydmVUTEROID09PSAnYm9vbGVhbicpXG4gICAge1xuICAgICAgcmV0dXJuIHRoaXMuX29ic2VydmVUTEROO1xuICAgIH0gZWxzZVxuICAgIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiAoZ2V0dGVyL3NldHRlcikgV2hldGhlciB0aGlzIGhpc3Rvcnkgb2JqZWN0IGlzIGluIGRldm1vZGUuIERlZmF1bHRzIHRvIGZhbHNlXG4gICAqXG4gICAqIEBkZWZhdWx0IGZhbHNlXG4gICAqIEB0eXBlIHtib29sZWFufVxuICAgKi9cbiAgc3RhdGljIHNldCBkZXZtb2RlKGRldm1vZGUpIHtcbiAgICAvLyBDaGVjayB0byBtYWtlIHN1cmUgdGhhdCB0aGUgYmFzc2VkIHZhbHVlIGlzIG9mIHR5cGUgYm9vbGVhbi5cbiAgICBpZih0eXBlb2YgZGV2bW9kZSA9PT0gJ2Jvb2xlYW4nKVxuICAgIHtcbiAgICAgIHRoaXMuX2Rldm1vZGUgPSBkZXZtb2RlO1xuICAgIH0gZWxzZVxuICAgIHtcbiAgICAgIGNvbnNvbGUud2FybignZGV2bW9kZSBtdXN0IGJlIG9mIHR5cGUgYm9vbGVhbicpO1xuICAgIH1cbiAgfVxuICBzdGF0aWMgZ2V0IGRldm1vZGUoKSB7XG4gICAgaWYodHlwZW9mIHRoaXMuX2Rldm1vZGUgPT09ICdib29sZWFuJylcbiAgICB7XG4gICAgICByZXR1cm4gdGhpcy5fZGV2bW9kZTtcbiAgICB9IGVsc2VcbiAgICB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIChnZXR0ZXIvc2V0dGVyKSBXaGV0aGVyIHRoaXMgaGlzdG9yeSBvYmplY3QgaXMgaW5pdGlhbGlhc2VkLlxuICAgKlxuICAgKiBAZGVmYXVsdCBmYWxzZVxuICAgKiBAdHlwZSB7Ym9vbGVhbn1cbiAgICovXG4gIHN0YXRpYyBzZXQgaW5pdGlhbGlhc2VkKGluaXRpYWxpYXNlZCkge1xuICAgIC8vIENoZWNrIHRvIG1ha2Ugc3VyZSB0aGF0IHRoZSBiYXNzZWQgdmFsdWUgaXMgb2YgdHlwZSBib29sZWFuLlxuICAgIGlmKHR5cGVvZiBpbml0aWFsaWFzZWQgPT09ICdib29sZWFuJylcbiAgICB7XG4gICAgICB0aGlzLl9pbml0aWFsaWFzZWQgPSBpbml0aWFsaWFzZWQ7XG4gICAgfSBlbHNlXG4gICAge1xuICAgICAgY29uc29sZS53YXJuKCdpbml0aWFsaWFzZWQgbXVzdCBiZSBvZiB0eXBlIGJvb2xlYW4nKTtcbiAgICB9XG4gIH1cbiAgc3RhdGljIGdldCBpbml0aWFsaWFzZWQoKSB7XG4gICAgaWYodHlwZW9mIHRoaXMuX2luaXRpYWxpYXNlZCA9PT0gJ2Jvb2xlYW4nKVxuICAgIHtcbiAgICAgIHJldHVybiB0aGlzLl9pbml0aWFsaWFzZWQ7XG4gICAgfSBlbHNlXG4gICAge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiAoZ2V0dGVyL3NldHRlcikgV2hldGhlciBoaXN0b3J5IGlzIHN1cHBvcnRlZCBieSB0aGUgYnJvd3NlciBvciBkZXZpY2UuXG4gICAqIFByb3ZpZGVzIGFuIGVycm9yIGlmIHRoZSB1c2VyIHRyaWVzIHRvIHNldCB0aGUgc3VwcG9ydCB2YWx1ZSwgdW5sZXNzIHRoZSBvYmplY3QgaXMgaW4gZGV2bW9kZVxuICAgKlxuICAgKiBAdHlwZSB7Ym9vbGVhbn1cbiAgICovXG4gIHN0YXRpYyBzZXQgc3VwcG9ydChzdXBwb3J0ID0gZmFsc2UpIHtcbiAgICAvLyBUaGlzIG92ZXJyaWRlc1xuICAgIGlmKCB0aGlzLmRldm1vZGUgJiYgdHlwZW9mIHN1cHBvcnQgPT09ICdib29sZWFuJyApIHtcbiAgICAgIHRoaXMuX3N1cHBvcnQgPSBzdXBwb3J0O1xuICAgIH1cbiAgICB0aHJvdyBuZXcgRXJyb3IoJ1RoZSBzdXBwb3J0IGlzIHJlYWQgb25seScpO1xuICB9XG4gIHN0YXRpYyBnZXQgc3VwcG9ydCgpIHtcbiAgICByZXR1cm4gKHdpbmRvdy5oaXN0b3J5ICYmIHdpbmRvdy5oaXN0b3J5LnB1c2hTdGF0ZSk7XG4gIH1cblxuICAvKipcbiAgICogKGdldHRlci9zZXR0ZXIpIFRoZSBsZW5ndGggb2YgdGhlIGhpc3Rvcnkgc3RhY2tcbiAgICpcbiAgICogQHR5cGUge2ludGVnZXJ9XG4gICAqL1xuICBzdGF0aWMgZ2V0IGxlbmd0aCgpIHtcbiAgICByZXR1cm4gdGhpcy5oaXN0b3J5Lmxlbmd0aDtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBIaXN0b3J5O1xuIl19
