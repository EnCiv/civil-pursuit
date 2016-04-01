'use strict';

import emitter            from 'syn/../../dist/lib/app/emitter';
import Migration          from './migration';
import encryptPassword    from './hooks/encrypt-password';
import lowerEmail         from './hooks/lower-email';
import validateGPS        from './hooks/validate-gps';

class Hook extends Migration {
  static inserting () {
    return [
      this.encryptPassword.bind(this),
      this.lowerEmail.bind(this)
    ];
  }

  static updating () {
    return [
      this.validateGPS.bind(this)
    ];
  }

  static updated () {
    return [
      this.emit.bind(this, 'update')
    ];
  }

  static emit(event, user) {
    return new Promise((ok, ko) => {
      emitter.emit(event, 'users', user);
    });
  }

  static encryptPassword (...args) {
    return encryptPassword.apply(this, args);
  }

  static lowerEmail (...args) {
    return lowerEmail.apply(this, args);
  }

  static validateGPS (...args) {
    return validateGPS.apply(this, args);
  }

}

export default Hook;
