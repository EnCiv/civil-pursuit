'use strict';

import describe                   from 'redtea';
import should                     from 'should';
import mock                       from '../../lib/app/socket-mock';
import getEmployments             from '../../api/get-employments';
import isEmployment               from '../.test/assertions/is-employment';
import Employment                 from '../../models/employment';

function areEmployment(employment) {
  return it => {
    employment.forEach(employment => it('should be a employment', describe.use(() => isEmployment(employment))));
  };
}

function test (props) {
  const locals = {};

  return describe ( ' API / Get Countries', it => {
    it('Get employment from DB', [ it => {
      it('should get employment',(ok, ko) => {
        Employment.find({}, { limit : false }).then(
          employment => {
            locals.dbCountries = employment;
            ok();
          },
          ko
        );
      });
    }]);

    it('Get employment from socket', [ it => {
      it('Get employment', (ok, ko) => {
        mock(props.socket, getEmployments, 'get employment')
          .then(
            employment => {
              locals.employment = employment;
              ok();
            },
            ko
          );
      });
    }]);

    it('should be the same number than DB', (ok, ko) => {
      locals.dbCountries.length.should.be.exactly(locals.employment.length);
      ok();
    });

    it('should all be employment', describe.use(() => areEmployment(locals.employment)));

  });
}

export default test;
