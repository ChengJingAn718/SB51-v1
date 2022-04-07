import "../stylesheets/styles.css";
import { useContext, useEffect, useRef } from "react";
import { UserContext } from "../components/BaseShot";
import { getMaskStyle } from "../components/CommonFunctions";
import { prePathUrl, startRepeatAudio, stopRepeatAudio, setExtraVolume } from "../components/CommonFunctions"

import BaseImage from "../components/BaseImage"

var varCurrentStep = 0;
var varAnswerList = [0, 1, 1, 1]

var movePos = { x: 0.85, y: 0.36 }
var currentPos = { x: 1.2, y: 0.1 }

var correctAudioList = [];
var timerList = []

var currentCharacterIndex = 0;
let randomList = []

export default function Scene3({ nextFunc, _geo, startTransition, _baseGeo }) {

    const audioList = useContext(UserContext)

    const markList = [useRef(), useRef(), useRef(), useRef()]
    const refLetterA = useRef()
    const refLetterGo = useRef()
    const refLetterTheUp = useRef()
    const refLetterTheDown = useRef()
    const refLetterAnd = useRef()

    const refFly = useRef()
    const parentRef = useRef()

    const wrongLetterList = [
        refLetterA,
        refLetterTheDown,
        refLetterGo,
        refLetterGo
    ]


    const showingPairList = [
        [refLetterGo, refLetterA],
        [refLetterAnd, refLetterTheDown],
        [refLetterA, refLetterGo],
        [refLetterGo, refLetterTheUp]
    ]

    const characterList = Array.from({ length: 7 }, ref => useRef())
    const characterList1 = Array.from({ length: 7 }, ref => useRef())

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


        movePos = { x: 0.73, y: 0.36 }
        currentPos = { x: 1.2, y: 0.1 }

        currentCharacterIndex = 0;

        for (let i = 1; i < 7; i++) {
            characterList[i].current.setClass('character-disappear')
            // eyeList[i].current.setClass('character-disappear')
        }
        characterList.map((character, index) => {
            if (index > 0)
                character.current.setClass('character-disappear')
        })

        let aniCount = 0;

        let isSeeingFront = false;
        const timeInterval = setInterval(() => {
            if (!isSeeingFront)
                characterList[currentCharacterIndex].current.setClass('character-disappear')
            else
                characterList1[currentCharacterIndex].current.setClass('character-disappear')

            if (currentCharacterIndex > 2) {
                aniCount++
                currentCharacterIndex = 0;

                if (aniCount == 8) {
                    isSeeingFront = !isSeeingFront
                    aniCount = 0;
                }

            }

            else
                currentCharacterIndex++

            if (!isSeeingFront)
                characterList[currentCharacterIndex].current.setClass('character-appear')
            else
                characterList1[currentCharacterIndex].current.setClass('character-appear')
        }, 120);

        varCurrentStep = 0;
        parentRef.current.style = 'none'

        audioList.bodyAudio.src = prePathUrl() + "sounds/ep_51_audio_05.mp3"
        setExtraVolume(audioList.bodyAudio, 1.5)

        correctAudioList = [
            audioList.wordAudio3,
            audioList.wordAudio4,
            audioList.wordAudio1,
            audioList.wordAudio2
        ]

        wrongLetterList.map((ref) => {
            ref.current.style.transition = '0.3s'
        })


        refFly.current.style.transition = '0.3s'
        refFly.current.style.transform = 'rotateY(180deg)'

        timerList[0] = setTimeout(() => {
            audioList.bodyAudio.play().catch(error => { })
            timerList[1] = setTimeout(() => {
                correctAudioList[randomList[0]].play().catch(error => { })
                startRepeatAudio();
                parentRef.current.style = ''
            }, audioList.bodyAudio.duration * 1000);
        }, 1800);


        setTimeout(() => {
            showingPairList[randomList[0]][0].current.className = 'appear'
            showingPairList[randomList[0]][1].current.className = 'appear'
        }, 1000);

        return () => {
            clearInterval(timeInterval)
            setExtraVolume(audioList.bodyAudio, 1)
        }
    }, [])


    setTimeout(() => {
        currentPos = movePos;
        if (refFly.current != null) {
            refFly.current.style.transition = '0.6s'
            changePos();
        }
    }, 500);

    setTimeout(() => {
        changePos();
    }, 100);



    function changePos() {
        if (refFly.current != null) {
            refFly.current.style.left = _baseGeo.left + _baseGeo.width * currentPos.x + "px"
            refFly.current.style.bottom = _baseGeo.height * currentPos.y + "px"
        }
    }


    function funcClick(isUpClicked = true) {
        stopRepeatAudio();
        clearTimeout(timerList[0])
        clearTimeout(timerList[1])

        wrongLetterList[randomList[varCurrentStep]].current.className = ''
        clearTimeout(timerList[2])
        correctAudioList[randomList[varCurrentStep]].pause();
        correctAudioList[randomList[varCurrentStep]].currentTime = 0;

        correctAudioList[0].pause();
        audioList.bodyAudio.pause();

        if (varAnswerList[randomList[varCurrentStep]] == isUpClicked) {

            parentRef.current.style.pointerEvents = 'none'
            correctAudioList[randomList[varCurrentStep]].pause()
            audioList.tingAudio.play().catch(event => { })
            markList[varCurrentStep].current.setUrl('sb_51_icons/sb_15_icon_yellowstar' + '.svg')
            wrongLetterList[randomList[varCurrentStep]].current.className = 'hide'


            setTimeout(() => {
                if (varCurrentStep < 3) {
                    refLetterA.current.className = 'hide'
                    refLetterGo.current.className = 'hide'
                    refLetterTheUp.current.className = 'hide'
                    refLetterTheDown.current.className = 'hide'
                    refLetterAnd.current.className = 'hide'


                    if (randomList[varCurrentStep + 1] == 0) {
                        refLetterA.current.className = 'appear'
                        refLetterGo.current.className = 'appear'
                    }

                    if (randomList[varCurrentStep + 1] == 1) {
                        setTimeout(() => {
                            refLetterAnd.current.className = 'appear'
                            refLetterTheDown.current.className = 'appear'
                        }, 200);

                    }

                    if (randomList[varCurrentStep + 1] == 2) {
                        setTimeout(() => {
                            refLetterA.current.className = 'appear'
                            refLetterGo.current.className = 'appear'
                        }, 200);

                    }

                    if (randomList[varCurrentStep + 1] == 3) {
                        setTimeout(() => {
                            refLetterGo.current.className = 'appear'
                            refLetterTheUp.current.className = 'appear'
                        }, 200);

                    }

                    startRepeatAudio();
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
            }, 4000);

        }
        else {
            correctAudioList[randomList[varCurrentStep]].currentTime = 0;
            audioList.buzzAudio.currentTime = 0;

            correctAudioList[randomList[varCurrentStep]].pause();
            audioList.buzzAudio.play().catch(error => { })
            wrongLetterList[randomList[varCurrentStep]].current.className = 'wrong-exp'

            timerList[2] = setTimeout(() => {
                correctAudioList[randomList[varCurrentStep]].play().catch(error => { })
                wrongLetterList[randomList[varCurrentStep]].current.className = 'show'

                startRepeatAudio();
            }, 800);

        }

    }

    return (
        <div className="aniObject"
            ref={parentRef}
        >
            <div
                style={{
                    position: "fixed", width: _baseGeo.width * 0.122 + "px"
                    , left: _baseGeo.width * 0.18 + _baseGeo.left + "px",
                    bottom: _baseGeo.height * 0.265 + "px",
                    opacity: 0.4
                }}>
                <img draggable={false} width={"100%"}
                    src={prePathUrl() + "images/sb_51_highlight/sb_51_highlight_1.svg"}
                />
            </div>

            <div
                style={{
                    position: "fixed", width: _baseGeo.width * 0.093 + "px"
                    , left: _baseGeo.width * 0.411 + _baseGeo.left + "px",
                    bottom: _baseGeo.height * 0.176 + "px",
                    opacity: 0.4
                }}>
                <img draggable={false} width={"100%"}
                    src={prePathUrl() + "images/sb_51_highlight/sb_51_highlight_1.svg"}
                />
            </div>

            {/* letter a */}

            <div ref={refLetterA} className="hide">
                <div
                    onClick={() => { funcClick() }}
                    className="playBtn"
                    style={{
                        position: "fixed", width: _baseGeo.width * 0.13 + "px",
                        height: _baseGeo.width * 0.13 + "px"
                        , left: _baseGeo.width * 0.175 + _baseGeo.left + "px",
                        bottom: _baseGeo.height * 0.29 + "px",

                    }}
                >
                    <div
                        style={{
                            position: "absolute", width: _baseGeo.width * 0.055 + "px",
                            height: _baseGeo.width * 0.072 + "px"
                            , left: _baseGeo.width * 0.025 + "px",
                            bottom: _baseGeo.height * 0.035 + "px",
                        }}
                    >
                        <div
                            style={getMaskStyle({ url: 'sb51_text_interactive/artboard_5', scale: 250 })}
                        >
                        </div>
                    </div>
                </div>
            </div>

            {/* letter go */}
            <div ref={refLetterGo} className="hide"
            >
                <div
                    onClick={() => { funcClick(false) }}
                    className="playBtn"
                    style={{
                        position: "fixed", width: _baseGeo.width * 0.10 + "px",
                        height: _baseGeo.width * 0.1 + "px"
                        , left: _baseGeo.width * 0.405 + _baseGeo.left + "px",
                        bottom: _baseGeo.height * 0.2 + "px",

                    }}
                >
                    <div
                        style={{
                            position: "absolute", width: _baseGeo.width * 0.08 + "px",
                            height: _baseGeo.width * 0.08 + "px"
                            , left: _baseGeo.width * 0.005 + "px",
                            bottom: _baseGeo.height * 0.03 + "px",
                        }}
                    >
                        <div
                            style={getMaskStyle({ url: 'sb51_text_interactive/artboard_7', scale: 140 })}
                        >
                        </div>
                    </div>

                </div>
            </div>

            {/* letter and */}
            <div className="hide" ref={refLetterAnd}
            >
                <div
                    onClick={() => { funcClick() }}
                    className="playBtn"
                    style={{
                        position: "fixed", width: _baseGeo.width * 0.13 + "px",
                        height: _baseGeo.width * 0.13 + "px"
                        , left: _baseGeo.width * 0.175 + _baseGeo.left + "px",
                        bottom: _baseGeo.height * 0.29 + "px",

                    }}
                >
                    <div
                        style={{
                            position: "absolute", width: _baseGeo.width * 0.1 + "px",
                            height: _baseGeo.width * 0.11 + "px"
                            , left: _baseGeo.width * 0.01 + "px",
                            bottom: _baseGeo.height * 0.02 + "px",
                        }}
                    >
                        <div
                            style={getMaskStyle({ url: 'sb51_text_interactive/artboard_8', scale: 120 })}
                        >
                        </div>
                    </div>
                </div>


            </div>

            {/* letter the down */}
            <div className="hide" ref={refLetterTheDown}>
                <div
                    onClick={() => { funcClick(false) }}
                    className="playBtn"
                    style={{
                        position: "fixed", width: _baseGeo.width * 0.10 + "px",
                        height: _baseGeo.width * 0.1 + "px"
                        , left: _baseGeo.width * 0.405 + _baseGeo.left + "px",
                        bottom: _baseGeo.height * 0.2 + "px",

                    }}
                >
                    <div
                        style={{
                            position: "absolute", width: _baseGeo.width * 0.1 + "px",
                            height: _baseGeo.width * 0.1 + "px"
                            , left: _baseGeo.width * 0.00 + "px",
                            bottom: _baseGeo.height * 0.01 + "px",
                            overflow: 'hidden'
                        }}
                    >
                        <div
                            style={getMaskStyle({ url: 'sb51_text_interactive/artboard_6', scale: 120 })}
                        >
                        </div>

                    </div>

                </div>
            </div>
            {/* letter the up */}

            <div ref={refLetterTheUp}
                className="hide"
            >
                <div onClick={() => { funcClick() }}
                    className="playBtn"
                    style={{
                        position: "fixed", width: _baseGeo.width * 0.13 + "px",
                        height: _baseGeo.width * 0.13 + "px"
                        , left: _baseGeo.width * 0.175 + _baseGeo.left + "px",
                        bottom: _baseGeo.height * 0.29 + "px",

                    }}
                >
                    <div
                        style={{
                            position: "fixed", width: _baseGeo.width * 0.105 + "px",
                            height: _baseGeo.width * 0.105 + "px"
                            , left: _baseGeo.width * 0.01 + "px",
                            bottom: _baseGeo.height * 0.03 + "px",
                            overflow: 'hidden'
                        }}
                    >

                        <div style={getMaskStyle({ url: 'sb51_text_interactive/artboard_6', scale: 120 })}>
                        </div>
                    </div>
                </div>

            </div>


            <div
                ref={refFly}
                style={{
                    position: "fixed", width: _baseGeo.width * 0.1 + "px",
                    height: _baseGeo.width * 0.3 + "px",
                    cursor: 'pointer'
                    , transition: '0.5s'
                }}>

                {Array.from(Array(7).keys()).map(value =>
                    <BaseImage
                        ref={characterList[value]}
                        scale={1.4}
                        posInfo={{ l: 0, t: 0.41 }}
                        url={"animations/sb_51_burtterfly_side_face/sb_51_butterfly_0" + (value + 1) + ".svg"}
                    />
                )}


                {Array.from(Array(7).keys()).map(value =>
                    <BaseImage
                        ref={characterList1[value]}
                        scale={1.4}
                        posInfo={{ l: 0, t: 0.41 }}
                        className='character-disappear'
                        url={"animations/sb_51_butterfly_front_face/sb_51_butterfly_0" + (value + 1) + ".svg"}
                    />
                )}

                {/* <BaseImage
                    ref={eyeList[1]}
                    posInfo={{ l: 0.87, t: 0.782 }}
                    scale={0.042}
                    url={"animations/sb_51_butterfly/sb_51_butterfly_eye_02.svg"}
                />
                <BaseImage
                    ref={eyeList[2]}
                    posInfo={{ l: 0.87, t: 0.782 }}
                    scale={0.042}
                    url={"animations/sb_51_butterfly/sb_51_butterfly_eye_03.svg"}
                />
                <BaseImage
                    ref={eyeList[3]}
                    posInfo={{ l: 0.87, t: 0.782 }}
                    scale={0.042}
                    url={"animations/sb_51_butterfly/sb_51_butterfly_eye_04.svg"}
                /> */}

            </div>

            <div
                className='commonButton'
                onClick={() => {
                    correctAudioList[randomList[varCurrentStep]].pause();
                    correctAudioList[randomList[varCurrentStep]].currentTime = 0;
                    correctAudioList[randomList[varCurrentStep]].play().catch(error => { });
                }}

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
