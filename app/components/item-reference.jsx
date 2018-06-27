'use strict';

import React from 'react';
import Icon from './util/icon';
import ClassNames from 'classnames';
import isEqual from 'lodash/isEqual';
import Row from './util/row';
import TextInput from './util/text-input';
import createRef from 'create-react-ref/lib/createRef';
React.createRef=createRef; // remove for React 16
import isURL from 'is-url';

// renders the references
class ItemReference extends React.Component {
  constructor(props) {
      super(props);
      this.link = React.createRef();
      this.inputElement = React.createRef();
      this.openURL = this.openURL.bind(this);
      this.onChangeKey = this.onChangeKey.bind(this);
      this.editURL = this.editURL.bind(this);
      this.getUrlTitle = this.getUrlTitle.bind(this);
      this.ignoreCR=this.ignoreCR.bind(this);
      this.state = { references: this.props.item && this.props.item.references && this.props.item.references.slice() || [] };
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
    let newReferences=newProps.item && newProps.item.references || [];
      if (!isEqual(this.state.references, newReferences))
          this.setState({ references: newReferences.slice() });
  }
  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  getUrlTitle() {
      var references = this.state.references;
      let {url}=references[0] || {};

      if (url && isURL(url)) {
          this.setState({
              titleLookingUp: true,
              titleError: false
          });
          superagent
              .get(url)
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
                          references = references.slice();
                          references[0].title = title;
                          this.setState({ titleLookingUp: false, titleError: false, references });
                      } else
                          this.setState({ titleLookingUp: false, titleError: true });
                  }
                  if (this.props.onChange) this.props.onChange({ value: { references } })
              })
      }
  }
  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  editURL() {
      this.inputElement.current.select();
      var references = this.state.references.slice();
      references[0].title = '';
      this.setState({ references });
  }

  onChangeKey() {
      var references = this.state.references || [];
      var value = this.inputElement.current.value;
      if ((references[0] && references[0].url) !== value) { 
        references = references.slice(); 
        references[0]={url: value};
        this.setState({ references });
      }
  }

  render() {
      const { references, lookingUp, titleError, noReference } = this.state;
      const {title, url}=references[0] || {};
      if (this.props.visualMethod !== 'edit') {
          if (!references.length) return null;
          return (
              <h5 className={ClassNames(this.props.className, 'item-reference', { none: noReference })} >
                  <a href={url} onClick={this.openURL} ref={this.link} target="_blank" rel="nofollow"><span>{title}</span></a>
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
                      onKeyDown={this.ignoreCR}
                      className={`url-editor ${title ? 'hide' : ''}`}
                      name="reference"
                      value={url}
                      key="reference"
                  />
                  <TextInput
                      disabled
                      name="url-title"
                      value={title}
                      className={`url-title ${title ? 'visible' : ''}`}
                      key="title"
                  />

                  <Icon
                      icon="pencil"
                      mute
                      className={`syn-edit-url ${title ? 'visible' : ''}`}
                      onClick={this.editURL}
                      key="pencil"
                  />
              </Row>
          );
  }
}

export default ItemReference;
