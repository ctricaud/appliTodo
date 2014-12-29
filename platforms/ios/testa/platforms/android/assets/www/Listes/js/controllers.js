//===========================================================================================
//Définition de la liste des controleurs
//
//0. Les fonctions dont on a besoin
//
//1. Le controleur pour la liste des listes
	//1.0 La fonction de lecture des listes
	//1.1 Appel à la fonction de lectures des listes
	//1.2 Lancement du rafraichissement de la liste des listes
	//1.3 Récupération du filtre de la liste des listes
	//1.4 Appel de la fenêtre modale pour afficher le filtre
	//1.4b Gestion du retour de la fenêtre modale
	//1.5 Le tri de la liste des listes
	//1.6 Appel de la fenêtre modale pour le tri des listes
	//1.6b Gestion du retour de la fenêtre modale de tri des listes
	//1.7 Lancement du scan dans le cas de l'appli
	//1.8 Fermeture de l'application
//
//2.a Le controleur pour la boite modale de filtre
//2.b Le controleur pour la boite modale de tri
//
//3. Le controleur pour l'ajout d'une liste
//
//4. Le controleur pour les détails d'une liste
	//4.0 La fonction d'affichage du template d'un enrengistrement
	//4.1 Récupération des informations générales sur la liste
	//4.2 Récupération du contenu de la liste et traitement
	//4.3 Filtre des éléments de la liste
	//4.4 Finction de checkDefaut: la case à cocher dans le titre du noeud
	//4.6 Suppression d'un enregistrement
	//4.7 Création d'un enregistrement
	//4.8 Ajout d'un commentaire
	//4.9 Modification d'un enregistrement
	//4.10 Filtre des enregistrements
	//4.11 Tri des enregistrements
	//4.7a	Boite modale de création d'un enregistrement
	//4.8a 	Boite modale d'ajout d'un commentaire
	//4.9a	Boite modale de modification d'un enregistrement
	//4.10a Boite modale de filtre des enregistrements
	//4.11a Boite modale de tri des enregistrements
//
//5. Le controleur pour la liste des champs
//
//6. Le controleur pour afficher les options d'une liste
//
//7. Le controleur pour le header
//===========================================================================================
var listesControllers = angular.module('listesControllers', []);

//===========================================================================================
//0. Les fonctions dont on a besoin
//===========================================================================================
function copy(o) {
  var copy = Object.create(Object.getPrototypeOf(o));
  var propNames = Object.getOwnPropertyNames(o);

  propNames.forEach(function(name) {
    var desc = Object.getOwnPropertyDescriptor(o, name);
    Object.defineProperty(copy, name, desc);
  });

  return copy;
}

function br2nl(str) {
	if (typeof str =="string") {
	    return str.replace(/<br\s*\/?>/mg,"\n");
	}
	else {
		return str;
	}
}

function nl2br(str) {
	if (typeof str =="string" && str != undefined) {
	    return str.split('\n').join('<br />');
	}
	else {
		return str;
	}
}

function adrtoquery(str) {
	if (typeof str =="string" && str != undefined) {
	    return encodeURIComponent(str.replace(/<br\s*\/?>/mg,","));
	}
	else {
		return str;
	}
}

function timeConverter(saisie,parametre){
	var a = new Date(saisie*1000);
	//var months = ['Jan','Fév','Mar','Avr','Mai','Jun','Jul','Aou','Sep','Oct','Nov','Déc'];
	//var year = a.getFullYear();
	//var month = months[a.getMonth()];
	//var date = a.getDate();
	//var hour = a.getHours();
	//var min = a.getMinutes();
	//var sec = a.getSeconds();
	//var time = date+' '+month+' '+year+' '+hour+':'+min+':'+sec ;
	//return time;
	if (parametre==undefined) {
		return a.toLocaleString();}
	else if (parametre='date') {
		return a.toLocaleDateString();}
 }
 
 function diffDate(date1) {
	var d1=new Date(date1*1000);
	var d2=new Date(); 

	var t2 = d2.getTime();
	var t1 = d1.getTime();

	a=d2.getFullYear()-d1.getFullYear();
	b=d2.getMonth()-d1.getMonth();

	if (b<0) {a-=1;b+=12;}
	if (a==0 && b==0) {
        c = parseInt((t2-t1)/(24*3600*1000*7));
		d = parseInt((t2-t1)/(24*3600*1000));
		if (c==0) {valeur=d+'j';}
		else {valeur=c+'sem '+(d-c*7)+'j';}
	}
	else {
		if (a==0) {
			c = parseInt((t2-t1)/(24*3600*1000*7));
			if (c==0) {valeur=b+' m';}
			else {valeur=b+'m ';}
		}
		else {
			valeur=a+'a';
			if (b>0) {
				valeur+=' '+b+'m';
			}
		}
	}
			
	return valeur;
 }
 
 function retourLigne(saisie) {
	 if (saisie != undefined) {
		 return saisie.split('/').join('/ ');
	 }
 }
 
//===========================================================================================
//1. Le controleur pour la liste des listes
//===========================================================================================
listesControllers.controller('ListesCtrl', function ($scope,$http, $cookieStore, $modal, $log, mySettings) {	
	$scope.app = (navigator.app == undefined) ? false : true;

	//1.0 Fonction pour récupérer la liste des listes disponibles
	function lectureListes(action) {
		$http.get(mySettings.domaine+'/webservices/listes.php?code=1').success(function(data) {
								$scope.listes=data;
								$scope.listesLength=Object.keys(data).length
								})
	}

	//1.1 Lecture initiale de la liste des listes
	lectureListes();

	//1.2 On répète cela sur un intervelle de 5 secondes pour mettre à jour les informations
	//$interval(function(){lectureListes();},5000)


	//1.3 Le filtre de la liste en fonction des paramètres de filtre
	$scope.filtre=$cookieStore.get("filtreListe");

	if ($scope.filtre==undefined){
		$scope.filtre = {'archive':false, 'modele':0, 'nom':''};
	}

 	$scope.filtreListe = function() {
	  return function( input ) {
		  	$value=true;
		  	//a. Sur l'archivage
			if (!$scope.filtre['archive']) {if (input.archive == 1) {$value=false;}}
			
			//b. sur le modèle concerné
			if ($scope.filtre['modele']!=0 && $scope.filtre['modele']!=''&& $scope.filtre['modele']!=null) {
				if (input.idModele !=$scope.filtre['modele']) {$value=false;}}
			
			//c. sur le nom de la liste	
			if ($scope.filtre['nom']!='') {
				if (input.lst_nom.indexOf($scope.filtre['nom'])==-1) {$value=false;}}
			return $value;
	  };
	};

	//1.4 La fonction pour afficher la mode modale dans le cas du filtre  
 	$scope.openFiltre = function () {
		var modalInstance = $modal.open({
		  templateUrl: 'Listes/template/modal/modalFiltre.html',
		  controller: ModalInstanceCtrl,
		  resolve: {
			filtre: function () {
				return $scope.filtre;
			}
		  }
		});

	//1. 4.b La gestion du retour quand la boite modale est fermée
    modalInstance.result.then(function (selectedItem) {
      	//On le sauvegarde dans le cookie
		$cookieStore.put("filtreListe",$scope.filtre);			    
    }, function () {
    });
  };

	//1.5 le tri de la liste
	$scope.tri=$cookieStore.get("triListe");
	if ($scope.tri==undefined){
		$scope.tri = {'champ':'lst_nom', 'ordre':false};
	}

	//1.6 La fonction pour afficher la mode modale dans le cas du filtre  
 	$scope.openTri = function () {
		var modalInstance = $modal.open({
		  templateUrl: 'Listes/template/modal/modalTri.html',
		  controller: ModalInstanceCtrlTri,
		  resolve: {
			tri: function () {
			  return $scope.tri;
			}
		  }
		});

	//1. 6.b La gestion du retour quand la boite modale est fermée
    modalInstance.result.then(function (selectedItem) {
      	//On le sauvegarde dans le cookie
		$cookieStore.put("triListe",$scope.tri);
    }, function () {
    });
  };
  
});


