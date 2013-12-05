define(["Core/Framework/Interface"],function(Interface) {
	'use strict';


	var AddressbookInterface = new Interface(
		'Model/Interfaces/AddressbookInterface',
		['getEntries', 'count', 'load']
	);

	return AddressbookInterface;
});