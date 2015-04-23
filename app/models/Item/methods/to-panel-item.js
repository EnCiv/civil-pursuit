! function () {
  
  'use strict';

  /** Transform Item Document into an object for panels
   *  *************************************************
   *
   *  Models / Item / Methods / Get Popularity [JS]
   *
   *  *************************************************
  */

  var di            =   require('syn/lib/util/di/domain');

  var deps          =   [
    'async',
    'syn/config.json',
    'syn/models/Type',
    'syn/models/User',
    'syn/models/Item',
    'syn/lib/util/to-slug',
    'syn/lib/get-harmony',
  ];

  function toPanelItem (cb) {

    var original    =   this;

    di(cb, deps, function (domain, async, config, Type, User, Item, toSlug, calcHarmony) {

      function PanelItem (attrs) {
        for ( var attr in attrs ) {
          this[attr] = attrs[attr];
        }
      }

      var item      =   {
        _id         :   original._id,
        id          :   original.id,
        subject     :   original.subject,
        description :   original.description,
        image       :   original.image || config.public['default item image'],
        imageHTML   :   original.getImageHtml(),
        references  :   original.references,
        views       :   original.views,
        promotions  :   original.promotions,
        popularity  :   original.getPopularity(),
        link        :   '/item/' + original.id + '/' + toSlug(original.subject)
      };

      function getLineage (cb, ancestors) {

        cb();

      }

      function getType (cb) {
        Type
          .findById(original.type)
          .populate('harmony.name')
          .exec(cb);
      }

      function getUser (cb) {
        User
          .findById(original.user)
          .exec(domain.intercept(function (user) {
            cb(null, {
              'full name' :   user.fullName,
              gps         :   user.gps,
              _id         :   user._id
            });  
          }));
      }

      function getSubtype (cb) {
        Type
          .findOne({ parent: original.type, harmony: { $gt: [] } })
          .populate('harmony.name')
          .exec(cb);
      }

      function countChildren (cb) {
        Item
          .count({ parent: original._id }, cb);
      }

      function getHarmony (item, cb) {
        // console.log('here', JSON.stringify(item.type, null, 2));
        // return;

        var pro, con;

        async.each(item.type.harmony,

          function (side, cb) {
            Item.count({

                parent    :   item._id,
                type      :   side.name._id

              },

              domain.intercept(function (count) {
              
                if ( typeof pro === 'undefined' ) {
                  pro = count;
                }
                else {
                  con = count;
                }

                cb();

              })
            );
          },

          domain.intercept(function () {
            cb(null, calcHarmony(pro, con));
          }));
      }

      async.parallel({
        lineage     :   getLineage,
        type        :   getType,
        user        :   getUser,
        subtype     :   getSubtype,
        children    :   countChildren
      }, domain.intercept(function (results) {
        
        item.type       =   results.type;
        item.user       =   results.user;
        item.subtype    =   results.subtype;
        item.children   =   results.children;

        if ( ! item.type.harmony.length ) {
          return cb(null, item);
        }

        getHarmony(item, domain.intercept(function (harmony) {
          item.harmony = harmony;

          return cb(null, item);
        }));

      }));

    });

  }

  module.exports = toPanelItem;

} ();
