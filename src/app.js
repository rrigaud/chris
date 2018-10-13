// Electron
const remote = require('electron').remote;
const {BrowserWindow} = require('electron').remote;
const fs = require('fs');
const path = require('path');
const child_process = require('child_process');
var csv = require('fast-csv');
var PDFDocument = require('pdfkit');

// Perso
const Store = require('./store.js');

// Chargement du système de préférences
const prefs = new Store({configName: 'user-preferences'});

// Chargement des coureurs
const DB_runners = new Store({
    // Notre base de données des coureurs sera 'db-runners.json'
    configName: 'db-runners',
    defaults: {
        // Un tableau de coureurs par défaut
        Runners : [{ Runner_ID: '1', Name: 'NOM1 Prénom1', Gender: 'G', Class: '6A', School: 'Simone de Beauvoir', Bibnumber: '1' },
                    { Runner_ID: '2', Name: 'NOM2 Prénom2', Gender: 'F', Class: '6B', School: 'Simone de Beauvoir', Bibnumber: '2' },
                    { Runner_ID: '3', Name: 'BALBOA Rocky', Gender: 'G', Class: '6A', School: 'Simone de Beauvoir', Bibnumber: '126' },
                    { Runner_ID: '4', Name: 'CONNOR Sarah', Gender: 'F', Class: '6B', School: 'Simone de Beauvoir', Bibnumber: '54' },
                    { Runner_ID: '5', Name: 'ATTON Olivier', Gender: 'G', Class: '6B', School: 'Simone de Beauvoir', Bibnumber: '27' },
                    { Runner_ID: '6', Name: 'LANDERS Marc', Gender: 'G', Class: '6B', School: 'Simone de Beauvoir', Bibnumber: '708' }]
    }
});

// Chargement des courses
const DB_races = new Store({
    // Notre base de données des courses sera 'db-races.json'
    configName: 'db-races',
    defaults: {
        // Un tableau de courses par défaut
        Races : [{Race_ID: '1', Name: '6èmes Garçons', Results: [{Race_ID: '1', Bibnumber: '1', Rank: '1' },
                                                                    {Race_ID: '1', Bibnumber: '2', Rank: '2' },
                                                                    {Race_ID: '1', Bibnumber: '126', Rank: '3' }] },
                    {Race_ID: '2', Name: '6èmes Filles', Results: [{Race_ID: '2', Bibnumber: '54', Rank: '1' },
                                                                    {Race_ID: '2', Bibnumber: '27', Rank: '2' },
                                                                    {Race_ID: '2', Bibnumber: '708', Rank: '3' }] }]
    }
});





/***************************************************************************************************************
 *  Object : Runners
 * 
 *  Cet objet gère les coureurs de manière globale
 */
