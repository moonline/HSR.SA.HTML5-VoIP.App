define(["Configuration", "Model/Domain/Channel/ChannelXHR", "Model/Domain/EventManager", "Model/Domain/Connection", "Core/Loader/ChannelLoader", "Model/Interfaces/ChannelInterface", "Model/Domain/Channel", "Core/Service/Log"], function(Configuration, ChannelXHR, EventManager, Connection, ChannelLoader, ChannelInterface, Channel, Log) {
	'use strict';
	
	var PhoneService = function($rootScope, $location, accountService) {
		this.$rootScope = $rootScope;
		this.$location = $location;
		this.accountService = accountService;
		this.receiveCandidates = [];
		this.activeChannels = {};
	};
	
	PhoneService.prototype.stopAndRemoveChannels = function() {
		Object.keys(this.activeChannels).forEach(function(channelServiceId) {
			this.activeChannels[channelServiceId].stop();
		}, this);
		this.activeChannels = {};
	};
	
	PhoneService.prototype.startChannels = function() {
		Configuration.channels.forEach(function(channelConfig) {
			if(this.accountService.currentUser.accounts[channelConfig.serviceId]) {
				var channel = new ChannelLoader[channelConfig.type](this.accountService.currentUser.accounts[channelConfig.serviceId]);
				ChannelInterface.assertImplementedBy(channel);
				channel.start();
				this.activeChannels[channelConfig.serviceId] = channel;
				channel.addReceiveListener({
					notify: this.listener.bind(this, channelConfig.serviceId)
				});
			}
		}, this);
	};
	
	PhoneService.prototype.listener = function(serviceId, channelMessage) {
		if(channelMessage) {
			var message = JSON.parse(channelMessage);

			if (message.type === 'offer') {
				if (!this.activeChannels[serviceId].type !== Channel.types.caller && (!this.connection || this.connection.state === Connection.states.off || this.connection.state === Connection.states.stopped)) {
					var accept = confirm(message.sender + ' want\'s to call you. Receive?');
					if(accept) {
						this.callerMessage = message;
						this.$location.url('/phone/accept/' +  serviceId + '/' + message.sender);
						this.$rootScope.$apply();
					}
				}
			} else if (message.type === 'answer' && this.connection.state > Connection.states.off) {
				this.connection.callerReceiveAnswer(message);
			} else if (message.type === 'candidate') {
				this.activeChannels[serviceId].receiveMessage();
				var candidate = new RTCIceCandidate({ sdpMLineIndex:message.label, candidate:message.candidate });
				if(this.connection && this.connection.peerConnection && this.connection.state > Connection.states.off) {
                    Log.log(Log.logTypes.Info,'PhoneService','add candidate');
					this.connection.peerConnection.addIceCandidate(candidate);
				} else {
                    Log.log(Log.logTypes.Info,'PhoneService','toEarlyReceived candidate');
					this.receiveCandidates.push(candidate);
				}
			} else if (message.type === 'bye') {
				this.hangUp(false);
				this.$location.url('/contacts');
				this.$rootScope.$apply();
			} else {
                Log.log(Log.logTypes.Info,'PhoneService','unhandled message');
			}
		}
	};

	/**
	 * call action
	 */
	PhoneService.prototype.call = function(host, channel, remoteVideoFrame, calleeId, userId, callback) {
		host.startLocalMedia(function() {
			this.connection = new Connection(host.localstream, channel, remoteVideoFrame, calleeId, userId, callback, this.receiveCandidates);
			this.connection.callerCreateOffer();
		}.bind(this));
		this.timeOutIfConnectionNotEstablished();
	};

	/**
	 * receive a call
	 */
	PhoneService.prototype.receiveCall = function(host, channel, remoteVideoFrame, userId, callback) {
		host.startLocalMedia(function() {
			this.connection = new Connection(host.localstream, channel, remoteVideoFrame, null, userId, callback, this.receiveCandidates);
			this.connection.calleeCreateAnswer(this.callerMessage);
		}.bind(this));
		this.timeOutIfConnectionNotEstablished();
	};
	
	PhoneService.prototype.hangUp = function(notifyOtherUser) {
		if (this.connection) {
			this.connection.hangUp(notifyOtherUser);
		}
		this.callerMessage = null;
	};

	/**
	 * wait for some seconds, if connection is not etablished, hang up and clean up
	 */
	PhoneService.prototype.timeOutIfConnectionNotEstablished = function() {
		setTimeout(function() {
			if(this.connection && this.connection.state < Connection.states.connected) {
				this.hangUp(true);
				alert('could not etablish connection.');
				this.$location.url('/contacts');
				this.$rootScope.$apply();
			}
		}.bind(this), 1000 * Configuration.connection.connectTimeout);
	};
	
	return PhoneService;
});