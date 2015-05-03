module.exports = {
	name: 'task-styles',
	dependencies: ['task-copy', 'task-watch'],
	register: register,
	buildTask: true
};

function register(grunt) {

	// Validate our configuration
	if (!verifyConfig(grunt)) {
		grunt.registerTask('task-styles', 'Disabled.', []);
		return false;
	}

	// Load our required npm tasks
	var useRuby = grunt.config('config.useRubySASS');
	var useLint = grunt.config('config.scssLintConfig') !== undefined;

	if (useRuby)
		grunt.task.loadNpmTasks('grunt-contrib-sass');
	else
		grunt.task.loadNpmTasks('grunt-sass');

	if (useLint)
		grunt.task.loadNpmTasks('grunt-scss-lint');

	if (grunt.config.get('config.debugMode') === false)
		grunt.task.loadNpmTasks('grunt-contrib-cssmin');

	// Perform the linting?
	if (useLint) {
		grunt.config('scsslint', {
			allFiles: [
				'<%= config.preprocessorStyleFolder %>/**/*.scss'
			],
			options: {
				config: '<%= config.scssLintConfig %>'
			}
		});
	}

	// Are we using icons?
	var useIcons = grunt.config('config.iconFolder') !== undefined;
	if (useIcons && global.firstBuild) {
		grunt.fail.fatal("Icon fallback functionality has been removed.");
		// grunt.task.loadNpmTasks('grunt-grunticon');

		// // Use a clean script
		// grunt.config('clean.icons', [
		// 	'.tmp/icons'
		// ]);

		// grunt.config('grunticon', {
		// 	icons: {
		// 		files: [{
		// 			expand: true,
		// 			cwd: '<%= config.iconFolder %>',
		// 			src: ['*.svg', '*.png'],
		// 			dest: ".tmp/icons"
		// 		}],
		// 		options: {

		// 		}
		// 	}
		// });

		// // Implement proper IE8 fallback
		// grunt.loadNpmTasks('grunt-text-replace');
		// grunt.config('replace', {
		// 	icons: {
		// 		src: ['.tmp/icons/*.svg.css'],
		// 		dest: '.tmp/icons/',
		// 		replacements: [{
		// 			from: "-image: url",
		// 			to: ": rgba(255, 255, 255, 0) url"
		// 		}]
		// 	}
		// });

		// // Create scss files also
		// grunt.config('copy.icons', {
		// 	files: [{
		// 		expand: true,
		// 		src: "**/*.css",
		// 		dest: ".tmp/icons/",
		// 		cwd: ".tmp/icons/",
		// 		rename: function(dest, src) {
		// 			console.log(dest);console.log(src);
	 //              return dest + src.substring(0, src.lastIndexOf('.')) + '.scss';
	 //            }
		// 	}]
		// });

		// grunt.registerTask('icons', 'Preprocess icons for site.', ['clean:icons', 'grunticon:icons', 'replace:icons', 'copy:icons']);
	}

	grunt.config('sass', {
		styles: {
			files: [
				{	//Compile our sass into the site css folder
					expand: true,
					cwd: '<%= config.preprocessorStyleFolder %>',
					src: '**/*.scss',
					dest: '<%= config.cssOutputFolder %>',
					ext: '.css'
				}
			],
			options: {
				quiet: true
			}
		}
	});

	// Keep an eye on our sass folder
	grunt.config('watch.styles', {
		files: ['<%= config.preprocessorStyleFolder %>/**/*.scss'],
		tasks: ['task-styles', 'notify:watch'],
		options: {
			livereload: true
		}
	});

	// Minify our css when debugMode is disabled
	grunt.config('cssmin.styles', {
		files: [
			{	//Compile our sass into the site css folder
				expand: true,
				cwd: '<%= config.cssOutputFolder %>',
				src: ['**/*.css', '!vendor.*', '!**/*.min.css'],
				dest: '<%= config.cssOutputFolder %>',
				ext: '.min.css'
			}
		]
	});

	// Assign our tasks based on debugMode mode
	var taskList = [];

	if (useLint)
		taskList.push('scsslint');

	if (useIcons && global.firstBuild)
		taskList.push('icons');

	taskList.push('sass:styles');

	if (grunt.config.get('config.debugMode') === false)
		taskList.push('cssmin:styles');

	grunt.registerTask('task-styles', 'Preprocess styles for site.', taskList);

	return true;
};


function verifyConfig(grunt) {
	// Do we have a scss folder assigned?
	var scssFolder = grunt.config('config.preprocessorStyleFolder');
	if (scssFolder === undefined)
		return false;		// Don't use sass functionality

	var config = {
		'preprocessorStyleFolder': [ ['type:string', 'notEmptyString', 'pathExists'],
			"Invalid 'preprocessorStyleFolder' path given. Please specifiy a valid path, or remove the option to avoid compiling any sass stylesheets." ],

		'cssOutputFolder': [ ['type:string', 'notEmptyString', 'pathExists'],
			"No 'cssOutputFolder' config option provided. Please specifiy a valid path, or disable sass by removing the 'preprocessorStyleFolder' setting." ]
	};

	return global.configutil.validateConfig(grunt, config);
}
