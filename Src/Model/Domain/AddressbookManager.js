/**
 * Created by tobias on 10/8/13.
 */
var Domain = App.Model.Domain;
var Interfaces = App.Model.Interfaces;

Domain.AddressbookManager = function() {
	this.addressbooks = new Array();

	// Todo: fix this problem if moved to prototype
	this.getAddressBookIndex= function() {
		return (window.localStorage.getItem("addressBookIndex")) ? JSON.parse(window.localStorage.getItem("addressBookIndex")) : []
	};
	this.load = function() {
		this.getAddressBookIndex().forEach(function(element) {
			if(window.localStorage.getItem(element)) {
				var tempBook = JSON.parse(window.localStorage.getItem(element));
				this.addressbooks.push(new Domain.Addressbook(tempBook.entries));
			}
		}.bind(this));
	}.bind(this);
	this.add = function(addressbook) {
		Interfaces.AddressbookInterface.implementedBy(addressbook);
		this.addressbooks.push(addressbook);
		var index = this.addressbooks.length;
		window.localStorage.setItem("addressbook"+index,JSON.stringify({
				entries: addressbook.getEntries()
			}
		));
		var newIndex = this.getAddressBookIndex()
			newIndex.push("addressbook"+index);
		window.localStorage.setItem("addressBookIndex", JSON.stringify(newIndex));
	};
	this.getAddressbooks= function() {
		return this.addressbooks;
	};
};