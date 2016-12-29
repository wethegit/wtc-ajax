
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
var detectAnimationEndTime = function(node, depth = null)
{
  var fulltime = 0;
  var timeRegex = /(\d+\.?(\d+)?)(s|ms)/;
  var currentDepth = 0;
  var maxDepth = (typeof depth === 'number' && depth >= 0) ? depth : -1;
  var recursiveLoop = function(el) {
    if(el instanceof Element) {
      var timebreakdown = timeRegex.exec(window.getComputedStyle(el).transitionDuration)
      var delaybreakdown = timeRegex.exec(window.getComputedStyle(el).transitionDelay)
      var time = timebreakdown[1] * (timebreakdown[3] == 's' ? 1000 : 1)
      var delay = delaybreakdown[1] * (delaybreakdown[3] == 's' ? 1000 : 1)
      if(time + delay > fulltime) {
        fulltime = time + delay
      }
    }
    if(maxDepth > -1) {
      if(currentDepth++ < maxDepth) {
        if(el.childNodes) {
          for(var i in el.childNodes) {
            recursiveLoop(el.childNodes[i]);
          }
        }
      }
    } else {
      if(el.childNodes) {
        for(var i in el.childNodes) {
          recursiveLoop(el.childNodes[i]);
        }
      }
    }
  }

  recursiveLoop(node);

  if(typeof fulltime !== 'number') {
    fulltime = 0;
  }

  return fulltime;
}

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
var addEndEventListener = function(node, listener, depth) {
  if(typeof listener !== 'function')
  {
    var listener = function(){ return {} };
  }
  return new Promise(function(resolve, reject) {
    var time = detectAnimationEndTime(node, depth);
    var timeout = setTimeout(function() {
      var returner = listener();
      returner.time = time;
      resolve(returner);
    }, time);
  });
}

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


export default Animation;
