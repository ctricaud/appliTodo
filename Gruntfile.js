module.exports = function(grunt) {
	grunt.loadNpmTasks('grunt-angular-gettext');

	grunt.initConfig({
	  nggettext_extract: {
		pot: {
		  files: {
			'po/template.pot': ['www/account/template/*.html']
		  }
		},
	  },
	});
	
//*	
grunt.initConfig({
	  nggettext_compile: {
		all: {
		  options: {
			module: 'myApp'
		  },
		  files: {
			'www/inc/res/it-translations.js': ['po/it.po'],
			'www/inc/res/en-translations.js': ['po/en.po'],
			'www/inc/res/nl-translations.js': ['po/nl.po'],
			'www/inc/res/zh-translations.js': ['po/zh.po'],
			'www/inc/res/de-translations.js': ['po/de.po']
		  }
		},
	  },
	})
//*/
}