! function () {

  'use strict';

  function toggleDetails (trigger, item) {
    var div = this;

    var Panel = div.root.extension('Panel');

    // DOM elements

    var $panel      =   $(trigger).closest('.panel');
    var $item       =   $(trigger).closest('.item');
    var $details    =   $item.find('>.collapsers >.details');
    var $editor     =   $item.find('>.collapsers >.editor');
    var $promote    =   $item.find('>.collapsers >.evaluator');

    // helpers

    var scrollToPOA = Panel.controller('scroll to point of attention')
      .bind(Panel);

    var hide = Panel.controller('hide').bind(Panel);

    var reveal = Panel.controller('reveal').bind(Panel);

    // On reveal

    function onReveal () {
      div.controller('progress bar')($details, item);

      div.controller('invite people in')($details, item);

      if ( ! $details.hasClass('is-loaded') ) {
        div.controller('get item details')($details, item);

        $details
          .find('.edit-and-go-again-toggler')
          .eq(0)
          .on('click', function () {

            scrollToPOA($item, function () {
              Panel.controller('hide')($details, function () {
                luigi('tpl-creator')

                  .controller(function (view) {
                    div.controller('edit and go again')(view, item);
                  })

                  .controller(function (view) {
                    $editor
                      .find('.is-section')
                      .empty()
                      .append(view.find('.item'));

                    Panel.controller('reveal')($editor, $item);
                  });
              });
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
    }

    // If details shown, then hide

    if ( $details.hasClass('is-shown') ) {
      scrollToPOA($item, function ()  {
        hide($details);
      });
    }

    else if ( $details.hasClass('is-showing') || $details.hasClass('is-hidding') ) {
      return;
    }
    
    else {

      /** If promote is shown, hide it first */

      if ( $promote.hasClass('is-shown') ) {
        scrollToPOA($item, function ()  {
          hide($promote, function () {
            reveal($details, $item, onReveal);
          });
        });
      }

      else {
        reveal($details, $item, onReveal);
      }
    }
  }

  module.exports = toggleDetails;

} ();
