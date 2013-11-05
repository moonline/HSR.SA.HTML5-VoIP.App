'use strict';

(function () {
	var Domain = App.Model.Domain;
	var Service = App.Core.Service;
	var Configuration = App.Configuration;


	/**
	 * Connection
	 *
	 * @param localstream: local media stream from camera / microphone
	 * @param channel: channel, used to signal the other peer(s)
	 * @param videoFrame: dom element to attach the mediastream
	 * @constructor
	 */
	Domain.Connection = function (localstream, channel, videoFrame, receiver, streamReady) {
		// Todo: How to test? -> Refactor?
		this.localstream = localstream;
		this.channel = channel;
		this.videoFrame = videoFrame;
		this.receiver = receiver;
		this.state = Domain.Connection.states.off;
		this.peerConnection = null;
		this.config = null;
		this.streamReady = streamReady;
	};


	/**
	 * sending sdp helper
	 *
	 * @param sdp
	 */
	Domain.Connection.prototype.sendSDP = function (sdp) {
		this.peerConnection.setLocalDescription(sdp);
		var message = {
			"receiver": this.receiver,
			"message": JSON.stringify({
				type: sdp.type,
				sdp: sdp.sdp,
				sender: Configuration.nick
			})
		};
		this.channel.send(message);
	};

	/**
	 * sending ice candidate helper
	 *
	 * @param event
	 */
	Domain.Connection.prototype.sendIceCandidate = function (event) {
		if (event.candidate) {
			var message = {
				"receiver": this.receiver,
				"message": JSON.stringify(event.candidate)
			};
			this.channel.send(message);
		} else {
			Service.Log.log(Service.Log.logTypes.Info, 'Connection', "End of candidates");
		}
	};

	/**
	 * receive stream helper
	 * @type {function(this:*)}
	 */
	Domain.Connection.prototype.receiveStream = function (event) {
		this.state = Domain.Connection.states.connected;
		Service.Log.log(Service.Log.logTypes.Info, 'Connection', 'stream added to p2p connection, attach remote stream');
		attachMediaStream(this.videoFrame, event.stream);
		this.streamReady();
	};


	/**
	 * caller create offer
	 */
	Domain.Connection.prototype.callerCreateOffer = function () {
		Service.Log.log(Service.Log.logTypes.Info, 'Connection', 'caller create offer');

		this.channel.type = Domain.Channel.types.caller;
		this.state = Domain.Connection.states.running;

		this.peerConnection = new RTCPeerConnection(this.config);
		this.peerConnection.addStream(this.localstream);

		this.peerConnection.onicecandidate = this.sendIceCandidate.bind(this);
		this.peerConnection.onaddstream = this.receiveStream.bind(this);


		this.dataChannel = this.peerConnection.createDataChannel('channel');
		this.dataChannel.binaryType = 'blob';

		this.dataChannel.onmessage = function(event) {
			var message = JSON.parse(event.data);
			Domain.EventManager.notify('dataChannelMessageReceive',message, Domain.Connection);
		}.bind(this);

		this.dataChannel.onopen = function(){
			this.dataChannel.send(JSON.stringify({
				"messageType": "system",
				"message": 'caller: hello data channel'
			}));
		}.bind(this);


		this.peerConnection.createOffer(this.sendSDP.bind(this), function (error) {
			Service.Log.log(Service.Log.logTypes.Error, 'Connection', error);
		});
	};

	/**
	 * callee create answer
	 *
	 * @param offer: session description answer
	 */
	Domain.Connection.prototype.calleeCreateAnswer = function (offer) {
		this.receiver = offer.sender;

		Service.Log.log(Service.Log.logTypes.Info, 'Connection', 'callee create answer');
		this.state = Domain.Connection.states.running;

		this.peerConnection = new RTCPeerConnection(this.config);
		this.peerConnection.addStream(this.localstream);

		this.peerConnection.onicecandidate = this.sendIceCandidate.bind(this);
		this.peerConnection.onaddstream = this.receiveStream.bind(this);

		this.peerConnection.ondatachannel = function(event){
			this.dataChannel = event.channel;

			this.dataChannel.onmessage = function(event) {
				var message = JSON.parse(event.data);
				Domain.EventManager.notify('dataChannelMessageReceive',message, Domain.Connection);
			}.bind(this);

			this.dataChannel.onopen = function(){
				this.dataChannel.send(JSON.stringify({
					"messageType": "system",
					"message": 'callee: hello data channel'
				}));
			}.bind(this);
		}.bind(this);

		this.peerConnection.setRemoteDescription(new RTCSessionDescription(offer));

		this.peerConnection.createAnswer(this.sendSDP.bind(this),function (error) {
			Service.Log.log(Service.Log.logTypes.Error, 'Connection', error);
		});
	};

	/**
	 * caller receive answer
	 *
	 * @param sdpAnswer: json answer containing a session description
	 */
	Domain.Connection.prototype.callerReceiveAnswer = function (sdpAnswer) {
		Service.Log.log(Service.Log.logTypes.Info, 'Connection', 'caller receive answer');
		if (this.peerConnection) {
			this.peerConnection.setRemoteDescription(new RTCSessionDescription(sdpAnswer));
		} else {
			this.hangUp();
		}
	};

	Domain.Connection.prototype.hangUp = function (notifyClient) {
		this.localstream.stop();
		if (notifyClient) {
			this.channel.send({
				"receiver": this.receiver,
				"message": JSON.stringify({"type": "bye"})
			});
		}
		try {
			this.peerConnection.close();
		} catch (error) {
			Service.Log.log(Service.Log.logTypes.Error, 'Connection', error);
		}
		this.channel.type = Domain.Channel.types.callee;
		this.peerConnection = null;
		this.state = Domain.Connection.states.stopped;
	};


	Domain.Connection.states = { off: 0, running: 1, connected: 2, stopped: 3 };

})();