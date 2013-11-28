define(["Core/Framework/Interface"],function(Interface) {
	'use strict';


	var ChannelInterface = new Interface(
		'ChannelInterface',
		['start', 'stop', 'send', 'addReceiveListener', 'removeReceiveListener']
	);

	return ChannelInterface;
});