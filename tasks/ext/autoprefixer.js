module.exports = {
	name: 'task-autoprefixer',
	dependencies: ['task-styles'],
	register: register,
	buildTask: true
};

function register(grunt) {

	// Check to see if autoprefixer is being used
	var useAutoprefixer = grunt.config('config.autoprefixer');
	if (useAutoprefixer === undefined || useAutoprefixer === false) {
		grunt.registerTask('task-autoprefixer', 'Disabled.', []);
		return false;
	}

	// Set autoprefixer options
	grunt.config('autoprefixer', {

		options: grunt.config('config.autoprefixer.options'),

		multiple_files: {
			src: '<%= config.cssOutputFolder %>/**/*.css'
		}
	});

	// Load our required npm tasks
	grunt.task.loadNpmTasks('grunt-autoprefixer');
	
	// Add ourselves to the styles watch list
	var stylesTasks = grunt.config('watch.styles.tasks');
	stylesTasks.push('task-autoprefixer');
	grunt.config('watch.styles.tasks', stylesTasks);

	// Register task
	grunt.registerTask('task-autoprefixer', 'Run autoprefixer', ['autoprefixer']);

	return true;
};
