'use strict';

class Is {
  static lesserThan (max) {
    return value => {

      if ( typeof value === 'string' ) {
        return value.length < max;
      }

      else if ( typeof value === 'number' ) {
        return value < max;
      }

    };
  }

  static url () {
    return url => /^https?:\/\//.test(url);
  }
}

export default Is;
