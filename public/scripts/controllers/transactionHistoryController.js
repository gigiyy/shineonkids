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


    $scope.showPromptOrder = function(ev, index) {
        function dialogController($scope, $mdDialog, index, selectedAsof, selectedBead, selectedQty, selectedParty) {
            $scope.selectedAsof = selectedAsof;
            $scope.selectedBead = selectedBead;
            $scope.selectedQty = selectedQty;
            $scope.selectedParty = selectedParty;
            $scope.index = index;

            $scope.ok = function(qty) {
                deleteInventory(index);
                $mdDialog.hide();
            }

            $scope.cancel = function() {
                $mdDialog.hide();
            }
        }

        $mdDialog.show({
            controller: dialogController,
            targetEvent: ev,
            ariaLabel:  'Delete Inventory',
            clickOutsideToClose: true,
            templateUrl: 'views/templates/delInvDialog.html',
            onComplete: afterShowAnimation,
            size: 'large',
            bindToController: true,
            autoWrap: false,
            parent: angular.element(document.body),
            preserveScope: true,
            locals: {
                selectedAsof: $scope.invs[index].asof,
                selectedBead: $scope.invs[index].name,
                selectedQty: $scope.invs[index].qty,
                selectedParty: $scope.invs[index].party,
                index: index
            }
        });

        function afterShowAnimation(scope, element, options) {
           // post-show code here: DOM element focus, etc.
        }
    }

}]);
