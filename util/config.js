var fs = require('fs'),
	path = require('path');

module.exports = {
	verifyConfig: verifyConfig,
	loadConfig: loadConfig,
	validateConfig: validateConfig
}

// Checks the loaded configuration for any inaccuracies
function verifyConfig(grunt) {
	// Make sure certain values are present
	var config = grunt.config('config');
	var requiredValues = [
		['debugMode', 'boolean'],
		['prototyping', 'boolean']
	];

	requiredValues.forEach(function (value) {
		// Does it exist?
		if (!config.hasOwnProperty(value[0])) {
			grunt.fail.warn("Unable to find " + value[1] + " property '" + value[0] + "' in config. Please set to continue.");
			return;
		}

		// Is it of the right type?
		if (typeof(config[value[0]]) !== value[1]) {
			grunt.fail.warn("Property '" + value[0] + "' is a " + typeof(config[value[0]]) + " when it " +
							"needs to be a " + value[1] + ". Please fix to continue.");
			return;
		}
	});
}

// Loads the custom configuration file
function loadConfig(grunt) {
	// Require our javascript config file
	var fs = require('fs');
	var config = null;
	var potentialPaths = [
		grunt.config('wd') + '/nameless_config.js'
	];

	potentialPaths.forEach(function (value) {
	if (fs.existsSync(value))
		config = require(value);
	});

	if (!config) {
		grunt.fail.warn("Unable to locate 'nameless_config.js' file. Please place it in the root folder.");
		return false;
	}

	grunt.config('config', config);
	return true;
}

function validateConfig(grunt, config) {
	// Validate each field
	for (var field in config) {
	   if (config.hasOwnProperty(field)) {
			var validators = config[field][0];
			var message = config[field][1];

			// Test each validator
			validators.forEach(function (validator) {
				if (!testValidator(grunt, field, validator)) {
					grunt.fail.warn(validator + " -- " + message);
					return false;
				}
			});
	   }
	}

	return true;
};

// Tests a field for a certain validation condition
function testValidator(grunt, field, validator) {
	// Split the validation type and arguments
	var split = validator.split(':');
	var type = split[0];
	var arg = (split.length > 1) ? split[1] : '';
	var fieldValue = grunt.config('config.' + field);

	// What kind of validation?
	var fn = validations[type];
	if (!fn) {
		return false;
	}

	// Is it satisfied?
	return fn(grunt, fieldValue, arg);
}

var validations = {
	"pathExists": function (grunt, fieldValue) {
		return fs.existsSync(path.join(grunt.config('wd'), fieldValue));
	},

	"type": function (grunt, fieldValue, arg) {
		if (arg === 'array')
			return fieldValue instanceof Array;
		return typeof(fieldValue) === arg;
	},

	"notEmptyString": function (grunt, fieldValue) {
		return fieldValue !== "";
	},

	"notZero": function (grunt, fieldValue) {
		return fieldValue != 0;
	}
};
