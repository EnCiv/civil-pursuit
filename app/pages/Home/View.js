'use strict'

import Layout from 'syn/components/Layout/View';
import IntroView           from 'syn/components/Intro/View';
import TopLevelPanelView   from 'syn/components/TopLevelPanel/View';

class HomePage extends Layout {
  constructor(props) {
    super(props);
    this.props = props;

    var main = this.find('#main').get(0);

    main.add(
      new IntroView(props),
      new TopLevelPanelView(props)
    );
  }
}

export default HomePage;
