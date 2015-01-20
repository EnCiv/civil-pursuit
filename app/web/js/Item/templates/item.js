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

            // $('#modal-tip-evaluate').modal('show');

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

      view.find('.toggle-details').eq(0).on('click', function () {

        var $panel    =   $(this).closest('.panel');
        var $item     =   $(this).closest('.item');
        var $details  =   $item.find('>.collapsers >.details');

        if ( $details.hasClass('is-shown') ) {
          Panel.controller('scroll to point of attention')($item,
            function () {
              Panel.controller('hide')($details);
            });
        }
        else {
          Panel.controller('reveal')($details, $item, function () {

          // promoted bar

          $details.find('.progress-bar')
            .css('width', Math.floor(item.promotions * 100 / item.views) + '%')
            .text(Math.floor(item.promotions * 100 / item.views) + '%');

          // mail a friend

          var link = window.location.protocol + '//' + window.location.hostname +
            '/item/' + item._id + '/' + require('string')(item.subject).slugify();

          $details.find('.invite-people-body').attr('placeholder',
            $details.find('.invite-people-body').attr('placeholder') +
            link);

          $details.find('.invite-people').attr('href',
            'mailto:?subject=' + item.subject + '&body=' +
            ($details.find('.invite-people-body').val() ||
            $details.find('.invite-people-body').attr('placeholder')) +
            "%0A%0A" + ' Synaccord - ' + link);

          if ( ! $details.hasClass('is-loaded') ) {
            $details.addClass('is-loaded');

            // Votes and feedbacks

            Socket.emit('get item details', item);

            Socket.once('got item details', function (itemDetails) {

              itemDetails.criterias.forEach(function (criteria, index) {
                app.render('details votes', [itemDetails, index],
                  function (detailsView) {
                    detailsView.removeClass('template-model');
                    $details.find('.details-votes').append(detailsView);
                  });
              });

              if ( itemDetails.feedbacks.length ) {
                itemDetails.feedbacks.forEach(function (feedback) {
                  app.render('details feedback', feedback,
                    function (feedbackView) {
                      feedbackView.removeClass('template-model');
                      $details.find('.details-feedbacks').append(feedbackView);
                    });
                });
              }

              else {
                $details.find('.details-feedbacks h4').css('display', 'none');
              }
            });

            // Edit and go again

            $details.find('.edit-and-go-again').on('click', function () {
              Panel.controller('scroll to point of attention')(view,
                function () {
                  Panel.controller('hide')($details, function () {
                    app.render('edit and go again', item, function (editAndGoAgainView) {
                      view.find('>.collapsers >.editor')
                        .empty()
                        .append(editAndGoAgainView);

                      Panel.controller('reveal')(
                        view.find('>.collapsers >.editor'), view);
                    });
                  });
                });
            });
          }

          });
        }
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
              Panel.model('panels').push({
                type: children,
                parent: item._id,
                size: synapp['navigator batch size'],
                skip: 0
              });
            }

            else if ( Array.isArray(children) ) {
              children.forEach(function (child) {

                if ( typeof child === 'string' ) {
                  Panel.model('panels').push({
                    type: child,
                    parent: item._id,
                    size: synapp['navigator batch size'],
                    skip: 0
                  });
                }

                else if ( Array.isArray(child) ) {
                  child.forEach(function (c) {
                    Panel.model('panels').push({
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
