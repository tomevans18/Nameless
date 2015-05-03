var path = require('path'),
	colors = require('colors');

var requireDict = {};


module.exports = function (grunt) {

	// Find all task files to load
	var files = grunt.file.glob.sync('**/*.{js,coffee}', {cwd: 'tasks'});

	// Load all require information into memory
	files.forEach(function(filename) {
		var taskObj = require(path.join(path.join(global.namelessFolder, 'tasks'), filename));

		if (typeof(taskObj) !== "object") {
			grunt.fail.fatal('Invalid require info for task file "' + filename + '".');
			return;
		}

		requireDict[taskObj.name] = {
			name: taskObj.name,
			file: filename,
			dependencies: taskObj.dependencies,
			obj: taskObj
		};

		// Add to the build list?
		if (taskObj.buildTask === true) {
			addBuildTask(grunt, taskObj.name);
		}
	});

	// Build a list of required modules based on the nameless arguments
	var taskList = [];
	var noTasks = true;

	process.argv.forEach(function (taskname, idx) {
		if (idx > 1 && taskname[0] !== '-') {
			noTasks = false;

			// Add our task name
			taskList.push(resolveTaskname(taskname));
		}
	});

	if (noTasks) {
		global.firstBuild = true;
		
		taskList = grunt.config('buildTasks');
		
		taskList.push('task-watch');
		taskList.push('task-waitexit');
	}

	// Resolve these modules to a list of tasks to load
	var resolvedTasks = [];
	var addedTasks = [];
	var taskStr = "Task list: ";

	var addDependencies = function (dependency) {
		// Is it already present in our list?
		if (addedTasks.indexOf(dependency) !== -1)
			return;

		var reqObj = requireDict[dependency];
		if (reqObj == undefined) {
			grunt.fail.fatal('Unable to resolve dependency "' + dependency + '".');
			return;
		}

		// Recursively add dependencies
		reqObj.dependencies.forEach(addDependencies);

		resolvedTasks.push(reqObj);
		addedTasks.push(reqObj.name);
		taskStr += reqObj.name + " ";
	};

	taskList.forEach(addDependencies);
	console.log("[" + "nameless".green + "] " + taskStr);

	// Finally, load each of our tasks
	var buildTasks = [];

	resolvedTasks.forEach(function (task) {
		try {
			// Load it!
			var success = task.obj.register(grunt);

			// Handle build tasks
			if (task.obj.buildTask) {
				if (!success) {
					var tasks = grunt.config('buildTasks');
					tasks.splice(tasks.indexOf(task.name), 1);
					grunt.config('buildTasks', tasks);
				}
				else {
					buildTasks.push(task.name);
				}
			}
			
		} catch (e) {
			// Something went wrong.
			grunt.fail.fatal('Unable to register task "' + task.name + '".');
		}
	});

	grunt.config('buildTasks', buildTasks);
};

function addBuildTask(grunt, name) {
	var tasks = grunt.config('buildTasks');
	tasks.push(name);
	grunt.config('buildTasks', tasks);
}

// Uses the catch templates to resolve any other task aliases
function resolveTaskname(taskname) {
	for (var obj in requireDict) {
		if (requireDict.hasOwnProperty(obj)) {
			var reqObj = requireDict[obj].obj;
			
			if (reqObj.hasOwnProperty('catchTemplate') &&
				reqObj.catchTemplate.test(taskname))
				return reqObj.name;
		}
	}

	return taskname;
}