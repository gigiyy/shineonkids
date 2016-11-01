myApp.controller('inventoryController', ['$q', '$window', '$scope', '$route', '$location', '$http', '$uibModal', '$log', '$mdDialog', '$cookies',
    function($q, $window, $scope, $route, $location, $http, $uibModal, $log, $mdDialog, $cookies) {
    $scope.adminEditState = true;
    $scope.invs = {};
    $scope.keys = {};
    $scope.addition = 0;
    $scope.hospitals = {};

    loginCheck();
    getHospitals();
    var rawData = null;

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

    function getHospitals() {
        var promise = $http.get('/hospitals').then(function(response) {
                $scope.hospitals = response.data;
            });
        return promise;
    }

    function getData() {
        var promise = $http.get('/dashboard/summary').then(function(response) {
            rawData = response.data;
            var byasof = _.countBy(rawData, function(data) { return data.asof; });
            var dates = _.sortBy(_.keys(_.countBy(rawData, function(data) { return data.asof; }))).reverse();
            var beads = _.uniq(_.map(rawData, function(data){ return {'name':data.name, 'lotsize':data.lotsize}; }), 'name');

            $scope.invs = [];
            for (var k = 0, len = beads.length; k < len; k++){
                var inv = {};
                inv["bead"] = beads[k].name;
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
                            total += rawData[i].qty;
                            backorder_total += rawData[i].backorder_qty;
                        }
                    }
                }
                inv["total"] = total;
                if (backorder_total != 0) {
                  inv["backorder_total"] = '(' + backorder_total + ')';
                }
                $scope.invs.push(inv);
            }
            //dates.unshift("xxxxxTotal(Order)");
            //dates.unshift("xxxxxBeads");
            //dates.unshift("xxxxx     ");
            //dates.unshift("xxxxx      ");
            //dates.unshift("xxxxx    ");
            $scope.dates = dates;

        });
        return promise;
    }

    updateInventory = function(index, qty, party){
        var name = $scope.invs[index].bead;
        var deferred = $q.defer();
        $scope.jobs = [];

        $http.post('/dashboard',
            {name: name, qty: qty, party: party})
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
        function dialogController($scope, $mdDialog, index, selectedBead, lotsize) {
            $scope.selectedBead = selectedBead;
            $scope.lotsize = lotsize;
            $scope.index = index;

            $scope.ok = function(qty) {
                updateInventory(index, qty, "Order");
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
                selectedBead: $scope.invs[index].bead,
                lotsize: $scope.invs[index].lotsize,
                index: index
            }
        });

        function afterShowAnimation(scope, element, options) {
           // post-show code here: DOM element focus, etc.
        }
    }


    $scope.showPromptAdd = function(ev, index) {
        var abackorder_qty = ($scope.invs[index].backorder_total == null) ? 0 : $scope.invs[index].backorder_total.replace(/\(/g,"").replace(/\)/g,"");
        var abead = $scope.invs[index].bead;

        function dialogController($scope, $mdDialog, index, selectedBead, lotsize) {
            $scope.selectedBead = selectedBead;
            $scope.lotsize = lotsize;
            $scope.index = index;

            $scope.ok = function(qty) {
                if (qty > abackorder_qty) {
                  alert('Add quantity should be <= Back order quantity');
                } else {
                  updateInventory(index, qty, "Receive");
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
                selectedBead: $scope.invs[index].bead,
                lotsize: $scope.invs[index].lotsize,
                index: index
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

    $scope.showPromptDeliver = function(ev, index) {
        var aqty = $scope.invs[index].total;
        var abead = $scope.invs[index].bead;

        function dialogController($scope, $mdDialog, selected, hospitals, selectedBead, lotsize, index) {
            $scope.hospitals = hospitals;
            $scope.selectedBead = selectedBead;
            $scope.lotsize = lotsize;
            $scope.index = index;
            $scope.hospital = getSelected(selected, hospitals)

            $scope.ok = function(qty, hospital) {
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
                        updateInventory(index, qty, party);
                        $mdDialog.hide();
                    }
                    else {
                        $mdDialog.hide();
                    }
                }
                else {
                    qty = -1* qty;
                    $cookies.put('hospital', hospital);
                    updateInventory(index, qty, hospital);
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
                selectedBead: $scope.invs[index].bead,
                lotsize: $scope.invs[index].lotsize,
                index: index
            }
        });

        function afterShowAnimation(scope, element, options) {
           // post-show code here: DOM element focus, etc.
        }
    }
}]);
