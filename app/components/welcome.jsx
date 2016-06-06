'use strict';

import React from 'react';
import Icon  from './util/icon';

class About extends React.Component {

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~



  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  render() {
    const page = (
      <section>
        <div className="civil-pursuit">
          <div className="civil-pursuit wide-box">
            <div className="civil-pursuit conteiner">
              <div className="civil-pursuit welcome-bg-image">
                <div className="civil-pursuit news-headline">
                  <div className="civil-pursuit news-headline-inner">
                    <div className="civil-pursuit news-headline-text">Us Finding Solutions to What Divides Us</div>
                    <div className="civil-pursuit news-headline-text">
                      <div className="civil-pursuit button-row">
                        <div className="civil-pursuit jump-button">
                          <button>
                            <a href="#bottom-anchor">See It
                            <Icon icon="arrow-down"/>
                            </a>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="civil-pursuit social-bar">
                  <a href="https://www.twitter.com/synaccord" target="_blank"><img src="http://res.cloudinary.com/hrltiizbo/image/upload/v1463688303/synaccord/images/twitter-logo-38x32.png" alt="Twitter.com/Synaccord" /></a>
                  <a href="https://www.facebook.com/synaccord" target="_blank"><img src="http://res.cloudinary.com/hrltiizbo/image/upload/c_scale,w_32/v1463680571/synaccord/images/FB-f-Logo__blue.png" alt="Facebook.com/Synaccord" /></a>
                </div>
              </div>
              <div className="civil-pursuit-title">
                <div className="civil-pursuit-title inner">
                  <h2>Welcome</h2>
                </div>
              </div>              
            </div>

            <div className="civil-pursuit-container-outer">
              <div className="civil-pursuit-conteiner-inner">
                <div className="civil-pursuit-text-block">
                  <h2>The Problem</h2>
                  <p>
                    Most people (72%) agree this country is heading in the wrong direction. <a href="http://thehill.com/blogs/blog-briefing-room/news/194230-poll-public-lacks-confidence-in-government" target="_blank">The Hill</a>
                  </p><p>
                    Imagine what we could accomplish if so many of us agreed on what to do about it!
                  </p><p>
                    But there are so many of us, we can't get together to figure it out - there isn't a town hall big enough. Television doen's work - that'ss a few people speaking to the rest of us and money and power are bound to be an influence.
                    And social media is not doing it either, either we tend to talk with people who agree with us or incivility seems to prevail, and here too money has an effect on who sees what.
                  </p>
                </div>
                <div className="civil-pursuit-text-block">
                    <h2>Mission</h2>
                    <p>
                      Create the place where very large crowds of diverse people assemble and have productive discussions in pursuit of solutions to what divides them. 
                    </p><p>
                      It's not about one side winning out over the other, it's about finding the balance that moves us forward with acceptable risk. That's what built nuclear power stations but kept us safe from radiation, that's what allows us to study DNA without engineering our own destruction.  
                      It's what will move our country forward without compromising the values on both sides of the political spectrum.
                    </p>
                </div>
                <div className="civil-pursuit-text-block">
                    <h2>It's Possible</h2>
                    <p>
                     We have the internet, and smartphones so theres a path for people to come together, but we need a way to keep the conversations productive. So we take what works in realy life meetings and we do that in an app:
                     </p>
                     <ul>
                      <li>Divide people into small diverse groups</li>
                      <li>Facilitate the conversation in steps that lead to a conclusion</li>
                      <li>Allow people to discuss the pro's and con's of each point</li>
                      <li>Provide feedback to people so they can learn how other's react to what they say</li>
                    </ul>
                    <h3>Technical:</h3>
                    <p> It’s a web app that works on your phone, tablet and desktop for structured text or video based discussion in small diverse groups.
                    </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <a name="bottom-anchor"></a>
      </section>
    );
    return ( page );
  }
}

export default About;
