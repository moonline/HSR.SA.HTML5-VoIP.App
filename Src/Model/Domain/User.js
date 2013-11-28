define(function() {
	'use strict';

	var User = function(username, password, firstname, lastname, email, photo) {
		this.username = username;
		this.password = password;
		this.firstname = firstname;
		this.lastname = lastname;
		this.email = email;
		this.photo = photo;
		this.accounts = {};
	};

	User.prototype.setAccount = function(account) {
		this.accounts[account.type] = account;
	};

	return User;
});