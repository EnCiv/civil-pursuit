! function () {

  'use strict';

  var panelTopic;
  var plusSign;
  var creator;
  var buttonCreate;
  var itemSubject = '[TEST] - SUBJECT - ' + Date.now();
  var itemDescription = '[TEST] - DESCRIPTION - ' + Date.now();

  var tests = [
    {
      title: 'There should be a Topics panel after at least 2 seconds',
      wait: 2000, 
      assert: function () {
        panelTopic = $('#panel-Topic');
        return panelTopic.length;
      }
    },

    {
      title: 'There should be a + sign on panel header of Topics panel',
      wait: 2000, 
      assert: function () {
        plusSign = $('#panel-Topic .panel-heading .fa.fa-plus:visible');
        return plusSign.length;
      }
    },

    {
      title: 'The + sign should have a class to toggle Creator Screen visibility',
      wait: 2000, 
      assert: function () {
        return plusSign.hasClass('toggle-creator') && plusSign.is(':visible');
      }
    },

    {
      title: 'The Creator Screen of the Topics panel should exist and have zero opacity',
      wait: 2000,
      assert: function () {
        creator = $('#panel-Topic .creator');
        return creator.length && ! +(creator.css('opacity'));
      }
    },

    {
      title: 'On clicking on the + sign, the Creator Screen of the Topics panel should show after 1 second',
      wait: 1500,
      waitBefore: 2500,
      before: function () {
        panelTopic.find('.toggle-creator').click();
      },
      assert: function () {
        return +(creator.css('opacity')) === 1;
      }
    },

    {
      title: 'On clicking on Promote in the Creator Screen with the subject field empty, the subject field should have an "error" class and be the only field to have an error class',
      waitBefore: 4000,
      before: function () {
        buttonCreate = $('#panel-Topic .button-create');
        buttonCreate.click();
      },
      wait: 500,
      assert: function () {
        return panelTopic.find('[name="subject"]').hasClass('error')
          && creator.find('.error').length === 1;
      }
    },

    {
      title: 'On clicking on Promote in the Creator Screen with the subject field filled and the description field empty, the description field should have an "error" class and be the only field to have an error class',
      waitBefore: 5000,
      before: function () {
        panelTopic.find('[name="subject"]').val(itemSubject);
        buttonCreate.click();
      },
      wait: 500,
      assert: function () {
        return panelTopic.find('[name="description"]').hasClass('error')
          && creator.find('.error').length === 1;
      }
    },

    {
      title: 'On clicking on Promote in the Creator Screen with both subject and description fields filled, there should be no more error classes',
      waitBefore: 6000,
      before: function () {
        panelTopic.find('[name="description"]').val(itemDescription);
        buttonCreate.click();
      },
      assert: function () {
        return ! creator.find('.error').length;
      }
    },

    {
      title: 'On item created event received by socket listener, it should push a new item to model items which has the same (subject + description + type) than item just created',
      when: {
        emitter: Synapp.emitter('socket'),
        receives: 'created item',
        saveAs: 'item'
      },
      assert: function () {
        return this.item.subject === itemSubject
          && this.item.description === itemDescription
          && this.item.type === 'Topic';
      }
    }
  ];

  mothership(tests);

} ();
