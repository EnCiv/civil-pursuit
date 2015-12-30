'use strict';

function signIn(driver) {
  const locals = {
    signOutButton : '.syn-top_bar-login_button i'
  };

  return it => {
    it('should click sign in button', (ok, ko) => {
      driver.click(locals.signInButton).then(ok, ko);
    });
  };
}

export default signIn;
