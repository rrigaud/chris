<!-- SAISIE DES ARRIVEES -->
<tab-dataentry>
    <div class="container">



        <div class="row ">
            <div class="col-3">
                <div class="nav flex-column nav-pills" id="pills-tab-races" role="tablist" aria-orientation="vertical">
                    <a class="nav-link" each={Race in Races.items} id="{'Tab_Race_' + Race.Race_ID}" data-toggle="pill" href="{'#Tabpanel_Race_' + Race.Race_ID}" role="tab" aria-controls="{'Tabpanel_Race_' + Race.Race_ID}" aria-selected="true">{Race.Name}</a>
                    <button type="button" class="btn btn-outline-success" style="margin-top: 20px; margin-bottom: 10px;" data-toggle="collapse" data-target="#addrace" aria-expanded="false" aria-controls="addrace"><i class="fa fa-plus" aria-hidden="true"></i>&nbsp;Nouvelle course</button>
                    <!-- AJOUT COURSE -->
                    <div class="collapse" id="addrace">
                        <div class="input-group">
                            <div class="input-group-prepend">
                                <span class="input-group-text">Nom</span>
                            </div>
                            <input type="text" class="form-control" id="addRace_Name" placeholder="Nom de la course">
                            <div class="input-group-append">
                                <button class="btn btn-success" type="button" onclick={ addRace }><i class="fa fa-plus" aria-hidden="true"></i></button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-7 offset-1">
                <div class="tab-content" id="pills-tabpanel-races">
                    <div class="tab-pane fade show" each={Race in Races.items} id="{'Tabpanel_Race_' + Race.Race_ID}" role="tabpanel" aria-labelledby="{'Tab_Race_' + Race.Race_ID}">
                        <div>
                            <!-- AJOUT RESULTAT -->
                            <div class="input-group input-group-lg" style="margin-bottom: 20px;">
                                <div class="input-group-prepend">
                                    <span class="input-group-text">Arrivée du Dossard #</span>
                                </div>
                                <input id="{'Race_' + Race.Race_ID + '_Bibnumber'}" type="text" class="form-control" placeholder="Numéro..." onkeyup={ addResultReturn } />
                                <div class="input-group-append">
                                    <button class="btn btn-success" type="button" onclick={ addResult }><i class="fa fa-plus" aria-hidden="true"></i></button>
                                </div>
                            </div>
                            <!-- LISTING DES RESULTATS -->
                            <div class="input-group input-group-sm" each={Result in Race.Results} style="margin-bottom: 4px;">
                                <div class="input-group-prepend">
                                    <button class="btn btn-outline-primary" type="button" onclick={ moveUpResult }>
                                        <i class="fa fa-arrow-up" aria-hidden="true"></i>
                                    </button>
                                    <span class="input-group-text">{Result.Rank}</span>
                                    <button class="btn btn-outline-primary" type="button" onclick={ moveDownResult }>
                                        <i class="fa fa-arrow-down" aria-hidden="true"></i>
                                    </button>
                                </div>
                                <input type="text" class="form-control" value="{Runners.items[Runners.getIndexFromBibnumber(Result.Bibnumber)].Name}">
                                <input type="text" class="form-control col-1" value="{Runners.items[Runners.getIndexFromBibnumber(Result.Bibnumber)].Gender}">
                                <input type="text" class="form-control col-1" value="{Runners.items[Runners.getIndexFromBibnumber(Result.Bibnumber)].Class}">
                                <input type="text" class="form-control col-2" value="Dossard :" readonly>
                                <input type="text" class="form-control col-1" value="{Result.Bibnumber}">
                                <div class="input-group-append">
                                    <button type="button" class="btn btn-danger dropdown-toggle dropdown-toggle-split" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                        <span class="sr-only">Dérouler le menu</span>
                                    </button>
                                    <div class="dropdown-menu">
                                        <a class="dropdown-item" href="#" onclick={ delResult }>Supprimer ce résultat</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <!-- ADMINISTRATION : EDITION / SUPPRESSION -->
                        <div class="input-group" style="margin-top: 40px;">
                            <div class="input-group-prepend">
                                <span class="input-group-text">Course</span>
                            </div>
                            <input value="{Race.Name}" type="text" class="form-control" onkeyup={ editRaceName } />
                            <div class="input-group-append">
                                <button type="button" class="btn btn-danger dropdown-toggle dropdown-toggle-split" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                    <span class="sr-only">Dérouler le menu</span>
                                </button>
                                <div class="dropdown-menu">
                                    <a class="dropdown-item" href="#" onclick={ delAllResults }>Supprimer tous les résultats</a>
                                    <a class="dropdown-item" href="#" onclick={ delRace }>Supprimer entièrement la course</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>



            </div>
            <div class="col-3"></div>
        </div>
    </div>

    <script>

