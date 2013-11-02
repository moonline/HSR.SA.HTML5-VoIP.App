'use strict';

(function() {
	var Domain = App.Model.Domain;


	Domain.Channel.types = { callee: 0, caller: 1 };
	Domain.Channel.states = { off: 0, waiting: 1, connected: 2, disconnected: 3 };

})();