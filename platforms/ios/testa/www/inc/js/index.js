var traitement=false;
//window.sessionStorage.removeItem("url")
if (window.sessionStorage.getItem("url")!=undefined) {traitement=true;};

var app = {
    initialize: function() {
        this.bindEvents();
    },
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
        //window.addEventListener('load', this.onLoad, false);
    },
    onDeviceReady: function() {
		CDV.WEBINTENT.hasExtra(CDV.WEBINTENT.EXTRA_TEXT, 
			function(has) {origine=has;}
		);
		if (origine && !traitement) {	
			CDV.WEBINTENT.getExtra(CDV.WEBINTENT.EXTRA_TEXT, 
				function(url) {
					window.sessionStorage.setItem("url",url);
					window.location="parse/index.html";
				}
			);		
		}
    },
	onLoad: function() {
		url="http://m.maisonsdumonde.com/FR/fr/produits/fiche/assiette-plate-taupe-petit-pois-136749.htm";
		window.sessionStorage.setItem("url",url);
		if (!traitement) window.location="parse/index.html";
	}
};

