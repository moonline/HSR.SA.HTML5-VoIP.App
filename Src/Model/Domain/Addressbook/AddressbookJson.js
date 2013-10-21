/**
 * Created by tobias on 10/8/13.
 */
var Domain = App.Model.Domain;
var Interfaces = App.Model.Interfaces;
var Addressbook = Domain.Addressbook;


Addressbook.AddressbookJson = function(jsonData) {
	this.implementInterface = 'AddressbookInterface';
	var data = new Array();

	var initialize = (function() {
		var inputData;
		if(typeof jsonData === 'object') {
			inputData = jsonData;
		} else {
			inputData = JSON.parse(prompt('Please insert addressbook data in JSON Style with fields "sip", "name", "photo"'));
		}

		inputData.forEach(function(dataRow, i) {
			if(dataRow.hasOwnProperty('sip') && dataRow.hasOwnProperty('name')) {
				var entry = new Domain.AddressbookEntry(dataRow.sip, dataRow.name, dataRow.photo);
				data.push(entry);
			}
		});
	})();

	this.getEntries = function() {
		return data;
	};
	this.count = function() {
		return data.length;
	};
	this.store = function() {
		var addressbook = {
			addressbookType: 'AddressbookJson',
			entries: []
		};
		data.forEach(function(entry) {
			addressbook.entries.push(entry.store());
		});
		return addressbook;
	};
};
