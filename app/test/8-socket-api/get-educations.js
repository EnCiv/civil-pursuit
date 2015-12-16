'use strict';

import describe                   from 'redtea';
import should                     from 'should';
import mock                       from '../../lib/app/socket-mock';
import getEducations              from '../../api/get-educations';
import isEducation                from '../.test/assertions/is-education';
import Education                  from '../../models/education';

function areEducations(educations) {
  return it => {
    educations.forEach(education => it('should be a education', describe.use(() => isEducation(education))));
  };
}

function test (props) {
  const locals = {};

  return describe ( ' API / Get Countries', it => {
    it('Get educations from DB', [ it => {
      it('should get educations',(ok, ko) => {
        Education.find({}, { limit : false }).then(
          educations => {
            locals.dbCountries = educations;
            ok();
          },
          ko
        );
      });
    }]);

    it('Get educations from socket', [ it => {
      it('Get educations', (ok, ko) => {
        mock(props.socket, getEducations, 'get educations')
          .then(
            educations => {
              locals.educations = educations;
              ok();
            },
            ko
          );
      });
    }]);

    it('should be the same number than DB', (ok, ko) => {
      locals.dbCountries.length.should.be.exactly(locals.educations.length);
      ok();
    });

    it('should all be educations', describe.use(() => areEducations(locals.educations)));

  });
}

export default test;
