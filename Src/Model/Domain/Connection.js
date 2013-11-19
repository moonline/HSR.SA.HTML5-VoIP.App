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


	Domain.Connection.prototype.removeCN = function(sdpLines, mLineIndex) {
		var mLineElements = sdpLines[mLineIndex].split(' ');
		// Scan from end for the convenience of removing an item.
		for (var i = sdpLines.length-1; i >= 0; i--) {
			var payload = Domain.Connection.prototype.extractSdp(sdpLines[i], /a=rtpmap:(\d+) CN\/\d+/i);
			if (payload) {
				var cnPos = mLineElements.indexOf(payload);
				if (cnPos !== -1) {
					// Remove CN payload from m line.
					mLineElements.splice(cnPos, 1);
				}
				// Remove CN line in sdp
				sdpLines.splice(i, 1);
			}
		}

		sdpLines[mLineIndex] = mLineElements.join(' ');
		return sdpLines;
	};


	Domain.Connection.prototype.setDefaultCodec = function(mLine, payload) {
		var elements = mLine.split(' ');
		var newLine = new Array();
		var index = 0;
		for (var i = 0; i < elements.length; i++) {
			if (index === 3) // Format of media starts from the fourth.
				newLine[index++] = payload; // Put target payload to the first.
			if (elements[i] !== payload)
				newLine[index++] = elements[i];
		}
		return newLine.join(' ');
	};

	Domain.Connection.prototype.extractSdp = function(sdpLine, pattern) {
		var result = sdpLine.match(pattern);
		return (result && result.length == 2)? result[1]: null;
	};

	Domain.Connection.prototype.preferOpus = function(sdp) {
		var sdpLines = sdp.split('\r\n');

		// Search for m line.
		for (var i = 0; i < sdpLines.length; i++) {
			if (sdpLines[i].search('m=audio') !== -1) {
				var mLineIndex = i;
				break;
			}
		}
		if (mLineIndex === null) {
			return sdp;
		}

		// If Opus is available, set it as the default in m line.
		for (var i = 0; i < sdpLines.length; i++) {
			if (sdpLines[i].search('opus/48000') !== -1) {
				var opusPayload = Domain.Connection.prototype.extractSdp(sdpLines[i], /:(\d+) opus\/48000/i);
				if (opusPayload)
					sdpLines[mLineIndex] = Domain.Connection.prototype.setDefaultCodec(sdpLines[mLineIndex],
						opusPayload);
				break;
			}
		}

		// Remove CN in m line and sdp.
		sdpLines = Domain.Connection.prototype.removeCN(sdpLines, mLineIndex);

		sdp = sdpLines.join('\r\n');
		return sdp;
	};


	/**
	 * sending sdp helper
	 *
	 * @param sdp
	 */
	Domain.Connection.prototype.setLocalAndSendSDP = function (sdp) {
		sdp.sdp = Domain.Connection.prototype.preferOpus(sdp.sdp);
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
		//signalingChannel.send(JSON.stringify({ "candidate": evt.candidate }));
		/*
		 {type: 'candidate',
		 label: event.candidate.sdpMLineIndex,
		 id: event.candidate.sdpMid,
		 candidate: event.candidate.candidate}
		*/
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