'use strict';

(function() {
	var Domain = App.Model.Domain;
	var Service = App.Core.Service;


	/**
	 * Host
	 *
	 * @param videoFrame: dom element to attach the local media stram
	 * @param hostReadyCallback: will be called on ready media stream
	 * @constructor
	 */
	Domain.Host = function(videoFrame) {
		this.constraints = {
			video: {
				mandatory: {
					maxHeight: 120,
					maxWidth: 160
				},
				optional: []
			},
			audio: true
		};

		this.videoFrame = videoFrame;
		this.localstream = null;

		this.startLocalMedia = function(hostReadyCallback) {
			getUserMedia(this.constraints, function(stream) {
					this.localstream = stream;
					attachMediaStream(this.videoFrame,stream);
					hostReadyCallback();
				}.bind(this),
				function(error){
					Service.Log.log(Service.Log.logTypes.Error, 'Host', error.toString()+': {'+Service.ArrayService.listToString(error)+'}');
				}
			);
		}.bind(this);
	};

})();