var Runners = {
    items : [],
    /***************************************************************************************************************
    *  Function : load
    *
    *  Charge les coureurs en mémoire dans le tableau Runners.items
    */
    load : function () {
        Runners.items = DB_runners.get('Runners');
    },
    /***************************************************************************************************************
    *  Function : save
    *
    *  Enregistre les coureurs en mémoire dans le fichier JSON
    */
    save : function () {
        DB_runners.set('Runners',Runners.items);
    },
    /***************************************************************************************************************
    *  Function : sort
    *
    *  Trie le tableau items par : Collège > Classe > Nom
    */
    sort : function () {
        Runners.items.sort(compareRunners);
    },
    /***************************************************************************************************************
    *  Function : getIndexFromRunnerID
    *
    *  Retourne l'index du coureur dans le tableau Runners
    * 
    *  Parameters :
    *    (Integer) Runner_ID - ID du coureur (provenant certainement de Runners_Displayed)
    */
    getIndexFromRunnerID : function (Runner_ID) {
        var index = -1;
        var i_max = Runners.items.length;
        for (var i = 0 ; i < i_max ; i++) {
            if (Runners.items[i].Runner_ID == Runner_ID) { index = i; }
        }
        return index
    },
    /***************************************************************************************************************
    *  Function : getIndexFromBibnumber
    *
    *  Retourne l'index du coureur dans le tableau Runners
    * 
    *  Parameters :
    *    (Integer) Bibnumber - Dossard du coureur
    */
    getIndexFromBibnumber : function (Bibnumber) {
        var index = -1;
        var i_max = Runners.items.length;
        for (var i = 0 ; i < i_max ; i++) {
            if (Runners.items[i].Bibnumber == Bibnumber) { index = i; }
        }
        return index
    },
    /***************************************************************************************************************
    *  Function : getNewRunnerID
    *
    *  Retourne le premier Runner_ID de disponible du tableau de données Runners
    */
    getNewRunnerID : function () {
        let New_Runner_ID = -1;
        var i_max = Runners.items.length;
        for (var i = 0 ; i < i_max ; i++) {
            Runner_ID = parseInt(Runners.items[i].Runner_ID, 10);
            New_Runner_ID = (Runner_ID > New_Runner_ID) ? Runner_ID : New_Runner_ID;
        }
        return parseInt(New_Runner_ID, 10) + 1;
    },
    /***************************************************************************************************************
    *  Function : addRunner
    *
    *  Ajoute un coureur au tableau items
    *
    *  Parameters :
    *    (String) Runner_ID - ID du coureur
    *    (String) Name - NOM Prénom du coureur
    *    (String) Gender - Genre F/G du coureur
    *    (String) Class - Classe du coureur
    *    (String) School - Collège du coureur
    *    (String) Bibnumber - Dossard du coureur
    */
    addRunner : function (Runner_ID, Name, Gender, Class, School, Bibnumber) {
        Runners.items.push({ Runner_ID: Runner_ID, Name: Name, Gender: Gender, Class: Class, School: School, Bibnumber: Bibnumber });
    },
    /***************************************************************************************************************
    *  Function : editRunner
    *
    *  Ajoute un coureur au tableau items
    */
    editRunner : function () {
        
    },
    /***************************************************************************************************************
    *  Function : delRunner
    *
    *  Ajoute un coureur au tableau items
    *
    *  Parameters :
    *    (Integer) Index - Index du coureur à supprimer
    */
    delRunner : function (Index) {
        Runners.items.splice(Index, 1);
    },
    /***************************************************************************************************************
    *  Function : delAll
    *
    *  Supprime tous les coureurs du tableau items
    *
    *  Parameters :
    *    (Integer) Index - Index du coureur à supprimer
    */
    delAll : function () {
        Runners.items = [];
    },
    /***************************************************************************************************************
    *  Function : import
    *
    *  Importe des coureurs dans le tableau items à partir de champs récupérés dans un CSV
    *
    *  Parameters :
    *    (File Object) CSV_File - Fichier CSV à importer
    */
    import : function (CSV_File) {
        var RunnersToImport = [];
        csv
            .fromPath(CSV_File)
            .on("data", function(data){
                RunnersToImport.push({ Name: data[0] + ' ' + data[1], Gender: (data[2] == "M") ? 'G' : 'F', Class: data[3], School: data[4]});
            })
            .on("end", function(){
                //console.log(RunnersToImport);
                var i_max = RunnersToImport.length;
                for (var i = 0 ; i < i_max ; i++) {
                    let Runner_ID = Runners.getNewRunnerID();
                    if (Runner_ID == -1) {
                        console.log("Erreur d'ajout : Aucun ID trouvé");
                        alert("Erreur d'ajout : Aucun ID trouvé");
                    }
                    else {
                        // On ajoute le coureur au tableau de données Runners
                        Runners.addRunner(Runner_ID.toString(),RunnersToImport[i].Name,RunnersToImport[i].Gender,RunnersToImport[i].Class,RunnersToImport[i].School,'');
                        Runners.sort();
                        Runners.save();
                        // TODO : Là, il faudrait rafraichir l'interface en théorie
                    }
                }
            });

    },
};



/***************************************************************************************************************
 *  Object : Races
 * 
 *  Cet objet gère les courses de manière globale
 */
