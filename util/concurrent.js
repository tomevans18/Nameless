module.exports = function (grunt, buildTasks) {
	
	grunt.task.loadNpmTasks('grunt-concurrent');

	grunt.config('concurrent', {
		build: {
			tasks: buildTasks,
			options: {
				logConcurrentOutput: true
			}
		}
	});

	// Register our new concurrent tasks
	grunt.registerTask('buildTasks', ['concurrent:build']);
};