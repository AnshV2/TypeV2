'use client'

import styles from "./index.module.css";

import {simple} from '../WordBank.js'
const chigiri = '/chigiri.png'
const arrow = '/arrow.png'
import React, { useState , useEffect, useRef} from "react"

function InputBox({states = [[""]], setStateArray, setWordList, wordList = [[""]], refs = useRef<HTMLSpanElement[]>([])}: {
  states: string[][], setStateArray: React.Dispatch<React.SetStateAction<string[][]>>, setWordList: React.Dispatch<React.SetStateAction<string[][]>>, wordList: string[][], refs:React.MutableRefObject<HTMLSpanElement[]>
}) {
  const [word, upWord] = useState(0);
  const [char, upChar] = useState(0);
  const[last, upLast] = useState("");
  const[time, upTime] = useState(30);
  const finalTime = 30;
  const[running, upRunning] = useState(false)
  const[wpm, upWpm] = useState(0);
  var barRef = useRef<HTMLInputElement>();

  function updateWpm() {
    var filler = 0;
    for (var i = 0; i < states.length; i++) {
      let stateHolder = states[i]?? "";
      for (var j = 0; j < stateHolder.length; j++) {
        if (stateHolder[j] === "CharCorrect") {
          filler++;
        }
      }
    }
    filler += word;
    upWpm(Math.round(filler / 5 / ((finalTime - time) / 60)))
  }

  useEffect(() => {
    if (time != 0 && running === true) {
      updateWpm()
      setTimeout(() => upTime(prev => prev - 1), 1000)
    }
    else if (time == 0 && running == true) {
      //test finishes here
      upRunning(false)
      if (barRef.current != undefined) {barRef.current.readOnly = true}
      updateWpm()
    }
    else if (running == false) {
      upTime(finalTime)
    }
  }, [time])

  function updateState(word = 0, char = 0, classname = "") {
    setStateArray((prev: any) => {
      const newArray = [...prev]; // Shallow copy of the outer array
      if (newArray[word]) {
        newArray[word] = [...newArray[word]]; // Shallow copy of the inner array
        if (newArray[word][char]) {
          newArray[word][char] = classname; // Update the specific element
        }
      }
      return newArray;
    });
  }

  function typed(event: { target: { value: string | any[]; }; }) {
    var fillthing = "";
    for (var i = 0; i < wordList.length; i++) {
      let wordListHolder = wordList[i]?? [];
      for (var j = 0; j < wordListHolder.length; j++) {
        fillthing += (wordListHolder[j]);
      }
    }
    if (running == false) {
      setTimeout(() => upTime(prev => prev - 1), 1000)
      upRunning(true)
    }
    var letter = (event.target.value[event.target.value.length - 1]);
    if (letter == " ") {
      if (event.target.value.length == 1) {
        event.target.value = "";
      }
      else {
        console.log(event.target.value.length);
        (refs.current[word] as HTMLSpanElement).className = "wordBorder";
        
        var check = true;
        for (var i = 0; i < event.target.value.length - 1; i++) {
          if (event.target.value[i] != (wordList[word]?? [])[i]) {
            check = false;
          }
        }
        if (event.target.value.length != (wordList[word]?? []).length) {check = false;}
        if (check === true) {
          for (var i = 0; i < (wordList[word]?? []).length; i++) {updateState(word, i, "CharCorrect")}
        }
        else {
          for (var i = 0; i < (wordList[word]?? "").length; i++) {updateState(word, i, "CharWrong")}
        }
        if ((refs.current[word] as HTMLSpanElement).getBoundingClientRect().top != (refs.current[word + 1] as HTMLSpanElement).getBoundingClientRect().top) {
          for (var i = 0 ; i < states.length; i++) {
            if ((refs.current[i] as HTMLSpanElement).getBoundingClientRect().top <= (refs.current[word] as HTMLSpanElement).getBoundingClientRect().top) {
              (refs.current[i] as HTMLSpanElement).className = "wordDisappear"
            }
          }
        }
        upWord(prev => prev + 1)
        upChar(0);
        upLast("");
        event.target.value = "";
        (refs.current[word + 1] as HTMLSpanElement).className = "wordCurrent";
      }
    }
    else {
      if (event.target.value.length > (wordList[word]?? "").length) {
        for (var i = 0; i < (wordList[word]?? "").length; i++) {updateState(word, i, "CharWrong")}
      }
      else {
        var check = true;
        for (var i = 0; i < event.target.value.length; i++) {
          if (event.target.value[i] != (wordList[word]?? "")[i]) {
            check = false;
          }
        }
        if (check === false) {
          for (var i = 0; i < (wordList[word]?? "").length; i++) {updateState(word, i, "CharWrong")}
        }
        else {
          for (var i = 0; i < (wordList[word]?? "").length; i++) {updateState(word, i, "CharStart")}
        }
      }
    }
  }

  useEffect(() => {
    (barRef.current as HTMLInputElement).focus();
    (refs.current[0] as HTMLSpanElement).className = "wordCurrent";
  }, [])
  return (
    <div className = "inputStuff"> 
      <input onChange={typed} ref={barRef ? (inputElement: HTMLInputElement | null) => {if (inputElement) barRef.current = inputElement} : undefined} className="box" />
      <div className = "InputUtilities">
        <span className = "wpm">
          <span>{wpm} </span>
          <span className='wpmtext'>WPM</span>
        </span>
        <div className = "seperator"></div>
        <span className = 'time'>0:{time}</span>
        <div className = "seperator"></div>
        <button onClick = {() => {
          for (var i = 0 ; i < states.length; i++) {
            (refs.current[i] as HTMLSpanElement).className = "wordBorder";
          }
          (barRef.current as HTMLInputElement).value = "";
          upChar(0);
          upWord(0);
          upRunning(false)
          upTime(finalTime)
          upLast("");
          reset(setStateArray, setWordList);
          (barRef.current as HTMLInputElement).readOnly = false;
          (barRef.current as HTMLInputElement).focus();
        }} className='reset'><img src = {arrow} className = 'arrow'></img>
        </button>
      </div>
    </div>
  )
}

