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
    var button = $('<button class="shy counter"><span class="related-number"></span> <i class="fa"></i></button>');

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

    // Truncate text once image has loaded

    item.find('media').find('img').on('load', function () {
      if ( ! this.template.find('.more').length ) {
        console.log('reading more', this.item.subject)
        readMore(this.item, this.template);
      }
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

    item.template.find('.counter').on('click', function () {
      var $trigger    =   $(this);
      var $item       =   $trigger.closest('.item');
      var item        =   $item.data('item');
      item.find('toggle arrow').click();
    });
    
    // Toggle promote

    item.find('toggle promote').on('click', require('./view/toggle-promote'));

    // Toggle details

    item.find('toggle details').on('click', require('./view/toggle-details'));

    // Toggle arrow

    item.find('toggle arrow')
      .removeClass('hide')
      .on('click', require('./view/toggle-arrow'));

    cb();
  }

  module.exports = render;

} ();
