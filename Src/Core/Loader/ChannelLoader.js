define(["Configuration"], function(Configuration) {
	var ChannelPrototypes = {};

	Configuration.channels.forEach(function(channelConfig){
		require([channelConfig.type], function(ConcreteChannel){
			ChannelPrototypes[channelConfig.type] = ConcreteChannel;
		});
	});

	return ChannelPrototypes;
});