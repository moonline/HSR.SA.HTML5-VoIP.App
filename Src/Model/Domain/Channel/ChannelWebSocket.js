(function () {
	'use strict';

	var Domain = App.Model.Domain;
	var Channel = Domain.Channel;
	var Service = App.Core.Service;


	Channel.ChannelWebSocket = function () {
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

	Channel.ChannelWebSocket.prototype.notify = function (message) {
			this.listeners.forEach(function (listener) {
				if (typeof(listener.notify) === 'function') {
					listener.notify(message);
				}
			},this);
		};

		/**
		 * open the channel connection
		 */
		Channel.ChannelWebSocket.prototype.start = function () {
			this.channel = new WebSocket(this.configuration.server);

			this.channel.onmessage = function(event) {
				this.notify(event.data);
				Service.Log.log(Service.Log.logTypes.Info, 'ChannelWebSockets', "receive: '" + event.data + "'");
			}.bind(this);

			this.channel.onopen = function () {
				Service.Log.log(Service.Log.logTypes.Info, 'ChannelWebSockets', "connected");
				this.state = "connected";
				this.waiters.forEach(function (waiterMessage) {
					this.channel.send(waiterMessage);
				},this)
			}.bind(this);

			this.channel.onclose = function () {
				Service.Log.log(Service.Log.logTypes.Info, 'ChannelWebSockets', "connection closed");
			}.bind(this);
		};

		/**
		 * close the channel connection and remove all listeners
		 */
		Channel.ChannelWebSocket.prototype.stop = function () {
			this.channel.close();
			this.listeners = [];
		};

		/**
		 * send a message
		 *
		 * @param message: plain text message
		 */
		Channel.ChannelWebSocket.prototype.send = function (message) {
			if (this.state !== "connected") {
				this.waiters.push(message);
			} else {
				this.channel.send(message);
				Service.Log.log(Service.Log.logTypes.Info, 'ChannelWebSockets', "send: '" + message + "'");
			}
		};

		/**
		 * add a listener to receive messages
		 *
		 * @param listener: an object implementing a notify(message) method
		 */
		Channel.ChannelWebSocket.prototype.addReceiveListener = function (listener) {
			if (Service.ArrayService.listContains(this.listeners, listener) === false) {
				this.listeners.push(listener);
			}
		};

		/**
		 * remove a listener from the list
		 *
		 * @param listener
		 */
		Channel.ChannelWebSocket.prototype.removeReceiveListener = function (listener) {
			var position = this.listeners.indexOf(listener);
			if (position !== -1) {
				this.listeners[position] = null;
			}
		};

})();