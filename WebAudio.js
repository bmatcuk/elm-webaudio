Elm.Native.WebAudio = {};
Elm.Native.WebAudio.make = function(elm) {
  elm.Native = elm.Native || {};
  elm.Native.WebAudio = elm.Native.WebAudio || {};
  if (elm.Native.WebAudio.values) return elm.Native.WebAudio.values;

  var List = Elm.Native.List.make(elm);
  var toArray = List.toArray;
  var fromArray = List.fromArray;



  var values = {};

  /* AudioContext */
  values.createContext = function() {
    return new (window.AudioContext || window.webkitAudioContext)();
  };

  var defaultContext = null;
  function extractContext(context) {
    if (context.ctor === "AudioContext")
      return context.context;
    return defaultContext || (defaultContext = values.createContext());
  }

  values.getSampleRate = function(context) {
    return extractContext(context).sampleRate;
  };

  values.getCurrentTime = function(context) {
    return extractContext(context).currentTime;
  };



  /* AudioParam */
  values.setValue = F2(function(val, param) {
    param._node._node[param._0].value = val;
    return param;
  });

  values.getValue = function(param) {
    return param._node._node[param._0].value;
  };

  values.setValueAtTime = F3(function(value, time, param) {
    param._node._node[param._0].setValueAtTime(value, time);
    return param;
  });

  values.linearRampToValue = F3(function(value, time, param) {
    param._node._node[param._0].linearRampToValueAtTime(value, time);
    return param;
  });

  values.exponentialRampToValue = F3(function(value, time, param) {
    param._node._node[param._0].exponentialRampToValueAtTime(value, time);
    return param;
  });

  values.setTargetAtTime = F4(function(target, starttime, constant, param) {
    param._node._node[param._0].setTargetAtTime(target, starttime, constant);
    return param;
  });

  values.setValueCurveAtTime = F4(function(curve, starttime, duration, param) {
    param._node._node[param._0].setValueCurveAtTime(toArray(curve), starttime, duration);
    return param;
  });

  values.cancelScheduledValues = F2(function(time, param) {
    param._node._node[param._0].cancelScheduledValues(time);
    return param;
  });



  /* Audio Node Utility Functions*/
  function buildAudioNode(node) {
    return {_:{}, inputs:node.numberOfInputs, outputs:node.numberOfOutputs, _node:node};
  }

  function buildAudioParam(externalName, internalName, node) {
    node[externalName] = {ctor: "AudioParam", _0: internalName, _node: node};
  }

  function buildGetter(externalName, internalName) {
    values[externalName] = function(node) {
      return node._node[internalName];
    };
  }

  function buildSetter(externalName, internalName) {
    values[externalName] = F2(function(value, node) {
      node._node[internalName] = value;
      return node;
    });
  }

  function buildProperty(externalName, internalName) {
    buildGetter('get' + externalName, internalName);
    buildSetter('set' + externalName, internalName);
  }



  /* Audio Node */
  values.connectNodes = F4(function(destination, outputIdx, inputIdx, source) {
    source._node.connect(destination._node, outputIdx, inputIdx);
    return source;
  });

  values.connectToParam = F3(function(destination, outputIdx, source) {
    source._node.connect(destination.param, outputIdx);
    return source;
  });

  buildProperty('ChannelCount', 'channelCount');

  values.getChannelCountMode = function(node) {
    switch (node._node.channelCountMode) {
      case "max":
        return elm.WebAudio.values.Max;
      case "clamped-max":
        return elm.WebAudio.values.ClampedMax;
      case "explicit":
        return elm.WebAudio.values.Explicit;
    }
  };

  values.setChannelCountMode = F2(function(mode, node) {
    switch (mode.ctor) {
      case "Max":
        node._node.channelCountMode = "max";
        break;
      case "ClampedMax":
        node._node.channelCountMode = "clamped-max";
        break;
      case "Explicit":
        node._node.channelCountMode = "explicit";
        break;
    }
    return node;
  });

  values.getChannelInterpretation = function(node) {
    switch (node._node.channelInterpretation) {
      case "speakers":
        return elm.WebAudio.values.Speakers;
      case "discrete":
        return elm.WebAudio.values.Discrete;
    }
  };

  values.setChannelInterpretation = F2(function(mode, node) {
    switch (mode.ctor) {
      case "Speakers":
        node._node.channelInterpretation = "speakers";
        break;
      case "Discrete":
        node._node.channelInterpretation = "discrete";
        break;
    }
    return node;
  });



  /* Analyser Node */
  values.createAnalyserNode = function(context) {
    var node = extractContext(context).createAnalyser();
    return buildAudioNode(node);
  };

  buildProperty('FFTSize', 'fftSize');
  buildProperty('MaxDecibels', 'maxDecibels');
  buildProperty('MinDecibels', 'minDecibels');
  buildProperty('SmoothingConstant', 'smoothingTimeConstant');

  values.getByteFrequencyData = function(node) {
    if (!node._bFreq || node._bFreq.length != node._node.frequencyBinCount)
      node._bFreq = new Uint8Array(node._node.frequencyBinCount);
    node._node.getByteFrequencyData(node._bFreq);
    return fromArray(node._bFreq);
  };

  values.getByteTimeDomainData = function(node) {
    if (!node._bTime || node._bTime.length != node._node.fftSize)
      node._bTime = new Uint8Array(node._node.fftSize);
    node._node.getByteTimeDomainData(node._bTime);
    return fromArray(node._bTime);
  };

  values.getFloatFrequencyData = function(node) {
    if (!node._fFreq || node._fFreq.length != node._node.frequencyBinCount)
      node._fFreq = new Float32Array(node._node.frequencyBinCount);
    node._node.getFloatFrequencyData(node._fFreq);
    return fromArray(node._fFreq);
  };

  values.getFloatTimeDomainData = function(node) {
    if (!node._fTime || node._fTime.length != node._node.fftSize)
      node._fTime = new Float32Array(node._node.fftSize);
    node._node.getFloatTimeDomainData(node._fTime);
    return fromArray(node._fTime);
  };



  /* TODO: Audio Buffer Source Node */



  /* AudioDestinationNode */
  values.getDestinationNode = function(context) {
    var node = extractContext(context).destination;
    return buildAudioNode(node);
  }

  buildGetter('MaxChannelCount', 'maxChannelCount');



  /* TODO: Audio Worker Node */



  /* Biquad Filter Node */
  values.createBiquadFilterNode = function(context) {
    var node = extractContext(context).createBiquadFilter();
    var ret = buildAudioNode(node);
    buildAudioParam('frequency', 'frequency', ret);
    buildAudioParam('detune', 'detune', ret);
    buildAudioParam('q', 'q', ret);
    buildAudioParam('gain', 'gain', ret);
    return ret;
  }

  values.getFilterType = function(node) {
    switch (node._node.type) {
      case "lowpass":
        return elm.WebAudio.values.LowPass;
      case "highpass":
        return elm.WebAudio.values.HighPass;
      case "bandpass":
        return elm.WebAudio.values.BandPass;
      case "lowshelf":
        return elm.WebAudio.values.LowShelf;
      case "highshelf":
        return elm.WebAudio.values.HighShelf;
      case "peaking":
        return elm.WebAudio.values.Peaking;
      case "notch":
        return elm.WebAudio.values.Notch;
      case "allpass":
        return elm.WebAudio.values.AllPass;
    }
  }

  values.setFilterType = F2(function(type, node) {
    switch (type.ctor) {
      case "LowPass":
        node._node.type = "lowpass";
        break;
      case "HighPass":
        node._node.type = "highpass";
        break;
      case "BandPass":
        node._node.type = "bandpass";
        break;
      case "LowShelf":
        node._node.type = "lowshelf";
        break;
      case "HighShelf":
        node._node.type = "highshelf";
        break;
      case "Peaking":
        node._node.type = "peaking";
        break;
      case "Notch":
        node._node.type = "notch";
        break;
      case "AllPass":
        node._node.type = "allpass";
        break;
    }
    return node;
  });



  /* ChannelMergerNode */
  values.createChannelMergerNode = F2(function(context, numberOfInputs) {
    var node = extractContext(context).createChannelMerger(numberOfInputs);
    return buildAudioNode(node);
  });



  /* ChannelSplitterNode */
  values.createChannelSplitterNode = F2(function(context, numberOfOutputs) {
    var node = extractContext(context).createChannelSplitter(numberOfOutputs);
    return buildAudioNode(node);
  });



  /* DelayNode */
  values.createDelayNode = F2(function(context, maxDelayTime) {
    var node = extractContext(context).createDelay(maxDelayTime);
    var ret = buildAudioNode(node);
    buildAudioParam('delayTime', 'delayTime', ret);
    return ret;
  });



  /* DynamicsCompressorNode */
  values.createDynamicsCompressorNode = function(context) {
    var node = extractContext(context).createDynamicsCompressor();
    var ret = buildAudioNode(node);
    buildAudioParam('threshold', 'treshold', ret);
    buildAudioParam('knee', 'knee', ret);
    buildAudioParam('ratio', 'ratio', ret);
    buildAudioParam('reduction', 'reduction', ret);
    buildAudioParam('attack', 'attack', ret);
    buildAudioParam('release', 'release', ret);
    return ret;
  };



  /* GainNode */
  values.createGainNode = function(context) {
    var node = extractContext(context).createGain();
    var ret = buildAudioNode(node);
    buildAudioParam('gain', 'gain', ret);
    return ret;
  };



  /* MediaElementAudioSourceNode */
  values.createHiddenMediaElementAudioSourceNode = function(context) {
    var element = new Audio();
    return A2(values.createMediaElementAudioSourceNode, context, element);
  };

  values.createMediaElementAudioSourceNode = F2(function(context, element) {
    var node = extractContext(context).createMediaElementSource(element);
    var ret = buildAudioNode(node);
    ret._element = element;
    return ret;
  });

  values.getMediaElementIsLooping = function(node) {
    return node._element.loop;
  };

  values.setMediaElementIsLooping = F2(function(loop, node) {
    node._element.loop = loop;
    return node;
  });

  values.getMediaElementSource = function(node) {
    return node._element.src;
  };

  values.setMediaElementSource = F2(function(source, node) {
    node._element.src = source;
    node._element.load();
    return node;
  });

  values.playMediaElement = function(node) {
    node._element.play();
    return node;
  };

  values.pauseMediaElement = function(node) {
    node._element.pause();
    return node;
  };



  /* OscillatorNode */
  function setOscillatorWaveType(type, node) {
    switch (type.ctor) {
      case "Sine":
        node._node.type = "sine";
        break;
      case "Square":
        node._node.type = "square";
        break;
      case "Sawtooth":
        node._node.type = "sawtooth";
        break;
      case "Triangle":
        node._node.type = "triangle";
        break;
    }
    return node;
  }

  values.createOscillatorNode = F2(function(context, type) {
    var node = extractContext(context).createOscillator();
    var ret = buildAudioNode(node);
    buildAudioParam('frequency', 'frequency', ret);
    buildAudioParam('detune', 'detune', ret);
    return setOscillatorWaveType(type, ret);
  });

  values.getOscillatorWaveType = function(node) {
    switch (node._node.type) {
      case "sine":
        return elm.WebAudio.values.Sine;
      case "square":
        return elm.WebAudio.values.Square;
      case "sawtooth":
        return elm.WebAudio.values.Sawtooth;
      case "triangle":
        return elm.WebAudio.values.Triangle;
    }
  };

  values.setOscillatorWaveType = F2(setOscillatorWaveType);

  values.startOscillator = F2(function(startTime, node) {
    node._node.start(startTime);
    return node;
  });

  values.stopOscillator = F2(function(stopTime, node) {
    node._node.stop(stopTime);
    return {ctor: '_Tuple0'};
  });



  /* PannerNode */
  values.createPannerNode = function(context) {
    var node = extractContext(context).createPanner();
    return buildAudioNode(node);
  };

  values.getPanningModel = function(node) {
    switch (node._node.panningModel) {
      case "equalpower":
        return elm.WebAudio.values.EqualPower;
      case "hrtf":
        return elm.WebAudio.values.HRTF;
    }
  };

  values.setPanningModel = F2(function(model, node) {
    switch (model.ctor) {
      case "EqualPower":
        node._node.panningModel = "equalpower";
        break;
      case "HRTF":
        node._node.panningModel = "hrtf";
        break;
    }
    return node;
  });

  values.getDistanceModel = function(node) {
    switch (node._node.distanceModel) {
      case "linear":
        return elm.WebAudio.values.Linear;
      case "inverse":
        return elm.WebAudio.values.Inverse;
      case "exponential":
        return elm.WebAudio.values.Exponential;
    }
  };

  values.setDistanceModel = F2(function(model, node) {
    switch (model.ctor) {
      case "Linear":
        node._node.distanceModel = "linear";
        break;
      case "Inverse":
        node._node.distanceModel = "inverse";
        break;
      case "Exponential":
        node._node.distanceModel = "exponential";
        break;
    }
    return node;
  });

  buildProperty('ReferenceDistance', 'refDistance');
  buildProperty('MaxDistance', 'maxDistance');
  buildProperty('RolloffFactor', 'rolloffFactor');
  buildProperty('ConeInnerAngle', 'coneInnerAngle');
  buildProperty('ConeOuterAngle', 'coneOuterAngle');
  buildProperty('ConeOuterGain', 'coneOuterGain');

  values.setPosition = F4(function(x, y, z, node) {
    node._node.setPosition(x, y, z);
    return node;
  });

  values.setOrientation = F4(function(x, y, z, node) {
    node._node.setOrientation(x, y, z);
    return node;
  });

  values.setVelocity = F4(function(x, y, z, node) {
    node._node.setVelocity(x, y, z);
    return node;
  });

  return elm.Native.WebAudio.values = values;
};