/***************************************************************************************************************
 *  Avant le chargement du tag, on récupère les données sur les courses (évite de nombreux bugs)
 */
this.on('before-mount', function() {
    // Charge les courses
    Races.load();
    Races.sort();
    Races.sortResults();
})

/***************************************************************************************************************
 *  Après le chargement du tag, on récupère les données sur les courses (évite de nombreux bugs)
 */
this.on('mount', function() {
    if (Races.items.length > 0) {
        // Sélectionne et affiche la première course de la liste
        document.getElementById("pills-tab-races").firstChild.nextElementSibling.classList.add("active");
        document.getElementById("pills-tabpanel-races").firstChild.nextElementSibling.classList.add("active");
    }
})


/***************************************************************************************************************
 *  Function : addRace
 * 
 *  Ajoute une course au tableau de données Races.races et raffraichit l'interface
 * 
 *  Parameters :
 *    (Objet) element - Coureur sur lequel on a cliqué (élément HTML créé par la boucle de Riot.js)
 */
this.addRace = function(element) {
    // On récupère le nom de la nouvelle course
    let Name = document.getElementById("addRace_Name").value;
    // On récupère un Race_ID non utilisé pour la nouvelle course
    let Race_ID = Races.getNewRaceID();
    //console.log(Runner_ID);
    if (Race_ID == -1) {
        console.log("Erreur d'ajout : Aucun ID trouvé");
        alert("Erreur d'ajout : Aucun ID trouvé");
    }
    else {
        // On ajoute la course au tableau de données races
        Races.addRace(Race_ID.toString(),Name);
        Races.sort();
        Races.save();
        // On vide le formulaire d'ajout et on le cache
        document.getElementById("addRace_Name").value = "";
        $('#addrace').collapse('hide');
    }
}

/***************************************************************************************************************
 *  Function : addResult
 * 
 *  Ajoute un résultat au tableau de données Races.results et raffraichit l'interface
 * 
 *  Parameters :
 *    (Objet) element - Course dans laquelle on a ajouté un résultat (élément HTML créé par la boucle de Riot.js)
 */
this.addResult = function(element) {
    // On récupère la course en question
    let Race_ID = element.item.Race.Race_ID;
    //console.log(Race_ID);
    // On récupère le numéro de dossard du coureur arrivé
    let Bibnumber = document.getElementById("Race_" + Race_ID + "_Bibnumber").value;
    //console.log(Bibnumber);
    // On récupère le Rank suivant non utilisé pour le nouveau résultat de cette course
    let Rank = Races.getNewRank(Race_ID);
    //console.log(Rank);
    //console.log(Runner_ID);
    if (Rank == -1) {
        console.log("Erreur d'ajout : Aucun Rank trouvé");
        alert("Erreur d'ajout : Aucun Rank trouvé");
    }
    else {
        // On ajoute la course au tableau de données races
        Races.addResult(Race_ID.toString(),Bibnumber.toString(),Rank.toString());
        Races.sortResults();
        Races.save();
        // On vide le formulaire d'ajout et on lui redonne le focus
        document.getElementById("Race_" + Race_ID + "_Bibnumber").value = "";
        document.getElementById("Race_" + Race_ID + "_Bibnumber").focus();
    }
}

