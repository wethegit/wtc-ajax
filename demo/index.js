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

  // AJAX.resolveTimeout = 1000; // Remove this when not in dev mode

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
      var transClass = this.classBaseTransition;

      var transitionRun = false;
      var loadRun = false;
      var resolver = null;

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
      _wtcAnimationEvents2.default.addEndEventListener(DOMTarget).then(function () {
        transitionRun = true;
      });

      var requestPromise = new Promise(function handler(resolve, reject) {
        var _this3 = this;

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

          // load run is done, so set the variable to true
          loadRun = true;

          // Resolve Promis to test, on interval, whether the transition has
          // completed. When it has, resolve the promise.
          var resolve = new Promise(function (resolve, reject) {
            var testInterval = null;
            var testResolved = function () {
              if (transitionRun === true) {
                // Clear the interval
                clearInterval(testInterval);

                setTimeout(function () {
                  resolve(resolver);
                }, this.resolveTimeout);
              }
            }.bind(this);

            testInterval = setInterval(testResolved, 50);
          }.bind(this));

          return resolve;
        }
      }.bind(this)).
      // THEN: responsible for adding the final content to the main document. Returns a promise that identifies the transition
      then(function (resolver) {
        // Find the target node
        var targetNode = resolver.DOMTarget;
        // Modify its classes
        console.log('removing classes');
        _wtcUtilityHelpers2.default.removeClass(this.classBaseTransition + '-out-finish', targetNode);
        _wtcUtilityHelpers2.default.removeClass(this.classBaseTransition + '-out-end', targetNode);
        _wtcUtilityHelpers2.default.removeClass(this.classBaseTransition + '-out', targetNode);
        _wtcUtilityHelpers2.default.addClass(transClass + '-in', DOMTarget);
        _wtcUtilityHelpers2.default.addClass(transClass + '-in-start', DOMTarget);
        setTimeout(function () {
          _wtcUtilityHelpers2.default.addClass(transClass + '-in-end', DOMTarget);
        }, 0);
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
        _wtcUtilityHelpers2.default.removeClass(this.classBaseTransition + '-in-end', targetNode);
        _wtcUtilityHelpers2.default.addClass(this.classBaseTransition + '-in-finish', targetNode);
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
      console.log('---- _popstate ---- ');
      var base,
          state = {};
      var hasPoppedState = _get(AJAX.__proto__ || Object.getPrototypeOf(AJAX), "_popstate", this).call(this, e);

      if (hasPoppedState) {
        state = (base = this.history).state || (base.state = e.state || (e.state = window.event.state));
      }

      console.log(state, hasPoppedState);
      console.log(' ');

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

      console.log('--- completeTransfer ---');
      console.log(content, oldTitle, content.doc.getElementsByTagName('title'));

      // Find the new page title
      newTitle = content.doc.getElementsByTagName('title')[0].text;

      target.innerHTML = '';

      content.subdoc.forEach(function (result) {
        target.appendChild(result.cloneNode(true));
      });

      // Update the internal reference to the last target
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
          console.log(stateObj);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJkZW1vL3J1bi5qcyIsIm5vZGVfbW9kdWxlcy93dGMtdXRpbGl0eS1oZWxwZXJzL2Rpc3Qvd3RjLXV0aWxpdHktaGVscGVycy5qcyIsInNyYy93dGMtQW5pbWF0aW9uRXZlbnRzLmpzIiwic3JjL3d0Yy1hamF4LmpzIiwic3JjL3d0Yy1oaXN0b3J5LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUNBQTs7QUFFQTtBQUNBLGNBQUssSUFBTCxDQUFVLElBQVY7QUFDQTtBQUNBLGNBQUssWUFBTCxHQUFvQixRQUFwQjs7QUFFQSxTQUFTLEtBQVQsQ0FBZSxFQUFmLEVBQW1CO0FBQ2pCLE1BQUksU0FBUyxVQUFULElBQXVCLFNBQTNCLEVBQXNDO0FBQ3BDO0FBQ0QsR0FGRCxNQUVPO0FBQ0wsYUFBUyxnQkFBVCxDQUEwQixrQkFBMUIsRUFBOEMsRUFBOUM7QUFDRDtBQUNGOztBQUVELE1BQU0sWUFDTjtBQUNFO0FBQ0EsZ0JBQUssU0FBTDs7QUFFQTs7QUFFQTtBQUNBO0FBQ0EsU0FBTyxnQkFBUCxDQUF3QixNQUF4QixFQUFnQyxVQUFTLENBQVQsRUFBWTtBQUMxQyxhQUFTLGNBQVQsQ0FBd0IsUUFBeEIsRUFBa0MsZ0JBQWxDLENBQW1ELE9BQW5ELEVBQTRELFVBQVMsQ0FBVCxFQUFZO0FBQ3RFLG9CQUNFLE9BREYsQ0FDVSxrQkFEVixFQUM4QixlQUQ5QixFQUMrQyxrQkFEL0MsRUFDbUUsRUFBRSxNQURyRSxFQUVFLElBRkYsQ0FFTyxVQUFTLFFBQVQsRUFBbUI7QUFDdEI7QUFDQSxlQUFPLFFBQVA7QUFDRCxPQUxIO0FBTUQsS0FQRDtBQVFELEdBVEQ7QUFVRCxDQW5CRDs7QUFxQkEsT0FBTyxPQUFQOzs7QUNwQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7OztBQ3JYQTs7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Ozs7Ozs7d0JBS29CO0FBQ2xCLGFBQU8sS0FBSyxPQUFMLENBQWEsTUFBcEI7QUFDRDs7Ozs7O2tCQUdZLE8iLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiaW1wb3J0IHsgQUpBWCB9IGZyb20gXCIuLi9zcmMvd3RjLWFqYXhcIjtcblxuLy8gSW5pdGlhbGlzZSB0aGUgaGlzdG9yeSBvYmplY3QgaW4gZGV2IG1vZGVcbkFKQVguaW5pdCh0cnVlKTtcbi8vIFNldCB0aGUgZG9jdW1lbnQgcm9vdCBmb3IgdGhlIGFwcGxpY2F0aW9uIChpZiBuZWNlc3NhcnkpXG5BSkFYLmRvY3VtZW50Um9vdCA9ICcvZGVtby8nO1xuXG5mdW5jdGlvbiByZWFkeShmbikge1xuICBpZiAoZG9jdW1lbnQucmVhZHlTdGF0ZSAhPSAnbG9hZGluZycpIHtcbiAgICBmbigpO1xuICB9IGVsc2Uge1xuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ0RPTUNvbnRlbnRMb2FkZWQnLCBmbik7XG4gIH1cbn1cblxucmVhZHkoZnVuY3Rpb24oKVxue1xuICAvLyBUaGlzIGluaXRpYWxpc2VzIGFueSBsaW5rcyB3aXRoIEFKQVggYXR0cmlidXRlc1xuICBBSkFYLmluaXRMaW5rcygpO1xuXG4gIC8vIEFKQVgucmVzb2x2ZVRpbWVvdXQgPSAxMDAwOyAvLyBSZW1vdmUgdGhpcyB3aGVuIG5vdCBpbiBkZXYgbW9kZVxuXG4gIC8vIFRoaXMgaXMgYSBtYW51YWwgaW5pdGlhbGlzYXRpb24gb2YgbGlua3MgYW5kIGlzLCBpbnN0ZWFkLCBhIGRlbW9uc3RyYXRpb25cbiAgLy8gb2YgaG93IHByb2dyYW1hdGljIEFKQVggcmV0cmlldmFsIHdvcmtzLlxuICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsIGZ1bmN0aW9uKGUpIHtcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbGlua18xJykuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbihlKSB7XG4gICAgICBBSkFYLlxuICAgICAgICBhamF4R2V0KFwiL2RlbW8vcGFnZTEuaHRtbFwiLCBcIiNsaW5rMS10YXJnZXRcIiwgXCIubGluazEtc2VsZWN0aW9uXCIsIGUudGFyZ2V0KS5cbiAgICAgICAgdGhlbihmdW5jdGlvbihyZXNvbHZlcikge1xuICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCdvbkxvYWQnLCByZXNvbHZlcik7XG4gICAgICAgICAgcmV0dXJuIHJlc29sdmVyO1xuICAgICAgICB9KTtcbiAgICB9KTtcbiAgfSk7XG59KTtcblxud2luZG93LkFKQVhPYmogPSBBSkFYO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5cbnZhciBfdHlwZW9mID0gdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIHR5cGVvZiBTeW1ib2wuaXRlcmF0b3IgPT09IFwic3ltYm9sXCIgPyBmdW5jdGlvbiAob2JqKSB7IHJldHVybiB0eXBlb2Ygb2JqOyB9IDogZnVuY3Rpb24gKG9iaikgeyByZXR1cm4gb2JqICYmIHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiBvYmouY29uc3RydWN0b3IgPT09IFN5bWJvbCAmJiBvYmogIT09IFN5bWJvbC5wcm90b3R5cGUgPyBcInN5bWJvbFwiIDogdHlwZW9mIG9iajsgfTtcblxudmFyIHV0aWxpdGllcyA9IHt9O1xuXG4vKipcbiAqIHJhbmRvbUJldHdlZW5cbiAqIEdlbmVyYXRlIGEgcmFuZG9tIGludGVnZXIgbnVtYmVyIG1heCBhbmQgbWluLlxuICogQG1pbiB7bnVtYmVyfSBNaW5pbXVtIHZhbHVlLlxuICogQG1heCB7bnVtYmVyfSBNYXhpbXVtIHZhbHVlLlxuICogcmV0dXJuIHtudW1iZXJ9IFJhbmRvbSBpbnRlZ2VyLlxuICovXG51dGlsaXRpZXMucmFuZG9tQmV0d2VlbiA9IGZ1bmN0aW9uIChtaW4sIG1heCkge1xuICByZXR1cm4gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogKG1heCAtIG1pbiArIDEpICsgbWluKTtcbn07XG5cbi8qKlxuICogZ2V0U3R5bGVcbiAqIEdldCB0aGUgY3VycmVudCBzdHlsZSB2YWx1ZSBmcm9tIGFuIGVsZW1lbnQuXG4gKiBAZWwge0RPTU5vZGV9IFRhcmdldCBlbGVtZW50LlxuICogQHByb3Age3N0cmluZ30gQ1NTIHByb3BlcnR5IG5hbWUuXG4gKiBAc3RyaXBVbml0IHtib29sZWFufSBSZW1vdmUgdW5pdHMuXG4gKiByZXR1cm4ge3N0cmluZ30gQ3VycmVudCBDU1MgdmFsdWUgV0lUSCB1bml0LlxuICovXG51dGlsaXRpZXMuZ2V0U3R5bGUgPSBmdW5jdGlvbiAoZWwsIHByb3AsIHN0cmlwVW5pdCkge1xuICB2YXIgc3RyVmFsdWUgPSBcIlwiO1xuXG4gIGlmICh3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZSkge1xuICAgIHN0clZhbHVlID0gZ2V0Q29tcHV0ZWRTdHlsZShlbCkuZ2V0UHJvcGVydHlWYWx1ZShwcm9wKTtcbiAgfVxuICAvL0lFXG4gIGVsc2UgaWYgKGVsLmN1cnJlbnRTdHlsZSkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgc3RyVmFsdWUgPSBlbC5jdXJyZW50U3R5bGVbcHJvcF07XG4gICAgICB9IGNhdGNoIChlKSB7fVxuICAgIH1cblxuICBpZiAoc3RyaXBVbml0KSB7XG4gICAgc3RyVmFsdWUgPSBwYXJzZUludChzdHJWYWx1ZSk7XG4gIH1cblxuICByZXR1cm4gc3RyVmFsdWU7XG59O1xuXG4vKipcbiAqIExvZ1xuICogU2ltcGxlIGxvZyBmdW5jdGlvbiB0byBzaG93IGRpZmZlcmVudCBjb2xvcnMgb24gdGhlIGNvbnNvbGUuXG4gKiBAc3RhdHVzIHtzdHJpbmd9IFN0YXR1cyB0eXBlLlxuICogQG1zZyB7c3RyaW5nfSBNZXNzYWdlIHRvIHNob3cuXG4gKi9cbnV0aWxpdGllcy5sb2cgPSBmdW5jdGlvbiAoc3RhdHVzLCBtc2cpIHtcbiAgdmFyIGJnYywgY29sb3I7XG5cbiAgc3dpdGNoIChzdGF0dXMpIHtcbiAgICBjYXNlIFwic3VjY2Vzc1wiOlxuICAgICAgY29sb3IgPSBcIkdyZWVuXCI7XG4gICAgICBiZ2MgPSBcIkxpbWVHcmVlblwiO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcImluZm9cIjpcbiAgICAgIGNvbG9yID0gXCJEb2RnZXJCbHVlXCI7XG4gICAgICBiZ2MgPSBcIlR1cnF1b2lzZVwiO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcImVycm9yXCI6XG4gICAgICBjb2xvciA9IFwiQmxhY2tcIjtcbiAgICAgIGJnYyA9IFwiUmVkXCI7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwid2FybmluZ1wiOlxuICAgICAgY29sb3IgPSBcIlRvbWF0b1wiO1xuICAgICAgYmdjID0gXCJHb2xkXCI7XG4gICAgICBicmVhaztcbiAgICBkZWZhdWx0OlxuICAgICAgY29sb3IgPSBcImJsYWNrXCI7XG4gICAgICBiZ2MgPSBcIldoaXRlXCI7XG4gIH1cblxuICBpZiAoKHR5cGVvZiBtc2cgPT09IFwidW5kZWZpbmVkXCIgPyBcInVuZGVmaW5lZFwiIDogX3R5cGVvZihtc2cpKSA9PT0gXCJvYmplY3RcIikge1xuICAgIGNvbnNvbGUubG9nKG1zZyk7XG4gIH0gZWxzZSB7XG4gICAgY29uc29sZS5sb2coXCIlY1wiICsgbXNnLCBcImNvbG9yOlwiICsgY29sb3IgKyBcIjtmb250LXdlaWdodDpib2xkOyBiYWNrZ3JvdW5kLWNvbG9yOiBcIiArIGJnYyArIFwiO1wiKTtcbiAgfVxufTtcblxuLyoqXG4gKiBvbmNlXG4gKiBGaXJlcyBhbiBldmVudCBvbmx5IG9uY2UgYW5kIGV4ZWN1dGVzIHRoZSBjYWxsYmFjay5cbiAqIEBub2RlIHtET01FbGVtZW50fSBEb20gZWxlbWVudCB0byBhdHRhY2ggZXZlbnQuXG4gKiBAdHlwZSB7U3RyaW5nfSBUeXBlIG9mIGV2ZW50LlxuICogQGNhbGxiYWNrIHtmdW5jdGlvbn0gQ2FsbGJhY2suXG4gKi9cbnV0aWxpdGllcy5vbmNlID0gZnVuY3Rpb24gKG5vZGUsIHR5cGUsIGNhbGxiYWNrKSB7XG4gIG5vZGUuYWRkRXZlbnRMaXN0ZW5lcih0eXBlLCBmdW5jdGlvbiAoZSkge1xuICAgIGUudGFyZ2V0LnJlbW92ZUV2ZW50TGlzdGVuZXIoZS50eXBlLCBhcmd1bWVudHMuY2FsbGVlKTtcbiAgICByZXR1cm4gY2FsbGJhY2soZSk7XG4gIH0pO1xufTtcblxuLyoqXG4gKiBzaHVmZmxlQXJyYXlcbiAqIFNodWZmbGUgYW4gYXJyYXkuXG4gKiBAYXJyYXkgQXJycmF5IHRvIGJlIHNodWZmbGVkLlxuICogcmV0dXJuIHthcnJheX0gU2h1ZmZsZWQgYXJyYXkuXG4gKi9cbnV0aWxpdGllcy5zaHVmZmxlQXJyYXkgPSBmdW5jdGlvbiAoYXJyYXkpIHtcbiAgdmFyIGN1cnJlbnRJbmRleCA9IGFycmF5Lmxlbmd0aCxcbiAgICAgIHRlbXBvcmFyeVZhbHVlLFxuICAgICAgcmFuZG9tSW5kZXg7XG5cbiAgLy8gV2hpbGUgdGhlcmUgcmVtYWluIGVsZW1lbnRzIHRvIHNodWZmbGUuLi5cbiAgd2hpbGUgKDAgIT09IGN1cnJlbnRJbmRleCkge1xuXG4gICAgLy8gUGljayBhIHJlbWFpbmluZyBlbGVtZW50Li4uXG4gICAgcmFuZG9tSW5kZXggPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBjdXJyZW50SW5kZXgpO1xuICAgIGN1cnJlbnRJbmRleCAtPSAxO1xuXG4gICAgLy8gQW5kIHN3YXAgaXQgd2l0aCB0aGUgY3VycmVudCBlbGVtZW50LlxuICAgIHRlbXBvcmFyeVZhbHVlID0gYXJyYXlbY3VycmVudEluZGV4XTtcbiAgICBhcnJheVtjdXJyZW50SW5kZXhdID0gYXJyYXlbcmFuZG9tSW5kZXhdO1xuICAgIGFycmF5W3JhbmRvbUluZGV4XSA9IHRlbXBvcmFyeVZhbHVlO1xuICB9XG5cbiAgcmV0dXJuIGFycmF5O1xufTtcblxuLyoqXG4gKiBmaXJlQ3VzdG9tRXZlbnRcbiAqIEZpcmUgYSBjdXN0b20gZXZlbnQuXG4gKiBAbmFtZSB7c3RyaW5nfSBOYW1lIG9mIHRoZSBldmVudC5cbiAqIEBkYXRhIHtvYmplY3R9IE9iamVjdCB0byBiZSBwYXNzZWQgdG8gdGhlIGV2ZW50LlxuICovXG51dGlsaXRpZXMuZmlyZUN1c3RvbUV2ZW50ID0gZnVuY3Rpb24gKG5hbWUsIGRhdGEsIGJ1YmJsZXMsIGNhbmNlbGFibGUpIHtcbiAgdmFyIGV2O1xuICB2YXIgcGFyYW1zID0ge1xuICAgIGJ1YmJsZXM6IGJ1YmJsZXMgfHwgdHJ1ZSxcbiAgICBjYW5jZWxhYmxlOiBjYW5jZWxhYmxlIHx8IHRydWUsXG4gICAgZGV0YWlsOiBkYXRhIHx8IG51bGxcbiAgfTtcblxuICBpZiAodHlwZW9mIHdpbmRvdy5DdXN0b21FdmVudCA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgZXYgPSBuZXcgQ3VzdG9tRXZlbnQobmFtZSwgcGFyYW1zKTtcbiAgfSBlbHNlIHtcbiAgICBldiA9IGRvY3VtZW50LmNyZWF0ZUV2ZW50KCdDdXN0b21FdmVudCcpO1xuICAgIGV2LmluaXRDdXN0b21FdmVudChuYW1lLCBwYXJhbXMuYnViYmxlcywgcGFyYW1zLmNhbmNlbGFibGUsIHBhcmFtcy5kZXRhaWwpO1xuICB9XG5cbiAgd2luZG93LmRpc3BhdGNoRXZlbnQoZXYpO1xufTtcblxuLyoqXG4gKiBmb3JFYWNoTm9kZVxuICogTG9vcCB0aHJvdWdoIGFuZCBhcnJheSBvZiBET00gZWxlbWVudHMuXG4gKiBAYXJyYXkge0RPTSBOb2RlIExpc3R9IExpc3Qgb2YgZWxlbWVudHMuXG4gKiBAY2FsbGJhY2sge2Z1bmN0aW9ufSBDYWxsYmFjay5cbiAqIEBzY29wZSAqb3B0aW9uYWwge2Z1bmN0aW9ufSBTY29wZSB0byBwYXNzIHRvIGNhbGxiYWNrLlxuICovXG51dGlsaXRpZXMuZm9yRWFjaE5vZGUgPSBmdW5jdGlvbiAoYXJyYXksIGNhbGxiYWNrLCBzY29wZSkge1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGFycmF5Lmxlbmd0aDsgaSsrKSB7XG4gICAgY2FsbGJhY2suY2FsbChzY29wZSwgaSwgYXJyYXlbaV0pOyAvLyBwYXNzZXMgYmFjayBzdHVmZiB3ZSBuZWVkXG4gIH1cbn07XG5cbi8qKlxuICogZ2V0RWxlbWVudFBvc2l0aW9uXG4gKiBHZXQgdGhlIHBvc2l0aW9uIG9mIHRoZSBlbGVtZW50IHJlbGF0aXZlIHRvIGRvY3VtZW50LlxuICogQGVsZW1lbnQge0RPTSBOb2RlfSBFbGVtZW50LlxuICogcmV0dXJucyBPYmplY3Qgd2l0aCBlbGVtZW50IGNvb3JkaW5hdGVzLlxuICovXG51dGlsaXRpZXMuZ2V0RWxlbWVudFBvc2l0aW9uID0gZnVuY3Rpb24gKGVsZW1lbnQpIHtcbiAgdmFyIHBvc2l0aW9uVG9WaWV3cG9ydCA9IGVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG5cbiAgdmFyIHNjcm9sbFRvcCA9IHdpbmRvdy5wYWdlWU9mZnNldDtcbiAgdmFyIHNjcm9sbExlZnQgPSB3aW5kb3cucGFnZVhPZmZzZXQ7XG5cbiAgdmFyIGNsaWVudFRvcCA9IGRvY3VtZW50LmJvZHkuY2xpZW50VG9wIHx8IDA7XG4gIHZhciBjbGllbnRMZWZ0ID0gZG9jdW1lbnQuYm9keS5jbGllbnRMZWZ0IHx8IDA7XG5cbiAgdmFyIHRvcCA9IHBvc2l0aW9uVG9WaWV3cG9ydC50b3AgKyBzY3JvbGxUb3AgLSBjbGllbnRUb3A7XG4gIHZhciBsZWZ0ID0gcG9zaXRpb25Ub1ZpZXdwb3J0LmxlZnQgKyBzY3JvbGxMZWZ0IC0gY2xpZW50TGVmdDtcblxuICByZXR1cm4ge1xuICAgIHRvcDogTWF0aC5yb3VuZCh0b3ApLFxuICAgIGxlZnQ6IE1hdGgucm91bmQobGVmdClcbiAgfTtcbn07XG5cbi8qKlxuICogZ2V0Vmlld3BvcnREaW1lbnNpb25zXG4gKiBHZXQgdGhlIGJyb3dzZXIgd2luZG93IHNpemUuXG4gKiByZXR1bnMgT2JqZWN0IHdpdGggZGltZW5zaW9ucy5cbiAqL1xudXRpbGl0aWVzLmdldFZpZXdwb3J0RGltZW5zaW9ucyA9IGZ1bmN0aW9uICgpIHtcbiAgcmV0dXJuIHtcbiAgICB3aWR0aDogTWF0aC5tYXgoZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsaWVudFdpZHRoLCB3aW5kb3cuaW5uZXJXaWR0aCB8fCAwKSxcbiAgICBoZWlnaHQ6IE1hdGgubWF4KGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGllbnRIZWlnaHQsIHdpbmRvdy5pbm5lckhlaWdodCB8fCAwKVxuICB9O1xufTtcblxuLyoqXG4gKiBjbGFzc0V4dGVuZFxuICogRXh0ZW5kcyBhIHBhcmVudCBjbGFzcy5cbiAqIEBjaGlsZCB7ZnVuY3Rpb259IENoaWxkIGNsYXNzLlxuICogQHBhcmVudCB7ZnVuY3Rpb259IFBhcmVudCBjbGFzcy5cbiAqIHJldHVybnMgdXBkYXRlZCBDaGlsZCBjbGFzcztcbiAqL1xudXRpbGl0aWVzLmNsYXNzRXh0ZW5kID0gZnVuY3Rpb24gKGNoaWxkLCBwYXJlbnQpIHtcbiAgdmFyIGhhc1Byb3AgPSB7fS5oYXNPd25Qcm9wZXJ0eTtcblxuICBmb3IgKHZhciBrZXkgaW4gcGFyZW50KSB7XG4gICAgaWYgKGhhc1Byb3AuY2FsbChwYXJlbnQsIGtleSkpIGNoaWxkW2tleV0gPSBwYXJlbnRba2V5XTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGN0b3IoKSB7XG4gICAgdGhpcy5jb25zdHJ1Y3RvciA9IGNoaWxkO1xuICB9XG5cbiAgY3Rvci5wcm90b3R5cGUgPSBwYXJlbnQucHJvdG90eXBlO1xuICBjaGlsZC5wcm90b3R5cGUgPSBuZXcgY3RvcigpO1xuICBjaGlsZC5fX3N1cGVyX18gPSBwYXJlbnQucHJvdG90eXBlO1xuXG4gIHJldHVybiBjaGlsZDtcbn07XG5cbi8qKlxuICogSGFzQ2xhc3NcbiAqIENoZWNrcyBmb3IgY2xhc3Mgb24gZWxlbWVudC5cbiAqIEBjbCB7c3RyaW5nfSBOYW1lcy4gWW91IGNhbiBzcGxpdCB0aGUgbmFtZXMgd2l0aCBhIHNwYWNlXG4gKiBAZSB7RE9NIEVsZW1lbnR9IEVsZW1lbnRcbiAqL1xudXRpbGl0aWVzLmhhc0NsYXNzID0gZnVuY3Rpb24gKGNsLCBlKSB7XG5cbiAgdmFyIGMsIGNsYXNzZXMsIGksIGosIGxlbiwgbGVuMTtcbiAgY2xhc3NlcyA9IGNsLnNwbGl0KCcgJyk7XG5cbiAgaWYgKGUuY2xhc3NMaXN0KSB7XG4gICAgZm9yIChpID0gMCwgbGVuID0gY2xhc3Nlcy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgYyA9IGNsYXNzZXNbaV07XG4gICAgICBpZiAoZS5jbGFzc0xpc3QuY29udGFpbnMoYykgPT09IHRydWUpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIGZvciAoaiA9IDAsIGxlbjEgPSBjbGFzc2VzLmxlbmd0aDsgaiA8IGxlbjE7IGorKykge1xuICAgICAgYyA9IGNsYXNzZXNbal07XG4gICAgICBpZiAobmV3IFJlZ0V4cCgnKF58ICknICsgYyArICcoIHwkKScsICdnaScpLnRlc3QoZS5jKSkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXR1cm4gZmFsc2U7XG59O1xuXG4vKipcbiAqIFJlbW92ZUNsYXNzXG4gKiBSZW1vdmUgY2xhc3MgZnJvbSBlbGVtZW50LlxuICogQGMge3N0cmluZ30gbmFtZSBvZiB0aGUgY2xhc3NcbiAqIEBlIHtET00gRWxlbWVudH0gRWxlbWVudFxuICovXG51dGlsaXRpZXMucmVtb3ZlQ2xhc3MgPSBmdW5jdGlvbiAoYywgZSkge1xuXG4gIHZhciBjbGFzc2VzLCBpLCBqLCBsZW4sIGxlbjE7XG4gIGNsYXNzZXMgPSBjLnNwbGl0KCcgJyk7XG4gIGlmIChlLmNsYXNzTGlzdCkge1xuICAgIGZvciAoaSA9IDAsIGxlbiA9IGNsYXNzZXMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgIGMgPSBjbGFzc2VzW2ldO1xuICAgICAgZS5jbGFzc0xpc3QucmVtb3ZlKGMpO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBmb3IgKGogPSAwLCBsZW4xID0gY2xhc3Nlcy5sZW5ndGg7IGogPCBsZW4xOyBqKyspIHtcbiAgICAgIGMgPSBjbGFzc2VzW2pdO1xuICAgICAgZS5jbGFzc05hbWUgPSBlLmNsYXNzTmFtZS5yZXBsYWNlKG5ldyBSZWdFeHAoJyhefFxcXFxiKScgKyBjLnNwbGl0KCcgJykuam9pbignfCcpICsgJyhcXFxcYnwkKScsICdnaScpLCAnICcpO1xuICAgIH1cbiAgfVxufTtcblxuLyoqXG4gKiBBZGRDbGFzc1xuICogQWRkIGNsYXNzIHRvIGVsZW1lbnQuXG4gKiBAYyB7c3RyaW5nfSBOYW1lIG9mIHRoZSBjbGFzc1xuICogQGUge0RPTSBFbGVtZW50fSBFbGVtZW50XG4gKi9cbnV0aWxpdGllcy5hZGRDbGFzcyA9IGZ1bmN0aW9uIChjLCBlKSB7XG5cbiAgdmFyIGNsYXNzZXMsIGksIGosIGxlbiwgbGVuMTtcbiAgY2xhc3NlcyA9IGMuc3BsaXQoJyAnKTtcblxuICBpZiAoZS5jbGFzc0xpc3QpIHtcbiAgICBmb3IgKGkgPSAwLCBsZW4gPSBjbGFzc2VzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICBjID0gY2xhc3Nlc1tpXTtcbiAgICAgIGUuY2xhc3NMaXN0LmFkZChjKTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgZm9yIChqID0gMCwgbGVuMSA9IGNsYXNzZXMubGVuZ3RoOyBqIDwgbGVuMTsgaisrKSB7XG4gICAgICBjID0gY2xhc3Nlc1tqXTtcbiAgICAgIGUuY2xhc3NOYW1lICs9ICcgJyArIGM7XG4gICAgfVxuICB9XG59O1xuXG4vKipcbiAqIEdldFNpYmxpbmdzXG4gKiBHZXQgc2libGluZ3MgZnJvbSBlbGVtZW50XG4gKiBAZSB7RE9NIEVsZW1lbnR9IEVsZW1lbnRcbiAqIEByZXR1cm4gQXJyYXkgb2YgRE9NIEVsZW1lbnRzXG4gKi9cbnV0aWxpdGllcy5nZXRTaWJsaW5ncyA9IGZ1bmN0aW9uIChlKSB7XG5cbiAgcmV0dXJuIEFycmF5LnByb3RvdHlwZS5maWx0ZXIuY2FsbChlLnBhcmVudE5vZGUuY2hpbGRyZW4sIGZ1bmN0aW9uIChjaGlsZCkge1xuICAgIHJldHVybiBjaGlsZCAhPT0gZTtcbiAgfSk7XG59O1xuXG4vKipcbiAqIEZ1bmN0aW9uIHRvIG5vcm1hbGl6ZSB0aGUgc2VsY3RvciAnbWF0Y2hlc1NlbGVjdG9yJyBhY3Jvc3MgYnJvd3NlcnNcbiAqL1xudXRpbGl0aWVzLm1hdGNoZXMgPSBmdW5jdGlvbiAoKSB7XG5cbiAgdmFyIGRvYywgbWF0Y2hlcztcbiAgZG9jID0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50O1xuICBtYXRjaGVzID0gZG9jLm1hdGNoZXNTZWxlY3RvciB8fCBkb2Mud2Via2l0TWF0Y2hlc1NlbGVjdG9yIHx8IGRvYy5tb3pNYXRjaGVzU2VsZWN0b3IgfHwgZG9jLm9NYXRjaGVzU2VsZWN0b3IgfHwgZG9jLm1zTWF0Y2hlc1NlbGVjdG9yO1xuXG4gIHJldHVybiBtYXRjaGVzO1xufTtcblxuLyoqXG4gKiBFeHRlbmRcbiAqIFNpbWlsYXIgdG8ganF1ZXJ5LmV4dGVuZCwgaXQgYXBwZW5kcyB0aGUgcHJvcGVydGllcyBmcm9tICdvcHRpb25zJyB0byBkZWZhdWx0IGFuZCBvdmVyd3JpdGUgdGhlIG9uZXMgdGhhdCBhbHJlYWR5IGV4aXN0IGluICdkZWZhdWx0cydcbiAqIEBkZWZhdWx0cyB7T2JqZWN0fSBEZWZhdWx0IHZhbHVlc1xuICogQG9wdGlvbnMge09iamVjdH0gTmV3IHZhbHVlc1xuICovXG51dGlsaXRpZXMuZXh0ZW5kID0gZnVuY3Rpb24gKGRlZmF1bHRzLCBvcHRpb25zKSB7XG5cbiAgdmFyIGV4dGVuZGVkID0ge30sXG4gICAgICBrZXkgPSBudWxsO1xuXG4gIGZvciAoa2V5IGluIGRlZmF1bHRzKSB7XG4gICAgaWYgKGRlZmF1bHRzLmhhc093blByb3BlcnR5KGtleSkpIGV4dGVuZGVkW2tleV0gPSBkZWZhdWx0c1trZXldO1xuICB9XG5cbiAgZm9yIChrZXkgaW4gb3B0aW9ucykge1xuICAgIGlmIChvcHRpb25zLmhhc093blByb3BlcnR5KGtleSkpIGV4dGVuZGVkW2tleV0gPSBvcHRpb25zW2tleV07XG4gIH1cblxuICByZXR1cm4gZXh0ZW5kZWQ7XG59O1xuXG4vKipcbiAqIFJldHVybnMgdGhlIENTUyBzZWxlY3RvciBmb3IgYSBwcm92aWRlZCBlbGVtZW50XG4gKlxuICogQHN0YXRpY1xuICogQHBhcmFtICB7RE9NRWxlbWVudH0gICBlbCAgICAgICAgIFRoZSBET00gbm9kZSB0byBmaW5kIGEgc2VsZWN0b3IgZm9yXG4gKiBAcmV0dXJuIHtTdHJpbmd9ICAgICAgICAgICAgICAgICAgVGhlIENTUyBzZWxlY3RvciB0aGUgZGVzY3JpYmVzIGV4YWN0bHkgd2hlcmUgdG8gZmluZCB0aGUgZWxlbWVudFxuICovXG51dGlsaXRpZXMuZ2V0U2VsZWN0b3JGb3JFbGVtZW50ID0gZnVuY3Rpb24gKGVsKSB7XG4gIHZhciBwYXJ0aWNsZXMgPSBbXTtcbiAgd2hpbGUgKGVsLnBhcmVudE5vZGUpIHtcbiAgICBpZiAoZWwuaWQpIHtcbiAgICAgIHBhcnRpY2xlcy51bnNoaWZ0KCcjJyArIGVsLmlkKTtcbiAgICAgIGJyZWFrO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoZWwgPT0gZWwub3duZXJEb2N1bWVudC5kb2N1bWVudEVsZW1lbnQpIHBhcnRpY2xlcy51bnNoaWZ0KGVsLnRhZ05hbWUpO2Vsc2Uge1xuICAgICAgICBmb3IgKHZhciBjID0gMSwgZSA9IGVsOyBlLnByZXZpb3VzRWxlbWVudFNpYmxpbmc7IGUgPSBlLnByZXZpb3VzRWxlbWVudFNpYmxpbmcsIGMrKykge31cbiAgICAgICAgcGFydGljbGVzLnVuc2hpZnQoZWwudGFnTmFtZSArIFwiOm50aC1jaGlsZChcIiArIGMgKyBcIilcIik7XG4gICAgICB9XG4gICAgICBlbCA9IGVsLnBhcmVudE5vZGU7XG4gICAgfVxuICB9XG4gIHJldHVybiBwYXJ0aWNsZXMuam9pbihcIiA+IFwiKTtcbn07XG5cbmV4cG9ydHMuZGVmYXVsdCA9IHV0aWxpdGllczsiLCJcbi8qKlxuICogVGhpcyBtb2R1bGUgUHJvdmlkZXMgYW5pbWF0aW9uIGRldGVjdGlvbiBhbmQgcHNldWRvLWxpc3RlbmVyIGZ1bmN0aW9uYWxpdHlcbiAqXG4gKiBAbW9kdWxlIHd0Yy1BbmltYXRpb25FdmVudHNcbiAqIEBleHBvcnRzIEFuaW1hdGlvblxuICovXG5cblxuLyoqXG4gKiBUaGlzIGZ1bmN0aW9uIHRha2VzIGEgbm9kZSBhbmQgZGV0ZXJtaW5lcyB0aGUgZnVsbCBlbmQgdGltZSBvZiBhbnkgdHJhbnNpdGlvbnNcbiAqIG9uIGl0LiBSZXR1cm5zIHRoZSB0aW1lIGluIG1pbGxpc2Vjb25kcy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtICAge0hUTUxFbGVtZW50fSBub2RlICBUaGUgbm9kZSBvIGRldGV4dCB0aGUgdHJhbnNpdGlvbiB0aW1lIGZvci5cbiAqIEByZXR1cm4gIHtOdW1iZXJ9ICAgICAgICAgICAgVGhlIGZ1bGwgdHJhbnNpdGlvbiB0aW1lIGZvciB0aGUgbm9kZSwgaW5jbHVkaW5nIGRlbGF5cywgaW4gbWlsbGlzZWNvbmRzXG4gKi9cbnZhciBkZXRlY3RBbmltYXRpb25FbmRUaW1lID0gZnVuY3Rpb24obm9kZSlcbntcbiAgdmFyIGZ1bGx0aW1lID0gMDtcbiAgdmFyIHRpbWVSZWdleCA9IC8oXFxkK1xcLj8oXFxkKyk/KShzfG1zKS87XG4gIHZhciByZWN1cnNpdmVMb29wID0gZnVuY3Rpb24oZWwpIHtcbiAgICBpZihlbCBpbnN0YW5jZW9mIEVsZW1lbnQpIHtcbiAgICAgIHZhciB0aW1lYnJlYWtkb3duID0gdGltZVJlZ2V4LmV4ZWMod2luZG93LmdldENvbXB1dGVkU3R5bGUoZWwpLnRyYW5zaXRpb25EdXJhdGlvbilcbiAgICAgIHZhciBkZWxheWJyZWFrZG93biA9IHRpbWVSZWdleC5leGVjKHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGVsKS50cmFuc2l0aW9uRGVsYXkpXG4gICAgICB2YXIgdGltZSA9IHRpbWVicmVha2Rvd25bMV0gKiAodGltZWJyZWFrZG93blszXSA9PSAncycgPyAxMDAwIDogMSlcbiAgICAgIHZhciBkZWxheSA9IGRlbGF5YnJlYWtkb3duWzFdICogKGRlbGF5YnJlYWtkb3duWzNdID09ICdzJyA/IDEwMDAgOiAxKVxuICAgICAgaWYodGltZSArIGRlbGF5ID4gZnVsbHRpbWUpIHtcbiAgICAgICAgZnVsbHRpbWUgPSB0aW1lICsgZGVsYXlcbiAgICAgIH1cbiAgICB9XG4gICAgaWYoZWwuY2hpbGROb2Rlcykge1xuICAgICAgZm9yKHZhciBpIGluIGVsLmNoaWxkTm9kZXMpIHtcbiAgICAgICAgcmVjdXJzaXZlTG9vcChlbC5jaGlsZE5vZGVzW2ldKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZWN1cnNpdmVMb29wKG5vZGUpO1xuXG4gIGlmKHR5cGVvZiBmdWxsdGltZSAhPT0gJ251bWJlcicpIHtcbiAgICBmdWxsdGltZSA9IDA7XG4gIH1cblxuICByZXR1cm4gZnVsbHRpbWU7XG59XG5cbi8qKlxuICogVGhlIHJlc29sdmluZyBvYmplY3QgZm9yIHRoZSB7QGxpbmsgd3RjLUFuaW1hdGlvbkV2ZW50cy5hZGRFbmRFdmVudExpc3RlbmVyfVxuICpcbiAqIEBjYWxsYmFjayB0aW1lclJlc29sdmVcbiAqIEBwYXJhbSB7c3RyaW5nfSByZXNwb25zZSAgICAgICAgICAgVGhlIHJlc3BvbnNlIGZyb20gdGhlIEFKQVggY2FsbFxuICogQHBhcmFtIHthcnJheX0gYXJndW1lbnRzICAgICAgICAgICBUaGUgYXJndW1lbnRzIGFycmF5IG9yaWdpbmFsbHkgcGFzc2VkIHRvIHRoZSB7QGxpbmsgQUpBWC5hamF4R2V0fSBtZXRob2RcbiAqIEBwYXJhbSB7RE9NRWxlbWVudH0gbGlua1RhcmdldCAgICAgVGhlIHRhcmdldCBlbGVtZW50IHRoYXQgZmlyZWQgdGhlIHtAbGluayBBSkFYLmFqYXhHZXR9XG4gKi9cblxuLyoqXG4gKiBBbGxvd3MgdXMgdG8gYWRkIGFuIGVuZCBldmVudCBsaXN0ZW5lciB0byB0aGUgbm9kZS5cbiAqXG4gKiBAcGFyYW0gIHtIVE1MRWxlbWVudH0gIG5vZGUgICAgICBUaGUgZWxlbWVudCB0byBhdHRhY2ggdGhlIGVuZCBldmVudCBsaXN0ZW5lciB0b1xuICogQHBhcmFtICB7ZnVuY3Rpb259ICAgICBsaXN0ZW5lciAgVGhlIGZ1bmN0aW9uIHRvIHJ1biB3aGVuIHRoZSBhbmltYXRpb24gaXMgZmluaXNoZWQuIFRoaXMgYWxsb3dzIHVzIHRvIGNvbnN0cnVjdCBhbiBvYmplY3QgdG8gcGFzcyBiYWNrIHRocm91Z2ggdGhlIHByb21pc2UgY2hhaW4gb2YgdGhlIHBhcmVudC5cbiAqIEByZXR1cm4ge1Byb21pc2V9ICAgICAgICAgICAgICAgIEEgcHJvbWlzZSB0aGF0IHJlcHJlc2VudHMgdGhlIGFuaW1hdGlvbiB0aW1lb3V0LlxuICogQHJldHVybiB7dGltZXJSZXNvbHZlfSAgICAgICAgICAgVGhlIHJlc29sdmUgbWV0aG9kLiBQYXNzZXMgdGhlIGNvZXJjZWQgdmFyaWFibGVzIChpZiBhbnkpIGZyb20gdGhlIGxpc3RlbmluZyBvYmplY3QgYmFjayB0byB0aGUgY2hhaW4uXG4gKiBAcmV0dXJuIHt0aW1lclJlamVjdH0gICAgICAgICAgICBUaGUgcmVqZWN0IG1ldGhvZC4gTnVsbC5cbiAqL1xudmFyIGFkZEVuZEV2ZW50TGlzdGVuZXIgPSBmdW5jdGlvbihub2RlLCBsaXN0ZW5lcikge1xuICBpZih0eXBlb2YgbGlzdGVuZXIgIT09ICdmdW5jdGlvbicpXG4gIHtcbiAgICB2YXIgbGlzdGVuZXIgPSBmdW5jdGlvbigpeyByZXR1cm4ge30gfTtcbiAgfVxuICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgdmFyIHRpbWUgPSBkZXRlY3RBbmltYXRpb25FbmRUaW1lKG5vZGUpO1xuICAgIHZhciB0aW1lb3V0ID0gc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgIHZhciByZXR1cm5lciA9IGxpc3RlbmVyKCk7XG4gICAgICByZXR1cm5lci50aW1lID0gdGltZTtcbiAgICAgIHJlc29sdmUocmV0dXJuZXIpO1xuICAgIH0sIHRpbWUpO1xuICB9KTtcbn1cblxuLyoqXG4gKiBUaGUgYW5pbWF0aW9uIG9iamVjdCBlbmNhcHN1bGF0ZXMgYWxsIG9mIHRoZSBiYXNpYyBmdW5jdGlvbmFsaXR5IHRoYXQgYWxsb3dzIHVzXG4gKiB0byBkZXRlY3QgYW5pbWF0aW9uIGV0Yy5cbiAqXG4gKiBAZXhwb3J0XG4gKi9cbnZhciBBbmltYXRpb24gPSB7XG4gIGFkZEVuZEV2ZW50TGlzdGVuZXI6IGFkZEVuZEV2ZW50TGlzdGVuZXJcbn07XG5cblxuZXhwb3J0IGRlZmF1bHQgQW5pbWF0aW9uO1xuIiwiaW1wb3J0IEhpc3RvcnkgZnJvbSBcIi4vd3RjLWhpc3RvcnlcIjtcbmltcG9ydCBBbmltYXRpb24gZnJvbSBcIi4vd3RjLUFuaW1hdGlvbkV2ZW50c1wiO1xuaW1wb3J0IF91IGZyb20gJ3d0Yy11dGlsaXR5LWhlbHBlcnMnO1xuXG5jb25zdCBTVEFURVMgPSB7XG4gICdPSycgICAgICAgICAgICAgICAgOiAwLFxuICAnQ0xJQ0tFRCcgICAgICAgICAgIDogMSxcbiAgJ0xPQURJTkcnICAgICAgICAgICA6IDIsXG4gICdUUkFOU0lUSU9OSU5HJyAgICAgOiA0LFxuICAnTE9BREVEJyAgICAgICAgICAgIDogOFxufVxuXG5jb25zdCBTRUxFQ1RPUlMgPSB7XG4gICdDSElMRFJFTicgICAgICAgICAgOiAwIC8vIFRoaXMgaW5kaWNhdGVzIHRoYXQgdGhlIHNlbGVjdGlvbiBzaG91bGQgYmUgYWxsIGNoaWxkcmVuLiBUaGlzIGFzc3VtZXMgdGhhdCB3ZSBoYXZlIGEgdmFsaWQgdGFyZ2V0IHRvIHdvcmsgd2l0aC5cbn1cblxuY29uc3QgRVJST1JTID0ge1xuICAnR0VORVJJQ19FUlJPUicgICAgIDogMCxcbiAgJ0JBRF9QUk9NSVNFJyAgICAgICA6IDEsXG4gICdMT0FEX0VSUk9SJyAgICAgICAgOiAyXG59XG5cbi8qKlxuICogQW4gQUpBWCBjbGFzcyB0aGF0IHBpY2tzIHVwIG9uIGxpbmtzIGFuZCB0dXJucyB0aGVtIGludG8gQUpBWCBsaW5rcy5cbiAqXG4gKiBUaGlzIGNsYXNzIGFzc3VtZXMgdGhhdCB5b3Ugd2FudCB0byBydW4geW91ciBBSkFYIHZpYSBodG1sIGF0dHJpYnV0ZXMgb24geW91ciBsaW5rc1xuICogYW5kIHRoYXQgeW91ciB3ZWJzaXRlIGNhbiBydW4ganVzdCBhcyB3ZWxsIHdpdGhvdXQgdGhlc2UgbGlua3MuIEl0IHNob3VsZCBhbHNvXG4gKiBwcm92aWRlIGFkZGl0aW9uYWwgZnVuY3Rpb25hbGl0eSB0aGF0IGFsbG93cyB0aGUgY2xhc3MgdG8gcnVuIHByb2dyYW1hdGljYWxseSxcbiAqIHRoZXJlYnkgZ2l2aW5nIHRoZSBwcm9ncmFtbWVyIHRoZSBhYmlsaXR5IGFuZCBvcHRpb25zIHRvIGNyZWF0ZSB0aGUgd2Vic290ZVxuICogaG93ZXZlciB0aGV5IHdhbnQgdG8uXG4gKlxuICogQHN0YXRpY1xuICogQG5hbWVzcGFjZVxuICogQGV4dGVuZHMgSGlzdG9yeVxuICogQGF1dGhvciBMaWFtIEVnYW4gPGxpYW1Ad2V0aGVjb2xsZWN0aXZlLmNvbT5cbiAqIEB2ZXJzaW9uIDAuNVxuICogQGNyZWF0ZWQgTm92IDE5LCAyMDE2XG4gKi9cbmNsYXNzIEFKQVggZXh0ZW5kcyBIaXN0b3J5IHtcblxuICAvKipcbiAgICogUHVibGljIG1ldGhvZHNcbiAgICovXG5cbiAgLyoqXG4gICAqIEluaXRpYWxpc2UgdGhlIGxpbmtzIGluIHRoZSBkb2N1bWVudC5cbiAgICpcbiAgICogVGhpcyB3aWxsIGxvb2sgdGhyb3VnaCB0aGUgbGlua3MgaW4gdGhlIGRvY3VtZW50IGFzIGRlbm90ZWQgYnkgdGhlIGF0dHJpYnV0ZUFqYXhcbiAgICogcHJvcGVydHkgYW5kIGFwcGx5IGEgY2xpY2sgbGlzdGVuZXIgdG8gaXQgdGhhdCB3aWxsIGF0dGVtcHQgdG8gZGV0ZXJtaW5lIHdoYXRcbiAgICogYW5kIGhvdyB0byBsb2FkLlxuICAgKlxuICAgKiBBIHNpbXBsZSBtZWNoYW5zaW0gZm9yIHRoaXMgd291bGQgYmUgc29tZXRoaW5nIGxpa2U6XG4gICAqIGBgYFxuICAgICA8YSBocmVmPVwicGFnZTEuaHRtbFwiXG4gICAgICAgIGRhdGEtd3RjLWFqYXg9XCJ0cnVlXCJcbiAgICAgICAgZGF0YS13dGMtYWpheC10YXJnZXQ9JyNsaW5rMi10YXJnZXQnXG4gICAgICAgIGRhdGEtd3RjLWFqYXgtc2VsZWN0aW9uPVwiLmxpbmsxLXNlbGVjdGlvblwiXG4gICAgICAgIGRhdGEtd3RjLWFqYXgtc2hvdWxkLW5hdmlnYXRlPVwiZmFsc2VcIj5MaW5rIDE8L2E+XG4gICAqIGBgYFxuICAgKlxuICAgKiBUaGUgYWR0cmlidXRlcyBlcXVhdGUgYXMgZm9sbG93czpcbiAgICogLSAoKmF0dHJpYnV0ZUFqYXgqKSAqKmRhdGEtd3RjLWFqYXgqKlxuICAgKlxuICAgKiAgICBEZW5vdGVzIHRoYXQgdGhpcyBsaW5rIGlzIGFuIEFKQVggbGluay5cbiAgICogLSAoKmF0dHJpYnV0ZVRhcmdldCopICoqZGF0YS13dGMtYWpheC10YXJnZXQqKlxuICAgKlxuICAgKiAgICBEZW5vdGVzIHRoZSB0YXJnZXQgaW50byB3aGljaCB0byBsb2FkIHRoZSByZXN1bHQuIFNob3VsZCB0YWtlIHRoZSBmb3JtIG9mIGEgc2VsZWN0b3IuXG4gICAqIC0gKCphdHRyaWJ1dGVTZWxlY3Rpb24qKSAqKmRhdGEtd3RjLWFqYXgtc2VsZWN0aW9uKipcbiAgICpcbiAgICogICAgRGVub3RlcyB0aGUgc2VsZWN0aW9uIG9mIGRhdGEgdG8gcHVsbCBmcm9tIHRoZSBsb2FkZWQgZG9jdW1lbnQuIFNob3VsZCB0YWtlIHRoZSBmb3JtIG9mIGEgc2VsZWN0b3IuXG4gICAqIC0gKCphdHRyaWJ1dGVTaG91bGROYXZpZ2F0ZSopICoqZGF0YS13dGMtYWpheC1zaG91bGQtbmF2aWdhdGUqKlxuICAgKlxuICAgKiAgICAqKlRydWUqKiAvIEZhbHNlIGFzIHRvIHdoZXRoZXIgdGhlIGxpbmsgc2hvdWxkIHVwZGF0ZSB0aGUgaGlzdG9yeSBvYmplY3QuIE9ubHkgbmVjZXNzYXJ5IGlmIGZhbHNlLlxuICAgKlxuICAgKiBJbiBhZGRpdGlvbiwgKmF0dHJpYnV0ZVRhcmdldCogYW5kICphdHRyaWJ1dGVTZWxlY3Rpb24qIGFjY2VwdCBiYXNpYyBKU09OIHN5bnRheFxuICAgKiBzbyB0aGF0IHlvdSBjYW4gbG9hZCBtb2x0aXBsZSBwaWVjZXMgb2YgY29udGVudCBmcm9tIHRoZSBzb3VyY2UuXG4gICAqXG4gICAqIEBzdGF0aWNcbiAgICogQHBhcmFtICB7RE9NRWxlbWVudH0gcm9vdERvY3VtZW50ICBUaGUgRE9NIGVsZW1lbnQgdG8gZmluZCBsaW5rcyBpbi4gRGVmYXVsdHMgdG8gYm9keS5cbiAgICovXG4gIHN0YXRpYyBpbml0TGlua3Mocm9vdERvY3VtZW50ID0gZG9jdW1lbnQuYm9keSkge1xuICAgIGNvbnN0IGxpbmtzID0gcm9vdERvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoYFske3RoaXMuYXR0cmlidXRlQWpheH09XCJ0cnVlXCJdYCk7XG5cbiAgICBsaW5rcy5mb3JFYWNoKChsaW5rKT0+IHtcbiAgICAgIC8vIFJlbW92aW5nIHRoaXMgYXR0cmlidXRlIGVuc3VyZXMgdGhhdCB0aGlzIGxpbmsgZG9lc24ndCBnZXQgYSBzZWNvbmQgQUpBWCBsaXN0ZW5lciBhdHRhY2hlZCB0byBpdC5cbiAgICAgIGxpbmsucmVtb3ZlQXR0cmlidXRlKHRoaXMuYXR0cmlidXRlQWpheCk7XG5cbiAgICAgIGxpbmsuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZSk9PiB7XG4gICAgICAgIHRoaXMuX3RyaWdnZXJBamF4TGluayhlKTtcblxuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICB9KTtcbiAgICAgIGNvbnNvbGUubG9nKGxpbmspO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoZSByZXNvbHZpbmcgb2JqZWN0LiBUaGlzIGlzIHRoZSBvYmplY3QgdGhhdCBpcyBwYXNzZWQgdG8gQUpBWCBHRVQgcHJvbWlzZSB0aGVuc1xuICAgKiBhbmQgc2hvdWxkIGJlIHBhc3NlZCBvbnRvIHN1YnNlcXVlbnQgVEhFTmFibGUgY2FsbHMuXG4gICAqXG4gICAqIEB0eXBlZGVmIHtPYmplY3R9ICAgICAgICAgICAgICAgICAgICAgQUpBWEdldFJlc29sdmVyXG4gICAqIEBwcm9wZXJ0eSB7c3RyaW5nfSAgICAgICByZXNwb25zZSAgICAgVGhlIHJlc3BvbnNlIGZyb20gdGhlIEFKQVggY2FsbFxuICAgKiBAcHJvcGVydHkge0FKQVhEb2N1bWVudH0gZG9jdW1lbnQgICAgIFRoZSBkb2N1bWVudCBub2RlcyByZXN1bHRpbmcgZnJvbSB0aGlzIGNhbGwuXG4gICAqIEBwcm9wZXJ0eSB7YXJyYXl9ICAgICAgICBhcmd1bWVudHMgICAgVGhlIGFyZ3VtZW50cyBhcnJheSBvcmlnaW5hbGx5IHBhc3NlZCB0byB0aGUge0BsaW5rIEFKQVguYWpheEdldH0gbWV0aG9kXG4gICAqIEBwcm9wZXJ0eSB7RE9NRWxlbWVudH0gICBsaW5rVGFyZ2V0ICAgVGhlIHRhcmdldCBlbGVtZW50IHRoYXQgZmlyZWQgdGhlIHtAbGluayBBSkFYLmFqYXhHZXR9XG4gICAqL1xuICAvKipcbiAgICogVGhpcyBpcyB0aGUgb3V0cHV0IG9mIGFsbCBldmVudHVhbCBBSkFYIGNhbGxzLiBUaGlzIG9iamVjdCByZXByZXNlbnRzIHRoZSByZXN1bHRcbiAgICogb2YgdGhlIEFKQVggY2FsbCBhbmQgY29udGFpbnMgYm90aCB0aGUgZnVsbCBIVE1MIGRvY3VtZW50IGFuZCB0aGUgc2VsZWN0ZWQgc3ViZG9jLlxuICAgKlxuICAgKiBAdHlwZWRlZiB7T2JqZWN0fSAgICAgICAgICAgICAgQUpBWERvY3VtZW50XG4gICAqIEBwcm9wZXJ0eSB7RE9NRWxlbWVudH0gZG9jICAgICBUaGUgZnVsbCBkb2N1bWVudCBub2RlIGZvciB0aGUgQUpBWCBHRVQgcmVzdWx0XG4gICAqIEBwcm9wZXJ0eSB7Tm9kZUxpc3R9ICAgc3ViZG9jICBUaGUgc3ViZG9jdW1lbnQgZGVyaXZlZCBmcm9tIHRoZSBtYWluIGRvY3VtZW50XG4gICAqL1xuICAvKipcbiAgICogQ2FsbGJhY2sgZm9yIEFKQVggR0VUIG9ubG9hZC4gVGhpcyBpcyBjYWxsZWQgd2hlbiB0aGUgY29udGVudCBpcyBsb2FkZWQuXG4gICAqXG4gICAqIEBjYWxsYmFjayBsb2FkUmVzb2x2ZVxuICAgKiBAcGFyYW0ge0FKQVhHZXRSZXNvbHZlcn0gcmVzb2x2ZXIgIFRoZSByZXNvbHZpbmcgb2JqZWN0IGZvciB0aGUgQUpBWCByZXF1ZXN0XG4gICAqIEByZXR1cm4ge0FKQVhHZXRSZXNvbHZlcn0gICAgICAgICAgVGhlIG9uZ29pbmcgcmVzb2x2aW5nIG9iamVjdCBmb3IgdGhlIEFKQVggcmVxdWVzdFxuICAgKi9cbiAgLyoqXG4gICAqIENhbGxiYWNrIGZvciBBSkFYIEdFVCBlcnJvci4gVGhpcyBpcyBjYWxsZWQgd2hlbiBhbiBlcnJvciBvY2N1cnMgYWZ0ZXJcbiAgICogY2FsbGluZyBhbiBhamF4IEdFVC5cbiAgICpcbiAgICogQGNhbGxiYWNrIGxvYWRSZWplY3RcbiAgICogQHBhcmFtIHtvYmplY3R9IGVycm9yICAgICAgICAgICAgICBUaGUgZXJyb3IgdGhhdCBvY2N1cnJlZFxuICAgKiBAcGFyYW0ge2FycmF5fSBhcmdzICAgICAgICAgICAgICAgIFRoZSBhcmd1bWVudHMgdGhhdCB3ZXJlIHBhc3NlZCB0byB0aGUgcmVxdWVzdFxuICAgKiBAcGFyYW0ge0RPTUVsZW1lbnR9IFt0YXJnZXRMaW5rXSAgIFRoZSBsaW5rIHRoYXQgc3Bhd25lZCB0aGUgYWpheCByZXF1ZXN0XG4gICAqL1xuXG4gIC8qKlxuICAgKiBUaGlzIGJ1aWxkcyBvdXQgYW4gQUpBWCByZXF1ZXN0LCBub3JtYWxseSBiYXNlZCBvbiB0aGUgY2xpY2tpbmcgb2YgYSBsaW5rLFxuICAgKiBidXQgaXQgY2FuIGFsdGVybmF0aXZlbHkgYmUgY2FsbGVkIGRpcmVjdGx5IG9uIHRoZSBBSkFYIG9iamVjdC5cbiAgICpcbiAgICogQHN0YXRpY1xuICAgKiBAcGFyYW0gIHtzdHJpbmd9IFVSTCAgICAgICAgICAgICAgICAgICAgIFRoZSBVUkwgdG8gZ2V0LiBUaGlzIHdpbGwgYmUgcGFyc2VkIGludG8gYW4gYXBwcm9wcmlhdGUgZm9tYXQgYnkgdGhlIG9iamVjdC5cbiAgICogQHBhcmFtICB7c3RyaW5nfSB0YXJnZXQgICAgICAgICAgICAgICAgICBUaGUgdGFyZ2V0IGZvciB0aGUgbG9hZGVkIGNvbnRlbnQuIFRoaXMgY2FuIGJlIGEgc3RyaW5nIChzZWxlY3RvciksIG9yIGEgSlNPTiBhcnJheSBvZiBzZWxlY3RvciBzdHJpbmdzLlxuICAgKiBAcGFyYW0gIHtzdHJpbmd9IHNlbGVjdGlvbiAgICAgICAgICAgICAgIFRoaXMgaXMgYSBzZWxlY3RvciAob3IgSlNPTiBvZiBzZWxlY3RvcnMpIHRoYXQgZGV0ZXJtaW5lcyB3aGF0IHRvIGN1dCBmcm9tIHRoZSBsb2FkZWQgY29udGVudC5cbiAgICogQHBhcmFtICB7RE9NRWxlbWVudH0gW2xpbmtUYXJnZXRdICAgICAgICBUaGUgdGFyZ2V0IG9mIHRoZSBsaW5rLiBUaGlzIGlzIHVzZWZ1bCBmb3Igc2V0dGluZyBhY3RpdmUgc3RhdGVzIGluIGNhbGxiYWNrLlxuICAgKiBAcGFyYW0gIHtib29sZWFufSBmcm9tUG9wICAgICAgICAgICAgICAgIEluZGljYXRlcyB0aGF0IHRoaXMgR0VUIGlzIGZyb20gYSBwb3BcbiAgICogQHBhcmFtICB7b2JqZWN0fSBbZGF0YSA9IHt9XSAgICAgICAgICAgICBUaGUgZGF0YSB0byBwYXNzIHRvIHRoZSBBSkFYIGNhbGwuXG4gICAqIEByZXR1cm4ge1Byb21pc2V9ICAgICAgICAgICAgICAgICAgICAgICAgQSBwcm9taXNlIHRoYXQgcmVwcmVzZW50cyB0aGUgR0VULlxuICAgKiBAcmV0dXJuIHtsb2FkUmVzb2x2ZX0gICAgICAgICAgICAgICAgICAgIFRoZSByZXNvbHZlIG1ldGhvZC4gUGFzc2VzIHRoZSBsb2FkZWQgY29udGVudCBkb3duIHRocm91Z2ggaXQncyB0aGVuYWJsZXMsIGZpbmFsbHkgcmVzb2x2aW5nIHRvIHRoZSBwYXJzZSBjb21tZW5kIHZpYSBhIHNlY29uZCwgcHJpdmF0ZSBQcm9taXNlLlxuICAgKiBAcmV0dXJuIHtsb2FkUmVqZWN0fSAgICAgICAgICAgICAgICAgICAgIFRoZSByZWplY3QgbWV0aG9kLiBSZXN1bHRzIGluIGFuIGVycm9yXG4gICAqL1xuICBzdGF0aWMgYWpheEdldChVUkwsIHRhcmdldCwgc2VsZWN0aW9uLCBsaW5rVGFyZ2V0LCBmcm9tUG9wID0gZmFsc2UsIGRhdGEgPSB7fSkge1xuXG4gICAgLy8gU2V0IHRoZSBzdGF0ZSBvZiB0aGUgQUpBWCBjbGFzcyB0byBjbGlja2VkLCBpbmNpZGF0aW5nIHNvbWV0aGluZyBpcyBsb2FkaW5nXG4gICAgaWYoIHRoaXMuc3RhdGUgPiBTVEFURVMuQ0xJQ0tFRCApXG4gICAge1xuICAgICAgaWYoIHRoaXMuZGV2bW9kZSApXG4gICAgICB7XG4gICAgICAgIGNvbnNvbGUud2FybiggXCJUcmllZCBydW4gYW4gQUpBWCBHRVQgd2hlbiB0aGUgb2JqZWN0IHdhc24ndCBpbiBPSyBvciBDTElDS0VEIG1vZGVcIiApO1xuICAgICAgfVxuXG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gUmV0cmlldmUgYSByZXF1ZXN0IG9iamVjdCBhbmQgY29uc3RydWN0IGEgdmFsaWQgVVJMXG4gICAgY29uc3QgcmVxID0gdGhpcy5yZXF1ZXN0T2JqZWN0O1xuICAgIGNvbnN0IHBhcnNlZFVSTCA9IHRoaXMuX2ZpeFVSTChVUkwpO1xuICAgIGNvbnN0IERPTVRhcmdldCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwodGFyZ2V0KVswXTtcblxuICAgIHZhciByZWFkeVN0YXRlID0gMDtcbiAgICB2YXIgc3RhdHVzID0gMDtcbiAgICB2YXIgYXJncyA9IGFyZ3VtZW50cztcbiAgICB2YXIgdHJhbnNDbGFzcyA9IHRoaXMuY2xhc3NCYXNlVHJhbnNpdGlvbjtcblxuICAgIGxldCB0cmFuc2l0aW9uUnVuID0gZmFsc2U7XG4gICAgbGV0IGxvYWRSdW4gPSBmYWxzZTtcbiAgICBsZXQgcmVzb2x2ZXIgPSBudWxsO1xuXG4gICAgLy8gQHRvZG8gbmVlZCB0byBhZGQgcHJvcGVyIGVycm9yIGNoZWNraW5nIGhlcmUuXG5cbiAgICAvLyBNb2RpZnkgdGhlIGNsYXNzZXMgb24gdGhlIGNvbnRhaW5pbmcgZWxlbWVudFxuICAgIF91LnJlbW92ZUNsYXNzKHRyYW5zQ2xhc3MrJy1pbicsIERPTVRhcmdldCk7XG4gICAgX3UucmVtb3ZlQ2xhc3ModHJhbnNDbGFzcysnLWluLXN0YXJ0JywgRE9NVGFyZ2V0KTtcbiAgICBfdS5yZW1vdmVDbGFzcyh0cmFuc0NsYXNzKyctaW4tZW5kJywgRE9NVGFyZ2V0KTtcbiAgICBfdS5yZW1vdmVDbGFzcyh0cmFuc0NsYXNzKyctaW4tZmluaXNoJywgRE9NVGFyZ2V0KTtcbiAgICBfdS5hZGRDbGFzcyh0cmFuc0NsYXNzKyctb3V0LXN0YXJ0JywgRE9NVGFyZ2V0KTtcbiAgICBfdS5hZGRDbGFzcyh0cmFuc0NsYXNzKyctb3V0JywgRE9NVGFyZ2V0KTtcbiAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgX3UuYWRkQ2xhc3ModHJhbnNDbGFzcysnLW91dC1lbmQnLCBET01UYXJnZXQpO1xuICAgIH0sIDApXG4gICAgLy8gQWRkIHRoZSBhbmltYXRpb24gZW5kIGxpc3RlbmVyIHRvIHRoZSB0YXJnZXQgbm9kZVxuICAgIC8vIFRoaXMganVzdCBzZXRzIHRyYW5zaXRpb24gcnVuIHRvIHRydWVcbiAgICBBbmltYXRpb24uXG4gICAgICBhZGRFbmRFdmVudExpc3RlbmVyKERPTVRhcmdldCkuXG4gICAgICB0aGVuKGZ1bmN0aW9uKCkge1xuICAgICAgICB0cmFuc2l0aW9uUnVuID0gdHJ1ZTtcbiAgICAgIH0pO1xuXG4gICAgdmFyIHJlcXVlc3RQcm9taXNlID0gbmV3IFByb21pc2UoZnVuY3Rpb24gaGFuZGxlcihyZXNvbHZlLCByZWplY3QpIHtcblxuICAgICAgLy8gTGlzdGVuIGZvciB0aGUgcmVhZHkgc3RhdGVcbiAgICAgIHJlcS5hZGRFdmVudExpc3RlbmVyKCdyZWFkeXN0YXRlY2hhbmdlJywgKGUpID0+IHtcbiAgICAgICAgcmVhZHlTdGF0ZSA9IGUudGFyZ2V0LnJlYWR5U3RhdGU7XG4gICAgICAgIHN0YXR1cyA9IGUudGFyZ2V0LnN0YXR1cztcbiAgICAgIH0pO1xuXG4gICAgICAvLyBMaXN0ZW0gZm9yIHRoZSBsb2FkIGV2ZW50XG4gICAgICByZXEuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsIChlKSA9PiB7XG4gICAgICAgIC8vIElmIHdlIGhhdmUgYSByZWFkeSBzdGF0ZSB0aGF0IGluZGljYXRlZCB0aGF0IHRoZSBsb2FkIHdhcyBhIHN1Y2Nlc3MsIGNvbnRpbnVlXG4gICAgICAgIGlmKCByZXEuc3RhdHVzID49IDIwMCAmJiByZXEuc3RhdHVzIDwgNDAwICkge1xuICAgICAgICAgIC8vIEdldCB0aGUgcmVxdWVzdCByZXNwb25zZSB0ZXh0XG4gICAgICAgICAgdmFyIHJlc3BvbnNlVGV4dCA9IHJlcS5yZXNwb25zZVRleHRcbiAgICAgICAgICAvLyBHZXQgdGhlIEFKQVhEb2N1bWVudFxuICAgICAgICAgIHZhciBBSkFYRG9jdW1lbnQgPSB0aGlzLl9wYXJzZVJlc3BvbnNlKHJlc3BvbnNlVGV4dCwgdGFyZ2V0LCBzZWxlY3Rpb24sIGZyb21Qb3AsIGxpbmtUYXJnZXQpXG4gICAgICAgICAgLy8gQnVpbGQgdGhlIHJlc29sdmVyXG4gICAgICAgICAgdmFyIHJlc29sdmVyID0ge1xuICAgICAgICAgICAgcmVzcG9uc2VUZXh0OiByZXNwb25zZVRleHQsXG4gICAgICAgICAgICBkb2N1bWVudDogQUpBWERvY3VtZW50LFxuICAgICAgICAgICAgYXJndW1lbnRzOiBhcmdzLFxuICAgICAgICAgICAgbGlua1RhcmdldDogbGlua1RhcmdldCB8fCBudWxsLFxuICAgICAgICAgICAgRE9NVGFyZ2V0OiBET01UYXJnZXRcbiAgICAgICAgICB9XG4gICAgICAgICAgcmVzb2x2ZShyZXNvbHZlcik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmVqZWN0KEVSUk9SUy5MT0FEX0VSUk9SKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIHJlcS5hZGRFdmVudExpc3RlbmVyKCdlcnJvcicsIChlKSA9PiB7XG4gICAgICAgIHJlamVjdChFUlJPUlMuTE9BRF9FUlJPUik7XG4gICAgICB9KTtcbiAgICB9LmJpbmQodGhpcykpO1xuXG4gICAgLy8gVGhpcyBwcm9taXNlIHRha2VzIHRoZSByZXR1cm5lZCBwcm9taXNlIGFuZCBydW5zIHRoZSBlcXVpdmFsZW50IG9mIGEgXCJmaW5hbGx5XCJcbiAgICBQcm9taXNlLlxuICAgICAgcmVzb2x2ZShyZXF1ZXN0UHJvbWlzZSkuXG4gICAgICAvLyBUSEVOOiByZXNwb25zaWJsZSBmb3IgYWRkaW5nIHRoZSB0cmFuc2l0aW9uIGNsYXNzZXMsIHRoZW4gZmluZGluZyB0aGUgdHJhbnNpdGlvbiBsZW5ndGggYW5kIHJ1dGluZ2luZyB0aGUgcHJvbWlzZSBmcm9tIHRoYXRcbiAgICAgIHRoZW4oIGZ1bmN0aW9uKHJlc29sdmVyKSB7XG4gICAgICAgIGlmKHJlc29sdmVyLmVycm9yKSB7XG4gICAgICAgICAgdGhyb3cgcmVzb2x2ZXIuZXJyb3JcbiAgICAgICAgfSBlbHNlIGlmKCFyZXNvbHZlci5yZXNwb25zZVRleHQpIHtcbiAgICAgICAgICB0aHJvdyBFUlJPUlMuQkFEX1BST01JU0VcbiAgICAgICAgfSBlbHNlIHtcblxuICAgICAgICAgIC8vIGxvYWQgcnVuIGlzIGRvbmUsIHNvIHNldCB0aGUgdmFyaWFibGUgdG8gdHJ1ZVxuICAgICAgICAgIGxvYWRSdW4gPSB0cnVlO1xuXG4gICAgICAgICAgLy8gUmVzb2x2ZSBQcm9taXMgdG8gdGVzdCwgb24gaW50ZXJ2YWwsIHdoZXRoZXIgdGhlIHRyYW5zaXRpb24gaGFzXG4gICAgICAgICAgLy8gY29tcGxldGVkLiBXaGVuIGl0IGhhcywgcmVzb2x2ZSB0aGUgcHJvbWlzZS5cbiAgICAgICAgICBsZXQgcmVzb2x2ZSA9IG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICAgICAgbGV0IHRlc3RJbnRlcnZhbCA9IG51bGw7XG4gICAgICAgICAgICBsZXQgdGVzdFJlc29sdmVkID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgIGlmKHRyYW5zaXRpb25SdW4gPT09IHRydWUpXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAvLyBDbGVhciB0aGUgaW50ZXJ2YWxcbiAgICAgICAgICAgICAgICBjbGVhckludGVydmFsKHRlc3RJbnRlcnZhbCk7XG5cbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgcmVzb2x2ZShyZXNvbHZlcik7XG4gICAgICAgICAgICAgICAgfSwgdGhpcy5yZXNvbHZlVGltZW91dCk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0uYmluZCh0aGlzKVxuXG4gICAgICAgICAgICB0ZXN0SW50ZXJ2YWwgPSBzZXRJbnRlcnZhbCh0ZXN0UmVzb2x2ZWQsIDUwKTtcbiAgICAgICAgICB9LmJpbmQodGhpcykpO1xuXG4gICAgICAgICAgcmV0dXJuIHJlc29sdmU7XG4gICAgICAgIH1cbiAgICAgIH0uYmluZCh0aGlzKSkuXG4gICAgICAvLyBUSEVOOiByZXNwb25zaWJsZSBmb3IgYWRkaW5nIHRoZSBmaW5hbCBjb250ZW50IHRvIHRoZSBtYWluIGRvY3VtZW50LiBSZXR1cm5zIGEgcHJvbWlzZSB0aGF0IGlkZW50aWZpZXMgdGhlIHRyYW5zaXRpb25cbiAgICAgIHRoZW4oZnVuY3Rpb24ocmVzb2x2ZXIpIHtcbiAgICAgICAgLy8gRmluZCB0aGUgdGFyZ2V0IG5vZGVcbiAgICAgICAgbGV0IHRhcmdldE5vZGUgPSByZXNvbHZlci5ET01UYXJnZXQ7XG4gICAgICAgIC8vIE1vZGlmeSBpdHMgY2xhc3Nlc1xuICAgICAgICBjb25zb2xlLmxvZygncmVtb3ZpbmcgY2xhc3NlcycpXG4gICAgICAgIF91LnJlbW92ZUNsYXNzKHRoaXMuY2xhc3NCYXNlVHJhbnNpdGlvbisnLW91dC1maW5pc2gnLCB0YXJnZXROb2RlKTtcbiAgICAgICAgX3UucmVtb3ZlQ2xhc3ModGhpcy5jbGFzc0Jhc2VUcmFuc2l0aW9uKyctb3V0LWVuZCcsIHRhcmdldE5vZGUpO1xuICAgICAgICBfdS5yZW1vdmVDbGFzcyh0aGlzLmNsYXNzQmFzZVRyYW5zaXRpb24rJy1vdXQnLCB0YXJnZXROb2RlKTtcbiAgICAgICAgX3UuYWRkQ2xhc3ModHJhbnNDbGFzcysnLWluJywgRE9NVGFyZ2V0KTtcbiAgICAgICAgX3UuYWRkQ2xhc3ModHJhbnNDbGFzcysnLWluLXN0YXJ0JywgRE9NVGFyZ2V0KTtcbiAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgICBfdS5hZGRDbGFzcyh0cmFuc0NsYXNzKyctaW4tZW5kJywgRE9NVGFyZ2V0KTtcbiAgICAgICAgfSwgMCk7XG4gICAgICAgIC8vIEZpbmFsbHkuIFBhcnNlIHRoZSByZXN1bHRcbiAgICAgICAgdGhpcy5fY29tcGxldGVUcmFuc2ZlcihyZXNvbHZlci5kb2N1bWVudCwgdGFyZ2V0Tm9kZSwgc2VsZWN0aW9uLCBmcm9tUG9wKTtcbiAgICAgICAgLy8gQWRkIHRoZSBhbmltYXRpb24gZW5kIGxpc3RlbmVyIHRvIHRoZSB0YXJnZXQgbm9kZVxuICAgICAgICByZXR1cm4gQW5pbWF0aW9uLmFkZEVuZEV2ZW50TGlzdGVuZXIodGFyZ2V0Tm9kZSwgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgcmV0dXJuIHJlc29sdmVyO1xuICAgICAgICB9KTtcbiAgICAgIH0uYmluZCh0aGlzKSkuXG4gICAgICAvLyBUSEVOOiBSZXNwb25zaWJsZSBmb3IgdGlkeWluZyBldmVyeXRoaW5nIHVwXG4gICAgICB0aGVuKGZ1bmN0aW9uKHJlc29sdmVyKSB7XG4gICAgICAgIC8vIEZpbmQgdGhlIHRhcmdldCBub2RlXG4gICAgICAgIGxldCB0YXJnZXROb2RlID0gcmVzb2x2ZXIuRE9NVGFyZ2V0O1xuICAgICAgICAvLyBNb2RpZnkgaXRzIGNsYXNzZXNcbiAgICAgICAgX3UucmVtb3ZlQ2xhc3ModGhpcy5jbGFzc0Jhc2VUcmFuc2l0aW9uKyctaW4nLCB0YXJnZXROb2RlKTtcbiAgICAgICAgX3UucmVtb3ZlQ2xhc3ModGhpcy5jbGFzc0Jhc2VUcmFuc2l0aW9uKyctaW4tc3RhcnQnLCB0YXJnZXROb2RlKTtcbiAgICAgICAgX3UucmVtb3ZlQ2xhc3ModGhpcy5jbGFzc0Jhc2VUcmFuc2l0aW9uKyctaW4tZW5kJywgdGFyZ2V0Tm9kZSk7XG4gICAgICAgIF91LmFkZENsYXNzKHRoaXMuY2xhc3NCYXNlVHJhbnNpdGlvbisnLWluLWZpbmlzaCcsIHRhcmdldE5vZGUpO1xuICAgICAgfS5iaW5kKHRoaXMpKS5cbiAgICAgIGNhdGNoKCBmdW5jdGlvbihlcnIpIHtcbiAgICAgICAgY29uc29sZS5sb2coZXJyKVxuICAgICAgICB0aGlzLl9lcnJvcihyZWFkeVN0YXRlLCByZXEuc3RhdHVzLCBlcnIgfHwgMCk7XG4gICAgICB9LmJpbmQodGhpcykgKTtcblxuICAgIC8vIFNhdmUgdGhlIGxhc3QgcGFyc2VkIFVSTCBmb3IgdGhlIHB1cnBvc2Ugb2YgaGlzdG9yeSBpbnRlcm9wZXJhYmlsaXR5IGFuZCBlcnJvciBjb3JyZWN0aW9uLlxuICAgIHRoaXMubGFzdFBhcnNlZFVSTCA9IHBhcnNlZFVSTDtcblxuICAgIHJlcS5vcGVuKCdHRVQnLCBwYXJzZWRVUkwsIHRydWUpO1xuICAgIHJlcS5zZW5kKGRhdGEpO1xuXG4gICAgLy8gU2V0IHRoZSBvYmplY3Qgc3RhdGVcbiAgICB0aGlzLnN0YXRlID0gU1RBVEVTLkxPQURJTkc7XG5cbiAgICByZXR1cm4gcmVxdWVzdFByb21pc2U7XG4gIH1cblxuICAvKipcbiAgICogUHJpdmF0ZSBtZXRob2RzXG4gICAqL1xuXG4gIC8qKlxuICAgKiBMaXN0ZW5lciBmb3IgdGhlIHBvcHN0YXRlIG1ldGhvZFxuICAgKlxuICAgKiBAcHJpdmF0ZVxuICAgKiBAcGFyYW0gIHtvYmplY3R9IGUgdGhlIHBhc3NlZCBldmVudCBvYmplY3RcbiAgICogQHJldHVybiB2b2lkXG4gICAqL1xuICBzdGF0aWMgX3BvcHN0YXRlKGUpIHtcbiAgICBjb25zb2xlLmxvZygnLS0tLSBfcG9wc3RhdGUgLS0tLSAnKTtcbiAgICB2YXIgYmFzZSwgc3RhdGUgPSB7fTtcbiAgICB2YXIgaGFzUG9wcGVkU3RhdGUgPSBzdXBlci5fcG9wc3RhdGUoZSk7XG5cbiAgICBpZiggaGFzUG9wcGVkU3RhdGUgKSB7XG4gICAgICBzdGF0ZSA9IChiYXNlID0gdGhpcy5oaXN0b3J5KS5zdGF0ZSB8fCAoYmFzZS5zdGF0ZSA9IGUuc3RhdGUgfHwgKGUuc3RhdGUgPSB3aW5kb3cuZXZlbnQuc3RhdGUpKTtcbiAgICB9XG5cbiAgICBjb25zb2xlLmxvZyhzdGF0ZSwgaGFzUG9wcGVkU3RhdGUpO1xuICAgIGNvbnNvbGUubG9nKCcgJyk7XG5cbiAgICB2YXIgaHJlZiA9IGRvY3VtZW50LmxvY2F0aW9uLmhyZWY7XG4gICAgdmFyIHRhcmdldCA9IHN0YXRlLnRhcmdldCB8fCB0aGlzLmxhc3RDaGFuZ2VkVGFyZ2V0O1xuICAgIHZhciBzZWxlY3Rpb24gPSBzdGF0ZS5zZWxlY3Rpb24gfHwgU0VMRUNUT1JTLkNISUxEUkVOO1xuICAgIHZhciBkYXRhID0gc3RhdGUuZGF0YSB8fCB7fTtcblxuICAgIHRoaXMuYWpheEdldChocmVmLCB0YXJnZXQsIHNlbGVjdGlvbiwgdHJ1ZSwgZGF0YSk7XG5cbiAgICByZXR1cm4gaGFzUG9wcGVkU3RhdGU7XG4gIH1cblxuICAvKipcbiAgICogVHJpZ2dlciBhbiBhamF4IGxpbmsgYXMgZGV0ZXJtaW5lZCBieSBhIGNsaWNrIGNhbGxiYWNrLiBUaGlzIHNob3VsZCBvbmx5IGV2ZXIgYmUgY2FsbGVkXG4gICAqIGZyb20gYSBjbGljayBldmVudCBhcyBhZGRlZCB2aWEgdGhlIEFKQVggb2JqZWN0IG9yIGEgY2hpbGQgdGhlcmVyb2YuXG4gICAqXG4gICAqIEBzdGF0aWNcbiAgICogQHByaXZhdGVcbiAgICogQHBhcmFtICB7b2JqZWN0fSBlIHRoZSBldmVudCBvYmplY3QgcGFzc2VkIGZyb20gdGhlIGNsaWNrIGV2ZW50LlxuICAgKi9cbiAgc3RhdGljIF90cmlnZ2VyQWpheExpbmsoZSkge1xuICAgIGlmKCB0aGlzLnN0YXRlICE9IFNUQVRFUy5PSyApXG4gICAge1xuICAgICAgaWYoIHRoaXMuZGV2bW9kZSApXG4gICAgICB7XG4gICAgICAgIGNvbnNvbGUud2FybiggXCJUcmllZCB0byBjbGljayBhbiBBSkFYIGxpbmsgd2hlbiB0aGUgb2JqZWN0IHdhc24ndCBpbiBPSyBtb2RlXCIgKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIEZpbmQgYWxsIG9mIHRoZSByZWxldmFudCBhdHRlaWJ1dGVzXG4gICAgY29uc3QgbGluayAgICAgID0gZS50YXJnZXQ7XG4gICAgY29uc3QgaHJlZiAgICAgID0gbGluay5nZXRBdHRyaWJ1dGUoJ2hyZWYnKTtcbiAgICBjb25zdCB0YXJnZXQgICAgPSBsaW5rLmdldEF0dHJpYnV0ZSh0aGlzLmF0dHJpYnV0ZVRhcmdldCk7XG4gICAgY29uc3Qgc2VsZWN0aW9uID0gbGluay5nZXRBdHRyaWJ1dGUodGhpcy5hdHRyaWJ1dGVTZWxlY3Rpb24pO1xuXG4gICAgLy8gU2V0IHRoZSBvYmplY3Qgc3RhdGVcbiAgICB0aGlzLnN0YXRlID0gU1RBVEVTLkNMSUNLRUQ7XG5cbiAgICB0aGlzLmFqYXhHZXQoaHJlZiwgdGFyZ2V0LCBzZWxlY3Rpb24pO1xuICB9XG5cbiAgLyoqXG4gICAqIEB0eXBlZGVmIHtPYmplY3R9ICAgICAgICAgICAgICBBSkFYRG9jdW1lbnRcbiAgICogQHByb3BlcnR5IHtET01FbGVtZW50fSBkb2MgICAgIFRoZSBmdWxsIGRvY3VtZW50IG5vZGUgZm9yIHRoZSBBSkFYIEdFVCByZXN1bHRcbiAgICogQHByb3BlcnR5IHtOb2RlTGlzdH0gICBzdWJkb2MgIFRoZSBzdWJkb2N1bWVudCBkZXJpdmVkIGZyb20gdGhlIG1haW4gZG9jdW1lbnRcbiAgICovXG5cbiAgLyoqXG4gICAqIFRoaXMgcmVzcG9uZHMgdG8gdGhlIGFqYXggbG9hZCBldmVudCBhbmQgaXMgcmVzcG9uc2libGUgZm9yIGJ1aWxkaW5nIHRoZSByZXN1bHQsXG4gICAqIGluamVjdGluZyBpdCBpbnRvIHRoZSBwYWdlLCBydW5uaW5nIGNhbGxiYWNrcyBhbmQgZGV0ZWN0aW5nIGFuZCBkZWxheWluZ1xuICAgKiB0cmFuc2l0aW9ucyBhbmQgYW5pbWF0aW9ucyBhcyBuZWNlc3NhcnkvXG4gICAqXG4gICAqIEBzdGF0aWNcbiAgICogQHByaXZhdGVcbiAgICogQHBhcmFtICB7c3RyaW5nfSBjb250ZW50ICAgICAgICAgICBUaGUgbG9hZGVkIHBhZ2UgY29udGVudCwgdGhpcyBjb21lcyBmcm9tIHRoZSBBSkFYIGNhbGwuXG4gICAqIEBwYXJhbSAge3N0cmluZ30gdGFyZ2V0ICAgICAgICAgICAgVGhlIHRhcmdldCBmb3IgdGhlIGxvYWRlZCBjb250ZW50LiBUaGlzIGNhbiBiZSBhIHN0cmluZyAoc2VsZWN0b3IpLCBvciBhIEpTT04gYXJyYXkgb2Ygc2VsZWN0b3Igc3RyaW5ncy5cbiAgICogQHBhcmFtICB7c3RyaW5nfSBzZWxlY3Rpb24gICAgICAgICBUaGlzIGlzIGEgc2VsZWN0b3IgdGhhdCBkZXRlcm1pbmVzIHdoYXQgdG8gY3V0IGZyb20gdGhlIGxvYWRlZCBjb250ZW50LlxuICAgKiBAcGFyYW0gIHtET01FbGVtZW50fSBbbGlua1RhcmdldF0gIFRoZSB0YXJnZXQgb2YgdGhlIGxpbmsuIFRoaXMgaXMgdXNlZnVsIGZvciBzZXR0aW5nIGFjdGl2ZSBzdGF0ZXMgaW4gY2FsbGJhY2suXG4gICAqIEByZXR1cm4ge0FKQVhEb2N1bWVudH0gICAgICAgICAgICAgQW4gb2JqZWN0IHJlcHJlc2VudGluZyBib3RoIHRoZSBtYWluIGRvY3VtZW50IGFuZCB0aGUgc3ViZG9jdW1lbnRcbiAgICovXG4gIHN0YXRpYyBfcGFyc2VSZXNwb25zZShjb250ZW50LCB0YXJnZXQsIHNlbGVjdGlvbikge1xuXG4gICAgdmFyIGRvYywgc3ViZG9jLCByZXN1bHRzO1xuXG4gICAgLy8gUGFyc2UgdGhlIGRvY3VtZW50IGZyb20gdGhlIGNvbnRlbnQgcHJvdmlkZWRcbiAgICBkb2MgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBkb2MuaW5uZXJIVE1MID0gY29udGVudDtcblxuICAgIGlmKCBzZWxlY3Rpb24gPT09IFNFTEVDVE9SUy5DSElMRFJFTiApXG4gICAge1xuICAgICAgc3ViZG9jID0gZG9jLnF1ZXJ5U2VsZWN0b3JBbGwoYCR7dGFyZ2V0fSA+ICpgKTtcbiAgICB9IGVsc2Uge1xuICAgICAgc3ViZG9jID0gZG9jLnF1ZXJ5U2VsZWN0b3JBbGwoc2VsZWN0aW9uKTtcbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgZG9jOiBkb2MsXG4gICAgICBzdWJkb2M6IHN1YmRvY1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBUaGlzIGNvbXBsZXRlcyB0aGUgdHJhbnNpdGlvbiBvZiBjb250ZW50LiBUaGlzIHJlbW92ZXMgdGhlIG9sZCBjb250ZW50IGFuZCBhZGRzIHRoZSBuZXdcbiAgICpcbiAgICogQHN0YXRpY1xuICAgKiBAcHJpdmF0ZVxuICAgKiBAcGFyYW0gIHtBSkFYRG9jdW1lbnR9IGNvbnRlbnQgICAgVGhlIERPTSBub2RlcyB0byBhZGQgdG8gdGhlIGVsZW1lbnRcbiAgICogQHBhcmFtICB7RE9NTm9kZX0gICAgICB0YXJnZXQgICAgIFRoZSB0YXJnZXQgdG8gYWRkIHRoZSBuZXcgY29udGVudCB0b1xuICAgKiBAcGFyYW0gIHtzdHJpbmd9ICAgICAgIHNlbGVjdGlvbiAgVGhpcyBpcyBhIHNlbGVjdG9yIHRoYXQgZGV0ZXJtaW5lcyB3aGF0IHRvIGN1dCBmcm9tIHRoZSBsb2FkZWQgY29udGVudC5cbiAgICogQHBhcmFtICB7Ym9vbGVhbn0gICAgICBmcm9tUG9wICAgIEluZGljYXRlcyB0aGF0IHRoaXMgbG9hZCBpcyBmcm9tIGEgaGlzdG9yeSBwb3BcbiAgICovXG4gIHN0YXRpYyBfY29tcGxldGVUcmFuc2Zlcihjb250ZW50LCB0YXJnZXQsIHNlbGVjdGlvbiwgZnJvbVBvcCkge1xuXG4gICAgdmFyIG9sZFRpdGxlID0gZG9jdW1lbnQudGl0bGUsIG5ld1RpdGxlLCB0YXJnZXROb2RlcztcblxuICAgIGNvbnNvbGUubG9nKCctLS0gY29tcGxldGVUcmFuc2ZlciAtLS0nKTtcbiAgICBjb25zb2xlLmxvZyhjb250ZW50LCBvbGRUaXRsZSwgY29udGVudC5kb2MuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ3RpdGxlJykpO1xuXG4gICAgLy8gRmluZCB0aGUgbmV3IHBhZ2UgdGl0bGVcbiAgICBuZXdUaXRsZSA9IGNvbnRlbnQuZG9jLmdldEVsZW1lbnRzQnlUYWdOYW1lKCd0aXRsZScpWzBdLnRleHQ7XG5cbiAgICB0YXJnZXQuaW5uZXJIVE1MID0gJyc7XG5cbiAgICBjb250ZW50LnN1YmRvYy5mb3JFYWNoKGZ1bmN0aW9uKHJlc3VsdCkge1xuICAgICAgdGFyZ2V0LmFwcGVuZENoaWxkKHJlc3VsdC5jbG9uZU5vZGUodHJ1ZSkpO1xuICAgIH0pO1xuXG4gICAgLy8gVXBkYXRlIHRoZSBpbnRlcm5hbCByZWZlcmVuY2UgdG8gdGhlIGxhc3QgdGFyZ2V0XG4gICAgdGhpcy5sYXN0Q2hhbmdlZFRhcmdldCA9IF91LmdldFNlbGVjdG9yRm9yRWxlbWVudCh0YXJnZXQpO1xuXG4gICAgaWYoICFmcm9tUG9wICkge1xuICAgICAgLy8gUHVzaCB0aGUgbmV3IHN0YXRlIHRvIHRoZSBoaXN0b3J5LlxuICAgICAgdGhpcy5wdXNoKHRoaXMubGFzdFBhcnNlZFVSTCwgbmV3VGl0bGUsIHsgdGFyZ2V0OiBfdS5nZXRTZWxlY3RvckZvckVsZW1lbnQodGFyZ2V0KSwgc2VsZWN0aW9uOiBzZWxlY3Rpb24gfSk7XG4gICAgfVxuXG4gICAgLy8gU2V0IHRoZSBvYmplY3Qgc3RhdGVcbiAgICB0aGlzLnN0YXRlID0gU1RBVEVTLk9LO1xuICB9XG5cbiAgLyoqXG4gICAqIFRyaWdnZXIgYW4gZXJyb3IgbG9nXG4gICAqXG4gICAqIEBzdGF0aWNcbiAgICogQHByaXZhdGVcbiAgICogQHBhcmFtICB7dHlwZX0gcmVhZHlTdGF0ZSBkZXNjcmlwdGlvblxuICAgKiBAcGFyYW0gIHt0eXBlfSBzdGF0dXMgICAgIGRlc2NyaXB0aW9uXG4gICAqIEByZXR1cm4ge3R5cGV9ICAgICAgICAgICAgZGVzY3JpcHRpb25cbiAgICovXG4gIHN0YXRpYyBfZXJyb3IocmVhZHlTdGF0ZSwgc3RhdHVzLCBlcnJvclN0YXRlID0gRVJST1JTLkdFTkVSSUNfRVJST1IpIHtcbiAgICB2YXIgZXJyb3JTdGF0ZUNvbnN0ID0gKGZ1bmN0aW9uKHZhbCkgeyBmb3IodmFyIGtleSBpbiBFUlJPUlMpIHsgaWYoRVJST1JTW2tleV0gPT0gdmFsKSByZXR1cm4ga2V5IH0gcmV0dXJuICdHRU5FUklDX0VSUk9SJyB9KShlcnJvclN0YXRlKVxuICAgIGNvbnNvbGUud2FybihgJWMgRXJyb3IgbG9hZGluZyBBSkFYIGxpbmsuIHJlYWR5U3RhdGU6ICR7cmVhZHlTdGF0ZX0uIHN0YXR1czogJHtzdGF0dXN9LiBlcnJvclN0YXRlOiAke2Vycm9yU3RhdGVDb25zdH1gLCAnYmFja2dyb3VuZDogIzIyMjsgY29sb3I6ICNmZjdjM2EnKVxuICB9XG5cblxuICAvKipcbiAgICogR2V0dGVycyBhbmQgc2V0dGVyc1xuICAgKi9cblxuICAvKipcbiAgICogKGdldHRlci9zZXR0ZXIpIFRoZSBhdHRyaWJ1dGUgdXNlZCB0byBkZXRlcm1pbmUgd2hldGhlciBhIGxpbmsgc2hvdWxkXG4gICAqIGJlIHJ1biB2aWEgdGhlIEFKQVggY2xhc3MuXG4gICAqXG4gICAqIEB0eXBlIHtzdHJpbmd9XG4gICAqIEBkZWZhdWx0ICdkYXRhLXd0Yy1hamF4J1xuICAgKi9cbiAgc3RhdGljIHNldCBhdHRyaWJ1dGVBamF4KGF0dHJpYnV0ZSkge1xuICAgIGlmKHR5cGVvZiBhdHRyaWJ1dGUgPT09ICdzdHJpbmcnKSB7XG4gICAgICB0aGlzLl9hdHRyaWJ1dGVBamF4ID0gYXR0cmlidXRlO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zb2xlLndhcm4oJ0FsbCBhdHRyaWJ1dGVzIG11c3QgYmUgc3RyaW5ncy4nKTtcbiAgICB9XG4gIH1cbiAgc3RhdGljIGdldCBhdHRyaWJ1dGVBamF4KCkge1xuICAgIHJldHVybiB0aGlzLl9hdHRyaWJ1dGVBamF4IHx8ICdkYXRhLXd0Yy1hamF4JztcbiAgfVxuXG4gIC8qKlxuICAgKiAoZ2V0dGVyL3NldHRlcikgVGhlIGF0dHJpYnV0ZSB1c2VkIHRvIGRldGVybWluZSB3aGVyZSBhIGxpbmsgc2hvdWxkIHBsYWNlIGl0J3NcbiAgICogcmVzdWx0YW50IEdFVC4gVGhpcyBhdHRyaWJ1dGUgc2hvdWxkIGJlIGluIHRoZSBmb3JtIG9mIGEgc2VsZWN0b3IsIGllOlxuICAgKiBgLmFqYXgtdGFyZ2V0YFxuICAgKlxuICAgKiBAdHlwZSB7c3RyaW5nfVxuICAgKiBAZGVmYXVsdCAnZGF0YS13dGMtYWpheC10YXJnZXQnXG4gICAqL1xuICBzdGF0aWMgc2V0IGF0dHJpYnV0ZVRhcmdldChhdHRyaWJ1dGUpIHtcbiAgICBpZih0eXBlb2YgYXR0cmlidXRlID09PSAnc3RyaW5nJykge1xuICAgICAgdGhpcy5fYXR0cmlidXRlVGFyZ2V0ID0gYXR0cmlidXRlO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zb2xlLndhcm4oJ0FsbCBhdHRyaWJ1dGVzIG11c3QgYmUgc3RyaW5ncy4nKTtcbiAgICB9XG4gIH1cbiAgc3RhdGljIGdldCBhdHRyaWJ1dGVUYXJnZXQoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2F0dHJpYnV0ZVRhcmdldCB8fCAnZGF0YS13dGMtYWpheC10YXJnZXQnO1xuICB9XG5cbiAgLyoqXG4gICAqIChnZXR0ZXIvc2V0dGVyKSBUaGUgYXR0cmlidXRlIHVzZWQgdG8gc2xpY2UgdGhlIHJlc3VsdGFudCBHRVQuXG4gICAqIFRoaXMgYXR0cmlidXRlIHNob3VsZCBiZSBpbiB0aGUgZm9ybSBvZiBhIHNlbGVjdG9yLCBpZTpcbiAgICogYC5hamF4LXNlbGVjdGlvbmBcbiAgICpcbiAgICogQHR5cGUge3N0cmluZ31cbiAgICogQGRlZmF1bHQgJ2RhdGEtd3RjLWFqYXgtc2VsZWN0aW9uJ1xuICAgKi9cbiAgc3RhdGljIHNldCBhdHRyaWJ1dGVTZWxlY3Rpb24oYXR0cmlidXRlKSB7XG4gICAgaWYodHlwZW9mIGF0dHJpYnV0ZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgIHRoaXMuX2F0dHJpYnV0ZVNlbGVjdGlvbiA9IGF0dHJpYnV0ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc29sZS53YXJuKCdBbGwgYXR0cmlidXRlcyBtdXN0IGJlIHN0cmluZ3MuJyk7XG4gICAgfVxuICB9XG4gIHN0YXRpYyBnZXQgYXR0cmlidXRlU2VsZWN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLl9hdHRyaWJ1dGVTZWxlY3Rpb24gfHwgJ2RhdGEtd3RjLWFqYXgtc2VsZWN0aW9uJztcbiAgfVxuXG4gIC8qKlxuICAgKiAoZ2V0dGVyL3NldHRlcikgVGhlIGNsYXNzbmFtZSB0byB1c2UgYXMgdGhlIGJhc2lzIGZvciB0cmFuc2l0aW9ucy4gRGVmYXVsdFxuICAgKiB3aWxsIGJlICp3dGMtdHJhbnNpdGlvbiouIFNvIHRoaXMgd2lsbCB0aGVuIGJlIHVzZWQgZm9yIGFsbCAzIHN0YXRlczpcbiAgICogKi53dGMtdHJhbnNpdGlvbipcbiAgICogKi53dGMtdHJhbnNpdGlvbi1vdXQqXG4gICAqICoud3RjLXRyYW5zaXRpb24tb3V0LXN0YXJ0KlxuICAgKiAqLnd0Yy10cmFuc2l0aW9uLW91dC1lbmQqXG4gICAqICoud3RjLXRyYW5zaXRpb24tb3V0LWZpbmlzaCpcbiAgICogKi53dGMtdHJhbnNpdGlvbi1pbipcbiAgICogKi53dGMtdHJhbnNpdGlvbi1pbi1zdGFydCpcbiAgICogKi53dGMtdHJhbnNpdGlvbi1pbi1lbmQqXG4gICAqICoud3RjLXRyYW5zaXRpb24taW4tZmluaXNoKlxuICAgKlxuICAgKiBAdHlwZSB7c3RyaW5nfVxuICAgKiBAZGVmYXVsdCAnd3RjLXRyYW5zaXRpb24nXG4gICAqL1xuICBzdGF0aWMgc2V0IGNsYXNzQmFzZVRyYW5zaXRpb24oY2xhc3NCYXNlKSB7XG4gICAgaWYodHlwZW9mIGNsYXNzQmFzZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgIHRoaXMuX2NsYXNzQmFzZVRyYW5zaXRpb24gPSBjbGFzc0Jhc2U7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnNvbGUud2FybignQWxsIGF0dHJpYnV0ZXMgbXVzdCBiZSBzdHJpbmdzLicpO1xuICAgIH1cbiAgfVxuICBzdGF0aWMgZ2V0IGNsYXNzQmFzZVRyYW5zaXRpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuX2NsYXNzQmFzZVRyYW5zaXRpb24gfHwgJ3d0Yy10cmFuc2l0aW9uJztcbiAgfVxuXG4gIC8qKlxuICAgKiAoZ2V0dGVyL3NldHRlcikgVGhlIGF0dHJpYnV0ZSB1c2VkIHRvIHNsaWNlIHRoZSByZXN1bHRhbnQgR0VULlxuICAgKiBUaGlzIGF0dHJpYnV0ZSBzaG91bGQgYmUgaW4gdGhlIGZvcm0gb2YgYSBzZWxlY3RvciwgaWU6XG4gICAqIGAuYWpheC1zZWxlY3Rpb25gXG4gICAqXG4gICAqIEB0eXBlIHtzdHJpbmd9XG4gICAqIEBkZWZhdWx0ICdkYXRhLXd0Yy1hamF4LXNlbGVjdGlvbidcbiAgICovXG4gIHN0YXRpYyBzZXQgYXR0cmlidXRlU2hvdWxkTmF2aWdhdGUoYXR0cmlidXRlKSB7XG4gICAgaWYodHlwZW9mIGF0dHJpYnV0ZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgIHRoaXMuX2F0dHJpYnV0ZVNob3VsZE5hdmlnYXRlID0gYXR0cmlidXRlO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zb2xlLndhcm4oJ0FsbCBhdHRyaWJ1dGVzIG11c3QgYmUgc3RyaW5ncy4nKTtcbiAgICB9XG4gIH1cbiAgc3RhdGljIGdldCBhdHRyaWJ1dGVTaG91bGROYXZpZ2F0ZSgpIHtcbiAgICByZXR1cm4gdGhpcy5fYXR0cmlidXRlU2hvdWxkTmF2aWdhdGUgfHwgJ2RhdGEtd3RjLWFqYXgtc2hvdWxkLW5hdmlnYXRlJztcbiAgfVxuXG4gIC8qKlxuICAgKiByZXR1cm5zIGEgbmV3IHJlcXVlc3RPYmplY3QuIFdyYXBwaW5nIHBsYWNlaG9sZGVyIGZvciBub3cgd2FpdGluZyBvbiBlbmhhbmNlbWVudHMuXG4gICAqXG4gICAqIEByZWFkb25seVxuICAgKiBAcmV0dXJuIHtvYmplY3R9ICByZXF1ZXN0T2JqZWN0XG4gICAqL1xuICBzdGF0aWMgZ2V0IHJlcXVlc3RPYmplY3QoKSB7XG4gICAgcmV0dXJuIG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuICB9XG5cbiAgLyoqXG4gICAqIHJldHVybnMgYSBuZXcgbGFzdCBjaGFuZ2VkIHRhcmdldC4gVGhpcyBpcyB1c2VkIHRvIGRldGVybWluZSB3aGF0IHRvIGNoYW5nZWRcbiAgICogd2hlbiBuYXZpZ2F0aW5nIGJhY2sgdmlhIGhpc3RvcnkuXG4gICAqXG4gICAqIEByZXR1cm4ge29iamVjdH0gIGVpdGhlciBhbiBhcnJheSBvZiBub2RlcyBvciBhIHNpbmdsZSBub2RlLlxuICAgKiBAZGVmYXVsdCBudWxsXG4gICAqL1xuICBzdGF0aWMgc2V0IGxhc3RDaGFuZ2VkVGFyZ2V0KHRhcmdldCkge1xuICAgIHRoaXMuX2xhc3RDaGFuZ2VkVGFyZ2V0ID0gdGFyZ2V0O1xuICB9XG4gIHN0YXRpYyBnZXQgbGFzdENoYW5nZWRUYXJnZXQoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2xhc3RDaGFuZ2VkVGFyZ2V0IHx8IG51bGw7XG4gIH1cblxuICAvKipcbiAgICogVGhlIHJlc29sdmUgdGltZW91dC4gVGhpcyBpcyB0aGUgdGltZSB0aGF0IGlzIHRvIGVsbGFwc2UgYmV0d2VlbiBhbiB0cmFuc2l0aW9uXG4gICAqIGNvbXBsZXRpbmcgYW5kIHRoZSBuZXcgY29udGVudCBiZWluZyBhZGRlZC4gVGhpcyBpcyBhcHBsaWVkIGJvdGggdG8gdGhlIG91dHdhcmRcbiAgICogZWxlbWVudCBhbmQgdGhlIGlud2FyZC5cbiAgICpcbiAgICogQHJldHVybiB7aW50fSAgQSBudW1iZXIsIGluIE1TLCBncmVhdGVyIHRoYW4gMFxuICAgKiBAZGVmYXVsdCAwXG4gICAqL1xuICBzdGF0aWMgc2V0IHJlc29sdmVUaW1lb3V0KHRpbWVvdXQpIHtcbiAgICB0aGlzLl9yZXNvbHZlVGltZW91dCA9IHRpbWVvdXQgPiAwID8gdGltZW91dCA6IG51bGw7XG4gIH1cbiAgc3RhdGljIGdldCByZXNvbHZlVGltZW91dCgpIHtcbiAgICByZXR1cm4gdGhpcy5fcmVzb2x2ZVRpbWVvdXQgPiAwID8gdGhpcy5fcmVzb2x2ZVRpbWVvdXQgOiAwO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoZSBzdGF0ZSB0aGF0IHRoZSBBSkFYIG9iamVjdCBpcyBpbiwgYXMgZGV0ZXJtaW5lZCBmcm9tIGEgbGlzdCBvZiBjb25zdGFudHM6XG4gICAqIC0gT0sgICAgICAgICAgICAgSWRsZSwgcmVhZHkgZm9yIGEgc3RhdGUgbG9hZC5cbiAgICogLSBDTElDS0VEICAgICAgICBDbGlja2VkLCBidXQgbm90IHlldCBmaXJlZC5cbiAgICogLSBMT0FESU5HICAgICAgICBMb2FkaW5nIHBhZ2UuXG4gICAqIC0gVFJBTlNJVElPTklORyAgVHJhbnNpdGlvbmluZyBzdGF0ZVxuICAgKiAtIExPQURFRCAgICAgICAgIENvbnRlbnQgbG9hZGVkLlxuICAgKlxuICAgKiBAcmV0dXJuIHtpbnRlZ2VyfSAgVGhlIHN0YXRlIHRoYXQgdGhlIG9iamVjdCBpcyBpbi4gQ29tcGFyZSB0byB0aGUgc3RhdGUgb2JqZWN0IGZvciBkZXNjcmlwdGlvblxuICAgKiBAZGVmYXVsdCBTVEFURS5PS1xuICAgKi9cbiAgc3RhdGljIHNldCBzdGF0ZShzdGF0ZSkge1xuICAgIGlmKCB0eXBlb2Ygc3RhdGUgPT09ICdzdHJpbmcnICkge1xuICAgICAgaWYoIFNUQVRFU1tzdGF0ZV0gIT09IHVuZGVmaW5lZCApIHtcbiAgICAgICAgdGhpcy5fc3RhdGUgPSBTVEFURVNbc3RhdGVdO1xuICAgICAgICByZXR1cm5cbiAgICAgIH1cbiAgICB9IGVsc2UgaWYoIHR5cGVvZiBzdGF0ZSA9PT0gJ251bWJlcicgKSB7XG4gICAgICBmb3IodmFyIF9zdGF0ZSBpbiBTVEFURVMpIHtcbiAgICAgICAgaWYoU1RBVEVTW19zdGF0ZV0gPT09IHN0YXRlKSB7XG4gICAgICAgICAgdGhpcy5fc3RhdGUgPSBzdGF0ZTtcblxuICAgICAgICAgIGlmKCB0aGlzLmRldm1vZGUgKVxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGAlYyBBSkFYIHN0YXRlIGNoYW5nZTogJHt0aGlzLl9zdGF0ZX0gYCwgJ2JhY2tncm91bmQ6ICMyMjI7IGNvbG9yOiAjYmFkYTU1Jyk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIGNvbnNvbGUud2Fybignc3RhdGUgbXVzdCBiZSBvbmUgb2YgT0ssIENMSUNLRUQsIExPQURJTkcsIExPQURFRC4nKTtcbiAgfVxuICBzdGF0aWMgZ2V0IHN0YXRlKCkge1xuICAgIHJldHVybiB0aGlzLl9zdGF0ZSB8fCAwO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoZSBsYXN0IFVSTCB0byBiZSBwYXJzZWQgYnkgdGhlIEFKQVggb2JqZWN0LiBHZW5lcmFsbHkgc3BlYWtpbmcsIHRoaXMgaXMgdGhlXG4gICAqIGxhc3QgVVJMIHRvIGJlIGxvYWRlZCBvciBhdHRlbXB0ZWQgbG9hZGVkLlxuICAgKlxuICAgKiBAcmV0dXJuIHtzdHJpbmd9ICBUaGUgcGFyc2VkIFVSTCBzdHJpbmdcbiAgICogQGRlZmF1bHQgbnVsbFxuICAgKi9cbiAgc3RhdGljIHNldCBsYXN0UGFyc2VkVVJMKHBhcnNlZFVSTCkge1xuICAgIGlmKCB0eXBlb2YgcGFyc2VkVVJMID09PSAnc3RyaW5nJyApIHtcbiAgICAgIHRoaXMuX2xhc3RQYXJzZWRVUkwgPSBwYXJzZWRVUkw7XG4gICAgfVxuICB9XG4gIHN0YXRpYyBnZXQgbGFzdFBhcnNlZFVSTCgpIHtcbiAgICByZXR1cm4gdGhpcy5fbGFzdFBhcnNlZFVSTCB8fCBudWxsO1xuICB9XG59XG5cbmV4cG9ydCB7IEFKQVgsIEVSUk9SUywgU1RBVEVTIH07XG4iLCIvKipcbiAqIENsYXNzIHJlcHJlc2VudGluZyBhbiBhYnN0cmFjdGlvbiBvZiB0aGUgaGlzdG9yeSBBUEkuXG4gKiBAc3RhdGljXG4gKiBAbmFtZXNwYWNlXG4gKiBAYXV0aG9yIExpYW0gRWdhbiA8bGlhbUB3ZXRoZWNvbGxlY3RpdmUuY29tPlxuICogQHZlcnNpb24gMC44XG4gKiBAY3JlYXRlZCBOb3YgMTksIDIwMTZcbiAqL1xuY2xhc3MgSGlzdG9yeSB7XG5cbiAgLyoqXG4gICAqIFB1YmxpYyBtZXRob2RzXG4gICAqL1xuXG4gIC8qKlxuICAgICogSW5pdGlhbGlzZXMgdGhlIEhpc3RvcnkgY2xhc3MuIE5vdGhpbmcgc2hvdWxkIGJlIGFibGUgdG9cbiAgICAqIG9wZXJhdGUgaGVyZSB1bmxlc3MgdGhpcyBoYXMgcnVuIHdpdGggYSBzdXBwb3J0ID0gdHJ1ZS5cbiAgICAqXG4gICAgKiBAUHVibGljXG4gICAgKiBAcmV0dXJuIHtib29sZWFufSAgICAgICAgIFJldHVybnMgd2hldGhlciBpbml0IHJhbiBvciBub3RcbiAgICAqL1xuICBzdGF0aWMgaW5pdChkZXZtb2RlID0gZmFsc2UpIHtcbiAgICBpZih0aGlzLnN1cHBvcnQpXG4gICAge1xuICAgICAgLy8gVHJ5IHRvIHNldCBldmVyeXRoaW5nIHVwLCBhbmQgaWYgd2UgZmFpbCB0aGVuIHJldHVybiBmYWxzZVxuICAgICAgdHJ5IHtcbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3BvcHN0YXRlJywgKGUpPT4ge1xuICAgICAgICAgIHZhciBoYXNQb3BwZWRTdGF0ZSA9IHRoaXMuX3BvcHN0YXRlKGUpO1xuICAgICAgICAgIHJldHVybiBoYXNQb3BwZWRTdGF0ZTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5kZXZtb2RlICAgICAgPSBkZXZtb2RlO1xuXG4gICAgICB9IGNhdGNoIChlKSB7XG5cbiAgICAgICAgLy8gSWYgd2UncmUgaW4gZGV2bW9kZSwgc2VuZCBvdXIgY29uc29sZSBvdXRwdXRcbiAgICAgICAgaWYodGhpcy5kZXZtb2RlKSB7XG4gICAgICAgICAgY29uc29sZS53YXJuKCdlcnJvciBpbiBoaXN0b3J5IGluaXRpYWxpc2F0aW9uJyk7XG4gICAgICAgICAgY29uc29sZS5sb2coZSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuaW5pdGlhbGlzZWQgPSB0cnVlO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgLyoqXG4gICAqIENvbnN0cnVjdCBhbmQgcHVzaCBhIFVSTCBzdGF0ZVxuICAgKlxuICAgKiBAcHVibGljXG4gICAqIEBwYXJhbSAge3N0cmluZ30gVVJMICAgICAgICAgICBUaGUgVVJMIHRvIHB1c2gsIGNhbiBiZSByZWxhdGl2ZSwgYWJzb2x1dGUgb3IgZnVsbFxuICAgKiBAcGFyYW0gIHtzdHJpbmd9IHRpdGxlICAgICAgICAgVGhlIHRpdGxlIHRvIHB1c2guXG4gICAqIEBwYXJhbSAge29iamVjdH0gc3RhdGVPYmogICAgICBBIHN0YXRlIHRvIHB1c2ggdG8gdGhlIHN0YWNrLiBUaGlzIHdpbGwgYmUgcG9wcGVkIHdoZW4gbmF2aWFndGluZyBiYWNrXG4gICAqIEByZXR1cm4ge2Jvb2xlYW59ICAgICAgICAgICAgICBJbmRpY2F0ZXMgd2hldGhlciB0aGUgcHVzaCBzdWNjZWVkZWRcbiAgICovXG4gIHN0YXRpYyBwdXNoKFVSTCwgdGl0bGUgPSAnJywgc3RhdGVPYmogPSB7fSkge1xuXG4gICAgdmFyIHBhcnNlZFVSTCA9ICcnO1xuXG4gICAgLy8gRmlyc3QgdHJ5IHRvIGZpeCB0aGUgVVJMXG4gICAgdHJ5IHtcbiAgICAgIHBhcnNlZFVSTCA9IHRoaXMuX2ZpeFVSTChVUkwsIHRydWUsIHRydWUpO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIGlmKHRoaXMuZGV2bW9kZSkge1xuICAgICAgICBjb25zb2xlLndhcm4oJ3B1c2ggZmFpbGVkIHdoaWxlIHRyeWluZyB0byBmaXggdGhlIFVSTCcpO1xuICAgICAgICBjb25zb2xlLmxvZyhlKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBmYWxzZVxuICAgIH1cblxuICAgIC8vIElmIHdlIGhhdmUgQVBJIHN1cHBvcnQsIHB1c2ggdGhlIHN0YXRlIHRvIHRoZSBoaXN0b3J5IG9iamVjdFxuICAgIGlmKHRoaXMuc3VwcG9ydClcbiAgICB7XG4gICAgICB0cnkge1xuICAgICAgICBjb25zb2xlLmxvZyhzdGF0ZU9iaik7XG4gICAgICAgIHRoaXMuaGlzdG9yeS5wdXNoU3RhdGUoc3RhdGVPYmosIHRpdGxlLCBwYXJzZWRVUkwpO1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBpZih0aGlzLmRldm1vZGUpIHtcbiAgICAgICAgICBjb25zb2xlLndhcm4oJ3B1c2ggZmFpbGVkIHdoaWxlIHRyeWluZyB0byBwdXNoIHRoZSBzdGF0ZSB0byB0aGUgaGlzdG9yeSBvYmplY3QnKTtcbiAgICAgICAgICBjb25zb2xlLmxvZyhlKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgLy8gT3RoZXJ3aXNlciwgYWRkIHRoZSBVUkwgYXMgYSBoYXNoYmFuZ1xuICAgIH0gZWxzZVxuICAgIHtcbiAgICAgIHdpbmRvdy5sb2NhdGlvbi5oYXNoID0gYCMhJHtVUkx9YDtcbiAgICB9XG5cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUYWtlcyB0aGUgdXNlciBiYWNrIHRvIHRoZSBwcmV2aW91cyBzdGF0ZS4gU2ltcGx5IHdyYXBzIHRoZSBoaXN0b3J5IG9iamVjdCdzIGJhY2sgbWV0aG9kLlxuICAgKlxuICAgKiBAcHVibGljXG4gICAqL1xuICBzdGF0aWMgYmFjaygpIHtcbiAgICB0aGlzLmhpc3RvcnkuYmFjaygpO1xuICB9XG5cbiAgLyoqXG4gICAqIFRha2VzIHRoZSB1c2VyIGZvcndhcmQgdG8gdGhlIG5leHQgc3RhdGUuIFNpbXBseSB3cmFwcyB0aGUgaGlzdG9yeSBvYmplY3QncyBmb3J3YXJkIG1ldGhvZC5cbiAgICpcbiAgICogQHB1YmxpY1xuICAgKi9cbiAgc3RhdGljIGZvcndhcmQoKSB7XG4gICAgdGhpcy5oaXN0b3J5LmZvcndhcmQoKTtcbiAgfVxuXG5cbiAgLyoqXG4gICAqIFByaXZhdGUgbWV0aG9kc1xuICAgKi9cblxuICAvKipcbiAgICogVGFrZXMgYSBwcm92aWRlZCBVUkwgYW5kIHJldHVybnMgdGhlIHZlcnNpb24gdGhhdCBpcyB1c2FibGVcbiAgICpcbiAgICogQHByaXZhdGVcbiAgICogQHBhcmFtICB7c3RyaW5nfSBVUkwgICAgICAgICAgICAgICAgICAgICBUaGUgVVJMIHRvIGJlIHBhc3NlZFxuICAgKiBAcGFyYW0gIHtib29sZWFufSBpbmNsdWRlRG9jUm9vdCA9IHRydWUgIFdoZXRoZXIgdG8gaW5jbHVkZSB0aGUgZG9jcm9vdCBvbiB0aGUgcGFzc2VkIFVSTFxuICAgKiBAcGFyYW0gIHtib29sZWFufSBpbmNsdWRlVHJhaWxzID0gdHJ1ZSAgIFdoZXRoZXIgdG8gaW5jbHVkZSBmb3VuZCBoYXNoZXMgYW5kIHBhcmFtc1xuICAgKiBAcmV0dXJuIHtzdHJpbmd9ICAgICAgICAgICAgICAgICAgICAgICAgIFRoZSBwYXNzZWQgYW5kIGZvcm1hdHRlZCBVUkxcbiAgICovXG4gIHN0YXRpYyBfZml4VVJMKFVSTCwgaW5jbHVkZURvY1Jvb3QgPSB0cnVlLCBpbmNsdWRlVHJhaWxzID0gdHJ1ZSkge1xuXG4gICAgdmFyIHJ0blVSTDtcblxuICAgIC8qKlxuICAgICAqIFVSTCBSZWdleCB3b3JrcyBsaWtlIHRoaXM6XG4gICAgICogYGBgXG4gICAgICAgIF5cbiAgICAgICAgKFteOl0rOi8vICAgICAgICAgICAjIEhUVFAoUykgZXRjLlxuICAgICAgICAgICAgKFteL10rKSAgICAgICAgICMgVGhlIFVSTCAoaWYgYXZhaWxhYmxlKVxuICAgICAgICApP1xuICAgICAgICAoI3tAZG9jdW1lbnRSb290fSk/ICMgVGhlIGRvY3VtZW50IHJvb3QsIHdoaWNoIHdlIHdhbnQgdG8gZ2V0IHJpZCBvZlxuICAgICAgICAoLyk/ICAgICAgICAgICAgICAgICMgY2hlY2sgZm9yIHRoZSBwcmVzZW5jZSBvZiBhIGxlYWRpbmcgc2xhc2hcbiAgICAgICAgKFteXFwjXFw/XSopICAgICAgICAgICMgVGhlIFVSSSAtIHRoaXMgaXMgd2hhdCB3ZSBjYXJlIGFib3V0LiBDaGVjayBmb3IgZXZlcnl0aGluZyBleGNlcHQgZm9yICMgYW5kID9cbiAgICAgICAgKFxcP1teXFwjXSopPyAgICAgICAgICMgYW55IGFkZGl0aW9uYWwgVVJMIHBhcmFtZXRlcnMgKG9wdGlvbmFsKVxuICAgICAgICAoXFwjXFwhPy4rKT8gICAgICAgICAgIyBBbnkgaGFzaGJhbmcgdHJhaWxlcnMgKG9wdGlvbmFsKVxuICAgICAqIGBgYFxuICAgICAqL1xuICAgIGNvbnN0IFVSTFJlZ2V4ID0gUmVnRXhwKGBeKFteOl0rOi8vKFteL10rKSk/KCR7dGhpcy5kb2N1bWVudFJvb3R9KT8oLyk/KFteXFxcXCNcXFxcP10qKShcXFxcP1teXFxcXCNdKik/KFxcXFwjXFxcXCE/LispP2ApO1xuICAgIGNvbnN0IFtpbnB1dCwgaHJlZiwgaG9zdG5hbWUsIGRvY3VtZW50Um9vdCwgcm9vdCwgcGF0aCwgcGFyYW1zLCBoYXNoYmFuZ10gPSBVUkxSZWdleC5leGVjKFVSTCk7XG5cbiAgICBjb25zb2xlLmxvZyh0aGlzLmRvY3VtZW50Um9vdCwgZG9jdW1lbnRSb290LCByb290LCBwYXRoKTtcblxuICAgIC8vIElmIHdlJ3JlIG9ic2VydmluZyB0aGUgVExETiByZXN0cmFpbnQgYW5kIHRoZSBwcm92aWRlZCBVUkwgZG9lc24ndCBtYXRjaFxuICAgIC8vIHRoZSBkb21haW4ncyBUTEROLCB0aHJvdyBhIFVSSUVycm9yXG4gICAgaWYoIHR5cGVvZiBob3N0bmFtZSA9PT0gJ3N0cmluZycgJiYgaG9zdG5hbWUgIT09IHRoaXMuVExETiAmJiB0aGlzLm9ic2VydmVUTEROID09PSB0cnVlICkge1xuICAgICAgdGhyb3cgbmV3IFVSSUVycm9yKCdUb3AgTGV2ZWwgZG9tYWluIG5hbWUgTVVTVCBtYXRjaCB0aGUgcHJpbWFyeSBkb21haW4gbmFtZScpO1xuICAgIH1cblxuICAgIC8vIElmIG91ciBtYXRjaGVkIFVSTCBoYXMgYSBsZWFkaW5nIHNsYXNoLCB0aGVuIHdlIHdhbnQgdG8gZHJvcCB0aGUgZG9jUm9vdFxuICAgIC8vIGluIHRoZXJlIHVubGVzcyB0aGUgZnVuY3Rpb24gcGFyYW0gXCJpbmNsdWRlRG9jUm9vdFwiIGlzIGZhbHNlLlxuICAgIGlmKFxuICAgICAgKCB0eXBlb2Ygcm9vdCA9PT0gJ3N0cmluZycgJiYgcm9vdCA9PT0gJy8nICkgfHxcbiAgICAgICggdHlwZW9mIGRvY3VtZW50Um9vdCA9PT0gJ3N0cmluZycgJiYgZG9jdW1lbnRSb290ID09PSB0aGlzLmRvY3VtZW50Um9vdCApXG4gICAgKSB7XG4gICAgICBpZiggaW5jbHVkZURvY1Jvb3QgKSB7XG4gICAgICAgIHJ0blVSTCA9IGAke3RoaXMuZG9jdW1lbnRSb290fS8ke3BhdGh9YDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJ0blVSTCA9IGAvJHtwYXRofWA7XG4gICAgICB9XG4gICAgLy8gRWxzZSBpZiBwYXRoIGhhcyByZXN1bHRlZCBpbiBhbiBlbXB0eSBzdHJpbmcsIGFzc3VtZSB0aGUgcGF0aCBpcyB0aGUgcm9vdFxuICAgIH0gZWxzZSBpZiggcGF0aCA9PT0gJycgKSB7XG4gICAgICBydG5VUkwgPSAnLydcbiAgICAvLyBPdGhlcndpc2UsIGp1c3QgcGFzcyB0aGUgcGF0aCBjb21wbGV0ZWx5LlxuICAgIH0gZWxzZSB7XG4gICAgICBydG5VUkwgPSBwYXRoO1xuICAgIH1cblxuICAgIC8vIElmIHdlIHdhbnQgdG8gaW5jbHVkZSB0cmFpbHMgKGhhc2hlcyBhbmQgcGFyYW1zLCBhcyBkZXRlcm1pbmVkIGJ5IGFcbiAgICAvLyBmdW5jaXRvbiBwYXJhbSksIHRoZW4gYWRkIHRoZW0gdG8gdGhlIFVSTC5cbiAgICBpZiggaW5jbHVkZVRyYWlscyApIHtcbiAgICAgIC8vIEFwcGVuZCBhbnkgcGFyYW1zXG4gICAgICBpZiggdHlwZW9mIHBhcmFtcyA9PSAnc3RyaW5nJyApIHtcbiAgICAgICAgcnRuVVJMICs9IHBhcmFtcztcbiAgICAgIH1cbiAgICAgICAgLy8gQXBwZW5kIGFueSBoYXNoZXNcbiAgICAgIGlmKCB0eXBlb2YgaGFzaGJhbmcgPT0gJ3N0cmluZycgKSB7XG4gICAgICAgIHJ0blVSTCArPSBoYXNoYmFuZztcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gcnRuVVJMO1xuICB9XG5cbiAgLyoqXG4gICAqIExpc3RlbmVyIGZvciB0aGUgcG9wc3RhdGUgbWV0aG9kXG4gICAqXG4gICAqIEBwcml2YXRlXG4gICAqIEBwYXJhbSAge29iamVjdH0gZSB0aGUgcGFzc2VkIGV2ZW50IG9iamVjdFxuICAgKiBAcmV0dXJuIHZvaWRcbiAgICovXG4gIHN0YXRpYyBfcG9wc3RhdGUoZSkge1xuICAgIHZhciBiYXNlLCBzdGF0ZTtcbiAgICBpZih0aGlzLnN1cHBvcnQpXG4gICAge1xuICAgICAgdHJ5IHtcbiAgICAgICAgc3RhdGUgPSAoYmFzZSA9IHRoaXMuaGlzdG9yeSkuc3RhdGUgfHwgKGJhc2Uuc3RhdGUgPSBlLnN0YXRlIHx8IChlLnN0YXRlID0gd2luZG93LmV2ZW50LnN0YXRlKSk7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBjb25zb2xlLmxvZyhlKTtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVycyBhbmQgc2V0dGVyc1xuICAgKi9cblxuICAvKipcbiAgICogKGdldHRlci9zZXR0ZXIpIFNldHMgdGhlIGRvY3VtZW50IHJvb3QgZnJvbSBhIHBhc3NlZCBVUkxcbiAgICogcmV0dXJucyB0aGUgc2F2ZWQgZG9jdW1lbnQgcm9vdCBvciBhIGAvYCBpZiBub3Qgc2V0XG4gICAqXG4gICAqIEBkZWZhdWx0ICcvJ1xuICAgKiBAdHlwZSB7c3RyaW5nfVxuICAgKi9cbiAgc3RhdGljIHNldCBkb2N1bWVudFJvb3QoZG9jdW1lbnRSb290ID0gJycpIHtcblxuICAgIC8qKlxuICAgICAqIGRvY3Jvb3RSZWdleCB3b3JrcyBsaWtlIHRoaXM6XG4gICAgICogYGBgXG4gICAgICAgICBeXG4gICAgICAgICAoW146XSs6Ly8gICAgICAgIyBIVFRQKFMpIGV0Yy5cbiAgICAgICAgICAgICAoW14vXSspICAgICAjIFRoZSBob3N0bmFtZSAoaWYgYXZhaWxhYmxlKVxuICAgICAgICAgKT9cbiAgICAgICAgIC8/XG4gICAgICAgICAoLiooPz0vKSk/ICAgICAgIyB0aGUgVVJJIHRvIHVzZSBhcyB0aGUgZG9jcm9vdCBsZXNzIGFueSBhdmFpbGFibGUgdHJhaWxpbmcgc2xhc2hcbiAgICAgKiBgYGBcbiAgICAgKi9cbiAgICBjb25zdCBkb2Nyb290UmVnZXggPSAvXihbXjpdKzpcXC9cXC8oW15cXC9dKykpP1xcLz8oLiooPz1cXC8pKT8vO1xuICAgIC8vIHBhc3MgdGhlIGRvY3Jvb3QgYW5kIGhvc3RuYW1lXG4gICAgY29uc3QgW18xLCBfMiwgaG9zdG5hbWUsIGRvY3Jvb3RdID0gZG9jcm9vdFJlZ2V4LmV4ZWMoZG9jdW1lbnRSb290KTtcblxuICAgIC8vIEVycm9yIGNoZWNrXG4gICAgLy8gY2hlY2sgZm9yIHRoZSBwcmVzZW5jZSBvZiB0aGUgcmVwb3J0ZWQgVExETlxuICAgIGlmKFxuICAgICAgdHlwZW9mIGhvc3RuYW1lID09PSAnc3RyaW5nJyAmJlxuICAgICAgaG9zdG5hbWUgIT0gdGhpcy5UTEROICYmXG4gICAgICB0aGlzLm9ic2VydmVUTEROID09PSB0cnVlXG4gICAgKSB7XG4gICAgICB0aHJvdyBuZXcgVVJJRXJyb3IoJ1RvcCBMZXZlbCBkb21haW4gbmFtZSBNVVNUIG1hdGNoIHRoZSBwcmltYXJ5IGRvbWFpbiBuYW1lJyk7XG4gICAgfVxuXG4gICAgdGhpcy5fZG9jdW1lbnRSb290ID0gYC8ke2RvY3Jvb3R9YDtcbiAgfVxuICBzdGF0aWMgZ2V0IGRvY3VtZW50Um9vdCgpIHtcbiAgICByZXR1cm4gdGhpcy5fZG9jdW1lbnRSb290IHx8ICcvJztcbiAgfVxuXG4gIC8qKlxuICAgKiAoZ2V0dGVyL3NldHRlcikgUHJvdmlkZXMgYW4gZXJyb3IgaWYgdGhlIHVzZXIgdHJpZXMgdG8gc2V0IHRoZSBoaXN0b3J5IG9iamVjdFxuICAgKiByZXR1cm5zIHRoZSB3aW5kb3cgaGlzdG9yeSBvYmplY3RcbiAgICpcbiAgICogQHR5cGUge29iamVjdH1cbiAgICovXG4gIHN0YXRpYyBzZXQgaGlzdG9yeShoaXN0b3J5KSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdUaGUgaGlzdG9yeSBvYmplY3QgaXMgcmVhZCBvbmx5Jyk7XG4gIH1cbiAgc3RhdGljIGdldCBoaXN0b3J5KCkge1xuICAgIHJldHVybiB3aW5kb3cuaGlzdG9yeTtcbiAgfVxuXG4gIC8qKlxuICAgKiAoZ2V0dGVyL3NldHRlcikgU2V0cyB0aGUgdG9wIGxldmVsIGRvbWFpbiBuYW1lLlxuICAgKiByZXR1cm5zIHRoZSByZWNvcmRlZCBUTEROIG9yLCBieSBkZWZhdWx0LCB3aW5kb3cubG9jYXRpb24uaG9zdG5hbWUuXG4gICAqXG4gICAqIEB0eXBlIHtzdHJpbmd9XG4gICAqL1xuICBzdGF0aWMgc2V0IFRMRE4oVExETikge1xuICAgIC8vIEBub3RlIFdlIHNob3VsZCBpbmNsdWRlIHNvbWUgZXJyb3IgY2hlY2tpbmcgaW4gaGVyZVxuICAgIHRoaXMuX1RMRE4gPSBUTEROO1xuICB9XG4gIHN0YXRpYyBnZXQgVExETigpIHtcbiAgICByZXR1cm4gdGhpcy5fVExETiB8fCB3aW5kb3cubG9jYXRpb24uaG9zdG5hbWU7XG4gIH1cblxuICAvKipcbiAgICogKGdldHRlci9zZXR0ZXIpIHdoZXRoZXIgdG8gb2JzZXJ2ZSB0aGUgVExETiBvciBgdHJ1ZWAgKGRlZmF1bHQpLlxuICAgKlxuICAgKiBAZGVmYXVsdCB0cnVlXG4gICAqIEB0eXBlIHtib29sZWFufVxuICAgKi9cbiAgc3RhdGljIHNldCBvYnNlcnZlVExETihvYnNlcnZlKSB7XG4gICAgLy8gQ2hlY2sgdG8gbWFrZSBzdXJlIHRoYXQgdGhlIGJhc3NlZCB2YWx1ZSBpcyBvZiB0eXBlIGJvb2xlYW4uXG4gICAgaWYodHlwZW9mIG9ic2VydmUgPT09ICdib29sZWFuJylcbiAgICB7XG4gICAgICB0aGlzLl9vYnNlcnZlVExETiA9IG9ic2VydmU7XG4gICAgfSBlbHNlXG4gICAge1xuICAgICAgY29uc29sZS53YXJuKCdvYnNlcnZlVExETiBtdXN0IGJlIG9mIHR5cGUgYm9vbGVhbicpO1xuICAgIH1cbiAgfVxuICBzdGF0aWMgZ2V0IG9ic2VydmVUTEROKCkge1xuICAgIGlmKHR5cGVvZiB0aGlzLl9vYnNlcnZlVExETiA9PT0gJ2Jvb2xlYW4nKVxuICAgIHtcbiAgICAgIHJldHVybiB0aGlzLl9vYnNlcnZlVExETjtcbiAgICB9IGVsc2VcbiAgICB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogKGdldHRlci9zZXR0ZXIpIFdoZXRoZXIgdGhpcyBoaXN0b3J5IG9iamVjdCBpcyBpbiBkZXZtb2RlLiBEZWZhdWx0cyB0byBmYWxzZVxuICAgKlxuICAgKiBAZGVmYXVsdCBmYWxzZVxuICAgKiBAdHlwZSB7Ym9vbGVhbn1cbiAgICovXG4gIHN0YXRpYyBzZXQgZGV2bW9kZShkZXZtb2RlKSB7XG4gICAgLy8gQ2hlY2sgdG8gbWFrZSBzdXJlIHRoYXQgdGhlIGJhc3NlZCB2YWx1ZSBpcyBvZiB0eXBlIGJvb2xlYW4uXG4gICAgaWYodHlwZW9mIGRldm1vZGUgPT09ICdib29sZWFuJylcbiAgICB7XG4gICAgICB0aGlzLl9kZXZtb2RlID0gZGV2bW9kZTtcbiAgICB9IGVsc2VcbiAgICB7XG4gICAgICBjb25zb2xlLndhcm4oJ2Rldm1vZGUgbXVzdCBiZSBvZiB0eXBlIGJvb2xlYW4nKTtcbiAgICB9XG4gIH1cbiAgc3RhdGljIGdldCBkZXZtb2RlKCkge1xuICAgIGlmKHR5cGVvZiB0aGlzLl9kZXZtb2RlID09PSAnYm9vbGVhbicpXG4gICAge1xuICAgICAgcmV0dXJuIHRoaXMuX2Rldm1vZGU7XG4gICAgfSBlbHNlXG4gICAge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiAoZ2V0dGVyL3NldHRlcikgV2hldGhlciB0aGlzIGhpc3Rvcnkgb2JqZWN0IGlzIGluaXRpYWxpYXNlZC5cbiAgICpcbiAgICogQGRlZmF1bHQgZmFsc2VcbiAgICogQHR5cGUge2Jvb2xlYW59XG4gICAqL1xuICBzdGF0aWMgc2V0IGluaXRpYWxpYXNlZChpbml0aWFsaWFzZWQpIHtcbiAgICAvLyBDaGVjayB0byBtYWtlIHN1cmUgdGhhdCB0aGUgYmFzc2VkIHZhbHVlIGlzIG9mIHR5cGUgYm9vbGVhbi5cbiAgICBpZih0eXBlb2YgaW5pdGlhbGlhc2VkID09PSAnYm9vbGVhbicpXG4gICAge1xuICAgICAgdGhpcy5faW5pdGlhbGlhc2VkID0gaW5pdGlhbGlhc2VkO1xuICAgIH0gZWxzZVxuICAgIHtcbiAgICAgIGNvbnNvbGUud2FybignaW5pdGlhbGlhc2VkIG11c3QgYmUgb2YgdHlwZSBib29sZWFuJyk7XG4gICAgfVxuICB9XG4gIHN0YXRpYyBnZXQgaW5pdGlhbGlhc2VkKCkge1xuICAgIGlmKHR5cGVvZiB0aGlzLl9pbml0aWFsaWFzZWQgPT09ICdib29sZWFuJylcbiAgICB7XG4gICAgICByZXR1cm4gdGhpcy5faW5pdGlhbGlhc2VkO1xuICAgIH0gZWxzZVxuICAgIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogKGdldHRlci9zZXR0ZXIpIFdoZXRoZXIgaGlzdG9yeSBpcyBzdXBwb3J0ZWQgYnkgdGhlIGJyb3dzZXIgb3IgZGV2aWNlLlxuICAgKiBQcm92aWRlcyBhbiBlcnJvciBpZiB0aGUgdXNlciB0cmllcyB0byBzZXQgdGhlIHN1cHBvcnQgdmFsdWUsIHVubGVzcyB0aGUgb2JqZWN0IGlzIGluIGRldm1vZGVcbiAgICpcbiAgICogQHR5cGUge2Jvb2xlYW59XG4gICAqL1xuICBzdGF0aWMgc2V0IHN1cHBvcnQoc3VwcG9ydCA9IGZhbHNlKSB7XG4gICAgLy8gVGhpcyBvdmVycmlkZXNcbiAgICBpZiggdGhpcy5kZXZtb2RlICYmIHR5cGVvZiBzdXBwb3J0ID09PSAnYm9vbGVhbicgKSB7XG4gICAgICB0aGlzLl9zdXBwb3J0ID0gc3VwcG9ydDtcbiAgICB9XG4gICAgdGhyb3cgbmV3IEVycm9yKCdUaGUgc3VwcG9ydCBpcyByZWFkIG9ubHknKTtcbiAgfVxuICBzdGF0aWMgZ2V0IHN1cHBvcnQoKSB7XG4gICAgcmV0dXJuICh3aW5kb3cuaGlzdG9yeSAmJiB3aW5kb3cuaGlzdG9yeS5wdXNoU3RhdGUpO1xuICB9XG5cbiAgLyoqXG4gICAqIChnZXR0ZXIvc2V0dGVyKSBUaGUgbGVuZ3RoIG9mIHRoZSBoaXN0b3J5IHN0YWNrXG4gICAqXG4gICAqIEB0eXBlIHtpbnRlZ2VyfVxuICAgKi9cbiAgc3RhdGljIGdldCBsZW5ndGgoKSB7XG4gICAgcmV0dXJuIHRoaXMuaGlzdG9yeS5sZW5ndGg7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgSGlzdG9yeTtcbiJdfQ==
