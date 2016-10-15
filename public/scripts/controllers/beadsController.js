myApp.controller('beadsController',
    ['$q', '$scope', '$route', '$location', '$http', '$log', '$mdDialog', '$window',
    function($q, $scope, $route, $location, $http, $log, $mdDialog, $window) {
        $scope.adminEditState = true;
        $scope.beads = {};
        getData();

        function getData() {
            var promise = $http.get('/beads').then(function(response) {
                $scope.beads = response.data;
            });
            return promise;
        }

       updateBead = function(bead_type, lotsize, price, bead_type_jp, desc){
            var deferred = $q.defer();

            $http.put('/beads',
                {bead_type:bead_type, lotsize:lotsize, price:price, bead_type_jp:bead_type_jp, desc:desc})
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

        insertBead = function(bead_type, lotsize, price, bead_type_jp, desc){
             var deferred = $q.defer();

             $http.post('/beads',
                 {bead_type:bead_type, lotsize:lotsize, price:price, bead_type_jp:bead_type_jp, desc:desc})
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

        $scope.editBeads = function(ev, index) {
            function dialogController($scope, $mdDialog, bead_type, lotsize, price, bead_type_jp, desc) {
                $scope.bead_type = bead_type;
                $scope.lotsize = lotsize;
                $scope.price = price;
                $scope.bead_type_jp = bead_type_jp;
                $scope.desc = desc;
                $scope.index = index;

                $scope.ok = function(lotsize, price, bead_type_jp, desc) {
                    updateBead(bead_type, lotsize, price, bead_type_jp, desc);
                    $mdDialog.hide();
                }

                $scope.cancel = function() {
                    $mdDialog.hide();
                }
            }

            $mdDialog.show({
                controller: dialogController,
                targetEvent: ev,
                ariaLabel:  'Edit Entry',
                clickOutsideToClose: true,
                templateUrl: 'views/templates/editBeads.html',
                onComplete: afterShowAnimation,
                size: 'large',
                bindToController: true,
                autoWrap: false,
                parent: angular.element(document.body),
                preserveScope: true,
                locals: {
                    bead_type: $scope.beads[index].bead_type,
                    lotsize: $scope.beads[index].lotsize,
                    price: $scope.beads[index].price,
                    bead_type_jp: $scope.beads[index].bead_type_jp,
                    desc: $scope.beads[index].desc,
                    index: index
                }
            });

            function afterShowAnimation(scope, element, options) {
               // post-show code here: DOM element focus, etc.
            }
        }

        $scope.newBead = function(ev, index) {
            function dialogController($scope, $mdDialog, bead_type, lotsize, price, bead_type_jp, desc) {
                $scope.bead_type = bead_type;
                $scope.lotsize = lotsize;
                $scope.price = price;
                $scope.bead_type_jp = bead_type_jp;
                $scope.desc = desc;
                $scope.index = index;

                $scope.ok = function(bead_type, lotsize, price, bead_type_jp, desc) {
                    insertBead(bead_type, lotsize, price, bead_type_jp, desc);
                    $mdDialog.hide();
                }

                $scope.cancel = function() {
                    $mdDialog.hide();
                }
            }

            $mdDialog.show({
                controller: dialogController,
                targetEvent: ev,
                ariaLabel:  'Edit Entry',
                clickOutsideToClose: true,
                templateUrl: 'views/templates/newBead.html',
                onComplete: afterShowAnimation,
                size: 'large',
                bindToController: true,
                autoWrap: false,
                parent: angular.element(document.body),
                preserveScope: true,
                locals: {
                    bead_type: "",
                    lotsize: "",
                    price: "",
                    bead_type_jp: "",
                    desc: "",
                    index: index
                }
            });

            function afterShowAnimation(scope, element, options) {
               // post-show code here: DOM element focus, etc.
            }
        }
    }
]);
