! function () {

  'use strict';

  var $item, details, itemId;

  var tests = [
    {
      title: 'There should be a toggle details button',
      assert: function () {
        $item = $('#panel-Topic .items .item:eq(0)');
        itemId = $item.attr('id').replace(/^item-/, '');
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
    },

    {
      title: 'There should be a progress bar with promotion',
      wait: 1750,
      assert: function () {
        return $item.find('.details .progress-bar').length;
      }
    },

    {
      title: 'Socket should emit got item details',
      when: {
        emitter: Synapp.emitter('socket'),
        receives: 'got item details',
        saveAs: 'details'
      },
      assert: function () {
        details = this.details;
        return true;
      }
    },

    {
      title: 'Details should be an object',
      when: {
        emitter: Synapp.emitter('socket'),
        receives: 'got item details'
      },
      assert: function () {
        console.log(details);
        return typeof details === 'object';
      }
    },

    {
      title: 'Details should be have an array of criterias (not empty)',
      when: {
        emitter: Synapp.emitter('socket'),
        receives: 'got item details'
      },
      assert: function () {
        return Array.isArray(details.criterias) && details.criterias.length;
      }
    },

    {
      title: 'Details should be have an array of feedback',
      when: {
        emitter: Synapp.emitter('socket'),
        receives: 'got item details'
      },
      assert: function () {
        return Array.isArray(details.feedbacks);
      }
    },

    {
      title: 'Details should have an item which is an object and has the same _id as $item',
      when: {
        emitter: Synapp.emitter('socket'),
        receives: 'got item details'
      },
      assert: function () {
        return typeof details.item === 'object' && details.item._id === itemId;
      }
    },

    {
      title: 'Details should have an object votes',
      when: {
        emitter: Synapp.emitter('socket'),
        receives: 'got item details'
      },
      assert: function () {
        return typeof details.votes === 'object';
      }
    }
  ];

  Synapp.emitter('socket').once('got items', function () {
    setTimeout(function () {
      mothership(tests);
    }, 1000);
  });

} ();
