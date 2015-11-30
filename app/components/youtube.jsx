'use strict';

import React                  from 'react';
import itemType               from '../lib/proptypes/item';

class YouTube extends React.Component {

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  static propTypes = {
    item : itemType
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  static isYouTube (item) {
    let is = false;

    let references = item.references || [];

    if ( references.length ) {
      let url = references[0].url;

      if ( YouTube.regex.test(url) ) {
        is = true;
      }
    }

    return is;
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  static getId (url) {
    let youTubeId;

    url.replace(YouTube.regex, (m, v) => youTubeId = v);

    return youTubeId;
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  render () {
    let { item } = this.props;

    let { url } = item.references[0];

    let youTubeId = YouTube.getId(url);

    return (
      <div className="video-container">
        <iframe allowFullScreen frameBorder="0" width="300" height="175" src={ `http://www.youtube.com/embed/${youTubeId}?autoplay=0` }>
        </iframe>
      </div>
    );
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
}

YouTube.regex = /youtu\.?be.+v=([^&]+)/;

export default YouTube;
