'use strict';

import should from 'should';
import Milk from 'syn/lib/app/milk';
import config from 'syn/config.json';
import IntroTest from '../components/intro';
import LayoutTest from '../components/layout';
import TopLevelPanelTest from '../components/top-level-panel';

class HomePage extends Milk {

  constructor () {
    super('Landing Page', { viewport : 'tablet' });

    this

      .import(LayoutTest, { driver : false })

      .import(IntroTest, { driver : false })

      .import(TopLevelPanelTest, { driver : false })

    ;
  }

}

export default HomePage;
