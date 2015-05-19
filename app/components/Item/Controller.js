'use strict';

import Controller from 'syn/lib/app/Controller';
import MediaController from 'syn/components/Item/controllers/media';
import View from 'syn/components/Item/View';
import Promote from 'syn/components/Promote/Controller';
import Details from 'syn/components/Details/Controller';
import TopBar from 'syn/components/TopBar/Controller';
import S from 'string';
import Nav from 'syn/lib/util/Nav';
import readMore from 'syn/lib/util/ReadMore';

class Item extends Controller {

  constructor (props) {
    super();

    this.props = props || {};

    if ( this.props.item ) {
      this.set('item', this.props.item);
    }

    this.componentName = 'Item';
    this.view = View;
  }

  media () {
    return MediaController.apply(this);
  }

  makeRelated () {
    var button = $('<button class="shy counter"><span class="related-number"></span> <i class="fa"></i></button>');

    return button;
  }

  find (name) {
    switch ( name ) {
      case "subject":             return this.template.find('.item-subject a');

      case "description":         return this.template.find('.description');

      case "toggle promote":      return this.template.find('.item-toggle-promote');

      case "promote":             return this.template.find('.promote');



      case "reference":           return this.template.find('.item-reference:first a');

      case "media":               return this.template.find('.item-media:first');

      case "youtube preview":     return this.template.find('.youtube-preview:first');

      case "toggle details":      return this.template.find('.item-toggle-details:first');

      case "details":             return this.template.find('.details:first');

      case "editor":              return this.template.find('.editor:first');

      case "toggle arrow":        return this.template.find('.item-arrow:first');

      case "promotions":          return this.template.find('.promoted:first');

      case "promotions %":        return this.template.find('.promoted-percent:first');

      case "children":            return this.template.find('.children:first');

      case "collapsers"             :   return this.template.find('.item-collapsers:first');

      case "collapsers hidden"      :   return this.template.find('.item-collapsers:first:hidden');

      case "collapsers visible"     :   return this.template.find('.item-collapsers:first:visible');

      case "related count"          :   return this.template.find('.related-count');

      case "related"                :   return this.template.find('.related');

      case "related count plural"   :   return this.template.find('.related-count-plural');

      case "related name"           :   return this.template.find('.related-name');
    }
  }

  render (cb) {

    let item = this.get('item');

    let self = this;

    // Create reference to promote if promotion enabled

    this.promote = new Promote(this.props, this);

    // Create reference to details

    this.details = new Details(this.props, this);

    // Set ID

    this.template.attr('id', 'item-' + item._id);

    // Set Data

    this.template.data('item', this);

    // SUBJECT

    this.find('subject')
      .attr('href', '/item/' + item.id + '/' + S(item.subject).slugify().s)
      .text(item.subject)
      .on('click', function (e) {
        var link = $(this);

        var item = link.closest('.item');

        Nav.scroll(item, function () {
          history.pushState(null, null, link.attr('href'));
          item.find('.item-text .more').click();
        });

        return false;
      });

    // DESCRIPTION    

    this.find('description').text(item.description);

    // MEDIA

    if ( !  this.find('media').find('img[data-rendered]').length ) {
      this.find('media').empty().append(this.media());
    }

    // READ MORE

    this.find('media').find('img').on('load', () => {
      if ( ! this.template.find('.more').length ) {
        readMore(item, this.template);
      }
    }.bind(item));

    // REFERENCES

    if ( (item.references) && item.references.length ) {
      this.find('reference')
        .attr('href', item.references[0].url)
        .text(item.references[0].title || item.references[0].url);
    }
    else {
      this.find('reference').empty();
    }

    // PROMOTIONS

    this.find('promotions').text(item.promotions);

    // POPULARITY

    this.find('promotions %').text((item.popularity.number || 0) + '%');

    // CHILDREN

    var buttonChildren = this.makeRelated();
    buttonChildren.addClass('children-count');
    buttonChildren.find('i').addClass('fa-fire');
    buttonChildren.find('.related-number').text(item.children);
    this.find('related').append(buttonChildren);

    // HARMONY

    if ( 'harmony' in item ) {
      var buttonHarmony = this.makeRelated();
      buttonHarmony.find('i').addClass('fa-music');
      buttonHarmony.find('.related-number').text(item.harmony);
      this.find('related').append(buttonHarmony);
    }

    this.template.find('.counter').on('click', function () {
      var $trigger    =   $(this);
      var $item       =   $trigger.closest('.item');
      var item        =   $item.data('item');
      item.find('toggle arrow').click();
    });
    
    // TOGGLE PROMOTE

    this.find('toggle promote').on('click', function () {
      self.togglePromote($(this));
    });

    // TOGGLE DETAILS

    this.find('toggle details').on('click', function () {
      self.toggleDetails($(this));
    });

    // TOGGLE ARROW

    this.find('toggle arrow')
      .removeClass('hide')
      .on('click', function () {
        self.toggleArrow($(this));
      });

    cb();
  }

