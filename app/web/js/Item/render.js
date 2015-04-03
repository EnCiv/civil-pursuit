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

  function makeRelated () {
    var button = $('<button class="shy"><span class="related-number"></span> <i class="fa"></i></button>');

    button.on('click', function () {
      var $trigger    =   $(this);
      var $item       =   $trigger.closest('.item');
      var item        =   $item.data('item');
      item.find('toggle arrow').click();
    });

    return button;
  }

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

    switch ( item.item.type ) {
      case 'Topic':
        var problems = (item.item.related && item.item.related.Problem) || 0;
        var button = makeRelated();
        button.find('i').addClass('fa-fire');
        button.find('.related-number').text(problems);
        item.find('related').append(button);
        break;

      case 'Problem':
        var agrees = (item.item.related && item.item.related.Agree) || 0;
        var disagrees = (item.item.related && item.item.related.disagrees) || 0;
        var mean = agrees / (agrees + disagrees);

        if ( isNaN(mean) ) {
          mean = 0;
        }

        var button = makeRelated();
        button.find('i').addClass('fa-music');
        button.find('.related-number').text(mean);
        item.find('related').append(button);

        var solutions = (item.item.related && item.item.related.Solution) || 0;
        button = makeRelated();
        button.find('i').addClass('fa-tint');
        button.find('.related-number').text(solutions);
        item.find('related').append(button);
        break;
    
      case 'Solution':
        var pros = (item.item.related && item.item.related.Pro) || 0;
        var cons = (item.item.related && item.item.related.Con) || 0;

        var mean = pros / (pros + cons);

        if ( isNaN(mean) ) {
          mean = 0;
        }

        var button = makeRelated();
        button.find('i').addClass('fa-music');
        button.find('.related-number').text(mean);
        item.find('related').append(button);

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
      .on('click', require('./view/toggle-arrow'));

    cb();
  }

  module.exports = render;

} ();
