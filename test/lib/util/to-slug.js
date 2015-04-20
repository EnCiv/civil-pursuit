! function () {
  
  'use strict';

  var di = require('syn/lib/util/di/domain');

  var deps = [
    'syn/lib/Test',
    'should'
  ];

 function TestModule_Lib__ToSlug (done) {

    var human = 'Hey i am an example';

    var slug = 'hey-i-am-an-example';

    di(done, deps, function (domain, Test) {

      var toSlug;

      function Module_Lib__toSlug_Exists (done) {
        toSlug = require('syn/lib/util/to-slug');
        done();
      }

      function Module_Lib__toSlug_IsA_Function (done) {
        toSlug.should.be.a.Function;
        done();
      }

      function Module_Lib__toSlug_Slugifies (done) {
        toSlug(human).should.be.exactly(slug);
        done();
      }

      Test([
          Module_Lib__toSlug_Exists,
          Module_Lib__toSlug_IsA_Function,
          Module_Lib__toSlug_Slugifies
        ],
        done);

    });

  }

   module.exports = TestModule_Lib__ToSlug;

} ();
