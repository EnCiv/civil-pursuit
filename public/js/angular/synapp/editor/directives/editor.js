;(function () {

  /**
   *
   */

  module.exports = ['$rootScope', '$timeout', 'DataFactory', 'Channel', EditorComponent];

  function EditorComponent ($rootScope, $timeout, DataFactory, Channel) {
    return {
      restrict: 'C',
      
      scope: {
        type:         '@',
        parent:       '@',
        itemId:       '@',
        panelId:      '@'
      },
      
      templateUrl: '/templates/editor',
      
      controller: function ($scope) {

        // console.log('EDITOR', {
        //   type: $scope.type,
        //   parent: $scope.parent,
        //   itemId: $scope.itemId,
        //   panelId: $scope.panelId,
        //   id: $scope.$id
        // });

        /** @function */

        function getImage () {
          if ( Array.isArray($rootScope.uploadResult) && $rootScope.uploadResult.length ) {
            return $rootScope.uploadResult[0].path.split(/\//).pop();
          }
        }

        /** @prop {Object} - Item (being created OR being edited) */

        $scope.item = {
          references: []
        };

        /** @prop {bool} - True if (save()) in progress */
        /** @note Using Angular dot notation (Angular sppecific)
            -- and getting idiomatic while at it */

        $scope.is = {
          in: {
            progress: false
          }
        };

        /** */

        $scope.error = false;

        /** */

        $scope.$watch('error', function (error, _error) {
          if ( error ) {
            $scope.is.in.progress = false;
          }
        });

        /** Save the new item (either create or update)
         *  @function
         */

        $scope.save = function () {
          /** @des Trueing "is in progress" so User can not duplicate action */

          $scope.is.in.progress = true;

          /** @des Reset (error) to null so previous error messages get removed */

          $scope.error = null;

          /** @des Make sure we have a subject */

          if ( ! $scope.item.subject ) {
            $scope.error = 'Please enter a subject';
            
            $timeout(function () {
              //$(window).scrollTop();
            });

            return false;
          }

          /** @des Make sure we have a description */

          if ( ! $scope.item.description ) {
            return $scope.error = 'Please enter a description';
          }

          /** @des Show loading icon */

          $('#loading-editor').modal('show');

          /** @des Building the item to send to the back-end using this.item as model */

          var candidate = {
            subject: $scope.item.subject,
            description: $scope.item.description,
            references: $scope.item.references,
            type: $scope.type
          };

          if ( $scope.parent ) {
            candidate.parent = $scope.parent;
          } 

          if ( candidate.references && ! Array.isArray(candidate.references) ) {
            candidate.references = candidateect.keys(candidate.references).map(function (index) {
              return candidate.references[index];
            });
          }

          // UPDATE

          if ( $scope['item-id'] ) {
            candidate.image = getImage() || $scope.editor.image;
          }

          // CREATE

          else {
            candidate.image = getImage();

            setTimeout(function () {
              DataFactory.model('Item').post(candidate)

                .ok(
                  function (created) {
                    // attach upload image since cloudinary is async
                    if (  $rootScope.dataUrls &&  $rootScope.dataUrls.length ) {
                      created.image = $rootScope.dataUrls[0];
                    }

                    // Broadcasting we have a new item
                    console.log($scope.parent || 'root', 'new item', created);
                    Channel.emit($scope.parent || 'root', 'new item', created);

                    // Turn off progress light
                    $scope.is.in.progress = false;

                    // Resetting item ng-model
                    $scope.item = {
                      references: []
                    };

                    // Resetting image
                    $rootScope.dataUrls = [];

                    // Hiding editor
                    $('#loading-editor').modal('hide');

                    // Collapsing
                    $scope.$parent.panel.$view.editor = false;
                  });
            }, synapp.latency[synapp.env]); 
          }
        };
      },

      link: function ($scope, $elem, $attr) {
        $scope.$elem = $elem;

        $scope.collapse = function () {
          $scope.$parent.panel.$view.editor = false;
        }
      }
    };
  }

})();
