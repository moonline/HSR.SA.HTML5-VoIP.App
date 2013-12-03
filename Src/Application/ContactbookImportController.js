define(["Configuration", "Core/Service/FileService", "Model/Domain/ContactbookManager", "Model/Domain/User"], function(Configuration, FileService, ContactbookManager, User){
	'use strict';

	var ContactbookImportController = function($scope, accountService){
		$scope.contactbookImport = Configuration.contactbookImport;

		// TODO: remove this when login is implemented
		if(!accountService.currentUser) {
			accountService.currentUser = new User('testuser', '', 'Test', 'User', '', '');
		}
		if(!accountService.currentUser.contactbookManager) {
			accountService.currentUser.contactbookManager = new ContactbookManager(accountService.currentUser);
			accountService.currentUser.contactbookManager.load(function(){});
		}

		$scope.importFromFile = function(type, files) {
			FileService.readFile(files[0], function(fileContent) {

				require([type], function(ConcreteAddressbook){
					var contactbook = new ConcreteAddressbook();
					contactbook.load(fileContent);
					contactbook.name = prompt('please insert the name of the new contactbook, e.q. business or family');

					accountService.currentUser.contactbookManager.add(contactbook);
				});
			});
		}
	};

	return ContactbookImportController;

});