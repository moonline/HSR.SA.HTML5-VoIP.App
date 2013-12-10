define(["Configuration", "Model/Domain/Channel/ChannelXHR", "Model/Domain/EventManager", "Model/Domain/Connection", "Core/Loader/ChannelLoader", "Model/Interfaces/ChannelInterface", "Model/Domain/Channel"], function(Configuration, ChannelXHR, EventManager, Connection, ChannelLoader, ChannelInterface, Channel) {
	'use strict';
	
	var PhoneService = function() {
		this.receiveCandidates = [];
		this.activeChannels = {};
	};
	
	PhoneService.prototype.stopAndRemoveChannels = function(accountService) {
		Object.keys(accountService.activeChannels).forEach(function(channelServiceId) {
			accountService.activeChannels[channelServiceId].stop();
		});
		accountService.activeChannels = {};
	};
	
	PhoneService.prototype.startChannels = function($rootScope, accountService) {
		Configuration.channels.forEach(function(channelConfig) {
			if(accountService.currentUser.accounts[channelConfig.serviceId]) {
				var channel = new ChannelLoader[channelConfig.type](accountService.currentUser.accounts[channelConfig.serviceId]);
				ChannelInterface.assertImplementedBy(channel);
				channel.start();
				
				channel.addReceiveListener({
					notify: this.listener.bind(this, $rootScope, channelConfig.serviceId)
				});
				this.activeChannels[channelConfig.serviceId] = channel;
			}
		}, this);
	};
	
	PhoneService.prototype.listener = function(serviceId, $rootScope, channelMessage) {
		if(channelMessage) {
			var message = JSON.parse(channelMessage);

			if (message.type === 'offer') {
				if (!this.channel.type !== Domain.Channel.types.caller && (!this.connection || this.connection.state === Domain.Connection.states.off || this.connection.state === Domain.Connection.states.stopped)) {
					var accept = confirm(message.sender + ' want\'s to call you. Receive?');
					if(accept) {
						$location.url('/phone/accept/' +  serviceId + '/' + message.sender);
						$rootScope.apply();
					}
				}
			} else if (message.type === 'answer' && self.connection.state > Domain.Connection.states.off) {
				this.connection.callerReceiveAnswer(message);
			} else if (message.type === 'candidate') {
				this.channel.receiveMessage();
				var candidate = new RTCIceCandidate({ sdpMLineIndex:message.label, candidate:message.candidate });
				if(this.connection && this.connection.peerConnection && this.connection.state > Domain.Connection.states.off) {
                    Log.log(Log.logTypes.Info,'PhoneService','add candidate');
					this.connection.peerConnection.addIceCandidate(candidate);
				} else {
                    Log.log(Log.logTypes.Info,'PhoneService','toEarlyReceived candidate');
					this.receiveCandidates.push(candidate);
				}
			} else if (message.type === 'bye') {
				if(self.connection) { self.connection.hangUp(false); }
				self.hangUp();
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
		this.timeOutIfConnectionNotEtablished();
	};

	/**
	 * receive a call
	 */
	PhoneService.prototype.receiveCall = function(host, channel, remoteVideoFrame, userId, callback) {
		host.startLocalMedia(function() {
			this.connection = new Connection(host.localstream, channel, remoteVideoFrame, null, userId, callback, this.receiveCandidates);
			this.connection.calleeCreateAnswer(message);
		}.bind(this));
		this.timeOutIfConnectionNotEtablished();
	};
	
	PhoneService.prototype.hangUp = function() {
		this.connection.hangUp(true);
	};

	/**
	 * wait for some seconds, if connection is not etablished, hang up and clean up
	 */
	PhoneService.prototype.timeOutIfConnectionNotEtablished = function() {
		setTimeout(function() {
			if(this.connection && this.connection.state < Domain.Connection.states.connected) {
				this.hangUp();
				alert('could not etablish connection.');
			}
		}.bind(this), 1000 * Configuration.connection.connectTimeout);
	};
	
	return PhoneService;
});