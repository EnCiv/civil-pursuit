'use strict';

import Mungo          from 'mungo';

class SidebarLink extends Mungo.Model {
  static schema () {
    return {};
  }
}

SidebarLink.collection = 'sidebar-links';
SidebarLink.version = 1;

export default SidebarLink;
