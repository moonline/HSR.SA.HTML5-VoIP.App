define(["Model/Domain/Host", "Core/Service/Log", "Model/Domain/EventManager"], function(Host, Log, EventManager) {
	'use strict';

	var PhoneController = function($scope, $rootScope, $location, $routeParams, accountService, requireLogin, phoneService) {
		if (requireLogin().abort) {
			return;
		}
		
		this.$scope = $scope;
		this.$rootScope = $rootScope;
		this.phoneService = phoneService;

		this.host = new Host(document.getElementById('localVideo'));

		$scope.hangup = function(doNotNotifyOtherUser) {
			phoneService.hangUp(!doNotNotifyOtherUser);
			document.getElementById('localVideo').pause(); document.getElementById('localVideo').setAttribute('src', '');
			document.getElementById('remoteVideo').pause(); document.getElementById('remoteVideo').setAttribute('src', '');
			this.stopTimer();
			$location.url('/contacts');
			setTimeout(function() { $rootScope.$apply(); }); // defer to next tick
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
			this.phoneService.sendMessage($scope.chatmessage);
			this.receiveMessage(phoneService.connection.sender, $scope.chatmessage);
			$scope.chatmessage = '';
		}.bind(this);
		
		EventManager.addListener({
				"notify": function(event, sender) {
					if(event.messageType === 'user') {
						this.receiveMessage(phoneService.connection.receiver, event.message);
					}
					if(event.messageType === 'system' && event.message === 'bye') {
						$scope.hangup(true);
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
			this.startTimer();
		}.bind(this));
	};

	/**
	 * receive a call
	 */
	PhoneController.prototype.receiveCall = function(channel, userId) {
		this.phoneService.receiveCall(this.host, channel, document.getElementById('remoteVideo'), userId, function() {
			this.startTimer();
		}.bind(this));
	};

	/**
	 * receive a messenger message and display for user
	 *
	 * @param message
	 */
	PhoneController.prototype.receiveMessage = function(name, message) {
		this.$scope.chatmessages.push({
			time: new Date(),
			text: name + ': ' + message
		});
	};
	
	PhoneController.prototype.startTimer = function() {
		this.$scope.startTime = new Date();
		this.passedTimeInterval = setInterval(function() {
			var differenceMilliseconds = (new Date()).getTime() - this.$scope.startTime.getTime();
			var seconds = Math.floor(differenceMilliseconds / 1000) % 60;
			var minutes = Math.floor(differenceMilliseconds / (60 * 1000)) % 60;
			var hours = Math.floor(differenceMilliseconds / (60 * 60 * 1000));
			
			var display = '';
			if (hours) {
				display += hours + ':';
			}
			if (minutes < 10) {
				display += '0';
			}
			display += minutes + ':';
			if (seconds < 10) {
				display += '0';
			}
			display += seconds;
			this.$scope.passedTime = display;
			this.$scope.$apply();
		}.bind(this), 1000);
		this.$scope.dataChannelReady = true;
	};
	
	PhoneController.prototype.stopTimer = function() {
		clearInterval(this.passedTimeInterval);
	};

	return PhoneController;
});