import History from "./wtc-history";

const STATES = {
  'OK'                : 0,
  'CLICKED'           : 1,
  'LOADING'           : 2,
  'TRANSITIONING'     : 4,
  'LOADED'            : 8
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
   * This builds out an AJAX request, normally based on the clicking of a link,
   * but it can alternatively be called directly on the AJAX object.
   *
   * @static
   * @param  {string} URL             The URL to get. This will be parsed into an appropriate fomat by the object.
   * @param  {string} target          The target for the loaded content. This can be a string (selector), or a JSON array of selector strings.
   * @param  {string} selection       This is a selector (or JSON of selectors) that determines what to cut from the loaded content.
   * @param  {object} [data = {}]       The data to pass to the AJAX call.
   * @param  {function} [onload]        The onload function to run (TBI).
   * @param  {object} [onloadcontext]   The context under which to run the onload function.
   */
  static ajaxGet(URL, target, selection, data = {}, onload, onloadcontext) {

    if( this.state > STATES.CLICKED )
    {
      if( this.devmode )
      {
        console.warn( "Tried run an AJAX GET when the object wasn't in OK or CLICKED mode" );
      }

      return;
    }

    console.log('-----------');
    const req = this.requestObject;
    const parsedURL = this._fixURL(URL);

    console.log('-----------');

    var readyState = 0;
    var status = 0;

    req.addEventListener('readystatechange', (e) => {
      readyState = e.target.readyState;
      status = e.target.status;
    });

    req.addEventListener('load', (e) => {
      if( req.status >= 200 && req.status < 400 ) {
        this._parseResponse(req.responseText, target, selection, onload, onloadcontext)
      } else {
        this._error(readyState, req.status);
      }
    });

    req.addEventListener('error', (e) => {
      this._error(readyState, status);
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
   * @param  {string} content         The loaded page content, this comes from the AJAX call.
   * @param  {string} target          The target for the loaded content. This can be a string (selector), or a JSON array of selector strings.
   * @param  {string} selection       This is a selector (or JSON of selectors) that determines what to cut from the loaded content.
   * @param  {function} [onload]        The onload function to run (TBI).
   * @param  {object} [onloadcontext]   The context under which to run the onload function.
   */
  static _parseResponse(content, target, selection, onload, onloadcontext) {

    var doc, results, oldTitle = document.title, newTitle, targetNodes = document.querySelectorAll(target);

    // Parse the document from the content provided
    doc = document.createElement('div');
    doc.innerHTML = content;

    // Find the new page title
    newTitle = doc.getElementsByTagName('title')[0].text;

    // Find the results of the selection
    // N.B. This will all need to be updated to support the array syntax
    results = doc.querySelectorAll(selection);

    // I need to add a tonne of things here, like support for transition off etc.
    // Currently I'm just statically removing and adding in elements.
    targetNodes.forEach((el) => {
      el.innerHTML = '';

      console.log(el)

      results.forEach(function(result) {
        el.appendChild(result.cloneNode(true));
      });
    });

    // Update the internal reference to the last target
    this.lastChangedTarget = target;

    // Push the new state to the history.
    this.push(this.lastParsedURL, newTitle, { target: target, selection: selection, onload: onload, onloadcontext: onloadcontext });

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
  static _error(readyState, status) {
    console.warn(`%c Error loading AJAX link. readyState: ${readyState}. status: ${status}`, 'background: #222; color: #ff7c3a')
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

export default AJAX;
