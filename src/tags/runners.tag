<!-- GESTION DES COUREURS -->
<tab-runners>
    <div id="runners" class="container">
        <div class="row justify-content-center">
            <div class="col">
                <!-- Ajout / Import -->
                <div class="collapse" id="addrunners">
                    <div class="input-group">
                        <div class="input-group-prepend">
                            <span class="input-group-text" id="">Coureur</span>
                        </div>
                        <input type="text" class="form-control" id="addRunner_Name" placeholder="NOM Prénom">
                        <input type="text" class="form-control col-1" id="addRunner_Gender" placeholder="F / G">
                        <input type="text" class="form-control col-1" id="addRunner_Class" placeholder="Classe">
                        <input type="text" class="form-control col-2" id="addRunner_School" placeholder="Collège">
                        <input type="text" class="form-control col-1" id="addRunner_Bibnumber" placeholder="Dossard">
                        <div class="input-group-append">
                            <button class="btn btn-success" type="button" onclick={ addRunner }><i class="fa fa-plus" aria-hidden="true"></i>
&nbsp;Ajouter</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- Filtre de recherche -->
        <div class="row" id="filter">
            <div class="col-2"></div>
            <div class="col-1"></div>
            <div class="col-6">
                <div class="input-group">
                    <div class="input-group-prepend">
                        <span class="input-group-text">Filtre</span>
                    </div>
                    <input id="filter_input" type="text" class="form-control" placeholder="Nom / Prénom / Classe / F/G..." onkeyup={ updateFilter } />
                    <div class="input-group-append">
                        <span class="input-group-text">{Runners_Displayed.length + '  / ' + Runners.items.length}</span>
                    </div>
                </div>
            </div>
            <div class="col-1"></div>
            <div class="col-2">
                <div class="btn-group" role="group" aria-label="Button group with nested dropdown">
                    <button class="btn btn-outline-success" type="button" data-toggle="collapse" data-target="#addrunners" aria-expanded="false" aria-controls="addrunners">
                        <i class="fa fa-plus" aria-hidden="true"></i>
                    </button>
                    <button type="button" class="btn btn-outline-primary dropdown-toggle dropdown-toggle-split" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        <i class="fa fa-cog" aria-hidden="true"></i>
                        <span class="sr-only">Déplier Menu</span>
                    </button>
                    <div class="dropdown-menu dropdown-menu-right">
                        <a class="dropdown-item" href="#" onclick={ importCSV }>Importer des coureurs depuis un CSV</a>
                        <a class="dropdown-item" href="#" onclick={ importJSONBackup }>Importer une sauvegarde complète depuis un JSON</a>
                        <a class="dropdown-item" href="#" onclick={ exportJSONBackup }>Exporter une sauvegarde complète vers un JSON</a>
                    </div>
                </div>
            </div>
        </div>

        <!-- Liste filtrée des coureurs -->
        <div class="row justify-content-center">
            <div class="col-9">
                <div class="input-group input-group-sm runner-item" each={Runners_Displayed}>
                    <div class="input-group-prepend">
                        <button class="btn btn-outline-danger" type="button" onclick={ displayDelRunner } data-whatever="{Runner_ID}">
                            <i class="fa fa-minus" aria-hidden="true"></i>
                        </button>
                    </div>
                    <input type="text" class="form-control" value="{Name}" onkeyup={ editRunnerName }>
                    <input type="text" class="form-control col-1" value="{Gender}" onkeyup={ editRunnerGender }>
                    <input type="text" class="form-control col-1" value="{Class}" onkeyup={ editRunnerClass }>
                    <input type="text" class="form-control col-3" value="{School}" onkeyup={ editRunnerSchool }>
                    <input type="text" class="form-control col-1" value="Dossard :" readonly>
                    <input type="text" class="form-control col-1" value="{Bibnumber}" onkeyup={ editRunnerBibnumber }>
                    <div class="input-group-append">
                        <button type="button" class="btn btn-primary dropdown-toggle dropdown-toggle-split" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            <span class="sr-only">Toggle Dropdown</span>
                        </button>
                        <div class="dropdown-menu">
                            <a class="dropdown-item" href="#" onclick={ deliverBibnumbers }>Distribuer les dossards suivants...</a>
                            <a class="dropdown-item" href="#" onclick={ displayPrintBibnumbers }>Imprimer les dossards suivants...</a>
                        </div>
                    </div>
                </div>
                <!-- ADMINISTRATION : SUPPRESSION -->
                <div class="row justify-content-center">
                    <div class="col-3"></div>
                    <div class="col-6">
                        <div class="input-group" style="margin-top: 40px; margin-bottom: 20px;">
                            <div class="input-group-prepend">
                                <span class="input-group-text"><i class="fa fa-exclamation-triangle " aria-hidden="true"></i>&nbsp;Suppression des coureurs...</span>
                            </div>
                            <div class="input-group-append">
                                <button type="button" class="btn btn-danger dropdown-toggle dropdown-toggle-split" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                    <span class="sr-only">Dérouler le menu</span>
                                </button>
                                <div class="dropdown-menu">
                                    <a class="dropdown-item" href="#" onclick={ delAllRunners }>Supprimer tous les coureurs</a>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-3"></div>
                </div>
            </div>
        </div>
    </div>


    <!-- FENETRE MODALE : SUPPRESSION D'UN COUREUR -->
    <div class="modal fade" id="delRunner" tabindex="-1" role="dialog" aria-labelledby="delRunnerTitle" aria-hidden="true">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="delRunnerTitle">Suppression d'un coureur</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="input-group">
                        <div class="input-group-prepend">
                            <span class="input-group-text">Coureur</span>
                            <span class="input-group-text" id="delRunner_Displayed_Index" style="display:none;"></span>
                        </div>
                        <input type="text" class="form-control" id="delRunner_Displayed_Name">
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Annuler</button>
                    <button type="button" class="btn btn-danger" onclick={ removeRunner }>Supprimer le coureur</button>
                </div>
            </div>
        </div>
    </div>

    <!-- FENETRE MODALE : IMPRESSION DES DOSSARDS -->
    <div class="modal fade" id="printBibnumbers" tabindex="-1" role="dialog" aria-labelledby="printBibnumbersTitle" aria-hidden="true">
        <div class="modal-dialog modal-lg" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="printBibnumbersTitle">Impression des dossards</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="row justify-content-center">
                        <button class="btn btn-primary" type="button" onclick={ genBibnumbers }><i class="fa fa-clone" aria-hidden="true"></i>
        &nbsp;Rafraichir / Recharger le PDF</button>
                    </div>
                    <webview id="bibnumbersPreview" style="display:inline-flex; width:740px; height:520px" plugins></webview>
                    <span class="input-group-text d-none" id="printRunner_Displayed_Index"></span>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Annuler</button>
                    <button type="button" class="btn btn-primary" onclick={ printBibnumbers }><i class="fa fa-print" aria-hidden="true"></i>&nbsp;Imprimer les dossards</button>
                </div>
            </div>
        </div>
    </div>


    <script>

