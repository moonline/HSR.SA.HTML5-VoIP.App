'use strict';


define(["Configuration", "Application/AccountController", "jQuery"],
	function(Configuration, AccountController, jQuery) {

	jQuery('#accountView').ready(function(){
		var accountController = new AccountController();
		accountController.addDummyUser();
		//accountController.selectUser();
	});

});