! function () {

  'use strict';

  function As (user) {
    this.user = user;
    this.address = '/';
  }

  function I (me) {
    return new As(me);
  }

  As.prototype.visiting = function (address) {
    this.address = address;
    return this;
  };

  As.prototype.should = function () {
    request({
      url: ''
    });
  };






  var me = {
    email: 'francois@vespa.com',
    password: '1234'
  };

  I(me)
    .visiting('/')
    .should(function (I) {
      I.should.see($('body'));
    });

  request.post({
    url: '/test-story',
    json: true,
    body: {
      visiting: '/'
    }
  })

} ();
