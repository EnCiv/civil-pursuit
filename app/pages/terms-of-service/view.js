'use strict'

import Layout               from '../../components/layout/view';
import IntroView            from '../../components/Intro/view';
import TopLevelPanelView    from '../../components/TopLevelPanel/view';
import marked               from 'marked';
import {Element}            from 'cinco/dist';

class TOS extends Layout {
  constructor(props) {
    props = props || {};

    props.title = 'Terms of Service';

    super(props);

    this.props = props;

    var main = this.find('#main').get(0);

    main.add(
      new Element('#terms-of-service/container').text(marked(props.TOS))
    );
  }
}

export default TOS;
