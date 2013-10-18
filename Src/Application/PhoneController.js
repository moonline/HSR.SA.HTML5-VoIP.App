/**
 * Created by tobias on 10/17/13.
 */
var Controller = App.Controller;
var Domain = App.Model.Domain;
var Channel = Domain.Channel;
var Service = App.Core.Service;


Controller.PhoneController = function() {
	var self = this;

	this.callButton = document.getElementById('call');
	this.localVideoFrame = document.getElementById('localVideo');
	this.remoteVideoFrame = document.getElementById('remoteVideo');

	this.channel = new Channel.ChannelXHR("http://colvarim.ch/service/messageQueue/messageQueue.php");
	this.host = new Domain.Host(this.localVideoFrame, function() {
		//this.connections = [];
		self.connection = new Domain.Connection(self.host.localstream,self.channel, self.remoteVideoFrame);
		//this.connection = this.connections[0];


		var listener = {
			notify: function(channelMessage) {
				var message = JSON.parse(channelMessage);

				if (message.type === 'offer') {
					// Callee creates PeerConnection
					//console.log(this);
					if (!self.channel.type !== 'caller' && self.connection.state === Domain.Connection.states.off) {
						self.callButton.setAttribute('disabled','disabled');
						self.connection.calleeCreateAnswer(message);
					}
				} else if (message.type === 'answer' && self.connection.state > Domain.Connection.states.off) {
					self.connection.callerReceiveAnswer(message);
					self.callButton.setAttribute('disabled','disabled');
				} else if (message.type === 'candidate' && self.connection.state > Domain.Connection.states.off) {
					var candidate = new RTCIceCandidate({sdpMLineIndex:message.label, candidate:message.candidate});
					self.connection.peerConnection.addIceCandidate(candidate);
				}
			}
		};
		self.channel.addReceiveListener(listener);
	}.bind(this));

	/**
	 * call action
	 */
	this.callAction = function() {
		this.channel.start();
	}.bind(this);

	this.callButton.onclick = function(){
		this.channel.type = 'caller';
		this.connection.callerCreateOffer();
	}.bind(this);
};