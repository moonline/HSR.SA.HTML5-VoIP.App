define(["Model/Domain/Addressbook", "Model/Domain/AddressbookEntry"], function(Addressbook, AddressbookEntry) {
	'use strict';


	var AddressbookJson = function () {
		this.implementInterface = 'Model/Interfaces/AddressbookInterface';
		this.type = 'Model/Domain/Addressbook/AddressbookJson';
		this.data = [];

		this.dataSourceType = Addressbook.dataSourceTypes.file;
	};


	/**
	 * @param data json object
	 */
	AddressbookJson.prototype.load = function (data) {
		if (typeof data !== 'string') {
			throw new Error("Input for AddressbookJson must be a string containing json.");
		}

		var jsonData = JSON.parse(data);
		jsonData.forEach(function (dataRow, i) {
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
