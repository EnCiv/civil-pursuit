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
      media = ( <YouTube item={ item } /> );
    }

    else if ( item.image && /^http/.test(item.image) ) {
      media = ( <Image src={ item.image } responsive /> );
    }

    else if ( item.image == publicConfig['default item image'])
    { media = "";

    }
    else {
      /** don't show image if
      media = ( <Image src={ publicConfig['default item image'] } responsive /> ); **/
      media = "";
    }

    return (
      <section className="item-media-wrapper">
        <section className="item-media">
          { media }
        </section>
      </section>
    );
  }
}

export default ItemMedia;
