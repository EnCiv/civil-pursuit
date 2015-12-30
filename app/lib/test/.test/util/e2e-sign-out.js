'use strict';

function signOut(driver) {
  const locals = {
    signOutButton : '.syn-top_bar-sign-out-button i'
  };

  return it => {
    it('should click sign out button', (ok, ko) => {
      driver.click(locals.signOutButton).then(ok, ko);
    });
  };
}

export default signOut;
