define([
	"angular",
	"Configuration",
	"Application/AccountController",
	"Application/ContactController",
	"Application/ContactbookImportController",
	"Application/AccountEditController",
	"Application/Service/PhoneService",
	"Application/PhoneController",
	"Application/Service/requireLoginService",
	"Model/Domain/AccountManager",

	"angular-route",
	"Core/Service/ArrayService",
	"Core/Service/StringService"
	],
	function(
			angular,
			Configuration,
			AccountController,
			ContactController,
			ContactbookImportController,
			AccountEditController,
			PhoneService,
			PhoneController,
			requireLoginService,
			AccountManager
		) {
	'use strict';

	
	var app = angular.module('App', [ 'ngRoute' ]);
	app.config(function($routeProvider) {
		$routeProvider.when('/', {
		    templateUrl: require.toUrl('Resources/Views/accountView.html'),
		    controller: AccountController
		});

		$routeProvider.when('/contacts', {
			templateUrl: 'Resources/Views/contactView.html',
			controller: 'ContactController'
		});

		$routeProvider.when('/import/contactbook', {
			templateUrl: 'Resources/Views/contactbookImportView.html',
			controller: 'ContactbookImportController'
		});
		
		$routeProvider.when('/account', {
			templateUrl: 'Resources/Views/accountEditView.html',
			controller: 'AccountEditController'
		});

		$routeProvider.when('/phone/:operation/:channelId/:userId', {
			templateUrl: 'Resources/Views/phoneView.html',
			controller: 'PhoneController'
		});

		$routeProvider.otherwise({
			redirectTo:'/'
		});
	});


	/* shared resources */
	app.factory('accountService', function($rootScope) {
		var accountService =  {
			accountManager: new AccountManager(),
			contactbookManager: null,
			activeChannels: {}
		};
		accountService.accountManager.load();
		return accountService;
	});
	app.factory('requireLogin', requireLoginService);
	app.factory('phoneService', ['$rootScope', '$location', 'accountService', function($rootScope, $location, accountService) {
		return new PhoneService($rootScope, $location, accountService);
	}]);

	/* controllers */
	app.controller('AccountController', AccountController);
	AccountController.$inject = ['$scope', '$location', 'accountService', 'phoneService'];

	app.controller('ContactController', ContactController);
	ContactController.$inject = ['$scope', '$location', 'accountService', 'requireLogin'];

	app.controller('ContactbookImportController', ContactbookImportController);
	ContactbookImportController.$inject = ['$scope', '$location', 'accountService', 'requireLogin'];
	
	app.controller('AccountEditController', AccountEditController);
	AccountEditController.$inject = ['$scope', '$location', 'accountService', 'requireLogin'];

	app.controller('PhoneController', PhoneController);
	PhoneController.$inject = ['$scope', '$rootScope', '$location', '$routeParams', 'accountService', 'requireLogin', 'phoneService'];

	/* filters */
	app.filter('reverse', function() {
	    return function(array) {
	      return array.slice().reverse();
	    };
	});
	
	return app;
});
