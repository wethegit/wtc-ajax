import AJAX from "../src/wtc-ajax";

// Initialise the history object in dev mode
AJAX.init(true);
// Set the document root for the application (if necessary)
AJAX.documentRoot = '/demo/';

function ready(fn) {
  if (document.readyState != 'loading') {
    fn();
  } else {
    document.addEventListener('DOMContentLoaded', fn);
  }
}

ready(function()
{
  AJAX.initLinks();
});

window.AJAXObj = AJAX;
