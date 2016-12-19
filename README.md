# wtc-ajax
Ajax utility for simplified interoperability

## Documentation
Documentation can be found here
[here](https://wethegit.github.io/wtc-ajax/)

### Navigation
[Global space](http://wtc-history.localhost/docs/global.html)

#### Namespaces
- [AJAX](http://wtc-history.localhost/docs/AJAX.html)
- [History](http://wtc-history.localhost/docs/History.html)

#### Modules
- [AnimationEvents](http://wtc-history.localhost/docs/module-wtc-AnimationEvents.html)

   This probably needs to be abstracted out into a separate module

## Usage

The class can be used in a couple of initial ways, either using data attributes on links,
or by using javascript to directly interact with the class.

### Data attributes
TBC

### Javascript
TBC

### Transitions

The class supports the detection of transition states on the loading element. When
an AJAX link is executed, the class will add a CSS class to the element, and will
then transition to a series of other CSS classes through the lifecycle of the
AJAX load call.

TBC

## Version
0.5 beta

## Last updated
Dec 16, 2016

## To do
- Add event emition functionality to emit events at various stages
