'use strict';

function setUserCookie(props = {}) {
  const cookie = {
    name : 'synuser',
    value :  JSON.stringify({
      id : props.user._id
    })
  };

  const { client } = props.driver;

  return it => it('Set user cookie', it => {

    it('should set cookie', () => client.setCookie(cookie));

    it('should refresh', () => client.refresh());

  });
}

export default setUserCookie;
