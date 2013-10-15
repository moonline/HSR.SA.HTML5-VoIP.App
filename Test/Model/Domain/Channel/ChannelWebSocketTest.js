/**
 * Created by tobias on 10/12/13.
 */
var Domain = App.Model.Domain;
var Channel = Domain.Channel;

// TODO move QUnit from global to App.Lib.QUnit
asyncTest("ChannelWebSocket echo test", function() {
	var channel = new Channel.ChannelWebSocket();
	channel.configuration.server = "ws://echo.websocket.org";

	var message = "Websocket message echo test";

	channel.start();

	var listener = {
		notify: function(receiveMessage) {
			console.log(receiveMessage);
			strictEqual(message, receiveMessage, "message and receiveMessage comparison");
			start();
		}
	};

	channel.addReceiveListener(listener);
	channel.send(message);
});