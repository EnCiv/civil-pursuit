! function () {
  
  'use strict';

  var when = require('prontojs').when;

  function _routes (server) {
    server

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

      // .open ( routes.urlTitleFetcher, when.post ( '/tools/get-title' ) )

      ;
  }

  module.exports = _routes;

} ();
