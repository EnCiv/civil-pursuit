'use strict';

import describe                   from '../../lib/util/describe';
import should                     from 'should';
import mock                       from '../mock';
import getCountries               from '../../api/get-countries';
import isCountry                  from '../../lib/assertions/country';
import Country                    from '../../models/country';

function test (props) {
  const locals = {};

  return describe ( ' API / Get Countries', [
    {
      'Get countries from DB' : [
        {
          'should get countries' : (ok, ko) => {
            Country.find({}, { limit : false }).then(
              countries => {
                locals.dbCountries = countries;
                ok();
              },
              ko
            );
          }
        }
      ]
    },
    {
      'Get countries' : (ok, ko) => {
        mock(props.socket, getCountries, 'get countries')
          .then(
            countries => {
              locals.countries = countries;
              ok();
            },
            ko
          );
      }
    },
    {
      'should be countries' : (ok, ko) => {
        locals.countries.should.be.an.Array();
        locals.countries.forEach(country => country.should.be.a.country());
        ok();
      }
    },
    {
      'should be the same number than DB' : (ok, ko) => {
        locals.dbCountries.length.should.be.exactly(locals.countries.length);
        ok();
      }
    }
  ]);
}

export default test;
