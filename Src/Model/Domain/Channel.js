define(function() {
	'use strict';


	var Channel = {};
	Channel.types = { callee: 0, caller: 1 };
	Channel.states = { off: 0, waiting: 1, connected: 2, disconnected: 3 };


	return Channel;
});