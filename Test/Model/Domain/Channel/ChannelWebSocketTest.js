'use strict';

(function () {
	var Domain = App.Model.Domain;
	var Channel = Domain.Channel;


	module("Channel Tests");
	asyncTest("ChannelWebSocket echo test", function () {
		var channel = new Channel.ChannelWebSocket();
		channel.configuration.server = "ws://echo.websocket.org";

		var message = "Websocket message echo test";

		channel.start();

		var listener = {
			notify: function (receiveMessage) {
				console.log(receiveMessage);
				strictEqual(message, receiveMessage, "message and receiveMessage comparison");
				start();
			}
		};

		channel.addReceiveListener(listener);
		channel.send(message);
	});

})();