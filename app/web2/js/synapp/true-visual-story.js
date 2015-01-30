/***



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

  module.exports = function (app) {

    var tvs = trueStory()

      .on('error', function (error) {
        console.error(error.message);
      })

      .model()

      .view({
        "container":    'body',
        
        "wrapper":      '#true-visual-story'
        
      })

      .template({
        "widget":       {
          url: '/page/true-visual-story',
        
          controller: function (view) {

            var app = this;

            view.find('.tvs-models-length')
              .text(Object.keys(app.$app.models).length)
              .next().text(Object.keys(app.$app.models).length > 1
                ? ' models' : ' model');

            view.find('.tvs-controllers-length')
              .text(Object.keys(app.$app.controllers).length)
              .next().text(Object.keys(app.$app.controllers).length > 1
                ? ' controllers' : ' controller');;

            view.find('.tvs-views-length')
              .text(Object.keys(app.$app.views).length)
              .next().text(Object.keys(app.$app.views).length > 1
                ? ' views' : ' view');

            view.find('.tvs-emitters-length')
              .text(Object.keys(app.$app.emitters).length)
              .next().text(Object.keys(app.$app.emitters).length > 1
                ? ' emitters' : ' emitter');


            view.find('.tvs-watchdogs-length')
              .text(Object.keys(app.$app.watchDogs).length)
              .next().text(Object.keys(app.$app.watchDogs).length > 1
                ? ' watch dogs' : ' watch dog');

            view.find('.tvs-stories-length')
              .text(app.$app.stories.length)
              .next().text(app.$app.stories.length > 1
                ? ' stories' : ' story');

            window.setTimeout(function () {
              app.on('rendered model', function (modelView) {
                view.find('.tvs-models-list').append(modelView);
              });

              app.on('rendered controller', function (controllerView) {
                view.find('.tvs-controllers-list').append(controllerView);
              });

              app.on('rendered view', function (viewView) {
                view.find('.tvs-views-list').append(viewView);
              });

              app.on('rendered emitter', function (emitterView) {
                view.find('.tvs-emitters-list').append(emitterView);
              });

              app.on('rendered test', function (testView) {
                view.find('.tvs-tests-list').append(testView);
              });

              app.on('rendered watchdog', function (watchdogView) {
                view.find('.tvs-watchdogs-list').append(watchdogView);
              });

              app.on('rendered story', function (storyView) {
                view.find('.tvs-stories-table tbody').append(storyView);
              });

              for ( var model in app.$app.models) {
                app.render('model', {
                  name: model
                });
              }

              for ( var controller in app.$app.controllers) {
                app.render('controller', {
                  name: controller
                });
              }

              for ( var $view in app.$app.views) {
                app.render('view', {
                  name: $view
                });
              }

              for ( var emitter in app.$app.emitters) {
                app.render('emitter', {
                  name: emitter
                });
              }

              for ( var watchdog in app.$app.watchDogs) {
                app.render('watchdog', {
                  name: watchdog
                });
              }

              app.$app.stories.forEach(function (story) {
                app.render('story', story);
              });
            });
          }
        },
        
        "model":        {
          template: '#true-visual-story .tvs-model',
          controller: function (view, locals) {
            var app = this;

            view.removeClass('tvs-template-master');

            var typeOf;

            if ( typeof app.$app.models[locals.name] === 'undefined' ) {
              typeOf = 'undefined';
            }

            else if ( app.$app.models[locals.name] === null ) {
              typeOf = 'null';
            }

            else if ( typeof app.$app.models[locals.name] === 'number' ) {
              typeOf = 'Number';
            }
            else if ( Array.isArray(app.$app.models[locals.name]) ) {
              typeOf = 'Array';
            }
            else if ( typeof app.$app.models[locals.name] === 'object' ) {
              typeOf = app.$app.models[locals.name].constructor.name;
            }

            view
              .find('.tvs-model-name')
              .on('click', function () {
                console.log('model ' + locals.name,
                  app.$app.models[locals.name]);
              })
              .text(locals.name);

            view.find('.tvs-model-type').text(typeOf + ' ');
          }
        },
        
        "controller":   {
          template: '#true-visual-story .tvs-controller',
          controller: function (view, locals) {
            view.removeClass('tvs-template-master');

            view.find('.tvs-controller-name').text(locals.name);
          }
        },

        "view":         {
          template: '#true-visual-story .tvs-view',
          controller: function (view, locals) {
            view.removeClass('tvs-template-master');

            view.find('.tvs-view-name').text(locals.name);
          }
        },

        "emitter":      {
          template: '#true-visual-story .tvs-emitter',
          controller: function (view, locals) {
            view.removeClass('tvs-template-master');

            view.find('.tvs-emitter-name').text(locals.name);
          }
        },

        "watchdog":     {
          template: '#true-visual-story .tvs-watchdog',

          controller: function (view, locals) {
            var app = this;

            view.removeClass('tvs-template-master');

            view
              
              .find('.tvs-watchdog-name')

              .on('click', function () {
                console.info(new (function TrueVisualStory_WatchDog_Dump () {
                  this.name     =   locals.name;
                  this.stories =   app.$app.watchDogs[locals.name];
                  this.watched  =   app.$app.watched.filter(function (w) {
                    return w.watchDog = locals.name;
                  });
                })());
              })
              
              .text(locals.name);
          }
        },

        "story":        {
          template: '#true-visual-story .tvs-story',
          controller: function (view, locals) {
            view.removeClass('tvs-template-master');

            view.find('td.tvs-who').text(JSON.stringify(locals.who));
            view.find('td.tvs-does').text(locals.listener);
            view.find('td.tvs-what').text(locals.event);
          }
        }
      })

      .controller({})

      .run(function () {

        var app = this;

        var marginBottom = $('html').css('marginBottom');

        $('html').css('marginBottom', '50vh');

        app.render('widget');

        app.on('rendered widget', function (view) {
          app.view('container').append(view);
        });

      });


    tvs.app = function (app) {
      this.$app = app;

      this.$app.messages = [];

      this.$app.on('message', function (message) {
        this.messages.push(message);
      }.bind(this.$app));
    };

    if ( app ) {
      tvs.app(app);
    }

    window.true_visual_story = tvs;

    return tvs;
    };

}();
