'use strict';

import App          from '../../app';
import TopBar       from '../../components/top-bar/ctrl';
// import Profile from '../../components/Profile/Controller';

synapp.app = new App(true);

synapp.app.ready(() => {

  new TopBar().render();

  // new Profile().render();

});