/***************************************************************************************************************
 *  Avant le chargement du tag, on récupère les données sur les coureurs (évite de nombreux bugs)
 */
this.on('before-mount', function() {
    // Charge les coureurs
    Runners.load();
    // Tri alphabétique les coureurs
    Runners.sort();
    this.Runners_Displayed = Runners.items;
    var filterValues = {filter_gender : '', filter_input : ''};
    this.Runners_Displayed = Runners.items.filter(filterFunction,filterValues);
    this.userDataPath = remote.app.getPath('userData');
    //console.log(this.Runners);
    //console.log(this.Runners_Displayed);
})


/***************************************************************************************************************
 *  Function : updateFilter
 * 
 *  Suite à une frappe ou une sélection du formulaire de recherche, on lance à nouveau le filtre des coureurs
 */
this.updateFilter = function(e) {
    // On récupère le texte du formulaire de filtre
    this.filter_input = document.getElementById("filter_input").value;
    // On récupère le genre cliqué
    // On créé les valeurs de filtres à passer
    var filterValues = {filter_gender : '', filter_input : this.filter_input};
    // On filtre le tableau Runners avec la fonction de filtrage et les valeurs du filtre
    this.Runners_Displayed = Runners.items.filter(filterFunction,filterValues);
    //console.log(this.Runners);
    //console.log(this.Runners_Displayed);
}



/***************************************************************************************************************
 *  Function : filterFunction
 * 
 *  Fonction de recherche des coureurs
 */
