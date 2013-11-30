define([ "angular", "Application/AccountController", "angular-route" ], function(angular, AccountController) {
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
	});
	app.controller('AccountController', AccountController);
	
	// TODO temporary
	function LoginController($scope, $routeParams) {
		$scope.user = $routeParams.user;
	}
	
	return app;
});
