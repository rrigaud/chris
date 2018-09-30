<!-- AFFICHAGE DES RESULTATS -->
<tab-results>
    <div class="container">
        <div class="row ">
            <div class="col-3">
                <div class="nav flex-column nav-pills" id="pills-tab-races" role="tablist" aria-orientation="vertical">
                    <a class="nav-link active" id="Tab_Result_All" data-toggle="pill" href="#Tabpanel_Result_All" role="tab" aria-controls="Tabpanel_Result_All" aria-selected="true">Classement Général</a>
                    <a class="nav-link" each={Race in Races.items} id="{'Tab_Result_' + Race.Race_ID}" data-toggle="pill" href="{'#Tabpanel_Result_' + Race.Race_ID}" role="tab" aria-controls="{'Tabpanel_Result_' + Race.Race_ID}" aria-selected="true">{Race.Name}</a>
                    <button type="button" class="btn btn-outline-warning" style="margin-top: 200px; margin-bottom: 10px;" onclick={ displayPrintResults }><i class="fa fa-print" aria-hidden="true"></i>&nbsp;Imprimer les résultats</button>
                </div>
            </div>
            <div class="col-7 offset-1">
                <div class="tab-content" id="pills-tabpanel-races">
                    <div class="tab-pane fade show active" id="Tabpanel_Result_All" role="tabpanel" aria-labelledby="Tabpanel_Result_All">
                        <!-- AFFICHAGE DU RESULTAT GLOBAL -->
                        <div class="col">
                            <div class="card bg-light border-warning">
                                <div class="card-header bg-warning">TOUTES COURSES CONFONDUES</div>
                                <img class="card-img-top" src="./assets/Podium.png" alt="Podium Image" style="padding:4px;">
                                <div class="card-body">
                                    <div class="input-group" style="margin-bottom: 4px;" each={Class in Results.getBestClass()}>
                                        <div class="input-group-prepend">
                                            <span class="input-group-text bg-warning">{Class.Name}</span>
                                        </div>
                                        <input value="{Class.School}" type="text" class="form-control" />
                                        <div class="input-group-append">
                                            <span class="input-group-text">{Class.TotalRank}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- AFFICHAGE DES RESULTATS DE CHAQUE COURSE -->
                    <div class="tab-pane fade show" each={Race in Races.items} id="{'Tabpanel_Result_' + Race.Race_ID}" role="tabpanel" aria-labelledby="{'Tab_Result_' + Race.Race_ID}">
                        <div class="card">
                            <div class="card-header">{Race.Name}</div>
                            <div class="card-body">
                                <div class="input-group input-group-sm" style="margin-bottom: 4px;" each={Class in Results.getClassRanking(Race.Race_ID,6)}>
                                    <div class="input-group-prepend">
                                        <span class="input-group-text bg-warning">{Class.Name}</span>
                                    </div>
                                    <input value="{Class.School}" type="text" class="form-control" />
                                    <div class="input-group-append">
                                        <span class="input-group-text">{Class.TotalRank}</span>
                                    </div>
                                </div>
                            </div>
                            <ul class="list-group list-group-flush">
                                <li class="list-group-item">Classement Individuel</li>
                            </ul>
                            <div class="card-body">
                                <div class="input-group input-group-sm" style="margin-bottom: 4px;" each={Runner in Results.getRunnerRanking(Race.Race_ID)}>
                                    <div class="input-group-prepend">
                                        <span class="input-group-text">{Runner.Rank}</span>
                                    </div>
                                    <input value="{Runner.Name}" type="text" class="form-control" />
                                    <div class="input-group-append">
                                        <span class="input-group-text">{Runner.Class}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>



            </div>
            <div class="col-3"></div>
        </div>
    </div>

    <!-- FENETRE MODALE : IMPRESSION DES RESULTATS -->
    <div class="modal fade" id="printResults" tabindex="-1" role="dialog" aria-labelledby="printResultsTitle" aria-hidden="true">
        <div class="modal-dialog modal-lg" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="printResultsTitle">Impression des résultats</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="row justify-content-center">
                        <button class="btn btn-primary" type="button" onclick={ genResults }><i class="fa fa-clone" aria-hidden="true"></i>
        &nbsp;Rafraichir / Recharger le PDF</button>
                    </div>
                    <webview id="resultsPreview" style="display:inline-flex; width:740px; height:520px" plugins></webview>
                    <span class="input-group-text d-none" id="printResult_Displayed_Index"></span>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Annuler</button>
                    <button type="button" class="btn btn-primary" onclick={ printResults }><i class="fa fa-print" aria-hidden="true"></i>&nbsp;Imprimer les résultats</button>
                </div>
            </div>
        </div>
    </div>

    <script>

