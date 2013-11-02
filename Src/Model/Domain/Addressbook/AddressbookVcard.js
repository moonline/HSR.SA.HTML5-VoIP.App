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

	Addressbook.AddressbookVcard.prototype = {
		// Todo: write a test for load
		load: function (files) {
			var j = 0, k = files.length;
			files.forEach(function (file, i) {
				var reader = new FileReader();
				reader.onload = function (event) {
					if (event.target.readyState == FileReader.DONE) {
						this.addEntry(event.target.result);
					}
				};
				reader.readAsText(file);
			});
		},

		/**
		 * add a vcard entry
		 * @param string:vcardContent
		 */
		addEntry: function (vcardContent) {
			var mapping = this.fieldMapping;
			var entry = new Domain.AddressbookEntry();

			var lines = vcardContent.split('\n')
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
							});
						} else {
							var newKey = mapping[fieldName];
							entry[newKey] = values[0];
						}
					}
				}
			});
			if (!entry.name && entry.firstName && entry.lastName) {
				entry.name = entry.firstName + ' ' + entry.lastName;
			}

			if (Object.keys(entry).length > 0) {
				this.data.push(entry);
			}
		},

		getEntries: function () {
			return this.data;
		},

		count: function () {
			return this.data.length;
		}
	};

})();