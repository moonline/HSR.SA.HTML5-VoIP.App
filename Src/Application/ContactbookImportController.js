define(["Configuration", "Core/Service/FileService", "Model/Domain/ContactbookManager", "Model/Domain/User"], function(Configuration, FileService, ContactbookManager, User){
	'use strict';

	var ContactbookImportController = function($scope, $location, accountService, requireLogin) {
		if (requireLogin().abort) {
			return;
		}
		
		$scope.contactbookImport = Configuration.contactbookImport;

		if(!accountService.currentUser.contactbookManager) {
			accountService.currentUser.contactbookManager = new ContactbookManager(accountService.currentUser);
		}
		accountService.currentUser.contactbookManager.refreshFromStorage();


		$scope.importFromFile = function(type, files) {
			FileService.readFile(files[0], function(fileContent) {

				require([type], function(ConcreteAddressbook){
					var contactbook = new ConcreteAddressbook();
					contactbook.load(fileContent);
					contactbook.name = prompt('please insert the name of the new contactbook, e.q. business or family');

					accountService.currentUser.contactbookManager.add(contactbook);

					$location.url('/contacts');
					$scope.$apply();
				});
			});
		}
	};

	return ContactbookImportController;

});