! function () {

  'use strict';

  var $item, first = true;

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
    },

    {
      title: 'There should be 5 more topics',
      when: {
        emitter: Synapp.emitter('socket'),
        receives: 'got items'
      },
      wait: 1000,
      assert: function () {
        if ( ! first ) {
          return $('#panel-Topic .items .item').length === 11;
        }
      }
    }
  ];

  Synapp.emitter('socket').once('got items', function () {
    first = false;
    setTimeout(function () {
      mothership(tests);
    }, 1000);
  });

} ();
