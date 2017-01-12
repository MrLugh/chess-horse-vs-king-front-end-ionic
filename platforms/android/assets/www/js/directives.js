angular.module("chess.directives", [])

.directive('chess',function(){
	return {
		templateUrl:'js/templates/chess.html',
		controller:'chessCo'
	}
})