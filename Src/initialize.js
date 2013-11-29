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
			angular: {
				exports: "angular"
			}
		}
	});


	define(["angular", "Application/AccountController"], function(angular, AccountController) {
		'use strict';
		
		var app = angular.module('App', []);
		app.controller('AccountController', AccountController);
		angular.bootstrap(document, ['App']);
	});

})();



