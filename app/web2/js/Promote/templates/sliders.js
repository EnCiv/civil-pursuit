! function () {

  'use strict';

  module.exports = {
    template: '.criteria-slider.template-model:first',
    controller: function (view, criteria) {
      
      view.find('.criteria-name').text(criteria.name);

      view.find('input[type="range"]').rangeslider();
    }
  };

} ();
