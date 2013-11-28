(function() {
	'use strict';

	require.config({
		baseUrl: ".",
		paths: {
			"Configuration": "../Configuration/appConfiguration",
			"Handlebars": "Core/Lib/Handlebars/handlebars",
			"jQuery": "Core/Lib/JQuery/jQuery.2.0.3"
		},
		shim: {
			Handlebars: {
				exports: "Handlebars"
			}
		},
		jQuery: {
			exports: "jQuery"
		}
	});

	define(["Configuration", "Application/AccountController", "jQuery"],
		function(Configuration, AccountController, jQuery) {

			require("Core/Service/StringService");

			jQuery('#accountView').ready(function(){
				var accountController = new AccountController();
				accountController.addDummyUser();
				//accountController.selectUser();
			});

		}
	);
})();



