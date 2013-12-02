define(["Configuration"], function(Configuration){
	'use strict';

	var ContactbookImportController = function($scope){
		$scope.contactbookImport = Configuration.contactbookImport;

		$scope.importFromFile = function(files) {
			console.log(files);
		}
	};

	return ContactbookImportController;

});