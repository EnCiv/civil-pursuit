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

          // switch ( item.item.type ) {
          //   case 'Topic':

          //     var panelProblem = new (require('syn/components/Panel/Controller'))('Problem', item.item._id);

              
          //     break;

          //   case 'Problem':

          //     var split = $('<div class="row"><div class="tablet-50 left-split"></div><div class="tablet-50 right-split"></div></div>');

          //     item.find('children').append(split);

          //     var panelAgree = new (require('syn/components/Panel/Controller'))('Agree', item.item._id);

          

          //     var panelDisagree = new (require('syn/components/Panel/Controller'))('Disagree', item.item._id);

          //     panelDisagree.load(app.domain.intercept(function (template) {
          //       template.addClass('split-view');
                
          //       split.find('.right-split').append(template);

          //       setTimeout(function () {
          //         panelDisagree.render(app.domain.intercept(function () {
          //           panelDisagree.fill(app.domain.intercept());
          //         }));
          //       });
          //     }));

          //     var panelSolution = new (require('syn/components/Panel/Controller'))('Solution', item.item._id);

          //     panelSolution.load(app.domain.intercept(function (template) {
          //       item.find('children').append(template);

          //       setTimeout(function () {
          //         panelSolution.render(app.domain.intercept(function () {
          //           panelSolution.fill(app.domain.intercept());
          //         }));
          //       });
          //     }));

          //     break;

          //   case 'Solution':

          //     var split = $('<div class="row"><div class="tablet-50 left-split"></div><div class="tablet-50 right-split"></div></div>');

          //     item.find('children').append(split);

          //     var panelPro = new (require('syn/components/Panel/Controller'))('Pro', item.item._id);

          //     panelPro.load(app.domain.intercept(function (template) {
          //       template.addClass('split-view');

          //       split.find('.left-split').append(template);

          //       setTimeout(function () {
          //         panelPro.render(app.domain.intercept(function () {
          //           panelPro.fill(app.domain.intercept());
          //         }));
          //       });
          //     }));

          //     var panelCon = new (require('syn/components/Panel/Controller'))('Con', item.item._id);

          //     panelCon.load(app.domain.intercept(function (template) {
          //       template.addClass('split-view');

          //       split.find('.right-split').append(template);

          //       setTimeout(function () {
          //         panelCon.render(app.domain.intercept(function () {
          //           panelCon.fill(app.domain.intercept());
          //         }));
          //       });
          //     }));
          //     break;
          // }
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
