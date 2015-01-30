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
      console.warn('Item view not found', item.subject, id);
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
              .attr('href', item.references[0].url)
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

          $togglePromote.on('click', function togglePromoteWrapper () {
            div.controller('toggle promote')($(this), view, item);
          });

          // toggle details

          $toggleDetails
            .on('click', function () {
              div.controller('toggle details')(this, item);
            });

          // toggle arrow

          $toggleArrow.on('click', function () {
            div.controller('toggle arrow')($(this), item);
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
