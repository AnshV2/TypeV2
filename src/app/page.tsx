'use client'

import { unstable_noStore as noStore } from "next/cache";
import Link from "next/link";

import { useRouter } from 'next/navigation'

import { api } from "~/trpc/react";
import styles from "./index.module.css";

import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
  SignIn, 
  useUser,
} from "@clerk/nextjs";


import {simple} from './WordBank.js'
const chigiri = '/chigiri.png'
const arrow = '/arrow.png'

import dynamic from 'next/dynamic'
const Test = dynamic(() => import("./_components/test"), { ssr: false })


function generate(fillerArr: string[][], fillerwords: string[][]) {
  let wordList: string[];
  wordList = []
  fillerArr.length = 0;
  fillerwords.length = 0;
  for (let i = 0; i < 150; i++) {
    let rand = Math.random();
    rand = Math.floor(rand * 1000);
    wordList.push(simple[rand] + " ")
  }
  for (let i = 0; i < wordList.length; i++) {
    let filler = [];
    let word = wordList[i]?? ""
    for (let j = 0; j < word.length; j++) {
      filler.push("CharStart");
    }
    fillerArr.push(filler);
  }
  for (let i = 0; i < wordList.length; i++) {
    let fillerWordsTwo = []
    let word = wordList[i]?? ""
    for (let j = 0; j < word.length; j++) {
      let char = word[j] ?? ""
      fillerWordsTwo.push(char)
    }
    fillerwords.push(fillerWordsTwo);
  }
}


export default function App() {
  noStore();
  const router = useRouter()

  let fillerArr: string[][];
  fillerArr = [];
  let fillerWordList : string[][];
  fillerWordList = [];
  generate(fillerArr, fillerWordList)

  const user = useUser()

  return (
    <div className = 'App' suppressHydrationWarning={true}>
      <div className = "about">About</div>
      <div className = "user">
        <SignedIn>
          {/* Mount the UserButton component */}
          <div className = "signin" onClick={() => router.push('/profile')}>{user.user?.username}</div>
        </SignedIn>
        <SignedOut>
          {/* Signed out users get sign in button */}
          <Link href = "/signin"><div className = "signin"> Sign in </div></Link>
        </SignedOut>
      </div>
      <img src = {chigiri} className='chigiri'></img>
      <Test  fillerArr = {fillerArr} fillerWords = {fillerWordList} />
    </div>
  );
}