myApp.controller('inventoryController', ['$q', '$window', '$scope', '$route', '$location', '$http', '$uibModal', '$log', '$mdDialog',
    function($q, $window, $scope, $route, $location, $http, $uibModal, $log, $mdDialog) {
    $scope.adminEditState = true;
    $scope.invs = {};
    $scope.keys = {};
    $scope.addition = 0;
    $scope.hospitals = {};
    //$scope.selectedBeads = {};

    //$scope.qtys = [{'id': 1}, {'id':2},{'id':3},{'id':4},{'id':5},{'id':6},{'id':7},{'id':8},{'id':9},{'id':10},{'id':12},{'id':15},{'id':18},{'id':20},{'id':25}];

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
            var byasof = _.countBy(rawData, function(data) { return data.asof; });
            var dates = _.keys(_.countBy(rawData, function(data) { return data.asof; }));
            //var beads2 =_.keys(_.countBy(rawData, function(data) { return data.bead_type; }));
            var beads = _.uniq(_.map(rawData, function(data){ return {'bead_type':data.bead_type, 'lotsize':data.lotsize}; }), 'bead_type');
            //$scope.beads = beads;

            $scope.invs = [];
            for (var k = 0, len = beads.length; k < len; k++){
                var inv = {};
                inv["bead"] = beads[k].bead_type;
                inv["lotsize"] = beads[k].lotsize;
                var total = 0;
                var backorder_total = 0;
                for (var j = 0, len1 = dates.length; j < len1; j++){
                    for (var i = 0, len2 = rawData.length; i < len2; i++){
                        if (rawData[i].asof == dates[j] && rawData[i].bead_type == beads[k].bead_type){
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
            dates.unshift("xxxxxTotal(Order)");
            dates.unshift("xxxxxBeads");
            dates.unshift("xxxxx     ");
            dates.unshift("xxxxx      ");
            dates.unshift("xxxxx    ");
            $scope.dates = dates;

        });
        return promise;
    }

    updateInventory = function(index, qty, party){
        var bead_type = $scope.invs[index].bead;
        var deferred = $q.defer();
        $scope.jobs = [];

        $http.post('/dashboard',
            {bead_type: bead_type, qty: qty, party: party})
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
        function dialogController($scope, $mdDialog, index, qtys, selectedBead, lotsize) {
            $scope.qtys = qtys;
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
                qtys: $scope.qtys,
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

        function dialogController($scope, $mdDialog, index, qtys, selectedBead, lotsize) {
            $scope.qtys = qtys;
            $scope.selectedBead = selectedBead;
            $scope.lotsize = lotsize;
            $scope.index = index;

            $scope.ok = function(qty) {
                if (qty > abackorder_qty) {
                  alert('Add quantity should be <= Back order quantity');
                  $mdDialog.hide();
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
                qtys: $scope.qtys,
                selectedBead: $scope.invs[index].bead,
                lotsize: $scope.invs[index].lotsize,
                index: index
            }
        });

        function afterShowAnimation(scope, element, options) {
           // post-show code here: DOM element focus, etc.
        }
    }


    $scope.showPromptDeliver = function(ev, index) {
        var aqty = $scope.invs[index].total;
        var abead = $scope.invs[index].bead;

        function dialogController($scope, $mdDialog, hospitals, qtys, selectedBead, lotsize, index) {
            $scope.hospitals = hospitals;
            $scope.qtys = qtys;
            $scope.selectedBead = selectedBead;
            $scope.lotsize = lotsize;
            $scope.index = index;

            $scope.ok = function(qty, hospital) {
                if (hospital == null) {
                  alert('Hospital should not be blank');
                  $mdDialog.hide();
                }
                else if (! qty > 0) {
                  alert('Quantity should be > 0');
                  $mdDialog.hide();
                }
                else if (qty > aqty ) {
                    if (confirm(abead + ' is low on inventory, enter a Back Order?')) {
                        qty = -1* qty;
                        var party = '[Back Order]' + hospital;
                        updateInventory(index, qty, party);
                        $mdDialog.hide();
                    } else {
                        $mdDialog.hide();
                    }
                } else {
                    qty = -1* qty;
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
                hospitals: $scope.hospitals,
                qtys: $scope.qtys,
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
