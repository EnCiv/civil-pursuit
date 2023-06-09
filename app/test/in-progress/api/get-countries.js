'use strict';

import describe                   from 'redtea';
import should                     from 'should';
import mock                       from 'syn/../../dist/lib/app/socket-mock';
import getCountries               from 'syn/../../dist/api/get-countries';
import isCountry                  from 'syn/../../dist/test/is/country';
import Country                    from 'syn/../../dist/models/country';

function areCountries(countries) {
  return it => {
    countries.forEach(country => it('should be a country', describe.use(() => isCountry(country))));
  };
}

function test (props) {
  const locals = {};

  return describe ( ' API / Get Countries', it => {
    it('Get countries from DB', [ it => {
      it('should get countries', () => new Promise((ok, ko) => {
        Country.find({}, { limit : false }).then(
          countries => {
            locals.dbCountries = countries;
            ok();
          },
          ko
        );
      }));
    }]);


    it('Get countries from socket', [ it => {
      it('Get countries', () => new Promise((ok, ko) => {
        mock(props.socket, getCountries, 'get countries')
          .then(
            countries => {
              locals.countries = countries;
              ok();
            },
            ko
          );
      }));
    }]);

    it('should be the same number than DB', (ok, ko) => {
      locals.dbCountries.length.should.be.exactly(locals.countries.length);
    });

    it('should all be countries', describe.use(() => areCountries(locals.countries)));

  });
}

export default test;
