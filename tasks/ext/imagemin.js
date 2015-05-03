module.exports = {
	name: 'task-imagemin',
	dependencies: [],
	register: register,
	buildTask: true
};

function register(grunt) {

	// Check to see if autoprefixer is being used
	var useImagemin = grunt.config('config.imageMin');
	if (useImagemin === undefined || useImagemin === false) {
		grunt.registerTask('task-imagemin', 'Disabled.', []);
		return false;
	}

	// Load our required npm tasks
	grunt.task.loadNpmTasks('grunt-contrib-imagemin');

	// Set imagemin options
	grunt.config('imagemin', {
		options: grunt.config('config.imageMin.options'),
		dynamic: {
			files: [{
				expand: true,
				cwd: '<%= config.imgFolder %>',
				src: ['**/*.{png,jpg,gif}'],
				dest: '<%= config.imgFolder %>'
			}]
		}
	});

	// Register task
	grunt.registerTask('task-imagemin', 'Run image optimisation', ['imagemin']);

	return true;
};