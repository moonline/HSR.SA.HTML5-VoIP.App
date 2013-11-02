'use strict';

(function () {
	var Domain = App.Model.Domain;
	var Addressbook = Domain.Addressbook;


	Addressbook.AddressbookJson = function () {
		this.implementInterface = 'AddressbookInterface';
		this.type = 'AddressbookJson';
		this.data = new Array();

		this.dataSourceTypes = Domain.Addressbook.dataSourceTypes.file;
	};


	/**
	 * load contactbook from json struct
	 *
	 * @param jsonData: a string with a json struct or a javascript object
	 */
	Addressbook.AddressbookJson.prototype.load = function (jsonData) {
		var inputData;
		if (typeof jsonData === 'object') {
			inputData = jsonData;
		} else {
			inputData = JSON.parse(jsonData);
		}

		inputData.forEach(function (dataRow, i) {
			if (dataRow.hasOwnProperty('sip') && dataRow.hasOwnProperty('name')) {
				var entry = new Domain.AddressbookEntry();
				Object.keys(dataRow).forEach(function (key) {
					entry[key] = dataRow[key];
				});
				this.data.push(entry);
			}
		}, this);
	};

	Addressbook.AddressbookJson.prototype.getEntries = function () {
		return this.data;
	};

	Addressbook.AddressbookJson.prototype.count = function () {
		return this.data.length;
	};

})();
