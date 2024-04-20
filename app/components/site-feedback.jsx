'use strict';

import React from 'react';
import Icon from './util/icon';
import cx from 'classnames';
import injectSheet from 'react-jss'

const styles = {
    defaultLandscape: {
        position: 'fixed',
        zIndex: 10,
        color: 'black',
        background: 'transparent',
        transition: 'all 0.5s linear',
        width: '5vw',
        height: '5vh',
        bottom: 0,
        right: 0
    },
    defaultPortrait: {
        position: 'fixed',
        zIndex: 10,
        color: 'black',
        background: 'transparent',
        transition: 'all 0.5s linear',
        width: '6vw',
        height: '4vh',
        bottom: 0,
        right: 0
    },
    openLandscape: {
        width: '50vw',
        height: '50vh'
    },
    openPortrait: {
        width: '97vw',
        height: '75vh'
    },
    wrapper: {
        margin: '1em',
        border: 'none',
    },
    form:{
        padding: '0.25em',
        border: 'solid darkslategray 1px',
        borderRadius: '0.25em',
        boxShadow: '0 0 0.5em 0.25em rgba(0, 0, 0, 0.3)',
        background: 'white'
    },
    subject:{
        width: '100%',
        marginBottom: '0.5em',
        borderRadius: 0
    },
    message:{
        display: 'table-cell',
        width: '100%',
        marginBottom: '0.5em',
        borderRadius: 0,
        height: '8em',
        verticalAlign: 'top',
        marginBottom: '.5em',
    },
    buttonRow:{
        width: "100%"
    },
    button:{
        display: 'block',
        marginLeft: 'auto',
        marginRight: '0',
        cursor: 'pointer',
        outline: 'medium none',
        border: 'medium none',
        borderRadius: '0px',
        textDecoration: 'none',
        paddingLeft: '0.5em',
        paddingRight: '0.5em',
        paddingTop: '0.1em',
        paddingBottom: '0.1em',
        fontSize: '1rem',
        height: '2em',
        color: 'white',
        background: 'linear-gradient(to bottom, #FF8F00 0%, #FF7002 51%, #FF7002 100%) repeat scroll 0% 0% transparent'
    },
    icon: {
        display: 'block!important',
        textAlign: 'center',
        fontSize: '2rem!important',
        marginRight: '0.5em',
        cursor: 'pointer'
    }
}

 class SiteFeedback extends React.Component {
  elms={};
  state={   response: null,
            open: false
        }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  contactUs(e)
  {
    if ( e ) {
      e.preventDefault();
    }
    let results;
    let email = '';
    let fname = '';
    let lname = '';
    let subject = this.elms.subject.value;
    let message = this.elms.message.value;

    if(!subject){
      this.setState({response: "What subject would you like to send feedback about?"} );
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
        setTimeout(()=>this.setState({open: false, response: null}),1000);  // After a second, close the comment window
      }
    });
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  render() {
    const {className, classes}=this.props;
    let w,h,panelClass='Landscape';
    if(typeof document !== 'undefined'){
        w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
        h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
        if(h>w) panelClass = 'Portrait';
    }

    var feedbackForm=()=>{ // not a function so 'this' is inherited from caller
        return(
            <div className={classes.wrapper}>
                <div className={classes.form}>
                    <input ref={(e)=>{e ? this.elms.subject=e : null}} className={classes.subject} type="text" placeholder="Subject" />
                    <textarea ref={(e)=>{e ? this.elms.message=e : null}} className={classes.message} type="text" placeholder="Message" />
                    <div style={this.state.response ? {display: "block"} : {display: "none"} }>{this.state.response}</div>
                    <div className={classes.buttonRow}>
                        <button className={classes.button} onClick={this.contactUs.bind(this)} name="Send Feedback">Send Feedback</button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={cx(classes['default'+panelClass], this.state.open ? classes['open'+panelClass] : null, className)} title="Comments? Critical Feedback? Complaints? Great! I can't wait to see them.">
            <Icon icon="comment" className={classes.icon} onClick={()=>{
                var willOpen=!this.state.open;
                this.setState({open: !this.state.open},()=>{
                    if(willOpen) 
                        this.elms.message.value='url: '+window.location.href+'\n\n';
                    else
                        this.state.response=''; // clear the response;
                });
            }} />
            {this.state.open ? feedbackForm() : null}
        </div>
    );
  }
}

export default injectSheet(styles)(SiteFeedback);

