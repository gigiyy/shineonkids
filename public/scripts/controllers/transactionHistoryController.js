myApp.controller('transactionHistoryController',
  ['$q', '$window', '$scope', '$route', '$location', '$http', '$uibModal', '$log', '$mdDialog', 'LoginService',
  function($q, $window, $scope, $route, $location, $http, $uibModal, $log, $mdDialog, LoginService) {
    $scope.adminEditState = true;
    $scope.invs = {};
    $scope.names = {};
    $scope.parties = {};

    LoginService.loginCheck();
    getBeads();
    getParties();
    getData();

    function getBeads() {
        var promise = $http.get('/beads').then(function(response) {
              var beads = response.data;
              $scope.names = _.keys(_.countBy(beads, function(bead) { return bead.name; }));
            });
        return promise;
    }

    function getParties() {
        var promise = $http.get('/hospitals').then(function(response) {
              var hospitals = response.data;
              $scope.parties = _.keys(_.countBy(hospitals, function(hospital) { return hospital.name; }));

              for (var party of ['Add', 'Receive']) {
                  $scope.parties.unshift(party);
              }
            });
        return promise;
    }

    function getData() {
        var promise = $http.get('/dashboard/details').then(function(response) {
                $scope.invs = response.data;
            });
        return promise;
    }

    updateInventory = function(index, asof, name, party, qty){
        var id = $scope.invs[index].id;
        var deferred = $q.defer();

         $http.put('/dashboard',
             {id:id, asof:asof, name:name, qty:qty, party:party})
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

    deleteInventory = function(index){
        var id = $scope.invs[index].id;
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
            });
        $window.location.reload();
        return deferred.promise;
    };


    $scope.editInventory = function(ev, index) {
        function dialogController($scope, $mdDialog, index, names, parties, asof, name, qty, party) {
            $scope.names = names;
            $scope.parties = parties;
            $scope.asof = asof;
            $scope.name = name;
            $scope.qty = qty;
            $scope.party = party;
            $scope.index = index;

            $scope.ok = function(asof, name, party, qty) {
                updateInventory(index, asof, name, party, qty);
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
                names: $scope.names,
                parties: $scope.parties,
                asof: $scope.invs[index].asof,
                name: $scope.invs[index].name,
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
