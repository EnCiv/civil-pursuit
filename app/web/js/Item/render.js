! function () {
  
  'use strict';

  var Truncate    =   require('../Truncate');
  var Promote     =   require('../Promote');
  var Details     =   require('../Details');
  var Nav         =   require('../Nav');

  /**
   *  @function
   *  @return
   *  @arg
   */

  function render (cb) {
  
    var item = this;

    // Create reference to promote

    this.promote = new Promote(this);

    // Create reference to details

    this.details = new Details(this);

    // Set ID

    item.template.attr('id', 'item-' + item.item._id);

    // Set Data

    item.template.data('item', this);

    // Subject

    item.find('subject').text(item.item.subject);

    // Description

    item.find('description').text(item.item.description);

    // Media

    item.find('media').empty().append(this.media());

    // References

    if ( (item.item.references) && item.item.references.length ) {
      item.find('reference')
        .attr('href', item.item.references[0].url)
        .text(item.item.references[0].title || item.item.references[0].url);
    }
    else {
      item.find('reference').empty();
    }

    // Number of promotions

    item.find('promotions').text(item.item.promotions);

    // Percent of promotions

    item.find('promotions %').text(Math.ceil(item.item.promotions * 100 / item.item.views) + '%');

    // Truncate

    setTimeout(function () {
      new Truncate(item.template);
    }, 800);

    // Toggle promote

    item.find('toggle promote').on('click', function (e) {

      var $trigger    =   $(this);
      var $item       =   $trigger.closest('.item');
      var item        =   $item.data('item');

      if ( $('.creator.is-shown').length ) {
        Nav
          .hide($('.creator.is-shown'))
          .hidden(function () {
            $trigger.click();
          });

        return false;
      }

      Nav.toggle(item.find('promote'), item.template, app.domain.intercept(function () {
        item.promote.get(app.domain.intercept(item.promote.render.bind(item.promote)));
      }));
    });

    // Toggle details

    item.find('toggle details').on('click', function () {
      
      var $item   =   $(this).closest('.item');
      var item    =   $item.data('item');

      if ( item.find('promote').hasClass('is-showing') ) {
        return false;
      }

      if ( item.find('promote').hasClass('is-shown') ) {
        Nav.hide(item.find('promote'));
      }

      var hiders = $('.details.is-shown');

      Nav.toggle(item.find('details'), item.template, app.domain.intercept(function () {
        if ( item.find('details').hasClass('is-shown') ) {

          if ( ! item.find('details').hasClass('is-loaded') ) {
            item.find('details').addClass('is-loaded');

            item.details.render(app.domain.intercept());
          }

          if ( hiders.length ) {
            Nav.hide(hiders);
          }
        }
      }));

    });

    // Toggle arrow

    item.find('toggle arrow').on('click', function () {

      var $item   =   $(this).closest('.item');
      var item    =   $item.data('item');
      var arrow   =   $(this).find('i');

      Nav.toggle(item.find('children'), item.template, app.domain.intercept(function () {

        if ( item.find('children').hasClass('is-shown') && ! item.find('children').hasClass('is-loaded') ) {

          switch ( item.item.type ) {
            case 'Topic':

              item.find('children').addClass('is-loaded');

              var panelProblem = new (require('../Panel'))('Problem', item.item._id);

              panelProblem.get(app.domain.intercept(function (template) {
                item.find('children').append(template);

                setTimeout(function () {
                  panelProblem.render(app.domain.intercept(function () {
                    panelProblem.fill(app.domain.intercept());
                  }));
                }, 700);
              }));
              break;

            case 'Problem':

              var panelSolution = new (require('../Panel'))('Solution', item.item._id);

              panelSolution.get(app.domain.intercept(function (template) {
                item.find('children').append(template);

                setTimeout(function () {
                  panelSolution.render(app.domain.intercept(function () {
                    panelSolution.fill(app.domain.intercept());
                  }));
                }, 700);
              }));

              var split = $('<div class="row padding-bottom"><div class="col-xs-12 col-sm-6 left-split"></div><div class="col-xs-12 col-sm-6 right-split"></div></div>');

              item.find('children').append(split);

              var panelAgree = new (require('../Panel'))('Agree', item.item._id);

              panelAgree.get(app.domain.intercept(function (template) {
                template.addClass('split-view');

                split.find('.left-split').append(template);

                setTimeout(function () {
                  panelAgree.render(app.domain.intercept(function () {
                    panelAgree.fill(app.domain.intercept());
                  }));
                }, 700);
              }));

              var panelDisagree = new (require('../Panel'))('Disagree', item.item._id);

              panelDisagree.get(app.domain.intercept(function (template) {
                template.addClass('split-view');
                
                split.find('.right-split').append(template);

                setTimeout(function () {
                  panelDisagree.render(app.domain.intercept(function () {
                    panelDisagree.fill(app.domain.intercept());
                  }));
                }, 700);
              }));
              break;

            case 'Solution':

              var split = $('<div class="row padding-bottom"><div class="col-xs-12 col-sm-6 left-split"></div><div class="col-xs-12 col-sm-6 right-split"></div></div>');

              item.find('children').append(split);

              var panelPro = new (require('../Panel'))('Pro', item.item._id);

              panelPro.get(app.domain.intercept(function (template) {
                template.addClass('split-view');

                split.find('.left-split').append(template);

                setTimeout(function () {
                  panelPro.render(app.domain.intercept(function () {
                    panelPro.fill(app.domain.intercept());
                  }));
                }, 700);
              }));

              var panelCon = new (require('../Panel'))('Con', item.item._id);

              panelCon.get(app.domain.intercept(function (template) {
                template.addClass('split-view');

                split.find('.right-split').append(template);

                setTimeout(function () {
                  panelCon.render(app.domain.intercept(function () {
                    panelCon.fill(app.domain.intercept());
                  }));
                }, 700);
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
    });

    cb();
  }

  module.exports = render;

} ();
