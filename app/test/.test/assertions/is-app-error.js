'use strict';

import should         from 'should';
import describe       from 'redtea';
import Mungo          from 'mungo';
import AppError       from '../../../models/app-error';
import isDocument     from './is-document';

function isAppError(appError, compare = {}, serialized = false) {
  return it => {
    it(serialized ? 'should be serialized' : 'should not be serialized', ok => ok());

    it('should be a document', describe.use(() => isDocument(appError, compare, serialized)));

    if ( ! serialized ) {
      it('should be a AppError', (ok, ko) => {
        appError.should.be.an.instanceof(AppError);
        ok();
      });
    }

    it('name', [ it => {
      it('should have name', (ok, ko) => {
        appError.should.have.property('name');
        ok();
      });
      it('should be a string', (ok, ko) => {
        appError.name.should.be.a.String();
        ok();
      });
      if ( 'name' in compare ) {
        it('should match compare', (ok, ko) => {
          appError.name.should.be.exactly(compare.name);
          ok();
        });
      }
    }]);

    it('message', [ it => {
      it('should have message', (ok, ko) => {
        appError.should.have.property('message');
        ok();
      });
      it('should be a string', (ok, ko) => {
        appError.message.should.be.a.String();
        ok();
      });
      if ( 'message' in compare ) {
        it('should match compare', (ok, ko) => {
          appError.message.should.be.exactly(compare.message);
          ok();
        });
      }
    }]);

    if ( 'code' in appError ) {
      it('code', [ it => {
        it('should have code', (ok, ko) => {
          appError.should.have.property('code');
          ok();
        });
        it('should be a string', (ok, ko) => {
          appError.code.should.be.a.String();
          ok();
        });
        if ( 'code' in compare ) {
          it('should match compare', (ok, ko) => {
            appError.code.should.be.exactly(compare.code);
            ok();
          });
        }
      }]);
    }

    if ( 'stack' in appError ) {
      it('stack', [ it => {
        it('should have stack', (ok, ko) => {
          appError.should.have.property('stack');
          ok();
        });
        it('should be a string', (ok, ko) => {
          appError.stack.should.be.a.String();
          ok();
        });
        if ( 'stack' in compare ) {
          it('should match compare', (ok, ko) => {
            appError.stack.should.be.exactly(compare.stack);
            ok();
          });
        }
      }]);
    }

    if ( 'debug' in appError ) {
      it('debug', [ it => {
        it('should have debug', (ok, ko) => {
          appError.should.have.property('debug');
          ok();
        });
        it('should be an object', (ok, ko) => {
          appError.debug.should.be.an.Object();
          ok();
        });
        if ( 'debug' in compare ) {
          it('should match compare', (ok, ko) => {
            appError.debug.should.be.exactly(compare.debug);
            ok();
          });
        }
      }]);
    }

    if ( 'repair' in appError ) {
      it('repair', [ it => {
        it('should have repair', (ok, ko) => {
          appError.should.have.property('repair');
          ok();
        });
        it('should be an array', (ok, ko) => {
          appError.repair.should.be.an.Array();
          ok();
        });
        if ( 'repair' in compare ) {
          it('should match compare', (ok, ko) => {
            appError.repair.should.be.exactly(compare.repair);
            ok();
          });
        }
      }]);
    }
  };
}

export default isAppError;
