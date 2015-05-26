'use strict';

import {Element} from 'cinco/es5';

class YouTube extends Element {

  constructor (props) {
    super('.video_container');

    if ( props.item && props.settings.env !== 'development' ) {
      let references = props.item.references || [];

      if ( references.length ) {
        let url = references[0].url;

        if ( YouTube.regex.test(url) ) {
          this.add(
            this.iframe()
          );
        }
      }
    }
  }

  iframe (url) {
    let youTubeId;

    url.replace(url, (m, v) => youTubeId = v);

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
