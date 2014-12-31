/***


         @\_______/@
        @|XXXXXXXX |
       @ |X||    X |
      @  |X||    X |
     @   |XXXXXXXX |
    @    |X||    X |             V
   @     |X||   .X |
  @      |X||.  .X |                      V
 @      |%XXXXXXXX%||
@       |X||  . . X||
        |X||   .. X||                               @     @
        |X||  .   X||.                              ||====%
        |X|| .    X|| .                             ||    %
        |X||.     X||   .                           ||====%
       |XXXXXXXXXXXX||     .                        ||    %
       |XXXXXXXXXXXX||         .                 .  ||====% .
       |XX|        X||                .        .    ||    %  .
       |XX|        X||                   .          ||====%   .
       |XX|        X||              .          .    ||    %     .
       |XX|======= X||============================+ || .. %  ........
===== /            X||                              ||    %
                   X||           /)                 ||    %
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
Nina Butorac

                                                                             
                                                                             

       $$$$$$$  $$    $$  $$$$$$$    $$$$$$    $$$$$$    $$$$$$ 
      $$        $$    $$  $$    $$        $$  $$    $$  $$    $$
       $$$$$$   $$    $$  $$    $$   $$$$$$$  $$    $$  $$    $$
            $$  $$    $$  $$    $$  $$    $$  $$    $$  $$    $$
      $$$$$$$    $$$$$$$  $$    $$   $$$$$$$  $$$$$$$   $$$$$$$ 
                      $$                      $$        $$      
                      $$                      $$        $$     
                 $$$$$$                       $$        $$                     







              ────────────────────▄▄▄▄
              ────────────────▄▄█▀▀──▀▀█▄
              ─────────────▄█▀▀─────────▀▀█▄
              ────────────▄█▀──▄▄▄▄▄▄──────▀█
              ────────────█───█▌────▀▀█▄─────█
              ────────────█──▄█────────▀▀▀█──█
              ────────────█──█──▀▀▀──▀▀▀▄─▐──█
              ────────────█──▌────────────▐──█
              ────────────█──▌─▄▀▀▄───────▐──█
              ───────────█▀▌█──▄▄▄───▄▀▀▄─▐──█
              ───────────▌─▀───█▄█▌─▄▄▄────█─█
              ───────────▌──────▀▀──█▄█▌────█
              ───────────█───────────▀▀─────▐
              ────────────█──────▌──────────█
              ────────────██────█──────────█
              ─────────────█──▄──█▄█─▄────█
              ─────────────█──▌─▄▄▄▄▄─█──█
              ─────────────█─────▄▄──▄▀─█
              ─────────────█▄──────────█
              ─────────────█▀█▄▄──▄▄▄▄▄█▄▄▄▄▄
              ───────────▄██▄──▀▀▀█─────────█
              ──────────██▄─█▄────█─────────█
              ───▄▄▄▄███──█▄─█▄───█─────────██▄▄▄
              ▄█▀▀────█────█──█▄──█▓▓▓▓▓▓▓▓▓█───▀▀▄
              █──────█─────█───████▓▓▓▓▓▓▓▓▓█────▀█
              █──────█─────█───█████▓▓▓▓▓▓▓█──────█
              █─────█──────█───███▀▀▀▀█▓▓▓█───────█
              █────█───────█───█───▄▄▄▄████───────█
              █────█───────█──▄▀───────────█──▄───█
              █────█───────█─▄▀─────█████▀▀▀─▄█───█
              █────█───────█▄▀────────█─█────█────█
              █────█───────█▀───────███─█────█────█
              █─────█────▄█▀──────────█─█────█────█
              █─────█──▄██▀────────▄▀██─█▄───█────█
              █────▄███▀─█───────▄█─▄█───█▄──█────█
              █─▄██▀──█──█─────▄███─█─────█──█────█
              ██▀────▄█───█▄▄▄█████─▀▀▀▀█▀▀──█────█
              █──────█────▄▀──█████─────█────▀█───█
              ───────█──▄█▀───█████─────█─────█───█
              ──────▄███▀─────▀███▀─────█─────█───█
              ─────────────────────────────────────
              ▀█▀─█▀▄─█─█─█▀────▄▀▀─▀█▀─▄▀▄─█▀▄─█─█
              ─█──█▄▀─█─█─█▀────▀▀█──█──█─█─█▄▀─█▄█
              ─▀──▀─▀─▀▀▀─▀▀────▀▀───▀───▀──▀─▀─▄▄█
              ─────────────────────────────────────





***/

;! function () {

  'use strict';

  var trueStory = require('/home/francois/Dev/true-story.js');

  module.exports = function () {

    return trueStory()

      .on('error', function (error) {
        console.error(error.message);
      })

      .model(require('./model'))

      .emitter('socket',
        io.connect('http://' + window.location.hostname + ':' +
          window.location.port))

      .view(require('./view'))

      .template({
        "online users": {
          template: '.online-users',
          controller: function (view, online_users) {
            view.text(online_users);
          }
        },

        "panel": {
          url: '/partial/panel',
          controller: function (view, panelItems) {

            var id = 'panel-' + panelItems.panel.type;

            if ( panelItems.panel.parent ) {
              id += '-' + panelItems.panel.parent;
            }

            view.attr('id', id);

            view.find('.panel-title').text(panelItems.panel.type);

          }
        },

        "intro": {
          template: '#intro',
          controller: function (view, intro) {
            var app = this;

            // view.find('.panel-title').text('intro.subject');
            $('#intro').find('.panel-title').text(intro.subject);
            $('#intro').find('.item-title').text(intro.subject);
            $('#intro').find('.description').text(intro.description);

            $('#intro').find('.item-media').append(
              app.controller('bootstrap/responsive-image')({
                src: intro.image
              }));

            $('#intro').find('.item-references').hide();
          }
        },

        "item": {
          url: '/partial/item',
          controller: function (view, item) {
            view.find('.item-title').text(item.subject);
          }
        }
      })

      .controller(require('./controller'))

      .tell(require('./stories'))

      /**
                                                         
                                                         
          $$                            $$               
          $$                            $$               
        $$$$$$     $$$$$$    $$$$$$$  $$$$$$    $$$$$$$  
          $$      $$    $$  $$          $$     $$        
          $$      $$$$$$$$   $$$$$$     $$      $$$$$$   
          $$  $$  $$              $$    $$  $$       $$  
           $$$$    $$$$$$$  $$$$$$$      $$$$  $$$$$$$   
                                                         
                                                         
        ***/

      .watchDog({
        'story get topics':   require('./watchdogs/story-get-topics'),
        'story get intro':    require('./watchdogs/story-get-intro')
      });
    };

}();