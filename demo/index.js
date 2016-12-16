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
     * @typedef {Object}                     AJAXGetResolver
     * @property {string}       response     The response from the AJAX call
     * @property {AJAXDocument} document     The document nodes resulting from this call.
     * @property {array}        arguments    The arguments array originally passed to the {@link AJAX.ajaxGet} method
     * @property {DOMElement}   linkTarget   The target element that fired the {@link AJAX.ajaxGet} 
     */

    /**
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
          console.warn("Tried run an AJAX GET when the object wasn't in OK or CLICKED mode");
        }

        return;
      }

      // Retrieve a request object and construct a valid URL
      var req = this.requestObject;
      var parsedURL = this._fixURL(URL);
      var DOMTarget = document.querySelectorAll(target)[0];

      var readyState = 0;
      var status = 0;
      var args = arguments;

      var requestPromise = new Promise(function handler(resolve, reject) {
        var _this3 = this;

        // Need to add all sorts of error checking here.

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
      }.bind(this));

      // This promise takes the returned promise and runs the equivalent of a "finally"
      Promise.resolve(requestPromise).
      // THEN: responsible for adding the transition classes, then finding the transition length and rutinging the promise from that
      then(function (resolver) {
        if (resolver.error) {
          throw resolver.error;
        } else if (!resolver.responseText) {
          throw ERRORS.BAD_PROMISE;
        } else {
          // Find the target node
          var targetNode = resolver.DOMTarget;
          // add the class to it
          _wtcUtilityHelpers2.default.removeClass(this.classBaseTransition + '-in-end', targetNode);
          _wtcUtilityHelpers2.default.addClass(this.classBaseTransition + '-out-start', targetNode);
          _wtcUtilityHelpers2.default.addClass(this.classBaseTransition + '-out', targetNode);
          // Add the animation end listener to the target node
          return _wtcAnimationEvents2.default.addEndEventListener(targetNode, function () {
            return resolver;
          });
        }
      }.bind(this)).
      // THEN: responsible for adding the end class, then returning a promise with the listed resolveTimeout
      then(function (resolver) {
        // Find the target node
        var targetNode = resolver.DOMTarget;
        // Modify its classes
        _wtcUtilityHelpers2.default.removeClass(this.classBaseTransition + '-out-start', targetNode);
        _wtcUtilityHelpers2.default.addClass(this.classBaseTransition + '-out-end', targetNode);
        // Set a null timeout to repaint on classchange
        return new Promise(function (resolve, reject) {
          setTimeout(function () {
            resolve(resolver);
          }, this.resolveTimeout);
        }.bind(this));
      }.bind(this)).
      // THEN: responsible for adding the final content to the main document. Returns a promise that identifies the transition
      then(function (resolver) {
        // Find the target node
        var targetNode = resolver.DOMTarget;
        // Modify its classes
        _wtcUtilityHelpers2.default.removeClass(this.classBaseTransition + '-out-end', targetNode);
        _wtcUtilityHelpers2.default.removeClass(this.classBaseTransition + '-out', targetNode);
        _wtcUtilityHelpers2.default.addClass(this.classBaseTransition + '-in', targetNode);
        _wtcUtilityHelpers2.default.addClass(this.classBaseTransition + '-in-start', targetNode);
        // Finally. Parse the result
        this._completeTransfer(resolver.document, targetNode, selection, fromPop);
        // Add the animation end listener to the target node
        return _wtcAnimationEvents2.default.addEndEventListener(targetNode, function () {
          return resolver;
        });
      }.bind(this)).
      // THEN: Responsible for tidying everything up
      then(function (resolver) {
        // Find the target node
        var targetNode = resolver.DOMTarget;
        // Modify its classes
        _wtcUtilityHelpers2.default.removeClass(this.classBaseTransition + '-in', targetNode);
        _wtcUtilityHelpers2.default.removeClass(this.classBaseTransition + '-in-start', targetNode);
        _wtcUtilityHelpers2.default.addClass(this.classBaseTransition + '-in-end', targetNode);
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

      console.log(content, content.doc.getElementsByTagName('title'));

      // Find the new page title
      newTitle = content.doc.getElementsByTagName('title')[0].text;

      target.innerHTML = '';

      content.subdoc.forEach(function (result) {
        target.appendChild(result.cloneNode(true));
      });

      // Update the internal reference to the last target
      this.lastChangedTarget = target;

      if (!fromPop) {
        // Push the new state to the history.
        console.clear();
        console.log({ target: target, selection: selection });
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJkZW1vL3J1bi5qcyIsIm5vZGVfbW9kdWxlcy93dGMtdXRpbGl0eS1oZWxwZXJzL2Rpc3Qvd3RjLXV0aWxpdHktaGVscGVycy5qcyIsInNyYy93dGMtQW5pbWF0aW9uRXZlbnRzLmpzIiwic3JjL3d0Yy1hamF4LmpzIiwic3JjL3d0Yy1oaXN0b3J5LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUNBQTs7QUFFQTtBQUNBLGNBQUssSUFBTCxDQUFVLElBQVY7QUFDQTtBQUNBLGNBQUssWUFBTCxHQUFvQixRQUFwQjs7QUFFQSxTQUFTLEtBQVQsQ0FBZSxFQUFmLEVBQW1CO0FBQ2pCLE1BQUksU0FBUyxVQUFULElBQXVCLFNBQTNCLEVBQXNDO0FBQ3BDO0FBQ0QsR0FGRCxNQUVPO0FBQ0wsYUFBUyxnQkFBVCxDQUEwQixrQkFBMUIsRUFBOEMsRUFBOUM7QUFDRDtBQUNGOztBQUVELE1BQU0sWUFDTjtBQUNFO0FBQ0EsZ0JBQUssU0FBTDs7QUFFQSxnQkFBSyxjQUFMLEdBQXNCLElBQXRCLENBSkYsQ0FJOEI7O0FBRTVCO0FBQ0E7QUFDQSxTQUFPLGdCQUFQLENBQXdCLE1BQXhCLEVBQWdDLFVBQVMsQ0FBVCxFQUFZO0FBQzFDLGFBQVMsY0FBVCxDQUF3QixRQUF4QixFQUFrQyxnQkFBbEMsQ0FBbUQsT0FBbkQsRUFBNEQsVUFBUyxDQUFULEVBQVk7QUFDdEUsb0JBQ0UsT0FERixDQUNVLGtCQURWLEVBQzhCLGVBRDlCLEVBQytDLGtCQUQvQyxFQUNtRSxFQUFFLE1BRHJFLEVBRUUsSUFGRixDQUVPLFVBQVMsUUFBVCxFQUFtQjtBQUN0QjtBQUNBLGVBQU8sUUFBUDtBQUNELE9BTEg7QUFNRCxLQVBEO0FBUUQsR0FURDtBQVVELENBbkJEOztBQXFCQSxPQUFPLE9BQVA7OztBQ3BDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7QUNyWEE7Ozs7Ozs7QUFRQTs7Ozs7Ozs7QUFRQSxJQUFJLHlCQUF5QixTQUF6QixzQkFBeUIsQ0FBUyxJQUFULEVBQzdCO0FBQ0UsTUFBSSxXQUFXLENBQWY7QUFDQSxNQUFJLFlBQVksc0JBQWhCO0FBQ0EsTUFBSSxnQkFBZ0IsU0FBaEIsYUFBZ0IsQ0FBUyxFQUFULEVBQWE7QUFDL0IsUUFBRyxjQUFjLE9BQWpCLEVBQTBCO0FBQ3hCLFVBQUksZ0JBQWdCLFVBQVUsSUFBVixDQUFlLE9BQU8sZ0JBQVAsQ0FBd0IsRUFBeEIsRUFBNEIsa0JBQTNDLENBQXBCO0FBQ0EsVUFBSSxpQkFBaUIsVUFBVSxJQUFWLENBQWUsT0FBTyxnQkFBUCxDQUF3QixFQUF4QixFQUE0QixlQUEzQyxDQUFyQjtBQUNBLFVBQUksT0FBTyxjQUFjLENBQWQsS0FBb0IsY0FBYyxDQUFkLEtBQW9CLEdBQXBCLEdBQTBCLElBQTFCLEdBQWlDLENBQXJELENBQVg7QUFDQSxVQUFJLFFBQVEsZUFBZSxDQUFmLEtBQXFCLGVBQWUsQ0FBZixLQUFxQixHQUFyQixHQUEyQixJQUEzQixHQUFrQyxDQUF2RCxDQUFaO0FBQ0EsVUFBRyxPQUFPLEtBQVAsR0FBZSxRQUFsQixFQUE0QjtBQUMxQixtQkFBVyxPQUFPLEtBQWxCO0FBQ0Q7QUFDRjtBQUNELFFBQUcsR0FBRyxVQUFOLEVBQWtCO0FBQ2hCLFdBQUksSUFBSSxDQUFSLElBQWEsR0FBRyxVQUFoQixFQUE0QjtBQUMxQixzQkFBYyxHQUFHLFVBQUgsQ0FBYyxDQUFkLENBQWQ7QUFDRDtBQUNGO0FBQ0YsR0FmRDs7QUFpQkEsZ0JBQWMsSUFBZDs7QUFFQSxNQUFHLE9BQU8sUUFBUCxLQUFvQixRQUF2QixFQUFpQztBQUMvQixlQUFXLENBQVg7QUFDRDs7QUFFRCxTQUFPLFFBQVA7QUFDRCxDQTVCRDs7QUE4QkE7Ozs7Ozs7OztBQVNBOzs7Ozs7Ozs7QUFTQSxJQUFJLHNCQUFzQixTQUF0QixtQkFBc0IsQ0FBUyxJQUFULEVBQWUsUUFBZixFQUF5QjtBQUNqRCxVQUFRLEdBQVIsQ0FBWSwrQkFBWjtBQUNBLFVBQVEsR0FBUixDQUFZLElBQVosRUFBa0IsUUFBbEIsU0FBbUMsUUFBbkMseUNBQW1DLFFBQW5DO0FBQ0EsVUFBUSxHQUFSLENBQVksS0FBWjtBQUNBLE1BQUcsT0FBTyxRQUFQLEtBQW9CLFVBQXZCLEVBQ0E7QUFDRSxRQUFJLFdBQVcsU0FBWCxRQUFXLEdBQVU7QUFBRSxhQUFPLEVBQVA7QUFBVyxLQUF0QztBQUNEO0FBQ0QsU0FBTyxJQUFJLE9BQUosQ0FBWSxVQUFTLE9BQVQsRUFBa0IsTUFBbEIsRUFBMEI7QUFDM0MsUUFBSSxPQUFPLHVCQUF1QixJQUF2QixDQUFYO0FBQ0EsUUFBSSxVQUFVLFdBQVcsWUFBVztBQUNsQyxVQUFJLFdBQVcsVUFBZjtBQUNBLGVBQVMsSUFBVCxHQUFnQixJQUFoQjtBQUNBLGNBQVEsUUFBUjtBQUNELEtBSmEsRUFJWCxJQUpXLENBQWQ7QUFLRCxHQVBNLENBQVA7QUFRRCxDQWhCRDs7QUFrQkE7Ozs7OztBQU1BLElBQUksWUFBWTtBQUNkLHVCQUFxQjtBQURQLENBQWhCOztrQkFLZSxTOzs7Ozs7Ozs7Ozs7OztBQzlGZjs7OztBQUNBOzs7O0FBQ0E7Ozs7Ozs7Ozs7OztBQUVBLElBQU0sU0FBUztBQUNiLFFBQXNCLENBRFQ7QUFFYixhQUFzQixDQUZUO0FBR2IsYUFBc0IsQ0FIVDtBQUliLG1CQUFzQixDQUpUO0FBS2IsWUFBc0I7QUFMVCxDQUFmOztBQVFBLElBQU0sWUFBWTtBQUNoQixjQUFzQixDQUROLENBQ1E7QUFEUixDQUFsQjs7QUFJQSxJQUFNLFNBQVM7QUFDYixtQkFBc0IsQ0FEVDtBQUViLGlCQUFzQixDQUZUO0FBR2IsZ0JBQXNCO0FBSFQsQ0FBZjs7QUFNQTs7Ozs7Ozs7Ozs7Ozs7Ozs7SUFnQk0sSTs7Ozs7Ozs7Ozs7OztBQUVKOzs7O0FBSUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztnQ0FvQytDO0FBQUE7O0FBQUEsVUFBOUIsWUFBOEIsdUVBQWYsU0FBUyxJQUFNOztBQUM3QyxVQUFNLFFBQVEsYUFBYSxnQkFBYixPQUFrQyxLQUFLLGFBQXZDLGdCQUFkOztBQUVBLFlBQU0sT0FBTixDQUFjLFVBQUMsSUFBRCxFQUFTO0FBQ3JCO0FBQ0EsYUFBSyxlQUFMLENBQXFCLE9BQUssYUFBMUI7O0FBRUEsYUFBSyxnQkFBTCxDQUFzQixPQUF0QixFQUErQixVQUFDLENBQUQsRUFBTTtBQUNuQyxpQkFBSyxnQkFBTCxDQUFzQixDQUF0Qjs7QUFFQSxZQUFFLGNBQUY7QUFDRCxTQUpEO0FBS0EsZ0JBQVEsR0FBUixDQUFZLElBQVo7QUFDRCxPQVZEO0FBV0Q7O0FBRUQ7Ozs7Ozs7Ozs7O0FBWUE7Ozs7O0FBS0E7Ozs7Ozs7QUFPQTs7Ozs7Ozs7OztBQVVBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7NEJBZWUsRyxFQUFLLE0sRUFBUSxTLEVBQVcsVSxFQUF3QztBQUFBLFVBQTVCLE9BQTRCLHVFQUFsQixLQUFrQjtBQUFBLFVBQVgsSUFBVyx1RUFBSixFQUFJOzs7QUFFN0U7QUFDQSxVQUFJLEtBQUssS0FBTCxHQUFhLE9BQU8sT0FBeEIsRUFDQTtBQUNFLFlBQUksS0FBSyxPQUFULEVBQ0E7QUFDRSxrQkFBUSxJQUFSLENBQWMsb0VBQWQ7QUFDRDs7QUFFRDtBQUNEOztBQUVEO0FBQ0EsVUFBTSxNQUFNLEtBQUssYUFBakI7QUFDQSxVQUFNLFlBQVksS0FBSyxPQUFMLENBQWEsR0FBYixDQUFsQjtBQUNBLFVBQU0sWUFBWSxTQUFTLGdCQUFULENBQTBCLE1BQTFCLEVBQWtDLENBQWxDLENBQWxCOztBQUVBLFVBQUksYUFBYSxDQUFqQjtBQUNBLFVBQUksU0FBUyxDQUFiO0FBQ0EsVUFBSSxPQUFPLFNBQVg7O0FBRUEsVUFBSSxpQkFBaUIsSUFBSSxPQUFKLENBQVksU0FBUyxPQUFULENBQWlCLE9BQWpCLEVBQTBCLE1BQTFCLEVBQWtDO0FBQUE7O0FBRWpFOztBQUVBO0FBQ0EsWUFBSSxnQkFBSixDQUFxQixrQkFBckIsRUFBeUMsVUFBQyxDQUFELEVBQU87QUFDOUMsdUJBQWEsRUFBRSxNQUFGLENBQVMsVUFBdEI7QUFDQSxtQkFBUyxFQUFFLE1BQUYsQ0FBUyxNQUFsQjtBQUNELFNBSEQ7O0FBS0E7QUFDQSxZQUFJLGdCQUFKLENBQXFCLE1BQXJCLEVBQTZCLFVBQUMsQ0FBRCxFQUFPO0FBQ2xDO0FBQ0EsY0FBSSxJQUFJLE1BQUosSUFBYyxHQUFkLElBQXFCLElBQUksTUFBSixHQUFhLEdBQXRDLEVBQTRDO0FBQzFDO0FBQ0EsZ0JBQUksZUFBZSxJQUFJLFlBQXZCO0FBQ0E7QUFDQSxnQkFBSSxlQUFlLE9BQUssY0FBTCxDQUFvQixZQUFwQixFQUFrQyxNQUFsQyxFQUEwQyxTQUExQyxFQUFxRCxPQUFyRCxFQUE4RCxVQUE5RCxDQUFuQjtBQUNBO0FBQ0EsZ0JBQUksV0FBVztBQUNiLDRCQUFjLFlBREQ7QUFFYix3QkFBVSxZQUZHO0FBR2IseUJBQVcsSUFIRTtBQUliLDBCQUFZLGNBQWMsSUFKYjtBQUtiLHlCQUFXO0FBTEUsYUFBZjtBQU9BLG9CQUFRLFFBQVI7QUFDRCxXQWRELE1BY087QUFDTCxtQkFBTyxPQUFPLFVBQWQ7QUFDRDtBQUNGLFNBbkJEOztBQXFCQSxZQUFJLGdCQUFKLENBQXFCLE9BQXJCLEVBQThCLFVBQUMsQ0FBRCxFQUFPO0FBQ25DLGlCQUFPLE9BQU8sVUFBZDtBQUNELFNBRkQ7QUFHRCxPQW5DZ0MsQ0FtQy9CLElBbkMrQixDQW1DMUIsSUFuQzBCLENBQVosQ0FBckI7O0FBcUNBO0FBQ0EsY0FDRSxPQURGLENBQ1UsY0FEVjtBQUVFO0FBQ0EsVUFIRixDQUdRLFVBQVMsUUFBVCxFQUFtQjtBQUN2QixZQUFHLFNBQVMsS0FBWixFQUFtQjtBQUNqQixnQkFBTSxTQUFTLEtBQWY7QUFDRCxTQUZELE1BRU8sSUFBRyxDQUFDLFNBQVMsWUFBYixFQUEyQjtBQUNoQyxnQkFBTSxPQUFPLFdBQWI7QUFDRCxTQUZNLE1BRUE7QUFDTDtBQUNBLGNBQUksYUFBYSxTQUFTLFNBQTFCO0FBQ0E7QUFDQSxzQ0FBRyxXQUFILENBQWUsS0FBSyxtQkFBTCxHQUF5QixTQUF4QyxFQUFtRCxVQUFuRDtBQUNBLHNDQUFHLFFBQUgsQ0FBWSxLQUFLLG1CQUFMLEdBQXlCLFlBQXJDLEVBQW1ELFVBQW5EO0FBQ0Esc0NBQUcsUUFBSCxDQUFZLEtBQUssbUJBQUwsR0FBeUIsTUFBckMsRUFBNkMsVUFBN0M7QUFDQTtBQUNBLGlCQUFPLDZCQUFVLG1CQUFWLENBQThCLFVBQTlCLEVBQTBDLFlBQVc7QUFDMUQsbUJBQU8sUUFBUDtBQUNELFdBRk0sQ0FBUDtBQUdEO0FBQ0YsT0FqQkssQ0FpQkosSUFqQkksQ0FpQkMsSUFqQkQsQ0FIUjtBQXFCRTtBQUNBLFVBdEJGLENBc0JRLFVBQVMsUUFBVCxFQUFtQjtBQUN2QjtBQUNBLFlBQUksYUFBYSxTQUFTLFNBQTFCO0FBQ0E7QUFDQSxvQ0FBRyxXQUFILENBQWUsS0FBSyxtQkFBTCxHQUF5QixZQUF4QyxFQUFzRCxVQUF0RDtBQUNBLG9DQUFHLFFBQUgsQ0FBWSxLQUFLLG1CQUFMLEdBQXlCLFVBQXJDLEVBQWlELFVBQWpEO0FBQ0E7QUFDQSxlQUFPLElBQUksT0FBSixDQUFZLFVBQVMsT0FBVCxFQUFrQixNQUFsQixFQUEwQjtBQUMzQyxxQkFBVyxZQUFXO0FBQ3BCLG9CQUFRLFFBQVI7QUFDRCxXQUZELEVBRUcsS0FBSyxjQUZSO0FBR0QsU0FKa0IsQ0FJakIsSUFKaUIsQ0FJWixJQUpZLENBQVosQ0FBUDtBQUtELE9BWkssQ0FZSixJQVpJLENBWUMsSUFaRCxDQXRCUjtBQW1DRTtBQUNBLFVBcENGLENBb0NPLFVBQVMsUUFBVCxFQUFtQjtBQUN0QjtBQUNBLFlBQUksYUFBYSxTQUFTLFNBQTFCO0FBQ0E7QUFDQSxvQ0FBRyxXQUFILENBQWUsS0FBSyxtQkFBTCxHQUF5QixVQUF4QyxFQUFvRCxVQUFwRDtBQUNBLG9DQUFHLFdBQUgsQ0FBZSxLQUFLLG1CQUFMLEdBQXlCLE1BQXhDLEVBQWdELFVBQWhEO0FBQ0Esb0NBQUcsUUFBSCxDQUFZLEtBQUssbUJBQUwsR0FBeUIsS0FBckMsRUFBNEMsVUFBNUM7QUFDQSxvQ0FBRyxRQUFILENBQVksS0FBSyxtQkFBTCxHQUF5QixXQUFyQyxFQUFrRCxVQUFsRDtBQUNBO0FBQ0EsYUFBSyxpQkFBTCxDQUF1QixTQUFTLFFBQWhDLEVBQTBDLFVBQTFDLEVBQXNELFNBQXRELEVBQWlFLE9BQWpFO0FBQ0E7QUFDQSxlQUFPLDZCQUFVLG1CQUFWLENBQThCLFVBQTlCLEVBQTBDLFlBQVc7QUFDMUQsaUJBQU8sUUFBUDtBQUNELFNBRk0sQ0FBUDtBQUdELE9BZEksQ0FjSCxJQWRHLENBY0UsSUFkRixDQXBDUDtBQW1ERTtBQUNBLFVBcERGLENBb0RPLFVBQVMsUUFBVCxFQUFtQjtBQUN0QjtBQUNBLFlBQUksYUFBYSxTQUFTLFNBQTFCO0FBQ0E7QUFDQSxvQ0FBRyxXQUFILENBQWUsS0FBSyxtQkFBTCxHQUF5QixLQUF4QyxFQUErQyxVQUEvQztBQUNBLG9DQUFHLFdBQUgsQ0FBZSxLQUFLLG1CQUFMLEdBQXlCLFdBQXhDLEVBQXFELFVBQXJEO0FBQ0Esb0NBQUcsUUFBSCxDQUFZLEtBQUssbUJBQUwsR0FBeUIsU0FBckMsRUFBZ0QsVUFBaEQ7QUFDRCxPQVBJLENBT0gsSUFQRyxDQU9FLElBUEYsQ0FwRFAsRUE0REUsS0E1REYsQ0E0RFMsVUFBUyxHQUFULEVBQWM7QUFDbkIsZ0JBQVEsR0FBUixDQUFZLEdBQVo7QUFDQSxhQUFLLE1BQUwsQ0FBWSxVQUFaLEVBQXdCLElBQUksTUFBNUIsRUFBb0MsT0FBTyxDQUEzQztBQUNELE9BSE0sQ0FHTCxJQUhLLENBR0EsSUFIQSxDQTVEVDs7QUFpRUE7QUFDQSxXQUFLLGFBQUwsR0FBcUIsU0FBckI7O0FBRUEsVUFBSSxJQUFKLENBQVMsS0FBVCxFQUFnQixTQUFoQixFQUEyQixJQUEzQjtBQUNBLFVBQUksSUFBSixDQUFTLElBQVQ7O0FBRUE7QUFDQSxXQUFLLEtBQUwsR0FBYSxPQUFPLE9BQXBCOztBQUVBLGFBQU8sY0FBUDtBQUNEOztBQUVEOzs7O0FBSUE7Ozs7Ozs7Ozs7OEJBT2lCLEMsRUFBRztBQUNsQixVQUFJLElBQUo7QUFBQSxVQUFVLFFBQVEsRUFBbEI7QUFDQSxVQUFJLG1HQUFpQyxDQUFqQyxDQUFKOztBQUVBLFVBQUksY0FBSixFQUFxQjtBQUNuQixnQkFBUSxDQUFDLE9BQU8sS0FBSyxPQUFiLEVBQXNCLEtBQXRCLEtBQWdDLEtBQUssS0FBTCxHQUFhLEVBQUUsS0FBRixLQUFZLEVBQUUsS0FBRixHQUFVLE9BQU8sS0FBUCxDQUFhLEtBQW5DLENBQTdDLENBQVI7QUFDRDs7QUFFRCxVQUFJLE9BQU8sU0FBUyxRQUFULENBQWtCLElBQTdCO0FBQ0EsVUFBSSxTQUFTLE1BQU0sTUFBTixJQUFnQixLQUFLLGlCQUFsQztBQUNBLFVBQUksWUFBWSxNQUFNLFNBQU4sSUFBbUIsVUFBVSxRQUE3QztBQUNBLFVBQUksT0FBTyxNQUFNLElBQU4sSUFBYyxFQUF6Qjs7QUFFQSxXQUFLLE9BQUwsQ0FBYSxJQUFiLEVBQW1CLE1BQW5CLEVBQTJCLFNBQTNCLEVBQXNDLElBQXRDLEVBQTRDLElBQTVDOztBQUVBLGFBQU8sY0FBUDtBQUNEOztBQUVEOzs7Ozs7Ozs7OztxQ0FRd0IsQyxFQUFHO0FBQ3pCLFVBQUksS0FBSyxLQUFMLElBQWMsT0FBTyxFQUF6QixFQUNBO0FBQ0UsWUFBSSxLQUFLLE9BQVQsRUFDQTtBQUNFLGtCQUFRLElBQVIsQ0FBYywrREFBZDtBQUNEOztBQUVEO0FBQ0Q7O0FBRUQ7QUFDQSxVQUFNLE9BQVksRUFBRSxNQUFwQjtBQUNBLFVBQU0sT0FBWSxLQUFLLFlBQUwsQ0FBa0IsTUFBbEIsQ0FBbEI7QUFDQSxVQUFNLFNBQVksS0FBSyxZQUFMLENBQWtCLEtBQUssZUFBdkIsQ0FBbEI7QUFDQSxVQUFNLFlBQVksS0FBSyxZQUFMLENBQWtCLEtBQUssa0JBQXZCLENBQWxCOztBQUVBO0FBQ0EsV0FBSyxLQUFMLEdBQWEsT0FBTyxPQUFwQjs7QUFFQSxXQUFLLE9BQUwsQ0FBYSxJQUFiLEVBQW1CLE1BQW5CLEVBQTJCLFNBQTNCO0FBQ0Q7O0FBRUQ7Ozs7OztBQU1BOzs7Ozs7Ozs7Ozs7Ozs7O21DQWFzQixPLEVBQVMsTSxFQUFRLFMsRUFBVzs7QUFFaEQsVUFBSSxHQUFKLEVBQVMsTUFBVCxFQUFpQixPQUFqQjs7QUFFQTtBQUNBLFlBQU0sU0FBUyxhQUFULENBQXVCLEtBQXZCLENBQU47QUFDQSxVQUFJLFNBQUosR0FBZ0IsT0FBaEI7O0FBRUEsVUFBSSxjQUFjLFVBQVUsUUFBNUIsRUFDQTtBQUNFLGlCQUFTLElBQUksZ0JBQUosQ0FBd0IsTUFBeEIsVUFBVDtBQUNELE9BSEQsTUFHTztBQUNMLGlCQUFTLElBQUksZ0JBQUosQ0FBcUIsU0FBckIsQ0FBVDtBQUNEOztBQUVELGFBQU87QUFDTCxhQUFLLEdBREE7QUFFTCxnQkFBUTtBQUZILE9BQVA7QUFJRDs7QUFFRDs7Ozs7Ozs7Ozs7OztzQ0FVeUIsTyxFQUFTLE0sRUFBUSxTLEVBQVcsTyxFQUFTOztBQUU1RCxVQUFJLFdBQVcsU0FBUyxLQUF4QjtBQUFBLFVBQStCLFFBQS9CO0FBQUEsVUFBeUMsV0FBekM7O0FBRUEsY0FBUSxHQUFSLENBQVksT0FBWixFQUFxQixRQUFRLEdBQVIsQ0FBWSxvQkFBWixDQUFpQyxPQUFqQyxDQUFyQjs7QUFFQTtBQUNBLGlCQUFXLFFBQVEsR0FBUixDQUFZLG9CQUFaLENBQWlDLE9BQWpDLEVBQTBDLENBQTFDLEVBQTZDLElBQXhEOztBQUVBLGFBQU8sU0FBUCxHQUFtQixFQUFuQjs7QUFFQSxjQUFRLE1BQVIsQ0FBZSxPQUFmLENBQXVCLFVBQVMsTUFBVCxFQUFpQjtBQUN0QyxlQUFPLFdBQVAsQ0FBbUIsT0FBTyxTQUFQLENBQWlCLElBQWpCLENBQW5CO0FBQ0QsT0FGRDs7QUFJQTtBQUNBLFdBQUssaUJBQUwsR0FBeUIsTUFBekI7O0FBRUEsVUFBSSxDQUFDLE9BQUwsRUFBZTtBQUNiO0FBQ0EsZ0JBQVEsS0FBUjtBQUNBLGdCQUFRLEdBQVIsQ0FBWSxFQUFFLFFBQVEsTUFBVixFQUFrQixXQUFXLFNBQTdCLEVBQVo7QUFDQSxhQUFLLElBQUwsQ0FBVSxLQUFLLGFBQWYsRUFBOEIsUUFBOUIsRUFBd0MsRUFBRSxRQUFRLDRCQUFHLHFCQUFILENBQXlCLE1BQXpCLENBQVYsRUFBNEMsV0FBVyxTQUF2RCxFQUF4QztBQUNEOztBQUVEO0FBQ0EsV0FBSyxLQUFMLEdBQWEsT0FBTyxFQUFwQjtBQUNEOztBQUVEOzs7Ozs7Ozs7Ozs7MkJBU2MsVSxFQUFZLE0sRUFBMkM7QUFBQSxVQUFuQyxVQUFtQyx1RUFBdEIsT0FBTyxhQUFlOztBQUNuRSxVQUFJLGtCQUFtQixVQUFTLEdBQVQsRUFBYztBQUFFLGFBQUksSUFBSSxHQUFSLElBQWUsTUFBZixFQUF1QjtBQUFFLGNBQUcsT0FBTyxHQUFQLEtBQWUsR0FBbEIsRUFBdUIsT0FBTyxHQUFQO0FBQVksU0FBQyxPQUFPLGVBQVA7QUFBd0IsT0FBdEcsQ0FBd0csVUFBeEcsQ0FBdEI7QUFDQSxjQUFRLElBQVIsOENBQXdELFVBQXhELGtCQUErRSxNQUEvRSxzQkFBc0csZUFBdEcsRUFBeUgsa0NBQXpIO0FBQ0Q7O0FBR0Q7Ozs7QUFJQTs7Ozs7Ozs7OztzQkFPeUIsUyxFQUFXO0FBQ2xDLFVBQUcsT0FBTyxTQUFQLEtBQXFCLFFBQXhCLEVBQWtDO0FBQ2hDLGFBQUssY0FBTCxHQUFzQixTQUF0QjtBQUNELE9BRkQsTUFFTztBQUNMLGdCQUFRLElBQVIsQ0FBYSxpQ0FBYjtBQUNEO0FBQ0YsSzt3QkFDMEI7QUFDekIsYUFBTyxLQUFLLGNBQUwsSUFBdUIsZUFBOUI7QUFDRDs7QUFFRDs7Ozs7Ozs7Ozs7c0JBUTJCLFMsRUFBVztBQUNwQyxVQUFHLE9BQU8sU0FBUCxLQUFxQixRQUF4QixFQUFrQztBQUNoQyxhQUFLLGdCQUFMLEdBQXdCLFNBQXhCO0FBQ0QsT0FGRCxNQUVPO0FBQ0wsZ0JBQVEsSUFBUixDQUFhLGlDQUFiO0FBQ0Q7QUFDRixLO3dCQUM0QjtBQUMzQixhQUFPLEtBQUssZ0JBQUwsSUFBeUIsc0JBQWhDO0FBQ0Q7O0FBRUQ7Ozs7Ozs7Ozs7O3NCQVE4QixTLEVBQVc7QUFDdkMsVUFBRyxPQUFPLFNBQVAsS0FBcUIsUUFBeEIsRUFBa0M7QUFDaEMsYUFBSyxtQkFBTCxHQUEyQixTQUEzQjtBQUNELE9BRkQsTUFFTztBQUNMLGdCQUFRLElBQVIsQ0FBYSxpQ0FBYjtBQUNEO0FBQ0YsSzt3QkFDK0I7QUFDOUIsYUFBTyxLQUFLLG1CQUFMLElBQTRCLHlCQUFuQztBQUNEOztBQUVEOzs7Ozs7Ozs7Ozs7Ozs7OztzQkFjK0IsUyxFQUFXO0FBQ3hDLFVBQUcsT0FBTyxTQUFQLEtBQXFCLFFBQXhCLEVBQWtDO0FBQ2hDLGFBQUssb0JBQUwsR0FBNEIsU0FBNUI7QUFDRCxPQUZELE1BRU87QUFDTCxnQkFBUSxJQUFSLENBQWEsaUNBQWI7QUFDRDtBQUNGLEs7d0JBQ2dDO0FBQy9CLGFBQU8sS0FBSyxvQkFBTCxJQUE2QixnQkFBcEM7QUFDRDs7QUFFRDs7Ozs7Ozs7Ozs7c0JBUW1DLFMsRUFBVztBQUM1QyxVQUFHLE9BQU8sU0FBUCxLQUFxQixRQUF4QixFQUFrQztBQUNoQyxhQUFLLHdCQUFMLEdBQWdDLFNBQWhDO0FBQ0QsT0FGRCxNQUVPO0FBQ0wsZ0JBQVEsSUFBUixDQUFhLGlDQUFiO0FBQ0Q7QUFDRixLO3dCQUNvQztBQUNuQyxhQUFPLEtBQUssd0JBQUwsSUFBaUMsK0JBQXhDO0FBQ0Q7O0FBRUQ7Ozs7Ozs7Ozt3QkFNMkI7QUFDekIsYUFBTyxJQUFJLGNBQUosRUFBUDtBQUNEOztBQUVEOzs7Ozs7Ozs7O3NCQU82QixNLEVBQVE7QUFDbkMsV0FBSyxrQkFBTCxHQUEwQixNQUExQjtBQUNELEs7d0JBQzhCO0FBQzdCLGFBQU8sS0FBSyxrQkFBTCxJQUEyQixJQUFsQztBQUNEOztBQUVEOzs7Ozs7Ozs7OztzQkFRMEIsTyxFQUFTO0FBQ2pDLFdBQUssZUFBTCxHQUF1QixVQUFVLENBQVYsR0FBYyxPQUFkLEdBQXdCLElBQS9DO0FBQ0QsSzt3QkFDMkI7QUFDMUIsYUFBTyxLQUFLLGVBQUwsR0FBdUIsQ0FBdkIsR0FBMkIsS0FBSyxlQUFoQyxHQUFrRCxDQUF6RDtBQUNEOztBQUVEOzs7Ozs7Ozs7Ozs7OztzQkFXaUIsSyxFQUFPO0FBQ3RCLFVBQUksT0FBTyxLQUFQLEtBQWlCLFFBQXJCLEVBQWdDO0FBQzlCLFlBQUksT0FBTyxLQUFQLE1BQWtCLFNBQXRCLEVBQWtDO0FBQ2hDLGVBQUssTUFBTCxHQUFjLE9BQU8sS0FBUCxDQUFkO0FBQ0E7QUFDRDtBQUNGLE9BTEQsTUFLTyxJQUFJLE9BQU8sS0FBUCxLQUFpQixRQUFyQixFQUFnQztBQUNyQyxhQUFJLElBQUksTUFBUixJQUFrQixNQUFsQixFQUEwQjtBQUN4QixjQUFHLE9BQU8sTUFBUCxNQUFtQixLQUF0QixFQUE2QjtBQUMzQixpQkFBSyxNQUFMLEdBQWMsS0FBZDs7QUFFQSxnQkFBSSxLQUFLLE9BQVQsRUFDQTtBQUNFLHNCQUFRLEdBQVIsNEJBQXFDLEtBQUssTUFBMUMsUUFBcUQsa0NBQXJEO0FBQ0Q7O0FBRUQ7QUFDRDtBQUNGO0FBQ0Y7QUFDRCxjQUFRLElBQVIsQ0FBYSxvREFBYjtBQUNELEs7d0JBQ2tCO0FBQ2pCLGFBQU8sS0FBSyxNQUFMLElBQWUsQ0FBdEI7QUFDRDs7QUFFRDs7Ozs7Ozs7OztzQkFPeUIsUyxFQUFXO0FBQ2xDLFVBQUksT0FBTyxTQUFQLEtBQXFCLFFBQXpCLEVBQW9DO0FBQ2xDLGFBQUssY0FBTCxHQUFzQixTQUF0QjtBQUNEO0FBQ0YsSzt3QkFDMEI7QUFDekIsYUFBTyxLQUFLLGNBQUwsSUFBdUIsSUFBOUI7QUFDRDs7Ozs7O1FBR00sSSxHQUFBLEk7UUFBTSxNLEdBQUEsTTtRQUFRLE0sR0FBQSxNOzs7Ozs7Ozs7Ozs7Ozs7QUN6bkJ2Qjs7Ozs7Ozs7SUFRTSxPOzs7Ozs7Ozs7QUFFSjs7OztBQUlBOzs7Ozs7OzJCQU82QjtBQUFBOztBQUFBLFVBQWpCLE9BQWlCLHVFQUFQLEtBQU87O0FBQzNCLFVBQUcsS0FBSyxPQUFSLEVBQ0E7QUFDRTtBQUNBLFlBQUk7QUFDRixpQkFBTyxnQkFBUCxDQUF3QixVQUF4QixFQUFvQyxVQUFDLENBQUQsRUFBTTtBQUN4QyxnQkFBSSxpQkFBaUIsTUFBSyxTQUFMLENBQWUsQ0FBZixDQUFyQjtBQUNBLG1CQUFPLGNBQVA7QUFDRCxXQUhEOztBQUtBLGVBQUssT0FBTCxHQUFvQixPQUFwQjtBQUVELFNBUkQsQ0FRRSxPQUFPLENBQVAsRUFBVTs7QUFFVjtBQUNBLGNBQUcsS0FBSyxPQUFSLEVBQWlCO0FBQ2Ysb0JBQVEsSUFBUixDQUFhLGlDQUFiO0FBQ0Esb0JBQVEsR0FBUixDQUFZLENBQVo7QUFDRDs7QUFFRCxpQkFBTyxLQUFQO0FBQ0Q7O0FBRUQsYUFBSyxXQUFMLEdBQW1CLElBQW5CO0FBQ0EsZUFBTyxJQUFQO0FBQ0Q7O0FBRUQsYUFBTyxLQUFQO0FBQ0Q7O0FBRUQ7Ozs7Ozs7Ozs7Ozt5QkFTWSxHLEVBQWdDO0FBQUEsVUFBM0IsS0FBMkIsdUVBQW5CLEVBQW1CO0FBQUEsVUFBZixRQUFlLHVFQUFKLEVBQUk7OztBQUUxQyxVQUFJLFlBQVksRUFBaEI7O0FBRUE7QUFDQSxVQUFJO0FBQ0Ysb0JBQVksS0FBSyxPQUFMLENBQWEsR0FBYixFQUFrQixJQUFsQixFQUF3QixJQUF4QixDQUFaO0FBQ0QsT0FGRCxDQUVFLE9BQU8sQ0FBUCxFQUFVO0FBQ1YsWUFBRyxLQUFLLE9BQVIsRUFBaUI7QUFDZixrQkFBUSxJQUFSLENBQWEseUNBQWI7QUFDQSxrQkFBUSxHQUFSLENBQVksQ0FBWjtBQUNEO0FBQ0QsZUFBTyxLQUFQO0FBQ0Q7O0FBRUQ7QUFDQSxVQUFHLEtBQUssT0FBUixFQUNBO0FBQ0UsWUFBSTtBQUNGLGVBQUssT0FBTCxDQUFhLFNBQWIsQ0FBdUIsUUFBdkIsRUFBaUMsS0FBakMsRUFBd0MsU0FBeEM7QUFDRCxTQUZELENBRUUsT0FBTyxDQUFQLEVBQVU7QUFDVixjQUFHLEtBQUssT0FBUixFQUFpQjtBQUNmLG9CQUFRLElBQVIsQ0FBYSxrRUFBYjtBQUNBLG9CQUFRLEdBQVIsQ0FBWSxDQUFaO0FBQ0Q7QUFDRCxpQkFBTyxLQUFQO0FBQ0Q7QUFDSDtBQUNDLE9BWkQsTUFhQTtBQUNFLGVBQU8sUUFBUCxDQUFnQixJQUFoQixVQUE0QixHQUE1QjtBQUNEOztBQUVELGFBQU8sSUFBUDtBQUNEOztBQUVEOzs7Ozs7OzsyQkFLYztBQUNaLFdBQUssT0FBTCxDQUFhLElBQWI7QUFDRDs7QUFFRDs7Ozs7Ozs7OEJBS2lCO0FBQ2YsV0FBSyxPQUFMLENBQWEsT0FBYjtBQUNEOztBQUdEOzs7O0FBSUE7Ozs7Ozs7Ozs7Ozs0QkFTZSxHLEVBQWtEO0FBQUEsVUFBN0MsY0FBNkMsdUVBQTVCLElBQTRCO0FBQUEsVUFBdEIsYUFBc0IsdUVBQU4sSUFBTTs7O0FBRS9ELFVBQUksTUFBSjs7QUFFQTs7Ozs7Ozs7Ozs7Ozs7QUFjQSxVQUFNLFdBQVcsZ0NBQThCLEtBQUssWUFBbkMsaURBQWpCOztBQWxCK0QsMkJBbUJhLFNBQVMsSUFBVCxDQUFjLEdBQWQsQ0FuQmI7QUFBQTtBQUFBLFVBbUJ4RCxLQW5Cd0Q7QUFBQSxVQW1CakQsSUFuQmlEO0FBQUEsVUFtQjNDLFFBbkIyQztBQUFBLFVBbUJqQyxZQW5CaUM7QUFBQSxVQW1CbkIsSUFuQm1CO0FBQUEsVUFtQmIsSUFuQmE7QUFBQSxVQW1CUCxNQW5CTztBQUFBLFVBbUJDLFFBbkJEOztBQXFCL0QsY0FBUSxHQUFSLENBQVksS0FBSyxZQUFqQixFQUErQixZQUEvQixFQUE2QyxJQUE3QyxFQUFtRCxJQUFuRDs7QUFFQTtBQUNBO0FBQ0EsVUFBSSxPQUFPLFFBQVAsS0FBb0IsUUFBcEIsSUFBZ0MsYUFBYSxLQUFLLElBQWxELElBQTBELEtBQUssV0FBTCxLQUFxQixJQUFuRixFQUEwRjtBQUN4RixjQUFNLElBQUksUUFBSixDQUFhLDBEQUFiLENBQU47QUFDRDs7QUFFRDtBQUNBO0FBQ0EsVUFDSSxPQUFPLElBQVAsS0FBZ0IsUUFBaEIsSUFBNEIsU0FBUyxHQUF2QyxJQUNFLE9BQU8sWUFBUCxLQUF3QixRQUF4QixJQUFvQyxpQkFBaUIsS0FBSyxZQUY5RCxFQUdFO0FBQ0EsWUFBSSxjQUFKLEVBQXFCO0FBQ25CLG1CQUFZLEtBQUssWUFBakIsU0FBaUMsSUFBakM7QUFDRCxTQUZELE1BRU87QUFDTCx5QkFBYSxJQUFiO0FBQ0Q7QUFDSDtBQUNDLE9BVkQsTUFVTyxJQUFJLFNBQVMsRUFBYixFQUFrQjtBQUN2QixpQkFBUyxHQUFUO0FBQ0Y7QUFDQyxPQUhNLE1BR0E7QUFDTCxpQkFBUyxJQUFUO0FBQ0Q7O0FBRUQ7QUFDQTtBQUNBLFVBQUksYUFBSixFQUFvQjtBQUNsQjtBQUNBLFlBQUksT0FBTyxNQUFQLElBQWlCLFFBQXJCLEVBQWdDO0FBQzlCLG9CQUFVLE1BQVY7QUFDRDtBQUNDO0FBQ0YsWUFBSSxPQUFPLFFBQVAsSUFBbUIsUUFBdkIsRUFBa0M7QUFDaEMsb0JBQVUsUUFBVjtBQUNEO0FBQ0Y7O0FBRUQsYUFBTyxNQUFQO0FBQ0Q7O0FBRUQ7Ozs7Ozs7Ozs7OEJBT2lCLEMsRUFBRztBQUNsQixVQUFJLElBQUosRUFBVSxLQUFWO0FBQ0EsVUFBRyxLQUFLLE9BQVIsRUFDQTtBQUNFLFlBQUk7QUFDRixrQkFBUSxDQUFDLE9BQU8sS0FBSyxPQUFiLEVBQXNCLEtBQXRCLEtBQWdDLEtBQUssS0FBTCxHQUFhLEVBQUUsS0FBRixLQUFZLEVBQUUsS0FBRixHQUFVLE9BQU8sS0FBUCxDQUFhLEtBQW5DLENBQTdDLENBQVI7QUFDQSxpQkFBTyxJQUFQO0FBQ0QsU0FIRCxDQUdFLE9BQU8sQ0FBUCxFQUFVO0FBQ1YsaUJBQU8sS0FBUDtBQUNEO0FBQ0Y7QUFDRCxhQUFPLEtBQVA7QUFDRDs7QUFFRDs7OztBQUlBOzs7Ozs7Ozs7O3dCQU8yQztBQUFBLFVBQW5CLFlBQW1CLHVFQUFKLEVBQUk7OztBQUV6Qzs7Ozs7Ozs7Ozs7QUFXQSxVQUFNLGVBQWUsc0NBQXJCO0FBQ0E7O0FBZHlDLCtCQWVMLGFBQWEsSUFBYixDQUFrQixZQUFsQixDQWZLO0FBQUE7QUFBQSxVQWVsQyxFQWZrQztBQUFBLFVBZTlCLEVBZjhCO0FBQUEsVUFlMUIsUUFmMEI7QUFBQSxVQWVoQixPQWZnQjs7QUFnQnpDLGNBQVEsR0FBUixDQUFZLFFBQVosRUFBc0IsT0FBdEI7O0FBRUE7QUFDQTtBQUNBLFVBQ0UsT0FBTyxRQUFQLEtBQW9CLFFBQXBCLElBQ0EsWUFBWSxLQUFLLElBRGpCLElBRUEsS0FBSyxXQUFMLEtBQXFCLElBSHZCLEVBSUU7QUFDQSxjQUFNLElBQUksUUFBSixDQUFhLDBEQUFiLENBQU47QUFDRDs7QUFFRCxXQUFLLGFBQUwsU0FBeUIsT0FBekI7QUFDRCxLO3dCQUN5QjtBQUN4QixhQUFPLEtBQUssYUFBTCxJQUFzQixHQUE3QjtBQUNEOztBQUVEOzs7Ozs7Ozs7c0JBTW1CLE8sRUFBUztBQUMxQixZQUFNLElBQUksS0FBSixDQUFVLGlDQUFWLENBQU47QUFDRCxLO3dCQUNvQjtBQUNuQixhQUFPLE9BQU8sT0FBZDtBQUNEOztBQUVEOzs7Ozs7Ozs7c0JBTWdCLEksRUFBTTtBQUNwQjtBQUNBLFdBQUssS0FBTCxHQUFhLElBQWI7QUFDRCxLO3dCQUNpQjtBQUNoQixhQUFPLEtBQUssS0FBTCxJQUFjLE9BQU8sUUFBUCxDQUFnQixRQUFyQztBQUNEOztBQUVEOzs7Ozs7Ozs7c0JBTXVCLE8sRUFBUztBQUM5QjtBQUNBLFVBQUcsT0FBTyxPQUFQLEtBQW1CLFNBQXRCLEVBQ0E7QUFDRSxhQUFLLFlBQUwsR0FBb0IsT0FBcEI7QUFDRCxPQUhELE1BSUE7QUFDRSxnQkFBUSxJQUFSLENBQWEscUNBQWI7QUFDRDtBQUNGLEs7d0JBQ3dCO0FBQ3ZCLFVBQUcsT0FBTyxLQUFLLFlBQVosS0FBNkIsU0FBaEMsRUFDQTtBQUNFLGVBQU8sS0FBSyxZQUFaO0FBQ0QsT0FIRCxNQUlBO0FBQ0UsZUFBTyxJQUFQO0FBQ0Q7QUFDRjs7QUFFRDs7Ozs7Ozs7O3NCQU1tQixPLEVBQVM7QUFDMUI7QUFDQSxVQUFHLE9BQU8sT0FBUCxLQUFtQixTQUF0QixFQUNBO0FBQ0UsYUFBSyxRQUFMLEdBQWdCLE9BQWhCO0FBQ0QsT0FIRCxNQUlBO0FBQ0UsZ0JBQVEsSUFBUixDQUFhLGlDQUFiO0FBQ0Q7QUFDRixLO3dCQUNvQjtBQUNuQixVQUFHLE9BQU8sS0FBSyxRQUFaLEtBQXlCLFNBQTVCLEVBQ0E7QUFDRSxlQUFPLEtBQUssUUFBWjtBQUNELE9BSEQsTUFJQTtBQUNFLGVBQU8sS0FBUDtBQUNEO0FBQ0Y7O0FBRUQ7Ozs7Ozs7OztzQkFNd0IsWSxFQUFjO0FBQ3BDO0FBQ0EsVUFBRyxPQUFPLFlBQVAsS0FBd0IsU0FBM0IsRUFDQTtBQUNFLGFBQUssYUFBTCxHQUFxQixZQUFyQjtBQUNELE9BSEQsTUFJQTtBQUNFLGdCQUFRLElBQVIsQ0FBYSxzQ0FBYjtBQUNEO0FBQ0YsSzt3QkFDeUI7QUFDeEIsVUFBRyxPQUFPLEtBQUssYUFBWixLQUE4QixTQUFqQyxFQUNBO0FBQ0UsZUFBTyxLQUFLLGFBQVo7QUFDRCxPQUhELE1BSUE7QUFDRSxlQUFPLEtBQVA7QUFDRDtBQUNGOztBQUVEOzs7Ozs7Ozs7d0JBTW9DO0FBQUEsVUFBakIsT0FBaUIsdUVBQVAsS0FBTzs7QUFDbEM7QUFDQSxVQUFJLEtBQUssT0FBTCxJQUFnQixPQUFPLE9BQVAsS0FBbUIsU0FBdkMsRUFBbUQ7QUFDakQsYUFBSyxRQUFMLEdBQWdCLE9BQWhCO0FBQ0Q7QUFDRCxZQUFNLElBQUksS0FBSixDQUFVLDBCQUFWLENBQU47QUFDRCxLO3dCQUNvQjtBQUNuQixhQUFRLE9BQU8sT0FBUCxJQUFrQixPQUFPLE9BQVAsQ0FBZSxTQUF6QztBQUNEOztBQUVEOzs7Ozs7Ozt3QkFLb0I7QUFDbEIsYUFBTyxLQUFLLE9BQUwsQ0FBYSxNQUFwQjtBQUNEOzs7Ozs7a0JBR1ksTyIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJpbXBvcnQgeyBBSkFYIH0gZnJvbSBcIi4uL3NyYy93dGMtYWpheFwiO1xuXG4vLyBJbml0aWFsaXNlIHRoZSBoaXN0b3J5IG9iamVjdCBpbiBkZXYgbW9kZVxuQUpBWC5pbml0KHRydWUpO1xuLy8gU2V0IHRoZSBkb2N1bWVudCByb290IGZvciB0aGUgYXBwbGljYXRpb24gKGlmIG5lY2Vzc2FyeSlcbkFKQVguZG9jdW1lbnRSb290ID0gJy9kZW1vLyc7XG5cbmZ1bmN0aW9uIHJlYWR5KGZuKSB7XG4gIGlmIChkb2N1bWVudC5yZWFkeVN0YXRlICE9ICdsb2FkaW5nJykge1xuICAgIGZuKCk7XG4gIH0gZWxzZSB7XG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsIGZuKTtcbiAgfVxufVxuXG5yZWFkeShmdW5jdGlvbigpXG57XG4gIC8vIFRoaXMgaW5pdGlhbGlzZXMgYW55IGxpbmtzIHdpdGggQUpBWCBhdHRyaWJ1dGVzXG4gIEFKQVguaW5pdExpbmtzKCk7XG5cbiAgQUpBWC5yZXNvbHZlVGltZW91dCA9IDEwMDA7IC8vIFJlbW92ZSB0aGlzIHdoZW4gbm90IFxuXG4gIC8vIFRoaXMgaXMgYSBtYW51YWwgaW5pdGlhbGlzYXRpb24gb2YgbGlua3MgYW5kIGlzLCBpbnN0ZWFkLCBhIGRlbW9uc3RyYXRpb25cbiAgLy8gb2YgaG93IHByb2dyYW1hdGljIEFKQVggcmV0cmlldmFsIHdvcmtzLlxuICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsIGZ1bmN0aW9uKGUpIHtcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbGlua18xJykuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbihlKSB7XG4gICAgICBBSkFYLlxuICAgICAgICBhamF4R2V0KFwiL2RlbW8vcGFnZTEuaHRtbFwiLCBcIiNsaW5rMS10YXJnZXRcIiwgXCIubGluazEtc2VsZWN0aW9uXCIsIGUudGFyZ2V0KS5cbiAgICAgICAgdGhlbihmdW5jdGlvbihyZXNvbHZlcikge1xuICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCdvbkxvYWQnLCByZXNvbHZlcik7XG4gICAgICAgICAgcmV0dXJuIHJlc29sdmVyO1xuICAgICAgICB9KTtcbiAgICB9KTtcbiAgfSk7XG59KTtcblxud2luZG93LkFKQVhPYmogPSBBSkFYO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5cbnZhciBfdHlwZW9mID0gdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIHR5cGVvZiBTeW1ib2wuaXRlcmF0b3IgPT09IFwic3ltYm9sXCIgPyBmdW5jdGlvbiAob2JqKSB7IHJldHVybiB0eXBlb2Ygb2JqOyB9IDogZnVuY3Rpb24gKG9iaikgeyByZXR1cm4gb2JqICYmIHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiBvYmouY29uc3RydWN0b3IgPT09IFN5bWJvbCAmJiBvYmogIT09IFN5bWJvbC5wcm90b3R5cGUgPyBcInN5bWJvbFwiIDogdHlwZW9mIG9iajsgfTtcblxudmFyIHV0aWxpdGllcyA9IHt9O1xuXG4vKipcbiAqIHJhbmRvbUJldHdlZW5cbiAqIEdlbmVyYXRlIGEgcmFuZG9tIGludGVnZXIgbnVtYmVyIG1heCBhbmQgbWluLlxuICogQG1pbiB7bnVtYmVyfSBNaW5pbXVtIHZhbHVlLlxuICogQG1heCB7bnVtYmVyfSBNYXhpbXVtIHZhbHVlLlxuICogcmV0dXJuIHtudW1iZXJ9IFJhbmRvbSBpbnRlZ2VyLlxuICovXG51dGlsaXRpZXMucmFuZG9tQmV0d2VlbiA9IGZ1bmN0aW9uIChtaW4sIG1heCkge1xuICByZXR1cm4gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogKG1heCAtIG1pbiArIDEpICsgbWluKTtcbn07XG5cbi8qKlxuICogZ2V0U3R5bGVcbiAqIEdldCB0aGUgY3VycmVudCBzdHlsZSB2YWx1ZSBmcm9tIGFuIGVsZW1lbnQuXG4gKiBAZWwge0RPTU5vZGV9IFRhcmdldCBlbGVtZW50LlxuICogQHByb3Age3N0cmluZ30gQ1NTIHByb3BlcnR5IG5hbWUuXG4gKiBAc3RyaXBVbml0IHtib29sZWFufSBSZW1vdmUgdW5pdHMuXG4gKiByZXR1cm4ge3N0cmluZ30gQ3VycmVudCBDU1MgdmFsdWUgV0lUSCB1bml0LlxuICovXG51dGlsaXRpZXMuZ2V0U3R5bGUgPSBmdW5jdGlvbiAoZWwsIHByb3AsIHN0cmlwVW5pdCkge1xuICB2YXIgc3RyVmFsdWUgPSBcIlwiO1xuXG4gIGlmICh3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZSkge1xuICAgIHN0clZhbHVlID0gZ2V0Q29tcHV0ZWRTdHlsZShlbCkuZ2V0UHJvcGVydHlWYWx1ZShwcm9wKTtcbiAgfVxuICAvL0lFXG4gIGVsc2UgaWYgKGVsLmN1cnJlbnRTdHlsZSkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgc3RyVmFsdWUgPSBlbC5jdXJyZW50U3R5bGVbcHJvcF07XG4gICAgICB9IGNhdGNoIChlKSB7fVxuICAgIH1cblxuICBpZiAoc3RyaXBVbml0KSB7XG4gICAgc3RyVmFsdWUgPSBwYXJzZUludChzdHJWYWx1ZSk7XG4gIH1cblxuICByZXR1cm4gc3RyVmFsdWU7XG59O1xuXG4vKipcbiAqIExvZ1xuICogU2ltcGxlIGxvZyBmdW5jdGlvbiB0byBzaG93IGRpZmZlcmVudCBjb2xvcnMgb24gdGhlIGNvbnNvbGUuXG4gKiBAc3RhdHVzIHtzdHJpbmd9IFN0YXR1cyB0eXBlLlxuICogQG1zZyB7c3RyaW5nfSBNZXNzYWdlIHRvIHNob3cuXG4gKi9cbnV0aWxpdGllcy5sb2cgPSBmdW5jdGlvbiAoc3RhdHVzLCBtc2cpIHtcbiAgdmFyIGJnYywgY29sb3I7XG5cbiAgc3dpdGNoIChzdGF0dXMpIHtcbiAgICBjYXNlIFwic3VjY2Vzc1wiOlxuICAgICAgY29sb3IgPSBcIkdyZWVuXCI7XG4gICAgICBiZ2MgPSBcIkxpbWVHcmVlblwiO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcImluZm9cIjpcbiAgICAgIGNvbG9yID0gXCJEb2RnZXJCbHVlXCI7XG4gICAgICBiZ2MgPSBcIlR1cnF1b2lzZVwiO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcImVycm9yXCI6XG4gICAgICBjb2xvciA9IFwiQmxhY2tcIjtcbiAgICAgIGJnYyA9IFwiUmVkXCI7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwid2FybmluZ1wiOlxuICAgICAgY29sb3IgPSBcIlRvbWF0b1wiO1xuICAgICAgYmdjID0gXCJHb2xkXCI7XG4gICAgICBicmVhaztcbiAgICBkZWZhdWx0OlxuICAgICAgY29sb3IgPSBcImJsYWNrXCI7XG4gICAgICBiZ2MgPSBcIldoaXRlXCI7XG4gIH1cblxuICBpZiAoKHR5cGVvZiBtc2cgPT09IFwidW5kZWZpbmVkXCIgPyBcInVuZGVmaW5lZFwiIDogX3R5cGVvZihtc2cpKSA9PT0gXCJvYmplY3RcIikge1xuICAgIGNvbnNvbGUubG9nKG1zZyk7XG4gIH0gZWxzZSB7XG4gICAgY29uc29sZS5sb2coXCIlY1wiICsgbXNnLCBcImNvbG9yOlwiICsgY29sb3IgKyBcIjtmb250LXdlaWdodDpib2xkOyBiYWNrZ3JvdW5kLWNvbG9yOiBcIiArIGJnYyArIFwiO1wiKTtcbiAgfVxufTtcblxuLyoqXG4gKiBvbmNlXG4gKiBGaXJlcyBhbiBldmVudCBvbmx5IG9uY2UgYW5kIGV4ZWN1dGVzIHRoZSBjYWxsYmFjay5cbiAqIEBub2RlIHtET01FbGVtZW50fSBEb20gZWxlbWVudCB0byBhdHRhY2ggZXZlbnQuXG4gKiBAdHlwZSB7U3RyaW5nfSBUeXBlIG9mIGV2ZW50LlxuICogQGNhbGxiYWNrIHtmdW5jdGlvbn0gQ2FsbGJhY2suXG4gKi9cbnV0aWxpdGllcy5vbmNlID0gZnVuY3Rpb24gKG5vZGUsIHR5cGUsIGNhbGxiYWNrKSB7XG4gIG5vZGUuYWRkRXZlbnRMaXN0ZW5lcih0eXBlLCBmdW5jdGlvbiAoZSkge1xuICAgIGUudGFyZ2V0LnJlbW92ZUV2ZW50TGlzdGVuZXIoZS50eXBlLCBhcmd1bWVudHMuY2FsbGVlKTtcbiAgICByZXR1cm4gY2FsbGJhY2soZSk7XG4gIH0pO1xufTtcblxuLyoqXG4gKiBzaHVmZmxlQXJyYXlcbiAqIFNodWZmbGUgYW4gYXJyYXkuXG4gKiBAYXJyYXkgQXJycmF5IHRvIGJlIHNodWZmbGVkLlxuICogcmV0dXJuIHthcnJheX0gU2h1ZmZsZWQgYXJyYXkuXG4gKi9cbnV0aWxpdGllcy5zaHVmZmxlQXJyYXkgPSBmdW5jdGlvbiAoYXJyYXkpIHtcbiAgdmFyIGN1cnJlbnRJbmRleCA9IGFycmF5Lmxlbmd0aCxcbiAgICAgIHRlbXBvcmFyeVZhbHVlLFxuICAgICAgcmFuZG9tSW5kZXg7XG5cbiAgLy8gV2hpbGUgdGhlcmUgcmVtYWluIGVsZW1lbnRzIHRvIHNodWZmbGUuLi5cbiAgd2hpbGUgKDAgIT09IGN1cnJlbnRJbmRleCkge1xuXG4gICAgLy8gUGljayBhIHJlbWFpbmluZyBlbGVtZW50Li4uXG4gICAgcmFuZG9tSW5kZXggPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBjdXJyZW50SW5kZXgpO1xuICAgIGN1cnJlbnRJbmRleCAtPSAxO1xuXG4gICAgLy8gQW5kIHN3YXAgaXQgd2l0aCB0aGUgY3VycmVudCBlbGVtZW50LlxuICAgIHRlbXBvcmFyeVZhbHVlID0gYXJyYXlbY3VycmVudEluZGV4XTtcbiAgICBhcnJheVtjdXJyZW50SW5kZXhdID0gYXJyYXlbcmFuZG9tSW5kZXhdO1xuICAgIGFycmF5W3JhbmRvbUluZGV4XSA9IHRlbXBvcmFyeVZhbHVlO1xuICB9XG5cbiAgcmV0dXJuIGFycmF5O1xufTtcblxuLyoqXG4gKiBmaXJlQ3VzdG9tRXZlbnRcbiAqIEZpcmUgYSBjdXN0b20gZXZlbnQuXG4gKiBAbmFtZSB7c3RyaW5nfSBOYW1lIG9mIHRoZSBldmVudC5cbiAqIEBkYXRhIHtvYmplY3R9IE9iamVjdCB0byBiZSBwYXNzZWQgdG8gdGhlIGV2ZW50LlxuICovXG51dGlsaXRpZXMuZmlyZUN1c3RvbUV2ZW50ID0gZnVuY3Rpb24gKG5hbWUsIGRhdGEsIGJ1YmJsZXMsIGNhbmNlbGFibGUpIHtcbiAgdmFyIGV2O1xuICB2YXIgcGFyYW1zID0ge1xuICAgIGJ1YmJsZXM6IGJ1YmJsZXMgfHwgdHJ1ZSxcbiAgICBjYW5jZWxhYmxlOiBjYW5jZWxhYmxlIHx8IHRydWUsXG4gICAgZGV0YWlsOiBkYXRhIHx8IG51bGxcbiAgfTtcblxuICBpZiAodHlwZW9mIHdpbmRvdy5DdXN0b21FdmVudCA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgZXYgPSBuZXcgQ3VzdG9tRXZlbnQobmFtZSwgcGFyYW1zKTtcbiAgfSBlbHNlIHtcbiAgICBldiA9IGRvY3VtZW50LmNyZWF0ZUV2ZW50KCdDdXN0b21FdmVudCcpO1xuICAgIGV2LmluaXRDdXN0b21FdmVudChuYW1lLCBwYXJhbXMuYnViYmxlcywgcGFyYW1zLmNhbmNlbGFibGUsIHBhcmFtcy5kZXRhaWwpO1xuICB9XG5cbiAgd2luZG93LmRpc3BhdGNoRXZlbnQoZXYpO1xufTtcblxuLyoqXG4gKiBmb3JFYWNoTm9kZVxuICogTG9vcCB0aHJvdWdoIGFuZCBhcnJheSBvZiBET00gZWxlbWVudHMuXG4gKiBAYXJyYXkge0RPTSBOb2RlIExpc3R9IExpc3Qgb2YgZWxlbWVudHMuXG4gKiBAY2FsbGJhY2sge2Z1bmN0aW9ufSBDYWxsYmFjay5cbiAqIEBzY29wZSAqb3B0aW9uYWwge2Z1bmN0aW9ufSBTY29wZSB0byBwYXNzIHRvIGNhbGxiYWNrLlxuICovXG51dGlsaXRpZXMuZm9yRWFjaE5vZGUgPSBmdW5jdGlvbiAoYXJyYXksIGNhbGxiYWNrLCBzY29wZSkge1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGFycmF5Lmxlbmd0aDsgaSsrKSB7XG4gICAgY2FsbGJhY2suY2FsbChzY29wZSwgaSwgYXJyYXlbaV0pOyAvLyBwYXNzZXMgYmFjayBzdHVmZiB3ZSBuZWVkXG4gIH1cbn07XG5cbi8qKlxuICogZ2V0RWxlbWVudFBvc2l0aW9uXG4gKiBHZXQgdGhlIHBvc2l0aW9uIG9mIHRoZSBlbGVtZW50IHJlbGF0aXZlIHRvIGRvY3VtZW50LlxuICogQGVsZW1lbnQge0RPTSBOb2RlfSBFbGVtZW50LlxuICogcmV0dXJucyBPYmplY3Qgd2l0aCBlbGVtZW50IGNvb3JkaW5hdGVzLlxuICovXG51dGlsaXRpZXMuZ2V0RWxlbWVudFBvc2l0aW9uID0gZnVuY3Rpb24gKGVsZW1lbnQpIHtcbiAgdmFyIHBvc2l0aW9uVG9WaWV3cG9ydCA9IGVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG5cbiAgdmFyIHNjcm9sbFRvcCA9IHdpbmRvdy5wYWdlWU9mZnNldDtcbiAgdmFyIHNjcm9sbExlZnQgPSB3aW5kb3cucGFnZVhPZmZzZXQ7XG5cbiAgdmFyIGNsaWVudFRvcCA9IGRvY3VtZW50LmJvZHkuY2xpZW50VG9wIHx8IDA7XG4gIHZhciBjbGllbnRMZWZ0ID0gZG9jdW1lbnQuYm9keS5jbGllbnRMZWZ0IHx8IDA7XG5cbiAgdmFyIHRvcCA9IHBvc2l0aW9uVG9WaWV3cG9ydC50b3AgKyBzY3JvbGxUb3AgLSBjbGllbnRUb3A7XG4gIHZhciBsZWZ0ID0gcG9zaXRpb25Ub1ZpZXdwb3J0LmxlZnQgKyBzY3JvbGxMZWZ0IC0gY2xpZW50TGVmdDtcblxuICByZXR1cm4ge1xuICAgIHRvcDogTWF0aC5yb3VuZCh0b3ApLFxuICAgIGxlZnQ6IE1hdGgucm91bmQobGVmdClcbiAgfTtcbn07XG5cbi8qKlxuICogZ2V0Vmlld3BvcnREaW1lbnNpb25zXG4gKiBHZXQgdGhlIGJyb3dzZXIgd2luZG93IHNpemUuXG4gKiByZXR1bnMgT2JqZWN0IHdpdGggZGltZW5zaW9ucy5cbiAqL1xudXRpbGl0aWVzLmdldFZpZXdwb3J0RGltZW5zaW9ucyA9IGZ1bmN0aW9uICgpIHtcbiAgcmV0dXJuIHtcbiAgICB3aWR0aDogTWF0aC5tYXgoZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsaWVudFdpZHRoLCB3aW5kb3cuaW5uZXJXaWR0aCB8fCAwKSxcbiAgICBoZWlnaHQ6IE1hdGgubWF4KGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGllbnRIZWlnaHQsIHdpbmRvdy5pbm5lckhlaWdodCB8fCAwKVxuICB9O1xufTtcblxuLyoqXG4gKiBjbGFzc0V4dGVuZFxuICogRXh0ZW5kcyBhIHBhcmVudCBjbGFzcy5cbiAqIEBjaGlsZCB7ZnVuY3Rpb259IENoaWxkIGNsYXNzLlxuICogQHBhcmVudCB7ZnVuY3Rpb259IFBhcmVudCBjbGFzcy5cbiAqIHJldHVybnMgdXBkYXRlZCBDaGlsZCBjbGFzcztcbiAqL1xudXRpbGl0aWVzLmNsYXNzRXh0ZW5kID0gZnVuY3Rpb24gKGNoaWxkLCBwYXJlbnQpIHtcbiAgdmFyIGhhc1Byb3AgPSB7fS5oYXNPd25Qcm9wZXJ0eTtcblxuICBmb3IgKHZhciBrZXkgaW4gcGFyZW50KSB7XG4gICAgaWYgKGhhc1Byb3AuY2FsbChwYXJlbnQsIGtleSkpIGNoaWxkW2tleV0gPSBwYXJlbnRba2V5XTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGN0b3IoKSB7XG4gICAgdGhpcy5jb25zdHJ1Y3RvciA9IGNoaWxkO1xuICB9XG5cbiAgY3Rvci5wcm90b3R5cGUgPSBwYXJlbnQucHJvdG90eXBlO1xuICBjaGlsZC5wcm90b3R5cGUgPSBuZXcgY3RvcigpO1xuICBjaGlsZC5fX3N1cGVyX18gPSBwYXJlbnQucHJvdG90eXBlO1xuXG4gIHJldHVybiBjaGlsZDtcbn07XG5cbi8qKlxuICogSGFzQ2xhc3NcbiAqIENoZWNrcyBmb3IgY2xhc3Mgb24gZWxlbWVudC5cbiAqIEBjbCB7c3RyaW5nfSBOYW1lcy4gWW91IGNhbiBzcGxpdCB0aGUgbmFtZXMgd2l0aCBhIHNwYWNlXG4gKiBAZSB7RE9NIEVsZW1lbnR9IEVsZW1lbnRcbiAqL1xudXRpbGl0aWVzLmhhc0NsYXNzID0gZnVuY3Rpb24gKGNsLCBlKSB7XG5cbiAgdmFyIGMsIGNsYXNzZXMsIGksIGosIGxlbiwgbGVuMTtcbiAgY2xhc3NlcyA9IGNsLnNwbGl0KCcgJyk7XG5cbiAgaWYgKGUuY2xhc3NMaXN0KSB7XG4gICAgZm9yIChpID0gMCwgbGVuID0gY2xhc3Nlcy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgYyA9IGNsYXNzZXNbaV07XG4gICAgICBpZiAoZS5jbGFzc0xpc3QuY29udGFpbnMoYykgPT09IHRydWUpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIGZvciAoaiA9IDAsIGxlbjEgPSBjbGFzc2VzLmxlbmd0aDsgaiA8IGxlbjE7IGorKykge1xuICAgICAgYyA9IGNsYXNzZXNbal07XG4gICAgICBpZiAobmV3IFJlZ0V4cCgnKF58ICknICsgYyArICcoIHwkKScsICdnaScpLnRlc3QoZS5jKSkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXR1cm4gZmFsc2U7XG59O1xuXG4vKipcbiAqIFJlbW92ZUNsYXNzXG4gKiBSZW1vdmUgY2xhc3MgZnJvbSBlbGVtZW50LlxuICogQGMge3N0cmluZ30gbmFtZSBvZiB0aGUgY2xhc3NcbiAqIEBlIHtET00gRWxlbWVudH0gRWxlbWVudFxuICovXG51dGlsaXRpZXMucmVtb3ZlQ2xhc3MgPSBmdW5jdGlvbiAoYywgZSkge1xuXG4gIHZhciBjbGFzc2VzLCBpLCBqLCBsZW4sIGxlbjE7XG4gIGNsYXNzZXMgPSBjLnNwbGl0KCcgJyk7XG4gIGlmIChlLmNsYXNzTGlzdCkge1xuICAgIGZvciAoaSA9IDAsIGxlbiA9IGNsYXNzZXMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgIGMgPSBjbGFzc2VzW2ldO1xuICAgICAgZS5jbGFzc0xpc3QucmVtb3ZlKGMpO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBmb3IgKGogPSAwLCBsZW4xID0gY2xhc3Nlcy5sZW5ndGg7IGogPCBsZW4xOyBqKyspIHtcbiAgICAgIGMgPSBjbGFzc2VzW2pdO1xuICAgICAgZS5jbGFzc05hbWUgPSBlLmNsYXNzTmFtZS5yZXBsYWNlKG5ldyBSZWdFeHAoJyhefFxcXFxiKScgKyBjLnNwbGl0KCcgJykuam9pbignfCcpICsgJyhcXFxcYnwkKScsICdnaScpLCAnICcpO1xuICAgIH1cbiAgfVxufTtcblxuLyoqXG4gKiBBZGRDbGFzc1xuICogQWRkIGNsYXNzIHRvIGVsZW1lbnQuXG4gKiBAYyB7c3RyaW5nfSBOYW1lIG9mIHRoZSBjbGFzc1xuICogQGUge0RPTSBFbGVtZW50fSBFbGVtZW50XG4gKi9cbnV0aWxpdGllcy5hZGRDbGFzcyA9IGZ1bmN0aW9uIChjLCBlKSB7XG5cbiAgdmFyIGNsYXNzZXMsIGksIGosIGxlbiwgbGVuMTtcbiAgY2xhc3NlcyA9IGMuc3BsaXQoJyAnKTtcblxuICBpZiAoZS5jbGFzc0xpc3QpIHtcbiAgICBmb3IgKGkgPSAwLCBsZW4gPSBjbGFzc2VzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICBjID0gY2xhc3Nlc1tpXTtcbiAgICAgIGUuY2xhc3NMaXN0LmFkZChjKTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgZm9yIChqID0gMCwgbGVuMSA9IGNsYXNzZXMubGVuZ3RoOyBqIDwgbGVuMTsgaisrKSB7XG4gICAgICBjID0gY2xhc3Nlc1tqXTtcbiAgICAgIGUuY2xhc3NOYW1lICs9ICcgJyArIGM7XG4gICAgfVxuICB9XG59O1xuXG4vKipcbiAqIEdldFNpYmxpbmdzXG4gKiBHZXQgc2libGluZ3MgZnJvbSBlbGVtZW50XG4gKiBAZSB7RE9NIEVsZW1lbnR9IEVsZW1lbnRcbiAqIEByZXR1cm4gQXJyYXkgb2YgRE9NIEVsZW1lbnRzXG4gKi9cbnV0aWxpdGllcy5nZXRTaWJsaW5ncyA9IGZ1bmN0aW9uIChlKSB7XG5cbiAgcmV0dXJuIEFycmF5LnByb3RvdHlwZS5maWx0ZXIuY2FsbChlLnBhcmVudE5vZGUuY2hpbGRyZW4sIGZ1bmN0aW9uIChjaGlsZCkge1xuICAgIHJldHVybiBjaGlsZCAhPT0gZTtcbiAgfSk7XG59O1xuXG4vKipcbiAqIEZ1bmN0aW9uIHRvIG5vcm1hbGl6ZSB0aGUgc2VsY3RvciAnbWF0Y2hlc1NlbGVjdG9yJyBhY3Jvc3MgYnJvd3NlcnNcbiAqL1xudXRpbGl0aWVzLm1hdGNoZXMgPSBmdW5jdGlvbiAoKSB7XG5cbiAgdmFyIGRvYywgbWF0Y2hlcztcbiAgZG9jID0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50O1xuICBtYXRjaGVzID0gZG9jLm1hdGNoZXNTZWxlY3RvciB8fCBkb2Mud2Via2l0TWF0Y2hlc1NlbGVjdG9yIHx8IGRvYy5tb3pNYXRjaGVzU2VsZWN0b3IgfHwgZG9jLm9NYXRjaGVzU2VsZWN0b3IgfHwgZG9jLm1zTWF0Y2hlc1NlbGVjdG9yO1xuXG4gIHJldHVybiBtYXRjaGVzO1xufTtcblxuLyoqXG4gKiBFeHRlbmRcbiAqIFNpbWlsYXIgdG8ganF1ZXJ5LmV4dGVuZCwgaXQgYXBwZW5kcyB0aGUgcHJvcGVydGllcyBmcm9tICdvcHRpb25zJyB0byBkZWZhdWx0IGFuZCBvdmVyd3JpdGUgdGhlIG9uZXMgdGhhdCBhbHJlYWR5IGV4aXN0IGluICdkZWZhdWx0cydcbiAqIEBkZWZhdWx0cyB7T2JqZWN0fSBEZWZhdWx0IHZhbHVlc1xuICogQG9wdGlvbnMge09iamVjdH0gTmV3IHZhbHVlc1xuICovXG51dGlsaXRpZXMuZXh0ZW5kID0gZnVuY3Rpb24gKGRlZmF1bHRzLCBvcHRpb25zKSB7XG5cbiAgdmFyIGV4dGVuZGVkID0ge30sXG4gICAgICBrZXkgPSBudWxsO1xuXG4gIGZvciAoa2V5IGluIGRlZmF1bHRzKSB7XG4gICAgaWYgKGRlZmF1bHRzLmhhc093blByb3BlcnR5KGtleSkpIGV4dGVuZGVkW2tleV0gPSBkZWZhdWx0c1trZXldO1xuICB9XG5cbiAgZm9yIChrZXkgaW4gb3B0aW9ucykge1xuICAgIGlmIChvcHRpb25zLmhhc093blByb3BlcnR5KGtleSkpIGV4dGVuZGVkW2tleV0gPSBvcHRpb25zW2tleV07XG4gIH1cblxuICByZXR1cm4gZXh0ZW5kZWQ7XG59O1xuXG4vKipcbiAqIFJldHVybnMgdGhlIENTUyBzZWxlY3RvciBmb3IgYSBwcm92aWRlZCBlbGVtZW50XG4gKlxuICogQHN0YXRpY1xuICogQHBhcmFtICB7RE9NRWxlbWVudH0gICBlbCAgICAgICAgIFRoZSBET00gbm9kZSB0byBmaW5kIGEgc2VsZWN0b3IgZm9yXG4gKiBAcmV0dXJuIHtTdHJpbmd9ICAgICAgICAgICAgICAgICAgVGhlIENTUyBzZWxlY3RvciB0aGUgZGVzY3JpYmVzIGV4YWN0bHkgd2hlcmUgdG8gZmluZCB0aGUgZWxlbWVudFxuICovXG51dGlsaXRpZXMuZ2V0U2VsZWN0b3JGb3JFbGVtZW50ID0gZnVuY3Rpb24gKGVsKSB7XG4gIHZhciBwYXJ0aWNsZXMgPSBbXTtcbiAgd2hpbGUgKGVsLnBhcmVudE5vZGUpIHtcbiAgICBpZiAoZWwuaWQpIHtcbiAgICAgIHBhcnRpY2xlcy51bnNoaWZ0KCcjJyArIGVsLmlkKTtcbiAgICAgIGJyZWFrO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoZWwgPT0gZWwub3duZXJEb2N1bWVudC5kb2N1bWVudEVsZW1lbnQpIHBhcnRpY2xlcy51bnNoaWZ0KGVsLnRhZ05hbWUpO2Vsc2Uge1xuICAgICAgICBmb3IgKHZhciBjID0gMSwgZSA9IGVsOyBlLnByZXZpb3VzRWxlbWVudFNpYmxpbmc7IGUgPSBlLnByZXZpb3VzRWxlbWVudFNpYmxpbmcsIGMrKykge31cbiAgICAgICAgcGFydGljbGVzLnVuc2hpZnQoZWwudGFnTmFtZSArIFwiOm50aC1jaGlsZChcIiArIGMgKyBcIilcIik7XG4gICAgICB9XG4gICAgICBlbCA9IGVsLnBhcmVudE5vZGU7XG4gICAgfVxuICB9XG4gIHJldHVybiBwYXJ0aWNsZXMuam9pbihcIiA+IFwiKTtcbn07XG5cbmV4cG9ydHMuZGVmYXVsdCA9IHV0aWxpdGllczsiLCJcbi8qKlxuICogVGhpcyBtb2R1bGUgUHJvdmlkZXMgYW5pbWF0aW9uIGRldGVjdGlvbiBhbmQgcHNldWRvLWxpc3RlbmVyIGZ1bmN0aW9uYWxpdHlcbiAqXG4gKiBAbW9kdWxlIHd0Yy1BbmltYXRpb25FdmVudHNcbiAqIEBleHBvcnRzIEFuaW1hdGlvblxuICovXG5cblxuLyoqXG4gKiBUaGlzIGZ1bmN0aW9uIHRha2VzIGEgbm9kZSBhbmQgZGV0ZXJtaW5lcyB0aGUgZnVsbCBlbmQgdGltZSBvZiBhbnkgdHJhbnNpdGlvbnNcbiAqIG9uIGl0LiBSZXR1cm5zIHRoZSB0aW1lIGluIG1pbGxpc2Vjb25kcy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtICAge0hUTUxFbGVtZW50fSBub2RlICBUaGUgbm9kZSBvIGRldGV4dCB0aGUgdHJhbnNpdGlvbiB0aW1lIGZvci5cbiAqIEByZXR1cm4gIHtOdW1iZXJ9ICAgICAgICAgICAgVGhlIGZ1bGwgdHJhbnNpdGlvbiB0aW1lIGZvciB0aGUgbm9kZSwgaW5jbHVkaW5nIGRlbGF5cywgaW4gbWlsbGlzZWNvbmRzXG4gKi9cbnZhciBkZXRlY3RBbmltYXRpb25FbmRUaW1lID0gZnVuY3Rpb24obm9kZSlcbntcbiAgdmFyIGZ1bGx0aW1lID0gMDtcbiAgdmFyIHRpbWVSZWdleCA9IC8oXFxkK1xcLj8oXFxkKyk/KShzfG1zKS87XG4gIHZhciByZWN1cnNpdmVMb29wID0gZnVuY3Rpb24oZWwpIHtcbiAgICBpZihlbCBpbnN0YW5jZW9mIEVsZW1lbnQpIHtcbiAgICAgIHZhciB0aW1lYnJlYWtkb3duID0gdGltZVJlZ2V4LmV4ZWMod2luZG93LmdldENvbXB1dGVkU3R5bGUoZWwpLnRyYW5zaXRpb25EdXJhdGlvbilcbiAgICAgIHZhciBkZWxheWJyZWFrZG93biA9IHRpbWVSZWdleC5leGVjKHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGVsKS50cmFuc2l0aW9uRGVsYXkpXG4gICAgICB2YXIgdGltZSA9IHRpbWVicmVha2Rvd25bMV0gKiAodGltZWJyZWFrZG93blszXSA9PSAncycgPyAxMDAwIDogMSlcbiAgICAgIHZhciBkZWxheSA9IGRlbGF5YnJlYWtkb3duWzFdICogKGRlbGF5YnJlYWtkb3duWzNdID09ICdzJyA/IDEwMDAgOiAxKVxuICAgICAgaWYodGltZSArIGRlbGF5ID4gZnVsbHRpbWUpIHtcbiAgICAgICAgZnVsbHRpbWUgPSB0aW1lICsgZGVsYXlcbiAgICAgIH1cbiAgICB9XG4gICAgaWYoZWwuY2hpbGROb2Rlcykge1xuICAgICAgZm9yKHZhciBpIGluIGVsLmNoaWxkTm9kZXMpIHtcbiAgICAgICAgcmVjdXJzaXZlTG9vcChlbC5jaGlsZE5vZGVzW2ldKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZWN1cnNpdmVMb29wKG5vZGUpO1xuXG4gIGlmKHR5cGVvZiBmdWxsdGltZSAhPT0gJ251bWJlcicpIHtcbiAgICBmdWxsdGltZSA9IDA7XG4gIH1cblxuICByZXR1cm4gZnVsbHRpbWU7XG59XG5cbi8qKlxuICogVGhlIHJlc29sdmluZyBvYmplY3QgZm9yIHRoZSB7QGxpbmsgd3RjLUFuaW1hdGlvbkV2ZW50cy5hZGRFbmRFdmVudExpc3RlbmVyfVxuICpcbiAqIEBjYWxsYmFjayB0aW1lclJlc29sdmVcbiAqIEBwYXJhbSB7c3RyaW5nfSByZXNwb25zZSAgICAgICAgICAgVGhlIHJlc3BvbnNlIGZyb20gdGhlIEFKQVggY2FsbFxuICogQHBhcmFtIHthcnJheX0gYXJndW1lbnRzICAgICAgICAgICBUaGUgYXJndW1lbnRzIGFycmF5IG9yaWdpbmFsbHkgcGFzc2VkIHRvIHRoZSB7QGxpbmsgQUpBWC5hamF4R2V0fSBtZXRob2RcbiAqIEBwYXJhbSB7RE9NRWxlbWVudH0gbGlua1RhcmdldCAgICAgVGhlIHRhcmdldCBlbGVtZW50IHRoYXQgZmlyZWQgdGhlIHtAbGluayBBSkFYLmFqYXhHZXR9IFxuICovXG5cbi8qKlxuICogQWxsb3dzIHVzIHRvIGFkZCBhbiBlbmQgZXZlbnQgbGlzdGVuZXIgdG8gdGhlIG5vZGUuXG4gKlxuICogQHBhcmFtICB7SFRNTEVsZW1lbnR9ICBub2RlICAgICAgVGhlIGVsZW1lbnQgdG8gYXR0YWNoIHRoZSBlbmQgZXZlbnQgbGlzdGVuZXIgdG9cbiAqIEBwYXJhbSAge2Z1bmN0aW9ufSAgICAgbGlzdGVuZXIgIFRoZSBmdW5jdGlvbiB0byBydW4gd2hlbiB0aGUgYW5pbWF0aW9uIGlzIGZpbmlzaGVkLiBUaGlzIGFsbG93cyB1cyB0byBjb25zdHJ1Y3QgYW4gb2JqZWN0IHRvIHBhc3MgYmFjayB0aHJvdWdoIHRoZSBwcm9taXNlIGNoYWluIG9mIHRoZSBwYXJlbnQuXG4gKiBAcmV0dXJuIHtQcm9taXNlfSAgICAgICAgICAgICAgICBBIHByb21pc2UgdGhhdCByZXByZXNlbnRzIHRoZSBhbmltYXRpb24gdGltZW91dC5cbiAqIEByZXR1cm4ge3RpbWVyUmVzb2x2ZX0gICAgICAgICAgIFRoZSByZXNvbHZlIG1ldGhvZC4gUGFzc2VzIHRoZSBjb2VyY2VkIHZhcmlhYmxlcyAoaWYgYW55KSBmcm9tIHRoZSBsaXN0ZW5pbmcgb2JqZWN0IGJhY2sgdG8gdGhlIGNoYWluLlxuICogQHJldHVybiB7dGltZXJSZWplY3R9ICAgICAgICAgICAgVGhlIHJlamVjdCBtZXRob2QuIE51bGwuXG4gKi9cbnZhciBhZGRFbmRFdmVudExpc3RlbmVyID0gZnVuY3Rpb24obm9kZSwgbGlzdGVuZXIpIHtcbiAgY29uc29sZS5sb2coJy0tLS0gYWRkRW5kRXZlbnRMaXN0ZW5lciAtLS0tJyk7XG4gIGNvbnNvbGUubG9nKG5vZGUsIGxpc3RlbmVyLCB0eXBlb2YgbGlzdGVuZXIpXG4gIGNvbnNvbGUubG9nKCcgICAnKTtcbiAgaWYodHlwZW9mIGxpc3RlbmVyICE9PSAnZnVuY3Rpb24nKVxuICB7XG4gICAgdmFyIGxpc3RlbmVyID0gZnVuY3Rpb24oKXsgcmV0dXJuIHt9IH07XG4gIH1cbiAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuICAgIHZhciB0aW1lID0gZGV0ZWN0QW5pbWF0aW9uRW5kVGltZShub2RlKTtcbiAgICB2YXIgdGltZW91dCA9IHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgcmV0dXJuZXIgPSBsaXN0ZW5lcigpO1xuICAgICAgcmV0dXJuZXIudGltZSA9IHRpbWU7XG4gICAgICByZXNvbHZlKHJldHVybmVyKTtcbiAgICB9LCB0aW1lKTtcbiAgfSk7XG59XG5cbi8qKlxuICogVGhlIGFuaW1hdGlvbiBvYmplY3QgZW5jYXBzdWxhdGVzIGFsbCBvZiB0aGUgYmFzaWMgZnVuY3Rpb25hbGl0eSB0aGF0IGFsbG93cyB1c1xuICogdG8gZGV0ZWN0IGFuaW1hdGlvbiBldGMuXG4gKlxuICogQGV4cG9ydFxuICovXG52YXIgQW5pbWF0aW9uID0ge1xuICBhZGRFbmRFdmVudExpc3RlbmVyOiBhZGRFbmRFdmVudExpc3RlbmVyXG59O1xuXG5cbmV4cG9ydCBkZWZhdWx0IEFuaW1hdGlvbjtcbiIsImltcG9ydCBIaXN0b3J5IGZyb20gXCIuL3d0Yy1oaXN0b3J5XCI7XG5pbXBvcnQgQW5pbWF0aW9uIGZyb20gXCIuL3d0Yy1BbmltYXRpb25FdmVudHNcIjtcbmltcG9ydCBfdSBmcm9tICd3dGMtdXRpbGl0eS1oZWxwZXJzJztcblxuY29uc3QgU1RBVEVTID0ge1xuICAnT0snICAgICAgICAgICAgICAgIDogMCxcbiAgJ0NMSUNLRUQnICAgICAgICAgICA6IDEsXG4gICdMT0FESU5HJyAgICAgICAgICAgOiAyLFxuICAnVFJBTlNJVElPTklORycgICAgIDogNCxcbiAgJ0xPQURFRCcgICAgICAgICAgICA6IDhcbn1cblxuY29uc3QgU0VMRUNUT1JTID0ge1xuICAnQ0hJTERSRU4nICAgICAgICAgIDogMCAvLyBUaGlzIGluZGljYXRlcyB0aGF0IHRoZSBzZWxlY3Rpb24gc2hvdWxkIGJlIGFsbCBjaGlsZHJlbi4gVGhpcyBhc3N1bWVzIHRoYXQgd2UgaGF2ZSBhIHZhbGlkIHRhcmdldCB0byB3b3JrIHdpdGguXG59XG5cbmNvbnN0IEVSUk9SUyA9IHtcbiAgJ0dFTkVSSUNfRVJST1InICAgICA6IDAsXG4gICdCQURfUFJPTUlTRScgICAgICAgOiAxLFxuICAnTE9BRF9FUlJPUicgICAgICAgIDogMlxufVxuXG4vKipcbiAqIEFuIEFKQVggY2xhc3MgdGhhdCBwaWNrcyB1cCBvbiBsaW5rcyBhbmQgdHVybnMgdGhlbSBpbnRvIEFKQVggbGlua3MuXG4gKlxuICogVGhpcyBjbGFzcyBhc3N1bWVzIHRoYXQgeW91IHdhbnQgdG8gcnVuIHlvdXIgQUpBWCB2aWEgaHRtbCBhdHRyaWJ1dGVzIG9uIHlvdXIgbGlua3NcbiAqIGFuZCB0aGF0IHlvdXIgd2Vic2l0ZSBjYW4gcnVuIGp1c3QgYXMgd2VsbCB3aXRob3V0IHRoZXNlIGxpbmtzLiBJdCBzaG91bGQgYWxzb1xuICogcHJvdmlkZSBhZGRpdGlvbmFsIGZ1bmN0aW9uYWxpdHkgdGhhdCBhbGxvd3MgdGhlIGNsYXNzIHRvIHJ1biBwcm9ncmFtYXRpY2FsbHksXG4gKiB0aGVyZWJ5IGdpdmluZyB0aGUgcHJvZ3JhbW1lciB0aGUgYWJpbGl0eSBhbmQgb3B0aW9ucyB0byBjcmVhdGUgdGhlIHdlYnNvdGVcbiAqIGhvd2V2ZXIgdGhleSB3YW50IHRvLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBuYW1lc3BhY2VcbiAqIEBleHRlbmRzIEhpc3RvcnlcbiAqIEBhdXRob3IgTGlhbSBFZ2FuIDxsaWFtQHdldGhlY29sbGVjdGl2ZS5jb20+XG4gKiBAdmVyc2lvbiAwLjVcbiAqIEBjcmVhdGVkIE5vdiAxOSwgMjAxNlxuICovXG5jbGFzcyBBSkFYIGV4dGVuZHMgSGlzdG9yeSB7XG5cbiAgLyoqXG4gICAqIFB1YmxpYyBtZXRob2RzXG4gICAqL1xuXG4gIC8qKlxuICAgKiBJbml0aWFsaXNlIHRoZSBsaW5rcyBpbiB0aGUgZG9jdW1lbnQuXG4gICAqXG4gICAqIFRoaXMgd2lsbCBsb29rIHRocm91Z2ggdGhlIGxpbmtzIGluIHRoZSBkb2N1bWVudCBhcyBkZW5vdGVkIGJ5IHRoZSBhdHRyaWJ1dGVBamF4XG4gICAqIHByb3BlcnR5IGFuZCBhcHBseSBhIGNsaWNrIGxpc3RlbmVyIHRvIGl0IHRoYXQgd2lsbCBhdHRlbXB0IHRvIGRldGVybWluZSB3aGF0XG4gICAqIGFuZCBob3cgdG8gbG9hZC5cbiAgICpcbiAgICogQSBzaW1wbGUgbWVjaGFuc2ltIGZvciB0aGlzIHdvdWxkIGJlIHNvbWV0aGluZyBsaWtlOlxuICAgKiBgYGBcbiAgICAgPGEgaHJlZj1cInBhZ2UxLmh0bWxcIlxuICAgICAgICBkYXRhLXd0Yy1hamF4PVwidHJ1ZVwiXG4gICAgICAgIGRhdGEtd3RjLWFqYXgtdGFyZ2V0PScjbGluazItdGFyZ2V0J1xuICAgICAgICBkYXRhLXd0Yy1hamF4LXNlbGVjdGlvbj1cIi5saW5rMS1zZWxlY3Rpb25cIlxuICAgICAgICBkYXRhLXd0Yy1hamF4LXNob3VsZC1uYXZpZ2F0ZT1cImZhbHNlXCI+TGluayAxPC9hPlxuICAgKiBgYGBcbiAgICpcbiAgICogVGhlIGFkdHJpYnV0ZXMgZXF1YXRlIGFzIGZvbGxvd3M6XG4gICAqIC0gKCphdHRyaWJ1dGVBamF4KikgKipkYXRhLXd0Yy1hamF4KipcbiAgICpcbiAgICogICAgRGVub3RlcyB0aGF0IHRoaXMgbGluayBpcyBhbiBBSkFYIGxpbmsuXG4gICAqIC0gKCphdHRyaWJ1dGVUYXJnZXQqKSAqKmRhdGEtd3RjLWFqYXgtdGFyZ2V0KipcbiAgICpcbiAgICogICAgRGVub3RlcyB0aGUgdGFyZ2V0IGludG8gd2hpY2ggdG8gbG9hZCB0aGUgcmVzdWx0LiBTaG91bGQgdGFrZSB0aGUgZm9ybSBvZiBhIHNlbGVjdG9yLlxuICAgKiAtICgqYXR0cmlidXRlU2VsZWN0aW9uKikgKipkYXRhLXd0Yy1hamF4LXNlbGVjdGlvbioqXG4gICAqXG4gICAqICAgIERlbm90ZXMgdGhlIHNlbGVjdGlvbiBvZiBkYXRhIHRvIHB1bGwgZnJvbSB0aGUgbG9hZGVkIGRvY3VtZW50LiBTaG91bGQgdGFrZSB0aGUgZm9ybSBvZiBhIHNlbGVjdG9yLlxuICAgKiAtICgqYXR0cmlidXRlU2hvdWxkTmF2aWdhdGUqKSAqKmRhdGEtd3RjLWFqYXgtc2hvdWxkLW5hdmlnYXRlKipcbiAgICpcbiAgICogICAgKipUcnVlKiogLyBGYWxzZSBhcyB0byB3aGV0aGVyIHRoZSBsaW5rIHNob3VsZCB1cGRhdGUgdGhlIGhpc3Rvcnkgb2JqZWN0LiBPbmx5IG5lY2Vzc2FyeSBpZiBmYWxzZS5cbiAgICpcbiAgICogSW4gYWRkaXRpb24sICphdHRyaWJ1dGVUYXJnZXQqIGFuZCAqYXR0cmlidXRlU2VsZWN0aW9uKiBhY2NlcHQgYmFzaWMgSlNPTiBzeW50YXhcbiAgICogc28gdGhhdCB5b3UgY2FuIGxvYWQgbW9sdGlwbGUgcGllY2VzIG9mIGNvbnRlbnQgZnJvbSB0aGUgc291cmNlLlxuICAgKlxuICAgKiBAc3RhdGljXG4gICAqIEBwYXJhbSAge0RPTUVsZW1lbnR9IHJvb3REb2N1bWVudCAgVGhlIERPTSBlbGVtZW50IHRvIGZpbmQgbGlua3MgaW4uIERlZmF1bHRzIHRvIGJvZHkuXG4gICAqL1xuICBzdGF0aWMgaW5pdExpbmtzKHJvb3REb2N1bWVudCA9IGRvY3VtZW50LmJvZHkpIHtcbiAgICBjb25zdCBsaW5rcyA9IHJvb3REb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKGBbJHt0aGlzLmF0dHJpYnV0ZUFqYXh9PVwidHJ1ZVwiXWApO1xuXG4gICAgbGlua3MuZm9yRWFjaCgobGluayk9PiB7XG4gICAgICAvLyBSZW1vdmluZyB0aGlzIGF0dHJpYnV0ZSBlbnN1cmVzIHRoYXQgdGhpcyBsaW5rIGRvZXNuJ3QgZ2V0IGEgc2Vjb25kIEFKQVggbGlzdGVuZXIgYXR0YWNoZWQgdG8gaXQuXG4gICAgICBsaW5rLnJlbW92ZUF0dHJpYnV0ZSh0aGlzLmF0dHJpYnV0ZUFqYXgpO1xuXG4gICAgICBsaW5rLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGUpPT4ge1xuICAgICAgICB0aGlzLl90cmlnZ2VyQWpheExpbmsoZSk7XG5cbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgfSk7XG4gICAgICBjb25zb2xlLmxvZyhsaW5rKTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUgcmVzb2x2aW5nIG9iamVjdC4gVGhpcyBpcyB0aGUgb2JqZWN0IHRoYXQgaXMgcGFzc2VkIHRvIEFKQVggR0VUIHByb21pc2UgdGhlbnNcbiAgICogYW5kIHNob3VsZCBiZSBwYXNzZWQgb250byBzdWJzZXF1ZW50IFRIRU5hYmxlIGNhbGxzLlxuICAgKlxuICAgKiBAdHlwZWRlZiB7T2JqZWN0fSAgICAgICAgICAgICAgICAgICAgIEFKQVhHZXRSZXNvbHZlclxuICAgKiBAcHJvcGVydHkge3N0cmluZ30gICAgICAgcmVzcG9uc2UgICAgIFRoZSByZXNwb25zZSBmcm9tIHRoZSBBSkFYIGNhbGxcbiAgICogQHByb3BlcnR5IHtBSkFYRG9jdW1lbnR9IGRvY3VtZW50ICAgICBUaGUgZG9jdW1lbnQgbm9kZXMgcmVzdWx0aW5nIGZyb20gdGhpcyBjYWxsLlxuICAgKiBAcHJvcGVydHkge2FycmF5fSAgICAgICAgYXJndW1lbnRzICAgIFRoZSBhcmd1bWVudHMgYXJyYXkgb3JpZ2luYWxseSBwYXNzZWQgdG8gdGhlIHtAbGluayBBSkFYLmFqYXhHZXR9IG1ldGhvZFxuICAgKiBAcHJvcGVydHkge0RPTUVsZW1lbnR9ICAgbGlua1RhcmdldCAgIFRoZSB0YXJnZXQgZWxlbWVudCB0aGF0IGZpcmVkIHRoZSB7QGxpbmsgQUpBWC5hamF4R2V0fSBcbiAgICovXG5cblxuICAvKipcbiAgICogQHR5cGVkZWYge09iamVjdH0gICAgICAgICAgICAgIEFKQVhEb2N1bWVudFxuICAgKiBAcHJvcGVydHkge0RPTUVsZW1lbnR9IGRvYyAgICAgVGhlIGZ1bGwgZG9jdW1lbnQgbm9kZSBmb3IgdGhlIEFKQVggR0VUIHJlc3VsdFxuICAgKiBAcHJvcGVydHkge05vZGVMaXN0fSAgIHN1YmRvYyAgVGhlIHN1YmRvY3VtZW50IGRlcml2ZWQgZnJvbSB0aGUgbWFpbiBkb2N1bWVudFxuICAgKi9cbiAgLyoqXG4gICAqIENhbGxiYWNrIGZvciBBSkFYIEdFVCBvbmxvYWQuIFRoaXMgaXMgY2FsbGVkIHdoZW4gdGhlIGNvbnRlbnQgaXMgbG9hZGVkLlxuICAgKlxuICAgKiBAY2FsbGJhY2sgbG9hZFJlc29sdmVcbiAgICogQHBhcmFtIHtBSkFYR2V0UmVzb2x2ZXJ9IHJlc29sdmVyICBUaGUgcmVzb2x2aW5nIG9iamVjdCBmb3IgdGhlIEFKQVggcmVxdWVzdFxuICAgKiBAcmV0dXJuIHtBSkFYR2V0UmVzb2x2ZXJ9ICAgICAgICAgIFRoZSBvbmdvaW5nIHJlc29sdmluZyBvYmplY3QgZm9yIHRoZSBBSkFYIHJlcXVlc3RcbiAgICovXG4gIC8qKlxuICAgKiBDYWxsYmFjayBmb3IgQUpBWCBHRVQgZXJyb3IuIFRoaXMgaXMgY2FsbGVkIHdoZW4gYW4gZXJyb3Igb2NjdXJzIGFmdGVyXG4gICAqIGNhbGxpbmcgYW4gYWpheCBHRVQuXG4gICAqXG4gICAqIEBjYWxsYmFjayBsb2FkUmVqZWN0XG4gICAqIEBwYXJhbSB7b2JqZWN0fSBlcnJvciAgICAgICAgICAgICAgVGhlIGVycm9yIHRoYXQgb2NjdXJyZWRcbiAgICogQHBhcmFtIHthcnJheX0gYXJncyAgICAgICAgICAgICAgICBUaGUgYXJndW1lbnRzIHRoYXQgd2VyZSBwYXNzZWQgdG8gdGhlIHJlcXVlc3RcbiAgICogQHBhcmFtIHtET01FbGVtZW50fSBbdGFyZ2V0TGlua10gICBUaGUgbGluayB0aGF0IHNwYXduZWQgdGhlIGFqYXggcmVxdWVzdFxuICAgKi9cblxuICAvKipcbiAgICogVGhpcyBidWlsZHMgb3V0IGFuIEFKQVggcmVxdWVzdCwgbm9ybWFsbHkgYmFzZWQgb24gdGhlIGNsaWNraW5nIG9mIGEgbGluayxcbiAgICogYnV0IGl0IGNhbiBhbHRlcm5hdGl2ZWx5IGJlIGNhbGxlZCBkaXJlY3RseSBvbiB0aGUgQUpBWCBvYmplY3QuXG4gICAqXG4gICAqIEBzdGF0aWNcbiAgICogQHBhcmFtICB7c3RyaW5nfSBVUkwgICAgICAgICAgICAgICAgICAgICBUaGUgVVJMIHRvIGdldC4gVGhpcyB3aWxsIGJlIHBhcnNlZCBpbnRvIGFuIGFwcHJvcHJpYXRlIGZvbWF0IGJ5IHRoZSBvYmplY3QuXG4gICAqIEBwYXJhbSAge3N0cmluZ30gdGFyZ2V0ICAgICAgICAgICAgICAgICAgVGhlIHRhcmdldCBmb3IgdGhlIGxvYWRlZCBjb250ZW50LiBUaGlzIGNhbiBiZSBhIHN0cmluZyAoc2VsZWN0b3IpLCBvciBhIEpTT04gYXJyYXkgb2Ygc2VsZWN0b3Igc3RyaW5ncy5cbiAgICogQHBhcmFtICB7c3RyaW5nfSBzZWxlY3Rpb24gICAgICAgICAgICAgICBUaGlzIGlzIGEgc2VsZWN0b3IgKG9yIEpTT04gb2Ygc2VsZWN0b3JzKSB0aGF0IGRldGVybWluZXMgd2hhdCB0byBjdXQgZnJvbSB0aGUgbG9hZGVkIGNvbnRlbnQuXG4gICAqIEBwYXJhbSAge0RPTUVsZW1lbnR9IFtsaW5rVGFyZ2V0XSAgICAgICAgVGhlIHRhcmdldCBvZiB0aGUgbGluay4gVGhpcyBpcyB1c2VmdWwgZm9yIHNldHRpbmcgYWN0aXZlIHN0YXRlcyBpbiBjYWxsYmFjay5cbiAgICogQHBhcmFtICB7Ym9vbGVhbn0gZnJvbVBvcCAgICAgICAgICAgICAgICBJbmRpY2F0ZXMgdGhhdCB0aGlzIEdFVCBpcyBmcm9tIGEgcG9wXG4gICAqIEBwYXJhbSAge29iamVjdH0gW2RhdGEgPSB7fV0gICAgICAgICAgICAgVGhlIGRhdGEgdG8gcGFzcyB0byB0aGUgQUpBWCBjYWxsLlxuICAgKiBAcmV0dXJuIHtQcm9taXNlfSAgICAgICAgICAgICAgICAgICAgICAgIEEgcHJvbWlzZSB0aGF0IHJlcHJlc2VudHMgdGhlIEdFVC5cbiAgICogQHJldHVybiB7bG9hZFJlc29sdmV9ICAgICAgICAgICAgICAgICAgICBUaGUgcmVzb2x2ZSBtZXRob2QuIFBhc3NlcyB0aGUgbG9hZGVkIGNvbnRlbnQgZG93biB0aHJvdWdoIGl0J3MgdGhlbmFibGVzLCBmaW5hbGx5IHJlc29sdmluZyB0byB0aGUgcGFyc2UgY29tbWVuZCB2aWEgYSBzZWNvbmQsIHByaXZhdGUgUHJvbWlzZS5cbiAgICogQHJldHVybiB7bG9hZFJlamVjdH0gICAgICAgICAgICAgICAgICAgICBUaGUgcmVqZWN0IG1ldGhvZC4gUmVzdWx0cyBpbiBhbiBlcnJvclxuICAgKi9cbiAgc3RhdGljIGFqYXhHZXQoVVJMLCB0YXJnZXQsIHNlbGVjdGlvbiwgbGlua1RhcmdldCwgZnJvbVBvcCA9IGZhbHNlLCBkYXRhID0ge30pIHtcblxuICAgIC8vIFNldCB0aGUgc3RhdGUgb2YgdGhlIEFKQVggY2xhc3MgdG8gY2xpY2tlZCwgaW5jaWRhdGluZyBzb21ldGhpbmcgaXMgbG9hZGluZ1xuICAgIGlmKCB0aGlzLnN0YXRlID4gU1RBVEVTLkNMSUNLRUQgKVxuICAgIHtcbiAgICAgIGlmKCB0aGlzLmRldm1vZGUgKVxuICAgICAge1xuICAgICAgICBjb25zb2xlLndhcm4oIFwiVHJpZWQgcnVuIGFuIEFKQVggR0VUIHdoZW4gdGhlIG9iamVjdCB3YXNuJ3QgaW4gT0sgb3IgQ0xJQ0tFRCBtb2RlXCIgKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIFJldHJpZXZlIGEgcmVxdWVzdCBvYmplY3QgYW5kIGNvbnN0cnVjdCBhIHZhbGlkIFVSTFxuICAgIGNvbnN0IHJlcSA9IHRoaXMucmVxdWVzdE9iamVjdDtcbiAgICBjb25zdCBwYXJzZWRVUkwgPSB0aGlzLl9maXhVUkwoVVJMKTtcbiAgICBjb25zdCBET01UYXJnZXQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKHRhcmdldClbMF07XG5cbiAgICB2YXIgcmVhZHlTdGF0ZSA9IDA7XG4gICAgdmFyIHN0YXR1cyA9IDA7XG4gICAgdmFyIGFyZ3MgPSBhcmd1bWVudHM7XG5cbiAgICB2YXIgcmVxdWVzdFByb21pc2UgPSBuZXcgUHJvbWlzZShmdW5jdGlvbiBoYW5kbGVyKHJlc29sdmUsIHJlamVjdCkge1xuXG4gICAgICAvLyBOZWVkIHRvIGFkZCBhbGwgc29ydHMgb2YgZXJyb3IgY2hlY2tpbmcgaGVyZS5cblxuICAgICAgLy8gTGlzdGVuIGZvciB0aGUgcmVhZHkgc3RhdGVcbiAgICAgIHJlcS5hZGRFdmVudExpc3RlbmVyKCdyZWFkeXN0YXRlY2hhbmdlJywgKGUpID0+IHtcbiAgICAgICAgcmVhZHlTdGF0ZSA9IGUudGFyZ2V0LnJlYWR5U3RhdGU7XG4gICAgICAgIHN0YXR1cyA9IGUudGFyZ2V0LnN0YXR1cztcbiAgICAgIH0pO1xuXG4gICAgICAvLyBMaXN0ZW0gZm9yIHRoZSBsb2FkIGV2ZW50XG4gICAgICByZXEuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsIChlKSA9PiB7XG4gICAgICAgIC8vIElmIHdlIGhhdmUgYSByZWFkeSBzdGF0ZSB0aGF0IGluZGljYXRlZCB0aGF0IHRoZSBsb2FkIHdhcyBhIHN1Y2Nlc3MsIGNvbnRpbnVlXG4gICAgICAgIGlmKCByZXEuc3RhdHVzID49IDIwMCAmJiByZXEuc3RhdHVzIDwgNDAwICkge1xuICAgICAgICAgIC8vIEdldCB0aGUgcmVxdWVzdCByZXNwb25zZSB0ZXh0XG4gICAgICAgICAgdmFyIHJlc3BvbnNlVGV4dCA9IHJlcS5yZXNwb25zZVRleHRcbiAgICAgICAgICAvLyBHZXQgdGhlIEFKQVhEb2N1bWVudFxuICAgICAgICAgIHZhciBBSkFYRG9jdW1lbnQgPSB0aGlzLl9wYXJzZVJlc3BvbnNlKHJlc3BvbnNlVGV4dCwgdGFyZ2V0LCBzZWxlY3Rpb24sIGZyb21Qb3AsIGxpbmtUYXJnZXQpXG4gICAgICAgICAgLy8gQnVpbGQgdGhlIHJlc29sdmVyXG4gICAgICAgICAgdmFyIHJlc29sdmVyID0ge1xuICAgICAgICAgICAgcmVzcG9uc2VUZXh0OiByZXNwb25zZVRleHQsIFxuICAgICAgICAgICAgZG9jdW1lbnQ6IEFKQVhEb2N1bWVudCxcbiAgICAgICAgICAgIGFyZ3VtZW50czogYXJncywgXG4gICAgICAgICAgICBsaW5rVGFyZ2V0OiBsaW5rVGFyZ2V0IHx8IG51bGwsXG4gICAgICAgICAgICBET01UYXJnZXQ6IERPTVRhcmdldFxuICAgICAgICAgIH1cbiAgICAgICAgICByZXNvbHZlKHJlc29sdmVyKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZWplY3QoRVJST1JTLkxPQURfRVJST1IpO1xuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgcmVxLmFkZEV2ZW50TGlzdGVuZXIoJ2Vycm9yJywgKGUpID0+IHtcbiAgICAgICAgcmVqZWN0KEVSUk9SUy5MT0FEX0VSUk9SKTtcbiAgICAgIH0pO1xuICAgIH0uYmluZCh0aGlzKSk7XG5cbiAgICAvLyBUaGlzIHByb21pc2UgdGFrZXMgdGhlIHJldHVybmVkIHByb21pc2UgYW5kIHJ1bnMgdGhlIGVxdWl2YWxlbnQgb2YgYSBcImZpbmFsbHlcIlxuICAgIFByb21pc2UuXG4gICAgICByZXNvbHZlKHJlcXVlc3RQcm9taXNlKS5cbiAgICAgIC8vIFRIRU46IHJlc3BvbnNpYmxlIGZvciBhZGRpbmcgdGhlIHRyYW5zaXRpb24gY2xhc3NlcywgdGhlbiBmaW5kaW5nIHRoZSB0cmFuc2l0aW9uIGxlbmd0aCBhbmQgcnV0aW5naW5nIHRoZSBwcm9taXNlIGZyb20gdGhhdFxuICAgICAgdGhlbiggZnVuY3Rpb24ocmVzb2x2ZXIpIHtcbiAgICAgICAgaWYocmVzb2x2ZXIuZXJyb3IpIHtcbiAgICAgICAgICB0aHJvdyByZXNvbHZlci5lcnJvclxuICAgICAgICB9IGVsc2UgaWYoIXJlc29sdmVyLnJlc3BvbnNlVGV4dCkge1xuICAgICAgICAgIHRocm93IEVSUk9SUy5CQURfUFJPTUlTRVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIC8vIEZpbmQgdGhlIHRhcmdldCBub2RlXG4gICAgICAgICAgbGV0IHRhcmdldE5vZGUgPSByZXNvbHZlci5ET01UYXJnZXQ7XG4gICAgICAgICAgLy8gYWRkIHRoZSBjbGFzcyB0byBpdFxuICAgICAgICAgIF91LnJlbW92ZUNsYXNzKHRoaXMuY2xhc3NCYXNlVHJhbnNpdGlvbisnLWluLWVuZCcsIHRhcmdldE5vZGUpO1xuICAgICAgICAgIF91LmFkZENsYXNzKHRoaXMuY2xhc3NCYXNlVHJhbnNpdGlvbisnLW91dC1zdGFydCcsIHRhcmdldE5vZGUpO1xuICAgICAgICAgIF91LmFkZENsYXNzKHRoaXMuY2xhc3NCYXNlVHJhbnNpdGlvbisnLW91dCcsIHRhcmdldE5vZGUpO1xuICAgICAgICAgIC8vIEFkZCB0aGUgYW5pbWF0aW9uIGVuZCBsaXN0ZW5lciB0byB0aGUgdGFyZ2V0IG5vZGVcbiAgICAgICAgICByZXR1cm4gQW5pbWF0aW9uLmFkZEVuZEV2ZW50TGlzdGVuZXIodGFyZ2V0Tm9kZSwgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gcmVzb2x2ZXI7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH0uYmluZCh0aGlzKSApLlxuICAgICAgLy8gVEhFTjogcmVzcG9uc2libGUgZm9yIGFkZGluZyB0aGUgZW5kIGNsYXNzLCB0aGVuIHJldHVybmluZyBhIHByb21pc2Ugd2l0aCB0aGUgbGlzdGVkIHJlc29sdmVUaW1lb3V0XG4gICAgICB0aGVuKCBmdW5jdGlvbihyZXNvbHZlcikge1xuICAgICAgICAvLyBGaW5kIHRoZSB0YXJnZXQgbm9kZVxuICAgICAgICBsZXQgdGFyZ2V0Tm9kZSA9IHJlc29sdmVyLkRPTVRhcmdldDtcbiAgICAgICAgLy8gTW9kaWZ5IGl0cyBjbGFzc2VzXG4gICAgICAgIF91LnJlbW92ZUNsYXNzKHRoaXMuY2xhc3NCYXNlVHJhbnNpdGlvbisnLW91dC1zdGFydCcsIHRhcmdldE5vZGUpO1xuICAgICAgICBfdS5hZGRDbGFzcyh0aGlzLmNsYXNzQmFzZVRyYW5zaXRpb24rJy1vdXQtZW5kJywgdGFyZ2V0Tm9kZSk7XG4gICAgICAgIC8vIFNldCBhIG51bGwgdGltZW91dCB0byByZXBhaW50IG9uIGNsYXNzY2hhbmdlXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmVzb2x2ZShyZXNvbHZlcik7XG4gICAgICAgICAgfSwgdGhpcy5yZXNvbHZlVGltZW91dCk7XG4gICAgICAgIH0uYmluZCh0aGlzKSk7XG4gICAgICB9LmJpbmQodGhpcykgKS5cbiAgICAgIC8vIFRIRU46IHJlc3BvbnNpYmxlIGZvciBhZGRpbmcgdGhlIGZpbmFsIGNvbnRlbnQgdG8gdGhlIG1haW4gZG9jdW1lbnQuIFJldHVybnMgYSBwcm9taXNlIHRoYXQgaWRlbnRpZmllcyB0aGUgdHJhbnNpdGlvblxuICAgICAgdGhlbihmdW5jdGlvbihyZXNvbHZlcikge1xuICAgICAgICAvLyBGaW5kIHRoZSB0YXJnZXQgbm9kZVxuICAgICAgICBsZXQgdGFyZ2V0Tm9kZSA9IHJlc29sdmVyLkRPTVRhcmdldDtcbiAgICAgICAgLy8gTW9kaWZ5IGl0cyBjbGFzc2VzXG4gICAgICAgIF91LnJlbW92ZUNsYXNzKHRoaXMuY2xhc3NCYXNlVHJhbnNpdGlvbisnLW91dC1lbmQnLCB0YXJnZXROb2RlKTtcbiAgICAgICAgX3UucmVtb3ZlQ2xhc3ModGhpcy5jbGFzc0Jhc2VUcmFuc2l0aW9uKyctb3V0JywgdGFyZ2V0Tm9kZSk7XG4gICAgICAgIF91LmFkZENsYXNzKHRoaXMuY2xhc3NCYXNlVHJhbnNpdGlvbisnLWluJywgdGFyZ2V0Tm9kZSk7XG4gICAgICAgIF91LmFkZENsYXNzKHRoaXMuY2xhc3NCYXNlVHJhbnNpdGlvbisnLWluLXN0YXJ0JywgdGFyZ2V0Tm9kZSk7XG4gICAgICAgIC8vIEZpbmFsbHkuIFBhcnNlIHRoZSByZXN1bHRcbiAgICAgICAgdGhpcy5fY29tcGxldGVUcmFuc2ZlcihyZXNvbHZlci5kb2N1bWVudCwgdGFyZ2V0Tm9kZSwgc2VsZWN0aW9uLCBmcm9tUG9wKTtcbiAgICAgICAgLy8gQWRkIHRoZSBhbmltYXRpb24gZW5kIGxpc3RlbmVyIHRvIHRoZSB0YXJnZXQgbm9kZVxuICAgICAgICByZXR1cm4gQW5pbWF0aW9uLmFkZEVuZEV2ZW50TGlzdGVuZXIodGFyZ2V0Tm9kZSwgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgcmV0dXJuIHJlc29sdmVyO1xuICAgICAgICB9KTtcbiAgICAgIH0uYmluZCh0aGlzKSkuXG4gICAgICAvLyBUSEVOOiBSZXNwb25zaWJsZSBmb3IgdGlkeWluZyBldmVyeXRoaW5nIHVwXG4gICAgICB0aGVuKGZ1bmN0aW9uKHJlc29sdmVyKSB7XG4gICAgICAgIC8vIEZpbmQgdGhlIHRhcmdldCBub2RlXG4gICAgICAgIGxldCB0YXJnZXROb2RlID0gcmVzb2x2ZXIuRE9NVGFyZ2V0O1xuICAgICAgICAvLyBNb2RpZnkgaXRzIGNsYXNzZXNcbiAgICAgICAgX3UucmVtb3ZlQ2xhc3ModGhpcy5jbGFzc0Jhc2VUcmFuc2l0aW9uKyctaW4nLCB0YXJnZXROb2RlKTtcbiAgICAgICAgX3UucmVtb3ZlQ2xhc3ModGhpcy5jbGFzc0Jhc2VUcmFuc2l0aW9uKyctaW4tc3RhcnQnLCB0YXJnZXROb2RlKTtcbiAgICAgICAgX3UuYWRkQ2xhc3ModGhpcy5jbGFzc0Jhc2VUcmFuc2l0aW9uKyctaW4tZW5kJywgdGFyZ2V0Tm9kZSk7XG4gICAgICB9LmJpbmQodGhpcykpLlxuICAgICAgY2F0Y2goIGZ1bmN0aW9uKGVycikge1xuICAgICAgICBjb25zb2xlLmxvZyhlcnIpXG4gICAgICAgIHRoaXMuX2Vycm9yKHJlYWR5U3RhdGUsIHJlcS5zdGF0dXMsIGVyciB8fCAwKTtcbiAgICAgIH0uYmluZCh0aGlzKSApO1xuXG4gICAgLy8gU2F2ZSB0aGUgbGFzdCBwYXJzZWQgVVJMIGZvciB0aGUgcHVycG9zZSBvZiBoaXN0b3J5IGludGVyb3BlcmFiaWxpdHkgYW5kIGVycm9yIGNvcnJlY3Rpb24uXG4gICAgdGhpcy5sYXN0UGFyc2VkVVJMID0gcGFyc2VkVVJMO1xuXG4gICAgcmVxLm9wZW4oJ0dFVCcsIHBhcnNlZFVSTCwgdHJ1ZSk7XG4gICAgcmVxLnNlbmQoZGF0YSk7XG5cbiAgICAvLyBTZXQgdGhlIG9iamVjdCBzdGF0ZVxuICAgIHRoaXMuc3RhdGUgPSBTVEFURVMuTE9BRElORztcblxuICAgIHJldHVybiByZXF1ZXN0UHJvbWlzZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBQcml2YXRlIG1ldGhvZHNcbiAgICovXG5cbiAgLyoqXG4gICAqIExpc3RlbmVyIGZvciB0aGUgcG9wc3RhdGUgbWV0aG9kXG4gICAqXG4gICAqIEBwcml2YXRlXG4gICAqIEBwYXJhbSAge29iamVjdH0gZSB0aGUgcGFzc2VkIGV2ZW50IG9iamVjdFxuICAgKiBAcmV0dXJuIHZvaWRcbiAgICovXG4gIHN0YXRpYyBfcG9wc3RhdGUoZSkge1xuICAgIHZhciBiYXNlLCBzdGF0ZSA9IHt9O1xuICAgIHZhciBoYXNQb3BwZWRTdGF0ZSA9IHN1cGVyLl9wb3BzdGF0ZShlKTtcblxuICAgIGlmKCBoYXNQb3BwZWRTdGF0ZSApIHtcbiAgICAgIHN0YXRlID0gKGJhc2UgPSB0aGlzLmhpc3RvcnkpLnN0YXRlIHx8IChiYXNlLnN0YXRlID0gZS5zdGF0ZSB8fCAoZS5zdGF0ZSA9IHdpbmRvdy5ldmVudC5zdGF0ZSkpO1xuICAgIH1cblxuICAgIHZhciBocmVmID0gZG9jdW1lbnQubG9jYXRpb24uaHJlZjtcbiAgICB2YXIgdGFyZ2V0ID0gc3RhdGUudGFyZ2V0IHx8IHRoaXMubGFzdENoYW5nZWRUYXJnZXQ7XG4gICAgdmFyIHNlbGVjdGlvbiA9IHN0YXRlLnNlbGVjdGlvbiB8fCBTRUxFQ1RPUlMuQ0hJTERSRU47XG4gICAgdmFyIGRhdGEgPSBzdGF0ZS5kYXRhIHx8IHt9O1xuXG4gICAgdGhpcy5hamF4R2V0KGhyZWYsIHRhcmdldCwgc2VsZWN0aW9uLCB0cnVlLCBkYXRhKTtcblxuICAgIHJldHVybiBoYXNQb3BwZWRTdGF0ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUcmlnZ2VyIGFuIGFqYXggbGluayBhcyBkZXRlcm1pbmVkIGJ5IGEgY2xpY2sgY2FsbGJhY2suIFRoaXMgc2hvdWxkIG9ubHkgZXZlciBiZSBjYWxsZWRcbiAgICogZnJvbSBhIGNsaWNrIGV2ZW50IGFzIGFkZGVkIHZpYSB0aGUgQUpBWCBvYmplY3Qgb3IgYSBjaGlsZCB0aGVyZXJvZi5cbiAgICpcbiAgICogQHN0YXRpY1xuICAgKiBAcHJpdmF0ZVxuICAgKiBAcGFyYW0gIHtvYmplY3R9IGUgdGhlIGV2ZW50IG9iamVjdCBwYXNzZWQgZnJvbSB0aGUgY2xpY2sgZXZlbnQuXG4gICAqL1xuICBzdGF0aWMgX3RyaWdnZXJBamF4TGluayhlKSB7XG4gICAgaWYoIHRoaXMuc3RhdGUgIT0gU1RBVEVTLk9LIClcbiAgICB7XG4gICAgICBpZiggdGhpcy5kZXZtb2RlIClcbiAgICAgIHtcbiAgICAgICAgY29uc29sZS53YXJuKCBcIlRyaWVkIHRvIGNsaWNrIGFuIEFKQVggbGluayB3aGVuIHRoZSBvYmplY3Qgd2Fzbid0IGluIE9LIG1vZGVcIiApO1xuICAgICAgfVxuXG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gRmluZCBhbGwgb2YgdGhlIHJlbGV2YW50IGF0dGVpYnV0ZXNcbiAgICBjb25zdCBsaW5rICAgICAgPSBlLnRhcmdldDtcbiAgICBjb25zdCBocmVmICAgICAgPSBsaW5rLmdldEF0dHJpYnV0ZSgnaHJlZicpO1xuICAgIGNvbnN0IHRhcmdldCAgICA9IGxpbmsuZ2V0QXR0cmlidXRlKHRoaXMuYXR0cmlidXRlVGFyZ2V0KTtcbiAgICBjb25zdCBzZWxlY3Rpb24gPSBsaW5rLmdldEF0dHJpYnV0ZSh0aGlzLmF0dHJpYnV0ZVNlbGVjdGlvbik7XG5cbiAgICAvLyBTZXQgdGhlIG9iamVjdCBzdGF0ZVxuICAgIHRoaXMuc3RhdGUgPSBTVEFURVMuQ0xJQ0tFRDtcblxuICAgIHRoaXMuYWpheEdldChocmVmLCB0YXJnZXQsIHNlbGVjdGlvbik7XG4gIH1cblxuICAvKipcbiAgICogQHR5cGVkZWYge09iamVjdH0gICAgICAgICAgICAgIEFKQVhEb2N1bWVudFxuICAgKiBAcHJvcGVydHkge0RPTUVsZW1lbnR9IGRvYyAgICAgVGhlIGZ1bGwgZG9jdW1lbnQgbm9kZSBmb3IgdGhlIEFKQVggR0VUIHJlc3VsdFxuICAgKiBAcHJvcGVydHkge05vZGVMaXN0fSAgIHN1YmRvYyAgVGhlIHN1YmRvY3VtZW50IGRlcml2ZWQgZnJvbSB0aGUgbWFpbiBkb2N1bWVudFxuICAgKi9cblxuICAvKipcbiAgICogVGhpcyByZXNwb25kcyB0byB0aGUgYWpheCBsb2FkIGV2ZW50IGFuZCBpcyByZXNwb25zaWJsZSBmb3IgYnVpbGRpbmcgdGhlIHJlc3VsdCxcbiAgICogaW5qZWN0aW5nIGl0IGludG8gdGhlIHBhZ2UsIHJ1bm5pbmcgY2FsbGJhY2tzIGFuZCBkZXRlY3RpbmcgYW5kIGRlbGF5aW5nXG4gICAqIHRyYW5zaXRpb25zIGFuZCBhbmltYXRpb25zIGFzIG5lY2Vzc2FyeS9cbiAgICpcbiAgICogQHN0YXRpY1xuICAgKiBAcHJpdmF0ZVxuICAgKiBAcGFyYW0gIHtzdHJpbmd9IGNvbnRlbnQgICAgICAgICAgIFRoZSBsb2FkZWQgcGFnZSBjb250ZW50LCB0aGlzIGNvbWVzIGZyb20gdGhlIEFKQVggY2FsbC5cbiAgICogQHBhcmFtICB7c3RyaW5nfSB0YXJnZXQgICAgICAgICAgICBUaGUgdGFyZ2V0IGZvciB0aGUgbG9hZGVkIGNvbnRlbnQuIFRoaXMgY2FuIGJlIGEgc3RyaW5nIChzZWxlY3RvciksIG9yIGEgSlNPTiBhcnJheSBvZiBzZWxlY3RvciBzdHJpbmdzLlxuICAgKiBAcGFyYW0gIHtzdHJpbmd9IHNlbGVjdGlvbiAgICAgICAgIFRoaXMgaXMgYSBzZWxlY3RvciB0aGF0IGRldGVybWluZXMgd2hhdCB0byBjdXQgZnJvbSB0aGUgbG9hZGVkIGNvbnRlbnQuXG4gICAqIEBwYXJhbSAge0RPTUVsZW1lbnR9IFtsaW5rVGFyZ2V0XSAgVGhlIHRhcmdldCBvZiB0aGUgbGluay4gVGhpcyBpcyB1c2VmdWwgZm9yIHNldHRpbmcgYWN0aXZlIHN0YXRlcyBpbiBjYWxsYmFjay5cbiAgICogQHJldHVybiB7QUpBWERvY3VtZW50fSAgICAgICAgICAgICBBbiBvYmplY3QgcmVwcmVzZW50aW5nIGJvdGggdGhlIG1haW4gZG9jdW1lbnQgYW5kIHRoZSBzdWJkb2N1bWVudFxuICAgKi9cbiAgc3RhdGljIF9wYXJzZVJlc3BvbnNlKGNvbnRlbnQsIHRhcmdldCwgc2VsZWN0aW9uKSB7XG5cbiAgICB2YXIgZG9jLCBzdWJkb2MsIHJlc3VsdHM7XG5cbiAgICAvLyBQYXJzZSB0aGUgZG9jdW1lbnQgZnJvbSB0aGUgY29udGVudCBwcm92aWRlZFxuICAgIGRvYyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIGRvYy5pbm5lckhUTUwgPSBjb250ZW50O1xuXG4gICAgaWYoIHNlbGVjdGlvbiA9PT0gU0VMRUNUT1JTLkNISUxEUkVOIClcbiAgICB7XG4gICAgICBzdWJkb2MgPSBkb2MucXVlcnlTZWxlY3RvckFsbChgJHt0YXJnZXR9ID4gKmApO1xuICAgIH0gZWxzZSB7XG4gICAgICBzdWJkb2MgPSBkb2MucXVlcnlTZWxlY3RvckFsbChzZWxlY3Rpb24pO1xuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICBkb2M6IGRvYyxcbiAgICAgIHN1YmRvYzogc3ViZG9jXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFRoaXMgY29tcGxldGVzIHRoZSB0cmFuc2l0aW9uIG9mIGNvbnRlbnQuIFRoaXMgcmVtb3ZlcyB0aGUgb2xkIGNvbnRlbnQgYW5kIGFkZHMgdGhlIG5ld1xuICAgKlxuICAgKiBAc3RhdGljXG4gICAqIEBwcml2YXRlXG4gICAqIEBwYXJhbSAge0FKQVhEb2N1bWVudH0gY29udGVudCAgICBUaGUgRE9NIG5vZGVzIHRvIGFkZCB0byB0aGUgZWxlbWVudFxuICAgKiBAcGFyYW0gIHtET01Ob2RlfSAgICAgIHRhcmdldCAgICAgVGhlIHRhcmdldCB0byBhZGQgdGhlIG5ldyBjb250ZW50IHRvXG4gICAqIEBwYXJhbSAge3N0cmluZ30gICAgICAgc2VsZWN0aW9uICBUaGlzIGlzIGEgc2VsZWN0b3IgdGhhdCBkZXRlcm1pbmVzIHdoYXQgdG8gY3V0IGZyb20gdGhlIGxvYWRlZCBjb250ZW50LlxuICAgKiBAcGFyYW0gIHtib29sZWFufSAgICAgIGZyb21Qb3AgICAgSW5kaWNhdGVzIHRoYXQgdGhpcyBsb2FkIGlzIGZyb20gYSBoaXN0b3J5IHBvcFxuICAgKi9cbiAgc3RhdGljIF9jb21wbGV0ZVRyYW5zZmVyKGNvbnRlbnQsIHRhcmdldCwgc2VsZWN0aW9uLCBmcm9tUG9wKSB7XG5cbiAgICB2YXIgb2xkVGl0bGUgPSBkb2N1bWVudC50aXRsZSwgbmV3VGl0bGUsIHRhcmdldE5vZGVzO1xuXG4gICAgY29uc29sZS5sb2coY29udGVudCwgY29udGVudC5kb2MuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ3RpdGxlJykpO1xuXG4gICAgLy8gRmluZCB0aGUgbmV3IHBhZ2UgdGl0bGVcbiAgICBuZXdUaXRsZSA9IGNvbnRlbnQuZG9jLmdldEVsZW1lbnRzQnlUYWdOYW1lKCd0aXRsZScpWzBdLnRleHQ7XG5cbiAgICB0YXJnZXQuaW5uZXJIVE1MID0gJyc7XG5cbiAgICBjb250ZW50LnN1YmRvYy5mb3JFYWNoKGZ1bmN0aW9uKHJlc3VsdCkge1xuICAgICAgdGFyZ2V0LmFwcGVuZENoaWxkKHJlc3VsdC5jbG9uZU5vZGUodHJ1ZSkpO1xuICAgIH0pO1xuXG4gICAgLy8gVXBkYXRlIHRoZSBpbnRlcm5hbCByZWZlcmVuY2UgdG8gdGhlIGxhc3QgdGFyZ2V0XG4gICAgdGhpcy5sYXN0Q2hhbmdlZFRhcmdldCA9IHRhcmdldDtcblxuICAgIGlmKCAhZnJvbVBvcCApIHtcbiAgICAgIC8vIFB1c2ggdGhlIG5ldyBzdGF0ZSB0byB0aGUgaGlzdG9yeS5cbiAgICAgIGNvbnNvbGUuY2xlYXIoKTtcbiAgICAgIGNvbnNvbGUubG9nKHsgdGFyZ2V0OiB0YXJnZXQsIHNlbGVjdGlvbjogc2VsZWN0aW9uIH0pO1xuICAgICAgdGhpcy5wdXNoKHRoaXMubGFzdFBhcnNlZFVSTCwgbmV3VGl0bGUsIHsgdGFyZ2V0OiBfdS5nZXRTZWxlY3RvckZvckVsZW1lbnQodGFyZ2V0KSwgc2VsZWN0aW9uOiBzZWxlY3Rpb24gfSk7XG4gICAgfVxuXG4gICAgLy8gU2V0IHRoZSBvYmplY3Qgc3RhdGVcbiAgICB0aGlzLnN0YXRlID0gU1RBVEVTLk9LO1xuICB9XG5cbiAgLyoqXG4gICAqIFRyaWdnZXIgYW4gZXJyb3IgbG9nXG4gICAqXG4gICAqIEBzdGF0aWNcbiAgICogQHByaXZhdGVcbiAgICogQHBhcmFtICB7dHlwZX0gcmVhZHlTdGF0ZSBkZXNjcmlwdGlvblxuICAgKiBAcGFyYW0gIHt0eXBlfSBzdGF0dXMgICAgIGRlc2NyaXB0aW9uXG4gICAqIEByZXR1cm4ge3R5cGV9ICAgICAgICAgICAgZGVzY3JpcHRpb25cbiAgICovXG4gIHN0YXRpYyBfZXJyb3IocmVhZHlTdGF0ZSwgc3RhdHVzLCBlcnJvclN0YXRlID0gRVJST1JTLkdFTkVSSUNfRVJST1IpIHtcbiAgICB2YXIgZXJyb3JTdGF0ZUNvbnN0ID0gKGZ1bmN0aW9uKHZhbCkgeyBmb3IodmFyIGtleSBpbiBFUlJPUlMpIHsgaWYoRVJST1JTW2tleV0gPT0gdmFsKSByZXR1cm4ga2V5IH0gcmV0dXJuICdHRU5FUklDX0VSUk9SJyB9KShlcnJvclN0YXRlKVxuICAgIGNvbnNvbGUud2FybihgJWMgRXJyb3IgbG9hZGluZyBBSkFYIGxpbmsuIHJlYWR5U3RhdGU6ICR7cmVhZHlTdGF0ZX0uIHN0YXR1czogJHtzdGF0dXN9LiBlcnJvclN0YXRlOiAke2Vycm9yU3RhdGVDb25zdH1gLCAnYmFja2dyb3VuZDogIzIyMjsgY29sb3I6ICNmZjdjM2EnKVxuICB9XG5cblxuICAvKipcbiAgICogR2V0dGVycyBhbmQgc2V0dGVyc1xuICAgKi9cblxuICAvKipcbiAgICogKGdldHRlci9zZXR0ZXIpIFRoZSBhdHRyaWJ1dGUgdXNlZCB0byBkZXRlcm1pbmUgd2hldGhlciBhIGxpbmsgc2hvdWxkXG4gICAqIGJlIHJ1biB2aWEgdGhlIEFKQVggY2xhc3MuXG4gICAqXG4gICAqIEB0eXBlIHtzdHJpbmd9XG4gICAqIEBkZWZhdWx0ICdkYXRhLXd0Yy1hamF4J1xuICAgKi9cbiAgc3RhdGljIHNldCBhdHRyaWJ1dGVBamF4KGF0dHJpYnV0ZSkge1xuICAgIGlmKHR5cGVvZiBhdHRyaWJ1dGUgPT09ICdzdHJpbmcnKSB7XG4gICAgICB0aGlzLl9hdHRyaWJ1dGVBamF4ID0gYXR0cmlidXRlO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zb2xlLndhcm4oJ0FsbCBhdHRyaWJ1dGVzIG11c3QgYmUgc3RyaW5ncy4nKTtcbiAgICB9XG4gIH1cbiAgc3RhdGljIGdldCBhdHRyaWJ1dGVBamF4KCkge1xuICAgIHJldHVybiB0aGlzLl9hdHRyaWJ1dGVBamF4IHx8ICdkYXRhLXd0Yy1hamF4JztcbiAgfVxuXG4gIC8qKlxuICAgKiAoZ2V0dGVyL3NldHRlcikgVGhlIGF0dHJpYnV0ZSB1c2VkIHRvIGRldGVybWluZSB3aGVyZSBhIGxpbmsgc2hvdWxkIHBsYWNlIGl0J3NcbiAgICogcmVzdWx0YW50IEdFVC4gVGhpcyBhdHRyaWJ1dGUgc2hvdWxkIGJlIGluIHRoZSBmb3JtIG9mIGEgc2VsZWN0b3IsIGllOlxuICAgKiBgLmFqYXgtdGFyZ2V0YFxuICAgKlxuICAgKiBAdHlwZSB7c3RyaW5nfVxuICAgKiBAZGVmYXVsdCAnZGF0YS13dGMtYWpheC10YXJnZXQnXG4gICAqL1xuICBzdGF0aWMgc2V0IGF0dHJpYnV0ZVRhcmdldChhdHRyaWJ1dGUpIHtcbiAgICBpZih0eXBlb2YgYXR0cmlidXRlID09PSAnc3RyaW5nJykge1xuICAgICAgdGhpcy5fYXR0cmlidXRlVGFyZ2V0ID0gYXR0cmlidXRlO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zb2xlLndhcm4oJ0FsbCBhdHRyaWJ1dGVzIG11c3QgYmUgc3RyaW5ncy4nKTtcbiAgICB9XG4gIH1cbiAgc3RhdGljIGdldCBhdHRyaWJ1dGVUYXJnZXQoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2F0dHJpYnV0ZVRhcmdldCB8fCAnZGF0YS13dGMtYWpheC10YXJnZXQnO1xuICB9XG5cbiAgLyoqXG4gICAqIChnZXR0ZXIvc2V0dGVyKSBUaGUgYXR0cmlidXRlIHVzZWQgdG8gc2xpY2UgdGhlIHJlc3VsdGFudCBHRVQuXG4gICAqIFRoaXMgYXR0cmlidXRlIHNob3VsZCBiZSBpbiB0aGUgZm9ybSBvZiBhIHNlbGVjdG9yLCBpZTpcbiAgICogYC5hamF4LXNlbGVjdGlvbmBcbiAgICpcbiAgICogQHR5cGUge3N0cmluZ31cbiAgICogQGRlZmF1bHQgJ2RhdGEtd3RjLWFqYXgtc2VsZWN0aW9uJ1xuICAgKi9cbiAgc3RhdGljIHNldCBhdHRyaWJ1dGVTZWxlY3Rpb24oYXR0cmlidXRlKSB7XG4gICAgaWYodHlwZW9mIGF0dHJpYnV0ZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgIHRoaXMuX2F0dHJpYnV0ZVNlbGVjdGlvbiA9IGF0dHJpYnV0ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc29sZS53YXJuKCdBbGwgYXR0cmlidXRlcyBtdXN0IGJlIHN0cmluZ3MuJyk7XG4gICAgfVxuICB9XG4gIHN0YXRpYyBnZXQgYXR0cmlidXRlU2VsZWN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLl9hdHRyaWJ1dGVTZWxlY3Rpb24gfHwgJ2RhdGEtd3RjLWFqYXgtc2VsZWN0aW9uJztcbiAgfVxuXG4gIC8qKlxuICAgKiAoZ2V0dGVyL3NldHRlcikgVGhlIGNsYXNzbmFtZSB0byB1c2UgYXMgdGhlIGJhc2lzIGZvciB0cmFuc2l0aW9ucy4gRGVmYXVsdFxuICAgKiB3aWxsIGJlICp3dGMtdHJhbnNpdGlvbiouIFNvIHRoaXMgd2lsbCB0aGVuIGJlIHVzZWQgZm9yIGFsbCAzIHN0YXRlczpcbiAgICogKi53dGMtdHJhbnNpdGlvbipcbiAgICogKi53dGMtdHJhbnNpdGlvbi1vdXQqXG4gICAqICoud3RjLXRyYW5zaXRpb24tb3V0LXN0YXJ0KlxuICAgKiAqLnd0Yy10cmFuc2l0aW9uLW91dC1lbmQqXG4gICAqICoud3RjLXRyYW5zaXRpb24taW4qXG4gICAqICoud3RjLXRyYW5zaXRpb24taW4tc3RhcnQqXG4gICAqICoud3RjLXRyYW5zaXRpb24taW4tZW5kKlxuICAgKlxuICAgKiBAdHlwZSB7c3RyaW5nfVxuICAgKiBAZGVmYXVsdCAnd3RjLXRyYW5zaXRpb24nXG4gICAqL1xuICBzdGF0aWMgc2V0IGNsYXNzQmFzZVRyYW5zaXRpb24oY2xhc3NCYXNlKSB7XG4gICAgaWYodHlwZW9mIGNsYXNzQmFzZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgIHRoaXMuX2NsYXNzQmFzZVRyYW5zaXRpb24gPSBjbGFzc0Jhc2U7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnNvbGUud2FybignQWxsIGF0dHJpYnV0ZXMgbXVzdCBiZSBzdHJpbmdzLicpO1xuICAgIH1cbiAgfVxuICBzdGF0aWMgZ2V0IGNsYXNzQmFzZVRyYW5zaXRpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuX2NsYXNzQmFzZVRyYW5zaXRpb24gfHwgJ3d0Yy10cmFuc2l0aW9uJztcbiAgfVxuXG4gIC8qKlxuICAgKiAoZ2V0dGVyL3NldHRlcikgVGhlIGF0dHJpYnV0ZSB1c2VkIHRvIHNsaWNlIHRoZSByZXN1bHRhbnQgR0VULlxuICAgKiBUaGlzIGF0dHJpYnV0ZSBzaG91bGQgYmUgaW4gdGhlIGZvcm0gb2YgYSBzZWxlY3RvciwgaWU6XG4gICAqIGAuYWpheC1zZWxlY3Rpb25gXG4gICAqXG4gICAqIEB0eXBlIHtzdHJpbmd9XG4gICAqIEBkZWZhdWx0ICdkYXRhLXd0Yy1hamF4LXNlbGVjdGlvbidcbiAgICovXG4gIHN0YXRpYyBzZXQgYXR0cmlidXRlU2hvdWxkTmF2aWdhdGUoYXR0cmlidXRlKSB7XG4gICAgaWYodHlwZW9mIGF0dHJpYnV0ZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgIHRoaXMuX2F0dHJpYnV0ZVNob3VsZE5hdmlnYXRlID0gYXR0cmlidXRlO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zb2xlLndhcm4oJ0FsbCBhdHRyaWJ1dGVzIG11c3QgYmUgc3RyaW5ncy4nKTtcbiAgICB9XG4gIH1cbiAgc3RhdGljIGdldCBhdHRyaWJ1dGVTaG91bGROYXZpZ2F0ZSgpIHtcbiAgICByZXR1cm4gdGhpcy5fYXR0cmlidXRlU2hvdWxkTmF2aWdhdGUgfHwgJ2RhdGEtd3RjLWFqYXgtc2hvdWxkLW5hdmlnYXRlJztcbiAgfVxuXG4gIC8qKlxuICAgKiByZXR1cm5zIGEgbmV3IHJlcXVlc3RPYmplY3QuIFdyYXBwaW5nIHBsYWNlaG9sZGVyIGZvciBub3cgd2FpdGluZyBvbiBlbmhhbmNlbWVudHMuXG4gICAqXG4gICAqIEByZWFkb25seVxuICAgKiBAcmV0dXJuIHtvYmplY3R9ICByZXF1ZXN0T2JqZWN0XG4gICAqL1xuICBzdGF0aWMgZ2V0IHJlcXVlc3RPYmplY3QoKSB7XG4gICAgcmV0dXJuIG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuICB9XG5cbiAgLyoqXG4gICAqIHJldHVybnMgYSBuZXcgbGFzdCBjaGFuZ2VkIHRhcmdldC4gVGhpcyBpcyB1c2VkIHRvIGRldGVybWluZSB3aGF0IHRvIGNoYW5nZWRcbiAgICogd2hlbiBuYXZpZ2F0aW5nIGJhY2sgdmlhIGhpc3RvcnkuXG4gICAqXG4gICAqIEByZXR1cm4ge29iamVjdH0gIGVpdGhlciBhbiBhcnJheSBvZiBub2RlcyBvciBhIHNpbmdsZSBub2RlLlxuICAgKiBAZGVmYXVsdCBudWxsXG4gICAqL1xuICBzdGF0aWMgc2V0IGxhc3RDaGFuZ2VkVGFyZ2V0KHRhcmdldCkge1xuICAgIHRoaXMuX2xhc3RDaGFuZ2VkVGFyZ2V0ID0gdGFyZ2V0O1xuICB9XG4gIHN0YXRpYyBnZXQgbGFzdENoYW5nZWRUYXJnZXQoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2xhc3RDaGFuZ2VkVGFyZ2V0IHx8IG51bGw7XG4gIH1cblxuICAvKipcbiAgICogVGhlIHJlc29sdmUgdGltZW91dC4gVGhpcyBpcyB0aGUgdGltZSB0aGF0IGlzIHRvIGVsbGFwc2UgYmV0d2VlbiBhbiB0cmFuc2l0aW9uXG4gICAqIGNvbXBsZXRpbmcgYW5kIHRoZSBuZXcgY29udGVudCBiZWluZyBhZGRlZC4gVGhpcyBpcyBhcHBsaWVkIGJvdGggdG8gdGhlIG91dHdhcmRcbiAgICogZWxlbWVudCBhbmQgdGhlIGlud2FyZC5cbiAgICpcbiAgICogQHJldHVybiB7aW50fSAgQSBudW1iZXIsIGluIE1TLCBncmVhdGVyIHRoYW4gMFxuICAgKiBAZGVmYXVsdCAwXG4gICAqL1xuICBzdGF0aWMgc2V0IHJlc29sdmVUaW1lb3V0KHRpbWVvdXQpIHtcbiAgICB0aGlzLl9yZXNvbHZlVGltZW91dCA9IHRpbWVvdXQgPiAwID8gdGltZW91dCA6IG51bGw7XG4gIH1cbiAgc3RhdGljIGdldCByZXNvbHZlVGltZW91dCgpIHtcbiAgICByZXR1cm4gdGhpcy5fcmVzb2x2ZVRpbWVvdXQgPiAwID8gdGhpcy5fcmVzb2x2ZVRpbWVvdXQgOiAwO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoZSBzdGF0ZSB0aGF0IHRoZSBBSkFYIG9iamVjdCBpcyBpbiwgYXMgZGV0ZXJtaW5lZCBmcm9tIGEgbGlzdCBvZiBjb25zdGFudHM6XG4gICAqIC0gT0sgICAgICAgICAgICAgSWRsZSwgcmVhZHkgZm9yIGEgc3RhdGUgbG9hZC5cbiAgICogLSBDTElDS0VEICAgICAgICBDbGlja2VkLCBidXQgbm90IHlldCBmaXJlZC5cbiAgICogLSBMT0FESU5HICAgICAgICBMb2FkaW5nIHBhZ2UuXG4gICAqIC0gVFJBTlNJVElPTklORyAgVHJhbnNpdGlvbmluZyBzdGF0ZVxuICAgKiAtIExPQURFRCAgICAgICAgIENvbnRlbnQgbG9hZGVkLlxuICAgKlxuICAgKiBAcmV0dXJuIHtpbnRlZ2VyfSAgVGhlIHN0YXRlIHRoYXQgdGhlIG9iamVjdCBpcyBpbi4gQ29tcGFyZSB0byB0aGUgc3RhdGUgb2JqZWN0IGZvciBkZXNjcmlwdGlvblxuICAgKiBAZGVmYXVsdCBTVEFURS5PS1xuICAgKi9cbiAgc3RhdGljIHNldCBzdGF0ZShzdGF0ZSkge1xuICAgIGlmKCB0eXBlb2Ygc3RhdGUgPT09ICdzdHJpbmcnICkge1xuICAgICAgaWYoIFNUQVRFU1tzdGF0ZV0gIT09IHVuZGVmaW5lZCApIHtcbiAgICAgICAgdGhpcy5fc3RhdGUgPSBTVEFURVNbc3RhdGVdO1xuICAgICAgICByZXR1cm5cbiAgICAgIH1cbiAgICB9IGVsc2UgaWYoIHR5cGVvZiBzdGF0ZSA9PT0gJ251bWJlcicgKSB7XG4gICAgICBmb3IodmFyIF9zdGF0ZSBpbiBTVEFURVMpIHtcbiAgICAgICAgaWYoU1RBVEVTW19zdGF0ZV0gPT09IHN0YXRlKSB7XG4gICAgICAgICAgdGhpcy5fc3RhdGUgPSBzdGF0ZTtcblxuICAgICAgICAgIGlmKCB0aGlzLmRldm1vZGUgKVxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGAlYyBBSkFYIHN0YXRlIGNoYW5nZTogJHt0aGlzLl9zdGF0ZX0gYCwgJ2JhY2tncm91bmQ6ICMyMjI7IGNvbG9yOiAjYmFkYTU1Jyk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIGNvbnNvbGUud2Fybignc3RhdGUgbXVzdCBiZSBvbmUgb2YgT0ssIENMSUNLRUQsIExPQURJTkcsIExPQURFRC4nKTtcbiAgfVxuICBzdGF0aWMgZ2V0IHN0YXRlKCkge1xuICAgIHJldHVybiB0aGlzLl9zdGF0ZSB8fCAwO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoZSBsYXN0IFVSTCB0byBiZSBwYXJzZWQgYnkgdGhlIEFKQVggb2JqZWN0LiBHZW5lcmFsbHkgc3BlYWtpbmcsIHRoaXMgaXMgdGhlXG4gICAqIGxhc3QgVVJMIHRvIGJlIGxvYWRlZCBvciBhdHRlbXB0ZWQgbG9hZGVkLlxuICAgKlxuICAgKiBAcmV0dXJuIHtzdHJpbmd9ICBUaGUgcGFyc2VkIFVSTCBzdHJpbmdcbiAgICogQGRlZmF1bHQgbnVsbFxuICAgKi9cbiAgc3RhdGljIHNldCBsYXN0UGFyc2VkVVJMKHBhcnNlZFVSTCkge1xuICAgIGlmKCB0eXBlb2YgcGFyc2VkVVJMID09PSAnc3RyaW5nJyApIHtcbiAgICAgIHRoaXMuX2xhc3RQYXJzZWRVUkwgPSBwYXJzZWRVUkw7XG4gICAgfVxuICB9XG4gIHN0YXRpYyBnZXQgbGFzdFBhcnNlZFVSTCgpIHtcbiAgICByZXR1cm4gdGhpcy5fbGFzdFBhcnNlZFVSTCB8fCBudWxsO1xuICB9XG59XG5cbmV4cG9ydCB7IEFKQVgsIEVSUk9SUywgU1RBVEVTIH07XG4iLCIvKipcbiAqIENsYXNzIHJlcHJlc2VudGluZyBhbiBhYnN0cmFjdGlvbiBvZiB0aGUgaGlzdG9yeSBBUEkuXG4gKiBAc3RhdGljXG4gKiBAbmFtZXNwYWNlXG4gKiBAYXV0aG9yIExpYW0gRWdhbiA8bGlhbUB3ZXRoZWNvbGxlY3RpdmUuY29tPlxuICogQHZlcnNpb24gMC44XG4gKiBAY3JlYXRlZCBOb3YgMTksIDIwMTZcbiAqL1xuY2xhc3MgSGlzdG9yeSB7XG5cbiAgLyoqXG4gICAqIFB1YmxpYyBtZXRob2RzXG4gICAqL1xuXG4gIC8qKlxuICAgICogSW5pdGlhbGlzZXMgdGhlIEhpc3RvcnkgY2xhc3MuIE5vdGhpbmcgc2hvdWxkIGJlIGFibGUgdG9cbiAgICAqIG9wZXJhdGUgaGVyZSB1bmxlc3MgdGhpcyBoYXMgcnVuIHdpdGggYSBzdXBwb3J0ID0gdHJ1ZS5cbiAgICAqXG4gICAgKiBAUHVibGljXG4gICAgKiBAcmV0dXJuIHtib29sZWFufSAgICAgICAgIFJldHVybnMgd2hldGhlciBpbml0IHJhbiBvciBub3RcbiAgICAqL1xuICBzdGF0aWMgaW5pdChkZXZtb2RlID0gZmFsc2UpIHtcbiAgICBpZih0aGlzLnN1cHBvcnQpXG4gICAge1xuICAgICAgLy8gVHJ5IHRvIHNldCBldmVyeXRoaW5nIHVwLCBhbmQgaWYgd2UgZmFpbCB0aGVuIHJldHVybiBmYWxzZVxuICAgICAgdHJ5IHtcbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3BvcHN0YXRlJywgKGUpPT4ge1xuICAgICAgICAgIHZhciBoYXNQb3BwZWRTdGF0ZSA9IHRoaXMuX3BvcHN0YXRlKGUpO1xuICAgICAgICAgIHJldHVybiBoYXNQb3BwZWRTdGF0ZTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5kZXZtb2RlICAgICAgPSBkZXZtb2RlO1xuXG4gICAgICB9IGNhdGNoIChlKSB7XG5cbiAgICAgICAgLy8gSWYgd2UncmUgaW4gZGV2bW9kZSwgc2VuZCBvdXIgY29uc29sZSBvdXRwdXRcbiAgICAgICAgaWYodGhpcy5kZXZtb2RlKSB7XG4gICAgICAgICAgY29uc29sZS53YXJuKCdlcnJvciBpbiBoaXN0b3J5IGluaXRpYWxpc2F0aW9uJyk7XG4gICAgICAgICAgY29uc29sZS5sb2coZSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuaW5pdGlhbGlzZWQgPSB0cnVlO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgLyoqXG4gICAqIENvbnN0cnVjdCBhbmQgcHVzaCBhIFVSTCBzdGF0ZVxuICAgKlxuICAgKiBAcHVibGljXG4gICAqIEBwYXJhbSAge3N0cmluZ30gVVJMICAgICAgICAgICBUaGUgVVJMIHRvIHB1c2gsIGNhbiBiZSByZWxhdGl2ZSwgYWJzb2x1dGUgb3IgZnVsbFxuICAgKiBAcGFyYW0gIHtzdHJpbmd9IHRpdGxlICAgICAgICAgVGhlIHRpdGxlIHRvIHB1c2guXG4gICAqIEBwYXJhbSAge29iamVjdH0gc3RhdGVPYmogICAgICBBIHN0YXRlIHRvIHB1c2ggdG8gdGhlIHN0YWNrLiBUaGlzIHdpbGwgYmUgcG9wcGVkIHdoZW4gbmF2aWFndGluZyBiYWNrXG4gICAqIEByZXR1cm4ge2Jvb2xlYW59ICAgICAgICAgICAgICBJbmRpY2F0ZXMgd2hldGhlciB0aGUgcHVzaCBzdWNjZWVkZWRcbiAgICovXG4gIHN0YXRpYyBwdXNoKFVSTCwgdGl0bGUgPSAnJywgc3RhdGVPYmogPSB7fSkge1xuXG4gICAgdmFyIHBhcnNlZFVSTCA9ICcnO1xuXG4gICAgLy8gRmlyc3QgdHJ5IHRvIGZpeCB0aGUgVVJMXG4gICAgdHJ5IHtcbiAgICAgIHBhcnNlZFVSTCA9IHRoaXMuX2ZpeFVSTChVUkwsIHRydWUsIHRydWUpO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIGlmKHRoaXMuZGV2bW9kZSkge1xuICAgICAgICBjb25zb2xlLndhcm4oJ3B1c2ggZmFpbGVkIHdoaWxlIHRyeWluZyB0byBmaXggdGhlIFVSTCcpO1xuICAgICAgICBjb25zb2xlLmxvZyhlKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBmYWxzZVxuICAgIH1cblxuICAgIC8vIElmIHdlIGhhdmUgQVBJIHN1cHBvcnQsIHB1c2ggdGhlIHN0YXRlIHRvIHRoZSBoaXN0b3J5IG9iamVjdFxuICAgIGlmKHRoaXMuc3VwcG9ydClcbiAgICB7XG4gICAgICB0cnkge1xuICAgICAgICB0aGlzLmhpc3RvcnkucHVzaFN0YXRlKHN0YXRlT2JqLCB0aXRsZSwgcGFyc2VkVVJMKTtcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgaWYodGhpcy5kZXZtb2RlKSB7XG4gICAgICAgICAgY29uc29sZS53YXJuKCdwdXNoIGZhaWxlZCB3aGlsZSB0cnlpbmcgdG8gcHVzaCB0aGUgc3RhdGUgdG8gdGhlIGhpc3Rvcnkgb2JqZWN0Jyk7XG4gICAgICAgICAgY29uc29sZS5sb2coZSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgIC8vIE90aGVyd2lzZXIsIGFkZCB0aGUgVVJMIGFzIGEgaGFzaGJhbmdcbiAgICB9IGVsc2VcbiAgICB7XG4gICAgICB3aW5kb3cubG9jYXRpb24uaGFzaCA9IGAjISR7VVJMfWA7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICAvKipcbiAgICogVGFrZXMgdGhlIHVzZXIgYmFjayB0byB0aGUgcHJldmlvdXMgc3RhdGUuIFNpbXBseSB3cmFwcyB0aGUgaGlzdG9yeSBvYmplY3QncyBiYWNrIG1ldGhvZC5cbiAgICpcbiAgICogQHB1YmxpY1xuICAgKi9cbiAgc3RhdGljIGJhY2soKSB7XG4gICAgdGhpcy5oaXN0b3J5LmJhY2soKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUYWtlcyB0aGUgdXNlciBmb3J3YXJkIHRvIHRoZSBuZXh0IHN0YXRlLiBTaW1wbHkgd3JhcHMgdGhlIGhpc3Rvcnkgb2JqZWN0J3MgZm9yd2FyZCBtZXRob2QuXG4gICAqXG4gICAqIEBwdWJsaWNcbiAgICovXG4gIHN0YXRpYyBmb3J3YXJkKCkge1xuICAgIHRoaXMuaGlzdG9yeS5mb3J3YXJkKCk7XG4gIH1cblxuXG4gIC8qKlxuICAgKiBQcml2YXRlIG1ldGhvZHNcbiAgICovXG5cbiAgLyoqXG4gICAqIFRha2VzIGEgcHJvdmlkZWQgVVJMIGFuZCByZXR1cm5zIHRoZSB2ZXJzaW9uIHRoYXQgaXMgdXNhYmxlXG4gICAqXG4gICAqIEBwcml2YXRlXG4gICAqIEBwYXJhbSAge3N0cmluZ30gVVJMICAgICAgICAgICAgICAgICAgICAgVGhlIFVSTCB0byBiZSBwYXNzZWRcbiAgICogQHBhcmFtICB7Ym9vbGVhbn0gaW5jbHVkZURvY1Jvb3QgPSB0cnVlICBXaGV0aGVyIHRvIGluY2x1ZGUgdGhlIGRvY3Jvb3Qgb24gdGhlIHBhc3NlZCBVUkxcbiAgICogQHBhcmFtICB7Ym9vbGVhbn0gaW5jbHVkZVRyYWlscyA9IHRydWUgICBXaGV0aGVyIHRvIGluY2x1ZGUgZm91bmQgaGFzaGVzIGFuZCBwYXJhbXNcbiAgICogQHJldHVybiB7c3RyaW5nfSAgICAgICAgICAgICAgICAgICAgICAgICBUaGUgcGFzc2VkIGFuZCBmb3JtYXR0ZWQgVVJMXG4gICAqL1xuICBzdGF0aWMgX2ZpeFVSTChVUkwsIGluY2x1ZGVEb2NSb290ID0gdHJ1ZSwgaW5jbHVkZVRyYWlscyA9IHRydWUpIHtcblxuICAgIHZhciBydG5VUkw7XG5cbiAgICAvKipcbiAgICAgKiBVUkwgUmVnZXggd29ya3MgbGlrZSB0aGlzOlxuICAgICAqIGBgYFxuICAgICAgICBeXG4gICAgICAgIChbXjpdKzovLyAgICAgICAgICAgIyBIVFRQKFMpIGV0Yy5cbiAgICAgICAgICAgIChbXi9dKykgICAgICAgICAjIFRoZSBVUkwgKGlmIGF2YWlsYWJsZSlcbiAgICAgICAgKT9cbiAgICAgICAgKCN7QGRvY3VtZW50Um9vdH0pPyAjIFRoZSBkb2N1bWVudCByb290LCB3aGljaCB3ZSB3YW50IHRvIGdldCByaWQgb2ZcbiAgICAgICAgKC8pPyAgICAgICAgICAgICAgICAjIGNoZWNrIGZvciB0aGUgcHJlc2VuY2Ugb2YgYSBsZWFkaW5nIHNsYXNoXG4gICAgICAgIChbXlxcI1xcP10qKSAgICAgICAgICAjIFRoZSBVUkkgLSB0aGlzIGlzIHdoYXQgd2UgY2FyZSBhYm91dC4gQ2hlY2sgZm9yIGV2ZXJ5dGhpbmcgZXhjZXB0IGZvciAjIGFuZCA/XG4gICAgICAgIChcXD9bXlxcI10qKT8gICAgICAgICAjIGFueSBhZGRpdGlvbmFsIFVSTCBwYXJhbWV0ZXJzIChvcHRpb25hbClcbiAgICAgICAgKFxcI1xcIT8uKyk/ICAgICAgICAgICMgQW55IGhhc2hiYW5nIHRyYWlsZXJzIChvcHRpb25hbClcbiAgICAgKiBgYGBcbiAgICAgKi9cbiAgICBjb25zdCBVUkxSZWdleCA9IFJlZ0V4cChgXihbXjpdKzovLyhbXi9dKykpPygke3RoaXMuZG9jdW1lbnRSb290fSk/KC8pPyhbXlxcXFwjXFxcXD9dKikoXFxcXD9bXlxcXFwjXSopPyhcXFxcI1xcXFwhPy4rKT9gKTtcbiAgICBjb25zdCBbaW5wdXQsIGhyZWYsIGhvc3RuYW1lLCBkb2N1bWVudFJvb3QsIHJvb3QsIHBhdGgsIHBhcmFtcywgaGFzaGJhbmddID0gVVJMUmVnZXguZXhlYyhVUkwpO1xuXG4gICAgY29uc29sZS5sb2codGhpcy5kb2N1bWVudFJvb3QsIGRvY3VtZW50Um9vdCwgcm9vdCwgcGF0aCk7XG5cbiAgICAvLyBJZiB3ZSdyZSBvYnNlcnZpbmcgdGhlIFRMRE4gcmVzdHJhaW50IGFuZCB0aGUgcHJvdmlkZWQgVVJMIGRvZXNuJ3QgbWF0Y2hcbiAgICAvLyB0aGUgZG9tYWluJ3MgVExETiwgdGhyb3cgYSBVUklFcnJvclxuICAgIGlmKCB0eXBlb2YgaG9zdG5hbWUgPT09ICdzdHJpbmcnICYmIGhvc3RuYW1lICE9PSB0aGlzLlRMRE4gJiYgdGhpcy5vYnNlcnZlVExETiA9PT0gdHJ1ZSApIHtcbiAgICAgIHRocm93IG5ldyBVUklFcnJvcignVG9wIExldmVsIGRvbWFpbiBuYW1lIE1VU1QgbWF0Y2ggdGhlIHByaW1hcnkgZG9tYWluIG5hbWUnKTtcbiAgICB9XG5cbiAgICAvLyBJZiBvdXIgbWF0Y2hlZCBVUkwgaGFzIGEgbGVhZGluZyBzbGFzaCwgdGhlbiB3ZSB3YW50IHRvIGRyb3AgdGhlIGRvY1Jvb3RcbiAgICAvLyBpbiB0aGVyZSB1bmxlc3MgdGhlIGZ1bmN0aW9uIHBhcmFtIFwiaW5jbHVkZURvY1Jvb3RcIiBpcyBmYWxzZS5cbiAgICBpZihcbiAgICAgICggdHlwZW9mIHJvb3QgPT09ICdzdHJpbmcnICYmIHJvb3QgPT09ICcvJyApIHx8XG4gICAgICAoIHR5cGVvZiBkb2N1bWVudFJvb3QgPT09ICdzdHJpbmcnICYmIGRvY3VtZW50Um9vdCA9PT0gdGhpcy5kb2N1bWVudFJvb3QgKVxuICAgICkge1xuICAgICAgaWYoIGluY2x1ZGVEb2NSb290ICkge1xuICAgICAgICBydG5VUkwgPSBgJHt0aGlzLmRvY3VtZW50Um9vdH0vJHtwYXRofWA7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBydG5VUkwgPSBgLyR7cGF0aH1gO1xuICAgICAgfVxuICAgIC8vIEVsc2UgaWYgcGF0aCBoYXMgcmVzdWx0ZWQgaW4gYW4gZW1wdHkgc3RyaW5nLCBhc3N1bWUgdGhlIHBhdGggaXMgdGhlIHJvb3RcbiAgICB9IGVsc2UgaWYoIHBhdGggPT09ICcnICkge1xuICAgICAgcnRuVVJMID0gJy8nXG4gICAgLy8gT3RoZXJ3aXNlLCBqdXN0IHBhc3MgdGhlIHBhdGggY29tcGxldGVseS5cbiAgICB9IGVsc2Uge1xuICAgICAgcnRuVVJMID0gcGF0aDtcbiAgICB9XG5cbiAgICAvLyBJZiB3ZSB3YW50IHRvIGluY2x1ZGUgdHJhaWxzIChoYXNoZXMgYW5kIHBhcmFtcywgYXMgZGV0ZXJtaW5lZCBieSBhXG4gICAgLy8gZnVuY2l0b24gcGFyYW0pLCB0aGVuIGFkZCB0aGVtIHRvIHRoZSBVUkwuXG4gICAgaWYoIGluY2x1ZGVUcmFpbHMgKSB7XG4gICAgICAvLyBBcHBlbmQgYW55IHBhcmFtc1xuICAgICAgaWYoIHR5cGVvZiBwYXJhbXMgPT0gJ3N0cmluZycgKSB7XG4gICAgICAgIHJ0blVSTCArPSBwYXJhbXM7XG4gICAgICB9XG4gICAgICAgIC8vIEFwcGVuZCBhbnkgaGFzaGVzXG4gICAgICBpZiggdHlwZW9mIGhhc2hiYW5nID09ICdzdHJpbmcnICkge1xuICAgICAgICBydG5VUkwgKz0gaGFzaGJhbmc7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHJ0blVSTDtcbiAgfVxuXG4gIC8qKlxuICAgKiBMaXN0ZW5lciBmb3IgdGhlIHBvcHN0YXRlIG1ldGhvZFxuICAgKlxuICAgKiBAcHJpdmF0ZVxuICAgKiBAcGFyYW0gIHtvYmplY3R9IGUgdGhlIHBhc3NlZCBldmVudCBvYmplY3RcbiAgICogQHJldHVybiB2b2lkXG4gICAqL1xuICBzdGF0aWMgX3BvcHN0YXRlKGUpIHtcbiAgICB2YXIgYmFzZSwgc3RhdGU7XG4gICAgaWYodGhpcy5zdXBwb3J0KVxuICAgIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIHN0YXRlID0gKGJhc2UgPSB0aGlzLmhpc3RvcnkpLnN0YXRlIHx8IChiYXNlLnN0YXRlID0gZS5zdGF0ZSB8fCAoZS5zdGF0ZSA9IHdpbmRvdy5ldmVudC5zdGF0ZSkpO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVycyBhbmQgc2V0dGVyc1xuICAgKi9cblxuICAvKipcbiAgICogKGdldHRlci9zZXR0ZXIpIFNldHMgdGhlIGRvY3VtZW50IHJvb3QgZnJvbSBhIHBhc3NlZCBVUkxcbiAgICogcmV0dXJucyB0aGUgc2F2ZWQgZG9jdW1lbnQgcm9vdCBvciBhIGAvYCBpZiBub3Qgc2V0XG4gICAqXG4gICAqIEBkZWZhdWx0ICcvJ1xuICAgKiBAdHlwZSB7c3RyaW5nfVxuICAgKi9cbiAgc3RhdGljIHNldCBkb2N1bWVudFJvb3QoZG9jdW1lbnRSb290ID0gJycpIHtcblxuICAgIC8qKlxuICAgICAqIGRvY3Jvb3RSZWdleCB3b3JrcyBsaWtlIHRoaXM6XG4gICAgICogYGBgXG4gICAgICAgICBeXG4gICAgICAgICAoW146XSs6Ly8gICAgICAgIyBIVFRQKFMpIGV0Yy5cbiAgICAgICAgICAgICAoW14vXSspICAgICAjIFRoZSBob3N0bmFtZSAoaWYgYXZhaWxhYmxlKVxuICAgICAgICAgKT9cbiAgICAgICAgIC8/XG4gICAgICAgICAoLiooPz0vKSk/ICAgICAgIyB0aGUgVVJJIHRvIHVzZSBhcyB0aGUgZG9jcm9vdCBsZXNzIGFueSBhdmFpbGFibGUgdHJhaWxpbmcgc2xhc2hcbiAgICAgKiBgYGBcbiAgICAgKi9cbiAgICBjb25zdCBkb2Nyb290UmVnZXggPSAvXihbXjpdKzpcXC9cXC8oW15cXC9dKykpP1xcLz8oLiooPz1cXC8pKT8vO1xuICAgIC8vIHBhc3MgdGhlIGRvY3Jvb3QgYW5kIGhvc3RuYW1lXG4gICAgY29uc3QgW18xLCBfMiwgaG9zdG5hbWUsIGRvY3Jvb3RdID0gZG9jcm9vdFJlZ2V4LmV4ZWMoZG9jdW1lbnRSb290KTtcbiAgICBjb25zb2xlLmxvZyhob3N0bmFtZSwgZG9jcm9vdCk7XG5cbiAgICAvLyBFcnJvciBjaGVja1xuICAgIC8vIGNoZWNrIGZvciB0aGUgcHJlc2VuY2Ugb2YgdGhlIHJlcG9ydGVkIFRMRE5cbiAgICBpZihcbiAgICAgIHR5cGVvZiBob3N0bmFtZSA9PT0gJ3N0cmluZycgJiZcbiAgICAgIGhvc3RuYW1lICE9IHRoaXMuVExETiAmJlxuICAgICAgdGhpcy5vYnNlcnZlVExETiA9PT0gdHJ1ZVxuICAgICkge1xuICAgICAgdGhyb3cgbmV3IFVSSUVycm9yKCdUb3AgTGV2ZWwgZG9tYWluIG5hbWUgTVVTVCBtYXRjaCB0aGUgcHJpbWFyeSBkb21haW4gbmFtZScpO1xuICAgIH1cblxuICAgIHRoaXMuX2RvY3VtZW50Um9vdCA9IGAvJHtkb2Nyb290fWA7XG4gIH1cbiAgc3RhdGljIGdldCBkb2N1bWVudFJvb3QoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2RvY3VtZW50Um9vdCB8fCAnLyc7XG4gIH1cblxuICAvKipcbiAgICogKGdldHRlci9zZXR0ZXIpIFByb3ZpZGVzIGFuIGVycm9yIGlmIHRoZSB1c2VyIHRyaWVzIHRvIHNldCB0aGUgaGlzdG9yeSBvYmplY3RcbiAgICogcmV0dXJucyB0aGUgd2luZG93IGhpc3Rvcnkgb2JqZWN0XG4gICAqXG4gICAqIEB0eXBlIHtvYmplY3R9XG4gICAqL1xuICBzdGF0aWMgc2V0IGhpc3RvcnkoaGlzdG9yeSkge1xuICAgIHRocm93IG5ldyBFcnJvcignVGhlIGhpc3Rvcnkgb2JqZWN0IGlzIHJlYWQgb25seScpO1xuICB9XG4gIHN0YXRpYyBnZXQgaGlzdG9yeSgpIHtcbiAgICByZXR1cm4gd2luZG93Lmhpc3Rvcnk7XG4gIH1cblxuICAvKipcbiAgICogKGdldHRlci9zZXR0ZXIpIFNldHMgdGhlIHRvcCBsZXZlbCBkb21haW4gbmFtZS5cbiAgICogcmV0dXJucyB0aGUgcmVjb3JkZWQgVExETiBvciwgYnkgZGVmYXVsdCwgd2luZG93LmxvY2F0aW9uLmhvc3RuYW1lLlxuICAgKlxuICAgKiBAdHlwZSB7c3RyaW5nfVxuICAgKi9cbiAgc3RhdGljIHNldCBUTEROKFRMRE4pIHtcbiAgICAvLyBAbm90ZSBXZSBzaG91bGQgaW5jbHVkZSBzb21lIGVycm9yIGNoZWNraW5nIGluIGhlcmVcbiAgICB0aGlzLl9UTEROID0gVExETjtcbiAgfVxuICBzdGF0aWMgZ2V0IFRMRE4oKSB7XG4gICAgcmV0dXJuIHRoaXMuX1RMRE4gfHwgd2luZG93LmxvY2F0aW9uLmhvc3RuYW1lO1xuICB9XG5cbiAgLyoqXG4gICAqIChnZXR0ZXIvc2V0dGVyKSB3aGV0aGVyIHRvIG9ic2VydmUgdGhlIFRMRE4gb3IgYHRydWVgIChkZWZhdWx0KS5cbiAgICpcbiAgICogQGRlZmF1bHQgdHJ1ZVxuICAgKiBAdHlwZSB7Ym9vbGVhbn1cbiAgICovXG4gIHN0YXRpYyBzZXQgb2JzZXJ2ZVRMRE4ob2JzZXJ2ZSkge1xuICAgIC8vIENoZWNrIHRvIG1ha2Ugc3VyZSB0aGF0IHRoZSBiYXNzZWQgdmFsdWUgaXMgb2YgdHlwZSBib29sZWFuLlxuICAgIGlmKHR5cGVvZiBvYnNlcnZlID09PSAnYm9vbGVhbicpXG4gICAge1xuICAgICAgdGhpcy5fb2JzZXJ2ZVRMRE4gPSBvYnNlcnZlO1xuICAgIH0gZWxzZVxuICAgIHtcbiAgICAgIGNvbnNvbGUud2Fybignb2JzZXJ2ZVRMRE4gbXVzdCBiZSBvZiB0eXBlIGJvb2xlYW4nKTtcbiAgICB9XG4gIH1cbiAgc3RhdGljIGdldCBvYnNlcnZlVExETigpIHtcbiAgICBpZih0eXBlb2YgdGhpcy5fb2JzZXJ2ZVRMRE4gPT09ICdib29sZWFuJylcbiAgICB7XG4gICAgICByZXR1cm4gdGhpcy5fb2JzZXJ2ZVRMRE47XG4gICAgfSBlbHNlXG4gICAge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIChnZXR0ZXIvc2V0dGVyKSBXaGV0aGVyIHRoaXMgaGlzdG9yeSBvYmplY3QgaXMgaW4gZGV2bW9kZS4gRGVmYXVsdHMgdG8gZmFsc2VcbiAgICpcbiAgICogQGRlZmF1bHQgZmFsc2VcbiAgICogQHR5cGUge2Jvb2xlYW59XG4gICAqL1xuICBzdGF0aWMgc2V0IGRldm1vZGUoZGV2bW9kZSkge1xuICAgIC8vIENoZWNrIHRvIG1ha2Ugc3VyZSB0aGF0IHRoZSBiYXNzZWQgdmFsdWUgaXMgb2YgdHlwZSBib29sZWFuLlxuICAgIGlmKHR5cGVvZiBkZXZtb2RlID09PSAnYm9vbGVhbicpXG4gICAge1xuICAgICAgdGhpcy5fZGV2bW9kZSA9IGRldm1vZGU7XG4gICAgfSBlbHNlXG4gICAge1xuICAgICAgY29uc29sZS53YXJuKCdkZXZtb2RlIG11c3QgYmUgb2YgdHlwZSBib29sZWFuJyk7XG4gICAgfVxuICB9XG4gIHN0YXRpYyBnZXQgZGV2bW9kZSgpIHtcbiAgICBpZih0eXBlb2YgdGhpcy5fZGV2bW9kZSA9PT0gJ2Jvb2xlYW4nKVxuICAgIHtcbiAgICAgIHJldHVybiB0aGlzLl9kZXZtb2RlO1xuICAgIH0gZWxzZVxuICAgIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogKGdldHRlci9zZXR0ZXIpIFdoZXRoZXIgdGhpcyBoaXN0b3J5IG9iamVjdCBpcyBpbml0aWFsaWFzZWQuXG4gICAqXG4gICAqIEBkZWZhdWx0IGZhbHNlXG4gICAqIEB0eXBlIHtib29sZWFufVxuICAgKi9cbiAgc3RhdGljIHNldCBpbml0aWFsaWFzZWQoaW5pdGlhbGlhc2VkKSB7XG4gICAgLy8gQ2hlY2sgdG8gbWFrZSBzdXJlIHRoYXQgdGhlIGJhc3NlZCB2YWx1ZSBpcyBvZiB0eXBlIGJvb2xlYW4uXG4gICAgaWYodHlwZW9mIGluaXRpYWxpYXNlZCA9PT0gJ2Jvb2xlYW4nKVxuICAgIHtcbiAgICAgIHRoaXMuX2luaXRpYWxpYXNlZCA9IGluaXRpYWxpYXNlZDtcbiAgICB9IGVsc2VcbiAgICB7XG4gICAgICBjb25zb2xlLndhcm4oJ2luaXRpYWxpYXNlZCBtdXN0IGJlIG9mIHR5cGUgYm9vbGVhbicpO1xuICAgIH1cbiAgfVxuICBzdGF0aWMgZ2V0IGluaXRpYWxpYXNlZCgpIHtcbiAgICBpZih0eXBlb2YgdGhpcy5faW5pdGlhbGlhc2VkID09PSAnYm9vbGVhbicpXG4gICAge1xuICAgICAgcmV0dXJuIHRoaXMuX2luaXRpYWxpYXNlZDtcbiAgICB9IGVsc2VcbiAgICB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIChnZXR0ZXIvc2V0dGVyKSBXaGV0aGVyIGhpc3RvcnkgaXMgc3VwcG9ydGVkIGJ5IHRoZSBicm93c2VyIG9yIGRldmljZS5cbiAgICogUHJvdmlkZXMgYW4gZXJyb3IgaWYgdGhlIHVzZXIgdHJpZXMgdG8gc2V0IHRoZSBzdXBwb3J0IHZhbHVlLCB1bmxlc3MgdGhlIG9iamVjdCBpcyBpbiBkZXZtb2RlXG4gICAqXG4gICAqIEB0eXBlIHtib29sZWFufVxuICAgKi9cbiAgc3RhdGljIHNldCBzdXBwb3J0KHN1cHBvcnQgPSBmYWxzZSkge1xuICAgIC8vIFRoaXMgb3ZlcnJpZGVzXG4gICAgaWYoIHRoaXMuZGV2bW9kZSAmJiB0eXBlb2Ygc3VwcG9ydCA9PT0gJ2Jvb2xlYW4nICkge1xuICAgICAgdGhpcy5fc3VwcG9ydCA9IHN1cHBvcnQ7XG4gICAgfVxuICAgIHRocm93IG5ldyBFcnJvcignVGhlIHN1cHBvcnQgaXMgcmVhZCBvbmx5Jyk7XG4gIH1cbiAgc3RhdGljIGdldCBzdXBwb3J0KCkge1xuICAgIHJldHVybiAod2luZG93Lmhpc3RvcnkgJiYgd2luZG93Lmhpc3RvcnkucHVzaFN0YXRlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiAoZ2V0dGVyL3NldHRlcikgVGhlIGxlbmd0aCBvZiB0aGUgaGlzdG9yeSBzdGFja1xuICAgKlxuICAgKiBAdHlwZSB7aW50ZWdlcn1cbiAgICovXG4gIHN0YXRpYyBnZXQgbGVuZ3RoKCkge1xuICAgIHJldHVybiB0aGlzLmhpc3RvcnkubGVuZ3RoO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IEhpc3Rvcnk7XG4iXX0=
