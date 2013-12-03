define(["Model/Interfaces/AddressbookInterface", "Model/Domain/Addressbook", "Core/Framework/Barrier"],function(AddressbookInterface, Addressbook, Barrier) {
	'use strict';

	var Storage = window.localStorage;


	var ContactbookManager = function (user) {
		this.contactbooks = new Array();
		this.user = user;
		this.indexKey = "contactbookIndex."+user.username;
		this.contactbookKeyPrefix = "contactbook."+user.username+".";
	};


	// Todo: create a prefix for local storage setting which is set by the controller (prevent testing and app collisions)
	ContactbookManager.prototype.getContactbookIndex = function () {
		return (Storage.getItem(this.indexKey)) ? JSON.parse(Storage.getItem(this.indexKey)) : [];
	};

	/**
	 * load contactbooks from localstorage
	 *
	 * @type {function(this:AddressbookManager)}
	 */
	ContactbookManager.prototype.load = function (loadedCallback) {
		var barrier = new Barrier(loadedCallback);

		this.getContactbookIndex().forEach(function (element) {
			if (Storage.getItem(element)) {
				var tempBook = JSON.parse(Storage.getItem(element));

				// restore concrete addressbook by type string using require.js
				barrier.startTask();
				require([tempBook.type], function(ConcreteAddressbook){
					var addressBook = new ConcreteAddressbook();
					Object.keys(tempBook).forEach(function (key) {
						addressBook[key] = tempBook[key];
					}, this);

					// update online contactbooks
					if(addressBook.dataSourceType === Addressbook.dataSourceTypes.online && addressBook.address) {
						addressBook.load(addressBook.address);
					}
					this.contactbooks.push(addressBook);
					barrier.taskFinished();
				}.bind(this));
			}
		}, this);
	};

	/**
	 * add an addressbook
	 *
	 * @param contactbook
	 */
	ContactbookManager.prototype.add = function (contactbook) {
		AddressbookInterface.assertImplementedBy(contactbook);
		var index = this.contactbooks.length;
		this.contactbooks.push(contactbook);
		var contactbookKey = this.contactbookKeyPrefix + index + '-' + (new Date()).getMilliseconds();

		Storage.setItem(contactbookKey, JSON.stringify(contactbook));

		var newIndex = this.getContactbookIndex();
		newIndex.push(contactbookKey);
		Storage.setItem(this.indexKey, JSON.stringify(newIndex));
		console.log(this.contactbooks);
	};

	/**
	 * get a list of contactbooks
	 *
	 * @returns {Array}
	 */
	ContactbookManager.prototype.getContactbooks = function () {
		return this.contactbooks;
	};

	return ContactbookManager;
});