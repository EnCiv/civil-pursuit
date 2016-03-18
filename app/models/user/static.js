'use strict';

import Hook                             from './hook';
import identify                         from './statics/identify';
import isPasswordValid                  from './statics/is-password-valid';
import saveImage                        from './statics/save-image';
import resetPassword                    from './statics/reset-password';
import lambda                           from './statics/lambda';

class User extends Hook {
  static saveImage (...args) {
    return saveImage.apply(this, args);
  }

  static resetPassword (...args) {
    return resetPassword.apply(this, args);
  }

  static lambda (...args) {
    return lambda.apply(this, args);
  }

  static identify (...args) {
    return identify.apply(this, args);
  }

  static isPasswordValid (...args) {
    return isPasswordValid.apply(this, args);
  }
}

export default User;
