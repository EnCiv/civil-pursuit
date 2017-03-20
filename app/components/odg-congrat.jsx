'use strict';

import React from 'react';
import sendEmail          from '../lib/app/send-email';
import secret             from '../../secret.json';

class ODGCongrat extends React.Component {


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
      console.info("contactUs response:", response);
      if ( response && response.error ) {
        let { error } = response;

        this.setState({ response : error });
      }
      else {
        this.setState({ response : 'Message sent! Looking forward to reading it' });
      }
    });

    console.info("contactUs");
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
                  <h2>Congratulations!</h2>
                </div>
              </div>              
            </div>

            <div className="civil-pursuit-container-outer">
              <div className="civil-pursuit-conteiner-inner">
                <div className="civil-pursuit-text-block">
                    <h2>You did it!</h2>
                    <p>
                    You took the first step! Now that we see you're are interested, we'll work even harder at getting a broad enough group signed up, and getting this out so you can help us find. 
                    </p>
                </div>
                <div className="civil-pursuit-text-block">
                    <h2>Where it's at</h2>
                    <p>
                    We know, you were hoping that after you clicked [Start Here] you would start into the game right away. But we're still building it, and at the same time we're working to gather a broad enough group of people like you so that when the game is ready, the players will be ready too.
                    </p>
                    <p>Having people sign up like this also gives us a sign that we're doing something right, and that helps us get more people involved so we can get this going faster.</p>
                    <p>Want to help?  Share this link: https://www.civilpursuit.com/odg on your social media channels like Facebook, Twitter, and Instagram and email it to anyone who has an opinion about the direction of this country.
                    </p>
                    <p>Though we may disagree on tough political issues I want to invinte you to join me a https://www.civilpursuit.com/odg becaue in America your voice counts as much as anyone's and together we can find the solutions to what divides us."</p>
                </div>
                <div className="civil-pursuit-text-block">
                  <h2>Questions, Comments, Suggestions?</h2>
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

export default ODGCongrat;
