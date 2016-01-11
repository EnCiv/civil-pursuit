'use strict';

import Mungo from 'mungo';
import V1 from './migrations/1';

class HeaderMenu extends Mungo.Model {

  static version = 1

  static collection = 'header_menus';

  static migrations = {
    1 : V1
  }

  static schema = {
    title : {
      type : String,
      required : true,
      unique : true
    },
    icon : {
      type : String,
      required : true
    },
    link : {
      type : String,
      required : true
    }
  }

}

export default HeaderMenu;
