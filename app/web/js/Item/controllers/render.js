! function () {

  'use strict';

  var luigi = require('/home/francois/Dev/luigi/luigi');

  function render (item, cb) {

    var div = this;
    var Panel = div.root.extension('Panel');
    var Promote = div.root.extension('Promote');
    var Socket = div.root.emitter('socket');

    luigi('item-' + item._id)

      .on('error', function (error) {
        div.emit('error', error);
      })
      
      .controller(function (view) {

        cb(null, item, view);

        setTimeout(function () {
          // DOM Elements

          var $collapsers     =   view.find('>.is-section >.collapsers');
          var $toggleArrow    =   $collapsers.find('>.toggle-arrow');
          var $subject        =   view.find('>.is-section >.item-text > h4.item-title a');
          var $description    =   view.find('>.is-section >.item-text >.description');
          var $references     =   view.find('>.is-section >.item-text >.item-references');
          var $itemMedia      =   view.find('>.is-section >.item-media-wrapper >.item-media');
          var $togglePromote  =   view.find('>.is-section >.box-buttons .toggle-promote');
          var $promoted       =   view.find('>.is-section >.box-buttons .promoted');
          var $promotedPercent=   view.find('>.is-section >.box-buttons .promoted-percent');
          var $toggleDetails  =   view.find('>.is-section >.box-buttons .toggle-details');

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

          $itemMedia.empty().append(
            div.controller('item media')(item));

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
              var $promote  =   $item.find('>.is-section >.collapsers >.evaluator');

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

          // is in

          if ( synapp.user ) {
            view.find('.is-in').css('visibility', 'visible');
          }
        }, 2000);

      });
  }

  module.exports = render;

} ();