  togglePromote ($trigger) {
    if ( ! this.socket.synuser ) {
      let topbar = new TopBar();
      topbar.find('join button').click();
      return;
    }

    let $item       =   $trigger.closest('.item');
    let item        =   $item.data('item');

    let d = this.domain;

    function hideOthers () {
      if ( $('.is-showing').length || $('.is-hidding').length ) {
        return false;
      }

      if ( $('.creator.is-shown').length ) {
        Nav
          .hide($('.creator.is-shown'))
          .hidden(function () {
            $trigger.click();
          });

        return false;
      }

      if ( item.find('details').hasClass('is-shown') ) {
        Nav
          .hide(item.find('details'))
          .hidden(function () {
            $trigger.click();
          });

        item.find('toggle details').find('.caret').addClass('hide');

        return false;
      }
    }

    function promote () {
      item.promote.getEvaluation(d.intercept(item.promote.render.bind(item.promote)));
    }

    function showHideCaret () {
      if ( item.find('promote').hasClass('is-shown') ) {
        $trigger.find('.caret').removeClass('hide');
      }
      else {
        $trigger.find('.caret').addClass('hide');
      }
    }

    if ( hideOthers() === false ) {
      return false;
    }

    if ( item.find('collapsers hidden').length ) {
      item.find('collapsers').show();
    }

    Nav.toggle(item.find('promote'), item.template, function (error) {

      if ( item.find('promote').hasClass('is-hidden') && item.find('collapsers visible').length ) {
        item.find('collapsers').hide();
      }

      promote();

      showHideCaret();

    });
  }

  toggleDetails ($trigger) {
    let $item       =   $trigger.closest('.item');
    let item        =   $item.data('item');

    let d = this.domain;

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
      require('syn/lib/util/Nav').hide(item.find('promote'));
    }

    var hiders = $('.details.is-shown');

    if ( item.find('collapsers hidden').length ) {
      item.find('collapsers').show();
    }

    require('syn/lib/util/Nav').toggle(item.find('details'), item.template, d.intercept(function () {

      showHideCaret();

      if ( item.find('details').hasClass('is-hidden') && item.find('collapsers visible').length ) {
        item.find('collapsers').hide();
      }

      if ( item.find('details').hasClass('is-shown') ) {

        if ( ! item.find('details').hasClass('is-loaded') ) {
          item.find('details').addClass('is-loaded');

          item.details.render(d.intercept());
        }

        if ( hiders.length ) {
          require('syn/lib/util/Nav').hide(hiders);
        }
      }
    }));
  }

  toggleArrow ($trigger)  {
    let $item   =   $trigger.closest('.item');
    let item    =   $item.data('item');
    let arrow   =   $trigger.find('i');

    let d = this.domain;

    if ( item.find('collapsers hidden').length ) {
      item.find('collapsers').show();
    }

    Nav.toggle(item.find('children'), item.template, d.intercept(function () {

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

            panelLeft.load(d.intercept(function (template) {
              template.addClass('split-view');

              split.find('.left-split').append(template);

              setTimeout(function () {
                panelLeft.render(d.intercept(function () {
                  panelLeft.fill(d.intercept());
                }));
              });
            }));

            var panelRight = new (require('syn/components/Panel/Controller'))(harmony[1], item.item._id);

            panelRight.load(d.intercept(function (template) {
              template.addClass('split-view');

              split.find('.right-split').append(template);

              setTimeout(function () {
                panelRight.render(d.intercept(function () {
                  panelRight.fill(d.intercept());
                }));
              });
            }));
          }

          var subtype = item.item.subtype;

          if ( subtype ) {
            var subPanel = new (require('syn/components/Panel/Controller'))(subtype, item.item._id);

            subPanel.load(d.intercept(function (template) {
              item.find('children').append(template);

              setTimeout(function () {
                subPanel.render(d.intercept(function () {
                  subPanel.fill(d.intercept());
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

}

export default Item;
