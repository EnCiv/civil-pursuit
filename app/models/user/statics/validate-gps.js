'use strict';

function validateGPS (user) {
  return new Promise((ok, ko) => {
    try {
      if ( Array.isArray(user.gps) && ! user['gps validated'] ) {
        user.set('gps validated', Date.now());
      }
      ok();
    }
    catch ( error ) {
      ko(error);
    }
  });
}

export default validateGPS;
