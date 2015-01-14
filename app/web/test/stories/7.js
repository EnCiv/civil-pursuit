! function () {

  'use strict';

  var $item;

  var tests = [
    {
      title: 'There should be an extension Evaluation',
      assert: function () {
        return Synapp.extension('Evaluation');
      }
    },

    {
      title: 'Extension Evaluation should have model "evaluations" which is an array',
      assert: function () {
        return Array.isArray(Synapp.extension('Evaluation').model('evaluations'));
      }
    },

    {
      title: 'Extension Evaluation model "evaluations" should be empty',
      assert: function () {
        return ! Synapp.extension('Evaluation').model('evaluations').length;
      }
    },

    {
      title: 'There should be a toggle promote button',
      assert: function () {
        $item = $('#panel-Topic .items .item:eq(0)')
        return $item.find('button.toggle-promote').length;
      }
    },

    {
      title: 'Clicking on promote should transform item box to the point of attention',
      before: function () {
        $item.find('button.toggle-promote').click();
      },
      wait: 1500,
      assert: function () {
        return ($item.offset().top - $(window).scrollTop()) < 150;
      }
    },

    {
      title: 'Evaluator Screen should be visible',
      wait: 1750,
      assert: function () {
        return $item.find('.evaluator').css('opacity') === '1';
      }
    },

    {
      title: 'Extension Evaluation model evaluations should have 1 evaluation',
      wait: 2000,
      assert: function () {
        return Synapp.extension('Evaluation').model('evaluations').length === 1;
      }
    }
  ];

  Synapp.emitter('socket').once('got items', function () {
    setTimeout(function () {
      mothership(tests);
    }, 1000);
  });

} ();
