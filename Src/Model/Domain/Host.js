define(["Configuration","Core/Service/Log", "Core/Service/ArrayService"], function (Configuration, Log, ArrayService) {
	'use strict';


	/**
	 * Host
	 *
	 * @param videoFrame: dom element to attach the local media stram
	 * @param hostReadyCallback: will be called on ready media stream
	 * @constructor
	 */
	// Todo: How to test? -> Refactor?
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