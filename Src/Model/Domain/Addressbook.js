define(function () {
	'use strict';

	// Todo: is this class used jet outside tests? -> otherwise: remove

	var Addressbook = {};
	Addressbook.dataSourceTypes = { file: 0, directory: 1, online: 2 };

	return Addressbook;
});