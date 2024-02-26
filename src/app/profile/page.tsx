'use client'


import { useClerk } from "@clerk/clerk-react";
import { useRouter } from 'next/navigation'
import { api } from "~/trpc/react";
import {
  useUser,
} from "@clerk/nextjs";
import Link from "next/link"; 





export default function Signin() {
  const user = useUser()
  const test = api.post.getTest.useQuery({user: user.user?.id?? ""}).data
  const router = useRouter()
  const { signOut } = useClerk();

  let bestTest = {wpm: 0, cc: 0, wc: 0}
  let avgWPM = 0
  let avgACC = 0
  let testCount = 0

  if (test) {
    let index = 0;
    testCount = test?.length
    for (let i = 0; i < test?.length; i++){
      const one = test[i]?.wpm
      const two = test[index]?.wpm
      const cc = test[i]?.cc
      const wc = test[i]?.wc
      avgACC += Math.round(cc??0 / (cc??0 + (wc??0)) * 100)
      avgWPM += one?? 0;
      if (one && two) {
        if ( one > two) {
          index = i
        }
      }
    }
    avgWPM = Math.round(avgWPM / testCount);
    avgACC = Math.round(avgACC / testCount);
    bestTest = test[index]?? {wpm: 0, cc: 0, wc: 0}
  }

  return (
    <>
      
      <div className="userAVGWPM">
        <div className="userAVGWPMText">{avgWPM} WPM</div>
        <div>Average test wpm</div>
      </div>
      <div className="userAVGACC">
        <div className="userAVGWPMText">{avgACC}%</div>
        <div>Average test accuracy</div>
      </div>
      <div className="userCount">
        <div className="userAVGWPMText">{testCount}</div>
        <div>Number of Tests Taken</div>
      </div>
      <div className="tests">
        <div className="firstRow">
          <div className="typeOne">WPM</div>
          <div className="typeTwo">ACC</div>
          <div className="typeThree">CC</div>
          <div className="typeFour">WC</div>
          <div className="typeFive">DATE</div>
        </div>
        {test?.map((e) => {return (
          <div className="testRow">
          <div className="typeFiller">{e.wpm} wpm</div>
          <div className="typeFillerTwo"> {Math.round(e.cc / (e.cc + e.wc) * 100)}%</div>
          <div className="typeFiller"> {e.cc}</div>
          <div className="typeFillerTwo"> {e.wc}</div>
          <div className="typeFiller"> {e.time.getFullYear()} - {e.time.getMonth()} - {e.time.getDay()}</div>
        </div>
        )})}
      </div>
      <div className="pb">Personal Best</div>
      <div className = "pbTest">
        <div className = "recentWPM">{bestTest.wpm} WPM</div>
        <div className = "recentCC">{bestTest.cc} CC</div>
        <div className = "recentWC">{bestTest.wc} WC</div>
        <div className = "recentACC">{Math.round(bestTest.cc / (bestTest.cc + bestTest.wc) * 100)}% ACC</div>
      </div>

      <div className="profileContainer">
        <div className="username">{user.user?.username}</div>
        <div className="testRoute" onClick={() => router.push('/')}>Test</div>
        <div className="about2">About</div>
        <div className="signOut" onClick={() => signOut(() => router.push("/"))}>Log Out</div>
      </div>
    </>
  );
}