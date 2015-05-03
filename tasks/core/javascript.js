var fs = require('fs'),
	path = require('path');


module.exports = {
	name: 'task-javascript',
	dependencies: ['task-copy', 'task-concat', 'task-uglify', 'task-watch', 'task-bower'],
	register: register,
	buildTask: true
};

function register(grunt) {

	// Validate our configuration
	if (!verifyConfig(grunt)) {
		grunt.registerTask('task-javascript', 'Disabled.', []);
		return false;
	}

	// Configure grunt according to what we need
	var useRequire = grunt.config('config.useRequireJS') === true;
	var useCoffee = grunt.config('config.preprocessorScriptFolder') !== undefined;
	var jsAppfolder = grunt.config('config.javascriptFolder');

	if (useRequire) {
		grunt.task.loadNpmTasks('grunt-contrib-requirejs');

		// Copy all our bower components to our js root
		grunt.config('copy.bowerjs', {
			files: [
				{expand: true, cwd: '.tmp/bower', src: '**/*.js', dest: '.tmp/js'}
			]
		});

		// Define a task to determine which require libraries to load
		grunt.registerTask('task-javascript-rjs', 'Handles requirejs includes.', function () {
			var files = walk('.tmp/js', '.tmp/js');
			var includes = [];

			files.forEach(function (file) {
				if (path.extname(file) != '.js')
					return;

				// Don't include the main module
				if (path.basename(file, '.js') == 'main')
					return;

				var module = path.dirname(file) + '/' + path.basename(file, '.js');
				includes.push(module.replace(/\\/g, "/"));
			});

			// Sort by bower priorities
			var priorities = grunt.config('config.bowerPriorities');
			if (priorities) {
				includes.sort(function (a, b) {
					for (var i=0; i < priorities.length; ++i) {
						if (priorities[i].indexOf(path.basename(a) + '.js') != -1)
							return -1;
						if (priorities[i].indexOf(path.basename(b) + '.js') != -1)
							return 1;
					}

					return 0;
				});
			}

			grunt.config('requirejs.compile.options.include', includes);
		});

		// Normalize the paths
		var paths = grunt.config('config.requirePaths');

		if (paths != undefined) {
			for (name in paths) {
				paths[name] = '../../' + paths[name];
			}
		}

		// Define our requirejs config
		grunt.config('requirejs', {
			compile: {
				options: {
					name: 'main',
					baseUrl: '.tmp/js',
					out: '<%= config.jsOutputFolder %>/<%= config.scriptFileName %>.js',
					optimize: 'none',
					generateSourceMaps: grunt.config('config.generateRequireSourcemap') === true,
					paths: paths
				}
			}
		});
	}

	if (useCoffee) {
		grunt.task.loadNpmTasks('grunt-contrib-coffee');

		grunt.config('coffee', {
			coffee: {
				options: {
					bare: false,
					sourceMap: false
				},
				files: [
					{	//Compile our coffeescript into the site js folder
						expand: true,
						cwd: '<%= config.preprocessorScriptFolder %>',
						src: '**/*.coffee',
						dest: '.tmp/js/',
						ext: '.js'
					}
				]
			}
		});

		// Keep an eye on our coffeescript folder
		grunt.config('watch.coffee', {
			files: ['<%= config.preprocessorScriptFolder %>/**/*.coffee'],
			tasks: ['task-javascript', 'notify:watch'],
			options: {
				livereload: true
			}
		});
	}

	if (jsAppfolder) {
		var useAMD = grunt.config('config.javascriptUseAMD');

		if (useAMD && useRequire) {
			// Copy javascript files to the root
			grunt.config('concat.js', {
				files: [
					{expand: true, cwd: '<%= config.javascriptFolder %>', src: '**/*.js', dest: '.tmp/js'}
				]
			});
		}
		else {
			// Concatenate our temporary javascript files into a temporary js file
			grunt.config('concat.js', {
				src: '<%= config.javascriptFolder %>/**/*.js',
				dest: '.tmp/js/_tmp.js'
			});
		}

		// Keep an eye on our javascript folder
		grunt.config('watch.js', {
			files: ['<%= config.javascriptFolder %>/**/*.js'],
			tasks: ['task-javascript', 'notify:watch'],
			options: {
				livereload: true
			}
		});
	}

	// Use a clean script
	grunt.config('clean.js', [
		'.tmp/js'
	]);

	// Concatenate all our javascript into our app file
	grunt.config('concat.app', {
		src: '.tmp/js/**/*.js',
		dest: '<%= config.jsOutputFolder %>/<%= config.scriptFileName %>.js'
	});

	// Uglify our appfile when debugMode is enabled
	grunt.config('uglify.app', {
		files: {
			'<%= config.jsOutputFolder %>/<%= config.scriptFileName %>.min.js': '<%= config.jsOutputFolder %>/<%= config.scriptFileName %>.js'
		}
	});

	// Build our task list depending on our settings
	var taskList = ['clean:js'];

	if (useCoffee)
		taskList.push('coffee:coffee');

	if (jsAppfolder)
		taskList.push('concat:js');

	if (useRequire) {
		taskList.push('copy:bowerjs');
		taskList.push('task-javascript-rjs');
		taskList.push('requirejs:compile');
		if (grunt.config.get('config.debugMode') === false)
			taskList.push('uglify:app');
	} else {
		taskList.push('concat:app');
		if (grunt.config.get('config.debugMode') === false)
			taskList.push('uglify:app');
	}

	grunt.registerTask('task-javascript', 'Processes javascript files.', taskList);

	return true;
};


function verifyConfig(grunt) {
	// Do we have a js app file assigned?
	var appFile = grunt.config('config.scriptFileName');
	if (appFile === undefined)
		return false;		// Don't use javascript functionality

	var config = {
		'scriptFileName': [ ['type:string', 'notEmptyString'],
			"Invalid 'scriptFileName' config option provided. Please specifiy a valid name for the compiled javascript file, or disable by removing the 'scriptFileName' setting." ]
	};

	return global.configutil.validateConfig(grunt, config);
}

function walk(basedir, dir) {
	var results = [];
	var list = fs.readdirSync(dir);

	list.forEach(function(file) {
		file = dir + '/' + file;
		var stat = fs.statSync(file);

		if (stat && stat.isDirectory())
			results = results.concat(walk(basedir, file));
		else
			results.push(path.relative(basedir, file));
	});

	return results;
}