function filterFunction(element) {
    // On retourne si :
    // - Texte vide et genre = "All" ou "Genre du coureur"
    // - Texte = Nom ou Prénom ou Classe ou Ecole ou Numéro de dossard
    // - Texte = F ou G pour le genre (mais pas la lettre dans le reste)

    if ((this.filter_input == "")
        ||((this.filter_input.toLowerCase() == "g")&&(element.Gender.toLowerCase().search("g") != -1))
        ||((this.filter_input.toLowerCase() == "f")&&(element.Gender.toLowerCase().search("f") != -1))
        ||((this.filter_input.toLowerCase() != "g")&&(this.filter_input.toLowerCase() != "f")&&(element.Name.toLowerCase().search(this.filter_input.toLowerCase()) != -1))
        ||((this.filter_input.toLowerCase() != "g")&&(this.filter_input.toLowerCase() != "f")&&(element.Class.toLowerCase().search(this.filter_input.toLowerCase()) != -1))
        ||((this.filter_input.toLowerCase() != "g")&&(this.filter_input.toLowerCase() != "f")&&(element.School.toLowerCase().search(this.filter_input.toLowerCase()) != -1))
        ||((this.filter_input.toLowerCase() != "g")&&(this.filter_input.toLowerCase() != "f")&&(element.Bibnumber.toLowerCase().search(this.filter_input.toLowerCase()) != -1))) {
        return true;
    } else {
        return false;
    }
}



/***************************************************************************************************************
 *  Function : addRunner
 * 
 *  Ajoute un coureur au tableau de données Runners et raffraichit l'interface
 * 
 *  Parameters :
 *    (Objet) element - Coureur sur lequel on a cliqué (élément HTML créé par la boucle de Riot.js)
 */
this.addRunner = function(element) {
    // On récupère les informations du nouveau coureur
    let Name = document.getElementById("addRunner_Name").value;
    let Gender = document.getElementById("addRunner_Gender").value;
    let Class = document.getElementById("addRunner_Class").value;
    let School = document.getElementById("addRunner_School").value;
    let Bibnumber = document.getElementById("addRunner_Bibnumber").value;
    // On récupère un Runner_ID non utilisé pour le nouveau coureur
    let Runner_ID = Runners.getNewRunnerID();
    //console.log(Runner_ID);
    if (Runner_ID == -1) {
        console.log("Erreur d'ajout : Aucun ID trouvé");
        alert("Erreur d'ajout : Aucun ID trouvé");
    }
    else {
        // On ajoute le coureur au tableau de données Runners
        Runners.addRunner(Runner_ID.toString(),Name,Gender,Class,School,Bibnumber);
        Runners.sort();
        Runners.save();
        // On vide le formulaire d'ajout
        document.getElementById("addRunner_Name").value = "";
        document.getElementById("addRunner_Gender").value = "";
        document.getElementById("addRunner_Class").value = "";
        document.getElementById("addRunner_School").value = "";
        document.getElementById("addRunner_Bibnumber").value = "";
        // On récupère le texte du formulaire de filtre
        this.filter_input = document.getElementById("filter_input").value;
        // On récupère le genre cliqué
        // On créé les valeurs de filtres à passer
        var filterValues = {filter_gender : '', filter_input : this.filter_input};
        // On filtre le tableau Runners avec la fonction de filtrage et les valeurs du filtre
        this.Runners_Displayed = Runners.items.filter(filterFunction,filterValues);
    }
    //console.log(this.Runners);
}


/***************************************************************************************************************
 *  Function : displayDelRunner
 * 
 *  Affiche une fenêtre de confirmation pour la suppression d'un coureur
 * 
 *  Parameters :
 *    (Objet) element - Coureur sur lequel on a cliqué (élément HTML créé par la boucle de Riot.js)
 */
this.displayDelRunner = function(e) {
    // On récupère l'index du coureur dans le tableau d'affichage courant Runners_Displayed
    var index_Runners_Displayed = this.Runners_Displayed.indexOf(e.item);
    // On affiche la fenêtre modale
    $('#delRunner').modal('toggle');
    // On stocke l'index en dur en HTML (à défaut d'y arriver en variable... locale ? globale ? this ?)
    document.getElementById("delRunner_Displayed_Index").innerHTML = index_Runners_Displayed;
    // On affiche le nom du coureur à supprimer, pour une ultime vérification
    document.getElementById("delRunner_Displayed_Name").value = e.item.Name;
}


