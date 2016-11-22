import History from "./wtc-history";

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
   * @param  {DOMElement} rootDocument  The DOM element to find links in. Defaults to body.
   */
  static initLinks(rootDocument = document.body) {
    const links = rootDocument.querySelectorAll(`[${this.attributeAjax}="true"]`);

    links.forEach((link)=> {
      // Removing this attribute ensures that this link doesn't get a second AJAX listener attached to it.
      link.removeAttribute(this.attributeAjax);

      link.addEventListener('click', (e)=> {
        this.triggerAjaxLink(e);

        e.preventDefault();
      });
      console.log(link);
    });
  }

  static triggerAjaxLink(e) {
    const link      = e.target;
    const href      = link.getAttribute('href');
    const target    = link.getAttribute(this.attributeTarget);
    const selection = link.getAttribute(this.attributeSelection);

    console.log(link, href, target, selection);

    this.ajaxGet(link, target, selection);
  }

  static ajaxGet(URL, target, selection, data = {}, onload, onloadcontext) {
    const req = this.requestObject;
    const parsedURL = this._fixURL(URL);

    var readyState = 0;
    var status = 0;

    req.addEventListener('readystatechange', (e) => {
      readyState = e.target.readyState;
      status = e.target.status;
    });

    req.addEventListener('load', (e) => {
      if( req.status >= 200 && req.status < 400 ) {
        this.parseResponse(req.responseText, target, selection, onload, onloadcontext)
      } else {
        this.error(req.status, readyState, status);
      }
    });

    req.addEventListener('error', (e) => {
      this.error(readyState, status);
    });

    req.open('GET', parsedURL, true);
    req.send(data);

    return req;
  }

  static parseResponse(content, target, selection, onload, onloadcontext) {

    var results, targetNodes = document.querySelectorAll(target);

    var doc = document.createElement('div');
    doc.innerHTML = content;

    results = doc.querySelectorAll(selection);

    console.log(doc);
    console.log(selection);
    console.log(results);

    // I need to add a tonne of things here, like support for transition off etc.
    // Currently I'm just statically removing and adding in elements.
    targetNodes.forEach((el) => {
      el.innerHTML = '';

      console.log(el)

      results.forEach(function(result) {
        el.appendChild(result.cloneNode(true));
      });
    });

    // document.body.removeChild(iframe);

  }

  /**
   * Private methods
   */


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
}

export default AJAX;