//===========================================================================================
//2.a Le controleur pour la boite modale de filtre
//===========================================================================================
var ModalInstanceCtrl = function ($scope, $http, $modalInstance, filtre, mySettings) {
	$scope.filtre = filtre;
	$scope.filtre2=copy(filtre);

	//1.2 Lecture de la liste des modèles
	$http.get(mySettings.domaine+'/webservices/listes.php?code=2').success(function(data) {$scope.modeles=data;})

	$scope.ok = function (a) {
		//On met à jour les valeurs
		$scope.filtre['archive']=a['archive'];
		$scope.filtre['nom']=a['nom'];
		$scope.filtre['modele']=a['modele'];
		
		$modalInstance.close();
	};
	
	$scope.reset = function (a) {
		//On met à jour les valeurs
		a['archive']=false;
		a['nom']='';
		a['modele']=0;
	};
	
	$scope.cancel = function () {
		$modalInstance.dismiss('cancel');
	};
};


//===========================================================================================
//2.b Le controleur pour la boite modale de tri
//===========================================================================================
var ModalInstanceCtrlTri = function ($scope, $modalInstance, tri) {
	$scope.tri = tri;
	$scope.tri2=copy(tri);
	
	$scope.ok = function (a) {
		//On met à jour les valeurs
		$scope.tri['champ']=a['champ'];
		$scope.tri['ordre']=a['ordre'];
		
		$modalInstance.close();
	};
	
	$scope.cancel = function () {
		$modalInstance.dismiss('cancel');
	};
};



//===========================================================================================
//3. Le controleur pour l'ajout d'une liste
//===========================================================================================
listesControllers.controller('ListesAjout', function ($scope,$http, mySettings) {
	$scope.addListe = function() {
	    var FormData = {
		  'lst_nom' :$scope.newListe ,
		  'idModele':$scope.newModele._id.$id
		};

		$http.post(mySettings.domaine + '/webservices/listes.php?code=3', FormData, {cache:false}).success(function(data) {	
			$scope.newListe='';
			window.location="#/liste/"+data;
		})
	};
	
	//Lecture de la liste des modèles
	$http.get(mySettings.domaine + '/webservices/listes.php?code=2').success(function(data) {$scope.modeles=data;})
});


