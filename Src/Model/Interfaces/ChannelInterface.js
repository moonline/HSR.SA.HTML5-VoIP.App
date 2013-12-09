define(["Core/Framework/Interface"],function(Interface) {
	'use strict';


	var ChannelInterface = new Interface(
		'Model/Interfaces/ChannelInterface',
		['start', 'stop', 'send', 'addReceiveListener', 'removeReceiveListener']
	);

	return ChannelInterface;
});