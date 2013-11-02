'use strict';

(function () {
	var Domain = App.Model.Domain;
	var Service = App.Core.Service;
	var Channel = Domain.Channel;


	/**
	 * ChannelHXR
	 *
	 * @param webServer: e.q. http://colvarim.ch/service/messageQueue/messageQueue.php
	 * @constructor
	 */
	Channel.ChannelXHR = function (webServer) {
		// Todo fix problem with 'var Configuration = App.Configuration;
		this.nick = App.Configuration.nick;

		this.listeners = [];
		this.state = Domain.Channel.states.waiting;
		this.type = Domain.Channel.types.callee;
		this.configuration = {
			server: webServer
		};
	};

	Channel.ChannelXHR.prototype = {
		/**
		 * receive
		 */
		receive: function (receiver) {
			var response = '';

			$.ajax({ type: "GET",
				url: this.configuration.server + '?getMessage&receiverType=' + this.nick,
				async: false,
				success: function (text) {
					response = text;
				}
			});
			return response;
		},
		/**
		 * fetch message from server
		 */
		receiveMessage: function () {
			var response = this.receive();
			if (response != "0") {
				Service.Log.log(Service.Log.logTypes.Info, 'ChannelXHR', 'receive message: ' + response);
				this.notify(response);
			}
		},

		/**
		 * call receiveMessage from time to time
		 */
		receiveLoop: function () {
			if (this.state === Domain.Channel.states.connected || this.state === Domain.Channel.states.waiting) {
				this.receiveMessage();
				setTimeout(function () {
					this.receiveLoop();
				}.bind(this), 1000);
			} else {
				Service.Log.log(Service.Log.logTypes.Info, 'ChannelXHR', 'stop receiving loop');
			}
		},

		/**
		 * notify listeners
		 *
		 * @param message: the received message
		 */
		notify: function (message) {
			this.listeners.forEach(function (listener) {
				if (typeof(listener.notify) === 'function') {
					listener.notify(message);
				}
			});
		},

		/**
		 * empty channel
		 */
		emptyChannel: function () {
			var channelEmpty = false;
			while (!channelEmpty) {
				var response = this.receive();
				if (response == "0") {
					channelEmpty = true;
				}
			}
		},

		/**
		 * open the channel connection
		 */
		start: function () {
			this.state = Domain.Channel.states.connected;
			Service.Log.log(Service.Log.logTypes.Info, 'ChannelXHR', 'start receiving loop');
			this.emptyChannel();
			this.receiveLoop();
		},

		/**
		 * close the channel connection and remove all listeners
		 */
		stop: function () {
			this.state = Domain.Channel.states.disconnected;
			this.listeners = [];
		},

		/**
		 * send a message
		 *
		 * @param message: a message like { "receiver": "frank", "message": "theMessage" }
		 */
		send: function (message) {
			Service.Log.log(Service.Log.logTypes.Info, 'ChannelXHR', 'send message: ' + message.message + ' to ' + message.receiver);
			$.post(this.configuration.server + "?setMessage&receiverType=" + message.receiver, { message: message.message });
		},

		/**
		 * add a listener to receive messages
		 *
		 * @param listener: an object implementing a notify(message) method
		 */
		addReceiveListener: function (listener) {
			if (Service.ArrayService.listContains(this.listeners, listener) === false) {
				this.listeners.push(listener);
			}
		},

		/**
		 * remove a listener from the list
		 *
		 * @param listener
		 */
		removeReceiveListener: function (listener) {
			var position = this.listeners.indexOf(listener);
			if (position !== -1) {
				this.listeners[position] = null;
			}
		}
	};

})();