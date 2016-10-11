myApp.controller('modalController', 
  ['$scope', '$uibModalInstance', 'name', 'address', 'phone', 
  function ($scope, $uibModalInstance, name, address, phone){

  //these variables allow for the username and lesson plan titles to be displayed on certain modals
  $scope.name = name;
  $scope.address = address;
  $scope.phone = phone;

  //cancel button for all modals
  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };

  $scope.ok = function() {
    //alert("Not Implemented yet!!");
    //return;
    updateHospitals();
    $uibModalInstance.close();
  };

  $scope.delete = function () {
    $uibModalInstance.close();
  };
}]);