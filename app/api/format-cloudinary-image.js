'use strict';

import run from 'syn/lib/util/run';
import ItemModel from 'syn/models/item';
import cloudinary from 'syn/lib/util/cloudinary-format';

function formatCloudinaryImage (event, url, _id) {
  run(
    d => {
      this.ok(event, cloudinary(url), _id);
    },
    
    this.error.bind(this)
  );
}

export default formatCloudinaryImage;
