'use strict';

(function() {
	var Controller = App.Controller;
	var Configuration = App.Configuration;


	window.onload = function() {
		var accountController = new Controller.AccountController();
		accountController.addDummyUser();
		accountController.selectUser();

		document.getElementById('user').textContent = Configuration.user.firstname+' '+Configuration.user.lastname+' ('+Configuration.user.username+')';

		var addressbookController = new Controller.AddressbookController();
		addressbookController.initialize();
		addressbookController.list();

		var phoneController = new Controller.PhoneController();
	};

})();