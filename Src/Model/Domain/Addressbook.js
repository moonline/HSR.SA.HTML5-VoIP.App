'use strict';

(function () {
	// Todo: is this class used jet? -> otherwise: remove
	var Domain = App.Model.Domain;


	/**
	 * Addressbook
	 *
	 * @param entries: list of AddressbookEntry
	 * @constructor
	 */
	Domain.Addressbook = function (entries) {
		this.implementInterface = 'AddressbookInterface';
		this.entries = entries;
	};

	Domain.Addressbook.prototype = {
		load: function () {
			return this.entries;
		},

		getEntries: function () {
			return this.entries;
		},

		count: function () {
			return this.entries.length;
		}
	};

	Domain.Addressbook.dataSourceTypes = { file: 0, webservice: 1};

})();