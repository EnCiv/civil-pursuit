'use strict';

import cloudinary from 'syn/lib/util/cloudinary';

function formatImage (url) {
  let id = url.split(/\//).pop();

  let image = cloudinary.image(id, {
      width         :   240,
      height        :   135,
      crop          :   'thumb',
      gravity       :   'face'
    }
  );

  let src;

  image.replace(/src='([^']+)'/, (m, url) => {
    src = url;
  });

  return src;
}

export default formatImage;
