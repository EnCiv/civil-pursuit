! function () {

  'use strict';

  var panelItems;

  var tests = [
    {
      title: 'There should be a Panel extension',
      assert: function () {
        return Synapp.extension ('Panel');
      }
    },

    {
      title: 'There should be a Item extension',
      assert: function () {
        return Synapp.extension ('Item');
      }
    },

    {
      title: 'Panel extension should emit "panel added"',
      when: {
        emitter: Synapp.extension('Panel'),
        receives: 'panel added'
      },
      assert: function () {
        return true;
      }
    },

    {
      title: 'Socket should emit "got items"',
      when: {
        emitter: Synapp.emitter('socket'),
        receives: 'got items',
        saveAs: 'panelItems'
      },
      assert: function () {
        panelItems = this.panelItems;
        return true;
      }
    },

    {
      title: 'Socket should have returned panelItems, which is an object',
      when: {
        emitter: Synapp.emitter('socket'),
        receives: 'got items'
      },
      assert: function () {
        return panelItems.constructor === Object ;
      }
    },

    {
      title: 'panelItems should have property panel which is a panel object',
      when: {
        emitter: Synapp.emitter('socket'),
        receives: 'got items'
      },
      assert: function () {
        return panelItems.panel.constructor === Object &&
          panelItems.panel.type === 'Topic';
      }
    },

    {
      title: 'panelItems should have property items which is an Array',
      when: {
        emitter: Synapp.emitter('socket'),
        receives: 'got items'
      },
      assert: function () {
        return Array.isArray(panelItems.items);
      }
    },

    {
      title: 'panelItems items length should be batch size',
      when: {
        emitter: Synapp.emitter('socket'),
        receives: 'got items'
      },
      assert: function () {
        return panelItems.items.length === synapp['navigator batch size'];
      }
    },

    {
      title: 'Load more button should be visible',
      when: {
        emitter: Synapp.emitter('socket'),
        receives: 'got items'
      },
      assert: function () {
        return $('#panel-Topic .load-more:visible').length;
      }
    }
  ];

  mothership(tests);

} ();