/***************************************************************************************************************
 *  Function : addResultReturn
 * 
 *  Ajoute un résultat au tableau de données Races.results et raffraichit l'interface
 * 
 *  Parameters :
 *    (Objet) element - Course dans laquelle on a ajouté un résultat (élément HTML créé par la boucle de Riot.js)
 */
this.addResultReturn = function(element) {
    // On récupère la touche pressée
    let Key = element.key;
    //console.log(Key);
    // Si c'est "Entrée", on ajoute le résultat
    if (Key == "Enter") {
        this.addResult(element);
    }
}

/***************************************************************************************************************
 *  Function : editRaceName
 * 
 *  Met à jour le tableau de données Races sur modification du Nom
 *
 *  Parameters :
 *    (Objet) element - Evènement de Riot.js
 */
this.editRaceName = function(element) {
    // On récupère la course en question
    let Race_ID = element.item.Race.Race_ID;
    // On récupère l'index du tableau Races
    let Race_Index = Races.getIndexFromRaceID(Race_ID);
    // On met à jour le nom de la course
    Races.items[Race_Index].Name = element.target.value;
    Races.sort();
    Races.save();
}

/***************************************************************************************************************
 *  Function : delResult
 * 
 *  Supprime un résultat au tableau de données Races.results et raffraichit l'interface
 * 
 *  Parameters :
 *    (Objet) element - Résultat et course cliquée (élément HTML créé par la boucle de Riot.js)
 */
this.delResult = function(element) {
    // On récupère la course en question
    let Race_ID = element.item.Result.Race_ID;
    // On récupère le dossard en question
    let Bibnumber = element.item.Result.Bibnumber;
    // On récupère les index des tableaux Races et Results
    let Race_Index = Races.getIndexFromRaceID(Race_ID);
    let Result_Index = Races.items[Race_Index].Results.indexOf(element.item.Result);
    //console.log(Result_Index);
    // On supprime le résultat du tableau Results
    Races.items[Race_Index].Results.splice(Result_Index, 1);
    // On doit maintenant mettre à jour tous les Rank des suivant (qui gagnent une place)
    var i_max = Result_Index;
    for (var i = 0 ; i < i_max ; i++) {
        let Rank = parseInt(Races.items[Race_Index].Results[i].Rank, 10);
        let New_Rank = Rank - 1;
        Races.items[Race_Index].Results[i].Rank = New_Rank.toString();
    }
    Races.save();
    document.getElementById("Race_" + Race_ID + "_Bibnumber").focus();
}

/***************************************************************************************************************
 *  Function : delAllResults
 * 
 *  Supprime tous les résultats du tableau de données Races.results et raffraichit l'interface
 * 
 *  Parameters :
 *    (Objet) element - Course cliquée (élément HTML créé par la boucle de Riot.js)
 */
this.delAllResults = function(element) {
    // On récupère la course en question
    let Race_ID = element.item.Race.Race_ID;
    // On récupère l'index du tableau Races
    let Race_Index = Races.getIndexFromRaceID(Race_ID);
    // On supprime tous les résultats du tableau Results
    Races.items[Race_Index].Results = [];
    Races.save();
    document.getElementById("Race_" + Race_ID + "_Bibnumber").focus();
}

/***************************************************************************************************************
 *  Function : delRace
 * 
 *  Supprimer une course entièrement (avec ses résultats)
 * 
 *  Parameters :
 *    (Objet) element - Course cliquée (élément HTML créé par la boucle de Riot.js)
 */
