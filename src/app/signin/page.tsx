'use client'


import {
  SignIn, 
} from "@clerk/nextjs";




export default function Signin() {

  return (
    <div className="signincenter">
      <SignIn redirectUrl = "/"/>
    </div>
  );
}