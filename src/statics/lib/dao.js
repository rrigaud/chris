// const electron = require('electron');
// const path = require('path');
const { Notify } = require('quasar');
const fse = require('fs-extra');

/***************************************************************************************************************
*  Object : DAO
*
*  Cet objet gère la lecture et l'écriture des informations dans un fichier JSON
*/
const DAO = {
    // Fichier JSON
    file: '',
    /***************************************************************************************************************
    *  Données du cross au format JSON :
    *
    *  { runners : [{ runnerID, name, gender, group, subgroup }],
    *    races : [{ raceID, name, color, nbRunnersByGroup, nbRunnersBySubgroup, completed :[runnerID], dropped :[runnerID], missing :[runnerID] }] }
    *
    */
    data: { runners: [], races: [] },
    /***************************************************************************************************************
    *  Function : init
    *
    *  Charge l'URL du fichier fileJSON en mémoire
    *
    *  Parameters :
    *    (String) fileJSON - URL d'un fichier JSON
    */
    init: function (fileJSON) {
        this.file = fileJSON;
    },
    /***************************************************************************************************************
    *  Function : load
    *
    *  Charge les données du fichier JSON en mémoire (de manière synchrone, sinon la suite du programme charge
    *  les anciennes données avant que les nouvelles ne soient stockées dans l'objet DAO)
    */
    load: function () {
        this.data = fse.readJsonSync(this.file);
        Notify.create({
            message: `Fichier chargé : ${this.getFilename()}`,
            timeout: 5000,
            color: 'positive',
            icon: 'directions_run',
            position: 'bottom'
        })
    },
    /***************************************************************************************************************
    *  Function : getFilename
    *
    *  Retourne le nom du fichier
    */
    getFilename: function () {
        const filename = this.file.substring(this.file.lastIndexOf('/') + 1);
        return filename
    },
    /***************************************************************************************************************
    *  Function : save
    *
    *  Enregistre les données
    */
    save: function () {
        // S'il n'y a aucun fichier associé
        if (this.file === '') {
            Notify.create({
                message: 'Enregistrement impossible (Il faut commencer par créer / ouvrir un fichier)',
                timeout: 3000,
                color: 'warning',
                icon: 'save',
                position: 'bottom'
            })
        } else {
            // Sinon, on enregistre normalement
            fse.writeJson(this.file, this.data, err => {
                if (err) throw err;
                Notify.create({
                    message: `Fichier enregistré : ${this.getFilename()}`,
                    timeout: 2000,
                    color: 'positive',
                    icon: 'save',
                    position: 'bottom'
                })
            })
        }
    },
    /***************************************************************************************************************
    ****************************************************************************************************************
    ****************************************************************************************************************
    ****************************************************************************************************************
    * RUNNERS
    */
    /***************************************************************************************************************
    *  Function : runnersGetIndexFromRunnerID
    *
    *  Retourne l'index du coureur dans le tableau Runners
    *
    *  Parameters :
    *    (Integer) runnerID - ID du coureur
    */
    runnersGetIndexFromRunnerID: function (runnerID) {
        var index = -1;
        var iMax = this.data.runners.length;
        for (var i = 0; i < iMax; i++) {
            if (this.data.runners[i].runnerID === runnerID) { index = i; }
        }
        return index
    },
    /***************************************************************************************************************
    *  Function : runnersGetIndexFromBibNumber
    *
    *  Retourne l'index du coureur dans le tableau Runners
    *
    *  Parameters :
    *    (Integer) bibNumber - Dossard du coureur
    */
    runnersGetIndexFromBibNumber: function (bibNumber) {
        var index = -1;
        var iMax = this.data.runners.length;
        for (var i = 0; i < iMax; i++) {
            if (this.data.runners[i].bibNumber === bibNumber) { index = i; }
        }
        return index
    },
    /***************************************************************************************************************
    *  Function : runnersGetNewRunnerID
    *
    *  Retourne le premier runnerID de disponible du tableau de données Runners
    */
    runnersGetNewRunnerID: function () {
        let newRunnerID = 0;
        var iMax = this.data.runners.length;
        for (var i = 0; i < iMax; i++) {
            const runnerID = parseInt(this.data.runners[i].runnerID, 10);
            newRunnerID = (runnerID > newRunnerID) ? runnerID : newRunnerID;
        }
        return parseInt(newRunnerID, 10) + 1;
    },
    /***************************************************************************************************************
    *  Function : runnersAdd
    *
    *  Ajoute un coureur au tableau des coureurs
    *
    *  Parameters :
    *    (String) runnerID - ID du coureur
    *    (String) name - NOM Prénom du coureur
    *    (String) gender - Genre M/F du coureur
    *    (String) group - Groupe du coureur
    *    (String) subgroup - Sous-groupe du coureur
    *    (String) bibNumber - Dossard du coureur
    */
    runnersAdd: function (runnerID, name, gender, group, subgroup, bibNumber) {
        this.data.runners.push({ runnerID: runnerID, name: name, gender: gender, group: group, subgroup: subgroup, bibNumber: bibNumber });
    },
    /***************************************************************************************************************
    *  Function : runnersEdit
    *
    *  Modifie un coureur
    *
    *  Parameters :
    *    (String) runnerID - ID du coureur
    *    (String) name - NOM Prénom du coureur
    *    (String) gender - Genre M/F du coureur
    *    (String) group - Groupe du coureur
    *    (String) subgroup - Sous-groupe du coureur
    *    (String) bibNumber - Dossard du coureur
    */
    runnersEdit: function (runnerID, name, gender, group, subgroup, bibNumber) {
        const runnerIndex = this.runnersGetIndexFromRunnerID(runnerID);
        this.data.runners[runnerIndex] = {
            runnerID: runnerID,
            name: name,
            gender: gender,
            group: group,
            subgroup: subgroup,
            bibNumber: bibNumber
        };
    },
    /***************************************************************************************************************
    *  Function : runnersDel
    *
    *  Supprime un coureur du tableau des coureurs
    *
    *  Parameters :
    *    (String) runnerID - ID du coureur
    */
    runnersDel: function (runnerID) {
        const runnerIndex = this.runnersGetIndexFromRunnerID(runnerID);
        this.data.runners.splice(runnerIndex, 1);
        // TODO : Supprimer le coureur des courses à partir de son numéro de dossard
    },
    /***************************************************************************************************************
    *  Function : runnersGetIndexesFromBibNumber
    *
    *  Retourne un tableau d'index des coureurs portant un certain numéro de dossard
    *
    *  Parameters :
    *    (String) bibNumber - Numéro de dossard
    */
    runnersGetIndexesFromBibNumber: function (bibNumber) {
        const runnerIndexes = [];
        var iMax = this.data.runners.length;
        for (var i = 0; i < iMax; i++) {
            // Si on trouve un coureur avec ce numéro de dossard
            if (parseInt(this.data.runners[i].bibNumber, 10) === parseInt(bibNumber, 10)) {
                runnerIndexes.push(i);
            }
        }
        return runnerIndexes;
    },
    /***************************************************************************************************************
    *  Function : runnersGetRedundantsBibNumbers
    *
    *  Retourne un tableau de tableaux de coureurs qui ont le même dossard
    */
    runnersGetRedundantsBibNumbers: function () {
        const redundants = [];
        var iMax = this.data.runners.length;
        for (var i = 0; i < iMax; i++) {
            const bibNumberRedundants = this.runnersGetIndexesFromBibNumber(this.data.runners[i].bibNumber);
            // Si on trouve plus d'un coureur avec ce numéro de dossard
            if (bibNumberRedundants.length > 1) {
                // C'est qu'il y a doublon
                redundants.push(bibNumberRedundants);
            }
        }
        return redundants;
    },
    /***************************************************************************************************************
    ****************************************************************************************************************
    ****************************************************************************************************************
    ****************************************************************************************************************
    * RACES
    */
    /***************************************************************************************************************
    *  Function : racesGetIndexFromRaceID
    *
    *  Retourne l'index de la course dans le tableau Races
    *
    *  Parameters :
    *    (Integer) raceID - ID de la course
    */
    racesGetIndexFromRaceID: function (raceID) {
        var index = -1;
        var iMax = this.data.races.length;
        for (var i = 0; i < iMax; i++) {
            if (this.data.races[i].raceID === raceID) { index = i; }
        }
        return index
    },
    /***************************************************************************************************************
    *  Function : racesGetResultIndex
    *
    *  Retourne le resultIndex du runnerID du coureur d'une course et d'un tableau de résultats donnés
    *
    *  Parameters :
    *    (Integer) raceIndex - Index de la course
    *    (String) runnerID - ID du coureur
    *    (String) arrayResults - completed/dropped/missing selon si le coureur a fini/abandonné/été absent
    */
    racesGetResultIndex: function (raceIndex, RunnerID, arrayResults) {
        var index = -1;
        // Par défaut, on ajoute le résultat dans les Arrivées (completed)
        if (arrayResults === 'dropped') {
            var iMax = this.data.races[raceIndex].dropped.length;
            for (var i = 0; i < iMax; i++) {
                if (this.data.races[raceIndex].dropped[i] === RunnerID) { index = i; }
            }
        } else if (arrayResults === 'missing') {
            var jMax = this.data.races[raceIndex].missing.length;
            for (var j = 0; j < jMax; j++) {
                if (this.data.races[raceIndex].missing[j] === RunnerID) { index = j; }
            }
        } else {
            var kMax = this.data.races[raceIndex].completed.length;
            for (var k = 0; k < kMax; k++) {
                if (this.data.races[raceIndex].completed[k] === RunnerID) { index = k; }
            }
        }
        return index
    },
    /***************************************************************************************************************
    *  Function : racesGetNewRaceID
    *
    *  Retourne le premier raceID de disponible du tableau de données Races
    */
    racesGetNewRaceID: function () {
        let newRaceID = 0;
        var iMax = this.data.races.length;
        for (var i = 0; i < iMax; i++) {
            const raceID = parseInt(this.data.races[i].raceID, 10);
            newRaceID = (raceID > newRaceID) ? raceID : newRaceID;
        }
        return parseInt(newRaceID, 10) + 1;
    },
    /***************************************************************************************************************
    *  Function : racesAdd
    *
    *  Ajoute une course au tableau des courses
    *
    *  Parameters :
    *    (String) raceID - ID de la course
    *    (String) name - Nom de la course
    *    (String) color - Couleur de la course
    *    (String) nbRunnersByGroup - Nombre de coureurs à compter dans le groupe
    *    (String) nbRunnersBySubgroup - Nombre de coureurs à compter dans le sous-groupe
    */
    racesAdd: function (raceID, name, color, nbRunnersByGroup, nbRunnersBySubgroup) {
        this.data.races.push({ raceID: raceID, name: name, color: color, nbRunnersByGroup: nbRunnersByGroup, nbRunnersBySubgroup: nbRunnersBySubgroup, completed: [], dropped: [], missing: [] });
    },
    /***************************************************************************************************************
    *  Function : racesEdit
    *
    *  Modifie une course
    *
    *  Parameters :
    *    (String) raceID - ID de la course
    *    (String) name - Nom de la course
    *    (String) color - Couleur de la course
    *    (String) nbRunnersByGroup - Nombre de coureurs à compter dans le groupe
    *    (String) nbRunnersBySubgroup - Nombre de coureurs à compter dans le sous-groupe
    */
    racesEdit: function (raceID, name, color, nbRunnersByGroup, nbRunnersBySubgroup) {
        const raceIndex = this.racesGetIndexFromRaceID(raceID);
        // On récupère les tableaux de résultats de la course, sans les changer
        const completed = this.data.races[raceIndex].completed;
        const dropped = this.data.races[raceIndex].dropped;
        const missing = this.data.races[raceIndex].missing;
        this.data.races[raceIndex] = {
            raceID: raceID,
            name: name,
            color: color,
            nbRunnersByGroup: nbRunnersByGroup,
            nbRunnersBySubgroup: nbRunnersBySubgroup,
            completed: completed,
            dropped: dropped,
            missing: missing
        };
    },
    /***************************************************************************************************************
    *  Function : racesDel
    *
    *  Supprime une course du tableau des courses
    *
    *  Parameters :
    *    (String) raceID - ID d'une course
    */
    racesDel: function (raceID) {
        const raceIndex = this.racesGetIndexFromRaceID(raceID);
        this.data.races.splice(raceIndex, 1);
    },
    /***************************************************************************************************************
    *  Function : racesCheckExistence
    *
    *  Renvoie true si la course existe
    *
    *  Parameters :
    *    (String) raceID - ID d'une course
    */
    racesCheckExistence: function (raceID) {
        let raceExists = false;
        const iMax = this.data.races.length;
        for (var i = 0; i < iMax; i++) {
            if (this.data.races[i].raceID === raceID) { raceExists = true; }
        }
        return raceExists
    },
    /***************************************************************************************************************
    *  Function : racesGetDataResults
    *
    *  Retourne les résultats [{rank, runnerIndex}] d'une course et d'un tableau donné (Arrivées/Abandons/Absents)
    *
    *  NOTE : Incroyable mais impossible d'accéder à this.data.runners[i].name !!! CA PLANTE sans message d'erreur
    *         Je peux accéder à l'objet this.data.runners[i], et même à this.data.runners[i].gender, group,...
    *         Mais pas à son name ! Impossible, je ne comprends pas...
    *         Alors je triche, et je renvoie uniquement les runnerIndex, puis j'utilise dao.data.runners directement
    *         depuis le tableau html (table dataResults) pour afficher les informations (name, gender,...)
    *
    *  Parameters :
    *    (String) raceID - ID de la course
    *    (String) arrayResults - completed/dropped/missing selon la liste de résultats à afficher
    */
    racesGetDataResults: function (raceID, arrayResults) {
        const raceIndex = this.racesGetIndexFromRaceID(raceID);
        const results = [];
        // Par défaut, on renvoie les résultats des Arrivées (completed)
        if (arrayResults === 'dropped') {
            const iMax = this.data.races[raceIndex].dropped.length;
            for (var i = 0; i < iMax; i++) {
                const rank = i + 1;
                const runnerID = this.data.races[raceIndex].dropped[i];
                const runnerIndex = this.runnersGetIndexFromRunnerID(runnerID);
                results.push({ rank: rank, runnerIndex: runnerIndex });
            }
        } else if (arrayResults === 'missing') {
            const jMax = this.data.races[raceIndex].missing.length;
            for (var j = 0; j < jMax; j++) {
                const rank = j + 1;
                const runnerID = this.data.races[raceIndex].missing[j];
                const runnerIndex = this.runnersGetIndexFromRunnerID(runnerID);
                results.push({ rank: rank, runnerIndex: runnerIndex });
            }
        } else {
            const kMax = this.data.races[raceIndex].completed.length;
            for (var k = 0; k < kMax; k++) {
                const rank = k + 1;
                const runnerID = this.data.races[raceIndex].completed[k];
                const runnerIndex = this.runnersGetIndexFromRunnerID(runnerID);
                results.push({ rank: rank, runnerIndex: runnerIndex });
            }
        }
        return results
    },
    /***************************************************************************************************************
    *  Function : racesRunnerAlreadyPresent
    *
    *  Retourne true si ce coureur est déjà présent dans un tableau d'arrivée de cette course (completed/dropped/missing)
    *
    *  Parameters :
    *    (String) raceID - ID de la course
    *    (String) runnerID - ID du coureur
    */
    racesRunnerAlreadyPresent: function (raceID, runnerID) {
        let runnerAlreadyPresent = false;
        const raceIndex = this.racesGetIndexFromRaceID(raceID);
        // On vérifie dans le tableau "completed"
        const iMax = this.data.races[raceIndex].completed.length;
        for (var i = 0; i < iMax; i++) {
            if (this.data.races[raceIndex].completed[i] === runnerID) { runnerAlreadyPresent = true; }
        }
        // On vérifie dans le tableau "dropped"
        const jMax = this.data.races[raceIndex].dropped.length;
        for (var j = 0; j < jMax; j++) {
            if (this.data.races[raceIndex].dropped[j] === runnerID) { runnerAlreadyPresent = true; }
        }
        // On vérifie dans le tableau "missing"
        const kMax = this.data.races[raceIndex].missing.length;
        for (var k = 0; k < kMax; k++) {
            if (this.data.races[raceIndex].missing[k] === runnerID) { runnerAlreadyPresent = true; }
        }
        return runnerAlreadyPresent
    },
    /***************************************************************************************************************
    *  Function : racesAddResult
    *
    *  Ajoute un coureur (runnerID) dans les résultats d'une course et d'un tableau donné (Arrivées/Abandons/Absents)
    *
    *  Parameters :
    *    (String) raceID - ID de la course
    *    (String) runnerID - ID du coureur
    *    (String) arrayResults - completed/dropped/missing selon si le coureur a fini/abandonné/été absent
    */
    racesAddResult: function (raceID, runnerID, arrayResults) {
        const raceIndex = this.racesGetIndexFromRaceID(raceID);
        // Par défaut, on ajoute le résultat dans les Arrivées (completed)
        if (arrayResults === 'dropped') {
            this.data.races[raceIndex].dropped.push(runnerID);
        } else if (arrayResults === 'missing') {
            this.data.races[raceIndex].missing.push(runnerID);
        } else {
            this.data.races[raceIndex].completed.push(runnerID);
        }
    },
    /***************************************************************************************************************
    *  Function : racesDelResult
    *
    *  Supprime un coureur (runnerID) dans les résultats d'une course et d'un tableau donné (Arrivées/Abandons/Absents)
    *
    *  Parameters :
    *    (String) raceID - ID de la course
    *    (String) runnerID - ID du coureur
    *    (String) arrayResults - completed/dropped/missing selon si le coureur a fini/abandonné/été absent
    */
    racesDelResult: function (raceID, runnerID, arrayResults) {
        const raceIndex = this.racesGetIndexFromRaceID(raceID);
        const resultIndex = this.racesGetResultIndex(raceIndex, runnerID, arrayResults);
        // Par défaut, on supprime le résultat dans les Arrivées (completed)
        if (arrayResults === 'dropped') {
            this.data.races[raceIndex].dropped.splice(resultIndex, 1);
        } else if (arrayResults === 'missing') {
            this.data.races[raceIndex].missing.splice(resultIndex, 1);
        } else {
            this.data.races[raceIndex].completed.splice(resultIndex, 1);
        }
    },
    /***************************************************************************************************************
    *  Function : racesMoveResultDown
    *
    *  Déplace un résultat vers le bas (le coureur gagne une place au classement)
    *
    *  Parameters :
    *    (String) raceID - ID de la course
    *    (String) runnerID - ID du coureur
    *    (String) arrayResults - completed/dropped/missing selon si le coureur a fini/abandonné/été absent
    *    (String) rank - Classement du coureur (= resultIndex + 1, ce qui sera très pratique)
    */
    racesMoveResultDown: function (raceID, runnerID, arrayResults, rank) {
        const raceIndex = this.racesGetIndexFromRaceID(raceID);
        const resultIndex = parseInt(rank, 10) - 1;
        // Si le rank est > 1 (on est au moins 2ème...)
        if (resultIndex > 0) {
            // Par défaut, on utilise le tableau des Arrivées (completed)
            if (arrayResults === 'dropped') {
                // On échange le runnerID des resultIndex et resultIndex - 1
                this.data.races[raceIndex].dropped[resultIndex] = this.data.races[raceIndex].dropped[resultIndex - 1];
                this.data.races[raceIndex].dropped[resultIndex - 1] = runnerID;
            } else if (arrayResults === 'missing') {
                // On échange le runnerID des resultIndex et resultIndex - 1
                this.data.races[raceIndex].missing[resultIndex] = this.data.races[raceIndex].missing[resultIndex - 1];
                this.data.races[raceIndex].missing[resultIndex - 1] = runnerID;
            } else {
                // On échange le runnerID des resultIndex et resultIndex - 1
                this.data.races[raceIndex].completed[resultIndex] = this.data.races[raceIndex].completed[resultIndex - 1];
                this.data.races[raceIndex].completed[resultIndex - 1] = runnerID;
            }
            // On enregistre le fichier
            this.save();
        } else {
            Notify.create({
                message: 'Impossible de gagner une place, il est déjà premier !',
                timeout: 3000,
                color: 'negative',
                icon: 'warning',
                position: 'bottom'
            })
        }
    },
    /***************************************************************************************************************
    *  Function : racesMoveResultUp
    *
    *  Déplace un résultat vers le haut (le coureur perd une place au classement)
    *
    *  Parameters :
    *    (String) raceID - ID de la course
    *    (String) runnerID - ID du coureur
    *    (String) arrayResults - completed/dropped/missing selon si le coureur a fini/abandonné/été absent
    *    (String) rank - Classement du coureur (= resultIndex + 1, ce qui sera très pratique)
    */
    racesMoveResultUp: function (raceID, runnerID, arrayResults, rank) {
        const raceIndex = this.racesGetIndexFromRaceID(raceID);
        const resultIndex = parseInt(rank, 10) - 1;
        // On récupère d'abord l'indexMax du tableau cible
        let indexMax = '';
        // Par défaut, on utilise le tableau des Arrivées (completed)
        if (arrayResults === 'dropped') {
            indexMax = this.data.races[raceIndex].dropped.length - 1;
        } else if (arrayResults === 'missing') {
            indexMax = this.data.races[raceIndex].missing.length - 1;
        } else {
            indexMax = this.data.races[raceIndex].completed.length - 1;
        }
        // Si le rank est < rankMax (on n'est pas dernier...)
        if (resultIndex < indexMax) {
            // Par défaut, on utilise le tableau des Arrivées (completed)
            if (arrayResults === 'dropped') {
                // On échange le runnerID des resultIndex et resultIndex + 1
                this.data.races[raceIndex].dropped[resultIndex] = this.data.races[raceIndex].dropped[resultIndex + 1];
                this.data.races[raceIndex].dropped[resultIndex + 1] = runnerID;
            } else if (arrayResults === 'missing') {
                // On échange le runnerID des resultIndex et resultIndex - 1
                this.data.races[raceIndex].missing[resultIndex] = this.data.races[raceIndex].missing[resultIndex + 1];
                this.data.races[raceIndex].missing[resultIndex + 1] = runnerID;
            } else {
                // On échange le runnerID des resultIndex et resultIndex - 1
                this.data.races[raceIndex].completed[resultIndex] = this.data.races[raceIndex].completed[resultIndex + 1];
                this.data.races[raceIndex].completed[resultIndex + 1] = runnerID;
            }
            // On enregistre le fichier
            this.save();
        } else {
            Notify.create({
                message: 'Impossible de perdre une place, il est déjà dernier !',
                timeout: 3000,
                color: 'negative',
                icon: 'warning',
                position: 'bottom'
            })
        }
    },
    /***************************************************************************************************************
    ****************************************************************************************************************
    ****************************************************************************************************************
    ****************************************************************************************************************
    * RANKING
    */
    /***************************************************************************************************************
    *  Function : rankingCompare
    *
    *  Fonction de comparaison pour le tri des groupes et sous-groupes : points (croissant)
    *
    *  Parameters :
    *    (String) a - Groupe A
    *    (String) b - Groupe B
    */
    rankingCompare: function (a, b) {
        if (parseInt(a.points, 10) < parseInt(b.points, 10)) {
            return -1;
        }
        if (parseInt(a.points, 10) > parseInt(b.points, 10)) {
            return 1;
        }
    },
    /***************************************************************************************************************
    *  Function : rankingGetColor
    *
    *  Retourne une couleur en fonction du rank, piochée dans un tableau prédéfini
    *
    *  Parameters :
    *    (String) rank - Rank
    */
    rankingGetColor: function (rank) {
        // Tableau plus ou moins dégradé de 12 couleurs
        const colors = ['red', 'orange', 'yellow', 'lime', 'green', 'teal', 'cyan', 'blue', 'indigo', 'deep-purple', 'brown', 'grey-10'];
        // Si plus de 12 groupes, on recommence à donner les premières couleurs, et ainsi de suite
        const index = rank % colors.length - 1;
        const color = colors[index];
        return color
    },
    /***************************************************************************************************************
    *  Function : rankingGetGroups
    *
    *  Retourne le tableau des groupes ({rank, group, points, number, numberColor, progressbar, color}) ayant participé à une course donnée
    *
    *  Parameters :
    *    (Integer) raceID - ID de la course
    */
    rankingGetGroups: function (raceID) {
        // Nombre MAX de coureurs à compter par sous-groupe
        const raceIndex = this.racesGetIndexFromRaceID(raceID);
        const nbRunnersByGroup = parseInt(this.data.races[raceIndex].nbRunnersByGroup, 10);
        const groups = [];
        const runnerIndexes = this.racesGetDataResults(raceID, 'completed');
        var iMax = runnerIndexes.length;
        for (var i = 0; i < iMax; i++) {
            const runnerGroup = this.data.runners[runnerIndexes[i].runnerIndex].group;
            const runnerRank = runnerIndexes[i].rank;
            let groupIndex = 0;
            let groupPoints = 0;
            // Nombre de coureurs comptabilisés
            let groupNumber = 0;
            // Pour chaque coureur, on regarde si son groupe est déjà dans notre liste de groupes
            let groupExist = false;
            var jMax = groups.length;
            for (var j = 0; j < jMax; j++) {
                if (groups[j].group === runnerGroup) {
                    groupExist = true;
                    groupIndex = j;
                    groupPoints = groups[j].points;
                    groupNumber = groups[j].number;
                    // Si on n'est pas encore au max du nombre de coureurs à compter
                    if (groups[j].number < nbRunnersByGroup) {
                        // On ajoute le Rank du coureur actuel aux points de son groupe
                        groupPoints = groupPoints + runnerRank;
                        // On ajoute 1 au nombre de coureurs pris en compte pour son groupe
                        groupNumber = groupNumber + 1;
                    }
                }
            }
            // Si le groupe de ce coureur n'existe pas, on l'ajoute à notre liste
            if (!groupExist) {
                groups.push({ group: runnerGroup, points: parseInt(runnerRank, 10), number: 1 });
            // Sinon, on met à jour au bon endroit
            } else {
                groups[groupIndex] = {
                    group: runnerGroup,
                    points: groupPoints,
                    number: groupNumber
                };
            }
        }
        // On range les groupes par ordre croissant de points
        groups.sort(this.rankingCompare);
        // On ajoute maintenant le rank, la progressbar et sa couleur... pour chaque sous-groupe
        var kMax = groups.length;
        for (var k = 0; k < kMax; k++) {
            const maxPoints = groups[kMax - 1].points;
            const group = groups[k].group;
            const points = groups[k].points;
            const number = groups[k].number;
            const numberColor = (number === nbRunnersByGroup) ? 'green' : 'red';
            const progressbar = groups[k].points / maxPoints;
            const color = this.rankingGetColor(k + 1);
            groups[k] = {
                rank: k + 1,
                group: group,
                points: points,
                number: number,
                numberColor: numberColor,
                progressbar: progressbar,
                color: color
            };
        }
        return groups
    },
    /***************************************************************************************************************
    *  Function : rankingGetSubgroups
    *
    *  Retourne le tableau des sous-groupes ({rank, subgroup, group, points, number, numberColor, progressbar, color}) ayant participé à une course donnée
    *
    *  Parameters :
    *    (Integer) raceID - ID de la course
    */
    rankingGetSubgroups: function (raceID) {
        // Nombre MAX de coureurs à compter par sous-groupe
        const raceIndex = this.racesGetIndexFromRaceID(raceID);
        const nbRunnersBySubgroup = parseInt(this.data.races[raceIndex].nbRunnersBySubgroup, 10);
        const subgroups = [];
        const runnerIndexes = this.racesGetDataResults(raceID, 'completed');
        var iMax = runnerIndexes.length;
        for (var i = 0; i < iMax; i++) {
            const runnerGroup = this.data.runners[runnerIndexes[i].runnerIndex].group;
            const runnerSubgroup = this.data.runners[runnerIndexes[i].runnerIndex].subgroup;
            const runnerRank = runnerIndexes[i].rank;
            let subgroupIndex = 0;
            let subgroupPoints = 0;
            // Nombre de coureurs comptabilisés
            let subgroupNumber = 0;
            // Pour chaque coureur, on regarde si son sous-groupe est déjà dans notre liste de groupes
            let subgroupExist = false;
            var jMax = subgroups.length;
            for (var j = 0; j < jMax; j++) {
                // Pour éviter 1 même sous-groupe pour 2 car ils porteraient le même nom, on vérifie leur groupe d'appartenance
                if ((subgroups[j].subgroup === runnerSubgroup) && (subgroups[j].group === runnerGroup)) {
                    subgroupExist = true;
                    subgroupIndex = j;
                    subgroupPoints = subgroups[j].points;
                    subgroupNumber = subgroups[j].number;
                    // Si on n'est pas encore au max du nombre de coureurs à compter
                    if (subgroups[j].number < nbRunnersBySubgroup) {
                        // On ajoute le Rank du coureur actuel aux points de son sous-groupe
                        subgroupPoints = subgroupPoints + runnerRank;
                        // On ajoute 1 au nombre de coureurs pris en compte pour son sous-groupe
                        subgroupNumber = subgroupNumber + 1;
                    }
                }
            }
            // Si le sous-groupe de ce coureur n'existe pas, on l'ajoute à notre liste
            if (!subgroupExist) {
                subgroups.push({ subgroup: runnerSubgroup, group: runnerGroup, points: parseInt(runnerRank, 10), number: 1 });
            // Sinon, on met à jour au bon endroit
            } else {
                subgroups[subgroupIndex] = {
                    subgroup: runnerSubgroup,
                    group: runnerGroup,
                    points: subgroupPoints,
                    number: subgroupNumber
                };
            }
        }
        // On range les sous-groupes par ordre croissant de points
        subgroups.sort(this.rankingCompare);
        // On ajoute maintenant le rank, la progressbar et sa couleur... pour chaque sous-groupe
        var kMax = subgroups.length;
        for (var k = 0; k < kMax; k++) {
            const maxPoints = subgroups[kMax - 1].points;
            const group = subgroups[k].group;
            const subgroup = subgroups[k].subgroup;
            const points = subgroups[k].points;
            const number = subgroups[k].number;
            const numberColor = (number === nbRunnersBySubgroup) ? 'green' : 'red';
            const progressbar = subgroups[k].points / maxPoints;
            const color = this.rankingGetColor(k + 1);
            subgroups[k] = {
                rank: k + 1,
                subgroup: subgroup,
                group: group,
                points: points,
                number: number,
                numberColor: numberColor,
                progressbar: progressbar,
                color: color
            };
        }
        return subgroups
    },
    /***************************************************************************************************************
    *  Function : rankingGetGroupsAllRaces
    *
    *  Retourne le tableau des groupes ({rank, group, points, number, numberColor, progressbar, color}) toutes courses confondues
    */
    rankingGetGroupsAllRaces: function () {
        const groups = [];
        let nbMaxRunnersByGroup = 0;
        const iMax = this.data.races.length;
        for (var i = 0; i < iMax; i++) {
            nbMaxRunnersByGroup = nbMaxRunnersByGroup + parseInt(this.data.races[i].nbRunnersByGroup, 10);
            // Pour chaque course, on récupère les groupes
            const raceGroups = this.rankingGetGroups(DAO.data.races[i].raceID);
            const jMax = raceGroups.length;
            for (var j = 0; j < jMax; j++) {
                let raceGroupIndex = 0;
                const raceGroupGroup = raceGroups[j].group;
                let raceGroupPoints = raceGroups[j].points;
                let raceGroupNumber = raceGroups[j].number;
                // Pour chaque groupe, on regarde s'il est déjà dans notre liste de groupes
                let raceGroupExist = false;
                var kMax = groups.length;
                for (var k = 0; k < kMax; k++) {
                    // Si le groupe existe déjà dans notre liste
                    if (groups[k].group === raceGroupGroup) {
                        // Il existe, donc on calcule ses nouveaux points et number
                        raceGroupExist = true;
                        raceGroupIndex = k;
                        // Pas de tests (ils ont déjà été fait lors des calculs de points de chaque groupe), on ne fait qu'additionner
                        raceGroupPoints = groups[k].points + raceGroupPoints;
                        raceGroupNumber = groups[k].number + raceGroupNumber;
                    }
                }
                // Si le groupe n'est pas encore dans notre liste, on l'ajoute
                if (!raceGroupExist) {
                    groups.push({ group: raceGroupGroup, points: raceGroupPoints, number: raceGroupNumber });
                // Sinon, on met à jour au bon endroit
                } else {
                    groups[raceGroupIndex] = {
                        group: raceGroupGroup,
                        points: raceGroupPoints,
                        number: raceGroupNumber
                    };
                }
            }
        }
        // On range les groupes par ordre croissant de points
        groups.sort(this.rankingCompare);
        // On ajoute maintenant le rank, la progressbar et sa couleur... pour chaque sous-groupe
        var lMax = groups.length;
        for (var l = 0; l < lMax; l++) {
            const maxPoints = groups[lMax - 1].points;
            const group = groups[l].group;
            const points = groups[l].points;
            const number = groups[l].number;
            const numberColor = (number === nbMaxRunnersByGroup) ? 'green' : 'red';
            const progressbar = groups[l].points / maxPoints;
            const color = this.rankingGetColor(l + 1);
            groups[l] = {
                rank: l + 1,
                group: group,
                points: points,
                number: number,
                numberColor: numberColor,
                progressbar: progressbar,
                color: color
            };
        }
        return groups
    },
    /***************************************************************************************************************
    *  Function : rankingGetSubgroupsAllRaces
    *
    *  Retourne le tableau des sous-groupes ({rank, subgroup, group, points, number, numberColor, progressbar, color}) toutes courses confondues
    */
    rankingGetSubgroupsAllRaces: function () {
        const subgroups = [];
        let nbMaxRunnersBySubgroup = 0;
        const iMax = this.data.races.length;
        for (var i = 0; i < iMax; i++) {
            nbMaxRunnersBySubgroup = nbMaxRunnersBySubgroup + parseInt(this.data.races[i].nbRunnersBySubgroup, 10);
            // Pour chaque course, on récupère les sous-groupes
            const raceSubgroups = this.rankingGetSubgroups(DAO.data.races[i].raceID);
            const jMax = raceSubgroups.length;
            for (var j = 0; j < jMax; j++) {
                let raceSubgroupIndex = 0;
                const raceSubgroupGroup = raceSubgroups[j].group;
                const raceSubgroupSubgroup = raceSubgroups[j].subgroup;
                let raceSubgroupPoints = raceSubgroups[j].points;
                let raceSubgroupNumber = raceSubgroups[j].number;
                // Pour chaque sous-groupe, on regarde s'il est déjà dans notre liste de groupes
                let raceSubgroupExist = false;
                var kMax = subgroups.length;
                for (var k = 0; k < kMax; k++) {
                    // Pour éviter 1 même sous-groupe pour 2 car ils porteraient le même nom, on vérifie leur groupe d'appartenance
                    if ((subgroups[k].subgroup === raceSubgroupSubgroup) && (subgroups[k].group === raceSubgroupGroup)) {
                        // Il existe, donc on calcule ses nouveaux points et number
                        raceSubgroupExist = true;
                        raceSubgroupIndex = k;
                        // Pas de tests (ils ont déjà été fait lors des calculs de points de chaque sous-groupe), on ne fait qu'additionner
                        raceSubgroupPoints = subgroups[k].points + raceSubgroupPoints;
                        raceSubgroupNumber = subgroups[k].number + raceSubgroupNumber;
                    }
                }
                // Si le sous-groupe n'est pas encore dans notre liste, on l'ajoute
                if (!raceSubgroupExist) {
                    subgroups.push({ subgroup: raceSubgroupSubgroup, group: raceSubgroupGroup, points: raceSubgroupPoints, number: raceSubgroupNumber });
                // Sinon, on met à jour au bon endroit
                } else {
                    subgroups[raceSubgroupIndex] = {
                        subgroup: raceSubgroupSubgroup,
                        group: raceSubgroupGroup,
                        points: raceSubgroupPoints,
                        number: raceSubgroupNumber
                    };
                }
            }
        }
        // On range les sous-groupes par ordre croissant de points
        subgroups.sort(this.rankingCompare);
        // On ajoute maintenant le rank, la progressbar et sa couleur... pour chaque sous-groupe
        var lMax = subgroups.length;
        for (var l = 0; l < lMax; l++) {
            const maxPoints = subgroups[lMax - 1].points;
            const group = subgroups[l].group;
            const subgroup = subgroups[l].subgroup;
            const points = subgroups[l].points;
            const number = subgroups[l].number;
            const numberColor = (number === nbMaxRunnersBySubgroup) ? 'green' : 'red';
            const progressbar = subgroups[l].points / maxPoints;
            const color = this.rankingGetColor(l + 1);
            subgroups[l] = {
                rank: l + 1,
                subgroup: subgroup,
                group: group,
                points: points,
                number: number,
                numberColor: numberColor,
                progressbar: progressbar,
                color: color
            };
        }
        return subgroups
    }
};

module.exports = DAO;
