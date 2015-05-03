module.exports = function(grunt) {

	// Initialize config.
	grunt.initConfig({
		wd: global.namelesscwd,
		pkg: grunt.file.readJSON('./package.json'),
		buildTasks: [],
		clean: {
			temp: [ '.tmp/' ]
		},

		// Generic messages
		notify: {
			watch: {
				options: {
					message: 'Watch assets updated.'
				}
			}
		}
	});

	if (!global.configutil.loadConfig(grunt))
		return;

	// Verify the config
	global.configutil.verifyConfig(grunt);

	// Hijack the logger
	global.loghook(grunt);

	// Load all tasks through our task loader
	global.taskloader(grunt);

	// Load some npm tasks
	grunt.task.loadNpmTasks('grunt-contrib-clean');

	// Use parallel build?
	var useParallel = grunt.config('config.parallel');

	if (useParallel === true) {
		var concurrent = require('./util/concurrent');
		concurrent(grunt, grunt.config('buildTasks'));
	}
	else {
		grunt.registerTask('buildTasks', grunt.config('buildTasks'));
	}

	// Register our build and watch tasks
	grunt.registerTask('build', ['clean:temp', 'buildTasks', 'task-watch']);
	grunt.registerTask('default', ['build', 'task-waitexit']);

	grunt.registerTask('config', function () {
		console.log(grunt.config.get());
	});

	//Restore the cwd to the calling folder
	process.chdir(grunt.config('wd'));
};
