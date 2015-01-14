! function () {

  'use strict';

  var fakeItem;

  var tests = [
    {
      title: 'Creating a fake topic with long text',
      before: function () {
        fakeItem = $('#panel-Topic .items .item:eq(0)').clone();
        fakeItem.insertBefore($('#panel-Topic .items .item:eq(0)'));
        fakeItem.find('.item-title').text('Fake item for testing purposes');

        var des = '';

        for ( var i = 0; i < 100; i ++ ) {
          des += 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.' + "\n\n";
        }

        fakeItem.find('.description').eq(0).text(des);
      },
      assert: function () {
        return typeof $ === 'function';
      }
    },

    {
      title: 'Applying truncator - item should now have class is-truncated',
      before: function () {
        new (Synapp.extension('Item').controller('truncate'))(fakeItem);
      },
      wait: 500,
      assert: function () {
        return fakeItem.hasClass('is-truncated');
      }
    },

    {
      title: 'There should be a truncator element',
      wait: 1000,
      assert: function () {
        return fakeItem.find('span.truncator').length;
      }
    },

    {
      title: 'Truncator should have an i element with 3 dots followed by a white space',
      wait: 1000,
      assert: function () {
        return fakeItem.find('span.truncator i').length &&
          fakeItem.find('span.truncator i').text() === '... ';
      }
    },

    {
      title: 'On clicking on truncator, it should scroll to the POA',
      before: function () {
        this.currentScroll = $(window).scrollTop();

        return fakeItem.find('span.truncator a').click();
      },
      wait: 3000,
      assert: function () {
        return $(window).scrollTop() !== this.currentScroll;
      }
    }
  ];

  Synapp.emitter('socket').once('got items', function () {
    setTimeout(function () {
      mothership(tests);
    }, 1000);
  });

} ();
