define(["Config/ContactbookConfiguration/Vcard", "Model/Domain/Addressbook", "Model/Domain/AddressbookEntry"], function(VcardConfig, Addressbook, AddressbookEntry) {
	'use strict';


	var AddressbookVcard = function () {
		this.implementInterface = 'Model/Interfaces/AddressbookInterface';
		this.type = 'Model/Domain/Addressbook/AddressbookVcard';
		this.data = [];
		this.dataSourceTypes = Addressbook.dataSourceTypes.file;

		this.fieldMapping = VcardConfig.fieldMapping;
	};


	AddressbookVcard.prototype.load = function (vcards) {
		vcards.forEach(function(vcard) {
			this.addEntry(vcard);
		},this);
	};


	AddressbookVcard.prototype.parseSimpleField = function(entry, field, values) {
		var parentField = entry;
		var currentKey;

		field.mapTo.forEach(function (segment) {
			if (!currentKey) {
				currentKey = segment;
			} else {
				if (!parentField[currentKey]) {
					parentField[currentKey] = new Object();
				}
				parentField = parentField[currentKey];
				currentKey = segment;
			}
		}, this);

		if (field.mappingRule === 'list') {
			if (parentField[currentKey] instanceof Array) {
				parentField[currentKey] = parentField[currentKey].concat(values);
			} else {
				parentField[currentKey] = values;
			}
		} else {
			parentField[currentKey] = values[0];
		}
	};


	AddressbookVcard.prototype.parseFieldWithMultipleValues = function(field, entry, values) {
		Object.keys(field.mapTo).forEach(function (key) {
			var parentField = entry;
			var currentKey;

			field.mapTo[key].forEach(function (segment) {
				if (!currentKey) {
					currentKey = segment;
				} else {
					if (!parentField[currentKey]) {
						parentField[currentKey] = new Object();
					}
					parentField = parentField[currentKey];
					currentKey = segment;
				}
			}, this);
			parentField[currentKey] = values[key];
		}, this);
	};

	AddressbookVcard.prototype.parseVcardAndMapFields = function(data, entry, values) {
		this.fieldMapping.forEach(function (field) {
			if (JSON.stringify(field.path) === JSON.stringify(data.path)) {
				if (field.mapTo instanceof Array) {
					this.parseSimpleField(entry, field, values);
				} else if (typeof(field.mapTo) === 'object') {
					this.parseFieldWithMultipleValues(field, entry, values);
				}
			}
		}, this);
	};

	/**
	 * @param vcardContent content of the vcf file as text (img as base64)
	 */
	AddressbookVcard.prototype.addEntry = function (vcardContent) {
		var entry = new AddressbookEntry();

		var lines = vcardContent.split('\n');
		lines.forEach(function (line, index) {
			if (line != '' && line != "BEGIN:VCARD" && line != "END:VCARD" && line.indexOf(':') > 0 && line.charAt(0) !== ' ') {
				for(var i=index+1; i<lines.length && lines[i].charAt(0) == ' ' && lines[i].indexOf(':') < 0; i++) {
					line = line+lines[i].substring(1);
					console.log('image with breaks detected');
				}

				var fieldParts = line.splitOnce(':');
				var fieldHeader = fieldParts[0];
				var headerParts = fieldHeader.split(';');
				var fieldContent = fieldParts[1];
				var values = fieldContent.split(';');
				values.trimElements();

				var data = {
					"path": [],
					"properties": [],
					"values": values
				};
				headerParts.forEach(function(property){
					if(property.indexOf('=') < 0) {
						data.path.push(property);
					} else {
						data.properties.push({ "property": property.splitOnce('=')[0], "value": property.splitOnce('=')[1] });
					}
				});

				this.parseVcardAndMapFields(data, entry, values);
			}
		}, this);
		if (!entry.name && entry.firstName && entry.lastName) {
			entry.name = entry.firstName + ' ' + entry.lastName;
		}
		if (Object.keys(entry).length > 0) {
			this.data.push(entry);
		}
	};


	AddressbookVcard.prototype.getEntries = function () {
		return this.data;
	};


	AddressbookVcard.prototype.count = function () {
		return this.data.length;
	};


	return AddressbookVcard;
});