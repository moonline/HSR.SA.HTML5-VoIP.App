define(["Configuration", "Model/Domain/Connection", "Model/Domain/Host", "Core/Service/Log"],
	function (Configuration, Connection, Host, Log) {
	'use strict';


	var PhoneController = function($scope, $location, $routeParams, accountService, requireLogin) {
		if (requireLogin().abort) {
			return;
		}

		console.log($routeParams);

		$scope.localVideoFrame = document.getElementById('localVideo');
		$scope.remoteVideoFrame = document.getElementById('remoteVideo');

		$scope.channel = accountService.activeChannels[$routeParams.channelId];
		$scope.host = new Host($scope.localVideoFrame);

		$scope.receiveCandidates = [];


		$scope.call = function() {
			$scope.host.startLocalMedia(function() {
				$scope.connection = new Connection(
					$scope.host.localstream,
					$scope.channel,
					$scope.remoteVideoFrame,
					$routeParams.userId,
					accountService.currentUser.accounts[$routeParams.channelId].fields.userId,
					function() { /*document.getElementById('hangUp').removeAttribute('disable');*/ }.bind(this),
					$scope.receiveCandidates
				);
				$scope.connection.callerCreateOffer();
			}.bind(this));
			//this.timeOutIfConnectionNotEtablished();
		};


		$scope.receiveCall = function(message) {
			$scope.host.startLocalMedia(function() {
				$scope.connection = new Connection(
					$scope.host.localstream,
					$scope.channel,
					$scope.remoteVideoFrame,
					null,
					accountService.currentUser.accounts[$routeParams.channelId].fields.userId,
					function() { /* document.getElementById('hangUp').removeAttribute('disable'); */ }.bind(this),
					$scope.receiveCandidates
				);
				$scope.connection.calleeCreateAnswer(message);
			}.bind(this));
			//this.timeOutIfConnectionNotEtablished();
		};


		$scope.hangUp = function() {
			$scope.connection.hangUp(true);
			Log.log(Log.logTypes.Info,'PhoneController','hang up');
			$scope.remoteVideoFrame.pause(); $scope.remoteVideoFrame.setAttribute('src','');
			$scope.localVideoFrame.pause(); $scope.localVideoFrame.setAttribute('src','');
		};


		if($routeParams.operation == 'call') {
			$scope.call();
		}
		if($routeParams.operation == 'receive') {
			$scope.receiveCall();
		}
	};


	return PhoneController;

/*	var Controller = App.Controller;
	var Domain = App.Model.Domain;
	var Channel = Domain.Channel;
	var Configuration = App.Configuration;
	var Service = App.Core.Service;


	Controller.PhoneController = function() {
		// Todo: fix 'this' problem
		var self = this;

		this.localVideoFrame = document.getElementById('localVideo');
		this.remoteVideoFrame = document.getElementById('remoteVideo');

		this.receiveCandidates = new Array();

		this.host = new Domain.Host(this.localVideoFrame);

		this.channel = new Channel.ChannelXHR("http://colvarim.ch/service/messageQueue/messageQueue.php");
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
		*/

		/**
		 * messaging
		 *
		document.getElementById('sendButton').onclick = function() {
			this.connection.dataChannel.send(JSON.stringify({
				"messageType": "user",
				"message": document.getElementById('localMessage').value
			}));
			document.getElementById('localMessage').value = '';
		}.bind(this);

		Domain.EventManager.addListener({
				"notify": function(event, sender) {
					if(event.messageType === 'user') {
						this.printReceiveMessage(event.message);
					}
					if(event.messageType === 'system' && event.message === 'bye') {
						self.connection.hangUp(false);
						self.hangUp();
					}
				}.bind(this)
			},
			'dataChannelMessageReceive'
		);

		Domain.EventManager.addListener({
				notify: function(event, sender) {
					if(event.receiver) {
						this.call(event.receiver);
					}
				}.bind(this)
			},
			'startCall'
		);

		document.querySelector('.fullScreen').onclick = function() {
			var element = document.getElementById('remoteVideo');
			if (element.requestFullscreen) {
				element.requestFullscreen();
			} else if (element.mozRequestFullScreen) {
				element.mozRequestFullScreen();
			} else if (element.webkitRequestFullscreen) {
				element.webkitRequestFullscreen();
			}
		};

		document.getElementById('hangUp').onclick = function(event) {
			if(!event.target.hasAttribute('disable')) {
				this.connection.hangUp(true);
				this.hangUp();
			}
		}.bind(this);

		document.getElementById('fancyTestButton').onclick = function() {
			Domain.EventManager.notify('startCall', { "receiver": prompt('Please insert the nickname you want to call.') }, 'addressbookEntry');
		};
	};*/


	/**
	 * receive a call
	 *
	 * @param message
	 *
	Controller.PhoneController.prototype.receiveCall = function(message) {
		this.host.startLocalMedia(function() {
			this.connection = new Domain.Connection(this.host.localstream,this.channel, this.remoteVideoFrame, null, function() {
				document.getElementById('hangUp').removeAttribute('disable');
			}.bind(this), this.receiveCandidates);
			this.connection.calleeCreateAnswer(message);
		}.bind(this));
		this.timeOutIfConnectionNotEtablished();
	};*/

	/**
	 * receive a messenger message and display for user
	 *
	 * @param message
	 *
	Controller.PhoneController.prototype.printReceiveMessage = function(message) {
		var messageBox = document.createElement('p');
		var date = new Date();
		messageBox.innerHTML = '<span class="time">'+date.getHours()+':'+date.getMinutes()+':'+date.getSeconds()+'</span><span class="messageContent">'+message+'</span>';
		document.getElementById('messageReceiveBox').insertBefore(messageBox,document.getElementById('messageReceiveBox').firstChild);
	};*/

	/**
	 * call action
	 *
	Controller.PhoneController.prototype.call = function(receiver) {
		this.host.startLocalMedia(function() {
			this.connection = new Domain.Connection(this.host.localstream, this.channel, this.remoteVideoFrame, receiver, function() {
				document.getElementById('hangUp').removeAttribute('disable');
			}.bind(this),this.receiveCandidates);
			this.connection.callerCreateOffer();
		}.bind(this));
		this.timeOutIfConnectionNotEtablished();
	};*/

	/**
	 * wait for some seconds, if connection is not etablished, hang up and clean up
	 *
	Controller.PhoneController.prototype.timeOutIfConnectionNotEtablished = function() {
		setTimeout(function() {
			if(this.connection && this.connection.state < Domain.Connection.states.connected) {
				this.connection.hangUp(true);
				this.hangUp();
				alert('could no connection etablish.');
			}
		}.bind(this),1000*Configuration.connection.connectTimeout);
	};*/

	/**
	 * hang up
	 *
	 * @type {function(this:App.Controller.PhoneController)}
	 *
	Controller.PhoneController.prototype.hangUp = function() {
		Service.Log.log(Service.Log.logTypes.Info,'PhoneController','hang up');
		this.remoteVideoFrame.pause(); this.remoteVideoFrame.setAttribute('src','');
		this.localVideoFrame.pause(); this.localVideoFrame.setAttribute('src','');
		document.getElementById('hangUp').setAttribute('disable', 'disable');
	};*/

});