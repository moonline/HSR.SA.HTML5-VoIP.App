define(function(){
	'use strict';


	var Barrier = function(finishedCallback) {
		if(finishedCallback) {
			this.finishedCallback = finishedCallback;
		}
		this.numberWaitingFor = 0;
	};

	Barrier.prototype.startTask = function() {
		this.numberWaitingFor++;
	};


	Barrier.prototype.taskFinished = function() {
		this.numberWaitingFor--;
		if(this.numberWaitingFor <= 0) {
			if(this.finishedCallback) {
				this.finishedCallback();
			}
		}
	};

	return Barrier;
});