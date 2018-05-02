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
                // fixup for google api error
                let civicInfo=res.body;
                if(!civicInfo || !civicInfo.kind || civicInfo.kind !== 'civicinfo#representativeInfoResponse') 
                    cb(res.body);
                else {
                    let parts=civicInfo.normalizedInput.line1.split(' ');
                    if(parts[parts.length-1]===civicInfo.normalizedInput.zip){
                        logger.error("civic info api fixup", streetAddress, civicInfo.normalizedInput.line1);
                        parts.splice(parts.length-1,1); // delete the zip code
                        let i=0;
                        while(i<parts.length){
                            if(parts[i]==="") parts.splice(i,1);
                            if(parts[i].length && parts[i][parts[i].length-1]===',') parts[i]=parts[i].slice(0,-1);
                            i++;
                        }
                        civicInfo.normalizedInput.line1=parts.join(' ');
                        cb(civicInfo);
                    } else
                        cb(res.body);
                }
            })
          }
          catch ( error) { cb(null); this.error(error) }
}

export default getCivicInfo;
