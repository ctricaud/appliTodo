//===========================================================================================
//Définition de la liste des controleurs pour l'ajout de liste
//
//1. Le controleur pour la page de login
//
//
//===========================================================================================
var myControllers = angular.module('myControllers', []);
 
//===========================================================================================
//1. Le controleur pour la page de login
//===========================================================================================
myControllers.controller('loginCtrl', function ($scope,$http, $window, gettextCatalog, mySettings) {
	$scope.message="";
	//alert(gettextCatalog.getString("Rester connecté"));
	
	//=====================================================================================
	//On vérifie pour savoir si on n'est pas déjà loggué, dans ce cas on sort
	//=====================================================================================
	if ($window.sessionStorage.getItem('jwt') || $window.localStorage.getItem('jwt')) {
		window.location="../index.html";
	}

	//=====================================================================================
	//Validation du formulaire
	//=====================================================================================
	$scope.login=function() {
	    //On construit le formulaire
		email=$scope.Email;
		var FormData = {
		  'code' : 1,
		  'email' : email ,
		  'password' : $scope.password
		};

		$http.post(mySettings.domaine + '/webservices/auth.php', FormData, {cache:false})
			.success(function(data) { 
				if (data['code']!=undefined) {
					//On récupère le code de retour d'authentification
					code=data['code'];
					
					switch(code) {
						case 0:
							//L'authentification est ok on récupère le jeton
							jwt=data['jwt'];
							
							if ($scope.persistentCookie) {
								//On met le jwt dans le local storage
								$window.localStorage.setItem('jwt',jwt);
							}
							
							//On met le jwt dans le session storage
							$window.sessionStorage.setItem('jwt',jwt);
							
							//On redirige vers l'url si elle a été renseignée
							if ($window.localStorage.getItem('lastUrl')) {
								url=$window.localStorage.getItem('lastUrl');
								$window.localStorage.removeItem('lastUrl')
								window.location=url;
							}
							else {
								//Sinon on redirige vers la page d'accueil
								window.location="../index.html";
							}
							break;
						case 1:
							//L'authentification a échoué
							$scope.message="Nous n'avons pas trouvé vos identifiants dans notre base, contrôllez votre identifiant et votre mot de passe.";
							break;
						case 2:
							//L'authentification est ok on récupère le jeton
							$scope.message="Votre compte est en attente de validation. Veuillez cliquer sur le lien qui vous a été adressé par email.";
							break;
					}
				}
				else {
					$scope.message="Un incident a eu lieu avec le serveur. Merci d'essayer à nouveau.";
				}
			});
	}


   
});


//===========================================================================================
//2. Le controller pour l'abandon
//===========================================================================================
myControllers.controller('abandonCtrl', function ($scope,$http, $window) {
	//On vide le local storage
	$window.localStorage.removeItem('jwt');
	$window.sessionStorage.removeItem('jwt');

   //On renvoie sur la page de login
   window.location="index.html";
   
});


//===========================================================================================
//3. Le controller pour mise à jour du mot de passe
//===========================================================================================
myControllers.controller('passwordCtrl', function ($scope,$http, $window, $routeParams, mySettings) {
  	$scope.Email=$routeParams.id;
	$scope.affBouton=true;
	
	//La fonction de validation
	$scope.envoi=function() {
		var FormData = {
		  'code' : 2,	
		  'email' : $scope.Email 
		};

		$http.post(mySettings.domaine + '/webservices/auth.php', FormData, {cache:false})
			.success(function(data) { 
				if (data['code']!=undefined) {
					//On récupère le code de retour d'authentification
					code=data['code'];
					
					switch(code) {
						case 0:
							//L'envoi du mail de mot de passe s'est bien passé
							$scope.message="Un email vous a été envoyé vous permettant de réinitialiser votre mot de passe."							
							//On désactive le bouton
							$scope.affBouton=false;
							break;
						case 1:
							//L'email n'a pas été trouvé
							$scope.message="Nous n'avons pas trouvé votre email dans notre base.";
							break;
					}
				}
				else {
					$scope.message="Un incident a eu lieu avec le serveur. Merci d'essayer à nouveau.";
				}
			});
	}

});


//===========================================================================================
//4. Le controller pour nouveau mot de passe
//===========================================================================================
myControllers.controller('setupPasswordCtrl', function ($scope,$http, $window, $routeParams, mySettings) {
	
	//On récupère les données
	$q=$routeParams.id;
	$q=$q.split("&")
	
	//On contrôle que c'est correct
	if ($q.length!=2) {
		$scope.message="Le lien n'est pas correct, impossible de saisir votre nouveau mot de passe";
		$scope.affBouton=false;
	}
	else {
		if ($q[0].split("=").length=2) {$id=$q[0].split("=")[1];}
		if ($q[1].split("=").length=2) {$login=$q[1].split("=")[1];}
		
		if ($login && $id) {	
			$scope.affBouton=true;
		}
		else {
		$scope.message="Le lien n'est pas correct, impossible de saisir votre nouveau mot de passe";
		$scope.affBouton=false;
	}
	}
	
	//La fonction de validation
	$scope.valid=function() {
		//On vérifie que les mots de passe correspondent
		if($scope.mdp1!=$scope.mdp2) {
			$scope.message="Vos mots de passe sont différents, merci de corriger votre saisie";
			return;
		}

		var FormData = {
		  'code' : 3,	
		  'password' : $scope.mdp1,
  		  'email' : $login,
		  'id':$id 
		};

		$http.post(mySettings.domaine + '/webservices/auth.php', FormData, {cache:false})
			.success(function(data) { 
				if (data['code']!=undefined) {
					//On récupère le code de retour d'authentification
					code=data['code'];
					
					switch(code) {
						case 0:
							//L'envoi du mail de mot de passe s'est bien passé
							$scope.message="Votre mot de passe a été modifié, vous pouvez vous identifier."							
							//On désactive le bouton
							$scope.affBouton=false;
							break;
						case 1:
							//L'email n'a pas été trouvé
							$scope.message="Impossible de mettre à jour votre mot de passe. Le code passé est erroné";
							break;
						case 2:
							//L'email n'a pas été trouvé
							$scope.message="Impossible de mettre à jour votre mot de passe. Le code passé est obsolète";
							break;
					}
				}
				else {
					$scope.message="Un incident a eu lieu avec le serveur. Merci d'essayer à nouveau.";
				}
			});
	}

});


