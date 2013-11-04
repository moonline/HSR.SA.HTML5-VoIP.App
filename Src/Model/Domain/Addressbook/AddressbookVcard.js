'use strict';

(function () {
	var Domain = App.Model.Domain;
	var Addressbook = Domain.Addressbook;


	Addressbook.AddressbookVcard = function () {
		this.implementInterface = 'AddressbookInterface';
		this.type = 'AddressbookVcard';
		this.data = new Array();
		this.dataSourceTypes = Domain.Addressbook.dataSourceTypes.file;

		this.fieldMapping = {
			"N": ['lastName', 'firstName'],
			"X-SIP": 'sip',
			"PHOTO": 'photo'
		};
	};


	// Todo: write a test for load
	Addressbook.AddressbookVcard.prototype.load = function (vcards) {
		vcards.forEach(function(vcard, index) {
			this.addEntry(vcard);
		},this);
	};


	/**
	 * add a vcard entry
	 * @param string:vcardContent
	 */
	Addressbook.AddressbookVcard.prototype.addEntry = function (vcardContent) {
		var mapping = this.fieldMapping;
		var entry = new Domain.AddressbookEntry();

		var lines = vcardContent.split('\n');
		console.log(vcardContent);
		lines.forEach(function (line) {
			if (line != '' && line != "BEGIN:VCARD" && line != "END:VCARD") {
				var fieldParts = line.splitOnce(':');
				var fieldHeader = fieldParts[0];
				var headerParts = fieldHeader.split(';');
				var fieldName = headerParts[0];

				// Todo: implement structuring from header attributes
				var fieldContent = fieldParts[1];
				var values = fieldContent.split(';');
				values.trimElements();

				//entry[fieldName] = { properties: {}, value: values };
				if (mapping.hasOwnProperty(fieldName)) {
					if (mapping[fieldName] instanceof Array) {
						mapping[fieldName].forEach(function (targetField, index) {
							if (values[index]) {
								entry[targetField] = values[index];
							}
						}, this);
					} else {
						var newKey = mapping[fieldName];
						entry[newKey] = values[0];
					}
				}
			}
		}, this);
		if (!entry.name && entry.firstName && entry.lastName) {
			entry.name = entry.firstName + ' ' + entry.lastName;
		}

		if (Object.keys(entry).length > 0) {
			this.data.push(entry);
		}
	};

	Addressbook.AddressbookVcard.prototype.getEntries = function () {
		return this.data;
	};

	Addressbook.AddressbookVcard.prototype.count = function () {
		return this.data.length;
	};

})();