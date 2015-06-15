'use strict';

import should from 'should';
import Milk from 'syn/lib/app/milk';
import config from 'syn/config.json';
import IntroTest from '../components/intro';
import LayoutTest from '../components/layout';
import JoinTest from '../components/join';
import LoginTest from '../components/login';
import TopLevelPanelTest from '../components/top-level-panel';
import SignOutTest from '../components/sign-out';

class HomePage extends Milk {

  constructor (props) {
    props = props || {};

    let options = { viewport : props.viewport };

    super('Landing Page', options);

    this

      .go('/')

      // .import(LayoutTest)

      // .import(IntroTest)

      // .import(TopLevelPanelTest)

      // .import(JoinTest, { toggled : false })

      // .import(LayoutTest)

      // .import(TopLevelPanelTest)

      // .import(SignOutTest)

      // .import(LayoutTest)

      // .import(TopLevelPanelTest)

      .import(LoginTest, { toggled : false })

      // .import(LayoutTest)

      .import(TopLevelPanelTest)
  }

}

export default HomePage;
