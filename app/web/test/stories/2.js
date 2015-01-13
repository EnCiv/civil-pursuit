! function () {

  'use strict';

  var intro, Intro;

  var tests = [
    {
      title: 'There should be an Intro extension',
      assert: function () {
        return Synapp.extension('Intro');
      }
    },

    {
      title: 'Intro extension should have an intro model which is null',
      assert: function () {
        return Synapp.extension('Intro').model('intro') === null;
      }
    },

    {
      title: 'There should be an element with id #intro',
      assert: function () {
        intro = $('#intro');
        return intro.length;
      }
    },

    {
      title: 'There should be a spinning icon as intro title before intro gets loaded',
      assert: function () {
        return intro.find('span.iddle i.fa.fa-circle-o-notch.fa-spin').length;
      }
    },

    {
      title: 'Socket should emit a got intro event',
      when: {
        emitter: Synapp.emitter('socket'),
        receives: 'got intro',
        saveAs: 'intro'
      },
      assert: function () {
        Intro = this.intro;
        return true;
      }
    },

    {
      title: 'Model intro should not be null any more',
      when: {
        emitter: Synapp.emitter('socket'),
        receives: 'got intro',
        saveAs: 'intro'
      },
      assert: function () {
        return Synapp.extension('Intro').model('intro') !== null;
      }
    },

    {
      title: 'Model intro should not be null any more',
      when: {
        emitter: Synapp.emitter('socket'),
        receives: 'got intro'
      },
      assert: function () {
        return Synapp.extension('Intro').model('intro') !== null;
      }
    },

    {
      title: 'Panel title should be intro title',
      when: {
        emitter: Synapp.emitter('socket'),
        receives: 'got intro'
      },
      wait: 1000,
      assert: function () {
        return intro.find('.panel-title').text() === Intro.subject;
      }
    }
  ];

  mothership(tests);

} ();
