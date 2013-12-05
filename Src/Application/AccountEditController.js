define(["Configuration"],
	function (Configuration) {
	'use strict';

	var AccountEditController = function($scope, $location, accountService, requireLogin) {
		if (requireLogin().abort) {
			return;
		}
		
		$scope.accountService = accountService;
		$scope.user = accountService.currentUser;
		$scope.accounts = accountService.currentUser.accounts;
		$scope.channels = Configuration.channels;

		$scope.update = function() {
			accountService.accountManager.store();
		}

	};

	return AccountEditController;
});