//===========================================================================================
//4. Le controleur pour les détails d'une liste
//
//4.0 La fonction qui affiche le contenu d'un enregistrement en fonctionde la template de la liste
//4.1 Récupération des informations sur la liste qui est concernée, avec les valeurs calculées
//4.2 Récupération de tous les enregistrements de la liste
//4.3 Les informations sur les filtres à appliquer sur la liste
//4.4 Foncrtion pour activer ou desactiver les checkDefaut quand présent
//4.5 Les informations sur les critères de tri
//4.6 Suppression d'un enregistrement
//4.7 Ajout d'un enregistrement
//4.8 Ajout d'un commentaire à un enregistrement déjà existant
//4.9 Suppression d'un enregistrement
//4.10 Appel à la fenêtre modale pour un filtre
//4.11 Appel à la fenêtre modale pour un tri
//===========================================================================================
listesControllers.controller('ListeDetail', function ($scope,$http,$routeParams,$modal, $filter, $sanitize, $cookieStore, mySettings) {
   	$scope.idListe = $routeParams.idListe;
	if ($scope.idListe.indexOf('-')>0 ) {
		$scope.idCat=$scope.idListe.substr($scope.idListe.indexOf('-')+1);
		$scope.idListe=$scope.idListe.substr(0,$scope.idListe.indexOf('-'));
	}
	$scope.categories=[];
	$scope.index=[];
	
	//===========================================================================================
	//4.0 La fonction d'affichage du template
	//===========================================================================================
	$scope.affTemplate=function(row,template) {
		//On récupère la template d'affichage
		b=eval('$scope.'+template);

		if (b!=undefined) {
			for ($i=0;$i<$scope.liste.champs.length;$i++) {
				//On parcourt la liste des champs
				a=row[$scope.liste.champs[$i]['nomChamp']];
				if (typeof a== 'string') {a=$sanitize(a);}

				//On regarde s'il y a une fonction à appliquer
				if ($scope.liste.champs[$i].affichageFonction != undefined && a !=undefined) {
					switch ($scope.liste.champs[$i].affichageFonction) {
						case 'retourLigne':
							a=retourLigne(a);
							break;
							
						case 'timeConverter':
							a=timeConverter(a)
							break;	
	
						case 'timeConverterDate':
							a=timeConverter(a,'date')
							break;	
					}
				}
				
				
				//On applique les valeurs en remplaçant les champs par leur valeurs				
				for ($j=0;$j<6;$j++) {
					if (a!=undefined) {
						b=b.replace('q=r['+$scope.liste.champs[$i]['nomChamp']+']','q='+adrtoquery(a));
						b=b.replace('r['+$scope.liste.champs[$i]['nomChamp']+']',a);
					}
					else {
						b=b.replace('r['+$scope.liste.champs[$i]['nomChamp']+']','');
					}
				}
			}
			return b;
		}
	}
	

	//===========================================================================================
	 //4.1 On récupère les informations sur la liste qui est affichée
	//===========================================================================================
	$http.get(mySettings.domaine + '/webservices/listes.php?code=4&idListe='+$scope.idListe).success(function(data) {
		//4.1.1 On récupère toutes les informations sur la liste
		$scope.liste=data;

		//4.1.2 On récupère le champ par défaut de chaque enregistrement
		$scope.champDefaut=$scope.liste.champs[$scope.liste['champDefaut']].nomChamp;

		//4.1.3 On récupère l'ordre de tri par défaut
		//$scope.ordreTri=['-__cat',$scope.champDefaut];
		
		//4.1.4a On récupère la template d'affichage des données de chaque enregistrement (cf 4.0)
		$scope.templateAff=$scope.liste['templateAff'];
		
		//4.1.4b On récupère la template d'affichage des données pour les catégories (cf 4.0)
		$scope.templateCat=$scope.liste['templateCat'];
		
		//4.1.5 On récupère le filtre par défaut
		$scope.filtreDefaut=$scope.liste['filtreDefaut'];;
		
		//4.1.6 On récupère le filtre en cookie pour la liste
		$scope.filtreListe=($scope.liste.filtreListe==undefined) ? $scope.filtreDefaut : $scope.liste.filtreListe;
		
		//4.1.7 On récupère la template d'affichage du filtre
		$scope.templateFiltre=$scope.liste['templateFiltre'];;
		
		//4.1.8 On récupère le tri par défaut
		$scope.triDefaut=$scope.liste['triDefaut'];
		$scope.triDefaut['arbre']=false;
		
		//4.1.9 On récupère le tri en cookie pour la liste
		$scope.triListe=($scope.liste.triListe==undefined) ? $scope.triDefaut : $scope.liste.triListe;
		if ($scope.triDefaut['arbre']==undefined) {$scope.triDefaut['arbre']=false;}
		
		//4.1.10 On récupère la template d'affichage du filtre
		$scope.templateTri=$scope.liste['templateTri'];
		
		//4.1.11 On modifie la template pour l'appli mobile
		if (navigator.app !=undefined) {
			$scope.templateAff=$scope.templateAff.split('<a href="').join('<a onclick="navigator.app.loadUrl(\'');
			$scope.templateAff=$scope.templateAff.split('" target=_new>').join('\', { openExternal:true });return false;">');
		}
		
		//4.1.12 On fait la mise à jour des informations sur la liste 
		$scope.majListe();
	})

	//===========================================================================================
	 //4.2 On récupère le contenu de la liste
	//===========================================================================================
	 //4.2.1 la fonction qui récupère la liste
	 $scope.majListe = function (Preserv) {
		if (Preserv) {oldRows=$scope.rows;}

		$http.get(mySettings.domaine + '/webservices/listes.php?code=10&idListe='+$scope.idListe).success(function(data) {
			//4.2.1.1 Les données  de la liste
			$scope.rows=data;
			
			//4.2.1.2 Le nombre de lignes qu'on récupère
			$scope.rowsLength=Object.keys(data).length;
			
			//4.2.1.3 On met à jour l'état de chaque ligne (plié) et le nombre lignes contenus(0)
			$scope.categories=[];
			$scope.rows.forEach (function(row) {
				row['__etat'] = ($scope.idCat !=undefined && (row['__idCat']==$scope.idCat || row['_id']['$id'] == $scope.idCat)) ? 1 : 0;
				
				//C'est une catégorie
				if (row['__cat']==1) {
				}
			});
	
			//4.2.1.4 On extraie les catégories de l'ensemble des données remontées
			$scope.majCategories();	
			
			//4.2.1.5 On calcule le nombre d'éléments de chaque catégorie
			calculIndex($scope.rows);
			
			//4.2.1.6 On rétablit l'ouverture des catégories
			if (Preserv) {
				$scope.rows.forEach (function(row) {
					oldRows.forEach (function(oldRow) {
						if (oldRow._id.$id==row._id.$id) {
							row['__etat']=oldRow['__etat'];
						}
					});
				});
				oldRows= [];
			}
			
			//4.2.1.7 On fait les éventuels calculs sur les zones de calcul
			calculCalculs();
		 })
		}
	 
		//4.2.2 La fonction pour effectuer les calculs à l'intérieur d'une row
		function calculCalculs (r) {
			//Lorsque r est spécifié, on ne le fait que pour cette ligne sinon pour toutes les lignes
			for ($i=0;$i<$scope.liste.champs.length;$i++) {
				if ($scope.liste.champs[$i].type=='6') {
					//C'est un calcul on fait en fonction des formules qui sont passées
					switch ($scope.liste.champs[$i].affichageFonction) {
						case 'diffDate' :
							//On cherche le paramètre de la fonction
							for ($j=0;$j<$scope.liste.champs[$i].regles.length;$j++) {
								if ($scope.liste.champs[$i].regles[$j].regleNum=='5') {
									champ0=$scope.liste.champs[$i].regles[$j].valeur;
									break;
								}
							}
							
							//On récupère la valeur
							if (champ0!=undefined) {
								if (r==undefined) {
									$scope.rows.forEach (function(row) {
										row[$scope.liste.champs[$i].nomChamp]=diffDate(row[champ0]);
									});
								}
								else {
									r[$scope.liste.champs[$i].nomChamp]=diffDate(r[champ0]);
								}
							}
							break;


						case 'rapport' :
							//On cherche les paramètre de la fonction
							decimales=0;
							for ($j=0;$j<$scope.liste.champs[$i].regles.length;$j++) {
								if ($scope.liste.champs[$i].regles[$j].regleNum=='5') {
									champ=$scope.liste.champs[$i].regles[$j].valeur.split(',');
								}
								if ($scope.liste.champs[$i].regles[$j].regleNum=='1') {
									decimales=$scope.liste.champs[$i].regles[$j].valeur;
								}
							}
							
							//On récupère la valeur
							if (champ.length>1) {
								if (r==undefined) {
									$scope.rows.forEach (function(row) {
										row[$scope.liste.champs[$i].nomChamp]=(parseFloat(row[champ[0]])/parseFloat(row[champ[1]])).toFixed(decimales);
									});
								}
								else {
									r[$scope.liste.champs[$i].nomChamp]=(parseFloat(r[champ[0]])/parseFloat(r[champ[1]])).toFixed(decimales);
								}
							}
							break;

						}	//Calcul en fonction de la fonction passée
					}	//Test sur le type de champs


					
				if ($scope.liste.champs[$i].type=='2') {
					//C'est une consolidation on fait en fonction des formules qui sont passées
					switch ($scope.liste.champs[$i].affichageFonction) {
						case 'sommeRecursive' :
							//On cherche le paramètre de la fonction
							for ($j=0;$j<$scope.liste.champs[$i].regles.length;$j++) {
								if ($scope.liste.champs[$i].regles[$j].regleNum=='5') {
									champ0=$scope.liste.champs[$i].regles[$j].valeur;
									break;
								}
							}
							
							//On récupère la valeur
							if (champ0!=undefined) {
								$scope.rows.forEach (function(row) {
									if (row['__cat']!=0){
										row[$scope.liste.champs[$i].nomChamp]=sommeRecursive(row._id.$id,champ0);
									}
								});
							}
							break;
						}	//Calcul en fonction de la fonction passée
					}	//Test sur le type de champs
					
				}	//Balayage de tous les champes
		}	//Fermeture de la fonction
 
		//4.2.2.a La boucle de récursivité pour les sommations
		function sommeRecursive(id, champ) {
			tot=0;
			
			$scope.rows.forEach (function(row) {
				if (row['__idCat']==id) {
					if (row['__cat']!=0) {	
						tot+=sommeRecursive(row._id.$id,champ);
					}
					else {
						if (row[champ]!=undefined) {
							tot+=row[champ];
						}
					}
				}
			})
			return tot;
		}
		
		 //4.2.3 La fonction de mise à jour de la liste des catégories
		 $scope.majCategories=function() {
				$scope.categories=[];
				$scope.rows.forEach (function(row) {
					if (row['__cat']==1) {
						$scope.categories.push(row);
					}
				});
		 }
		 
		//4.2.4 La fonction qui compte le nombre de sous noeuds d'un noeud
		//Out pour l'instant, le nombre étant compté automatiquement
		function calculIndex(rows) {
			//b. On calcule les index
			rows.forEach (function(row) {
				if (row['__cat']!=0)  {
					//On remet l'index à 0
					row['__index']=0;
					//On fait défiler l'ensemble des éléments pour voir ceux dont le parent correspond
					rows.forEach (function(r) {
						row['__index']+= ($scope.filtreHierarchique(row._id.$id)(r)) ? 1 : 0;
					})
				}	
			}
		)
		
	}
	
	//4.2.5 On récupère l'information sur la template d'affichage de detailListe.html utilisée pour la récursivité
	$scope.detailRow="Listes/template/detailRow.html";
	
	//===========================================================================================
	 //4.3 les filtres de la liste 
	//===========================================================================================
	//4.3.1 Le filtre pour la présentation hiérarchique
	//On sélectionne les lignes qui sont soient des catégories, soient sont rattachées directement à l'arbre
	//Ce filtre doit se mettre en amont du filtre décidé par l'utilisateur

	$scope.filtreHierarchique = function(cat) {
	  return function( input ) {
		  
		  	$value=false;
			//===========================================================================================
			//a. On traite le filtre en fonction de la catégorie
			//===========================================================================================
			if (cat == undefined || cat=='') {
			  	if ((input['__cat']!=0 && input['__idCat']==0 ) || input['__idCat']==0) {$value=true;}
			}
			else {
				if (input['__idCat']==cat) {$value=true;}
			}

			//===========================================================================================
			//b. On désactive les catégories si demandé
			//===========================================================================================
			if ($scope.triListe!=undefined && $scope.triListe.arbre) {
				if (input['__cat']!=0) {$value=false;}
				else {$value=true;}
			}
			
			//===========================================================================================
			//c. On traite le filtre en fonction du filtreListe seulement sur les enregistrements
			//===========================================================================================
			if (input['__cat']==0) {
				//On déroule tous les éléments dans le filtre
				for (key in $scope.filtreListe) {
					//Inutile de continuer si c'est déjà faux
					if ($value) {

						//En fonction du type de champ on fait le filtrage adéquat
						switch($scope.filtreListe[key].type) {
							case 3:
							case 11:
							//C'est une string
							//C'est une URL
								switch ($scope.filtreListe[key].action) {
									case '0':		//Contient
										if (input[key]==undefined) {$value=false}
										else {
											if (input[key].indexOf($scope.filtreListe[key].valeur)==-1) {$value=false}
										}
										break;
									
									case '1':		//Commence par
										if (input[key]==undefined) {$value=false}
										else {
											if (input[key].indexOf($scope.filtreListe[key].valeur)!=0) {$value=false}
										}
										break ;
										
									
									case '2':		//Se termine
										if (input[key]==undefined) {$value=false}
										else {
							console.log($scope.filtreListe[key].type+" - "+key+" - "+input[key]);
											if (input[key].indexOf($scope.filtreListe[key].valeur)!=-1) {
												if (input[key].lastIndexOf($scope.filtreListe[key].valeur)!=(input[key].length-$scope.filtreListe[key].valeur.length)) {$value=false}
											}
											else {$value=false}
										}
										break;
									
									case '3':		//"Ne contient pas
										if (input[key]==undefined) {$value=false}
										else {
											if (input[key].indexOf($scope.filtreListe[key].valeur)!=-1) {$value=false}
										}
										break;
								}
								break;
							
							case 5:
							case 25:
							//C'est un prix
							//C'est une note
								montant1="";
								montant2="";
								
								if ($scope.filtreListe[key].valeur!=undefined && $scope.filtreListe[key].valeur!='') {
									montant1=$scope.filtreListe[key].valeur;}
									
								if ($scope.filtreListe[key].valeur2!=undefined && $scope.filtreListe[key].valeur2!='') {
									montant2= $scope.filtreListe[key].valeur2;}
									
								if (montant1!="") {	
									switch ($scope.filtreListe[key].action) {
										case '0':	//On prend toutes les montants
											break;
											
										case '1': //On ne prend que les montants entre les deux bornes
											if (input[key]<montant1 || input[key]>montant2 || input[key]==undefined) {$value=false;}	
											break;
											
										case '2': //On ne prend que les montants supérieurs
											if (input[key]<montant1 || input[key]==undefined) {$value=false;}	
											break;
	
										case '3': //On ne prend que les montants inférieurs
											if (input[key]>montant1 || input[key]==undefined) {$value=false;}	
											break;
									}
								}
								break;
							
							case 8:
							case 20:
							//C'est une date
								date1="";
								date2="";
								
								if ($scope.filtreListe[key].valeur!=undefined && $scope.filtreListe[key].valeur!='') {
									date1=Date.parse($scope.filtreListe[key].valeur)/1000}
									
								if ($scope.filtreListe[key].valeur2!=undefined && $scope.filtreListe[key].valeur2!='') {
									date2=Date.parse($scope.filtreListe[key].valeur2)/1000}
								if (date1!="") {	
									switch ($scope.filtreListe[key].action) {
										case '0':	//On prend toutes lesdates
											break;
											
										case '1': //On ne prend que les dates entre les deux bornes
											if (input[key]<date1 || input[key]>date2 || input[key]==undefined) {$value=false;}	
											break;
											
										case '2': //On ne prend que les dates après
											if (input[key]<date1 || input[key]==undefined) {$value=false;}	
											break;
	
										case '3': //On ne prend que les dates avant
											if (input[key]>date1 || input[key]==undefined) {$value=false;}	
											break;
									}
								}
								break;
							
							case 9:
							//C'est une checkbox
								switch ($scope.filtreListe[key].valeur) {
									case '0':	//On prend toutes les cases à cocher c'est bon
										break;
										
									case '1': //On ne prend que les cases qui sont cochées
										if (input[key]!= true) {$value=false;}	
										break;
										
									case '2': //On ne prend que les cases qui ne sont pas cochées
										if (input[key]== true) {$value=false;}	
										break;
								}
								break;
							
							
							case 16:
							//C'est une image
								switch ($scope.filtreListe[key].valeur) {
									case '0':	//On prend toutes images c'est bon
										break;
										
									case '1': //On ne prend que les cases qui sont cochées
										if (input[key]==undefined || input[key]== '') {$value=false;}	
										break;
										
									case '2': //On ne prend que les cases qui ne sont pas cochées
										if (input[key]!=undefined && input[key]!= '') {$value=false;}	
										break;
								}
								break;
							
						}
					}
				}
			}
			return $value;
	  };
	};
	

	//===========================================================================================
	//4.4 Les fonctions de modification en direct live sur les fiches produits
	//===========================================================================================

	//===========================================================================================
	//4.4.1 On modifie la valeur des cases à cocher
	//===========================================================================================
	$scope.majCheckDefaut = function(row) {
		//a.1 Les valeurs d'index
		var FormData = {
		  'idListe':$scope.idListe,
		  'idProduit':row['_id']['$id'],}
		
		//a.2 On met à jour le champs de checkdefaut
		FormData[$scope.liste.champs[$scope.liste.checkDefaut].nomChamp]=row[$scope.liste.champs[$scope.liste.checkDefaut].nomChamp];
							  
		//a.4 On envoie l'ordre d'exécution
		$http.post(mySettings.domaine + '/webservices/listes.php?code=14', FormData, {cache:false}).success(function(data) {$scope.majListe(true);});						
	}

	//===========================================================================================
	//4.4.2 On modifie les valeur pour les notations
	//===========================================================================================
	$scope.majNotation = function(row,nomChamp) {
		//a.1 Les valeurs d'index
		var FormData = {
		  'idListe':$scope.idListe,
		  'idProduit':row['_id']['$id'],}
		
		//a.2 On met à jour le champs de checkdefaut
		FormData[nomChamp]=row[nomChamp];
							  
		//a.4 On envoie l'ordre d'exécution
		$http.post(mySettings.domaine + '/webservices/listes.php?code=14', FormData, {cache:false}).success(function(data) {$scope.majListe(true);});						
		
	}

	//===========================================================================================
	//4.5 Mise à jour des filtres et des tris dans la liste
	//===========================================================================================
	$scope.updateListe = function(action) {
		var FormData = {
		  'nom_table' : 'listes' ,
		  'nom_champ' : action,
		  'valeur' : eval('$scope.'+action),
		  'id' : $scope.liste._id.$id
		};

		$http.post(mySettings.domaine + '/webservices/listes.php?code=5', FormData, {cache:false}).success(function(data) {});
	}

	//===========================================================================================
	//4.6 On supprime un enregistrement
	//===========================================================================================
	$scope.supprimer=function(row) {
		nomItem=$scope.liste['nomItem'];
		if ($scope.liste['nomSSItem']!=undefined && row['__cat']==0) {nomItem=$scope.liste['nomSSItem'];}
		if (confirm("Voulez vous détruire cet enregistrement:\n"+nomItem+" - "+row[$scope.liste.champs[$scope.liste['champDefaut']].nomChamp]+" ?"))
		{
			$http.get(mySettings.domaine + '/webservices/listes.php?code=12&idListe='+$scope.idListe+"&idItem="+row['_id']['$id']).success(function(data) {$scope.majListe(true);});	
		}
	}
	
	//===========================================================================================
	//4.7 On ajoute un enregistrement
	//===========================================================================================
 	$scope.new = function (row) {
		//On créée la template
		$template='<div class="modal-dialog">';
		$template=$template+'	<div class="modal-header">';
		$template=$template+'	  <button type="button" class="close" ng-click="cancel()">&times;</button>';
		$template=$template+'	  <h4 class="modal-title">Création - ';
		$template=$template+'	  <span ng-show="saisie[\'__cat\']">{{liste.nomItem}}</span>';
		$template=$template+'	  <span ng-hide="saisie[\'__cat\']">{{liste.nomSSItem}}</span>';
		$template=$template+'	   - {{liste.lst_nom}}</h4>';
		$template=$template+'	</div>';
		
		//On traite le cas pour les listes hiérarchisées
		if ($scope.liste['nomSSItem']!=undefined && ($scope.liste.noAdd==undefined || $scope.liste.noAdd=="0")) {
			$template=$template+'	<div class="modal-header">';
			$template=$template+'	  <input type=radio ng-model="saisie[\'__cat\']" value=1 />  {{liste.nomItem}}';
			$template=$template+'	  <span class=separation> </span>';
			$template=$template+'	  <input type=radio ng-model="saisie[\'__cat\']" value=0 />  {{liste.nomSSItem}}';
			$template=$template+'	</div>';
		}
		
		//On affiche la liste des champs en fonction de la saisie
		$template=$template+'	<div class="modal-body clearfix">';
		
		//Il s'agit d'un item
		//On vérifie que ce n'est pas une liste noAdd
		if ($scope.liste.noAdd==undefined || $scope.liste.noAdd=="0") {
			
			$template=$template+'	  <div ng-hide="saisie[\'__cat\']" />'+"<div class=saisieChamps>";
			$template=$template+'	  '+ $scope.liste['nomItem']+" : ";
			if (row!=undefined) {$template+='<span ng-init="saisie[\'__idCat\']=\''+row._id.$id+'\'"></span>';}
			$template=$template+'	  <select class="listeModeles" ng-model="saisie[\'__idCat\']" id="modele" name="modele" required ';
			$template=$template+'		ng-options="row._id.$id as row[liste.champs[liste.champDefaut].nomChamp] for row in categories | orderBy : liste.champs[liste.champDefaut].nomChamp">';
			$template=$template+'			<option value="">-- Pas de '+$scope.liste['nomItem']+' --</option>';
			$template=$template+'	  </select></div>';
			
			//Les champs pour un produit
			for (i=0;i<$scope.liste.champs.length;i++) {	
				if ($scope.liste.champs[i]['input']!=undefined && $scope.liste.champs[i]['input']!='') {
					$template+="<div class=saisieChamps>"+$scope.liste.champs[i]["description"]; 
					if ($scope.liste.champs[i]["champExtension"]!=undefined) {
						$template=$template+' '+$scope.liste.champs[i]["champExtension"] ;
					}
					$template=$template+': '+$scope.liste.champs[i]['input'];
					$template+='</div>';
				}
			}
							 
			$template=$template+'	  </div>';
					
			//Il s'agit d'une catégorie
			$template=$template+'	  <div ng-show="saisie[\'__cat\']==1" />';
		}
		else {
			$template=$template+'	  <div ng-init="saisie[\'__cat\']=1" />';
		}
		
		//Dépendance
		if ($scope.liste.nesting!=undefined && $scope.liste.nesting=='1') {
			$template=$template+'	  <div class=saisieChamps>';
			$template=$template+'	  '+ $scope.liste['nomItem']+" parent : ";
			$template=$template+'	  <select class="listeModeles" ng-model="saisie[\'__idCat\']" id="modele" name="modele" required ';
			$template=$template+'		ng-options="row._id.$id as row[liste.champs[liste.champDefaut].nomChamp] for row in categories | orderBy : liste.champs[liste.champDefaut].nomChamp">';
			$template=$template+'			<option value="">-- Pas de '+$scope.liste['nomItem']+' parent --</option>';
			$template=$template+'	  </select></div>';
		}
		
		$template=$template+"<div class=saisieChamps>"+'		{{liste.nomItem}}: ';
		$template=$template+$scope.liste.champs[$scope.liste.champDefaut]['input']+"</div>";
		if ($scope.liste.champCommentaire!=undefined) {	
			$template+="<div class=saisieChamps>"+$scope.liste.champs[$scope.liste.champCommentaire]['nomChamp']+ ': ';
			$template=$template+$scope.liste.champs[$scope.liste.champCommentaire]['input'];
		}
		$template=$template+'	  </div></div>';
			  
		$template=$template+'	</div>';
		$template=$template+'	<div class="modal-footer">';
		$template=$template+'	  <button type="button" class="btn btn-default" ng-click="cancel()">Annuler</button>';
		$template=$template+'	  <button type="button" class="btn btn-primary" ng-click="ok()">Valider</button>';
		$template=$template+'	</div>';
		$template=$template+'</div>{{saisie[\'Visite\']}}';

	var modalInstance = $modal.open({
		  template: $template,
		  controller: ModalInstanceNewItem,
		  resolve: {
			data: function () {
				data=[];
				data[0]=$scope.liste;
				data[1]=$scope.categories;
			  return data;
			}
		  }
		});

	//4.7.1 La gestion du retour quand la boite modale est fermée
    modalInstance.result.then(function (retour) {
		//a. On crée l'enregistrement en retour
		//a.1 Les valeurs d'index
		var FormData = {
		  'idListe':$scope.idListe}
		
		//a.2 On met à jour les données qui ont été éditées
		for (i=0;i<$scope.liste.champs.length;i++) {	
			if ($scope.liste.champs[i]['input']!=undefined && $scope.liste.champs[i]['input']!='') {
					  FormData[$scope.liste.champs[i]['nomChamp']]=nl2br(retour[$scope.liste.champs[i]['nomChamp']]);
			}
		}
						
		//a.3 On regarde si c'est une liste hiérarchique
		if ($scope.liste['nomSSItem']!=undefined &&	 $scope.liste['nomSSItem']!='') {
			//On rajoute le champe contenant le fait que ce soit ou non une catégorie
			FormData['__cat']=retour['__cat'];
			
				
			//On rajoute le champ de la catégorie parent s'il existe
			if (retour['__idCat']!=undefined && retour['__idCat']!='') {
				FormData['__idCat']=retour['__idCat'];
			}
		}
		
		
		//a.4 On envoie l'ordre d'exécution
		$http.post(mySettings.domaine + '/webservices/listes.php?code=14', FormData, {cache:false}).success(function(data) {
			//On met à jour la liste des enregistrement
			$scope.majListe(true);
			});
    }, function () {
    });
  };
   

	//===========================================================================================
	//4.8 On ajoute un commentaire
	//===========================================================================================
 	$scope.comment = function (row) {
		var modalInstance = $modal.open({
		  templateUrl: 'Listes/template/modal/modalComment.html',
		  controller: ModalInstanceComment,
		  resolve: {
			data: function () {
				data=[];
				data[0]=row;
				data[1]=$scope.liste;
			  return data;
			}
		  }
		});

		//4.8.1 La gestion du retour quand la boite modale est fermée
		modalInstance.result.then(function (retour) {
		 //On crée l'enregistrement en retour
			var FormData = {
			  'idListe':$scope.idListe,
			  'idProduit':retour['_id']['$id'],
			  'champCommentaire':retour['nomChamp'],
			  'newCommentaire' : nl2br(retour['newCommentaire'])
			};
	
			$http.post(mySettings.domaine + '/webservices/listes.php?code=13', FormData, {cache:false}).success(function(data) {
				//On met à jour le commentaire
				row['Commentaire']=data;
				});
		}, function () {
		});
	  };
	   

   

	//===========================================================================================
	//4.9 On modifie un enregistrement
	//===========================================================================================
 	$scope.editRow = function (row) {
		//On traite le problème des retours chariot
		rowEdit=[];
		for(var index in row) {
		  rowEdit[index]=br2nl(row[index]);
		}				
		
		//===========================================================================================
		//a. On créée la template dont on a besoin
		//===========================================================================================
		$template="<div class=modal-dialog><div class=modal-header>";
      	$template=$template+'<button type=button class=close ng-click=cancel()>&times;</button>';
		if (row['__cat']==0 && $scope.liste['nomSSItem']!=undefined) {
	      	$template=$template+'<h4 class="modal-title">'+$scope.liste.nomSSItem+': {{saisie[liste.champs[liste.champDefaut].nomChamp]}}</h4>';}
		else {
	      	$template=$template+'<h4 class="modal-title">'+$scope.liste.nomItem+': {{saisie[liste.champs[liste.champDefaut].nomChamp]}}</h4>';}
    	$template=$template+'</div>';
		$template=$template+'	<div class="modal-body clearfix">';
		
		if ($scope.liste['nomSSItem']!=undefined) {
		//a.3 Si c'est une liste hiérarchique on affiche la liste des catégorie
		$template=$template+'	<div ng-hide="saisie[\'__cat\']" />'+"<div class=saisieChamps>";
		$template=$template+'	  '+ $scope.liste['nomItem']+" : ";
		$template=$template+'	  <select class="listeModeles" ng-model="saisie[\'__idCat\']" id="modele" name="modele" required ';
		$template=$template+'		ng-options="row._id.$id as row[liste.champs[liste.champDefaut].nomChamp] for row in categories | orderBy : liste.champs[liste.champDefaut].nomChamp">';
		$template=$template+'			<option value="">-- Pas de '+$scope.liste['nomItem']+' --</option>';
		$template=$template+'	  </select></div>';
		}
		
		//a.4 Les champs pour un produit
		for (i=0;i<$scope.liste.champs.length;i++) {	
			if ($scope.liste.champs[i]['input']!=undefined &&$scope.liste.champs[i]['input']!='') {
				$template=$template+"<div class=saisieChamps>"+$scope.liste.champs[i]["description"]; 
				if ($scope.liste.champs[i]["champExtension"]!=undefined) {
					$template=$template+' '+$scope.liste.champs[i]["champExtension"] ;
				}
				$template=$template+': '+$scope.liste.champs[i]['input'];
				$template+="</div>";
			}
		}
		$template=$template+'	  </div>';

		//a.5 La partie de la template pour les catégories
		$template=$template+'	<div ng-show="saisie[\'__cat\']" />';

		//Dépendance
		if ($scope.liste.nesting!=undefined && $scope.liste.nesting!=0) {
			$template=$template+'	  <div class=saisieChamps>';
			$template=$template+'	  '+ $scope.liste['nomItem']+" parent : ";
			$template=$template+'	  <select class="listeModeles" ng-model="saisie[\'__idCat\']" id="modele" name="modele" required ';
			$template=$template+'		ng-options="row._id.$id as row[liste.champs[liste.champDefaut].nomChamp] for row in categories | orderBy : liste.champs[liste.champDefaut].nomChamp">';
			$template=$template+'			<option value="">-- Pas de '+$scope.liste['nomItem']+' parent --</option>';
			$template=$template+'	  </select></div>';
		}
		
		
		//Le nom de la catégorie
		$template=$template+"<div class=saisieChamps>"+$scope.liste["nomItem"]; 
		if ($scope.liste.champs[$scope.liste['champDefaut']]["champExtension"]!=undefined) {
			$template=$template+' '+$scope.liste.champs[$scope.liste['champDefaut']]["champExtension"] ;
		}
		$template=$template+': '+$scope.liste.champs[$scope.liste['champDefaut']]['input'];
		$template+="</div>";
	
		//Le commentaire
		if ($scope.liste['champCommentaire']!=undefined) {
			$template=$template+"<div class=saisieChamps>"+$scope.liste.champs[$scope.liste['champCommentaire']]["nomChamp"]; 
			if ($scope.liste.champs[$scope.liste['champCommentaire']]["champExtension"]!=undefined) {
				$template=$template+' '+$scope.liste.champs[$scope.liste['champCommentaire']]["champExtension"] ;
			}
			$template=$template+': '+$scope.liste.champs[$scope.liste['champCommentaire']]['input'];
			$template+="</div>";
		}
	
		$template=$template+'	</div>';

		//a.6 Les bouton pour fermer la fenêtre modale
		$template=$template+'	<div class="modal-footer">';
		$template=$template+'	  <button type="button" class="btn btn-default" ng-click="cancel()">Annuler</button>';
		$template=$template+'	  <button type="button" class="btn btn-primary" ng-click="ok()">Modifier</button>';
		$template=$template+'	</div>';
		$template=$template+'</div>';

		var modalInstance = $modal.open({
		  template:$template,
		  controller: ModalInstanceEditRow,
		  resolve: {
			data: function () {
				data=[];
				data[0]=rowEdit;
				data[1]=$scope.liste;
				data[2]=$scope.categories;
			  return data;
			},
		  }
		});

	//4.9.1 La gestion du retour quand la boite modale est fermée
    modalInstance.result.then(function (retour) {
		//a. On crée l'enregistrement en retour
		//a.1 Les valeurs d'index
		var FormData = {
		  'idListe':$scope.idListe,
		  'idProduit':retour['_id']['$id']}
		
		//a.2 On met à jour les données qui ont été éditées
		for (i=0;i<$scope.liste.champs.length;i++) {	
			if ($scope.liste.champs[i]['input']!=undefined && $scope.liste.champs[i]['input']!='') {
			  FormData[$scope.liste.champs[i]['nomChamp']]=nl2br(retour[$scope.liste.champs[i]['nomChamp']]);
			}
		}
						
		//a.3 On regarde si c'est une liste hiérarchique
		if ($scope.liste['nomSSItem']!=undefined &&	 $scope.liste['nomSSItem']!='') {
			//On rajoute le champ contenant le fait que ce soit ou non une catégorie
			FormData['__cat']=retour['__cat'];
			
			//On rajoute le champ de la catégorie parent s'il existe
			if (retour['__idCat']!=undefined && retour['__idCat']!='') {
				FormData['__idCat']=retour['__idCat'];
			}
		}
	  
		//a.4 On envoie l'ordre d'exécution
		$http.post(mySettings.domaine + '/webservices/listes.php?code=14', FormData, {cache:false}).success(function(data) {
			//a.5 On met à jour les valeurs pour l'affichage
			for(var index in data) {
			  row[index]=data[index];
			}	
			//a.6 On recalcule les index
			calculIndex($scope.rows);	
			
			//a.7 On refait les calculs
			calculCalculs(row);				
		});
		}, function () {
		}
	);
  };
   

	//===========================================================================================
	//4.10 Le filtre sur la liste des éléments
	//===========================================================================================
	//4.10.1 La fonction pour afficher la mode modale dans le cas du filtre  
 	$scope.openFiltre = function () {
	$template='<div class="modal-dialog">';
	$template+='	<div class="modal-header">';
	$template+='	  <button type="button" class="close" ng-click="cancel()">&times;</button>';
	$template+='	  <h4 class="modal-title">Filtre de votre liste {{liste.lst_nom}}</h4>';
	$template+='	</div>';
		
	$template+='	<div class="modal-body">';
	$template+=			$scope.liste.templateFiltre;
	$template+='	</div>';
		
	$template+='	<div class="modal-footer">';
	$template+='	  <button type="button" class="btn btn-default" ng-click="reset(filtre2)">Reset</button>';
	$template+='	  <button type="button" class="btn btn-default" ng-click="cancel()">Annuler</button>';
	$template+='	  <button type="button" class="btn btn-primary" ng-click="ok(filtre2)">Valider</button>';
	$template+='	</div>';
		
	$template+='</div>';

		var modalInstance = $modal.open({
		  template: $template,  //"Listes/template/modal/modalFiltreListe.html",
		  controller: controllerListeFiltre,
		  resolve: {
			data: function () {
				data=[];
				data[0]=$scope.filtreListe;
				data[1]=$scope.liste;		
				return data;
			}
		  }
		});

		//4.10.4 La gestion du retour quand la boite modale est fermée
		modalInstance.result.then(function (a) {
			
			//On met à jour les valeurs
			for (keys in $scope.filtreListe) {
				for (key in $scope.filtreListe[keys]) {
					$scope.filtreListe[keys][key]=a[keys][key];
				}
			}

			//On le sauvegarde dans le cookie
			$scope.updateListe('filtreListe');
			
			//On recalcule les index
			calculIndex($scope.rows);	
					    
		}, function () {
		});
	  };

	//===========================================================================================
	//4.11 Le tri de la liste des éléments
	//===========================================================================================
	//4.11.1 La fonction pour afficher la mode modale dans le cas du tri 
 	$scope.openTri = function () {
		$template='<div class="modal-dialog">';
		$template+='	<div class="modal-header">';
		$template+='	  <button type="button" class="close" ng-click="cancel()">&times;</button>';
		$template+='	  <h4 class="modal-title">Tri de votre liste {{liste.lst_nom}}</h4>';
		$template+='	</div>';
			
		$template+='	<div class="modal-body">';
		$template+=			$scope.liste.templateTri;
		$template+='	</div>';

		$template+='		<div class="modal-body">';
		$template+='		  <input type=checkbox ng-model="tri2[\'sens\']" ng-checked="tri2[\'sens\']" /> en ordre décroissant';
		if ($scope.liste.nomSSItem!=undefined) {
			//On inscrit la possibilité de masquer les hiérarchie
			$template+='			<span class=separation> </span>';
			$template+='			<input type=checkbox ng-model="tri2[\'arbre\']" ng-checked="tri2[\'arbre\']" /> masquer les regroupements';
			$template+='		</div>';
		}
		
		$template+='	<div class="modal-footer">';
		$template+='	  <button type="button" class="btn btn-default" ng-click="reset(tri2)">Reset</button>';
		$template+='	  <button type="button" class="btn btn-default" ng-click="cancel()">Annuler</button>';
		$template+='	  <button type="button" class="btn btn-primary" ng-click="ok(tri2)">Valider</button>';
		$template+='	</div>';
			
		$template+='</div>';

		var modalInstance = $modal.open({
		  template: $template,  
		  controller: controllerListeTri,
		  resolve: {
			data: function () {
				data=[];
				data[0]=$scope.triListe;
				data[1]=$scope.liste;		
				return data;
			}
		  }
		});

		//4.11.2 La gestion du retour quand la boite modale est fermée
		modalInstance.result.then(function (a) {
			
			//On met à jour les valeurs
			$scope.triListe['champ']=(a['sens']) ? '-'+a['champ']: a['champ'];
			$scope.triListe['sens']=a['sens'];
			$scope.triListe['arbre']=a['arbre'];
			
			//On le sauvegarde dans le cookie
			$scope.updateListe('triListe');
;			    
		}, function () {
		});
	  };

});


