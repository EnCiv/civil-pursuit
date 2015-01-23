! function () {

  'use strict';

  module.exports = {
    url: '/partial/item',
    controller: function (view, item) {

      var app = this;

      var Socket = app.importer.emitter('socket');
      var Panel = app.importer.extension('Panel');
      var Evaluation = app.importer.extension('Evaluation');

      // DOM Elements

      var $collapsers     =   view.find('>.collapsers');
      var $toggleArrow    =   $collapsers.find('>.toggle-arrow');
      var $subject        =   view.find('>.item-text > h4.item-title a');
      var $description    =   view.find('>.item-text >.description');
      var $references     =   view.find('>.item-text >.item-references');
      var $togglePromote  =   view.find('>.box-buttons .toggle-promote');

      // Static link

      var staticLink    =   '/item/' + item._id + '/' + require('string')(item.subject).slugify();

      // Assign item id

      view.attr('id', 'item-' + item._id);

      // Subject

      $subject
        .attr('href', staticLink)
        .text(item.subject);

      // Description
      
      $description
        .text(item.description);

      // REFERENCES

      if ( item.references.length ) {
        $references.show();

        $references.find('a')
          .attr('src', item.references[0].url)
          .text(item.references[0].title || item.references[0].url);
      }
      else {
        $references.hide();
      }

      // ITEM MEDIA

      view.find('.item-media').eq(0).empty().append(
        app.controller('item media')(item));

      if ( view.find('.youtube-preview .fa-play').length ) {

        setTimeout(function () {
          view.find('.youtube-preview .fa-play').show();

          var imgTop =  view.find('.youtube-preview img').offset().top;
          var imgHeight =  view.find('.youtube-preview img').height();
          var iconHeight =  view.find('.youtube-preview .fa-play').height();

          var imgLeft =  view.find('.youtube-preview img').offset().left;
          var imgWidth =  view.find('.youtube-preview img').width();
          var iconWidth =  view.find('.youtube-preview .fa-play').width();

          view.find('.youtube-preview .fa-play')
            .css({
              display: 'block',
              top: (imgTop + ((imgHeight / 2) - (iconHeight / 2))) + 'px',
              left: (imgLeft + ((imgWidth / 2) - (iconWidth / 2))) + 'px',
            })
            .on('click', function () {
              var video_container = $('<div class="video-container"></div>');
              view.find('.youtube-preview')
                .empty()
                .append(video_container);

              video_container.append($('<iframe frameborder="0" width="300" height="175" allowfullscreen></iframe>'));

              video_container.find('iframe').attr('src', 'http://www.youtube.com/embed/'
                + view.find('.youtube-preview').data('video') + '?autoplay=1'); 
            });

        }, 1000);
      }

      // TRUNCATE

      setTimeout(function () {
        new (app.controller('truncate'))(view);
      }, 1000);

      // ITEM STATS

      view.find('.promoted').eq(0).text(item.promotions);
      
      if ( item.promotions ) {
        view.find('.promoted-percent').eq(0).text(
          Math.floor(item.promotions * 100 / item.views) + '%');
      }
      else {
        view.find('.promoted-percent').eq(0).text('0%');
      }

      // ITEM TOGGLE PROMOTE

      $togglePromote.on('click',

        function togglePromote () {

          var $panel    =   $(this).closest('.panel');
          var $item     =   $(this).closest('.item');
          var $promote  =   $item.find('>.collapsers >.evaluator');

          if ( $promote.hasClass('is-shown') ) {
            Panel.controller('scroll to point of attention')($item,
              function () {
                Panel.controller('hide')($promote);
              });
          }

          else {
            // Show tip

            $('#modal-tip-evaluate').modal('show');

            Panel.controller('reveal')($promote, view,
              
              function onPromoteShown () {

                var evaluationExists = Evaluation.model('evaluations')
                  .some(function (evaluation) {
                    return evaluation.item === item._id;
                  });

                if ( ! evaluationExists ) {
                  Socket.emit('get evaluation', item);
                }
              });
          }

          return false;

        });

      // ITEM TOGGLE DETAILS

      view
        .find('>.box-buttons >.toggle-details')
        .on('click', function () {
          app.controller('toggle details')(this, item);
        });

      // ITEM TOGGLE SUB PANEL

      $toggleArrow.on('click', function () {

        var $panel    =   $(this).closest('.panel');
        var $item     =   $(this).closest('.item');
        var $children =   $item.find('>.collapsers >.children');

        // Animation in progress - don't do nothing

        if ( $children.hasClass('is-showing') || $children.hasClass('is-hiding') ) {
          return;
        }

        // Is shown so hide
        
        else if ( $children.hasClass('is-shown') ) {
          Panel.controller('scroll to point of attention')($item,
            function () {
              Panel.controller('hide')($children);

              $(this).find('i.fa')
                .removeClass('fa-arrow-up')
                .addClass('fa-arrow-down');

            }.bind(this));
        }

        // else, show

        else {

          // Hide panel's creator

          if ( $panel.find('>.panel-body >.creator.is-shown').length ) {
            Panel.controller('hide')($panel.find('>.panel-body >.creator.is-shown'));
          }

          // Is loaded so just show  
          
          if ( $children.hasClass('is-loaded') ) {
            Panel.controller('reveal')($children, $item);

            $(this).find('i.fa')
              .removeClass('fa-arrow-down')
              .addClass('fa-arrow-up');
          }

          // else load and show
          
          else {
            $children.addClass('is-loaded')

            setTimeout(function () {
              $(this).find('i.fa')
                .removeClass('fa-arrow-down')
                .addClass('fa-arrow-up');
              }.bind(this), 1000);

            var children = synapp['item relation'][item.type];

            if ( typeof children === 'string' ) {
              Panel.push('panels', {
                type: children,
                parent: item._id,
                size: synapp['navigator batch size'],
                skip: 0
              });
            }

            else if ( Array.isArray(children) ) {
              children.forEach(function (child) {

                if ( typeof child === 'string' ) {
                  Panel.push('panels', {
                    type: child,
                    parent: item._id,
                    size: synapp['navigator batch size'],
                    skip: 0
                  });
                }

                else if ( Array.isArray(child) ) {
                  child.forEach(function (c) {
                    Panel.push('panels', {
                      type: c,
                      parent: item._id,
                      size: synapp['navigator batch size'],
                      skip: 0,
                      split: true
                    });
                  });
                }

              });
            }
          }
        }

      });

      // IS IN

      if ( synapp.user ) {
        view.find('.is-in').css('visibility', 'visible');
      }
    }
  };

} ();
