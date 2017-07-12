(function () {

	'use strict';

	angular.module('RagXApp', [])
	.controller('RagXApp', ['$scope', '$log', '$http',
	 function($scope, $log, $http) {
	  
	  $scope.combinations = {};

	  $scope.availableShruthis = [{id : 'C', name: 'C'}];
	  $scope.availableRagas = [{id : 1, name: 'mohanam'}];
	 

	  $scope.getResults = function() {
	    // get the URL from the input
	    var userInput = {raga: $scope.data.raga.name, shruthi: $scope.data.shruthi.name };

	    // fire the API request
	    $http.get('/transposes', {params: userInput}).
	      then(function(results) {
	        $scope.combinations = results.data;
	        $log.log($scope.combinations);
	      });

	  };

	 }
	]);


}());