//===========================================================================================
//4.7.a Le contrôleur La création d'un élément dans la liste
//===========================================================================================
var ModalInstanceNewItem = function ($scope, $modalInstance, data) {
	$scope.liste = data[0];
	$scope.categories=data[1];
	$scope.saisie=[];
	//On vérifie si c'est une liste à niveau ou pas
	if ($scope.liste.nomSSItem!=undefined && $scope.liste.nomSSItem!='') {
		$scope.saisie["__cat"]=0;	
	}

	//On met les valeurs par défaut pour les dates
	for ($i=0;$i<$scope.liste.champs.length;$i++) {
		switch ($scope.liste.champs[$i].type) {
			case '8':
				//C'est une date
				$scope.saisie[$scope.liste.champs[$i].nomChamp]= new Date().toISOString().substr(0,10);
				break;	
				
			case '20':
				//C'est une dateTime
				$scope.saisie[$scope.liste.champs[$i].nomChamp]= new Date().toISOString().substr(0,16);
				break;	
				
			case '25':
				//C'est une notation
				//On récupère les mins et maxs
				minimum=undefined;
				maximum=undefined;
				for ($j=0;$j<$scope.liste.champs[$i].regles.length;$j++) {
					if ($scope.liste.champs[$i].regles[$j].regleNum==9) {maximum=parseInt($scope.liste.champs[$i].regles[$j].valeur);}
					if ($scope.liste.champs[$i].regles[$j].regleNum==10) {minimum=parseInt($scope.liste.champs[$i].regles[$j].valeur);}
				}
				
				if (minimum!=undefined && maximum!=undefined) {
					$scope.saisie[$scope.liste.champs[$i].nomChamp]=parseInt((minimum+maximum)/2);	
				}
		}
	}
	$scope.ok = function () {
		$modalInstance.close($scope.saisie);
	};
	
	$scope.cancel = function () {
		$modalInstance.dismiss('cancel');
	};
};


