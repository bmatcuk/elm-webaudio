import UserMedia exposing (MediaStream, requestUserMedia)
import WebAudio exposing (..)
import Task as T
import Signal as S exposing ((<~))
import Html exposing (div, text)

view model =
    case model of
        Nothing -> div [] [ text "Nothing" ]
        Just stream ->
            -- I would expect this to immediately feed me back the microphone input
            let node = createMediaStreamSourceNode DefaultContext stream
                        |> connectNodes (getDestinationNode DefaultContext) 0 0
            in
               div [] [ text "Got user media" ]

{-| send one time request for usermedia, stream is then forwarded to the
    mailbox
-}
port getUserMedia : T.Task x ()
port getUserMedia =
        requestUserMedia userMediaStream.address { audio=True, video=False }

userMediaStream : S.Mailbox (Maybe MediaStream)
userMediaStream =
    S.mailbox Nothing


main =
    view <~ userMediaStream.signal
