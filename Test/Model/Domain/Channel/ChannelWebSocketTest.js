define(["QUnit", "Model/Domain/Channel/ChannelWebSocket" ], function(QUnit, ChannelWebSocket) {
	'use strict';


	QUnit.module("Channel Tests");
	QUnit.asyncTest("ChannelWebSocket echo test", function () {
		var channel = new ChannelWebSocket();
		channel.configuration.server = "ws://echo.websocket.org";

		var message = "Websocket message echo test";

		channel.start();

		var listener = {
			notify: function (receiveMessage) {
				console.log(receiveMessage);
				QUnit.strictEqual(message, receiveMessage, "message and receiveMessage comparison");
				QUnit.start();
			}
		};

		channel.addReceiveListener(listener);
		channel.send(message);
		setTimeout(function() { channel.stop(); }, 1000);
	});

});