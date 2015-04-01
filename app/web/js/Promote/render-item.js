! function () {
  
  'use strict';

  var Nav = require('../Nav');

  /**
   *  @function
   *  @return
   *  @arg
   */

  function renderItem (hand) {
    var promote = this;

    var reverse = hand === 'left' ? 'right' : 'left';

    if ( ! this.evaluation[hand] ) {
      this.find('item subject', hand).hide();
      this.find('item description', hand).hide();
      this.find('item feedback', hand).hide();
      this.find('sliders', hand).hide();
      this.find('promote button', hand).hide();
      this.find('promote label').hide();
      this.find('edit and go again button', hand).hide();
      this.find('promote button', reverse).hide();
      this.find('edit and go again button', reverse).hide();
      // this.find('finish button').hide();
      return;
    }

    // Increment views counter

    app.socket.emit('add view', this.evaluation[hand]._id);

    // Subject

    this.find('item subject', hand).text(this.evaluation[hand].subject);

    // Description

    this.find('item description', hand).text(this.evaluation[hand].description);

    // Image

    this.find('item image', hand).empty().append(
      new (require('../Item'))(this.evaluation[hand]).media());

    // References

    if ( this.evaluation[hand].references && this.evaluation[hand].references.length ) {
      this.find('item references', hand)
        .attr('href', this.evaluation[hand].references[0].url)
        .text(this.evaluation[hand].references[0].title || this.evaluation[hand].references[0].url);
    }

    // Sliders

    promote.find('sliders', hand).find('.criteria-name').each(function (i) {
      var cid = i;

      if ( cid > 3 ) {
        cid -= 4;
      }

      promote.find('sliders', hand).find('.criteria-name').eq(i)
        .on('click', function () {
          var self = $(this);
          var descriptionSection = self.closest('.criteria-wrapper').find('.criteria-description-section');

          Nav.hide(self.closest('.promote').find('.criteria-description-section.is-shown'), app.domain.intercept(function () {
            Nav.toggle(descriptionSection);
          }));

          
        })
        .text(promote.evaluation.criterias[cid].name);
      promote.find('sliders', hand).find('.criteria-description').eq(i).text(promote.evaluation.criterias[cid].description);
      promote.find('sliders', hand).find('input').eq(i)
        .val(0)
        .data('criteria', promote.evaluation.criterias[cid]._id);
    });

    // Persona

    promote.find('item persona image', hand).attr('src', promote.evaluation[hand].user.image);

    promote.find('item persona name', hand).text(promote.evaluation[hand].user.first_name);

    // Feedback

    promote.find('item feedback', hand).val('');

    // Feedback - remove any marker from previous post / see #164

    promote.find('item feedback', hand).removeClass('do-not-save-again');

    // Promote button

    promote.find('promote button', hand)
      .text(this.evaluation[hand].subject)
      .off('click')
      .on('click', function () {

        var left = $(this).closest('.left-item').length;

        var opposite = left ? 'right' : 'left';

        Nav.scroll(promote.template, app.domain.intercept(function () {

          // If cursor is smaller than limit, then keep on going
        
          if ( promote.evaluation.cursor < promote.evaluation.limit ) {

            promote.edit('cursor', promote.evaluation.cursor + 1);

            app.socket.emit('promote', promote.evaluation[left ? 'left' : 'right']._id);

            promote.save(left ? 'left' : 'right');

            $.when(
              promote
                .find('side by side')
                .find('.' + opposite + '-item')
                .animate({
                  opacity: 0
                })
            )
              .then(function () {
                promote.edit(opposite, promote.evaluation.items[promote.evaluation.cursor]);

                promote
                  .find('side by side')
                  .find('.' + opposite + '-item')
                  .animate({
                    opacity: 1
                  });
              });
          }

          // If cursor equals limit, means end of evaluation cycle

          else {

            promote.finish();

          }

        }));
      });
  
    // Edit and go again

    promote.find('edit and go again button', hand).on('click', function () {
      Nav.unreveal(promote.template, promote.item.template, app.domain.intercept(function () {
        return;

        if ( self.item.find('editor').find('form').length ) {
          console.warn('already loaded')
        }

        else {
          var edit = new Edit(self.item);
            
          edit.get(app.domain.intercept(function (template) {

            self.item.find('editor').find('.is-section').append(template);

            Nav.reveal(self.item.find('editor'), self.item.template,
              app.domain.intercept(function () {
                Nav.show(template, app.domain.intercept(function () {
                  edit.render();
                }));
              }));
          }));

        }

      }));
    });

  }

  module.exports = renderItem;

} ();
