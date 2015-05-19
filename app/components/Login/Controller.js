'use strict';

import Controller from 'syn/lib/app/Controller';
import Form from 'syn/lib/util/Form';
import Nav from 'syn/lib/util/Nav';

class Login extends Controller {

  get template () {
    return $('form[name="login"]');
  }

  constructor (props) {
    super();

    this.props = props || {};

    this.form = new Form(this.template);

    this.form.send(this.submit.bind(this));
  }

  submit (e) {
    let d = this.domain;

    d.run(() => {
      if ( $('.login-error-404').hasClass('is-shown') ) {
        return Nav.hide($('.login-error-404'), d.intercept(() => {
          // this.send(login);
          this.form.submit();
        }))
      }

      if ( $('.login-error-401').hasClass('is-shown') ) {
        return Nav.hide($('.login-error-401'), d.intercept(() => {
          // this.send(login);
          this.form.submit();
        }))
      }
      
      $.ajax({
          url         :   '/sign/in',
          type        :   'POST',
          data        :   {
            email     :   this.form.labels.email.val(),
            password  :   this.form.labels.password.val()
          }})

        .error(response => {
          switch ( response.status ) {
            case 404:
              Nav.show($('.login-error-404'));
              break;

            case 401:
              Nav.show($('.login-error-401'));
              break;
          }
        })

        .success(response => {
          $('a.is-in').css('display', 'inline');

          $('.topbar .is-out').remove();

          vex.close(this.props.$vexContent.data().vex.id);

        });
    });
  }

}

export default Login;
