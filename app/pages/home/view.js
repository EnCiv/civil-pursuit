'use strict'

import Layout               from 'syn/components/layout/view';
import IntroView            from 'syn/components/intro/view';
import TopLevelPanelView    from 'syn/components/top-level-panel/view';

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
