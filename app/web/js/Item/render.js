! function () {
  
  'use strict';

  var Truncate    =   require('../Truncate');
  var Promote     =   require('../Promote');
  var Details     =   require('../Details');
  var Nav         =   require('../Nav');
  var readMore    =   require('../ReadMore');
  var Sign        =   require('../Sign');

  var getPromotionPercentage = require('../../../business/models/Item/get-promotion-percentage');

  var S           =   require('string');

  /**
   *  @function
   *  @return
   *  @arg
   */

  function render (cb) {
  
    var item = this;

    // Create reference to promote if promotion enabled

    this.promote = new Promote(this);

    // Create reference to details

    this.details = new Details(this);

    // Set ID

    item.template.attr('id', 'item-' + item.item._id);

    // Set Data

    item.template.data('item', this);

    // Subject

    item.find('subject')
      .attr('href', '/item/' + item.item._id + '/' + S(item.item.subject).slugify().s)
      .text(item.item.subject)
      .on('click', function (e) {
        var link = $(this);

        var item = link.closest('.item');

        Nav.scroll(item, function () {
          history.pushState(null, null, link.attr('href'));
          item.find('.item-text .more').click();
        });

        return false;
      });

    // Description

    item.find('description').text(item.item.description);

    // Media

    item.find('media').empty().append(this.media());

    item.find('media').find('img').on('load', function () {
      readMore(this.item, this.template);
    }.bind(item));

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

    // item.find('promotions %').text(Math.ceil(item.item.promotions * 100 / item.item.views) + '%');
    item.find('promotions %').text(getPromotionPercentage.apply(item.item));

    // Related

    item.find('related count').text(item.item.related);

    if ( item.item.related > 1 ) {
      item.find('related count plural').text('s');
    }

    switch ( item.item.type ) {
      case 'Topic':
        item.find('related name').text(' problem');
        break;

      case 'Problem':
        item.find('related name').text(' problem');
        break;
    }
    
    // Toggle promote

    item.find('toggle promote').on('click', require('./view/toggle-promote'));

    // Toggle details

    item.find('toggle details').on('click', function () {
      
      var $trigger    =   $(this);
      var $item       =   $trigger.closest('.item');
      var item        =   $item.data('item');

      function showHideCaret () {
        if ( item.find('details').hasClass('is-shown') ) {
          $trigger.find('.caret').removeClass('hide');
        }
        else {
          $trigger.find('.caret').addClass('hide');
        }
      }

      if ( item.find('promote').hasClass('is-showing') ) {
        return false;
      }

      if ( item.find('promote').hasClass('is-shown') ) {
        item.find('toggle promote').find('.caret').addClass('hide');
        Nav.hide(item.find('promote'));
      }

      var hiders = $('.details.is-shown');

      if ( item.find('collapsers hidden').length ) {
        item.find('collapsers').show();
      }

      Nav.toggle(item.find('details'), item.template, app.domain.intercept(function () {

        showHideCaret();

        if ( item.find('details').hasClass('is-hidden') && item.find('collapsers visible').length ) {
          item.find('collapsers').hide();
        }

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

    item.find('toggle arrow')
      .removeClass('hide')
      .on('click', function () {

      var $item   =   $(this).closest('.item');
      var item    =   $item.data('item');
      var arrow   =   $(this).find('i');

      if ( item.find('collapsers hidden').length ) {
        item.find('collapsers').show();
      }

      // item.find('collapsers visible').hide();

      // item.find('collapsers hidden').show();

      Nav.toggle(item.find('children'), item.template, app.domain.intercept(function () {

        if ( item.find('children').hasClass('is-hidden') && item.find('collapsers visible').length ) {
          item.find('collapsers').hide();
        }

        if ( item.find('children').hasClass('is-shown') && ! item.find('children').hasClass('is-loaded') ) {

          switch ( item.item.type ) {
            case 'Topic':

              item.find('children').addClass('is-loaded');

              var panelProblem = new (require('../Panel'))('Problem', item.item._id);

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

              var panelAgree = new (require('../Panel'))('Agree', item.item._id);

              panelAgree.load(app.domain.intercept(function (template) {
                template.addClass('split-view');

                split.find('.left-split').append(template);

                setTimeout(function () {
                  panelAgree.render(app.domain.intercept(function () {
                    panelAgree.fill(app.domain.intercept());
                  }));
                });
              }));

              var panelDisagree = new (require('../Panel'))('Disagree', item.item._id);

              panelDisagree.load(app.domain.intercept(function (template) {
                template.addClass('split-view');
                
                split.find('.right-split').append(template);

                setTimeout(function () {
                  panelDisagree.render(app.domain.intercept(function () {
                    panelDisagree.fill(app.domain.intercept());
                  }));
                });
              }));

              var panelSolution = new (require('../Panel'))('Solution', item.item._id);

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

              var panelPro = new (require('../Panel'))('Pro', item.item._id);

              panelPro.load(app.domain.intercept(function (template) {
                template.addClass('split-view');

                split.find('.left-split').append(template);

                setTimeout(function () {
                  panelPro.render(app.domain.intercept(function () {
                    panelPro.fill(app.domain.intercept());
                  }));
                });
              }));

              var panelCon = new (require('../Panel'))('Con', item.item._id);

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
    });

    cb();
  }

  module.exports = render;

} ();
