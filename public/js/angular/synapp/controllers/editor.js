/**
 * `EditorCtrl` Editor
 * 
 * @module controllers/editor
 * @prop editor {Object} - The edited item
 * @prop editor.error {(String | Null)} - Error message if any
 * @prop editor.subject {String} - Edited item's description
 * @example
 *    <ANY ng-controller="EditorCtrl" />
 * @author francoisrvespa@gmail.com
*/

module.exports = function ($scope, DataFactory, $timeout) {
  function getImage () {
    if ( Array.isArray($scope.uploadResult) && $scope.uploadResult.length ) {
      return $scope.uploadResult[0].path.split(/\//).pop();
    }
  }

  if ( ! $scope.editor ) {
    $scope.editor = {};
  }

  $scope.editor.$save = function saveEditor () {
      
    this.$error = null;

    if ( ! $scope.editor.subject ) {
      return this.$error = 'Please enter a subject';
    }

    if ( ! $scope.editor.description ) {
      return this.$error = 'Please enter a description';
    }

    var obj = {};

    for ( var key in $scope.editor ) {
      if ( ! /^\$/.test(key) && key !== '_id' ) {
        obj[key] = $scope.editor[key];
      }
    }

    if ( obj.references && ! Array.isArray(obj.references) ) {
      obj.references = Object.keys(obj.references).map(function (index) {
        return obj.references[index];
      });
    }

    // update

    if ( $scope.editor._id ) {

      obj.image = getImage() || $scope.editor.image;

      console.log(obj.image)

      ItemFactory.updateById($scope.editor._id, obj)
      .success(function () {
        location.href = '/evaluate/create/';
      });
    }

    // create

    else {
      obj.image = getImage();

      console.log('creating item', obj);

      DataFactory.model('Item').post(obj)

        .ok(
          function (created) {
            location.href = '/evaluate/' + created._id;
          });
    }
  };
  
  $timeout(function () {
    if ( $scope.editor.$item ) {
      ItemFactory.findById($scope.editor.$item)
        .success(function (item) {
          for ( var key in item ) {
            $scope.editor[key] = item[key];
          }
        });
    }
  });
};
