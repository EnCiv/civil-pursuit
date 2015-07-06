'use strict';

import {Element} from 'cinco/dist';
import config from '../../../config.json';

class GoogleAnalytics extends Element {
  constructor (props) {
    super('script');

    this.props = props;

    this.condition(() => props.settings.env === 'production');

    this.text("(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){ (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o), m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m) })(window,document,'script','//www.google-analytics.com/analytics.js','ga');ga('create', '" + config['google analytics'].key + "', 'auto'); ga('send', 'pageview');");
  }
}

export default GoogleAnalytics;