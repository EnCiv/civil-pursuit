'use strict';

import React from 'react';
import Image from './image';

class CloudinaryImage extends React.Component {
  render () {
    let url = ['http:/', 'res.cloudinary.com', 'hscbexf6a', 'image', 'upload'];

    let filters = [];

    if ( this.props.transparent ) {
      filters.push('e_make_transparent');
    }

    if ( filters.length ) {
      url.push(filters.join('&'));
    }

    if ( this.props.version ) {
      url.push(this.props.version);
    }

    url.push(this.props.id);

    return (
      <Image alt="Synappp" src={ url.join('/') } { ...this.props } />
    );
  }
}

export default CloudinaryImage;
