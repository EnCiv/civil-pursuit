'use strict';

import path         from 'path';
import { Domain }   from 'domain';
import cloudinary   from '../../../lib/app/cloudinary';
import config       from '../../../../secret.json';

function saveImage (userId, image) {
  return new Promise((ok, ko) => {
    try {
      let d = new Domain().on('error', ko);

      cloudinary.uploader.upload(path.join(config.tmp, image), result => {
        try {
          this.update(
            { _id : userId }, { image : result.url },
            d.intercept(() => ok(result))
          );
        }
        catch ( error ) {
          ko(error);
        }
      });
    }
    catch ( error ) {
      ko(error);
    }
  });
}

export default saveImage;

var foo = 2;
