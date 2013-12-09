define(["Core/Service/Log", "Core/Service/ArrayService"], function(Log, ArrayService) {
	'use strict';


	var ChannelWebSocket = function () {
		this.implementInterface = 'ChannelInterface';
		this.channel;
		this.listeners = [];
		this.state;
		this.waiters = [];

		this.requiredFields = [ 'sip', 'name' ];
		this.configuration = {
			server: ''
		};
	};


	ChannelWebSocket.prototype.notify = function (message) {
		this.listeners.forEach(function (listener) {
			if (typeof(listener.notify) === 'function') {
				listener.notify(message);
			}
		},this);
	};


	ChannelWebSocket.prototype.start = function () {
		this.channel = new WebSocket(this.configuration.server);

		this.channel.onmessage = function(event) {
			this.notify(event.data);
			Log.log(Log.logTypes.Info, 'ChannelWebSockets', "receive: '" + event.data + "'");
		}.bind(this);

		this.channel.onopen = function () {
			Log.log(Log.logTypes.Info, 'ChannelWebSockets', "connected");
			this.state = "connected";
			this.waiters.forEach(function (waiterMessage) {
				this.channel.send(waiterMessage);
			},this);
		}.bind(this);

		this.channel.onclose = function () {
			Log.log(Log.logTypes.Info, 'ChannelWebSockets', "connection closed");
		}.bind(this);
	};


	/**
	 * close the channel connection and remove all listeners
	 */
	ChannelWebSocket.prototype.stop = function () {
		this.channel.close();
		this.listeners = [];
	};


	/**
	 * @param message plain text message
	 */
	ChannelWebSocket.prototype.send = function (message) {
		if (this.state !== "connected") {
			this.waiters.push(message);
		} else {
			this.channel.send(message);
			Log.log(Log.logTypes.Info, 'ChannelWebSockets', "send: '" + message + "'");
		}
	};


	/**
	 * @param listener an object implementing a notify(message) method
	 */
	ChannelWebSocket.prototype.addReceiveListener = function (listener) {
		if (ArrayService.listContains(this.listeners, listener) === false) {
			this.listeners.push(listener);
		}
	};


	ChannelWebSocket.prototype.removeReceiveListener = function (listener) {
		var position = this.listeners.indexOf(listener);
		if (position !== -1) {
			this.listeners[position] = null;
		}
	};


	return ChannelWebSocket;
});