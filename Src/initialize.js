(function() {
	'use strict';

	require.config({
		baseUrl: ".",
		paths: {
			"Configuration": "../Configuration/appConfiguration",
			"Handlebars": "Core/Lib/Handlebars/handlebars",
			"jQuery": "Core/Lib/JQuery/jQuery.2.0.3",
			"angular": "Core/Lib/AngularJS/angular"
		},
		shim: {
			Handlebars: {
				exports: "Handlebars"
			},
			jQuery: {
				exports: "jQuery"
			},
			angular: {
				exports: "angular"
			}
		}
	});


	define(["angular", "Application/AccountController"], function(ng, AccountController) {
		'use strict';
	});

})();



