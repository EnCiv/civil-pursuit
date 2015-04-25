! function () {
  
  'use strict';

  var Html5 = require('syn/lib/html5');
  var e = Html5.elem;

  module.exports = function (locals) {

    return [
      
      e('.login-modal', {},
        [
          e('h4', { $text: 'Login with email' }),

          e('form',
            {
              role        :   'form',
              method      :   'POST',
              novalidate  :   'novalidate',
              name        :   'login'
            },

            [
              e('.login-error-404.is-container', {},
                [
                  e('.is-section', {},
                    [
                      e('.danger', {},
                        [
                          e('p', {},
                            [
                              e('strong', { $text: 'Wrong email' })
                            ]
                          )
                        ]
                      )
                    ]
                  )
                ]
              ),

              e('.login-error-401.is-container', {},
                [
                  e('.is-section', {},
                    [
                      e('.danger', {},
                        [
                          e('p', {},
                            [
                              e('strong', { $text: 'Wrong password' })
                            ]
                          )
                        ]
                      )
                    ]
                  )
                ]
              ),

              e('.sign-success.success'),

              e('.form-group', {},
                [
                  e('label', { $text: 'Email' }),

                  e('input',
                    {
                      type          :   'email',
                      placeholder   :   'Email',
                      name          :   'email',
                      required      :   'required'
                    }
                  )
                ]
              ),

              e('.form-group', {},
                [
                  e('label', { $text: 'Password' }),

                  e('input',
                    {
                      type          :   'password',
                      placeholder   :   'Password',
                      name          :   'password',
                      required      :   'required'
                    }
                  )
                ]
              ),


              e('p', {},
                [
                  e('button.primary.login-submit.block', {}, [
                    e('i.fa.fa-sign-in'),
                    e('span', { $text : 'Login' })
                  ])
                ]
              )

            ]
          ),

          e('h5', {}, [
            e('a.forgot-password-link', {
              href      :   '#',
              $text     :   'Forgot password?'
            })
          ])

        ])
      
    ];

  };

} ();
