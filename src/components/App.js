
import React, { useState, useEffect, useRef, useContext } from 'react';

import Scene1 from "../Scenes/scene1";
import Scene2 from "../Scenes/scene2";
import Scene3 from "../Scenes/scene3";
import Scene4 from "../Scenes/scene4";
import Scene5 from "../Scenes/scene5";
import Scene6 from "../Scenes/scene6";
import Scene7 from "../Scenes/scene7";
import Scene8 from "../Scenes/scene8";
import Scene16 from "../Scenes/scene16";

import { MusicButton } from './CommonButtons';

const Switch = props => {
  const { test, children } = props
  // filter out only children with a matching prop
  return children.find(child => {
    return child.props.value === test
  })
}

var __geo;
var backgroundImageIndex = 0;

var completedCount = 0;
var clickedRoomNum = -1;
var isOneStepFinished = true;
var completedList = []

var backgroundImageList = [
  "sb_51_intro_bg_01", //1
  "sb_51_bg__1",//2
  "sb_51_bg__2",//3 

  "sb_51_bg__3",//4
  "sb_51_bg__4",//5

  "excellentbg", //6

  "sb_51_bg__6", //7
  "sb_51_bg__7", // 8

  "excellentbg"  //16
];


import { UserContext } from "./BaseShot";

const App = React.forwardRef(({ geo, _setBackground, _startTransition, baseGeo, _isBackloaded }, ref) => {

  const audioList = useContext(UserContext)

  const [index, setIndex] = useState(0);

  const refScene1 = useRef();
  const musicRef = useRef();

  __geo = geo;

  useEffect(
    () => {
      musicRef.current.className = 'hideObject'
      return () => {
      }
    }, []
  )

  // 1 - center center, 2 - center bottom , 3-left center ,  4 - left bottom, 5 - left top
  const transitionSceneList = []
  const centerBottomBackList = [3, 7, 11, 13, 14]
  const centerTopBackList = [4]
  const leftTopBackList = []
  const leftBottomBackList = []

  function changeBackgroundImage(judgeNum) {
    let sendNum = -1;
    if (judgeNum == 0)
      sendNum = 0;
    if (transitionSceneList.includes(judgeNum))
      sendNum = 1;    //mean - transition
    if (judgeNum != backgroundImageIndex) {
      backgroundImageIndex = judgeNum;

      let backState = 1;
      if (centerBottomBackList.includes(judgeNum))
        backState = 2
      else if (leftTopBackList.includes(judgeNum))
        backState = 5;
      else if (leftBottomBackList.includes(judgeNum))
        backState = 4;
      else if (centerTopBackList.includes(judgeNum))
        backState = 6;

      _setBackground(backgroundImageList[judgeNum], sendNum, backState);
    }
  }

  function setFomart(judgeNum) {
    if (judgeNum == 1 && musicRef.current.className == 'hideObject') {
      setTimeout(() => {
        musicRef.current.className = 'introText'
      }, 500);

      setTimeout(() => {
        musicRef.current.className = 'commonButton'
      }, 1500);
    }

    setIndex(judgeNum);
    changeBackgroundImage(judgeNum);
  }



  function nextFunc() {
    setFomart(index + 1);
  }


  function goHome() {
    musicRef.current.className = 'hideObject'

    audioList.backAudio.pause();
    audioList.backAudio.currentTime = 0

    completedCount = 0;
    isOneStepFinished = true;
    completedList = []
    setFomart(0);


    clickedRoomNum = -1;

  }


  function setGameRoomNum(num) {
    setFomart(num)

    if (num == 3)
      clickedRoomNum = 1;
    else if (num == 6)
      clickedRoomNum = 2;
    else if (num == 11)
      clickedRoomNum = 3;
    else
      clickedRoomNum = 4;

  }

  function goNextStep(judgeNum) {
    if (judgeNum == 0) {
      if (clickedRoomNum == -1 || isOneStepFinished)
        setFomart(2)
      else if (clickedRoomNum == 1 && !isOneStepFinished)
        setFomart(4)
      else if (clickedRoomNum == 2 && !isOneStepFinished)
        setFomart(7)
    }

    else {
      if (clickedRoomNum == -1 || isOneStepFinished)
        setFomart(10)
      else if (clickedRoomNum == 3 && !isOneStepFinished)
        setFomart(12)
      else if (clickedRoomNum == 4 && !isOneStepFinished)
        setFomart(14)
    }
  }

  return (
    <div >
      <div className={_isBackloaded ? '' : 'hide'}>
        <Switch test={index}>
          <Scene1 key={0} ref={refScene1} nextFunc={nextFunc} _baseGeo={baseGeo} _geo={__geo} value={0} />
          <Scene2 key={1} nextFunc={() => { goNextStep(0) }} _baseGeo={baseGeo} _geo={__geo} value={1}
            isOneStepFinished={isOneStepFinished} completedCount={completedList.length} />
          <Scene3 key={2} nextFunc={setGameRoomNum} _baseGeo={baseGeo} startTransition={_startTransition} _geo={__geo} value={2} _clickedRoomNum={clickedRoomNum} />

          <Scene4 key={3} nextFunc={() => { isOneStepFinished = false; setFomart(4); }} _baseGeo={baseGeo} startTransition={_startTransition} _geo={__geo} value={3} />
          <Scene5 key={4} nextFunc={() => {
            if (!completedList.includes(clickedRoomNum))
              completedList.push(clickedRoomNum)
            isOneStepFinished = true;
            if (completedList.length < 2)
              setFomart(5);
            else
              setFomart(8);
          }} _baseGeo={baseGeo} startTransition={_startTransition} _geo={__geo} value={4} />

          {/* excellent */}
          <Scene6 key={5} _baseGeo={baseGeo} nextFunc={() => {
            if (completedList.length == 1)
              setFomart(2)
            if (completedList.length == 2) {
              setFomart(8)
              clickedRoomNum = -1
              isOneStepFinished = true;
            }
          }} startTransition={_startTransition} _geo={__geo} value={5} />

          <Scene7 key={6} nextFunc={() => { isOneStepFinished = false; setFomart(7); }} _baseGeo={baseGeo} _geo={__geo} value={6} />
          <Scene8 key={7} nextFunc={() => {
            if (!completedList.includes(clickedRoomNum))
              completedList.push(clickedRoomNum)

            isOneStepFinished = true;
            if (completedList.length < 2)
              setFomart(5);
            else
              setFomart(8);
          }}
            _baseGeo={baseGeo} _geo={__geo} value={7} />

          <Scene16 key={8} nextFunc={goHome} _baseGeo={baseGeo} _geo={__geo} value={8} />
        </Switch>
      </div>
      <MusicButton ref={musicRef} _geo={__geo} backAudio={audioList.backAudio} />
    </div >
  );
})

export default App;
