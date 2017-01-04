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

  static keys = ['subject', 'description', 'reference', 'image'];  // not all keys in an item are input by the users these are the ones that are. 
  //reference is what the users enters, but references[][url,title] are what's in the item record

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  state = {
    video:        false,
    title: ''
  };

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  constructor(props){
    super(props);
    Creator.keys.forEach(key => {this.state[key]=''}); 
    if(this.props.item){
      Creator.keys.forEach(key => {this.state[key]=props[key] || ''})
    }
    if(this.props.references && this.props.references[0]){
      this.state.reference=this.props.references[0].url;
      this.state.title=this.props.references[0].title;
    }
  }

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

    if ( this.state.reference && this.state.title ) {
      this.applyTitle(this.state.title, this.state.reference);
    }
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  componentWillReceiveProps (props) {
    var obj={};
    if ( props.created && props.created.panel === this.props['panel-id'] ) {
      ReactDOM.findDOMNode(this.refs.subject).value        =   '';
      ReactDOM.findDOMNode(this.refs.description).value    =   '';
      ReactDOM.findDOMNode(this.refs.reference).value      =   '';
      ReactDOM.findDOMNode(this.refs.title).value          =   '';

      setTimeout(() => {
        window.Dispatcher.emit('set active', this.props['panel-id'], `${props.created.item}-promote`);
      });
    }
    if(props.item ){
      Creator.keys.forEach(field => {
        if(this.state[field] != props.item[field]){obj[field]=props.item[field]}
      });
      if(props.item.references && props.item.references[0]) {Object.assign(obj,props.item.references[0])}
      if(obj) { this.setState(obj) }
    }
  }

  onChangeKey(ref){
    var obj = {}, value;
      value=ReactDOM.findDOMNode(this.refs[ref]).value;
      if(this.state[ref]!==value){ obj[key]=value}
      this.setState(obj)
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  create () {
    const url           =   ReactDOM.findDOMNode(this.refs.reference).value;
    const title         =   ReactDOM.findDOMNode(this.refs.title).value;

    var item = {};
    Creator.keys.forEach(key => {
      if(key==='reference') { return } // don't add it in and delete it later
      item[key]=this.state.[key]
    })
    item.type= this.props.type;
    if ( this.props.parent ) {
      item.parent = this.props.parent;
    }
    if ( this.state.reference ) {
      item.references = [{ url: this.state.reference, title: this.state.title }];
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
        this.setState({image: this.file.name});
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
    
    this.setState({reference: url});

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
      editURL.classList.add('visible');

      let item = { references: [{ url }] };

      if ( YouTube.isYouTube(item) ) {
        this.setState({ video : item, });
      }

      this.setState({title: title});
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

    return (
      <Form handler={ this.create.bind(this) } className="syn-creator" ref="form" name="creator">
        <article className="item" ref="creator">
          <section className="item-media-wrapper">
            <section className="item-media" ref="media" style={{width: "calc(13em - 8px)"}}>
              <Uploader
                ref       =   "uploader"
                handler   =   { this.saveImage.bind(this) }
                image     =   { this.state.image }
                video     =   { this.state.video } />
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
              <TextInput block 
                placeholder="Subject" 
                ref="subject" 
                required 
                name="subject" 
                value={ this.state.subject }
                onChange = {this.onChangeKey.bind(this,'subject')}
                />

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
                  value         =   { this.state.reference }
                  />

                <TextInput
                  disabled
                  name          =   "url-title"
                  value         =   {this.state.title}
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
                value           =   { this.state.description }
                onChange      =    {this.onChangeKey.bind(this,'description')}
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
