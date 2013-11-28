define(["Configuration", "Core/Service/Log", "Model/Domain/Channel", "jQuery"], function(Configuration, Log, Channel, jQuery) {
	'use strict';


	/**
	 * ChannelHXR
	 *
	 * @param webServer: e.q. http://colvarim.ch/service/messageQueue/messageQueue.php
	 * @constructor
	 */
	var ChannelXHR = function (webServer) {
		// Todo fix problem with 'var Configuration = Configuration;
		this.nick = Configuration.user.accounts['ChannelXHR']['fields']['nick'];

		this.listeners = [];
		this.state = Channel.states.waiting;
		this.type = Channel.types.callee;
		this.configuration = {
			server: webServer
		};
	};


	ChannelXHR.accountFields = [
		{
			"name": "username",
			"type": "text"

		},
		{
			"name": "password",
			"type": "password"
		}
	];


	/**
	 * receive
	 */
	ChannelXHR.prototype.receive = function (receiver) {
		var response = '';

		jQuery.ajax({ type: "GET",
			url: this.configuration.server + '?getMessage&receiverType=' + this.nick,
			async: false,
			success: function (text) {
				response = text;
			}
		});
		return response;
	};

	/**
	 * fetch message from server
	 */
	ChannelXHR.prototype.receiveMessage = function () {
		var response = this.receive();
		if (response != "0") {
			Log.log(Log.logTypes.Info, 'ChannelXHR', 'receive message: ' + response);
			this.notify(response);
		}
	};

	/**
	 * call receiveMessage from time to time
	 */
	ChannelXHR.prototype.receiveLoop = function () {
		if (this.state === Channel.states.connected || this.state === Channel.states.waiting) {
			this.receiveMessage();
			setTimeout(function () {
				this.receiveLoop();
			}.bind(this), 1000);
		} else {
			Log.log(Log.logTypes.Info, 'ChannelXHR', 'stop receiving loop');
		}
	};

	/**
	 * notify listeners
	 *
	 * @param message: the received message
	 */
	ChannelXHR.prototype.notify = function (message) {
		this.listeners.forEach(function (listener) {
			if (typeof(listener.notify) === 'function') {
				listener.notify(message);
			}
		}, this);
	};

	/**
	 * empty channel
	 */
	ChannelXHR.prototype.emptyChannel = function () {
		var channelEmpty = false;
		while (!channelEmpty) {
			var response = this.receive();
			if (response == "0") {
				channelEmpty = true;
			}
		}
	};

	/**
	 * open the channel connection
	 */
	ChannelXHR.prototype.start = function () {
		this.state = Channel.states.connected;
		Log.log(Log.logTypes.Info, 'ChannelXHR', 'start receiving loop');
		this.emptyChannel();
		this.receiveLoop();
	};

	/**
	 * close the channel connection and remove all listeners
	 */
	ChannelXHR.prototype.stop = function () {
		this.state = Channel.states.disconnected;
		this.listeners = [];
	};

	/**
	 * send a message
	 *
	 * @param message: a message like { "receiver": "frank", "message": "theMessage" }
	 */
	ChannelXHR.prototype.send = function (message) {
		Log.log(Log.logTypes.Info, 'ChannelXHR', 'send message: ' + message.message + ' to ' + message.receiver);
		jQuery.post(this.configuration.server + "?setMessage&receiverType=" + message.receiver, { message: message.message });
	};

	/**
	 * add a listener to receive messages if it's not registered jet
	 *
	 * @param listener: an object implementing a notify(message) method
	 */
	ChannelXHR.prototype.addReceiveListener = function (listener) {
		if (this.listeners.contains(listener) === false) {
			this.listeners.push(listener);
			return true;
		} else {
			return false;
		}
	};

	/**
	 * remove a listener from the list
	 *
	 * @param listener
	 */
	ChannelXHR.prototype.removeReceiveListener = function (listener) {
		var position = this.listeners.indexOf(listener);
		if (position !== -1) {
			this.listeners[position] = null;
		}
	};

	return ChannelXHR;
});