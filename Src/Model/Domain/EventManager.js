define(function () {
	'use strict';

	/**
	 * EventManager
	 */
	var EventManager = function () {
		this.listeners= [];
	};

	/**
	 * add listener
	 *
	 * @param listener: listener object
	 * @param eventType: type to listen for
	 */
	EventManager.prototype.addListener = function (listener, eventType) {
		if (!this.listeners[eventType]) {
			this.listeners[eventType] = [];
		}
		this.listeners[eventType].push(listener);
	};

	/**
	 * notify listeners
	 *
	 * @param eventType: type to notify listen listeners
	 * @param event: event to notify
	 * @param sender: who is the notifier
	 */
	EventManager.prototype.notify = function (eventType, event, sender) {
		if (this.listeners[eventType]) {
			this.listeners[eventType].forEach(function (listener, i) {
				listener.notify(event, sender);
			}, this);
		}
	};


	/**
	 * @type: Singleton
	 */
	if(!window.appEventManager) {
		window.appEventManager = new EventManager();
	}

	return window.appEventManager;
});