//===========================================================================================
//4.8.a Le contrôleur La création d'un commentaire
//===========================================================================================
var ModalInstanceComment = function ($scope, $modalInstance, data) {
	$scope.row=data[0];
	$scope.liste=data[1];
	$scope.row['newCommentaire']='';
			
	$scope.ok = function () {
		$scope.row['nomChamp']=$scope.liste.champs[$scope.liste.champCommentaire].nomChamp;
		$modalInstance.close($scope.row);
	};
	
	$scope.cancel = function () {
		$modalInstance.dismiss('cancel');
	};
};


//===========================================================================================
//4.9.a Le contrôleur édition d'un élément dans la liste
//===========================================================================================
var ModalInstanceEditRow = function ($scope, $modalInstance, $sce, $filter,data) {
	row=data[0];
	$scope.liste=data[1];
	$scope.categories=data[2];
	
	$scope.saisie=copy(row);
	//On regarde si on doit faire des traitement sur ces données
	for ($i=0;$i<$scope.liste.champs.length;$i++) {
		switch ($scope.liste.champs[$i].affichageFonction) {
			case 'timeConverter':
				if ($scope.saisie[$scope.liste.champs[$i].nomChamp]!=undefined) {
					$scope.saisie[$scope.liste.champs[$i].nomChamp]=new Date($scope.saisie[$scope.liste.champs[$i].nomChamp]*1000).toISOString().substr(0,16);
				}
				break;	

			case 'timeConverterDate':
				$scope.saisie[$scope.liste.champs[$i].nomChamp]=$filter("date")($scope.saisie[$scope.liste.champs[$i].nomChamp]*1000,'yyyy-MM-dd');
				break;	
		}
	}
			
	$scope.ok = function () {
		$modalInstance.close($scope.saisie);
	};
	
	$scope.cancel = function () {
		$modalInstance.dismiss('cancel');
	};
};


