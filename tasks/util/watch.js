module.exports = {
	name: 'task-watch',
	dependencies: ['task-notify'],
	register: register,
	buildTask: false
};

function register(grunt) {

	grunt.config('watch', {
	});

	// Load our required npm tasks
	grunt.task.loadNpmTasks('grunt-contrib-watch');
	
	grunt.registerTask('task-watch', 'Preprocess coffeescript files for the site.', ['watch']);

	return true;
};