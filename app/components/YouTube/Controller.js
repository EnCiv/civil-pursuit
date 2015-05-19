'use strict';

import View from 'syn/components/YouTube/View';

function YouTube (url) {
  return View({ url: url, settings: { env: synapp.env } });
}

export default YouTube;