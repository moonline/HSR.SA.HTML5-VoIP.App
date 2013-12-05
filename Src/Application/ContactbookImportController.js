define(["Configuration", "Core/Service/FileService", "Model/Domain/ContactbookManager", "Core/Framework/Interface", "Model/Interfaces/AddressbookInterface"],
	function(Configuration, FileService, ContactbookManager, Interface, AddressbookInterface){
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
					if(ConcreteAddressbook) {
						var contactbook = new ConcreteAddressbook();
						AddressbookInterface.assertImplementedBy(contactbook);

						contactbook.load(fileContent);
						contactbook.name = prompt('please insert the name of the new contactbook, e.q. business or family');

						accountService.currentUser.contactbookManager.add(contactbook);

						$location.url('/contacts');
						$scope.$apply();
					} else {
						alert('Missconfiguration. Configured contactbook "'+type+'" not found.');
					}
				});
			});
		};

		$scope.importFromDirectory = function(type, files) {
			FileService.readFiles(files, function(fileContents) {
				require([type], function(ConcreteAddressbook){
					if(ConcreteAddressbook) {
						var contactbook = new ConcreteAddressbook();
						AddressbookInterface.assertImplementedBy(contactbook);

						contactbook.load(fileContents);
						contactbook.name = prompt('please insert the name of the new contactbook, e.q. business or family');

						accountService.currentUser.contactbookManager.add(contactbook);

						$location.url('/contacts');
						$scope.$apply();
					}
				});
			});
		};
	};

	return ContactbookImportController;

});