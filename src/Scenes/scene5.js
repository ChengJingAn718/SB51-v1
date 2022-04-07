import "../stylesheets/styles.css";
import { useContext, useEffect, useRef } from "react";
import { UserContext } from "../components/BaseShot";
import { getMaskStyle } from "../components/CommonFunctions"
import BaseImage from "../components/BaseImage";
import { prePathUrl, startRepeatAudio, stopRepeatAudio, setExtraVolume } from "../components/CommonFunctions"

var varCurrentStep = 0;
var varAnswerList = [0, 1, 0, 1]

var correctAudioList = [];
var timerList = []

var currentCharacterIndex = 0;
var currentEyeIndex = 0;
var isPlusing = true;
let timeInterval2

let randomList = []

export default function Scene3({ nextFunc, _geo, startTransition, _baseGeo }) {

    const audioList = useContext(UserContext)

    const refLetterI = useRef()
    const refLetterYou = useRef()
    const refLetterIsUp = useRef()
    const refLetterIsDown = useRef()
    const refLetterTo = useRef()
    const markList = [useRef(), useRef(), useRef(), useRef()]

    const showingPairList = [
        [refLetterI, refLetterYou],
        [refLetterIsUp, refLetterTo],
        [refLetterI, refLetterTo],
        [refLetterIsDown, refLetterI]
    ]

    const letterI = useRef();
    const letterIs = useRef();

    const refSuccessDown = useRef()
    const refSuccessUp = useRef()

    const refErrorDown = useRef()
    const refErrorUp = useRef()

    const parentRef = useRef()

    const wrongLetterList = [
        refLetterI, refLetterTo, refLetterI, refLetterIsDown
    ]

    const characterList = [
        useRef(),
        useRef(),
        useRef(),
        useRef()
    ]

    const eyeList = [
        useRef(),
        useRef(),
        useRef(),
        useRef()
    ]

    useEffect(() => {

        randomList = []

        while (randomList.length != 4) {
            let randomNumber = Math.floor(Math.random() * 4);
            if (!randomList.includes(randomNumber))
                randomList.push(randomNumber)
        }


        currentCharacterIndex = 0;
        isPlusing = true;
        currentEyeIndex = 0;

        for (let i = 1; i < 4; i++)
            eyeList[i].current.setClass('character-disappear')

        const timeInterval = setInterval(() => {
            characterList[currentCharacterIndex].current.setClass('character-disappear')

            if (currentCharacterIndex > 2)
                currentCharacterIndex = 0;
            else
                currentCharacterIndex++

            characterList[currentCharacterIndex].current.setClass('character-appear')
        }, 150);


        const timeInterval1 = setInterval(() => {
            clearInterval(timeInterval2)
            timeInterval2 = setInterval(() => {

                eyeList[currentEyeIndex].current.setClass('character-disappear')
                if (isPlusing) {
                    if (currentEyeIndex > 2) {
                        isPlusing = false
                        currentEyeIndex--
                    }
                    else
                        currentEyeIndex++
                }
                else {
                    if (currentEyeIndex == 0) {
                        isPlusing = true;
                        clearInterval(timeInterval2)
                    }
                    else
                        currentEyeIndex--
                }
                eyeList[currentEyeIndex].current.setClass('character-appear')
            }, 100);

        }, 3000);


        varCurrentStep = 0;


        //fomart audio src
        audioList.bodyAudio.src = prePathUrl() + "sounds/ep_51_audio_05.mp3"
        correctAudioList = [
            audioList.wordAudio3,
            audioList.wordAudio1,
            audioList.wordAudio4,
            audioList.wordAudio2
        ]

        setExtraVolume(audioList.bodyAudio, 1.5)


        //----------
        wrongLetterList.map((ref) => {
            ref.current.style.transition = '0.3s'
        })


        timerList[0] = setTimeout(() => {
            audioList.bodyAudio.play().catch(error => { })
            timerList[1] = setTimeout(() => {
                correctAudioList[randomList[0]].play().catch(error => { })
                startRepeatAudio()
            }, audioList.bodyAudio.duration * 1000);
        }, 1800);

        setTimeout(() => {
            showingPairList[randomList[0]][0].current.className = 'appear'
            showingPairList[randomList[0]][1].current.className = 'appear'
        }, 1000);

        return () => {
            clearInterval(timeInterval)
            clearInterval(timeInterval2)
            clearInterval(timeInterval1)

            setExtraVolume(audioList.bodyAudio, 1)

        }
    }, [])

    function subUpClick() {
        funcClick(true);
    }


    function funcClick(isUpClicked = true) {
        stopRepeatAudio()

        clearTimeout(timerList[0])
        clearTimeout(timerList[1])

        correctAudioList[randomList[0]].pause();
        audioList.bodyAudio.pause();


        wrongLetterList[randomList[varCurrentStep]].current.className = ''
        correctAudioList[randomList[varCurrentStep]].pause()
        refErrorUp.current.className = 'disapear'
        refErrorDown.current.className = 'disapear'
        clearTimeout(timerList[2])

        if (varAnswerList[randomList[varCurrentStep]] == isUpClicked) {
            parentRef.current.style.pointerEvents = 'none'
            correctAudioList[randomList[varCurrentStep]].pause()
            audioList.tingAudio.play().catch(event => { })
            markList[varCurrentStep].current.setUrl('sb_51_icons/sb_15_icon_yellowstar' + '.svg')

            refErrorUp.current.className = 'disapear'
            refErrorDown.current.className = 'disapear'
            if (isUpClicked)
                refSuccessUp.current.className = 'appear'
            else
                refSuccessDown.current.className = 'appear'

            wrongLetterList[randomList[varCurrentStep]].current.className = 'hide'

            setTimeout(() => {
                if (varCurrentStep < 3) {
                    refSuccessUp.current.className = 'disapear'
                    refSuccessDown.current.className = 'disapear'

                    refLetterI.current.className = 'hide'
                    refLetterYou.current.className = 'hide'
                    refLetterIsUp.current.className = 'hide'
                    refLetterIsDown.current.className = 'hide'
                    refLetterTo.current.className = 'hide'


                    if (randomList[varCurrentStep + 1] == 0) {
                        refLetterI.current.className = 'appear'
                        refLetterYou.current.className = 'appear'
                    }

                    if (randomList[varCurrentStep + 1] == 1) {
                        setTimeout(() => {
                            refLetterIsUp.current.className = 'appear'
                            refLetterTo.current.className = 'appear'
                        }, 200);
                    }

                    if (randomList[varCurrentStep + 1] == 2) {
                        setTimeout(() => {
                            refLetterI.current.className = 'appear'
                            refLetterTo.current.className = 'appear'
                        }, 200);
                    }

                    if (randomList[varCurrentStep + 1] == 3) {
                        setTimeout(() => {
                            refLetterIsDown.current.className = 'appear'
                            refLetterI.current.className = 'appear'
                        }, 200);

                    }

                    startRepeatAudio()
                }
                else {
                    setTimeout(() => {
                        nextFunc();
                    }, 2500);
                }
                varCurrentStep++;
                if (varCurrentStep < 4) {
                    setTimeout(() => {
                        correctAudioList[randomList[varCurrentStep]].play().catch(event => { })

                        setTimeout(() => {
                            parentRef.current.style.pointerEvents = ''
                        }, 1000);

                    }, 800);
                }
            }, 1500);
        }
        else {
            correctAudioList[randomList[varCurrentStep]].currentTime = 0;
            audioList.buzzAudio.currentTime = 0;

            correctAudioList[randomList[varCurrentStep]].pause();
            audioList.buzzAudio.play().catch(error => { })

            if (isUpClicked)
                refErrorUp.current.className = 'appear'
            else
                refErrorDown.current.className = 'appear'
            wrongLetterList[randomList[varCurrentStep]].current.className = 'wrong-exp'

            timerList[2] = setTimeout(() => {
                correctAudioList[randomList[varCurrentStep]].play().catch(error => { })
                wrongLetterList[randomList[varCurrentStep]].current.className = 'show'
                refErrorUp.current.className = 'disapear'
                refErrorDown.current.className = 'disapear'
                startRepeatAudio()
            }, 800);
        }
    }

    return (
        <div
            className="aniObject"
            ref={parentRef}
        >
            <div >
                <div
                    style={{
                        position: "fixed", width: _baseGeo.width * 0.15 + "px"
                        , left: _baseGeo.width * 0.138 + _baseGeo.left + "px",
                        top: _baseGeo.height * 0.309 + "px",
                    }}>
                    <img draggable={false} width={"100%"}
                        src={prePathUrl() + "images/sb_51_highlight/sb_51_highlight.svg"}
                    />
                </div>

                <div
                    style={{
                        position: "fixed", width: _baseGeo.width * 0.15 + "px"
                        , left: _baseGeo.width * 0.252 + _baseGeo.left + "px",
                        top: _baseGeo.height * 0.448 + "px",
                    }}>
                    <img draggable={false} width={"100%"}
                        src={prePathUrl() + "images/sb_51_highlight/sb_51_highlight.svg"}
                    />
                </div>

                {/* letter I */}
                <div onClick={() => { funcClick() }} ref={refLetterI} className="hide"
                    style={{
                        position: "fixed", width: _baseGeo.width * 0.1 + "px",
                        height: _baseGeo.width * 0.1 + "px"
                        , left: _baseGeo.width * 0.155 + _baseGeo.left + "px",
                        top: _baseGeo.height * 0.36 + "px",
                        // background:'black'
                    }}>

                    <div
                        ref={letterI}
                        className="playBtn"
                        style={getMaskStyle({ url: 'sb51_text_interactive/artboard_2', scale: 180 })}
                    >
                    </div>

                </div>

                {/* letter You */}
                <div onClick={() => { funcClick(false) }} ref={refLetterYou} className="hide"
                    style={{
                        position: "fixed", width: _baseGeo.width * 0.1 + "px",
                        height: _baseGeo.width * 0.1 + "px"
                        , left: _baseGeo.width * 0.275 + _baseGeo.left + "px",
                        top: _baseGeo.height * 0.48 + "px",
                        // backgroundColor:'black'
                    }}>
                    <div

                        className="playBtn"
                        style={getMaskStyle({ url: 'sb51_text_interactive/artboard_3', scale: 140 })}
                    >
                    </div>
                </div>
            </div>


            {/* letter IS up */}
            <div onClick={() => { funcClick() }}

                className="hide" ref={refLetterIsUp}
                style={{
                    position: "fixed", width: _baseGeo.width * 0.1 + "px",
                    height: _baseGeo.width * 0.1 + "px"
                    , left: _baseGeo.width * 0.16 + _baseGeo.left + "px",
                    top: _baseGeo.height * 0.34 + "px",
                }}>
                <div
                    ref={letterIs}
                    className="playBtn"
                    style={getMaskStyle({ url: 'sb51_text_interactive/artboard_1', scale: 200 })}
                >
                </div>

            </div>

            {/* letter IS down */}
            <div onClick={() => { funcClick(false) }} className="hide" ref={refLetterIsDown}
                style={{
                    position: "fixed", width: _baseGeo.width * 0.1 + "px",
                    height: _baseGeo.width * 0.1 + "px"
                    , left: _baseGeo.width * 0.275 + _baseGeo.left + "px",
                    top: _baseGeo.height * 0.48 + "px",
                }}>
                <div
                    className="playBtn"
                    style={getMaskStyle({ url: 'sb51_text_interactive/artboard_1', scale: 200 })}
                >
                </div>

            </div>

            {/* letter To */}
            <div onClick={() => { funcClick(false) }} ref={refLetterTo}
                className="hide"
                style={{
                    position: "fixed", width: _baseGeo.width * 0.1 + "px",
                    height: _baseGeo.width * 0.1 + "px"
                    , left: _baseGeo.width * 0.27 + _baseGeo.left + "px",
                    top: _baseGeo.height * 0.47 + "px",
                }}>

                <div
                    className="playBtn"
                    style={getMaskStyle({ url: 'sb51_text_interactive/artboard_4', scale: 200 })}
                >
                </div>
            </div>

            <div
                onClick={subUpClick}
                // onMouseEnter={enterFunc}
                // onMouseLeave={leaveFunc}
                style={{
                    position: "fixed", width: _baseGeo.width * 0.1 + "px",
                    height: _baseGeo.height * 0.1 + 'px'
                    , left: _baseGeo.width * 0.19 + _baseGeo.left + "px",
                    top: _baseGeo.height * 0.44 + "px",
                    backgroundColor: 'grey',
                    transform: 'rotateZ(-52deg)',
                    cursor: 'pointer',
                    opacity: '0',
                }}>
            </div>


            {/* success border up*/}
            <div
                ref={refSuccessUp}
                className="hide"
                style={{
                    position: "fixed", width: _baseGeo.width * 0.16 + "px"
                    , left: _baseGeo.width * 0.137 + _baseGeo.left + "px",
                    top: _baseGeo.height * 0.309 + "px",
                }}>
                <img draggable={false} width={"100%"}
                    src={prePathUrl() + "images/sb_51_highlight/sb_51_highlight_2.svg"}
                />
            </div>

            {/* success border down*/}
            <div
                ref={refSuccessDown}
                className="hide"
                style={{
                    position: "fixed", width: _baseGeo.width * 0.16 + "px"
                    , left: _baseGeo.width * 0.25 + _baseGeo.left + "px",
                    top: _baseGeo.height * 0.448 + "px",
                }}>
                <img draggable={false} width={"100%"}
                    src={prePathUrl() + "images/sb_51_highlight/sb_51_highlight_2.svg"}
                />
            </div>

            {/* error border up*/}
            <div
                ref={refErrorUp}
                className="hide"
                style={{
                    position: "fixed", width: _baseGeo.width * 0.16 + "px"
                    , left: _baseGeo.width * 0.135 + _baseGeo.left + "px",
                    top: _baseGeo.height * 0.309 + "px",
                }}>
                <img draggable={false} width={"100%"}
                    src={prePathUrl() + "images/sb_51_highlight/sb_51_red_highlight.svg"}
                />
            </div>

            {/* error border down*/}
            <div
                ref={refErrorDown}
                className="hide"
                style={{
                    position: "fixed", width: _baseGeo.width * 0.16 + "px"
                    , left: _baseGeo.width * 0.249 + _baseGeo.left + "px",
                    top: _baseGeo.height * 0.448 + "px",
                }}>
                <img draggable={false} width={"100%"}
                    src={prePathUrl() + "images/sb_51_highlight/sb_51_red_highlight.svg"}
                />
            </div>


            <div
                style={{
                    position: "fixed", width: _baseGeo.width * 0.2 + "px",
                    height: _baseGeo.width * 0.2 + "px"
                    , left: _baseGeo.width * 0.605 + _baseGeo.left + "px",
                    top: _baseGeo.height * 0.26 + "px",
                }}>
                <BaseImage
                    ref={characterList[0]}
                    url={"animations/sb_51_bee_strow/bee_01.svg"}
                />
                <BaseImage
                    ref={characterList[1]}
                    url={"animations/sb_51_bee_strow/bee_02.svg"}
                    // style = {{opacity:0.5}}
                    scale={1}
                // posInfo = {{l:-0.01,t:0.001}}
                />
                <BaseImage
                    ref={characterList[2]}
                    url={"animations/sb_51_bee_strow/bee_03.svg"}
                // posInfo={{ l: 0.01 }}
                />
                <BaseImage
                    ref={characterList[3]}
                    url={"animations/sb_51_bee_strow/bee_04.svg"}

                // posInfo={{ l: 0, t: -0.015 }}
                />

                <BaseImage
                    url={"animations/sb_51_bee/sb_51_bee_eye_01.svg"}
                    scale={0.165}
                    posInfo={{ l: 0.347, t: 0.235 }}
                    style={{ transform: 'rotateY(180deg)' }}
                    ref={eyeList[0]}
                />
                <BaseImage
                    url={"animations/sb_51_bee/sb_51_bee_eye_02.svg"}
                    scale={0.165}
                    posInfo={{ l: 0.347, t: 0.235 }}
                    style={{ transform: 'rotateY(180deg)' }}
                    ref={eyeList[1]}
                />
                <BaseImage
                    url={"animations/sb_51_bee/sb_51_bee_eye_03.svg"}
                    scale={0.165}
                    posInfo={{ l: 0.347, t: 0.235 }}
                    style={{ transform: 'rotateY(180deg)' }}
                    ref={eyeList[2]}
                />
                <BaseImage
                    url={"animations/sb_51_bee/sb_51_bee_eye_04.svg"}
                    scale={0.165}
                    posInfo={{ l: 0.347, t: 0.235 }}
                    style={{ transform: 'rotateY(180deg)' }}
                    ref={eyeList[3]}
                />
            </div>


            <div
                onClick={() => {
                    correctAudioList[randomList[varCurrentStep]].pause();
                    correctAudioList[randomList[varCurrentStep]].currentTime = 0;
                    correctAudioList[randomList[varCurrentStep]].play().catch(error => { });
                }}
                className='commonButton'
                style={{
                    position: "fixed", width: _geo.width * 0.055 + "px",
                    right: "2%"
                    , top: "46%", cursor: "pointer",
                }}>
                <img draggable={false} width={"100%"}
                    src={prePathUrl() + 'images/buttons/audio.svg'}
                />
            </div>

            <div
                style={{
                    position: "fixed", width: _baseGeo.width * 0.2 + "px",
                    height: _baseGeo.height * 0.1 + "px"
                    , right: "0%",
                    top: "0%",
                }}>
                <BaseImage url="sb_51_icons/sb_15_icon_progress_bar.svg" />
                {
                    [0, 1, 2, 3].map(value =>
                        <BaseImage
                            ref={markList[3 - value]}
                            className='aniObject'
                            scale={0.38}
                            posInfo={{ l: 0.55 - value * 0.16, t: -0.08 }}
                            url="sb_51_icons/sb_15_icon_bluestar.svg" />
                    )
                }

            </div>


        </div >
    );
}
