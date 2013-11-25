(function () {
	'use strict';

	var Domain = App.Model.Domain;


	module("Accountmanager Tests");
	test("Accountmanager Test Test", function () {
		var accountManager = new Domain.AccountManager();
		accountManager.users = {};
		accountManager.store();
		accountManager.load();

		strictEqual(Object.keys(accountManager.users).length,0, 'Accountmanager reset test');

		var user1 = new Domain.User('johanna', 'ladidum', 'Johanna', 'Meier', 'jo@gmx.net', null);
		user1.setAccount(new Domain.Account('ChannelXHR', { "nick": user1.username }));
		user1.setAccount(new Domain.Account('ChannelWebSocket',{ "login": '12345678', "passwort": 'drfm34sls', "server": 'sipcall.ch' }));

		accountManager.add(user1);

		//accountManager.users = {};
		//accountManager.load();
		console.log(accountManager.users['johanna'].accounts);
		strictEqual(accountManager.users['johanna'].username, 'johanna', 'test restored username');
		strictEqual(accountManager.users['johanna'].accounts['ChannelWebSocket'].fields['login'], '12345678', 'test restored account detail');
	});

})();