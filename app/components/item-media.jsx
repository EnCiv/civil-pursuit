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

  render () {
    console.info("ItemMedia.render", this.props, publicConfig);
    let { item } = this.props;

    let media;

    if ( YouTube.isYouTube(item) ) {
      media = ( 
        <section className="item-media-wrapper">
          <section className="item-media">
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
        <section className="item-media-wrapper">
          <section className="item-media">
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
