define([
	"angular",
	"Configuration",
	"Application/AccountController",
	"Application/ContactController",
	"Application/ContactbookImportController",
	"Model/Domain/AccountManager",
	"angular-route" ],
	function(angular, Configuration, AccountController, ContactController, ContactbookImportController, AccountManager) {
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

		$routeProvider.otherwise({
			redirectTo:'/'
		});
	});


	/* shared resources */
	app.factory('accountService', function($rootScope) {
		var accountService =  {
			accountManager: new AccountManager()
		};
		accountService.accountManager.load();
		return accountService;
	});


	/* controllers */
	app.controller('AccountController', AccountController);
	AccountController.$inject = ['$scope', '$location', 'accountService'];

	app.controller('ContactController', ContactController);
	ContactController.$inject = ['$scope', 'accountService'];

	app.controller('ContactbookImportController', ContactbookImportController);
	ContactbookImportController.$inject = ['$scope', 'accountService'];

	return app;
});
