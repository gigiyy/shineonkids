myApp.controller('transactionHistoryController', ['$q', '$window', '$scope', '$route', '$location', '$http', '$uibModal', '$log', '$mdDialog',
    function($q, $window, $scope, $route, $location, $http, $uibModal, $log, $mdDialog) {
    $scope.adminEditState = true;
    $scope.invs = {};

    loginCheck();
    getData();

    function loginCheck() {
        $http.get('/login').then(function(response) {
          var user = response.data;
          if (user == '') {
            showPromptLogin();
          }
        });
    }

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


    function getData() {
        var promise = $http.get('/dashboard/details').then(function(response) {
                $scope.invs = response.data;
            });
        return promise;
    }


    deleteInventory = function(index){
        var asof = $scope.invs[index].asof;
        var name = $scope.invs[index].name;
        var qty = $scope.invs[index].qty;
        var party = $scope.invs[index].party;
        var deferred = $q.defer();

        $http.put('/dashboard/delete',
            {asof: asof, name: name, qty: qty, party: party})
            .success(function (data, status) {
                if(status === 200 ){
                    deferred.resolve();
                } else {
                    deferred.reject();
                }
            })
            .error(function (data) {
                deferred.reject();
            });
        $window.location.reload();
        return deferred.promise;
    };


    $scope.editInventory = function(ev, index) {
        function dialogController($scope, $mdDialog, index, date, bead, qty, party) {
            $scope.date = date;
            $scope.bead = bead;
            $scope.qty = qty;
            $scope.party = party;
            $scope.index = index;

            $scope.ok = function(qty) {
                //updateInventory(index);
                $mdDialog.hide();
            }

            $scope.cancel = function() {
                $mdDialog.hide();
            }

            $scope.delete = function() {
                if (confirm('Is it ok to delete this inventory?')) {
                  deleteInventory(index);
                  $mdDialog.hide();
                }
            }
        }

        $mdDialog.show({
            controller: dialogController,
            targetEvent: ev,
            ariaLabel:  'Edit Inventory',
            clickOutsideToClose: true,
            templateUrl: 'views/templates/editInventory.html',
            onComplete: afterShowAnimation,
            size: 'large',
            bindToController: true,
            autoWrap: false,
            parent: angular.element(document.body),
            preserveScope: true,
            locals: {
                date: $scope.invs[index].asof,
                bead: $scope.invs[index].name,
                qty: $scope.invs[index].qty,
                party: $scope.invs[index].party,
                index: index
            }
        });

        function afterShowAnimation(scope, element, options) {
           // post-show code here: DOM element focus, etc.
        }
    }

}]);
