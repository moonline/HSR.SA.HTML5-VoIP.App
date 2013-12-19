define(function () {
	'use strict';

	var AddressbookEntry = function(sip, name, photo) {
		if(sip) { this.sip = sip; }
		if(name) { this.name = name; }
		if(photo) { this.photo = photo; }
	};

	return AddressbookEntry;
});