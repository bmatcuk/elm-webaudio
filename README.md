elm-webaudio
============

This project is abandoned! It has been superseded by [trotha01's implementation](https://github.com/trotha01/elm-webaudio).

**ABANDONED**: This project has been abandoned. When this library was authored,
there was no good way to put a functional wrapper around a very non-functional
API such as WebAudio. I thought this was a decent attempt, for the time. Since
then, elm has grown to include new language constructs that would make the
implementation easier. However, I do not have the time or interest to rewrite
this library using the new language features. If you'd like to take the torch,
[submit an issue](https://github.com/bmatcuk/elm-webaudio/issues) with your
project's URL and I'll include it in this README so that others may find it.

The `elm-webaudio` library connects your [Elm](http://elm-lang.org/) programs
to the [Web Audio API](http://webaudio.github.io/web-audio-api/). This library
is somewhat experimental and incomplete, but it is useable. Check out an example
of the library in use: [oscillator scales](http://www.squeg.net/elm-webaudio/Scales.html).

And another, much more complicated example:
[soundcloud](http://www.squeg.net/elm-webaudio/Visual.html).

I highly recommend you check out the documentation for the Web Audio API to
make sure you understand the concepts before trying to use this library. This
library basically represents a fairly thin wrapper around the Web Audio API,
so everything in the Web Audio API documentation applies.
