'use strict';

import React from 'react';
import Icon from './util/icon';
import ClassNames from 'classnames';
import isEqual from 'lodash/isEqual';
import Row from './util/row';
import TextInput from './util/text-input';
import Icon from './util/icon';


// renders the reference
class ItemReference extends React.Component {
  constructor(props) {
      super(props);
      this.link = React.createRef();
      this.inputElement = React.createRef();
      this.openURL = this.openURL.bind(this);
      this.onChangeKey = this.onChangeKey.bind(this);
      this.editURL = this.editURL.bind(this);
      this.getURL = this.getURL.bind(this);
      this.state = { reference: this.props.item && this.state.props.item.reference && this.state.props.item.reference.slice() || [] };
  }
  componentDidMount(){
      if(this.props.visualMethod==='edit'){
          this.eventListener=this.ignoreCR.bind(this);
          this.inputElement.addEventListener('keydown', this.eventListener, false);
      }
  }
  componentWillUnmount(){
      if(this.eventListener)
          this.inputElement.removeEventListener('keydown', this.eventListener, false);
  }
  ignoreCR(e){
      if ( e.keyCode === 13 ) {
          e.preventDefault();
          this.getUrlTitle();
      }
  }
  openURL(e) {
      e.preventDefault();
      e.stopPropagation();
      e.nativeEvent.stopImmediatePropagation();
      if (!this.props.rasp.readMore) {
          this.props.rasp.toParent({ type: "TOGGLE_READMORE" })
          return;
      }
      let win = window.open(this.link.href, this.link.target);
      if (win) {
          //Browser has allowed it to be opened
          win.focus();
      } else {
          //Browser has blocked it
          alert('Please allow popups for this website in order to open links');
      }
  }
  componentWillReceiveProps(newProps) {
      if (!isEqual(this.props.item && this.props.item.reference, newProps.item && newProps.item.reference))
          setState({ reference: newProps.item.reference.slice() });
  }
  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  getUrlTitle() {
      var reference = this.state.reference;

      if (url && isURL(reference[0].url)) {
          this.setState({
              titleLookingUp: true,
              titleError: false
          });
          superagent
              .get(reference[0].url)
              .agent(window.navigator.userAgent)
              .timeout(8000)
              .end((err, res) => {
                  if (err) {
                      this.setState({ titleLookingUp: false, titleError: true });
                  } else {
                      let title;
                      res.text
                          .replace(/\r/g, '')
                          .replace(/\n/g, '')
                          .replace(/\t/g, '')
                          .replace(/<title>(.+)<\/title>/, (matched, _title) => {
                              title = S(_title).decodeHTMLEntities().s;
                          });
                      if (title && title.length) {
                          reference = reference.slice();
                          reference[0].title = title;
                          this.setState({ titleLookingUp: false, titleError: false, reference });
                      } else
                          this.setState({ titleLookingUp: false, titleError: true });
                  }
                  if (this.props.onChange) this.props.onChange({ value: { reference } })
              })
      }
  }
  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  editURL() {
      this.inputElement.select();
      var reference = this.state.reference.slice();
      reference[0].title = '';
      this.setState({ reference });
  }

  onChangeKey() {
      var reference = this.state.reference || [];
      var value = this.inputElement.value;
      if (reference[0].url !== value) { reference = reference.slice(); reference[0].url = value }
      this.setState({ reference });
  }

  render() {
      const { reference, lookingUp, titleError } = this.state;
      if (this.props.visualMethod !== 'edit') {
          if (!reference.length) return null;
          return (
              <h5 className={ClassNames(this.props.className, 'item-reference', { none: noReference })} >
                  <a href={reference[0].link} onClick={this.openURL} ref={this.link} target="_blank" rel="nofollow"><span>{reference[0].title}</span></a>
              </h5>
          );
      } else
          return (
              <Row center-items>
                  <Icon
                      icon="globe"
                      spin={true}
                      className={`looking-up ${lookingUp ? 'visible' : ''}`}
                      key="globe"
                  />

                  <Icon icon="exclamation" className={`error ${titleError ? 'visible' : ''}`} />

                  <TextInput
                      block
                      placeholder="https://"
                      ref={this.inputElement}
                      onChange={this.onChangeKey}
                      onBlur={this.getUrlTitle}
                      className={`url-editor ${reference[0].title ? 'hide' : ''}`}
                      name="reference"
                      value={reference[0].url}
                      key="reference"
                  />
                  <TextInput
                      disabled
                      name="url-title"
                      value={reference[0].title}
                      className={`url-title ${reference[0].title ? 'visible' : ''}`}
                      key="title"
                  />

                  <Icon
                      icon="pencil"
                      mute
                      className={`syn-edit-url ${reference[0].title ? 'visible' : ''}`}
                      onClick={this.editURL}
                      key="pencil"
                  />
              </Row>
          );
  }
}

export default ItemReference;
