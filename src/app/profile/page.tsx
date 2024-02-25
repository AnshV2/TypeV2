'use client'


import { useClerk } from "@clerk/clerk-react";
import { useRouter } from 'next/navigation'
import { api } from "~/trpc/react";
import {
  useUser,
} from "@clerk/nextjs";
 
const SignOutButton = () => {
  const { signOut } = useClerk();
  const router = useRouter()
 
  return (
    // Clicking on this button will sign out a user and reroute them to the "/" (home) page.
    <button onClick={() => signOut(() => router.push("/"))}>
      Sign out
    </button>
  );
};




export default function Signin() {
  const user = useUser()
  const test = api.post.getTest.useQuery({user: user.user?.id?? ""}).data
  return (
    <>
      <SignOutButton />
      <div className="userAVGWPM">
        <div className="userAVGWPMText">12 WPM</div>
        <div>Average test wpm</div>
      </div>
      <div className="userAVGACC">
        <div className="userAVGWPMText">12%</div>
        <div>Average test accuracy</div>
      </div>
      <div className="userCount">
        <div className="userAVGWPMText">12</div>
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
    </>
  );
}