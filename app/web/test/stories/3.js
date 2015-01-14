! function () {

  'use strict';

  var TopicsPanel;

  var tests = [
    {
      title: 'There should be a Panel extension',
      assert: function () {
        return Synapp.extension ('Panel');
      }
    },

    {
      title: 'Panel extension should have a model "panels" which is an Array',
      assert: function () {
        return Array.isArray(Synapp.extension('Panel').model('panels'));
      }
    },

    {
      title: 'Panel extension model "panels" should get pushed with an object which type is "Topic", size is default batch size, and skip is 0',
      when: {
        emitter: Synapp.extension('Panel'),
        receives: 'push panels'
      },
      assert: function () {
        return Synapp.extension('Panel').model('panels')[0] &&
          typeof Synapp.extension('Panel').model('panels')[0] === 'object' &&
          Synapp.extension('Panel').model('panels')[0].type === 'Topic' &&
          Synapp.extension('Panel').model('panels')[0].size === synapp['navigator batch size'] &&
          Synapp.extension('Panel').model('panels')[0].skip === 0;
      }
    },

    {
      title: 'There should be a topics panel now',
       when: {
        emitter: Synapp.extension('Panel'),
        receives: 'push panels'
      },
      wait: 1000,
      assert: function () {
        return $('#panel-Topic').length;
      }
    },

    {
      title: 'Topics panel header should read Topic',
       when: {
        emitter: Synapp.extension('Panel'),
        receives: 'push panels'
      },
      wait: 1000,
      assert: function () {
        return $('#panel-Topic .panel-title').text() === 'Topic';
      }
    },

    {
      title: 'Extension Panel should emit a "panel added" event',
       when: {
        emitter: Synapp.extension('Panel'),
        receives: 'panel added',
        saveAs: 'panel'
      },
      assert: function () {
        return typeof this.panel === 'object' && this.panel.type === 'Topic';
      }
    }
  ];

  mothership(tests);

} ();
