module.exports = {
	// Execute debugMode false tasks (javascript, styles, prototyping) in parallel.
	"parallel": false,

	// When debugMode is enabled minification isn't performed.
	"debugMode": false,

	// Prototyping is used to develop static HTML files before the back-end is
	// deployed. http://localhost:3000 should point to your HTML files in the
	// root of your project.
	"prototyping": true,
	"prototypes": {
		"root": "./",			// The path to our static HTML files
		"port": 3000,			// The port to run the webserver on
		"livereload": true,		// Whether to use livereload to refresh content
		"templates": "",			// The template engine to use, blank for none.
		"templateRoot": "" // The path to our templates, blank for root.

		// See https://github.com/visionmedia/consolidate.js/#supported-template-engines for supported template engine list.
		// Any template engines need to be installed globally, i.e. 'npm install hamljs -g', 'npm install jade -g'
	},

	// Folder paths to relevant assets.
	"cssOutputFolder": "assets/css",
	"jsOutputFolder": "assets/js",
	"preprocessorStyleFolder": "assets/css",			// Remove me to disable sass/less
	"preprocessorScriptFolder": "assets/coffee",		// Remove me to disable coffeescript

	// To autoprefix, provide autoprefixer options or comment out to disable.
	"autoprefixer": {
		"options": {
			"browsers": ['last 10 versions', 'ie 8', 'ie 9']
		},
	},

	"imgFolder": "assets/img",
	//"iconFolder": "assets/img/icons",	// Automatically adds icons in this folder to the stylesheet

	// To optimize images run the nameless task-imagemin command, comment out to disable
	"imageMin": {
		"options": {
			optimizationLevel: 7,
			progressive: true
		}
	},

	// To use SCSS lint, specific the config location here
	//"scssLintConfig": "assets/.scss-lint.yml",

	// If you want to use ruby sass (albeit slower) for compatibility reasons, then enable this option.
	"useRubySASS": false,

	// Are we using requirejs to build our js output?
	"useRequireJS": false,

	// Should we generate a source map through our requirejs compilation?
	"generateRequireSourcemap": false,

	// Custom RequireJS path definitions
	"requirePaths": {
	},

	// The name of the concatenated app file to generate.
	//'app' will generate app.js and app.min.js (debugMode when disabled).
	"scriptFileName": "app",

	// If you want additional javascript added to your single app file, specify your scripts folder location.
	// Don't make this the same as your jsOutputFolder as that's just for output, not working code.
	//"javascriptFolder": "assets/scripts",

	// Use AMD includes for additional javascript scripts? Alternatively just appends the scripts as a _tmp.js file.
	//"javascriptUseAMD": false,

	// Set to false to avoid using bower altogether. This will speed up nameless a decent amount.
	// Bower will copy all your required .css and .js files into vendor.css and vendor.js.
	// Your bower.json must be present in your project root (the directory you run nameless from).
	"bowerEnabled": true,

	// Automatically merge bower css into the top of our own css file
	"bowerMergeCSS": "style.css",

	// Use this to override nameless if it isn't copying the particular
	// bower components that you require.
	"bowerFiles": {
		// Example
		/*"modernizr": {
			files: [
				"modernizr.js"
			]
		}*/
	},

	// Use this to specifiy bower components which should be included before anything else.
	"bowerPriorities": [
		"jquery.js"
	]
};
