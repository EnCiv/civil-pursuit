'use strict';

import React      from 'react';
import Image      from './util/image';
import YouTube    from './youtube';

class ItemMedia extends React.Component {
  render () {
    let { item } = this.props;

    let media;

    if ( YouTube.isYouTube(item) ) {
      media = ( <YouTube item={ item } /> );
    }

    else {
      media = ( <Image src={ item.image } responsive /> );
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
