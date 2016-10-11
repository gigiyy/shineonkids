myApp.controller('hospitalsController', 
    ['$q', '$scope', '$route', '$location', '$http', '$log', '$mdDialog', '$window',
    function($q, $scope, $route, $location, $http, $log, $mdDialog, $window) {
        $scope.adminEditState = true;    
        $scope.hospitals = {};    
        getData();

        function getData() {
            var promise = $http.get('/hospitals').then(function(response) {
                $scope.hospitals = response.data;
            });
            return promise;
        }

        updateHospital = function(name, address, phone){
            var deferred = $q.defer();
            
            $http.put('/hospitals',
                {name: name, address: address, phone: phone})
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

        $scope.editHospitals = function(ev, index) {
            function dialogController($scope, $mdDialog, name, address, phone) {
                $scope.name = name;
                $scope.address = address;
                $scope.phone = phone;
                $scope.index = index;

                $scope.ok = function(address, phone) {
                    updateHospital(name, address, phone);
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
                templateUrl: 'views/templates/editHospitals.html',
                onComplete: afterShowAnimation,
                size: 'large',
                bindToController: true,
                autoWrap: false,
                parent: angular.element(document.body),
                preserveScope: true,
                locals: { 
                    name: $scope.hospitals[index].name, 
                    address: $scope.hospitals[index].address,
                    phone: $scope.hospitals[index].phone,
                    index: index 
                }
            });

            function afterShowAnimation(scope, element, options) {
               // post-show code here: DOM element focus, etc.
            }
        }
    }        
]);
