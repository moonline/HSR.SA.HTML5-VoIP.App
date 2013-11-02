'use strict';

(function() {
	var Domain = App.Model.Domain;


	/**
	 * EventManager
	 * @type: Singleton
	 */
	Domain.EventManager = {
		listeners: [],

		/**
		 * add listener
		 *
		 * @param listener: listener object
		 * @param eventType: type to listen for
		 */
		addListener: function(listener, eventType) {
			if(!this.listeners[eventType] ) {
				this.listeners[eventType] = [];
			}
			this.listeners[eventType].push(listener);
		},

		/**
		 * notify listeners
		 *
		 * @param eventType: type to notify listen listeners
		 * @param event: event to notify
		 * @param sender: who is the notifier
		 */
		notify: function(eventType, event, sender) {
			if(this.listeners[eventType]) {
				this.listeners[eventType].forEach(function(listener, i) {
					listener.notify(event, sender);
				}.bind(this));
			}
		}
	};

})();