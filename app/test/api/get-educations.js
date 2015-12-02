'use strict';

import describe                   from '../../lib/util/describe';
import should                     from 'should';
import mock                       from '../mock';
import getEducations              from '../../api/get-educations';
import isEducation                from '../../lib/assertions/education';
import Education                  from '../../models/education';

function test (props) {
  const locals = {};

  return describe ( ' API / Get Educations', [
    {
      'Get educations from DB' : [
        {
          'should get educations' : (ok, ko) => {
            Education.find({}, { limit : false }).then(
              educations => {
                locals.dbEducations = educations;
                ok();
              },
              ko
            );
          }
        }
      ]
    },
    {
      'Get educations' : (ok, ko) => {
        mock(props.socket, getEducations, 'get educations')
          .then(
            educations => {
              locals.educations = educations;
              ok();
            },
            ko
          );
      }
    },
    {
      'should be educations' : (ok, ko) => {
        locals.educations.should.be.an.Array();
        locals.educations.forEach(education => education.should.be.a.education());
        ok();
      }
    },
    {
      'should be the same number than DB' : (ok, ko) => {
        locals.dbEducations.length.should.be.exactly(locals.educations.length);
        ok();
      }
    }
  ]);
}

export default test;
