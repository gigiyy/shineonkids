myApp.controller('transactionHistoryController', ['$q', '$window', '$scope', '$route', '$location', '$http', '$uibModal', '$log', '$mdDialog',
    function($q, $window, $scope, $route, $location, $http, $uibModal, $log, $mdDialog) {
    $scope.adminEditState = true;
    $scope.invs = {};

    loginCheck();
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
        var promise = $http.get('/dashboard/details ').then(function(response) {
                $scope.invs = response.data;
            });
        return promise;
    }
}]);
