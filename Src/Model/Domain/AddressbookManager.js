'use strict';

(function() {
	var Domain = App.Model.Domain;
	var Interfaces = App.Model.Interfaces;
	var Storage = window.localStorage;


	Domain.AddressbookManager = function() {
		this.addressbooks = new Array();


		// Todo: fix 'this' problem if moved to prototype
		this.getAddressBookIndex = function() {
			return (Storage.getItem("addressBookIndex")) ? JSON.parse(Storage.getItem("addressBookIndex")) : []
		};

		/**
		 * load addressbooks from localstorage
		 *
		 * @type {function(this:Domain.AddressbookManager)}
		 */
		this.load = function() {
			this.getAddressBookIndex().forEach(function(element) {
				if(Storage.getItem(element)) {
					var tempBook = JSON.parse(Storage.getItem(element));
					if(Domain.Addressbook[tempBook.type]) {
						var addressBook = new Domain.Addressbook[tempBook.type]();
						Object.keys(tempBook).forEach(function(key) {
							addressBook[key] = tempBook[key];
						});
						this.addressbooks.push(addressBook);
					}
				}
			}.bind(this));
		}.bind(this);

		/**
		 * add an addressbook
		 *
		 * @param addressbook
		 */
		this.add = function(addressbook) {
			Interfaces.AddressbookInterface.implementedBy(addressbook);
			var index = this.addressbooks.length;
			this.addressbooks.push(addressbook);
			var addressbookKey = "addressbooks."+index+'-'+(new Date()).getMilliseconds();

			Storage.setItem(addressbookKey,JSON.stringify(addressbook));

			var newIndex = this.getAddressBookIndex();
			newIndex.push(addressbookKey);
			Storage.setItem("addressBookIndex", JSON.stringify(newIndex));
		};

		/**
		 * get a list of contactbooks
		 *
		 * @returns {Array}
		 */
		this.getAddressbooks= function() {
			return this.addressbooks;
		};
	};

})();