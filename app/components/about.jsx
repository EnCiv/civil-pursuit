'use strict';

import React from 'react';

class About extends React.Component {

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~



  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  render() {
    console.info("About:", this.props);
    return (
      <div className="civil-pursuit">
        <div className="civil-pursuit-conteiner">
          <div className="bg-inner">
            <div className="news-headline">
              <div className="news-headline-inner">
                <div className="news-headline-text">Democracy Needs You</div>
              </div>
            </div>
            <div className="social-bar">
              <a href="https://www.twitter.com/synaccord" target="_blank"><img src="images/TW-t-logo__white_29.png" alt="Twitter.com/Synaccord" /></a>
              <a href="https://www.facebook.com/synaccord" target="_blank"><img src="images/FB-f-Logo__blue_29.png" alt="Facebook.com/Synaccord" /></a>
            </div>
          </div>
        </div>

        <div className="civil-pursuit-container-outer">
          <div className="civil-pursuit-title">
            <div className="civil-pursuit-title inner">
              <h2>About</h2>
            </div>
          </div>
          <div className="civil-pursuit-conteiner-inner">
            <div className="civil-pursuit-text-block">
              <h2>What&#39;s Wrong?</h2>
              <p>
                You’re rational, good-natured, and you genuinely want to find the best solution, but politics has become too hostile, deceitful, and uncivilized. You care, but you’re disengaging because it’s futile and unhealthy.
              </p>
              <p>
                You’re not alone, most people agree this country is heading in the wrong direction, and think we need big changes or a complete government overhaul to fix it. <a href="http://thehill.com/blogs/blog-briefing-room/news/194230-poll-public-lacks-confidence-in-government" target="_blank">The Hill</a>
              </p>
            </div>
            <div className="content-inner-text">
              <div className="conteiner-inner">
                <p id="h2">Mission</p>
                <p>
                  Bring The People together online, keep it civil, find the solutions that unite us, and make them happen. 
                </p>
              </div>
            </div>
            <div className="content-inner-text">
              <div className="conteiner-inner">
                <p id="h2">The Meaning Behind Our Name</p>
                <p>
                  Synaccord is the a combination of the words “synergy” and “accord.”  Synergy is the beautiful thing that happens when people get together and do more than they could individually. An accord is a harmonious agreement.  We need both of these to build a democracy that works even better.
                </p>
              </div>
            </div>
            <div className="content-inner-text">
              <div className="conteiner-inner">
                <p id="h2">What it Is</p>
                <p>
                  The place for everyone to get together online to participate in the fair and balanced pursuit of solutions that unite us to our democratic challenges.
                </p>
                <h3>Technical:</h3>
                <p> It’s a web app that works on your phone, tablet and desktop for structured text or video based discussion in small diverse groups.
                </p>
              </div>
            </div>
            <div className="content-inner-text">
              <div className="conteiner-inner">
                <p id="h2">Why</p>
                <p>
                  Most people think our country is headed in the wrong direction, and while we continue heading down this wrong track our political polarization increases and, our education, healthcare, infrastructure, justice, and economic prosperity decline relative to other countries.  
                </p>
                <p>
                  In the US, the financial crisis of 2008, and the fiscal cliff showdown of 2011, shows how bad things can go when the government isn’t working effectively and how it can effect the whole world. And it seems like we have bigger crisis’ ahead that we have to work through.
                </p>
              </div>
            </div>
            <div className="civil-pursuit-wrapper">
              <div className="civil-pursuit-wrapper title" >
                <h2>The Founder</h2>
              </div>
              <div className="civil-pursuit-wrapper two-col">
                <div className="civil-pursuit-wrapper left-col">
                  <img src="http://www.gravatar.com/avatar/1048b2e27181e99baf011f397a3db1a7.jpg?s=240&r=g" alt="David Fridley, Founder of Synaccord" />
                  <h3><a href="http://linkedin/in/dfridley" target="_blank">David Fridley</a></h3>
                </div>
                <div className="civil-pursuit-wrapper right-col">
                  <p>
                    “I was the type who voted, but mostly avoided the nastiness of politics.  I was taking an online course in user interface design, while working on a different startup idea. There were thousands of students in the class.  To get our work graded, each student had to grade the work of 5 others.  I learned from giving feedback on what other people did, and I learned from the feedback I got. 
                  </p>
                  <p style={{lineHeight: '300%'}}>
                    Holy #*%!, that’s when it hit me.
                  </p>
                  <p>
                    "I realized that those 5 others could be liberals and conservatives with differing viewpoints and the work could be solutions to our political crisis, and with 1000’s of small diverse groups going, miraculous solutions we can unite around would emerge."- David Fridley, Founder 
                  </p>
                </div>
              </div>
            </div>
            <div className="content-inner-text">
              <div className="conteiner-inner">
                <p id="h2">Ways to Help</p>
                <p>There are two things you can do to help this succeed.</p>
                <p>The first is the easiest.</p>
                <p>Leave your email address below. This action is huge because it shows others there&#39;s support for this mission. That means we can get the resources to build it, and we will send you occasional updates on our progress.</p>
                <div className="support_button cf">
                  <form action="//synaccord.us3.list-manage.com/subscribe/post?u=17742b8a9119fa21afbf394e3&id=cf9aad7e3b" method="post" id="mc-embedded-subscribe-form" name="mc-embedded-subscribe-form" className="validate" target="_blank" noValidate>
                    <div id="mc_embed_signup_scroll">
                      <input className="search-class" type="email" defaultValue name="EMAIL" id="mce-EMAIL" placeholder="email address" required />
                      <input className="button_support" type="submit" defaultValue="We Need This" name="Subscribe" id="mc-embedded-subscribe" />
                    </div>
                  </form>
                </div>
                <div className="search-device cf">
                  <form action="//synaccord.us3.list-manage.com/subscribe/post?u=17742b8a9119fa21afbf394e3&id=cf9aad7e3b" method="post" id="mc-embedded-subscribe-form" name="mc-embedded-subscribe-form" className="validate" target="_blank" noValidate>
                    <div id="mc_embed_signup_scroll">
                      <div className="input-device"> <input className="search-class-device" type="email" defaultValue name="EMAIL" id="mce-EMAIL" placeholder="email address" required /></div>
                      <input className="button_subscribe-device" type="submit" defaultValue="We Need This" name="Subscribe" id="mc-embedded-subscribe" />
                    </div>
                  </form>
                </div>
                <p>The second way to get involved is to apply to participate in our beta trial. You’ll get to see the first version of Synaccord and give us feedback that will help improve the experience for future users. We’re building a new user interface for democracy and you are the expert in how well it works. With your input, we can keep working to make it engaging and fun to participate in democracy, and keep it civil. All you’ve gotta do is tell us what you think.
                </p>
                <div className="expert_button cf">
                  <form action="https://www.surveymonkey.com/r/5XFFXSS" target="_blank">
                    <input className="button_support" type="submit" defaultValue="I'm an Expert" />
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default About;
