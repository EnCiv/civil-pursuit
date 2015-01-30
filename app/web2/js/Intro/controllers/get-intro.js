! function () {

	'use strict';

	function getIntro () {
    var div = this;

    var Socket = div.root.emitter('socket');

    var Panel = div.root.extension('Panel');
    if ( ! div.model('intro') ) {

      Socket.emit('get intro');

      Socket.once('got intro', function (intro) {
        div.model('intro', intro);
      });

      div.bind('intro', function (intro) {

        luigi('intro')

          .controller(function (view) {
            var Item = div.root.extension('Item');

            view.find('.panel-title').text(intro.subject);
            view.find('.item-title').text(intro.subject);
            view.find('.description').eq(0).text(intro.description);

            luigi('tpl-responsive-image')

              .controller(function (img) {
                img.attr('src', intro.image);

                view.find('.item-media').empty().append(img);
              });

            view.find('.item-references').hide();

            new (Item.controller('truncate'))(view);

            view.find('.promoted').hide();

            view.find('.box-buttons').hide();

            view.find('.toggle-arrow').hide();
          });

      });
    }
  }

  module.exports = getIntro;

} ();
