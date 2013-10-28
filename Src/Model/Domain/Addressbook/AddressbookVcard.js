/**
 * Created by tobias on 10/28/13.
 */
var Domain = App.Model.Domain;
var Interfaces = App.Model.Interfaces;
var Addressbook = Domain.Addressbook;


Addressbook.AddressbookVcard = function() {
	this.implementInterface = 'AddressbookInterface';
	this.type = 'AddressbookVcard';
	this.data = new Array();
	this.dataSourceTypes = Domain.Addressbook.dataSourceTypes.file;
	this.fieldMapping = { // field in csv: field in addressbook
		'tel' : 'sip'
	}
};

Addressbook.AddressbookVcard.prototype = {
	// Todo: write a test for load
	load: function(files) {
		var j = 0, k = files.length;
		files.forEach(function(file, i) {
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
	addEntry: function(vcardContent) {
		var entry = new Array();

		var lines = vcardContent.split('\n')
		lines.forEach(function(line){
				if(line != '' && line != "BEGIN:VCARD" && line != "END:VCARD") {
				var lineEntry;

				var fieldParts = line.split(':');
				var fieldHeader = fieldParts[0];
				var headerParts = fieldHeader.split(';');
				var fieldName = headerParts[0];

				// Todo:
				/*headerParts[1].forEach(function(property) {
					var propertyParts = property.split('=');

					properties.[propertyParts[0]] = propertyParts[1].split(',');
				});*/
				var fieldContent = fieldParts[1];
				var values = fieldContent.split(';');

				entry[fieldName] = { properties: {}, value: values };
			}
		});

		this.data.push(entry);
	},

	getEntries: function() {
		return this.data;
	},

	count: function() {
		return this.data.length;
	}
};