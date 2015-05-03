module.exports = {
	name: 'task-copy',
	dependencies: [],
	register: register,
	buildTask: false
};

function register(grunt) {

	grunt.config('copy', {
	});

	// Load our required npm tasks
	grunt.task.loadNpmTasks('grunt-contrib-copy');
	
	// Register a dud task to keep grunt happy
	grunt.registerTask('task-copy', 'Does nothing.', []);

	return true;
};