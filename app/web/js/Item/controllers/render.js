! function () {

  'use strict';

  var luigi = require('/home/francois/Dev/luigi/luigi');

  function render (item, cb) {

    var div       =   this;
    var Panel     =   div.root.extension('Panel');
    var Promote   =   div.root.extension('Promote');
    var Socket    =   div.root.emitter('socket');

    var id = 'item-' + item._id;

    if ( item.is_new ) {
      var panel = 'panel-' + item.type;

      if ( item.parent ) {
        panel += '-' + item.parent;
      }

      id = $('#' + panel + ' >.panel-body >.items >.is-new');
    }

    console.log('id', id, item.subject);

    if ( ( typeof id === 'string' && ! $('#' + id).length ) || ( typeof
       id === 'object' && ! id.length ) ) {
      console.log('Item view not found', item.subject);
      return cb();
    }

    luigi(id)

      .on('error', function (error) {
        div.emit('error', error);
      })
      
      .controller(function (view) {

        cb(null, item, view);

        setTimeout(function () {
          console.log('rendering item', item.subject)

          // DOM Elements

          var $collapsers     =   view.find('>.collapsers');
          var $toggleArrow    =   view.find('>.toggle-arrow');
          var $subject        =   view.find('>.item-text > h4.item-title a');
          var $description    =   view.find('>.item-text >.description');
          var $references     =   view.find('>.item-text >.item-references');
          var $itemMedia      =   view.find('>.item-media-wrapper >.item-media');
          var $togglePromote  =   view.find('>.box-buttons .toggle-promote');
          var $promoted       =   view.find('>.box-buttons .promoted');
          var $promotedPercent=   view.find('>.box-buttons .promoted-percent');
          var $toggleDetails  =   view.find('>.box-buttons .toggle-details');

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

          // References

          if ( item.references.length ) {
            $references.show();

            $references.find('a')
              .attr('src', item.references[0].url)
              .text(item.references[0].title || item.references[0].url);
          }
          else {
            $references.hide();
          }

          // Item media

          if ( ! item.is_new ) {
            $itemMedia.empty().append(
              div.controller('item media')(item));
          }

          if ( view.find('.youtube-preview .fa-youtube-play').length ) {
            div.controller('youtube play icon')(view);
          }

          // Truncate

          setTimeout(function () {
            new (div.controller('truncate'))(view);
          }, 1000);

          // stats

          $promoted.text(item.promotions);

          if ( item.promotions ) {
            $promotedPercent.text(Math.floor(item.promotions * 100 / item.views) + '%');
          }

          else {
            $promotedPercent.text('0%');
          }

          // toggle promote

          $togglePromote.on('click',

            function togglePromote () {

              var $panel    =   $(this).closest('.panel');
              var $item     =   $(this).closest('.item');
              var $promote  =   $item.find('>.collapsers >.evaluator');

              if ( $promote.hasClass('is-showing') || $promote.hasClass('is-hiding') ) {
                return false;
              }

              else if ( $promote.hasClass('is-shown') ) {
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

                    var evaluationExists = Promote.model('evaluations')
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

          // toggle details

          $toggleDetails
            .on('click', function () {
              div.controller('toggle details')(this, item);
            });

          // toggle arrow

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
              div.controller('expand')(item, $panel, $item, $children, $(this));
            }

          });

          // is in

          if ( synapp.user ) {
            view.find('.is-in').css('visibility', 'visible');
          }

          // is new

          if ( item.is_new ) {
            setTimeout(function () {
              $togglePromote.click();
            });
          }

        }, 2000);

      });
  }

  module.exports = render;

} ();
