define(["QUnit", "Configuration", "Model/Domain/Channel/ChannelXHR", "Model/Domain/User","Model/Domain/Account","Model/Domain/Channel" ], function(QUnit, Configuration, ChannelXHR, User, Account, Channel) {
	'use strict';


	QUnit.module("Channel Tests");

	var bruce = new User('bruce', '', 'Bruce', 'Willis', null, null);
	bruce.setAccount(new Account('XHRmessenger',{ "userId": 'bruce' }));

	QUnit.asyncTest("ChannelXHR echo test", function () {
		var channel = new ChannelXHR(bruce.accounts.XHRmessenger);
		channel.nick = 'testUser';
		channel.start();

		// caller
		channel.type = Channel.types.caller;
		var message = "Hello XHR-World.";
		channel.send({ message: message, receiver: 'testUser'});

		// callee
		var listener = {
			notify: function (receiveMessage) {
				QUnit.strictEqual(receiveMessage, message, "message and receiveMessage comparison");
				QUnit.start();
			}
		};
		channel.addReceiveListener(listener);
		channel.type = Channel.types.callee;

		setTimeout(function () {
			channel.stop();
		}, 3000);
	});

});