var Races = {
    items : [],
    /***************************************************************************************************************
    *  Function : load
    *
    *  Charge les courses en mémoire dans le tableau Races.items
    */
    load : function () {
        Races.items = DB_races.get('Races');
    },
    /***************************************************************************************************************
    *  Function : save
    *
    *  Enregistre les courses en mémoire dans le fichier JSON
    */
    save : function () {
        DB_races.set('Races',Races.items);
    },
    /***************************************************************************************************************
    *  Function : sort
    *
    *  Trie le tableau items par : Nom
    */
    sort : function () {
        Races.items.sort(compareRaces);
    },
    /***************************************************************************************************************
    *  Function : sortResults
    *
    *  Trie tous les tableaux results par : Rank (décroissant)
    *
    *  Parameters :
    *    (Integer) Race_ID - ID de la course
    */
    sortResults : function () {
        var i_max = Races.items.length;
        for (var i = 0 ; i < i_max ; i++) {
            Races.items[i].Results.sort(compareResults);
        }
    },
    /***************************************************************************************************************
    *  Function : getIndexFromRaceID
    *
    *  Retourne l'index de la course à partir de son ID
    * 
    *  Parameters :
    *    (Integer) Race_ID - ID de la course
    */
    getIndexFromRaceID : function (Race_ID) {
        var index = -1;
        var i_max = Races.items.length;
        for (var i = 0 ; i < i_max ; i++) {
            if (Races.items[i].Race_ID == Race_ID) { index = i; }
        }
        return index
    },
    /***************************************************************************************************************
    *  Function : getIndexFromBibnumber
    *
    *  Retourne l'index du résultat à partir de son dossard
    * 
    *  Parameters :
    *    (Integer) Bibnumber - Dossard du coureur
    */
    getIndexFromBibnumber : function (Bibnumber) {
        var index = -1;
        var i_max = Races.items.length;
        for (var i = 0 ; i < i_max ; i++) {
            if (Races.items[i].Race_ID == Race_ID) { index = i; }
        }
        return index
    },
    /***************************************************************************************************************
    *  Function : getNewRaceID
    *
    *  Retourne le premier Race_ID de disponible du tableau de données races
    */
    getNewRaceID : function () {
        let New_Race_ID = -1;
        var i_max = Races.items.length;
        for (var i = 0 ; i < i_max ; i++) {
            Race_ID = parseInt(Races.items[i].Race_ID, 10);
            New_Race_ID = (Race_ID > New_Race_ID) ? Race_ID : New_Race_ID;
        }
        return parseInt(New_Race_ID, 10) + 1;
    },
    /***************************************************************************************************************
    *  Function : getNewRank
    *
    *  Retourne le premier Rank de disponible pour une course donnée
    * 
    *  Parameters :
    *    (Integer) Race_ID - ID de la course pour laquelle il faut un nouveau Rank
    */
    getNewRank : function (Race_ID) {
        let New_Rank  = 0;
        let Race_Index = Races.getIndexFromRaceID(Race_ID);
        var i_max = Races.items[Race_Index].Results.length;
        for (var i = 0 ; i < i_max ; i++) {
            Rank = parseInt(Races.items[Race_Index].Results[i].Rank, 10);
            New_Rank = (Rank > New_Rank) ? Rank : New_Rank;
        }
        return parseInt(New_Rank, 10) + 1;
    },
    /***************************************************************************************************************
    *  Function : addRace
    *
    *  Ajoute une course au tableau races
    *
    *  Parameters :
    *    (String) Race_ID - ID de la course
    *    (String) Name - Nom de la course
    */
    addRace : function (Race_ID, Name) {
        Races.items.push({ Race_ID: Race_ID, Name: Name, Results: [] });
    },
    /***************************************************************************************************************
    *  Function : addResult
    *
    *  Ajoute un résultat au tableau results
    *
    *  Parameters :
    *    (String) Race_ID - ID de la course
    *    (String) Bibnumber - Dossard du coureur
    *    (String) Rank - Place à l'arrivée
    */
    addResult : function (Race_ID, Bibnumber, Rank) {
        let Race_Index = Races.getIndexFromRaceID(Race_ID);
        // On cherche si ce dossard a déjà été saisi pour cette course
        let Bibnumber_Not_Found = true;
        var i_max = Races.items[Race_Index].Results.length;
        for (var i = 0 ; i < i_max ; i++) {
            if (Races.items[Race_Index].Results[i].Bibnumber == Bibnumber) { Bibnumber_Not_Found = false; }
        }
        // S'il n'a pas déjà été saisi
        if (Bibnumber_Not_Found) {
            // On cherche maintenant s'il existe dans notre base de données de coureurs
            let Bibnumber_Exist = false;
            var i_max = Runners.items.length;
            for (var i = 0 ; i < i_max ; i++) {
                if (Runners.items[i].Bibnumber == Bibnumber) { Bibnumber_Exist = true; }
            }
            // S'il existe, on peut enfin ajouter ce résultat
            if (Bibnumber_Exist) {
                Races.items[Race_Index].Results.push({ Race_ID: Race_ID, Bibnumber: Bibnumber, Rank: Rank });
            } else {
                //alert("Erreur de saisie : Ce dossard n'existe pas !")
                remote.dialog.showErrorBox("Erreur de saisie", "Ce dossard n'existe pas !");
            }
        } else {
            //alert("Erreur de saisie : Ce dossard est déjà arrivé !")
            remote.dialog.showErrorBox("Erreur de saisie", "Ce dossard est déjà arrivé !");
        }
    }
};


