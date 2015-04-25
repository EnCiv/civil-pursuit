! function () {
  
  'use strict';

  var S = require('string');

  function Page (page, more) {

    switch (page) {
      case 'Home':
        return '/';

      case 'Item Page':
        return '/item/' + more._id + '/' + S(more.subject).slugify().s;

      case 'Terms Of Service':
        return '/page/terms-of-service';

      case 'Profile':
        return '/page/profile';

      case 'Sign Out':
        return '/page/sign-out';
    }
  }

  module.exports = Page;

} ();
