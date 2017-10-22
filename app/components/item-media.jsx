'use strict';

import React                          from 'react';
import Image                          from './util/image';
import YouTube                        from './youtube';
import publicConfig                   from '../../public.json';
import itemType                       from '../lib/proptypes/item';
import ClassNames          from 'classnames';

class ItemMedia extends React.Component {

state={mediaThin: {} };

afterLoad() {
  if(! this.refs.wrapper || ! this.refs.media) { return }
  let wWidth=this.refs.wrapper.clientWidth;
  let mWidth=this.refs.media.clientWidth;
  if( !mWidth || ! wWidth) { return }
  if( mWidth > (wWidth / 2)) {
    this.setState({mediaThin: 'media-thin' });
  }
}


  render () {
    let { item, className } = this.props;

    let media;

    if ( YouTube.isYouTube(item) ) {
      media = ( 
        <section className={ClassNames('item-media-wrapper', className)} ref='wrapper'>
          <section className={`item-media ${this.state.mediaThin}`} ref='media' >
            <YouTube item={ item } /> 
          </section>
        </section>
      );
    }

    else if ( item.image == publicConfig['default item image'] || item.image == publicConfig['old default item image'] )
    { media = ( 
        <section className={ClassNames('item-media-wrapper', 'item-hidden', className)}>
        </section>
        );

    }
    else if ( item.image && ( /^http/.test(item.image) || /^https/.test(item.image))  ) {
      media = ( 
        <section className={ClassNames('item-media-wrapper', className)} ref='wrapper'>
          <section className={`item-media ${this.state.mediaThin}`} ref="media">
            <Image src={ item.image } onLoad={this.afterLoad.bind(this)} responsive /> 
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
