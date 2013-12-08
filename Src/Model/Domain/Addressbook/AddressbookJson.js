define(["Model/Domain/Addressbook", "Model/Domain/AddressbookEntry"], function(Addressbook, AddressbookEntry) {
	'use strict';


	var AddressbookJson = function () {
		this.implementInterface = 'Model/Interfaces/AddressbookInterface';
		this.type = 'Model/Domain/Addressbook/AddressbookJson';
		this.data = new Array();

		this.dataSourceTypes = Addressbook.dataSourceTypes.file;
	};


	/**
	 * load contactbook from json struct
	 *
	 * @param jsonData a string with a json struct or a javascript object
	 */
	AddressbookJson.prototype.load = function (jsonData) {
		var inputData;
		if (typeof jsonData === 'object') {
			inputData = jsonData;
		} else {
			inputData = JSON.parse(jsonData);
		}

		inputData.forEach(function (dataRow, i) {
			if (dataRow.hasOwnProperty('name')) {
				var entry = new AddressbookEntry();
				Object.keys(dataRow).forEach(function (key) {
					entry[key] = dataRow[key];
				});
				this.data.push(entry);
			}
		}, this);
	};


	AddressbookJson.prototype.getEntries = function () {
		return this.data;
	};


	AddressbookJson.prototype.count = function () {
		return this.data.length;
	};


	return AddressbookJson;
});
