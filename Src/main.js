'use strict';

(function() {
	var Controller = App.Controller;
	var Configuration = App.Configuration;


	window.onload = function() {
		var accountController = new Controller.AccountController();
		accountController.addDummyUser();
		accountController.selectUser();

		Configuration.nick = prompt('Please insert your nick name');
		document.getElementById('user').textContent = Configuration.nick;

		var addressbookController = new Controller.AddressbookController();
		addressbookController.initialize();
		addressbookController.list();

		var phoneController = new Controller.PhoneController();
	};

})();