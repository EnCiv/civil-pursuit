'use strict';

import path from 'path';
import { Domain } from 'domain';
import cloudinary from '../../../lib/app/cloudinary';
import config from '../../../../config.json';

function saveImage (userId, image) {
  return new Promise((ok, ko) => {
    let d = new Domain().on('error', ko);

    cloudinary.uploader.upload(path.join(config.tmp, image), result => {
      this.update({ _id : userId }, { image : result.url },
        d.intercept(() => ok(result)));
    });
  });
}

export default saveImage;

var foo = 2;
