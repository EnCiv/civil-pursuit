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

  var src         =   require(require('path').join(process.cwd(), 'src'));

  module.exports = function () {

    var config = src('config');

    var exportConfig = config.public;

    var session       =   require('express-session');

    require('mongoose').connect(process.env.MONGOHQ_URL);

    var server = pronto ();

    src('models/Config')
      .find()
      .lean()
      .exec(function (error, $config) {
        if ( error ) {
          throw error;
        }

        server

          /** inject into scope */

          .inject('synapp', config)

          .inject('config', $config)

          /** cookies */

          .cookie(config.secret)

          /** passport initialize */

          .open(passport.initialize());

        /** passport */

        passport.serializeUser(function(user, done) {
          done(null, user._id);
        });

        passport.deserializeUser(function(id, done) {
          src('models/User').findById(id, done);
        });

        server.app.use(require('cookie-parser')(config.secret));

        /**       S   E   S   S   I   O   N       **/

        server.app.use(session({
          secret:             config.secret,
          resave:             true,
          saveUninitialized:  true
        }));

        /**       F   A   C   E   B   O   O   K       **/

        require('../routes/facebook')(server.app, config, passport);

        /**       T   W   I   T   T   E   R       **/

        require('../routes/twitter')(server.app, config, passport);

        server

        /**       P   R   E       R   O   U   T   E   R       **/

          .open(function synMiddleware_preRouter (req, res, next) {
            req.user = req.signedCookies.synuser;
            next();
          }, when('/*'))

          /**       S   I   G   N       I   N       **/

            //  /sign/in

          .open('app/server/routes/sign-in.js', { exec: 'js/middleware' }, when('/sign/in'))

          /**       S   I   G   N       U   P       **/

            //  /sign/up

          .open('app/server/routes/sign-up.js', { exec: 'js/middleware' }, when('/sign/up'))

          /**       S   I   G   N       O   U   T       **/

            //  /sign/out

          .open('app/server/routes/sign-out.js', { exec: 'js/middleware' }, when('/sign/out'))

          /**       H   O   M   E         **/

            //  /home

          .open('app/web/views/pages/index.jade', when.home)

          /**       P   A   G   E   S       **/

            // /page/:page

          .open(function (req, res, next) {
            res.locals.page = req.params.page || 'index';
            next();
          }, when('/page/:page'))

          .open('app/web/views/pages', { 'append extension': 'jade' }, when.prefix('/page'))

          /**       P   A   R   T   I   A   L   S       **/

            //  /partial/:partial

          .open('app/web/views/partials', { 'append extension': 'jade' }, when.prefix('/partial/'))

          /**       B   O   W   E   R       C   O   M   P   O   N   E   N   T   S       **/

          /** /bower/ */

          .open('app/web/bower_components/', when.prefix('/bower/'))

          /**       A   S   S   E   T       **/

          /** /assets/ */

          .open('app/web/assets/', when.prefix('/assets/'))

          /** /js/ ==> JS files */

          .open('app/web/dist/js',
            when.prefix('/js'))

          .open('app/web/js',
            when.prefix('/js'))

          /** /css/ ==> CSS files */

          .open('app/web/dist/css', when.prefix('/css/'))

          /** /item/ ==> Item static page */

          .open(

            function staticItemPage (req, res, next) {

              var domain = require('domain').create();
              
              domain.on('error', function (error) {
                next(error);
              });
              
              domain.run(function () {
                src('models/Item')

                  .findById(req.params.item_id)

                  .lean()

                  .exec(domain.intercept(function (item) {
                    res.locals.item = item;

                    if ( item.references.length ) {
                      res.locals.youtube = require('../../web/js/Item/controllers/youtube')(item.references[0].url, true);
                    }

                    res.locals.title = item.subject + ' | Synaccord';

                    res.locals.meta_description = item.description.split(/\n/)[0]
                      .substr(0, 255);

                    next(); 
                  }));
                });
              }

            , when('/item/:item_id/:item_slug')

          )

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
            src('io')(server);
          })

          .on('error', function (error) {
            console.log('Pronto Error', error.stack);
          })

          // .open ( routes.urlTitleFetcher, when.post ( '/tools/get-title' ) )

          ;
      });

    return server;

  };

} ();
