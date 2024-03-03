'use client'

import Link from "next/link";
const chigiri = '/chigiri.png'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faGithub, faInstagram} from '@fortawesome/free-brands-svg-icons'


export default function About(){
  return (
    <>
        <Link className = "testTwo" href = "/" prefetch = {false}><div>Test</div></Link>
        <ul className="icons">
                        <a href="https://www.instagram.com/aneeshyboneechyelectric/" className="listf"><li><FontAwesomeIcon icon={faInstagram} /></li></a>
                        <a href="https://github.com/AnshV2" className="listf"><li><FontAwesomeIcon icon={faGithub} /></li></a>
        </ul>
        <img src = {chigiri} className='chigiriTwo'></img>
        <div className="aboutWrapper">
        <div className="aboutTextHeader">Hi there fellow typing enthusiast! Hope you are enjoying my typetest.</div>
        <br></br>
        <br></br>
        <div className="aboutText">My objective when building this typetest was to produce a test meant for practicing and improving infinitely. I designed the test
specifically to be minimilistic and as easy on the eyes as possible. I researched least strainful colors and designs and tried to
incorporate the ideas I found into this site. This site is meant for a user to be able to practice for extended periods of times 
without experiencing fatigue. I want you to enjoy improvement as much as possible without any hinderances.</div>
        <br></br>
        <br></br>
        <div className="aboutTextHeader">Test Measurements:</div>
        <div className="aboutText">Correct Characters - Number of characters in correctly typed words.
Incorrect Characters - Number of characters in words with at least one incorrect character.
Words per Minute (WPM) - Correct characters, divided by 5, and divided by the test duration in minutes.
Accuracy - Number of characters in correctly typed words, divided by the number of characters in all words, as a percentage.</div>
        <br></br>
        <br></br>
        <div className="aboutTextHeader">User Experience Choices:</div>
        <div className="aboutText">I personally was a big fan of TypeTest.io and so it is obvious my site has heavy influences from
there, but there were some things about TypeTest.io (and other tests) that I was not a fan of. First off the fact that when
signed in every test was tracked and recorded added too much pressure (although perhaps that is a personal flaw of mine). I 
was constantly obsessed with making sure my typing average on my profile did not drop, so I found I would often make sure I'm
signed out so that I wasn't being tracked. To fix this I have added a training mode option which will make it so you're tests
aren't tracked and you can focus solely on improvement with no pressure! You will have off days and I do not want them discouraging
you for even those off days are improving you. I also have fewer options than other type tests. Some of that is because this site is
new and I haven't had time to build many features. I have my contacts in this page so if you want to see something I haven't
implemented yet let me know! Another reason for this, however, is that I wanted a more universal experience, kind of like a 
benchmark system. I want you to have a consistent benchmark for your skill. There is also a lack of a leaderboard. Perhaps I will
add one at some point, but for now my idea is seeing a leaderboard can be discouraging when starting. I firmly believe your own
progress is far more important than your standing amongst others, not only in typing but in every aspect! You should be focused
on your own improvement and not your standing on leaderboards. That said leaderboards can also be motivating to some who enjoy the 
climb! I will most likely add a leaderboard system that a user has the option of opting into. Coming soon! </div>
<br></br>
<br></br>
<br></br>
        <div className="aboutText">A note to you, the user of the site:

Improving in typing,
much like many other skills, requires patience and sustained effort. It can be incredibly frustrating practicing one day and not
doing as well as you did the previous day. Almost feels like you haven't gone anywhere in your practice at all, but I assure you
no practice session results in you becoming worse! There is a concept called the olympic thirds which I feel can be useful to know. 
When Olympic athletes practice it is almost universally found that they spend a third of their time feeling horrible, a third 
feeling meh, and a third feeling amazing. You will spend some time feeling demotivated and terrible about your performance, but
the olympic athlete knows about this feeling and they push through! Even sessions where you feel worse improve you. When you push
through that terrible feeling you will find that the third of the time you feel amazing will feel like no other experience. I find
it helpful to know that typing is something where there legitimately no inherit limit in the body. Anyone is capable of reaching
blazingly high speeds. I hope this test I have built can assist you in your progression just as many tests have helped me.  </div>

        <div className="fillerAbout"></div>
</div>

    </>
  );
}