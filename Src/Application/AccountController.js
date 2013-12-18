define(["Configuration", "Model/Domain/Account", "Model/Domain/User", "Model/Domain/ContactbookManager","SampleData/users/demoUsers"],
	function (Configuration, Account, User, ContactbookManager, demoUsers) {
	'use strict';

    var AccountController = function($scope, $location, accountService, phoneService) {
    	this.accountService = accountService;
    	
		$scope.accountManager = accountService.accountManager;
		$scope.accountManager.load();

		$scope.addUser = function() {
			var user = new User(
				prompt('Please insert your username'),
				prompt('Please insert a password (empty for none)'),
				prompt('Please insert your firstname'),
				prompt('Please insert your lastname'),
				null,
				null
			);
			while(accountService.accountManager.findByUsername(user.username) !== null) {
				user.username = prompt('username is already used. Please take an other');
			}
			if(user.username) {
				accountService.accountManager.add(user);
			}
		};

		$scope.deleteUser = function(user) {
			if (confirm("rly?")) {
				accountService.accountManager.remove(user);
			}
		};

		$scope.resetToDummies = function() {
			accountService.accountManager.users = {};
			this.addDummyUsers();
		}.bind(this);

		$scope.login = function(user) {
			if (user.password) {
				var passwordtext = 'Password for ' + user.username + '? (Warning: not concealed)';
				do {
					var password = prompt(passwordtext);
					if (!password) {
							return;
					}
					passwordtext = 'Wrong password. ' + passwordtext;
				} while (password !== user.password);
			}

			accountService.currentUser = user;

			phoneService.stopAndRemoveChannels();
			phoneService.startChannels();

			accountService.contactbookManager = new ContactbookManager(accountService.currentUser);
			if (sessionStorage.loginPath) {
				$location.url(sessionStorage.loginPath);
			} else {
				$location.url('/contacts');
			}
		};
    };
    
    AccountController.prototype.addDummyUsers = function() {
		demoUsers.forEach(function(demoUser){
			this.accountService.accountManager.add(demoUser);
		}, this);
	};

    return AccountController;
});
