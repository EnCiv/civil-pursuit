'use strict';

import should               from 'should';
import describe             from 'redtea';
import Is                   from 'syn/../../dist/lib/util/is';

function test () {

  const locals = {};

  return describe ( 'Lib / Util / Is' , it => {


    it('should be a function', () =>
      Is.should.be.a.Function()
    );

    it('Lesser than', it => {

      it('should be a function', () =>
          Is.should.have.property('lesserThan')
            .which.is.a.Function()
      );

      it('should return a function', () => {
          locals.isLesserThan10 = Is.lesserThan(10);
          locals.isLesserThan10.should.be.a.Function()
        }
      );

      it('should return true if lesser than', () =>
          locals.isLesserThan10(5).should.be.true()
      );

      it('should return false if not lesser than', () =>
          locals.isLesserThan10(15).should.be.false()
      );

      it('should return false if equal', () =>
          locals.isLesserThan10(10).should.be.false()
      );

    });

    it('Is URL', it => {

      it('should be a function', () =>
          Is.should.have.property('url')
            .which.is.a.Function()
      );

      it('should return a function', () => {
          locals.isUrl = Is.lesserThan(10);
          locals.isUrl.should.be.a.Function();
        }
      );

      it('should return true if url', () =>
          locals.isUrl('http://').should.be.true()
      );

      it('should return false if not url', () =>
          locals.isUrl('hello').should.be.true()
      );

    });

  });

}

export default test;
