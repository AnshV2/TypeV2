'use client'


import {
  SignIn, 
} from "@clerk/nextjs";




export default function Signin() {

  return (
      <SignIn redirectUrl = "/"/>
  );
}