'use strict';
//===========================================================================================================
//1. Définition des routes
//===========================================================================================================
var myApp = angular.module('myApp', ['ngRoute','ngCookies','ajoslin.mobile-navigate','ngMobile','gettext', 'ngSanitize','myControllers','ui.bootstrap']);
myApp.config(['$routeProvider',
   function($routeProvider) {
     $routeProvider.
       when('/abandon', {
         templateUrl: 'template/abandon.html',
         controller: 'abandonCtrl'
       }).
       when('/creation', {
         templateUrl: 'template/creation.html',
         controller: 'creationCtrl'
       }).
       when('/password/:id', {
         templateUrl: 'template/password.html',
         controller: 'passwordCtrl'
       }).
       when('/password', {
         templateUrl: 'template/password.html',
         controller: 'passwordCtrl'
       }).
       when('/friends', {
         templateUrl: 'template/friends.html',
         controller: 'friendsCtrl'
       }).
       when('/newpwd/:id', {
         templateUrl: 'template/setupPassword.html',
         controller: 'setupPasswordCtrl'
       }).
       when('/validation/:id', {
         templateUrl: 'template/validation.html',
         controller: 'validationCtrl'
       }).
       otherwise({
         templateUrl: 'template/login.html',
         controller: 'loginCtrl'
       });
	   
   }]);
   
//===========================================================================================================
//2. Récupération de la langue d'affichage éventuellement par défaut
//===========================================================================================================
myApp.run(function (gettextCatalog) {
	if (localStorage.getItem('lang')) {
		var langue = localStorage.getItem('lang');
	}
	else {
		var langue = navigator.language || navigator.userLanguage
		if (langue==undefined) {langue='en'};
		langue=langue.substr(0,2);
		localStorage.setItem('lang',langue);
	}

    //On met à jour la langue du catalogue
	gettextCatalog.currentLanguage = langue;
    gettextCatalog.debug = true;
	
});

