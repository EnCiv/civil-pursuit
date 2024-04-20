'use strict';

import React from 'react';

class ODGCongrat extends React.Component {


  state={response: null}
  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  contactUs(e)
  {
    if ( e ) {
      e.preventDefault();
    }
    let results;
    let email = this.props.user && this.props.user.email ? this.props.user.email : this.refs.email.value;
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
      //console.info("contactUs response:", response);
      if ( response && response.error ) {
        let { error } = response;

        this.setState({ response : error });
      }
      else {
        this.setState({ response : 'Message sent! Looking forward to reading it' });
      }
    });

    //console.info("contactUs");
  }

  // credit to http://www.w3resource.com/javascript/form/email-validation.php#

  validEmail(mail)   
  {  
    return (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail)) ;  
  }  

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  render() {
    // console.info("odgCongrats", this.props);
    const page = (
      <section>
        <div className="civil-pursuit">
          <div className="civil-pursuit wide-box">
            <div className="civil-pursuit container">
              <div className="civil-pursuit bg-image">
                <div className="civil-pursuit news-headline">
                  <div className="civil-pursuit news-headline-inner">
                    <div className="civil-pursuit news-headline-text">The Online Deliberation Game</div>
                  </div>
                </div>
                <div className="civil-pursuit social-bar">
                  <a href="https://www.twitter.com/civilpursuit" target="_blank"><img src="https://res.cloudinary.com/hrltiizbo/image/upload/v1463688303/synaccord/images/twitter-logo-38x32.png" alt="Twitter.com/CivilPursuit" /></a>
                  <a href="https://www.facebook.com/civilpursuit" target="_blank"><img src="https://res.cloudinary.com/hrltiizbo/image/upload/c_scale,w_32/v1463680571/synaccord/images/FB-f-Logo__blue.png" alt="Facebook.com/CivilPursuit" /></a>
                </div>
              </div>
              <div className="civil-pursuit-title">
                <div className="civil-pursuit-title inner">
                  <h2>Welcome!</h2>
                </div>
              </div>              
            </div>

            <div className="civil-pursuit-container-outer">
              <div className="civil-pursuit-container-inner">
                <div className="civil-pursuit-text-block odg-text">
                    <h2>You did it!</h2>
                    <p>
                    You took the first step! This means there really are American's who really do want to bridge the divide. 
                    </p>
                </div>
                <div className="civil-pursuit-text-block odg-text">
                    <h2>What's next</h2>
                    <p>
                    You will receive an email when your team has been assembled and it's time to start. You were probably hoping to start into the game right away, but we're working to gather a vast and broad base of people like you so that when it's time to begin, a diverse pool of players is ready too. Also, we're still building some of it. 
                    </p>
                    <p>Signing up, like you just did, also gives us a sign that we're doing something right, that we can show others so we can get more people involved so we can get this going faster.</p>
                    <p>Want to help?  Share this link: <a href="https://www.civilpursuit.com/odg" style={{fontSize: "1em"}}>https://www.civilpursuit.com/odg</a> on your social media channels like Facebook, Twitter, and Instagram and email it to anyone who has an opinion about the direction of this country.
                    </p>
                </div>
                <div className="civil-pursuit-text-block">
                  <h2>Questions, Comments, Suggestions, Ideas for Another Polarized Topic?</h2>
                  <p>Lets talk!</p>
                  <form id="mc-embedded-subscribe-form" name="mc-embedded-subscribe-form" className="validate" target="_blank" noValidate>
                    <div id="mc_embed_signup_scroll" class="civil-pursuit-title signup">
                      <div className="civil-pursuit-text-block email-block">
                        <div className="civil-pursuit-text-block odg-email-form cf">                   
                          {this.props.user && this.props.user.email ? null : <input ref="email" className="emailin" type="email" name="EMAIL" id="mce-EMAIL" placeholder="email address" required />}
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
