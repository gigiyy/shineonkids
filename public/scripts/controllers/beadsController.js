myApp.controller('beadsController',
    ['$q', '$scope', '$route', '$location', '$http', '$log', '$mdDialog', '$window',
    function($q, $scope, $route, $location, $http, $log, $mdDialog, $window) {
        $scope.adminEditState = true;
        $scope.beads = {};
        $scope.types = {};

        loginCheck()
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

        function getData() {
            var promise = $http.get('/beads').then(function(response) {
                $scope.beads = response.data;
                $scope.types = _.keys(_.countBy($scope.beads, function(data) { return data.type; }));
            });
            return promise;
        }

       updateBead = function(name, type, lotsize, price, name_jp, desc){
            var deferred = $q.defer();

            $http.put('/beads',
                {name:name, type:type, lotsize:lotsize, price:price, name_jp:name_jp, desc:desc})
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

        insertBead = function(name, type, lotsize, price, name_jp, desc){
             var deferred = $q.defer();

             $http.post('/beads',
                 {name:name, type:type, lotsize:lotsize, price:price, name_jp:name_jp, desc:desc})
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
            function dialogController($scope, $mdDialog, types, name, type, lotsize, price, name_jp, desc) {
                $scope.types = types;
                $scope.name = name;
                $scope.type = type;
                $scope.lotsize = lotsize;
                $scope.price = price;
                $scope.name_jp = name_jp;
                $scope.desc = desc;
                $scope.index = index;

                $scope.ok = function(type, lotsize, price, name_jp, desc) {
                    updateBead(name, type, lotsize, price, name_jp, desc);
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
                    types: $scope.types,
                    name: $scope.beads[index].name,
                    type: $scope.beads[index].type,
                    lotsize: $scope.beads[index].lotsize,
                    price: $scope.beads[index].price,
                    name_jp: $scope.beads[index].name_jp,
                    desc: $scope.beads[index].desc,
                    index: index
                }
            });

            function afterShowAnimation(scope, element, options) {
               // post-show code here: DOM element focus, etc.
            }
        }

        $scope.newBead = function(ev, index) {
            function dialogController($scope, $mdDialog, types, name, type, lotsize, price, name_jp, desc) {
                $scope.types = types;
                $scope.name = name;
                $scope.type = type;
                $scope.lotsize = lotsize;
                $scope.price = price;
                $scope.name_jp = name_jp;
                $scope.desc = desc;
                $scope.index = index;

                $scope.ok = function(name, type, lotsize, price, name_jp, desc) {
                    insertBead(name, type, lotsize, price, name_jp, desc);
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
                    types: $scope.types,
                    name: "",
                    type: "",
                    lotsize: "",
                    price: "",
                    name_jp: "",
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
