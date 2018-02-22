<!-- AFFICHAGE DES RESULTATS -->
<tab-results>
    <div class="row" style="margin:10px;">
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
        <div class="col" each={Race in Races.items}>
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
    <script>

/***************************************************************************************************************
 *  Avant le chargement du tag, on récupère les données sur les courses (évite de nombreux bugs)
 */
this.on('before-mount', function() {

})

/***************************************************************************************************************
 *  Après le chargement du tag, on récupère les données sur les courses (évite de nombreux bugs)
 */
this.on('mount', function() {

})



    </script>
</tab-results>