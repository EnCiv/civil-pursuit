/*
 *  ******************************************************
 *  ******************************************************
 *  ******************************************************
 *  ******************************************************
 *  ******************************************************
 
 *  ITEM

 *  ******************************************************
 *  ******************************************************
 *  ******************************************************
 *  ******************************************************
 *  ******************************************************
 *  ******************************************************
*/

! function () {
  
  'use strict';

  var Nav         =   require('./Nav');
  var Promote     =   require('./Promote');
  var Details     =   require('./Details');
  var YouTube     =   require('./YouTube');
  var Truncate    =   require('./Truncate');

  function Item (item) {

    if ( typeof app === 'undefined' || app.constructor.name !== 'Synapp' ) {
      throw new Error('Missing app');
    }

    var self = this;

    app.domain.run(function () {
      if ( typeof item !== 'object' ) {
        throw new Error('Item must be an object');
      }

      self.item = item;
    });
  }

  Item.prototype.get = function (cb) {
    var item = this;

    $.ajax({
      url: '/partial/item-box'
    })

      .error(cb)

      .success(function (data) {
        item.template = $(data);

        app.cache.template.item = item.template;

        cb(null, item.template);
      });

    return this;
  };

  Item.prototype.find = function (name) {
    switch ( name ) {
      case 'subject':
        return this.template.find('.item-title:first a');

      case 'description':
        return this.template.find('.description:first');

      case 'reference':
        return this.template.find('.item-references:first a');

      case 'media':
        return this.template.find('.item-media:first');

      case 'youtube preview':
        return this.template.find('.youtube-preview:first');

      case 'toggle promote':
        return this.template.find('.toggle-promote:first');

      case 'promote':
        return this.template.find('.evaluator:first');

      case 'toggle details':
        return this.template.find('.toggle-details:first');

      case 'details':
        return this.template.find('.details:first');

       case 'editor':
        return this.template.find('.editor:first');

      case 'toggle arrow':
        return this.template.find('>.toggle-arrow');

      case 'promotions':
        return this.template.find('.promoted:first');

      case 'promotions %':
        return this.template.find('.promoted-percent:first');

      case 'children':
        return this.template.find('.children:first');
    }
  };

  Item.prototype.render = function (cb) {

    var item = this;

    // Create reference to promote

    var promote = new Promote(this);

    // Create reference to details

    var details = new Details(this);

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

    if ( item.item.references.length ) {
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

    item.find('toggle promote').on('click', function () {

      var $item   =   $(this).closest('.item');
      var item    =   $item.data('item');

      Nav.toggle(item.find('promote'), item.template, app.domain.intercept(function () {
        promote.render(app.domain.intercept());
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

      Nav.toggle(item.find('details'), item.template, app.domain.intercept(function () {
        details.render(app.domain.intercept());
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

              var panelProblem = new Panel('Problem', item.item._id);

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

              var panelSolution = new Panel('Solution', item.item._id);

              panelSolution.get(app.domain.intercept(function (template) {
                item.find('children').append(template);

                setTimeout(function () {
                  panelSolution.render(app.domain.intercept(function () {
                    panelSolution.fill(app.domain.intercept());
                  }));
                }, 700);
              }));

              var split = $('<div class="row"><div class="col-xs-12 col-sm-6 left-split"></div><div class="col-xs-12 col-sm-6 right-split"></div></div>');

              item.find('children').append(split);

              var panelAgree = new Panel('Agree', item.item._id);

              panelAgree.get(app.domain.intercept(function (template) {
                template.addClass('split-view');

                split.find('.left-split').append(template);

                setTimeout(function () {
                  panelAgree.render(app.domain.intercept(function () {
                    panelAgree.fill(app.domain.intercept());
                  }));
                }, 700);
              }));

              var panelDisagree = new Panel('Disagree', item.item._id);

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

              var split = $('<div class="row"><div class="col-xs-12 col-sm-6 left-split"></div><div class="col-xs-12 col-sm-6 right-split"></div></div>');

              item.find('children').append(split);

              var panelPro = new Panel('Pro', item.item._id);

              panelPro.get(app.domain.intercept(function (template) {
                template.addClass('split-view');

                split.find('.left-split').append(template);

                setTimeout(function () {
                  panelPro.render(app.domain.intercept(function () {
                    panelPro.fill(app.domain.intercept());
                  }));
                }, 700);
              }));

              var panelCon = new Panel('Con', item.item._id);

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
  };

  Item.prototype.media = function () {

    // youtube video from references

    if ( this.item.references.length ) {
      var media = YouTube(this.item.references[0].url);

      if ( media ) {
        return media;
      }
    }

    // image

    if ( this.item.image ) {

      var src = this.item.image;

      if ( ! /^http/.test(this.item.image) ) {
        src = synapp['default item image'];
      }

      var image = $('<img/>');

      image.addClass('img-responsive');

      image.attr('src', src);

      return image;
    }

    if ( this.item.youtube ) {
      return YouTube('http://youtube.com/watch?v=' + this.item.youtube);
    }

    if ( this.item.upload ) {
      var src = this.item.image;

      var image = $('<img/>');

      image.addClass('img-responsive');

      image.attr('src', this.item.upload);

      return image;
    }

    // default image

    var image = $('<img/>');

    image.addClass('img-responsive');

    image.attr('src', synapp['default item image']);

    return image;
  };

  module.exports = Item;

} ();
