(function () {
	'use strict';

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
	Domain.Connection = function (localstream, channel, videoFrame, receiver, streamReady, receiveCandidates) {
		// Todo: How to test? -> Refactor?
		this.localstream = localstream;
		this.channel = channel;
		this.videoFrame = videoFrame;
		this.receiver = receiver;
		this.state = Domain.Connection.states.off;
		this.peerConnection = null;
		this.config = null;
		this.streamReady = streamReady;
		this.receiveCandidates = receiveCandidates;
	};

	/**
	 * sending sdp helper
	 *
	 * @param sdp
	 */
	Domain.Connection.prototype.setLocalAndSendSDP = function (sdp) {
		sdp.sdp = Service.SDPService.preferOpus(sdp.sdp);
		this.peerConnection.setLocalDescription(sdp);
		var message = {
			"receiver": this.receiver,
			"message": JSON.stringify({
				type: sdp.type,
				sdp: sdp.sdp,
				sender: Configuration.user.username
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
				"message": JSON.stringify({
					type: 'candidate',
					label: event.candidate.sdpMLineIndex,
					id: event.candidate.sdpMid,
					candidate: event.candidate.candidate
				})
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


		try {
			this.dataChannel = this.peerConnection.createDataChannel('channel');
			this.dataChannel.binaryType = 'blob';

			this.dataChannel.onmessage = function(event) {
				var message = JSON.parse(event.data);
				Domain.EventManager.notify('dataChannelMessageReceive',message, Domain.Connection);
				Service.Log.log(Service.Log.logTypes.Info, 'Connection','DataChannel message received: '+message.message);
			}.bind(this);

			this.dataChannel.onopen = function(){
				this.dataChannel.send(JSON.stringify({
					"messageType": "system",
					"message": 'caller: hello data channel'
				}));
			}.bind(this);
		} catch (e) {
			Service.Log.log(Service.Log.logTypes.error, 'Connection', e);
		}


		this.peerConnection.createOffer(this.setLocalAndSendSDP.bind(this), function (error) {
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
				Service.Log.log(Service.Log.logTypes.Info, 'Connection','DataChannel message received: '+message.message);
			}.bind(this);

			this.dataChannel.onopen = function(){
				this.dataChannel.send(JSON.stringify({
					"messageType": "system",
					"message": 'callee: hello data channel'
				}));
			}.bind(this);
		}.bind(this);

		this.peerConnection.setRemoteDescription(new RTCSessionDescription(offer));

		this.receiveCandidates.forEach(function(candidate, index) {
			console.log('addLateCandidate');
			this.peerConnection.addIceCandidate(candidate);
			delete this.receiveCandidates[index];
		},this);

		this.peerConnection.createAnswer(this.setLocalAndSendSDP.bind(this),function (error) {
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
			if(this.dataChannel && this.dataChannel.readyState === 'open') {
				this.dataChannel.send(JSON.stringify({
						"messageType": 'system',
						"message": 'bye'
					})
				);
			} else {
				this.channel.send({
					"receiver": this.receiver,
					"message": JSON.stringify({"type": "bye"})
				});
			}
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