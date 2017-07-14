(function () {

	'use strict';

	angular.module('RagXApp', [])
	.controller('RagXApp', ['$scope', '$log', '$http','$q',
	 function($scope, $log, $http, $q) {
	  
	  $scope.combinations = {};

	  $scope.availableShruthis = [{id : 'C', name: 'C'}];
	  $scope.availableRagas = [{id : 1, name: 'mohanam'}];
	 
      $scope.setupShrutis = function() {      	
	    $http.get('/shrutis').
	      then(function(results) {
	      	$scope.availableShruthis = _.map(results.data, function(item) {
	      		return {id: item, name: item}
	      	});
	      });
      };

      $scope.setupRagas = function() {      	
	    $http.get('/ragas').
	      then(function(results) {
	      	$scope.availableRagas = _.map(results.data, function(item) {
	      		return {id: item, name: item}
	      	});
	      });
      };
      $scope.setupShrutis();
      $scope.setupRagas();

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