/***************************************************************************************************************
 *  Function : removeRunner
 * 
 *  Supprime un coureur du tableau d'affichage courant Runners_Displayed ainsi que du tableau de données Runners
 * 
 *  Parameters :
 *    (Objet) element - Coureur sur lequel on a cliqué (élément HTML créé par la boucle de Riot.js)
 */
this.removeRunner = function(element) {
    // index du coureur dans le tableau d'affichage courant Runners_Displayed
    var index_Runners_Displayed = document.getElementById("delRunner_Displayed_Index").innerHTML;
    // index du coureur dans le tableau de données Runners
    var index_Runners = Runners.getIndexFromRunnerID(this.Runners_Displayed[index_Runners_Displayed].Runner_ID);
    // Suppression dans le tableau d'affichage courant Runners_Displayed
    this.Runners_Displayed.splice(index_Runners_Displayed, 1);
    // Suppression dans le tableau de données Runners
    Runners.delRunner(index_Runners);
    Runners.save();
    // Cacher la fenêtre modale de confirmation de suppression
    $('#delRunner').modal('toggle');
}


/***************************************************************************************************************
 *  Function : delAllRunners
 * 
 *  Supprime tous les coureurs
 * 
 *  Parameters :
 *    (Objet) e - Evènement de Riot.js
 */
this.delAllRunners = function(element) {
    Runners.delAll();
    Runners.save();
    var filterValues = {filter_gender : '', filter_input : ''};
    // On filtre le tableau Runners avec la fonction de filtrage et les valeurs du filtre
    this.Runners_Displayed = Runners.items.filter(filterFunction,filterValues);
}



/***************************************************************************************************************
 *  Function : editRunnerName
 * 
 *  Met à jour le tableau de données Runners sur modification du Nom (pas besoin de faire Runners_Displayed)
 *
 *  Parameters :
 *    (Objet) e - Evènement de Riot.js
 */
this.editRunnerName = function(e) {
    // On récupère l'index du coureur dans le tableau d'affichage courant Runners_Displayed
    var index_Runners_Displayed = this.Runners_Displayed.indexOf(e.item);
    var index_Runners = Runners.getIndexFromRunnerID(this.Runners_Displayed[index_Runners_Displayed].Runner_ID);
    // On met à jour le tableau Runners
    Runners.items[index_Runners].Name = e.target.value;
    // Tri par Collège > Classe > Nom
    Runners.sort();
    Runners.save();
}
/***************************************************************************************************************
 *  Function : editRunnerGender
 * 
 *  Met à jour le tableau de données Runners sur modification du Genre F/G (pas besoin de faire Runners_Displayed)
 *
 *  Parameters :
 *    (Objet) e - Evènement de Riot.js
 */
this.editRunnerGender = function(e) {
    // On récupère l'index du coureur dans le tableau d'affichage courant Runners_Displayed
    var index_Runners_Displayed = this.Runners_Displayed.indexOf(e.item);
    var index_Runners = Runners.getIndexFromRunnerID(this.Runners_Displayed[index_Runners_Displayed].Runner_ID);
    // On met à jour le tableau Runners
    Runners.items[index_Runners].Gender = e.target.value;
    Runners.save();
}
/***************************************************************************************************************
 *  Function : editRunnerClass
 * 
 *  Met à jour le tableau de données Runners sur modification de la classe (pas besoin de faire Runners_Displayed)
 *
 *  Parameters :
 *    (Objet) e - Evènement de Riot.js
 */
this.editRunnerClass = function(e) {
    // On récupère l'index du coureur dans le tableau d'affichage courant Runners_Displayed
    var index_Runners_Displayed = this.Runners_Displayed.indexOf(e.item);
    var index_Runners = Runners.getIndexFromRunnerID(this.Runners_Displayed[index_Runners_Displayed].Runner_ID);
    // On met à jour le tableau Runners
    Runners.items[index_Runners].Class = e.target.value;
    // Tri par Collège > Classe > Nom
    Runners.sort();
    Runners.save();
}
/***************************************************************************************************************
 *  Function : editRunnerSchool
 * 
 *  Met à jour le tableau de données Runners sur modification de l'école (pas besoin de faire Runners_Displayed)
 *
 *  Parameters :
 *    (Objet) e - Evènement de Riot.js
 */
