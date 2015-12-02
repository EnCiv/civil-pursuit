'use strict';

import describe                   from '../../lib/util/describe';
import should                     from 'should';
import mock                       from '../mock';
import getEmployments             from '../../api/get-employments';
import isEmployment               from '../../lib/assertions/employment';
import Education                  from '../../models/employment';

function test (props) {
  const locals = {};

  return describe ( ' API / Get Employments', [
    {
      'Get employments from DB' : [
        {
          'should get employments' : (ok, ko) => {
            Education.find({}, { limit : false }).then(
              employments => {
                locals.dbEmployments = employments;
                ok();
              },
              ko
            );
          }
        }
      ]
    },
    {
      'Get employments' : (ok, ko) => {
        mock(props.socket, getEmployments, 'get employments')
          .then(
            employments => {
              locals.employments = employments;
              ok();
            },
            ko
          );
      }
    },
    {
      'should be employments' : (ok, ko) => {
        locals.employments.should.be.an.Array();
        locals.employments.forEach(employment => employment.should.be.a.employment());
        ok();
      }
    },
    {
      'should be the same number than DB' : (ok, ko) => {
        locals.dbEmployments.length.should.be.exactly(locals.employments.length);
        ok();
      }
    }
  ]);
}

export default test;
