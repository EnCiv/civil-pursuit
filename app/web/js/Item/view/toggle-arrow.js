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

    require('../../Nav').toggle(item.find('children'), item.template, app.domain.intercept(function () {

        console.log('item type', item.item.type);

        if ( item.find('children').hasClass('is-hidden') && item.find('collapsers visible').length ) {
          item.find('collapsers').hide();
        }

        if ( item.find('children').hasClass('is-shown') && ! item.find('children').hasClass('is-loaded') ) {

          item.find('children').addClass('is-loaded');

          switch ( item.item.type ) {
            case 'Topic':

              var panelProblem = new (require('../../Panel'))('Problem', item.item._id);

              panelProblem.load(app.domain.intercept(function (template) {
                item.find('children').append(template);

                setTimeout(function () {
                  panelProblem.render(app.domain.intercept(function () {
                    panelProblem.fill(app.domain.intercept());
                  }));
                });
              }));
              break;

            case 'Problem':

              var split = $('<div class="row"><div class="tablet-50 left-split"></div><div class="tablet-50 right-split"></div></div>');

              item.find('children').append(split);

              var panelAgree = new (require('../../Panel'))('Agree', item.item._id);

              panelAgree.load(app.domain.intercept(function (template) {
                template.addClass('split-view');

                split.find('.left-split').append(template);

                setTimeout(function () {
                  panelAgree.render(app.domain.intercept(function () {
                    panelAgree.fill(app.domain.intercept());
                  }));
                });
              }));

              var panelDisagree = new (require('../../Panel'))('Disagree', item.item._id);

              panelDisagree.load(app.domain.intercept(function (template) {
                template.addClass('split-view');
                
                split.find('.right-split').append(template);

                setTimeout(function () {
                  panelDisagree.render(app.domain.intercept(function () {
                    panelDisagree.fill(app.domain.intercept());
                  }));
                });
              }));

              var panelSolution = new (require('../../Panel'))('Solution', item.item._id);

              panelSolution.load(app.domain.intercept(function (template) {
                item.find('children').append(template);

                setTimeout(function () {
                  panelSolution.render(app.domain.intercept(function () {
                    panelSolution.fill(app.domain.intercept());
                  }));
                });
              }));

              break;

            case 'Solution':

              var split = $('<div class="row"><div class="tablet-50 left-split"></div><div class="tablet-50 right-split"></div></div>');

              item.find('children').append(split);

              var panelPro = new (require('../../Panel'))('Pro', item.item._id);

              panelPro.load(app.domain.intercept(function (template) {
                template.addClass('split-view');

                split.find('.left-split').append(template);

                setTimeout(function () {
                  panelPro.render(app.domain.intercept(function () {
                    panelPro.fill(app.domain.intercept());
                  }));
                });
              }));

              var panelCon = new (require('../../Panel'))('Con', item.item._id);

              panelCon.load(app.domain.intercept(function (template) {
                template.addClass('split-view');

                split.find('.right-split').append(template);

                setTimeout(function () {
                  panelCon.render(app.domain.intercept(function () {
                    panelCon.fill(app.domain.intercept());
                  }));
                });
              }));
              break;
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
