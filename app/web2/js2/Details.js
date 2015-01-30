! function () {

  'use strict';

  function Details(item) {
    if ( ! app ) {
      throw new Error('Missing app');
    }

    var self = this;

    app.domain.run(function () {
      if ( ! item || item.constructor.name !== 'Item' ) {
        throw new Error('Item must be an Item');
      }

      self.item = item;

      self.template = item.find('details');

      if ( ! self.template.length ) {
        throw new Error('Template not found');
      }
    });
  }

  Details.prototype.find = function (name) {
    switch ( name ) {
      case 'promoted bar':
        return this.template.find('.progress-bar');

      case 'feedback list':
        return this.template.find('.feedback-list');

      case 'votes':
        return this.template.find('.details-votes');
    }
  };

  Details.prototype.render = function (cb) {
    var self = this;

    var item = self.item.item;

    self.find('promoted bar')
      .css('width', Math.floor(item.promotions * 100 / item.views) + '%')
      .text(Math.floor(item.promotions * 100 / item.views) + '%');

    if ( ! self.details ) {
      app.socket.emit('get item details', self.item.item._id);

      app.socket.once('got item details', function (details) {
        self.details = details;

        console.log('details', details)

        // Feedback

        details.feedbacks.forEach(function (feedback) {
          var tpl = $('<div class="pretext feedback"></div>');
          tpl.text(feedback.feedback);
          self.find('feedback list')
            .append(tpl)
            .append('<hr/>');

        });

        // Votes

        details.criterias.forEach(function (criteria, i) {
          self.find('votes').eq(i).find('h4').text(criteria.name);
        });

        // details.votes.forEach(function (vote) {

        // });

      });
    }
  };

  module.exports = Details;

} ();
