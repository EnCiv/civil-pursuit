'use strict'

import Layout               from 'syn/components/Layout/View';
import IntroView            from 'syn/components/Intro/View';
import TopLevelPanelView    from 'syn/components/TopLevelPanel/View';
import marked               from 'marked';
import {Element}            from 'cinco/es5';

class TOS extends Layout {
  constructor(props) {
    super(props);
    this.props = props;

    var main = this.find('#main').get(0);

    main.add(
      new Element('#terms-of-service/container').text(marked(props.TOS))
    );
  }
}

export default TOS;
