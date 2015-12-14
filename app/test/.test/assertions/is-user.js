'use strict';

import should         from 'should';
import Mungo          from 'mungo';
import describe       from 'redtea';
import User           from '../../../models/user';
import isDocument     from './is-document';
import isRace         from './is-race';
import isObjectID     from './is-object-id';

function isUser (user, compare = {}, serialized = false) {

  return it => {
    it(serialized ? 'should be serialized' : 'should not be serialized', ok => ok());

    it('should be a document', describe.use(() => isDocument(user, compare, serialized)));

    if ( ! serialized ) {
      it('should be a user', (ok, ko) => {
        user.should.be.an.instanceof(User);
        ok();
      });
    }

    it('should have a email', (ok, ko) => {
      user.should.have.property('email').which.is.a.String();
      ok();
    });

    if ( 'email' in compare ) {
      it('email should match compare', (ok, ko) => {
        user.email.should.be.exactly(compare.email);
        ok();
      });
    }

    it('should have a password', (ok, ko) => {
      user.should.have.property('password').which.is.a.String();
      ok();
    });

    if ( 'image' in user ) {
      it('should have an image', (ok, ko) => {
        user.should.have.property('image').which.is.a.String();
        ok();
      });
    }

    if ( 'preferences' in user ) {
      it('preferences', [ it => {
        it('should have preferences', (ok, ko) => {
          user.should.have.property('preferences').which.is.an.Array();
          ok();
        });
        user.preferences.forEach(preference => it('should be a preference', [ it  => {
          it('should be an object', (ok, ko) => {
            preference.should.be.an.Object();
            ok();
          });
          it('should have name', (ok, ko) => {
            preference.should.have.property('name');
            ok();
          });
          it('name should be a string', (ok, ko) => {
            preference.name.should.be.a.String();
            ok();
          });
          it('should have value', (ok, ko) => {
            preference.should.have.property('value');
            ok();
          });
        }]));
      }]);
    }

    if ( 'twitter' in user ) {
      it('twitter', [ it => {
        it('should have twitter', (ok, ko) => {
          user.should.have.property('twitter');
          ok();
        });
        it('should be a string', (ok, ko) => {
          user.twitter.should.be.a.String();
          ok();
        });

        if ( 'twitter' in compare ) {
          it('should match compare', (ok, ko) => {
            user.twitter.should.be.exactly(compare.twitter);
            ok();
          });
        }
      }]);
    }

    if ( 'facebook' in user ) {
      it('facebook', [ it => {
        it('should have facebook', (ok, ko) => {
          user.should.have.property('facebook');
          ok();
        });
        it('should be a string', (ok, ko) => {
          user.facebook.should.be.a.String();
          ok();
        });

        if ( 'facebook' in compare ) {
          it('should match compare', (ok, ko) => {
            user.facebook.should.be.exactly(compare.facebook);
            ok();
          });
        }
      }]);
    }

    if ( 'first_name' in user ) {
      it('first_name', [ it => {
        it('should have first_name', (ok, ko) => {
          user.should.have.property('first_name');
          ok();
        });
        it('should be a string', (ok, ko) => {
          user.first_name.should.be.a.String();
          ok();
        });

        if ( 'first_name' in compare ) {
          it('should match compare', (ok, ko) => {
            user.first_name.should.be.exactly(compare.first_name);
            ok();
          });
        }
      }]);
    }

    if ( 'middle_name' in user ) {
      it('middle_name', [ it => {
        it('should have middle_name', (ok, ko) => {
          user.should.have.property('middle_name');
          ok();
        });
        it('should be a string', (ok, ko) => {
          user.middle_name.should.be.a.String();
          ok();
        });

        if ( 'middle_name' in compare ) {
          it('should match compare', (ok, ko) => {
            user.middle_name.should.be.exactly(compare.middle_name);
            ok();
          });
        }
      }]);
    }

    if ( 'last_name' in user ) {
      it('last_name', [ it => {
        it('should have last_name', (ok, ko) => {
          user.should.have.property('last_name');
          ok();
        });
        it('should be a string', (ok, ko) => {
          user.last_name.should.be.a.String();
          ok();
        });

        if ( 'last_name' in compare ) {
          it('should match compare', (ok, ko) => {
            user.last_name.should.be.exactly(compare.last_name);
            ok();
          });
        }
      }]);
    }

    if ( 'activation_key' in user ) {
      it('activation_key', [ it => {
        it('should have activation_key', (ok, ko) => {
          user.should.have.property('activation_key');
          ok();
        });
        it('should be a string', (ok, ko) => {
          user.activation_key.should.be.a.String();
          ok();
        });

        if ( 'activation_key' in compare ) {
          it('should match compare', (ok, ko) => {
            user.activation_key.should.be.exactly(compare.activation_key);
            ok();
          });
        }
      }]);
    }

    if ( 'activation_token' in user ) {
      it('activation_token', [ it => {
        it('should have activation_token', (ok, ko) => {
          user.should.have.property('activation_token');
          ok();
        });
        it('should be a string', (ok, ko) => {
          user.activation_token.should.be.a.String();
          ok();
        });

        if ( 'activation_token' in compare ) {
          it('should match compare', (ok, ko) => {
            user.activation_token.should.be.exactly(compare.activation_token);
            ok();
          });
        }
      }]);
    }

    if ( 'race' in user ) {
      it('race', [ it => {
        it('should have race', (ok, ko) => {
          user.should.have.property('race');
          ok();
        });

        it('should be an array', (ok, ko) => {
          user.race.should.be.an.Array();
          ok();
        });

        user.race.forEach(race => it('should be a race', describe.use(() => isObjectID(race))));

        if ( 'race' in compare ) {
          user.race.forEach((race, index) => it('should be a race', describe.use(() => isObjectID(race, compare.race[index]))));
        }
      }]);
    }

    if ( 'country' in user ) {
      it('country', [ it => {
        it('should have country', (ok, ko) => {
          user.should.have.property('country');
          ok();
        });

        it('should be an array', (ok, ko) => {
          user.country.should.be.an.Array();
          ok();
        });

        user.country.forEach(country => it('should be a country', describe.use(() => isObjectID(country))));

        if ( 'country' in compare ) {
          user.country.forEach((country, index) => it('should be a country', describe.use(() => isObjectID(country, compare.country[index]))));
        }
      }]);
    }

    if ( 'gps' in user ) {
      it('GPS', [ it => {
        it('should have gps', (ok, ko) => {
          user.should.have.property('gps');
          ok();
        });
        it('should be an array', (ok, ko) => {
          user.gps.should.be.an.Array();
          ok();
        });

        if ( user.gps.length ) {
          it('should have a latitude and a longitude', (ok, ko) => {
            user.gps.should.have.length(2);
            ok();
          });

          it('Latitude', [ it => {
            it('should be a number', (ok, ko)  => {
              user.gps[0].should.be.a.Number();
              ok();
            });
          }]);

          it('Longitude', [ it => {
            it('should be a number', (ok, ko)  => {
              user.gps[1].should.be.a.Number();
              ok();
            });
          }]);
        }
      }]);

      if ( 'GPS validated' in user ) {
        it('GPS validate', [ it => {
          it('should have gps validated', (ok, ko) => {
            user.should.have.property('gps validated');
            ok();
          });
          it('should be a date', (ok, ko) => {
            user['gps validated'].should.be.an.instanceof(Date);
            ok();
          });
        }]);
      }
    }

    else if ( 'gps validated' in user ) {
      it('GPS validated', [ it => {
        it('should have gps validated', (ok, ko) => {
          user.should.have.property('gps validated');
          ok();
        });
        it('should be a date', (ok, ko) => {
          user['gps validated'].should.be.an.instanceof(Date);
          ok();
        });
      }]);
    }

    if ( 'gender' in user ) {
      it('gender', [ it => {
        it('should have gender', (ok, ko) => {
          user.should.have.property('gender');
          ok();
        });

        it('should be a string', (ok, ko) => {
          user.gender.should.be.a.String();
          ok();
        });

        it('should be in array of accepted gender', (ok, ko) => {
          User.gender.indexOf(user.gender).should.be.above(-1);
          ok();
        });

        if ( 'gender' in compare ) {
          it('should match compare', (ok, ko) => {
            user.gender.should.be.exactly(compare.gender);
            ok();
          });
        }
      }]);
    }

    if ( 'married' in user ) {
      it('married', [ it => {
        it('should have married', (ok, ko) => {
          user.should.have.property('married');
          ok();
        });

        it('should be an Object ID', describe.use(() => isObjectID(user.married, compare.married, serialized)));
      }]);
    }

    if ( 'employment' in user ) {
      it('employment', [ it => {
        it('should have employment', (ok, ko) => {
          user.should.have.property('employment');
          ok();
        });

        it('should be an Object ID', describe.use(() => isObjectID(user.employment, compare.employment, serialized)));
      }]);
    }

    if ( 'education' in user ) {
      it('education', [ it => {
        it('should have education', (ok, ko) => {
          user.should.have.property('education');
          ok();
        });

        it('should be an Object ID', describe.use(() => isObjectID(user.education, compare.education, serialized)));
      }]);
    }

    if ( 'party' in user ) {
      it('party', [ it => {
        it('should have party', (ok, ko) => {
          user.should.have.property('party');
          ok();
        });

        it('should be an Object ID', describe.use(() => isObjectID(user.party, compare.party, serialized)));
      }]);
    }

    if ( 'dob' in user ) {
      it('Date of birth', [ it => {
        it('should have date of birth', (ok, ko) => {
          user.should.have.property('dob');
          ok();
        });
        it('should be a date', (ok, ko) => {
          user.dob.should.be.an.instanceof(Date);
          ok();
        });
      }]);
    }

    if ( 'registered_voter' in user ) {
      it('Registered voter', [ it => {
        it('should have is registered voter', (ok, ko) => {
          user.should.have.property('registered_voter');
          ok();
        });
        it('should be a boolean', (ok, ko) => {
          user.registered_voter.should.be.a.Boolean();
          ok();
        });
      }]);
    }

    if ( 'city' in user ) {
      it('City', [ it => {
        it('should have city', (ok, ko) => {
          user.should.have.property('city');
          ok();
        });
        it('should be a string', (ok, ko) => {
          user.city.should.be.a.String();
          ok();
        });
      }]);
    }

    if ( 'zip' in user ) {
      it('Zip', [ it => {
        it('should have zip', (ok, ko) => {
          user.should.have.property('zip');
          ok();
        });
        it('should be a string', (ok, ko) => {
          user.zip.should.be.a.String();
          ok();
        });
      }]);
    }

    if ( 'zip4' in user ) {
      it('Zip 4', [ it => {
        it('should have zip4', (ok, ko) => {
          user.should.have.property('zip4');
          ok();
        });
        it('should be a string', (ok, ko) => {
          user.zip4.should.be.a.String();
          ok();
        });
      }]);
    }

    if ( 'state' in user ) {
      it('State', [ it => {
        it('should have state', (ok, ko) => {
          user.should.have.property('state');
          ok();
        });
        it('should be an object id', describe.use(() => isObjectID(user.state, compare.state, serialized)));
      }]);
    }

  };

}

export default isUser;
