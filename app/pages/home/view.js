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

    main.add(new IntroView(props));

    if ( props.discussion ) {

      console.log('we have discussion'.yellow);

      let deadline = new Date(props.discussion.deadline);

      let now = Date.now();

      let interval = deadline - now;

      if ( interval < 0 ) {
        main.add(new TopLevelPanelView(topPanelProps));
      }
      else {
        main.add(new CountDownView(props));
      }
    }
    else {
      main.add(new TopLevelPanelView(topPanelProps));
    }
  }
}

export default HomePage;
