(function () {
	'use strict';

	var Domain = App.Model.Domain;
	var Channel = Domain.Channel;
	var Configuration = App.Configuration;


	module("Channel Tests");


	var bruce = new Domain.User('bruce', '', 'Bruce', 'Willis', null, null);
	bruce.setAccount(new Domain.Account('ChannelXHR',{ "nick": 'bruce' }));

	App.Configuration.user = bruce;
	asyncTest("ChannelXHR echo test", function () {
		var channel = new Channel.ChannelXHR("http://colvarim.ch/service/messageQueue/messageQueue.php");
		channel.nick = 'testUser';
		channel.start();

		// caller
		channel.type = Domain.Channel.types.caller;
		var message = "Hello XHR-World.";
		channel.send({ message: message, receiver: 'testUser'});

		// callee
		var listener = {
			notify: function (receiveMessage) {
				//console.log(receiveMessage);
				strictEqual(receiveMessage, message, "message and receiveMessage comparison");
				start();
			}
		};
		channel.addReceiveListener(listener);
		channel.type = Domain.Channel.types.callee;

		setTimeout(function () {
			channel.stop();
		}, 3000);
	});

})();