//===========================================================================================
//4.10.a Le controleur pour la boite modale de filtre
//===========================================================================================
var controllerListeFiltre = function ($scope, $http, $modalInstance, data) {
	$scope.filtreListe = data[0];
	$scope.liste = data[1];
	$scope.filtre2=new Array();
	//$scope.filtre2=copy($scope.filtreListe);
	for (keys in $scope.filtreListe) {
		$scope.filtre2[keys]=new Array();
		for (key in $scope.filtreListe[keys]) {
			$scope.filtre2[keys][key]=$scope.filtreListe[keys][key];
		}
	}
	
	$scope.ok = function (a) {
		$modalInstance.close(a);
	};
	
	$scope.reset = function () {
		//On met à jour les valeurs
		for (key in $scope.liste.filtreDefaut) {
			for (key2 in $scope.filtre2[key]) {
				$scope.filtre2[key][key2]=$scope.liste.filtreDefaut[key][key2];
			}
		}
		
	};
	
	$scope.cancel = function () {
		$modalInstance.dismiss('cancel');
	};
};

//===========================================================================================
//4.11.a Le controleur pour la boite modale de tri
//===========================================================================================
var controllerListeTri = function ($scope, $http, $modalInstance, data) {
	$scope.triListe = data[0];
	$scope.liste = data[1];
	$scope.tri2=new Array();

	for (keys in $scope.triListe) {
		$scope.tri2[keys]=$scope.triListe[keys];
	}
	if ($scope.tri2['sens']) {$scope.tri2['champ']=$scope.tri2['champ'].substr(1);}
	if ($scope.tri2['arbre']==undefined) {$scope.tri2['arbre']=false;}

	$scope.ok = function (a) {
		$modalInstance.close(a);
	};
	
	$scope.reset = function () {
		//On met à jour les valeurs
		for (key in $scope.liste.triDefaut) {
			$scope.tri2[key]=$scope.liste.triDefaut[key];
			$scope.tri2['arbre']=false;
		}
		
	};
	
	$scope.cancel = function () {
		$modalInstance.dismiss('cancel');
	};
};


