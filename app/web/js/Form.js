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

    this.labels = {};

    this.form.find('[name]').each(function () {
      self.labels[$(this).attr('name')] = $(this);
    });

    // #193 Disable <Enter> keys

    this.form.find('input').on('keydown', function (e) {
      if ( e.keyCode === 13 ) {
        return false;
      }
    });

    this.form.on('submit', function (e) {
      setTimeout(function () {
        self.submit(e);
      });

      return false;
    });
  }

  Form.prototype.submit = function (e) {

    console.warn('form submitting', this.form.attr('name'), e);

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

    return this;
  };

  module.exports = Form;

} ();
