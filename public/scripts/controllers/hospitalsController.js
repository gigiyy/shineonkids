myApp.controller('hospitalsController',
    ['$q', '$scope', '$route', '$location', '$http', '$log', '$mdDialog', '$window', 'LoginService',
    function($q, $scope, $route, $location, $http, $log, $mdDialog, $window, LoginService) {
        $scope.adminEditState = true;
        $scope.hospitals = {};
        $scope.names = {};

        LoginService.loginCheck();
        getData();

        function getData() {
            var promise = $http.get('/hospitals').then(function(response) {
                $scope.hospitals = response.data;
                $scope.names = _.keys(_.countBy($scope.hospitals, function(data) { return data.name; }));
            });
            return promise;
        }

        updateHospital = function(name, postal, address, phone, dept, title, contact1, contact2, email){
            var deferred = $q.defer();

            $http.put('/hospitals',
                {name:name, postal:postal, address:address, phone:phone, dept:dept, title:title, contact1:contact1, contact2:contact2, email:email})
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

        insertHospital = function(name, postal, address, phone, dept, title, contact1, contact2, email){
            var deferred = $q.defer();

            $http.post('/hospitals',
                {name:name, postal:postal, address:address, phone:phone, dept:dept, title:title, contact1:contact1, contact2:contact2, email:email})
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

        deleteHospital = function(name){
            var deferred = $q.defer();

            $http.put('/hospitals/delete',
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

        $scope.editHospitals = function(ev, index) {
            function dialogController($scope, $mdDialog, name, postal, address, phone, dept, title, contact1, contact2, email) {
                $scope.name = name;
                $scope.postal = postal;
                $scope.address = address;
                $scope.phone = phone;
                $scope.dept = dept;
                $scope.title = title;
                $scope.contact1 = contact1;
                $scope.contact2 = contact2;
                $scope.email = email;
                $scope.index = index;

                $scope.ok = function(postal, address, phone, dept, title, contact1, contact2, email) {
                    updateHospital(name, postal, address, phone, dept, title, contact1, contact2, email);
                    $mdDialog.hide();
                }

                $scope.cancel = function() {
                    $mdDialog.hide();
                }

                $scope.delete = function() {
                    if (confirm('Is it ok to delete Hospital: ' + name + ' ?')) {
                      deleteHospital(name);
                      $mdDialog.hide();
                    }
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
                    postal: $scope.hospitals[index].postal,
                    address: $scope.hospitals[index].address,
                    phone: $scope.hospitals[index].phone,
                    dept: $scope.hospitals[index].dept,
                    title: $scope.hospitals[index].title,
                    contact1: $scope.hospitals[index].contact1,
                    contact2: $scope.hospitals[index].contact2,
                    email: $scope.hospitals[index].email,
                    index: index
                }
            });

            function afterShowAnimation(scope, element, options) {
               // post-show code here: DOM element focus, etc.
            }
        }

        $scope.insertHospitals = function(ev, index) {
            function dialogController($scope, $mdDialog, names, name, postal, address, phone, dept, title, contact1, contact2, email) {
                $scope.names = names;
                $scope.name = name;
                $scope.postal = postal;
                $scope.address = address;
                $scope.phone = phone;
                $scope.dept = dept;
                $scope.title = title;
                $scope.contact1 = contact1;
                $scope.contact2 = contact2;
                $scope.email = email;
                $scope.index = index;

                $scope.ok = function(name, postal, address, phone, dept, title, contact1, contact2, email) {
                  if (!name) {
                    alert('Hospital Name should not be blank');
                  }
                  else if (names.indexOf(name) > 0) {
                    alert('Hospital Name already exists');
                  }
                  else {
                    insertHospital(name, postal, address, phone, dept, title, contact1, contact2, email);
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
                templateUrl: 'views/templates/newHospital.html',
                onComplete: afterShowAnimation,
                size: 'large',
                bindToController: true,
                autoWrap: false,
                parent: angular.element(document.body),
                preserveScope: true,
                locals: {
                    names: $scope.names,
                    name: "",
                    postal: "",
                    address: "",
                    phone: "",
                    dept: "",
                    title: "",
                    contact1: "",
                    contact2: "",
                    email: "",
                    index: index
                }
            });

            function afterShowAnimation(scope, element, options) {
               // post-show code here: DOM element focus, etc.
            }
        }
    }
]);
