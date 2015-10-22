'use strict';

import path         from 'path';
import cloudinary   from '../../../lib/app/cloudinary';
import config       from '../../../../secret.json';

function saveImage (userId, image) {
  return new Promise((ok, ko) => {
    try {
      console.log('//////////////////////////////////////////////////////////////', userId, image, config.tmp)
      const pathToImage = path.join(config.tmp, image);

      cloudinary.uploader.upload(pathToImage, result => {
        try {
          if ( result instanceof Error ) {
            console.log(error);
            throw error;
          }
          console.log(result)
          this
            .updateById(userId, { image : result.url })
            .then(ok, ko);
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
