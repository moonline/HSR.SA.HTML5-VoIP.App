/**
 * Created by tobias on 10/21/13.
 */
var Domain = App.Model.Domain;

/**
 * Addressbook
 *
 * @param entries: list of AddressbookEntry
 * @constructor
 */
Domain.Addressbook = function(entries) {
	this.load = function() {
		return this.entries;
	};
	this.entries = entries;
};

Domain.Addressbook.prototype = {
	implementInterface: 'AddressbookInterface',
	getEntries: function() {
		return this.entries;
	},
	count: function() {
		return this.entries.length;
	}
};

Domain.Addressbook.dataSourceTypes = { file: 0, webservice: 1};