! function () {
  
  'use strict';

  /**
   *  @function
   *  @return
   *  @arg
   */

  function toggleArrow () {
    var $item   =   $(this).closest('.item');
    var item    =   $item.data('item');
    var arrow   =   $(this).find('i');

    if ( item.find('collapsers hidden').length ) {
      item.find('collapsers').show();
    }

    require('syn/lib/util/Nav').toggle(item.find('children'), item.template, app.domain.intercept(function () {

        console.log('item type', item.item.type);

        if ( item.find('children').hasClass('is-hidden') && item.find('collapsers visible').length ) {
          item.find('collapsers').hide();
        }

        if ( item.find('children').hasClass('is-shown') && ! item.find('children').hasClass('is-loaded') ) {

          item.find('children').addClass('is-loaded');

          console.log('we have an item!!!', item);

          var harmony = item.item.type.harmony;

          if ( harmony.length ) {
            var split = $('<div class="row"><div class="tablet-50 left-split"></div><div class="tablet-50 right-split"></div></div>');

            item.find('children').append(split);

            var panelLeft = new (require('syn/components/Panel/Controller'))(harmony[0], item.item._id);

            panelLeft.load(app.domain.intercept(function (template) {
              template.addClass('split-view');

              split.find('.left-split').append(template);

              setTimeout(function () {
                panelLeft.render(app.domain.intercept(function () {
                  panelLeft.fill(app.domain.intercept());
                }));
              });
            }));

            var panelRight = new (require('syn/components/Panel/Controller'))(harmony[1], item.item._id);

            panelRight.load(app.domain.intercept(function (template) {
              template.addClass('split-view');

              split.find('.right-split').append(template);

              setTimeout(function () {
                panelRight.render(app.domain.intercept(function () {
                  panelRight.fill(app.domain.intercept());
                }));
              });
            }));
          }

          var subtype = item.item.subtype;

          if ( subtype ) {
            var subPanel = new (require('syn/components/Panel/Controller'))(subtype, item.item._id);

            subPanel.load(app.domain.intercept(function (template) {
              item.find('children').append(template);

              setTimeout(function () {
                subPanel.render(app.domain.intercept(function () {
                  subPanel.fill(app.domain.intercept());
                }));
              });
            }));
          }
        }

        if ( arrow.hasClass('fa-arrow-down') ) {
          arrow.removeClass('fa-arrow-down').addClass('fa-arrow-up');
        }
        else {
          arrow.removeClass('fa-arrow-up').addClass('fa-arrow-down');
        }
      }));
  }

  module.exports = toggleArrow;

} ();
