define([
		"Configuration",
		"Model/Domain/AccountManager",
		"Model/Domain/User",
		"Model/Domain/Account",
		"Core/Framework/View"
	], function(Configuration, AccountManager, User, Account, View) {
	'use strict';

	var AccountController = function() {
		this.accountManager = new AccountManager();
		this.accountManager.load();

		this.view = new View(document.getElementById('userList'),{
			users: function() { return this.accountManager.getUsers(); }.bind(this)
		});
		this.view.render();

		document.getElementById('addUser').onclick = function() {
			this.addUser();
		}.bind(this);
	};

	AccountController.prototype.addUser = function() {
		var user = new User(
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
		this.view.render();
	};

	AccountController.prototype.addDummyUser = function() {
		var bruce = new User('bruce', '', 'Bruce', 'Willis', null, null);
		bruce.setAccount(new Account('ChannelXHR',{ "nick": 'bruce' }));
		this.accountManager.add(bruce);

		var james = new User('bond', '', 'James', 'Bond', null, null);
		james.setAccount(new Account('ChannelXHR',{ "nick": 'bond' }));
		this.accountManager.add(james);

		var michelle = new User('michelle', '', 'Michelle', 'Monoghan', null, null);
		michelle.setAccount(new Account('ChannelXHR',{ "nick": 'michelle' }));
		this.accountManager.add(michelle);

		var hilary = new User('hilary', '', 'Hilary', 'Swank', null, null);
		hilary.setAccount(new Account('ChannelXHR',{ "nick": 'hilary' }));
		this.accountManager.add(hilary);

		this.view.render();
	};

	AccountController.prototype.selectUser = function() {
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

	return AccountController;
});


