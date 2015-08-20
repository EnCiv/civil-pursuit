'use strict';

import React              from 'react';
import Creator            from './creator';
import Youtube            from './youtube';

class EditAndGoAgain extends React.Component {
  render () {
    let { item } = this.props;

    let video;

    if ( Youtube.isYouTube(item) ) {
      video = item.references[0].url;
    }

    return (
      <section>
        <Creator item={ item } image={ item.image } video={ video } type={ item.type } />
      </section>
    );
  }
}

export default EditAndGoAgain;
