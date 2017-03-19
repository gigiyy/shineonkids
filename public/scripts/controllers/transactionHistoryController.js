myApp.controller('transactionHistoryController',
  ['$q', '$scope', '$route', '$http', '$uibModal', '$log', '$mdDialog', 'Utility', '$filter',
  function($q, $scope, $route, $http, $uibModal, $log, $mdDialog, Utility, $filter) {
    $scope.adminEditState = true;
    $scope.invs = [];
    $scope.names = [];
    $scope.parties = [];

    Utility.loginCheck();
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

              for (var party of ['Order', 'Receive']) {
                  $scope.parties.unshift(party);
              }
            });
        return promise;
    }

    function getData() {
        var promise = $http.get('/dashboard/details').then(function(response) {
                var rawData = response.data;
                $scope.invs = _.map(rawData, function(data){
                  data.showBracket = Utility.getBracketType(data.comment, data.party);
                  data.showBackorder = (data.comment == 'B/O') ? true : false;
                  return data;
                })
            });
        return promise;
    }

    $scope.editInventory = function(ev, inv) {
        function dialogController($scope, $mdDialog, names, parties, inv) {
            $scope.names = names;
            $scope.parties = parties;
            $scope.asof = inv.asof;
            $scope.name = inv.name;
            $scope.qty = inv.qty;
            $scope.party = inv.party;
            $scope.comment = inv.comment;

            $scope.ok = function(asof, name, qty, party, comment) {
                Utility.updateInventory(inv, asof, name, qty, party, comment);
                $mdDialog.hide();
            }

            $scope.cancel = function() {
                $mdDialog.hide();
            }

            $scope.delete = function() {
                if (confirm('Is it ok to delete this inventory?')) {
                  Utility.deleteInventory(inv);
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
                inv: inv
            }
        });

        function afterShowAnimation(scope, element, options) {
           // post-show code here: DOM element focus, etc.
        }
    }

    $scope.deliverForBackorder = function(ev, inv) {
        var orig_qty = -1 * inv.qty;

        function dialogController($scope, $mdDialog, hospitals, inv) {
            $scope.hospitals = hospitals;
            $scope.selectedBead = inv.name;
            $scope.hospital = inv.party;
            $scope.qty = -1 * inv.qty;
            $scope.lotsize = inv.lotsize;
            $scope.showBracket = inv.showBracket;
            $scope.showBackorder = inv.showBackorder;
            $scope.asof = $filter('date')(new Date(), "yyyy/MM/dd");

            $scope.ok = function(asof, qty, hospital) {
                if (qty < 0) {
                    alert('Quantity should be > 0');
                }
                else if (qty > orig_qty) {
                    alert('Delivery quantity should be <= backorder quantity');
                }
                else {
                    if (qty < orig_qty) {
                        var remaining_qty = -1 * (orig_qty - qty)
                        Utility.insertInventory(inv, inv.asof, inv.name, remaining_qty, hospital, 'B/O');
                    }
                    qty = -1* qty;
                    Utility.updateInventory(inv, inv.asof, inv.name, qty, hospital, 'B/O [Delivered]');
                    Utility.insertInventory(inv, asof, inv.name, qty, hospital, 'Deliver for B/O', inv.id);
                    $mdDialog.hide();
                }
            }

            $scope.cancel = function() {
                $mdDialog.hide();
            }
        }

        $mdDialog.show({
            controller: dialogController,
            targetEvent: ev,
            ariaLabel:  'Delivery for Backorder',
            clickOutsideToClose: true,
            templateUrl: 'views/templates/delvDialog.html',
            onComplete: afterShowAnimation,
            size: 'large',
            bindToController: true,
            autoWrap: false,
            parent: angular.element(document.body),
            preserveScope: true,
            locals: {
                hospitals: $scope.parties,
                inv: inv
            }
        });

        function afterShowAnimation(scope, element, options) {
           // post-show code here: DOM element focus, etc.
        }
    }

}]);
