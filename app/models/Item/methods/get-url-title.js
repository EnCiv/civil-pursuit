! function () {
  
  'use strict';

  var di = require('syn/lib/util/di/domain');

  var deps = [
    'syn/lib/get-url-title',
    'syn/models/Item'
  ];

  function models__Item__methods__getUrlTitle (done) {

    var self = this;
    
    di(done, deps, function (domain, getUrlTitle, Item) {

      var lookForTitle = self.references[0] &&
        self.references[0].url &&
        ! self.references[0].title

      if ( lookForTitle ) {
        getUrlTitle(self.references[0].url, domain.intercept(function (title) {

          Item.update({ _id: self._id },
            {
              "references.0.title": title
            },
          done);
        
        }));
      }
      else {
        done();
      }

    });

  }

  module.exports = models__Item__methods__getUrlTitle;

} ();
