module.exports = {
	name: 'task-uglify',
	dependencies: [],
	register: register,
	buildTask: false
};

function register(grunt) {

	if (grunt.config.get('config.debugMode') === false) {
		grunt.config('uglify', {
			options: {
				mangle: false
			}
		});

		// Load our required npm tasks
		grunt.task.loadNpmTasks('grunt-contrib-uglify');
	}

	// Register a dud task to keep grunt happy
	grunt.registerTask('task-uglify', 'Does nothing.', []);

	return true;
};
