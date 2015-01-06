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

                                                                             
                                                                             
 $$$$$$$  $$    $$  $$$$$$$    $$$$$$    $$$$$$    $$$$$$      $$   $$$$$$$  
$$        $$    $$  $$    $$        $$  $$    $$  $$    $$         $$        
 $$$$$$   $$    $$  $$    $$   $$$$$$$  $$    $$  $$    $$     $$   $$$$$$   
      $$  $$    $$  $$    $$  $$    $$  $$    $$  $$    $$     $$        $$  
$$$$$$$    $$$$$$$  $$    $$   $$$$$$$  $$$$$$$   $$$$$$$      $$  $$$$$$$   
                $$                      $$        $$           $$            
          $$    $$                      $$        $$     $$    $$            
           $$$$$$                       $$        $$      $$$$$$               


***/


! function () {

  'use strict';

  module.exports = function (when) {

    var app = this;

    // http://patorjk.com/software/taag/#p=display&f=Small&t=online

    /** SOCKET ERROR */

    this.emitter('socket')
      
      .on('error', function (error) {
        console.warn('socket error', socket);
      });


    /** Get intro */

    require('./stories/get-intro').apply(this);
      
    /** Get panel */

    require('./stories/get-panel').apply(this);

    /** Get items **/

    require('./stories/get-items').apply(this);

    /** Get evaluations */

    function getEvaluation () {
      var app = this;

      app.emitter('socket').on('got evaluation',
        function (evaluation) {
          evaluation.cursor = 1;
          evaluation.limit = 5;

          if ( evaluation.items.length < 6 ) {
            evaluation.limit = evaluation.items.length - 1;

            if ( ! evaluation.limit && evaluation.items.length === 1 ) {
              evaluation.limit = 1;
            }
          }

          app.model('evaluations').push(evaluation);
        });

      app.on('push evaluations', function (evaluation) {
        var itemID = '#item-' + evaluation.item;

        var item = $(itemID);

        item.find('.evaluator .cursor').text(evaluation.cursor); 
        item.find('.evaluator .limit').text(evaluation.limit);

        item.find('.evaluator .image:eq(0)').append(
          app.controller('item media')(evaluation.items[0]));

        item.find('.evaluator .image:eq(1)').append(
          app.controller('item media')(evaluation.items[1]));

        item.find('.evaluator .subject:eq(0)').text(
          evaluation.items[0].subject);

        item.find('.evaluator .subject:eq(1)').text(
          evaluation.items[1].subject);

        item.find('.evaluator .description:eq(0)').text(
          evaluation.items[0].description);

        item.find('.evaluator .description:eq(1)').text(
          evaluation.items[1].description);

        evaluation.criterias.forEach(function (criteria) {
          var template_name = 'evaluation-' + evaluation.item +
            '-' + criteria._id;

          var template = {
            name: template_name,
            template: item.find('.evaluator .criteria-slider:eq(0)'),
            controller: function (view, locals) {
              view.find('.criteria-name').text(criteria.name);
              view.find('input.slider').slider();
              view.find('input.slider').slider('setValue', 0);
              view.find('input.slider').slider('on', 'slideStop',
                function () {

                });
            }
          };

          app.render(template, {});

          app.on('rendered ' + template_name, function (view) {
            view.css('display', 'block');
            item.find('.evaluator .sliders').append(view);
          });
        });

      });
    }

    getEvaluation.apply(this);

    /** Online now **/

    require('./stories/get-online-users').apply(this);

    /** sign **/

    function signIn () {
      var app = this;

      app.view('sign').on('submit', function () {

        app.view('sign').find('.sign-error')
          .text('')
          .hide();

        var email = app.view('sign').find('[name="email"]');
        var password = app.view('sign').find('[name="password"]');

        email.removeClass('error');
        password.removeClass('error');

        if ( ! email.val() ) {
          email.addClass('error');
          email.focus();
        }

        else if ( ! password.val() ) {
          password.addClass('error');
          password.focus();
        }

        else {
          $.ajax({
            url: '/sign/in',
            type: 'POST',
            data: {
              email: email.val(),
              password: password.val()
            }
          })
            .error(function (error) {

            })
            .success(function (data) {
              app.view('sign').find('section').hide(2000);

              app.view('sign').find('.sign-success')
                .show(function () {
                  setTimeout(function () {
                    app.view('sign').hide(2500);
                  }, 5000);
                })
                .text('Welcome back!');
            });
        }

        return false;
      });
    }

    signIn.apply(this);

    /** MODEL */

    /** when emitter socket triggers error  */
    /** then Function */

    // when()
    //   .emitter('socket')
    //   .triggers('error')
    //   .then(function (error) {
    //     console.warn('TOLD YOU SO');
    //   });

    /** when emitter "socket" on "connect" */
    /** then trigger "socket" on "get intro" */
    /** then push "panels" {Panel} */

    // when()
    //   .emitter('socket')
    //   .triggers('connect')
    //   .then(function () {
    //     console.log('//////////7')
    //   });

    // when()
    //   .model('panels')
    //   .triggers('push')
    //   .then
    //     .render('panel');

  };

}();
