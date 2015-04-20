! function () {
  
  'use strict';

  var di = require('syn/lib/util/di/domain');

  var deps = [
    'syn/lib/Test',
    'should'
  ];

 function test__lib__util__toSlug (done) {

    var human = 'Hey i am an example';

    var slug = 'hey-i-am-an-example';

    di(done, deps, function (domain, Test) {

      var toSlug;

      function test__lib__util__toSlug____Exists (done) {
        toSlug = require('syn/lib/util/to-slug');
        done();
      }

      function test__lib__util__toSlug____IsA_Function (done) {
        toSlug.should.be.a.Function;
        done();
      }

      function test__lib__util__toSlug____Slugifies (done) {
        toSlug(human).should.be.exactly(slug);
        done();
      }

      Test([
          test__lib__util__toSlug____Exists,
          test__lib__util__toSlug____IsA_Function,
          test__lib__util__toSlug____Slugifies
        ],
        done);

    });

  }

   module.exports = test__lib__util__toSlug;

} ();
