! function () {
  
  'use strict';

  var html5 = require('syn/lib/html5');

  module.exports = function (locals) {

    return html5.Element('.login-modal', {},
      [
        html5.Element('h4', { $text: 'Login with email' }),

        html5.Element('form',
          {
            role        :   'form',
            method      :   'POST',
            novalidate  :   'novalidate',
            name        :   'login'
          },

          [
            html5.Element('.login-error-404.is-container', {},
              [
                html5.Element('.is-section', {},
                  [
                    html5.Element('.danger', {},
                      [
                        html5.Element('p', {},
                          [
                            html5.Element('strong', { $text: 'Wrong email' })
                          ]
                        )
                      ]
                    )
                  ]
                )
              ]
            ),

            html5.Element('.login-error-401.is-container', {},
              [
                html5.Element('.is-section', {},
                  [
                    html5.Element('.danger', {},
                      [
                        html5.Element('p', {},
                          [
                            html5.Element('strong', { $text: 'Wrong password' })
                          ]
                        )
                      ]
                    )
                  ]
                )
              ]
            ),

            html5.Element('.sign-success.success'),

            html5.Element('.form-group', {},
              [
                html5.Element('label', { $text: 'Email' }),

                html5.Element('input',
                  {
                    type          :   'email',
                    placeholder   :   'Email',
                    name          :   'email',
                    required      :   'required'
                  }
                )
              ]
            ),

            html5.Element('.form-group', {},
              [
                html5.Element('label', { $text: 'Password' }),

                html5.Element('input',
                  {
                    type          :   'password',
                    placeholder   :   'Password',
                    name          :   'password',
                    required      :   'required'
                  }
                )
              ]
            ),


            html5.Element('p', {},
              [
                html5.Element('button.primary.login-submit.block', {}, [
                  html5.Element('i.fa.fa-sign-in'),
                  html5.Element('span', { $text : 'Login' })
                ])
              ]
            )

          ]
        ),

        html5.Element('h5', {}, [
          html5.Element('a.forgot-password-link', {
            href      :   '#',
            $text     :   'Forgot password?'
          })
        ])

      ]);

  };

} ();
