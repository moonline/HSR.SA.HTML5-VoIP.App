'use strict';

(function() {
	var Domain = App.Model.Domain;


	// Todo: remove constructor attribute except name (a contact without name makes no sense!).
	Domain.AddressbookEntry = function(sip, name, photo) {
		if(sip) { this.sip = sip; }
		if(name) { this.name = name; }
		if(photo) { this.photo = photo; }
	};

})();