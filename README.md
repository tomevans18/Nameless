# nameless

Simple front end build automation.

## EditorConfig

"EditorConfig helps developers define and maintain consistent coding styles between different editors and IDEs. The EditorConfig project consists of a file format for defining coding styles and a collection of text editor plugins that enable editors to read the file format and adhere to defined styles. EditorConfig files are easily readable and they work nicely with version control systems."

###EditorConfig Plugins

- [**All plugins**](http://editorconfig.org/#download)
- [**Visual Studio**](https://github.com/editorconfig/editorconfig-visualstudio#readme)
- [**Sublime**](https://github.com/sindresorhus/editorconfig-sublime#readme) - Install ```EditorConfig``` with [Package Control](https://packagecontrol.io) and restart Sublime
- [Atom](https://github.com/sindresorhus/atom-editorconfig#readme) - Settings → Packages → Search for ```editorconfig```
- [**Notepad++**](https://github.com/editorconfig/editorconfig-notepad-plus-plus#readme)
- [**Brakets++**](https://github.com/kidwm/brackets-editorconfig/)


## Features

- **Automation**
	- *Sass* - [Sass](http://sass-lang.com/) files are also compiled and concatenated into individual .css files, allowing multiple 'main' stylesheets.
	- *LESS* - //TODO
	- *Coffeescript* - [Coffeescript](http://coffeescript.org/) is compiled and concatenated into a single app.js file, and minified as necessary.
	- *Prototyping* - When working on the initial static build, nameless will serve up html files on a local webserver.
	- *Templating* - While prototyping, [multiple template engines](https://github.com/visionmedia/consolidate.js/#supported-template-engines) can be selected which will be automatically processed, served to the browser and also watched for changes.
	- *Livereload* - All asset files, including static html, are watched for changes and will instantly update in the browser.
	- *Bower* - Any [Bower](http://bower.io/) components installed are automatically found and merged into vendor.css and vendor.js files for easy addition. [Bower](http://bower.io/) is also watched so that installing any additional components will also update the browser.
	- *Extensible* - Any other automation features are easily added without interfering with existing features, or breaking backwards-compatibility with older nameless projects.
	- *Autoprefixer* - Optionally use Autoprefixer to vendor-prefix your CSS properties using the Can I Use database. 


- **Configuration**
	- *Highly configurable* - nameless is designed to be able to adapt to any project through it's configuration. All automation features are configurable, and other options for this are easily added.
	- *Modular* - Modules that aren't being used ([Bower](http://bower.io/), [Sass](http://sass-lang.com/), etc) aren't even loaded if they aren't necessary, speeding up load and watch times.
	- *Extensive error checking* - The configuration is parsed and checked extensively, giving a verbose error if anything is misconfigured.

- **Setup**
	- *Easy* - nameless is configured as a global module and only needs to be installed once on a machine.
	- *Maintainable* - Having nameless as a global app means easy updates and no disparity between versions.
	- *Scaffold* - nameless can generate a simple boilerplate file structure for easily starting new projects.
	- *Notifications* - If you are on a mac, or have [Growl](http://www.growlforwindows.com/gfw/) installed on windows, nameless gives popup notifications informing you of errors or successful builds.

- **Tasks**



## Usage

Install nameless globally `npm install git://github.com/tomevans18/nameless.git -g`

Create a scaffold project `nameless setup`

Initialise bower modules `bower install`

Build your project `nameless`

Modify your **nameless_config.js** file in the root folder to configure nameless.

