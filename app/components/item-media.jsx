'use strict';

import React from 'react';
import Image from './util/image';

class ItemMedia extends React.Component {
  render () {
    let { item } = this.props;

    let media;

    media = ( <Image src={ item.image } responsive /> );

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
