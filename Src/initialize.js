(function() {
	'use strict';

	require.config({
		baseUrl: ".",
		paths: {
			"Configuration": "../Configuration/appConfiguration",
			"SampleData": "../SampleData",
			"Config/ContactbookConfiguration/Vcard": "../Configuration/vcardConfig",
			"Config/channelConfig": "../Configuration/channelConfig",
			"Handlebars": "Core/Lib/Handlebars/handlebars",
			"jQuery": "Core/Lib/JQuery/jQuery.2.0.3",
			"angular": "Core/Lib/AngularJS/angular",
			"angular-route": "Core/Lib/AngularJS/angular-route"
		},
		shim: {
			Handlebars: {
				exports: "Handlebars"
			},
			angular: {
				exports: "angular"
			},
			jQuery: {
				exports: "jQuery"
			},
			"angular-route": ["angular"]
		}
	});

	require(["angular", "../Src/Configuration/angularConfig"], function(angular, angularModule) {
		'use strict';

		angular.bootstrap(document, [angularModule.name]);
	});

})();
