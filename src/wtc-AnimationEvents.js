
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
var detectAnimationEndTime = function(node)
{
  var fulltime = 0;
  var timeRegex = /(\d+\.?(\d+)?)(s|ms)/;
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
    if(el.childNodes) {
      for(i in el.childNodes) {
        recursiveLoop(el.childNodes[i]);
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
 * Allows us to add an end event listener to the node.
 *
 * @param  {HTMLElement}  node      The element to attach the end event listener to
 * @param  {function}     listener  The function to run when the animation is finished
 * @return {object}                 The utlity object that allows us to cancel or end this
 */
var addEndEventListener = function(node, listener) {
  if(typeof listener !== 'function')
  {
    var listener = function(){};
  }
  var time = detectAnimationEndTime(node);
  var timeout = setTimeout(listener, time)
  var util = {
    time: time,
    timeout: timeout,
    // target: node, // Removed this so as not to cause leaks.
    cancel: function() {
      clearTimeout(timeout);
    },
    end: function() {
      this.cancel();
      listener();
    }
  };

  return util;
}

/**
 * The animation object encapsulates all of the basic functionality that allows us
 * to detect animation etc.
 *
 * @export
 */
var Animation = {
  addEndEventListener: addEndEventListener
};


export default Animation;
