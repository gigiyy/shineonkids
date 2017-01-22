myApp.controller('orderHistoryController',
  ['$q', '$scope', '$route', '$http', '$uibModal', '$log', '$mdDialog', 'LoginService',
  function($q, $scope, $route, $http, $uibModal, $log, $mdDialog, LoginService) {
    $scope.adminEditState = true;
    $scope.beads = [];
    $scope.orders = [];

    var rawData = null;
    LoginService.loginCheck();

    getBeads()
      .then(function() {
        getOrders()
      });

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
          var datesParties = _.uniq(_.map(rawData, function(data){ return {'asof':data.asof, 'party':data.party}; }), function(asofparty) { return asofparty.asof + asofparty.party; });

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
