/**
 * Created by tobias on 10/16/13.
 */
var Domain = App.Model.Domain;
var Channel = Domain.Channel;

asyncTest("ChannelXHR echo test", function() {
	var channel = new Channel.ChannelXHR("http://colvarim.ch/service/messageQueue/messageQueue.php");
	channel.start();

	// caller
	channel.type = 'caller';
	var message = "Hello XHR-World.";
	channel.send(message);

	// callee
	var listener = {
		notify: function(receiveMessage) {
			//console.log(receiveMessage);
			strictEqual(receiveMessage, message, "message and receiveMessage comparison");
			start();
		}
	};
	channel.addReceiveListener(listener);
	channel.type = 'callee';

	setTimeout(function() { channel.stop(); }, 3000);
});