myApp.factory('Utility',
    ['$http', '$mdDialog','$q', '$route',
    function($http, $mdDialog, $q, $route) {

        return {
          loginCheck : function() {
            $http.get('/login').then(function(response) {
              var user = response.data;
              if (user == '') {
                showPromptLogin();
              }
            });
          },

          getBracketType : function(comment, party) {
            return (comment.substr(0,3) == 'B/O') ? 'square' : (party == 'Order') ? 'round' : 'none';
          },

          getTotalType : function(comment, party) {
            if (comment == 'B/O') {
              return 'backorder_total';
            }
            else {
              switch (party) {
                case 'Order':
                  return 'unreceived_total';
                case 'Receive':
                  return '-unreceived_total';
                default:
                  return 'total';
              }
            }
          },

          insertInventory : function(inv, asof, name, qty, party, comment = null, linkid = null) {
              var deferred = $q.defer();

              $http.post('/dashboard',
                  {asof: asof, name: name, qty: qty, party: party, comment: comment, linkid: linkid})
                  .success(function (data, status) {
                      if(status === 200 ){
                          deferred.resolve();
                      } else {
                          deferred.reject();
                      }
                  })
                  .error(function (data) {
                      deferred.reject();
                  })
                  .finally(function () {
                    $route.reload();
                  });

              return deferred.promise;
          },

          updateInventory : function(inv, asof, name, qty, party, comment){
              var id = inv.id;
              var deferred = $q.defer();

               $http.put('/dashboard',
                   {id:id, asof:asof, name:name, qty:qty, party:party, comment:comment})
                   .success(function (data, status) {
                       if(status === 200 ){
                           deferred.resolve();
                       } else {
                           deferred.reject();
                       }
                   })
                   .error(function (data) {
                       deferred.reject();
                   })
                   .finally(function () {
                     $route.reload();
                   });

               return deferred.promise;
           },

          deleteInventory : function(inv){
              var id = inv.id;
              var deferred = $q.defer();

              $http.put('/dashboard/delete', {id: id})
                  .success(function (data, status) {
                      if(status === 200 ){
                          deferred.resolve();
                      } else {
                          deferred.reject();
                      }
                  })
                  .error(function (data) {
                      deferred.reject();
                  })
                  .finally(function () {
                    $route.reload();
                  });

              return deferred.promise;
          }
        };

        function showPromptLogin() {
            $mdDialog.show({
                ariaLabel:  'Login',
                clickOutsideToClose: true,
                templateUrl: 'views/templates/loginDialog.html',
                size: 'large',
                bindToController: true,
                autoWrap: false,
                parent: angular.element(document.body),
                preserveScope: true,
            });
        }
    }
]);
