'use client'


import { useClerk } from "@clerk/clerk-react";
import { useRouter } from 'next/navigation'
import { api } from "~/trpc/react";
import {
  useUser,
} from "@clerk/nextjs";
import { motion } from "framer-motion"
import { v4 as uuidv4 } from 'uuid';
uuidv4();



const Feed = () => {
  const {data, isLoading: postsLoading} = api.post.getTest.useQuery()

  if (postsLoading) {
    return (
      <div className="loadContainer">
        <span className="loader"></span>
      </div>
    )
  }
  return (
    <>
    {(data?.length != 0) && data?.map((e) => {return (
      <div className="testRow" key = {uuidv4()}>
        <div className="typeFiller">{e.wpm} wpm</div>
        <div className="typeFillerTwo"> {Math.round(e.cc / (e.cc + e.wc) * 100)}%</div>
        <div className="typeFiller"> {e.cc}</div>
        <div className="typeFillerTwo"> {e.wc}</div>
        <div className="typeFiller"> {e.time.getFullYear()} - {e.time.getMonth() + 1} - {e.time.getDate()}</div>
      </div>
      )})}
      {(data?.length == 0) && <div className="noTests">No Tests Taken</div>}
      </>
  )
}





export default function Signin() {
  const user = useUser()
  const test = api.post.getTest.useQuery().data
  const router = useRouter()
  const { signOut } = useClerk();
  let bestTest = {wpm: 0, cc: 0, wc: 0}
  let avgWPM = 0
  let avgACC = 0
  let testCount = 0

  if (test) {
    let index = 0;
    testCount = test?.length
    if (test?.length == 0) {
      avgWPM = 0;
      avgACC = 0;
    }
    else {
    for (let i = 0; i < test?.length; i++){
      const one = test[i]?.wpm
      const two = test[index]?.wpm
      const cc = test[i]?.cc
      const wc = test[i]?.wc
      if (cc && wc) {avgACC += Math.round(cc/ (cc + (wc)) * 100);}
      avgWPM += one?? 0;
      if (one && two) {
        if ( one > two) {
          index = i
        }
      }
    }
    avgWPM = Math.round(avgWPM / testCount);
    avgACC = Math.round(avgACC / testCount);
    }
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
        <Feed />
      </div>
      <div className="pb">Personal Best</div>
      <div className = "pbTest">
        <div className = "recentWPM">{bestTest.wpm} WPM</div>
        <div className = "recentCC">{bestTest.cc} CC</div>
        <div className = "recentWC">{bestTest.wc} WC</div>
        <div className = "recentACC">{Math.round(bestTest.cc / (bestTest.cc + bestTest.wc) * 100)}% ACC</div>
      </div>

      <div className="profileContainer">
        <motion.div initial={{ opacity: 0, translateY: 50, x: 0 }} animate={{ opacity: 1, translateY: 0, x: 0, transition: { duration: 0.5 } }}>
          <div className="username">{user.user?.firstName}</div>
        </motion.div>
        <div className="testRoute" onClick={() => router.push('/')}>Test</div>
        <div className="about2" onClick={() => router.push('/about')}>About</div>
        <div className="signOut" onClick={() => signOut(() => router.push("/"))}>Log Out</div>
      </div>
    </>
  );
}