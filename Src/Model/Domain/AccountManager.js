'use strict';

(function () {
	var Domain = App.Model.Domain;
	var Storage = window.localStorage;

	Domain.AccountManager = function() {
		this.users = new Object();
	};

	Domain.AccountManager.prototype.load = function() {
		var users = JSON.parse(Storage.getItem('accounts'));
		if(users) {
			this.users = users;
		}
	};

	/**
	 * add a new user
	 *
	 * @param user
	 * @returns {boolean} true if adding was successful
	 */
	Domain.AccountManager.prototype.add = function(user) {
		if(this.findByUsername(user.username) === null) {
			this.users[user.username] = user;
			this.store();
			return true;
		} else {
			return false;
		}
	};

	Domain.AccountManager.prototype.store = function() {
		Storage.setItem('accounts',JSON.stringify(this.users));
	};

	/**
	 * find a user by it's username
	 *
	 * @param username
	 * @returns {null}
	 */
	Domain.AccountManager.prototype.findByUsername = function(username) {
		if(this.users[username]) {
			return this.users[username];
		} else {
			return null;
		}
	};

})();