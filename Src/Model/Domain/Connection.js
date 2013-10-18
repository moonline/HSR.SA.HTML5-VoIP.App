/**
 * Created by tobias on 10/15/13.
 */
var Domain = App.Model.Domain;
var Service = App.Core.Service;


/**
 * Connection
 *
 * @param localstream: local media stream from camera / microphone
 * @param channel: channel, used to signal the other peer(s)
 * @param videoFrame: dom element to attach the mediastream
 * @constructor
 */
Domain.Connection = function(localstream, channel, videoFrame) {
	this.localstream = localstream;
	this.channel = channel;
	this.videoFrame = videoFrame;

	this.state = Domain.Connection.states.off;

	this.peerConnection = null;
	this.config = null;


	/**
	 * caller create offer
	 */
	this.callerCreateOffer= function() {
		Service.Log.log(Service.Log.logTypes.Info, 'Connection', 'caller create offer');
		this.state = Domain.Connection.states.running;

		this.peerConnection = new RTCPeerConnection(this.config);
		this.peerConnection.addStream(this.localstream);

		this.peerConnection.onicecandidate = function(event) {
			if (event.candidate) {
				this.channel.send(JSON.stringify(event.candidate));
			} else {
				Service.Log.log(Service.Log.logTypes.Info, 'Connection', "End of candidates");
			}
		}.bind(this);

		this.peerConnection.onaddstream = function(event) {
			this.state = Domain.Connection.states.connected;
			Service.Log.log(Service.Log.logTypes.Info, 'Connection', 'stream added to p2p connection, attach remote stream');
			attachMediaStream(this.videoFrame,event.stream);
		}.bind(this);

		this.peerConnection.createOffer(function(sdpOffer) {
				this.peerConnection.setLocalDescription(sdpOffer);
				this.channel.send(JSON.stringify(sdpOffer));
			}.bind(this),
			function(error) { Service.Log.log(Service.Log.logTypes.Error, 'Connection', error);
		});
	}.bind(this);

	/**
	 * callee create answer
	 *
	 * @param offer: session description answer
	 */
	this.calleeCreateAnswer = function(offer) {
		Service.Log.log(Service.Log.logTypes.Info, 'Connection', 'callee create answer');
		this.state = Domain.Connection.states.running;

		this.peerConnection = new RTCPeerConnection(this.config);
		this.peerConnection.addStream(this.localstream);

		this.peerConnection.onicecandidate = function(event) {
			if (event.candidate) {
				this.channel.send(JSON.stringify(event.candidate));
			} else {
				Service.Log.log(Service.Log.logTypes.Info, 'Connection', 'End of candidates.');
			}
		}.bind(this);

		this.peerConnection.onaddstream = function(event) {
			this.state = Domain.Connection.states.connected;
			Service.Log.log(Service.Log.logTypes.Info, 'Connection', 'stream added to p2p connection, attach remote stream');
			attachMediaStream(this.videoFrame,event.stream);
		}.bind(this);

		this.peerConnection.setRemoteDescription(new RTCSessionDescription(offer));

		this.peerConnection.createAnswer(function(sdpAnswer) {
				this.peerConnection.setLocalDescription(sdpAnswer);
				this.channel.send(JSON.stringify(sdpAnswer));
			}.bind(this),
			function(error) { Service.Log.log(Service.Log.logTypes.Error, 'Connection', error);
		});
	}.bind(this);

	/**
	 * caller receive answer
	 *
	 * @param sdpAnswer: json answer containing a session description
	 */
	this.callerReceiveAnswer = function(sdpAnswer) {
		Service.Log.log(Service.Log.logTypes.Info, 'Connection', 'caller receive answer');
		this.peerConnection.setRemoteDescription(new RTCSessionDescription(sdpAnswer));
	}.bind(this);
};

Domain.Connection.states = states = { off: 0, running: 1, connected: 2, stopped: 3 };