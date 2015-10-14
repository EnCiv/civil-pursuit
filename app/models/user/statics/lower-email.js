'use strict';

function lowerEmail (doc) {
  return new Promise((ok, ko) => {
    try {
      doc.set('email', doc.email.toLowerCase());
      ok();
    }
    catch ( error ) {
      ko(error);
    }
  });
}

export default lowerEmail;
