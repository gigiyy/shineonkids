myApp.controller('transactionHistoryController', ['$q', '$window', '$scope', '$route', '$location', '$http', '$uibModal', '$log', '$mdDialog',
    function($q, $window, $scope, $route, $location, $http, $uibModal, $log, $mdDialog) {
    $scope.adminEditState = true;    
    $scope.invs = {};
    getData();

    function getData() {
        var promise = $http.get('/dashboard/details ').then(function(response) {
                $scope.invs = response.data;
            });
        return promise;
    }
}]);


