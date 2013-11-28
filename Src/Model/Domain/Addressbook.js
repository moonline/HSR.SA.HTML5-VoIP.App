define(function () {
	'use strict';

	// Todo: is this class used jet outside tests? -> otherwise: remove

	/**
	 * Addressbook
	 *
	 * @param entries: list of AddressbookEntry
	 * @constructor
	 */
	var Addressbook = function (entries) {
		this.implementInterface = 'AddressbookInterface';
		this.entries = entries;
	};


	Addressbook.prototype.load = function () {
		return this.entries;
	};

	Addressbook.prototype.getEntries = function () {
		return this.entries;
	};

	Addressbook.prototype.count = function () {
		return this.entries.length;
	};

	Addressbook.dataSourceTypes = { file: 0, directory: 1, online: 2 };

	return Addressbook;
});