function Char({word = "", state = ""}) {
  return <span className = {state} >{word}</span>;
}

function Word({word = [""], states = [""]}) {
  const newList = word.map((item, index) => <Char word = {item} state = {states[index]} />)
  return newList;
}


function WordList({wordList = [[""]], states = [[""]], refs = useRef<HTMLSpanElement[]>([])}) {
  let refHolder:(HTMLSpanElement | null)[] = refs.current;
  const newList = wordList.map((item, index) => <span  className='wordBorder' ref = {el => refHolder[index] = el} ><Word word = {item} states = {states[index]}/></span>)
  return newList;
}



function generate(fillerArr: string[][], fillerwords: string[][]) {
  var wordList: string[];
  wordList = []
  fillerArr.length = 0;
  fillerwords.length = 0;
  for (let i = 0; i < 150; i++) {
    var rand = Math.random();
    rand = Math.floor(rand * 1000);
    wordList.push(simple[rand] + " ")
  }
  for (let i = 0; i < wordList.length; i++) {
    var filler = [];
    let word = wordList[i]?? ""
    for (let j = 0; j < word.length; j++) {
      filler.push("CharStart");
    }
    fillerArr.push(filler);
  }
  for (var i = 0; i < wordList.length; i++) {
    var fillerWordsTwo = []
    let word = wordList[i]?? ""
    for (var j = 0; j < word.length; j++) {
      let char = word[j] ?? ""
      fillerWordsTwo.push(char)
    }
    fillerwords.push(fillerWordsTwo);
  }
}

function reset(setStateArray: Function, setWordList: Function) {
  var fillerArr: string[][];
  fillerArr = [];
  var fillerWords: string[][];
  fillerWords = []
  generate(fillerArr, fillerWords)
  setStateArray(fillerArr);
  setWordList(fillerWords);
}

export default function Test({fillerArr = [[""]], fillerWords = [[""]]}) {
  const [stateArray, setStateArray] = useState(fillerArr);
  const [fillerwordList, setWordList] = useState(fillerWords);
  const refs = useRef<HTMLSpanElement[]>([]);

  const [testWPM, setTestWPM] = useState(0);
  const [testCC, setTestCC] = useState(0);
  const [testWC, setTestWC] = useState(0);
  const [testAcc, setTestAcc] = useState(0);

  return (
    <div className = "test">
      <div className = "textBorderOutline">
        <div className= 'textBorder'>
          <WordList wordList = {fillerwordList} states = {stateArray} refs = {refs} />
        </div>
      </div>
      <InputBox wordList = {fillerwordList} states = {stateArray} setStateArray = {setStateArray} setWordList={setWordList} refs = {refs}/>
      <div className="userService">
        <div className = "session">

        </div>
        <div className = "recentTest">
          <div className = "recentWPM">{testWPM} WPM</div>
          <div className = "recentCC">{testCC} CC</div>
          <div className = "recentWC">{testWC} WC</div>
          <div className = "recentACC">{testAcc}% ACC</div>
        </div>
        <div className = "settings">

        </div>
      </div>
    </div>
  );
}
