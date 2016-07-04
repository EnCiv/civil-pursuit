'use strict';

import React from 'react';

class About extends React.Component {

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~



  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  render() {
    const page = (
      <section>
        <div className="civil-pursuit">
          <div className="civil-pursuit wide-box">
            <div className="civil-pursuit conteiner">
              <div className="civil-pursuit bg-image">
                <div className="civil-pursuit news-headline">
                  <div className="civil-pursuit news-headline-inner">
                    <div className="civil-pursuit news-headline-text">Finding Solutions to What Divides Us</div>
                  </div>
                </div>
                <div className="civil-pursuit social-bar">
                  <a href="https://www.twitter.com/synaccord" target="_blank"><img src="http://res.cloudinary.com/hrltiizbo/image/upload/v1463688303/synaccord/images/twitter-logo-38x32.png" alt="Twitter.com/Synaccord" /></a>
                  <a href="https://www.facebook.com/synaccord" target="_blank"><img src="http://res.cloudinary.com/hrltiizbo/image/upload/c_scale,w_32/v1463680571/synaccord/images/FB-f-Logo__blue.png" alt="Facebook.com/Synaccord" /></a>
                </div>
              </div>
              <div className="civil-pursuit-title">
                <div className="civil-pursuit-title inner">
                  <h2>About</h2>
                  <form action="//synaccord.us3.list-manage.com/subscribe/post?u=17742b8a9119fa21afbf394e3&id=cf9aad7e3b" method="post" id="mc-embedded-subscribe-form" name="mc-embedded-subscribe-form" className="validate" target="_blank" noValidate>
                    <div id="mc_embed_signup_scroll" class="civil-pursuit-title signup">
                      <div className="civil-pursuit-text-block email-block">
                        <div className="civil-pursuit-text-block email-form cf">                   
                          <input className="civil-pursuit-text-block" type="email" name="EMAIL" id="mce-EMAIL" placeholder="email address" required />
                          <input className="civil-pursuit-text-block" type="submit" defaultValue="We Need This" name="Subscribe" id="mc-embedded-subscribe" />
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              </div>              
            </div>

            <div className="civil-pursuit-container-outer">
              <div className="civil-pursuit-conteiner-inner">
                <div className="civil-pursuit-text-block">
                    <h2>The Meaning Behind Our Name</h2>
                    <p>
                      Civil Pursuit is the web site built by Synaccord, dedicated to engaging everyone in finding the solutions to what divides us. For now it is focused on National US politics but this will expand to include local and global politics over time.
                    </p>
                    <p>
                      Synaccord is the business that was formed at the end of 2013 to build the web site invisioned by the founder in May of that year. Synaccord, LLC was formed in June 2015.</p>
                    <p>The word Synaccord is the a combination of the words “synergy” and “accord.”  Synergy is the beautiful thing that happens when people get together and do more than they could individually. An accord is a harmonious agreement.  We need both of these to build a democracy that works even better.
                    </p>
                </div>
                <div className="civil-pursuit-text-block">
                    <h2>Why</h2>
                    <p>
                    We can do better than this. Our economy, our education system, our healthcare system, our justice system, our roads and bridges, and our political system. These can all work a whole lot better. But, it's time to stop waiting for 'the government' to do something, it's time to do something, and this is it. We get together and fix it.  
                    </p>
                </div>
                <div className="civil-pursuit-text-block">
                  <div className="civil-pursuit-text-block title" >
                    <h2>The Founder</h2>
                  </div>
                  <div className="civil-pursuit-text-block two-col">
                    <div className="civil-pursuit-text-block single-center left-col">
                      <img src="http://www.gravatar.com/avatar/1048b2e27181e99baf011f397a3db1a7.jpg?s=240&r=g" alt="David Fridley, Founder of Synaccord" />
                      <h3><a href="http://linkedin/in/dfridley" target="_blank">David Fridley</a></h3>
                    </div>
                    <div className="civil-pursuit-text-block right-col">
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
                <div className="civil-pursuit-text-block">
                  <h2>Questions, Comments, Suggestions, Want to Help</h2>
                  <p>Lets talk!</p>
                  <form action="https://www.surveymonkey.com/r/5XFFXSS" target="_blank">
                    <div className="civil-pursuit-text-block email-block">
                      <div className="civil-pursuit-text-block email-form cf">   
                        <input className="civil-pursuit-text-block" type="submit" defaultValue="Contact" />
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
    return ( page );
  }
}

export default About;
