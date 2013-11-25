(function () {
	'use strict';

	var Controller = App.Controller;
	var Domain = App.Model.Domain;
	var Configuration = App.Configuration;

	Controller.AccountController = function() {
		this.accountManager = new Domain.AccountManager();
		this.accountManager.load();
	};

	Controller.AccountController.prototype.addDummyUser = function() {
		var bruce = new Domain.User('bruce', '', 'Bruce', 'Willis', null, null);
		bruce.setAccount(new Domain.Account('ChannelXHR',{ "nick": 'bruce' }));
		this.accountManager.add(bruce);

		var james = new Domain.User('bond', '', 'James', 'Bond', null, null);
		james.setAccount(new Domain.Account('ChannelXHR',{ "nick": 'bond' }));
		this.accountManager.add(james);

		var michelle = new Domain.User('michelle', '', 'Michelle', 'Monoghan', null, null);
		michelle.setAccount(new Domain.Account('ChannelXHR',{ "nick": 'michelle' }));
		this.accountManager.add(michelle);

		var hilary = new Domain.User('hilary', '', 'Hilary', 'Swank', null, null);
		hilary.setAccount(new Domain.Account('ChannelXHR',{ "nick": 'hilary' }));
		this.accountManager.add(hilary);
	};

	Controller.AccountController.prototype.selectUser = function() {
		var availableUsers = '\n';
		this.accountManager.getUsers().forEach(function(user) {
			availableUsers += '• '+user.username+'\n';
		},this);

		var username;
		while(!username && this.accountManager.findByUsername(username) === null) {
			username = prompt('please insert the user account you want to select.\nAvailable users:'+availableUsers);
		}
		Configuration.user = this.accountManager.findByUsername(username);
	};

	Controller.AccountController.prototype.addUser = function() {
		var user = new Domain.User(
			prompt('Please insert your username'),
			prompt('Please insert a password (empty for none)'),
			prompt('Please insert your firstname'),
			prompt('Please insert your lastname'),
			null,
			null
		);
		while(this.accountManager.findByUsername(user.username) !== null) {
			user.username = prompt('username is already used. Please take an other');
		}
		if(user.username) {
			this.accountManager.add(user);
		}
	};

})();