'use strict';

import App        from '../../app';
import TopBar     from '../../components/top-bar/ctrl';

synapp.app = new App(true);

synapp.app.ready(() => { new TopBar().render() });