this.delRace = function(element) {
    // On récupère la course en question
    let Race_ID = element.item.Race.Race_ID;
    // On récupère l'index du tableau items
    let Race_Index = Races.getIndexFromRaceID(Race_ID);
    // On supprime la course tableau items
    Races.items.splice(Race_Index, 1);
    Races.save();
    if (Races.items.length > 0) {
        // Sélectionne et affiche la première course de la liste
        document.getElementById("pills-tab-races").firstChild.nextElementSibling.classList.add("active");
        document.getElementById("pills-tabpanel-races").firstChild.nextElementSibling.classList.add("active");
    }
}

/***************************************************************************************************************
 *  Function : moveUpResult
 * 
 *  Remonte un résultat (le coureur perd une place)
 * 
 *  Parameters :
 *    (Objet) element - Résultat et course cliquée (élément HTML créé par la boucle de Riot.js)
 */
this.moveUpResult = function(element) {
    // On récupère la course en question
    let Race_ID = element.item.Result.Race_ID;
    // On récupère le Rank du coureur à monter
    let Rank_To_Move_Up = parseInt(element.item.Result.Rank, 10);
    // On
    // On récupère les index des tableaux Races et Results
    let Race_Index = Races.getIndexFromRaceID(Race_ID);
    let Result_Index = Races.items[Race_Index].Results.indexOf(element.item.Result);
    //console.log(Result_Index);
    // Si c'est le premier coureur de la liste (le dernier arrivé), il ne peut pas reculer davantage
    if (Result_Index == 0) {
        remote.dialog.showErrorBox("Erreur de déplacement", "Ce coureur est déjà le dernier !");
    }
    // Sinon, il doit reculer d'une place
    if (Result_Index > 0) {
        // Plutôt que de manipuler le tableau, on va inverser son Rank avec celui du dessus et réordonner ensuite
        Races.items[Race_Index].Results[Result_Index - 1].Rank = Rank_To_Move_Up.toString();
        let New_Rank_To_Move_Up = Rank_To_Move_Up + 1;
        Races.items[Race_Index].Results[Result_Index].Rank = New_Rank_To_Move_Up.toString();
        Races.sortResults();
        Races.save();
    }
    document.getElementById("Race_" + Race_ID + "_Bibnumber").focus();
}

/***************************************************************************************************************
 *  Function : moveDownResult
 * 
 *  Descend un résultat (le coureur gagne une place)
 * 
 *  Parameters :
 *    (Objet) element - Résultat et course cliquée (élément HTML créé par la boucle de Riot.js)
 */
this.moveDownResult = function(element) {
    // On récupère la course en question
    let Race_ID = element.item.Result.Race_ID;
    // On récupère le Rank du coureur à monter
    let Rank_To_Move_Down = parseInt(element.item.Result.Rank, 10);
    // On récupère les index des tableaux Races et Results
    let Race_Index = Races.getIndexFromRaceID(Race_ID);
    let Result_Index = Races.items[Race_Index].Results.indexOf(element.item.Result);
    //console.log(Result_Index);
    let Result_Index_Max = Races.items[Race_Index].Results.length - 1;
    // Si c'est le dernier coureur de la liste (le premier arrivé), il ne peut pas avancer davantage
    if (Result_Index == Result_Index_Max) {
        remote.dialog.showErrorBox("Erreur de déplacement", "Ce coureur est déjà le premier !");
    }
    // Sinon, il doit reculer d'une place
    if (Result_Index < Result_Index_Max) {
        // Plutôt que de manipuler le tableau, on va inverser son Rank avec celui du dessous et réordonner ensuite
        Races.items[Race_Index].Results[Result_Index + 1].Rank = Rank_To_Move_Down.toString();
        let New_Rank_To_Move_Down = Rank_To_Move_Down - 1;
        Races.items[Race_Index].Results[Result_Index].Rank = New_Rank_To_Move_Down.toString();
        Races.sortResults();
        Races.save();
    }
    document.getElementById("Race_" + Race_ID + "_Bibnumber").focus();
}


    </script>
</tab-dataentry>