/***************************************************************************************************************
 *  Object : Results
 * 
 *  Cet objet gère les résultats de manière globale
 */
var Results = {
    /***************************************************************************************************************
    *  Function : getSchools
    *
    *  Retourne un tableau de collèges
    */
    getSchools : function () {
        let Schools = [];
        var i_max = Runners.items.length;
        for (var i = 0 ; i < i_max ; i++) {
            //Pour chaque collège, on regarde si on l'a déjà dans notre listing Schools
            let School_Dont_Exist = true;
            var j_max = Schools.length;
            for (var j = 0 ; j < j_max ; j++) {
                if (Schools[j].Name == Runners.items[i].School) { School_Dont_Exist = false; }
            }
            if (School_Dont_Exist) { Schools.push({ Name: Runners.items[i].School }); }
        }
        return Schools
    },
    /***************************************************************************************************************
    *  Function : getClassesFrom
    *
    *  Retourne un tableau de classes à partir d'un collège
    *
    *  Parameters :
    *    (String) School - Collège
    */
    getClassesFrom : function (School) {
        let Classes = [];
        var i_max = Runners.items.length;
        for (var i = 0 ; i < i_max ; i++) {
            //Pour chaque classe, on regarde si on l'a déjà dans notre listing Schools
            let Class_Dont_Exist = true;
            var j_max = Classes.length;
            for (var j = 0 ; j < j_max ; j++) {
                if (Classes[j].Name == Runners.items[i].Class) { Class_Dont_Exist = false; }
            }
            // Si on ne l'a pas encore listé et si c'est bien une classe du collège voulu, on l'ajoute
            if ((Class_Dont_Exist)&&(Runners.items[i].School == School)) { Classes.push({ Name: Runners.items[i].Class, School : School, TotalRank : 0 }); }
        }
        return Classes
    },
    /***************************************************************************************************************
    *  Function : getBestClass
    *
    *  Retourne un tableau d'objets {Class, School, TotalRank}
    */
    getBestClass : function () {
        // Le classement global récupère d'abord les résultats de la première course
        let Classes = Results.getClassRanking(Races.items[0].Race_ID, 6);
        var i_max = Races.items.length;
        // Pour chaque autre course
        for (var i = 1 ; i < i_max ; i++) {
            var j_max = Classes.length;
            // Pour chaque classe
            for (var j = 0 ; j < j_max ; j++) {
                var Class_Total = Results.getClassTotal(Classes[j].Name, Classes[j].School, Races.items[i].Race_ID, 6);
                let TotalRank_To_Add =Class_Total.Rank;
                let TotalRunners_To_Add =Class_Total.Runners;
                Classes[j].TotalRank = parseInt(Classes[j].TotalRank, 10) + parseInt(TotalRank_To_Add, 10);
                Classes[j].TotalRunners = parseInt(Classes[j].TotalRunners, 10) + parseInt(TotalRunners_To_Add, 10);
            }
        }
        Classes.sort(compareRanks);
        return Classes
    },
    /***************************************************************************************************************
    *  Function : getClassTotal
    *
    *  Retourne un objet { Rank : Rang; Runners : Nombre de coureurs } à partir d'un triplet (Classe,Collège,Course)
    *  et du nombre de coureurs à prendre en compte
    *
    *  Parameters :
    *    (String) Class - Classe
    *    (String) School - Collège
    *    (String) Race_ID - ID de la course
    *    (Integer) Max_Runners - Nombre de coureurs à prendre en compte par classe
    */
    getClassTotal : function (Class, School, Race_ID, Max_Runners) {
        let Race_Index = Races.getIndexFromRaceID(Race_ID);
        let TotalRank = 0;
        let Nb_Runners = 0;
        // Pour chaque résultat de la course
        var i_max = Races.items[Race_Index].Results.length;
        // Pour chaque résultat en partant du premier (de la fin du tableau)
        for (var i = 0 ; i < i_max ; i++) {
            let j = i_max - i - 1;
            let Runner_Rank = Races.items[Race_Index].Results[j].Rank;
            let Runner_Class = Runners.items[Runners.getIndexFromBibnumber(Races.items[Race_Index].Results[j].Bibnumber)].Class
            let Runner_School = Runners.items[Runners.getIndexFromBibnumber(Races.items[Race_Index].Results[j].Bibnumber)].School
            // Si c'est bien sa classe/collège et qu'on en a pas encore Max_Runners, on ajoute son Rank au total
            if ((Runner_Class == Class)&&(Runner_School == School)&&(Nb_Runners < Max_Runners)) {
                TotalRank = TotalRank + parseInt(Runner_Rank, 10);
                Nb_Runners++;
            }
        }
        return { Rank : TotalRank.toString(), Runners : Nb_Runners }
    },
    /***************************************************************************************************************
    *  Function : getClassRanking
    *
    *  Retourne un objet {Name, School, TotalRank, Runners} à partir d'un couple (Course, Max_Runners)
    *  et du nombre de coureurs à prendre en compte
    *
    *  Parameters :
    *    (String) Race_ID - ID de la course
    *    (Integer) Max_Runners - Nombre de coureurs à prendre en compte par classe
    */
    getClassRanking : function (Race_ID, Max_Runners) {
        let Schools = Results.getSchools();
        let Classes = [];
        var i_max = Schools.length;
        for (var i = 0 ; i < i_max ; i++) {
            //Pour chaque école, on fusionne les tableaux de classes
            let New_Classes = Results.getClassesFrom(Schools[i].Name);
            Classes = Classes.concat(New_Classes);
        }
        var i_max = Classes.length;
        for (var i = 0 ; i < i_max ; i++) {
            //Pour chaque classe, on récupère son Total.Rank et Total.Runners (Nombre de coureurs du calcul)
            let Class_Total = Results.getClassTotal(Classes[i].Name, Classes[i].School, Race_ID, Max_Runners);
            Classes[i].TotalRank = Class_Total.Rank;
            Classes[i].TotalRunners = Class_Total.Runners;
        }

        // On trie les classes par TotalRank croissant
        Classes.sort(compareRanks);

        return Classes
    },
    /***************************************************************************************************************
    *  Function : getRunnerRanking
    *
    *  Retourne un objet {Rank, Name, Class} à partir d'une course
    *
    *  Parameters :
    *    (String) Race_ID - ID de la course
    */
    getRunnerRanking : function (Race_ID) {
        let Runners_Ranking = [];
        let Race_Index = Races.getIndexFromRaceID(Race_ID);
        var i_max = Races.items[Race_Index].Results.length;
        for (var i = 0 ; i < i_max ; i++) {
            Runners_Ranking.push({ Rank: Races.items[Race_Index].Results[i].Rank,
                                    Name: Runners.items[Runners.getIndexFromBibnumber(Races.items[Race_Index].Results[i].Bibnumber)].Name,
                                    Class: Runners.items[Runners.getIndexFromBibnumber(Races.items[Race_Index].Results[i].Bibnumber)].Class });
        }
        // On trie les classes par Rank croissant
        Runners_Ranking.sort(compareRunnerRanks);
        return Runners_Ranking
    },
};


