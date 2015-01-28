/**
  *  Render and insert a panel
  */

! function () {

  'use strict';

  /**
   *  @return 
   *  @arg {Object} panel
   */

  function render (panel) {
    var div = this;

    var intercept = div.domain.intercept;

    // Set panel ID

    var id = 'panel-' + panel.type;

    if ( panel.parent ) {
      id += '-' + panel.parent;
    }

    luigi(id).controller(function (view) {

      // Add type as class

      view.addClass('type-' + panel.type);

      // Split panel

      if ( panel.split ) {
        view.addClass('split-view');
      }

      // Panel title
      
      view.find('.panel-title').eq(0).text(panel.type);

      var $creator = view.find(div.model('$creator'));

      $creator.addClass(panel.type);
                  
      $creator.find('>.is-section .button-create')
        .on('click', function () {
          div.controller('create')($(this));
        });

      // Toggle creator view

      view.find('.toggle-creator').on('click', function () {

        if ( $creator.hasClass('is-showing') || $creator.hasClass('is-hiding') ) {
          return;
        }
        else if ( $creator.hasClass('is-shown') ) {
          div.controller('hide')($creator);
        }
        else {
          // console.log('revealing')
          div.controller('reveal')($creator, view, intercept());
        }
      });

      // Upload

      div.controller('upload')($creator.find('.drop-box'));

      // url title fecther

      $creator.find('.reference').on('change', function () {
        var board = $('.reference-board');
        var reference = $(this);

        board.removeClass('hide').text('Looking up');

        div.root.emitter('socket').emit('get url title', $(this).val(),
          function (error, ref) {
            if ( ref.title ) {
              board.text(ref.title);
              reference.data('title', ref.title);

              var yt = div.root.extension('Item').controller('youtube')(ref.url);

              if ( yt ) {
                $creator.find('.creator').eq(0).find('.item-media')
                  .empty()
                  .append(yt);
              }
            }
            else {
              board.text('Looking up')
                .addClass('hide');
            }
          });
      });

      // Load more

      view.find('>.panel-body >.load-more a')
        .on('click', function loadMore () {

          var load_more = this;

          if ( $creator.hasClass('is-showing') ) {
            return false;
          }

          if ( view.find('>.panel-body >.loading-more:visible').length ) {
            console.log('in proggress');
            return false;
          }

          if ( $creator.hasClass('is-shown') ) {
            div.controller('hide')($creator);
          }

          view.find('>.panel-body >.loading-more')
            .show();

          return false;

          var len = ( synapp['navigator batch size'] - 1 );

          for ( var i = 0; i < len; i ++ ) {
            setTimeout(function () {
              luigi('tpl-item')

                .controller(function ($item) {
                  
                  view.find('.next-item:first').append($item);
                  
                  div.controller('reveal')(
                    view.find('.next-item:first'),
                    $(load_more),
                    function () {
                      $item.insertBefore(view.find('.next-item:first'));
                      view.find('.next-item:first').empty().hide();
                    });
                });
              }, 800 * i);
          }

          return false;
        });

      if ( synapp.user ) {
        $('.is-in').css('visibility', 'visible');
      }

      div.watch.emit('panel view rendered', panel, view);

    });
  }

  module.exports = render;

} ();
