'use strict';

class Cache {

  constructor () {
    this.cache = {
      templates: {}
    };
  }

  getTemplate (tpl) {
    return this.cache.templates[tpl];
  }

  setTemplate (tpl, val) {
    this.cache.templates[tpl] = val;
  }

}

export default new Cache()