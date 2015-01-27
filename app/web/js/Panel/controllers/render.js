/**
  *  Render and insert a panel
  */

! function () {

  'use strict';

  var luigi = require('/home/francois/Dev/luigi/luigi');

  /**
   *  @return 
   *  @arg {Object} panel
   */

  function render (panel) {
    var div = this;

    luigi('tpl-panel').controller(function (view) {

      // Insert view in DOM first

      ! function insertViewInDOM () {
        // If no parent (topic)

        if ( ! panel.parent ) {
          $('.panels').append(view);
        }

        // If sub panel

        else {
          var container =  $('#item-' + panel.parent + ' > .collapsers > .children');

          // Split panels

          if ( panel.split ) {
            var column = '<div class="col-sm-6 col"></div>';

            // LEFT

            if ( ! container.find('> .is-section > .row-split').length ) {
              var rowSplit = $('<div class="row row-split"></div>');

              container.find('> .is-section').append(rowSplit);

              var col1 = $(column);

              col1.append(view);

              container.find('> .is-section >.row-split').append(col1);
            }

            // RIGHT

            else {
              var col2 = $(column);

              col2.append(view);

              container.find('> .is-section >.row-split').append(col2);
            }
          }

          else {
            container.find('> .is-section').append(view);
          }

          div.controller('reveal')(container, $('#item-' + panel.parent));
        }
      } ();

      // Render creator

      ! function renderCreator () {
        luigi('tpl-creator')

          .controller(function (view_creator) {
            view_creator.addClass(panel.type);
            
            view.find('.panel-body').prepend(view_creator);
            
            view_creator.find('>.is-section .button-create')
              .on('click', function () {
                div.controller('create')($(this));
              });

            renderView();
          });

      } ();

      // Render view

      function renderView () {
        // Set panel ID

        var id = 'panel-' + panel.type;

        if ( panel.parent ) {
          id += '-' + panel.parent;
        }

        view.attr('id', id);

        // Add type as class

        view.addClass('type-' + panel.type);

        // Split panel

        if ( panel.split ) {
          view.addClass('split-view');
        }

        var $creator = view.find('>.panel-body >.creator');
        
        view.find('.panel-title').eq(0).text(panel.type);

        // Toggle creator view

        view.find('.toggle-creator').on('click', function () {

          if ( $creator.hasClass('is-showing') || $creator.hasClass('is-hiding') ) {
            return;
          }
          else if ( $creator.hasClass('is-shown') ) {
            div.controller('hide')($creator);
          }
          else {
            div.controller('reveal')($creator, view);
          }
        });

        if ( synapp.user ) {
          $('.is-in').css('visibility', 'visible');
        }

        div.watch.emit('panel view rendered', panel, view);
      }

    });
  }

  module.exports = render;

} ();
