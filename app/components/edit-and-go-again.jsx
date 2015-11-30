'use strict';

import React              from 'react';
import Creator            from './creator';
import Youtube            from './youtube';
import itemType           from '../lib/proptypes/item';

class EditAndGoAgain extends React.Component {
  static propTypes = {
    item : itemType
  }

  render () {
    const { item } = this.props;

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
