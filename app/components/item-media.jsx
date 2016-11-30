'use strict';

import React                          from 'react';
import Image                          from './util/image';
import YouTube                        from './youtube';
import publicConfig                   from '../../public.json';
import itemType                       from '../lib/proptypes/item';

class ItemMedia extends React.Component {
  static propTypes = {
    item : itemType
  };

state={mediaThin: null };

componentDidMount() {
  if(! this.refs.wrapper || ! this.refs.media) { return }
  let wWidth=this.refs.wrapper.clientWidth;
  let mWidth=this.refs.media.clientWidth;
  if( !mWidth || ! wWidth) { return }
  if( mWidth > (wWidth / 2)) {
    this.setState({mediaThin: "media-thin" });
  }
}


  render () {
    let { item } = this.props;

    let media;

    if ( YouTube.isYouTube(item) ) {
      media = ( 
        <section className="item-media-wrapper" ref='wrapper'>
          <section className={`item-media ${mediaThin}`} ref='media' >
            <YouTube item={ item } /> 
          </section>
        </section>
      );
    }

    else if ( item.image == publicConfig['default item image'])
    { media = ( 
        <section className="item-media-wrapper item-hidden">
        </section>
        );

    }
    else if ( item.image && /^http/.test(item.image) ) {
      media = ( 
        <section className="item-media-wrapper" ref='wrapper'>
          <section className={`item-media ${mediaThin}`} ref="media">
            <Image src={ item.image } responsive /> 
          </section>
        </section>
        );
    }
    else {
      /** don't show image if
      media = ( <Image src={ publicConfig['default item image'] } responsive /> ); **/
      media = ( 
        <section className="item-media-wrapper item-hidden">
        </section>
        );
    }

    return (
          media
    );
  }
}

export default ItemMedia;
