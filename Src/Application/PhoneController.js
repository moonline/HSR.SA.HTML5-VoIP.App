define(["Model/Domain/Host", "Model/Domain/Channel/ChannelXHR", "Model/Domain/EventManager", "Model/Domain/Connection"], function(Host, ChannelXHR, EventManager, Connection) {
	'use strict';

	var PhoneController = function($scope, $location, $routeParams, accountService, requireLogin) {
		if (requireLogin().abort) {
			return;
		}
		
		var self = this;
		
		this.localVideoFrame = document.getElementById('localVideo');
		this.remoteVideoFrame = document.getElementById('remoteVideo');

		this.receiveCandidates = new Array();

		this.host = new Host(this.localVideoFrame);

		this.channel = new ChannelXHR("http://colvarim.ch/service/messageQueue/messageQueue.php");
		var listener = {
			notify: function(channelMessage) {
				if(channelMessage) {
					var message = JSON.parse(channelMessage);

					if (message.type === 'offer') {
						if (!self.channel.type !== Domain.Channel.types.caller && (!self.connection || self.connection.state === Domain.Connection.states.off || self.connection.state === Domain.Connection.states.stopped)) {
							var accept = confirm(message.sender+' want\'s to call you. Receive?');
							if(accept) {
								self.receiveCall(message);
							}
						}
					} else if (message.type === 'answer' && self.connection.state > Domain.Connection.states.off) {
						self.connection.callerReceiveAnswer(message);
					} else if (message.type === 'candidate') {
						self.channel.receiveMessage();
						var candidate = new RTCIceCandidate({ sdpMLineIndex:message.label, candidate:message.candidate });
						if(self.connection && self.connection.peerConnection && self.connection.state > Domain.Connection.states.off) {
							console.log('add candidate');
							self.connection.peerConnection.addIceCandidate(candidate);
						} else {
							console.log('toEarlyReceived candidate');
							self.receiveCandidates.push(candidate);
						}
					} else if (message.type === 'bye') {
						if(self.connection) { self.connection.hangUp(false); }
						self.hangUp();
					} else {
						console.log('unhandled message');
					}
				}
			}
		};

		this.channel.addReceiveListener(listener);
		this.channel.start();

		/*
		 * messaging
		 */
		$scope.chatmessages = [];
		
		$scope.sendMessage = function(event) {
			event.preventDefault();
			this.connection.dataChannel.send(JSON.stringify({
				"messageType": "user",
				"message": $scope.chatmessage
			}));
			$scope.chatmessage = '';
		}.bind(this);

		EventManager.addListener({
				"notify": function(event, sender) {
					if(event.messageType === 'user') {
						this.receiveMessage(event.message);
					}
					if(event.messageType === 'system' && event.message === 'bye') {
						self.connection.hangUp(false);
						self.hangUp();
					}
				}.bind(this)
			},
			'dataChannelMessageReceive'
		);

		EventManager.addListener({
				notify: function(event, sender) {
					if(event.receiver) {
						this.call(event.receiver);
					}
				}.bind(this)
			},
			'startCall'
		);

		$scope.fullscreen = function() {
			var element = document.getElementById('videoPanel');
			if (element.requestFullscreen) {
				element.requestFullscreen();
			} else if (element.mozRequestFullScreen) {
				element.mozRequestFullScreen();
			} else if (element.webkitRequestFullscreen) {
				element.webkitRequestFullscreen();
			}
		};

		$scope.hangup = function(event) {
			if(!event.target.hasAttribute('disable')) {
				this.connection.hangUp(true);
				this.hangUp();
			}
		}.bind(this);
		
		this.call($routeParams.userId);
	};


	/**
	 * receive a call
	 *
	 * @param message
	 */
	PhoneController.prototype.receiveCall = function(message) {
		this.host.startLocalMedia(function() {
			this.connection = new Domain.Connection(this.host.localstream, this.channel, this.remoteVideoFrame, null, function() {
				$scope.startTime = new Date();
			}.bind(this), this.receiveCandidates);
			this.connection.calleeCreateAnswer(message);
		}.bind(this));
		this.timeOutIfConnectionNotEtablished();
	};

	/**
	 * receive a messenger message and display for user
	 *
	 * @param message
	 */
	PhoneController.prototype.receiveMessage = function(message) {
		$scope.chatmessages.push({
			time: new Date(),
			text: message
		});
		var messageBox = document.createElement('p');
		var date = new Date();
	};

	/**
	 * call action
	 */
	PhoneController.prototype.call = function(receiver) {
		this.host.startLocalMedia(function() {
			this.connection = new Domain.Connection(this.host.localstream, this.channel, this.remoteVideoFrame, receiver, function() {
				$scope.startTime = new Date();
			}.bind(this),this.receiveCandidates);
			this.connection.callerCreateOffer();
		}.bind(this));
		this.timeOutIfConnectionNotEtablished();
	};

	/**
	 * wait for some seconds, if connection is not etablished, hang up and clean up
	 */
	PhoneController.prototype.timeOutIfConnectionNotEtablished = function() {
		setTimeout(function() {
			if(this.connection && this.connection.state < Domain.Connection.states.connected) {
				this.connection.hangUp(true);
				this.hangUp();
				alert('could not etablish connection.');
			}
		}.bind(this), 1000 * Configuration.connection.connectTimeout);
	};

	/**
	 * hang up
	 *
	 * @type {function(this:App.Controller.PhoneController)}
	 */
	PhoneController.prototype.hangUp = function() {
		Service.Log.log(Service.Log.logTypes.Info,'PhoneController','hang up');
		this.remoteVideoFrame.pause(); this.remoteVideoFrame.setAttribute('src','');
		this.localVideoFrame.pause(); this.localVideoFrame.setAttribute('src','');
	};

	return PhoneController;
});