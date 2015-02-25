/*
 *  F   O   R   M
 *  *****************
*/

! function () {

  'use strict';

  /**
   *  @class    Form
   *  @arg      {HTMLElement} form
   */

  function Form (form) {

    var self = this;

    this.form = form;

    this.form.on('submit', function () {
      setTimeout(self.submit.bind(self));

      return false;
    });
  }

  Form.prototype.submit = function () {

    console.warn('submitting', this.form.attr('name'))

    var self = this;

    var errors = [];

    self.form.find('[required]').each(function () {
      var val = $(this).val();

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
  };

  Form.prototype.send = function (fn) {
    this.ok = fn;
  };

  module.exports = Form;

} ();
