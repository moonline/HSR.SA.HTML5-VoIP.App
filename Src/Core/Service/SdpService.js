(function () {
	'use strict';

	var Service = App.Core.Service;

	/**
	 * SDP parsing library
	 *
	 * @licence http://www.apache.org/licenses/LICENSE-2.0
	 * @copyright (c) 2012 Google Inc.
	 */
	Service.SDPService = {};

	Service.SDPService.removeCN = function(sdpLines, mLineIndex) {
		var mLineElements = sdpLines[mLineIndex].split(' ');
		// Scan from end for the convenience of removing an item.
		for (var i = sdpLines.length-1; i >= 0; i--) {
			var payload = Service.SDPService.extractSdp(sdpLines[i], /a=rtpmap:(\d+) CN\/\d+/i);
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


	Service.SDPService.setDefaultCodec = function(mLine, payload) {
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

	Service.SDPService.extractSdp = function(sdpLine, pattern) {
		var result = sdpLine.match(pattern);
		return (result && result.length == 2)? result[1]: null;
	};

	Service.SDPService.preferOpus = function(sdp) {
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
				var opusPayload = Service.SDPService.extractSdp(sdpLines[i], /:(\d+) opus\/48000/i);
				if (opusPayload)
					sdpLines[mLineIndex] = Service.SDPService.setDefaultCodec(sdpLines[mLineIndex],
						opusPayload);
				break;
			}
		}

		// Remove CN in m line and sdp.
		sdpLines = Service.SDPService.removeCN(sdpLines, mLineIndex);

		sdp = sdpLines.join('\r\n');
		return sdp;
	};

})();