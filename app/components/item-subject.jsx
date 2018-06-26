'use strict';

import React from 'react';
import ClassNames from 'classnames';
import TextInput from './util/text-input';
import createRef from 'create-react-ref/lib/createRef';
React.createRef=createRef; // remove for React 16


class ItemSubject extends React.Component {
  constructor(props) {
      super(props);
      this.inputElement = React.createRef();
      this.onChangeKey = this.onChangeKey.bind(this);
      this.onBlur=this.onBlur.bind(this);
      this.ignoreCR=this.ignoreCR.bind(this);
      this.state = { subject: this.props.item && this.props.item.subject || '' };
  }
  componentWillReceiveProps(newProps) {
      if (this.state.subject != newProps.subject)
          this.setState({ subject: newProps.subject })
  }
  ignoreCR(e){
      if ( e.keyCode === 13 ) {
          e.preventDefault();
      }
  }
  onChangeKey() {
      var subject = this.state.subject;
      var value = this.inputElement.value;
      if (subject !== value) subject = value.slice();
      this.setState({ subject });
  }
  onBlur(){
      var subject = this.state.subject;
      if (this.props.onChange) {
          this.props.onChange({ value: { subject } })
      }
  }
  render() {
      const { item, rasp, truncShape } = this.props;
      const subject = this.state.subject;
      if (this.props.visualMethod !== 'edit')
          return (<h4 className={ClassNames("item-subject", truncShape)}>{subject}</h4>)
      else {
          return (
              <TextInput block
                  placeholder={item.type.subjectPlaceholder || "Subject"}
                  ref={this.inputElement}
                  required
                  name="subject"
                  value={subject}
                  onChange={this.onChangeKey}
                  onBlur={this.onBlur}
                  onKeyDown={this.ignoreCR}
                  key="subject"
              />
          )
      }
  }
}

export default ItemSubject;
