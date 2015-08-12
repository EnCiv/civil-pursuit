'use strict';

import React            from 'react';
import Uploader         from './uploader';
import TextInput        from './util/text-input';
import TextArea         from './util/text-area';
import Submit           from './util/submit';
import Icon             from './util/icon';
import Form             from './util/form';
import Row              from './util/row';

class Creator extends React.Component {

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  componentDidMount () {
    let subject       =   React.findDOMNode(this.refs.subject);
    let reference     =   React.findDOMNode(this.refs.reference);
    let description   =   React.findDOMNode(this.refs.description);
    let media         =   React.findDOMNode(this.refs.media);
    let creator       =   React.findDOMNode(this.refs.creator);

    let mediaHeight = media.offsetHeight;
    let inputHeight = subject.offsetHeight + reference.offsetHeight;

    description.style.height = ( mediaHeight - inputHeight ) + 'px';

    subject.addEventListener('keydown', (e) => {
      if ( e.keyCode === 13 ) {
        e.preventDefault();
      }
    }, false);

    reference.addEventListener('keydown', (e) => {
      if ( e.keyCode === 13 ) {
        e.preventDefault();
        this.getUrlTitle();
      }
    }, false);
  }


  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  create () {
    let subject       =   React.findDOMNode(this.refs.subject).value;
    let description   =   React.findDOMNode(this.refs.description).value;
    let url           =   React.findDOMNode(this.refs.reference).value;
    let title         =   React.findDOMNode(this.refs.title).value;

    let item = { subject, description, type: this.props.type };

    if ( url ) {
      item.references = [{ url, title }];
    }

    console.log({ item });

    window.socket.emit('create item', item)
      .on('OK create item', item => {
        console.log(item);
      });
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  getUrlTitle () {
    let url = React.findDOMNode(this.refs.reference).value;
    let loading = React.findDOMNode(this.refs.lookingUp);
    let error = React.findDOMNode(this.refs.errorLookingUp);
    let reference = React.findDOMNode(this.refs.reference);
    let editURL = React.findDOMNode(this.refs.editURL);
    let titleHolder = React.findDOMNode(this.refs.title);

    if ( url && /^http/.test(url) ) {
      loading.classList.add('--visible');

      error.classList.remove('--visible');

      window.socket.emit('get url title', url)
        .on('OK get url title', title => {
          loading.classList.remove('--visible');
          if ( title.error ) {
            error.classList.add('--visible');
          }
          else if ( title ) {
            reference.classList.add('--hide');
            titleHolder.classList.add('--visible');
            titleHolder.value = title;
            editURL.classList.add('--visible');
          }
        });
    }
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  editURL () {
    let reference = React.findDOMNode(this.refs.reference);
    let editURL = React.findDOMNode(this.refs.editURL);
    let titleHolder = React.findDOMNode(this.refs.title);

    reference.classList.remove('--hide');
    reference.select();
    titleHolder.classList.remove('--visible');
    editURL.classList.remove('--visible');
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  render () {
    return (
      <Form handler={ this.create.bind(this) } className="syn-creator" ref="form">
        <article className="item" ref="creator">
          <section className="item-media-wrapper">
            <section className="item-media">
              <Uploader ref="media" />
            </section>
          </section>

          <section className="item-buttons">
            <Submit radius>
              <Icon icon="bullhorn" />
            </Submit>
          </section>

          <section className="item-text">
            <div className="item-inputs">
              <TextInput block placeholder="Subject" ref="subject" required name="subject" />

              <Row center-items>
                <Icon icon="globe" spin={ true } text-muted className="--looking-up" ref="lookingUp" />

                <Icon icon="exclamation" text-warning className="--error" ref="errorLookingUp" />

                <TextInput block placeholder="http://" ref="reference" onBlur={ this.getUrlTitle.bind(this) } className="url-editor" name="reference" />

                <TextInput disabled value="This is the title" className="url-title" ref="title" />

                <Icon icon="pencil" mute className="syn-edit-url" ref="editURL"  onClick={ this.editURL.bind(this) }/>
              </Row>

              <TextArea block placeholder="Description" ref="description" required name="description"></TextArea>
            </div>
          </section>


          <section style={ { clear : 'both' }}></section>
        </article>
      </Form>
    );
  }
}

export default Creator;
