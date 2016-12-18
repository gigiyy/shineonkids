myApp.controller('beadsController',
    ['$q', '$scope', '$route', '$location', '$http', '$log', '$mdDialog', '$window', 'LoginService',
    function($q, $scope, $route, $location, $http, $log, $mdDialog, $window, LoginService) {
        $scope.adminEditState = true;
        $scope.beads = {};
        $scope.names = {};
        $scope.types = {};

        LoginService.loginCheck();
        getData();

        function getData() {
            var promise = $http.get('/beads').then(function(response) {
                $scope.beads = response.data;
                $scope.names = _.keys(_.countBy($scope.beads, function(data) { return data.name; }));
                $scope.types = _.keys(_.countBy($scope.beads, function(data) { return data.type; }));
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
                });
                $window.location.reload();
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
                 });
                 $window.location.reload();
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
                 });
             $window.location.reload();
             return deferred.promise;
         };

        $scope.editBeads = function(ev, index) {
            function dialogController($scope, $mdDialog, types, name, type, lotsize, price, name_jp, description) {
                $scope.types = types;
                $scope.name = name;
                $scope.type = type;
                $scope.lotsize = lotsize;
                $scope.price = price;
                $scope.name_jp = name_jp;
                $scope.description = description;
                $scope.index = index;

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
                templateUrl: 'views/templates/editBeads.html',
                onComplete: afterShowAnimation,
                size: 'large',
                bindToController: true,
                autoWrap: false,
                parent: angular.element(document.body),
                preserveScope: true,
                locals: {
                    types: $scope.types,
                    name: $scope.beads[index].name,
                    type: $scope.beads[index].type,
                    lotsize: $scope.beads[index].lotsize,
                    price: $scope.beads[index].price,
                    name_jp: $scope.beads[index].name_jp,
                    description: $scope.beads[index].description,
                    index: index
                }
            });

            function afterShowAnimation(scope, element, options) {
               // post-show code here: DOM element focus, etc.
            }
        }

        $scope.newBead = function(ev, index) {
            function dialogController($scope, $mdDialog, names, types, name, type, lotsize, price, name_jp, description) {
                $scope.names = names;
                $scope.types = types;
                $scope.name = name;
                $scope.type = type;
                $scope.lotsize = lotsize;
                $scope.price = price;
                $scope.name_jp = name_jp;
                $scope.description = description;
                $scope.index = index;

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
                    description: "",
                    index: index
                }
            });

            function afterShowAnimation(scope, element, options) {
               // post-show code here: DOM element focus, etc.
            }
        }
    }
]);
