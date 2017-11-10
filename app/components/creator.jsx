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
    video: '',
    title: '',
    titleLookingUp: false,
    titleError: false
  };

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  constructor(props){
    super(props);
    let item=props.item;
    if(item && Object.keys(item)  ) Creator.keys.forEach(key => {this.state[key]=item[key] || ''});
    else Creator.keys.forEach(key => {this.state[key]=''}); 
    if(this.props.references && this.props.references[0]){
      this.state.reference=this.props.references[0].url;
      this.state.title=this.props.references[0].title;
    }
  }

  componentDidMount () {
    const subject   =   ReactDOM.findDOMNode(this.refs.subject),
      reference     =   ReactDOM.findDOMNode(this.refs.reference),
      description   =   ReactDOM.findDOMNode(this.refs.description),
      creator       =   ReactDOM.findDOMNode(this.refs.creator);
    var media = null,
      mediaHeight   = 60,
      inputHeight   = subject.offsetHeight;

    if(this.refs.media){
      media         =   ReactDOM.findDOMNode(this.refs.uploader)
                          .querySelector('.syn-uploader-dropbox');
      mediaHeight   =   media.offsetHeight;
    }

    if(this.refs.reference){
      inputHeight   =   subject.offsetHeight + reference.offsetHeight;
    }

    description.style.minHeight = ( mediaHeight -  inputHeight ) + 'px';

    subject.addEventListener('keydown', (e) => {
      if ( e.keyCode === 13 ) {
        e.preventDefault();
      }
    }, false);

    if(reference) { reference.addEventListener('keydown', (e) => {
        if ( e.keyCode === 13 ) {
          e.preventDefault();
          this.getUrlTitle();
        }
      }, false);

      if ( this.state.reference && this.state.title ) {
        this.applyTitle(this.state.title, this.state.reference);
      }
    }
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  componentWillReceiveProps (props) {
    var obj={};
    if ( props.created && props.created.panel === this.props['panel-id'] ) {
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
    }else{ // clear the state
      Creator.keys.forEach(key => {obj[key]=''});
      this.setState(obj);
    }
  }

  onChangeKey(ref){
    var obj = {}, value ;
      value=ReactDOM.findDOMNode(this.refs[ref]).value;
      if(this.state[ref]!==value){ obj[ref]=value}
      this.setState(obj);
      if(this.props.toParent){
        var dBitem=this.makeDbItem();
        dBitem[ref]=value;
        this.props.toParent({results: {item: dBitem}})
      }
  }

  //~~~~~~~~~~~~~~~~~~

  makeDbItem(){
    var item = {};

    Creator.keys.forEach(key => {
      if(key==='reference') return; // don't add it in and delete it later
      if(this.state[key]) { item[key]=this.state[key] }
    })
    if ( this.state.reference ) {
      item.references = [{ url: this.state.reference, title: this.state.title }];
    }
    item.type= this.props.type;
    if ( this.props.parent ) {
      item.parent = this.props.parent;
    }
    if ( this.props.item ) {
      if(this.props.noEdit) item.from = this.props.item._id;
      else item._id = this.props.item._id;
    }
    return item;
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  create () {
    var item = this.makeDbItem();

    console.info('CREATE ITEM');

    let insert = () => {
      if(item._id){
        console.info("creator: update item");
        window.socket.emit('update item', item);
      }else window.socket.emit('create item', item, (item)=>{
        this.props.toParent && this.props.toParent({results: {item: item}})
      });
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
    console.info("Creator.create");

    if(this.props.toggle) this.props.toggle();
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  getUrlTitle () {
    let url = this.state.reference;
    
    if ( url && /^http/.test(url) ) {
      this.setState({titleLookingUp: true, 
                     titleError: false});
      window.socket.emit('get url title', url, title => {
        this.applyTitle(title, url);
      });
    }
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  applyTitle (title, url) {
    if ( ! title || title.error ) {
      this.setState({titleLoading: false,
                     titleError: true});
    } else if ( title ) {
      this.setState({ titleLoading:false,
                      titleError: false,
                      title: title });
      let item = { references: [{ url }] };
      if ( YouTube.isYouTube(item) ) {
        this.setState({ video : item, });
      }
    }
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  editURL () {
    let reference = ReactDOM.findDOMNode(this.refs.reference);
    reference.select();
    this.setState({title: ''});
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  saveImage (file) {
    this.file = file;
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  render () {
    console.log('RENDER creator');

    var media=[];
    var reference=[];

    if(this.props.type.mediaMethod!="disabled"){
      media=[
          <section className="item-media-wrapper" key="media">
            <section className="item-media" ref="media" style={{width: "calc(13em - 8px)"}}>
              <Uploader
                ref       =   "uploader"
                handler   =   { this.saveImage.bind(this) }
                image     =   { this.state.image }
                video     =   { this.state.video } />
            </section>
          </section>
      ];
    }
    if(this.props.type.referenceMethod!="disabled"){
      reference=
              <Row center-items>-
                <Icon
                  icon        =   "globe"
                  spin        =   { true }
                  className   =   {`looking-up ${this.state.lookingUp ? 'visible' : ''}`}
                  ref         =   "lookingUp"
                  key         =   "globe"
                  />

                <Icon icon="exclamation" className={`error ${this.state.titleError ? 'visible' : ''}`} ref="errorLookingUp" />

                <TextInput
                  block
                  placeholder   =   "http://"
                  ref           =   "reference"
                  onChange      =   { this.onChangeKey.bind(this,'reference')}
                  onBlur        =   { this.getUrlTitle.bind(this) }
                  className     =    {`url-editor ${this.state.title ? 'hide' : ''}`}
                  name          =   "reference"
                  value         =   { this.state.reference }
                  key           =   "reference"
                  />

                <TextInput
                  disabled
                  name          =   "url-title"
                  value         =   {this.state.title}
                  className     =   {`url-title ${this.state.title ? 'visible' : ''}`}
                  ref           =   "title"
                  key           =   "title"
                  />

                <Icon
                  icon          =   "pencil"
                  mute
                  className     =   {`syn-edit-url ${this.state.title ? 'visible' : ''}`}
                  ref           =   "editURL"
                  onClick       =   { this.editURL.bind(this) }
                  key           = "pencil"
                  />
              </Row>
    }
  

    return (
      <Form handler={this.create.bind(this)} className="syn-creator" ref="form" name="creator">
        <article className="item" ref="creator">
          {media}

          <section className="item-text">
            <section className="item-buttons">
              <section className="syn-button-group">
                <span className="civil-button-info">{' '}</span>
                <Submit small shy>
                  <span className="civil-button-text">Post</span>
                </Submit>
              </section>
            </section>
            <div className="item-inputs">
              <TextInput block
                placeholder={this.props.type.subjectPlaceholder || "Subject"}
                ref="subject"
                required
                name="subject"
                value={this.state.subject}
                onChange={this.onChangeKey.bind(this, 'subject')}
                key="subject"
              />

              {reference}

              <TextArea
                placeholder="Description"
                ref="description"
                name="description"
                value={this.state.description}
                onChange={this.onChangeKey.bind(this, 'description')}
                block
                required
                key="description"
              ></TextArea>
            </div>
          </section>
          <section style={{ clear: 'both' }}></section>
        </article>
      </Form>
    );
  }
}

export default Creator;
