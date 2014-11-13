var should = require('should');

should.Assertion.add('Response', function() {

  this.params = { operator: 'to be a Response' };

  should(this.obj).be.an.Object;

  this.obj.constructor.name.should.equal('IncomingMessage');

  this.obj.should.have.property('statusCode').which.is.a.Number;

}, true);