/***************************************************************************************************************
 *  Object : Backup
 * 
 *  Cet objet gère l'import/export d'une sauvegarde complète (Runners et Races)
 */
var Backup = {
    /***************************************************************************************************************
    *  Function : import
    *
    *  Importe une sauvegarde complète au format JSON
    *
    *  Parameters :
    *    (File Object) JSON_File - Fichier JSON_File à importer
    */
    import : function (JSON_File) {
        let JSON_Data = fs.readFileSync(JSON_File, "UTF-8");
        let JSON_Object = JSON.parse(JSON_Data);
        // On écrase Runners et Races
        Runners.items = JSON_Object.Runners;
        Races.items = JSON_Object.Races;
        Runners.save();
        Races.save();
        riot.update();
    },
    /***************************************************************************************************************
    *  Function : export
    *
    *  Importe une sauvegarde complète au format JSON
    *
    *  Parameters :
    *    (File Object) JSON_File - Fichier JSON_File à exporter
    */
    export : function (JSON_File) {
        // On récupère Runners et Races que l'on place ensemble dans un nouvel objet
        let JSON_Object = { Runners : Runners.items, Races : Races.items }
        let JSON_Data = JSON.stringify(JSON_Object)
        fs.writeFileSync(JSON_File, JSON_Data, "UTF-8");
    },
    /***************************************************************************************************************
    *  Function : exportCSV
    *
    *  Exporte les résultats au format CSV
    *
    *  Parameters :
    *    (File Object) CSV_File - Fichier CSV_File à exporter
    */
    exportCSV : function (CSV_File) {
        var bestClasses = Results.getBestClass();
        let CSV_Data = Backup.convertArrayOfObjectsToCSV(bestClasses);
        fs.writeFileSync(CSV_File, CSV_Data, "UTF-8");
    },
    /***************************************************************************************************************
    *  Function : convertArrayOfObjectsToCSV
    *
    *  Convertit un tableau d'objets au format CSV et le retourne
    *
    *  Parameters :
    *    (Array of Objects) args - Tableau d'objets
    */
    convertArrayOfObjectsToCSV : function (args) {
        var result, ctr, keys, columnDelimiter, lineDelimiter, data;

        data = args.data || null;
        if (data == null || !data.length) {
            return null;
        }

        columnDelimiter = args.columnDelimiter || ',';
        lineDelimiter = args.lineDelimiter || '\n';

        keys = Object.keys(data[0]);

        result = '';
        result += keys.join(columnDelimiter);
        result += lineDelimiter;

        data.forEach(function(item) {
            ctr = 0;
            keys.forEach(function(key) {
                if (ctr > 0) result += columnDelimiter;

                result += item[key];
                ctr++;
            });
            result += lineDelimiter;
        });

        return result;
    }
};



