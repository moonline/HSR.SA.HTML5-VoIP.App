/**
 * Created by tobias on 10/8/13.
 */
var Domain = App.Model.Domain;
var Interfaces = App.Model.Interfaces;
var Phonebook = App.Model.Domain.Phonebook;


Phonebook.PhonebookJson = function(jsonData) {
	this.prototype = new Interfaces.PhonebookInterface();
	var data = new Array();

	var initialize = (function() {
		var inputData;
		if(typeof jsonData === 'object') {
			inputData = jsonData;
		} else {
			inputData = JSON.parse(prompt('Please insert phonebook data in JSON Style with fields "sip", "name", "photo"'));
		}

		inputData.forEach(function(dataRow, i) {
			if(dataRow.hasOwnProperty('sip') && dataRow.hasOwnProperty('name')) {
				var entry = new Domain.PhonebookEntry(dataRow.sip, dataRow.name, dataRow.photo);
				data.push(entry);
			}
		});
	})();

	this.getEntries = function() {
		return data;
	}
	this.count = function() {
		return data.length;
	}
}
