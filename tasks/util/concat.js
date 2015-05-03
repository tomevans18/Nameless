module.exports = {
	name: 'task-concat',
	dependencies: [],
	register: register,
	buildTask: false
};

function register(grunt) {

	grunt.config('concat', {
		options: {
			separator: ';',
		}
	});

	// Load our required npm tasks
	grunt.task.loadNpmTasks('grunt-contrib-concat');
	
	// Register a dud task to keep grunt happy
	grunt.registerTask('task-concat', 'Does nothing.', []);

	return true;
};