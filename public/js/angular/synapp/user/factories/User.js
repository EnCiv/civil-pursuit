/**
 * `UserFactory` User Factory (legacy from SignCtrl)
 * 
 * @module synapp
 * @submodule factories
 * @method factory::user
 * @return {AngularFactory}
 * @author francoisrvespa@gmail.com
*/

module.exports = function UserFactory ($http) {
  return {
    signIn: function (creds) {
      return $http.post('/sign/in', creds);
    },

    signUp: function (creds) {
      return $http.post('/sign/up', creds);
    },

    findByEmail: function (email) {
      return $http.get('/json/User/findOne?email=' + email);
    }
  };
};
