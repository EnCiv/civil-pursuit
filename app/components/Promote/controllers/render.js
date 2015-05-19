'use strict';

import Nav from 'syn/lib/util/Nav';

/**
 *  @method Promote.render
 *  @return
 *  @arg
 */

function renderPromote (cb) {
  var self = this;

  let d = this.domain;

  self.find('finish button').on('click', function () {
    Nav.scroll(self.template, d.intercept(function () {

      let cursor = self.get('cursor');
      let limit = self.get('limit');

      if ( cursor < limit ) {

        self.save('left');

        self.save('right');

        $.when(
          self
            .find('side by side')
            .find('.left-item, .right-item')
            .animate({
              opacity: 0
            }, 1000)
        )
          .then(function () {
            self.set('cursor', cursor + 1);

            self.set('left', self.get('items')[cursor]);

            self.set('cursor', cursor + 1);

            self.set('right', self.get('items')[cursor]);

            self
              .find('side by side')
              .find('.left-item')
              .animate({
                opacity: 1
              }, 1000);

            self
              .find('side by side')
              .find('.right-item')
              .animate({
                opacity: 1
              }, 1000);
          });
      }

      else {

        self.finish();

      }

    }));
  });
}

export default renderPromote
