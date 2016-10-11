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

       updateBead = function(bead_type, lotsize, price){
            var deferred = $q.defer();
            
            $http.put('/beads',
                {bead_type: bead_type, lotsize: lotsize, price: price})
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
            function dialogController($scope, $mdDialog, bead_type, lotsize, price) {
                $scope.bead_type = bead_type;
                $scope.lotsize = lotsize;
                $scope.price = price;
                $scope.index = index;

                $scope.ok = function(lotsize, price) {
                    updateBead(bead_type, lotsize, price);
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
                    index: index 
                }
            });

            function afterShowAnimation(scope, element, options) {
               // post-show code here: DOM element focus, etc.
            }
        }
    }     
]);
