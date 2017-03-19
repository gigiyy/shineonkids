myApp.controller('orderHistoryController',
  ['$q', '$scope', '$route', '$http', '$uibModal', '$log', '$mdDialog', 'Utility',
  function($q, $scope, $route, $http, $uibModal, $log, $mdDialog, Utility) {
    $scope.adminEditState = true;
    $scope.beads = [];
    $scope.orders = [];

    var rawData = null;
    Utility.loginCheck();

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
          var beads = _.map($scope.beads, function(bead){ bead.total = 0; bead.unreceived_total = 0; bead.backorder_total = 0; return bead });
          var datesParties = _.uniq(_.map(rawData, function(data){ return {'asof':data.asof, 'party':data.party, 'comment':data.comment}; }), function(asofparty) { return asofparty.asof + asofparty.party + asofparty.comment; });

          for (var i = 0, len1 = datesParties.length; i < len1; i++){
            var order = {};

            for (var j = 0, len2 = beads.length; j < len2; j++){
              order[beads[j].name] = 0
              for (var k = 0, len3 = rawData.length; k < len3; k++){
                if (rawData[k].asof == datesParties[i].asof && rawData[k].party == datesParties[i].party && rawData[k].comment == datesParties[i].comment && rawData[k].name == beads[j].name){
                  order[beads[j].name] += rawData[k].qty;

                  switch (Utility.getTotalType(rawData[k].comment, rawData[k].party)) {
                    case 'total':
                      beads[j].total += rawData[k].qty;
                      break;
                    case 'unreceived_total':
                      beads[j].unreceived_total += rawData[k].qty;
                      break;
                    case '-unreceived_total':
                      beads[j].unreceived_total -= rawData[k].qty;
                      beads[j].total += rawData[k].qty;
                      break;
                    case 'backorder_total':
                      beads[j].backorder_total += rawData[k].qty;
                      break;
                  }
                }
              }
              if (order[beads[j].name] == 0) {
                order[beads[j].name] = null;
              }
            }
            order['date'] = datesParties[i].asof;
            order['party'] = datesParties[i].party;
            order['comment'] = datesParties[i].comment;
            order['showBracket'] = Utility.getBracketType(datesParties[i].comment, datesParties[i].party);
            $scope.orders.push(order);
          }
        });
        return promise;
      }
}]);
