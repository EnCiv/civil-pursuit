'use strict';

import App from 'syn/app';
import TopBar from 'syn/components/TopBar/Controller';

synapp.app = new App(true);

synapp.app.ready(() => { new TopBar().render() });
