import History from "./wtc-history";
import Animation from "./wtc-AnimationEvents";

const STATES = {
  'OK'                : 0,
  'CLICKED'           : 1,
  'LOADING'           : 2,
  'TRANSITIONING'     : 4,
  'LOADED'            : 8
}

const SELECTORS = {
  'CHILDREN'          : 0 // This indicates that the selection should be all children. This assumes that we have a valid target to work with.
}

const ERRORS = {
  'GENERIC_ERROR'     : 0,
  'BAD_PROMISE'       : 1,
  'LOAD_ERROR'        : 2
}

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
class AJAX extends History {

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
  static initLinks(rootDocument = document.body) {
    const links = rootDocument.querySelectorAll(`[${this.attributeAjax}="true"]`);

    links.forEach((link)=> {
      // Removing this attribute ensures that this link doesn't get a second AJAX listener attached to it.
      link.removeAttribute(this.attributeAjax);

      link.addEventListener('click', (e)=> {
        this._triggerAjaxLink(e);

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
  static ajaxGet(URL, target, selection, linkTarget, fromPop = false, data = {}) {

    // Set the state of the AJAX class to clicked, incidating something is loading
    if( this.state > STATES.CLICKED )
    {
      if( this.devmode )
      {
        console.warn( "Tried run an AJAX GET when the object wasn't in OK or CLICKED mode" );
      }

      return;
    }

    // Retrieve a request object and construct a valid URL
    const req = this.requestObject;
    const parsedURL = this._fixURL(URL);

    var readyState = 0;
    var status = 0;
    var args = arguments;

    var requestPromise = new Promise(function handler(resolve, reject) {

      // Listen for the ready state
      req.addEventListener('readystatechange', (e) => {
        readyState = e.target.readyState;
        status = e.target.status;
      });

      // Listem for the load event
      req.addEventListener('load', (e) => {
        // If we have a ready state that indicated that the load was a success, continue
        if( req.status >= 200 && req.status < 400 ) {
          // Get the request response text
          var responseText = req.responseText
          var resolver = {
            responseText: responseText, 
            arguments: args, 
            linkTarget: linkTarget || null
          }
          resolve(resolver);
        } else {
          reject(ERRORS.LOAD_ERROR);
        }
      });

      req.addEventListener('error', (e) => {
        reject(ERRORS.LOAD_ERROR);
      });
    }.bind(this));

    // This promise takes the returned promise and runs the equivalent of a "finally"
    Promise.resolve(requestPromise).then(function(resolver) {
      if(resolver.error) {
        throw resolver.error
      } else if(!resolver.responseText) {
        throw ERRORS.BAD_PROMISE
      } else {
        // Finally, pass the result.
        this._parseResponse(resolver.responseText, target, selection, fromPop, linkTarget)
      }
    }.bind(this)).catch(function(err) {
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
  static _popstate(e) {
    var base, state = {};
    var hasPoppedState = super._popstate(e);

    if( hasPoppedState ) {
      state = (base = this.history).state || (base.state = e.state || (e.state = window.event.state));
    }

    var href = document.location.href;
    var target = state.target || this.lastChangedTarget;
    var selection = state.selection || SELECTORS.CHILDREN;
    var data = state.data || {};
    var onload = state.onload || function(){};
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
  static _triggerAjaxLink(e) {
    if( this.state != STATES.OK )
    {
      if( this.devmode )
      {
        console.warn( "Tried to click an AJAX link when the object wasn't in OK mode" );
      }

      return;
    }

    // Find all of the relevant atteibutes
    const link      = e.target;
    const href      = link.getAttribute('href');
    const target    = link.getAttribute(this.attributeTarget);
    const selection = link.getAttribute(this.attributeSelection);

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
  static _parseResponse(content, target, selection, fromPop = false, onload, onerror, linkTarget) {

    var doc, results, oldTitle = document.title, newTitle, targetNodes;

    // Parse the document from the content provided
    doc = document.createElement('div');
    doc.innerHTML = content;

    // Find the new page title
    newTitle = doc.getElementsByTagName('title')[0].text;

    targetNodes = document.querySelectorAll(target);

    // I need to add a tonne of things here, like support for transition off etc.
    // Currently I'm just statically removing and adding in elements.
    targetNodes.forEach((el) => {
      // Wokflow will go like this:
      // Add the transition class to the element
      // Time out a bit (10ms) and then add the transition end class
      // Once complete, remove the transition classes and replace the old elements with the new (innerHTML)
      // Then add the transition class to the element
      // Time out a bit (10ms) and then add the transition end class

      el.innerHTML = '';

      // Find the results of the selection
      // N.B. This will all need to be updated to support the array syntax
      if( selection === SELECTORS.CHILDREN )
      {
        results = doc.querySelectorAll(`${target} > *`);
      } else {
        results = doc.querySelectorAll(selection);
      }

      results.forEach(function(result) {
        el.appendChild(result.cloneNode(true));
      });
    });

    // Update the internal reference to the last target
    this.lastChangedTarget = target;

    if( !fromPop ) {
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
  static _error(readyState, status, errorState = ERRORS.GENERIC_ERROR) {
    var errorStateConst = (function(val) { for(key in ERRORS) { if(ERRORS[key] == val) return key } return 'GENERIC_ERROR' })(errorState)
    console.warn(`%c Error loading AJAX link. readyState: ${readyState}. status: ${status}. errorState: ${errorStateConst}`, 'background: #222; color: #ff7c3a')
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
  static set attributeAjax(attribute) {
    if(typeof attribute === 'string') {
      this._attributeAjax = attribute;
    } else {
      console.warn('All attributes must be strings.');
    }
  }
  static get attributeAjax() {
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
  static set attributeTarget(attribute) {
    if(typeof attribute === 'string') {
      this._attributeTarget = attribute;
    } else {
      console.warn('All attributes must be strings.');
    }
  }
  static get attributeTarget() {
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
  static set attributeSelection(attribute) {
    if(typeof attribute === 'string') {
      this._attributeSelection = attribute;
    } else {
      console.warn('All attributes must be strings.');
    }
  }
  static get attributeSelection() {
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
  static set classBaseTransition(classBase) {
    if(typeof classBase === 'string') {
      this._classBaseTransition = classBase;
    } else {
      console.warn('All attributes must be strings.');
    }
  }
  static get classBaseTransition() {
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
  static set attributeShouldNavigate(attribute) {
    if(typeof attribute === 'string') {
      this._attributeShouldNavigate = attribute;
    } else {
      console.warn('All attributes must be strings.');
    }
  }
  static get attributeShouldNavigate() {
    return this._attributeShouldNavigate || 'data-wtc-ajax-should-navigate';
  }

  /**
   * returns a new requestObject. Wrapping placeholder for now waiting on enhancements.
   *
   * @readonly
   * @return {object}  requestObject
   */
  static get requestObject() {
    return new XMLHttpRequest();
  }

  /**
   * returns a new last changed target. This is used to determine what to changed
   * when navigating back via history.
   *
   * @return {object}  either an array of nodes or a single node.
   * @default null
   */
  static set lastChangedTarget(target) {
    this._lastChangedTarget = target;
  }
  static get lastChangedTarget() {
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
  static set state(state) {
    if( typeof state === 'string' ) {
      if( STATES[state] !== undefined ) {
        this._state = STATES[state];
        return
      }
    } else if( typeof state === 'number' ) {
      for(var _state in STATES) {
        if(STATES[_state] === state) {
          this._state = state;

          if( this.devmode )
          {
            console.log(`%c AJAX state change: ${this._state} `, 'background: #222; color: #bada55');
          }

          return;
        }
      }
    }
    console.warn('state must be one of OK, CLICKED, LOADING, LOADED.');
  }
  static get state() {
    return this._state || 0;
  }

  /**
   * The last URL to be parsed by the AJAX object. Generally speaking, this is the
   * last URL to be loaded or attempted loaded.
   *
   * @return {string}  The parsed URL string
   * @default null
   */
  static set lastParsedURL(parsedURL) {
    if( typeof parsedURL === 'string' ) {
      this._lastParsedURL = parsedURL;
    }
  }
  static get lastParsedURL() {
    return this._lastParsedURL || null;
  }
}

export { AJAX, ERRORS, STATES };
