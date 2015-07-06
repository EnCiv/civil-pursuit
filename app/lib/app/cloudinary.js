'use strict';

import cloudinary from 'cloudinary';
import config from '../../../config.json';

cloudinary.config({ 
  cloud_name      :   config.cloudinary.cloud.name, 
  api_key         :   config.cloudinary.API.key, 
  api_secret      :   config.cloudinary.API.secret 
});

export default cloudinary;
