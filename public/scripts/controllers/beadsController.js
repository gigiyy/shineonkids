myApp.controller('beadsController',
    ['$q', '$rootScope', '$scope', '$route', '$http', '$log', '$mdDialog', 'Utility',
    function($q, $rootScope, $scope, $route, $http, $log, $mdDialog, Utility) {
        $scope.adminEditState = true;
        $scope.beads = [];
        $scope.names = [];
        $scope.types = [];
        $scope.typesForFilter = [];

        Utility.loginCheck();
        getData();

        function getData() {
            var promise = $http.get('/beads').then(function(response) {
                $scope.beads = response.data;
                $scope.names = _.keys(_.countBy($scope.beads, function(data) { return data.name; }));
                $scope.types = _.keys(_.countBy($scope.beads, function(data) { return data.type; }));
                $scope.typesForFilter = _.keys(_.countBy($scope.beads, function(data) { return data.type; }));
                $scope.typesForFilter.unshift("All");

                $scope.$watch('selectedType', function(newValue) {
                  $rootScope.selectedType = newValue;
                })

                if (! $scope.selectedType && $rootScope.selectedType) {
                  $scope.selectedType = $rootScope.selectedType;
                }
                $scope.typeFilter = function(bead){
                  if (! $scope.selectedType || $scope.selectedType == "All" || $scope.selectedType == "") {
                    return true;
                  } else {
                    return bead.type === $scope.selectedType;
                  }
                };
            });
            return promise;
        }

       updateBead = function(name, type, lotsize, price, name_jp, description){
            var deferred = $q.defer();

            $http.put('/beads',
                {name:name, type:type, lotsize:lotsize, price:price, name_jp:name_jp, description:description})
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

        insertBead = function(name, type, lotsize, price, name_jp, description){
             var deferred = $q.defer();

             $http.post('/beads',
                 {name:name, type:type, lotsize:lotsize, price:price, name_jp:name_jp, description:description})
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

         deleteBead = function(name){
             var deferred = $q.defer();

             $http.put('/beads/delete',
                 {name: name})
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

        $scope.editBead = function(ev, bead) {
            function dialogController($scope, $mdDialog, types, name, type, lotsize, price, name_jp, description) {
                $scope.types = types;
                $scope.name = name;
                $scope.type = type;
                $scope.lotsize = lotsize;
                $scope.price = price;
                $scope.name_jp = name_jp;
                $scope.description = description;

                $scope.ok = function(type, lotsize, price, name_jp, description) {
                  if (!type) {
                    alert('Bead Type should not be blank');
                  }
                  else {
                    updateBead(name, type, lotsize, price, name_jp, description);
                    $mdDialog.hide();
                  }
                }

                $scope.cancel = function() {
                    $mdDialog.hide();
                }

                $scope.delete = function() {
                    if (confirm('Is it ok to delete Bead: ' + name + ' ?')) {
                      deleteBead(name);
                      $mdDialog.hide();
                    }
                }
            }

            $mdDialog.show({
                controller: dialogController,
                targetEvent: ev,
                ariaLabel:  'Edit Entry',
                clickOutsideToClose: true,
                templateUrl: 'views/templates/editBead.html',
                onComplete: afterShowAnimation,
                size: 'large',
                bindToController: true,
                autoWrap: false,
                parent: angular.element(document.body),
                preserveScope: true,
                locals: {
                    types: $scope.types,
                    name: bead.name,
                    type: bead.type,
                    lotsize: bead.lotsize,
                    price: bead.price,
                    name_jp: bead.name_jp,
                    description: bead.description
                }
            });

            function afterShowAnimation(scope, element, options) {
               // post-show code here: DOM element focus, etc.
            }
        }

        $scope.newBead = function(ev) {
            function dialogController($scope, $mdDialog, names, types, name, type, lotsize, price, name_jp, description) {
                $scope.names = names;
                $scope.types = types;
                $scope.name = name;
                $scope.type = type;
                $scope.lotsize = lotsize;
                $scope.price = price;
                $scope.name_jp = name_jp;
                $scope.description = description;

                $scope.ok = function(name, type, lotsize, price, name_jp, description) {
                  if (!name) {
                    alert('Bead Name should not be blank');
                  }
                  else if (names.indexOf(name) > 0) {
                    alert('Bead Name already exists');
                  }
                  else if (!type) {
                    alert('Bead Type should not be blank');
                  }
                  else {
                    insertBead(name, type, lotsize, price, name_jp, description);
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
                    names: $scope.names,
                    types: $scope.types,
                    name: "",
                    type: "",
                    lotsize: null,
                    price: null,
                    name_jp: "",
                    description: ""
                }
            });

            function afterShowAnimation(scope, element, options) {
               // post-show code here: DOM element focus, etc.
            }
        }
    }
]);
