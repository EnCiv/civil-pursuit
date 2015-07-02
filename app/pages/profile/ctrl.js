'use strict';

import App from 'syn/app';
import TopBar from 'syn/components/top-bar/ctrl';
// import Profile from 'syn/components/Profile/Controller';

synapp.app = new App(true);

synapp.app.ready(() => {

  new TopBar().render();

  // new Profile().render();

});
