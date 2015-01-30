! function () {

  'use strict';

  var tests = [
    {
      title: 'jQuery should be present',
      assert: function () {
        return typeof $ === 'function';
      }
    },

    {
      title: 'There should be a global variable named Synapp',
      assert: function () {
        return typeof Synapp !== 'undefined';
      }
    },

    {
      title: 'Synapp should be a instance of TrueStory',
      assert: function () {
        return Synapp.constructor.name === 'TrueStory';
      }
    },

    {
      title: 'There should be a io global variable for socket.io',
      assert: function () {
        return typeof io === 'function';
      }
    }
  ];

  mothership(tests);

} ();
