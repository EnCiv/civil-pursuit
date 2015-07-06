'use strict';

import domainRun from './domain-run';

class Form {

  constructor (form) {

    let self = this;

    this.form = form;

    this.labels = {};

    form.find('[name]').each(function () {
      self.labels[$(this).attr('name')] = $(this);
    });

    // #193 Disable <Enter> keys

    form.find('input').on('keydown', function (e) {
      if ( e.keyCode === 13 ) {
        return false;
      }
    });

    form.on('submit', e => {
      setTimeout(() => this.submit(e));
      return false;
    });

  }

  send (fn) {
    this.ok = fn;
    return this;
  }

  submit (e) {
    let errors = [];

    this.form.find('[required]').each(function () {
      let val = $(this).val();

      if ( ! val ) {

        if ( ! errors.length ) {
          $(this)
            .addClass('error')
            .focus();
        }

        errors.push({ required: $(this).attr('name') });
      }

      else {
        $(this)
          .removeClass('error');
      }
    });

    if ( ! errors.length ) {
      this.ok();
    }

    return false;
  }

}

export default Form;
