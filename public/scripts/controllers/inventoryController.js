myApp.controller('inventoryController', ['$q', '$window', '$scope', '$route', '$location', '$http', '$uibModal', '$log', '$mdDialog',
    function($q, $window, $scope, $route, $location, $http, $uibModal, $log, $mdDialog) {
    $scope.adminEditState = true;    
    $scope.invs = {};
    $scope.keys = {};
    $scope.addition = 0;
    $scope.hospitals = {};
    //$scope.selectedBeads = {};

    $scope.qtys = [{'id': 1}, {'id':2},{'id':3},{'id':4},{'id':5},{'id':6},{'id':7},{'id':8},{'id':9},{'id':10},{'id':12},{'id':15},{'id':18},{'id':20},{'id':25}];

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
            var beads2 =_.keys(_.countBy(rawData, function(data) { return data.bead_type; }));
            var beads = _.uniq(_.map(rawData, function(d){return d.bead_type}));
            $scope.beads = beads;

            $scope.invs = [];
            for (var k = 0, len = beads.length; k < len; k++){
                var inv = {}; 
                inv["bead"] = beads[k];
                for (var j = 0, len1 = dates.length; j < len1; j++){
                    for (var i = 0, len2 = rawData.length; i < len2; i++){
                        if (rawData[i].asof == dates[j] && rawData[i].bead_type == beads[k] ){
                            inv["qty" + j] = rawData[i].qty;
                        }
                    }
                }
                $scope.invs.push(inv);
            }
            dates.unshift("Beads");
            dates.unshift("    ");
            dates.unshift("      ");
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

    // not in use anymore
    $scope.showPromptAdd2 = function(ev, index) {
        var confirm = $mdDialog.prompt()
        .title('Add to Inventory')
        .textContent('Enter Supplied Quantity')
        .placeholder('1')
        .ariaLabel('1')
        .initialValue('1')
        .targetEvent(ev)
        .ok('OK')
        .cancel('Cancel');

        $mdDialog.show(confirm).then(function(result) {
            updateInventory(index,  result, "Supplier");
        }, function() {
            // nothing to be done
        });
    }

    $scope.showPromptAdd = function(ev, index) {
        function dialogController($scope, $mdDialog, index, qtys, selectedBead) {
            $scope.qtys = qtys;
            $scope.selectedBead = selectedBead;
            $scope.index = index;

            $scope.ok = function(qty) {
                updateInventory(index, qty, "Supplier");
                $mdDialog.hide();
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
                index: index 
            }
        });

        function afterShowAnimation(scope, element, options) {
           // post-show code here: DOM element focus, etc.
        }
    }

    
    $scope.showPromptDeliver = function(ev, index) {
        function dialogController($scope, $mdDialog, hospitals, qtys, selectedBead, index) {
            $scope.hospitals = hospitals;
            $scope.qtys = qtys;
            $scope.selectedBead = selectedBead;
            $scope.index = index;

            $scope.ok = function(bead, qty, hospital) {
                qty = -1* qty;
                updateInventory(index, qty, hospital);
                $mdDialog.hide();
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
                index: index 
            }
        });

        function afterShowAnimation(scope, element, options) {
           // post-show code here: DOM element focus, etc.
        }
    }
}]);