//===========================================================================================================
//3. On appelle le fichier dont on a besoin pour les traductions
//===========================================================================================================
angular.module('myApp').run(['gettextCatalog', function (gettextCatalog) {
/* jshint -W100 */
    gettextCatalog.setStrings('en', {"Activation d'un nouveau compte utilisateur":"Activating a new account","Adresse e-mail":"Email","Connexion":"Connection","Contrôle répéter Mot de passe":"Control repeat Password","Contrôle: répéter Mot de passe":"Control repeat Password","Création d'un nouveau compte utilisateur":"Creating a new user account","Créer un compte gratuitement":"Create a free account","Des projets et des listes sans limite":"Unlimited projects and lists","Entre 6 et 30 caractères":"Between 6 and 30 characters","Envoi demande":"sending request","Impossible d'activer votre compte, un incident est survenu.<br>Vérifier votre saisie.":"Unable to activate your account, an incident occurred. <br> Check your entry.","Impossible de créer votre compte, est incident est survenu.<br>Vérifier votre saisie.":"Unable to create your account is incident occurred. <br> Check your entry.","Impossible de mettre à jour votre mot de passe. Le code passé est erroné":"Unable to update your password. Past code is wrong","Impossible de mettre à jour votre mot de passe. Le code passé est obsolète":"Unable to update your password. The past is obsolete code","Le lien n'est pas correct, impossible d'activer votre compte":"The link is not correct, you can not activate your account","Le lien n'est pas correct, impossible de saisir votre nouveau mot de passe":"Enter your new password","Mot de Passe perdu?":"Forgotten password?","Mot de passe":"Password","Mot de passe: 6 à 30 car.":"Password: 6-30 characters","Nous n'avons pas trouvé vos identifiants dans notre base, contrôllez votre identifiant et votre mot de passe.":"We did not find your username in our database, check your username and password.","Nous n'avons pas trouvé votre email dans notre base.":"We have not found your email in our database.","Nouveau mot de passe":"New password","Redéfinissez votre mot de passe":"Reset password","Rester connecté":"Keep connected","Retour identification":"Back identification","Saisissez votre nouveau mot de passe":"Enter your new password","Un compte avec cet email existe déjà!":"An account with this email already exists!","Un email vous a été envoyé vous permettant de réinitialiser votre mot de passe.":"An email was sent to you allowing you to reset your password.","Un incident a eu lieu avec le serveur. <br>Merci d'essayer à nouveau.":"An incident occurred with the server. Thank you to try again.","Un incident a eu lieu avec le serveur. Merci d'essayer à nouveau.":"An incident occurred with the server. Thank you to try again.","Vos mots de passe sont différents, merci de corriger votre saisie":"Your passwords are different, thank you to correct your entry","Votre compte a été activé. <br>Vous pouvez maintenant accéder à notre service et vous identifier.":"Your account has been activated. <br> You can now access our service and identify you.","Votre compte a été créé. <br>Pour qu'il soit valide, vous devez cliquer sur le lien qui vous a été adressé par email.":"Your account is awaiting validation. Please click on the link that was sent to you by email.","Votre compte est en attente de validation. Veuillez cliquer sur le lien qui vous a été adressé par email.":"Your account is awaiting validation. Please click on the link that was sent to you by email.","Votre mot de passe a été modifié, vous pouvez vous identifier.":"Your password has been changed, you can identify.","Votre nom: 3 à 50 car.":"Your name: 3-50 characters"});
    gettextCatalog.setStrings('it', {"Activation d'un nouveau compte utilisateur":"Attivare un nuovo account","Adresse e-mail":"E-mail","Connexion":"Entra","Contrôle répéter Mot de passe":"Controllo ripetizione password","Contrôle: répéter Mot de passe":"Controllo ripetizione password","Création d'un nouveau compte utilisateur":"Creazione di un nuovo account utente","Créer un compte gratuitement":"Creare un account gratuito","Des projets et des listes sans limite":"Progetti e liste illimitate","Entre 6 et 30 caractères":"Tra 6 e 30 caratteri","Envoi demande":"invio richiesta","Mot de Passe perdu?":"Password dimenticata?","Mot de passe":"Password","Mot de passe: 6 à 30 car.":"Password: 6-30 caratteri","Nouveau mot de passe":"Nuova password","Redéfinissez votre mot de passe":"Resettare la password","Rester connecté":"Rimani connesso","Retour identification":"identificazione Indietro","Saisissez votre nouveau mot de passe":"Inserisci la tua nuova password","Votre nom: 3 à 50 car.":"Il tuo nome: 3-50 caratteri"});
    gettextCatalog.setStrings('de', {"Activation d'un nouveau compte utilisateur":"Aktivieren Sie ein neues Konto","Adresse e-mail":"E-Mail","Connexion":"Anmelden","Contrôle répéter Mot de passe":"Steuer Passwort wiederholen","Contrôle: répéter Mot de passe":"Steuer Passwort wiederholen","Création d'un nouveau compte utilisateur":"Erstellen eines neuen Benutzerkontos","Créer un compte gratuitement":"Ein kostenloses Konto anlegen","Des projets et des listes sans limite":"Unbegrenzte Projekte und Listen","Entre 6 et 30 caractères":"Zwischen 6 und 30 Zeichen","Envoi demande":"Senden Anfrage","Mot de Passe perdu?":"Passwort vergessen?","Mot de passe":"Passwort","Mot de passe: 6 à 30 car.":"Passwort: 6-30 Zeichen","Nouveau mot de passe":"Neues Passwort","Redéfinissez votre mot de passe":"Passwort zurücksetzen","Rester connecté":"bleiben","Retour identification":"Zurück Identifikations","Saisissez votre nouveau mot de passe":"Geben Sie Ihr neues Passwort","Votre nom: 3 à 50 car.":"Ihr Name: 3-50 Zeichen"});
    gettextCatalog.setStrings('zh', {"Activation d'un nouveau compte utilisateur":"激活新帐号","Adresse e-mail":"电子邮件地址","Connexion":"注册","Contrôle répéter Mot de passe":"控制重复密码","Contrôle: répéter Mot de passe":"控制：重复密码","Création d'un nouveau compte utilisateur":"创建一个新的用户帐户","Créer un compte gratuitement":"创建一个免费帐户","Des projets et des listes sans limite":"项目和无限的名单","Entre 6 et 30 caractères":"6至30个字符","Envoi demande":"发送请求","Mot de Passe perdu?":"忘记密码？","Mot de passe":"密码","Mot de passe: 6 à 30 car.":"密码：6-30车。","Nouveau mot de passe":"新密码","Redéfinissez votre mot de passe":"重设密码","Rester connecté":"保持联系","Retour identification":"返回标识","Saisissez votre nouveau mot de passe":"请输入您的新密码","Votre nom: 3 à 50 car.":"你的名字：3-50车。","{{message}}":"{{消息}}"});
    gettextCatalog.setStrings('nl', {"Activation d'un nouveau compte utilisateur":"Het activeren van een nieuwe account","Adresse e-mail":"E-mail","Connexion":"Login","Contrôle répéter Mot de passe":"Controle Herhaal wachtwoord","Contrôle: répéter Mot de passe":"Controle Herhaal wachtwoord","Création d'un nouveau compte utilisateur":"Het creëren van een nieuwe gebruikersaccount","Créer un compte gratuitement":"Maak een gratis account","Des projets et des listes sans limite":" Onbeperkt Projecten en lijsten","Entre 6 et 30 caractères":"Tussen 6 en 30 tekens","Envoi demande":"Verzoek verzenden","Mot de Passe perdu?":"Wachtwoord vergeten?","Mot de passe":"Wachtwoord","Mot de passe: 6 à 30 car.":"Wachtwoord: 6-30 auto.","Nouveau mot de passe":"Nieuw wachtwoord","Redéfinissez votre mot de passe":"Reset wachtwoord","Rester connecté":"Blijf verbonden","Retour identification":"Terug identificatie","Saisissez votre nouveau mot de passe":"Voer uw nieuwe wachtwoord","Votre nom: 3 à 50 car.":"Uw naam: 3-50 auto."});
/* jshint +W100 */
}]);

	if (localStorage.getItem('lang')) {
		var langue = localStorage.getItem('lang');
	}
	else {
		var langue = navigator.language || navigator.userLanguage
		if (langue==undefined) {langue='en'};
		langue=langue.substr(0,2);
		localStorage.setItem('lang',langue);
	}

/*    jQuery.ajax({
        url: 'http://dev.infinyList.com/web/inc/res/'+langue+'-translations.js',
        dataType: 'script',
        async: false,
		success: function(data) {eval(data);}
    });
*/

//===========================================================================================================
//4. Les constantes
//===========================================================================================================
myApp.constant('mySettings', {
    domaine: 'http://dev.infinyList.com'
});
