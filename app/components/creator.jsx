'use strict';

import React            from 'react';
import Uploader         from './uploader';
import TextInput        from './util/text-input';
import TextArea         from './util/text-area';
import Submit           from './util/submit';
import Icon             from './util/icon';
import Form             from './util/form';
import Row              from './util/row';
import YouTube          from './youtube';

class Creator extends React.Component {

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  constructor (props) {
    super(props);

    this.state = {};
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  componentDidMount () {
    let subject       =   React.findDOMNode(this.refs.subject);
    let reference     =   React.findDOMNode(this.refs.reference);
    let description   =   React.findDOMNode(this.refs.description);
    let media         =   React.findDOMNode(this.refs.uploader).querySelector('.syn-uploader-dropbox');
    let creator       =   React.findDOMNode(this.refs.creator);

    let mediaHeight = media.offsetHeight;
    let inputHeight = subject.offsetHeight + reference.offsetHeight;

    // description.style.height = ( mediaHeight -  inputHeight ) + 'px';

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
      let { references } = this.props.item;

      this.applyTitle(references[0].title, references[0].url);
    }
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  componentWillReceiveProps (props) {
    if ( props.created && props.created.panel === this.props['panel-id'] ) {
      React.findDOMNode(this.refs.subject).value = '';
      React.findDOMNode(this.refs.description).value = '';
      React.findDOMNode(this.refs.reference).value = '';
      React.findDOMNode(this.refs.title).value = '';

      setTimeout(() => {
        window.Dispatcher.emit('set active', this.props['panel-id'], `${props.created.item}-promote`);
      });
    }
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  create () {
    let subject       =   React.findDOMNode(this.refs.subject).value;
    let description   =   React.findDOMNode(this.refs.description).value;
    let url           =   React.findDOMNode(this.refs.reference).value;
    let title         =   React.findDOMNode(this.refs.title).value;

    let item = { subject, description, type: this.props.type };

    if ( this.props.parent ) {
      item.parent = this.props.parent._id || this.props.parent;
    }

    if ( url ) {
      item.references = [{ url, title }];
    }

    if ( this.props.item ) {
      item.from = this.props.item._id;

      if ( this.props.item.lineage.length ) {
        item.parent = this.props.item.lineage[this.props.item.lineage.length - 1];
      }
    }

    let insert = () => {
      window.Dispatcher.emit('create item', item);
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
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  getUrlTitle () {
    let url = React.findDOMNode(this.refs.reference).value;
    let loading = React.findDOMNode(this.refs.lookingUp);
    let error = React.findDOMNode(this.refs.errorLookingUp);

    if ( url && /^http/.test(url) ) {
      loading.classList.add('visible');

      error.classList.remove('visible');

      window.socket.emit('get url title', url)
        .on('OK get url title', title => {
          this.applyTitle(title, url);
        });
    }
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  applyTitle (title, url) {
    let loading = React.findDOMNode(this.refs.lookingUp);
    let error = React.findDOMNode(this.refs.errorLookingUp);
    let reference = React.findDOMNode(this.refs.reference);
    let editURL = React.findDOMNode(this.refs.editURL);
    let titleHolder = React.findDOMNode(this.refs.title);

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
    let reference = React.findDOMNode(this.refs.reference);
    let editURL = React.findDOMNode(this.refs.editURL);
    let titleHolder = React.findDOMNode(this.refs.title);

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
    let { item } = this.props;

    let subject, description, image, url, title;

    if ( item ) {
      subject       =   item.subject;
      description   =   item.description;
      image         =   item.image;

      if ( item.references.length ) {
        url = item.references[0].url;
        title = item.references[0].title;
      }
    }

    return (
      <Form handler={ this.create.bind(this) } className="syn-creator" ref="form">
        <article className="item" ref="creator">
          <section className="item-media-wrapper">
            <section className="item-media" ref="media">
              <Uploader
                ref       =   "uploader"
                handler   =   { this.saveImage.bind(this) }
                image     =   { image }
                video     =   { this.props.video ? item : null } />
            </section>
          </section>

          <section className="item-buttons">
            <Submit radius>
              <Icon icon="bullhorn" />
            </Submit>
          </section>

          <section className="item-text">
            <div className="item-inputs">
              <TextInput block placeholder="Subject" ref="subject" required name="subject" defaultValue={ subject } />

              <Row center-items>
                <Icon icon="globe" spin={ true } text-muted className="looking-up" ref="lookingUp" />

                <Icon icon="exclamation" text-warning className="error" ref="errorLookingUp" />

                <TextInput block placeholder="http://" ref="reference" onBlur={ this.getUrlTitle.bind(this) } className="url-editor" name="reference" defaultValue={ url } />

                <TextInput disabled defaultValue="" className="url-title" ref="title" />

                <Icon icon="pencil" mute className="syn-edit-url" ref="editURL"  onClick={ this.editURL.bind(this) }/>
              </Row>

              <TextArea block placeholder="Description" ref="description" required name="description" defaultValue={ description }></TextArea>
            </div>
          </section>


          <section style={ { clear : 'both' }}></section>
        </article>
      </Form>
    );
  }
}

export default Creator;
