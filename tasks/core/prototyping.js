// The descriptor object for the template engine we're using
var templateEngine = null;

var templateEngines = {
	'haml': {
		name: 'haml',
		templateString: "**/*.haml"
	},
	'jade': {
		name: 'jade',
		templateString: "**/*.jade"
	}
};


// This file is used to set up local HTML file prototyping.
module.exports = {
	name: 'task-prototype',
	dependencies: ['task-watch', 'task-notify'],
	register: register,
	buildTask: true,
	catchTemplate: /(consolidate.*)\w+/g
};

function register(grunt) {

	if (grunt.config('config.prototyping') === false) {
		grunt.registerTask('task-prototype', 'Disabled.', []);
		return false;
	}

	// Validate our configuration
	if (!verifyConfig(grunt)) {
		grunt.registerTask('task-prototype', 'Disabled.', []);
		return false;
	}

	// Load our required npm tasks
	grunt.task.loadNpmTasks('grunt-contrib-connect');

	if (templateEngine != undefined) {
		grunt.task.loadNpmTasks('grunt-consolidate');

		// Preprocess templates
		grunt.config('consolidate', {
			options: {
				engine: templateEngine.name,
				local: {
					pretty: true,
					compileDebug: grunt.config('config.debugMode')
				}
			},
			dist: {
				files: [{
					expand: true,
					cwd: '<%= config.prototypes.templateRoot %>',
					src: templateEngine.templateString,
					dest: '.tmp/html/',
					ext: '.html',

					// Ignore partials prefixed with "_"
					filter: function(srcFile) {
								return !/(\/_)|(\\_)/.test(srcFile);
							}
				}]
			}
		});

		// Keep an eye on our template files
		grunt.config('watch.prototypinghtml', {
			files: [templateEngine.templateString],
			tasks: ['consolidate:dist', 'notify:watch'],
			options: {
				livereload: true
			}
		});
	}

	// Keep an eye on our html files
	grunt.config('watch.prototyping', {
		files: ['./*.html'],
		tasks: ['notify:watch'],
		options: {
			livereload: true
		}
	});

	// Set up task
	var connect = require('connect');

	grunt.registerTask('task-prototype', 'Launches concurrent prototype server.', function () {
		if (templateEngine != undefined)
			grunt.task.run('task-prototype-build');

		loadExpress(grunt);
		grunt.task.run('notify:prototyping');
	});

	grunt.registerTask('task-prototype-build', 'Builds the prototype templates.', ['consolidate:dist']);

	// Configure our notification
	grunt.config('notify.prototyping', {
		options : {
			message: 'Server running at http://localhost:' + grunt.config('config.prototypes.port')
		}
	});

	return true;
};


function loadExpress(grunt) {
	grunt.log.writeln('Starting prototype web server - http://localhost:'  + grunt.config('config.prototypes.port'));

	var express = require('express');
	var app = express();

	// Live reload script
	if (grunt.config('config.prototypes.livereload')) {
		var excludeList = ['.woff', '.flv'];

		app.use(require('connect-livereload')({
			port: 35729,
			excludeList: excludeList
		}));
	}

	// Load templated html
	if (templateEngine != undefined) {
		app.use(express["static"](require('path').join(process.cwd(), '.tmp/html/')));
	}

	// Load static content before routing takes place
	app.use(express["static"](require('path').join(process.cwd(), grunt.config('config.prototypes.root'))));

	// Start the server
	var port = grunt.config('config.prototypes.port') || 3000;
	app.listen(port);
}

function verifyConfig(grunt) {
	var fs = require('fs');

	// Do we have a prototype object?
	if (grunt.config('config.prototypes') === undefined)
		return false;

	var config = {
		'prototypes.port': [ ['type:number', 'notZero'],
			"Invalid 'prototypes.port' option given. Please specifiy a valid port or disable prototyping." ],

		'prototypes.root': [ ['type:string', 'notEmptyString', 'pathExists'],
			"Invalid 'prototypes.root' option given. Please specifiy a valid path or disable prototyping." ],

		'prototypes.livereload': [ ['type:boolean'],
			"Invalid 'prototypes.livereload' option given. Please give a boolean or disable prototyping." ],

		'prototypes.templates': [ [ 'type:string' ],
			"Invalid 'prototypes.templates' option given. Please specify a template engine name or disable prototyping." ],
	};

	if (!global.configutil.validateConfig(grunt, config))
		return false;

	// Does the templating engine exist?
	var engine = grunt.config('config.prototypes.templates');
	if (engine == "")
		return true;

	templateEngine = templateEngines[engine];

	return (templateEngine != undefined);
}

