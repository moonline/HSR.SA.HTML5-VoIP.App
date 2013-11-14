'use strict';

(function () {
	var Domain = App.Model.Domain;
	var Addressbook = Domain.Addressbook;
	var Service = App.Core.Service;


	Addressbook.AddressbookRemoteJson = function () {
		this.implementInterface = 'AddressbookInterface';
		this.type = 'AddressbookRemoteJson';
		this.data = new Array();

		this.dataSourceType = Domain.Addressbook.dataSourceTypes.online;
	};


	/**
	 * load contactbook from json struct
	 *
	 * @param address
	 * @param doneSuccessCallback: method called on data load success
	 */
	Addressbook.AddressbookRemoteJson.prototype.load = function(address,doneSuccessCallback) {
		this.address = address;

		$.getJSON(address, function( data ) {
				this.data = new Array();

				Object.keys(data).forEach(function(key) {
					var dataRow = data[key];
					if (dataRow.hasOwnProperty('name')) {
						var entry = new Domain.AddressbookEntry();
						Object.keys(dataRow).forEach(function (key) {
							entry[key] = dataRow[key];
						});
						this.data.push(entry);
					}
				},this);
			}.bind(this)
		)
			.done(function() {
				doneSuccessCallback();
			})
			.fail(function() {
				Service.Log.log(Service.Log.logLevels.Error, 'AddressbookRemoteJson', 'Could not load addressbook from '+address);
			});
	};

	Addressbook.AddressbookRemoteJson.prototype.getEntries = function () {
		return this.data;
	};

	Addressbook.AddressbookRemoteJson.prototype.count = function () {
		return this.data.length;
	};

})();
