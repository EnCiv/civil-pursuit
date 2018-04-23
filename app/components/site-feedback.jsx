'use strict';

import React from 'react';
import Icon from './util/icon';
import cx from 'classnames';

const styles = cssInJS({
    default: {
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
    open: {
        width: '50vw',
        height: '50vh'
    },
    icon: {
        display: 'block!important',
        textAlign: 'center',
        fontSize: '2rem!important',
        marginRight: '0.5em',
        cursor: 'pointer'
    }
})

export default class SiteFeedback extends React.Component {
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
      //onsole.info("contactUs response:", response);
      if ( response && response.error ) {
        let { error } = response;

        this.setState({ response : error });
      }
      else {
        this.setState({ response : 'Message sent! Looking forward to reading it' });
        setTimeout(()=>this.setState({open: false, response: null}),1000);  // affer a second close the comment window
      }
    });
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  render() {
    const {className}=this.props;

    var feedbackForm=()=>{ // not a function so 'this' is inherited from caller
        return(
            <div className={styles.wrapper}>
                <div className={styles.form}>
                    <input ref={(e)=>{e ? this.elms.subject=e : null}} className={styles.subject} type="text" placeholder="Subject" />
                    <textarea ref={(e)=>{e ? this.elms.message=e : null}} className={styles.message} type="text" placeholder="Message" />
                    <div style={this.state.response ? {display: "block"} : {display: "none"} }>{this.state.response}</div>
                    <div className={styles.buttonRow}>
                        <button className={styles.button} onClick={this.contactUs.bind(this)} name="Send Feedback">Send Feedback</button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={cx(styles.default, this.state.open ? styles.open : null, className)} title="Comments? Feedback? Great! They will make this site even better.">
            <Icon icon="comment" className={styles.icon} onClick={()=>{
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

