Elm.Visual = Elm.Visual || {};
Elm.Visual.make = function (_elm) {
   "use strict";
   _elm.Visual = _elm.Visual || {};
   if (_elm.Visual.values)
   return _elm.Visual.values;
   var _N = Elm.Native,
   _U = _N.Utils.make(_elm),
   _L = _N.List.make(_elm),
   _A = _N.Array.make(_elm),
   _E = _N.Error.make(_elm),
   $moduleName = "Visual";
   var Basics = Elm.Basics.make(_elm);
   var Color = Elm.Color.make(_elm);
   var Graphics = Graphics || {};
   Graphics.Collage = Elm.Graphics.Collage.make(_elm);
   var Graphics = Graphics || {};
   Graphics.Element = Elm.Graphics.Element.make(_elm);
   var Graphics = Graphics || {};
   Graphics.Input = Elm.Graphics.Input.make(_elm);
   var Graphics = Graphics || {};
   Graphics.Input = Graphics.Input || {};
   Graphics.Input.Field = Elm.Graphics.Input.Field.make(_elm);
   var List = Elm.List.make(_elm);
   var Maybe = Elm.Maybe.make(_elm);
   var Mouse = Elm.Mouse.make(_elm);
   var Native = Native || {};
   Native.Json = Elm.Native.Json.make(_elm);
   var Native = Native || {};
   Native.Ports = Elm.Native.Ports.make(_elm);
   var Signal = Elm.Signal.make(_elm);
   var String = Elm.String.make(_elm);
   var Text = Elm.Text.make(_elm);
   var Time = Elm.Time.make(_elm);
   var Transform2D = Elm.Transform2D.make(_elm);
   var WebAudio = Elm.WebAudio.make(_elm);
   var Window = Elm.Window.make(_elm);
   var _op = {};
   var renderAnalyser = F3(function (w,
   h,
   freqdata) {
      return function () {
         var barWidth = w / function ($) {
            return Basics.toFloat(List.length($));
         }(freqdata);
         var draw = F2(function (idx,
         datum) {
            return function () {
               var barHeight = h * Basics.toFloat(datum) / 255.0;
               return Graphics.Collage.move({ctor: "_Tuple2"
                                            ,_0: (Basics.toFloat(idx) + 0.5) * barWidth
                                            ,_1: (barHeight - h) / 2.0})(Graphics.Collage.filled(Color.orange)(A2(Graphics.Collage.rect,
               barWidth,
               barHeight)));
            }();
         });
         return Graphics.Collage.groupTransform(A2(Transform2D.translation,
         0 - w / 2.0,
         h / -2.0))(A3(List.zipWith,
         draw,
         _L.range(0,
         List.length(freqdata) - 1),
         freqdata));
      }();
   });
   var soundUrl = Native.Ports.portIn("soundUrl",
   Native.Ports.incomingSignal(function (v) {
      return v === null ? Maybe.Nothing : Maybe.Just(typeof v === "string" || typeof v === "object" && v instanceof String ? v : _E.raise("invalid input, expecting JSString but got " + v));
   }));
   var slidersInput = A4(Signal.lift3,
   F3(function (v0,v1,v2) {
      return {ctor: "_Tuple3"
             ,_0: v0
             ,_1: v1
             ,_2: v2};
   }),
   Window.dimensions,
   Mouse.isDown,
   Mouse.position);
   var playMusic = function (state) {
      return _U.replace([["loadTrack"
                         ,true]
                        ,["playing",true]],
      state);
   };
   var disableSelectedSlider = F2(function (pos,
   state) {
      return state.dragging ? _U.replace([["lastPosition"
                                          ,pos]
                                         ,["selected",Maybe.Nothing]
                                         ,["dragging",false]
                                         ,["changes",true]],
      state) : _U.replace([["lastPosition"
                           ,pos]
                          ,["changes",false]],
      state);
   });
   var scaleToFit = F3(function (_v0,
   desiredW,
   desiredH) {
      return function () {
         return A2(Basics.min,
         desiredW / _v0.w,
         desiredH / _v0.h);
      }();
   });
   var controlState = {_: {}
                      ,btnCnt: 0
                      ,loadTrack: false
                      ,playing: false
                      ,url: A2(Graphics.Input.Field.Content,
                      "https://soundcloud.com/failemotions/gravity-instrumental",
                      A3(Graphics.Input.Field.Selection,
                      0,
                      0,
                      Graphics.Input.Field.Forward))};
   var playButtonInput = Graphics.Input.input(controlState.playing);
   var urlFieldInput = Graphics.Input.input(controlState.url);
   var controlInput = A3(Signal.lift2,
   F2(function (v0,v1) {
      return {ctor: "_Tuple2"
             ,_0: v0
             ,_1: v1};
   }),
   Signal.count(playButtonInput.signal),
   urlFieldInput.signal);
   var renderControls = F2(function (w,
   state) {
      return function () {
         var btn = A3(Graphics.Input.button,
         playButtonInput.handle,
         Basics.not(state.playing),
         state.playing ? "Pause" : "Play");
         var url = Graphics.Element.width(Basics.round(w / 2) - Graphics.Element.widthOf(btn))(A5(Graphics.Input.Field.field,
         Graphics.Input.Field.defaultStyle,
         urlFieldInput.handle,
         Basics.id,
         "SoundCloud Permalink URL",
         state.url));
         return Graphics.Collage.toForm(A2(Graphics.Element.beside,
         btn,
         url));
      }();
   });
   var sliderValueClamp = function ($) {
      return Basics.max(-40.0)(Basics.min(40.0)($));
   };
   var updateSelectedSlider = F2(function (pos,
   state) {
      return function () {
         var _v2 = state.selected;
         switch (_v2.ctor)
         {case "Just":
            switch (_v2._0.ctor)
              {case "_Tuple2":
                 return function () {
                      var delta = Basics.toFloat(Basics.snd(state.lastPosition) - Basics.snd(pos)) / state.scale;
                      var currentVal = WebAudio.getValue(_v2._0._1.gain);
                      var newVal = sliderValueClamp(currentVal + delta);
                      var _ = A2(WebAudio.setValue,
                      newVal,
                      _v2._0._1.gain);
                      return _U.replace([["lastPosition"
                                         ,pos]
                                        ,["changes",true]],
                      state);
                   }();}
              break;
            case "Nothing":
            return _U.replace([["lastPosition"
                               ,pos]
                              ,["changes",false]],
              state);}
         _E.Case($moduleName,
         "between lines 89 and 97");
      }();
   });
   var isSelectedSlider = F2(function (idx,
   state) {
      return A3(Maybe.maybe,
      false,
      function (_v6) {
         return function () {
            switch (_v6.ctor)
            {case "_Tuple2":
               return _U.eq(_v6._0,idx);}
            _E.Case($moduleName,
            "on line 44, column 53 to 61");
         }();
      },
      state.selected);
   });
   var slidersState = {_: {}
                      ,changes: false
                      ,dimensions: {ctor: "_Tuple2"
                                   ,_0: 0
                                   ,_1: 0}
                      ,dragging: false
                      ,lastPosition: {ctor: "_Tuple2"
                                     ,_0: 0
                                     ,_1: 0}
                      ,move: 0.0
                      ,scale: 1.0
                      ,selected: Maybe.Nothing};
   var sliderSize = {_: {}
                    ,h: 100.0
                    ,w: 20.0};
   var handleHitTest = F4(function (x,
   y,
   s,
   f) {
      return function () {
         var posy = WebAudio.getValue(f.gain);
         var handleBottom = (posy - sliderSize.w / 2.0) * s;
         var handleTop = handleBottom + sliderSize.w * s;
         var handleLeft = (0 - sliderSize.w / 2.0) * s;
         var handleRight = handleLeft + sliderSize.w * s;
         return _U.cmp(handleLeft,
         x) < 1 && (_U.cmp(x,
         handleRight) < 1 && (_U.cmp(handleBottom,
         y) < 1 && _U.cmp(y,
         handleTop) < 1));
      }();
   });
   var renderSlider = F2(function (val,
   selected) {
      return function () {
         var handleColor = selected ? Color.lightRed : Color.darkRed;
         return _L.fromArray([Graphics.Collage.filled(Color.black)(A2(Graphics.Collage.rect,
                             sliderSize.w / 4.0,
                             sliderSize.h - sliderSize.w))
                             ,Graphics.Collage.moveY(val)(Graphics.Collage.filled(handleColor)(A2(Graphics.Collage.rect,
                             sliderSize.w,
                             sliderSize.w)))]);
      }();
   });
   var analyser = A3(WebAudio.connectNodes,
   WebAudio.getDestinationNode(WebAudio.DefaultContext),
   0,
   0)(WebAudio.createAnalyserNode(WebAudio.DefaultContext));
   var filters = function () {
      var makeFilter = function (f) {
         return A2(WebAudio.tapNode,
         function (_) {
            return _.frequency;
         },
         function (freq) {
            return A2(WebAudio.setValue,
            f,
            freq);
         })(WebAudio.setFilterType(WebAudio.Peaking)(WebAudio.createBiquadFilterNode(WebAudio.DefaultContext)));
      };
      var frequencies = _L.fromArray([31.25
                                     ,62.5
                                     ,125
                                     ,250
                                     ,500
                                     ,1000
                                     ,2000
                                     ,4000
                                     ,8000
                                     ,16000]);
      var rlst = A2(List.map,
      makeFilter,
      List.reverse(frequencies));
      var end = A3(WebAudio.connectNodes,
      analyser,
      0,
      0)(WebAudio.setFilterType(WebAudio.HighShelf)(List.head(rlst)));
      var lst = List.reverse(A3(List.scanl,
      F2(function (c,p) {
         return A4(WebAudio.connectNodes,
         p,
         0,
         0,
         c);
      }),
      end,
      List.tail(rlst)));
      return {ctor: "::"
             ,_0: A2(WebAudio.setFilterType,
             WebAudio.LowShelf,
             List.head(lst))
             ,_1: List.tail(lst)};
   }();
   var mediaStream = A3(WebAudio.connectNodes,
   List.head(filters),
   0,
   0)(WebAudio.setMediaElementIsLooping(true)(WebAudio.createHiddenMediaElementAudioSourceNode(WebAudio.DefaultContext)));
   var updateTrack = function ($) {
      return WebAudio.playMediaElement(A2(Maybe.maybe,
      mediaStream,
      function (url) {
         return A2(WebAudio.setMediaElementSource,
         url,
         mediaStream);
      })($));
   };
   var mainMediaStream = A2(Signal._op["<~"],
   updateTrack,
   soundUrl);
   var pauseMusic = function (state) {
      return function () {
         var _ = WebAudio.pauseMediaElement(mediaStream);
         return _U.replace([["playing"
                            ,false]
                           ,["loadTrack",false]],
         state);
      }();
   };
   var toggleMusic = function (state) {
      return state.playing ? pauseMusic(state) : playMusic(state);
   };
   var updateControls = F2(function (_v10,
   state) {
      return function () {
         switch (_v10.ctor)
         {case "_Tuple2":
            return !_U.eq(_v10._0,
              state.btnCnt) ? toggleMusic(_U.replace([["btnCnt"
                                                      ,_v10._0]
                                                     ,["url",_v10._1]],
              state)) : _U.replace([["url"
                                    ,_v10._1]
                                   ,["loadTrack",false]],
              state);}
         _E.Case($moduleName,
         "between lines 121 and 122");
      }();
   });
   var mainControls = A3(Signal.foldp,
   updateControls,
   controlState,
   controlInput);
   var fetchSoundUrl = Native.Ports.portOut("fetchSoundUrl",
   Native.Ports.outgoingSignal(function (v) {
      return v;
   }),
   A2(Signal._op["<~"],
   function (_v14) {
      return function () {
         return _v14.url.string;
      }();
   },
   A3(Signal.keepIf,
   function (_v16) {
      return function () {
         return _v16.loadTrack;
      }();
   },
   controlState,
   mainControls)));
   var selectSlider = F3(function (_v18,
   _v19,
   state) {
      return function () {
         switch (_v19.ctor)
         {case "_Tuple2":
            return function () {
                 switch (_v18.ctor)
                 {case "_Tuple2":
                    return function () {
                         var lst = A2(List.zip,
                         _L.range(0,
                         List.length(filters) - 1),
                         filters);
                         var $ = {ctor: "_Tuple2"
                                 ,_0: Basics.toFloat(_v18._0)
                                 ,_1: Basics.toFloat(_v18._1)},
                         w = $._0,
                         h = $._1;
                         var x = Basics.toFloat(_v19._0) - w / 2.0 + state.move * 5.0;
                         var y = h / 4.0 - Basics.toFloat(_v19._1);
                         var filtered = A2(List.filter,
                         function (_v26) {
                            return function () {
                               switch (_v26.ctor)
                               {case "_Tuple2":
                                  return A4(handleHitTest,
                                    x - (Basics.toFloat(_v26._0) + 0.5) * state.move,
                                    y,
                                    state.scale,
                                    _v26._1);}
                               _E.Case($moduleName,
                               "on line 83, column 34 to 100");
                            }();
                         },
                         lst);
                         var selected = _U.cmp(List.length(filtered),
                         0) > 0 ? Maybe.Just(List.head(filtered)) : Maybe.Nothing;
                         return A2(updateSelectedSlider,
                         {ctor: "_Tuple2"
                         ,_0: _v19._0
                         ,_1: _v19._1},
                         _U.replace([["selected"
                                     ,selected]
                                    ,["dragging",true]],
                         state));
                      }();}
                 _E.Case($moduleName,
                 "between lines 78 and 86");
              }();}
         _E.Case($moduleName,
         "between lines 78 and 86");
      }();
   });
   var updateSliders = F2(function (_v30,
   state) {
      return function () {
         switch (_v30.ctor)
         {case "_Tuple3":
            return !_U.eq(_v30._0,
              state.dimensions) ? A4(updateSlidersVisual,
              _v30._0,
              _v30._1,
              _v30._2,
              state) : _v30._1 ? state.dragging ? A2(updateSelectedSlider,
              _v30._2,
              state) : A3(selectSlider,
              _v30._0,
              _v30._2,
              state) : A2(disableSelectedSlider,
              _v30._2,
              state);}
         _E.Case($moduleName,
         "between lines 104 and 106");
      }();
   });
   var updateSlidersVisual = F4(function (_v35,
   isdown,
   pos,
   state) {
      return function () {
         switch (_v35.ctor)
         {case "_Tuple2":
            return function () {
                 var $ = {ctor: "_Tuple2"
                         ,_0: Basics.toFloat(_v35._0)
                         ,_1: Basics.toFloat(_v35._1)},
                 w = $._0,
                 h = $._1;
                 var sliderScale = A3(scaleToFit,
                 sliderSize,
                 w / 10.0 * 0.9,
                 h / 2.0 * 0.9);
                 var sliderMove = sliderScale * sliderSize.w / 0.9;
                 var updates = A2(updateSliders,
                 {ctor: "_Tuple3"
                 ,_0: {ctor: "_Tuple2"
                      ,_0: _v35._0
                      ,_1: _v35._1}
                 ,_1: isdown
                 ,_2: pos},
                 _U.replace([["dimensions"
                             ,{ctor: "_Tuple2"
                              ,_0: _v35._0
                              ,_1: _v35._1}]
                            ,["scale",sliderScale]
                            ,["move",sliderMove]],
                 state));
                 return _U.replace([["changes"
                                    ,true]],
                 updates);
              }();}
         _E.Case($moduleName,
         "between lines 60 and 66");
      }();
   });
   var mainSliders = A2(Signal.keepIf,
   function (m) {
      return m.changes;
   },
   slidersState)(A3(Signal.foldp,
   updateSliders,
   slidersState,
   slidersInput));
   var renderSliders = F3(function (w,
   h,
   state) {
      return function () {
         var slider = F2(function (idx,
         filter) {
            return function () {
               var selected = A2(isSelectedSlider,
               idx,
               state);
               var val = WebAudio.getValue(filter.gain);
               var x = (Basics.toFloat(idx) + 0.5) * state.move;
               return A2(Graphics.Collage.groupTransform,
               A6(Transform2D.matrix,
               state.scale,
               0,
               0,
               state.scale,
               x,
               0),
               A2(renderSlider,val,selected));
            }();
         });
         return Graphics.Collage.groupTransform(A2(Transform2D.translation,
         0 - state.move * 5.0,
         h / 2.0))(A3(List.zipWith,
         slider,
         _L.range(0,
         List.length(filters) - 1),
         filters));
      }();
   });
   var render = F4(function (_v39,
   sliderState,
   controlState,
   freqdata) {
      return function () {
         switch (_v39.ctor)
         {case "_Tuple2":
            return function () {
                 var $ = {ctor: "_Tuple2"
                         ,_0: Basics.toFloat(_v39._0)
                         ,_1: Basics.toFloat(_v39._1)},
                 w = $._0,
                 h = $._1;
                 var halfw = w / 2.0;
                 var halfh = h / 2.0;
                 var quarterh = halfh / 2.0;
                 return A3(Graphics.Collage.collage,
                 _v39._0,
                 _v39._1,
                 _L.fromArray([Graphics.Collage.moveY(quarterh)(Graphics.Collage.filled(A3(Color.rgb,
                              34,
                              34,
                              34))(A2(Graphics.Collage.rect,
                              w,
                              halfh)))
                              ,Graphics.Collage.moveY(0 - quarterh)(Graphics.Collage.filled(Color.black)(A2(Graphics.Collage.rect,
                              w,
                              halfh)))
                              ,A3(renderSliders,
                              w,
                              halfh,
                              sliderState)
                              ,A3(renderAnalyser,
                              w,
                              halfh,
                              freqdata)
                              ,A2(renderControls,
                              w,
                              controlState)]));
              }();}
         _E.Case($moduleName,
         "between lines 179 and 190");
      }();
   });
   var main = A5(Signal.lift4,
   render,
   Window.dimensions,
   mainSliders,
   mainControls,
   A2(Signal._op["<~"],
   function (_v43) {
      return function () {
         return WebAudio.getByteFrequencyData(analyser);
      }();
   },
   Time.every(50.0)));
   _elm.Visual.values = {_op: _op
                        ,analyser: analyser
                        ,filters: filters
                        ,mediaStream: mediaStream
                        ,sliderSize: sliderSize
                        ,slidersState: slidersState
                        ,isSelectedSlider: isSelectedSlider
                        ,sliderValueClamp: sliderValueClamp
                        ,controlState: controlState
                        ,scaleToFit: scaleToFit
                        ,updateSlidersVisual: updateSlidersVisual
                        ,handleHitTest: handleHitTest
                        ,selectSlider: selectSlider
                        ,updateSelectedSlider: updateSelectedSlider
                        ,disableSelectedSlider: disableSelectedSlider
                        ,updateSliders: updateSliders
                        ,updateTrack: updateTrack
                        ,pauseMusic: pauseMusic
                        ,playMusic: playMusic
                        ,toggleMusic: toggleMusic
                        ,updateControls: updateControls
                        ,slidersInput: slidersInput
                        ,playButtonInput: playButtonInput
                        ,urlFieldInput: urlFieldInput
                        ,controlInput: controlInput
                        ,renderSlider: renderSlider
                        ,renderSliders: renderSliders
                        ,renderControls: renderControls
                        ,renderAnalyser: renderAnalyser
                        ,render: render
                        ,mainMediaStream: mainMediaStream
                        ,mainSliders: mainSliders
                        ,mainControls: mainControls
                        ,main: main};
   return _elm.Visual.values;
};Elm.WebAudio = Elm.WebAudio || {};
Elm.WebAudio.make = function (_elm) {
   "use strict";
   _elm.WebAudio = _elm.WebAudio || {};
   if (_elm.WebAudio.values)
   return _elm.WebAudio.values;
   var _N = Elm.Native,
   _U = _N.Utils.make(_elm),
   _L = _N.List.make(_elm),
   _A = _N.Array.make(_elm),
   _E = _N.Error.make(_elm),
   $moduleName = "WebAudio";
   var Basics = Elm.Basics.make(_elm);
   var Color = Elm.Color.make(_elm);
   var Graphics = Graphics || {};
   Graphics.Collage = Elm.Graphics.Collage.make(_elm);
   var Graphics = Graphics || {};
   Graphics.Element = Elm.Graphics.Element.make(_elm);
   var List = Elm.List.make(_elm);
   var Maybe = Elm.Maybe.make(_elm);
   var Native = Native || {};
   Native.Json = Elm.Native.Json.make(_elm);
   var Native = Native || {};
   Native.Ports = Elm.Native.Ports.make(_elm);
   var Native = Native || {};
   Native.WebAudio = Elm.Native.WebAudio.make(_elm);
   var Signal = Elm.Signal.make(_elm);
   var String = Elm.String.make(_elm);
   var Text = Elm.Text.make(_elm);
   var Time = Elm.Time.make(_elm);
   var _op = {};
   var setVelocity = Native.WebAudio.setVelocity;
   var setOrientation = Native.WebAudio.setOrientation;
   var setPosition = Native.WebAudio.setPosition;
   var setConeOuterGain = Native.WebAudio.setConeOuterGain;
   var getConeOuterGain = Native.WebAudio.getConeOuterGain;
   var setConeOuterAngle = Native.WebAudio.setConeOuterAngle;
   var getConeOuterAngle = Native.WebAudio.getConeOuterAngle;
   var setConeInnerAngle = Native.WebAudio.setConeInnerAngle;
   var getConeInnerAngle = Native.WebAudio.getConeInnerAngle;
   var setRolloffFactor = Native.WebAudio.setRolloffFactor;
   var getRolloffFactor = Native.WebAudio.getRolloffFactor;
   var setMaxDistance = Native.WebAudio.setMaxDistance;
   var getMaxDistance = Native.WebAudio.getMaxDistance;
   var setReferenceDistance = Native.WebAudio.setReferenceDistance;
   var getReferenceDistance = Native.WebAudio.getReferenceDistance;
   var setDistanceModel = Native.WebAudio.setDistanceModel;
   var getDistanceModel = Native.WebAudio.getDistanceModel;
   var setPanningModel = Native.WebAudio.setPanningModel;
   var getPanningModel = Native.WebAudio.getPanningModel;
   var createPannerNode = Native.WebAudio.createPannerNode;
   var Exponential = {ctor: "Exponential"};
   var Inverse = {ctor: "Inverse"};
   var Linear = {ctor: "Linear"};
   var HRTF = {ctor: "HRTF"};
   var EqualPower = {ctor: "EqualPower"};
   var stopOscillator = Native.WebAudio.stopOscillator;
   var startOscillator = Native.WebAudio.startOscillator;
   var setOscillatorWaveType = Native.WebAudio.setOscillatorWaveType;
   var getOscillatorWaveType = Native.WebAudio.getOscillatorWaveType;
   var createOscillatorNode = Native.WebAudio.createOscillatorNode;
   var Triangle = {ctor: "Triangle"};
   var Sawtooth = {ctor: "Sawtooth"};
   var Square = {ctor: "Square"};
   var Sine = {ctor: "Sine"};
   var pauseMediaElement = Native.WebAudio.pauseMediaElement;
   var playMediaElement = Native.WebAudio.playMediaElement;
   var setMediaElementSource = Native.WebAudio.setMediaElementSource;
   var getMediaElementSource = Native.WebAudio.getMediaElementSource;
   var setMediaElementIsLooping = Native.WebAudio.setMediaElementIsLooping;
   var getMediaElementIsLooping = Native.WebAudio.getMediaElementIsLooping;
   var createHiddenMediaElementAudioSourceNode = Native.WebAudio.createHiddenMediaElementAudioSourceNode;
   var createGainNode = Native.WebAudio.createGainNode;
   var createDynamicsCompressorNode = Native.WebAudio.createDynamicsCompressorNode;
   var createDelayNode = Native.WebAudio.createDelayNode;
   var createChannelSplitterNode = Native.WebAudio.createChannelSplitterNode;
   var createChannelMergerNode = Native.WebAudio.createChannelMergerNode;
   var setFilterType = Native.WebAudio.setFilterType;
   var getFilterType = Native.WebAudio.getFilterType;
   var createBiquadFilterNode = Native.WebAudio.createBiquadFilterNode;
   var AllPass = {ctor: "AllPass"};
   var Notch = {ctor: "Notch"};
   var Peaking = {ctor: "Peaking"};
   var HighShelf = {ctor: "HighShelf"};
   var LowShelf = {ctor: "LowShelf"};
   var BandPass = {ctor: "BandPass"};
   var HighPass = {ctor: "HighPass"};
   var LowPass = {ctor: "LowPass"};
   var getMaxChannelCount = Native.WebAudio.getMaxChannelCount;
   var getDestinationNode = Native.WebAudio.getDestinationNode;
   var getFloatTimeDomainData = Native.WebAudio.getFloatTimeDomainData;
   var getFloatFrequencyData = Native.WebAudio.getFloatFrequencyData;
   var getByteTimeDomainData = Native.WebAudio.getByteTimeDomainData;
   var getByteFrequencyData = Native.WebAudio.getByteFrequencyData;
   var setSmoothingConstant = Native.WebAudio.setSmoothingConstant;
   var getSmoothingConstant = Native.WebAudio.getSmoothingConstant;
   var setMinDecibels = Native.WebAudio.setMinDecibels;
   var getMinDecibels = Native.WebAudio.getMinDecibels;
   var setMaxDecibels = Native.WebAudio.setMaxDecibels;
   var getMaxDecibels = Native.WebAudio.getMaxDecibels;
   var setFFTSize = Native.WebAudio.setFFTSize;
   var getFFTSize = Native.WebAudio.getFFTSize;
   var createAnalyserNode = Native.WebAudio.createAnalyserNode;
   var tapNode = F3(function (f,
   t,
   n) {
      return function () {
         var _ = t(f(n));
         return n;
      }();
   });
   var setChannelInterpretation = Native.WebAudio.setChannelInterpretation;
   var getChannelInterpretation = Native.WebAudio.getChannelInterpretation;
   var setChannelCountMode = Native.WebAudio.setChannelCountMode;
   var getChannelCountMode = Native.WebAudio.getChannelCountMode;
   var setChannelCount = Native.WebAudio.setChannelCount;
   var getChannelCount = Native.WebAudio.getChannelCount;
   var connectToParam = Native.WebAudio.connectToParam;
   var connectNodes = Native.WebAudio.connectNodes;
   var Discrete = {ctor: "Discrete"};
   var Speakers = {ctor: "Speakers"};
   var Explicit = {ctor: "Explicit"};
   var ClampedMax = {ctor: "ClampedMax"};
   var Max = {ctor: "Max"};
   var AudioNode = F3(function (a,
   b,
   c) {
      return _U.insert("outputs",
      b,
      _U.insert("inputs",a,c));
   });
   var cancelScheduledValues = Native.WebAudio.cancelScheduledValues;
   var setValueCurveAtTime = Native.WebAudio.setValueCurveAtTime;
   var setTargetAtTime = Native.WebAudio.setTargetAtTime;
   var exponentialRampToValue = Native.WebAudio.exponentialRampToValue;
   var linearRampToValue = Native.WebAudio.linearRampToValue;
   var setValueAtTime = Native.WebAudio.setValueAtTime;
   var getValue = Native.WebAudio.getValue;
   var setValue = Native.WebAudio.setValue;
   var AudioParam = function (a) {
      return {ctor: "AudioParam"
             ,_0: a};
   };
   var getCurrentTime = Native.WebAudio.getCurrentTime;
   var getSampleRate = Native.WebAudio.getSampleRate;
   var createContext = Native.WebAudio.createContext;
   var DefaultContext = {ctor: "DefaultContext"};
   var AudioContext = {ctor: "AudioContext"};
   _elm.WebAudio.values = {_op: _op
                          ,createContext: createContext
                          ,getSampleRate: getSampleRate
                          ,getCurrentTime: getCurrentTime
                          ,setValue: setValue
                          ,getValue: getValue
                          ,setValueAtTime: setValueAtTime
                          ,linearRampToValue: linearRampToValue
                          ,exponentialRampToValue: exponentialRampToValue
                          ,setTargetAtTime: setTargetAtTime
                          ,setValueCurveAtTime: setValueCurveAtTime
                          ,cancelScheduledValues: cancelScheduledValues
                          ,connectNodes: connectNodes
                          ,connectToParam: connectToParam
                          ,getChannelCount: getChannelCount
                          ,setChannelCount: setChannelCount
                          ,getChannelCountMode: getChannelCountMode
                          ,setChannelCountMode: setChannelCountMode
                          ,getChannelInterpretation: getChannelInterpretation
                          ,setChannelInterpretation: setChannelInterpretation
                          ,tapNode: tapNode
                          ,createAnalyserNode: createAnalyserNode
                          ,getFFTSize: getFFTSize
                          ,setFFTSize: setFFTSize
                          ,getMaxDecibels: getMaxDecibels
                          ,setMaxDecibels: setMaxDecibels
                          ,getMinDecibels: getMinDecibels
                          ,setMinDecibels: setMinDecibels
                          ,getSmoothingConstant: getSmoothingConstant
                          ,setSmoothingConstant: setSmoothingConstant
                          ,getByteFrequencyData: getByteFrequencyData
                          ,getByteTimeDomainData: getByteTimeDomainData
                          ,getFloatFrequencyData: getFloatFrequencyData
                          ,getFloatTimeDomainData: getFloatTimeDomainData
                          ,getDestinationNode: getDestinationNode
                          ,getMaxChannelCount: getMaxChannelCount
                          ,createBiquadFilterNode: createBiquadFilterNode
                          ,getFilterType: getFilterType
                          ,setFilterType: setFilterType
                          ,createChannelMergerNode: createChannelMergerNode
                          ,createChannelSplitterNode: createChannelSplitterNode
                          ,createDelayNode: createDelayNode
                          ,createDynamicsCompressorNode: createDynamicsCompressorNode
                          ,createGainNode: createGainNode
                          ,createHiddenMediaElementAudioSourceNode: createHiddenMediaElementAudioSourceNode
                          ,getMediaElementIsLooping: getMediaElementIsLooping
                          ,setMediaElementIsLooping: setMediaElementIsLooping
                          ,getMediaElementSource: getMediaElementSource
                          ,setMediaElementSource: setMediaElementSource
                          ,playMediaElement: playMediaElement
                          ,pauseMediaElement: pauseMediaElement
                          ,createOscillatorNode: createOscillatorNode
                          ,getOscillatorWaveType: getOscillatorWaveType
                          ,setOscillatorWaveType: setOscillatorWaveType
                          ,startOscillator: startOscillator
                          ,stopOscillator: stopOscillator
                          ,createPannerNode: createPannerNode
                          ,getPanningModel: getPanningModel
                          ,setPanningModel: setPanningModel
                          ,getDistanceModel: getDistanceModel
                          ,setDistanceModel: setDistanceModel
                          ,getReferenceDistance: getReferenceDistance
                          ,setReferenceDistance: setReferenceDistance
                          ,getMaxDistance: getMaxDistance
                          ,setMaxDistance: setMaxDistance
                          ,getRolloffFactor: getRolloffFactor
                          ,setRolloffFactor: setRolloffFactor
                          ,getConeInnerAngle: getConeInnerAngle
                          ,setConeInnerAngle: setConeInnerAngle
                          ,getConeOuterAngle: getConeOuterAngle
                          ,setConeOuterAngle: setConeOuterAngle
                          ,getConeOuterGain: getConeOuterGain
                          ,setConeOuterGain: setConeOuterGain
                          ,setPosition: setPosition
                          ,setOrientation: setOrientation
                          ,setVelocity: setVelocity
                          ,AudioContext: AudioContext
                          ,DefaultContext: DefaultContext
                          ,AudioParam: AudioParam
                          ,Max: Max
                          ,ClampedMax: ClampedMax
                          ,Explicit: Explicit
                          ,Speakers: Speakers
                          ,Discrete: Discrete
                          ,LowPass: LowPass
                          ,HighPass: HighPass
                          ,BandPass: BandPass
                          ,LowShelf: LowShelf
                          ,HighShelf: HighShelf
                          ,Peaking: Peaking
                          ,Notch: Notch
                          ,AllPass: AllPass
                          ,Sine: Sine
                          ,Square: Square
                          ,Sawtooth: Sawtooth
                          ,Triangle: Triangle
                          ,EqualPower: EqualPower
                          ,HRTF: HRTF
                          ,Linear: Linear
                          ,Inverse: Inverse
                          ,Exponential: Exponential
                          ,AudioNode: AudioNode};
   return _elm.WebAudio.values;
};