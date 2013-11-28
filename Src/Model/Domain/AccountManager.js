define(function() {
	'use strict';

	var Storage = window.localStorage;


	var AccountManager = function() {
		this.users = new Object();
	};

	AccountManager.prototype.load = function() {
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
	AccountManager.prototype.add = function(user) {
		if(this.findByUsername(user.username) === null) {
			this.users[user.username] = user;
			this.store();
			return true;
		} else {
			return false;
		}
	};

	AccountManager.prototype.store = function() {
		Storage.setItem('accounts',JSON.stringify(this.users));
	};

	/**
	 * find a user by it's username
	 *
	 * @param username
	 * @returns {null}
	 */
	AccountManager.prototype.findByUsername = function(username) {
		if(this.users[username]) {
			return this.users[username];
		} else {
			return null;
		}
	};

	AccountManager.prototype.getUsers = function() {
		var users = new Array();
		Object.keys(this.users).forEach(function(key){
			users.push(this.users[key]);
		},this);
		return users;
	};

	return AccountManager;
});