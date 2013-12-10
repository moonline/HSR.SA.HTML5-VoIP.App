define(["Configuration", "Model/Domain/Channel/ChannelXHR", "Model/Domain/EventManager", "Model/Domain/Connection", "Core/Loader/ChannelLoader", "Model/Interfaces/ChannelInterface", "Model/Domain/Channel"], function(Configuration, ChannelXHR, EventManager, Connection, ChannelLoader, ChannelInterface, Channel) {
	'use strict';
	
	var PhoneService = function() {
		this.receiveCandidates = new Array();
	};
	
	PhoneService.prototype.startChannels = function(accountService) {
		Configuration.channels.forEach(function(channelConfig) {
			if(accountService.currentUser.accounts[channelConfig.serviceId]) {
				var channel = new ChannelLoader[channelConfig.type](accountService.currentUser.accounts[channelConfig.serviceId]);
				ChannelInterface.assertImplementedBy(channel);
				
				channel.addReceiveListener({
					notify: this.listener.bind(this)
				});
				channel.start();
				accountService.activeChannels[channelConfig.serviceId] = channel;
			}
		}, this);
	};
	
	PhoneService.prototype.stopAndRemoveChannels = function(accountService) {
		Object.keys(accountService.activeChannels).forEach(function(channelServiceId) {
			accountService.activeChannels[channelServiceId].stop();
		});
		accountService.activeChannels = {};
	};
	
	PhoneService.prototype.listener = function(channelMessage) {
		if(channelMessage) {
			var message = JSON.parse(channelMessage);

			if (message.type === 'offer') {
				if (!this.channel.type !== Domain.Channel.types.caller && (!this.connection || this.connection.state === Domain.Connection.states.off || this.connection.state === Domain.Connection.states.stopped)) {
					var accept = confirm(message.sender + ' want\'s to call you. Receive?');
					if(accept) {
						$location.url('/call/accept/' + message.sender);
					}
				}
			} else if (message.type === 'answer' && self.connection.state > Domain.Connection.states.off) {
				this.connection.callerReceiveAnswer(message);
			} else if (message.type === 'candidate') {
				this.channel.receiveMessage();
				var candidate = new RTCIceCandidate({ sdpMLineIndex:message.label, candidate:message.candidate });
				if(this.connection && this.connection.peerConnection && this.connection.state > Domain.Connection.states.off) {
					console.log('add candidate');
					this.connection.peerConnection.addIceCandidate(candidate);
				} else {
					console.log('toEarlyReceived candidate');
					this.receiveCandidates.push(candidate);
				}
			} else if (message.type === 'bye') {
				if(self.connection) { self.connection.hangUp(false); }
				self.hangUp();
			} else {
				console.log('unhandled message');
			}
		}
	};

	/**
	 * receive a call
	 *
	 * @param message
	 */
	PhoneService.prototype.receiveCall = function(host, remoteVideoFrame, callback) {
		host.startLocalMedia(function() {
			this.connection = new Connection(host.localstream, this.channel, remoteVideoFrame, null, callback, this.receiveCandidates);
			this.connection.calleeCreateAnswer(message);
		}.bind(this));
		this.timeOutIfConnectionNotEtablished();
	};

	/**
	 * call action
	 */
	PhoneService.prototype.call = function(host, remoteVideoFrame, receiver, callback) {
		host.startLocalMedia(function() {
			this.connection = new Domain.Connection(host.localstream, this.channel, remoteVideoFrame, receiver, callback, this.receiveCandidates);
			this.connection.callerCreateOffer();
		}.bind(this));
		this.timeOutIfConnectionNotEtablished();
	};

	/**
	 * wait for some seconds, if connection is not etablished, hang up and clean up
	 */
	PhoneService.prototype.timeOutIfConnectionNotEtablished = function() {
		setTimeout(function() {
			if(this.connection && this.connection.state < Domain.Connection.states.connected) {
				this.connection.hangUp(true);
				this.hangUp();
				alert('could not etablish connection.');
			}
		}.bind(this), 1000 * Configuration.connection.connectTimeout);
	};
	
	PhoneService.prototype.hangUp = function() {
		this.connection.hangUp(true);
	};
	
	return PhoneService;
});