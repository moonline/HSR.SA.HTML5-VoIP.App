'use strict';

(function () {
	var Domain = App.Model.Domain;

	Domain.User = function(username, password, firstname, lastname, email, photo) {
		this.username = username;
		this.password = password;
		this.firstname = firstname;
		this.lastname = lastname;
		this.email = email;
		this.photo = photo;
		this.accounts = {};
	};

	Domain.User.prototype.setAccount = function(account) {
		this.accounts[account.type] = account;
	};

})();