/***************************************************************************************************************
 *  Avant le chargement du tag, on récupère les données sur les courses (évite de nombreux bugs)
 */
this.on('before-mount', function() {
    this.userDataPath = remote.app.getPath('userData');
})

/***************************************************************************************************************
 *  Après le chargement du tag, on récupère les données sur les courses (évite de nombreux bugs)
 */
this.on('mount', function() {

})

/***************************************************************************************************************
 *  Function : displayPrintResults
 * 
 *  Affiche une fenêtre d'impression pour les résultats
 *
 *  Parameters :
 *    (Objet) e - Evènement de Riot.js
 */
this.displayPrintResults = function(e) {
    document.getElementById("resultsPreview").src = "";
    // Fichier PDF contenant les résultats à imprimer (par défaut dans les préférences utilisateurs)
    var PDF_File = path.join(this.userDataPath, 'Results.pdf');
    // On affiche la fenêtre modale
    $('#printResults').modal('toggle');

    var doc = new PDFDocument({layout : 'portrait',autoFirstPage: false});
    doc.pipe(fs.createWriteStream(PDF_File));
    
    // Récupération des polices
    var Font_Ubuntu = path.join(__dirname,'fonts','Ubuntu-B.ttf');

    // Classement général
    doc.addPage();
    doc.font(Font_Ubuntu)
        .fontSize(30)
        .text('CROSS » Classement général', 30, 30, {align: 'center'})
        .moveDown(0.5);
    var bestClasses = Results.getBestClass();
    var i_max = bestClasses.length;
    for (var i = 0 ; i < i_max ; i++) {
        var Rank = i + 1;
        doc.font(Font_Ubuntu)
            .fontSize(20)
            .text(Rank.toLocaleString('fr-FR', {minimumIntegerDigits: 2, useGrouping:false}) + '   »    ' + bestClasses[i].Name + ' ( ' + bestClasses[i].School + ' ) avec ' + bestClasses[i].TotalRank + ' points', {align: 'left'})
            .moveDown(0.1);
    }


    // Classement par course
    var i_max = Races.items.length;
    for (var i = 0 ; i < i_max ; i++) {
        doc.addPage();
        doc.font(Font_Ubuntu)
            .fontSize(30)
            .text('CROSS » '+ Races.items[i].Name + ' » Par classe', 30, 30, {align: 'center'})
            .moveDown(0.5);
        // Classement par classe
        var bestRaceClasses = Results.getClassRanking(Races.items[i].Race_ID,6)
        var j_max = bestRaceClasses.length;
        for (var j = 0 ; j < j_max ; j++) {
            var Rank = j + 1;
            doc.font(Font_Ubuntu)
                .fontSize(20)
                .text(Rank.toLocaleString('fr-FR', {minimumIntegerDigits: 2, useGrouping:false}) + '   »    ' + bestRaceClasses[j].Name + ' ( ' + bestRaceClasses[j].School + ' ) avec ' + bestRaceClasses[j].TotalRank + ' points', {align: 'left'})
                .moveDown(0.1);
        }
        // Classement individuel
        doc.addPage();
        doc.font(Font_Ubuntu)
            .fontSize(30)
            .text('CROSS » '+ Races.items[i].Name + ' » Par élève', 30, 30, {align: 'center'})
            .moveDown(0.5);
        var bestRaceRunners = Results.getRunnerRanking(Races.items[i].Race_ID,6)
        var j_max = bestRaceRunners.length;
        for (var j = 0 ; j < j_max ; j++) {
            doc.font(Font_Ubuntu)
                .fontSize(12)
                .text(parseInt(bestRaceRunners[j].Rank).toLocaleString('fr-FR', {minimumIntegerDigits: 3, useGrouping:false}) + '   »    ' + bestRaceRunners[j].Name + ' ( ' + bestRaceRunners[j].Class + ' )', {align: 'left'})
                .moveDown(0.1);
        }
    }
    // end and display the document in the iframe to the right
    doc.end();
    // On affiche le document PDF dans la preview
    document.getElementById("resultsPreview").src = PDF_File;
}

/***************************************************************************************************************
 *  Function : genResults
 * 
 *  Génère les résultats
 *
 *  Parameters :
 *    (Objet) e - Evènement de Riot.js
 */
this.genResults = function(e) {
    document.getElementById("resultsPreview").reload();
}

/***************************************************************************************************************
 *  Function : printResults
 * 
 *  Imprime les résultats
 *
 *  Parameters :
 *    (Objet) e - Evènement de Riot.js
 */
this.printResults = function(e) {
    // On récupère l'index du coureur dans le tableau d'affichage courant Runners_Displayed
    var index_Runners_Displayed = document.getElementById("printRunner_Displayed_Index").innerHTML;
}


    </script>
</tab-results>