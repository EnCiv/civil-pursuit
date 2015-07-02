'use strict';

import View from 'syn/components/youtube/view';

function YouTube (url) {
  let yt = new View({ url: url, settings: { env: synapp.env } });
}

export default YouTube;