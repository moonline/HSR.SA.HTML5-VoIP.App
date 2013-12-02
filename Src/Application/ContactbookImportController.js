define(["Configuration", "Core/Service/FileService"], function(Configuration, FileService){
	'use strict';

	var ContactbookImportController = function($scope, accountService){
		$scope.contactbookImport = Configuration.contactbookImport;
		console.log(accountService);

		$scope.importFromFile = function(files) {
			console.log(files);
			FileService.readFile(files[0], function(fileContent) {
				var contactbook = new Addressbook[contactBookConfig.type]();
				contactbook.load(fileContent);
				self.addressbookManager.add(contactbook);

				// update
				var context = { contactbooks: self.addressbookManager.getAddressbooks() };
				document.getElementById('contactbookNavigation').innerHTML = (Handlebars.compile(self.templates.addressbookTabs.toString()))(context);
				document.getElementById('addressbookContent').innerHTML = (Handlebars.compile(self.templates.addressbookContent.toString()))(context);
				self.showAddressbookElements();
			});
		}
	};

	return ContactbookImportController;

});