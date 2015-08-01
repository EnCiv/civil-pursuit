'use strict'

import Layout               from '../../components/layout/view';
import IntroView            from '../../components/intro/view';
import TopLevelPanelView    from '../../components/top-level-panel/view';
import CountDownView        from '../../components/countdown/view';

class HomePage extends Layout {
  constructor(props) {
    super(props);
    this.props = props;

    var main = this.find('#main').get(0);

    let topPanelProps = props;

    topPanelProps.countdown = true;

    main.add(
      new IntroView(props),
      new TopLevelPanelView(topPanelProps),
      new CountDownView(props)
    );
  }
}

export default HomePage;
