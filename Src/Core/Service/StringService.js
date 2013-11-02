'use strict';

(function() {

	/**
	 * split the string at the first position of the delimiter
	 *
	 * @param delimitter
	 * @returns {Array}
	 */
	String.prototype.splitOnce = function(delimitter) {
		var pos = this.indexOf(delimitter);
		return [this.substring(0,pos),this.substring(pos+1,this.length)];
	};

})();