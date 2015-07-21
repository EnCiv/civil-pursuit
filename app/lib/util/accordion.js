'use strict';

class Accordion {

  static toggle (elem, pOA) {
    return new Promise((ok, ko) => {
      try {
        if ( ! elem.hasClass('is-toggable') ) {
          elem.addClass('is-toggable');
        }

        if ( elem.hasClass('is-showing') || elem.hasClass('is-hiding') ) {
          let error   =   new Error('Animation already in progress');
          error.code  =   'ANIMATION_IN_PROGRESS';
          return ko(error);
        }

        if ( elem.hasClass('is-shown') ) {
          Accordion
            .unreveal(elem, pOA)
            .then(ok, ko);
        }
        else {
          Accordion
            .reveal(elem, pOA)
            .then(ok, ko);
        }
      }
      catch ( error ) {
        ko(error);
      }
    });
  }

  static reveal (elem, pOA) {
    
  }

}

export default Accordion;
