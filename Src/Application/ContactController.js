define(["Configuration","Model/Domain/ContactbookManager"],
	function (Configuration, ContactbookManager) {
	'use strict';

	var ContactbookController = function($scope, $location, accountService, requireLogin) {
		if (requireLogin().abort) {
			return;
		}
		
		$scope.accountService = accountService;
		$scope.currentUser = accountService.currentUser;
		$scope.accounts = accountService.currentUser.accounts;
		$scope.channels = Configuration.channels;

		if(!accountService.contactbookManager) {
			accountService.contactbookManager = new ContactbookManager(accountService.currentUser);
		}
		accountService.contactbookManager.refreshFromStorage();

		$scope.contactbooks = accountService.contactbookManager.contactbooks;
		$scope.contactbooks.forEach(function(contactbook){
			contactbook.data.forEach(function(entry){
				entry.channelAccounts = [];

				Configuration.channels.forEach(function(channel){
					if(entry[channel.userIdField]) {
						entry.channelAccounts.push({
							channel: channel,
							userId: entry[channel.userIdField]
						});
					}
				});
			});
		});

		if(accountService.contactbookManager.contactbooks.length > 0) {
			$scope.currentContactbook = accountService.contactbookManager.contactbooks[0];
		}


		$scope.open = function(contactbook) {
			$scope.currentContactbook = contactbook;
		};

		$scope.call = function(service, userId) {
			$location.url('/call/'+service.serviceId+'/'+userId);
		}
	};

	return ContactbookController;
});