(function () {
	'use strict';

	var Domain = App.Model.Domain;
	var Service = App.Core.Service;
	var Configuration = App.Configuration;


	/**
	 * Host
	 *
	 * @param videoFrame: dom element to attach the local media stram
	 * @param hostReadyCallback: will be called on ready media stream
	 * @constructor
	 */
	// Todo: How to test? -> Refactor?
	Domain.Host = function (videoFrame) {
		this.constraints = {
			video: Configuration.connection.quality.video,
			audio: true
		};

		this.videoFrame = videoFrame;
		this.localstream = null;
	};


	Domain.Host.prototype.startLocalMedia = function (hostReadyCallback) {
		getUserMedia(this.constraints, function (stream) {
			this.localstream = stream;
			attachMediaStream(this.videoFrame, stream);
			hostReadyCallback();
		}.bind(this),
			function (error) {
				Service.Log.log(Service.Log.logTypes.Error, 'Host', error.toString() + ': {' + Service.ArrayService.listToString(error) + '}');
			}
		);
	};

})();