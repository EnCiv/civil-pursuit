'use strict';

!(function () {

  'use strict';

  function mean(a, b) {
    var sum = a + b;

    if (!sum) {
      return 0;
    }

    return Math.ceil(a / sum * 100);
  }

  function getHarmony() {

    if (this.type === 'Problem') {
      return mean(this.related.Agree, this.related.Disagree);
    } else if (this.type === 'Solution') {
      return mean(this.related.Pro, this.related.Con);
    }

    return null;
  }

  module.exports = getHarmony;
})();