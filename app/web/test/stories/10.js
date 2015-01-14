! function () {

  'use strict';

  var $item, top;

  var tests = [
    {
      title: 'There should be a toggle arrow',
      assert: function () {
        $item = $('#panel-Topic .items .item').eq(0);
        top = $(window).scrollTop();

        return $item.find('.toggle-arrow i.fa').length;
      }
    },

    {
      title: 'Clicking on toggle arrow it should scroll to POA',
      before: function () {
        $item.find('.toggle-arrow i.fa').click();
      },
      wait: 1500,
      assert: function () {
        return $(window).scrollTop() !== top;
      }
    }
  ];

  Synapp.emitter('socket').once('got items', function () {
    setTimeout(function () {
      mothership(tests);
    }, 1000);
  });

} ();
