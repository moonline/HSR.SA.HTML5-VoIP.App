define(["QUnit","Model/Domain/AccountManager", "Model/Domain/Account", "Model/Domain/User"], function(QUnit, AccountManager, Account, User) {
	'use strict';


	QUnit.module("Accountmanager Tests");
	QUnit.test("Accountmanager Test Test", function () {
		var accountManager = new AccountManager();
		accountManager.users = {};
		accountManager.store();
		accountManager.load();

		QUnit.strictEqual(Object.keys(accountManager.users).length,0, 'Accountmanager reset test');

		var user1 = new User('johanna', 'ladidum', 'Johanna', 'Meier', 'jo@gmx.net', null);
		user1.setAccount(new Account('ChannelXHR', { "nick": user1.username }));
		user1.setAccount(new Account('ChannelWebSocket',{ "login": '12345678', "passwort": 'drfm34sls', "server": 'sipcall.ch' }));

		accountManager.add(user1);

		console.log(accountManager.users['johanna'].accounts);
		QUnit.strictEqual(accountManager.users['johanna'].username, 'johanna', 'test restored username');
		QUnit.strictEqual(accountManager.users['johanna'].accounts['ChannelWebSocket'].fields['login'], '12345678', 'test restored account detail');
	});

});