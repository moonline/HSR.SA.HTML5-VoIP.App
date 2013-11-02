'use strict';

(function() {
	var Domain = App.Model.Domain;


	Domain.AddressbookEntry = function(sip, name, photo) {
		if(sip) { this.sip = sip; }
		if(name) { this.name = name; }
		if(photo) { this.photo = photo; }
	};

})();