//===========================================================================================
//5. Le controleur pour afficher la liste des champs
//===========================================================================================
listesControllers.controller('ListeChamps', function ($scope,$http,$routeParams, mySettings) {
   	 $scope.idListe = $routeParams.idListe;

	 //On récupère les informations sur la liste
	$http.get(mySettings.domaine + '/webservices/listes.php?code=4&idListe='+$scope.idListe).success(function(data) {$scope.liste=data;})

	 //On récupère les informations sur les types de champs
	$http.get(mySettings.domaine + '/webservices/listes.php?code=8').success(function(data) {$scope.champTypes=data;})
		 
	 //On récupère les informations sur les règles
	$http.get(mySettings.domaine + '/webservices/listes.php?code=9').success(function(data) {$scope.champRegles=data;})
	
	$scope.typeChamp = function( id ) {
	  return function(input) {
		return input.id===id;
	  };
	};

	$scope.regleChamp = function( id ) {
	  return function( input ) {
		return input.id === id;
	  };
	};

	$scope.filtreChamp = function( id ) {
	  return function( input ) {
		return input.nomChamp === id;
	  };
	};

});


//===========================================================================================
//6. Le controleur pour afficher les Options d'une liste
//===========================================================================================
listesControllers.controller('ListeOption', function ($scope,$http,$routeParams,$modal, mySettings) {
   	 $scope.idListe = $routeParams.idListe;

	 //6.1 On récupère les informations sur la liste
	$http.get(mySettings.domaine + '/webservices/listes.php?code=4&idListe='+$scope.idListe).success(function(data) {$scope.liste=data;})
	$http.get(mySettings.domaine + '/webservices/listes.php?code=15&idListe='+$scope.idListe).success(function(data) {$scope.countListe=data;})

	 
	//6.2 On gère la modification du nom de la liste
	$scope.update = function(nomTable,nomChamp,id,valeur) {
	    var FormData = {
		  'nom_table' : nomTable ,
		  'nom_champ' : nomChamp,
		  'valeur' : eval('$scope.'+valeur),
		  'id' : id
		};

		$http.post(mySettings.domaine + '/webservices/listes.php?code=5', FormData, {cache:false}).success(function(data) {if (data !='') {$scope.liste.datemodification=data}});
	}

	//6.3 On supprime une liste vide
	$scope.supprimerListe = function () {
		x=confirm("Vous allez détruire la liste "+$scope.liste.lst_nom+"\n\nConfirmez vous ce choix?");
		if (x) {
			$http.get(mySettings.domaine + '/webservices/listes.php?code=6&idListe='+$scope.idListe).success(function(data) {window.location="#/";})			
		}
	}
		 
	//6.4 On archive une liste
	$scope.archiverListe = function () {
		x=confirm("Désirez vous archiver la liste "+$scope.liste.lst_nom+"\n\nVous pourrez toujours la consulter et même la réactiver.\n\nConfirmez vous ce choix?");
		if (x) {
			$http.get(mySettings.domaine + '/webservices/listes.php?code=7&idListe='+$scope.idListe).success(function(data) {window.location="#/";})
		}
	}
});


//===========================================================================================
//7. Le controleur pour afficher la liste des champs
//===========================================================================================
listesControllers.controller('headerController', function ($scope,$http,$routeParams, mySettings) {
	//7.1 Les items du menu
	$scope.items = new Array();
	$scope.items[0]=new Array();
	$scope.items[0]['menu']="Scanner une liste";
	$scope.items[0]['action']="scan()";

	$scope.items[1]=new Array();
	$scope.items[1]['menu']="Changer d'utilisateur";
	$scope.items[1]['action']="abandon()";

	$scope.items[2]=new Array();
	$scope.items[2]['menu']="Fermer l'application";
	$scope.items[2]['action']="exit()";

	
	//7.2 La fonction pour lancer le scan dans l'appli
	$scope.scan=function() {
	  cordova.plugins.barcodeScanner.scan(
		  function (result) {
			  if (!result.cancelled) {
					window.sessionStorage.setItem("scan",result.text);
					window.location="importListe/index.html";
			  }
		  }, 
		  
		  function (error) {
		  }
		);
	};
  
	//7.3 La fonction pour fermer l'application
	$scope.exit=function() {
		navigator.app.exitApp();
	};
   
});


