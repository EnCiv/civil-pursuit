! function () {

  'use strict';

  var $item;

  var tests = [
    {
      title: 'There should be a toggle details button',
      assert: function () {
        $item = $('#panel-Topic .items .item:eq(0)')
        return $item.find('button.toggle-details').length;
      }
    },

    {
      title: 'Clicking on details should transform item box to the point of attention',
      before: function () {
        $item.find('button.toggle-details').click();
      },
      wait: 1500,
      assert: function () {
        return ($item.offset().top - $(window).scrollTop()) < 150;
      }
    },


    {
      title: 'Details screen should be visible',
      wait: 1750,
      assert: function () {
        return $item.find('.details:visible').length;
      }
    }
  ];

  Synapp.emitter('socket').once('got items', function () {
    setTimeout(function () {
      mothership(tests);
    }, 1000);
  });

} ();
