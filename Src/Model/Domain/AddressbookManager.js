/**
 * Created by tobias on 10/8/13.
 */
var Domain = App.Model.Domain;
var Interfaces = App.Model.Interfaces;

Domain.AddressbookManager = function() {
	this.addressbooks = new Array();

	// Todo: fix 'this' problem if moved to prototype
	this.getAddressBookIndex = function() {
		return (window.localStorage.getItem("addressBookIndex")) ? JSON.parse(window.localStorage.getItem("addressBookIndex")) : []
	};

	/**
	 * load addressbooks from localstorage
	 *
	 * @type {function(this:Domain.AddressbookManager)}
	 */
	this.load = function() {
		this.getAddressBookIndex().forEach(function(element) {
			if(window.localStorage.getItem(element)) {
				var tempBook = JSON.parse(window.localStorage.getItem(element));
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

		window.localStorage.setItem(addressbookKey,JSON.stringify(addressbook));

		var newIndex = this.getAddressBookIndex();
		newIndex.push(addressbookKey);
		window.localStorage.setItem("addressBookIndex", JSON.stringify(newIndex));
	};

	this.getAddressbooks= function() {
		return this.addressbooks;
	};
};