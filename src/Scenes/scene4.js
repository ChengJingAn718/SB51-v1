import "../stylesheets/styles.css";
import { useContext, useEffect, useRef, useState } from "react";
import { UserContext } from "../components/BaseShot";
import {
    getMaskStyle, prePathUrl, stopRepeatAudio, startRepeatAudio, setRepeatAudio
} from "../components/CommonFunctions";
import BaseImage from "../components/BaseImage";

var stepCount = 0;
var posBeeList = [
    { x: 0.21, y: 0.2 },
    { x: 0.36, y: 0.4 },
    { x: 0.5, y: 0.5 },
    { x: 0.47, y: 0.15 },
]

var posComplexBeePaths = [
    { x: 0.68, y: 0.15 },
    { x: 0.54, y: 0.47 },
    { x: 0.39, y: 0.4 },
    { x: 0.21, y: 0.2 },
]

var movePos = { x: '0.15', y: '0.5' }
var currentPos = { x: '-0.2', y: '0.9' }

var timerList = []

var currentCharacterIndex = 0;
var currentEyeIndex = 0;
var isPlusing = true;

let timerInterval2


export default function Scene3({ nextFunc, _geo, startTransition, _baseGeo }) {

    const audioList = useContext(UserContext)
    const refLetterList = [
        useRef(),
        useRef(),
        useRef(),
        useRef()
    ]

    const showingLetterList = [
        useRef(),
        useRef(),
        useRef(),
        useRef()
    ]

    const characterList = [
        useRef(),
        useRef(),
        useRef(),
        useRef()
    ]

    const refBee = useRef();

    setTimeout(() => {
        changePos();
    }, 100);



    const eyeList = [
        useRef(),
        useRef(),
        useRef(),
        useRef()
    ]


    useEffect(() => {
        currentCharacterIndex = 0;
        movePos = { x: '0.15', y: '0.5' }
        currentPos = { x: '-0.2', y: '0.9' }

        // for (let i = 1; i < 4; i++)
        //     eyeList[i].current.setClass('character-disappear')

        // isPlusing = true;

        const timeInterval = setInterval(() => {

            characterList[currentCharacterIndex].current.setClass('character-disappear')
            // if (isPlusing) {
            //     if (currentCharacterIndex > 2) {
            //         isPlusing = false
            //         currentCharacterIndex--
            //     }
            //     else
            //         currentCharacterIndex++
            // }
            // else {
            //     if (currentCharacterIndex == 0) {
            //         isPlusing = true;
            //         currentCharacterIndex++
            //     }
            //     else
            //         currentCharacterIndex--
            // }

            if (currentCharacterIndex > 1)
                currentCharacterIndex = 0;
            else
                currentCharacterIndex++

            characterList[currentCharacterIndex].current.setClass('character-appear')
        }, 150);

        const timeInterval1 = setInterval(() => {
            clearInterval(timerInterval2)
            timerInterval2 = setInterval(() => {

                // eyeList[currentEyeIndex].current.setClass('character-disappear')
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
                        clearInterval(timerInterval2)
                    }
                    else
                        currentEyeIndex--
                }

                // eyeList[currentEyeIndex].current.setClass('character-appear')

            }, 100);

        }, 3000);


        stepCount = 0;

        //fomart audio src
        audioList.bodyAudio.src = prePathUrl() + "sounds/ep_51_audio_06.mp3"
        audioList.subBodyAudio.src = prePathUrl() + "sounds/ep_51_audio_07.mp3"

        setRepeatAudio(audioList.bodyAudio)

        audioList.wordAudio1.src = prePathUrl() + "sounds/ep_51_audio_08.mp3"
        audioList.wordAudio2.src = prePathUrl() + "sounds/ep_51_audio_09.mp3"
        audioList.wordAudio3.src = prePathUrl() + "sounds/ep_51_audio_10.mp3"
        audioList.wordAudio4.src = prePathUrl() + "sounds/ep_51_audio_11.mp3"

        //------------

        setTimeout(() => {
            if (refBee.current != null) {
                refBee.current.style.left = _baseGeo.left + _baseGeo.width * currentPos.x + "px"
                refBee.current.style.bottom = _baseGeo.height * currentPos.y + "px"
                refBee.current.style.transition = '1.2s ease-in-out'
            }
        }, 200);

        setTimeout(() => {

            currentPos = movePos;
            changePos();
        }, 500);

        //body Timer
        timerList[0] = setTimeout(() => {
            audioList.bodyAudio.play().catch(error => { })
            startRepeatAudio()
        }, 2000);


        return () => {
            clearTimeout(timeInterval)
            clearTimeout(timeInterval1)
            clearTimeout(timerInterval2)
        }
    }, [])

    function movingFunc() {
        if (stepCount < 4) {
            currentPos = posBeeList[stepCount]
            refLetterList[stepCount].current.className = 'show'
            changePos();
            refBee.current.style.transition = '0.7s ease-in-out'
            stepCount++;
            if (stepCount > 1) {
                refLetterList[stepCount - 2].current.style.pointerEvents = 'none'
                // refLetterList[stepCount - 2].current.className = 'disapear'
                showingLetterList[stepCount - 2].current.className = 'bluehalf'
            }
        }
    }


    function clickBeeFunc() {

        refBee.current.style.pointerEvents = 'none'
        audioList.clickAudio.currentTime = 0
        audioList.clickAudio.play().catch(error => { })

        stopRepeatAudio()

        if (stepCount < 4) {
            switch (stepCount) {
                case 0:
                    timerList[1] = setTimeout(() => {
                        audioList.subBodyAudio.play().catch(error => { });
                        startRepeatAudio()
                    }, 1000);
                    audioList.bodyAudio.pause();
                    clearTimeout(timerList[0])

                    setRepeatAudio(audioList.subBodyAudio)
                    break;
                case 1: audioList.subBodyAudio.pause(); clearTimeout(timerList[1]); audioList.wordAudio1.play().catch(error => { }); break;
                case 2: audioList.wordAudio2.play().catch(error => { }); break;
                case 3: audioList.wordAudio3.play().catch(error => { }); break;
                default:
                    break;
            }
            if (stepCount > 0) {
                setTimeout(movingFunc, 2400);
                startRepeatAudio(4000, 7000)
                refLetterList[stepCount - 1].current.style.pointerEvents = 'none'
            }

            else {
                movingFunc();
            }
        }
        else {
            refLetterList[3].current.style.pointerEvents = 'none'
            audioList.wordAudio4.play().catch(error => { });
            setTimeout(() => {

                refBee.current.style.transition = '1.3s'
                currentPos = posComplexBeePaths[0]
                changePos()


                setTimeout(() => {
                    for (let i = 0; i < 3; i++)
                        characterList[i].current.setStyle([
                            { key: 'transform', value: 'rotateY(-180deg)' },
                            { key: 'left', value: '20%' }
                        ])
                }, 300);



                setTimeout(() => {
                    audioList.wordAudio4.play();
                    setTimeout(() => {
                        audioList.wordAudio3.play();
                        setTimeout(() => {
                            audioList.wordAudio2.play();
                            setTimeout(() => {
                                audioList.wordAudio1.play();
                            }, 2000);
                        }, 2000);

                    }, 2000);

                }, 1000);

                setTimeout(() => {
                    currentPos = posComplexBeePaths[1]
                    refBee.current.style.transition = '0.7s ease-in-out'

                    showingLetterList[2].current.className = 'bluecomeback scaleText'
                    setTimeout(() => {
                        showingLetterList[2].current.className = 'bluecomeback normalText'
                    }, 1800);

                    changePos();
                }, 2700);
                setTimeout(() => {
                    currentPos = posComplexBeePaths[2]
                    showingLetterList[1].current.className = 'bluecomeback scaleText'
                    setTimeout(() => {
                        showingLetterList[1].current.className = 'bluecomeback normalText'
                    }, 1800);
                    changePos();
                }, 4700);
                setTimeout(() => {

                    showingLetterList[0].current.className = 'bluecomeback scaleText'
                    setTimeout(() => {
                        showingLetterList[0].current.className = 'bluecomeback normalText'
                    }, 1800);

                    refBee.current.style.transition = '1.3s'
                    currentPos = posComplexBeePaths[3]
                    changePos();

                    setTimeout(() => {
                        for (let i = 0; i < 3; i++)
                            characterList[i].current.setStyle([
                                { key: 'transform', value: 'rotateY(0deg)' },
                                { key: 'left', value: '-10%' }
                            ])
                    }, 300);

                }, 6700);

                setTimeout(() => {
                    nextFunc();
                }, 10000);

            }, 2400);
        }

    }

    function changePos() {
        if (refBee.current != null) {
            refBee.current.style.left = _baseGeo.left + _baseGeo.width * currentPos.x + "px"
            refBee.current.style.bottom = _baseGeo.height * currentPos.y + "px"
        }
    }

    return (
        <div className="aniObject">
            {/* letter  - is */}
            <div

                className="hide" ref={refLetterList[0]}>
                <div style={{
                    position: "fixed", width: _baseGeo.width * 0.15 + "px"
                    , left: _baseGeo.left + _baseGeo.width * 0.318 + "px",
                    bottom: _baseGeo.height * 0.152 + "px",
                }}>
                    <img draggable={false} width={"100%"}
                        src={prePathUrl() + "images/sb_51_highlight/sb_51_highlight.svg"}
                    />
                </div>

                <div
                    className="playBtn"
                    onClick={clickBeeFunc}
                    style={{
                        position: "fixed", width: _baseGeo.width * 0.15 + "px",
                        height: _baseGeo.width * 0.13 + "px"
                        , left: _baseGeo.left + _baseGeo.width * 0.32 + "px",
                        bottom: _baseGeo.height * 0.18 + "px",
                       
                    }}
                >
                    <div
                        ref={showingLetterList[0]}
                        style={{
                            position: "fixed", width: _baseGeo.width * 0.1 + "px",
                            height: _baseGeo.width * 0.1 + "px"
                            , left: _baseGeo.width * 0.02 + "px",
                            bottom: _baseGeo.width * 0.025 + "px",
                            overflow: 'hidden'
                        }}
                    >
                        <div style={getMaskStyle({ url: 'sb51_text_interactive/artboard_1', scale: 200 })}>
                        </div>
                    </div>
                </div>
            </div>

            {/* letter - I */}
            <div

                className="hide" ref={refLetterList[1]}>
                <div style={{
                    position: "fixed", width: _baseGeo.width * 0.15 + "px"
                    , left: _baseGeo.left + _baseGeo.width * 0.447 + "px",
                    bottom: _baseGeo.height * 0.245 + "px",

                }}>
                    <img draggable={false} width={"100%"}
                        src={prePathUrl() + "images/sb_51_highlight/sb_51_highlight.svg"}
                    />
                </div>

                <div
                    className="playBtn"
                    onClick={clickBeeFunc}
                    style={{
                        position: "fixed", width: _baseGeo.width * 0.15 + "px",
                        height: _baseGeo.width * 0.13 + "px"
                        , left: _baseGeo.left + _baseGeo.width * 0.448 + "px",
                        bottom: _baseGeo.height * 0.28 + "px",
                       
                    }}
                >
                    <div
                        ref={showingLetterList[1]}
                        style={{
                            position: "fixed", width: _baseGeo.width * 0.1 + "px",
                            height: _baseGeo.width * 0.1 + "px"
                            , left: _baseGeo.width * 0.015 + "px",
                            bottom: _baseGeo.height * 0.02 + "px",
                            overflow: 'hidden'
                        }}
                    >
                        <div
                            style={getMaskStyle({ url: 'sb51_text_interactive/artboard_2', scale: 180 })}
                        >
                        </div>
                    </div>
                </div>
            </div>
            {/* letter - You */}
            <div

                className="hide" ref={refLetterList[2]}>
                <div style={{
                    position: "fixed", width: _baseGeo.width * 0.15 + "px"
                    , left: _baseGeo.left + _baseGeo.width * 0.575 + "px",
                    bottom: _baseGeo.height * 0.345 + "px",
                }}>
                    <img draggable={false} width={"100%"}
                        src={prePathUrl() + "images/sb_51_highlight/sb_51_highlight.svg"}
                    />
                </div>

                <div
                    className="playBtn"
                    onClick={clickBeeFunc}
                    style={{
                        position: "fixed", width: _baseGeo.width * 0.15 + "px",
                        height: _baseGeo.width * 0.13 + "px"
                        , left: _baseGeo.left + _baseGeo.width * 0.575 + "px",
                        bottom: _baseGeo.height * 0.38 + "px",
                       
                    }}
                >
                    <div
                        ref={showingLetterList[2]}
                        style={{
                            position: "fixed", width: _baseGeo.width * 0.13 + "px",
                            height: _baseGeo.width * 0.13 + "px"
                            , left: _baseGeo.width * 0.01 + "px",
                            bottom: _baseGeo.height * 0.02 + "px",
                            overflow: 'hidden'
                        }}
                    >
                        <div
                            style={getMaskStyle({ url: 'sb51_text_interactive/artboard_3', scale: 110 })}
                        >
                        </div>
                    </div>
                </div>
            </div>

            {/* letter - to */}
            <div
                className="hide" ref={refLetterList[3]}>
                <div style={{
                    position: "fixed", width: _baseGeo.width * 0.15 + "px"
                    , left: _baseGeo.left + _baseGeo.width * 0.562 + "px",
                    bottom: _baseGeo.height * 0.105 + "px",
                }}>
                    <img draggable={false} width={"100%"}
                        src={prePathUrl() + "images/sb_51_highlight/sb_51_highlight.svg"}
                    />
                </div>
                <div
                    className="playBtn"
                    onClick={clickBeeFunc}
                    style={{
                        position: "fixed", width: _baseGeo.width * 0.15 + "px",
                        height: _baseGeo.width * 0.13 + "px"
                        , left: _baseGeo.left + _baseGeo.width * 0.563 + "px",
                        bottom: _baseGeo.height * 0.14 + "px",
                       
                    }}
                >

                    <div
                        ref={showingLetterList[3]}
                        style={{
                            position: "fixed", width: _baseGeo.width * 0.1 + "px",
                            height: _baseGeo.width * 0.1 + "px"
                            , left: _baseGeo.width * 0.015 + "px",
                            bottom: _baseGeo.height * 0.05 + "px",
                            overflow: 'hidden'
                        }}
                    >
                        <div
                            style={getMaskStyle({ url: 'sb51_text_interactive/artboard_4', scale: 180 })}
                        >
                        </div>
                    </div>
                </div>
            </div>

            {/* Bee */}
            <div
                onClick={clickBeeFunc}
                className="playBtn"
                ref={refBee} style={{
                    position: "fixed", width: _baseGeo.width * 0.15 + "px",
                    height: _baseGeo.width * 0.15 + "px"
                    , transition: '0.5s'
                }}>
                <BaseImage
                    ref={characterList[0]}
                    url={"animations/sb_51_bee/sb_51_bee_01.svg"}
                />
                <BaseImage
                    ref={characterList[1]}
                    url={"animations/sb_51_bee/sb_51_bee_02.svg"}
                    // style = {{opacity:0.5}}
                    scale={1}
                // posInfo = {{l:-0.01,t:0.001}}
                />
                <BaseImage
                    ref={characterList[2]}
                    url={"animations/sb_51_bee/sb_51_bee_03.svg"}
                // posInfo={{ l: 0.01 }}
                />
                {/* <BaseImage
                    ref={characterList[3]}
                    url={"animations/sb_51_bee/sb_51_bee_04.svg"}

                // posInfo={{ l: 0, t: -0.015 }}
                /> */}

                {/* <BaseImage
                    ref={eyeList[0]}
                    url={"animations/sb_51_bee/sb_51_bee_eye_01.svg"}
                    scale={0.29}
                    posInfo={{ l: 0.58, t: 0.23 }}
                />
                <BaseImage
                    url={"animations/sb_51_bee/sb_51_bee_eye_02.svg"}
                    scale={0.29}
                    posInfo={{ l: 0.58, t: 0.23 }}
                    ref={eyeList[1]}
                />
                <BaseImage
                    url={"animations/sb_51_bee/sb_51_bee_eye_03.svg"}
                    scale={0.29}
                    posInfo={{ l: 0.58, t: 0.23 }}
                    ref={eyeList[2]}
                />
                <BaseImage
                    url={"animations/sb_51_bee/sb_51_bee_eye_04.svg"}
                    scale={0.29}
                    ref={eyeList[3]}
                    posInfo={{ l: 0.58, t: 0.23 }}
                /> */}

            </div>
        </div >
    );
}
