/** Item/Expand
 *
 *  Expands an item's subpanel
 */


! function () {
  
  'use strict';

  /**
   *  @function expand
   *  @arg {Object} item
   *  @arg {Object} $panel
   *  @arg {Object} $item
   *  @arg {Object} $children
   *  @arg {Object} $toggleArrow
  */

  function expand (item, $panel, $item, $children, $toggleArrow) {

    var div     =   this;
    var Panel   =   div.root.extension('Panel');

    console.log('%c Expanding item', 'font-weight:bold', item);

    function panel () {
      return {
        type: children,
        parent: item._id,
        size: synapp['navigator batch size'],
        skip: 0
      };
    };

    // Stuff to hide

    var hide = [];

    [
      $panel.find('>.panel-body >.creator.is-shown'),
      $item.find(' >.collapsers >.evaluator.is-shown'),
      $item.find(' >.collapsers >.details.is-shown')
    ]
    .forEach(function (e) {
      if ( e.length ) {
        hide.push(function (cb) {
          Panel.controller('hide')(e, cb);
        });
      }
    });

    hide.push(function (cb) {
      // Is loaded so just show  
      
      if ( $children.hasClass('is-loaded') ) {
        Panel.controller('reveal')($children, $item);

        $toggleArrow
          .find('i.fa')
          .removeClass('fa-arrow-down')
          .addClass('fa-arrow-up');
      }

      // else load and show
      
      else {

        Panel.controller('reveal')($children, $item, function () {
          $children.addClass('is-loaded');

          setTimeout(function () {
            $toggleArrow.find('i.fa')
              .removeClass('fa-arrow-down')
              .addClass('fa-arrow-up');
            });

          var children = synapp['item relation'][item.type];

          if ( typeof children === 'string' ) {
            Panel.controller('make')(children, item._id)
              .controller(function (view) {
                $children.find('.is-section').append(view);

                Panel.push('panels', {
                  type: children,
                  parent: item._id,
                  size: synapp['navigator batch size'],
                  skip: 0
                });
              });
          }

          else if ( Array.isArray(children) ) {
            children.forEach(function (child) {

              if ( typeof child === 'string' ) {

                Panel.controller('make')(child, item._id)
                  .controller(function (view) {
                    $children.find('.is-section').append(view);

                    Panel.push('panels', {
                      type: child,
                      parent: item._id,
                      size: synapp['navigator batch size'],
                      skip: 0
                    });
                  });

              }

              else if ( Array.isArray(child) ) {

                console.log('child is an array');

                child.forEach(function (c) {

                  Panel.controller('make')(c, item._id)
                    .controller(function (view) {
                      $children.find('.is-section').append(view);

                      Panel.push('panels', {
                        type:     c,
                        parent:   item._id,
                        size:     synapp['navigator batch size'],
                        skip:     0,
                        split:    true
                      });
                    });
                    
                });
              }

            });
          }
        });
      }

      cb();
    });

    require('async').series(hide, div.domain.intercept(function () {

    }));
  }

  module.exports =  expand;

}();
