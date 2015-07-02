'use strict';

import App        from 'syn/app';
import TopBar     from 'syn/components/top-bar/ctrl';

synapp.app = new App(true);

synapp.app.ready(() => { new TopBar().render() });
