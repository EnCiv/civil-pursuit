'use strict';

class V1 {
  static do () {
    return new Promise((ok, ko) => {
      try {
        this
          .update({ __V : { $exists : false } }, { __V : 2 })
          .then(ok, ko);
      }
      catch ( error ) {
        ko(error);
      }
    });
  }

  static undo () {
    return this.remove({ __V : 2 });
  }
}

export default V1;
