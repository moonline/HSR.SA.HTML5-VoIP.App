define(["Configuration","Core/Service/Log", "Core/Service/ArrayService", "Core/Lib/AdapterJS/Adapter"], function (Configuration, Log, ArrayService) {
	'use strict';


	/**
	 * @param videoFrame dom element to attach the local media stream
	 */
	var Host = function (videoFrame) {
		this.constraints = {
			video: Configuration.connection.quality.video,
			audio: true
		};

		this.videoFrame = videoFrame;
		this.localstream = null;
	};


	Host.prototype.startLocalMedia = function (hostReadyCallback) {
		getUserMedia(this.constraints, function (stream) {
			this.localstream = stream;
			attachMediaStream(this.videoFrame, stream);
			hostReadyCallback();
		}.bind(this),
			function (error) {
				Log.log(Log.logTypes.Error, 'Host', error.toString() + ': {' + ArrayService.listToString(error) + '}');
			}
		);
	};

	return Host;
});