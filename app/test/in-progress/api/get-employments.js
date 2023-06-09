'use strict';

import describe                   from 'redtea';
import should                     from 'should';
import mock                       from 'syn/../../dist/lib/app/socket-mock';
import getEmployments             from 'syn/../../dist/api/get-employments';
import isEmployment               from 'syn/../../dist/test/is/employment';
import Employment                 from 'syn/../../dist/models/employment';

function areEmployments(employments) {
  return it => {
    employments.forEach(employment => it('should be a employment', describe.use(() => isEmployment(employment))));
  };
}

function test (props) {
  const locals = {};

  return describe ( ' API / Get Employment', it => {
    it('Get employments from DB', [ it => {
      it('should get employments',() => new Promise((ok, ko) => {
        Employment.find({}, { limit : false }).then(
          employments => {
            locals.dbCountries = employments;
            ok();
          },
          ko
        );
      }));
    }]);

    it('Get employments from socket', [ it => {
      it('Get employments', () => new Promise((ok, ko) => {
        mock(props.socket, getEmployments, 'get employments')
          .then(
            employments => {
              locals.employments = employments;
              ok();
            },
            ko
          );
      }));
    }]);

    it('should be the same number than DB', (ok, ko) => {
      locals.dbCountries.length.should.be.exactly(locals.employments.length);
    });

    it('should all be employments', describe.use(() => areEmployments(locals.employments)));

  });
}

export default test;
