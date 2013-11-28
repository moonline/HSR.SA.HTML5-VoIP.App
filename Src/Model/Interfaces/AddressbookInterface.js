define(["Core/Framework/Interface"],function(Interface) {
	'use strict';


	var AddressbookInterface = new Interface(
		'AddressbookInterface',
		['getEntries', 'count', 'load']
	);

	return AddressbookInterface;
});