this.editRunnerSchool = function(e) {
    // On récupère l'index du coureur dans le tableau d'affichage courant Runners_Displayed
    var index_Runners_Displayed = this.Runners_Displayed.indexOf(e.item);
    var index_Runners = Runners.getIndexFromRunnerID(this.Runners_Displayed[index_Runners_Displayed].Runner_ID);
    // On met à jour le tableau Runners
    Runners.items[index_Runners].School = e.target.value;
    // Tri par Collège > Classe > Nom
    Runners.sort();
    Runners.save();
}
/***************************************************************************************************************
 *  Function : editRunnerBibnumber
 * 
 *  Met à jour le tableau de données Runners sur modification du Numéro de dossard (pas besoin de faire Runners_Displayed)
 *
 *  Parameters :
 *    (Objet) e - Evènement de Riot.js
 */
this.editRunnerBibnumber = function(e) {
    // On récupère l'index du coureur dans le tableau d'affichage courant Runners_Displayed
    var index_Runners_Displayed = this.Runners_Displayed.indexOf(e.item);
    var index_Runners = Runners.getIndexFromRunnerID(this.Runners_Displayed[index_Runners_Displayed].Runner_ID);
    // On met à jour le tableau Runners
    Runners.items[index_Runners].Bibnumber = e.target.value;
    Runners.save();
}

/***************************************************************************************************************
 *  Function : deliverBibnumbers
 * 
 *  Distribue les dossards aux coureurs affichés en partant de celui cliqué
 *
 *  Parameters :
 *    (Objet) e - Evènement de Riot.js
 */
this.deliverBibnumbers = function(e) {
    // On récupère l'index du coureur dans le tableau d'affichage courant Runners_Displayed
    var index_Runners_Displayed = this.Runners_Displayed.indexOf(e.item);
    // On récupère le Bibnumber du coureur cliqué et on le transforme en nombre entier
    var Bibnumber = parseInt(e.item.Bibnumber, 10);
    var i_min = index_Runners_Displayed + 1;
    var i_max = this.Runners_Displayed.length;
    // On boucle depuis le coureur suivant le coureur cliqué jusqu'à la fin du tableau affiché
    for (var i = i_min ; i < i_max ; i++) {
        // On attribue le dossard suivant dans le tableau d'affichage
        Bibnumber++;
        //console.log(Bibnumber);
        this.Runners_Displayed[i].Bibnumber = Bibnumber.toString();
        // On met à jour le tableau Runners
        var index_Runners = Runners.getIndexFromRunnerID(this.Runners_Displayed[i].Runner_ID);
        Runners.items[index_Runners].Bibnumber = Bibnumber.toString();
    }
    Runners.save();
}

/***************************************************************************************************************
 *  Function : displayPrintBibnumbers
 * 
 *  Affiche une fenêtre d'impression pour les dossards
 *
 *  Parameters :
 *    (Objet) e - Evènement de Riot.js
 */
