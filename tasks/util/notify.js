module.exports = {
	name: 'task-notify',
	dependencies: [],
	register: register,
	buildTask: false,
	catchTemplate: /(notify.*)\w+/g
};

function register(grunt) {

	// Load our required npm tasks
	grunt.task.loadNpmTasks('grunt-notify');

	// Register a dud task to keep grunt happy
	grunt.registerTask('task-notify', 'Does nothing.', []);

	return true;
};