define(["Configuration","Model/Domain/ContactbookManager"],
	function (Configuration, ContactbookManager) {
	'use strict';

	var ContactbookController = function($scope) {
		$scope.contactbookManager = new ContactbookManager();
		$scope.contactbookManager.load();

		$scope.currentContactbook = null;

		$scope.open = function(contactbook) {
			$scope.currentContactbook = contactbook;
		};
	};

	return ContactbookController;

});


		/**
		 * import action
		 *
		 * import an addressbook
		 */
		/*this.importAction = function() {
			var template = Handlebars.compile(document.getElementById('import-template').textContent);
			var context = {
				fileImport: Configuration.contactbookImport.file,
				directoryImport: Configuration.contactbookImport.directory,
				onlineImport: Configuration.contactbookImport.online
			};
			document.getElementById('import').innerHTML = template(context);

			// file import
			Configuration.contactbookImport.file.forEach(function(contactBookConfig, index){
				// Todo: check addressbok exists and implements interface
				document.getElementById(contactBookConfig.type).addEventListener('change', function(event) {
					Service.FileService.readFile(event.target.files[0], function(fileContent) {
						var contactbook = new Addressbook[contactBookConfig.type]();
						contactbook.load(fileContent);
						self.addressbookManager.add(contactbook);

						// update
						var context = { contactbooks: self.addressbookManager.getAddressbooks() };
						document.getElementById('contactbookNavigation').innerHTML = (Handlebars.compile(self.templates.addressbookTabs.toString()))(context);
						document.getElementById('addressbookContent').innerHTML = (Handlebars.compile(self.templates.addressbookContent.toString()))(context);
						self.showAddressbookElements();
					});
				});
			});

			// directory import
			Configuration.contactbookImport.directory.forEach(function(contactBookConfig, index){
				// Todo: check addressbok exists and implements interface
				document.getElementById(contactBookConfig.type).addEventListener('change', function(event) {

					Service.FileService.readFiles(event.target.files, function(fileContents) {
						var contactbook = new Addressbook[contactBookConfig.type]();
						contactbook.load(fileContents);
						self.addressbookManager.add(contactbook);

						// update
						var context = { contactbooks: self.addressbookManager.getAddressbooks() };
						document.getElementById('contactbookNavigation').innerHTML = (Handlebars.compile(self.templates.addressbookTabs.toString()))(context);
						document.getElementById('addressbookContent').innerHTML = (Handlebars.compile(self.templates.addressbookContent.toString()))(context);
						self.showAddressbookElements();
					});
				});
			});

			// online import
			Configuration.contactbookImport.online.forEach(function(contactBookConfig, index){
				// Todo: check addressbok exists and implements interface
				document.getElementById(contactBookConfig.type+'Load').addEventListener('click', function(event) {
					var address = prompt('Please insert the address of the remote contactbook file.');
					address = (address.indexOf('http://') == 0) ? address : 'http://'+address;
					var contactbook = new Addressbook[contactBookConfig.type]();

					contactbook.load(address, function() {
							self.addressbookManager.add(contactbook);
							self.updateContactBooks();
						}.bind(this)
					);
				}.bind(this));
			});
		};

		this.updateContactBooks = function() {
			var context = { contactbooks: self.addressbookManager.getAddressbooks() };
			document.getElementById('contactbookNavigation').innerHTML = (Handlebars.compile(self.templates.addressbookTabs.toString()))(context);
			document.getElementById('addressbookContent').innerHTML = (Handlebars.compile(self.templates.addressbookContent.toString()))(context);
			self.showAddressbookElements();
		};*/

		/**
		 * compile addressbook navigation and content templates
		 *
		 * @param addressbookManager
		 */
		/*this.renderEntryList = function(addressbookManager) {
			var adressbookContentElement = document.getElementById('addressbookContent-template');
			var context = { contactbooks: addressbookManager.getAddressbooks() };
			var addressbookTemplate = Handlebars.compile(adressbookContentElement.textContent);
			adressbookContentElement.outerHTML = addressbookTemplate(context);

			var addressbookTabsElement = document.getElementById('contactbookNavigation-template');
			var tabsTemplate = Handlebars.compile(addressbookTabsElement.textContent);
			addressbookTabsElement.outerHTML = tabsTemplate(context);

			this.templates = {
				addressbookTabs: addressbookTabsElement.textContent,
				addressbookContent:  adressbookContentElement.textContent
			};
		};*/

		/**
		 * set eventlisteners on tabs, enable first tab and first addressbook
		 */
		/*this.showAddressbookElements = function() {
			var addressbooks = document.querySelectorAll('#addressbook .addressbookContent .addressbookSlide');
			var tabs = document.querySelectorAll('#addressbook nav span');
			if(addressbooks && addressbooks.length > 0) {
				addressbooks[0].className = addressbooks[0].className+" active";
				tabs[0].className = "active";
			}
			Array.prototype.slice.call(tabs,0).forEach(function(element, index) {
				element.onclick = function(event) {
					Array.prototype.slice.call(tabs).forEach(function(tab, j) {
						tab.className = "";
					});
					event.target.className = "active";

					var slides = document.querySelectorAll('#addressbook .addressbookContent .addressbookSlide');
					Array.prototype.slice.call(slides).forEach(function(slide, k) {
						slide.className = "addressbookSlide";
						if(slide == addressbooks[index]) {
							slide.className = slide.className+" active";
						}
					});
				};
			});

			Array.prototype.slice.call(document.querySelectorAll('#addressbookContent .entry .nick'), 0).forEach(function(node,index){
				node.onclick = function() {
					Domain.EventManager.notify('startCall', { "receiver":node.getAttribute('data-call') }, 'addressbookEntry');
				};
			},this);
		};
	};*/

