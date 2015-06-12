'use strict';

import Controller from 'syn/lib/app/Controller';
import Form from 'syn/lib/util/Form';

class Join extends Controller {

  get template () {
    return $('form[name="join"]');
  }

  constructor (props) {
    super();

    this.props = props || {};

    this.form = new Form(this.template);

    this.form.send(this.submit.bind(this));

    this.template.find('.i-agree').on('click', function () {

      var agreed = $(this).find('.agreed');

      if ( agreed.hasClass('fa-square-o') ) {
        agreed.removeClass('fa-square-o').addClass('fa-check-square-o');
      }
      else {
        agreed.removeClass('fa-check-square-o').addClass('fa-square-o');
      }
    });
  }

  submit (e) {
    let d = this.domain;

    d.run(() => {

        this.template.find('.please-agree').addClass('hide');
        
        this.template.find('.already-taken').hide();

        if ( this.form.labels.password.val() !== this.form.labels.confirm.val() ) {
          this.form.labels.confirm.focus().addClass('error');

          return;
        }
        
        if ( ! this.template.find('.agreed').hasClass('fa-check-square-o') ) {
          this.template.find('.please-agree').removeClass('hide');

          return;
        }

        console.info('signing up')

        $.ajax({
          url: '/sign/up',
          type: 'POST',
          data: {
            email:    this.form.labels.email.val(),
            password: this.form.labels.password.val()
          }
        })
          
          .error((response, state, code) => {
            if ( response.status === 401 ) {
              this.template.find('.already-taken').show();
            }
          })
          
          .success((response) => {

            this.reconnect();

            $('a.is-in').css('display', 'inline');

            $('.topbar .is-out').remove();

            vex.close(this.props.$vexContent.data().vex.id);
          });

      });
  }

}

export default Join;
