! function () {

  'use strict';

  function toggleDetails (trigger, item) {
    var div = this;

    var Panel = div.root.extension('Panel');

    // DOM elements

    var $panel    =   $(trigger).closest('.panel');
    var $item     =   $(trigger).closest('.item');
    var $details  =   $item.find('>.collapsers >.details');
    var $editor  =   $item.find('>.collapsers >.editor');

    // helpers

    var scrollToPOA = Panel.controller('scroll to point of attention')
      .bind(Panel);

    var hide = Panel.controller('hide').bind(Panel);

    var reveal = Panel.controller('reveal').bind(Panel);

    if ( $details.hasClass('is-shown') ) {
      scrollToPOA($item, function ()  {
        hide($details);
      });
    }
    
    else {
      reveal($details, $item, function () {

        div.controller('progress bar')($details, item);

        div.controller('invite people in')($details, item);

        if ( ! $details.hasClass('is-loaded') ) {
          div.controller('get item details')($details, item);

          $details
            .find('.edit-and-go-again-toggler')
            .eq(0)
            .on('click', function () {

              luigi('tpl-creator')

                .controller(function (view) {
                  $editor.empty().append(view);
                  Panel.controller('reveal')($editor, $item);
                });

              // div.render('edit and go again', item, function (editView) {
              //   console.log(editView)
              //   $editor
              //     .empty()
              //     .append(editView);
              // });
              // Panel.controller('reveal')($editor, $item);
            });
        }

      });
    }
  }

  module.exports = toggleDetails;

} ();
