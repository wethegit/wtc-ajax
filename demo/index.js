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
      _wtcUtilityHelpers2.default.removeClass(transClass + '-in-end', DOMTarget);
      _wtcUtilityHelpers2.default.removeClass(transClass + '-in', DOMTarget);
      _wtcUtilityHelpers2.default.removeClass(transClass + '-in-start', DOMTarget);
      _wtcUtilityHelpers2.default.addClass(transClass + '-out-start', DOMTarget);
      _wtcUtilityHelpers2.default.addClass(transClass + '-out', DOMTarget);
      // Add the animation end listener to the target node
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
                // Find the target node
                var targetNode = resolver.DOMTarget;
                // Modify its classes
                _wtcUtilityHelpers2.default.removeClass(this.classBaseTransition + '-out-start', targetNode);
                _wtcUtilityHelpers2.default.addClass(this.classBaseTransition + '-out-end', targetNode);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJkZW1vL3J1bi5qcyIsIm5vZGVfbW9kdWxlcy93dGMtdXRpbGl0eS1oZWxwZXJzL2Rpc3Qvd3RjLXV0aWxpdHktaGVscGVycy5qcyIsInNyYy93dGMtQW5pbWF0aW9uRXZlbnRzLmpzIiwic3JjL3d0Yy1hamF4LmpzIiwic3JjL3d0Yy1oaXN0b3J5LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUNBQTs7QUFFQTtBQUNBLGNBQUssSUFBTCxDQUFVLElBQVY7QUFDQTtBQUNBLGNBQUssWUFBTCxHQUFvQixRQUFwQjs7QUFFQSxTQUFTLEtBQVQsQ0FBZSxFQUFmLEVBQW1CO0FBQ2pCLE1BQUksU0FBUyxVQUFULElBQXVCLFNBQTNCLEVBQXNDO0FBQ3BDO0FBQ0QsR0FGRCxNQUVPO0FBQ0wsYUFBUyxnQkFBVCxDQUEwQixrQkFBMUIsRUFBOEMsRUFBOUM7QUFDRDtBQUNGOztBQUVELE1BQU0sWUFDTjtBQUNFO0FBQ0EsZ0JBQUssU0FBTDs7QUFFQSxnQkFBSyxjQUFMLEdBQXNCLElBQXRCLENBSkYsQ0FJOEI7O0FBRTVCO0FBQ0E7QUFDQSxTQUFPLGdCQUFQLENBQXdCLE1BQXhCLEVBQWdDLFVBQVMsQ0FBVCxFQUFZO0FBQzFDLGFBQVMsY0FBVCxDQUF3QixRQUF4QixFQUFrQyxnQkFBbEMsQ0FBbUQsT0FBbkQsRUFBNEQsVUFBUyxDQUFULEVBQVk7QUFDdEUsb0JBQ0UsT0FERixDQUNVLGtCQURWLEVBQzhCLGVBRDlCLEVBQytDLGtCQUQvQyxFQUNtRSxFQUFFLE1BRHJFLEVBRUUsSUFGRixDQUVPLFVBQVMsUUFBVCxFQUFtQjtBQUN0QjtBQUNBLGVBQU8sUUFBUDtBQUNELE9BTEg7QUFNRCxLQVBEO0FBUUQsR0FURDtBQVVELENBbkJEOztBQXFCQSxPQUFPLE9BQVA7OztBQ3BDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNB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TyxFQUFTO0FBQzFCO0FBQ0EsVUFBRyxPQUFPLE9BQVAsS0FBbUIsU0FBdEIsRUFDQTtBQUNFLGFBQUssUUFBTCxHQUFnQixPQUFoQjtBQUNELE9BSEQsTUFJQTtBQUNFLGdCQUFRLElBQVIsQ0FBYSxpQ0FBYjtBQUNEO0FBQ0YsSzt3QkFDb0I7QUFDbkIsVUFBRyxPQUFPLEtBQUssUUFBWixLQUF5QixTQUE1QixFQUNBO0FBQ0UsZUFBTyxLQUFLLFFBQVo7QUFDRCxPQUhELE1BSUE7QUFDRSxlQUFPLEtBQVA7QUFDRDtBQUNGOztBQUVEOzs7Ozs7Ozs7c0JBTXdCLFksRUFBYztBQUNwQztBQUNBLFVBQUcsT0FBTyxZQUFQLEtBQXdCLFNBQTNCLEVBQ0E7QUFDRSxhQUFLLGFBQUwsR0FBcUIsWUFBckI7QUFDRCxPQUhELE1BSUE7QUFDRSxnQkFBUSxJQUFSLENBQWEsc0NBQWI7QUFDRDtBQUNGLEs7d0JBQ3lCO0FBQ3hCLFVBQUcsT0FBTyxLQUFLLGFBQVosS0FBOEIsU0FBakMsRUFDQTtBQUNFLGVBQU8sS0FBSyxhQUFaO0FBQ0QsT0FIRCxNQUlBO0FBQ0UsZUFBTyxLQUFQO0FBQ0Q7QUFDRjs7QUFFRDs7Ozs7Ozs7O3dCQU1vQztBQUFBLFVBQWpCLE9BQWlCLHVFQUFQLEtBQU87O0FBQ2xDO0FBQ0EsVUFBSSxLQUFLLE9BQUwsSUFBZ0IsT0FBTyxPQUFQLEtBQW1CLFNBQXZDLEVBQW1EO0FBQ2pELGFBQUssUUFBTCxHQUFnQixPQUFoQjtBQUNEO0FBQ0QsWUFBTSxJQUFJLEtBQUosQ0FBVSwwQkFBVixDQUFOO0FBQ0QsSzt3QkFDb0I7QUFDbkIsYUFBUSxPQUFPLE9BQVAsSUFBa0IsT0FBTyxPQUFQLENBQWUsU0FBekM7QUFDRDs7QUFFRDs7Ozs7Ozs7d0JBS29CO0FBQ2xCLGFBQU8sS0FBSyxPQUFMLENBQWEsTUFBcEI7QUFDRDs7Ozs7O2tCQUdZLE8iLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiaW1wb3J0IHsgQUpBWCB9IGZyb20gXCIuLi9zcmMvd3RjLWFqYXhcIjtcblxuLy8gSW5pdGlhbGlzZSB0aGUgaGlzdG9yeSBvYmplY3QgaW4gZGV2IG1vZGVcbkFKQVguaW5pdCh0cnVlKTtcbi8vIFNldCB0aGUgZG9jdW1lbnQgcm9vdCBmb3IgdGhlIGFwcGxpY2F0aW9uIChpZiBuZWNlc3NhcnkpXG5BSkFYLmRvY3VtZW50Um9vdCA9ICcvZGVtby8nO1xuXG5mdW5jdGlvbiByZWFkeShmbikge1xuICBpZiAoZG9jdW1lbnQucmVhZHlTdGF0ZSAhPSAnbG9hZGluZycpIHtcbiAgICBmbigpO1xuICB9IGVsc2Uge1xuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ0RPTUNvbnRlbnRMb2FkZWQnLCBmbik7XG4gIH1cbn1cblxucmVhZHkoZnVuY3Rpb24oKVxue1xuICAvLyBUaGlzIGluaXRpYWxpc2VzIGFueSBsaW5rcyB3aXRoIEFKQVggYXR0cmlidXRlc1xuICBBSkFYLmluaXRMaW5rcygpO1xuXG4gIEFKQVgucmVzb2x2ZVRpbWVvdXQgPSAxMDAwOyAvLyBSZW1vdmUgdGhpcyB3aGVuIG5vdCBcblxuICAvLyBUaGlzIGlzIGEgbWFudWFsIGluaXRpYWxpc2F0aW9uIG9mIGxpbmtzIGFuZCBpcywgaW5zdGVhZCwgYSBkZW1vbnN0cmF0aW9uXG4gIC8vIG9mIGhvdyBwcm9ncmFtYXRpYyBBSkFYIHJldHJpZXZhbCB3b3Jrcy5cbiAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCBmdW5jdGlvbihlKSB7XG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2xpbmtfMScpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oZSkge1xuICAgICAgQUpBWC5cbiAgICAgICAgYWpheEdldChcIi9kZW1vL3BhZ2UxLmh0bWxcIiwgXCIjbGluazEtdGFyZ2V0XCIsIFwiLmxpbmsxLXNlbGVjdGlvblwiLCBlLnRhcmdldCkuXG4gICAgICAgIHRoZW4oZnVuY3Rpb24ocmVzb2x2ZXIpIHtcbiAgICAgICAgICAvLyBjb25zb2xlLmxvZygnb25Mb2FkJywgcmVzb2x2ZXIpO1xuICAgICAgICAgIHJldHVybiByZXNvbHZlcjtcbiAgICAgICAgfSk7XG4gICAgfSk7XG4gIH0pO1xufSk7XG5cbndpbmRvdy5BSkFYT2JqID0gQUpBWDtcbiIsIlwidXNlIHN0cmljdFwiO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuXG52YXIgX3R5cGVvZiA9IHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiB0eXBlb2YgU3ltYm9sLml0ZXJhdG9yID09PSBcInN5bWJvbFwiID8gZnVuY3Rpb24gKG9iaikgeyByZXR1cm4gdHlwZW9mIG9iajsgfSA6IGZ1bmN0aW9uIChvYmopIHsgcmV0dXJuIG9iaiAmJiB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgb2JqLmNvbnN0cnVjdG9yID09PSBTeW1ib2wgJiYgb2JqICE9PSBTeW1ib2wucHJvdG90eXBlID8gXCJzeW1ib2xcIiA6IHR5cGVvZiBvYmo7IH07XG5cbnZhciB1dGlsaXRpZXMgPSB7fTtcblxuLyoqXG4gKiByYW5kb21CZXR3ZWVuXG4gKiBHZW5lcmF0ZSBhIHJhbmRvbSBpbnRlZ2VyIG51bWJlciBtYXggYW5kIG1pbi5cbiAqIEBtaW4ge251bWJlcn0gTWluaW11bSB2YWx1ZS5cbiAqIEBtYXgge251bWJlcn0gTWF4aW11bSB2YWx1ZS5cbiAqIHJldHVybiB7bnVtYmVyfSBSYW5kb20gaW50ZWdlci5cbiAqL1xudXRpbGl0aWVzLnJhbmRvbUJldHdlZW4gPSBmdW5jdGlvbiAobWluLCBtYXgpIHtcbiAgcmV0dXJuIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIChtYXggLSBtaW4gKyAxKSArIG1pbik7XG59O1xuXG4vKipcbiAqIGdldFN0eWxlXG4gKiBHZXQgdGhlIGN1cnJlbnQgc3R5bGUgdmFsdWUgZnJvbSBhbiBlbGVtZW50LlxuICogQGVsIHtET01Ob2RlfSBUYXJnZXQgZWxlbWVudC5cbiAqIEBwcm9wIHtzdHJpbmd9IENTUyBwcm9wZXJ0eSBuYW1lLlxuICogQHN0cmlwVW5pdCB7Ym9vbGVhbn0gUmVtb3ZlIHVuaXRzLlxuICogcmV0dXJuIHtzdHJpbmd9IEN1cnJlbnQgQ1NTIHZhbHVlIFdJVEggdW5pdC5cbiAqL1xudXRpbGl0aWVzLmdldFN0eWxlID0gZnVuY3Rpb24gKGVsLCBwcm9wLCBzdHJpcFVuaXQpIHtcbiAgdmFyIHN0clZhbHVlID0gXCJcIjtcblxuICBpZiAod2luZG93LmdldENvbXB1dGVkU3R5bGUpIHtcbiAgICBzdHJWYWx1ZSA9IGdldENvbXB1dGVkU3R5bGUoZWwpLmdldFByb3BlcnR5VmFsdWUocHJvcCk7XG4gIH1cbiAgLy9JRVxuICBlbHNlIGlmIChlbC5jdXJyZW50U3R5bGUpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIHN0clZhbHVlID0gZWwuY3VycmVudFN0eWxlW3Byb3BdO1xuICAgICAgfSBjYXRjaCAoZSkge31cbiAgICB9XG5cbiAgaWYgKHN0cmlwVW5pdCkge1xuICAgIHN0clZhbHVlID0gcGFyc2VJbnQoc3RyVmFsdWUpO1xuICB9XG5cbiAgcmV0dXJuIHN0clZhbHVlO1xufTtcblxuLyoqXG4gKiBMb2dcbiAqIFNpbXBsZSBsb2cgZnVuY3Rpb24gdG8gc2hvdyBkaWZmZXJlbnQgY29sb3JzIG9uIHRoZSBjb25zb2xlLlxuICogQHN0YXR1cyB7c3RyaW5nfSBTdGF0dXMgdHlwZS5cbiAqIEBtc2cge3N0cmluZ30gTWVzc2FnZSB0byBzaG93LlxuICovXG51dGlsaXRpZXMubG9nID0gZnVuY3Rpb24gKHN0YXR1cywgbXNnKSB7XG4gIHZhciBiZ2MsIGNvbG9yO1xuXG4gIHN3aXRjaCAoc3RhdHVzKSB7XG4gICAgY2FzZSBcInN1Y2Nlc3NcIjpcbiAgICAgIGNvbG9yID0gXCJHcmVlblwiO1xuICAgICAgYmdjID0gXCJMaW1lR3JlZW5cIjtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJpbmZvXCI6XG4gICAgICBjb2xvciA9IFwiRG9kZ2VyQmx1ZVwiO1xuICAgICAgYmdjID0gXCJUdXJxdW9pc2VcIjtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgXCJlcnJvclwiOlxuICAgICAgY29sb3IgPSBcIkJsYWNrXCI7XG4gICAgICBiZ2MgPSBcIlJlZFwiO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcIndhcm5pbmdcIjpcbiAgICAgIGNvbG9yID0gXCJUb21hdG9cIjtcbiAgICAgIGJnYyA9IFwiR29sZFwiO1xuICAgICAgYnJlYWs7XG4gICAgZGVmYXVsdDpcbiAgICAgIGNvbG9yID0gXCJibGFja1wiO1xuICAgICAgYmdjID0gXCJXaGl0ZVwiO1xuICB9XG5cbiAgaWYgKCh0eXBlb2YgbXNnID09PSBcInVuZGVmaW5lZFwiID8gXCJ1bmRlZmluZWRcIiA6IF90eXBlb2YobXNnKSkgPT09IFwib2JqZWN0XCIpIHtcbiAgICBjb25zb2xlLmxvZyhtc2cpO1xuICB9IGVsc2Uge1xuICAgIGNvbnNvbGUubG9nKFwiJWNcIiArIG1zZywgXCJjb2xvcjpcIiArIGNvbG9yICsgXCI7Zm9udC13ZWlnaHQ6Ym9sZDsgYmFja2dyb3VuZC1jb2xvcjogXCIgKyBiZ2MgKyBcIjtcIik7XG4gIH1cbn07XG5cbi8qKlxuICogb25jZVxuICogRmlyZXMgYW4gZXZlbnQgb25seSBvbmNlIGFuZCBleGVjdXRlcyB0aGUgY2FsbGJhY2suXG4gKiBAbm9kZSB7RE9NRWxlbWVudH0gRG9tIGVsZW1lbnQgdG8gYXR0YWNoIGV2ZW50LlxuICogQHR5cGUge1N0cmluZ30gVHlwZSBvZiBldmVudC5cbiAqIEBjYWxsYmFjayB7ZnVuY3Rpb259IENhbGxiYWNrLlxuICovXG51dGlsaXRpZXMub25jZSA9IGZ1bmN0aW9uIChub2RlLCB0eXBlLCBjYWxsYmFjaykge1xuICBub2RlLmFkZEV2ZW50TGlzdGVuZXIodHlwZSwgZnVuY3Rpb24gKGUpIHtcbiAgICBlLnRhcmdldC5yZW1vdmVFdmVudExpc3RlbmVyKGUudHlwZSwgYXJndW1lbnRzLmNhbGxlZSk7XG4gICAgcmV0dXJuIGNhbGxiYWNrKGUpO1xuICB9KTtcbn07XG5cbi8qKlxuICogc2h1ZmZsZUFycmF5XG4gKiBTaHVmZmxlIGFuIGFycmF5LlxuICogQGFycmF5IEFycnJheSB0byBiZSBzaHVmZmxlZC5cbiAqIHJldHVybiB7YXJyYXl9IFNodWZmbGVkIGFycmF5LlxuICovXG51dGlsaXRpZXMuc2h1ZmZsZUFycmF5ID0gZnVuY3Rpb24gKGFycmF5KSB7XG4gIHZhciBjdXJyZW50SW5kZXggPSBhcnJheS5sZW5ndGgsXG4gICAgICB0ZW1wb3JhcnlWYWx1ZSxcbiAgICAgIHJhbmRvbUluZGV4O1xuXG4gIC8vIFdoaWxlIHRoZXJlIHJlbWFpbiBlbGVtZW50cyB0byBzaHVmZmxlLi4uXG4gIHdoaWxlICgwICE9PSBjdXJyZW50SW5kZXgpIHtcblxuICAgIC8vIFBpY2sgYSByZW1haW5pbmcgZWxlbWVudC4uLlxuICAgIHJhbmRvbUluZGV4ID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogY3VycmVudEluZGV4KTtcbiAgICBjdXJyZW50SW5kZXggLT0gMTtcblxuICAgIC8vIEFuZCBzd2FwIGl0IHdpdGggdGhlIGN1cnJlbnQgZWxlbWVudC5cbiAgICB0ZW1wb3JhcnlWYWx1ZSA9IGFycmF5W2N1cnJlbnRJbmRleF07XG4gICAgYXJyYXlbY3VycmVudEluZGV4XSA9IGFycmF5W3JhbmRvbUluZGV4XTtcbiAgICBhcnJheVtyYW5kb21JbmRleF0gPSB0ZW1wb3JhcnlWYWx1ZTtcbiAgfVxuXG4gIHJldHVybiBhcnJheTtcbn07XG5cbi8qKlxuICogZmlyZUN1c3RvbUV2ZW50XG4gKiBGaXJlIGEgY3VzdG9tIGV2ZW50LlxuICogQG5hbWUge3N0cmluZ30gTmFtZSBvZiB0aGUgZXZlbnQuXG4gKiBAZGF0YSB7b2JqZWN0fSBPYmplY3QgdG8gYmUgcGFzc2VkIHRvIHRoZSBldmVudC5cbiAqL1xudXRpbGl0aWVzLmZpcmVDdXN0b21FdmVudCA9IGZ1bmN0aW9uIChuYW1lLCBkYXRhLCBidWJibGVzLCBjYW5jZWxhYmxlKSB7XG4gIHZhciBldjtcbiAgdmFyIHBhcmFtcyA9IHtcbiAgICBidWJibGVzOiBidWJibGVzIHx8IHRydWUsXG4gICAgY2FuY2VsYWJsZTogY2FuY2VsYWJsZSB8fCB0cnVlLFxuICAgIGRldGFpbDogZGF0YSB8fCBudWxsXG4gIH07XG5cbiAgaWYgKHR5cGVvZiB3aW5kb3cuQ3VzdG9tRXZlbnQgPT09IFwiZnVuY3Rpb25cIikge1xuICAgIGV2ID0gbmV3IEN1c3RvbUV2ZW50KG5hbWUsIHBhcmFtcyk7XG4gIH0gZWxzZSB7XG4gICAgZXYgPSBkb2N1bWVudC5jcmVhdGVFdmVudCgnQ3VzdG9tRXZlbnQnKTtcbiAgICBldi5pbml0Q3VzdG9tRXZlbnQobmFtZSwgcGFyYW1zLmJ1YmJsZXMsIHBhcmFtcy5jYW5jZWxhYmxlLCBwYXJhbXMuZGV0YWlsKTtcbiAgfVxuXG4gIHdpbmRvdy5kaXNwYXRjaEV2ZW50KGV2KTtcbn07XG5cbi8qKlxuICogZm9yRWFjaE5vZGVcbiAqIExvb3AgdGhyb3VnaCBhbmQgYXJyYXkgb2YgRE9NIGVsZW1lbnRzLlxuICogQGFycmF5IHtET00gTm9kZSBMaXN0fSBMaXN0IG9mIGVsZW1lbnRzLlxuICogQGNhbGxiYWNrIHtmdW5jdGlvbn0gQ2FsbGJhY2suXG4gKiBAc2NvcGUgKm9wdGlvbmFsIHtmdW5jdGlvbn0gU2NvcGUgdG8gcGFzcyB0byBjYWxsYmFjay5cbiAqL1xudXRpbGl0aWVzLmZvckVhY2hOb2RlID0gZnVuY3Rpb24gKGFycmF5LCBjYWxsYmFjaywgc2NvcGUpIHtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcnJheS5sZW5ndGg7IGkrKykge1xuICAgIGNhbGxiYWNrLmNhbGwoc2NvcGUsIGksIGFycmF5W2ldKTsgLy8gcGFzc2VzIGJhY2sgc3R1ZmYgd2UgbmVlZFxuICB9XG59O1xuXG4vKipcbiAqIGdldEVsZW1lbnRQb3NpdGlvblxuICogR2V0IHRoZSBwb3NpdGlvbiBvZiB0aGUgZWxlbWVudCByZWxhdGl2ZSB0byBkb2N1bWVudC5cbiAqIEBlbGVtZW50IHtET00gTm9kZX0gRWxlbWVudC5cbiAqIHJldHVybnMgT2JqZWN0IHdpdGggZWxlbWVudCBjb29yZGluYXRlcy5cbiAqL1xudXRpbGl0aWVzLmdldEVsZW1lbnRQb3NpdGlvbiA9IGZ1bmN0aW9uIChlbGVtZW50KSB7XG4gIHZhciBwb3NpdGlvblRvVmlld3BvcnQgPSBlbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuXG4gIHZhciBzY3JvbGxUb3AgPSB3aW5kb3cucGFnZVlPZmZzZXQ7XG4gIHZhciBzY3JvbGxMZWZ0ID0gd2luZG93LnBhZ2VYT2Zmc2V0O1xuXG4gIHZhciBjbGllbnRUb3AgPSBkb2N1bWVudC5ib2R5LmNsaWVudFRvcCB8fCAwO1xuICB2YXIgY2xpZW50TGVmdCA9IGRvY3VtZW50LmJvZHkuY2xpZW50TGVmdCB8fCAwO1xuXG4gIHZhciB0b3AgPSBwb3NpdGlvblRvVmlld3BvcnQudG9wICsgc2Nyb2xsVG9wIC0gY2xpZW50VG9wO1xuICB2YXIgbGVmdCA9IHBvc2l0aW9uVG9WaWV3cG9ydC5sZWZ0ICsgc2Nyb2xsTGVmdCAtIGNsaWVudExlZnQ7XG5cbiAgcmV0dXJuIHtcbiAgICB0b3A6IE1hdGgucm91bmQodG9wKSxcbiAgICBsZWZ0OiBNYXRoLnJvdW5kKGxlZnQpXG4gIH07XG59O1xuXG4vKipcbiAqIGdldFZpZXdwb3J0RGltZW5zaW9uc1xuICogR2V0IHRoZSBicm93c2VyIHdpbmRvdyBzaXplLlxuICogcmV0dW5zIE9iamVjdCB3aXRoIGRpbWVuc2lvbnMuXG4gKi9cbnV0aWxpdGllcy5nZXRWaWV3cG9ydERpbWVuc2lvbnMgPSBmdW5jdGlvbiAoKSB7XG4gIHJldHVybiB7XG4gICAgd2lkdGg6IE1hdGgubWF4KGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGllbnRXaWR0aCwgd2luZG93LmlubmVyV2lkdGggfHwgMCksXG4gICAgaGVpZ2h0OiBNYXRoLm1heChkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xpZW50SGVpZ2h0LCB3aW5kb3cuaW5uZXJIZWlnaHQgfHwgMClcbiAgfTtcbn07XG5cbi8qKlxuICogY2xhc3NFeHRlbmRcbiAqIEV4dGVuZHMgYSBwYXJlbnQgY2xhc3MuXG4gKiBAY2hpbGQge2Z1bmN0aW9ufSBDaGlsZCBjbGFzcy5cbiAqIEBwYXJlbnQge2Z1bmN0aW9ufSBQYXJlbnQgY2xhc3MuXG4gKiByZXR1cm5zIHVwZGF0ZWQgQ2hpbGQgY2xhc3M7XG4gKi9cbnV0aWxpdGllcy5jbGFzc0V4dGVuZCA9IGZ1bmN0aW9uIChjaGlsZCwgcGFyZW50KSB7XG4gIHZhciBoYXNQcm9wID0ge30uaGFzT3duUHJvcGVydHk7XG5cbiAgZm9yICh2YXIga2V5IGluIHBhcmVudCkge1xuICAgIGlmIChoYXNQcm9wLmNhbGwocGFyZW50LCBrZXkpKSBjaGlsZFtrZXldID0gcGFyZW50W2tleV07XG4gIH1cblxuICBmdW5jdGlvbiBjdG9yKCkge1xuICAgIHRoaXMuY29uc3RydWN0b3IgPSBjaGlsZDtcbiAgfVxuXG4gIGN0b3IucHJvdG90eXBlID0gcGFyZW50LnByb3RvdHlwZTtcbiAgY2hpbGQucHJvdG90eXBlID0gbmV3IGN0b3IoKTtcbiAgY2hpbGQuX19zdXBlcl9fID0gcGFyZW50LnByb3RvdHlwZTtcblxuICByZXR1cm4gY2hpbGQ7XG59O1xuXG4vKipcbiAqIEhhc0NsYXNzXG4gKiBDaGVja3MgZm9yIGNsYXNzIG9uIGVsZW1lbnQuXG4gKiBAY2wge3N0cmluZ30gTmFtZXMuIFlvdSBjYW4gc3BsaXQgdGhlIG5hbWVzIHdpdGggYSBzcGFjZVxuICogQGUge0RPTSBFbGVtZW50fSBFbGVtZW50XG4gKi9cbnV0aWxpdGllcy5oYXNDbGFzcyA9IGZ1bmN0aW9uIChjbCwgZSkge1xuXG4gIHZhciBjLCBjbGFzc2VzLCBpLCBqLCBsZW4sIGxlbjE7XG4gIGNsYXNzZXMgPSBjbC5zcGxpdCgnICcpO1xuXG4gIGlmIChlLmNsYXNzTGlzdCkge1xuICAgIGZvciAoaSA9IDAsIGxlbiA9IGNsYXNzZXMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgIGMgPSBjbGFzc2VzW2ldO1xuICAgICAgaWYgKGUuY2xhc3NMaXN0LmNvbnRhaW5zKGMpID09PSB0cnVlKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBmb3IgKGogPSAwLCBsZW4xID0gY2xhc3Nlcy5sZW5ndGg7IGogPCBsZW4xOyBqKyspIHtcbiAgICAgIGMgPSBjbGFzc2VzW2pdO1xuICAgICAgaWYgKG5ldyBSZWdFeHAoJyhefCApJyArIGMgKyAnKCB8JCknLCAnZ2knKS50ZXN0KGUuYykpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGZhbHNlO1xufTtcblxuLyoqXG4gKiBSZW1vdmVDbGFzc1xuICogUmVtb3ZlIGNsYXNzIGZyb20gZWxlbWVudC5cbiAqIEBjIHtzdHJpbmd9IG5hbWUgb2YgdGhlIGNsYXNzXG4gKiBAZSB7RE9NIEVsZW1lbnR9IEVsZW1lbnRcbiAqL1xudXRpbGl0aWVzLnJlbW92ZUNsYXNzID0gZnVuY3Rpb24gKGMsIGUpIHtcblxuICB2YXIgY2xhc3NlcywgaSwgaiwgbGVuLCBsZW4xO1xuICBjbGFzc2VzID0gYy5zcGxpdCgnICcpO1xuICBpZiAoZS5jbGFzc0xpc3QpIHtcbiAgICBmb3IgKGkgPSAwLCBsZW4gPSBjbGFzc2VzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICBjID0gY2xhc3Nlc1tpXTtcbiAgICAgIGUuY2xhc3NMaXN0LnJlbW92ZShjKTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgZm9yIChqID0gMCwgbGVuMSA9IGNsYXNzZXMubGVuZ3RoOyBqIDwgbGVuMTsgaisrKSB7XG4gICAgICBjID0gY2xhc3Nlc1tqXTtcbiAgICAgIGUuY2xhc3NOYW1lID0gZS5jbGFzc05hbWUucmVwbGFjZShuZXcgUmVnRXhwKCcoXnxcXFxcYiknICsgYy5zcGxpdCgnICcpLmpvaW4oJ3wnKSArICcoXFxcXGJ8JCknLCAnZ2knKSwgJyAnKTtcbiAgICB9XG4gIH1cbn07XG5cbi8qKlxuICogQWRkQ2xhc3NcbiAqIEFkZCBjbGFzcyB0byBlbGVtZW50LlxuICogQGMge3N0cmluZ30gTmFtZSBvZiB0aGUgY2xhc3NcbiAqIEBlIHtET00gRWxlbWVudH0gRWxlbWVudFxuICovXG51dGlsaXRpZXMuYWRkQ2xhc3MgPSBmdW5jdGlvbiAoYywgZSkge1xuXG4gIHZhciBjbGFzc2VzLCBpLCBqLCBsZW4sIGxlbjE7XG4gIGNsYXNzZXMgPSBjLnNwbGl0KCcgJyk7XG5cbiAgaWYgKGUuY2xhc3NMaXN0KSB7XG4gICAgZm9yIChpID0gMCwgbGVuID0gY2xhc3Nlcy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgYyA9IGNsYXNzZXNbaV07XG4gICAgICBlLmNsYXNzTGlzdC5hZGQoYyk7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIGZvciAoaiA9IDAsIGxlbjEgPSBjbGFzc2VzLmxlbmd0aDsgaiA8IGxlbjE7IGorKykge1xuICAgICAgYyA9IGNsYXNzZXNbal07XG4gICAgICBlLmNsYXNzTmFtZSArPSAnICcgKyBjO1xuICAgIH1cbiAgfVxufTtcblxuLyoqXG4gKiBHZXRTaWJsaW5nc1xuICogR2V0IHNpYmxpbmdzIGZyb20gZWxlbWVudFxuICogQGUge0RPTSBFbGVtZW50fSBFbGVtZW50XG4gKiBAcmV0dXJuIEFycmF5IG9mIERPTSBFbGVtZW50c1xuICovXG51dGlsaXRpZXMuZ2V0U2libGluZ3MgPSBmdW5jdGlvbiAoZSkge1xuXG4gIHJldHVybiBBcnJheS5wcm90b3R5cGUuZmlsdGVyLmNhbGwoZS5wYXJlbnROb2RlLmNoaWxkcmVuLCBmdW5jdGlvbiAoY2hpbGQpIHtcbiAgICByZXR1cm4gY2hpbGQgIT09IGU7XG4gIH0pO1xufTtcblxuLyoqXG4gKiBGdW5jdGlvbiB0byBub3JtYWxpemUgdGhlIHNlbGN0b3IgJ21hdGNoZXNTZWxlY3RvcicgYWNyb3NzIGJyb3dzZXJzXG4gKi9cbnV0aWxpdGllcy5tYXRjaGVzID0gZnVuY3Rpb24gKCkge1xuXG4gIHZhciBkb2MsIG1hdGNoZXM7XG4gIGRvYyA9IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudDtcbiAgbWF0Y2hlcyA9IGRvYy5tYXRjaGVzU2VsZWN0b3IgfHwgZG9jLndlYmtpdE1hdGNoZXNTZWxlY3RvciB8fCBkb2MubW96TWF0Y2hlc1NlbGVjdG9yIHx8IGRvYy5vTWF0Y2hlc1NlbGVjdG9yIHx8IGRvYy5tc01hdGNoZXNTZWxlY3RvcjtcblxuICByZXR1cm4gbWF0Y2hlcztcbn07XG5cbi8qKlxuICogRXh0ZW5kXG4gKiBTaW1pbGFyIHRvIGpxdWVyeS5leHRlbmQsIGl0IGFwcGVuZHMgdGhlIHByb3BlcnRpZXMgZnJvbSAnb3B0aW9ucycgdG8gZGVmYXVsdCBhbmQgb3ZlcndyaXRlIHRoZSBvbmVzIHRoYXQgYWxyZWFkeSBleGlzdCBpbiAnZGVmYXVsdHMnXG4gKiBAZGVmYXVsdHMge09iamVjdH0gRGVmYXVsdCB2YWx1ZXNcbiAqIEBvcHRpb25zIHtPYmplY3R9IE5ldyB2YWx1ZXNcbiAqL1xudXRpbGl0aWVzLmV4dGVuZCA9IGZ1bmN0aW9uIChkZWZhdWx0cywgb3B0aW9ucykge1xuXG4gIHZhciBleHRlbmRlZCA9IHt9LFxuICAgICAga2V5ID0gbnVsbDtcblxuICBmb3IgKGtleSBpbiBkZWZhdWx0cykge1xuICAgIGlmIChkZWZhdWx0cy5oYXNPd25Qcm9wZXJ0eShrZXkpKSBleHRlbmRlZFtrZXldID0gZGVmYXVsdHNba2V5XTtcbiAgfVxuXG4gIGZvciAoa2V5IGluIG9wdGlvbnMpIHtcbiAgICBpZiAob3B0aW9ucy5oYXNPd25Qcm9wZXJ0eShrZXkpKSBleHRlbmRlZFtrZXldID0gb3B0aW9uc1trZXldO1xuICB9XG5cbiAgcmV0dXJuIGV4dGVuZGVkO1xufTtcblxuLyoqXG4gKiBSZXR1cm5zIHRoZSBDU1Mgc2VsZWN0b3IgZm9yIGEgcHJvdmlkZWQgZWxlbWVudFxuICpcbiAqIEBzdGF0aWNcbiAqIEBwYXJhbSAge0RPTUVsZW1lbnR9ICAgZWwgICAgICAgICBUaGUgRE9NIG5vZGUgdG8gZmluZCBhIHNlbGVjdG9yIGZvclxuICogQHJldHVybiB7U3RyaW5nfSAgICAgICAgICAgICAgICAgIFRoZSBDU1Mgc2VsZWN0b3IgdGhlIGRlc2NyaWJlcyBleGFjdGx5IHdoZXJlIHRvIGZpbmQgdGhlIGVsZW1lbnRcbiAqL1xudXRpbGl0aWVzLmdldFNlbGVjdG9yRm9yRWxlbWVudCA9IGZ1bmN0aW9uIChlbCkge1xuICB2YXIgcGFydGljbGVzID0gW107XG4gIHdoaWxlIChlbC5wYXJlbnROb2RlKSB7XG4gICAgaWYgKGVsLmlkKSB7XG4gICAgICBwYXJ0aWNsZXMudW5zaGlmdCgnIycgKyBlbC5pZCk7XG4gICAgICBicmVhaztcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKGVsID09IGVsLm93bmVyRG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50KSBwYXJ0aWNsZXMudW5zaGlmdChlbC50YWdOYW1lKTtlbHNlIHtcbiAgICAgICAgZm9yICh2YXIgYyA9IDEsIGUgPSBlbDsgZS5wcmV2aW91c0VsZW1lbnRTaWJsaW5nOyBlID0gZS5wcmV2aW91c0VsZW1lbnRTaWJsaW5nLCBjKyspIHt9XG4gICAgICAgIHBhcnRpY2xlcy51bnNoaWZ0KGVsLnRhZ05hbWUgKyBcIjpudGgtY2hpbGQoXCIgKyBjICsgXCIpXCIpO1xuICAgICAgfVxuICAgICAgZWwgPSBlbC5wYXJlbnROb2RlO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcGFydGljbGVzLmpvaW4oXCIgPiBcIik7XG59O1xuXG5leHBvcnRzLmRlZmF1bHQgPSB1dGlsaXRpZXM7IiwiXG4vKipcbiAqIFRoaXMgbW9kdWxlIFByb3ZpZGVzIGFuaW1hdGlvbiBkZXRlY3Rpb24gYW5kIHBzZXVkby1saXN0ZW5lciBmdW5jdGlvbmFsaXR5XG4gKlxuICogQG1vZHVsZSB3dGMtQW5pbWF0aW9uRXZlbnRzXG4gKiBAZXhwb3J0cyBBbmltYXRpb25cbiAqL1xuXG5cbi8qKlxuICogVGhpcyBmdW5jdGlvbiB0YWtlcyBhIG5vZGUgYW5kIGRldGVybWluZXMgdGhlIGZ1bGwgZW5kIHRpbWUgb2YgYW55IHRyYW5zaXRpb25zXG4gKiBvbiBpdC4gUmV0dXJucyB0aGUgdGltZSBpbiBtaWxsaXNlY29uZHMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSAgIHtIVE1MRWxlbWVudH0gbm9kZSAgVGhlIG5vZGUgbyBkZXRleHQgdGhlIHRyYW5zaXRpb24gdGltZSBmb3IuXG4gKiBAcmV0dXJuICB7TnVtYmVyfSAgICAgICAgICAgIFRoZSBmdWxsIHRyYW5zaXRpb24gdGltZSBmb3IgdGhlIG5vZGUsIGluY2x1ZGluZyBkZWxheXMsIGluIG1pbGxpc2Vjb25kc1xuICovXG52YXIgZGV0ZWN0QW5pbWF0aW9uRW5kVGltZSA9IGZ1bmN0aW9uKG5vZGUpXG57XG4gIHZhciBmdWxsdGltZSA9IDA7XG4gIHZhciB0aW1lUmVnZXggPSAvKFxcZCtcXC4/KFxcZCspPykoc3xtcykvO1xuICB2YXIgcmVjdXJzaXZlTG9vcCA9IGZ1bmN0aW9uKGVsKSB7XG4gICAgaWYoZWwgaW5zdGFuY2VvZiBFbGVtZW50KSB7XG4gICAgICB2YXIgdGltZWJyZWFrZG93biA9IHRpbWVSZWdleC5leGVjKHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGVsKS50cmFuc2l0aW9uRHVyYXRpb24pXG4gICAgICB2YXIgZGVsYXlicmVha2Rvd24gPSB0aW1lUmVnZXguZXhlYyh3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShlbCkudHJhbnNpdGlvbkRlbGF5KVxuICAgICAgdmFyIHRpbWUgPSB0aW1lYnJlYWtkb3duWzFdICogKHRpbWVicmVha2Rvd25bM10gPT0gJ3MnID8gMTAwMCA6IDEpXG4gICAgICB2YXIgZGVsYXkgPSBkZWxheWJyZWFrZG93blsxXSAqIChkZWxheWJyZWFrZG93blszXSA9PSAncycgPyAxMDAwIDogMSlcbiAgICAgIGlmKHRpbWUgKyBkZWxheSA+IGZ1bGx0aW1lKSB7XG4gICAgICAgIGZ1bGx0aW1lID0gdGltZSArIGRlbGF5XG4gICAgICB9XG4gICAgfVxuICAgIGlmKGVsLmNoaWxkTm9kZXMpIHtcbiAgICAgIGZvcih2YXIgaSBpbiBlbC5jaGlsZE5vZGVzKSB7XG4gICAgICAgIHJlY3Vyc2l2ZUxvb3AoZWwuY2hpbGROb2Rlc1tpXSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmVjdXJzaXZlTG9vcChub2RlKTtcblxuICBpZih0eXBlb2YgZnVsbHRpbWUgIT09ICdudW1iZXInKSB7XG4gICAgZnVsbHRpbWUgPSAwO1xuICB9XG5cbiAgcmV0dXJuIGZ1bGx0aW1lO1xufVxuXG4vKipcbiAqIFRoZSByZXNvbHZpbmcgb2JqZWN0IGZvciB0aGUge0BsaW5rIHd0Yy1BbmltYXRpb25FdmVudHMuYWRkRW5kRXZlbnRMaXN0ZW5lcn1cbiAqXG4gKiBAY2FsbGJhY2sgdGltZXJSZXNvbHZlXG4gKiBAcGFyYW0ge3N0cmluZ30gcmVzcG9uc2UgICAgICAgICAgIFRoZSByZXNwb25zZSBmcm9tIHRoZSBBSkFYIGNhbGxcbiAqIEBwYXJhbSB7YXJyYXl9IGFyZ3VtZW50cyAgICAgICAgICAgVGhlIGFyZ3VtZW50cyBhcnJheSBvcmlnaW5hbGx5IHBhc3NlZCB0byB0aGUge0BsaW5rIEFKQVguYWpheEdldH0gbWV0aG9kXG4gKiBAcGFyYW0ge0RPTUVsZW1lbnR9IGxpbmtUYXJnZXQgICAgIFRoZSB0YXJnZXQgZWxlbWVudCB0aGF0IGZpcmVkIHRoZSB7QGxpbmsgQUpBWC5hamF4R2V0fVxuICovXG5cbi8qKlxuICogQWxsb3dzIHVzIHRvIGFkZCBhbiBlbmQgZXZlbnQgbGlzdGVuZXIgdG8gdGhlIG5vZGUuXG4gKlxuICogQHBhcmFtICB7SFRNTEVsZW1lbnR9ICBub2RlICAgICAgVGhlIGVsZW1lbnQgdG8gYXR0YWNoIHRoZSBlbmQgZXZlbnQgbGlzdGVuZXIgdG9cbiAqIEBwYXJhbSAge2Z1bmN0aW9ufSAgICAgbGlzdGVuZXIgIFRoZSBmdW5jdGlvbiB0byBydW4gd2hlbiB0aGUgYW5pbWF0aW9uIGlzIGZpbmlzaGVkLiBUaGlzIGFsbG93cyB1cyB0byBjb25zdHJ1Y3QgYW4gb2JqZWN0IHRvIHBhc3MgYmFjayB0aHJvdWdoIHRoZSBwcm9taXNlIGNoYWluIG9mIHRoZSBwYXJlbnQuXG4gKiBAcmV0dXJuIHtQcm9taXNlfSAgICAgICAgICAgICAgICBBIHByb21pc2UgdGhhdCByZXByZXNlbnRzIHRoZSBhbmltYXRpb24gdGltZW91dC5cbiAqIEByZXR1cm4ge3RpbWVyUmVzb2x2ZX0gICAgICAgICAgIFRoZSByZXNvbHZlIG1ldGhvZC4gUGFzc2VzIHRoZSBjb2VyY2VkIHZhcmlhYmxlcyAoaWYgYW55KSBmcm9tIHRoZSBsaXN0ZW5pbmcgb2JqZWN0IGJhY2sgdG8gdGhlIGNoYWluLlxuICogQHJldHVybiB7dGltZXJSZWplY3R9ICAgICAgICAgICAgVGhlIHJlamVjdCBtZXRob2QuIE51bGwuXG4gKi9cbnZhciBhZGRFbmRFdmVudExpc3RlbmVyID0gZnVuY3Rpb24obm9kZSwgbGlzdGVuZXIpIHtcbiAgaWYodHlwZW9mIGxpc3RlbmVyICE9PSAnZnVuY3Rpb24nKVxuICB7XG4gICAgdmFyIGxpc3RlbmVyID0gZnVuY3Rpb24oKXsgcmV0dXJuIHt9IH07XG4gIH1cbiAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuICAgIHZhciB0aW1lID0gZGV0ZWN0QW5pbWF0aW9uRW5kVGltZShub2RlKTtcbiAgICB2YXIgdGltZW91dCA9IHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgcmV0dXJuZXIgPSBsaXN0ZW5lcigpO1xuICAgICAgcmV0dXJuZXIudGltZSA9IHRpbWU7XG4gICAgICByZXNvbHZlKHJldHVybmVyKTtcbiAgICB9LCB0aW1lKTtcbiAgfSk7XG59XG5cbi8qKlxuICogVGhlIGFuaW1hdGlvbiBvYmplY3QgZW5jYXBzdWxhdGVzIGFsbCBvZiB0aGUgYmFzaWMgZnVuY3Rpb25hbGl0eSB0aGF0IGFsbG93cyB1c1xuICogdG8gZGV0ZWN0IGFuaW1hdGlvbiBldGMuXG4gKlxuICogQGV4cG9ydFxuICovXG52YXIgQW5pbWF0aW9uID0ge1xuICBhZGRFbmRFdmVudExpc3RlbmVyOiBhZGRFbmRFdmVudExpc3RlbmVyXG59O1xuXG5cbmV4cG9ydCBkZWZhdWx0IEFuaW1hdGlvbjtcbiIsImltcG9ydCBIaXN0b3J5IGZyb20gXCIuL3d0Yy1oaXN0b3J5XCI7XG5pbXBvcnQgQW5pbWF0aW9uIGZyb20gXCIuL3d0Yy1BbmltYXRpb25FdmVudHNcIjtcbmltcG9ydCBfdSBmcm9tICd3dGMtdXRpbGl0eS1oZWxwZXJzJztcblxuY29uc3QgU1RBVEVTID0ge1xuICAnT0snICAgICAgICAgICAgICAgIDogMCxcbiAgJ0NMSUNLRUQnICAgICAgICAgICA6IDEsXG4gICdMT0FESU5HJyAgICAgICAgICAgOiAyLFxuICAnVFJBTlNJVElPTklORycgICAgIDogNCxcbiAgJ0xPQURFRCcgICAgICAgICAgICA6IDhcbn1cblxuY29uc3QgU0VMRUNUT1JTID0ge1xuICAnQ0hJTERSRU4nICAgICAgICAgIDogMCAvLyBUaGlzIGluZGljYXRlcyB0aGF0IHRoZSBzZWxlY3Rpb24gc2hvdWxkIGJlIGFsbCBjaGlsZHJlbi4gVGhpcyBhc3N1bWVzIHRoYXQgd2UgaGF2ZSBhIHZhbGlkIHRhcmdldCB0byB3b3JrIHdpdGguXG59XG5cbmNvbnN0IEVSUk9SUyA9IHtcbiAgJ0dFTkVSSUNfRVJST1InICAgICA6IDAsXG4gICdCQURfUFJPTUlTRScgICAgICAgOiAxLFxuICAnTE9BRF9FUlJPUicgICAgICAgIDogMlxufVxuXG4vKipcbiAqIEFuIEFKQVggY2xhc3MgdGhhdCBwaWNrcyB1cCBvbiBsaW5rcyBhbmQgdHVybnMgdGhlbSBpbnRvIEFKQVggbGlua3MuXG4gKlxuICogVGhpcyBjbGFzcyBhc3N1bWVzIHRoYXQgeW91IHdhbnQgdG8gcnVuIHlvdXIgQUpBWCB2aWEgaHRtbCBhdHRyaWJ1dGVzIG9uIHlvdXIgbGlua3NcbiAqIGFuZCB0aGF0IHlvdXIgd2Vic2l0ZSBjYW4gcnVuIGp1c3QgYXMgd2VsbCB3aXRob3V0IHRoZXNlIGxpbmtzLiBJdCBzaG91bGQgYWxzb1xuICogcHJvdmlkZSBhZGRpdGlvbmFsIGZ1bmN0aW9uYWxpdHkgdGhhdCBhbGxvd3MgdGhlIGNsYXNzIHRvIHJ1biBwcm9ncmFtYXRpY2FsbHksXG4gKiB0aGVyZWJ5IGdpdmluZyB0aGUgcHJvZ3JhbW1lciB0aGUgYWJpbGl0eSBhbmQgb3B0aW9ucyB0byBjcmVhdGUgdGhlIHdlYnNvdGVcbiAqIGhvd2V2ZXIgdGhleSB3YW50IHRvLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBuYW1lc3BhY2VcbiAqIEBleHRlbmRzIEhpc3RvcnlcbiAqIEBhdXRob3IgTGlhbSBFZ2FuIDxsaWFtQHdldGhlY29sbGVjdGl2ZS5jb20+XG4gKiBAdmVyc2lvbiAwLjVcbiAqIEBjcmVhdGVkIE5vdiAxOSwgMjAxNlxuICovXG5jbGFzcyBBSkFYIGV4dGVuZHMgSGlzdG9yeSB7XG5cbiAgLyoqXG4gICAqIFB1YmxpYyBtZXRob2RzXG4gICAqL1xuXG4gIC8qKlxuICAgKiBJbml0aWFsaXNlIHRoZSBsaW5rcyBpbiB0aGUgZG9jdW1lbnQuXG4gICAqXG4gICAqIFRoaXMgd2lsbCBsb29rIHRocm91Z2ggdGhlIGxpbmtzIGluIHRoZSBkb2N1bWVudCBhcyBkZW5vdGVkIGJ5IHRoZSBhdHRyaWJ1dGVBamF4XG4gICAqIHByb3BlcnR5IGFuZCBhcHBseSBhIGNsaWNrIGxpc3RlbmVyIHRvIGl0IHRoYXQgd2lsbCBhdHRlbXB0IHRvIGRldGVybWluZSB3aGF0XG4gICAqIGFuZCBob3cgdG8gbG9hZC5cbiAgICpcbiAgICogQSBzaW1wbGUgbWVjaGFuc2ltIGZvciB0aGlzIHdvdWxkIGJlIHNvbWV0aGluZyBsaWtlOlxuICAgKiBgYGBcbiAgICAgPGEgaHJlZj1cInBhZ2UxLmh0bWxcIlxuICAgICAgICBkYXRhLXd0Yy1hamF4PVwidHJ1ZVwiXG4gICAgICAgIGRhdGEtd3RjLWFqYXgtdGFyZ2V0PScjbGluazItdGFyZ2V0J1xuICAgICAgICBkYXRhLXd0Yy1hamF4LXNlbGVjdGlvbj1cIi5saW5rMS1zZWxlY3Rpb25cIlxuICAgICAgICBkYXRhLXd0Yy1hamF4LXNob3VsZC1uYXZpZ2F0ZT1cImZhbHNlXCI+TGluayAxPC9hPlxuICAgKiBgYGBcbiAgICpcbiAgICogVGhlIGFkdHJpYnV0ZXMgZXF1YXRlIGFzIGZvbGxvd3M6XG4gICAqIC0gKCphdHRyaWJ1dGVBamF4KikgKipkYXRhLXd0Yy1hamF4KipcbiAgICpcbiAgICogICAgRGVub3RlcyB0aGF0IHRoaXMgbGluayBpcyBhbiBBSkFYIGxpbmsuXG4gICAqIC0gKCphdHRyaWJ1dGVUYXJnZXQqKSAqKmRhdGEtd3RjLWFqYXgtdGFyZ2V0KipcbiAgICpcbiAgICogICAgRGVub3RlcyB0aGUgdGFyZ2V0IGludG8gd2hpY2ggdG8gbG9hZCB0aGUgcmVzdWx0LiBTaG91bGQgdGFrZSB0aGUgZm9ybSBvZiBhIHNlbGVjdG9yLlxuICAgKiAtICgqYXR0cmlidXRlU2VsZWN0aW9uKikgKipkYXRhLXd0Yy1hamF4LXNlbGVjdGlvbioqXG4gICAqXG4gICAqICAgIERlbm90ZXMgdGhlIHNlbGVjdGlvbiBvZiBkYXRhIHRvIHB1bGwgZnJvbSB0aGUgbG9hZGVkIGRvY3VtZW50LiBTaG91bGQgdGFrZSB0aGUgZm9ybSBvZiBhIHNlbGVjdG9yLlxuICAgKiAtICgqYXR0cmlidXRlU2hvdWxkTmF2aWdhdGUqKSAqKmRhdGEtd3RjLWFqYXgtc2hvdWxkLW5hdmlnYXRlKipcbiAgICpcbiAgICogICAgKipUcnVlKiogLyBGYWxzZSBhcyB0byB3aGV0aGVyIHRoZSBsaW5rIHNob3VsZCB1cGRhdGUgdGhlIGhpc3Rvcnkgb2JqZWN0LiBPbmx5IG5lY2Vzc2FyeSBpZiBmYWxzZS5cbiAgICpcbiAgICogSW4gYWRkaXRpb24sICphdHRyaWJ1dGVUYXJnZXQqIGFuZCAqYXR0cmlidXRlU2VsZWN0aW9uKiBhY2NlcHQgYmFzaWMgSlNPTiBzeW50YXhcbiAgICogc28gdGhhdCB5b3UgY2FuIGxvYWQgbW9sdGlwbGUgcGllY2VzIG9mIGNvbnRlbnQgZnJvbSB0aGUgc291cmNlLlxuICAgKlxuICAgKiBAc3RhdGljXG4gICAqIEBwYXJhbSAge0RPTUVsZW1lbnR9IHJvb3REb2N1bWVudCAgVGhlIERPTSBlbGVtZW50IHRvIGZpbmQgbGlua3MgaW4uIERlZmF1bHRzIHRvIGJvZHkuXG4gICAqL1xuICBzdGF0aWMgaW5pdExpbmtzKHJvb3REb2N1bWVudCA9IGRvY3VtZW50LmJvZHkpIHtcbiAgICBjb25zdCBsaW5rcyA9IHJvb3REb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKGBbJHt0aGlzLmF0dHJpYnV0ZUFqYXh9PVwidHJ1ZVwiXWApO1xuXG4gICAgbGlua3MuZm9yRWFjaCgobGluayk9PiB7XG4gICAgICAvLyBSZW1vdmluZyB0aGlzIGF0dHJpYnV0ZSBlbnN1cmVzIHRoYXQgdGhpcyBsaW5rIGRvZXNuJ3QgZ2V0IGEgc2Vjb25kIEFKQVggbGlzdGVuZXIgYXR0YWNoZWQgdG8gaXQuXG4gICAgICBsaW5rLnJlbW92ZUF0dHJpYnV0ZSh0aGlzLmF0dHJpYnV0ZUFqYXgpO1xuXG4gICAgICBsaW5rLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGUpPT4ge1xuICAgICAgICB0aGlzLl90cmlnZ2VyQWpheExpbmsoZSk7XG5cbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgfSk7XG4gICAgICBjb25zb2xlLmxvZyhsaW5rKTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUgcmVzb2x2aW5nIG9iamVjdC4gVGhpcyBpcyB0aGUgb2JqZWN0IHRoYXQgaXMgcGFzc2VkIHRvIEFKQVggR0VUIHByb21pc2UgdGhlbnNcbiAgICogYW5kIHNob3VsZCBiZSBwYXNzZWQgb250byBzdWJzZXF1ZW50IFRIRU5hYmxlIGNhbGxzLlxuICAgKlxuICAgKiBAdHlwZWRlZiB7T2JqZWN0fSAgICAgICAgICAgICAgICAgICAgIEFKQVhHZXRSZXNvbHZlclxuICAgKiBAcHJvcGVydHkge3N0cmluZ30gICAgICAgcmVzcG9uc2UgICAgIFRoZSByZXNwb25zZSBmcm9tIHRoZSBBSkFYIGNhbGxcbiAgICogQHByb3BlcnR5IHtBSkFYRG9jdW1lbnR9IGRvY3VtZW50ICAgICBUaGUgZG9jdW1lbnQgbm9kZXMgcmVzdWx0aW5nIGZyb20gdGhpcyBjYWxsLlxuICAgKiBAcHJvcGVydHkge2FycmF5fSAgICAgICAgYXJndW1lbnRzICAgIFRoZSBhcmd1bWVudHMgYXJyYXkgb3JpZ2luYWxseSBwYXNzZWQgdG8gdGhlIHtAbGluayBBSkFYLmFqYXhHZXR9IG1ldGhvZFxuICAgKiBAcHJvcGVydHkge0RPTUVsZW1lbnR9ICAgbGlua1RhcmdldCAgIFRoZSB0YXJnZXQgZWxlbWVudCB0aGF0IGZpcmVkIHRoZSB7QGxpbmsgQUpBWC5hamF4R2V0fVxuICAgKi9cbiAgLyoqXG4gICAqIFRoaXMgaXMgdGhlIG91dHB1dCBvZiBhbGwgZXZlbnR1YWwgQUpBWCBjYWxscy4gVGhpcyBvYmplY3QgcmVwcmVzZW50cyB0aGUgcmVzdWx0XG4gICAqIG9mIHRoZSBBSkFYIGNhbGwgYW5kIGNvbnRhaW5zIGJvdGggdGhlIGZ1bGwgSFRNTCBkb2N1bWVudCBhbmQgdGhlIHNlbGVjdGVkIHN1YmRvYy5cbiAgICpcbiAgICogQHR5cGVkZWYge09iamVjdH0gICAgICAgICAgICAgIEFKQVhEb2N1bWVudFxuICAgKiBAcHJvcGVydHkge0RPTUVsZW1lbnR9IGRvYyAgICAgVGhlIGZ1bGwgZG9jdW1lbnQgbm9kZSBmb3IgdGhlIEFKQVggR0VUIHJlc3VsdFxuICAgKiBAcHJvcGVydHkge05vZGVMaXN0fSAgIHN1YmRvYyAgVGhlIHN1YmRvY3VtZW50IGRlcml2ZWQgZnJvbSB0aGUgbWFpbiBkb2N1bWVudFxuICAgKi9cbiAgLyoqXG4gICAqIENhbGxiYWNrIGZvciBBSkFYIEdFVCBvbmxvYWQuIFRoaXMgaXMgY2FsbGVkIHdoZW4gdGhlIGNvbnRlbnQgaXMgbG9hZGVkLlxuICAgKlxuICAgKiBAY2FsbGJhY2sgbG9hZFJlc29sdmVcbiAgICogQHBhcmFtIHtBSkFYR2V0UmVzb2x2ZXJ9IHJlc29sdmVyICBUaGUgcmVzb2x2aW5nIG9iamVjdCBmb3IgdGhlIEFKQVggcmVxdWVzdFxuICAgKiBAcmV0dXJuIHtBSkFYR2V0UmVzb2x2ZXJ9ICAgICAgICAgIFRoZSBvbmdvaW5nIHJlc29sdmluZyBvYmplY3QgZm9yIHRoZSBBSkFYIHJlcXVlc3RcbiAgICovXG4gIC8qKlxuICAgKiBDYWxsYmFjayBmb3IgQUpBWCBHRVQgZXJyb3IuIFRoaXMgaXMgY2FsbGVkIHdoZW4gYW4gZXJyb3Igb2NjdXJzIGFmdGVyXG4gICAqIGNhbGxpbmcgYW4gYWpheCBHRVQuXG4gICAqXG4gICAqIEBjYWxsYmFjayBsb2FkUmVqZWN0XG4gICAqIEBwYXJhbSB7b2JqZWN0fSBlcnJvciAgICAgICAgICAgICAgVGhlIGVycm9yIHRoYXQgb2NjdXJyZWRcbiAgICogQHBhcmFtIHthcnJheX0gYXJncyAgICAgICAgICAgICAgICBUaGUgYXJndW1lbnRzIHRoYXQgd2VyZSBwYXNzZWQgdG8gdGhlIHJlcXVlc3RcbiAgICogQHBhcmFtIHtET01FbGVtZW50fSBbdGFyZ2V0TGlua10gICBUaGUgbGluayB0aGF0IHNwYXduZWQgdGhlIGFqYXggcmVxdWVzdFxuICAgKi9cblxuICAvKipcbiAgICogVGhpcyBidWlsZHMgb3V0IGFuIEFKQVggcmVxdWVzdCwgbm9ybWFsbHkgYmFzZWQgb24gdGhlIGNsaWNraW5nIG9mIGEgbGluayxcbiAgICogYnV0IGl0IGNhbiBhbHRlcm5hdGl2ZWx5IGJlIGNhbGxlZCBkaXJlY3RseSBvbiB0aGUgQUpBWCBvYmplY3QuXG4gICAqXG4gICAqIEBzdGF0aWNcbiAgICogQHBhcmFtICB7c3RyaW5nfSBVUkwgICAgICAgICAgICAgICAgICAgICBUaGUgVVJMIHRvIGdldC4gVGhpcyB3aWxsIGJlIHBhcnNlZCBpbnRvIGFuIGFwcHJvcHJpYXRlIGZvbWF0IGJ5IHRoZSBvYmplY3QuXG4gICAqIEBwYXJhbSAge3N0cmluZ30gdGFyZ2V0ICAgICAgICAgICAgICAgICAgVGhlIHRhcmdldCBmb3IgdGhlIGxvYWRlZCBjb250ZW50LiBUaGlzIGNhbiBiZSBhIHN0cmluZyAoc2VsZWN0b3IpLCBvciBhIEpTT04gYXJyYXkgb2Ygc2VsZWN0b3Igc3RyaW5ncy5cbiAgICogQHBhcmFtICB7c3RyaW5nfSBzZWxlY3Rpb24gICAgICAgICAgICAgICBUaGlzIGlzIGEgc2VsZWN0b3IgKG9yIEpTT04gb2Ygc2VsZWN0b3JzKSB0aGF0IGRldGVybWluZXMgd2hhdCB0byBjdXQgZnJvbSB0aGUgbG9hZGVkIGNvbnRlbnQuXG4gICAqIEBwYXJhbSAge0RPTUVsZW1lbnR9IFtsaW5rVGFyZ2V0XSAgICAgICAgVGhlIHRhcmdldCBvZiB0aGUgbGluay4gVGhpcyBpcyB1c2VmdWwgZm9yIHNldHRpbmcgYWN0aXZlIHN0YXRlcyBpbiBjYWxsYmFjay5cbiAgICogQHBhcmFtICB7Ym9vbGVhbn0gZnJvbVBvcCAgICAgICAgICAgICAgICBJbmRpY2F0ZXMgdGhhdCB0aGlzIEdFVCBpcyBmcm9tIGEgcG9wXG4gICAqIEBwYXJhbSAge29iamVjdH0gW2RhdGEgPSB7fV0gICAgICAgICAgICAgVGhlIGRhdGEgdG8gcGFzcyB0byB0aGUgQUpBWCBjYWxsLlxuICAgKiBAcmV0dXJuIHtQcm9taXNlfSAgICAgICAgICAgICAgICAgICAgICAgIEEgcHJvbWlzZSB0aGF0IHJlcHJlc2VudHMgdGhlIEdFVC5cbiAgICogQHJldHVybiB7bG9hZFJlc29sdmV9ICAgICAgICAgICAgICAgICAgICBUaGUgcmVzb2x2ZSBtZXRob2QuIFBhc3NlcyB0aGUgbG9hZGVkIGNvbnRlbnQgZG93biB0aHJvdWdoIGl0J3MgdGhlbmFibGVzLCBmaW5hbGx5IHJlc29sdmluZyB0byB0aGUgcGFyc2UgY29tbWVuZCB2aWEgYSBzZWNvbmQsIHByaXZhdGUgUHJvbWlzZS5cbiAgICogQHJldHVybiB7bG9hZFJlamVjdH0gICAgICAgICAgICAgICAgICAgICBUaGUgcmVqZWN0IG1ldGhvZC4gUmVzdWx0cyBpbiBhbiBlcnJvclxuICAgKi9cbiAgc3RhdGljIGFqYXhHZXQoVVJMLCB0YXJnZXQsIHNlbGVjdGlvbiwgbGlua1RhcmdldCwgZnJvbVBvcCA9IGZhbHNlLCBkYXRhID0ge30pIHtcblxuICAgIC8vIFNldCB0aGUgc3RhdGUgb2YgdGhlIEFKQVggY2xhc3MgdG8gY2xpY2tlZCwgaW5jaWRhdGluZyBzb21ldGhpbmcgaXMgbG9hZGluZ1xuICAgIGlmKCB0aGlzLnN0YXRlID4gU1RBVEVTLkNMSUNLRUQgKVxuICAgIHtcbiAgICAgIGlmKCB0aGlzLmRldm1vZGUgKVxuICAgICAge1xuICAgICAgICBjb25zb2xlLndhcm4oIFwiVHJpZWQgcnVuIGFuIEFKQVggR0VUIHdoZW4gdGhlIG9iamVjdCB3YXNuJ3QgaW4gT0sgb3IgQ0xJQ0tFRCBtb2RlXCIgKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIFJldHJpZXZlIGEgcmVxdWVzdCBvYmplY3QgYW5kIGNvbnN0cnVjdCBhIHZhbGlkIFVSTFxuICAgIGNvbnN0IHJlcSA9IHRoaXMucmVxdWVzdE9iamVjdDtcbiAgICBjb25zdCBwYXJzZWRVUkwgPSB0aGlzLl9maXhVUkwoVVJMKTtcbiAgICBjb25zdCBET01UYXJnZXQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKHRhcmdldClbMF07XG5cbiAgICB2YXIgcmVhZHlTdGF0ZSA9IDA7XG4gICAgdmFyIHN0YXR1cyA9IDA7XG4gICAgdmFyIGFyZ3MgPSBhcmd1bWVudHM7XG4gICAgdmFyIHRyYW5zQ2xhc3MgPSB0aGlzLmNsYXNzQmFzZVRyYW5zaXRpb247XG5cbiAgICBsZXQgdHJhbnNpdGlvblJ1biA9IGZhbHNlO1xuICAgIGxldCBsb2FkUnVuID0gZmFsc2U7XG4gICAgbGV0IHJlc29sdmVyID0gbnVsbDtcblxuICAgIC8vIEB0b2RvIG5lZWQgdG8gYWRkIHByb3BlciBlcnJvciBjaGVja2luZyBoZXJlLlxuXG4gICAgLy8gTW9kaWZ5IHRoZSBjbGFzc2VzIG9uIHRoZSBjb250YWluaW5nIGVsZW1lbnRcbiAgICBfdS5yZW1vdmVDbGFzcyh0cmFuc0NsYXNzKyctaW4tZW5kJywgRE9NVGFyZ2V0KTtcbiAgICBfdS5yZW1vdmVDbGFzcyh0cmFuc0NsYXNzKyctaW4nLCBET01UYXJnZXQpO1xuICAgIF91LnJlbW92ZUNsYXNzKHRyYW5zQ2xhc3MrJy1pbi1zdGFydCcsIERPTVRhcmdldCk7XG4gICAgX3UuYWRkQ2xhc3ModHJhbnNDbGFzcysnLW91dC1zdGFydCcsIERPTVRhcmdldCk7XG4gICAgX3UuYWRkQ2xhc3ModHJhbnNDbGFzcysnLW91dCcsIERPTVRhcmdldCk7XG4gICAgLy8gQWRkIHRoZSBhbmltYXRpb24gZW5kIGxpc3RlbmVyIHRvIHRoZSB0YXJnZXQgbm9kZVxuICAgIEFuaW1hdGlvbi5cbiAgICAgIGFkZEVuZEV2ZW50TGlzdGVuZXIoRE9NVGFyZ2V0KS5cbiAgICAgIHRoZW4oZnVuY3Rpb24oKSB7XG4gICAgICAgIHRyYW5zaXRpb25SdW4gPSB0cnVlO1xuICAgICAgfSk7XG5cbiAgICB2YXIgcmVxdWVzdFByb21pc2UgPSBuZXcgUHJvbWlzZShmdW5jdGlvbiBoYW5kbGVyKHJlc29sdmUsIHJlamVjdCkge1xuXG4gICAgICAvLyBMaXN0ZW4gZm9yIHRoZSByZWFkeSBzdGF0ZVxuICAgICAgcmVxLmFkZEV2ZW50TGlzdGVuZXIoJ3JlYWR5c3RhdGVjaGFuZ2UnLCAoZSkgPT4ge1xuICAgICAgICByZWFkeVN0YXRlID0gZS50YXJnZXQucmVhZHlTdGF0ZTtcbiAgICAgICAgc3RhdHVzID0gZS50YXJnZXQuc3RhdHVzO1xuICAgICAgfSk7XG5cbiAgICAgIC8vIExpc3RlbSBmb3IgdGhlIGxvYWQgZXZlbnRcbiAgICAgIHJlcS5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgKGUpID0+IHtcbiAgICAgICAgLy8gSWYgd2UgaGF2ZSBhIHJlYWR5IHN0YXRlIHRoYXQgaW5kaWNhdGVkIHRoYXQgdGhlIGxvYWQgd2FzIGEgc3VjY2VzcywgY29udGludWVcbiAgICAgICAgaWYoIHJlcS5zdGF0dXMgPj0gMjAwICYmIHJlcS5zdGF0dXMgPCA0MDAgKSB7XG4gICAgICAgICAgLy8gR2V0IHRoZSByZXF1ZXN0IHJlc3BvbnNlIHRleHRcbiAgICAgICAgICB2YXIgcmVzcG9uc2VUZXh0ID0gcmVxLnJlc3BvbnNlVGV4dFxuICAgICAgICAgIC8vIEdldCB0aGUgQUpBWERvY3VtZW50XG4gICAgICAgICAgdmFyIEFKQVhEb2N1bWVudCA9IHRoaXMuX3BhcnNlUmVzcG9uc2UocmVzcG9uc2VUZXh0LCB0YXJnZXQsIHNlbGVjdGlvbiwgZnJvbVBvcCwgbGlua1RhcmdldClcbiAgICAgICAgICAvLyBCdWlsZCB0aGUgcmVzb2x2ZXJcbiAgICAgICAgICB2YXIgcmVzb2x2ZXIgPSB7XG4gICAgICAgICAgICByZXNwb25zZVRleHQ6IHJlc3BvbnNlVGV4dCxcbiAgICAgICAgICAgIGRvY3VtZW50OiBBSkFYRG9jdW1lbnQsXG4gICAgICAgICAgICBhcmd1bWVudHM6IGFyZ3MsXG4gICAgICAgICAgICBsaW5rVGFyZ2V0OiBsaW5rVGFyZ2V0IHx8IG51bGwsXG4gICAgICAgICAgICBET01UYXJnZXQ6IERPTVRhcmdldFxuICAgICAgICAgIH1cbiAgICAgICAgICByZXNvbHZlKHJlc29sdmVyKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZWplY3QoRVJST1JTLkxPQURfRVJST1IpO1xuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgcmVxLmFkZEV2ZW50TGlzdGVuZXIoJ2Vycm9yJywgKGUpID0+IHtcbiAgICAgICAgcmVqZWN0KEVSUk9SUy5MT0FEX0VSUk9SKTtcbiAgICAgIH0pO1xuICAgIH0uYmluZCh0aGlzKSk7XG5cbiAgICAvLyBUaGlzIHByb21pc2UgdGFrZXMgdGhlIHJldHVybmVkIHByb21pc2UgYW5kIHJ1bnMgdGhlIGVxdWl2YWxlbnQgb2YgYSBcImZpbmFsbHlcIlxuICAgIFByb21pc2UuXG4gICAgICByZXNvbHZlKHJlcXVlc3RQcm9taXNlKS5cbiAgICAgIC8vIFRIRU46IHJlc3BvbnNpYmxlIGZvciBhZGRpbmcgdGhlIHRyYW5zaXRpb24gY2xhc3NlcywgdGhlbiBmaW5kaW5nIHRoZSB0cmFuc2l0aW9uIGxlbmd0aCBhbmQgcnV0aW5naW5nIHRoZSBwcm9taXNlIGZyb20gdGhhdFxuICAgICAgdGhlbiggZnVuY3Rpb24ocmVzb2x2ZXIpIHtcbiAgICAgICAgaWYocmVzb2x2ZXIuZXJyb3IpIHtcbiAgICAgICAgICB0aHJvdyByZXNvbHZlci5lcnJvclxuICAgICAgICB9IGVsc2UgaWYoIXJlc29sdmVyLnJlc3BvbnNlVGV4dCkge1xuICAgICAgICAgIHRocm93IEVSUk9SUy5CQURfUFJPTUlTRVxuICAgICAgICB9IGVsc2Uge1xuXG4gICAgICAgICAgLy8gbG9hZCBydW4gaXMgZG9uZSwgc28gc2V0IHRoZSB2YXJpYWJsZSB0byB0cnVlXG4gICAgICAgICAgbG9hZFJ1biA9IHRydWU7XG5cbiAgICAgICAgICAvLyBSZXNvbHZlIFByb21pcyB0byB0ZXN0LCBvbiBpbnRlcnZhbCwgd2hldGhlciB0aGUgdHJhbnNpdGlvbiBoYXNcbiAgICAgICAgICAvLyBjb21wbGV0ZWQuIFdoZW4gaXQgaGFzLCByZXNvbHZlIHRoZSBwcm9taXNlLlxuICAgICAgICAgIGxldCByZXNvbHZlID0gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgICAgICBsZXQgdGVzdEludGVydmFsID0gbnVsbDtcbiAgICAgICAgICAgIGxldCB0ZXN0UmVzb2x2ZWQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgaWYodHJhbnNpdGlvblJ1biA9PT0gdHJ1ZSlcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIC8vIEZpbmQgdGhlIHRhcmdldCBub2RlXG4gICAgICAgICAgICAgICAgbGV0IHRhcmdldE5vZGUgPSByZXNvbHZlci5ET01UYXJnZXQ7XG4gICAgICAgICAgICAgICAgLy8gTW9kaWZ5IGl0cyBjbGFzc2VzXG4gICAgICAgICAgICAgICAgX3UucmVtb3ZlQ2xhc3ModGhpcy5jbGFzc0Jhc2VUcmFuc2l0aW9uKyctb3V0LXN0YXJ0JywgdGFyZ2V0Tm9kZSk7XG4gICAgICAgICAgICAgICAgX3UuYWRkQ2xhc3ModGhpcy5jbGFzc0Jhc2VUcmFuc2l0aW9uKyctb3V0LWVuZCcsIHRhcmdldE5vZGUpO1xuICAgICAgICAgICAgICAgIC8vIENsZWFyIHRoZSBpbnRlcnZhbFxuICAgICAgICAgICAgICAgIGNsZWFySW50ZXJ2YWwodGVzdEludGVydmFsKTtcblxuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICByZXNvbHZlKHJlc29sdmVyKTtcbiAgICAgICAgICAgICAgICB9LCB0aGlzLnJlc29sdmVUaW1lb3V0KTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfS5iaW5kKHRoaXMpXG5cbiAgICAgICAgICAgIHRlc3RJbnRlcnZhbCA9IHNldEludGVydmFsKHRlc3RSZXNvbHZlZCwgNTApO1xuICAgICAgICAgIH0uYmluZCh0aGlzKSk7XG5cbiAgICAgICAgICByZXR1cm4gcmVzb2x2ZTtcbiAgICAgICAgfVxuICAgICAgfS5iaW5kKHRoaXMpKS5cbiAgICAgIC8vIFRIRU46IHJlc3BvbnNpYmxlIGZvciBhZGRpbmcgdGhlIGZpbmFsIGNvbnRlbnQgdG8gdGhlIG1haW4gZG9jdW1lbnQuIFJldHVybnMgYSBwcm9taXNlIHRoYXQgaWRlbnRpZmllcyB0aGUgdHJhbnNpdGlvblxuICAgICAgdGhlbihmdW5jdGlvbihyZXNvbHZlcikge1xuICAgICAgICAvLyBGaW5kIHRoZSB0YXJnZXQgbm9kZVxuICAgICAgICBsZXQgdGFyZ2V0Tm9kZSA9IHJlc29sdmVyLkRPTVRhcmdldDtcbiAgICAgICAgLy8gTW9kaWZ5IGl0cyBjbGFzc2VzXG4gICAgICAgIF91LnJlbW92ZUNsYXNzKHRoaXMuY2xhc3NCYXNlVHJhbnNpdGlvbisnLW91dC1lbmQnLCB0YXJnZXROb2RlKTtcbiAgICAgICAgX3UucmVtb3ZlQ2xhc3ModGhpcy5jbGFzc0Jhc2VUcmFuc2l0aW9uKyctb3V0JywgdGFyZ2V0Tm9kZSk7XG4gICAgICAgIF91LmFkZENsYXNzKHRoaXMuY2xhc3NCYXNlVHJhbnNpdGlvbisnLWluJywgdGFyZ2V0Tm9kZSk7XG4gICAgICAgIF91LmFkZENsYXNzKHRoaXMuY2xhc3NCYXNlVHJhbnNpdGlvbisnLWluLXN0YXJ0JywgdGFyZ2V0Tm9kZSk7XG4gICAgICAgIC8vIEZpbmFsbHkuIFBhcnNlIHRoZSByZXN1bHRcbiAgICAgICAgdGhpcy5fY29tcGxldGVUcmFuc2ZlcihyZXNvbHZlci5kb2N1bWVudCwgdGFyZ2V0Tm9kZSwgc2VsZWN0aW9uLCBmcm9tUG9wKTtcbiAgICAgICAgLy8gQWRkIHRoZSBhbmltYXRpb24gZW5kIGxpc3RlbmVyIHRvIHRoZSB0YXJnZXQgbm9kZVxuICAgICAgICByZXR1cm4gQW5pbWF0aW9uLmFkZEVuZEV2ZW50TGlzdGVuZXIodGFyZ2V0Tm9kZSwgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgcmV0dXJuIHJlc29sdmVyO1xuICAgICAgICB9KTtcbiAgICAgIH0uYmluZCh0aGlzKSkuXG4gICAgICAvLyBUSEVOOiBSZXNwb25zaWJsZSBmb3IgdGlkeWluZyBldmVyeXRoaW5nIHVwXG4gICAgICB0aGVuKGZ1bmN0aW9uKHJlc29sdmVyKSB7XG4gICAgICAgIC8vIEZpbmQgdGhlIHRhcmdldCBub2RlXG4gICAgICAgIGxldCB0YXJnZXROb2RlID0gcmVzb2x2ZXIuRE9NVGFyZ2V0O1xuICAgICAgICAvLyBNb2RpZnkgaXRzIGNsYXNzZXNcbiAgICAgICAgX3UucmVtb3ZlQ2xhc3ModGhpcy5jbGFzc0Jhc2VUcmFuc2l0aW9uKyctaW4nLCB0YXJnZXROb2RlKTtcbiAgICAgICAgX3UucmVtb3ZlQ2xhc3ModGhpcy5jbGFzc0Jhc2VUcmFuc2l0aW9uKyctaW4tc3RhcnQnLCB0YXJnZXROb2RlKTtcbiAgICAgICAgX3UuYWRkQ2xhc3ModGhpcy5jbGFzc0Jhc2VUcmFuc2l0aW9uKyctaW4tZW5kJywgdGFyZ2V0Tm9kZSk7XG4gICAgICB9LmJpbmQodGhpcykpLlxuICAgICAgY2F0Y2goIGZ1bmN0aW9uKGVycikge1xuICAgICAgICBjb25zb2xlLmxvZyhlcnIpXG4gICAgICAgIHRoaXMuX2Vycm9yKHJlYWR5U3RhdGUsIHJlcS5zdGF0dXMsIGVyciB8fCAwKTtcbiAgICAgIH0uYmluZCh0aGlzKSApO1xuXG4gICAgLy8gU2F2ZSB0aGUgbGFzdCBwYXJzZWQgVVJMIGZvciB0aGUgcHVycG9zZSBvZiBoaXN0b3J5IGludGVyb3BlcmFiaWxpdHkgYW5kIGVycm9yIGNvcnJlY3Rpb24uXG4gICAgdGhpcy5sYXN0UGFyc2VkVVJMID0gcGFyc2VkVVJMO1xuXG4gICAgcmVxLm9wZW4oJ0dFVCcsIHBhcnNlZFVSTCwgdHJ1ZSk7XG4gICAgcmVxLnNlbmQoZGF0YSk7XG5cbiAgICAvLyBTZXQgdGhlIG9iamVjdCBzdGF0ZVxuICAgIHRoaXMuc3RhdGUgPSBTVEFURVMuTE9BRElORztcblxuICAgIHJldHVybiByZXF1ZXN0UHJvbWlzZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBQcml2YXRlIG1ldGhvZHNcbiAgICovXG5cbiAgLyoqXG4gICAqIExpc3RlbmVyIGZvciB0aGUgcG9wc3RhdGUgbWV0aG9kXG4gICAqXG4gICAqIEBwcml2YXRlXG4gICAqIEBwYXJhbSAge29iamVjdH0gZSB0aGUgcGFzc2VkIGV2ZW50IG9iamVjdFxuICAgKiBAcmV0dXJuIHZvaWRcbiAgICovXG4gIHN0YXRpYyBfcG9wc3RhdGUoZSkge1xuICAgIGNvbnNvbGUubG9nKCctLS0tIF9wb3BzdGF0ZSAtLS0tICcpO1xuICAgIHZhciBiYXNlLCBzdGF0ZSA9IHt9O1xuICAgIHZhciBoYXNQb3BwZWRTdGF0ZSA9IHN1cGVyLl9wb3BzdGF0ZShlKTtcblxuICAgIGlmKCBoYXNQb3BwZWRTdGF0ZSApIHtcbiAgICAgIHN0YXRlID0gKGJhc2UgPSB0aGlzLmhpc3RvcnkpLnN0YXRlIHx8IChiYXNlLnN0YXRlID0gZS5zdGF0ZSB8fCAoZS5zdGF0ZSA9IHdpbmRvdy5ldmVudC5zdGF0ZSkpO1xuICAgIH1cblxuICAgIGNvbnNvbGUubG9nKHN0YXRlLCBoYXNQb3BwZWRTdGF0ZSk7XG4gICAgY29uc29sZS5sb2coJyAnKTtcblxuICAgIHZhciBocmVmID0gZG9jdW1lbnQubG9jYXRpb24uaHJlZjtcbiAgICB2YXIgdGFyZ2V0ID0gc3RhdGUudGFyZ2V0IHx8IHRoaXMubGFzdENoYW5nZWRUYXJnZXQ7XG4gICAgdmFyIHNlbGVjdGlvbiA9IHN0YXRlLnNlbGVjdGlvbiB8fCBTRUxFQ1RPUlMuQ0hJTERSRU47XG4gICAgdmFyIGRhdGEgPSBzdGF0ZS5kYXRhIHx8IHt9O1xuXG4gICAgdGhpcy5hamF4R2V0KGhyZWYsIHRhcmdldCwgc2VsZWN0aW9uLCB0cnVlLCBkYXRhKTtcblxuICAgIHJldHVybiBoYXNQb3BwZWRTdGF0ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUcmlnZ2VyIGFuIGFqYXggbGluayBhcyBkZXRlcm1pbmVkIGJ5IGEgY2xpY2sgY2FsbGJhY2suIFRoaXMgc2hvdWxkIG9ubHkgZXZlciBiZSBjYWxsZWRcbiAgICogZnJvbSBhIGNsaWNrIGV2ZW50IGFzIGFkZGVkIHZpYSB0aGUgQUpBWCBvYmplY3Qgb3IgYSBjaGlsZCB0aGVyZXJvZi5cbiAgICpcbiAgICogQHN0YXRpY1xuICAgKiBAcHJpdmF0ZVxuICAgKiBAcGFyYW0gIHtvYmplY3R9IGUgdGhlIGV2ZW50IG9iamVjdCBwYXNzZWQgZnJvbSB0aGUgY2xpY2sgZXZlbnQuXG4gICAqL1xuICBzdGF0aWMgX3RyaWdnZXJBamF4TGluayhlKSB7XG4gICAgaWYoIHRoaXMuc3RhdGUgIT0gU1RBVEVTLk9LIClcbiAgICB7XG4gICAgICBpZiggdGhpcy5kZXZtb2RlIClcbiAgICAgIHtcbiAgICAgICAgY29uc29sZS53YXJuKCBcIlRyaWVkIHRvIGNsaWNrIGFuIEFKQVggbGluayB3aGVuIHRoZSBvYmplY3Qgd2Fzbid0IGluIE9LIG1vZGVcIiApO1xuICAgICAgfVxuXG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gRmluZCBhbGwgb2YgdGhlIHJlbGV2YW50IGF0dGVpYnV0ZXNcbiAgICBjb25zdCBsaW5rICAgICAgPSBlLnRhcmdldDtcbiAgICBjb25zdCBocmVmICAgICAgPSBsaW5rLmdldEF0dHJpYnV0ZSgnaHJlZicpO1xuICAgIGNvbnN0IHRhcmdldCAgICA9IGxpbmsuZ2V0QXR0cmlidXRlKHRoaXMuYXR0cmlidXRlVGFyZ2V0KTtcbiAgICBjb25zdCBzZWxlY3Rpb24gPSBsaW5rLmdldEF0dHJpYnV0ZSh0aGlzLmF0dHJpYnV0ZVNlbGVjdGlvbik7XG5cbiAgICAvLyBTZXQgdGhlIG9iamVjdCBzdGF0ZVxuICAgIHRoaXMuc3RhdGUgPSBTVEFURVMuQ0xJQ0tFRDtcblxuICAgIHRoaXMuYWpheEdldChocmVmLCB0YXJnZXQsIHNlbGVjdGlvbik7XG4gIH1cblxuICAvKipcbiAgICogQHR5cGVkZWYge09iamVjdH0gICAgICAgICAgICAgIEFKQVhEb2N1bWVudFxuICAgKiBAcHJvcGVydHkge0RPTUVsZW1lbnR9IGRvYyAgICAgVGhlIGZ1bGwgZG9jdW1lbnQgbm9kZSBmb3IgdGhlIEFKQVggR0VUIHJlc3VsdFxuICAgKiBAcHJvcGVydHkge05vZGVMaXN0fSAgIHN1YmRvYyAgVGhlIHN1YmRvY3VtZW50IGRlcml2ZWQgZnJvbSB0aGUgbWFpbiBkb2N1bWVudFxuICAgKi9cblxuICAvKipcbiAgICogVGhpcyByZXNwb25kcyB0byB0aGUgYWpheCBsb2FkIGV2ZW50IGFuZCBpcyByZXNwb25zaWJsZSBmb3IgYnVpbGRpbmcgdGhlIHJlc3VsdCxcbiAgICogaW5qZWN0aW5nIGl0IGludG8gdGhlIHBhZ2UsIHJ1bm5pbmcgY2FsbGJhY2tzIGFuZCBkZXRlY3RpbmcgYW5kIGRlbGF5aW5nXG4gICAqIHRyYW5zaXRpb25zIGFuZCBhbmltYXRpb25zIGFzIG5lY2Vzc2FyeS9cbiAgICpcbiAgICogQHN0YXRpY1xuICAgKiBAcHJpdmF0ZVxuICAgKiBAcGFyYW0gIHtzdHJpbmd9IGNvbnRlbnQgICAgICAgICAgIFRoZSBsb2FkZWQgcGFnZSBjb250ZW50LCB0aGlzIGNvbWVzIGZyb20gdGhlIEFKQVggY2FsbC5cbiAgICogQHBhcmFtICB7c3RyaW5nfSB0YXJnZXQgICAgICAgICAgICBUaGUgdGFyZ2V0IGZvciB0aGUgbG9hZGVkIGNvbnRlbnQuIFRoaXMgY2FuIGJlIGEgc3RyaW5nIChzZWxlY3RvciksIG9yIGEgSlNPTiBhcnJheSBvZiBzZWxlY3RvciBzdHJpbmdzLlxuICAgKiBAcGFyYW0gIHtzdHJpbmd9IHNlbGVjdGlvbiAgICAgICAgIFRoaXMgaXMgYSBzZWxlY3RvciB0aGF0IGRldGVybWluZXMgd2hhdCB0byBjdXQgZnJvbSB0aGUgbG9hZGVkIGNvbnRlbnQuXG4gICAqIEBwYXJhbSAge0RPTUVsZW1lbnR9IFtsaW5rVGFyZ2V0XSAgVGhlIHRhcmdldCBvZiB0aGUgbGluay4gVGhpcyBpcyB1c2VmdWwgZm9yIHNldHRpbmcgYWN0aXZlIHN0YXRlcyBpbiBjYWxsYmFjay5cbiAgICogQHJldHVybiB7QUpBWERvY3VtZW50fSAgICAgICAgICAgICBBbiBvYmplY3QgcmVwcmVzZW50aW5nIGJvdGggdGhlIG1haW4gZG9jdW1lbnQgYW5kIHRoZSBzdWJkb2N1bWVudFxuICAgKi9cbiAgc3RhdGljIF9wYXJzZVJlc3BvbnNlKGNvbnRlbnQsIHRhcmdldCwgc2VsZWN0aW9uKSB7XG5cbiAgICB2YXIgZG9jLCBzdWJkb2MsIHJlc3VsdHM7XG5cbiAgICAvLyBQYXJzZSB0aGUgZG9jdW1lbnQgZnJvbSB0aGUgY29udGVudCBwcm92aWRlZFxuICAgIGRvYyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIGRvYy5pbm5lckhUTUwgPSBjb250ZW50O1xuXG4gICAgaWYoIHNlbGVjdGlvbiA9PT0gU0VMRUNUT1JTLkNISUxEUkVOIClcbiAgICB7XG4gICAgICBzdWJkb2MgPSBkb2MucXVlcnlTZWxlY3RvckFsbChgJHt0YXJnZXR9ID4gKmApO1xuICAgIH0gZWxzZSB7XG4gICAgICBzdWJkb2MgPSBkb2MucXVlcnlTZWxlY3RvckFsbChzZWxlY3Rpb24pO1xuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICBkb2M6IGRvYyxcbiAgICAgIHN1YmRvYzogc3ViZG9jXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFRoaXMgY29tcGxldGVzIHRoZSB0cmFuc2l0aW9uIG9mIGNvbnRlbnQuIFRoaXMgcmVtb3ZlcyB0aGUgb2xkIGNvbnRlbnQgYW5kIGFkZHMgdGhlIG5ld1xuICAgKlxuICAgKiBAc3RhdGljXG4gICAqIEBwcml2YXRlXG4gICAqIEBwYXJhbSAge0FKQVhEb2N1bWVudH0gY29udGVudCAgICBUaGUgRE9NIG5vZGVzIHRvIGFkZCB0byB0aGUgZWxlbWVudFxuICAgKiBAcGFyYW0gIHtET01Ob2RlfSAgICAgIHRhcmdldCAgICAgVGhlIHRhcmdldCB0byBhZGQgdGhlIG5ldyBjb250ZW50IHRvXG4gICAqIEBwYXJhbSAge3N0cmluZ30gICAgICAgc2VsZWN0aW9uICBUaGlzIGlzIGEgc2VsZWN0b3IgdGhhdCBkZXRlcm1pbmVzIHdoYXQgdG8gY3V0IGZyb20gdGhlIGxvYWRlZCBjb250ZW50LlxuICAgKiBAcGFyYW0gIHtib29sZWFufSAgICAgIGZyb21Qb3AgICAgSW5kaWNhdGVzIHRoYXQgdGhpcyBsb2FkIGlzIGZyb20gYSBoaXN0b3J5IHBvcFxuICAgKi9cbiAgc3RhdGljIF9jb21wbGV0ZVRyYW5zZmVyKGNvbnRlbnQsIHRhcmdldCwgc2VsZWN0aW9uLCBmcm9tUG9wKSB7XG5cbiAgICB2YXIgb2xkVGl0bGUgPSBkb2N1bWVudC50aXRsZSwgbmV3VGl0bGUsIHRhcmdldE5vZGVzO1xuXG4gICAgY29uc29sZS5sb2coJy0tLSBjb21wbGV0ZVRyYW5zZmVyIC0tLScpO1xuICAgIGNvbnNvbGUubG9nKGNvbnRlbnQsIG9sZFRpdGxlLCBjb250ZW50LmRvYy5nZXRFbGVtZW50c0J5VGFnTmFtZSgndGl0bGUnKSk7XG5cbiAgICAvLyBGaW5kIHRoZSBuZXcgcGFnZSB0aXRsZVxuICAgIG5ld1RpdGxlID0gY29udGVudC5kb2MuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ3RpdGxlJylbMF0udGV4dDtcblxuICAgIHRhcmdldC5pbm5lckhUTUwgPSAnJztcblxuICAgIGNvbnRlbnQuc3ViZG9jLmZvckVhY2goZnVuY3Rpb24ocmVzdWx0KSB7XG4gICAgICB0YXJnZXQuYXBwZW5kQ2hpbGQocmVzdWx0LmNsb25lTm9kZSh0cnVlKSk7XG4gICAgfSk7XG5cbiAgICAvLyBVcGRhdGUgdGhlIGludGVybmFsIHJlZmVyZW5jZSB0byB0aGUgbGFzdCB0YXJnZXRcbiAgICB0aGlzLmxhc3RDaGFuZ2VkVGFyZ2V0ID0gX3UuZ2V0U2VsZWN0b3JGb3JFbGVtZW50KHRhcmdldCk7XG5cbiAgICBpZiggIWZyb21Qb3AgKSB7XG4gICAgICAvLyBQdXNoIHRoZSBuZXcgc3RhdGUgdG8gdGhlIGhpc3RvcnkuXG4gICAgICB0aGlzLnB1c2godGhpcy5sYXN0UGFyc2VkVVJMLCBuZXdUaXRsZSwgeyB0YXJnZXQ6IF91LmdldFNlbGVjdG9yRm9yRWxlbWVudCh0YXJnZXQpLCBzZWxlY3Rpb246IHNlbGVjdGlvbiB9KTtcbiAgICB9XG5cbiAgICAvLyBTZXQgdGhlIG9iamVjdCBzdGF0ZVxuICAgIHRoaXMuc3RhdGUgPSBTVEFURVMuT0s7XG4gIH1cblxuICAvKipcbiAgICogVHJpZ2dlciBhbiBlcnJvciBsb2dcbiAgICpcbiAgICogQHN0YXRpY1xuICAgKiBAcHJpdmF0ZVxuICAgKiBAcGFyYW0gIHt0eXBlfSByZWFkeVN0YXRlIGRlc2NyaXB0aW9uXG4gICAqIEBwYXJhbSAge3R5cGV9IHN0YXR1cyAgICAgZGVzY3JpcHRpb25cbiAgICogQHJldHVybiB7dHlwZX0gICAgICAgICAgICBkZXNjcmlwdGlvblxuICAgKi9cbiAgc3RhdGljIF9lcnJvcihyZWFkeVN0YXRlLCBzdGF0dXMsIGVycm9yU3RhdGUgPSBFUlJPUlMuR0VORVJJQ19FUlJPUikge1xuICAgIHZhciBlcnJvclN0YXRlQ29uc3QgPSAoZnVuY3Rpb24odmFsKSB7IGZvcih2YXIga2V5IGluIEVSUk9SUykgeyBpZihFUlJPUlNba2V5XSA9PSB2YWwpIHJldHVybiBrZXkgfSByZXR1cm4gJ0dFTkVSSUNfRVJST1InIH0pKGVycm9yU3RhdGUpXG4gICAgY29uc29sZS53YXJuKGAlYyBFcnJvciBsb2FkaW5nIEFKQVggbGluay4gcmVhZHlTdGF0ZTogJHtyZWFkeVN0YXRlfS4gc3RhdHVzOiAke3N0YXR1c30uIGVycm9yU3RhdGU6ICR7ZXJyb3JTdGF0ZUNvbnN0fWAsICdiYWNrZ3JvdW5kOiAjMjIyOyBjb2xvcjogI2ZmN2MzYScpXG4gIH1cblxuXG4gIC8qKlxuICAgKiBHZXR0ZXJzIGFuZCBzZXR0ZXJzXG4gICAqL1xuXG4gIC8qKlxuICAgKiAoZ2V0dGVyL3NldHRlcikgVGhlIGF0dHJpYnV0ZSB1c2VkIHRvIGRldGVybWluZSB3aGV0aGVyIGEgbGluayBzaG91bGRcbiAgICogYmUgcnVuIHZpYSB0aGUgQUpBWCBjbGFzcy5cbiAgICpcbiAgICogQHR5cGUge3N0cmluZ31cbiAgICogQGRlZmF1bHQgJ2RhdGEtd3RjLWFqYXgnXG4gICAqL1xuICBzdGF0aWMgc2V0IGF0dHJpYnV0ZUFqYXgoYXR0cmlidXRlKSB7XG4gICAgaWYodHlwZW9mIGF0dHJpYnV0ZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgIHRoaXMuX2F0dHJpYnV0ZUFqYXggPSBhdHRyaWJ1dGU7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnNvbGUud2FybignQWxsIGF0dHJpYnV0ZXMgbXVzdCBiZSBzdHJpbmdzLicpO1xuICAgIH1cbiAgfVxuICBzdGF0aWMgZ2V0IGF0dHJpYnV0ZUFqYXgoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2F0dHJpYnV0ZUFqYXggfHwgJ2RhdGEtd3RjLWFqYXgnO1xuICB9XG5cbiAgLyoqXG4gICAqIChnZXR0ZXIvc2V0dGVyKSBUaGUgYXR0cmlidXRlIHVzZWQgdG8gZGV0ZXJtaW5lIHdoZXJlIGEgbGluayBzaG91bGQgcGxhY2UgaXQnc1xuICAgKiByZXN1bHRhbnQgR0VULiBUaGlzIGF0dHJpYnV0ZSBzaG91bGQgYmUgaW4gdGhlIGZvcm0gb2YgYSBzZWxlY3RvciwgaWU6XG4gICAqIGAuYWpheC10YXJnZXRgXG4gICAqXG4gICAqIEB0eXBlIHtzdHJpbmd9XG4gICAqIEBkZWZhdWx0ICdkYXRhLXd0Yy1hamF4LXRhcmdldCdcbiAgICovXG4gIHN0YXRpYyBzZXQgYXR0cmlidXRlVGFyZ2V0KGF0dHJpYnV0ZSkge1xuICAgIGlmKHR5cGVvZiBhdHRyaWJ1dGUgPT09ICdzdHJpbmcnKSB7XG4gICAgICB0aGlzLl9hdHRyaWJ1dGVUYXJnZXQgPSBhdHRyaWJ1dGU7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnNvbGUud2FybignQWxsIGF0dHJpYnV0ZXMgbXVzdCBiZSBzdHJpbmdzLicpO1xuICAgIH1cbiAgfVxuICBzdGF0aWMgZ2V0IGF0dHJpYnV0ZVRhcmdldCgpIHtcbiAgICByZXR1cm4gdGhpcy5fYXR0cmlidXRlVGFyZ2V0IHx8ICdkYXRhLXd0Yy1hamF4LXRhcmdldCc7XG4gIH1cblxuICAvKipcbiAgICogKGdldHRlci9zZXR0ZXIpIFRoZSBhdHRyaWJ1dGUgdXNlZCB0byBzbGljZSB0aGUgcmVzdWx0YW50IEdFVC5cbiAgICogVGhpcyBhdHRyaWJ1dGUgc2hvdWxkIGJlIGluIHRoZSBmb3JtIG9mIGEgc2VsZWN0b3IsIGllOlxuICAgKiBgLmFqYXgtc2VsZWN0aW9uYFxuICAgKlxuICAgKiBAdHlwZSB7c3RyaW5nfVxuICAgKiBAZGVmYXVsdCAnZGF0YS13dGMtYWpheC1zZWxlY3Rpb24nXG4gICAqL1xuICBzdGF0aWMgc2V0IGF0dHJpYnV0ZVNlbGVjdGlvbihhdHRyaWJ1dGUpIHtcbiAgICBpZih0eXBlb2YgYXR0cmlidXRlID09PSAnc3RyaW5nJykge1xuICAgICAgdGhpcy5fYXR0cmlidXRlU2VsZWN0aW9uID0gYXR0cmlidXRlO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zb2xlLndhcm4oJ0FsbCBhdHRyaWJ1dGVzIG11c3QgYmUgc3RyaW5ncy4nKTtcbiAgICB9XG4gIH1cbiAgc3RhdGljIGdldCBhdHRyaWJ1dGVTZWxlY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuX2F0dHJpYnV0ZVNlbGVjdGlvbiB8fCAnZGF0YS13dGMtYWpheC1zZWxlY3Rpb24nO1xuICB9XG5cbiAgLyoqXG4gICAqIChnZXR0ZXIvc2V0dGVyKSBUaGUgY2xhc3NuYW1lIHRvIHVzZSBhcyB0aGUgYmFzaXMgZm9yIHRyYW5zaXRpb25zLiBEZWZhdWx0XG4gICAqIHdpbGwgYmUgKnd0Yy10cmFuc2l0aW9uKi4gU28gdGhpcyB3aWxsIHRoZW4gYmUgdXNlZCBmb3IgYWxsIDMgc3RhdGVzOlxuICAgKiAqLnd0Yy10cmFuc2l0aW9uKlxuICAgKiAqLnd0Yy10cmFuc2l0aW9uLW91dCpcbiAgICogKi53dGMtdHJhbnNpdGlvbi1vdXQtc3RhcnQqXG4gICAqICoud3RjLXRyYW5zaXRpb24tb3V0LWVuZCpcbiAgICogKi53dGMtdHJhbnNpdGlvbi1pbipcbiAgICogKi53dGMtdHJhbnNpdGlvbi1pbi1zdGFydCpcbiAgICogKi53dGMtdHJhbnNpdGlvbi1pbi1lbmQqXG4gICAqXG4gICAqIEB0eXBlIHtzdHJpbmd9XG4gICAqIEBkZWZhdWx0ICd3dGMtdHJhbnNpdGlvbidcbiAgICovXG4gIHN0YXRpYyBzZXQgY2xhc3NCYXNlVHJhbnNpdGlvbihjbGFzc0Jhc2UpIHtcbiAgICBpZih0eXBlb2YgY2xhc3NCYXNlID09PSAnc3RyaW5nJykge1xuICAgICAgdGhpcy5fY2xhc3NCYXNlVHJhbnNpdGlvbiA9IGNsYXNzQmFzZTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc29sZS53YXJuKCdBbGwgYXR0cmlidXRlcyBtdXN0IGJlIHN0cmluZ3MuJyk7XG4gICAgfVxuICB9XG4gIHN0YXRpYyBnZXQgY2xhc3NCYXNlVHJhbnNpdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5fY2xhc3NCYXNlVHJhbnNpdGlvbiB8fCAnd3RjLXRyYW5zaXRpb24nO1xuICB9XG5cbiAgLyoqXG4gICAqIChnZXR0ZXIvc2V0dGVyKSBUaGUgYXR0cmlidXRlIHVzZWQgdG8gc2xpY2UgdGhlIHJlc3VsdGFudCBHRVQuXG4gICAqIFRoaXMgYXR0cmlidXRlIHNob3VsZCBiZSBpbiB0aGUgZm9ybSBvZiBhIHNlbGVjdG9yLCBpZTpcbiAgICogYC5hamF4LXNlbGVjdGlvbmBcbiAgICpcbiAgICogQHR5cGUge3N0cmluZ31cbiAgICogQGRlZmF1bHQgJ2RhdGEtd3RjLWFqYXgtc2VsZWN0aW9uJ1xuICAgKi9cbiAgc3RhdGljIHNldCBhdHRyaWJ1dGVTaG91bGROYXZpZ2F0ZShhdHRyaWJ1dGUpIHtcbiAgICBpZih0eXBlb2YgYXR0cmlidXRlID09PSAnc3RyaW5nJykge1xuICAgICAgdGhpcy5fYXR0cmlidXRlU2hvdWxkTmF2aWdhdGUgPSBhdHRyaWJ1dGU7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnNvbGUud2FybignQWxsIGF0dHJpYnV0ZXMgbXVzdCBiZSBzdHJpbmdzLicpO1xuICAgIH1cbiAgfVxuICBzdGF0aWMgZ2V0IGF0dHJpYnV0ZVNob3VsZE5hdmlnYXRlKCkge1xuICAgIHJldHVybiB0aGlzLl9hdHRyaWJ1dGVTaG91bGROYXZpZ2F0ZSB8fCAnZGF0YS13dGMtYWpheC1zaG91bGQtbmF2aWdhdGUnO1xuICB9XG5cbiAgLyoqXG4gICAqIHJldHVybnMgYSBuZXcgcmVxdWVzdE9iamVjdC4gV3JhcHBpbmcgcGxhY2Vob2xkZXIgZm9yIG5vdyB3YWl0aW5nIG9uIGVuaGFuY2VtZW50cy5cbiAgICpcbiAgICogQHJlYWRvbmx5XG4gICAqIEByZXR1cm4ge29iamVjdH0gIHJlcXVlc3RPYmplY3RcbiAgICovXG4gIHN0YXRpYyBnZXQgcmVxdWVzdE9iamVjdCgpIHtcbiAgICByZXR1cm4gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gIH1cblxuICAvKipcbiAgICogcmV0dXJucyBhIG5ldyBsYXN0IGNoYW5nZWQgdGFyZ2V0LiBUaGlzIGlzIHVzZWQgdG8gZGV0ZXJtaW5lIHdoYXQgdG8gY2hhbmdlZFxuICAgKiB3aGVuIG5hdmlnYXRpbmcgYmFjayB2aWEgaGlzdG9yeS5cbiAgICpcbiAgICogQHJldHVybiB7b2JqZWN0fSAgZWl0aGVyIGFuIGFycmF5IG9mIG5vZGVzIG9yIGEgc2luZ2xlIG5vZGUuXG4gICAqIEBkZWZhdWx0IG51bGxcbiAgICovXG4gIHN0YXRpYyBzZXQgbGFzdENoYW5nZWRUYXJnZXQodGFyZ2V0KSB7XG4gICAgdGhpcy5fbGFzdENoYW5nZWRUYXJnZXQgPSB0YXJnZXQ7XG4gIH1cbiAgc3RhdGljIGdldCBsYXN0Q2hhbmdlZFRhcmdldCgpIHtcbiAgICByZXR1cm4gdGhpcy5fbGFzdENoYW5nZWRUYXJnZXQgfHwgbnVsbDtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUgcmVzb2x2ZSB0aW1lb3V0LiBUaGlzIGlzIHRoZSB0aW1lIHRoYXQgaXMgdG8gZWxsYXBzZSBiZXR3ZWVuIGFuIHRyYW5zaXRpb25cbiAgICogY29tcGxldGluZyBhbmQgdGhlIG5ldyBjb250ZW50IGJlaW5nIGFkZGVkLiBUaGlzIGlzIGFwcGxpZWQgYm90aCB0byB0aGUgb3V0d2FyZFxuICAgKiBlbGVtZW50IGFuZCB0aGUgaW53YXJkLlxuICAgKlxuICAgKiBAcmV0dXJuIHtpbnR9ICBBIG51bWJlciwgaW4gTVMsIGdyZWF0ZXIgdGhhbiAwXG4gICAqIEBkZWZhdWx0IDBcbiAgICovXG4gIHN0YXRpYyBzZXQgcmVzb2x2ZVRpbWVvdXQodGltZW91dCkge1xuICAgIHRoaXMuX3Jlc29sdmVUaW1lb3V0ID0gdGltZW91dCA+IDAgPyB0aW1lb3V0IDogbnVsbDtcbiAgfVxuICBzdGF0aWMgZ2V0IHJlc29sdmVUaW1lb3V0KCkge1xuICAgIHJldHVybiB0aGlzLl9yZXNvbHZlVGltZW91dCA+IDAgPyB0aGlzLl9yZXNvbHZlVGltZW91dCA6IDA7XG4gIH1cblxuICAvKipcbiAgICogVGhlIHN0YXRlIHRoYXQgdGhlIEFKQVggb2JqZWN0IGlzIGluLCBhcyBkZXRlcm1pbmVkIGZyb20gYSBsaXN0IG9mIGNvbnN0YW50czpcbiAgICogLSBPSyAgICAgICAgICAgICBJZGxlLCByZWFkeSBmb3IgYSBzdGF0ZSBsb2FkLlxuICAgKiAtIENMSUNLRUQgICAgICAgIENsaWNrZWQsIGJ1dCBub3QgeWV0IGZpcmVkLlxuICAgKiAtIExPQURJTkcgICAgICAgIExvYWRpbmcgcGFnZS5cbiAgICogLSBUUkFOU0lUSU9OSU5HICBUcmFuc2l0aW9uaW5nIHN0YXRlXG4gICAqIC0gTE9BREVEICAgICAgICAgQ29udGVudCBsb2FkZWQuXG4gICAqXG4gICAqIEByZXR1cm4ge2ludGVnZXJ9ICBUaGUgc3RhdGUgdGhhdCB0aGUgb2JqZWN0IGlzIGluLiBDb21wYXJlIHRvIHRoZSBzdGF0ZSBvYmplY3QgZm9yIGRlc2NyaXB0aW9uXG4gICAqIEBkZWZhdWx0IFNUQVRFLk9LXG4gICAqL1xuICBzdGF0aWMgc2V0IHN0YXRlKHN0YXRlKSB7XG4gICAgaWYoIHR5cGVvZiBzdGF0ZSA9PT0gJ3N0cmluZycgKSB7XG4gICAgICBpZiggU1RBVEVTW3N0YXRlXSAhPT0gdW5kZWZpbmVkICkge1xuICAgICAgICB0aGlzLl9zdGF0ZSA9IFNUQVRFU1tzdGF0ZV07XG4gICAgICAgIHJldHVyblxuICAgICAgfVxuICAgIH0gZWxzZSBpZiggdHlwZW9mIHN0YXRlID09PSAnbnVtYmVyJyApIHtcbiAgICAgIGZvcih2YXIgX3N0YXRlIGluIFNUQVRFUykge1xuICAgICAgICBpZihTVEFURVNbX3N0YXRlXSA9PT0gc3RhdGUpIHtcbiAgICAgICAgICB0aGlzLl9zdGF0ZSA9IHN0YXRlO1xuXG4gICAgICAgICAgaWYoIHRoaXMuZGV2bW9kZSApXG4gICAgICAgICAge1xuICAgICAgICAgICAgY29uc29sZS5sb2coYCVjIEFKQVggc3RhdGUgY2hhbmdlOiAke3RoaXMuX3N0YXRlfSBgLCAnYmFja2dyb3VuZDogIzIyMjsgY29sb3I6ICNiYWRhNTUnKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgY29uc29sZS53YXJuKCdzdGF0ZSBtdXN0IGJlIG9uZSBvZiBPSywgQ0xJQ0tFRCwgTE9BRElORywgTE9BREVELicpO1xuICB9XG4gIHN0YXRpYyBnZXQgc3RhdGUoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3N0YXRlIHx8IDA7XG4gIH1cblxuICAvKipcbiAgICogVGhlIGxhc3QgVVJMIHRvIGJlIHBhcnNlZCBieSB0aGUgQUpBWCBvYmplY3QuIEdlbmVyYWxseSBzcGVha2luZywgdGhpcyBpcyB0aGVcbiAgICogbGFzdCBVUkwgdG8gYmUgbG9hZGVkIG9yIGF0dGVtcHRlZCBsb2FkZWQuXG4gICAqXG4gICAqIEByZXR1cm4ge3N0cmluZ30gIFRoZSBwYXJzZWQgVVJMIHN0cmluZ1xuICAgKiBAZGVmYXVsdCBudWxsXG4gICAqL1xuICBzdGF0aWMgc2V0IGxhc3RQYXJzZWRVUkwocGFyc2VkVVJMKSB7XG4gICAgaWYoIHR5cGVvZiBwYXJzZWRVUkwgPT09ICdzdHJpbmcnICkge1xuICAgICAgdGhpcy5fbGFzdFBhcnNlZFVSTCA9IHBhcnNlZFVSTDtcbiAgICB9XG4gIH1cbiAgc3RhdGljIGdldCBsYXN0UGFyc2VkVVJMKCkge1xuICAgIHJldHVybiB0aGlzLl9sYXN0UGFyc2VkVVJMIHx8IG51bGw7XG4gIH1cbn1cblxuZXhwb3J0IHsgQUpBWCwgRVJST1JTLCBTVEFURVMgfTtcbiIsIi8qKlxuICogQ2xhc3MgcmVwcmVzZW50aW5nIGFuIGFic3RyYWN0aW9uIG9mIHRoZSBoaXN0b3J5IEFQSS5cbiAqIEBzdGF0aWNcbiAqIEBuYW1lc3BhY2VcbiAqIEBhdXRob3IgTGlhbSBFZ2FuIDxsaWFtQHdldGhlY29sbGVjdGl2ZS5jb20+XG4gKiBAdmVyc2lvbiAwLjhcbiAqIEBjcmVhdGVkIE5vdiAxOSwgMjAxNlxuICovXG5jbGFzcyBIaXN0b3J5IHtcblxuICAvKipcbiAgICogUHVibGljIG1ldGhvZHNcbiAgICovXG5cbiAgLyoqXG4gICAgKiBJbml0aWFsaXNlcyB0aGUgSGlzdG9yeSBjbGFzcy4gTm90aGluZyBzaG91bGQgYmUgYWJsZSB0b1xuICAgICogb3BlcmF0ZSBoZXJlIHVubGVzcyB0aGlzIGhhcyBydW4gd2l0aCBhIHN1cHBvcnQgPSB0cnVlLlxuICAgICpcbiAgICAqIEBQdWJsaWNcbiAgICAqIEByZXR1cm4ge2Jvb2xlYW59ICAgICAgICAgUmV0dXJucyB3aGV0aGVyIGluaXQgcmFuIG9yIG5vdFxuICAgICovXG4gIHN0YXRpYyBpbml0KGRldm1vZGUgPSBmYWxzZSkge1xuICAgIGlmKHRoaXMuc3VwcG9ydClcbiAgICB7XG4gICAgICAvLyBUcnkgdG8gc2V0IGV2ZXJ5dGhpbmcgdXAsIGFuZCBpZiB3ZSBmYWlsIHRoZW4gcmV0dXJuIGZhbHNlXG4gICAgICB0cnkge1xuICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncG9wc3RhdGUnLCAoZSk9PiB7XG4gICAgICAgICAgdmFyIGhhc1BvcHBlZFN0YXRlID0gdGhpcy5fcG9wc3RhdGUoZSk7XG4gICAgICAgICAgcmV0dXJuIGhhc1BvcHBlZFN0YXRlO1xuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLmRldm1vZGUgICAgICA9IGRldm1vZGU7XG5cbiAgICAgIH0gY2F0Y2ggKGUpIHtcblxuICAgICAgICAvLyBJZiB3ZSdyZSBpbiBkZXZtb2RlLCBzZW5kIG91ciBjb25zb2xlIG91dHB1dFxuICAgICAgICBpZih0aGlzLmRldm1vZGUpIHtcbiAgICAgICAgICBjb25zb2xlLndhcm4oJ2Vycm9yIGluIGhpc3RvcnkgaW5pdGlhbGlzYXRpb24nKTtcbiAgICAgICAgICBjb25zb2xlLmxvZyhlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5pbml0aWFsaXNlZCA9IHRydWU7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICAvKipcbiAgICogQ29uc3RydWN0IGFuZCBwdXNoIGEgVVJMIHN0YXRlXG4gICAqXG4gICAqIEBwdWJsaWNcbiAgICogQHBhcmFtICB7c3RyaW5nfSBVUkwgICAgICAgICAgIFRoZSBVUkwgdG8gcHVzaCwgY2FuIGJlIHJlbGF0aXZlLCBhYnNvbHV0ZSBvciBmdWxsXG4gICAqIEBwYXJhbSAge3N0cmluZ30gdGl0bGUgICAgICAgICBUaGUgdGl0bGUgdG8gcHVzaC5cbiAgICogQHBhcmFtICB7b2JqZWN0fSBzdGF0ZU9iaiAgICAgIEEgc3RhdGUgdG8gcHVzaCB0byB0aGUgc3RhY2suIFRoaXMgd2lsbCBiZSBwb3BwZWQgd2hlbiBuYXZpYWd0aW5nIGJhY2tcbiAgICogQHJldHVybiB7Ym9vbGVhbn0gICAgICAgICAgICAgIEluZGljYXRlcyB3aGV0aGVyIHRoZSBwdXNoIHN1Y2NlZWRlZFxuICAgKi9cbiAgc3RhdGljIHB1c2goVVJMLCB0aXRsZSA9ICcnLCBzdGF0ZU9iaiA9IHt9KSB7XG5cbiAgICB2YXIgcGFyc2VkVVJMID0gJyc7XG5cbiAgICAvLyBGaXJzdCB0cnkgdG8gZml4IHRoZSBVUkxcbiAgICB0cnkge1xuICAgICAgcGFyc2VkVVJMID0gdGhpcy5fZml4VVJMKFVSTCwgdHJ1ZSwgdHJ1ZSk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgaWYodGhpcy5kZXZtb2RlKSB7XG4gICAgICAgIGNvbnNvbGUud2FybigncHVzaCBmYWlsZWQgd2hpbGUgdHJ5aW5nIHRvIGZpeCB0aGUgVVJMJyk7XG4gICAgICAgIGNvbnNvbGUubG9nKGUpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGZhbHNlXG4gICAgfVxuXG4gICAgLy8gSWYgd2UgaGF2ZSBBUEkgc3VwcG9ydCwgcHVzaCB0aGUgc3RhdGUgdG8gdGhlIGhpc3Rvcnkgb2JqZWN0XG4gICAgaWYodGhpcy5zdXBwb3J0KVxuICAgIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIGNvbnNvbGUubG9nKHN0YXRlT2JqKTtcbiAgICAgICAgdGhpcy5oaXN0b3J5LnB1c2hTdGF0ZShzdGF0ZU9iaiwgdGl0bGUsIHBhcnNlZFVSTCk7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGlmKHRoaXMuZGV2bW9kZSkge1xuICAgICAgICAgIGNvbnNvbGUud2FybigncHVzaCBmYWlsZWQgd2hpbGUgdHJ5aW5nIHRvIHB1c2ggdGhlIHN0YXRlIHRvIHRoZSBoaXN0b3J5IG9iamVjdCcpO1xuICAgICAgICAgIGNvbnNvbGUubG9nKGUpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICAvLyBPdGhlcndpc2VyLCBhZGQgdGhlIFVSTCBhcyBhIGhhc2hiYW5nXG4gICAgfSBlbHNlXG4gICAge1xuICAgICAgd2luZG93LmxvY2F0aW9uLmhhc2ggPSBgIyEke1VSTH1gO1xuICAgIH1cblxuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgLyoqXG4gICAqIFRha2VzIHRoZSB1c2VyIGJhY2sgdG8gdGhlIHByZXZpb3VzIHN0YXRlLiBTaW1wbHkgd3JhcHMgdGhlIGhpc3Rvcnkgb2JqZWN0J3MgYmFjayBtZXRob2QuXG4gICAqXG4gICAqIEBwdWJsaWNcbiAgICovXG4gIHN0YXRpYyBiYWNrKCkge1xuICAgIHRoaXMuaGlzdG9yeS5iYWNrKCk7XG4gIH1cblxuICAvKipcbiAgICogVGFrZXMgdGhlIHVzZXIgZm9yd2FyZCB0byB0aGUgbmV4dCBzdGF0ZS4gU2ltcGx5IHdyYXBzIHRoZSBoaXN0b3J5IG9iamVjdCdzIGZvcndhcmQgbWV0aG9kLlxuICAgKlxuICAgKiBAcHVibGljXG4gICAqL1xuICBzdGF0aWMgZm9yd2FyZCgpIHtcbiAgICB0aGlzLmhpc3RvcnkuZm9yd2FyZCgpO1xuICB9XG5cblxuICAvKipcbiAgICogUHJpdmF0ZSBtZXRob2RzXG4gICAqL1xuXG4gIC8qKlxuICAgKiBUYWtlcyBhIHByb3ZpZGVkIFVSTCBhbmQgcmV0dXJucyB0aGUgdmVyc2lvbiB0aGF0IGlzIHVzYWJsZVxuICAgKlxuICAgKiBAcHJpdmF0ZVxuICAgKiBAcGFyYW0gIHtzdHJpbmd9IFVSTCAgICAgICAgICAgICAgICAgICAgIFRoZSBVUkwgdG8gYmUgcGFzc2VkXG4gICAqIEBwYXJhbSAge2Jvb2xlYW59IGluY2x1ZGVEb2NSb290ID0gdHJ1ZSAgV2hldGhlciB0byBpbmNsdWRlIHRoZSBkb2Nyb290IG9uIHRoZSBwYXNzZWQgVVJMXG4gICAqIEBwYXJhbSAge2Jvb2xlYW59IGluY2x1ZGVUcmFpbHMgPSB0cnVlICAgV2hldGhlciB0byBpbmNsdWRlIGZvdW5kIGhhc2hlcyBhbmQgcGFyYW1zXG4gICAqIEByZXR1cm4ge3N0cmluZ30gICAgICAgICAgICAgICAgICAgICAgICAgVGhlIHBhc3NlZCBhbmQgZm9ybWF0dGVkIFVSTFxuICAgKi9cbiAgc3RhdGljIF9maXhVUkwoVVJMLCBpbmNsdWRlRG9jUm9vdCA9IHRydWUsIGluY2x1ZGVUcmFpbHMgPSB0cnVlKSB7XG5cbiAgICB2YXIgcnRuVVJMO1xuXG4gICAgLyoqXG4gICAgICogVVJMIFJlZ2V4IHdvcmtzIGxpa2UgdGhpczpcbiAgICAgKiBgYGBcbiAgICAgICAgXlxuICAgICAgICAoW146XSs6Ly8gICAgICAgICAgICMgSFRUUChTKSBldGMuXG4gICAgICAgICAgICAoW14vXSspICAgICAgICAgIyBUaGUgVVJMIChpZiBhdmFpbGFibGUpXG4gICAgICAgICk/XG4gICAgICAgICgje0Bkb2N1bWVudFJvb3R9KT8gIyBUaGUgZG9jdW1lbnQgcm9vdCwgd2hpY2ggd2Ugd2FudCB0byBnZXQgcmlkIG9mXG4gICAgICAgICgvKT8gICAgICAgICAgICAgICAgIyBjaGVjayBmb3IgdGhlIHByZXNlbmNlIG9mIGEgbGVhZGluZyBzbGFzaFxuICAgICAgICAoW15cXCNcXD9dKikgICAgICAgICAgIyBUaGUgVVJJIC0gdGhpcyBpcyB3aGF0IHdlIGNhcmUgYWJvdXQuIENoZWNrIGZvciBldmVyeXRoaW5nIGV4Y2VwdCBmb3IgIyBhbmQgP1xuICAgICAgICAoXFw/W15cXCNdKik/ICAgICAgICAgIyBhbnkgYWRkaXRpb25hbCBVUkwgcGFyYW1ldGVycyAob3B0aW9uYWwpXG4gICAgICAgIChcXCNcXCE/LispPyAgICAgICAgICAjIEFueSBoYXNoYmFuZyB0cmFpbGVycyAob3B0aW9uYWwpXG4gICAgICogYGBgXG4gICAgICovXG4gICAgY29uc3QgVVJMUmVnZXggPSBSZWdFeHAoYF4oW146XSs6Ly8oW14vXSspKT8oJHt0aGlzLmRvY3VtZW50Um9vdH0pPygvKT8oW15cXFxcI1xcXFw/XSopKFxcXFw/W15cXFxcI10qKT8oXFxcXCNcXFxcIT8uKyk/YCk7XG4gICAgY29uc3QgW2lucHV0LCBocmVmLCBob3N0bmFtZSwgZG9jdW1lbnRSb290LCByb290LCBwYXRoLCBwYXJhbXMsIGhhc2hiYW5nXSA9IFVSTFJlZ2V4LmV4ZWMoVVJMKTtcblxuICAgIGNvbnNvbGUubG9nKHRoaXMuZG9jdW1lbnRSb290LCBkb2N1bWVudFJvb3QsIHJvb3QsIHBhdGgpO1xuXG4gICAgLy8gSWYgd2UncmUgb2JzZXJ2aW5nIHRoZSBUTEROIHJlc3RyYWludCBhbmQgdGhlIHByb3ZpZGVkIFVSTCBkb2Vzbid0IG1hdGNoXG4gICAgLy8gdGhlIGRvbWFpbidzIFRMRE4sIHRocm93IGEgVVJJRXJyb3JcbiAgICBpZiggdHlwZW9mIGhvc3RuYW1lID09PSAnc3RyaW5nJyAmJiBob3N0bmFtZSAhPT0gdGhpcy5UTEROICYmIHRoaXMub2JzZXJ2ZVRMRE4gPT09IHRydWUgKSB7XG4gICAgICB0aHJvdyBuZXcgVVJJRXJyb3IoJ1RvcCBMZXZlbCBkb21haW4gbmFtZSBNVVNUIG1hdGNoIHRoZSBwcmltYXJ5IGRvbWFpbiBuYW1lJyk7XG4gICAgfVxuXG4gICAgLy8gSWYgb3VyIG1hdGNoZWQgVVJMIGhhcyBhIGxlYWRpbmcgc2xhc2gsIHRoZW4gd2Ugd2FudCB0byBkcm9wIHRoZSBkb2NSb290XG4gICAgLy8gaW4gdGhlcmUgdW5sZXNzIHRoZSBmdW5jdGlvbiBwYXJhbSBcImluY2x1ZGVEb2NSb290XCIgaXMgZmFsc2UuXG4gICAgaWYoXG4gICAgICAoIHR5cGVvZiByb290ID09PSAnc3RyaW5nJyAmJiByb290ID09PSAnLycgKSB8fFxuICAgICAgKCB0eXBlb2YgZG9jdW1lbnRSb290ID09PSAnc3RyaW5nJyAmJiBkb2N1bWVudFJvb3QgPT09IHRoaXMuZG9jdW1lbnRSb290IClcbiAgICApIHtcbiAgICAgIGlmKCBpbmNsdWRlRG9jUm9vdCApIHtcbiAgICAgICAgcnRuVVJMID0gYCR7dGhpcy5kb2N1bWVudFJvb3R9LyR7cGF0aH1gO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcnRuVVJMID0gYC8ke3BhdGh9YDtcbiAgICAgIH1cbiAgICAvLyBFbHNlIGlmIHBhdGggaGFzIHJlc3VsdGVkIGluIGFuIGVtcHR5IHN0cmluZywgYXNzdW1lIHRoZSBwYXRoIGlzIHRoZSByb290XG4gICAgfSBlbHNlIGlmKCBwYXRoID09PSAnJyApIHtcbiAgICAgIHJ0blVSTCA9ICcvJ1xuICAgIC8vIE90aGVyd2lzZSwganVzdCBwYXNzIHRoZSBwYXRoIGNvbXBsZXRlbHkuXG4gICAgfSBlbHNlIHtcbiAgICAgIHJ0blVSTCA9IHBhdGg7XG4gICAgfVxuXG4gICAgLy8gSWYgd2Ugd2FudCB0byBpbmNsdWRlIHRyYWlscyAoaGFzaGVzIGFuZCBwYXJhbXMsIGFzIGRldGVybWluZWQgYnkgYVxuICAgIC8vIGZ1bmNpdG9uIHBhcmFtKSwgdGhlbiBhZGQgdGhlbSB0byB0aGUgVVJMLlxuICAgIGlmKCBpbmNsdWRlVHJhaWxzICkge1xuICAgICAgLy8gQXBwZW5kIGFueSBwYXJhbXNcbiAgICAgIGlmKCB0eXBlb2YgcGFyYW1zID09ICdzdHJpbmcnICkge1xuICAgICAgICBydG5VUkwgKz0gcGFyYW1zO1xuICAgICAgfVxuICAgICAgICAvLyBBcHBlbmQgYW55IGhhc2hlc1xuICAgICAgaWYoIHR5cGVvZiBoYXNoYmFuZyA9PSAnc3RyaW5nJyApIHtcbiAgICAgICAgcnRuVVJMICs9IGhhc2hiYW5nO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBydG5VUkw7XG4gIH1cblxuICAvKipcbiAgICogTGlzdGVuZXIgZm9yIHRoZSBwb3BzdGF0ZSBtZXRob2RcbiAgICpcbiAgICogQHByaXZhdGVcbiAgICogQHBhcmFtICB7b2JqZWN0fSBlIHRoZSBwYXNzZWQgZXZlbnQgb2JqZWN0XG4gICAqIEByZXR1cm4gdm9pZFxuICAgKi9cbiAgc3RhdGljIF9wb3BzdGF0ZShlKSB7XG4gICAgdmFyIGJhc2UsIHN0YXRlO1xuICAgIGlmKHRoaXMuc3VwcG9ydClcbiAgICB7XG4gICAgICB0cnkge1xuICAgICAgICBzdGF0ZSA9IChiYXNlID0gdGhpcy5oaXN0b3J5KS5zdGF0ZSB8fCAoYmFzZS5zdGF0ZSA9IGUuc3RhdGUgfHwgKGUuc3RhdGUgPSB3aW5kb3cuZXZlbnQuc3RhdGUpKTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKGUpO1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXJzIGFuZCBzZXR0ZXJzXG4gICAqL1xuXG4gIC8qKlxuICAgKiAoZ2V0dGVyL3NldHRlcikgU2V0cyB0aGUgZG9jdW1lbnQgcm9vdCBmcm9tIGEgcGFzc2VkIFVSTFxuICAgKiByZXR1cm5zIHRoZSBzYXZlZCBkb2N1bWVudCByb290IG9yIGEgYC9gIGlmIG5vdCBzZXRcbiAgICpcbiAgICogQGRlZmF1bHQgJy8nXG4gICAqIEB0eXBlIHtzdHJpbmd9XG4gICAqL1xuICBzdGF0aWMgc2V0IGRvY3VtZW50Um9vdChkb2N1bWVudFJvb3QgPSAnJykge1xuXG4gICAgLyoqXG4gICAgICogZG9jcm9vdFJlZ2V4IHdvcmtzIGxpa2UgdGhpczpcbiAgICAgKiBgYGBcbiAgICAgICAgIF5cbiAgICAgICAgIChbXjpdKzovLyAgICAgICAjIEhUVFAoUykgZXRjLlxuICAgICAgICAgICAgIChbXi9dKykgICAgICMgVGhlIGhvc3RuYW1lIChpZiBhdmFpbGFibGUpXG4gICAgICAgICApP1xuICAgICAgICAgLz9cbiAgICAgICAgICguKig/PS8pKT8gICAgICAjIHRoZSBVUkkgdG8gdXNlIGFzIHRoZSBkb2Nyb290IGxlc3MgYW55IGF2YWlsYWJsZSB0cmFpbGluZyBzbGFzaFxuICAgICAqIGBgYFxuICAgICAqL1xuICAgIGNvbnN0IGRvY3Jvb3RSZWdleCA9IC9eKFteOl0rOlxcL1xcLyhbXlxcL10rKSk/XFwvPyguKig/PVxcLykpPy87XG4gICAgLy8gcGFzcyB0aGUgZG9jcm9vdCBhbmQgaG9zdG5hbWVcbiAgICBjb25zdCBbXzEsIF8yLCBob3N0bmFtZSwgZG9jcm9vdF0gPSBkb2Nyb290UmVnZXguZXhlYyhkb2N1bWVudFJvb3QpO1xuXG4gICAgLy8gRXJyb3IgY2hlY2tcbiAgICAvLyBjaGVjayBmb3IgdGhlIHByZXNlbmNlIG9mIHRoZSByZXBvcnRlZCBUTEROXG4gICAgaWYoXG4gICAgICB0eXBlb2YgaG9zdG5hbWUgPT09ICdzdHJpbmcnICYmXG4gICAgICBob3N0bmFtZSAhPSB0aGlzLlRMRE4gJiZcbiAgICAgIHRoaXMub2JzZXJ2ZVRMRE4gPT09IHRydWVcbiAgICApIHtcbiAgICAgIHRocm93IG5ldyBVUklFcnJvcignVG9wIExldmVsIGRvbWFpbiBuYW1lIE1VU1QgbWF0Y2ggdGhlIHByaW1hcnkgZG9tYWluIG5hbWUnKTtcbiAgICB9XG5cbiAgICB0aGlzLl9kb2N1bWVudFJvb3QgPSBgLyR7ZG9jcm9vdH1gO1xuICB9XG4gIHN0YXRpYyBnZXQgZG9jdW1lbnRSb290KCkge1xuICAgIHJldHVybiB0aGlzLl9kb2N1bWVudFJvb3QgfHwgJy8nO1xuICB9XG5cbiAgLyoqXG4gICAqIChnZXR0ZXIvc2V0dGVyKSBQcm92aWRlcyBhbiBlcnJvciBpZiB0aGUgdXNlciB0cmllcyB0byBzZXQgdGhlIGhpc3Rvcnkgb2JqZWN0XG4gICAqIHJldHVybnMgdGhlIHdpbmRvdyBoaXN0b3J5IG9iamVjdFxuICAgKlxuICAgKiBAdHlwZSB7b2JqZWN0fVxuICAgKi9cbiAgc3RhdGljIHNldCBoaXN0b3J5KGhpc3RvcnkpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ1RoZSBoaXN0b3J5IG9iamVjdCBpcyByZWFkIG9ubHknKTtcbiAgfVxuICBzdGF0aWMgZ2V0IGhpc3RvcnkoKSB7XG4gICAgcmV0dXJuIHdpbmRvdy5oaXN0b3J5O1xuICB9XG5cbiAgLyoqXG4gICAqIChnZXR0ZXIvc2V0dGVyKSBTZXRzIHRoZSB0b3AgbGV2ZWwgZG9tYWluIG5hbWUuXG4gICAqIHJldHVybnMgdGhlIHJlY29yZGVkIFRMRE4gb3IsIGJ5IGRlZmF1bHQsIHdpbmRvdy5sb2NhdGlvbi5ob3N0bmFtZS5cbiAgICpcbiAgICogQHR5cGUge3N0cmluZ31cbiAgICovXG4gIHN0YXRpYyBzZXQgVExETihUTEROKSB7XG4gICAgLy8gQG5vdGUgV2Ugc2hvdWxkIGluY2x1ZGUgc29tZSBlcnJvciBjaGVja2luZyBpbiBoZXJlXG4gICAgdGhpcy5fVExETiA9IFRMRE47XG4gIH1cbiAgc3RhdGljIGdldCBUTEROKCkge1xuICAgIHJldHVybiB0aGlzLl9UTEROIHx8IHdpbmRvdy5sb2NhdGlvbi5ob3N0bmFtZTtcbiAgfVxuXG4gIC8qKlxuICAgKiAoZ2V0dGVyL3NldHRlcikgd2hldGhlciB0byBvYnNlcnZlIHRoZSBUTEROIG9yIGB0cnVlYCAoZGVmYXVsdCkuXG4gICAqXG4gICAqIEBkZWZhdWx0IHRydWVcbiAgICogQHR5cGUge2Jvb2xlYW59XG4gICAqL1xuICBzdGF0aWMgc2V0IG9ic2VydmVUTEROKG9ic2VydmUpIHtcbiAgICAvLyBDaGVjayB0byBtYWtlIHN1cmUgdGhhdCB0aGUgYmFzc2VkIHZhbHVlIGlzIG9mIHR5cGUgYm9vbGVhbi5cbiAgICBpZih0eXBlb2Ygb2JzZXJ2ZSA9PT0gJ2Jvb2xlYW4nKVxuICAgIHtcbiAgICAgIHRoaXMuX29ic2VydmVUTEROID0gb2JzZXJ2ZTtcbiAgICB9IGVsc2VcbiAgICB7XG4gICAgICBjb25zb2xlLndhcm4oJ29ic2VydmVUTEROIG11c3QgYmUgb2YgdHlwZSBib29sZWFuJyk7XG4gICAgfVxuICB9XG4gIHN0YXRpYyBnZXQgb2JzZXJ2ZVRMRE4oKSB7XG4gICAgaWYodHlwZW9mIHRoaXMuX29ic2VydmVUTEROID09PSAnYm9vbGVhbicpXG4gICAge1xuICAgICAgcmV0dXJuIHRoaXMuX29ic2VydmVUTEROO1xuICAgIH0gZWxzZVxuICAgIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiAoZ2V0dGVyL3NldHRlcikgV2hldGhlciB0aGlzIGhpc3Rvcnkgb2JqZWN0IGlzIGluIGRldm1vZGUuIERlZmF1bHRzIHRvIGZhbHNlXG4gICAqXG4gICAqIEBkZWZhdWx0IGZhbHNlXG4gICAqIEB0eXBlIHtib29sZWFufVxuICAgKi9cbiAgc3RhdGljIHNldCBkZXZtb2RlKGRldm1vZGUpIHtcbiAgICAvLyBDaGVjayB0byBtYWtlIHN1cmUgdGhhdCB0aGUgYmFzc2VkIHZhbHVlIGlzIG9mIHR5cGUgYm9vbGVhbi5cbiAgICBpZih0eXBlb2YgZGV2bW9kZSA9PT0gJ2Jvb2xlYW4nKVxuICAgIHtcbiAgICAgIHRoaXMuX2Rldm1vZGUgPSBkZXZtb2RlO1xuICAgIH0gZWxzZVxuICAgIHtcbiAgICAgIGNvbnNvbGUud2FybignZGV2bW9kZSBtdXN0IGJlIG9mIHR5cGUgYm9vbGVhbicpO1xuICAgIH1cbiAgfVxuICBzdGF0aWMgZ2V0IGRldm1vZGUoKSB7XG4gICAgaWYodHlwZW9mIHRoaXMuX2Rldm1vZGUgPT09ICdib29sZWFuJylcbiAgICB7XG4gICAgICByZXR1cm4gdGhpcy5fZGV2bW9kZTtcbiAgICB9IGVsc2VcbiAgICB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIChnZXR0ZXIvc2V0dGVyKSBXaGV0aGVyIHRoaXMgaGlzdG9yeSBvYmplY3QgaXMgaW5pdGlhbGlhc2VkLlxuICAgKlxuICAgKiBAZGVmYXVsdCBmYWxzZVxuICAgKiBAdHlwZSB7Ym9vbGVhbn1cbiAgICovXG4gIHN0YXRpYyBzZXQgaW5pdGlhbGlhc2VkKGluaXRpYWxpYXNlZCkge1xuICAgIC8vIENoZWNrIHRvIG1ha2Ugc3VyZSB0aGF0IHRoZSBiYXNzZWQgdmFsdWUgaXMgb2YgdHlwZSBib29sZWFuLlxuICAgIGlmKHR5cGVvZiBpbml0aWFsaWFzZWQgPT09ICdib29sZWFuJylcbiAgICB7XG4gICAgICB0aGlzLl9pbml0aWFsaWFzZWQgPSBpbml0aWFsaWFzZWQ7XG4gICAgfSBlbHNlXG4gICAge1xuICAgICAgY29uc29sZS53YXJuKCdpbml0aWFsaWFzZWQgbXVzdCBiZSBvZiB0eXBlIGJvb2xlYW4nKTtcbiAgICB9XG4gIH1cbiAgc3RhdGljIGdldCBpbml0aWFsaWFzZWQoKSB7XG4gICAgaWYodHlwZW9mIHRoaXMuX2luaXRpYWxpYXNlZCA9PT0gJ2Jvb2xlYW4nKVxuICAgIHtcbiAgICAgIHJldHVybiB0aGlzLl9pbml0aWFsaWFzZWQ7XG4gICAgfSBlbHNlXG4gICAge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiAoZ2V0dGVyL3NldHRlcikgV2hldGhlciBoaXN0b3J5IGlzIHN1cHBvcnRlZCBieSB0aGUgYnJvd3NlciBvciBkZXZpY2UuXG4gICAqIFByb3ZpZGVzIGFuIGVycm9yIGlmIHRoZSB1c2VyIHRyaWVzIHRvIHNldCB0aGUgc3VwcG9ydCB2YWx1ZSwgdW5sZXNzIHRoZSBvYmplY3QgaXMgaW4gZGV2bW9kZVxuICAgKlxuICAgKiBAdHlwZSB7Ym9vbGVhbn1cbiAgICovXG4gIHN0YXRpYyBzZXQgc3VwcG9ydChzdXBwb3J0ID0gZmFsc2UpIHtcbiAgICAvLyBUaGlzIG92ZXJyaWRlc1xuICAgIGlmKCB0aGlzLmRldm1vZGUgJiYgdHlwZW9mIHN1cHBvcnQgPT09ICdib29sZWFuJyApIHtcbiAgICAgIHRoaXMuX3N1cHBvcnQgPSBzdXBwb3J0O1xuICAgIH1cbiAgICB0aHJvdyBuZXcgRXJyb3IoJ1RoZSBzdXBwb3J0IGlzIHJlYWQgb25seScpO1xuICB9XG4gIHN0YXRpYyBnZXQgc3VwcG9ydCgpIHtcbiAgICByZXR1cm4gKHdpbmRvdy5oaXN0b3J5ICYmIHdpbmRvdy5oaXN0b3J5LnB1c2hTdGF0ZSk7XG4gIH1cblxuICAvKipcbiAgICogKGdldHRlci9zZXR0ZXIpIFRoZSBsZW5ndGggb2YgdGhlIGhpc3Rvcnkgc3RhY2tcbiAgICpcbiAgICogQHR5cGUge2ludGVnZXJ9XG4gICAqL1xuICBzdGF0aWMgZ2V0IGxlbmd0aCgpIHtcbiAgICByZXR1cm4gdGhpcy5oaXN0b3J5Lmxlbmd0aDtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBIaXN0b3J5O1xuIl19
