'use strict';

import React              from 'react';
import Creator            from './creator';
import Youtube            from './youtube';
import itemType           from '../lib/proptypes/item';

class EditAndGoAgain extends React.Component {
  render () {
    const { item } = this.props;

    let video;

    if ( Youtube.isYouTube(item) ) {
      video = item.references[0].url;
    }

    return (
      <section className="edit-and-go-again">
        <Creator
          item      =   { item }
          image     =   { item.image }
          video     =   { video }
          type      =   { item.type }
          />
      </section>
    );
  }
}

export default EditAndGoAgain;
