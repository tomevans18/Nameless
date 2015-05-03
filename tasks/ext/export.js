module.exports = {
	name: 'task-export',
	dependencies: ['task-copy', 'task-prototype'],
	register: register,
	buildTask: false
};



function register(grunt) {

	// Clean the .tmp folder
	grunt.config('clean.export', [
		'.tmp/html',
		'.tmp/js',
		'export/'
	]);

	// Copy each of our assets folders to new export directory
	grunt.config('copy.exportCss', {
		files: [
			{ expand: true, cwd: '<%= config.cssOutputFolder %>', src: '**/*.css', dest: 'export/assets/css' }
		]
	});

	grunt.config('copy.exportJs', {
		files: [
			{ expand: true, cwd: '<%= config.jsOutputFolder %>', src: '**/*.js', dest: 'export/assets/js' }
		]
	});

	grunt.config('copy.exportImg', {
		files: [
			{ expand: true, cwd: "", src: 'favicon.ico', dest: 'export/' },
			{ expand: true, cwd: '<%= config.imgFolder %>', src: '**/*', dest: 'export/assets/img' }
		]
	});


	// Copy our HTML pages to the root of the export directory
	grunt.config('copy.exportTemplates', {
		files: [
			{ expand: true, cwd: '.tmp/html', src: '**/*.html', dest: 'export/' }
		]
	});

	// Surfaces a local exporting variable to the jade templates to allow for minification
	grunt.config('consolidate.options.local.exporting', true);

	// Assign task
	grunt.registerTask('task-export', 'Generates static site from prototype build', ['task-prototype-build', 'copy:exportCss', 'copy:exportJs', 'copy:exportImg', 'copy:exportTemplates']);
	return true;
};
