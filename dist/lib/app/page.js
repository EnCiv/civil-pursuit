'use strict';

!(function () {

  'use strict';

  var S = require('string');

  function Page(page, more) {

    switch (page) {

      case 'Error':
        return '/error';

      case 'Home':
        return '/';

      case 'Item Page':
        return '/item/' + more.id + '/' + S(more.subject).slugify().s;

      case 'Terms Of Service':
        return '/page/terms-of-service';

      case 'Profile':
        return '/page/profile';

      case 'Sign Out':
        return '/sign/out';

      case 'Sign With Facebook':
        return '/sign/facebook';

      case 'Sign With Twitter':
        return '/sign/twitter';

      default:
        throw new Error('Page not registered: ' + page);
    }
  }

  module.exports = Page;
})();