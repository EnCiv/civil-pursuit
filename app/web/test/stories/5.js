! function () {

  'use strict';

  var script = document.createElement('script');
  script.src = "https://cdn.rawgit.com/jprichardson/string.js/master/lib/string.min.js";

  $('body').append($(script));

  var itemBox;

  var tests = [
    {
      title: 'There should be an item box',
      assert: function () {
        itemBox = $('#panel-Topic .items .item').eq(0);
        return itemBox.length;
      }
    },

    {
      title: 'Item box should have a title which is a link',
      assert: function () {
        return itemBox.find('h4.item-title:eq(0) a').length;
      }
    },

    {
      title: 'Link should resolve to item static page',
      assert: function () {
        var link = itemBox.find('h4.item-title:eq(0) a');

        return link.attr('href') === '/item/' +
          itemBox.attr('id').replace(/^item-/, '') + '/' +
          S(itemBox.find('.item-title').text()).slugify();
      }
    },

    {
      title: 'Item box should have a description',
      assert: function () {
        return itemBox.find('.description').not(':empty').length;
      }
    },

    {
      title: 'There should be a Promote button',
      assert: function () {
        return itemBox.find('.toggle-promote').length;
      }
    },

    {
      title: 'There should be a promoted element which reads a number',
      assert: function () {
        return itemBox.find('.promoted').length &&
          /^\d+$/.test(itemBox.find('.promoted').text());
      }
    },

    {
      title: 'There should be a promoted-percent element which reads a percentile number',
      assert: function () {
        return itemBox.find('.promoted-percent').length &&
          /^\d+%$/.test(itemBox.find('.promoted-percent').text());
      }
    },

    {
      title: 'There should be a Details button',
      assert: function () {
        return itemBox.find('.toggle-details').length;
      }
    },

    {
      title: 'There should be a toggle arrow',
      assert: function () {
        return itemBox.find('.toggle-arrow').length;
      }
    },

    {
      title: 'There should be an image',
      assert: function () {
        return itemBox.find('.item-media img').length;
      }
    }
  ];

  Synapp.emitter('socket').once('got items', function () {
    setTimeout(function () {
      mothership(tests);
    }, 1000);
  });

} ();
