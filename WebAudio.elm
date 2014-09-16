module WebAudio where

{-| A module for accessing the Web Audio API via Elm.

# Getting Started

First, you will need an `AudioContext`. In most cases, a single context is all
you'll need. In this case, you can use the `DefaultContext`. If, for some
reason, you need more than one context, you can use the `createContext`
function to create a context.

I highly recommend you read through the Web Audio API documentation to
familiarize yourself with the concepts. You can find the documentation here:
http://webaudio.github.io/web-audio-api/

@docs AudioContext, createContext, getSampleRate, getCurrentTime

# Special Notes

Most "set" functions take the object whose value is being set as the last
parameter, and then the function returns that same object to facilitate
function chaining using the "|>" operator.

# Audio Params

Most parameters for various Audio Nodes are actually "AudioParams". These
allow you to either set a constant value, or schedule changes to the value at
appropriate times. All times are relative to the AudioContext's current time.
If you try to schedule a change for a time that has already passed, the change
will take effect immediately.

The documentation below will note if the node has any AudioParams that you can
modify in the form of a bulleted list. These params can be accessed using the
record notation. For example, a Biquad Filter Node has a "frequency" param. It
could be accessed with: `node.frequency`

@docs AudioParam, setValue, setValueAtTime, linearRampToValue, exponentialRampToValue, setTargetAtTime, setValueCurveAtTime, cancelScheduledValues

# Audio Nodes

Once you have your AudioContext, you can begin to build your graph of Audio
Nodes.

@docs AudioNode, ChannelCountMode, ChannelInterpretation, connectNodes, connectToParam, getChannelCount, setChannelCount, getChannelCountMode, setChannelCountMode, getChannelInterpretation, setChannelInterpretation, tapNode

# Analyser Nodes

@docs AnalyserNode, createAnalyserNode, getFFTSize, setFFTSize, getMaxDecibels, setMaxDecibels, getMinDecibels, setMinDecibels, getSmoothingConstant, setSmoothingConstant

# Audio Buffer Source Nodes

These nodes are currently unimplemented.

# Audio Destination Nodes

Each Audio Context has only one Audio Destination Node.

@docs AudioDestinationNode, getDestinationNode, getMaxChannelCount

# Audio Worker Node

These nodes are currently unimplemented.

# Biquad Filter Nodes

Biquad Filter Nodes have the following AudioParams:

* frequency
* detune
* q
* gain

@docs BiquadFilterNode, BiquadFilterType, createBiquadFilterNode, getFilterType, setFilterType

# Channel Merger Nodes

@docs ChannelMergerNode, createChannelMergerNode

# Channel Splitter Nodes

@docs ChannelSplitterNode, createChannelSplitterNode

# Convolver Nodes

These nodes are currently unimplemented.

# Delay Nodes

Delay Nodes have the following AudioParams:

* delayTime

@docs DelayNode, createDelayNode

# Dynamics Compressor Nodes

Dynamics Compressor Nodes have the following AudioParams:

* threshold
* knee
* ratio
* reduction
* attack
* release

@docs DynamicsCompressorNode, createDynamicsCompressorNode

# Gain Nodes

Gain Nodes have the following AudioParams:

* gain

@docs GainNode, createGainNode

# Media Element Audio Source Nodes

These nodes are currently unimplemented.

# Media Stream Audio Destination Nodes

These nodes are currently unimplemented.

# Media Stream Audio Source Nodes

These nodes are currently unimplemented.

# Oscillator Nodes

Oscillator Nodes have the following AudioParams:

* frequency
* detune

@docs OscillatorNode, OscillatorWaveType, createOscillatorNode, getOscillatorWaveType, setOscillatorWaveType, startOscillator, stopOscillator

# Panner Nodes

@docs PannerNode, PanningModel, DistanceModel, createPannerNode, getPanningModel, setPanningModel, getDistanceModel, setDistanceModel, getReferenceDistance, setReferenceDistance, getMaxDistance, setMaxDistance, getRolloffFactor, setRolloffFactor, getConeInnerAngle, setConeInnerAngle, getConeOuterAngle, setConeOuterAngle, getConeOuterGain, setConeOuterGain, setPosition, setOrientation, setVelocity

# Script Processor Nodes

These nodes are currently unimplemented.

# Wave Shaper Nodes

These nodes are currently unimplemented.

-}

import Native.WebAudio



