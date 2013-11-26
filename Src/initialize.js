'use strict';

(function() {
	var using = App.Core.Framework.namespace;
	var Controller = using('App.Controller');


	window.onload = function() {
		var accountController = new Controller.AccountController();
		accountController.addDummyUser();
		//accountController.selectUser();
	};

})();