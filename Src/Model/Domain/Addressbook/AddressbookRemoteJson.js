define(["Configuration", "Model/Domain/Addressbook", "Model/Domain/AddressbookEntry", "Core/Service/Log", "jQuery"],
	function(Configuration, Addressbook, AddressbookEntry, Log, jQuery) {
	'use strict';


	var AddressbookRemoteJson = function () {
		this.implementInterface = 'Model/Interfaces/AddressbookInterface';
		this.type = 'Model/Domain/Addressbook/AddressbookRemoteJson';
		this.data = [];

		this.dataSourceType = Addressbook.dataSourceTypes.online;
	};


	/**
	 * load contactbook from json struct
	 *
	 * @param address web address like http://online-contactbook.com/me
	 * @param doneSuccessCallback method called on data load success
	 */
	AddressbookRemoteJson.prototype.load = function(address,doneSuccessCallback) {
		this.address = address;

		jQuery.getJSON(address, function( data ) {
				this.data = [];

				Object.keys(data).forEach(function(key) {
					var dataRow = data[key];
					if (dataRow.hasOwnProperty('name')) {
						var entry = new AddressbookEntry();
						Object.keys(dataRow).forEach(function (key) {
							entry[key] = dataRow[key];
						});
						this.data.push(entry);
					}
				},this);
			}.bind(this)
		)
			.done(function() {
				if(doneSuccessCallback) {
					doneSuccessCallback();
				}
			})
			.fail(function() {
				Log.log(Log.logLevels.Error, 'AddressbookRemoteJson', 'Could not load addressbook from '+address);
			});
	};


	AddressbookRemoteJson.prototype.getEntries = function () {
		return this.data;
	};


	AddressbookRemoteJson.prototype.count = function () {
		return this.data.length;
	};


	return AddressbookRemoteJson;
});
