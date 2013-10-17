/**
 * Created by tobias on 10/15/13.
 */
var Domain = App.Model.Domain;


Domain.Host = function() {
	this.localstream = null;
	this.peers = [];
	this.channels = [];
};

Domain.Host.prototype = {
	call: function() {},
	hangUp: function() {},
	answer: function() {},
	receiveCall: function() {}
};a