this.displayPrintBibnumbers = function(e) {
    document.getElementById("bibnumbersPreview").src = "";
    // On récupère l'index du coureur dans le tableau d'affichage courant Runners_Displayed
    var index_Runners_Displayed = this.Runners_Displayed.indexOf(e.item);
    // Fichier PDF contenant les dossards à imprimer (par défaut dans les préférences utilisateurs)
    var PDF_File = path.join(this.userDataPath, 'Dossards.pdf');
    // On affiche la fenêtre modale
    $('#printBibnumbers').modal('toggle');
    // On stocke l'index en dur en HTML (à défaut d'y arriver en variable... locale ? globale ? this ?)
    document.getElementById("printRunner_Displayed_Index").innerHTML = index_Runners_Displayed;

    var doc = new PDFDocument({layout : 'landscape',autoFirstPage: false});
    doc.pipe(fs.createWriteStream(PDF_File));
    
    // Récupération des polices pour les Code-barres et le reste
    var Font_Barcode = path.join(__dirname,'fonts','c39hrp48dhtt.ttf');
    var Font_Ubuntu = path.join(__dirname,'fonts','Ubuntu-B.ttf');

    // On prépare les indices de début et de fin de boucle
    var i_min = index_Runners_Displayed;
    var i_max = this.Runners_Displayed.length;
    // On boucle depuis le coureur suivant le coureur cliqué jusqu'à la fin du tableau affiché
    for (var i = i_min ; i < i_max ; i++) {
        doc.addPage();
        doc.font(Font_Ubuntu)
            .fontSize(30)
            .text(this.Runners_Displayed[i].School + ' » ' + this.Runners_Displayed[i].Class, 100, 10, {align: 'center'})
            .moveDown(0.1);
        doc.font(Font_Ubuntu)
            .fontSize(60)
            .text(this.Runners_Displayed[i].Name + ' ( ' + this.Runners_Displayed[i].Gender + ' )', {align: 'center'})
            .moveDown(0.1);
        doc.font(Font_Barcode)
            .fontSize(200)
            .text('*' + this.Runners_Displayed[i].Bibnumber + '*', 20, 280, {align: 'left'});
        doc.font(Font_Ubuntu)
            .fontSize(240)
            .text(this.Runners_Displayed[i].Bibnumber, 200, 230, {align: 'right'});
    }
    // end and display the document in the iframe to the right
    doc.end();
    // On affiche le document PDF dans la preview
    document.getElementById("bibnumbersPreview").src = PDF_File;
}

/***************************************************************************************************************
 *  Function : genBibnumbers
 * 
 *  Génère les dossards
 *
 *  Parameters :
 *    (Objet) e - Evènement de Riot.js
 */
this.genBibnumbers = function(e) {
    document.getElementById("bibnumbersPreview").reload();
}

/***************************************************************************************************************
 *  Function : printBibnumbers
 * 
 *  Imprime les dossards
 *
 *  Parameters :
 *    (Objet) e - Evènement de Riot.js
 */
this.printBibnumbers = function(e) {
    // On récupère l'index du coureur dans le tableau d'affichage courant Runners_Displayed
    var index_Runners_Displayed = document.getElementById("printRunner_Displayed_Index").innerHTML;
}


/***************************************************************************************************************
 *  Function : importCSV
 * 
 *  Importe des coureurs d'un fichier CSV
 *
 *  Parameters :
 *    (Objet) e - Evènement de Riot.js
 */
this.importCSV = function(e) {
    remote.dialog.showOpenDialog(remote.getCurrentWindow(), {
        title: 'Sélectionner le fichier CSV des coureurs à importer',
        buttonLabel: 'Importer ce CSV',
        filters: [{name: 'CSV', extensions: ['csv']},{name: 'Tous les fichiers', extensions: ['*']}],
        properties: ['openFile']
        },
        function (file) {
            if (file && file.length > 0) {
                //console.log(file[0]);
                // Import des coureurs du fichier CSV
                Runners.import(file[0]);
            }
        });
}


/***************************************************************************************************************
 *  Function : importJSONBackup
 * 
 *  Importe une sauvegarde complète au format JSON
 *
 *  Parameters :
 *    (Objet) e - Evènement de Riot.js
 */
this.importJSONBackup = function(e) {
    remote.dialog.showOpenDialog(remote.getCurrentWindow(), {
        title: 'Sélectionner le fichier JSON contenant la sauvegarde à importer',
        buttonLabel: 'Importer cette sauvegarde complète',
        filters: [{name: 'JSON', extensions: ['json']},{name: 'Tous les fichiers', extensions: ['*']}],
        properties: ['openFile']
        },
        function (file) {
            if (file && file.length > 0) {
                //console.log(file[0]);
                // Import de la sauvegarde
                Backup.import(file[0]);
            }
        });
}

/***************************************************************************************************************
 *  Function : exportJSONBackup
 * 
 *  Exporte une sauvegarde complète au format JSON
 */
this.exportJSONBackup = function(e) {
    remote.dialog.showSaveDialog(remote.getCurrentWindow(), {
        title: 'Sauvegarde complète des coureurs et des courses',
        buttonLabel: 'Enregistrer ce Backup',
        filters: [{name: 'JSON', extensions: ['json']},{name: 'Tous les fichiers', extensions: ['*']}]
        },
        function (file) {
            if (file && file.length > 0) {
                //console.log(file);
                // Export de la sauvegarde
                Backup.export(file);
            }
        });
}



    </script>
</tab-runners>