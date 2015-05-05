! function () {
  
  'use strict';

  var Promote     =   require('syn/js/components/Promote');
  var Details     =   require('syn/js/components/Details');
  var Nav         =   require('syn/js/providers/Nav');
  var readMore    =   require('syn/js/providers/ReadMore');
  var Sign        =   require('syn/js/components/Sign');

  var S           =   require('string');

  function makeRelated () {
    var button = $('<button class="shy counter"><span class="related-number"></span> <i class="fa"></i></button>');

    return button;
  }

  function render (cb) {
  
    var item = this;

    // Create reference to promote if promotion enabled

    // this.promote = new Promote(this);

    // Create reference to details

    // this.details = new Details(this);

    // Set ID

    item.template.attr('id', 'item-' + item.item._id);

    // Set Data

    item.template.data('item', this);

    ///////////////////////////////////////////////////////////////////////////

    'SUBJECT'

    ///////////////////////////////////////////////////////////////////////////

    item.find('subject')
      .attr('href', '/item/' + item.item.id + '/' + S(item.item.subject).slugify().s)
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

    ///////////////////////////////////////////////////////////////////////////

    'DESCRIPTION'

    ///////////////////////////////////////////////////////////////////////////    

    item.find('description').text(item.item.description);

    ///////////////////////////////////////////////////////////////////////////

    'MEDIA'

    ///////////////////////////////////////////////////////////////////////////

    if ( !  item.find('media').find('img[data-rendered]').length ) {
      item.find('media').empty().append(this.media());
    }

    ///////////////////////////////////////////////////////////////////////////

    'READ MORE'

    ///////////////////////////////////////////////////////////////////////////

    item.find('media').find('img').on('load', function () {
      if ( ! this.template.find('.more').length ) {
        console.log('reading more', this.item.subject)
        readMore(this.item, this.template);
      }
    }.bind(item));

    ///////////////////////////////////////////////////////////////////////////

    'REFERENCES'

    ///////////////////////////////////////////////////////////////////////////

    if ( (item.item.references) && item.item.references.length ) {
      item.find('reference')
        .attr('href', item.item.references[0].url)
        .text(item.item.references[0].title || item.item.references[0].url);
    }
    else {
      item.find('reference').empty();
    }

    ///////////////////////////////////////////////////////////////////////////

    'PROMOTIONS'

    ///////////////////////////////////////////////////////////////////////////

    item.find('promotions').text(item.item.promotions);

    ///////////////////////////////////////////////////////////////////////////

    'POPULARITY'

    ///////////////////////////////////////////////////////////////////////////

    item.find('promotions %').text((item.item.popularity.number || 0) + '%');

    ///////////////////////////////////////////////////////////////////////////

    'CHILDREN'

    ///////////////////////////////////////////////////////////////////////////

    var buttonChildren = makeRelated();
    buttonChildren.addClass('children-count');
    buttonChildren.find('i').addClass('fa-fire');
    buttonChildren.find('.related-number').text(item.item.children);
    item.find('related').append(buttonChildren);

    ///////////////////////////////////////////////////////////////////////////

    'HARMONY'

    ///////////////////////////////////////////////////////////////////////////

    if ( 'harmony' in item.item ) {
      var buttonHarmony = makeRelated();
      buttonHarmony.find('i').addClass('fa-music');
      buttonHarmony.find('.related-number').text(item.item.harmony);
      item.find('related').append(buttonHarmony);
    }

    console.warn('buttonChildren', buttonChildren.html());

    // Related
    // switch ( item.item.type ) {
    //   case 'Topic':
    //     var problems = (item.item.related && item.item.related.Problem) || 0;
    //     var button = makeRelated();
    //     button.find('i').addClass('fa-fire');
    //     button.find('.related-number').text(problems);
    //     item.find('related').append(button);
    //     break;

    //   case 'Problem':
    //     var agrees = (item.item.related && item.item.related.Agree) || 0;
    //     var disagrees = (item.item.related && item.item.related.Disagree) || 0;
    //     var mean = (agrees / (agrees + disagrees) * 100);

    //     if ( isNaN(mean) ) {
    //       mean = 0;
    //     }

    //     var button = makeRelated();
    //     button.find('i').addClass('fa-music');
    //     button.find('.related-number').text(mean + '%');
    //     item.find('related').append(button);

    //     var solutions = (item.item.related && item.item.related.Solution) || 0;
    //     button = makeRelated();
    //     button.find('i').addClass('fa-tint');
    //     button.find('.related-number').text(solutions);
    //     item.find('related').append(button);
    //     break;
    
    //   case 'Solution':
    //     var pros = (item.item.related && item.item.related.Pro) || 0;
    //     var cons = (item.item.related && item.item.related.Con) || 0;

    //     var mean = pros / (pros + cons);

    //     if ( isNaN(mean) ) {
    //       mean = 0;
    //     }

    //     var button = makeRelated();
    //     button.find('i').addClass('fa-music');
    //     button.find('.related-number').text(mean + '%');
    //     item.find('related').append(button);

    //     break;
    // }



    item.template.find('.counter').on('click', function () {
      var $trigger    =   $(this);
      var $item       =   $trigger.closest('.item');
      var item        =   $item.data('item');
      item.find('toggle arrow').click();
    });
    
    ///////////////////////////////////////////////////////////////////////////

    'TOGGLE PROMOTE'

    ///////////////////////////////////////////////////////////////////////////

    item.find('toggle promote').on('click', require('syn/js/components/Item/view/toggle-promote'));

    ///////////////////////////////////////////////////////////////////////////

    'TOGGLE DETAILS'

    ///////////////////////////////////////////////////////////////////////////

    item.find('toggle details').on('click', require('syn/js/components/Item/view/toggle-details'));

    ///////////////////////////////////////////////////////////////////////////

    'TOGGLE ARROW'

    ///////////////////////////////////////////////////////////////////////////

    item.find('toggle arrow')
      .removeClass('hide')
      .on('click', require('syn/js/components/Item/view/toggle-arrow'));

    cb();
  }

  module.exports = render;

} ();
