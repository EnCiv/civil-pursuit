'use strict';

import React from 'react';

class Facebook extends React.Component {
  static login () {
    console.log('hello');
    FB.getLoginStatus(response => console.log({response}), true);
  }

  // This is called with the results from from FB.getLoginStatus().
  static statusChangeCallback (response) {
    console.log('statusChangeCallback');
    console.log(response);
    // The response object is returned with a status field that lets the
    // app know the current login status of the person.
    // Full docs on the response object can be found in the documentation
    // for FB.getLoginStatus().
    if (response.status === 'connected') {
      // Logged into your app and Facebook.
      this.testAPI();
    } else if (response.status === 'not_authorized') {
      // The person is logged into Facebook, but not your app.
      console.log('Please login to app');
    } else {
      // The person is not logged into Facebook, so we're not sure if
      // they are logged into this app or not.
      console.log('Please login to facebook');
    }
  }

  static testAPI() {
    console.log('Welcome!  Fetching your information.... ');
    FB.api('/me', function(response) {
      console.log('Successful login for: ' + response.name);
      document.getElementById('status').innerHTML =
        'Thanks for logging in, ' + response.name + '!';
    });
  }
}

export default Facebook;
