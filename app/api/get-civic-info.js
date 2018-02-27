'use strict';

import Country from '../models/country';
import superagent from 'superagent';
function getCivicInfo (address, cb) {
  Country.find().limit(false)
    .then(cb)
    .catch(this.error.bind(this));
}

const apiKey=process.env.GoogleCivicApiKey;

function getCivicInfo(streetAddress, cb) {
        try {
            superagent
            .get('https://www.googleapis.com/civicinfo/v2/representatives')
            .query({key: apiKey})
            .query({address: streetAddress})
            .end((err, res) => {
                if(typeof res.body !== 'object') return cb(null);
                cb(res.body);
            })
          }
          catch ( error) { cb(null); this.error(error) }
}

export default getCivicInfo;
