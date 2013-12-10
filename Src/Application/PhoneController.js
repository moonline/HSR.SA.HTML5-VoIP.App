define(["Model/Domain/Host", "Core/Service/Log", "Model/Domain/EventManager"], function(Host, Log, EventManager) {
	'use strict';

	var PhoneController = function($scope, $location, $routeParams, accountService, requireLogin, phoneService) {
		if (requireLogin().abort) {
			return;
		}
		
		this.$scope = $scope;
		this.phoneService = phoneService;

		this.host = new Host(document.getElementById('localVideo'));

		$scope.hangup = function(event) {
			phoneService.hangUp(true);
			Log.log(Log.logTypes.Info, 'PhoneController', 'hang up');
			document.getElementById('localVideo').pause(); document.getElementById('localVideo').setAttribute('src', '');
			document.getElementById('remoteVideo').pause(); document.getElementById('remoteVideo').setAttribute('src', '');
			$location.url('/contacts');
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
		
		var userId = accountService.currentUser.accounts[$routeParams.channelId].fields.userId;
		var channel = phoneService.activeChannels[$routeParams.channelId];
		if ($routeParams.operation == 'accept' && phoneService.callerMessage) {
			this.receiveCall(channel, userId);
		} else if ($routeParams.operation == 'call') {
			this.call(channel, $routeParams.userId, userId);
		} else {
			Log.log(Log.logTypes.Info, 'PhoneController', 'receiveCall without call');
			$location.url('/contacts');
		}
		
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
						this.connection.hangUp(false);
						this.hangUp();
					}
				}.bind(this)
			},
			'dataChannelMessageReceive'
		);
	};

	/**
	 * call action
	 */
	PhoneController.prototype.call = function(channel, calleeId, userId) {
		this.phoneService.call(this.host, channel, document.getElementById('remoteVideo'), calleeId, userId, function() {
			this.$scope.startTime = new Date();
		});
	};

	/**
	 * receive a call
	 */
	PhoneController.prototype.receiveCall = function(channel, userId) {
		this.phoneService.receiveCall(this.host, channel, document.getElementById('remoteVideo'), userId, function() {
			this.$scope.startTime = new Date();
		});
	};

	/**
	 * receive a messenger message and display for user
	 *
	 * @param message
	 */
	PhoneController.prototype.receiveMessage = function(message) {
		this.$scope.chatmessages.push({
			time: new Date(),
			text: message
		});
	};

	return PhoneController;
});