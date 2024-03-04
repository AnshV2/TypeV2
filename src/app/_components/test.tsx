'use client'

import styles from "./index.module.css";

import {simple} from '../WordBank.js'
const chigiri = '/chigiri.png'
const arrow = '/arrow.png'
import React, { useState , useEffect, useRef} from "react"
import { api } from "~/trpc/react";
import {
  useUser,
} from "@clerk/nextjs";
import { v4 as uuidv4 } from 'uuid';
uuidv4();
import CheckIcon from '@mui/icons-material/Check';
import { motion } from "framer-motion"


function InputBox({states = [[""]], setStateArray, setWordList, wordList = [[""]], refs, setTestWPM, setTestCC, setTestWC, setTestAcc, training}: {
  states: string[][], setStateArray: React.Dispatch<React.SetStateAction<string[][]>>, setWordList: React.Dispatch<React.SetStateAction<string[][]>>, wordList: string[][], 
  refs:React.MutableRefObject<HTMLSpanElement[]>, setTestWPM: React.Dispatch<React.SetStateAction<number>>, setTestCC: React.Dispatch<React.SetStateAction<number>>, 
  setTestWC: React.Dispatch<React.SetStateAction<number>>, setTestAcc: React.Dispatch<React.SetStateAction<number>>, training:boolean,
}) {
  const [word, upWord] = useState(0);
  const [char, upChar] = useState(0);
  const[last, upLast] = useState("");
  const[time, upTime] = useState(30);
  const finalTime = 30;
  const[running, upRunning] = useState(false)
  const[wpm, upWpm] = useState(0);
  const barRef = useRef<HTMLInputElement>(null);
  const user = useUser()
  const func = api.post.postTest.useMutation().mutate;

  function updateWpm() {
    let fillerCor = 0;
    let fillerIncor = 0;
    for (let i = 0; i < states.length; i++) {
      const stateHolder = states[i]?? "";
      for (let j = 0; j < stateHolder.length; j++) {
        if (stateHolder[j] === "CharCorrect") {
          fillerCor++;
        }
        else if(stateHolder[j] === "CharIncorrect") {
          fillerIncor++;
        }
      }
    }
    upWpm(Math.round(fillerCor / 5 / ((finalTime - time) / 60)))
  }

  function getWPM() {
    let fillerCor = 0;
    let fillerIncor = 0;
    for (let i = 0; i < states.length; i++) {
      const stateHolder = states[i]?? "";
      for (let j = 0; j < stateHolder.length; j++) {
        if (stateHolder[j] === "CharCorrect") {
          fillerCor++;
        }
        else if(stateHolder[j] === "CharWrong") {
          fillerIncor++;
        }
      }
    }
    return ({cor: fillerCor, incor: fillerIncor, WPM: Math.round(fillerCor / 5 / ((finalTime - time) / 60))})
  }

  useEffect(() => {
    if (time != 0 && running === true) {
      updateWpm()
      setTimeout(() => upTime(prev => prev - 1), 1000)
    }
    else if (time == 0 && running == true) {
      //where test ends
      upRunning(false)
      if (barRef.current != undefined) {barRef.current.readOnly = true}
      updateWpm()
      const stats = getWPM()
      setTestCC(stats.cor)
      setTestWC(stats.incor)
      setTestWPM(stats.WPM)
      const acc = Math.round(stats.cor / (stats.cor + stats.incor) * 100)
      setTestAcc(acc)
      if (user.isSignedIn && !training && user.user?.id != undefined) { 
        func({user: user.user.id , wpm: stats.WPM, wc: stats.incor, cc: stats.cor})
      }
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
    let fillthing = "";
    for (let i = 0; i < wordList.length; i++) {
      const wordListHolder = wordList[i]?? [];
      for (let j = 0; j < wordListHolder.length; j++) {
        fillthing += (wordListHolder[j]);
      }
    }
    if (running == false) {
      setTimeout(() => upTime(prev => prev - 1), 1000)
      upRunning(true)
    }
    const letter = (event.target.value[event.target.value.length - 1]);
    if (letter == " ") {
      if (event.target.value.length == 1) {
        event.target.value = "";
      }
      else {
        (refs.current[word] as HTMLSpanElement).className = "wordBorder";
        
        let check = true;
        for (let i = 0; i < event.target.value.length - 1; i++) {
          if (event.target.value[i] != (wordList[word]?? [])[i]) {
            check = false;
          }
        }
        if (event.target.value.length != (wordList[word]?? []).length) {check = false;}
        if (check === true) {
          for (let i = 0; i < (wordList[word]?? []).length; i++) {updateState(word, i, "CharCorrect")}
        }
        else {
          for (let i = 0; i < (wordList[word]?? "").length; i++) {updateState(word, i, "CharWrong")}
        }
        if ((refs.current[word] as HTMLSpanElement).getBoundingClientRect().top != (refs.current[word + 1] as HTMLSpanElement).getBoundingClientRect().top) {
          for (let i = 0 ; i < states.length; i++) {
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
        for (let i = 0; i < (wordList[word]?? "").length; i++) {updateState(word, i, "CharWrong")}
      }
      else {
        let check = true;
        for (let i = 0; i < event.target.value.length; i++) {
          if (event.target.value[i] != (wordList[word]?? "")[i]) {
            check = false;
          }
        }
        if (check === false) {
          for (let i = 0; i < (wordList[word]?? "").length; i++) {updateState(word, i, "CharWrong")}
        }
        else {
          for (let i = 0; i < (wordList[word]?? "").length; i++) {updateState(word, i, "CharStart")}
        }
      }
    }
  }

  useEffect(() => {

    const handleKeyDown = (event: KeyboardEvent) => {
      // Check if Ctrl key is pressed and Space key is pressed
      if (event.ctrlKey && event.key === 'r') {
        event.preventDefault(); // Prevent default browser behavior
        // Your custom logic here
        for (let i = 0 ; i < states.length; i++) {
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
        upWpm(0);
      }
    };

    // Attach the event listener when the component mounts
    window.addEventListener('keydown', handleKeyDown);

    // Remove the event listener when the component unmounts
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };

    (barRef.current as HTMLInputElement).focus();
    (refs.current[0] as HTMLSpanElement).className = "wordCurrent";
  }, [])
  return (
    <div className = "inputStuff"> 
      <input onChange={typed} ref={barRef} className="box" />

      <div className = "InputUtilities">
        <span className = "wpm">
          <span>{wpm} </span>
          <span className='wpmtext'>WPM</span>
        </span>
        <div className = "seperator"></div>
        <span className = 'time'>0:{time}</span>
        <div className = "seperator"></div>
        <button onClick = {() => {
          for (let i = 0 ; i < states.length; i++) {
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
  const newList = word.map((item, index) => <Char key = {index} word = {item} state = {states[index]} />)
  return newList;
}


function WordList({wordList = [[""]], states = [[""]], refs}: {
  wordList: string[][], states: string[][], refs:React.MutableRefObject<HTMLSpanElement[]>
}) {
  const refHolder:(HTMLSpanElement | null)[] = refs.current;
  const newList = wordList.map((item, index) => <span className='wordBorder' key = {index} ref = {el => refHolder[index] = el} ><Word word = {item} states = {states[index]}/></span>)
  return newList;
}



function generate(fillerArr: string[][], fillerwords: string[][]) {
  const wordList: string[] = [];
  fillerArr.length = 0;
  fillerwords.length = 0;
  for (let i = 0; i < 150; i++) {
    let rand = Math.random();
    rand = Math.floor(rand * 1000);
    wordList.push(simple[rand] + " ")
  }
  for (let i = 0; i < wordList.length; i++) {
    const filler = [];
    const word = wordList[i]?? ""
    for (let j = 0; j < word.length; j++) {
      filler.push("CharStart");
    }
    fillerArr.push(filler);
  }
  for (let i = 0; i < wordList.length; i++) {
    const fillerWordsTwo = []
    const word = wordList[i]?? ""
    for (let j = 0; j < word.length; j++) {
      const char = word[j] ?? ""
      fillerWordsTwo.push(char)
    }
    fillerwords.push(fillerWordsTwo);
  }
}

function reset(setStateArray: Function, setWordList: Function) {
  const fillerArr: string[][] = [];
  const fillerWords: string[][] = [];
  generate(fillerArr, fillerWords)
  setStateArray(fillerArr);
  setWordList(fillerWords);
}

export default function Test({fillerArr = [[""]], fillerWords = [[""]]}: {fillerArr: string[][], fillerWords: string[][]}) {
  const [stateArray, setStateArray] = useState(fillerArr);
  const [fillerwordList, setWordList] = useState(fillerWords);
  const refs = useRef<HTMLSpanElement[]>([]);

  const [testWPM, setTestWPM] = useState(0);
  const [testCC, setTestCC] = useState(0);
  const [testWC, setTestWC] = useState(0);
  const [testAcc, setTestAcc] = useState(0);
  const [training, setTraining] = useState(false);

  return (
    <motion.div className = "test" initial={{ opacity: 0, translateY: 50, }} 
    animate={{ opacity: 1, translateY: 0, transition: { duration: 0.5} }}>
      <div className = "textBorderOutline">
        <div className= 'textBorder'>
          <WordList wordList = {fillerwordList} states = {stateArray} refs = {refs} />
        </div>
      </div>
      <InputBox wordList = {fillerwordList} states = {stateArray} setStateArray = {setStateArray} setWordList={setWordList} refs = {refs} setTestWPM = {setTestWPM} 
                setTestAcc={setTestAcc} setTestCC={setTestCC} setTestWC={setTestWC} training = {training}/>
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
          <div className = "settingItem">
            <div className="settingBox " onClick={() => {setTraining(!training)}}>{training && <CheckIcon htmlColor="#27D796"/>}</div>
            <div>Training Mode</div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

