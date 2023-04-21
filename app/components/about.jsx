'use strict';

import React from 'react';

class About extends React.Component {


  state={response: null}
  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  contactUs(e)
  {
    if ( e ) {
      e.preventDefault();
    }
    let results;
    let email = this.refs.email.value;
    let fname = this.refs.fname.value;
    let lname = this.refs.lname.value;
    let subject = this.refs.subject.value;
    let message = this.refs.message.value;

    if (!this.validEmail(email)) {
      this.setState({response: "Something's not right with the email address"} );
      return;
    }
    if(!subject){
      this.setState({response: "What subject would you like to talk about?"} );
      return;
    }
    if(!message){
      this.setState({response: "What's the message?"} );
      return;
    }

    this.setState({response: "Sending ...."});

    window.socket.emit('send contact us', email, fname,  lname, subject, message, response => {
      //onsole.info("contactUs response:", response);
      if ( response && response.error ) {
        let { error } = response;

        this.setState({ response : error });
      }
      else {
        this.setState({ response : 'Message sent! Looking forward to reading it' });
      }
    });

    //onsole.info("contactUs");
  }

  // credit to http://www.w3resource.com/javascript/form/email-validation.php#

  validEmail(mail)   
  {  
    return (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail)) ;  
  }  

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
                  <a href="https://www.twitter.com/civilpursuit" target="_blank"><img src="https://res.cloudinary.com/hrltiizbo/image/upload/v1463688303/synaccord/images/twitter-logo-38x32.png" alt="Twitter.com/CivilPursuit" /></a>
                  <a href="https://www.facebook.com/civilpursuit" target="_blank"><img src="https://res.cloudinary.com/hrltiizbo/image/upload/c_scale,w_32/v1463680571/synaccord/images/FB-f-Logo__blue.png" alt="Facebook.com/CivilPursuit" /></a>
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
                      <img src="https://www.gravatar.com/avatar/1048b2e27181e99baf011f397a3db1a7.jpg?s=240&r=g" alt="David Fridley, Founder of Synaccord" />
                      <h3><a href="https://linkedin/in/dfridley" target="_blank">David Fridley</a></h3>
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
                    <h2>What's in a Name?</h2>
                    <p>
                      Civil Pursuit is the web site built by Synaccord, dedicated to engaging everyone in finding the solutions to what divides us. For now it is focusing on National US politics for now but with ideals of expanding to include local and global politics over time.
                    </p>
                    <p>Synaccord is the organization that was formed at the end of 2013 to build the web site invisioned by the founder in May of that year. Synaccord, LLC was formed in June 2015.</p>
                    <p>The word Synaccord is the a combination of the words “synergy” and “accord.”  Synergy is the beautiful thing that happens when people get together and do more than they could individually. An accord is a harmonious agreement.  We need both of these to build a democracy that works even better.'
                    </p>
                </div>
                <div className="civil-pursuit-text-block">
                  <h2>Questions, Comments, Suggestions, Want to Help?</h2>
                  <p>Lets talk!</p>
                  <form id="mc-embedded-subscribe-form" name="mc-embedded-subscribe-form" className="validate" target="_blank" noValidate>
                    <div id="mc_embed_signup_scroll" class="civil-pursuit-title signup">
                      <div className="civil-pursuit-text-block email-block">
                        <div className="civil-pursuit-text-block email-form cf">                   
                          <input ref="email" className="emailin" type="email" name="EMAIL" id="mce-EMAIL" placeholder="email address" required />
                          <input ref="fname" className="namein" type="text" name="FNAME" id="mce-FNAME"  placeholder="First name" />
                          <input ref="lname" className="namein" type="text" name="LNAME" id="mce-LNAME" placeholder="Last name" />
                          <input ref="subject" className="subjectin" type="text" name="MMERGE3" id="mce-MMERGE3" placeholder="Subject" />
                          <textarea ref="message" className="messagein" type="text" name="MMERGE4" id="mce-MMERGE4" placeholder="Message" ref="message" />
                          <div id="mce-responses" class="clear">
                            <div className="response" id="mce-error-response" style={{display: "none"}}></div>
                            <div className="response" id="mce-success-response" style={{display: "none"}}></div>
                          </div>    {/*//-- real people should not fill this in and expect good things - do not remove this or risk form bot signups */}
                          <div style={{position: "absolute", left: "-5000px", ariaHidden: "true"}}>
                            <input type="text" name="b_17742b8a9119fa21afbf394e3_8abac9c4cd" tabindex="-1" value="" />
                          </div>
                          <div ref="response" style={this.state.response ? {display: "block"} : {display: "none"} }>{this.state.response}</div>
                          <input onClick={this.contactUs.bind(this)} className="civil-pursuit-text-block" type="submit" defaultValue="Contact" name="Subscribe" id="mc-embedded-subscribe" />
                        </div>
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
