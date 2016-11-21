'use strict';

import React                            from 'react';
import ReactDOM                         from 'react-dom';
import Uploader                         from './uploader';
import TextInput                        from './util/text-input';
import TextArea                         from './util/text-area';
import Submit                           from './util/submit';
import Icon                             from './util/icon';
import Form                             from './util/form';
import Row                              from './util/row';
import YouTube                          from './youtube';
import itemType                         from '../lib/proptypes/item';
import typeType                         from '../lib/proptypes/type';

class Creator extends React.Component {

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  state = { blank : true };

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  componentDidMount () {
    const subject   =   ReactDOM.findDOMNode(this.refs.subject),
      reference     =   ReactDOM.findDOMNode(this.refs.reference),
      description   =   ReactDOM.findDOMNode(this.refs.description),
      media         =   ReactDOM.findDOMNode(this.refs.uploader)
                          .querySelector('.syn-uploader-dropbox'),
      creator       =   ReactDOM.findDOMNode(this.refs.creator),
      mediaHeight   =   media.offsetHeight,
      inputHeight   =   subject.offsetHeight + reference.offsetHeight;

    description.style.minHeight = ( mediaHeight -  inputHeight ) + 'px';

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

    if ( reference.value && this.props.item ) {
      const { references } = this.props.item;

      this.applyTitle(references[0].title, references[0].url);
    }
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  componentWillReceiveProps (props) {
    if ( props.created && props.created.panel === this.props['panel-id'] ) {
      ReactDOM.findDOMNode(this.refs.subject).value        =   '';
      ReactDOM.findDOMNode(this.refs.description).value    =   '';
      ReactDOM.findDOMNode(this.refs.reference).value      =   '';
      ReactDOM.findDOMNode(this.refs.title).value          =   '';

      setTimeout(() => {
        window.Dispatcher.emit('set active', this.props['panel-id'], `${props.created.item}-promote`);
      });
    }
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  create () {
    const subject       =   ReactDOM.findDOMNode(this.refs.subject).value;
    const description   =   ReactDOM.findDOMNode(this.refs.description).value;
    const url           =   ReactDOM.findDOMNode(this.refs.reference).value;
    const title         =   ReactDOM.findDOMNode(this.refs.title).value;

    const item = { subject, description, type: this.props.type };

    if ( this.props.parent ) {
      item.parent = this.props.parent;
    }

    if ( url ) {
      item.references = [{ url, title }];
    }

    if ( this.props.item ) {
      item.from = this.props.item._id;
    }

    if ( this.file ) {
      item.image = this.file;
    }

    console.info('CREATE ITEM', item);

    let insert = () => {
      window.socket.emit('create item', item);
    };

    if ( this.file ) {
      let stream = ss.createStream();

      ss(window.socket).emit('upload image', stream,
        { size: this.file.size, name: this.file.name });

      ss.createBlobReadStream(this.file).pipe(stream);

      stream.on('end', () => {
        item.image = this.file.name;

        insert();
      });
    }
    else {
      insert();
    }
    console.info("Creator.create", this.props);

    this.props.toggle();
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  getUrlTitle () {
    let url = ReactDOM.findDOMNode(this.refs.reference).value;
    let loading = ReactDOM.findDOMNode(this.refs.lookingUp);
    let error = ReactDOM.findDOMNode(this.refs.errorLookingUp);

    if ( url && /^http/.test(url) ) {
      loading.classList.add('visible');

      error.classList.remove('visible');

      window.socket.emit('get url title', url, title => {
        this.applyTitle(title, url);
      });
    }
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  applyTitle (title, url) {
    let loading = ReactDOM.findDOMNode(this.refs.lookingUp);
    let error = ReactDOM.findDOMNode(this.refs.errorLookingUp);
    let reference = ReactDOM.findDOMNode(this.refs.reference);
    let editURL = ReactDOM.findDOMNode(this.refs.editURL);
    let titleHolder = ReactDOM.findDOMNode(this.refs.title);

    loading.classList.remove('visible');

    if ( ! title || title.error ) {
      error.classList.add('visible');
    }

    else if ( title ) {
      reference.classList.add('hide');
      titleHolder.classList.add('visible');
      titleHolder.value = title;
      editURL.classList.add('visible');

      let item = { references: [{ url }] };

      if ( YouTube.isYouTube(item) ) {
        this.setState({ video : item });
      }
    }
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  editURL () {
    let reference = ReactDOM.findDOMNode(this.refs.reference);
    let editURL = ReactDOM.findDOMNode(this.refs.editURL);
    let titleHolder = ReactDOM.findDOMNode(this.refs.title);

    reference.classList.remove('hide');
    reference.select();
    titleHolder.classList.remove('visible');
    editURL.classList.remove('visible');
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  saveImage (file) {
    this.file = file;
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  render () {
    console.log('RENDER creator', this.props);
    let { item } = this.props;

    let subject, description, image, url, title;

    if ( item ) {
      subject       =   item.subject;
      description   =   item.description;
      image         =   item.image;

      if ( item.references && item.references.length ) {
        url = item.references[0].url;
        title = item.references[0].title;
      }
    }

    return (
      <Form handler={ this.create.bind(this) } className="syn-creator" ref="form" name="creator">
        <article className="item" ref="creator">
          <section className="item-media-wrapper">
            <section className="item-media" ref="media" style={{width: "calc(13em - 10px)"}}> // width as if a picture was here. Uploader has a 5px boarder on each side
              <Uploader
                ref       =   "uploader"
                handler   =   { this.saveImage.bind(this) }
                image     =   { image }
                video     =   { this.props.video ? item : null } />
            </section>
          </section>

          <section className="item-buttons">
            <section className="syn-button-group">
              <span className="civil-button-info">{' '}</span>
              <Submit small shy>
                <span className="civil-button-text">Post</span>
              </Submit>
            </section>
          </section>

          <section className="item-text">
            <div className="item-inputs">
              <TextInput block placeholder="Subject" ref="subject" required name="subject" defaultValue={ subject } />

              <Row center-items>
                <Icon
                  icon        =   "globe"
                  spin        =   { true }
                  text-muted
                  className   =   "looking-up"
                  ref         =   "lookingUp"
                  />

                <Icon icon="exclamation" text-warning className="error" ref="errorLookingUp" />

                <TextInput
                  block
                  placeholder   =   "http://"
                  ref           =   "reference"
                  onBlur        =   { this.getUrlTitle.bind(this) }
                  className     =   "url-editor"
                  name          =   "reference"
                  defaultValue  =   { url }
                  />

                <TextInput
                  disabled
                  name          =   "url-title"
                  defaultValue  =   ""
                  className     =   "url-title"
                  ref           =   "title"
                  />

                <Icon
                  icon          =   "pencil"
                  mute
                  className     =   "syn-edit-url"
                  ref           =   "editURL"
                  onClick       =   { this.editURL.bind(this) }
                  />
              </Row>

              <TextArea
                placeholder     =   "Description"
                ref             =   "description"
                name            =   "description"
                defaultValue    =   { description }
                block
                required
                ></TextArea>
            </div>
          </section>


          <section style={ { clear : 'both' }}></section>
        </article>
      </Form>
    );
  }
}

export default Creator;
