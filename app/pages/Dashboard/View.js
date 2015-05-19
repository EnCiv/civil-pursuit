'use strict'

import {Element} from 'cinco';
import Layout from 'syn/components/Layout/View';
import YouTube from 'syn/components/YouTube/View';

class DashboardPage extends Layout {
  constructor(props) {
    super(props);
    this.props = props;

    var main = this.find('#main').get(0);

    main.add(
      this.models(),
      this.components()
    );
  }

  models () {
    return new Element('section#models').add(
      new Element('header').add(
        new Element('h1').text('Models')
      )
    );
  }

  components () {
    return new Element('section#components').add(
      new Element('header').add(
        new Element('h1').text('Components')
      ),

      new Element('').add(
        new Element('select').add(
          new Element('option').text('YouTube')
        )
      ),

      new Element('.component-preview').add(
        new YouTube({ YouTubeUrl: 'https://www.youtube.com/watch?v=4avRCz_Hw5w',
          settings: { env: 'production' }})
      )
    );
  }
}

export default DashboardPage;
