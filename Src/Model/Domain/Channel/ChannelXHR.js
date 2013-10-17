/**
 * Created by tobias on 10/16/13.
 */
var Domain = App.Model.Domain;
var Service = App.Core.Service;
var Channel = Domain.Channel;
var Interfaces = App.Model.Interfaces;


/**
 * ChannelHXR
 *
 * @param webServer: e.q. http://colvarim.ch/service/messageQueue/messageQueue.php
 * @constructor
 */
Channel.ChannelXHR = function(webServer) {
	this.listeners = [];
	this.state = 'waiting';
	this.type = 'callee';
	this.configuration = {
		server: webServer
	};
};

Channel.ChannelXHR.prototype = {
	/**
	 * fetch message from server
	 */
	receiveMessage: function() {
		var response = '';

		$.ajax({ type: "GET",
			url: this.configuration.server+'?getMessage&receiverType='+this.type,
			async: false,
			success : function(text) {
				response = text;
			}
		});
		if(response != "0") {
			Service.Log.log(Service.Log.logTypes.Info, 'ChannelXHR', 'receive message: '+response);
			this.notify(response);
		}
	},

	/**
	 * call receiveMessage from time to time
	 */
	receiveLoop: function() {
		if(this.state === 'connected' || this.state === 'waiting') {
			this.receiveMessage();
			setTimeout(function() { this.receiveLoop(); }.bind(this),1000);
		} else {
			Service.Log.log(Service.Log.logTypes.Info, 'ChannelXHR', 'stop receiving loop');
		}
	},

	/**
	 * notify listeners
	 *
	 * @param message: the received message
	 */
	notify: function(message) {
		this.listeners.forEach(function(listener) {
			if(typeof(listener.notify) === 'function') {
				listener.notify(message);
			}
		});
	},

	/**
	 * open the channel connection
	 */
	start: function() {
		this.state = 'connected';
		Service.Log.log(Service.Log.logTypes.Info, 'ChannelXHR', 'start receiving loop');
		this.receiveLoop();
	},

	/**
	 * close the channel connection and remove all listeners
	 */
	stop: function() {
		this.state = 'disconnected';
		listeners = [];
	},

	/**
	 * send a message
	 *
	 * @param message: plain text message
	 */
	send: function(message) {
		var recType = (this.type === 'callee') ? 'caller' : 'callee';
		Service.Log.log(Service.Log.logTypes.Info, 'ChannelXHR', 'send message: '+message);
		$.post(this.configuration.server+"?setMessage&receiverType="+recType, { message: message });
	},

	/**
	 * add a listener to receive messages
	 *
	 * @param listener: an object implementing a notify(message) method
	 */
	addReceiveListener: function(listener) {
		if (Service.ArrayService.listContains(this.listeners, listener) === false) {
			this.listeners.push(listener);
		}
	},

	/**
	 * remove a listener from the list
	 *
	 * @param listener
	 */
	removeReceiveListener: function(listener) {
		var position = this.listeners.indexOf(listener);
		if(position !== -1) {
			this.listeners[position] = null;
		}
	}
};