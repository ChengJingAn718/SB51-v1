import "../stylesheets/styles.css";
import { useEffect, useRef, useContext } from "react";
import { UserContext } from "../components/BaseShot";
import { getMaskStyle } from "../components/CommonFunctions"
import { prePathUrl, setRepeatAudio, startRepeatAudio, stopRepeatAudio } from "../components/CommonFunctions"

import BaseImage from "../components/BaseImage";

var stepCount = 0;
var posFlyList = [
    { x: 0.3, y: 0.55 },
    { x: 0.69, y: 0.6 },
    { x: 0.58, y: 0.37 },
    { x: 0.1, y: 0.59 }
]

var posComplexFlyPaths = [
    { x: 0.1, y: 0.39 },
    { x: 0.3, y: 0.55 },
    { x: 0.5, y: 0.37 },
    { x: 0.69, y: 0.6 }
]

var movePos = { x: '0.15', y: '0.47' }
var currentPos = { x: '-0.2', y: '0.9' }
var timerList = []

var currentCharacterIndex = 0;
var currentEyeIndex = 0;
var isPlusing = true;
let timeInterval2


export default function Scene3({ nextFunc, _baseGeo }) {

    const audioList = useContext(UserContext)

    const refLetterList = [
        useRef(),
        useRef(),
        useRef(),
        useRef()
    ]

    const characterList = Array.from({ length: 7 }, ref => useRef())
    const characterList1 = Array.from({ length: 7 }, ref => useRef())

    // const eyeList = [
    //     useRef(),
    //     useRef(),
    //     useRef(),
    //     useRef()
    // ]

    const showingLetterList = [
        useRef(),
        useRef(),
        useRef(),
        useRef()
    ]


    const refFly = useRef();

    setTimeout(() => {
        changePos();


    }, 100);

    useEffect(() => {

        movePos = { x: '0.15', y: '0.47' }
        currentPos = { x: '-0.2', y: '0.9' }

        currentCharacterIndex = 0;
        isPlusing = true;
        currentEyeIndex = 0;

        // for (let i = 1; i < 4; i++) {

        //     eyeList[i].current.setClass('character-disappear')
        // }

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




        stepCount = 0;
        audioList.bodyAudio.src = prePathUrl() + "sounds/ep_51_audio_15.mp3"
        audioList.subBodyAudio.src = prePathUrl() + "sounds/ep_51_audio_07.mp3"

        setRepeatAudio(audioList.bodyAudio)

        audioList.wordAudio1.src = prePathUrl() + "sounds/ep_51_audio_17.mp3"
        audioList.wordAudio2.src = prePathUrl() + "sounds/ep_51_audio_18.mp3"
        audioList.wordAudio3.src = prePathUrl() + "sounds/ep_51_audio_19.mp3"
        audioList.wordAudio4.src = prePathUrl() + "sounds/ep_51_audio_20.mp3"

        currentPos = movePos;
        setTimeout(() => {
            if (refFly.current != null) {
                refFly.current.style.left = _baseGeo.left + _baseGeo.width * currentPos.x + "px"
                refFly.current.style.bottom = _baseGeo.height * currentPos.y + _baseGeo.bottom + "px"
                refFly.current.style.transition = '1.2s ease-in-out'
            }

            changePos();
        }, 2000);

        timerList[0] = setTimeout(() => {
            audioList.bodyAudio.play().catch(error => { })
            startRepeatAudio()
        }, 3000);

        return () => {
            clearInterval(timeInterval)
            clearInterval(timeInterval2)
            // clearInterval(timeInterval1)

        }

    }, [])

    function clickFlyFunc() {
        refFly.current.style.pointerEvents = 'none'
        audioList.clickAudio.currentTime = 0

        stopRepeatAudio()

        if (stepCount < 4) {
            switch (stepCount) {
                case 0: timerList[1] = setTimeout(() => {
                    audioList.subBodyAudio.play().catch(error => { });
                    startRepeatAudio()
                }, 1000);
                    audioList.bodyAudio.pause();

                    setRepeatAudio(audioList.subBodyAudio)
                    clearTimeout(timerList[0])

                    break;
                case 1: audioList.subBodyAudio.pause(); clearTimeout(timerList[1]); audioList.wordAudio1.play().catch(error => { }); break;
                case 2: audioList.wordAudio2.play().catch(error => { }); break;
                case 3: audioList.wordAudio3.play().catch(error => { }); break;
                default:
                    break;
            }

            if (stepCount > 0)
                startRepeatAudio()
            currentPos = posFlyList[stepCount]

            refFly.current.style.transition = [0.7, 1.3, 0.7, 1.3][stepCount] + 's ease-in-out'

            if (stepCount == 2) {
                refLetterList[stepCount - 1].current.style.pointerEvents = 'none'
                setTimeout(() => {
                    setTimeout(() => {
                        for (let i = 0; i < 7; i++) {
                            characterList[i].current.setStyle([
                                { key: 'transform', value: 'rotateY(180deg)' },
                                { key: 'left', value: '0%' }
                            ])

                            characterList1[i].current.setStyle([
                                { key: 'transform', value: 'rotateY(180deg)' },
                                { key: 'left', value: '0%' }
                            ])

                            // eyeList[i].current.setStyle([
                            //     { key: 'transform', value: 'rotateY(180deg)' },
                            //     { key: 'left', value: '38.9%' }
                            // ])
                        }
                    }, 300);

                    currentPos.y = 0.7;
                    currentPos.x = 0.63;
                    changePos();

                    setTimeout(() => {
                        refLetterList[stepCount].current.className = 'show'
                        currentPos.x = 0.55
                        currentPos.y = 0.37
                        changePos();
                        stepCount++;
                        refLetterList[stepCount - 2].current.style.pointerEvents = 'none'
                        showingLetterList[stepCount - 2].current.className = 'bluehalf'
                    }, 700);
                }, 2400);

            }
            else {
                setTimeout(() => {
                    if (stepCount > 3)
                        stepCount = 3
                    refLetterList[stepCount].current.className = 'show'
                    changePos();

                    stepCount++;

                    if (stepCount > 1) {
                        refLetterList[stepCount - 2].current.style.pointerEvents = 'none'
                        showingLetterList[stepCount - 2].current.className = 'bluehalf'
                    }
                    if (stepCount == 4) {
                        setTimeout(() => {
                            for (let i = 0; i < 7; i++) {
                                characterList[i].current.setStyle([
                                    { key: 'transform', value: 'rotateY(0deg)' },
                                    { key: 'left', value: '0%' }
                                ])

                                characterList1[i].current.setStyle([
                                    { key: 'transform', value: 'rotateY(0deg)' },
                                    { key: 'left', value: '0%' }
                                ])

                                // eyeList[i].current.setStyle([
                                //     { key: 'transform', value: 'rotateY(0deg)' },
                                //     { key: 'left', value: '56.9%' }
                                // ])
                            }

                            currentPos.x = 0.1
                            currentPos.y = 0.39
                            changePos();
                        }, 1000);
                    }
                }, stepCount == 0 ? 0 : 2000);
                if (stepCount > 0)
                    refLetterList[stepCount - 1].current.style.pointerEvents = 'none'
            }
        }
        else {
            audioList.wordAudio4.play().catch(error => { })
            refLetterList[3].current.style.pointerEvents = 'none'
            setTimeout(() => {
                setTimeout(() => {
                    audioList.wordAudio4.play();
                    setTimeout(() => {
                        audioList.wordAudio1.play();
                        setTimeout(() => {
                            audioList.wordAudio3.play();
                            setTimeout(() => {
                                audioList.wordAudio2.play();
                            }, 2000);
                        }, 2000);
                    }, 2000);

                }, 1000);

                showingLetterList[3].current.className = 'bluecomeback scaleText'
                setTimeout(() => {
                    showingLetterList[3].current.className = 'bluecomeback normalText'
                }, 2000);
                refLetterList[3].current.style.pointerEvents = 'none'

                currentPos = posComplexFlyPaths[0]
                refFly.current.style.transition = '0.9s ease-in-out'
                changePos();

                setTimeout(() => {
                    currentPos = posComplexFlyPaths[1]
                    showingLetterList[0].current.className = 'bluecomeback scaleText'
                    setTimeout(() => {
                        showingLetterList[0].current.className = 'bluecomeback normalText'
                    }, 2000);
                    changePos();
                }, 2700);

                setTimeout(() => {
                    currentPos = posComplexFlyPaths[2]
                    showingLetterList[2].current.className = 'bluecomeback scaleText'
                    setTimeout(() => {
                        showingLetterList[2].current.className = 'bluecomeback normalText'
                    }, 2000);
                    changePos();
                }, 4700);
                setTimeout(() => {
                    currentPos = posComplexFlyPaths[3]
                    showingLetterList[1].current.className = 'bluecomeback scaleText'
                    setTimeout(() => {
                        showingLetterList[1].current.className = 'bluecomeback normalText'
                    }, 2000);

                    changePos();
                }, 6700);


                setTimeout(() => {
                    nextFunc();
                }, 12000);
            }, 2500);

        }

    }

    function changePos() {
        if (refFly.current != null) {
            refFly.current.style.left = _baseGeo.left + _baseGeo.width * currentPos.x + "px"
            refFly.current.style.bottom = _baseGeo.height * currentPos.y + _baseGeo.bottom + "px"
        }
    }


    return (
        <div className="aniObject">

            {/* letter  - a */}
            <div
                className="hide" ref={refLetterList[0]}>
                <div
                    style={{
                        position: "fixed", width: _baseGeo.width * 0.125 + "px"
                        , left: _baseGeo.left + _baseGeo.width * 0.34 + "px",
                        bottom: _baseGeo.height * 0.25 + _baseGeo.bottom + "px",
                        opacity: 0.4
                    }}>
                    <img draggable={false} width={"100%"}
                        src={prePathUrl() + "images/sb_51_highlight/sb_51_highlight_1.svg"}
                    />
                </div>
                <div
                    onClick={clickFlyFunc}
                    className="playBtn"
                    style={{
                        position: "fixed", width: _baseGeo.width * 0.13 + "px",
                        height: _baseGeo.width * 0.13 + "px"
                        , left: _baseGeo.left + _baseGeo.width * 0.34 + "px",
                        bottom: _baseGeo.height * 0.28 + _baseGeo.bottom + "px",

                    }}>

                    <div
                        ref={showingLetterList[0]}

                        style={{
                            position: "fixed", width: _baseGeo.width * 0.05 + "px",
                            height: _baseGeo.width * 0.05 + "px"
                            , left: _baseGeo.width * 0.025 + "px",
                            bottom: _baseGeo.height * 0.09 + "px",
                        }}>

                        <div
                            style={getMaskStyle({ url: 'sb51_text_interactive/artboard_5', scale: 250 })}
                        >
                        </div>
                    </div>
                </div>
            </div>


            {/* letter - the */}
            <div

                className="hide" ref={refLetterList[1]}>
                <div

                    style={{
                        position: "fixed", width: _baseGeo.width * 0.123 + "px"
                        , left: _baseGeo.left + _baseGeo.width * 0.722 + "px",
                        bottom: _baseGeo.height * 0.287 + _baseGeo.bottom + "px",
                        opacity: 0.4
                    }}>
                    <img draggable={false} width={"100%"}
                        src={prePathUrl() + "images/sb_51_highlight/sb_51_highlight_1.svg"}
                    />
                </div>
                <div
                    style={{
                        position: "fixed", width: _baseGeo.width * 0.13 + "px"
                        , height: _baseGeo.width * 0.13 + "px"
                        , left: _baseGeo.left + _baseGeo.width * 0.72 + "px",
                        bottom: _baseGeo.height * 0.32 + _baseGeo.bottom + "px",

                    }}>
                    <div
                        ref={showingLetterList[1]}

                        onClick={clickFlyFunc}
                        className="playBtn"
                        style={{
                            position: "fixed", width: _baseGeo.width * 0.08 + "px"
                            , height: _baseGeo.width * 0.115 + "px"
                            , left: _baseGeo.left + _baseGeo.width * 0.74 + "px",
                            bottom: _baseGeo.height * 0.3 + _baseGeo.bottom + "px",
                        }}>

                        <div
                            style={getMaskStyle({ url: 'sb51_text_interactive/artboard_6', scale: 135 })}
                        >
                        </div>
                    </div>
                </div>
            </div>

            {/* letter - go */}
            <div
                className="hide" ref={refLetterList[2]}>
                <div
                    style={{
                        position: "fixed", width: _baseGeo.width * 0.091 + "px"
                        , left: _baseGeo.left + _baseGeo.width * 0.556 + "px",
                        bottom: _baseGeo.height * 0.165 + _baseGeo.bottom + "px",
                        opacity: 0.4
                    }}>
                    <img draggable={false} width={"100%"}
                        src={prePathUrl() + "images/sb_51_highlight/sb_51_highlight_1.svg"}
                    />
                </div>
                <div
                    onClick={clickFlyFunc}
                    className="playBtn"
                    style={{
                        position: "fixed", width: _baseGeo.width * 0.1 + "px",
                        height: _baseGeo.width * 0.1 + "px"
                        , left: _baseGeo.left + _baseGeo.width * 0.55 + "px",
                        bottom: _baseGeo.height * 0.17 + _baseGeo.bottom + "px",
                    }}>
                    <div
                        ref={showingLetterList[2]}
                        style={{
                            position: "fixed", width: _baseGeo.width * 0.08 + "px",
                            height: _baseGeo.width * 0.1 + "px"
                            , left: _baseGeo.width * 0.005 + "px",
                            bottom: _baseGeo.height * 0.000 + "px",
                        }}>
                        <div
                            style={getMaskStyle({ url: 'sb51_text_interactive/artboard_7', scale: 135 })}
                        >
                        </div>
                    </div>
                </div>
            </div>

            {/* letter - and */}
            <div

                className="hide" ref={refLetterList[3]}>
                <div
                    style={{
                        position: "fixed", width: _baseGeo.width * 0.09 + "px"
                        , left: _baseGeo.left + _baseGeo.width * 0.158 + "px",
                        bottom: _baseGeo.height * 0.179 + _baseGeo.bottom + "px",
                        opacity: 0.4
                    }}>
                    <img draggable={false} width={"100%"}
                        src={prePathUrl() + "images/sb_51_highlight/sb_51_highlight_1.svg"}
                    />
                </div>
                <div

                    onClick={clickFlyFunc}
                    className="playBtn"
                    style={{
                        position: "fixed", width: _baseGeo.width * 0.1 + "px",
                        height: _baseGeo.width * 0.1 + "px"
                        , left: _baseGeo.left + _baseGeo.width * 0.153 + "px",
                        bottom: _baseGeo.height * 0.2 + _baseGeo.bottom + "px",
                    }}>

                    <div
                        ref={showingLetterList[3]}

                        style={{
                            position: "fixed", width: _baseGeo.width * 0.08 + "px",
                            height: _baseGeo.width * 0.08 + "px"
                            , left: _baseGeo.width * 0.005 + "px",
                            bottom: _baseGeo.height * 0.03 + "px",
                        }}>
                        <div
                            style={getMaskStyle({ url: 'sb51_text_interactive/artboard_8', scale: 125 })}
                        >
                        </div>
                    </div>

                </div>
            </div>

            {/* Fly */}
            <div
                onClick={clickFlyFunc}

                ref={refFly} style={{
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




            </div>





        </div>
    );
}
