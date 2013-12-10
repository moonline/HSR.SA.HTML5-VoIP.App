define(["Model/Domain/Host"], function(Host) {
	'use strict';

	var PhoneController = function($scope, $location, $routeParams, accountService, requireLogin, phoneService) {
		if (requireLogin().abort) {
			return;
		}
		
		this.localVideoFrame = document.getElementById('localVideo');
		this.remoteVideoFrame = document.getElementById('remoteVideo');

		this.host = new Host(this.localVideoFrame);

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
			phoneSevice.hangUp(event);
			Service.Log.log(Service.Log.logTypes.Info,'PhoneController','hang up');
			this.remoteVideoFrame.pause(); this.remoteVideoFrame.setAttribute('src','');
			this.localVideoFrame.pause(); this.localVideoFrame.setAttribute('src','');
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
		
		if ($routeParams.serviceId == 'accept') {
			this.receiveCall();
		} else {
			this.call($routeParams.userId);
		}
	};


	/**
	 * receive a call
	 *
	 * @param message
	 */
	PhoneController.prototype.receiveCall = function(message) {
		phoneService.receiveCall(message, this.host, this.remoteVideoFrame, function() {
			$scope.startTime = new Date();
		});
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
	};

	/**
	 * call action
	 */
	PhoneController.prototype.call = function(receiver) {
		phoneService.call(this.host, remoteVideoFrame, receiver, function() {
			$scope.startTime = new Date();
		});
	};

	return PhoneController;
});