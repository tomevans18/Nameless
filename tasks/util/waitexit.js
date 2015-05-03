module.exports = {
	name: 'task-waitexit',
	dependencies: [],
	register: register,
	buildTask: false
};

function register(grunt) {

	// Load our required npm tasks
	grunt.registerTask('task-waitexit', 'Waits for any global lingering tasks to finish.', function() {

		// Wait for the count to become zero asynchronously
		var done = this.async();

		var waitDone = function () {
			if (global.completeCount === 0)
				done();
			else
				setImmediate(waitDone);
		};

		waitDone();
	});

	return true;
};