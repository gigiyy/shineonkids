myApp.controller('inventoryController',
  ['$q', '$rootScope', '$scope', '$route', '$http', '$uibModal', '$log', '$mdDialog', '$cookies', 'Utility', '$filter',
  function($q, $rootScope, $scope, $route, $http, $uibModal, $log, $mdDialog, $cookies, Utility, $filter) {
    $scope.adminEditState = true;
    $scope.invs = [];
    $scope.addition = 0;
    $scope.hospitals = [];
    $scope.typesForFilter = [];

    Utility.loginCheck();
    getHospitals();
    var rawData = null;
    getData();

    function getHospitals() {
        var promise = $http.get('/hospitals').then(function(response) {
                rawData = response.data;
                $scope.hospitals = _.map(rawData, function(data){ return data.name; })
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
                var unreceived_total = 0;
                var backorder_total = 0;
                for (var j = 0, len1 = dates.length; j < len1; j++){
                    for (var i = 0, len2 = rawData.length; i < len2; i++){
                        if (rawData[i].asof == dates[j] && rawData[i].name == beads[k].name){
                            if (rawData[i].qty != 0) {
                              inv["qty" + j] = rawData[i].qty;
                            }
                            if (rawData[i].unreceived_qty != 0) {
                              inv["unreceived_qty" + j] = '(' + rawData[i].unreceived_qty + ')';
                            }
                            if (rawData[i].backorder_qty != 0) {
                              inv["backorder_qty" + j] = '[' + rawData[i].backorder_qty + ']';
                            }
                            total += Number(rawData[i].qty);
                            unreceived_total += Number(rawData[i].unreceived_qty);
                            backorder_total += Number(rawData[i].backorder_qty);
                        }
                    }
                }

                inv["total"] = total;

                if (unreceived_total != 0) {
                  inv["unreceived_total"] = '(' + unreceived_total + ')';
                }
                if (backorder_total != 0) {
                  inv["backorder_total"] = '[' + backorder_total + ']';
                }
                $scope.invs.push(inv);
            }
            $scope.dates = dates;
        });
        return promise;
    }

    $scope.showPromptOrder = function(ev, inv) {
        function dialogController($scope, $mdDialog, selectedAsof, inv) {
            $scope.selectedBead = inv.bead;
            $scope.lotsize = inv.lotsize;
            $scope.asof = (selectedAsof) ? selectedAsof : $filter('date')(new Date(), "yyyy/MM/dd");

            $scope.ok = function(asof, qty) {
                $cookies.put('asofOrder', asof);
                Utility.insertInventory(inv, asof, inv.bead, qty, "Order");
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
                selectedAsof: $cookies.get('asofOrder'),
                inv: inv
            }
        });

        function afterShowAnimation(scope, element, options) {
           // post-show code here: DOM element focus, etc.
        }
    }

    $scope.showPromptAdd = function(ev, inv) {
        var aunreceived_total = (inv.unreceived_total == null) ? 0 : inv.unreceived_total.replace(/\(/g,"").replace(/\)/g,"");
        var abead = inv.bead;

        function dialogController($scope, $mdDialog, selectedAsof, inv) {
            $scope.selectedBead = inv.bead;
            $scope.lotsize = inv.lotsize;
            $scope.asof = (selectedAsof) ? selectedAsof : $filter('date')(new Date(), "yyyy/MM/dd");

            $scope.ok = function(asof, qty) {
                if (qty > aunreceived_total) {
                  alert('Add quantity should be <= Unreceived quantity');
                } else {
                  $cookies.put('asofAdd', asof);
                  Utility.insertInventory(inv, asof, inv.bead, qty, "Receive");
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
                selectedAsof: $cookies.get('asofAdd'),
                inv: inv
            }
        });

        function afterShowAnimation(scope, element, options) {
           // post-show code here: DOM element focus, etc.
        }
    }

    function getSelectedHospital(selectedHospital, hospitals) {
      for (i = 0; i < hospitals.length; i++) {
        if (hospitals[i] === selectedHospital) {
          return hospitals[i]
        }
      }
    }

    $scope.showPromptDeliver = function(ev, inv) {
        var atotal = inv.total;
        var abackorder_total = (inv.backorder_total == null) ? 0 : inv.backorder_total.replace(/\[/g,"").replace(/\]/g,"");
        var abead = inv.bead;

        function dialogController($scope, $mdDialog, selectedHospital, selectedAsof, hospitals, inv) {
            $scope.hospitals = hospitals;
            $scope.selectedBead = inv.bead;
            $scope.lotsize = inv.lotsize;
            $scope.hospital = getSelectedHospital(selectedHospital, hospitals);
            $scope.asof = (selectedAsof) ? selectedAsof : $filter('date')(new Date(), "yyyy/MM/dd");
            $scope.backorder_flag = false;

            $scope.ok = function(asof, qty, hospital, backorder_flag) {
                if (!hospital) {
                    alert('Hospital should not be blank');
                }
                else if (! qty > 0) {
                    alert('Quantity should be > 0');
                }
                else if (qty > atotal && ! backorder_flag) {
                    alert('Backorder Flag should be ticked, because ' + abead + ' is low on inventory');
                }
                else {
                    qty = -1* qty;
                    var comment = (backorder_flag) ? 'B/O' : null;
                    $cookies.put('hospital', hospital);
                    $cookies.put('asofDeliver', asof);
                    Utility.insertInventory(inv, asof, inv.bead, qty, hospital, comment);
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
                selectedHospital: $cookies.get('hospital'),
                selectedAsof: $cookies.get('asofDeliver'),
                hospitals: $scope.hospitals,
                inv: inv
            }
        });

        function afterShowAnimation(scope, element, options) {
           // post-show code here: DOM element focus, etc.
        }
    }
}]);
