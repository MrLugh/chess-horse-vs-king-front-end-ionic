angular.module("chess.controllers", [])

.controller("chessCo",["$scope", "chessSv", "horseSv", "kingSv",
function($scope, chessSv, horseSv, kingSv) {

	$scope.chessSv = chessSv;
	$scope.horseSv = horseSv;
	$scope.kingSv = kingSv;

	$scope.positionClick = function(position) {
		if (position.status) {
			return;
		}
		if (!$scope.horseSv.getInitial()) {
			$scope.horseSv.setInitial(position);
			return;
		}
		if ($scope.horseSv.getInitial() && !$scope.kingSv.getInitial()) {
			$scope.kingSv.setInitial(position);
			return;
		}
	}

	$scope.getCurrentPositionClass = function(position) {
		if (chessSv.getWinner().length) {
			return 'current-'+chessSv.getWinner();
		}
		if ($scope.horseSv.getCurrent() && position.index == $scope.horseSv.getCurrent().index) {
			return 'current-horse';
		}
		if ($scope.kingSv.getCurrent() && position.index == $scope.kingSv.getCurrent().index) {
			return 'current-king';
		}
	}

	chessSv.init();

}])