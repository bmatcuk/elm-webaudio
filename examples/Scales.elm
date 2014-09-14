import Graphics.Input (..)
import WebAudio (..)

-- Models

type HalfStep = Float
type Label = String

data Tonic = Tonic Label HalfStep
data Scale = Scale String [HalfStep]
data MusicState = Playing OscillatorNode HalfStep [HalfStep] Time | Paused

tonics = [ Tonic "A" 0
         , Tonic "A#/Bb" 1
         , Tonic "B" 2
         , Tonic "C" 3
         , Tonic "C#/Db" 4
         , Tonic "D" 5
         , Tonic "D#/Eb" 6
         , Tonic "E" 7
         , Tonic "F" 8
         , Tonic "F#/Gb" 9
         , Tonic "G" 10
         , Tonic "G#/Ab" 11
         ]

musicalScales = [ Scale "Major" [0, 2, 2, 1, 2, 2, 2, 1]
                , Scale "Minor" [0, 2, 1, 2, 2, 1, 2, 2]
                ]

visualModel = {tonic = head tonics, scale = head musicalScales}
musicModel = {state = Paused, changed = False, buttonCount = 0}

getTonicLabel (Tonic label _) = label
getTonicHalfStep (Tonic _ halfstep) = halfstep

getScaleLabel (Scale label _) = label
getScaleSteps (Scale _ steps) = steps

isPlaying state =
  case state of
    Paused -> False
    _ -> True



-- Update

stopMusic oscillator =
  let _ = stopOscillator 0.0 oscillator
  in Paused

updateNote oscillator tonic tones t =
  case tones of
    tone::remainingTones ->
      let
        currentStep = tonic + tone
        frequency = (220 * (2 ^ (currentStep / 12)))
        _ = setValue frequency oscillator.frequency
      in Playing oscillator currentStep remainingTones t
    [] -> stopMusic oscillator

startMusic {tonic,scale} t =
  let node = createOscillatorNode DefaultContext Sine |> connectNodes (getDestinationNode DefaultContext) 0 0
                                                      |> startOscillator 0.0
  in updateNote node (getTonicHalfStep tonic) (getScaleSteps scale) t

updateMusic (vmodel,btncnt,t) mmodel =
  case mmodel.state of
    Playing node tonicStep steps oldt ->
      if | btncnt /= mmodel.buttonCount -> {state = stopMusic node, changed = True, buttonCount = btncnt}
         | otherwise ->
            let newState = updateNote node tonicStep steps t
            in {state = newState, changed = not <| isPlaying newState, buttonCount = btncnt}
    Paused ->
      if | btncnt /= mmodel.buttonCount -> {state = startMusic vmodel t, changed = True, buttonCount = btncnt}
         | otherwise -> {mmodel | changed <- False}



-- Input

tonicInput = input visualModel.tonic
scaleInput = input visualModel.scale
playInput = input visualModel

musicSignal = lift3 (,,) playInput.signal (count playInput.signal) (every 350.0)
visualSignal = lift2 (\t s -> {tonic = t, scale = s}) tonicInput.signal scaleInput.signal



-- Render

checkboxWithLabel label handle f checked = container 70 30 middle <| flow right [checkbox handle f checked, plainText label]

tonicBoxes tonic =
  let box t = checkboxWithLabel (getTonicLabel t) tonicInput.handle (\_ -> t) (t == tonic)
  in flow right <| map box tonics

scaleBoxes scale =
  let box s = checkboxWithLabel (getScaleLabel s) scaleInput.handle (\_ -> s) (s == scale)
  in flow right <| map box musicalScales

playButton vmodel mmodel = button playInput.handle vmodel (if (isPlaying mmodel.state) then "Stop" else "Play")

render (vmodel,mmodel) =
  flow down [ tonicBoxes vmodel.tonic
            , scaleBoxes vmodel.scale
            , playButton vmodel mmodel
            ]



-- Main

mainMusic = foldp updateMusic musicModel musicSignal |> keepIf (\m -> m.changed || (isPlaying m.state)) musicModel
main = render <~ (lift2 (,) visualSignal mainMusic)

