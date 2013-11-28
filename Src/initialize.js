'use strict';

(function() {
	var using = App.Core.Framework.namespace;
	var Controller = using('App.Controller');

	var accountController = new Controller.AccountController();
	accountController.addDummyUser();
	//accountController.selectUser();
	
	var app = angular.module('app', []);
	app.controller('AM', function ($scope) {
		$scope.accountManager = accountController.accountManager;
	});

})();