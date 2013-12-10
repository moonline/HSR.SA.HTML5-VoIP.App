define(["Model/Domain/Host", "Core/Service/Log", "Model/Domain/EventManager"], function(Host, Log, EventManager) {
	'use strict';

	var PhoneController = function($scope, $rootScope, $location, $routeParams, accountService, requireLogin, phoneService) {
		if (requireLogin().abort) {
			return;
		}

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
			this.receiveCall($scope, phoneService, channel, userId);
		} else if ($routeParams.operation == 'call') {
			this.call($scope, phoneService, channel, $routeParams.userId, userId);
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
						this.receiveMessage($scope, event.message);
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
	PhoneController.prototype.call = function($scope, phoneService, channel, calleeId, userId) {
		phoneService.call(this.host, channel, document.getElementById('remoteVideo'), calleeId, userId, function() {
			$scope.startTime = new Date();
		});
	};

	/**
	 * receive a call
	 */
	PhoneController.prototype.receiveCall = function($scope, phoneService, channel, userId) {
		phoneService.receiveCall(this.host, channel, document.getElementById('remoteVideo'), userId, function() {
			$scope.startTime = new Date();
		});
	};

	/**
	 * receive a messenger message and display for user
	 *
	 * @param message
	 */
	PhoneController.prototype.receiveMessage = function($scope, message) {
		$scope.chatmessages.push({
			time: new Date(),
			text: message
		});
	};

	return PhoneController;
});