myApp.controller('inventoryController',
  ['$q', '$rootScope', '$scope', '$route', '$http', '$uibModal', '$log', '$mdDialog', '$cookies', 'LoginService', '$filter',
  function($q, $rootScope, $scope, $route, $http, $uibModal, $log, $mdDialog, $cookies, LoginService, $filter) {
    $scope.adminEditState = true;
    $scope.invs = [];
    $scope.addition = 0;
    $scope.hospitals = [];
    $scope.typesForFilter = [];

    LoginService.loginCheck();
    getHospitals();
    var rawData = null;
    getData();

    function getHospitals() {
        var promise = $http.get('/hospitals').then(function(response) {
                $scope.hospitals = response.data;
            });
        return promise;
    }

    function getData() {
        var promise = $http.get('/dashboard/summary').then(function(response) {
            rawData = response.data;

            var dates = _.sortBy(_.keys(_.countBy(rawData, function(data) { return data.asof; }))).reverse();
            var beads = _.uniq(_.map(rawData, function(data){ return {'name':data.name, 'type':data.type, 'name_jp':data.name_jp, 'lotsize':data.lotsize}; }), 'name');

            $scope.typesForFilter = _.keys(_.countBy(rawData, function(data) { return data.type; }));
            $scope.typesForFilter.unshift("All");

            $scope.$watch('selectedType', function(newValue) {
              $rootScope.selectedType = newValue;
            })

            if (! $scope.selectedType && $rootScope.selectedType) {
              $scope.selectedType = $rootScope.selectedType;
            }
            $scope.typeFilter = function(inv){
              if (! $scope.selectedType || $scope.selectedType == "All" || $scope.selectedType == "") {
                return true;
              } else {
                return inv.type === $scope.selectedType;
              }
            };

            $scope.invs = [];
            for (var k = 0, len = beads.length; k < len; k++){
                var inv = {};
                inv["bead"] = beads[k].name;
                inv["type"] = beads[k].type;
                inv["bead_jp"] = beads[k].name_jp;
                inv["lotsize"] = beads[k].lotsize;
                var total = 0;
                var backorder_total = 0;
                for (var j = 0, len1 = dates.length; j < len1; j++){
                    for (var i = 0, len2 = rawData.length; i < len2; i++){
                        if (rawData[i].asof == dates[j] && rawData[i].name == beads[k].name){
                            inv["qty" + j] = rawData[i].qty;
                            if (rawData[i].backorder_qty != 0) {
                              inv["backorder_qty" + j] = '(' + rawData[i].backorder_qty + ')';
                            }
                            total += Number(rawData[i].qty);
                            backorder_total += Number(rawData[i].backorder_qty);
                        }
                    }
                }
                inv["total"] = total;
                if (backorder_total != 0) {
                  inv["backorder_total"] = '(' + backorder_total + ')';
                }
                $scope.invs.push(inv);
            }
            $scope.dates = dates;
        });
        return promise;
    }

    updateInventory = function(inv, asof, qty, party){
        var name = inv.bead;
        var deferred = $q.defer();

        $http.post('/dashboard',
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
            })
            .finally(function () {
              $route.reload();
            });

        return deferred.promise;
    };

    $scope.showPromptOrder = function(ev, inv) {
        function dialogController($scope, $mdDialog, selectedBead, lotsize) {
            $scope.selectedBead = selectedBead;
            $scope.lotsize = lotsize;
            $scope.asof = $filter('date')(new Date(), "yyyy/MM/dd");

            $scope.ok = function(asof, qty) {
                updateInventory(inv, asof, qty, "Order");
                $mdDialog.hide();
            }

            $scope.cancel = function() {
                $mdDialog.hide();
            }
        }

        $mdDialog.show({
            controller: dialogController,
            targetEvent: ev,
            ariaLabel:  'Order',
            clickOutsideToClose: true,
            templateUrl: 'views/templates/orderDialog.html',
            onComplete: afterShowAnimation,
            size: 'large',
            bindToController: true,
            autoWrap: false,
            parent: angular.element(document.body),
            preserveScope: true,
            locals: {
                selectedBead: inv.bead,
                lotsize: inv.lotsize
            }
        });

        function afterShowAnimation(scope, element, options) {
           // post-show code here: DOM element focus, etc.
        }
    }


    $scope.showPromptAdd = function(ev, inv) {
        var abackorder_qty = (inv.backorder_total == null) ? 0 : inv.backorder_total.replace(/\(/g,"").replace(/\)/g,"");
        var abead = inv.bead;

        function dialogController($scope, $mdDialog, selectedBead, lotsize) {
            $scope.selectedBead = selectedBead;
            $scope.lotsize = lotsize;
            $scope.asof = $filter('date')(new Date(), "yyyy/MM/dd");

            $scope.ok = function(asof, qty) {
                if (qty > abackorder_qty) {
                  alert('Add quantity should be <= Back order quantity');
                } else {
                  updateInventory(inv, asof, qty, "Receive");
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
            ariaLabel:  'Add to Inventory',
            clickOutsideToClose: true,
            templateUrl: 'views/templates/recvDialog.html',
            onComplete: afterShowAnimation,
            size: 'large',
            bindToController: true,
            autoWrap: false,
            parent: angular.element(document.body),
            preserveScope: true,
            locals: {
                selectedBead: inv.bead,
                lotsize: inv.lotsize
            }
        });

        function afterShowAnimation(scope, element, options) {
           // post-show code here: DOM element focus, etc.
        }
    }

    function getSelected(selected, hospitals) {
      for (i = 0; i < hospitals.length; i++) {
        if (hospitals[i].name === selected) {
          return hospitals[i]
        }
      }
    }

    $scope.showPromptDeliver = function(ev, inv) {
        var aqty = inv.total;
        var abead = inv.bead;

        function dialogController($scope, $mdDialog, selected, hospitals, selectedBead, lotsize) {
            $scope.hospitals = hospitals;
            $scope.selectedBead = selectedBead;
            $scope.lotsize = lotsize;
            $scope.hospital = getSelected(selected, hospitals);
            $scope.asof = $filter('date')(new Date(), "yyyy/MM/dd");

            $scope.ok = function(asof, qty, hospital) {
                if (!hospital) {
                  alert('Hospital should not be blank');
                }
                else if (! qty > 0) {
                  alert('Quantity should be > 0');
                }
                else if (qty > aqty ) {
                    if (confirm(abead + ' is low on inventory, enter a Back Order?')) {
                        qty = -1* qty;
                        var party = '[Back Order]' + hospital;
                        updateInventory(inv, asof, qty, party);
                        $mdDialog.hide();
                    }
                    else {
                        $mdDialog.hide();
                    }
                }
                else {
                    qty = -1* qty;
                    $cookies.put('hospital', hospital);
                    updateInventory(inv, asof, qty, hospital);
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
            ariaLabel:  'Select delivery Quantity',
            clickOutsideToClose: true,
            templateUrl: 'views/templates/delvDialog.html',
            onComplete: afterShowAnimation,
            size: 'large',
            bindToController: true,
            autoWrap: false,
            parent: angular.element(document.body),
            preserveScope: true,
            locals: {
                selected: $cookies.get('hospital'),
                hospitals: $scope.hospitals,
                selectedBead: inv.bead,
                lotsize: inv.lotsize
            }
        });

        function afterShowAnimation(scope, element, options) {
           // post-show code here: DOM element focus, etc.
        }
    }
}]);
