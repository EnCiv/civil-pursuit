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

***/

! function () {

  'use strict';

  var pronto      =   require('prontojs');

  var when        =   pronto.when;

  var passport    =   require('passport');

  module.exports = function () {

    var config = require('../../business/config.json');

    var exportConfig = config.public;

    var session       =   require('express-session');

    var monson = require('monson')(process.env.MONGOHQ_URL, {
      base: require('path').join(process.cwd(), 'app/business')
    });

    var server = pronto ()

      /** inject into scope */

      .inject('synapp', config)

      /** Monson custom opener */

      .opener('monson', monson.pronto)

      /** cookies */

      .cookie(config.secret)

      .open(passport.initialize());

    /** passport */

    passport.serializeUser(function(user, done) {
      done(null, user._id);
    });

    passport.deserializeUser(function(id, done) {
      monson.get('models/User.findById/' + id, done);
    });

    server.app.use(require('cookie-parser')(config.secret));

    server.app.use(session({
      secret:             config.secret,
      resave:             true,
      saveUninitialized:  true
    }));

    require('../routes/facebook')(server.app, config, passport);
    require('../routes/twitter')(server.app, config, passport);

    server

      /** pre router */

      .open(function synMiddleware_preRouter (req, res, next) {
        req.user = req.signedCookies.synuser;
        next();
      }, when('/*'))

      /** /sign/in ==> Sign in */

      .open('app/server/routes/sign-in.js', { exec: 'js/middleware' }, when('/sign/in'))

      /** /sign/up ==> Sign up */

      .open('app/server/routes/sign-up.js', { exec: 'js/middleware' }, when('/sign/up'))

      /** /sign/out ==> Sign out */

      .open('app/server/routes/sign-out.js', { exec: 'js/middleware' }, when('/sign/out'))

      /** /models ==> Monson */

      .open('app/business/models/', { with: 'monson', 'append extension': 'js' }, when('/models' ))

      /** / ==> Home page */

      .open('app/web/views/pages/index.jade', when.home)

      /** /page/ ==> Static pages */

      .open('app/web/views/pages', { 'append extension': 'jade' }, when.prefix('/page/'))

      /** /partial/ ==> Partials */

      .open('app/web/views/partials', { 'append extension': 'jade' }, when.prefix('/partial/'))

      /** /bower/ ==> Bower components */

      .open('app/web/bower_components/', when.prefix('/bower/'))

      /** /js/ ==> JS files */

      .open('app/web/dist/js',
        when.prefix('/js'))

      .open('app/web/js',
        when.prefix('/js'))

      /** /css/ ==> CSS files */

      .open('app/web/dist/css', when.prefix('/css/'))

      // .open('app/web/dist/css/index.min.css', when('/css/index.min.css'))

      /** /test/story/mothership ==> Stories mothership */

      .open('app/web/test/stories/mothership.js'
        , { prepend: 'var mothership_stories = ' + JSON.stringify(require('../../business/epics.json')) + ';' }
        , when('/test/story/mothership'))

      /** /test/story/[n] ==> Stories */

      .open('app/web/test/stories'
        , { 'append extension': 'js' }
        , when.prefix('/test/story'))

      /** /item/ ==> Item static page */

      .open(function staticItemPage (req, res, next) {

        monson.get('models/Item.findById/' + req.params.itemid)

          .on('error', function (error) {
            next(error);
          })

          .on('success', function (item) {
            res.locals.item = item;

            if ( item.references.length ) {
              res.locals.youtube = require('../../web/js/Item/controllers/youtube')(item.references[0].url, true);
            }

            res.locals.title = item.subject + ' | Synaccord';

            res.locals.meta_description = item.description.split(/\n/)[0]
              .substr(0, 255);

            next();
          });

        }
        , when('/item/:itemid/:itemslug'))

      .open('app/web/views/pages/item.jade'
        , when('/item/*'))

      /** Admin "/dashboard" */

      .open('app/web/views/pages/dashboard.jade'
        , when('/dashboard')
        , when.has.signedCookie('synuser', function (synuser) {
          return synuser.email === 'francois@vespa.com';
        })
        )

      /** 404 */

      .open('app/web/views/pages/not-found.jade'
        , when(404))

      .on('listening', function (service) {
        require('./io')(server);
      })

      .on('error', function (error) {
        console.log('erroooooooooor', error);
      })

      // .open ( routes.urlTitleFetcher, when.post ( '/tools/get-title' ) )

      ;

    return server;

  };

} ();
