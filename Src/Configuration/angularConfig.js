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
		// TODO temporary
		$routeProvider.when('/login/:user', {
		    template: 'Hi {{user}}!',
		    controller: LoginController
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
	app.controller('ContactController', ContactController);
	app.controller('ContactbookImportController', ContactbookImportController);
	ContactbookImportController.$inject = ['$scope', 'accountService'];

	// TODO temporary
	function LoginController($scope, $routeParams) {
		$scope.user = $routeParams.user;
	}


	return app;
});
