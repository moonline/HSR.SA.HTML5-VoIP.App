/**
 * Created by tobias on 10/8/13.
 */
var Domain = App.Model.Domain;

Domain.AddressbookManager = function() {
	var addressbooks = new Array();

	this.add = function(addressbook) {
		if(typeof addressbook.getEntries() === 'function' && typeof addressbook.count() === 'function') {
			addressbooks.push(addressbook);
		}
	}
	this.getAddressbooks = function() {
		return addressbooks;
	}
}