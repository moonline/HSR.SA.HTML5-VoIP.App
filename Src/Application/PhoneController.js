'use strict';

(function() {
	var Controller = App.Controller;
	var Domain = App.Model.Domain;
	var Channel = Domain.Channel;
	var Configuration = App.Configuration;


	Controller.PhoneController = function() {
		// Todo: fix 'this' problem
		var self = this;

		this.localVideoFrame = document.getElementById('localVideo');
		this.remoteVideoFrame = document.getElementById('remoteVideo');

		this.host = new Domain.Host(this.localVideoFrame);

		this.channel = new Channel.ChannelXHR("http://colvarim.ch/service/messageQueue/messageQueue.php");
		var listener = {
			notify: function(channelMessage) {
				var message = JSON.parse(channelMessage);

				if (message.type === 'offer') {
					// Callee creates PeerConnection
					//console.log(this);
					if (!self.channel.type !== Domain.Channel.types.caller && (!self.connection || self.connection.state === Domain.Connection.states.off || self.connection.state === Domain.Connection.states.stopped)) {
						var accept = confirm(message.sender+' want\'s to call you. Receive?');
						if(accept) {
							self.receiveCall(message);
						}
					}
				} else if (message.type === 'answer' && self.connection.state > Domain.Connection.states.off) {
					self.connection.callerReceiveAnswer(message);
				} else if (message.type === 'candidate' && self.connection.state > Domain.Connection.states.off) {
					var candidate = new RTCIceCandidate({sdpMLineIndex:message.label, candidate:message.candidate});
					self.connection.peerConnection.addIceCandidate(candidate);
				} else if (message.type === 'bye') {
					self.connection.hangUp(false);
					self.hangUp();
				}
			}
		};

		this.channel.addReceiveListener(listener);
		this.channel.start();

		/**
		 * receive a call
		 *
		 * @param message
		 */
		this.receiveCall = function(message) {
			this.host.startLocalMedia(function() {
				self.connection = new Domain.Connection(self.host.localstream,self.channel, self.remoteVideoFrame, null, function() {
					document.getElementById('hangUp').removeAttribute('disable');
				});
				self.connection.calleeCreateAnswer(message);
			}.bind(this));
		};

		/**
		 * call action
		 */
		this.call = function(receiver) {
			this.host.startLocalMedia(function() {
				self.connection = new Domain.Connection(self.host.localstream,self.channel, self.remoteVideoFrame, receiver, function() {
					document.getElementById('hangUp').removeAttribute('disable');
				});
				self.connection.callerCreateOffer();
			}.bind(this));
			this.timeOutIfConnectionNotEtablished();
		}.bind(this);

		/**
		 * wait for some seconds, if connection is not etablished, hang up and clean up
		 */
		this.timeOutIfConnectionNotEtablished = function() {
			setTimeout(function() {
				if(this.connection.state < Domain.Connection.states.connected) {
					self.connection.hangUp(true);
					self.hangUp();
					alert('could no connection etablish.');
				}
			}.bind(this),1000*Configuration.connection.connectTimeout);
		}.bind(this);

		/**
		 * hang up
		 *
		 * @type {function(this:App.Controller.PhoneController)}
		 */
		this.hangUp = function() {
			console.log('hang up');
			this.localVideoFrame.pause(); this.localVideoFrame.src = '';
			this.remoteVideoFrame.pause(); this.remoteVideoFrame.src = '';
			document.getElementById('hangUp').setAttribute('disable', 'disable');
		}.bind(this);


		Domain.EventManager.addListener({
			notify: function(event, sender) {
				if(event.receiver) {
					this.call(event.receiver);
				}
			}.bind(this)
		}, 'startCall');

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
	};

})();