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

  // Listen for errors
  var listener = function listener(e) {
    console.log(e.detail);
    e.target.removeEventListener(e.type, arguments.callee);
  };
  document.addEventListener("ajax-get-error", listener);

  // AJAX.resolveTimeout = 1000; // Remove this when not in dev mode

  // This is a manual initialisation of links and is, instead, a demonstration
  // of how programatic AJAX retrieval works.
  window.addEventListener('load', function (e) {
    document.getElementById('link_1').addEventListener('click', function (e) {
      _wtcAjax.AJAX.ajaxGet("/demo/page1.html", "#link1-target", ".link1-selection", e.target).then(function (resolver) {
        console.log('onLoad', resolver);
        return resolver;
      }).catch(function (e) {
        alert(e);
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

/**
 * Extends a base object with a series of other objects.
 *
 * @example
 * objA = {a: '1', b: '2', c: '3'};
 * objB = {d: {a: 'x', b: 'y', c: 'z'}};
 * objC = {b: 'foo'};

 * objD = utilities.deepExtend({}, objA, objB, objC);
 * // Outputs:
 * // [object Object] {
 * // a: "1",
 * // b: "foo",
 * // c: "3",
 * // d: [object Object] {
 * //   a: "x",
 * //   b: "y",
 * //   c: "z"
 * // }
}
 *
 * @static
 * @param  {...Object}   object      The objects to extend. The first object in the list will be the default.
 * @return {Object}                  The extended object in full.
 */
utilities.deepExtend = function () {

  if (Object.assign) {
    return Object.assign.apply(Object, arguments);
  }

  // This is here for older browsers
  var out = arguments[0] || {};
  var i = 0;
  var key = null;

  while (i++ < arguments.length) {
    var obj = arguments[i];
    if (obj && (typeof obj === "undefined" ? "undefined" : _typeof(obj)) == 'object') {
      for (key in obj) {
        if (obj.hasOwnProperty(key)) {
          if (_typeof(obj[key]) == 'object' && obj[key] != null) {
            out[key] = utilities.deepExtend(out[key], obj[key]);
          } else {
            out[key] = obj[key];
          }
        }
      }
    }
  }

  return out;
};

/**
 * Returns the CSS selector for a provided element
 *
 * @static
 * @param  {DOMElement}   el         The DOM node to find a selector for
 * @return {String}                  The CSS selector the describes exactly where to find the element
 */
utilities.getSelectorForElement = function (el) {
  var particles = [];
  while (el.parentNode) {
    if (el.id) {
      particles.unshift('#' + el.id);
      break;
    } else {
      if (el == el.ownerDocument.documentElement) particles.unshift(el.tagName);else {
        for (var c = 1, e = el; e.previousElementSibling; e = e.previousElementSibling, c++) {}
        particles.unshift(el.tagName + ":nth-child(" + c + ")");
      }
      el = el.parentNode;
    }
  }
  return particles.join(" > ");
};

exports.default = utilities;
},{}],3:[function(require,module,exports){
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
 * @param   {HTMLElement} node    The node to detect the transition time for.
 * @param   {Number}      [depth] How deep to test for transitions, defaults to null, which means no depth limitation
 * @return  {Number}              The full transition time for the node, including delays, in milliseconds
 */
var detectAnimationEndTime = function detectAnimationEndTime(node) {
  var depth = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

  var fulltime = 0;
  var timeRegex = /(\d+\.?(\d+)?)(s|ms)/;
  var currentDepth = 0;
  var maxDepth = typeof depth === 'number' && depth >= 0 ? depth : -1;
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
    if (maxDepth > -1) {
      if (currentDepth++ < maxDepth) {
        if (el.childNodes) {
          for (var i in el.childNodes) {
            recursiveLoop(el.childNodes[i]);
          }
        }
      }
    } else {
      if (el.childNodes) {
        for (var i in el.childNodes) {
          recursiveLoop(el.childNodes[i]);
        }
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
 * @param  {Number}       [depth]   How deep to test for transitions, defaults to null, which means no depth limitation
 * @return {Promise}                A promise that represents the animation timeout.
 * @return {timerResolve}           The resolve method. Passes the coerced variables (if any) from the listening object back to the chain.
 * @return {timerReject}            The reject method. Null.
 */
var addEndEventListener = function addEndEventListener(node, listener, depth) {
  if (typeof listener !== 'function') {
    var listener = function listener() {
      return {};
    };
  }
  return new Promise(function (resolve, reject) {
    var time = detectAnimationEndTime(node, depth);
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
  addEndEventListener: addEndEventListener,
  detectAnimationEndTime: detectAnimationEndTime
};

exports.default = Animation;

},{}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.History = exports.STATES = exports.ERRORS = exports.AJAX = undefined;

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

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } // import 'babel-polyfill';


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
};
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

      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = links[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var link = _step.value;

          // Removing this attribute ensures that this link doesn't get a second AJAX listener attached to it.
          link.removeAttribute(this.attributeAjax);

          link.addEventListener('click', function (e) {
            _this2._triggerAjaxLink(e);

            e.preventDefault();
          });
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }
    }

    /**
     * The resolving object. This is the object that is passed to AJAX GET promise thens
     * and should be passed onto subsequent THENable calls.
     *
     * @typedef {Object}                     AJAXGetResolver
     * @property {string}       response     The response from the AJAX call
     * @property {AJAXDocument} document     The document nodes resulting from this call.
     * @property {array}        arguments    The arguments array originally passed to the {@link AJAX.ajaxGet} method
     * @property {DOMElement}   linkTarget   The target element that fired the {@link AJAX.ajaxGet}
     */
    /**
     * This is the output of all eventual AJAX calls. This object represents the result
     * of the AJAX call and contains both the full HTML document and the selected subdoc.
     *
     * @typedef {Object}              AJAXDocument
     * @property {DOMElement} doc     The full document node for the AJAX GET result
     * @property {NodeList}   subdoc  The subdocument derived from the main document
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
          console.warn("Tried to run an AJAX GET when the object wasn't in OK or CLICKED mode. State (currently: " + this.state + ") should be less than " + STATES.CLICKED);
        }

        return;
      }

      var currentTime = new Date();
      if (this.devmode) {
        console.log("%c Starting Ajax GET. Setting time to 0 ", 'background: #666; color: #FFF');
      }

      // Retrieve a request object and construct a valid URL
      var req = this.requestObject;
      var parsedURL = this._fixURL(URL);
      var DOMTarget = document.querySelectorAll(target)[0];

      var readyState = 0;
      var status = 0;
      var args = arguments;
      var transClass = this.classBaseTransition;

      var transitionRun = false;
      var loadRun = false;
      var resolver = null;

      var catcher = function (err) {
        this.emitEvent('ajax-get-error', { readyState: readyState, statusm: req.statusm, err: err });
        this._error(readyState, req.status, err || 0);
      }.bind(this);

      // @todo need to add proper error checking here.

      // Modify the classes on the containing element
      _wtcUtilityHelpers2.default.removeClass(transClass + '-in', DOMTarget);
      _wtcUtilityHelpers2.default.removeClass(transClass + '-in-start', DOMTarget);
      _wtcUtilityHelpers2.default.removeClass(transClass + '-in-end', DOMTarget);
      _wtcUtilityHelpers2.default.removeClass(transClass + '-in-finish', DOMTarget);
      _wtcUtilityHelpers2.default.addClass(transClass + '-out-start', DOMTarget);
      _wtcUtilityHelpers2.default.addClass(transClass + '-out', DOMTarget);
      setTimeout(function () {
        _wtcUtilityHelpers2.default.addClass(transClass + '-out-end', DOMTarget);
      }, 0);
      // Add the animation end listener to the target node
      // This just sets transition run to true
      // Dev mode output
      if (this.devmode) {
        var animationTime = _wtcAnimationEvents2.default.detectAnimationEndTime(DOMTarget, this.animationDepth);
        console.log("%c Animation out time is: " + animationTime + "ms", 'background: #888; color: #FFF');
      }
      _wtcAnimationEvents2.default.addEndEventListener(DOMTarget, null, this.animationDepth).then(function () {

        if (this.devmode) {
          var diffInTime = new Date() - currentTime;
          console.log("%c Transition out has completed after: " + diffInTime + "ms", 'background: #666; color: #FFF');
        }

        transitionRun = true;

        // Emit the document loaded event with the resolving
        this.emitEvent('ajax-get-animationOutRun', { DOMTarget: DOMTarget });
      }.bind(this)).catch(catcher);

      var requestPromise = new Promise(function handler(resolve, reject) {
        var _this3 = this;

        // Listen for the ready state
        req.addEventListener('readystatechange', function (e) {

          if (_this3.devmode) {
            var diffInTime = new Date() - currentTime;
            console.log("%c Document load readtState has changed to " + readyState + " after: " + diffInTime + "ms", 'background: #666; color: #FFF');
          }

          readyState = e.target.readyState;
          status = e.target.status;
        });

        // Listem for the load event
        req.addEventListener('load', function (e) {
          // If we have a ready state that indicated that the load was a success, continue
          if (req.status >= 200 && req.status < 400) {

            if (_this3.devmode) {
              var diffInTime = new Date() - currentTime;
              console.log("%c Document has loaded after: " + diffInTime + "ms", 'background: #666; color: #FFF');
            }

            // Get the request response text
            var responseText = req.responseText;
            // Get the AJAXDocument
            var AJAXDocument = _this3._parseResponse(responseText, target, selection, fromPop, linkTarget);
            // Build the resolver
            var resolver = {
              responseText: responseText,
              document: AJAXDocument,
              arguments: args,
              linkTarget: linkTarget || null,
              DOMTarget: DOMTarget
            };
            resolve(resolver);
          } else {
            reject(ERRORS.LOAD_ERROR);
          }
        });

        req.addEventListener('error', function (e) {
          reject(ERRORS.LOAD_ERROR);
        });
      }.bind(this)).catch(catcher);

      // This promise takes the returned promise and runs the equivalent of a "finally"
      Promise.resolve(requestPromise).
      // THEN: Responsible for testing whether the transition has run, this
      // alleviates a race condition between the document loading and the
      // transition OUT completion.
      then(function (resolver) {
        if (resolver.error) {
          throw resolver.error;
        } else if (!resolver.responseText) {
          throw ERRORS.BAD_PROMISE;
        } else {

          // load run is done, so set the variable to true
          loadRun = true;

          // Resolve Promise to test, on interval, whether the transition has
          // completed. When it has, resolve the promise.
          var resolve = new Promise(function (resolve, reject) {
            var testInterval = null;
            var testResolved = function () {
              if (transitionRun === true) {
                if (this.devmode) {
                  var diffInTime = new Date() - currentTime;
                  console.log("%c Document has loaded AND transition OUT has run after: " + diffInTime + "ms", 'background: #666; color: #FFF');
                }
                // Clear the interval
                clearInterval(testInterval);

                setTimeout(function () {
                  resolve(resolver);
                }, this.resolveTimeout);
              }
            }.bind(this);

            testInterval = setInterval(testResolved, 50);
          }.bind(this));

          // Emit the document loaded event with the resolving
          this.emitEvent('ajax-get-documentLoaded', resolver);

          return resolve;
        }
      }.bind(this)).
      // THEN: responsible for adding the final content to the main document. Returns a promise that identifies the transition
      then(function (resolver) {
        try {} catch (e) {}
        // Find the target node
        var targetNode = resolver.DOMTarget;
        // Modify its classes
        _wtcUtilityHelpers2.default.removeClass(this.classBaseTransition + '-out-finish', targetNode);
        _wtcUtilityHelpers2.default.removeClass(this.classBaseTransition + '-out-end', targetNode);
        _wtcUtilityHelpers2.default.removeClass(this.classBaseTransition + '-out', targetNode);
        _wtcUtilityHelpers2.default.addClass(transClass + '-in', DOMTarget);
        _wtcUtilityHelpers2.default.addClass(transClass + '-in-start', DOMTarget);
        setTimeout(function () {
          _wtcUtilityHelpers2.default.addClass(transClass + '-in-end', DOMTarget);
        }, 0);
        // Finally. Parse the result
        try {
          this._completeTransfer(resolver.document, targetNode, selection, fromPop);
        } catch (e) {
          throw e;
        }
        // Emit an event
        // @todo document this.
        this.emitEvent('ajax-get-addedToDom', { doc: resolver.document, targetNode: targetNode, selection: selection });
        // Add the animation end listener to the target node
        if (this.devmode) {
          var _animationTime = _wtcAnimationEvents2.default.detectAnimationEndTime(targetNode, this.animationDepth);
          console.log("%c Animation in time is: " + _animationTime + "ms", 'background: #888; color: #FFF');
        }
        return _wtcAnimationEvents2.default.addEndEventListener(targetNode, function () {
          return resolver;
        }, this.animationDepth);
      }.bind(this)).
      // THEN: Responsible for tidying everything up
      then(function (resolver) {
        // Find the target node
        var targetNode = resolver.DOMTarget;
        // Modify its classes
        _wtcUtilityHelpers2.default.removeClass(this.classBaseTransition + '-in', targetNode);
        _wtcUtilityHelpers2.default.removeClass(this.classBaseTransition + '-in-start', targetNode);
        _wtcUtilityHelpers2.default.removeClass(this.classBaseTransition + '-in-end', targetNode);
        _wtcUtilityHelpers2.default.addClass(this.classBaseTransition + '-in-finish', targetNode);
        // Emit the finally response
        this.emitEvent('ajax-get-finally', { targetNode: targetNode });

        if (this.devmode) {
          var diffInTime = new Date() - currentTime;
          console.log("%c Document load and transition IN is complete after: " + diffInTime + "ms", 'background: #666; color: #FFF');
        }
      }.bind(this)).catch(catcher);

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
     * @typedef {Object}              AJAXDocument
     * @property {DOMElement} doc     The full document node for the AJAX GET result
     * @property {NodeList}   subdoc  The subdocument derived from the main document
     */

    /**
     * This responds to the ajax load event and is responsible for building the result,
     * injecting it into the page, running callbacks and detecting and delaying
     * transitions and animations as necessary/
     *
     * @static
     * @private
     * @param  {string} content           The loaded page content, this comes from the AJAX call.
     * @param  {string} target            The target for the loaded content. This can be a string (selector), or a JSON array of selector strings.
     * @param  {string} selection         This is a selector that determines what to cut from the loaded content.
     * @param  {DOMElement} [linkTarget]  The target of the link. This is useful for setting active states in callback.
     * @return {AJAXDocument}             An object representing both the main document and the subdocument
     */

  }, {
    key: "_parseResponse",
    value: function _parseResponse(content, target, selection) {

      var doc, subdoc, results;

      // Parse the document from the content provided
      doc = document.createElement('div');
      doc.innerHTML = content;

      if (selection === SELECTORS.CHILDREN) {
        subdoc = doc.querySelectorAll(target + " > *");
      } else {
        subdoc = doc.querySelectorAll(selection);
      }

      return {
        doc: doc,
        subdoc: subdoc
      };
    }

    /**
     * This completes the transition of content. This removes the old content and adds the new
     *
     * @static
     * @private
     * @param  {AJAXDocument} content    The DOM nodes to add to the element
     * @param  {DOMNode}      target     The target to add the new content to
     * @param  {string}       selection  This is a selector that determines what to cut from the loaded content.
     * @param  {boolean}      fromPop    Indicates that this load is from a history pop
     */

  }, {
    key: "_completeTransfer",
    value: function _completeTransfer(content, target, selection, fromPop) {

      var oldTitle = document.title,
          newTitle,
          targetNodes;

      // Find the new page title
      newTitle = content.doc.getElementsByTagName('title')[0].text;

      target.innerHTML = '';

      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = Array.from(content.subdoc)[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var result = _step2.value;

          target.appendChild(result.cloneNode(true));
        }

        // Update the internal reference to the last target
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2.return) {
            _iterator2.return();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }

      this.lastChangedTarget = _wtcUtilityHelpers2.default.getSelectorForElement(target);

      if (!fromPop) {
        // Push the new state to the history.
        this.push(this.lastParsedURL, newTitle, { target: _wtcUtilityHelpers2.default.getSelectorForElement(target), selection: selection });
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
     * *.wtc-transition-out-finish*
     * *.wtc-transition-in*
     * *.wtc-transition-in-start*
     * *.wtc-transition-in-end*
     * *.wtc-transition-in-finish*
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

    /**
     * The depth to check for transitions. This is to allow you to set the
     * depth to check for transitions on based on deep transitions that are longer
     * or have a much larger delay than intended.
     *
     * @return {number}  The depth to check for transitions
     * @default null
     */

  }, {
    key: "animationDepth",
    set: function set(depth) {
      var _depth = Math.abs(depth);
      if (typeof _depth === 'number' && !isNaN(_depth)) {
        this._animationDepth = _depth;
      }
    },
    get: function get() {
      return this._animationDepth || null;
    }
  }]);

  return AJAX;
}(_wtcHistory2.default);

exports.AJAX = AJAX;
exports.ERRORS = ERRORS;
exports.STATES = STATES;
exports.History = _wtcHistory2.default;

},{"./wtc-AnimationEvents":3,"./wtc-history":5,"wtc-utility-helpers":2}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// Custom Event polyfill
// @todo We should probably move this out somewhere else
(function () {

  if (typeof window.CustomEvent === "function") return false;

  function CustomEvent(event, params) {
    params = params || { bubbles: false, cancelable: false, detail: undefined };
    var evt = document.createEvent('CustomEvent');
    evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
    return evt;
  }

  CustomEvent.prototype = window.Event.prototype;

  window.CustomEvent = CustomEvent;
})();

/**
 * Class representing an abstraction of the history API.
 * @static
 * @namespace
 * @author Liam Egan <liam@wethecollective.com>
 * @version 0.9
 * @created Nov 19, 2016
 */

var History = function () {
  function History() {
    _classCallCheck(this, History);
  }

  _createClass(History, null, [{
    key: 'emitEvent',


    /**
     * Public methods
     */

    /**
     * Emits an event from the history object
     *
     * @example
     * let listener = function(e) {
     *   console.log(e.detail)
     *   e.target.removeEventListener(e.type, arguments.callee);
     * }
     * document.addEventListener("ajax-get-addedToDom", listener);
     *
     * @param  {string} eventID   the event ID to emit
     * @param  {object} data = {} the data to include with the event
     */

    value: function emitEvent(eventID) {
      var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      if (window.CustomEvent) {
        var event = new CustomEvent(eventID, { detail: data });
      } else {
        var event = document.createEvent('CustomEvent');
        event.initCustomEvent(eventID, true, true, data);
      }

      document.dispatchEvent(event);
    }

    /**
      * Initialises the History class. Nothing should be able to
      * operate here unless this has run with a support = true.
      *
      * @Public
      * @param {boolean}  devmode Indicated whether the object is running in dev mode (will log outputs to console)
      * @return {boolean}         Returns whether init ran or not
      */

  }, {
    key: 'init',
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
     * @example
     * AJAXObj.push('/dev/foo/bar', 'The title for the history object')
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
          // console.log(stateObj);
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
          console.log(e);
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


      if (/^\/?$/.test(documentRoot)) {
        this._documentRoot = '/';
        return;
      }

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

      if (docroot) {
        this._documentRoot = '/' + docroot;
      }
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
    key: '$length',
    get: function get() {
      return this.history.length;
    }
  }]);

  return History;
}();

exports.default = History;

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJkZW1vL3J1bi5qcyIsIm5vZGVfbW9kdWxlcy93dGMtdXRpbGl0eS1oZWxwZXJzL2Rpc3Qvd3RjLXV0aWxpdHktaGVscGVycy5qcyIsInNyYy93dGMtQW5pbWF0aW9uRXZlbnRzLmpzIiwic3JjL3d0Yy1hamF4LmpzIiwic3JjL3d0Yy1oaXN0b3J5LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUNBQTs7QUFFQTtBQUNBLGNBQUssSUFBTCxDQUFVLElBQVY7QUFDQTtBQUNBLGNBQUssWUFBTCxHQUFvQixRQUFwQjs7QUFFQSxTQUFTLEtBQVQsQ0FBZSxFQUFmLEVBQW1CO0FBQ2pCLE1BQUksU0FBUyxVQUFULElBQXVCLFNBQTNCLEVBQXNDO0FBQ3BDO0FBQ0QsR0FGRCxNQUVPO0FBQ0wsYUFBUyxnQkFBVCxDQUEwQixrQkFBMUIsRUFBOEMsRUFBOUM7QUFDRDtBQUNGOztBQUVELE1BQU0sWUFDTjtBQUNFO0FBQ0EsZ0JBQUssU0FBTDs7QUFFQTtBQUNBLE1BQUksV0FBVyxTQUFYLFFBQVcsQ0FBUyxDQUFULEVBQVk7QUFDekIsWUFBUSxHQUFSLENBQVksRUFBRSxNQUFkO0FBQ0EsTUFBRSxNQUFGLENBQVMsbUJBQVQsQ0FBNkIsRUFBRSxJQUEvQixFQUFxQyxVQUFVLE1BQS9DO0FBQ0QsR0FIRDtBQUlBLFdBQVMsZ0JBQVQsQ0FBMEIsZ0JBQTFCLEVBQTRDLFFBQTVDOztBQUVBOztBQUVBO0FBQ0E7QUFDQSxTQUFPLGdCQUFQLENBQXdCLE1BQXhCLEVBQWdDLFVBQVMsQ0FBVCxFQUFZO0FBQzFDLGFBQVMsY0FBVCxDQUF3QixRQUF4QixFQUFrQyxnQkFBbEMsQ0FBbUQsT0FBbkQsRUFBNEQsVUFBUyxDQUFULEVBQVk7QUFDdEUsb0JBQ0UsT0FERixDQUNVLGtCQURWLEVBQzhCLGVBRDlCLEVBQytDLGtCQUQvQyxFQUNtRSxFQUFFLE1BRHJFLEVBRUUsSUFGRixDQUVPLFVBQVMsUUFBVCxFQUFtQjtBQUN0QixnQkFBUSxHQUFSLENBQVksUUFBWixFQUFzQixRQUF0QjtBQUNBLGVBQU8sUUFBUDtBQUNELE9BTEgsRUFLSyxLQUxMLENBS1csVUFBUyxDQUFULEVBQVk7QUFDbkIsY0FBTSxDQUFOO0FBQ0QsT0FQSDtBQVFELEtBVEQ7QUFVRCxHQVhEO0FBWUQsQ0E1QkQ7O0FBOEJBLE9BQU8sT0FBUDs7O0FDN0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FB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ZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImltcG9ydCB7IEFKQVggfSBmcm9tIFwiLi4vc3JjL3d0Yy1hamF4XCI7XG5cbi8vIEluaXRpYWxpc2UgdGhlIGhpc3Rvcnkgb2JqZWN0IGluIGRldiBtb2RlXG5BSkFYLmluaXQodHJ1ZSk7XG4vLyBTZXQgdGhlIGRvY3VtZW50IHJvb3QgZm9yIHRoZSBhcHBsaWNhdGlvbiAoaWYgbmVjZXNzYXJ5KVxuQUpBWC5kb2N1bWVudFJvb3QgPSAnL2RlbW8vJztcblxuZnVuY3Rpb24gcmVhZHkoZm4pIHtcbiAgaWYgKGRvY3VtZW50LnJlYWR5U3RhdGUgIT0gJ2xvYWRpbmcnKSB7XG4gICAgZm4oKTtcbiAgfSBlbHNlIHtcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgZm4pO1xuICB9XG59XG5cbnJlYWR5KGZ1bmN0aW9uKClcbntcbiAgLy8gVGhpcyBpbml0aWFsaXNlcyBhbnkgbGlua3Mgd2l0aCBBSkFYIGF0dHJpYnV0ZXNcbiAgQUpBWC5pbml0TGlua3MoKTtcblxuICAvLyBMaXN0ZW4gZm9yIGVycm9yc1xuICBsZXQgbGlzdGVuZXIgPSBmdW5jdGlvbihlKSB7XG4gICAgY29uc29sZS5sb2coZS5kZXRhaWwpXG4gICAgZS50YXJnZXQucmVtb3ZlRXZlbnRMaXN0ZW5lcihlLnR5cGUsIGFyZ3VtZW50cy5jYWxsZWUpO1xuICB9XG4gIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJhamF4LWdldC1lcnJvclwiLCBsaXN0ZW5lcik7XG5cbiAgLy8gQUpBWC5yZXNvbHZlVGltZW91dCA9IDEwMDA7IC8vIFJlbW92ZSB0aGlzIHdoZW4gbm90IGluIGRldiBtb2RlXG5cbiAgLy8gVGhpcyBpcyBhIG1hbnVhbCBpbml0aWFsaXNhdGlvbiBvZiBsaW5rcyBhbmQgaXMsIGluc3RlYWQsIGEgZGVtb25zdHJhdGlvblxuICAvLyBvZiBob3cgcHJvZ3JhbWF0aWMgQUpBWCByZXRyaWV2YWwgd29ya3MuXG4gIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgZnVuY3Rpb24oZSkge1xuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdsaW5rXzEnKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uKGUpIHtcbiAgICAgIEFKQVguXG4gICAgICAgIGFqYXhHZXQoXCIvZGVtby9wYWdlMS5odG1sXCIsIFwiI2xpbmsxLXRhcmdldFwiLCBcIi5saW5rMS1zZWxlY3Rpb25cIiwgZS50YXJnZXQpLlxuICAgICAgICB0aGVuKGZ1bmN0aW9uKHJlc29sdmVyKSB7XG4gICAgICAgICAgY29uc29sZS5sb2coJ29uTG9hZCcsIHJlc29sdmVyKTtcbiAgICAgICAgICByZXR1cm4gcmVzb2x2ZXI7XG4gICAgICAgIH0pLmNhdGNoKGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICBhbGVydChlKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG4gIH0pO1xufSk7XG5cbndpbmRvdy5BSkFYT2JqID0gQUpBWDtcbiIsIlwidXNlIHN0cmljdFwiO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuXG52YXIgX3R5cGVvZiA9IHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiB0eXBlb2YgU3ltYm9sLml0ZXJhdG9yID09PSBcInN5bWJvbFwiID8gZnVuY3Rpb24gKG9iaikgeyByZXR1cm4gdHlwZW9mIG9iajsgfSA6IGZ1bmN0aW9uIChvYmopIHsgcmV0dXJuIG9iaiAmJiB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgb2JqLmNvbnN0cnVjdG9yID09PSBTeW1ib2wgJiYgb2JqICE9PSBTeW1ib2wucHJvdG90eXBlID8gXCJzeW1ib2xcIiA6IHR5cGVvZiBvYmo7IH07XG5cbnZhciB1dGlsaXRpZXMgPSB7fTtcblxuLyoqXG4gKiByYW5kb21CZXR3ZWVuXG4gKiBHZW5lcmF0ZSBhIHJhbmRvbSBpbnRlZ2VyIG51bWJlciBtYXggYW5kIG1pbi5cbiAqIEBtaW4ge251bWJlcn0gTWluaW11bSB2YWx1ZS5cbiAqIEBtYXgge251bWJlcn0gTWF4aW11bSB2YWx1ZS5cbiAqIHJldHVybiB7bnVtYmVyfSBSYW5kb20gaW50ZWdlci5cbiAqL1xudXRpbGl0aWVzLnJhbmRvbUJldHdlZW4gPSBmdW5jdGlvbiAobWluLCBtYXgpIHtcbiAgcmV0dXJuIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIChtYXggLSBtaW4gKyAxKSArIG1pbik7XG59O1xuXG4vKipcbiAqIGdldFN0eWxlXG4gKiBHZXQgdGhlIGN1cnJlbnQgc3R5bGUgdmFsdWUgZnJvbSBhbiBlbGVtZW50LlxuICogQGVsIHtET01Ob2RlfSBUYXJnZXQgZWxlbWVudC5cbiAqIEBwcm9wIHtzdHJpbmd9IENTUyBwcm9wZXJ0eSBuYW1lLlxuICogQHN0cmlwVW5pdCB7Ym9vbGVhbn0gUmVtb3ZlIHVuaXRzLlxuICogcmV0dXJuIHtzdHJpbmd9IEN1cnJlbnQgQ1NTIHZhbHVlIFdJVEggdW5pdC5cbiAqL1xudXRpbGl0aWVzLmdldFN0eWxlID0gZnVuY3Rpb24gKGVsLCBwcm9wLCBzdHJpcFVuaXQpIHtcbiAgdmFyIHN0clZhbHVlID0gXCJcIjtcblxuICBpZiAod2luZG93LmdldENvbXB1dGVkU3R5bGUpIHtcbiAgICBzdHJWYWx1ZSA9IGdldENvbXB1dGVkU3R5bGUoZWwpLmdldFByb3BlcnR5VmFsdWUocHJvcCk7XG4gIH1cbiAgLy9JRVxuICBlbHNlIGlmIChlbC5jdXJyZW50U3R5bGUpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIHN0clZhbHVlID0gZWwuY3VycmVudFN0eWxlW3Byb3BdO1xuICAgICAgfSBjYXRjaCAoZSkge31cbiAgICB9XG5cbiAgaWYgKHN0cmlwVW5pdCkge1xuICAgIHN0clZhbHVlID0gcGFyc2VJbnQoc3RyVmFsdWUpO1xuICB9XG5cbiAgcmV0dXJuIHN0clZhbHVlO1xufTtcblxuLyoqXG4gKiBMb2dcbiAqIFNpbXBsZSBsb2cgZnVuY3Rpb24gdG8gc2hvdyBkaWZmZXJlbnQgY29sb3JzIG9uIHRoZSBjb25zb2xlLlxuICogQHN0YXR1cyB7c3RyaW5nfSBTdGF0dXMgdHlwZS5cbiAqIEBtc2cge3N0cmluZ30gTWVzc2FnZSB0byBzaG93LlxuICovXG51dGlsaXRpZXMubG9nID0gZnVuY3Rpb24gKHN0YXR1cywgbXNnKSB7XG4gIHZhciBiZ2MsIGNvbG9yO1xuXG4gIHN3aXRjaCAoc3RhdHVzKSB7XG4gICAgY2FzZSBcInN1Y2Nlc3NcIjpcbiAgICAgIGNvbG9yID0gXCJHcmVlblwiO1xuICAgICAgYmdjID0gXCJMaW1lR3JlZW5cIjtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJpbmZvXCI6XG4gICAgICBjb2xvciA9IFwiRG9kZ2VyQmx1ZVwiO1xuICAgICAgYmdjID0gXCJUdXJxdW9pc2VcIjtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJlcnJvclwiOlxuICAgICAgY29sb3IgPSBcIkJsYWNrXCI7XG4gICAgICBiZ2MgPSBcIlJlZFwiO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcIndhcm5pbmdcIjpcbiAgICAgIGNvbG9yID0gXCJUb21hdG9cIjtcbiAgICAgIGJnYyA9IFwiR29sZFwiO1xuICAgICAgYnJlYWs7XG4gICAgZGVmYXVsdDpcbiAgICAgIGNvbG9yID0gXCJibGFja1wiO1xuICAgICAgYmdjID0gXCJXaGl0ZVwiO1xuICB9XG5cbiAgaWYgKCh0eXBlb2YgbXNnID09PSBcInVuZGVmaW5lZFwiID8gXCJ1bmRlZmluZWRcIiA6IF90eXBlb2YobXNnKSkgPT09IFwib2JqZWN0XCIpIHtcbiAgICBjb25zb2xlLmxvZyhtc2cpO1xuICB9IGVsc2Uge1xuICAgIGNvbnNvbGUubG9nKFwiJWNcIiArIG1zZywgXCJjb2xvcjpcIiArIGNvbG9yICsgXCI7Zm9udC13ZWlnaHQ6Ym9sZDsgYmFja2dyb3VuZC1jb2xvcjogXCIgKyBiZ2MgKyBcIjtcIik7XG4gIH1cbn07XG5cbi8qKlxuICogb25jZVxuICogRmlyZXMgYW4gZXZlbnQgb25seSBvbmNlIGFuZCBleGVjdXRlcyB0aGUgY2FsbGJhY2suXG4gKiBAbm9kZSB7RE9NRWxlbWVudH0gRG9tIGVsZW1lbnQgdG8gYXR0YWNoIGV2ZW50LlxuICogQHR5cGUge1N0cmluZ30gVHlwZSBvZiBldmVudC5cbiAqIEBjYWxsYmFjayB7ZnVuY3Rpb259IENhbGxiYWNrLlxuICovXG51dGlsaXRpZXMub25jZSA9IGZ1bmN0aW9uIChub2RlLCB0eXBlLCBjYWxsYmFjaykge1xuICBub2RlLmFkZEV2ZW50TGlzdGVuZXIodHlwZSwgZnVuY3Rpb24gKGUpIHtcbiAgICBlLnRhcmdldC5yZW1vdmVFdmVudExpc3RlbmVyKGUudHlwZSwgYXJndW1lbnRzLmNhbGxlZSk7XG4gICAgcmV0dXJuIGNhbGxiYWNrKGUpO1xuICB9KTtcbn07XG5cbi8qKlxuICogc2h1ZmZsZUFycmF5XG4gKiBTaHVmZmxlIGFuIGFycmF5LlxuICogQGFycmF5IEFycnJheSB0byBiZSBzaHVmZmxlZC5cbiAqIHJldHVybiB7YXJyYXl9IFNodWZmbGVkIGFycmF5LlxuICovXG51dGlsaXRpZXMuc2h1ZmZsZUFycmF5ID0gZnVuY3Rpb24gKGFycmF5KSB7XG4gIHZhciBjdXJyZW50SW5kZXggPSBhcnJheS5sZW5ndGgsXG4gICAgICB0ZW1wb3JhcnlWYWx1ZSxcbiAgICAgIHJhbmRvbUluZGV4O1xuXG4gIC8vIFdoaWxlIHRoZXJlIHJlbWFpbiBlbGVtZW50cyB0byBzaHVmZmxlLi4uXG4gIHdoaWxlICgwICE9PSBjdXJyZW50SW5kZXgpIHtcblxuICAgIC8vIFBpY2sgYSByZW1haW5pbmcgZWxlbWVudC4uLlxuICAgIHJhbmRvbUluZGV4ID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogY3VycmVudEluZGV4KTtcbiAgICBjdXJyZW50SW5kZXggLT0gMTtcblxuICAgIC8vIEFuZCBzd2FwIGl0IHdpdGggdGhlIGN1cnJlbnQgZWxlbWVudC5cbiAgICB0ZW1wb3JhcnlWYWx1ZSA9IGFycmF5W2N1cnJlbnRJbmRleF07XG4gICAgYXJyYXlbY3VycmVudEluZGV4XSA9IGFycmF5W3JhbmRvbUluZGV4XTtcbiAgICBhcnJheVtyYW5kb21JbmRleF0gPSB0ZW1wb3JhcnlWYWx1ZTtcbiAgfVxuXG4gIHJldHVybiBhcnJheTtcbn07XG5cbi8qKlxuICogZmlyZUN1c3RvbUV2ZW50XG4gKiBGaXJlIGEgY3VzdG9tIGV2ZW50LlxuICogQG5hbWUge3N0cmluZ30gTmFtZSBvZiB0aGUgZXZlbnQuXG4gKiBAZGF0YSB7b2JqZWN0fSBPYmplY3QgdG8gYmUgcGFzc2VkIHRvIHRoZSBldmVudC5cbiAqL1xudXRpbGl0aWVzLmZpcmVDdXN0b21FdmVudCA9IGZ1bmN0aW9uIChuYW1lLCBkYXRhLCBidWJibGVzLCBjYW5jZWxhYmxlKSB7XG4gIHZhciBldjtcbiAgdmFyIHBhcmFtcyA9IHtcbiAgICBidWJibGVzOiBidWJibGVzIHx8IHRydWUsXG4gICAgY2FuY2VsYWJsZTogY2FuY2VsYWJsZSB8fCB0cnVlLFxuICAgIGRldGFpbDogZGF0YSB8fCBudWxsXG4gIH07XG5cbiAgaWYgKHR5cGVvZiB3aW5kb3cuQ3VzdG9tRXZlbnQgPT09IFwiZnVuY3Rpb25cIikge1xuICAgIGV2ID0gbmV3IEN1c3RvbUV2ZW50KG5hbWUsIHBhcmFtcyk7XG4gIH0gZWxzZSB7XG4gICAgZXYgPSBkb2N1bWVudC5jcmVhdGVFdmVudCgnQ3VzdG9tRXZlbnQnKTtcbiAgICBldi5pbml0Q3VzdG9tRXZlbnQobmFtZSwgcGFyYW1zLmJ1YmJsZXMsIHBhcmFtcy5jYW5jZWxhYmxlLCBwYXJhbXMuZGV0YWlsKTtcbiAgfVxuXG4gIHdpbmRvdy5kaXNwYXRjaEV2ZW50KGV2KTtcbn07XG5cbi8qKlxuICogZm9yRWFjaE5vZGVcbiAqIExvb3AgdGhyb3VnaCBhbmQgYXJyYXkgb2YgRE9NIGVsZW1lbnRzLlxuICogQGFycmF5IHtET00gTm9kZSBMaXN0fSBMaXN0IG9mIGVsZW1lbnRzLlxuICogQGNhbGxiYWNrIHtmdW5jdGlvbn0gQ2FsbGJhY2suXG4gKiBAc2NvcGUgKm9wdGlvbmFsIHtmdW5jdGlvbn0gU2NvcGUgdG8gcGFzcyB0byBjYWxsYmFjay5cbiAqL1xudXRpbGl0aWVzLmZvckVhY2hOb2RlID0gZnVuY3Rpb24gKGFycmF5LCBjYWxsYmFjaywgc2NvcGUpIHtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcnJheS5sZW5ndGg7IGkrKykge1xuICAgIGNhbGxiYWNrLmNhbGwoc2NvcGUsIGksIGFycmF5W2ldKTsgLy8gcGFzc2VzIGJhY2sgc3R1ZmYgd2UgbmVlZFxuICB9XG59O1xuXG4vKipcbiAqIGdldEVsZW1lbnRQb3NpdGlvblxuICogR2V0IHRoZSBwb3NpdGlvbiBvZiB0aGUgZWxlbWVudCByZWxhdGl2ZSB0byBkb2N1bWVudC5cbiAqIEBlbGVtZW50IHtET00gTm9kZX0gRWxlbWVudC5cbiAqIHJldHVybnMgT2JqZWN0IHdpdGggZWxlbWVudCBjb29yZGluYXRlcy5cbiAqL1xudXRpbGl0aWVzLmdldEVsZW1lbnRQb3NpdGlvbiA9IGZ1bmN0aW9uIChlbGVtZW50KSB7XG4gIHZhciBwb3NpdGlvblRvVmlld3BvcnQgPSBlbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuXG4gIHZhciBzY3JvbGxUb3AgPSB3aW5kb3cucGFnZVlPZmZzZXQ7XG4gIHZhciBzY3JvbGxMZWZ0ID0gd2luZG93LnBhZ2VYT2Zmc2V0O1xuXG4gIHZhciBjbGllbnRUb3AgPSBkb2N1bWVudC5ib2R5LmNsaWVudFRvcCB8fCAwO1xuICB2YXIgY2xpZW50TGVmdCA9IGRvY3VtZW50LmJvZHkuY2xpZW50TGVmdCB8fCAwO1xuXG4gIHZhciB0b3AgPSBwb3NpdGlvblRvVmlld3BvcnQudG9wICsgc2Nyb2xsVG9wIC0gY2xpZW50VG9wO1xuICB2YXIgbGVmdCA9IHBvc2l0aW9uVG9WaWV3cG9ydC5sZWZ0ICsgc2Nyb2xsTGVmdCAtIGNsaWVudExlZnQ7XG5cbiAgcmV0dXJuIHtcbiAgICB0b3A6IE1hdGgucm91bmQodG9wKSxcbiAgICBsZWZ0OiBNYXRoLnJvdW5kKGxlZnQpXG4gIH07XG59O1xuXG4vKipcbiAqIGdldFZpZXdwb3J0RGltZW5zaW9uc1xuICogR2V0IHRoZSBicm93c2VyIHdpbmRvdyBzaXplLlxuICogcmV0dW5zIE9iamVjdCB3aXRoIGRpbWVuc2lvbnMuXG4gKi9cbnV0aWxpdGllcy5nZXRWaWV3cG9ydERpbWVuc2lvbnMgPSBmdW5jdGlvbiAoKSB7XG4gIHJldHVybiB7XG4gICAgd2lkdGg6IE1hdGgubWF4KGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGllbnRXaWR0aCwgd2luZG93LmlubmVyV2lkdGggfHwgMCksXG4gICAgaGVpZ2h0OiBNYXRoLm1heChkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xpZW50SGVpZ2h0LCB3aW5kb3cuaW5uZXJIZWlnaHQgfHwgMClcbiAgfTtcbn07XG5cbi8qKlxuICogY2xhc3NFeHRlbmRcbiAqIEV4dGVuZHMgYSBwYXJlbnQgY2xhc3MuXG4gKiBAY2hpbGQge2Z1bmN0aW9ufSBDaGlsZCBjbGFzcy5cbiAqIEBwYXJlbnQge2Z1bmN0aW9ufSBQYXJlbnQgY2xhc3MuXG4gKiByZXR1cm5zIHVwZGF0ZWQgQ2hpbGQgY2xhc3M7XG4gKi9cbnV0aWxpdGllcy5jbGFzc0V4dGVuZCA9IGZ1bmN0aW9uIChjaGlsZCwgcGFyZW50KSB7XG4gIHZhciBoYXNQcm9wID0ge30uaGFzT3duUHJvcGVydHk7XG5cbiAgZm9yICh2YXIga2V5IGluIHBhcmVudCkge1xuICAgIGlmIChoYXNQcm9wLmNhbGwocGFyZW50LCBrZXkpKSBjaGlsZFtrZXldID0gcGFyZW50W2tleV07XG4gIH1cblxuICBmdW5jdGlvbiBjdG9yKCkge1xuICAgIHRoaXMuY29uc3RydWN0b3IgPSBjaGlsZDtcbiAgfVxuXG4gIGN0b3IucHJvdG90eXBlID0gcGFyZW50LnByb3RvdHlwZTtcbiAgY2hpbGQucHJvdG90eXBlID0gbmV3IGN0b3IoKTtcbiAgY2hpbGQuX19zdXBlcl9fID0gcGFyZW50LnByb3RvdHlwZTtcblxuICByZXR1cm4gY2hpbGQ7XG59O1xuXG4vKipcbiAqIEhhc0NsYXNzXG4gKiBDaGVja3MgZm9yIGNsYXNzIG9uIGVsZW1lbnQuXG4gKiBAY2wge3N0cmluZ30gTmFtZXMuIFlvdSBjYW4gc3BsaXQgdGhlIG5hbWVzIHdpdGggYSBzcGFjZVxuICogQGUge0RPTSBFbGVtZW50fSBFbGVtZW50XG4gKi9cbnV0aWxpdGllcy5oYXNDbGFzcyA9IGZ1bmN0aW9uIChjbCwgZSkge1xuXG4gIHZhciBjLCBjbGFzc2VzLCBpLCBqLCBsZW4sIGxlbjE7XG4gIGNsYXNzZXMgPSBjbC5zcGxpdCgnICcpO1xuXG4gIGlmIChlLmNsYXNzTGlzdCkge1xuICAgIGZvciAoaSA9IDAsIGxlbiA9IGNsYXNzZXMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgIGMgPSBjbGFzc2VzW2ldO1xuICAgICAgaWYgKGUuY2xhc3NMaXN0LmNvbnRhaW5zKGMpID09PSB0cnVlKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBmb3IgKGogPSAwLCBsZW4xID0gY2xhc3Nlcy5sZW5ndGg7IGogPCBsZW4xOyBqKyspIHtcbiAgICAgIGMgPSBjbGFzc2VzW2pdO1xuICAgICAgaWYgKG5ldyBSZWdFeHAoJyhefCApJyArIGMgKyAnKCB8JCknLCAnZ2knKS50ZXN0KGUuYykpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGZhbHNlO1xufTtcblxuLyoqXG4gKiBSZW1vdmVDbGFzc1xuICogUmVtb3ZlIGNsYXNzIGZyb20gZWxlbWVudC5cbiAqIEBjIHtzdHJpbmd9IG5hbWUgb2YgdGhlIGNsYXNzXG4gKiBAZSB7RE9NIEVsZW1lbnR9IEVsZW1lbnRcbiAqL1xudXRpbGl0aWVzLnJlbW92ZUNsYXNzID0gZnVuY3Rpb24gKGMsIGUpIHtcblxuICB2YXIgY2xhc3NlcywgaSwgaiwgbGVuLCBsZW4xO1xuICBjbGFzc2VzID0gYy5zcGxpdCgnICcpO1xuICBpZiAoZS5jbGFzc0xpc3QpIHtcbiAgICBmb3IgKGkgPSAwLCBsZW4gPSBjbGFzc2VzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICBjID0gY2xhc3Nlc1tpXTtcbiAgICAgIGUuY2xhc3NMaXN0LnJlbW92ZShjKTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgZm9yIChqID0gMCwgbGVuMSA9IGNsYXNzZXMubGVuZ3RoOyBqIDwgbGVuMTsgaisrKSB7XG4gICAgICBjID0gY2xhc3Nlc1tqXTtcbiAgICAgIGUuY2xhc3NOYW1lID0gZS5jbGFzc05hbWUucmVwbGFjZShuZXcgUmVnRXhwKCcoXnxcXFxcYiknICsgYy5zcGxpdCgnICcpLmpvaW4oJ3wnKSArICcoXFxcXGJ8JCknLCAnZ2knKSwgJyAnKTtcbiAgICB9XG4gIH1cbn07XG5cbi8qKlxuICogQWRkQ2xhc3NcbiAqIEFkZCBjbGFzcyB0byBlbGVtZW50LlxuICogQGMge3N0cmluZ30gTmFtZSBvZiB0aGUgY2xhc3NcbiAqIEBlIHtET00gRWxlbWVudH0gRWxlbWVudFxuICovXG51dGlsaXRpZXMuYWRkQ2xhc3MgPSBmdW5jdGlvbiAoYywgZSkge1xuXG4gIHZhciBjbGFzc2VzLCBpLCBqLCBsZW4sIGxlbjE7XG4gIGNsYXNzZXMgPSBjLnNwbGl0KCcgJyk7XG5cbiAgaWYgKGUuY2xhc3NMaXN0KSB7XG4gICAgZm9yIChpID0gMCwgbGVuID0gY2xhc3Nlcy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgYyA9IGNsYXNzZXNbaV07XG4gICAgICBlLmNsYXNzTGlzdC5hZGQoYyk7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIGZvciAoaiA9IDAsIGxlbjEgPSBjbGFzc2VzLmxlbmd0aDsgaiA8IGxlbjE7IGorKykge1xuICAgICAgYyA9IGNsYXNzZXNbal07XG4gICAgICBlLmNsYXNzTmFtZSArPSAnICcgKyBjO1xuICAgIH1cbiAgfVxufTtcblxuLyoqXG4gKiBHZXRTaWJsaW5nc1xuICogR2V0IHNpYmxpbmdzIGZyb20gZWxlbWVudFxuICogQGUge0RPTSBFbGVtZW50fSBFbGVtZW50XG4gKiBAcmV0dXJuIEFycmF5IG9mIERPTSBFbGVtZW50c1xuICovXG51dGlsaXRpZXMuZ2V0U2libGluZ3MgPSBmdW5jdGlvbiAoZSkge1xuXG4gIHJldHVybiBBcnJheS5wcm90b3R5cGUuZmlsdGVyLmNhbGwoZS5wYXJlbnROb2RlLmNoaWxkcmVuLCBmdW5jdGlvbiAoY2hpbGQpIHtcbiAgICByZXR1cm4gY2hpbGQgIT09IGU7XG4gIH0pO1xufTtcblxuLyoqXG4gKiBGdW5jdGlvbiB0byBub3JtYWxpemUgdGhlIHNlbGN0b3IgJ21hdGNoZXNTZWxlY3RvcicgYWNyb3NzIGJyb3dzZXJzXG4gKi9cbnV0aWxpdGllcy5tYXRjaGVzID0gZnVuY3Rpb24gKCkge1xuXG4gIHZhciBkb2MsIG1hdGNoZXM7XG4gIGRvYyA9IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudDtcbiAgbWF0Y2hlcyA9IGRvYy5tYXRjaGVzU2VsZWN0b3IgfHwgZG9jLndlYmtpdE1hdGNoZXNTZWxlY3RvciB8fCBkb2MubW96TWF0Y2hlc1NlbGVjdG9yIHx8IGRvYy5vTWF0Y2hlc1NlbGVjdG9yIHx8IGRvYy5tc01hdGNoZXNTZWxlY3RvcjtcblxuICByZXR1cm4gbWF0Y2hlcztcbn07XG5cbi8qKlxuICogRXh0ZW5kXG4gKiBTaW1pbGFyIHRvIGpxdWVyeS5leHRlbmQsIGl0IGFwcGVuZHMgdGhlIHByb3BlcnRpZXMgZnJvbSAnb3B0aW9ucycgdG8gZGVmYXVsdCBhbmQgb3ZlcndyaXRlIHRoZSBvbmVzIHRoYXQgYWxyZWFkeSBleGlzdCBpbiAnZGVmYXVsdHMnXG4gKiBAZGVmYXVsdHMge09iamVjdH0gRGVmYXVsdCB2YWx1ZXNcbiAqIEBvcHRpb25zIHtPYmplY3R9IE5ldyB2YWx1ZXNcbiAqL1xudXRpbGl0aWVzLmV4dGVuZCA9IGZ1bmN0aW9uIChkZWZhdWx0cywgb3B0aW9ucykge1xuXG4gIHZhciBleHRlbmRlZCA9IHt9LFxuICAgICAga2V5ID0gbnVsbDtcblxuICBmb3IgKGtleSBpbiBkZWZhdWx0cykge1xuICAgIGlmIChkZWZhdWx0cy5oYXNPd25Qcm9wZXJ0eShrZXkpKSBleHRlbmRlZFtrZXldID0gZGVmYXVsdHNba2V5XTtcbiAgfVxuXG4gIGZvciAoa2V5IGluIG9wdGlvbnMpIHtcbiAgICBpZiAob3B0aW9ucy5oYXNPd25Qcm9wZXJ0eShrZXkpKSBleHRlbmRlZFtrZXldID0gb3B0aW9uc1trZXldO1xuICB9XG5cbiAgcmV0dXJuIGV4dGVuZGVkO1xufTtcblxuLyoqXG4gKiBFeHRlbmRzIGEgYmFzZSBvYmplY3Qgd2l0aCBhIHNlcmllcyBvZiBvdGhlciBvYmplY3RzLlxuICpcbiAqIEBleGFtcGxlXG4gKiBvYmpBID0ge2E6ICcxJywgYjogJzInLCBjOiAnMyd9O1xuICogb2JqQiA9IHtkOiB7YTogJ3gnLCBiOiAneScsIGM6ICd6J319O1xuICogb2JqQyA9IHtiOiAnZm9vJ307XG5cbiAqIG9iakQgPSB1dGlsaXRpZXMuZGVlcEV4dGVuZCh7fSwgb2JqQSwgb2JqQiwgb2JqQyk7XG4gKiAvLyBPdXRwdXRzOlxuICogLy8gW29iamVjdCBPYmplY3RdIHtcbiAqIC8vIGE6IFwiMVwiLFxuICogLy8gYjogXCJmb29cIixcbiAqIC8vIGM6IFwiM1wiLFxuICogLy8gZDogW29iamVjdCBPYmplY3RdIHtcbiAqIC8vICAgYTogXCJ4XCIsXG4gKiAvLyAgIGI6IFwieVwiLFxuICogLy8gICBjOiBcInpcIlxuICogLy8gfVxufVxuICpcbiAqIEBzdGF0aWNcbiAqIEBwYXJhbSAgey4uLk9iamVjdH0gICBvYmplY3QgICAgICBUaGUgb2JqZWN0cyB0byBleHRlbmQuIFRoZSBmaXJzdCBvYmplY3QgaW4gdGhlIGxpc3Qgd2lsbCBiZSB0aGUgZGVmYXVsdC5cbiAqIEByZXR1cm4ge09iamVjdH0gICAgICAgICAgICAgICAgICBUaGUgZXh0ZW5kZWQgb2JqZWN0IGluIGZ1bGwuXG4gKi9cbnV0aWxpdGllcy5kZWVwRXh0ZW5kID0gZnVuY3Rpb24gKCkge1xuXG4gIGlmIChPYmplY3QuYXNzaWduKSB7XG4gICAgcmV0dXJuIE9iamVjdC5hc3NpZ24uYXBwbHkoT2JqZWN0LCBhcmd1bWVudHMpO1xuICB9XG5cbiAgLy8gVGhpcyBpcyBoZXJlIGZvciBvbGRlciBicm93c2Vyc1xuICB2YXIgb3V0ID0gYXJndW1lbnRzWzBdIHx8IHt9O1xuICB2YXIgaSA9IDA7XG4gIHZhciBrZXkgPSBudWxsO1xuXG4gIHdoaWxlIChpKysgPCBhcmd1bWVudHMubGVuZ3RoKSB7XG4gICAgdmFyIG9iaiA9IGFyZ3VtZW50c1tpXTtcbiAgICBpZiAob2JqICYmICh0eXBlb2Ygb2JqID09PSBcInVuZGVmaW5lZFwiID8gXCJ1bmRlZmluZWRcIiA6IF90eXBlb2Yob2JqKSkgPT0gJ29iamVjdCcpIHtcbiAgICAgIGZvciAoa2V5IGluIG9iaikge1xuICAgICAgICBpZiAob2JqLmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgICAgICBpZiAoX3R5cGVvZihvYmpba2V5XSkgPT0gJ29iamVjdCcgJiYgb2JqW2tleV0gIT0gbnVsbCkge1xuICAgICAgICAgICAgb3V0W2tleV0gPSB1dGlsaXRpZXMuZGVlcEV4dGVuZChvdXRba2V5XSwgb2JqW2tleV0pO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBvdXRba2V5XSA9IG9ialtrZXldO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiBvdXQ7XG59O1xuXG4vKipcbiAqIFJldHVybnMgdGhlIENTUyBzZWxlY3RvciBmb3IgYSBwcm92aWRlZCBlbGVtZW50XG4gKlxuICogQHN0YXRpY1xuICogQHBhcmFtICB7RE9NRWxlbWVudH0gICBlbCAgICAgICAgIFRoZSBET00gbm9kZSB0byBmaW5kIGEgc2VsZWN0b3IgZm9yXG4gKiBAcmV0dXJuIHtTdHJpbmd9ICAgICAgICAgICAgICAgICAgVGhlIENTUyBzZWxlY3RvciB0aGUgZGVzY3JpYmVzIGV4YWN0bHkgd2hlcmUgdG8gZmluZCB0aGUgZWxlbWVudFxuICovXG51dGlsaXRpZXMuZ2V0U2VsZWN0b3JGb3JFbGVtZW50ID0gZnVuY3Rpb24gKGVsKSB7XG4gIHZhciBwYXJ0aWNsZXMgPSBbXTtcbiAgd2hpbGUgKGVsLnBhcmVudE5vZGUpIHtcbiAgICBpZiAoZWwuaWQpIHtcbiAgICAgIHBhcnRpY2xlcy51bnNoaWZ0KCcjJyArIGVsLmlkKTtcbiAgICAgIGJyZWFrO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoZWwgPT0gZWwub3duZXJEb2N1bWVudC5kb2N1bWVudEVsZW1lbnQpIHBhcnRpY2xlcy51bnNoaWZ0KGVsLnRhZ05hbWUpO2Vsc2Uge1xuICAgICAgICBmb3IgKHZhciBjID0gMSwgZSA9IGVsOyBlLnByZXZpb3VzRWxlbWVudFNpYmxpbmc7IGUgPSBlLnByZXZpb3VzRWxlbWVudFNpYmxpbmcsIGMrKykge31cbiAgICAgICAgcGFydGljbGVzLnVuc2hpZnQoZWwudGFnTmFtZSArIFwiOm50aC1jaGlsZChcIiArIGMgKyBcIilcIik7XG4gICAgICB9XG4gICAgICBlbCA9IGVsLnBhcmVudE5vZGU7XG4gICAgfVxuICB9XG4gIHJldHVybiBwYXJ0aWNsZXMuam9pbihcIiA+IFwiKTtcbn07XG5cbmV4cG9ydHMuZGVmYXVsdCA9IHV0aWxpdGllczsiLCJcbi8qKlxuICogVGhpcyBtb2R1bGUgUHJvdmlkZXMgYW5pbWF0aW9uIGRldGVjdGlvbiBhbmQgcHNldWRvLWxpc3RlbmVyIGZ1bmN0aW9uYWxpdHlcbiAqXG4gKiBAbW9kdWxlIHd0Yy1BbmltYXRpb25FdmVudHNcbiAqIEBleHBvcnRzIEFuaW1hdGlvblxuICovXG5cblxuLyoqXG4gKiBUaGlzIGZ1bmN0aW9uIHRha2VzIGEgbm9kZSBhbmQgZGV0ZXJtaW5lcyB0aGUgZnVsbCBlbmQgdGltZSBvZiBhbnkgdHJhbnNpdGlvbnNcbiAqIG9uIGl0LiBSZXR1cm5zIHRoZSB0aW1lIGluIG1pbGxpc2Vjb25kcy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtICAge0hUTUxFbGVtZW50fSBub2RlICAgIFRoZSBub2RlIHRvIGRldGVjdCB0aGUgdHJhbnNpdGlvbiB0aW1lIGZvci5cbiAqIEBwYXJhbSAgIHtOdW1iZXJ9ICAgICAgW2RlcHRoXSBIb3cgZGVlcCB0byB0ZXN0IGZvciB0cmFuc2l0aW9ucywgZGVmYXVsdHMgdG8gbnVsbCwgd2hpY2ggbWVhbnMgbm8gZGVwdGggbGltaXRhdGlvblxuICogQHJldHVybiAge051bWJlcn0gICAgICAgICAgICAgIFRoZSBmdWxsIHRyYW5zaXRpb24gdGltZSBmb3IgdGhlIG5vZGUsIGluY2x1ZGluZyBkZWxheXMsIGluIG1pbGxpc2Vjb25kc1xuICovXG52YXIgZGV0ZWN0QW5pbWF0aW9uRW5kVGltZSA9IGZ1bmN0aW9uKG5vZGUsIGRlcHRoID0gbnVsbClcbntcbiAgdmFyIGZ1bGx0aW1lID0gMDtcbiAgdmFyIHRpbWVSZWdleCA9IC8oXFxkK1xcLj8oXFxkKyk/KShzfG1zKS87XG4gIHZhciBjdXJyZW50RGVwdGggPSAwO1xuICB2YXIgbWF4RGVwdGggPSAodHlwZW9mIGRlcHRoID09PSAnbnVtYmVyJyAmJiBkZXB0aCA+PSAwKSA/IGRlcHRoIDogLTE7XG4gIHZhciByZWN1cnNpdmVMb29wID0gZnVuY3Rpb24oZWwpIHtcbiAgICBpZihlbCBpbnN0YW5jZW9mIEVsZW1lbnQpIHtcbiAgICAgIHZhciB0aW1lYnJlYWtkb3duID0gdGltZVJlZ2V4LmV4ZWMod2luZG93LmdldENvbXB1dGVkU3R5bGUoZWwpLnRyYW5zaXRpb25EdXJhdGlvbilcbiAgICAgIHZhciBkZWxheWJyZWFrZG93biA9IHRpbWVSZWdleC5leGVjKHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGVsKS50cmFuc2l0aW9uRGVsYXkpXG4gICAgICB2YXIgdGltZSA9IHRpbWVicmVha2Rvd25bMV0gKiAodGltZWJyZWFrZG93blszXSA9PSAncycgPyAxMDAwIDogMSlcbiAgICAgIHZhciBkZWxheSA9IGRlbGF5YnJlYWtkb3duWzFdICogKGRlbGF5YnJlYWtkb3duWzNdID09ICdzJyA/IDEwMDAgOiAxKVxuICAgICAgaWYodGltZSArIGRlbGF5ID4gZnVsbHRpbWUpIHtcbiAgICAgICAgZnVsbHRpbWUgPSB0aW1lICsgZGVsYXlcbiAgICAgIH1cbiAgICB9XG4gICAgaWYobWF4RGVwdGggPiAtMSkge1xuICAgICAgaWYoY3VycmVudERlcHRoKysgPCBtYXhEZXB0aCkge1xuICAgICAgICBpZihlbC5jaGlsZE5vZGVzKSB7XG4gICAgICAgICAgZm9yKHZhciBpIGluIGVsLmNoaWxkTm9kZXMpIHtcbiAgICAgICAgICAgIHJlY3Vyc2l2ZUxvb3AoZWwuY2hpbGROb2Rlc1tpXSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmKGVsLmNoaWxkTm9kZXMpIHtcbiAgICAgICAgZm9yKHZhciBpIGluIGVsLmNoaWxkTm9kZXMpIHtcbiAgICAgICAgICByZWN1cnNpdmVMb29wKGVsLmNoaWxkTm9kZXNbaV0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmVjdXJzaXZlTG9vcChub2RlKTtcblxuICBpZih0eXBlb2YgZnVsbHRpbWUgIT09ICdudW1iZXInKSB7XG4gICAgZnVsbHRpbWUgPSAwO1xuICB9XG5cbiAgcmV0dXJuIGZ1bGx0aW1lO1xufVxuXG4vKipcbiAqIFRoZSByZXNvbHZpbmcgb2JqZWN0IGZvciB0aGUge0BsaW5rIHd0Yy1BbmltYXRpb25FdmVudHMuYWRkRW5kRXZlbnRMaXN0ZW5lcn1cbiAqXG4gKiBAY2FsbGJhY2sgdGltZXJSZXNvbHZlXG4gKiBAcGFyYW0ge3N0cmluZ30gcmVzcG9uc2UgICAgICAgICAgIFRoZSByZXNwb25zZSBmcm9tIHRoZSBBSkFYIGNhbGxcbiAqIEBwYXJhbSB7YXJyYXl9IGFyZ3VtZW50cyAgICAgICAgICAgVGhlIGFyZ3VtZW50cyBhcnJheSBvcmlnaW5hbGx5IHBhc3NlZCB0byB0aGUge0BsaW5rIEFKQVguYWpheEdldH0gbWV0aG9kXG4gKiBAcGFyYW0ge0RPTUVsZW1lbnR9IGxpbmtUYXJnZXQgICAgIFRoZSB0YXJnZXQgZWxlbWVudCB0aGF0IGZpcmVkIHRoZSB7QGxpbmsgQUpBWC5hamF4R2V0fVxuICovXG5cbi8qKlxuICogQWxsb3dzIHVzIHRvIGFkZCBhbiBlbmQgZXZlbnQgbGlzdGVuZXIgdG8gdGhlIG5vZGUuXG4gKlxuICogQHBhcmFtICB7SFRNTEVsZW1lbnR9ICBub2RlICAgICAgVGhlIGVsZW1lbnQgdG8gYXR0YWNoIHRoZSBlbmQgZXZlbnQgbGlzdGVuZXIgdG9cbiAqIEBwYXJhbSAge2Z1bmN0aW9ufSAgICAgbGlzdGVuZXIgIFRoZSBmdW5jdGlvbiB0byBydW4gd2hlbiB0aGUgYW5pbWF0aW9uIGlzIGZpbmlzaGVkLiBUaGlzIGFsbG93cyB1cyB0byBjb25zdHJ1Y3QgYW4gb2JqZWN0IHRvIHBhc3MgYmFjayB0aHJvdWdoIHRoZSBwcm9taXNlIGNoYWluIG9mIHRoZSBwYXJlbnQuXG4gKiBAcGFyYW0gIHtOdW1iZXJ9ICAgICAgIFtkZXB0aF0gICBIb3cgZGVlcCB0byB0ZXN0IGZvciB0cmFuc2l0aW9ucywgZGVmYXVsdHMgdG8gbnVsbCwgd2hpY2ggbWVhbnMgbm8gZGVwdGggbGltaXRhdGlvblxuICogQHJldHVybiB7UHJvbWlzZX0gICAgICAgICAgICAgICAgQSBwcm9taXNlIHRoYXQgcmVwcmVzZW50cyB0aGUgYW5pbWF0aW9uIHRpbWVvdXQuXG4gKiBAcmV0dXJuIHt0aW1lclJlc29sdmV9ICAgICAgICAgICBUaGUgcmVzb2x2ZSBtZXRob2QuIFBhc3NlcyB0aGUgY29lcmNlZCB2YXJpYWJsZXMgKGlmIGFueSkgZnJvbSB0aGUgbGlzdGVuaW5nIG9iamVjdCBiYWNrIHRvIHRoZSBjaGFpbi5cbiAqIEByZXR1cm4ge3RpbWVyUmVqZWN0fSAgICAgICAgICAgIFRoZSByZWplY3QgbWV0aG9kLiBOdWxsLlxuICovXG52YXIgYWRkRW5kRXZlbnRMaXN0ZW5lciA9IGZ1bmN0aW9uKG5vZGUsIGxpc3RlbmVyLCBkZXB0aCkge1xuICBpZih0eXBlb2YgbGlzdGVuZXIgIT09ICdmdW5jdGlvbicpXG4gIHtcbiAgICB2YXIgbGlzdGVuZXIgPSBmdW5jdGlvbigpeyByZXR1cm4ge30gfTtcbiAgfVxuICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgdmFyIHRpbWUgPSBkZXRlY3RBbmltYXRpb25FbmRUaW1lKG5vZGUsIGRlcHRoKTtcbiAgICB2YXIgdGltZW91dCA9IHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgcmV0dXJuZXIgPSBsaXN0ZW5lcigpO1xuICAgICAgcmV0dXJuZXIudGltZSA9IHRpbWU7XG4gICAgICByZXNvbHZlKHJldHVybmVyKTtcbiAgICB9LCB0aW1lKTtcbiAgfSk7XG59XG5cbi8qKlxuICogVGhlIGFuaW1hdGlvbiBvYmplY3QgZW5jYXBzdWxhdGVzIGFsbCBvZiB0aGUgYmFzaWMgZnVuY3Rpb25hbGl0eSB0aGF0IGFsbG93cyB1c1xuICogdG8gZGV0ZWN0IGFuaW1hdGlvbiBldGMuXG4gKlxuICogQGV4cG9ydFxuICovXG52YXIgQW5pbWF0aW9uID0ge1xuICBhZGRFbmRFdmVudExpc3RlbmVyOiBhZGRFbmRFdmVudExpc3RlbmVyLFxuICBkZXRlY3RBbmltYXRpb25FbmRUaW1lOiBkZXRlY3RBbmltYXRpb25FbmRUaW1lXG59O1xuXG5cbmV4cG9ydCBkZWZhdWx0IEFuaW1hdGlvbjtcbiIsIi8vIGltcG9ydCAnYmFiZWwtcG9seWZpbGwnO1xuaW1wb3J0IEhpc3RvcnkgZnJvbSBcIi4vd3RjLWhpc3RvcnlcIjtcbmltcG9ydCBBbmltYXRpb24gZnJvbSBcIi4vd3RjLUFuaW1hdGlvbkV2ZW50c1wiO1xuaW1wb3J0IF91IGZyb20gJ3d0Yy11dGlsaXR5LWhlbHBlcnMnO1xuXG5jb25zdCBTVEFURVMgPSB7XG4gICdPSycgICAgICAgICAgICAgICAgOiAwLFxuICAnQ0xJQ0tFRCcgICAgICAgICAgIDogMSxcbiAgJ0xPQURJTkcnICAgICAgICAgICA6IDIsXG4gICdUUkFOU0lUSU9OSU5HJyAgICAgOiA0LFxuICAnTE9BREVEJyAgICAgICAgICAgIDogOFxufVxuXG5jb25zdCBTRUxFQ1RPUlMgPSB7XG4gICdDSElMRFJFTicgICAgICAgICAgOiAwIC8vIFRoaXMgaW5kaWNhdGVzIHRoYXQgdGhlIHNlbGVjdGlvbiBzaG91bGQgYmUgYWxsIGNoaWxkcmVuLiBUaGlzIGFzc3VtZXMgdGhhdCB3ZSBoYXZlIGEgdmFsaWQgdGFyZ2V0IHRvIHdvcmsgd2l0aC5cbn1cblxuY29uc3QgRVJST1JTID0ge1xuICAnR0VORVJJQ19FUlJPUicgICAgIDogMCxcbiAgJ0JBRF9QUk9NSVNFJyAgICAgICA6IDEsXG4gICdMT0FEX0VSUk9SJyAgICAgICAgOiAyXG59XG5cbi8qKlxuICogQW4gQUpBWCBjbGFzcyB0aGF0IHBpY2tzIHVwIG9uIGxpbmtzIGFuZCB0dXJucyB0aGVtIGludG8gQUpBWCBsaW5rcy5cbiAqXG4gKiBUaGlzIGNsYXNzIGFzc3VtZXMgdGhhdCB5b3Ugd2FudCB0byBydW4geW91ciBBSkFYIHZpYSBodG1sIGF0dHJpYnV0ZXMgb24geW91ciBsaW5rc1xuICogYW5kIHRoYXQgeW91ciB3ZWJzaXRlIGNhbiBydW4ganVzdCBhcyB3ZWxsIHdpdGhvdXQgdGhlc2UgbGlua3MuIEl0IHNob3VsZCBhbHNvXG4gKiBwcm92aWRlIGFkZGl0aW9uYWwgZnVuY3Rpb25hbGl0eSB0aGF0IGFsbG93cyB0aGUgY2xhc3MgdG8gcnVuIHByb2dyYW1hdGljYWxseSxcbiAqIHRoZXJlYnkgZ2l2aW5nIHRoZSBwcm9ncmFtbWVyIHRoZSBhYmlsaXR5IGFuZCBvcHRpb25zIHRvIGNyZWF0ZSB0aGUgd2Vic290ZVxuICogaG93ZXZlciB0aGV5IHdhbnQgdG8uXG4gKlxuICogQHN0YXRpY1xuICogQG5hbWVzcGFjZVxuICogQGV4dGVuZHMgSGlzdG9yeVxuICogQGF1dGhvciBMaWFtIEVnYW4gPGxpYW1Ad2V0aGVjb2xsZWN0aXZlLmNvbT5cbiAqIEB2ZXJzaW9uIDAuNVxuICogQGNyZWF0ZWQgTm92IDE5LCAyMDE2XG4gKi9cbmNsYXNzIEFKQVggZXh0ZW5kcyBIaXN0b3J5IHtcblxuICAvKipcbiAgICogUHVibGljIG1ldGhvZHNcbiAgICovXG5cbiAgLyoqXG4gICAqIEluaXRpYWxpc2UgdGhlIGxpbmtzIGluIHRoZSBkb2N1bWVudC5cbiAgICpcbiAgICogVGhpcyB3aWxsIGxvb2sgdGhyb3VnaCB0aGUgbGlua3MgaW4gdGhlIGRvY3VtZW50IGFzIGRlbm90ZWQgYnkgdGhlIGF0dHJpYnV0ZUFqYXhcbiAgICogcHJvcGVydHkgYW5kIGFwcGx5IGEgY2xpY2sgbGlzdGVuZXIgdG8gaXQgdGhhdCB3aWxsIGF0dGVtcHQgdG8gZGV0ZXJtaW5lIHdoYXRcbiAgICogYW5kIGhvdyB0byBsb2FkLlxuICAgKlxuICAgKiBBIHNpbXBsZSBtZWNoYW5zaW0gZm9yIHRoaXMgd291bGQgYmUgc29tZXRoaW5nIGxpa2U6XG4gICAqIGBgYFxuICAgICA8YSBocmVmPVwicGFnZTEuaHRtbFwiXG4gICAgICAgIGRhdGEtd3RjLWFqYXg9XCJ0cnVlXCJcbiAgICAgICAgZGF0YS13dGMtYWpheC10YXJnZXQ9JyNsaW5rMi10YXJnZXQnXG4gICAgICAgIGRhdGEtd3RjLWFqYXgtc2VsZWN0aW9uPVwiLmxpbmsxLXNlbGVjdGlvblwiXG4gICAgICAgIGRhdGEtd3RjLWFqYXgtc2hvdWxkLW5hdmlnYXRlPVwiZmFsc2VcIj5MaW5rIDE8L2E+XG4gICAqIGBgYFxuICAgKlxuICAgKiBUaGUgYWR0cmlidXRlcyBlcXVhdGUgYXMgZm9sbG93czpcbiAgICogLSAoKmF0dHJpYnV0ZUFqYXgqKSAqKmRhdGEtd3RjLWFqYXgqKlxuICAgKlxuICAgKiAgICBEZW5vdGVzIHRoYXQgdGhpcyBsaW5rIGlzIGFuIEFKQVggbGluay5cbiAgICogLSAoKmF0dHJpYnV0ZVRhcmdldCopICoqZGF0YS13dGMtYWpheC10YXJnZXQqKlxuICAgKlxuICAgKiAgICBEZW5vdGVzIHRoZSB0YXJnZXQgaW50byB3aGljaCB0byBsb2FkIHRoZSByZXN1bHQuIFNob3VsZCB0YWtlIHRoZSBmb3JtIG9mIGEgc2VsZWN0b3IuXG4gICAqIC0gKCphdHRyaWJ1dGVTZWxlY3Rpb24qKSAqKmRhdGEtd3RjLWFqYXgtc2VsZWN0aW9uKipcbiAgICpcbiAgICogICAgRGVub3RlcyB0aGUgc2VsZWN0aW9uIG9mIGRhdGEgdG8gcHVsbCBmcm9tIHRoZSBsb2FkZWQgZG9jdW1lbnQuIFNob3VsZCB0YWtlIHRoZSBmb3JtIG9mIGEgc2VsZWN0b3IuXG4gICAqIC0gKCphdHRyaWJ1dGVTaG91bGROYXZpZ2F0ZSopICoqZGF0YS13dGMtYWpheC1zaG91bGQtbmF2aWdhdGUqKlxuICAgKlxuICAgKiAgICAqKlRydWUqKiAvIEZhbHNlIGFzIHRvIHdoZXRoZXIgdGhlIGxpbmsgc2hvdWxkIHVwZGF0ZSB0aGUgaGlzdG9yeSBvYmplY3QuIE9ubHkgbmVjZXNzYXJ5IGlmIGZhbHNlLlxuICAgKlxuICAgKiBJbiBhZGRpdGlvbiwgKmF0dHJpYnV0ZVRhcmdldCogYW5kICphdHRyaWJ1dGVTZWxlY3Rpb24qIGFjY2VwdCBiYXNpYyBKU09OIHN5bnRheFxuICAgKiBzbyB0aGF0IHlvdSBjYW4gbG9hZCBtb2x0aXBsZSBwaWVjZXMgb2YgY29udGVudCBmcm9tIHRoZSBzb3VyY2UuXG4gICAqXG4gICAqIEBzdGF0aWNcbiAgICogQHBhcmFtICB7RE9NRWxlbWVudH0gcm9vdERvY3VtZW50ICBUaGUgRE9NIGVsZW1lbnQgdG8gZmluZCBsaW5rcyBpbi4gRGVmYXVsdHMgdG8gYm9keS5cbiAgICovXG4gIHN0YXRpYyBpbml0TGlua3Mocm9vdERvY3VtZW50ID0gZG9jdW1lbnQuYm9keSkge1xuICAgIGNvbnN0IGxpbmtzID0gcm9vdERvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoYFske3RoaXMuYXR0cmlidXRlQWpheH09XCJ0cnVlXCJdYCk7XG5cbiAgICBmb3IgKGxldCBsaW5rIG9mIGxpbmtzKSB7XG4gICAgICAvLyBSZW1vdmluZyB0aGlzIGF0dHJpYnV0ZSBlbnN1cmVzIHRoYXQgdGhpcyBsaW5rIGRvZXNuJ3QgZ2V0IGEgc2Vjb25kIEFKQVggbGlzdGVuZXIgYXR0YWNoZWQgdG8gaXQuXG4gICAgICBsaW5rLnJlbW92ZUF0dHJpYnV0ZSh0aGlzLmF0dHJpYnV0ZUFqYXgpO1xuXG4gICAgICBsaW5rLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGUpPT4ge1xuICAgICAgICB0aGlzLl90cmlnZ2VyQWpheExpbmsoZSk7XG5cbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFRoZSByZXNvbHZpbmcgb2JqZWN0LiBUaGlzIGlzIHRoZSBvYmplY3QgdGhhdCBpcyBwYXNzZWQgdG8gQUpBWCBHRVQgcHJvbWlzZSB0aGVuc1xuICAgKiBhbmQgc2hvdWxkIGJlIHBhc3NlZCBvbnRvIHN1YnNlcXVlbnQgVEhFTmFibGUgY2FsbHMuXG4gICAqXG4gICAqIEB0eXBlZGVmIHtPYmplY3R9ICAgICAgICAgICAgICAgICAgICAgQUpBWEdldFJlc29sdmVyXG4gICAqIEBwcm9wZXJ0eSB7c3RyaW5nfSAgICAgICByZXNwb25zZSAgICAgVGhlIHJlc3BvbnNlIGZyb20gdGhlIEFKQVggY2FsbFxuICAgKiBAcHJvcGVydHkge0FKQVhEb2N1bWVudH0gZG9jdW1lbnQgICAgIFRoZSBkb2N1bWVudCBub2RlcyByZXN1bHRpbmcgZnJvbSB0aGlzIGNhbGwuXG4gICAqIEBwcm9wZXJ0eSB7YXJyYXl9ICAgICAgICBhcmd1bWVudHMgICAgVGhlIGFyZ3VtZW50cyBhcnJheSBvcmlnaW5hbGx5IHBhc3NlZCB0byB0aGUge0BsaW5rIEFKQVguYWpheEdldH0gbWV0aG9kXG4gICAqIEBwcm9wZXJ0eSB7RE9NRWxlbWVudH0gICBsaW5rVGFyZ2V0ICAgVGhlIHRhcmdldCBlbGVtZW50IHRoYXQgZmlyZWQgdGhlIHtAbGluayBBSkFYLmFqYXhHZXR9XG4gICAqL1xuICAvKipcbiAgICogVGhpcyBpcyB0aGUgb3V0cHV0IG9mIGFsbCBldmVudHVhbCBBSkFYIGNhbGxzLiBUaGlzIG9iamVjdCByZXByZXNlbnRzIHRoZSByZXN1bHRcbiAgICogb2YgdGhlIEFKQVggY2FsbCBhbmQgY29udGFpbnMgYm90aCB0aGUgZnVsbCBIVE1MIGRvY3VtZW50IGFuZCB0aGUgc2VsZWN0ZWQgc3ViZG9jLlxuICAgKlxuICAgKiBAdHlwZWRlZiB7T2JqZWN0fSAgICAgICAgICAgICAgQUpBWERvY3VtZW50XG4gICAqIEBwcm9wZXJ0eSB7RE9NRWxlbWVudH0gZG9jICAgICBUaGUgZnVsbCBkb2N1bWVudCBub2RlIGZvciB0aGUgQUpBWCBHRVQgcmVzdWx0XG4gICAqIEBwcm9wZXJ0eSB7Tm9kZUxpc3R9ICAgc3ViZG9jICBUaGUgc3ViZG9jdW1lbnQgZGVyaXZlZCBmcm9tIHRoZSBtYWluIGRvY3VtZW50XG4gICAqL1xuICAvKipcbiAgICogQ2FsbGJhY2sgZm9yIEFKQVggR0VUIG9ubG9hZC4gVGhpcyBpcyBjYWxsZWQgd2hlbiB0aGUgY29udGVudCBpcyBsb2FkZWQuXG4gICAqXG4gICAqIEBjYWxsYmFjayBsb2FkUmVzb2x2ZVxuICAgKiBAcGFyYW0ge0FKQVhHZXRSZXNvbHZlcn0gcmVzb2x2ZXIgIFRoZSByZXNvbHZpbmcgb2JqZWN0IGZvciB0aGUgQUpBWCByZXF1ZXN0XG4gICAqIEByZXR1cm4ge0FKQVhHZXRSZXNvbHZlcn0gICAgICAgICAgVGhlIG9uZ29pbmcgcmVzb2x2aW5nIG9iamVjdCBmb3IgdGhlIEFKQVggcmVxdWVzdFxuICAgKi9cbiAgLyoqXG4gICAqIENhbGxiYWNrIGZvciBBSkFYIEdFVCBlcnJvci4gVGhpcyBpcyBjYWxsZWQgd2hlbiBhbiBlcnJvciBvY2N1cnMgYWZ0ZXJcbiAgICogY2FsbGluZyBhbiBhamF4IEdFVC5cbiAgICpcbiAgICogQGNhbGxiYWNrIGxvYWRSZWplY3RcbiAgICogQHBhcmFtIHtvYmplY3R9IGVycm9yICAgICAgICAgICAgICBUaGUgZXJyb3IgdGhhdCBvY2N1cnJlZFxuICAgKiBAcGFyYW0ge2FycmF5fSBhcmdzICAgICAgICAgICAgICAgIFRoZSBhcmd1bWVudHMgdGhhdCB3ZXJlIHBhc3NlZCB0byB0aGUgcmVxdWVzdFxuICAgKiBAcGFyYW0ge0RPTUVsZW1lbnR9IFt0YXJnZXRMaW5rXSAgIFRoZSBsaW5rIHRoYXQgc3Bhd25lZCB0aGUgYWpheCByZXF1ZXN0XG4gICAqL1xuXG4gIC8qKlxuICAgKiBUaGlzIGJ1aWxkcyBvdXQgYW4gQUpBWCByZXF1ZXN0LCBub3JtYWxseSBiYXNlZCBvbiB0aGUgY2xpY2tpbmcgb2YgYSBsaW5rLFxuICAgKiBidXQgaXQgY2FuIGFsdGVybmF0aXZlbHkgYmUgY2FsbGVkIGRpcmVjdGx5IG9uIHRoZSBBSkFYIG9iamVjdC5cbiAgICpcbiAgICogQHN0YXRpY1xuICAgKiBAcGFyYW0gIHtzdHJpbmd9IFVSTCAgICAgICAgICAgICAgICAgICAgIFRoZSBVUkwgdG8gZ2V0LiBUaGlzIHdpbGwgYmUgcGFyc2VkIGludG8gYW4gYXBwcm9wcmlhdGUgZm9tYXQgYnkgdGhlIG9iamVjdC5cbiAgICogQHBhcmFtICB7c3RyaW5nfSB0YXJnZXQgICAgICAgICAgICAgICAgICBUaGUgdGFyZ2V0IGZvciB0aGUgbG9hZGVkIGNvbnRlbnQuIFRoaXMgY2FuIGJlIGEgc3RyaW5nIChzZWxlY3RvciksIG9yIGEgSlNPTiBhcnJheSBvZiBzZWxlY3RvciBzdHJpbmdzLlxuICAgKiBAcGFyYW0gIHtzdHJpbmd9IHNlbGVjdGlvbiAgICAgICAgICAgICAgIFRoaXMgaXMgYSBzZWxlY3RvciAob3IgSlNPTiBvZiBzZWxlY3RvcnMpIHRoYXQgZGV0ZXJtaW5lcyB3aGF0IHRvIGN1dCBmcm9tIHRoZSBsb2FkZWQgY29udGVudC5cbiAgICogQHBhcmFtICB7RE9NRWxlbWVudH0gW2xpbmtUYXJnZXRdICAgICAgICBUaGUgdGFyZ2V0IG9mIHRoZSBsaW5rLiBUaGlzIGlzIHVzZWZ1bCBmb3Igc2V0dGluZyBhY3RpdmUgc3RhdGVzIGluIGNhbGxiYWNrLlxuICAgKiBAcGFyYW0gIHtib29sZWFufSBmcm9tUG9wICAgICAgICAgICAgICAgIEluZGljYXRlcyB0aGF0IHRoaXMgR0VUIGlzIGZyb20gYSBwb3BcbiAgICogQHBhcmFtICB7b2JqZWN0fSBbZGF0YSA9IHt9XSAgICAgICAgICAgICBUaGUgZGF0YSB0byBwYXNzIHRvIHRoZSBBSkFYIGNhbGwuXG4gICAqIEByZXR1cm4ge1Byb21pc2V9ICAgICAgICAgICAgICAgICAgICAgICAgQSBwcm9taXNlIHRoYXQgcmVwcmVzZW50cyB0aGUgR0VULlxuICAgKiBAcmV0dXJuIHtsb2FkUmVzb2x2ZX0gICAgICAgICAgICAgICAgICAgIFRoZSByZXNvbHZlIG1ldGhvZC4gUGFzc2VzIHRoZSBsb2FkZWQgY29udGVudCBkb3duIHRocm91Z2ggaXQncyB0aGVuYWJsZXMsIGZpbmFsbHkgcmVzb2x2aW5nIHRvIHRoZSBwYXJzZSBjb21tZW5kIHZpYSBhIHNlY29uZCwgcHJpdmF0ZSBQcm9taXNlLlxuICAgKiBAcmV0dXJuIHtsb2FkUmVqZWN0fSAgICAgICAgICAgICAgICAgICAgIFRoZSByZWplY3QgbWV0aG9kLiBSZXN1bHRzIGluIGFuIGVycm9yXG4gICAqL1xuICBzdGF0aWMgYWpheEdldChVUkwsIHRhcmdldCwgc2VsZWN0aW9uLCBsaW5rVGFyZ2V0LCBmcm9tUG9wID0gZmFsc2UsIGRhdGEgPSB7fSkge1xuXG4gICAgLy8gU2V0IHRoZSBzdGF0ZSBvZiB0aGUgQUpBWCBjbGFzcyB0byBjbGlja2VkLCBpbmNpZGF0aW5nIHNvbWV0aGluZyBpcyBsb2FkaW5nXG4gICAgaWYoIHRoaXMuc3RhdGUgPiBTVEFURVMuQ0xJQ0tFRCApXG4gICAge1xuICAgICAgaWYoIHRoaXMuZGV2bW9kZSApXG4gICAgICB7XG4gICAgICAgIGNvbnNvbGUud2FybiggXCJUcmllZCB0byBydW4gYW4gQUpBWCBHRVQgd2hlbiB0aGUgb2JqZWN0IHdhc24ndCBpbiBPSyBvciBDTElDS0VEIG1vZGUuIFN0YXRlIChjdXJyZW50bHk6IFwiK3RoaXMuc3RhdGUrXCIpIHNob3VsZCBiZSBsZXNzIHRoYW4gXCIrU1RBVEVTLkNMSUNLRUQgKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGxldCBjdXJyZW50VGltZSA9IG5ldyBEYXRlKCk7XG4gICAgaWYoIHRoaXMuZGV2bW9kZSApIHtcbiAgICAgIGNvbnNvbGUubG9nKGAlYyBTdGFydGluZyBBamF4IEdFVC4gU2V0dGluZyB0aW1lIHRvIDAgYCwgJ2JhY2tncm91bmQ6ICM2NjY7IGNvbG9yOiAjRkZGJyk7XG4gICAgfVxuXG4gICAgLy8gUmV0cmlldmUgYSByZXF1ZXN0IG9iamVjdCBhbmQgY29uc3RydWN0IGEgdmFsaWQgVVJMXG4gICAgY29uc3QgcmVxID0gdGhpcy5yZXF1ZXN0T2JqZWN0O1xuICAgIGNvbnN0IHBhcnNlZFVSTCA9IHRoaXMuX2ZpeFVSTChVUkwpO1xuICAgIGNvbnN0IERPTVRhcmdldCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwodGFyZ2V0KVswXTtcblxuICAgIHZhciByZWFkeVN0YXRlID0gMDtcbiAgICB2YXIgc3RhdHVzID0gMDtcbiAgICB2YXIgYXJncyA9IGFyZ3VtZW50cztcbiAgICB2YXIgdHJhbnNDbGFzcyA9IHRoaXMuY2xhc3NCYXNlVHJhbnNpdGlvbjtcblxuICAgIGxldCB0cmFuc2l0aW9uUnVuID0gZmFsc2U7XG4gICAgbGV0IGxvYWRSdW4gPSBmYWxzZTtcbiAgICBsZXQgcmVzb2x2ZXIgPSBudWxsO1xuXG4gICAgbGV0IGNhdGNoZXIgPSBmdW5jdGlvbihlcnIpIHtcbiAgICAgIHRoaXMuZW1pdEV2ZW50KCdhamF4LWdldC1lcnJvcicsIHtyZWFkeVN0YXRlOiByZWFkeVN0YXRlLCBzdGF0dXNtOiByZXEuc3RhdHVzbSwgZXJyOiBlcnJ9KTtcbiAgICAgIHRoaXMuX2Vycm9yKHJlYWR5U3RhdGUsIHJlcS5zdGF0dXMsIGVyciB8fCAwKTtcbiAgICB9LmJpbmQodGhpcylcblxuICAgIC8vIEB0b2RvIG5lZWQgdG8gYWRkIHByb3BlciBlcnJvciBjaGVja2luZyBoZXJlLlxuXG4gICAgLy8gTW9kaWZ5IHRoZSBjbGFzc2VzIG9uIHRoZSBjb250YWluaW5nIGVsZW1lbnRcbiAgICBfdS5yZW1vdmVDbGFzcyh0cmFuc0NsYXNzKyctaW4nLCBET01UYXJnZXQpO1xuICAgIF91LnJlbW92ZUNsYXNzKHRyYW5zQ2xhc3MrJy1pbi1zdGFydCcsIERPTVRhcmdldCk7XG4gICAgX3UucmVtb3ZlQ2xhc3ModHJhbnNDbGFzcysnLWluLWVuZCcsIERPTVRhcmdldCk7XG4gICAgX3UucmVtb3ZlQ2xhc3ModHJhbnNDbGFzcysnLWluLWZpbmlzaCcsIERPTVRhcmdldCk7XG4gICAgX3UuYWRkQ2xhc3ModHJhbnNDbGFzcysnLW91dC1zdGFydCcsIERPTVRhcmdldCk7XG4gICAgX3UuYWRkQ2xhc3ModHJhbnNDbGFzcysnLW91dCcsIERPTVRhcmdldCk7XG4gICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgIF91LmFkZENsYXNzKHRyYW5zQ2xhc3MrJy1vdXQtZW5kJywgRE9NVGFyZ2V0KTtcbiAgICB9LCAwKVxuICAgIC8vIEFkZCB0aGUgYW5pbWF0aW9uIGVuZCBsaXN0ZW5lciB0byB0aGUgdGFyZ2V0IG5vZGVcbiAgICAvLyBUaGlzIGp1c3Qgc2V0cyB0cmFuc2l0aW9uIHJ1biB0byB0cnVlXG4gICAgLy8gRGV2IG1vZGUgb3V0cHV0XG4gICAgaWYoIHRoaXMuZGV2bW9kZSApIHtcbiAgICAgIGxldCBhbmltYXRpb25UaW1lID0gQW5pbWF0aW9uLmRldGVjdEFuaW1hdGlvbkVuZFRpbWUoRE9NVGFyZ2V0LCB0aGlzLmFuaW1hdGlvbkRlcHRoKTtcbiAgICAgIGNvbnNvbGUubG9nKGAlYyBBbmltYXRpb24gb3V0IHRpbWUgaXM6ICR7YW5pbWF0aW9uVGltZX1tc2AsICdiYWNrZ3JvdW5kOiAjODg4OyBjb2xvcjogI0ZGRicpO1xuICAgIH1cbiAgICBBbmltYXRpb24uXG4gICAgICBhZGRFbmRFdmVudExpc3RlbmVyKERPTVRhcmdldCwgbnVsbCwgdGhpcy5hbmltYXRpb25EZXB0aCkuXG4gICAgICB0aGVuKGZ1bmN0aW9uKCkge1xuXG4gICAgICAgIGlmKCB0aGlzLmRldm1vZGUgKSB7XG4gICAgICAgICAgbGV0IGRpZmZJblRpbWUgPSBuZXcgRGF0ZSgpIC0gY3VycmVudFRpbWU7XG4gICAgICAgICAgY29uc29sZS5sb2coYCVjIFRyYW5zaXRpb24gb3V0IGhhcyBjb21wbGV0ZWQgYWZ0ZXI6ICR7ZGlmZkluVGltZX1tc2AsICdiYWNrZ3JvdW5kOiAjNjY2OyBjb2xvcjogI0ZGRicpO1xuICAgICAgICB9XG5cbiAgICAgICAgdHJhbnNpdGlvblJ1biA9IHRydWU7XG5cbiAgICAgICAgLy8gRW1pdCB0aGUgZG9jdW1lbnQgbG9hZGVkIGV2ZW50IHdpdGggdGhlIHJlc29sdmluZ1xuICAgICAgICB0aGlzLmVtaXRFdmVudCgnYWpheC1nZXQtYW5pbWF0aW9uT3V0UnVuJywge0RPTVRhcmdldDogRE9NVGFyZ2V0fSk7XG4gICAgICB9LmJpbmQodGhpcykpLlxuICAgICAgY2F0Y2goIGNhdGNoZXIgKTtcblxuICAgIHZhciByZXF1ZXN0UHJvbWlzZSA9IG5ldyBQcm9taXNlKGZ1bmN0aW9uIGhhbmRsZXIocmVzb2x2ZSwgcmVqZWN0KSB7XG5cbiAgICAgIC8vIExpc3RlbiBmb3IgdGhlIHJlYWR5IHN0YXRlXG4gICAgICByZXEuYWRkRXZlbnRMaXN0ZW5lcigncmVhZHlzdGF0ZWNoYW5nZScsIChlKSA9PiB7XG5cbiAgICAgICAgaWYoIHRoaXMuZGV2bW9kZSApIHtcbiAgICAgICAgICBsZXQgZGlmZkluVGltZSA9IG5ldyBEYXRlKCkgLSBjdXJyZW50VGltZTtcbiAgICAgICAgICBjb25zb2xlLmxvZyhgJWMgRG9jdW1lbnQgbG9hZCByZWFkdFN0YXRlIGhhcyBjaGFuZ2VkIHRvICR7cmVhZHlTdGF0ZX0gYWZ0ZXI6ICR7ZGlmZkluVGltZX1tc2AsICdiYWNrZ3JvdW5kOiAjNjY2OyBjb2xvcjogI0ZGRicpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmVhZHlTdGF0ZSA9IGUudGFyZ2V0LnJlYWR5U3RhdGU7XG4gICAgICAgIHN0YXR1cyA9IGUudGFyZ2V0LnN0YXR1cztcbiAgICAgIH0pO1xuXG4gICAgICAvLyBMaXN0ZW0gZm9yIHRoZSBsb2FkIGV2ZW50XG4gICAgICByZXEuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsIChlKSA9PiB7XG4gICAgICAgIC8vIElmIHdlIGhhdmUgYSByZWFkeSBzdGF0ZSB0aGF0IGluZGljYXRlZCB0aGF0IHRoZSBsb2FkIHdhcyBhIHN1Y2Nlc3MsIGNvbnRpbnVlXG4gICAgICAgIGlmKCByZXEuc3RhdHVzID49IDIwMCAmJiByZXEuc3RhdHVzIDwgNDAwICkge1xuXG4gICAgICAgICAgaWYoIHRoaXMuZGV2bW9kZSApIHtcbiAgICAgICAgICAgIGxldCBkaWZmSW5UaW1lID0gbmV3IERhdGUoKSAtIGN1cnJlbnRUaW1lO1xuICAgICAgICAgICAgY29uc29sZS5sb2coYCVjIERvY3VtZW50IGhhcyBsb2FkZWQgYWZ0ZXI6ICR7ZGlmZkluVGltZX1tc2AsICdiYWNrZ3JvdW5kOiAjNjY2OyBjb2xvcjogI0ZGRicpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIC8vIEdldCB0aGUgcmVxdWVzdCByZXNwb25zZSB0ZXh0XG4gICAgICAgICAgdmFyIHJlc3BvbnNlVGV4dCA9IHJlcS5yZXNwb25zZVRleHRcbiAgICAgICAgICAvLyBHZXQgdGhlIEFKQVhEb2N1bWVudFxuICAgICAgICAgIHZhciBBSkFYRG9jdW1lbnQgPSB0aGlzLl9wYXJzZVJlc3BvbnNlKHJlc3BvbnNlVGV4dCwgdGFyZ2V0LCBzZWxlY3Rpb24sIGZyb21Qb3AsIGxpbmtUYXJnZXQpXG4gICAgICAgICAgLy8gQnVpbGQgdGhlIHJlc29sdmVyXG4gICAgICAgICAgdmFyIHJlc29sdmVyID0ge1xuICAgICAgICAgICAgcmVzcG9uc2VUZXh0OiByZXNwb25zZVRleHQsXG4gICAgICAgICAgICBkb2N1bWVudDogQUpBWERvY3VtZW50LFxuICAgICAgICAgICAgYXJndW1lbnRzOiBhcmdzLFxuICAgICAgICAgICAgbGlua1RhcmdldDogbGlua1RhcmdldCB8fCBudWxsLFxuICAgICAgICAgICAgRE9NVGFyZ2V0OiBET01UYXJnZXRcbiAgICAgICAgICB9XG4gICAgICAgICAgcmVzb2x2ZShyZXNvbHZlcik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmVqZWN0KEVSUk9SUy5MT0FEX0VSUk9SKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIHJlcS5hZGRFdmVudExpc3RlbmVyKCdlcnJvcicsIChlKSA9PiB7XG4gICAgICAgIHJlamVjdChFUlJPUlMuTE9BRF9FUlJPUik7XG4gICAgICB9KTtcbiAgICB9LmJpbmQodGhpcykpLlxuICAgIGNhdGNoKCBjYXRjaGVyICk7XG5cbiAgICAvLyBUaGlzIHByb21pc2UgdGFrZXMgdGhlIHJldHVybmVkIHByb21pc2UgYW5kIHJ1bnMgdGhlIGVxdWl2YWxlbnQgb2YgYSBcImZpbmFsbHlcIlxuICAgIFByb21pc2UuXG4gICAgICByZXNvbHZlKHJlcXVlc3RQcm9taXNlKS5cbiAgICAgIC8vIFRIRU46IFJlc3BvbnNpYmxlIGZvciB0ZXN0aW5nIHdoZXRoZXIgdGhlIHRyYW5zaXRpb24gaGFzIHJ1biwgdGhpc1xuICAgICAgLy8gYWxsZXZpYXRlcyBhIHJhY2UgY29uZGl0aW9uIGJldHdlZW4gdGhlIGRvY3VtZW50IGxvYWRpbmcgYW5kIHRoZVxuICAgICAgLy8gdHJhbnNpdGlvbiBPVVQgY29tcGxldGlvbi5cbiAgICAgIHRoZW4oIGZ1bmN0aW9uKHJlc29sdmVyKSB7XG4gICAgICAgIGlmKHJlc29sdmVyLmVycm9yKSB7XG4gICAgICAgICAgdGhyb3cgcmVzb2x2ZXIuZXJyb3JcbiAgICAgICAgfSBlbHNlIGlmKCFyZXNvbHZlci5yZXNwb25zZVRleHQpIHtcbiAgICAgICAgICB0aHJvdyBFUlJPUlMuQkFEX1BST01JU0VcbiAgICAgICAgfSBlbHNlIHtcblxuICAgICAgICAgIC8vIGxvYWQgcnVuIGlzIGRvbmUsIHNvIHNldCB0aGUgdmFyaWFibGUgdG8gdHJ1ZVxuICAgICAgICAgIGxvYWRSdW4gPSB0cnVlO1xuXG4gICAgICAgICAgLy8gUmVzb2x2ZSBQcm9taXNlIHRvIHRlc3QsIG9uIGludGVydmFsLCB3aGV0aGVyIHRoZSB0cmFuc2l0aW9uIGhhc1xuICAgICAgICAgIC8vIGNvbXBsZXRlZC4gV2hlbiBpdCBoYXMsIHJlc29sdmUgdGhlIHByb21pc2UuXG4gICAgICAgICAgbGV0IHJlc29sdmUgPSBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgICAgIGxldCB0ZXN0SW50ZXJ2YWwgPSBudWxsO1xuICAgICAgICAgICAgbGV0IHRlc3RSZXNvbHZlZCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICBpZih0cmFuc2l0aW9uUnVuID09PSB0cnVlKVxuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgaWYoIHRoaXMuZGV2bW9kZSApIHtcbiAgICAgICAgICAgICAgICAgIGxldCBkaWZmSW5UaW1lID0gbmV3IERhdGUoKSAtIGN1cnJlbnRUaW1lO1xuICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coYCVjIERvY3VtZW50IGhhcyBsb2FkZWQgQU5EIHRyYW5zaXRpb24gT1VUIGhhcyBydW4gYWZ0ZXI6ICR7ZGlmZkluVGltZX1tc2AsICdiYWNrZ3JvdW5kOiAjNjY2OyBjb2xvcjogI0ZGRicpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAvLyBDbGVhciB0aGUgaW50ZXJ2YWxcbiAgICAgICAgICAgICAgICBjbGVhckludGVydmFsKHRlc3RJbnRlcnZhbCk7XG5cbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgcmVzb2x2ZShyZXNvbHZlcik7XG4gICAgICAgICAgICAgICAgfSwgdGhpcy5yZXNvbHZlVGltZW91dCk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0uYmluZCh0aGlzKVxuXG4gICAgICAgICAgICB0ZXN0SW50ZXJ2YWwgPSBzZXRJbnRlcnZhbCh0ZXN0UmVzb2x2ZWQsIDUwKTtcbiAgICAgICAgICB9LmJpbmQodGhpcykpO1xuXG4gICAgICAgICAgLy8gRW1pdCB0aGUgZG9jdW1lbnQgbG9hZGVkIGV2ZW50IHdpdGggdGhlIHJlc29sdmluZ1xuICAgICAgICAgIHRoaXMuZW1pdEV2ZW50KCdhamF4LWdldC1kb2N1bWVudExvYWRlZCcsIHJlc29sdmVyKTtcblxuICAgICAgICAgIHJldHVybiByZXNvbHZlO1xuICAgICAgICB9XG4gICAgICB9LmJpbmQodGhpcykpLlxuICAgICAgLy8gVEhFTjogcmVzcG9uc2libGUgZm9yIGFkZGluZyB0aGUgZmluYWwgY29udGVudCB0byB0aGUgbWFpbiBkb2N1bWVudC4gUmV0dXJucyBhIHByb21pc2UgdGhhdCBpZGVudGlmaWVzIHRoZSB0cmFuc2l0aW9uXG4gICAgICB0aGVuKGZ1bmN0aW9uKHJlc29sdmVyKSB7XG4gICAgICAgIHRyeSB7XG5cbiAgICAgICAgfSBjYXRjaCAoZSkge1xuXG4gICAgICAgIH1cbiAgICAgICAgLy8gRmluZCB0aGUgdGFyZ2V0IG5vZGVcbiAgICAgICAgbGV0IHRhcmdldE5vZGUgPSByZXNvbHZlci5ET01UYXJnZXQ7XG4gICAgICAgIC8vIE1vZGlmeSBpdHMgY2xhc3Nlc1xuICAgICAgICBfdS5yZW1vdmVDbGFzcyh0aGlzLmNsYXNzQmFzZVRyYW5zaXRpb24rJy1vdXQtZmluaXNoJywgdGFyZ2V0Tm9kZSk7XG4gICAgICAgIF91LnJlbW92ZUNsYXNzKHRoaXMuY2xhc3NCYXNlVHJhbnNpdGlvbisnLW91dC1lbmQnLCB0YXJnZXROb2RlKTtcbiAgICAgICAgX3UucmVtb3ZlQ2xhc3ModGhpcy5jbGFzc0Jhc2VUcmFuc2l0aW9uKyctb3V0JywgdGFyZ2V0Tm9kZSk7XG4gICAgICAgIF91LmFkZENsYXNzKHRyYW5zQ2xhc3MrJy1pbicsIERPTVRhcmdldCk7XG4gICAgICAgIF91LmFkZENsYXNzKHRyYW5zQ2xhc3MrJy1pbi1zdGFydCcsIERPTVRhcmdldCk7XG4gICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgX3UuYWRkQ2xhc3ModHJhbnNDbGFzcysnLWluLWVuZCcsIERPTVRhcmdldCk7XG4gICAgICAgIH0sIDApO1xuICAgICAgICAvLyBGaW5hbGx5LiBQYXJzZSB0aGUgcmVzdWx0XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgdGhpcy5fY29tcGxldGVUcmFuc2ZlcihyZXNvbHZlci5kb2N1bWVudCwgdGFyZ2V0Tm9kZSwgc2VsZWN0aW9uLCBmcm9tUG9wKTtcbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgIHRocm93IGU7XG4gICAgICAgIH1cbiAgICAgICAgLy8gRW1pdCBhbiBldmVudFxuICAgICAgICAvLyBAdG9kbyBkb2N1bWVudCB0aGlzLlxuICAgICAgICB0aGlzLmVtaXRFdmVudCgnYWpheC1nZXQtYWRkZWRUb0RvbScsIHtkb2M6IHJlc29sdmVyLmRvY3VtZW50LCB0YXJnZXROb2RlOiB0YXJnZXROb2RlLCBzZWxlY3Rpb246IHNlbGVjdGlvbn0pO1xuICAgICAgICAvLyBBZGQgdGhlIGFuaW1hdGlvbiBlbmQgbGlzdGVuZXIgdG8gdGhlIHRhcmdldCBub2RlXG4gICAgICAgIGlmKCB0aGlzLmRldm1vZGUgKSB7XG4gICAgICAgICAgbGV0IGFuaW1hdGlvblRpbWUgPSBBbmltYXRpb24uZGV0ZWN0QW5pbWF0aW9uRW5kVGltZSh0YXJnZXROb2RlLCB0aGlzLmFuaW1hdGlvbkRlcHRoKTtcbiAgICAgICAgICBjb25zb2xlLmxvZyhgJWMgQW5pbWF0aW9uIGluIHRpbWUgaXM6ICR7YW5pbWF0aW9uVGltZX1tc2AsICdiYWNrZ3JvdW5kOiAjODg4OyBjb2xvcjogI0ZGRicpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBBbmltYXRpb24uYWRkRW5kRXZlbnRMaXN0ZW5lcih0YXJnZXROb2RlLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICByZXR1cm4gcmVzb2x2ZXI7XG4gICAgICAgIH0sIHRoaXMuYW5pbWF0aW9uRGVwdGgpO1xuICAgICAgfS5iaW5kKHRoaXMpKS5cbiAgICAgIC8vIFRIRU46IFJlc3BvbnNpYmxlIGZvciB0aWR5aW5nIGV2ZXJ5dGhpbmcgdXBcbiAgICAgIHRoZW4oZnVuY3Rpb24ocmVzb2x2ZXIpIHtcbiAgICAgICAgLy8gRmluZCB0aGUgdGFyZ2V0IG5vZGVcbiAgICAgICAgbGV0IHRhcmdldE5vZGUgPSByZXNvbHZlci5ET01UYXJnZXQ7XG4gICAgICAgIC8vIE1vZGlmeSBpdHMgY2xhc3Nlc1xuICAgICAgICBfdS5yZW1vdmVDbGFzcyh0aGlzLmNsYXNzQmFzZVRyYW5zaXRpb24rJy1pbicsIHRhcmdldE5vZGUpO1xuICAgICAgICBfdS5yZW1vdmVDbGFzcyh0aGlzLmNsYXNzQmFzZVRyYW5zaXRpb24rJy1pbi1zdGFydCcsIHRhcmdldE5vZGUpO1xuICAgICAgICBfdS5yZW1vdmVDbGFzcyh0aGlzLmNsYXNzQmFzZVRyYW5zaXRpb24rJy1pbi1lbmQnLCB0YXJnZXROb2RlKTtcbiAgICAgICAgX3UuYWRkQ2xhc3ModGhpcy5jbGFzc0Jhc2VUcmFuc2l0aW9uKyctaW4tZmluaXNoJywgdGFyZ2V0Tm9kZSk7XG4gICAgICAgIC8vIEVtaXQgdGhlIGZpbmFsbHkgcmVzcG9uc2VcbiAgICAgICAgdGhpcy5lbWl0RXZlbnQoJ2FqYXgtZ2V0LWZpbmFsbHknLCB7dGFyZ2V0Tm9kZTogdGFyZ2V0Tm9kZX0pO1xuXG4gICAgICAgIGlmKCB0aGlzLmRldm1vZGUgKSB7XG4gICAgICAgICAgbGV0IGRpZmZJblRpbWUgPSBuZXcgRGF0ZSgpIC0gY3VycmVudFRpbWU7XG4gICAgICAgICAgY29uc29sZS5sb2coYCVjIERvY3VtZW50IGxvYWQgYW5kIHRyYW5zaXRpb24gSU4gaXMgY29tcGxldGUgYWZ0ZXI6ICR7ZGlmZkluVGltZX1tc2AsICdiYWNrZ3JvdW5kOiAjNjY2OyBjb2xvcjogI0ZGRicpO1xuICAgICAgICB9XG4gICAgICB9LmJpbmQodGhpcykpLlxuICAgICAgY2F0Y2goIGNhdGNoZXIgKTtcblxuICAgIC8vIFNhdmUgdGhlIGxhc3QgcGFyc2VkIFVSTCBmb3IgdGhlIHB1cnBvc2Ugb2YgaGlzdG9yeSBpbnRlcm9wZXJhYmlsaXR5IGFuZCBlcnJvciBjb3JyZWN0aW9uLlxuICAgIHRoaXMubGFzdFBhcnNlZFVSTCA9IHBhcnNlZFVSTDtcblxuICAgIHJlcS5vcGVuKCdHRVQnLCBwYXJzZWRVUkwsIHRydWUpO1xuICAgIHJlcS5zZW5kKGRhdGEpO1xuXG4gICAgLy8gU2V0IHRoZSBvYmplY3Qgc3RhdGVcbiAgICB0aGlzLnN0YXRlID0gU1RBVEVTLkxPQURJTkc7XG5cbiAgICByZXR1cm4gcmVxdWVzdFByb21pc2U7XG4gIH1cblxuICAvKipcbiAgICogUHJpdmF0ZSBtZXRob2RzXG4gICAqL1xuXG4gIC8qKlxuICAgKiBMaXN0ZW5lciBmb3IgdGhlIHBvcHN0YXRlIG1ldGhvZFxuICAgKlxuICAgKiBAcHJpdmF0ZVxuICAgKiBAcGFyYW0gIHtvYmplY3R9IGUgdGhlIHBhc3NlZCBldmVudCBvYmplY3RcbiAgICogQHJldHVybiB2b2lkXG4gICAqL1xuICBzdGF0aWMgX3BvcHN0YXRlKGUpIHtcbiAgICB2YXIgYmFzZSwgc3RhdGUgPSB7fTtcbiAgICB2YXIgaGFzUG9wcGVkU3RhdGUgPSBzdXBlci5fcG9wc3RhdGUoZSk7XG5cbiAgICBpZiggaGFzUG9wcGVkU3RhdGUgKSB7XG4gICAgICBzdGF0ZSA9IChiYXNlID0gdGhpcy5oaXN0b3J5KS5zdGF0ZSB8fCAoYmFzZS5zdGF0ZSA9IGUuc3RhdGUgfHwgKGUuc3RhdGUgPSB3aW5kb3cuZXZlbnQuc3RhdGUpKTtcbiAgICB9XG5cbiAgICB2YXIgaHJlZiA9IGRvY3VtZW50LmxvY2F0aW9uLmhyZWY7XG4gICAgdmFyIHRhcmdldCA9IHN0YXRlLnRhcmdldCB8fCB0aGlzLmxhc3RDaGFuZ2VkVGFyZ2V0O1xuICAgIHZhciBzZWxlY3Rpb24gPSBzdGF0ZS5zZWxlY3Rpb24gfHwgU0VMRUNUT1JTLkNISUxEUkVOO1xuICAgIHZhciBkYXRhID0gc3RhdGUuZGF0YSB8fCB7fTtcblxuICAgIHRoaXMuYWpheEdldChocmVmLCB0YXJnZXQsIHNlbGVjdGlvbiwgdHJ1ZSwgZGF0YSk7XG5cbiAgICByZXR1cm4gaGFzUG9wcGVkU3RhdGU7XG4gIH1cblxuICAvKipcbiAgICogVHJpZ2dlciBhbiBhamF4IGxpbmsgYXMgZGV0ZXJtaW5lZCBieSBhIGNsaWNrIGNhbGxiYWNrLiBUaGlzIHNob3VsZCBvbmx5IGV2ZXIgYmUgY2FsbGVkXG4gICAqIGZyb20gYSBjbGljayBldmVudCBhcyBhZGRlZCB2aWEgdGhlIEFKQVggb2JqZWN0IG9yIGEgY2hpbGQgdGhlcmVyb2YuXG4gICAqXG4gICAqIEBzdGF0aWNcbiAgICogQHByaXZhdGVcbiAgICogQHBhcmFtICB7b2JqZWN0fSBlIHRoZSBldmVudCBvYmplY3QgcGFzc2VkIGZyb20gdGhlIGNsaWNrIGV2ZW50LlxuICAgKi9cbiAgc3RhdGljIF90cmlnZ2VyQWpheExpbmsoZSkge1xuICAgIGlmKCB0aGlzLnN0YXRlICE9IFNUQVRFUy5PSyApXG4gICAge1xuICAgICAgaWYoIHRoaXMuZGV2bW9kZSApXG4gICAgICB7XG4gICAgICAgIGNvbnNvbGUud2FybiggXCJUcmllZCB0byBjbGljayBhbiBBSkFYIGxpbmsgd2hlbiB0aGUgb2JqZWN0IHdhc24ndCBpbiBPSyBtb2RlXCIgKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIEZpbmQgYWxsIG9mIHRoZSByZWxldmFudCBhdHRlaWJ1dGVzXG4gICAgY29uc3QgbGluayAgICAgID0gZS50YXJnZXQ7XG4gICAgY29uc3QgaHJlZiAgICAgID0gbGluay5nZXRBdHRyaWJ1dGUoJ2hyZWYnKTtcbiAgICBjb25zdCB0YXJnZXQgICAgPSBsaW5rLmdldEF0dHJpYnV0ZSh0aGlzLmF0dHJpYnV0ZVRhcmdldCk7XG4gICAgY29uc3Qgc2VsZWN0aW9uID0gbGluay5nZXRBdHRyaWJ1dGUodGhpcy5hdHRyaWJ1dGVTZWxlY3Rpb24pO1xuXG4gICAgLy8gU2V0IHRoZSBvYmplY3Qgc3RhdGVcbiAgICB0aGlzLnN0YXRlID0gU1RBVEVTLkNMSUNLRUQ7XG5cbiAgICB0aGlzLmFqYXhHZXQoaHJlZiwgdGFyZ2V0LCBzZWxlY3Rpb24pO1xuICB9XG5cbiAgLyoqXG4gICAqIEB0eXBlZGVmIHtPYmplY3R9ICAgICAgICAgICAgICBBSkFYRG9jdW1lbnRcbiAgICogQHByb3BlcnR5IHtET01FbGVtZW50fSBkb2MgICAgIFRoZSBmdWxsIGRvY3VtZW50IG5vZGUgZm9yIHRoZSBBSkFYIEdFVCByZXN1bHRcbiAgICogQHByb3BlcnR5IHtOb2RlTGlzdH0gICBzdWJkb2MgIFRoZSBzdWJkb2N1bWVudCBkZXJpdmVkIGZyb20gdGhlIG1haW4gZG9jdW1lbnRcbiAgICovXG5cbiAgLyoqXG4gICAqIFRoaXMgcmVzcG9uZHMgdG8gdGhlIGFqYXggbG9hZCBldmVudCBhbmQgaXMgcmVzcG9uc2libGUgZm9yIGJ1aWxkaW5nIHRoZSByZXN1bHQsXG4gICAqIGluamVjdGluZyBpdCBpbnRvIHRoZSBwYWdlLCBydW5uaW5nIGNhbGxiYWNrcyBhbmQgZGV0ZWN0aW5nIGFuZCBkZWxheWluZ1xuICAgKiB0cmFuc2l0aW9ucyBhbmQgYW5pbWF0aW9ucyBhcyBuZWNlc3NhcnkvXG4gICAqXG4gICAqIEBzdGF0aWNcbiAgICogQHByaXZhdGVcbiAgICogQHBhcmFtICB7c3RyaW5nfSBjb250ZW50ICAgICAgICAgICBUaGUgbG9hZGVkIHBhZ2UgY29udGVudCwgdGhpcyBjb21lcyBmcm9tIHRoZSBBSkFYIGNhbGwuXG4gICAqIEBwYXJhbSAge3N0cmluZ30gdGFyZ2V0ICAgICAgICAgICAgVGhlIHRhcmdldCBmb3IgdGhlIGxvYWRlZCBjb250ZW50LiBUaGlzIGNhbiBiZSBhIHN0cmluZyAoc2VsZWN0b3IpLCBvciBhIEpTT04gYXJyYXkgb2Ygc2VsZWN0b3Igc3RyaW5ncy5cbiAgICogQHBhcmFtICB7c3RyaW5nfSBzZWxlY3Rpb24gICAgICAgICBUaGlzIGlzIGEgc2VsZWN0b3IgdGhhdCBkZXRlcm1pbmVzIHdoYXQgdG8gY3V0IGZyb20gdGhlIGxvYWRlZCBjb250ZW50LlxuICAgKiBAcGFyYW0gIHtET01FbGVtZW50fSBbbGlua1RhcmdldF0gIFRoZSB0YXJnZXQgb2YgdGhlIGxpbmsuIFRoaXMgaXMgdXNlZnVsIGZvciBzZXR0aW5nIGFjdGl2ZSBzdGF0ZXMgaW4gY2FsbGJhY2suXG4gICAqIEByZXR1cm4ge0FKQVhEb2N1bWVudH0gICAgICAgICAgICAgQW4gb2JqZWN0IHJlcHJlc2VudGluZyBib3RoIHRoZSBtYWluIGRvY3VtZW50IGFuZCB0aGUgc3ViZG9jdW1lbnRcbiAgICovXG4gIHN0YXRpYyBfcGFyc2VSZXNwb25zZShjb250ZW50LCB0YXJnZXQsIHNlbGVjdGlvbikge1xuXG4gICAgdmFyIGRvYywgc3ViZG9jLCByZXN1bHRzO1xuXG4gICAgLy8gUGFyc2UgdGhlIGRvY3VtZW50IGZyb20gdGhlIGNvbnRlbnQgcHJvdmlkZWRcbiAgICBkb2MgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBkb2MuaW5uZXJIVE1MID0gY29udGVudDtcblxuICAgIGlmKCBzZWxlY3Rpb24gPT09IFNFTEVDVE9SUy5DSElMRFJFTiApXG4gICAge1xuICAgICAgc3ViZG9jID0gZG9jLnF1ZXJ5U2VsZWN0b3JBbGwoYCR7dGFyZ2V0fSA+ICpgKTtcbiAgICB9IGVsc2Uge1xuICAgICAgc3ViZG9jID0gZG9jLnF1ZXJ5U2VsZWN0b3JBbGwoc2VsZWN0aW9uKTtcbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgZG9jOiBkb2MsXG4gICAgICBzdWJkb2M6IHN1YmRvY1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBUaGlzIGNvbXBsZXRlcyB0aGUgdHJhbnNpdGlvbiBvZiBjb250ZW50LiBUaGlzIHJlbW92ZXMgdGhlIG9sZCBjb250ZW50IGFuZCBhZGRzIHRoZSBuZXdcbiAgICpcbiAgICogQHN0YXRpY1xuICAgKiBAcHJpdmF0ZVxuICAgKiBAcGFyYW0gIHtBSkFYRG9jdW1lbnR9IGNvbnRlbnQgICAgVGhlIERPTSBub2RlcyB0byBhZGQgdG8gdGhlIGVsZW1lbnRcbiAgICogQHBhcmFtICB7RE9NTm9kZX0gICAgICB0YXJnZXQgICAgIFRoZSB0YXJnZXQgdG8gYWRkIHRoZSBuZXcgY29udGVudCB0b1xuICAgKiBAcGFyYW0gIHtzdHJpbmd9ICAgICAgIHNlbGVjdGlvbiAgVGhpcyBpcyBhIHNlbGVjdG9yIHRoYXQgZGV0ZXJtaW5lcyB3aGF0IHRvIGN1dCBmcm9tIHRoZSBsb2FkZWQgY29udGVudC5cbiAgICogQHBhcmFtICB7Ym9vbGVhbn0gICAgICBmcm9tUG9wICAgIEluZGljYXRlcyB0aGF0IHRoaXMgbG9hZCBpcyBmcm9tIGEgaGlzdG9yeSBwb3BcbiAgICovXG4gIHN0YXRpYyBfY29tcGxldGVUcmFuc2Zlcihjb250ZW50LCB0YXJnZXQsIHNlbGVjdGlvbiwgZnJvbVBvcCkge1xuXG4gICAgdmFyIG9sZFRpdGxlID0gZG9jdW1lbnQudGl0bGUsIG5ld1RpdGxlLCB0YXJnZXROb2RlcztcblxuICAgIC8vIEZpbmQgdGhlIG5ldyBwYWdlIHRpdGxlXG4gICAgbmV3VGl0bGUgPSBjb250ZW50LmRvYy5nZXRFbGVtZW50c0J5VGFnTmFtZSgndGl0bGUnKVswXS50ZXh0O1xuXG4gICAgdGFyZ2V0LmlubmVySFRNTCA9ICcnO1xuXG4gICAgZm9yIChsZXQgcmVzdWx0IG9mIEFycmF5LmZyb20oY29udGVudC5zdWJkb2MpKSB7XG4gICAgICB0YXJnZXQuYXBwZW5kQ2hpbGQocmVzdWx0LmNsb25lTm9kZSh0cnVlKSk7XG4gICAgfVxuXG4gICAgLy8gVXBkYXRlIHRoZSBpbnRlcm5hbCByZWZlcmVuY2UgdG8gdGhlIGxhc3QgdGFyZ2V0XG4gICAgdGhpcy5sYXN0Q2hhbmdlZFRhcmdldCA9IF91LmdldFNlbGVjdG9yRm9yRWxlbWVudCh0YXJnZXQpO1xuXG4gICAgaWYoICFmcm9tUG9wICkge1xuICAgICAgLy8gUHVzaCB0aGUgbmV3IHN0YXRlIHRvIHRoZSBoaXN0b3J5LlxuICAgICAgdGhpcy5wdXNoKHRoaXMubGFzdFBhcnNlZFVSTCwgbmV3VGl0bGUsIHsgdGFyZ2V0OiBfdS5nZXRTZWxlY3RvckZvckVsZW1lbnQodGFyZ2V0KSwgc2VsZWN0aW9uOiBzZWxlY3Rpb24gfSk7XG4gICAgfVxuXG4gICAgLy8gU2V0IHRoZSBvYmplY3Qgc3RhdGVcbiAgICB0aGlzLnN0YXRlID0gU1RBVEVTLk9LO1xuICB9XG5cbiAgLyoqXG4gICAqIFRyaWdnZXIgYW4gZXJyb3IgbG9nXG4gICAqXG4gICAqIEBzdGF0aWNcbiAgICogQHByaXZhdGVcbiAgICogQHBhcmFtICB7dHlwZX0gcmVhZHlTdGF0ZSBkZXNjcmlwdGlvblxuICAgKiBAcGFyYW0gIHt0eXBlfSBzdGF0dXMgICAgIGRlc2NyaXB0aW9uXG4gICAqIEByZXR1cm4ge3R5cGV9ICAgICAgICAgICAgZGVzY3JpcHRpb25cbiAgICovXG4gIHN0YXRpYyBfZXJyb3IocmVhZHlTdGF0ZSwgc3RhdHVzLCBlcnJvclN0YXRlID0gRVJST1JTLkdFTkVSSUNfRVJST1IpIHtcbiAgICB2YXIgZXJyb3JTdGF0ZUNvbnN0ID0gKGZ1bmN0aW9uKHZhbCkgeyBmb3IodmFyIGtleSBpbiBFUlJPUlMpIHsgaWYoRVJST1JTW2tleV0gPT0gdmFsKSByZXR1cm4ga2V5IH0gcmV0dXJuICdHRU5FUklDX0VSUk9SJyB9KShlcnJvclN0YXRlKVxuICAgIGNvbnNvbGUud2FybihgJWMgRXJyb3IgbG9hZGluZyBBSkFYIGxpbmsuIHJlYWR5U3RhdGU6ICR7cmVhZHlTdGF0ZX0uIHN0YXR1czogJHtzdGF0dXN9LiBlcnJvclN0YXRlOiAke2Vycm9yU3RhdGVDb25zdH1gLCAnYmFja2dyb3VuZDogIzIyMjsgY29sb3I6ICNmZjdjM2EnKVxuICB9XG5cblxuICAvKipcbiAgICogR2V0dGVycyBhbmQgc2V0dGVyc1xuICAgKi9cblxuICAvKipcbiAgICogKGdldHRlci9zZXR0ZXIpIFRoZSBhdHRyaWJ1dGUgdXNlZCB0byBkZXRlcm1pbmUgd2hldGhlciBhIGxpbmsgc2hvdWxkXG4gICAqIGJlIHJ1biB2aWEgdGhlIEFKQVggY2xhc3MuXG4gICAqXG4gICAqIEB0eXBlIHtzdHJpbmd9XG4gICAqIEBkZWZhdWx0ICdkYXRhLXd0Yy1hamF4J1xuICAgKi9cbiAgc3RhdGljIHNldCBhdHRyaWJ1dGVBamF4KGF0dHJpYnV0ZSkge1xuICAgIGlmKHR5cGVvZiBhdHRyaWJ1dGUgPT09ICdzdHJpbmcnKSB7XG4gICAgICB0aGlzLl9hdHRyaWJ1dGVBamF4ID0gYXR0cmlidXRlO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zb2xlLndhcm4oJ0FsbCBhdHRyaWJ1dGVzIG11c3QgYmUgc3RyaW5ncy4nKTtcbiAgICB9XG4gIH1cbiAgc3RhdGljIGdldCBhdHRyaWJ1dGVBamF4KCkge1xuICAgIHJldHVybiB0aGlzLl9hdHRyaWJ1dGVBamF4IHx8ICdkYXRhLXd0Yy1hamF4JztcbiAgfVxuXG4gIC8qKlxuICAgKiAoZ2V0dGVyL3NldHRlcikgVGhlIGF0dHJpYnV0ZSB1c2VkIHRvIGRldGVybWluZSB3aGVyZSBhIGxpbmsgc2hvdWxkIHBsYWNlIGl0J3NcbiAgICogcmVzdWx0YW50IEdFVC4gVGhpcyBhdHRyaWJ1dGUgc2hvdWxkIGJlIGluIHRoZSBmb3JtIG9mIGEgc2VsZWN0b3IsIGllOlxuICAgKiBgLmFqYXgtdGFyZ2V0YFxuICAgKlxuICAgKiBAdHlwZSB7c3RyaW5nfVxuICAgKiBAZGVmYXVsdCAnZGF0YS13dGMtYWpheC10YXJnZXQnXG4gICAqL1xuICBzdGF0aWMgc2V0IGF0dHJpYnV0ZVRhcmdldChhdHRyaWJ1dGUpIHtcbiAgICBpZih0eXBlb2YgYXR0cmlidXRlID09PSAnc3RyaW5nJykge1xuICAgICAgdGhpcy5fYXR0cmlidXRlVGFyZ2V0ID0gYXR0cmlidXRlO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zb2xlLndhcm4oJ0FsbCBhdHRyaWJ1dGVzIG11c3QgYmUgc3RyaW5ncy4nKTtcbiAgICB9XG4gIH1cbiAgc3RhdGljIGdldCBhdHRyaWJ1dGVUYXJnZXQoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2F0dHJpYnV0ZVRhcmdldCB8fCAnZGF0YS13dGMtYWpheC10YXJnZXQnO1xuICB9XG5cbiAgLyoqXG4gICAqIChnZXR0ZXIvc2V0dGVyKSBUaGUgYXR0cmlidXRlIHVzZWQgdG8gc2xpY2UgdGhlIHJlc3VsdGFudCBHRVQuXG4gICAqIFRoaXMgYXR0cmlidXRlIHNob3VsZCBiZSBpbiB0aGUgZm9ybSBvZiBhIHNlbGVjdG9yLCBpZTpcbiAgICogYC5hamF4LXNlbGVjdGlvbmBcbiAgICpcbiAgICogQHR5cGUge3N0cmluZ31cbiAgICogQGRlZmF1bHQgJ2RhdGEtd3RjLWFqYXgtc2VsZWN0aW9uJ1xuICAgKi9cbiAgc3RhdGljIHNldCBhdHRyaWJ1dGVTZWxlY3Rpb24oYXR0cmlidXRlKSB7XG4gICAgaWYodHlwZW9mIGF0dHJpYnV0ZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgIHRoaXMuX2F0dHJpYnV0ZVNlbGVjdGlvbiA9IGF0dHJpYnV0ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc29sZS53YXJuKCdBbGwgYXR0cmlidXRlcyBtdXN0IGJlIHN0cmluZ3MuJyk7XG4gICAgfVxuICB9XG4gIHN0YXRpYyBnZXQgYXR0cmlidXRlU2VsZWN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLl9hdHRyaWJ1dGVTZWxlY3Rpb24gfHwgJ2RhdGEtd3RjLWFqYXgtc2VsZWN0aW9uJztcbiAgfVxuXG4gIC8qKlxuICAgKiAoZ2V0dGVyL3NldHRlcikgVGhlIGNsYXNzbmFtZSB0byB1c2UgYXMgdGhlIGJhc2lzIGZvciB0cmFuc2l0aW9ucy4gRGVmYXVsdFxuICAgKiB3aWxsIGJlICp3dGMtdHJhbnNpdGlvbiouIFNvIHRoaXMgd2lsbCB0aGVuIGJlIHVzZWQgZm9yIGFsbCAzIHN0YXRlczpcbiAgICogKi53dGMtdHJhbnNpdGlvbipcbiAgICogKi53dGMtdHJhbnNpdGlvbi1vdXQqXG4gICAqICoud3RjLXRyYW5zaXRpb24tb3V0LXN0YXJ0KlxuICAgKiAqLnd0Yy10cmFuc2l0aW9uLW91dC1lbmQqXG4gICAqICoud3RjLXRyYW5zaXRpb24tb3V0LWZpbmlzaCpcbiAgICogKi53dGMtdHJhbnNpdGlvbi1pbipcbiAgICogKi53dGMtdHJhbnNpdGlvbi1pbi1zdGFydCpcbiAgICogKi53dGMtdHJhbnNpdGlvbi1pbi1lbmQqXG4gICAqICoud3RjLXRyYW5zaXRpb24taW4tZmluaXNoKlxuICAgKlxuICAgKiBAdHlwZSB7c3RyaW5nfVxuICAgKiBAZGVmYXVsdCAnd3RjLXRyYW5zaXRpb24nXG4gICAqL1xuICBzdGF0aWMgc2V0IGNsYXNzQmFzZVRyYW5zaXRpb24oY2xhc3NCYXNlKSB7XG4gICAgaWYodHlwZW9mIGNsYXNzQmFzZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgIHRoaXMuX2NsYXNzQmFzZVRyYW5zaXRpb24gPSBjbGFzc0Jhc2U7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnNvbGUud2FybignQWxsIGF0dHJpYnV0ZXMgbXVzdCBiZSBzdHJpbmdzLicpO1xuICAgIH1cbiAgfVxuICBzdGF0aWMgZ2V0IGNsYXNzQmFzZVRyYW5zaXRpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuX2NsYXNzQmFzZVRyYW5zaXRpb24gfHwgJ3d0Yy10cmFuc2l0aW9uJztcbiAgfVxuXG4gIC8qKlxuICAgKiAoZ2V0dGVyL3NldHRlcikgVGhlIGF0dHJpYnV0ZSB1c2VkIHRvIHNsaWNlIHRoZSByZXN1bHRhbnQgR0VULlxuICAgKiBUaGlzIGF0dHJpYnV0ZSBzaG91bGQgYmUgaW4gdGhlIGZvcm0gb2YgYSBzZWxlY3RvciwgaWU6XG4gICAqIGAuYWpheC1zZWxlY3Rpb25gXG4gICAqXG4gICAqIEB0eXBlIHtzdHJpbmd9XG4gICAqIEBkZWZhdWx0ICdkYXRhLXd0Yy1hamF4LXNlbGVjdGlvbidcbiAgICovXG4gIHN0YXRpYyBzZXQgYXR0cmlidXRlU2hvdWxkTmF2aWdhdGUoYXR0cmlidXRlKSB7XG4gICAgaWYodHlwZW9mIGF0dHJpYnV0ZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgIHRoaXMuX2F0dHJpYnV0ZVNob3VsZE5hdmlnYXRlID0gYXR0cmlidXRlO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zb2xlLndhcm4oJ0FsbCBhdHRyaWJ1dGVzIG11c3QgYmUgc3RyaW5ncy4nKTtcbiAgICB9XG4gIH1cbiAgc3RhdGljIGdldCBhdHRyaWJ1dGVTaG91bGROYXZpZ2F0ZSgpIHtcbiAgICByZXR1cm4gdGhpcy5fYXR0cmlidXRlU2hvdWxkTmF2aWdhdGUgfHwgJ2RhdGEtd3RjLWFqYXgtc2hvdWxkLW5hdmlnYXRlJztcbiAgfVxuXG4gIC8qKlxuICAgKiByZXR1cm5zIGEgbmV3IHJlcXVlc3RPYmplY3QuIFdyYXBwaW5nIHBsYWNlaG9sZGVyIGZvciBub3cgd2FpdGluZyBvbiBlbmhhbmNlbWVudHMuXG4gICAqXG4gICAqIEByZWFkb25seVxuICAgKiBAcmV0dXJuIHtvYmplY3R9ICByZXF1ZXN0T2JqZWN0XG4gICAqL1xuICBzdGF0aWMgZ2V0IHJlcXVlc3RPYmplY3QoKSB7XG4gICAgcmV0dXJuIG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuICB9XG5cbiAgLyoqXG4gICAqIHJldHVybnMgYSBuZXcgbGFzdCBjaGFuZ2VkIHRhcmdldC4gVGhpcyBpcyB1c2VkIHRvIGRldGVybWluZSB3aGF0IHRvIGNoYW5nZWRcbiAgICogd2hlbiBuYXZpZ2F0aW5nIGJhY2sgdmlhIGhpc3RvcnkuXG4gICAqXG4gICAqIEByZXR1cm4ge29iamVjdH0gIGVpdGhlciBhbiBhcnJheSBvZiBub2RlcyBvciBhIHNpbmdsZSBub2RlLlxuICAgKiBAZGVmYXVsdCBudWxsXG4gICAqL1xuICBzdGF0aWMgc2V0IGxhc3RDaGFuZ2VkVGFyZ2V0KHRhcmdldCkge1xuICAgIHRoaXMuX2xhc3RDaGFuZ2VkVGFyZ2V0ID0gdGFyZ2V0O1xuICB9XG4gIHN0YXRpYyBnZXQgbGFzdENoYW5nZWRUYXJnZXQoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2xhc3RDaGFuZ2VkVGFyZ2V0IHx8IG51bGw7XG4gIH1cblxuICAvKipcbiAgICogVGhlIHJlc29sdmUgdGltZW91dC4gVGhpcyBpcyB0aGUgdGltZSB0aGF0IGlzIHRvIGVsbGFwc2UgYmV0d2VlbiBhbiB0cmFuc2l0aW9uXG4gICAqIGNvbXBsZXRpbmcgYW5kIHRoZSBuZXcgY29udGVudCBiZWluZyBhZGRlZC4gVGhpcyBpcyBhcHBsaWVkIGJvdGggdG8gdGhlIG91dHdhcmRcbiAgICogZWxlbWVudCBhbmQgdGhlIGlud2FyZC5cbiAgICpcbiAgICogQHJldHVybiB7aW50fSAgQSBudW1iZXIsIGluIE1TLCBncmVhdGVyIHRoYW4gMFxuICAgKiBAZGVmYXVsdCAwXG4gICAqL1xuICBzdGF0aWMgc2V0IHJlc29sdmVUaW1lb3V0KHRpbWVvdXQpIHtcbiAgICB0aGlzLl9yZXNvbHZlVGltZW91dCA9IHRpbWVvdXQgPiAwID8gdGltZW91dCA6IG51bGw7XG4gIH1cbiAgc3RhdGljIGdldCByZXNvbHZlVGltZW91dCgpIHtcbiAgICByZXR1cm4gdGhpcy5fcmVzb2x2ZVRpbWVvdXQgPiAwID8gdGhpcy5fcmVzb2x2ZVRpbWVvdXQgOiAwO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoZSBzdGF0ZSB0aGF0IHRoZSBBSkFYIG9iamVjdCBpcyBpbiwgYXMgZGV0ZXJtaW5lZCBmcm9tIGEgbGlzdCBvZiBjb25zdGFudHM6XG4gICAqIC0gT0sgICAgICAgICAgICAgSWRsZSwgcmVhZHkgZm9yIGEgc3RhdGUgbG9hZC5cbiAgICogLSBDTElDS0VEICAgICAgICBDbGlja2VkLCBidXQgbm90IHlldCBmaXJlZC5cbiAgICogLSBMT0FESU5HICAgICAgICBMb2FkaW5nIHBhZ2UuXG4gICAqIC0gVFJBTlNJVElPTklORyAgVHJhbnNpdGlvbmluZyBzdGF0ZVxuICAgKiAtIExPQURFRCAgICAgICAgIENvbnRlbnQgbG9hZGVkLlxuICAgKlxuICAgKiBAcmV0dXJuIHtpbnRlZ2VyfSAgVGhlIHN0YXRlIHRoYXQgdGhlIG9iamVjdCBpcyBpbi4gQ29tcGFyZSB0byB0aGUgc3RhdGUgb2JqZWN0IGZvciBkZXNjcmlwdGlvblxuICAgKiBAZGVmYXVsdCBTVEFURS5PS1xuICAgKi9cbiAgc3RhdGljIHNldCBzdGF0ZShzdGF0ZSkge1xuICAgIGlmKCB0eXBlb2Ygc3RhdGUgPT09ICdzdHJpbmcnICkge1xuICAgICAgaWYoIFNUQVRFU1tzdGF0ZV0gIT09IHVuZGVmaW5lZCApIHtcbiAgICAgICAgdGhpcy5fc3RhdGUgPSBTVEFURVNbc3RhdGVdO1xuICAgICAgICByZXR1cm5cbiAgICAgIH1cbiAgICB9IGVsc2UgaWYoIHR5cGVvZiBzdGF0ZSA9PT0gJ251bWJlcicgKSB7XG4gICAgICBmb3IodmFyIF9zdGF0ZSBpbiBTVEFURVMpIHtcbiAgICAgICAgaWYoU1RBVEVTW19zdGF0ZV0gPT09IHN0YXRlKSB7XG4gICAgICAgICAgdGhpcy5fc3RhdGUgPSBzdGF0ZTtcblxuICAgICAgICAgIGlmKCB0aGlzLmRldm1vZGUgKVxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGAlYyBBSkFYIHN0YXRlIGNoYW5nZTogJHt0aGlzLl9zdGF0ZX0gYCwgJ2JhY2tncm91bmQ6ICMyMjI7IGNvbG9yOiAjYmFkYTU1Jyk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIGNvbnNvbGUud2Fybignc3RhdGUgbXVzdCBiZSBvbmUgb2YgT0ssIENMSUNLRUQsIExPQURJTkcsIExPQURFRC4nKTtcbiAgfVxuICBzdGF0aWMgZ2V0IHN0YXRlKCkge1xuICAgIHJldHVybiB0aGlzLl9zdGF0ZSB8fCAwO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoZSBsYXN0IFVSTCB0byBiZSBwYXJzZWQgYnkgdGhlIEFKQVggb2JqZWN0LiBHZW5lcmFsbHkgc3BlYWtpbmcsIHRoaXMgaXMgdGhlXG4gICAqIGxhc3QgVVJMIHRvIGJlIGxvYWRlZCBvciBhdHRlbXB0ZWQgbG9hZGVkLlxuICAgKlxuICAgKiBAcmV0dXJuIHtzdHJpbmd9ICBUaGUgcGFyc2VkIFVSTCBzdHJpbmdcbiAgICogQGRlZmF1bHQgbnVsbFxuICAgKi9cbiAgc3RhdGljIHNldCBsYXN0UGFyc2VkVVJMKHBhcnNlZFVSTCkge1xuICAgIGlmKCB0eXBlb2YgcGFyc2VkVVJMID09PSAnc3RyaW5nJyApIHtcbiAgICAgIHRoaXMuX2xhc3RQYXJzZWRVUkwgPSBwYXJzZWRVUkw7XG4gICAgfVxuICB9XG4gIHN0YXRpYyBnZXQgbGFzdFBhcnNlZFVSTCgpIHtcbiAgICByZXR1cm4gdGhpcy5fbGFzdFBhcnNlZFVSTCB8fCBudWxsO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoZSBkZXB0aCB0byBjaGVjayBmb3IgdHJhbnNpdGlvbnMuIFRoaXMgaXMgdG8gYWxsb3cgeW91IHRvIHNldCB0aGVcbiAgICogZGVwdGggdG8gY2hlY2sgZm9yIHRyYW5zaXRpb25zIG9uIGJhc2VkIG9uIGRlZXAgdHJhbnNpdGlvbnMgdGhhdCBhcmUgbG9uZ2VyXG4gICAqIG9yIGhhdmUgYSBtdWNoIGxhcmdlciBkZWxheSB0aGFuIGludGVuZGVkLlxuICAgKlxuICAgKiBAcmV0dXJuIHtudW1iZXJ9ICBUaGUgZGVwdGggdG8gY2hlY2sgZm9yIHRyYW5zaXRpb25zXG4gICAqIEBkZWZhdWx0IG51bGxcbiAgICovXG4gIHN0YXRpYyBzZXQgYW5pbWF0aW9uRGVwdGgoZGVwdGgpIHtcbiAgICBsZXQgX2RlcHRoID0gTWF0aC5hYnMoZGVwdGgpO1xuICAgIGlmKCB0eXBlb2YgX2RlcHRoID09PSAnbnVtYmVyJyAmJiAhaXNOYU4oX2RlcHRoKSApIHtcbiAgICAgIHRoaXMuX2FuaW1hdGlvbkRlcHRoID0gX2RlcHRoO1xuICAgIH1cbiAgfVxuICBzdGF0aWMgZ2V0IGFuaW1hdGlvbkRlcHRoKCkge1xuICAgIHJldHVybiB0aGlzLl9hbmltYXRpb25EZXB0aCB8fCBudWxsO1xuICB9XG59XG5cbmV4cG9ydCB7IEFKQVgsIEVSUk9SUywgU1RBVEVTLCBIaXN0b3J5IH07XG4iLCJcblxuLy8gQ3VzdG9tIEV2ZW50IHBvbHlmaWxsXG4vLyBAdG9kbyBXZSBzaG91bGQgcHJvYmFibHkgbW92ZSB0aGlzIG91dCBzb21ld2hlcmUgZWxzZVxuKGZ1bmN0aW9uICgpIHtcblxuIGlmICggdHlwZW9mIHdpbmRvdy5DdXN0b21FdmVudCA9PT0gXCJmdW5jdGlvblwiICkgcmV0dXJuIGZhbHNlO1xuXG4gZnVuY3Rpb24gQ3VzdG9tRXZlbnQgKCBldmVudCwgcGFyYW1zICkge1xuICAgcGFyYW1zID0gcGFyYW1zIHx8IHsgYnViYmxlczogZmFsc2UsIGNhbmNlbGFibGU6IGZhbHNlLCBkZXRhaWw6IHVuZGVmaW5lZCB9O1xuICAgdmFyIGV2dCA9IGRvY3VtZW50LmNyZWF0ZUV2ZW50KCAnQ3VzdG9tRXZlbnQnICk7XG4gICBldnQuaW5pdEN1c3RvbUV2ZW50KCBldmVudCwgcGFyYW1zLmJ1YmJsZXMsIHBhcmFtcy5jYW5jZWxhYmxlLCBwYXJhbXMuZGV0YWlsICk7XG4gICByZXR1cm4gZXZ0O1xuICB9XG5cbiBDdXN0b21FdmVudC5wcm90b3R5cGUgPSB3aW5kb3cuRXZlbnQucHJvdG90eXBlO1xuXG4gd2luZG93LkN1c3RvbUV2ZW50ID0gQ3VzdG9tRXZlbnQ7XG59KSgpO1xuXG4vKipcbiAqIENsYXNzIHJlcHJlc2VudGluZyBhbiBhYnN0cmFjdGlvbiBvZiB0aGUgaGlzdG9yeSBBUEkuXG4gKiBAc3RhdGljXG4gKiBAbmFtZXNwYWNlXG4gKiBAYXV0aG9yIExpYW0gRWdhbiA8bGlhbUB3ZXRoZWNvbGxlY3RpdmUuY29tPlxuICogQHZlcnNpb24gMC45XG4gKiBAY3JlYXRlZCBOb3YgMTksIDIwMTZcbiAqL1xuY2xhc3MgSGlzdG9yeSB7XG5cbiAgLyoqXG4gICAqIFB1YmxpYyBtZXRob2RzXG4gICAqL1xuXG4gIC8qKlxuICAgKiBFbWl0cyBhbiBldmVudCBmcm9tIHRoZSBoaXN0b3J5IG9iamVjdFxuICAgKlxuICAgKiBAZXhhbXBsZVxuICAgKiBsZXQgbGlzdGVuZXIgPSBmdW5jdGlvbihlKSB7XG4gICAqICAgY29uc29sZS5sb2coZS5kZXRhaWwpXG4gICAqICAgZS50YXJnZXQucmVtb3ZlRXZlbnRMaXN0ZW5lcihlLnR5cGUsIGFyZ3VtZW50cy5jYWxsZWUpO1xuICAgKiB9XG4gICAqIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJhamF4LWdldC1hZGRlZFRvRG9tXCIsIGxpc3RlbmVyKTtcbiAgICpcbiAgICogQHBhcmFtICB7c3RyaW5nfSBldmVudElEICAgdGhlIGV2ZW50IElEIHRvIGVtaXRcbiAgICogQHBhcmFtICB7b2JqZWN0fSBkYXRhID0ge30gdGhlIGRhdGEgdG8gaW5jbHVkZSB3aXRoIHRoZSBldmVudFxuICAgKi9cblxuICBzdGF0aWMgZW1pdEV2ZW50KGV2ZW50SUQsIGRhdGEgPSB7fSkge1xuICAgIGlmICh3aW5kb3cuQ3VzdG9tRXZlbnQpIHtcbiAgICAgIHZhciBldmVudCA9IG5ldyBDdXN0b21FdmVudChldmVudElELCB7ZGV0YWlsOiBkYXRhfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciBldmVudCA9IGRvY3VtZW50LmNyZWF0ZUV2ZW50KCdDdXN0b21FdmVudCcpO1xuICAgICAgZXZlbnQuaW5pdEN1c3RvbUV2ZW50KGV2ZW50SUQsIHRydWUsIHRydWUsIGRhdGEpO1xuICAgIH1cblxuICAgIGRvY3VtZW50LmRpc3BhdGNoRXZlbnQoZXZlbnQpO1xuICB9XG5cblxuICAvKipcbiAgICAqIEluaXRpYWxpc2VzIHRoZSBIaXN0b3J5IGNsYXNzLiBOb3RoaW5nIHNob3VsZCBiZSBhYmxlIHRvXG4gICAgKiBvcGVyYXRlIGhlcmUgdW5sZXNzIHRoaXMgaGFzIHJ1biB3aXRoIGEgc3VwcG9ydCA9IHRydWUuXG4gICAgKlxuICAgICogQFB1YmxpY1xuICAgICogQHBhcmFtIHtib29sZWFufSAgZGV2bW9kZSBJbmRpY2F0ZWQgd2hldGhlciB0aGUgb2JqZWN0IGlzIHJ1bm5pbmcgaW4gZGV2IG1vZGUgKHdpbGwgbG9nIG91dHB1dHMgdG8gY29uc29sZSlcbiAgICAqIEByZXR1cm4ge2Jvb2xlYW59ICAgICAgICAgUmV0dXJucyB3aGV0aGVyIGluaXQgcmFuIG9yIG5vdFxuICAgICovXG4gIHN0YXRpYyBpbml0KCBkZXZtb2RlID0gZmFsc2UgKSB7XG4gICAgaWYodGhpcy5zdXBwb3J0KVxuICAgIHtcbiAgICAgIC8vIFRyeSB0byBzZXQgZXZlcnl0aGluZyB1cCwgYW5kIGlmIHdlIGZhaWwgdGhlbiByZXR1cm4gZmFsc2VcbiAgICAgIHRyeSB7XG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdwb3BzdGF0ZScsIChlKT0+IHtcbiAgICAgICAgICB2YXIgaGFzUG9wcGVkU3RhdGUgPSB0aGlzLl9wb3BzdGF0ZShlKTtcbiAgICAgICAgICByZXR1cm4gaGFzUG9wcGVkU3RhdGU7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMuZGV2bW9kZSAgICAgID0gZGV2bW9kZTtcblxuICAgICAgfSBjYXRjaCAoZSkge1xuXG4gICAgICAgIC8vIElmIHdlJ3JlIGluIGRldm1vZGUsIHNlbmQgb3VyIGNvbnNvbGUgb3V0cHV0XG4gICAgICAgIGlmKHRoaXMuZGV2bW9kZSkge1xuICAgICAgICAgIGNvbnNvbGUud2FybignZXJyb3IgaW4gaGlzdG9yeSBpbml0aWFsaXNhdGlvbicpO1xuICAgICAgICAgIGNvbnNvbGUubG9nKGUpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuXG4gICAgICB0aGlzLmluaXRpYWxpc2VkID0gdHJ1ZTtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDb25zdHJ1Y3QgYW5kIHB1c2ggYSBVUkwgc3RhdGVcbiAgICpcbiAgICogQGV4YW1wbGVcbiAgICogQUpBWE9iai5wdXNoKCcvZGV2L2Zvby9iYXInLCAnVGhlIHRpdGxlIGZvciB0aGUgaGlzdG9yeSBvYmplY3QnKVxuICAgKlxuICAgKiBAcHVibGljXG4gICAqIEBwYXJhbSAge3N0cmluZ30gVVJMICAgICAgICAgICBUaGUgVVJMIHRvIHB1c2gsIGNhbiBiZSByZWxhdGl2ZSwgYWJzb2x1dGUgb3IgZnVsbFxuICAgKiBAcGFyYW0gIHtzdHJpbmd9IHRpdGxlICAgICAgICAgVGhlIHRpdGxlIHRvIHB1c2guXG4gICAqIEBwYXJhbSAge29iamVjdH0gc3RhdGVPYmogICAgICBBIHN0YXRlIHRvIHB1c2ggdG8gdGhlIHN0YWNrLiBUaGlzIHdpbGwgYmUgcG9wcGVkIHdoZW4gbmF2aWFndGluZyBiYWNrXG4gICAqIEByZXR1cm4ge2Jvb2xlYW59ICAgICAgICAgICAgICBJbmRpY2F0ZXMgd2hldGhlciB0aGUgcHVzaCBzdWNjZWVkZWRcbiAgICovXG4gIHN0YXRpYyBwdXNoKFVSTCwgdGl0bGUgPSAnJywgc3RhdGVPYmogPSB7fSkge1xuXG4gICAgdmFyIHBhcnNlZFVSTCA9ICcnO1xuXG4gICAgLy8gRmlyc3QgdHJ5IHRvIGZpeCB0aGUgVVJMXG4gICAgdHJ5IHtcbiAgICAgIHBhcnNlZFVSTCA9IHRoaXMuX2ZpeFVSTChVUkwsIHRydWUsIHRydWUpO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIGlmKHRoaXMuZGV2bW9kZSkge1xuICAgICAgICBjb25zb2xlLndhcm4oJ3B1c2ggZmFpbGVkIHdoaWxlIHRyeWluZyB0byBmaXggdGhlIFVSTCcpO1xuICAgICAgICBjb25zb2xlLmxvZyhlKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBmYWxzZVxuICAgIH1cblxuICAgIC8vIElmIHdlIGhhdmUgQVBJIHN1cHBvcnQsIHB1c2ggdGhlIHN0YXRlIHRvIHRoZSBoaXN0b3J5IG9iamVjdFxuICAgIGlmKHRoaXMuc3VwcG9ydClcbiAgICB7XG4gICAgICB0cnkge1xuICAgICAgICAvLyBjb25zb2xlLmxvZyhzdGF0ZU9iaik7XG4gICAgICAgIHRoaXMuaGlzdG9yeS5wdXNoU3RhdGUoc3RhdGVPYmosIHRpdGxlLCBwYXJzZWRVUkwpO1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBpZih0aGlzLmRldm1vZGUpIHtcbiAgICAgICAgICBjb25zb2xlLndhcm4oJ3B1c2ggZmFpbGVkIHdoaWxlIHRyeWluZyB0byBwdXNoIHRoZSBzdGF0ZSB0byB0aGUgaGlzdG9yeSBvYmplY3QnKTtcbiAgICAgICAgICBjb25zb2xlLmxvZyhlKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgLy8gT3RoZXJ3aXNlciwgYWRkIHRoZSBVUkwgYXMgYSBoYXNoYmFuZ1xuICAgIH0gZWxzZVxuICAgIHtcbiAgICAgIHdpbmRvdy5sb2NhdGlvbi5oYXNoID0gYCMhJHtVUkx9YDtcbiAgICB9XG5cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUYWtlcyB0aGUgdXNlciBiYWNrIHRvIHRoZSBwcmV2aW91cyBzdGF0ZS4gU2ltcGx5IHdyYXBzIHRoZSBoaXN0b3J5IG9iamVjdCdzIGJhY2sgbWV0aG9kLlxuICAgKlxuICAgKiBAcHVibGljXG4gICAqL1xuICBzdGF0aWMgYmFjaygpIHtcbiAgICB0aGlzLmhpc3RvcnkuYmFjaygpO1xuICB9XG5cbiAgLyoqXG4gICAqIFRha2VzIHRoZSB1c2VyIGZvcndhcmQgdG8gdGhlIG5leHQgc3RhdGUuIFNpbXBseSB3cmFwcyB0aGUgaGlzdG9yeSBvYmplY3QncyBmb3J3YXJkIG1ldGhvZC5cbiAgICpcbiAgICogQHB1YmxpY1xuICAgKi9cbiAgc3RhdGljIGZvcndhcmQoKSB7XG4gICAgdGhpcy5oaXN0b3J5LmZvcndhcmQoKTtcbiAgfVxuXG5cbiAgLyoqXG4gICAqIFByaXZhdGUgbWV0aG9kc1xuICAgKi9cblxuICAvKipcbiAgICogVGFrZXMgYSBwcm92aWRlZCBVUkwgYW5kIHJldHVybnMgdGhlIHZlcnNpb24gdGhhdCBpcyB1c2FibGVcbiAgICpcbiAgICogQHByaXZhdGVcbiAgICogQHBhcmFtICB7c3RyaW5nfSBVUkwgICAgICAgICAgICAgICAgICAgICBUaGUgVVJMIHRvIGJlIHBhc3NlZFxuICAgKiBAcGFyYW0gIHtib29sZWFufSBpbmNsdWRlRG9jUm9vdCA9IHRydWUgIFdoZXRoZXIgdG8gaW5jbHVkZSB0aGUgZG9jcm9vdCBvbiB0aGUgcGFzc2VkIFVSTFxuICAgKiBAcGFyYW0gIHtib29sZWFufSBpbmNsdWRlVHJhaWxzID0gdHJ1ZSAgIFdoZXRoZXIgdG8gaW5jbHVkZSBmb3VuZCBoYXNoZXMgYW5kIHBhcmFtc1xuICAgKiBAcmV0dXJuIHtzdHJpbmd9ICAgICAgICAgICAgICAgICAgICAgICAgIFRoZSBwYXNzZWQgYW5kIGZvcm1hdHRlZCBVUkxcbiAgICovXG4gIHN0YXRpYyBfZml4VVJMKFVSTCwgaW5jbHVkZURvY1Jvb3QgPSB0cnVlLCBpbmNsdWRlVHJhaWxzID0gdHJ1ZSkge1xuXG4gICAgdmFyIHJ0blVSTDtcblxuICAgIC8qKlxuICAgICAqIFVSTCBSZWdleCB3b3JrcyBsaWtlIHRoaXM6XG4gICAgICogYGBgXG4gICAgICAgIF5cbiAgICAgICAgKFteOl0rOi8vICAgICAgICAgICAjIEhUVFAoUykgZXRjLlxuICAgICAgICAgICAgKFteL10rKSAgICAgICAgICMgVGhlIFVSTCAoaWYgYXZhaWxhYmxlKVxuICAgICAgICApP1xuICAgICAgICAoI3tAZG9jdW1lbnRSb290fSk/ICMgVGhlIGRvY3VtZW50IHJvb3QsIHdoaWNoIHdlIHdhbnQgdG8gZ2V0IHJpZCBvZlxuICAgICAgICAoLyk/ICAgICAgICAgICAgICAgICMgY2hlY2sgZm9yIHRoZSBwcmVzZW5jZSBvZiBhIGxlYWRpbmcgc2xhc2hcbiAgICAgICAgKFteXFwjXFw/XSopICAgICAgICAgICMgVGhlIFVSSSAtIHRoaXMgaXMgd2hhdCB3ZSBjYXJlIGFib3V0LiBDaGVjayBmb3IgZXZlcnl0aGluZyBleGNlcHQgZm9yICMgYW5kID9cbiAgICAgICAgKFxcP1teXFwjXSopPyAgICAgICAgICMgYW55IGFkZGl0aW9uYWwgVVJMIHBhcmFtZXRlcnMgKG9wdGlvbmFsKVxuICAgICAgICAoXFwjXFwhPy4rKT8gICAgICAgICAgIyBBbnkgaGFzaGJhbmcgdHJhaWxlcnMgKG9wdGlvbmFsKVxuICAgICAqIGBgYFxuICAgICAqL1xuICAgIGNvbnN0IFVSTFJlZ2V4ID0gUmVnRXhwKGBeKFteOl0rOi8vKFteL10rKSk/KCR7dGhpcy5kb2N1bWVudFJvb3R9KT8oLyk/KFteXFxcXCNcXFxcP10qKShcXFxcP1teXFxcXCNdKik/KFxcXFwjXFxcXCE/LispP2ApO1xuICAgIGNvbnN0IFtpbnB1dCwgaHJlZiwgaG9zdG5hbWUsIGRvY3VtZW50Um9vdCwgcm9vdCwgcGF0aCwgcGFyYW1zLCBoYXNoYmFuZ10gPSBVUkxSZWdleC5leGVjKFVSTCk7XG5cbiAgICAvLyBJZiB3ZSdyZSBvYnNlcnZpbmcgdGhlIFRMRE4gcmVzdHJhaW50IGFuZCB0aGUgcHJvdmlkZWQgVVJMIGRvZXNuJ3QgbWF0Y2hcbiAgICAvLyB0aGUgZG9tYWluJ3MgVExETiwgdGhyb3cgYSBVUklFcnJvclxuICAgIGlmKCB0eXBlb2YgaG9zdG5hbWUgPT09ICdzdHJpbmcnICYmIGhvc3RuYW1lICE9PSB0aGlzLlRMRE4gJiYgdGhpcy5vYnNlcnZlVExETiA9PT0gdHJ1ZSApIHtcbiAgICAgIHRocm93IG5ldyBVUklFcnJvcignVG9wIExldmVsIGRvbWFpbiBuYW1lIE1VU1QgbWF0Y2ggdGhlIHByaW1hcnkgZG9tYWluIG5hbWUnKTtcbiAgICB9XG5cbiAgICAvLyBJZiBvdXIgbWF0Y2hlZCBVUkwgaGFzIGEgbGVhZGluZyBzbGFzaCwgdGhlbiB3ZSB3YW50IHRvIGRyb3AgdGhlIGRvY1Jvb3RcbiAgICAvLyBpbiB0aGVyZSB1bmxlc3MgdGhlIGZ1bmN0aW9uIHBhcmFtIFwiaW5jbHVkZURvY1Jvb3RcIiBpcyBmYWxzZS5cbiAgICBpZihcbiAgICAgICggdHlwZW9mIHJvb3QgPT09ICdzdHJpbmcnICYmIHJvb3QgPT09ICcvJyApIHx8XG4gICAgICAoIHR5cGVvZiBkb2N1bWVudFJvb3QgPT09ICdzdHJpbmcnICYmIGRvY3VtZW50Um9vdCA9PT0gdGhpcy5kb2N1bWVudFJvb3QgKVxuICAgICkge1xuICAgICAgaWYoIGluY2x1ZGVEb2NSb290ICkge1xuICAgICAgICBydG5VUkwgPSBgJHt0aGlzLmRvY3VtZW50Um9vdH0vJHtwYXRofWA7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBydG5VUkwgPSBgLyR7cGF0aH1gO1xuICAgICAgfVxuICAgIC8vIEVsc2UgaWYgcGF0aCBoYXMgcmVzdWx0ZWQgaW4gYW4gZW1wdHkgc3RyaW5nLCBhc3N1bWUgdGhlIHBhdGggaXMgdGhlIHJvb3RcbiAgICB9IGVsc2UgaWYoIHBhdGggPT09ICcnICkge1xuICAgICAgcnRuVVJMID0gJy8nXG4gICAgLy8gT3RoZXJ3aXNlLCBqdXN0IHBhc3MgdGhlIHBhdGggY29tcGxldGVseS5cbiAgICB9IGVsc2Uge1xuICAgICAgcnRuVVJMID0gcGF0aDtcbiAgICB9XG5cbiAgICAvLyBJZiB3ZSB3YW50IHRvIGluY2x1ZGUgdHJhaWxzIChoYXNoZXMgYW5kIHBhcmFtcywgYXMgZGV0ZXJtaW5lZCBieSBhXG4gICAgLy8gZnVuY2l0b24gcGFyYW0pLCB0aGVuIGFkZCB0aGVtIHRvIHRoZSBVUkwuXG4gICAgaWYoIGluY2x1ZGVUcmFpbHMgKSB7XG4gICAgICAvLyBBcHBlbmQgYW55IHBhcmFtc1xuICAgICAgaWYoIHR5cGVvZiBwYXJhbXMgPT0gJ3N0cmluZycgKSB7XG4gICAgICAgIHJ0blVSTCArPSBwYXJhbXM7XG4gICAgICB9XG4gICAgICAgIC8vIEFwcGVuZCBhbnkgaGFzaGVzXG4gICAgICBpZiggdHlwZW9mIGhhc2hiYW5nID09ICdzdHJpbmcnICkge1xuICAgICAgICBydG5VUkwgKz0gaGFzaGJhbmc7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHJ0blVSTDtcbiAgfVxuXG4gIC8qKlxuICAgKiBMaXN0ZW5lciBmb3IgdGhlIHBvcHN0YXRlIG1ldGhvZFxuICAgKlxuICAgKiBAcHJpdmF0ZVxuICAgKiBAcGFyYW0gIHtvYmplY3R9IGUgdGhlIHBhc3NlZCBldmVudCBvYmplY3RcbiAgICogQHJldHVybiB2b2lkXG4gICAqL1xuICBzdGF0aWMgX3BvcHN0YXRlKGUpIHtcbiAgICB2YXIgYmFzZSwgc3RhdGU7XG4gICAgaWYodGhpcy5zdXBwb3J0KVxuICAgIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIHN0YXRlID0gKGJhc2UgPSB0aGlzLmhpc3RvcnkpLnN0YXRlIHx8IChiYXNlLnN0YXRlID0gZS5zdGF0ZSB8fCAoZS5zdGF0ZSA9IHdpbmRvdy5ldmVudC5zdGF0ZSkpO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgY29uc29sZS5sb2coZSk7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlcnMgYW5kIHNldHRlcnNcbiAgICovXG5cbiAgLyoqXG4gICAqIChnZXR0ZXIvc2V0dGVyKSBTZXRzIHRoZSBkb2N1bWVudCByb290IGZyb20gYSBwYXNzZWQgVVJMXG4gICAqIHJldHVybnMgdGhlIHNhdmVkIGRvY3VtZW50IHJvb3Qgb3IgYSBgL2AgaWYgbm90IHNldFxuICAgKlxuICAgKiBAZGVmYXVsdCAnLydcbiAgICogQHR5cGUge3N0cmluZ31cbiAgICovXG4gIHN0YXRpYyBzZXQgZG9jdW1lbnRSb290KGRvY3VtZW50Um9vdCA9ICcnKSB7XG5cbiAgICBpZigvXlxcLz8kLy50ZXN0KGRvY3VtZW50Um9vdCkpIHtcbiAgICAgIHRoaXMuX2RvY3VtZW50Um9vdCA9ICcvJztcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBkb2Nyb290UmVnZXggd29ya3MgbGlrZSB0aGlzOlxuICAgICAqIGBgYFxuICAgICAgICAgXlxuICAgICAgICAgKFteOl0rOi8vICAgICAgICMgSFRUUChTKSBldGMuXG4gICAgICAgICAgICAgKFteL10rKSAgICAgIyBUaGUgaG9zdG5hbWUgKGlmIGF2YWlsYWJsZSlcbiAgICAgICAgICk/XG4gICAgICAgICAvP1xuICAgICAgICAgKC4qKD89LykpPyAgICAgICMgdGhlIFVSSSB0byB1c2UgYXMgdGhlIGRvY3Jvb3QgbGVzcyBhbnkgYXZhaWxhYmxlIHRyYWlsaW5nIHNsYXNoXG4gICAgICogYGBgXG4gICAgICovXG4gICAgY29uc3QgZG9jcm9vdFJlZ2V4ID0gL14oW146XSs6XFwvXFwvKFteXFwvXSspKT9cXC8/KC4qKD89XFwvKSk/LztcbiAgICAvLyBwYXNzIHRoZSBkb2Nyb290IGFuZCBob3N0bmFtZVxuICAgIGNvbnN0IFtfMSwgXzIsIGhvc3RuYW1lLCBkb2Nyb290XSA9IGRvY3Jvb3RSZWdleC5leGVjKGRvY3VtZW50Um9vdCk7XG5cbiAgICAvLyBFcnJvciBjaGVja1xuICAgIC8vIGNoZWNrIGZvciB0aGUgcHJlc2VuY2Ugb2YgdGhlIHJlcG9ydGVkIFRMRE5cbiAgICBpZihcbiAgICAgIHR5cGVvZiBob3N0bmFtZSA9PT0gJ3N0cmluZycgJiZcbiAgICAgIGhvc3RuYW1lICE9IHRoaXMuVExETiAmJlxuICAgICAgdGhpcy5vYnNlcnZlVExETiA9PT0gdHJ1ZVxuICAgICkge1xuICAgICAgdGhyb3cgbmV3IFVSSUVycm9yKCdUb3AgTGV2ZWwgZG9tYWluIG5hbWUgTVVTVCBtYXRjaCB0aGUgcHJpbWFyeSBkb21haW4gbmFtZScpO1xuICAgIH1cblxuICAgIGlmKGRvY3Jvb3QpIHtcbiAgICAgIHRoaXMuX2RvY3VtZW50Um9vdCA9IGAvJHtkb2Nyb290fWA7XG4gICAgfVxuICAgIFxuICB9XG4gIHN0YXRpYyBnZXQgZG9jdW1lbnRSb290KCkge1xuICAgIHJldHVybiB0aGlzLl9kb2N1bWVudFJvb3QgfHwgJy8nO1xuICB9XG5cbiAgLyoqXG4gICAqIChnZXR0ZXIvc2V0dGVyKSBQcm92aWRlcyBhbiBlcnJvciBpZiB0aGUgdXNlciB0cmllcyB0byBzZXQgdGhlIGhpc3Rvcnkgb2JqZWN0XG4gICAqIHJldHVybnMgdGhlIHdpbmRvdyBoaXN0b3J5IG9iamVjdFxuICAgKlxuICAgKiBAdHlwZSB7b2JqZWN0fVxuICAgKi9cbiAgc3RhdGljIHNldCBoaXN0b3J5KGhpc3RvcnkpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ1RoZSBoaXN0b3J5IG9iamVjdCBpcyByZWFkIG9ubHknKTtcbiAgfVxuICBzdGF0aWMgZ2V0IGhpc3RvcnkoKSB7XG4gICAgcmV0dXJuIHdpbmRvdy5oaXN0b3J5O1xuICB9XG5cbiAgLyoqXG4gICAqIChnZXR0ZXIvc2V0dGVyKSBTZXRzIHRoZSB0b3AgbGV2ZWwgZG9tYWluIG5hbWUuXG4gICAqIHJldHVybnMgdGhlIHJlY29yZGVkIFRMRE4gb3IsIGJ5IGRlZmF1bHQsIHdpbmRvdy5sb2NhdGlvbi5ob3N0bmFtZS5cbiAgICpcbiAgICogQHR5cGUge3N0cmluZ31cbiAgICovXG4gIHN0YXRpYyBzZXQgVExETihUTEROKSB7XG4gICAgLy8gQG5vdGUgV2Ugc2hvdWxkIGluY2x1ZGUgc29tZSBlcnJvciBjaGVja2luZyBpbiBoZXJlXG4gICAgdGhpcy5fVExETiA9IFRMRE47XG4gIH1cbiAgc3RhdGljIGdldCBUTEROKCkge1xuICAgIHJldHVybiB0aGlzLl9UTEROIHx8IHdpbmRvdy5sb2NhdGlvbi5ob3N0bmFtZTtcbiAgfVxuXG4gIC8qKlxuICAgKiAoZ2V0dGVyL3NldHRlcikgd2hldGhlciB0byBvYnNlcnZlIHRoZSBUTEROIG9yIGB0cnVlYCAoZGVmYXVsdCkuXG4gICAqXG4gICAqIEBkZWZhdWx0IHRydWVcbiAgICogQHR5cGUge2Jvb2xlYW59XG4gICAqL1xuICBzdGF0aWMgc2V0IG9ic2VydmVUTEROKG9ic2VydmUpIHtcbiAgICAvLyBDaGVjayB0byBtYWtlIHN1cmUgdGhhdCB0aGUgYmFzc2VkIHZhbHVlIGlzIG9mIHR5cGUgYm9vbGVhbi5cbiAgICBpZih0eXBlb2Ygb2JzZXJ2ZSA9PT0gJ2Jvb2xlYW4nKVxuICAgIHtcbiAgICAgIHRoaXMuX29ic2VydmVUTEROID0gb2JzZXJ2ZTtcbiAgICB9IGVsc2VcbiAgICB7XG4gICAgICBjb25zb2xlLndhcm4oJ29ic2VydmVUTEROIG11c3QgYmUgb2YgdHlwZSBib29sZWFuJyk7XG4gICAgfVxuICB9XG4gIHN0YXRpYyBnZXQgb2JzZXJ2ZVRMRE4oKSB7XG4gICAgaWYodHlwZW9mIHRoaXMuX29ic2VydmVUTEROID09PSAnYm9vbGVhbicpXG4gICAge1xuICAgICAgcmV0dXJuIHRoaXMuX29ic2VydmVUTEROO1xuICAgIH0gZWxzZVxuICAgIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiAoZ2V0dGVyL3NldHRlcikgV2hldGhlciB0aGlzIGhpc3Rvcnkgb2JqZWN0IGlzIGluIGRldm1vZGUuIERlZmF1bHRzIHRvIGZhbHNlXG4gICAqXG4gICAqIEBkZWZhdWx0IGZhbHNlXG4gICAqIEB0eXBlIHtib29sZWFufVxuICAgKi9cbiAgc3RhdGljIHNldCBkZXZtb2RlKGRldm1vZGUpIHtcbiAgICAvLyBDaGVjayB0byBtYWtlIHN1cmUgdGhhdCB0aGUgYmFzc2VkIHZhbHVlIGlzIG9mIHR5cGUgYm9vbGVhbi5cbiAgICBpZih0eXBlb2YgZGV2bW9kZSA9PT0gJ2Jvb2xlYW4nKVxuICAgIHtcbiAgICAgIHRoaXMuX2Rldm1vZGUgPSBkZXZtb2RlO1xuICAgIH0gZWxzZVxuICAgIHtcbiAgICAgIGNvbnNvbGUud2FybignZGV2bW9kZSBtdXN0IGJlIG9mIHR5cGUgYm9vbGVhbicpO1xuICAgIH1cbiAgfVxuICBzdGF0aWMgZ2V0IGRldm1vZGUoKSB7XG4gICAgaWYodHlwZW9mIHRoaXMuX2Rldm1vZGUgPT09ICdib29sZWFuJylcbiAgICB7XG4gICAgICByZXR1cm4gdGhpcy5fZGV2bW9kZTtcbiAgICB9IGVsc2VcbiAgICB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIChnZXR0ZXIvc2V0dGVyKSBXaGV0aGVyIHRoaXMgaGlzdG9yeSBvYmplY3QgaXMgaW5pdGlhbGlhc2VkLlxuICAgKlxuICAgKiBAZGVmYXVsdCBmYWxzZVxuICAgKiBAdHlwZSB7Ym9vbGVhbn1cbiAgICovXG4gIHN0YXRpYyBzZXQgaW5pdGlhbGlhc2VkKGluaXRpYWxpYXNlZCkge1xuICAgIC8vIENoZWNrIHRvIG1ha2Ugc3VyZSB0aGF0IHRoZSBiYXNzZWQgdmFsdWUgaXMgb2YgdHlwZSBib29sZWFuLlxuICAgIGlmKHR5cGVvZiBpbml0aWFsaWFzZWQgPT09ICdib29sZWFuJylcbiAgICB7XG4gICAgICB0aGlzLl9pbml0aWFsaWFzZWQgPSBpbml0aWFsaWFzZWQ7XG4gICAgfSBlbHNlXG4gICAge1xuICAgICAgY29uc29sZS53YXJuKCdpbml0aWFsaWFzZWQgbXVzdCBiZSBvZiB0eXBlIGJvb2xlYW4nKTtcbiAgICB9XG4gIH1cbiAgc3RhdGljIGdldCBpbml0aWFsaWFzZWQoKSB7XG4gICAgaWYodHlwZW9mIHRoaXMuX2luaXRpYWxpYXNlZCA9PT0gJ2Jvb2xlYW4nKVxuICAgIHtcbiAgICAgIHJldHVybiB0aGlzLl9pbml0aWFsaWFzZWQ7XG4gICAgfSBlbHNlXG4gICAge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiAoZ2V0dGVyL3NldHRlcikgV2hldGhlciBoaXN0b3J5IGlzIHN1cHBvcnRlZCBieSB0aGUgYnJvd3NlciBvciBkZXZpY2UuXG4gICAqIFByb3ZpZGVzIGFuIGVycm9yIGlmIHRoZSB1c2VyIHRyaWVzIHRvIHNldCB0aGUgc3VwcG9ydCB2YWx1ZSwgdW5sZXNzIHRoZSBvYmplY3QgaXMgaW4gZGV2bW9kZVxuICAgKlxuICAgKiBAdHlwZSB7Ym9vbGVhbn1cbiAgICovXG4gIHN0YXRpYyBzZXQgc3VwcG9ydChzdXBwb3J0ID0gZmFsc2UpIHtcbiAgICAvLyBUaGlzIG92ZXJyaWRlc1xuICAgIGlmKCB0aGlzLmRldm1vZGUgJiYgdHlwZW9mIHN1cHBvcnQgPT09ICdib29sZWFuJyApIHtcbiAgICAgIHRoaXMuX3N1cHBvcnQgPSBzdXBwb3J0O1xuICAgIH1cbiAgICB0aHJvdyBuZXcgRXJyb3IoJ1RoZSBzdXBwb3J0IGlzIHJlYWQgb25seScpO1xuICB9XG4gIHN0YXRpYyBnZXQgc3VwcG9ydCgpIHtcbiAgICByZXR1cm4gKHdpbmRvdy5oaXN0b3J5ICYmIHdpbmRvdy5oaXN0b3J5LnB1c2hTdGF0ZSk7XG4gIH1cblxuICAvKipcbiAgICogKGdldHRlci9zZXR0ZXIpIFRoZSBsZW5ndGggb2YgdGhlIGhpc3Rvcnkgc3RhY2tcbiAgICpcbiAgICogQHR5cGUge2ludGVnZXJ9XG4gICAqL1xuICBzdGF0aWMgZ2V0ICRsZW5ndGgoKSB7XG4gICAgcmV0dXJuIHRoaXMuaGlzdG9yeS5sZW5ndGg7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgSGlzdG9yeTtcbiJdfQ==
