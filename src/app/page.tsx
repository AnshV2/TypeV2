'use client'

import { useRouter } from 'next/navigation'
import { useUser, } from "@clerk/nextjs";
import {simple} from './WordBank.js'
const chigiri = '/chigiri.png'
import dynamic from 'next/dynamic'
import Link from "next/link";
import { useAutoAnimate } from '@formkit/auto-animate/react'
import { motion } from "framer-motion"
import {useRef} from "react"

const Test = dynamic(() => import("./_components/test"), { ssr: false })


function generate(fillerArr: string[][], fillerwords: string[][]) {
  const wordList: string[] = [];
  fillerArr.length = 0;
  fillerwords.length = 0;
  for (let i = 0; i < 150; i++) {
    let rand = Math.random();
    rand = Math.floor(rand * 299);
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


export default function App() {

  const fillerArr: string[][] = [];
  const fillerWordList : string[][] = [];
  generate(fillerArr, fillerWordList)

  const user = useUser()

  return (
    <>
      <img src = {chigiri} className='chigiri'></img>

      {user.isLoaded &&
        <motion.div initial={{ opacity: 0, translateY: 50, x: 0 }} animate={{ opacity: 1, translateY: 0, x: 0, transition: { duration: 0.5 } }}>
          <Link className = "about" href = "/about" prefetch = {false}><div>About</div></Link>
          <div>
            {user.isSignedIn && <Link className = "signin" href = "/profile" prefetch = {false}><div>Profile</div></Link>}
            {!user.isSignedIn && <Link href="/signin" prefetch = {false}><div className = "signin"> Log In </div></Link>}
          </div>
          </motion.div>
      }

      <div className = 'App' suppressHydrationWarning={true} >
        <Test fillerArr={fillerArr} fillerWords={fillerWordList}/>
      </div>


    </>
  );
}

//<img src = {chigiri} className='chigiri'></img>
//initial={{ opacity: 0, translateY: 20, x: 0 }} animate={{ opacity: 1, translateY: 0, x: 0, transition: { duration: 0.5 } }}

