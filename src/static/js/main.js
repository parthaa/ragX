(function () {

	'use strict';

	angular.module('RagXApp', [])
	.controller('RagXApp', ['$scope', '$log', '$http','$q',
	 function($scope, $log, $http, $q) {

	  $scope.combinations = {};

	  $scope.availableShruthis = [{id : 'C', name: 'C'}];
	  $scope.availableRagas = [];
      $scope.setupShrutis = function() {
	    $http.get('/shrutis').
	      then(function(results) {
	      	$scope.availableShruthis = _.map(results.data, function(item) {
	      		return {id: item, name: item}
	      	});
	      });
      };

      $scope.setupRagas = function() {
	    $http.get('/ragas', {params: {genre: $scope.data.genre.name}}).
	      then(function(results) {
	      	$scope.availableRagas = _.map(results.data, function(item) {
	      		return {id: item, name: item}
	      	});
	      });
      };

      $scope.setupGenres = function() {
	    $http.get('/genres').
	      then(function(results) {
	      	$scope.availableGenres = _.map(results.data, function(item) {
	      		return {id: item, name: item}
	      	});
	      });
      };
      $scope.setupGenres();
      $scope.setupShrutis();
      $scope.$watch('data.genre', function (genre) {
      	if ($scope.data) {
	      	$scope.setupRagas();
      	}
      });

	  $scope.getResults = function() {
	    // get the URL from the input
	    var userInput = {raga: $scope.data.raga.name,
	    				 shruthi: $scope.data.shruthi.name,
	    				 genre: $scope.data.genre.name };

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
