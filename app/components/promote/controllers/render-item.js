'use strict';

import Nav      from '../../../lib/util/nav';
import Edit     from '../../../components/edit-and-go-again/ctrl';
import Item     from '../../../components/item/ctrl';

function _renderItem (item, hand) {
  let self = this;

  this.find('side by side')
    .attr('data-' + hand + '-item', item._id)
    .attr('data-' + hand + '-views', item.views);

  // Subject
  this.find('item subject', hand).text(item.subject);

  // Description
  this.find('item description', hand).text(/*hand + ' ' + item.id + ' ' + */item.description);

  // Image

  this.find('item image', hand).empty().append(
    new Item({ item: item }).media()
  );

  // References

  if ( item.references && item.references.length ) {
    this.find('item references', hand)
      .attr('href', item.references[0].url)
      .text((item.references[0].title || item.references[0].url));
  }

  // Sliders

  this.find('sliders', hand).find('.criteria-name').each(function (i) {
    var cid = i;

    if ( cid > 3 ) {
      cid -= 4;
    }

    self.find('sliders', hand).find('.criteria-name').eq(i)
      
      .on('click', function () {
        let elem = $(this);

        let descriptionSection = elem.closest('.criteria-wrapper').find('.criteria-description');

        elem.closest('.row-sliders').find('.criteria-name.info').removeClass('info').addClass('shy');


        if ( $(this).hasClass('shy') ) {
          $(this).removeClass('shy').addClass('info');
        }

        else if ( $(this).hasClass('info') ) {
          $(this).removeClass('info').addClass('shy');
        }

        // Nav.hide(elem.closest('.promote').find('.criteria-description-section.is-shown'), self.domain.intercept(function () {
        //   Nav.toggle(descriptionSection);
        // }));

        $('.criteria-description').hide();

        descriptionSection.show();

        
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

  // Feedback

  this.find('item feedback', hand).val('');

  // Feedback - remove any marker from previous post / see #164

  this.find('item feedback', hand).removeClass('do-not-save-again');
}

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

  this.socket.on('item image uploaded ' + side._id.toString(), item => {
    _renderItem.apply(this, [item, hand]);
  });

  // Increment views counter

  this.publish('add view', side._id)
    .subscribe(pubsub => pubsub.unsubscribe());

  // Render item

  _renderItem.apply(this, [side, hand]);

  // Promote button

  this.find('promote button', hand)
    .text(side.subject)
    .off('click')
    .on('click', function () {

      var left = $(this).closest('.left-item').length;

      var opposite = left ? 'right' : 'left';

      Nav.scroll(self.template, self.domain.intercept(function () {

        // If cursor is smaller than limit, then keep on going
      
        if ( self.get('cursor') < self.get('limit') ) {

          self.set('cursor', self.get('cursor') + 1);

          self.publish('promote', self.get(left ? 'left' : 'right')._id)
            .subscribe(pubsub => pubsub.unsubscribe());

          self
            .save(left ? 'left' : 'right', () => {
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

                  self
                    .find('side by side')
                    .find('.' + opposite + '-item')
                    .animate({
                      opacity: 1
                    });
                });
            });
            }

        // If cursor equals limit, means end of evaluation cycle

        else {

          self.finish();

        }

      }));
    });

  // Edit and go again

  this.find('edit and go again button', hand).on('click', function () {
    Nav.unreveal(promote.template, promote.item.template, self.domain.intercept(function () {

      if ( promote.item.find('editor').find('form').length ) {
        console.warn('already loaded')
      }

      else {
        var edit = new Edit(promote.item);
          
        edit.get(self.domain.intercept(function (template) {

          promote.item.find('editor').find('.is-section').append(template);

          Nav.reveal(promote.item.find('editor'), promote.item.template,
            self.domain.intercept(function () {
              Nav.show(template, self.domain.intercept(function () {
                edit.render();
              }));
            }));
        }));

      }

    }));
  });

}

export default renderItem;
