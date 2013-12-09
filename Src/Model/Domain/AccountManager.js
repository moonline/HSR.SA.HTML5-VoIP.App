define(["Configuration"], function(Configuration) {
	'use strict';

	var Storage = window.localStorage;


	var AccountManager = function() {
		this.users = {};
		this.accountsStorageKey = Configuration.storagePrefix+'accounts';
	};


	AccountManager.prototype.load = function() {
		var users = JSON.parse(Storage.getItem(this.accountsStorageKey));
		if(users) {
			this.users = users;
		}
	};


	/**
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


	/**
	 * @param user
	 */
	AccountManager.prototype.remove = function(user) {
		delete this.users[user.username];
		this.store();
	};

	AccountManager.prototype.store = function() {
		console.log(this.users);
		Storage.setItem(this.accountsStorageKey,JSON.stringify(this.users));
	};


	/**
	 * @param username
	 * @returns {null} if no user was found
	 */
	AccountManager.prototype.findByUsername = function(username) {
		if(this.users[username]) {
			return this.users[username];
		} else {
			return null;
		}
	};


	AccountManager.prototype.getUsers = function() {
		var users = [];
		Object.keys(this.users).forEach(function(key){
			users.push(this.users[key]);
		},this);
		return users;
	};


	return AccountManager;
});
