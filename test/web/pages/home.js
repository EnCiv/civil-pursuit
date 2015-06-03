'use strict';

import should from 'should';
import Milk from 'syn/lib/app/milk';
import config from 'syn/config.json';
import IntroTest from '../components/intro';
import LayoutTest from '../components/layout';
import JoinTest from '../components/join';
import TopLevelPanelTest from '../components/top-level-panel';

class HomePage extends Milk {

  constructor (props) {
    props = props || {};

    let options = { viewport : props.viewport };

    super('Landing Page', options);

    this

      .go('/')

      .import(LayoutTest)

      .import(IntroTest, { driver : false })

      .import(TopLevelPanelTest, { driver : false })

      .import(JoinTest, { toggled : false })

      .import(LayoutTest)

    ;
  }

}

export default HomePage;
