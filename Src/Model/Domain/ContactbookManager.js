define(["Model/Interfaces/AddressbookInterface", "Model/Domain/Addressbook", "Core/Framework/Barrier"],function(AddressbookInterface, Addressbook, Barrier) {
	'use strict';

	var Storage = window.localStorage;
	var scope = this;


	var AddressbookManager = function () {
		this.addressbooks = new Array();
	};


	// Todo: create a prefix for local storage setting which is set by the controller (prevent testing and app collisions)
	AddressbookManager.prototype.getAddressBookIndex = function () {
		return (Storage.getItem("addressBookIndex")) ? JSON.parse(Storage.getItem("addressBookIndex")) : [];
	};

	/**
	 * load addressbooks from localstorage
	 *
	 * @type {function(this:AddressbookManager)}
	 */
	AddressbookManager.prototype.load = function (loadedCallback) {
		var barrier = new Barrier(loadedCallback);

		this.getAddressBookIndex().forEach(function (element) {
			if (Storage.getItem(element)) {
				var tempBook = JSON.parse(Storage.getItem(element));

				// restore concrete addressbook by type string using require.js
				barrier.startTask();
				require([tempBook.type], function(ConcreteAddressbook){
					var addressBook = new ConcreteAddressbook();
					Object.keys(tempBook).forEach(function (key) {
						addressBook[key] = tempBook[key];
					}, this);

					// update online addressbooks
					if(addressBook.dataSourceType === Addressbook.dataSourceTypes.online && addressBook.address) {
						addressBook.load(addressBook.address);
					}
					this.addressbooks.push(addressBook);
					barrier.taskFinished();
				}.bind(this));
			}
		}, this);
	};

	/**
	 * add an addressbook
	 *
	 * @param addressbook
	 */
	AddressbookManager.prototype.add = function (addressbook) {
		AddressbookInterface.assertImplementedBy(addressbook);
		var index = this.addressbooks.length;
		this.addressbooks.push(addressbook);
		var addressbookKey = "addressbooks." + index + '-' + (new Date()).getMilliseconds();

		Storage.setItem(addressbookKey, JSON.stringify(addressbook));

		var newIndex = this.getAddressBookIndex();
		newIndex.push(addressbookKey);
		Storage.setItem("addressBookIndex", JSON.stringify(newIndex));
	};

	/**
	 * get a list of contactbooks
	 *
	 * @returns {Array}
	 */
	AddressbookManager.prototype.getAddressbooks = function () {
		return this.addressbooks;
	};

	return AddressbookManager;
});