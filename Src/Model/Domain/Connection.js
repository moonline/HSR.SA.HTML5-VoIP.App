'use strict';

(function() {
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
	Domain.Connection = function(localstream, channel, videoFrame, receiver, streamReady) {
		// Todo: How to test? -> Refactor?
		this.localstream = localstream;
		this.channel = channel;
		this.videoFrame = videoFrame;
		this.receiver = receiver;
		this.state = Domain.Connection.states.off;
		this.peerConnection = null;
		this.config = null;


		/**
		 * caller create offer
		 */
		this.callerCreateOffer= function() {
			Service.Log.log(Service.Log.logTypes.Info, 'Connection', 'caller create offer');

			this.channel.type = Domain.Channel.types.caller;
			this.state = Domain.Connection.states.running;

			this.peerConnection = new RTCPeerConnection(this.config);
			this.peerConnection.addStream(this.localstream);

			this.peerConnection.onicecandidate = function(event) {
				if (event.candidate) {
					var message = {
						"receiver": this.receiver,
						"message": JSON.stringify(event.candidate)
					};
					this.channel.send(message);
				} else {
					Service.Log.log(Service.Log.logTypes.Info, 'Connection', "End of candidates");
				}
			}.bind(this);

			this.peerConnection.onaddstream = function(event) {
				this.state = Domain.Connection.states.connected;
				Service.Log.log(Service.Log.logTypes.Info, 'Connection', 'stream added to p2p connection, attach remote stream');
				attachMediaStream(this.videoFrame,event.stream);
				streamReady();
			}.bind(this);

			this.peerConnection.createOffer(function(sdpOffer) {
					this.peerConnection.setLocalDescription(sdpOffer);
					var message = {
						"receiver": this.receiver,
						"message": JSON.stringify({
							type: sdpOffer.type,
							sdp: sdpOffer.sdp,
							sender: App.Configuration.nick
						})
					};
					this.channel.send(message);
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
			this.receiver = offer.sender;

			Service.Log.log(Service.Log.logTypes.Info, 'Connection', 'callee create answer');
			this.state = Domain.Connection.states.running;

			this.peerConnection = new RTCPeerConnection(this.config);
			this.peerConnection.addStream(this.localstream);

			this.peerConnection.onicecandidate = function(event) {
				if (event.candidate) {
					var message = {
						"receiver": this.receiver,
						"message": JSON.stringify(event.candidate)
					};
					this.channel.send(message);
				} else {
					Service.Log.log(Service.Log.logTypes.Info, 'Connection', 'End of candidates.');
				}
			}.bind(this);

			this.peerConnection.onaddstream = function(event) {
				this.state = Domain.Connection.states.connected;
				Service.Log.log(Service.Log.logTypes.Info, 'Connection', 'stream added to p2p connection, attach remote stream');
				attachMediaStream(this.videoFrame,event.stream);
				streamReady();
			}.bind(this);

			this.peerConnection.setRemoteDescription(new RTCSessionDescription(offer));

			this.peerConnection.createAnswer(function(sdpAnswer) {
					this.peerConnection.setLocalDescription(sdpAnswer);
					var message = {
						"receiver": this.receiver,
						"message": JSON.stringify(sdpAnswer)
					};
					this.channel.send(message);
				}.bind(this),
				function(error) { Service.Log.log(Service.Log.logTypes.Error, 'Connection', error); }
			);
		}.bind(this);

		/**
		 * caller receive answer
		 *
		 * @param sdpAnswer: json answer containing a session description
		 */
		this.callerReceiveAnswer = function(sdpAnswer) {
			Service.Log.log(Service.Log.logTypes.Info, 'Connection', 'caller receive answer');
			if(this.peerConnection) {
				this.peerConnection.setRemoteDescription(new RTCSessionDescription(sdpAnswer));
			} else {
				this.hangUp();
			}
		}.bind(this);

		this.hangUp = function(notifyClient) {
			this.localstream.stop();
			if(notifyClient) {
				this.channel.send({
					"receiver": this.receiver,
					"message": JSON.stringify({"type": "bye"})
				});
			}
			try {
				this.peerConnection.close();
			} catch (error) { Service.Log.log(Service.Log.logTypes.Error, 'Connection', error); }
			this.channel.type = Domain.Channel.types.callee;
			this.peerConnection = null;
			this.state = Domain.Connection.states.stopped;
		}.bind(this);
	};

	Domain.Connection.states = { off: 0, running: 1, connected: 2, stopped: 3 };

})();