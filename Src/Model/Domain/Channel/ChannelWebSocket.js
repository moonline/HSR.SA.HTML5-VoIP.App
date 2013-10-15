/**
 * Created by tobias on 10/12/13.
 */
var Domain = App.Model.Domain;
var Service = App.Model.Service;
var Channel = Domain.Channel;
var Interfaces = App.Model.Interfaces;


Channel.ChannelWebSocket = function() {
	var self = this;
	var channel;
	var listeners = [];
	var state;
	var waiters = []

	this.prototype = new Interfaces.ChannelInterface();
	this.requiredFields = [ 'sip', 'name' ];
	this.configuration = {
		server: ''
	};

	var notify = function(message) {
		listeners.forEach(function(listener) {
			if(typeof(listener.notify) === 'function') {
				listener.notify(message);
			}
		});
	}

	/**
	 * open the channel connection
	 */
	this.start = function() {
		channel = new WebSocket(self.configuration.server);
		channel.onmessage = function(event) { notify(event.data); console.log("receive: '"+event.data+"'"); };
		channel.onopen = function() {
			console.log("connected");
			state = "connected";
			waiters.forEach(function(waiterMessage) {
				channel.send(waiterMessage);
			})
		}
		channel.onclose = function() { console.log("connection closed"); }
	}

	/**
	 * close the channel connection and remove all listeners
	 */
	this.stop = function() {
		channel.close();
		listeners = [];
	}

	/**
	 * send a message
	 *
	 * @param message: plain text message
	 */
	this.send = function(message) {
		if(state !== "connected") {
			waiters.push(message);
		} else {
			channel.send(message);
			console.log("send: '"+message+"'");
		}
	}

	/**
	 * add a listener to receive messages
	 *
	 * @param listener: an object implementing a notify(message) method
	 */
	this.addReceiveListener = function(listener) {
		if (Service.ArrayService.listContains(listeners, listener) === false) {
			listeners.push(listener);
		}
	}

	/**
	 * remove a listener from the list
	 *
	 * @param listener
	 */
	this.removeReceiveListener = function(listener) {
		var position = listeners.indexOf(listener);
		if(position !== -1) {
			listeners[position] = null;
		}
	}
}