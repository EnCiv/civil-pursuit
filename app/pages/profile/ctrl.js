'use strict';

import App          from '../../app';
import TopBar       from '../../components/top-bar/ctrl';
import Profile      from '../../components/profile/ctrl';

synapp.app = new App(true);

synapp.app.ready(session => {

  new TopBar().render();

  new Profile({ session }).render();

});
