'use strict';

import React from 'react';
import Icon  from './util/icon';
import smoothScroll       from '../lib/app/smooth-scroll';

class Welcome extends React.Component {


  smooth(tag,e){
    e.preventDefault();
    let link=document.getElementsByName(tag);
    smoothScroll(link[0].offsetTop, 500);
    //document.body.animate({scrollTop: link[0].offsetTop}, 500);
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  render() {
    const page = (
      <section>
        <div className="civil-pursuit">
          <div className="civil-pursuit wide-box">
            <div className="civil-pursuit container">
              <div className="civil-pursuit welcome-bg-image">
                <div className="civil-pursuit news-headline">
                  <div className="civil-pursuit news-headline-inner">
                    <div className="civil-pursuit news-headline-text">Finding Solutions to What Divides Us</div>
                    <div className="civil-pursuit news-headline-text">
                      <div className="civil-pursuit button-row">
                        <div className="civil-pursuit jump-button">
                          <button onClick={ this.smooth.bind(this, 'read-anchor') }>
                            <span>Read More</span>
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="civil-pursuit news-headline-text">
                      <div className="civil-pursuit button-row">
                        <div className="civil-pursuit jump-button">
                          <button onClick={ this.smooth.bind(this, 'bottom-anchor') }>
                            <span>See It</span>
                            <Icon icon="arrow-down" style={{paddingLeft: '.5em'}} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="civil-pursuit social-bar">
                  <a href="https://www.twitter.com/civilpursuit" target="_blank"><img src="https://res.cloudinary.com/hrltiizbo/image/upload/v1463688303/synaccord/images/twitter-logo-38x32.png" alt="Twitter.com/CivilPursuit" /></a>
                  <a href="https://www.facebook.com/civilpursuit" target="_blank"><img src="https://res.cloudinary.com/hrltiizbo/image/upload/c_scale,w_32/v1463680571/synaccord/images/FB-f-Logo__blue.png" alt="Facebook.com/CivilPursuit" /></a>
                </div>
              </div>
              <div className="civil-pursuit-title">
                <div className="civil-pursuit-title inner">
                  <h2>Welcome</h2>
                  <form action="//synaccord.us3.list-manage.com/subscribe/post?u=17742b8a9119fa21afbf394e3&id=cf9aad7e3b" method="post" id="mc-embedded-subscribe-form" name="mc-embedded-subscribe-form" className="validate" target="_blank" noValidate>
                    <div id="mc_embed_signup_scroll" className="civil-pursuit-title signup">
                      <div className="civil-pursuit-text-block email-block">
                        <div className="civil-pursuit-text-block email-form cf">                   
                          <input className="civil-pursuit-text-block" type="email" name="EMAIL" id="mce-EMAIL" placeholder="email address" required />
                          <input className="civil-pursuit-text-block" type="submit" defaultValue="Join the Pursuit" name="Subscribe" id="mc-embedded-subscribe" />
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              </div>              
            </div>

            <div className="civil-pursuit-container-outer">
              <a name="read-anchor" ></a>
              <div className="civil-pursuit-container-inner">
                <div className="civil-pursuit-text-block">
                  <h2>The Problem</h2>
                  <p>
                    Most people (72%) agree this country is heading in the wrong direction. <a href="http://thehill.com/blogs/blog-briefing-room/news/194230-poll-public-lacks-confidence-in-government" target="_blank">The Hill</a>
                  </p><p>
                    And our political system is gridlocked, and it seems impossible for us to agree on a right direction.
                  </p>
                </div>
                <div className="civil-pursuit-text-block">
                    <h2>Our Mission</h2>
                    <p>We believe that we can assemble <i>everyone</i> in productive discussion about what divides us and it will unite us, and incredible things will result.
                    </p><p>We're not about one side winning out over the other. 
                    </p><p>We're about finding the balance that moves us forward, gracefully.
                    </p><p>This is the civil pursuit of a more perfect Union.
                    </p>
                </div>
                <div className="civil-pursuit-text-block">
                    <h2>Here's How</h2>
                     <ul>
                      <li>We have the internet so we have a place for everyone to come together.</li>
                      <li>We've seen in real life deliberative forums and living room discussions, that in small groups, diverse people do come together, and are willing to listen, and they do find agreements.</li>
                      <li>We have seen that there can be a wisdom in the crowd, that together we can find the answer when no one alone can do it.</li>
                      <li>So we are here to make small deliberative discussions happen online, by the millions, and keep happening, until this country is moving in the right direction and we all agree it is.</li>
                      <h3>Technical:</h3>
                      <p> It’s a web application that works on mobile and desktop for structured text or video discussion with random people, where everone's voice is equal and we vote up the best.
                      </p>
                    </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
        <a name="bottom-anchor" style={{display: 'block'}}></a>
      </section>
    );
    return ( page );
  }
}

export default Welcome;
