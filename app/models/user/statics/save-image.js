'use strict';

import path                   from 'path';
import cloudinary             from '../../../server/util/cloudinary';
import config                 from '../../../../secret.json';
import Mungo                  from 'mungo';

function saveImage (query, image) {
  return new Promise((ok, ko) => {
    try {

      if ( query instanceof Mungo.ObjectID || typeof query === 'string' || query instanceof Mungo.Model ) {
        query = { _id : query };
      }

      const pathToImage = path.join(config.tmp, image);

      cloudinary.uploader.upload(pathToImage, result => {
        try {
          if ( result instanceof Error ) {
            throw error;
          }
          this
            .updateOne(query, { image : result.url })
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