/***************************************************************************************************************
 * A L'OUVERTURE
 * 
 * 
 */
window.addEventListener('load', function load(event) {


    // Charge les coureurs
    Runners.load();
    // Tri alphabétique les coureurs
    Runners.sort();

})


/***************************************************************************************************************
 *  Function : compareRunners
 *  
 *  Fonction de comparaison pour le tri : Collège, Classe, puis Nom
 * 
 *  Parameters :
 *    (String) a - Runner A
 *    (String) b - Runner B
 */
function compareRunners(a,b) {
    if(a.School < b.School) {
        return -1;
    }
    if(a.School > b.School) {
        return 1;
    }
    if(a.Class < b.Class) {
        return -1;
    }
    if(a.Class > b.Class) {
        return 1;
    }
    if(a.Name < b.Name) {
        return -1;
    }
    if(a.Name > b.Name) {
        return 1;
    }
}

/***************************************************************************************************************
 *  Function : compareRaces
 *  
 *  Fonction de comparaison pour le tri : Nom
 * 
 *  Parameters :
 *    (String) a - Race A
 *    (String) b - Race B
 */
function compareRaces(a,b) {
    if(a.Name < b.Name) {
        return -1;
    }
    if(a.Name > b.Name) {
        return 1;
    }
}

/***************************************************************************************************************
 *  Function : compareResults
 *  
 *  Fonction de comparaison pour le tri : Rank (décroissant)
 * 
 *  Parameters :
 *    (String) a - Rank A
 *    (String) b - Rank B
 */
function compareResults(a,b) {
    if(parseInt(a.Rank, 10) < parseInt(b.Rank, 10)) {
        return 1;
    }
    if(parseInt(a.Rank, 10) > parseInt(b.Rank, 10)) {
        return -1;
    }
}

/***************************************************************************************************************
 *  Function : compareRanks
 *  
 *  Fonction de comparaison pour le tri : TotalRank (croissant)
 * 
 *  Parameters :
 *    (String) a - Rank A
 *    (String) b - Rank B
 */
function compareRanks(a,b) {
    if(parseInt(a.TotalRank, 10) < parseInt(b.TotalRank, 10)) {
        return -1;
    }
    if(parseInt(a.TotalRank, 10) > parseInt(b.TotalRank, 10)) {
        return 1;
    }
}

/***************************************************************************************************************
 *  Function : compareRunnerRanks
 *  
 *  Fonction de comparaison pour le tri : Rank (croissant)
 * 
 *  Parameters :
 *    (String) a - Rank A
 *    (String) b - Rank B
 */
function compareRunnerRanks(a,b) {
    if(parseInt(a.Rank, 10) < parseInt(b.Rank, 10)) {
        return -1;
    }
    if(parseInt(a.Rank, 10) > parseInt(b.Rank, 10)) {
        return 1;
    }
}
