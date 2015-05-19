'use strict';

import Nav from 'syn/lib/util/Nav';
import Edit from 'syn/components/EditAndGoAgain/Controller';
import Item from 'syn/components/Item/Controller';

/**
 *  @function
 *  @return
 *  @arg
 */

function renderItem (hand) {
  let self = this;

  var reverse = hand === 'left' ? 'right' : 'left';

  var side = this.get(hand);

  if ( ! side ) {
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

  console.log('Adding view', hand, side.subject, side._id)

  this.publish('add view', side._id)
    .subscribe(pubsub => pubsub.unsubscribe());

  // Subject
  this.find('item subject', hand).text(side.subject);

  // Description

  this.find('item description', hand).text(side.description);

  // Image

  this.find('item image', hand).empty().append(
    new Item({ item: side }).media()
  );

  // References

  if ( side.references && side.references.length ) {
    this.find('item references', hand)
      .attr('href', side.references[0].url)
      .text(side.references[0].title || side.references[0].url);
  }

  // Sliders

  this.find('sliders', hand).find('.criteria-name').each(function (i) {
    var cid = i;

    if ( cid > 3 ) {
      cid -= 4;
    }

    self.find('sliders', hand).find('.criteria-name').eq(i)
      
      .on('click', function () {
        var self = $(this);
        var descriptionSection = self.closest('.criteria-wrapper').find('.criteria-description-section');

        self.closest('.row-sliders').find('.criteria-name.info').removeClass('info').addClass('shy');


        if ( $(this).hasClass('shy') ) {
          $(this).removeClass('shy').addClass('info');
        }

        else if ( $(this).hasClass('info') ) {
          $(this).removeClass('info').addClass('shy');
        }

        Nav.hide(self.closest('.promote').find('.criteria-description-section.is-shown'), app.domain.intercept(function () {
          Nav.toggle(descriptionSection);
        }));

        
      })

      .text(self.get('criterias')[cid].name);


    self.find('sliders', hand)
      .find('.criteria-description')
      .eq(i)
      .text(self.get('criterias')[cid].description);

    self.find('sliders', hand)
      .find('input').eq(i)
      .val(0)
      .data('criteria', self.get('criterias')[cid]._id);
  });

  // Persona

  // this.find('item persona image', hand).attr('src', promote.evaluation[hand].user.image);

  // this.find('item persona name', hand).text(promote.evaluation[hand].user.first_name);

  // Feedback

  this.find('item feedback', hand).val('');

  // Feedback - remove any marker from previous post / see #164

  this.find('item feedback', hand).removeClass('do-not-save-again');

  // Promote button

  this.find('promote button', hand)
    .text(side.subject)
    .off('click')
    .on('click', function () {

      var left = $(this).closest('.left-item').length;

      var opposite = left ? 'right' : 'left';

      Nav.scroll(self.template, app.domain.intercept(function () {

        // If cursor is smaller than limit, then keep on going
      
        if ( self.get('cursor') < self.get('limit') ) {

          self.set('cursor', self.get('cursor') + 1);

          self.publish('promote', promote.get(left ? 'left' : 'right')._id)
            .subscribe(pubsub => pubsub.unsubscribe());

          self.save(left ? 'left' : 'right');

          $.when(
            self
              .find('side by side')
              .find('.' + opposite + '-item')
              .animate({
                opacity: 0
              })
          )
            .then(function () {
              self.get(opposite, self.get('items')[self.get('cursor')]);

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

  this.find('edit and go again button', hand).on('click', function () {
    Nav.unreveal(promote.template, promote.item.template, app.domain.intercept(function () {

      if ( promote.item.find('editor').find('form').length ) {
        console.warn('already loaded')
      }

      else {
        var edit = new Edit(promote.item);
          
        edit.get(app.domain.intercept(function (template) {

          promote.item.find('editor').find('.is-section').append(template);

          Nav.reveal(promote.item.find('editor'), promote.item.template,
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

export default renderItem;
