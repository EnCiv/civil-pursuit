;(function () {

  module.exports = function (options) {

    var self = this;

    console.log('toggle view', options)

    var view = $('#item-' + options.item).find('.' + options.view);

    function show (elem, cb) {
      elem.css('margin-top', '-' + elem.height() + 'px');

      elem.find('.is-section:first').animate({
          'margin-top': 0
        }, 750, function () {
          elem.removeClass('is-showing').addClass('is-shown');
          self.$rootScope.publish('did show view', options);
          if ( cb ) cb();
        });

      elem.animate({
         opacity: 1
        }, 700);
    }

    function hide (elem, cb) {
      elem.removeClass('is-shown').addClass('is-hiding');;

      elem.find('.is-section:first').animate({
          'margin-top': '-' + elem.height() + 'px'
        }, 750, function () {
          elem.removeClass('is-hiding').addClass('is-hidden');
          self.$rootScope.publish('did hide view', options);
          if ( cb ) cb();
        });

      elem.animate({
         opacity: 0
        }, 750);
    }

    // if ANY element at all is in the process of being shown, then do nothing because it has the priority and is a blocker

    if ( $('#item-' + options.item).hasClass('.is-showing') ) {
      return false;
    }

    if ( ! view.hasClass('is-toggable') ) {
      view.addClass('is-toggable');
    }

    var itemTop = $('#item-' + options.item).offset().top;
    var windowScroll = $(window).scroll();

    console.log({item: itemTop, scroll: windowScroll});

    self.$rootScope.scrollToPoA($('#item-' + options.item), function () {
      // hide

      if ( view.hasClass('is-shown') ) {
        hide(view);
      }

      // show
      
      else {

        if ( $('#item-' + options.item).find('.is-shown').length ) {
          hide($('#item-' + options.item).find('.is-shown'), function () {
            view.removeClass('is-hidden').addClass('is-showing');

            setTimeout(function () {
              show(view);
            });
          });
        }
        
        else {
          view.removeClass('is-hidden').addClass('is-showing');

          setTimeout(function () {
            show(view);
          });
        }

        switch ( options.view ) {
          case 'evaluator':
            if ( ! view.hasClass('is-loaded') ) {
              self.$rootScope.loadEvaluation(options.item)
                .success(function () {
                  view.addClass('is-loaded');
                });
            }
            break;
        }
      }
    });
  };

})();
