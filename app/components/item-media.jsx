'use strict';

import React from 'react';
import Image from './util/image';
import YouTube from './youtube';
import publicConfig from '../../public.json';
import ClassNames from 'classnames';
import Uploader                         from './uploader';
import createRef from 'create-react-ref/lib/createRef';
React.createRef=createRef; // remove for React 16


class ItemMedia extends React.Component {

  state = { mediaThin: '', image: '' };

  constructor(props){
    super(props);
    this.afterLoad=this.afterLoad.bind(this);
    this.saveImage=this.saveImage.bind(this);
    this.wrapper=React.createRef();
    this.media=React.createRef();
    this.uploader=React.createRef();
  }

  componentWillReceiveProps(newProps){
    if(this.state.image !== newProps.image)
      this.setState({image: newProps.image});
  }

  afterLoad() {
    if (!this.wrapper || !this.media) { return }
    let wWidth = this.wrapper.clientWidth;
    let mWidth = this.media.clientWidth;
    if (!mWidth || !wWidth) { return }
    if (mWidth > (wWidth / 2)) {
      this.setState({ mediaThin: 'media-thin' });
    }
  }

  saveImage (image) {
    this.setState({image});
    if(this.props.onChange)
      this.props.onChange({value: {image}});
  }

  render() {
    let {item, className } = this.props;

    let media;

    if(this.props.visualMethod==='edit'){
      if(this.props.type.mediaMethod!="disabled"){
        media=(
            <section className="item-media-wrapper" key="media">
              <section className="item-media" ref={this.media} style={{width: "calc(13em - 8px)"}}>
                <Uploader
                  ref       =   { this.uploader}
                  handler   =   { this.saveImage }
                  image     =   { this.state.image } />
              </section>
            </section>
        );
      } else 
        media=null;
    } else if (YouTube.isYouTube(item)) {
      media = (
        <section className={ClassNames('item-media-wrapper', className)} ref={this.wrapper}>
          <section className={`item-media ${this.state.mediaThin}`} ref={this.media} >
            <YouTube item={item} />
          </section>
        </section>
      );
    } else if (item.image == publicConfig['default item image'] || item.image == publicConfig['old default item image']) {
      media = (
        <section className={ClassNames('item-media-wrapper', 'item-hidden', className)}>
        </section>
      );
    }
    else if (item.image && (/^http/.test(item.image) || /^https/.test(item.image))) {
      media = (
        <section className={ClassNames('item-media-wrapper', className)} ref={this.wrapper}>
          <section className={`item-media ${this.state.mediaThin}`} ref={this.media}>
            <Image src={item.image} onLoad={this.afterLoad} responsive />
          </section>
        </section>
      );
    }
    else {
      /** don't show image if
      media = ( <Image src={ publicConfig['default item image'] } responsive /> ); **/
      media = (
        <section className={ClassNames('item-media-wrapper', 'item-hidden', className)}>
        </section>
      );
    }

    return (
      media
    );
  }
}

export default ItemMedia;
