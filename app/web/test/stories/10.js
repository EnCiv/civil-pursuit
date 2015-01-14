! function () {

  'use strict';

  var $item;

  var tests = [
    {
      title: 'There should be a load more topics link',
      assert: function () {
        return $('#panel-Topic .load-more:visible').length;
      }
    },

    {
      title: 'Clicking on load more topics link, then socket should emit get items',
      before: function () {
        $('#panel-Topic .load-more').click();
      },
      assert: function () {
        return $('#panel-Topic .load-more:visible').length;
      }
    }
  ];

  Synapp.emitter('socket').once('got items', function () {
    setTimeout(function () {
      mothership(tests);
    }, 1000);
  });

} ();
