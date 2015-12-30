'use strict';

import reset                from '../../../bin/reset';
import User                 from '../../../models/user';
import connectToMongoDB     from '../mongodb-client/connect';
import startHTTP            from '../http-server/start';
import startDriver          from '../selenium-driver/init';
import stopDriver           from '../selenium-driver/end';
import goHome               from '../selenium-driver/go-home';
import setUserCookie        from '../cookies/set-user-cookie';

export default props => describe => describe('Create simple item', it => {

  const that = {};

  it('Start services', it => {

    if ( ! props.mongodb ) {
      it('Connect to MongoDB', it => connectToMongoDB(that)(it));
    }

    if ( ! props.http ) {
      it('Start HTTP server', it => startHTTP(that)(it));
    }

    if ( ! props.driver ) {
      it('Start Selenium driver', it => startDriver(that)(it));
    }

    else {
      that.driver = props.driver;
    }

  });

  it('Populate DB', it => {

    it('should reset', () => reset());

    it('should create user',

      () => User.lambda().then(user => { that.user = user })

    );

  });

  it('Prepare driver' , it => {

    it('should go home', it => goHome(that)(it));

    it('should set user cookie', it => setUserCookie(that)(it));

  });

  it('should create item', it => {

    it('should toggle button', it => new Create(driver).toggle());

    it('create form should be visible', it => new Create(driver).toggle());

  });

  it('Stop services', it => {

    if ( ! props.driver ) {
      it('Stop Selenium driver', it => stopDriver(that)(it));
    }

  });

});
