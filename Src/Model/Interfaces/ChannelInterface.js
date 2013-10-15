/**
 * Created by tobias on 10/12/13.
 */
var Interfaces = App.Model.Interfaces;


Interfaces.ChannelInterface = function() {
	this.requiredFields = [];
	this.configuration = null;

	this.start = function() {

	}

	this.stop = function() {

	}

	this.send = function(message) {

	}

	this.addReceiveListener = function(listener) {

	}

	this.removeReceiveListener = function(listener) {

	}
}