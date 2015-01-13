! function () {

  'use strict';

  var panelTopic;
  var plusSign;
  var creator;
  var buttonCreate;
  var itemSubject = '[TEST] - SUBJECT - ' + Date.now();
  var itemDescription = '[TEST] - DESCRIPTION - ' + Date.now();

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
    }
  ];

  mothership(tests);

} ();
