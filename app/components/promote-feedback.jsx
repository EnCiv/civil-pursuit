'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import TextArea from './util/text-area';

class Feedback extends React.Component {
  state={feedbackObj: { item: this.props.itemId,
                  user: this.props.user.id,
                }
        };

  componentDidMount(){
    window.socket.emit("get feedback", this.props.itemId, this.okGotFeedback.bind(this));
  }

  okGotFeedback(feedbackObj){
    if(feedbackObj) this.setState({feedbackObj: feedbackObj})
  }

  onChange(){
    let value=ReactDOM.findDOMNode(this.refs.text).value;
    var feedbackObj=Object.assign(this.state.feedbackObj,{feedback: value});
    window.socket.emit("update feedback", feedbackObj);
    this.setState({feedbackObj});
  }

  render () {
    return (
      <div { ...this.props }>
        <TextArea block placeholder="Can you provide feedback that would encourage the author to create a statement that more people would unite around?" 
          value={this.state.feedbackObj.feedback} ref='text' onChange={this.onChange.bind(this)} className="user-feedback block">
        </TextArea>
      </div>
    );
  }
}

export default Feedback;
