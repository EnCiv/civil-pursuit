'use strict';

import should         from 'should';
import describe       from 'redtea';
import Mungo          from 'mungo';
import AppError       from 'syn/../../dist/models/app-error';
import isDocument     from './document';

function isAppError(appError, compare = {}, serialized = false) {
  return it => {
    it(serialized ? 'should be serialized' : 'should not be serialized', () => {});

    it('should be a document', describe.use(() => isDocument(appError, compare, serialized)));

    if ( ! serialized ) {
      it('should be a AppError', (ok, ko) => {
        appError.should.be.an.instanceof(AppError);
      });
    }

    it('name', [ it => {
      it('should have name', (ok, ko) => {
        appError.should.have.property('name');
      });
      it('should be a string', (ok, ko) => {
        appError.name.should.be.a.String();
      });
      if ( 'name' in compare ) {
        it('should match compare', (ok, ko) => {
          appError.name.should.be.exactly(compare.name);
        });
      }
    }]);

    it('message', [ it => {
      it('should have message', (ok, ko) => {
        appError.should.have.property('message');
      });
      it('should be a string', (ok, ko) => {
        appError.message.should.be.a.String();
      });
      if ( 'message' in compare ) {
        it('should match compare', (ok, ko) => {
          appError.message.should.be.exactly(compare.message);
        });
      }
    }]);

    if ( 'code' in appError ) {
      it('code', [ it => {
        it('should have code', (ok, ko) => {
          appError.should.have.property('code');
        });
        it('should be a string', (ok, ko) => {
          appError.code.should.be.a.String();
        });
        if ( 'code' in compare ) {
          it('should match compare', (ok, ko) => {
            appError.code.should.be.exactly(compare.code);
          });
        }
      }]);
    }

    if ( 'stack' in appError ) {
      it('stack', [ it => {
        it('should have stack', (ok, ko) => {
          appError.should.have.property('stack');
        });
        it('should be an array', (ok, ko) => {
          appError.stack.should.be.an.Array();
        });
        
      }]);
    }

    if ( 'debug' in appError ) {
      it('debug', [ it => {
        it('should have debug', (ok, ko) => {
          appError.should.have.property('debug');
        });
        it('should be an object', (ok, ko) => {
          appError.debug.should.be.an.Object();
        });
        if ( 'debug' in compare ) {
          it('should match compare', (ok, ko) => {
            appError.debug.should.be.exactly(compare.debug);
          });
        }
      }]);
    }

    if ( 'repair' in appError ) {
      it('repair', [ it => {
        it('should have repair', (ok, ko) => {
          appError.should.have.property('repair');
        });
        it('should be an array', (ok, ko) => {
          appError.repair.should.be.an.Array();
        });
        if ( 'repair' in compare ) {
          it('should match compare', (ok, ko) => {
            appError.repair.should.be.exactly(compare.repair);
          });
        }
      }]);
    }
  };
}

export default isAppError;
