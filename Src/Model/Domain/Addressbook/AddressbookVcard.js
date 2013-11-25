(function () {
	'use strict';

	var Domain = App.Model.Domain;
	var Addressbook = Domain.Addressbook;
	var Configuration = App.Configuration;


	Addressbook.AddressbookVcard = function () {
		this.implementInterface = 'AddressbookInterface';
		this.type = 'AddressbookVcard';
		this.data = new Array();
		this.dataSourceTypes = Domain.Addressbook.dataSourceTypes.file;

		// TODO: move to config
		this.fieldMapping = (Configuration.contactbookVcardConfig) ? Configuration.contactbookVcardConfig : [
			{
				"path": ["VERSION"],
				"mapTo": ['version']
			},{
				"path": ["N"],
				"mapTo": {
					0: ['lastname'],
					1: ['firstname']
				}
			},{
				"path": ["FN"],
				"mapTo": ['name']
			},{
				"path": ["ADR", "HOME", "POSTAL"],
				"mapTo": {
					2: ['address','street'],
					3: ['address','city'],
					4: ['address','region'],
					5: ['address','postcode'],
					6: ['address','country']
				}
			},{
				"path": ["NICKNAME"],
				"mapTo": ['nickname']
			},{
				"path": ["TEL", "CELL", "VOICE"],
				"mapTo": ['phone'],
				"mappingRule": 'list'
			},{
				"path": ["TEL", "HOME","VOICE"],
				"mapTo": ['phone'],
				"mappingRule": 'list'
			},{
				"path": ["TEL"],
				"mapTo": ['phone'],
				"mappingRule": 'list'
			},{
				"path": ["EMAIL", "PREF", "INTERNET"],
				"mapTo": ['email'],
				"mappingRule": 'list'
			},{
				"path": ["EMAIL", "INTERNET"],
				"mapTo": ['email'],
				"mappingRule": 'list'
			},{
				"path": ["BDAY"],
				"mapTo": ['birthdate']
			},{
				"path": ["X-SIP"],
				"mapTo": ["sip"]
			},{
				"path": ["X-SIP"],
				"mapTo": ["sip"]
			},{
				"path": ["PHOTO"],
				"mapTo": ["photo"]
			},{
				"path": ["ORG"],
				"mapTo": ["organisation"]
			},{
				"path": ["URL"],
				"mapTo": ["website"]
			}
		];
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
						data.properties.push({ "property": property.splitOnce('=')[0], "value": property.splitOnce('=')[1] })
					}
				});

				this.fieldMapping.forEach(function(field){
					if(JSON.stringify(field.path) === JSON.stringify(data.path)) {
						if(field.mapTo instanceof Array) {
							var parentField = entry;
							var currentKey;

							field.mapTo.forEach(function(segment){
								if(!currentKey) {
									currentKey = segment;
								} else {
									if(!parentField[currentKey]) {
										parentField[currentKey] = new Object();
									}
									parentField = parentField[currentKey];
									currentKey = segment;
								}
							},this);

							if(field.mappingRule === 'list') {
								if(parentField[currentKey] instanceof Array) {
									parentField[currentKey] = parentField[currentKey].concat(values);
								} else {
									parentField[currentKey] = values;
								}
							} else {
								parentField[currentKey] = values[0];
							}
						} else if(typeof(field.mapTo) === 'object') {
							Object.keys(field.mapTo).forEach(function(key){
								var parentField = entry;
								var currentKey;

								field.mapTo[key].forEach(function(segment){
									if(!currentKey) {
										currentKey = segment;
									} else {
										if(!parentField[currentKey]) {
											parentField[currentKey] = new Object();
										}
										parentField = parentField[currentKey];
										currentKey = segment;
									}
								},this);
								parentField[currentKey] = values[key];
							},this);
						}
					}
				},this);
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