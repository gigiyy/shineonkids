myApp.controller('orderHistoryController', ['$q', '$window', '$scope', '$route', '$location', '$http', '$uibModal', '$log', '$mdDialog',
  function($q, $window, $scope, $route, $location, $http, $uibModal, $log, $mdDialog) {
  $scope.adminEditState = true;
  $scope.beads = {};
  $scope.orders = {};

  var rawData = null;

  loginCheck();
  getBeads()
    .then(function() {
      getOrders()
    });

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

  function getBeads() {
    var promise = $http.get('/beads').then(function(response) {
      $scope.beads = response.data;
    });
    return promise;
  }

  function getOrders() {
    var promise = $http.get('/dashboard/details').then(function(response) {
      rawData = response.data;

      var beads = $scope.beads;
      var datesParties = _.uniq(_.map(rawData, function(data){ return {'asof':data.asof, 'party':data.party}; }), ('asof', 'party'));

      $scope.orders = [];
      for (var i = 0, len1 = datesParties.length; i < len1; i++){
        var order = {};
        for (var j = 0, len2 = beads.length; j < len2; j++){
          order[beads[j].name] = 0
          for (var k = 0, len3 = rawData.length; k < len3; k++){
            if (rawData[k].asof == datesParties[i].asof && rawData[k].party == datesParties[i].party && rawData[k].name == beads[j].name){
              order[beads[j].name] += rawData[k].qty;
            }
          }
          if (order[beads[j].name] == 0) {
            order[beads[j].name] = null;
          }
        }
        order["date"] = datesParties[i].asof;
        order["party"] = datesParties[i].party;
        $scope.orders.push(order);
      }
    });
    return promise;
  }

}]);
