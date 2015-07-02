'use strict';

import {Element} from 'cinco/dist';

class YouTube extends Element {

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

  static getId (url) {
    let youTubeId;

    url.replace(YouTube.regex, (m, v) => youTubeId = v);

    return youTubeId;
  }

  constructor (props) {
    super('.video-container');

    if ( props.item && props.settings.env !== 'development2' ) {

      if ( YouTube.isYouTube(props.item) ) {
        this.add(
          this.iframe(props.item.references[0].url)
        );
      }

    }
  }

  iframe (url) {
    let youTubeId = YouTube.getId(url);

    return new Element('iframe[allowfullscreen]', {
      frameborder   :   "0",
      width         :   "300",
      height        :   "175",
      src           :   'http://www.youtube.com/embed/' + youTubeId + '?autoplay=0'
    });
  }

}

YouTube.regex = /youtu\.?be.+v=([^&]+)/;

export default YouTube;
