'use strict';

import run from '../lib/util/run';
import ItemModel from '../models/item';
import cloudinary from '../lib/util/cloudinary-format';

function formatCloudinaryImage (event, url, _id) {
  run(
    d => {
      this.ok(event, cloudinary(url), _id);
    },
    
    this.error.bind(this)
  );
}

export default formatCloudinaryImage;