{-| The AudioContext

Think of the `DefaultContext` as a global singleton. Just use the `DefaultContext`
unless there's some reason you need to have more than one context.
-}
data AudioContext = AudioContext | DefaultContext

{-| Create a new AudioContext

Instead of creating a context, you can use the `DefaultContext`. This will be
sufficient for most people.
-}
createContext : () -> AudioContext
createContext = Native.WebAudio.createContext

{-| Get the context's sample rate -}
getSampleRate : AudioContext -> Float
getSampleRate = Native.WebAudio.getSampleRate

{-| Get the context's current time -}
getCurrentTime : AudioContext -> Float
getCurrentTime = Native.WebAudio.getCurrentTime



{-| AudioParams

An AudioParam is used in a lot of places to allow you to either set a static
value (such as a frequency, gain, etc), or to schedule changes over time.
-}
data AudioParam = AudioParam String

{-| Set the static value of the param -}
setValue : Float -> AudioParam -> AudioParam
setValue = Native.WebAudio.setValue

{-| Schedule the AudioParam to change values at a specific time -}
setValueAtTime : Float -> Float -> AudioParam -> AudioParam
setValueAtTime = Native.WebAudio.setValueAtTime

{-| Schedule the AudioParam to linearly ramp to a new value, finishing at the
specified time.
-}
linearRampToValue : Float -> Float -> AudioParam -> AudioParam
linearRampToValue = Native.WebAudio.linearRampToValue

{-| Schedule the AudioParam to exponentially ramp to a new value, finishing at
the specified time.
-}
exponentialRampToValue : Float -> Float -> AudioParam -> AudioParam
exponentialRampToValue = Native.WebAudio.exponentialRampToValue

{-| Schedule the AudioParam to exponentially approach the target, starting at
the specified time. The "constant" determines how quickly the value changes
with the value changing roughly 63.2% in the first time constant.
-}
setTargetAtTime : Float -> Float -> Float -> AudioParam -> AudioParam
setTargetAtTime = Native.WebAudio.setTargetAtTime

{-| Schedule a curve of values to start at the given time and run for the
specified duration. Each value will take effect for N / duration seconds.
-}
setValueCurveAtTime : [Float] -> Float -> Float -> AudioParam -> AudioParam
setValueCurveAtTime = Native.WebAudio.setValueCurveAtTime

{-| Cancel all scheduled changes at and after the specified time. -}
cancelScheduledValues : Float -> AudioParam -> AudioParam
cancelScheduledValues = Native.WebAudio.cancelScheduledValues



{-| AudioNodes

AudioNodes make up the building blocks of your audio signal graph. There are
source nodes which produce an audio stream, destination nodes which can create
sound from the stream, and processing nodes which allow you to modify the
stream such as filters, delays, and effects.

Audio Nodes have the following properties:
  * inputs: The number of inputs for this node. 0 means this is a source node.
  * outputs: The number of outputs for this node. 0 means this is a destination
    node.
-}
type AudioNode a = { a | inputs:Int, outputs:Int }

{-| How channels are counted during up-mixing and down-mixing -}
data ChannelCountMode = Max | ClampedMax | Explicit

{-| How individual channels are treated when up-mixing and down-mixing -}
data ChannelInterpretation = Speakers | Discrete

{-| Connect Audio Nodes

An output of node1 will be connected to an input of node2. You may specify the
index of the output to connect, and the index of the input. These indexes are
zero based. Fan-in and fan-out are both supported, so the output of a node can
be connected to multiple nodes, and multiple nodes can be connected to a single
input. This function will return node1 for chaining.
-}
connectNodes : AudioNode b -> Int -> Int -> AudioNode a -> AudioNode a
connectNodes = Native.WebAudio.connectNodes

{-| Connect an Audio Node to an Audio Param

The signal from an AudioNode may be fed into an AudioParam to control the
parameter value. You may also specify which output index to connect. The index
is zero based. Fan-in and fan-out are both supported, so the output of a node
can be connected to multiple AudioParams, and multiple AudioParams can be
connected to a single node. This function will return the node for chaining.
-}
connectToParam : AudioParam b -> Int -> AudioNode a -> AudioNode a
connectToParam = Native.WebAudio.connectToParam

{-| Get a Node's Channel Count

The number of channels used when up-mixing or down-mixing inputs. The default
is 2 for most nodes, but some nodes determine this based on other settings. If
the node has no inputs, this setting has no effect.
-}
getChannelCount : AudioNode a -> Int
getChannelCount = Native.WebAudio.getChannelCount

{-| Set a Node's Channel Count

The number of channels used when up-mixing or down-mixing inputs. The default
is 2 for most nodes, but some nodes determine this based on other settings. If
the node has no inputs, this setting has no effect.
-}
setChannelCount : Int -> AudioNode a -> AudioNode a
setChannelCount = Native.WebAudio.setChannelCount

{-| Get a Node's Channel Count Mode
@docs ChannelCountMode
-}
getChannelCountMode : AudioNode a -> ChannelCountMode
getChannelCountMode = Native.WebAudio.getChannelCountMode

{-| Set a Node's Channel Count Mode - returns the node itself for chaining.
@docs ChannelCountMode
-}
setChannelCountMode : ChannelCountMode -> AudioNode a -> AudioNode a
setChannelCountMode = Native.WebAudio.setChannelCountMode

{-| Get a Node's Channel Interpretation
@docs ChannelInterpretation
-}
getChannelInterpretation : AudioNode a -> ChannelInterpretation
getChannelInterpretation = Native.WebAudio.getChannelInterpretation

{-| Set a Node's Channel Interpretation - returns the node itself for chaining.
@docs ChannelInterpretation
-}
setChannelInterpretation : ChannelInterpretation -> AudioNode a -> AudioNode a
setChannelInterpretation = Native.WebAudio.setChannelInterpretation

{-| "Tap" a node

This is a convenience function, making it easy to access one of the node's
AudioParam properties and then return the node itself at the end so you can
continue to chain more functions.

For example, if "node" is an OscillatorNode:

```haskell
tapNode .frequency (\f -> setValue 440.0 f) node |> startOscillator 0.0
```
-}
tapNode : (a -> b) -> (b -> c) -> a -> a
tapNode f t n =
  let _ = t <| f n
  in n



{-| Type of an AnalyserNode -}
type AnalyserNode = AudioNode {}

{-| Create an AnalyserNode -}
createAnalyserNode : AudioContext -> AnalyserNode
createAnalyserNode = Native.WebAudio.createAnalyserNode

{-| Get the FFT Size of an Analyser Node -}
getFFTSize : AnalyserNode -> Int
getFFTSize = Native.WebAudio.getFFTSize

{-| Set the FFT Size of an Analyser Node

The FFT Size must be a power of 2 between 32 to 2048. Default is 2048. This
function returns the AnalyserNode for chaining
-}
setFFTSize : Int -> AnalyserNode -> AnalyserNode
setFFTSize = Native.WebAudio.setFFTSize

{-| Get the maximum power in the scaling range of the AnalyserNode -}
getMaxDecibels : AnalyserNode -> Float
getMaxDecibels = Native.WebAudio.getMaxDecibels

{-| Set the maximum power in the scaling range of the AnalyserNode

The default is -30. This function returns the AnalyserNode for chaining.
-}
setMaxDecibels : Float -> AnalyserNode -> AnalyserNode
setMaxDecibels = Native.WebAudio.setMaxDecibels

{-| Get the minimum power in the scaling range of the AnalyserNode -}
getMinDecibels : AnalyserNode -> Float
getMinDecibels = Native.WebAudio.getMinDecibels

{-| Set the minimum power in the scaling range of the AnalyserNode

The default is -100. This function returns the AnalyserNode for chaining.
-}
setMinDecibels : Float -> AnalyserNode -> AnalyserNode
setMinDecibels = Native.WebAudio.setMinDecibels

{-| Get the smoothing constant for the AnalyserNode -}
getSmoothingConstant : AnalyserNode -> Float
getSmoothingConstant = Native.WebAudio.getSmoothingConstant

{-| Set the smoothing constant for the AnalyserNode

A value from 0 to 1, where 0 represents no averaging. Default is 0.8. This
function returns the AnalyserNode for chaining.
-}
setSmoothingConstant : Float -> AnalyserNode -> AnalyserNode
setSmoothingConstant = Native.WebAudio.setSmoothingConstant



{-| TODO: Type of an AudioBufferSourceNode -}



{-| Type of an AudioDestinationNode -}
type AudioDestinationNode = AudioNode {}

{-| Get the AudioDestinationNode for the given context

Each context has only one AudioDestinationNode.
-}
getDestinationNode : AudioContext -> AudioDestinationNode
getDestinationNode = Native.WebAudio.getDestinationNode

{-| Get the maximum number of channels -}
getMaxChannelCount : AudioDestinationNode -> Int
getMaxChannelCount = Native.WebAudio.getMaxChannelCount



{-| TODO: Type of an AudioWorkerNode -}



{-| Type of a BiquadFilterNode -}
type BiquadFilterNode = AudioNode { frequency:AudioParam, detune:AudioParam, q:AudioParam, gain:AudioParam }

{-| Biquad Filter Type -}
data BiquadFilterType = LowPass | HighPass | BandPass | LowShelf | HighShelf | Peaking | Notch | AllPass

{-| Create a BiquadFilterNode -}
createBiquadFilterNode : AudioContext -> BiquadFilterNode
createBiquadFilterNode = Native.WebAudio.createBiquadFilterNode

{-| Get the type of the BiquadFilterNode -}
getFilterType : BiquadFilterNode -> BiquadFilterType
getFilterType = Native.WebAudio.getFilterType

{-| Set the type of the BiquadFilterNode

The type of filter determines what the parameters mean. This function returns
the BiquadFilterNode for chaining.
-}
setFilterType : BiquadFilterType -> BiquadFilterNode -> BiquadFilterNode
setFilterType = Native.WebAudio.setFilterType



{-| Type of a ChannelMergerNode -}
type ChannelMergerNode = AudioNode {}

{-| Create a ChannelMergerNode

You may specify the number of inputs as the second parameter.
-}
createChannelMergerNode : AudioContext -> Int -> ChannelMergerNode
createChannelMergerNode = Native.WebAudio.createChannelMergerNode



{-| Type of a ChannelSplitterNode -}
type ChannelSplitterNode = AudioNode {}

{-| Create a ChannelSplitterNode

You may specify the number of outputs as the second parameter
-}
createChannelSplitterNode : AudioContext -> Int -> ChannelSplitterNode
createChannelSplitterNode = Native.WebAudio.createChannelSplitterNode



{-| TODO: Type of a ConvolverNode -}



{-| Type of a DelayNode -}
type DelayNode = AudioNode { delayTime:AudioParam }

{-| Create a DelayNode

You may specify the maximum delay time as the second parameter.
-}
createDelayNode : AudioContext -> Float -> DelayNode
createDelayNode = Native.WebAudio.createDelayNode



{-| Type of a DynamicsCompressorNode -}
type DynamicsCompressorNode = AudioNode { threshold:AudioParam, knee:AudioParam, ratio:AudioParam, reduction:AudioParam, attack:AudioParam, release:AudioParam }

{-| Create a DynamicsCompressorNode -}
createDynamicsCompressorNode : AudioContext -> DynamicsCompressorNode
createDynamicsCompressorNode = Native.WebAudio.createDynamicsCompressorNode



{-| Type of a GainNode -}
type GainNode = AudioNode { gain:AudioParam }

{-| Create a GainNode -}
createGainNode : AudioContext -> GainNode
createGainNode = Native.WebAudio.createGainNode

{-| TODO: Type of a MediaElementAudioSourceNode -}
{-| TODO: Type of a MediaStreamAudioDestinationNode -}
{-| TODO: Type of a MediaStreamAudioSourceNode -}



{-| Type of an OscillatorNode -}
type OscillatorNode = AudioNode { frequency:AudioParam, detune:AudioParam }

{-| Wave types for OscillatorNodes

TODO: Custom
-}
data OscillatorWaveType = Sine | Square | Sawtooth | Triangle

{-| Create an OscillatorNode

Second parameter is the wave type of the oscillator
-}
createOscillatorNode : AudioContext -> OscillatorWaveType -> OscillatorNode
createOscillatorNode = Native.WebAudio.createOscillatorNode

{-| Get the oscillator wave type -}
getOscillatorWaveType : OscillatorNode -> OscillatorWaveType
getOscillatorWaveType = Native.WebAudio.getOscillatorWaveType

{-| Set the oscillator wave type

This function returns the oscillator for chaining.
-}
setOscillatorWaveType : OscillatorWaveType -> OscillatorNode -> OscillatorNode
setOscillatorWaveType = Native.WebAudio.setOscillatorWaveType

{-| Schedule the Oscillator to start

This method returns the oscillator for chaining.
-}
startOscillator : Float -> OscillatorNode -> OscillatorNode
startOscillator = Native.WebAudio.startOscillator

{-| Schedule a stop time for the Oscillator.

WARNING:
After an end time has been set, the oscillator can no longer be started. Since
an oscillator can no longer be started after it has been stopped, the
oscillator is essentially useless. The system is supposed to automatically clean
up AudioNodes that are no longer in use, provided that the node meets a couple
requirements - one of which is that there are no more references to it.
Therefore, Elm.WebAudio will automatically free the reference to the underlying
javascript object as soon as a stop has been scheduled. What this means, from a
practical standpoint, is that any further attempt to manipulate the Oscillator
will result in a javascript error. It's not pretty, but, honestly, neither is
the WebAudio Javascript API.
-}
stopOscillator : Float -> OscillatorNode -> ()
stopOscillator = Native.WebAudio.stopOscillator



{-| Type of a PannerNode -}
type PannerNode = AudioNode {}

{-| Panning Model -}
data PanningModel = EqualPower | HRTF

{-| Distance Model -}
data DistanceModel = Linear | Inverse | Exponential

{-| Create a PannerNode -}
createPannerNode : AudioContext -> PannerNode
createPannerNode = Native.WebAudio.createPannerNode

{-| Get the Panning Model of the Panner -}
getPanningModel : PannerNode -> PanningModel
getPanningModel = Native.WebAudio.getPanningModel

{-| Set the Panning Model of the Panner

This function returns the PannerNode for chaining.
-}
setPanningModel : PanningModel -> PannerNode -> PannerNode
setPanningModel = Native.WebAudio.setPanningModel

{-| Get the Distance Model of the Panner -}
getDistanceModel : PannerNode -> DistanceModel
getDistanceModel = Native.WebAudio.getDistanceModel

{-| Set the Distance Model of the Panner

This function returns the PannerNode for chaining.
-}
setDistanceModel : DistanceModel -> PannerNode -> PannerNode
setDistanceModel = Native.WebAudio.setDistanceModel

{-| Get the reference distance of the panner -}
getReferenceDistance : PannerNode -> Float
getReferenceDistance = Native.WebAudio.getReferenceDistance

{-| Set the reference distance of the panner -}
setReferenceDistance : Float -> PannerNode -> PannerNode
setReferenceDistance = Native.WebAudio.setReferenceDistance

{-| Get the max distance of the panner -}
getMaxDistance : PannerNode -> Float
getMaxDistance = Native.WebAudio.getMaxDistance

{-| Set the max distance of the pannel -}
setMaxDistance : Float -> PannerNode -> PannerNode
setMaxDistance = Native.WebAudio.setMaxDistance

{-| Get the rolloff factor for the panner -}
getRolloffFactor : PannerNode -> Float
getRolloffFactor = Native.WebAudio.getRolloffFactor

{-| Set the rolloff factor for the panner -}
setRolloffFactor : Float -> PannerNode -> PannerNode
setRolloffFactor = Native.WebAudio.setRolloffFactor

{-| Get the cone inner angle for the panner -}
getConeInnerAngle : PannerNode -> Float
getConeInnerAngle = Native.WebAudio.getConeInnerAngle

{-| Set the cone inner angle for the panner -}
setConeInnerAngle : Float -> PannerNode -> PannerNode
setConeInnerAngle = Native.WebAudio.setConeInnerAngle

{-| Get the cone outer angle for the panner -}
getConeOuterAngle : PannerNode -> Float
getConeOuterAngle = Native.WebAudio.getConeOuterAngle

{-| Set the cone outer angle for the panner -}
setConeOuterAngle : Float -> PannerNode -> PannerNode
setConeOuterAngle = Native.WebAudio.setConeOuterAngle

{-| Get the cone outer gain for the panner -}
getConeOuterGain : PannerNode -> Float
getConeOuterGain = Native.WebAudio.getConeOuterGain

{-| Set the cone outer gain for the panner -}
setConeOuterGain : Float -> PannerNode -> PannerNode
setConeOuterGain = Native.WebAudio.setConeOuterGain

{-| Set the listener position for the panner -}
setPosition : Float -> Float -> Float -> PannerNode -> PannerNode
setPosition = Native.WebAudio.setPosition

{-| Set the listener orientation for the panner -}
setOrientation : Float -> Float -> Float -> PannerNode -> PannerNode
setOrientation = Native.WebAudio.setOrientation

{-| Set the listener velocity for the panner -}
setVelocity : Float -> Float -> Float -> PannerNode -> PannerNode
setVelocity = Native.WebAudio.setVelocity



{-| TODO: Type of a ScriptProcessorNode -}
{-| TODO: Type of a WaveShaperNode -}