//===========================================================================================
//5. Le controller pour la création d'un compte
//===========================================================================================
myControllers.controller('creationCtrl', function ($scope,$http, mySettings) {
	$scope.affBouton=true;
	
	//La fonction de validation
	$scope.creation=function() {
		//On vérifie que les mots de passe correspondent
		if($scope.mdp1!=$scope.mdp2) {
			$scope.message="Vos mots de passe sont différents, merci de corriger votre saisie";
			return;
		}

		var FormData = {
		  'code' : 4,	
		  'password' : $scope.mdp1,
  		  'email' : $scope.Email,
		  'nom':$scope.Nom 
		};

		$http.post(mySettings.domaine + '/webservices/auth.php', FormData, {cache:false})
			.success(function(data) { 
				if (data['code']!=undefined) {
					//On récupère le code de retour d'authentification
					code=data['code'];
					
					switch(code) {
						case 0:
							//L'envoi du mail de mot de passe s'est bien passé
							$scope.message="Votre compte a été créé. <br>Pour qu'il soit valide, vous devez cliquer sur le lien qui vous a été adressé par email."							
							//On désactive le bouton
							$scope.affBouton=false;
							break;
						case 1:
							//L'email n'a pas été trouvé
							$scope.message="Impossible de créer votre compte, est incident est survenu.<br>Vérifier votre saisie.";
							break;
						case 2:
							//L'email existe déjà
							$scope.message="Un compte avec cet email existe déjà!";
							break;
					}
				}
				else {
					$scope.message="Un incident a eu lieu avec le serveur. <br>Merci d'essayer à nouveau.";
				}
			});
	}

});


//===========================================================================================
//6. Le controller pour la validation d'un compte
//===========================================================================================
myControllers.controller('validationCtrl', function ($scope,$http, $routeParams, mySettings) {
	//On récupère les données
	$q=$routeParams.id;
	$q=$q.split("&")
	
	//On contrôle que c'est correct
	if ($q.length!=2) {
		$scope.message="Le lien n'est pas correct, impossible d'activer votre compte";
	}
	else {
		if ($q[0].split("=").length=2) {$id=$q[0].split("=")[1];}
		if ($q[1].split("=").length=2) {$login=$q[1].split("=")[1];}
		
		if ($login && $id) {	

			var FormData = {
			  'code' : 5,	
			  'email' : $login,
			  'id':$id 
			};
	
			$http.post(mySettings.domaine + '/webservices/auth.php', FormData, {cache:false})
				.success(function(data) { 
					if (data['code']!=undefined) {
						//On récupère le code de retour d'authentification
						code=data['code'];
						
						switch(code) {
							case 0:
								//Le compte est validé
								$scope.message="Votre compte a été activé. <br>Vous pouvez maintenant accéder à notre service et vous identifier."							
								break;
							case 1:
								//L'email n'a pas été trouvé
								$scope.message="Impossible d'activer votre compte, un incident est survenu.<br>Vérifier votre saisie.";
								break;
						}
					}
					else {
						$scope.message="Un incident a eu lieu avec le serveur. <br>Merci d'essayer à nouveau.";
					}
				});
		}
		else {
			$scope.message="Le lien n'est pas correct, impossible d'activer votre compte";
		}
	}
	

});

//===========================================================================================
//7. Le controleur pour afficher la liste des champs
//===========================================================================================
myControllers.controller('headerController', function ($scope,$http,$window,$route, gettextCatalog, mySettings) {
	//7.1 Les items du menu
	$scope.items = new Array();
	
	$i=$scope.items.push(new Array());
	$scope.items[$i-1]['menu']="Deutsch";
	$scope.items[$i-1]['action']="langue('de')";

	$i=$scope.items.push(new Array());
	$scope.items[$i-1]['menu']="Dutch";
	$scope.items[$i-1]['action']="langue('nl')";

	$i=$scope.items.push(new Array());
	$scope.items[$i-1]['menu']="English";
	$scope.items[$i-1]['action']="langue('en')";

	$i=$scope.items.push(new Array());
	$scope.items[$i-1]['menu']="Français";
	$scope.items[$i-1]['action']="langue('fr')";
	
	$i=$scope.items.push(new Array());
	$scope.items[$i-1]['menu']="Italiano";
	$scope.items[$i-1]['action']="langue('it')";
	
	$i=$scope.items.push(new Array());
	$scope.items[$i-1]['menu']="机器";
	$scope.items[$i-1]['action']="langue('zh')";

	
	$scope.langue=function(l) {
		//On met la langue dans les informations stockées
		$window.localStorage.setItem('lang',l);
		gettextCatalog.currentLanguage=l;
		window.document.getElementById("dropdown-toggle").click();
		
		//window.location.reload(true);
		   
	}
   
});

