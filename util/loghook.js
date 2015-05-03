module.exports = function (grunt) {
	
	// Hook our log function
	grunt.util.hooker.hook(grunt.log, 'header', sieveLog);

	function sieveLog(message) {
		if (message.indexOf('Running') !== -1 && message.indexOf('task') !== -1)
			return grunt.util.hooker.preempt(null);

		return;
	}
};