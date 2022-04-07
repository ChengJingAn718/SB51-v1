import "../stylesheets/styles.css";
import { useContext, useEffect, useState } from "react";
import BaseImage from "../components/BaseImage";
import { prePathUrl } from "../components/CommonFunctions"
import { UserContext } from "../components/BaseShot";

export default function Scene3({ _geo, startTransition, nextFunc, _clickedRoomNum }) {

    const audioList = useContext(UserContext)

    function goNextFunc(num) {
        startTransition(num % 2)
        audioList.bodyAudio.pause();
        setTimeout(() => {
            audioList.wooAudio.play().catch(error => { })
        }, 300);
        setTimeout(() => {
            nextFunc(num);
        }, 600);
    }

    useEffect(() => {
        audioList.bodyAudio.src = prePathUrl() + "sounds/ep_51_audio_03.mp3"
        let timer = setTimeout(() => {
            audioList.bodyAudio.play().catch(error => { })
        }, 1500);

        return () => {
            audioList.bodyAudio.pause();
            clearTimeout(timer)
        }

    }, [])

    return (
        <div className="aniObject">
            <div


                style={{
                    position: "fixed", width: _geo.width * 0.55 + "px",
                    height: _geo.height * 0.5 + 'px'
                    , left: _geo.left + _geo.width * 0.1 + "px",
                    bottom: _geo.top + _geo.height * 0.45 + "px",
                }}>
                <div
                    onClick={() => { goNextFunc(3) }}
                    className="commonButton"
                    style={{
                        position: 'absolute', width: _geo.width * 0.33 + 'px',
                        height: _geo.width * 0.33 + 'px', left: '0%', top: '20%',
                        borderRadius: '50%',
                    }}>
                    <BaseImage scale={1}
                        posInfo={{ l: 0.0, t: -0.105 }}
                        url={"sb_51_icons/sb_51_icons.svg"}
                    />
                </div>
                <BaseImage scale={0.25}
                    posInfo={{ l: 0.18, t: 1.3 }}
                    url={"sb51_text_interactive/artboard_17.svg"}
                    style={{ cursor: 'pointer' }}
                />
            </div>
            <div
                style={{
                    position: "fixed", width: _geo.width * 0.55 + "px",
                    height: _geo.height * 0.5 + 'px'
                    , left: _geo.left + _geo.width * 0.55 + "px",
                    bottom: _geo.top + _geo.height * 0.45 + "px",
                }}

            >

                <div
                    onClick={() => {
                        setTimeout(() => {
                            goNextFunc(6)
                        }, 150);
                    }}
                    className="commonButton"
                    style={{
                        position: 'absolute', width: _geo.width * 0.33 + 'px',
                        height: _geo.width * 0.33 + 'px', left: '0%', top: '20%',
                        borderRadius: '50%',
                    }}>
                    <BaseImage scale={1}
                        posInfo={{ l: 0.0, t: -0.105 }}
                        url={"sb_51_icons/sb_51_icons_1.svg"}
                    />
                </div>
                <BaseImage scale={0.5}

                    posInfo={{ l: 0.05, t: 1.32 }}
                    style={{ cursor: 'pointer' }}
                    url={"sb51_text_interactive/artboard_18.svg"}
                />
            </div>
        </div >
    );
}
