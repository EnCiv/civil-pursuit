'use strict';

import React from 'react';
import Image from './image';
import PropTypes from 'prop-types';

class CloudinaryImage extends React.Component {
  static propTypes    =   {
    transparent       :   PropTypes.bool,
    version           :   PropTypes.string,
    id                :   PropTypes.string
  };

  render () {
    const url = ['https:/', 'res.cloudinary.com', 'hscbexf6a', 'image', 'upload'];

    const filters = [];

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
