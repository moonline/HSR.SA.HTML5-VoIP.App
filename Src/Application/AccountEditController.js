define(["Configuration","Model/Domain/ContactbookManager"],
	function (Configuration, ContactbookManager) {
	'use strict';

	var AccountEditController = function($scope, $location, accountService, requireLogin) {
		if (requireLogin().abort) {
			return;
		}
		
		$scope.accountService = accountService;
		$scope.user = accountService.currentUser;
		$scope.accounts = accountService.currentUser.accounts;
		$scope.channels = Configuration.channels;

	};

	return AccountEditController;
});