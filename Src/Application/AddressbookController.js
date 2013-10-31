'use strict';

var Controller = App.Controller;
var Domain = App.Model.Domain;
var Addressbook = Domain.Addressbook;
var Configuration = App.Configuration;
var Service = App.Core.Service;

Controller.AddressbookController = function() {
	// Todo: remove with 'this'
	var self = this;

	this.addressbookManager = new Domain.AddressbookManager();

	/**
	 * get addressbooks from local storage
	 */
	this.initialize = function() {
		this.addressbookManager.load();
		this.importAction();
	};

	/**
	 * list action
	 *
	 * create a list of addressbooks
	 */
	this.list = function() {
		this.renderEntryList(this.addressbookManager);
		this.showAddressbookElements();
	};

	/**
	 * import action
	 *
	 * import an addressbook
	 */
	this.importAction = function() {
		var template = Handlebars.compile(document.getElementById('import-template').innerHTML);
		var context = { fileImport: Configuration.contactbookImport.file };
		document.getElementById('import').outerHTML = template(context);


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
	};

	/**
	 * compile addressbook navigation and content templates
	 *
	 * @param addressbookManager
	 */
	this.renderEntryList = function(addressbookManager) {
		var adressbookContentElement = document.getElementById('addressbookContent-template');
		var context = { contactbooks: addressbookManager.getAddressbooks() };
		var addressbookTemplate = Handlebars.compile(adressbookContentElement.innerHTML);
		adressbookContentElement.outerHTML = addressbookTemplate(context);

		var addressbookTabsElement = document.getElementById('contactbookNavigation-template');
		var tabsTemplate = Handlebars.compile(addressbookTabsElement.innerHTML);
		addressbookTabsElement.outerHTML = tabsTemplate(context);

		this.templates = {
			addressbookTabs: addressbookTabsElement.textContent,
			addressbookContent:  adressbookContentElement.textContent
		};
	};

	/**
	 * set eventlisteners on tabs, enable first tab and first addressbook
	 */
	this.showAddressbookElements = function() {
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
	};
};