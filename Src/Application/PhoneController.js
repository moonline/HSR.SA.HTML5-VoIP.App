/**
 * Created by tobias on 10/17/13.
 */
var Controller = App.Controller;
var Domain = App.Model.Domain;
var Channel = Domain.Channel;
var Service = App.Core.Service;


Controller.PhoneController = function() {
	// Todo: fix 'this' problem
	var self = this;

	this.callButton = document.getElementById('call');
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
				if (!self.channel.type !== 'caller' && (typeof(self.connection) === 'undefined' || self.connection.state === Domain.Connection.states.off)) {
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
			}
		}
	};
	this.channel.addReceiveListener(listener);
	this.channel.start();

	this.receiveCall = function(message) {
		this.host.startLocalMedia(function() {
			self.connection = new Domain.Connection(self.host.localstream,self.channel, self.remoteVideoFrame, null);
			self.connection.calleeCreateAnswer(message);
		}.bind(this));
	};

	/**
	 * call action
	 */
	this.call = function(receiver) {
		this.channel.type = 'caller';
		this.host.startLocalMedia(function() {
			self.connection = new Domain.Connection(self.host.localstream,self.channel, self.remoteVideoFrame, receiver);
			//this.connection = this.connections[0];

			self.connection.callerCreateOffer();
		}.bind(this));
	}.bind(this);

	Domain.EventManager.addListener({
		notify: function(event, sender) {
			if(event.receiver) {
				this.call(event.receiver);
				console.log(event.receiver);
			}
		}.bind(this)
	}, 'startCall');
};