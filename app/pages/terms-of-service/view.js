'use strict'

import Layout               from 'syn/components/layout/view';
import IntroView            from 'syn/components/Intro/view';
import TopLevelPanelView    from 'syn/components/TopLevelPanel/view';
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
