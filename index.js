const electron = require('electron')
const Store = require('./src/store.js');

// Permet de gérer les evenements système
const app = electron.app

// Permet de gérer les fenetres
const BrowserWindow = electron.BrowserWindow

// Chargement du système de préférences
const prefs = new Store({
    // Notre fichier de configuration sera 'user-preferences.json'
    configName: 'user-preferences',
    defaults: {
        // 1200x800 par défaut
        Window_Dimensions: { width: 1200, height: 800 },
    }
});

// Gardez une référence globale de l'objet "window", si vous ne le faites pas, la fenêtre se ferme automatiquement lorsque l'objet JavaScript est nettoyé.
let mainWindow

function createWindow () {
    // Récupération des dimensions de la fenêtre
    let { width, height } = prefs.get('Window_Dimensions');

    // Création d'une fenetre en résolution 800x600
    mainWindow = new BrowserWindow({width, height})

    // La fenetre va charger notre fichier index.html
    mainWindow.loadURL(`file://${__dirname}/src/index.html`)

    // Affiche la console  et les DevTools
    //mainWindow.webContents.openDevTools()

    // Cache la barre de menu
    mainWindow.setMenu(null)

    // Cet évènement est déclenché lorsque la fenêtre est redimensionnée
    mainWindow.on('resize', () => {
        // Récupération des dimensions de la fenêtre
        let { width, height } = mainWindow.getBounds();
        // Now that we have them, save them using the `set` method.
        prefs.set('Window_Dimensions', { width, height });
    })

    // Cet évènement est déclenché lorsque la fenêtre est fermée
    mainWindow.on('closed', function () {
        // Réinitialisation de l'objet "window"
        mainWindow = null
    })
}

// Cet évenement est déclenché lorsque Electron a terminé son initialisation. On lance la création de la fenêtre à ce moment là
app.on('ready', createWindow)

// Cet évenement est déclenché lorque toutes les fenêtres sont fermées (pour notre exemple nous n'avons qu'une seule fenêtre mais il est possble de gérer le multi-fentres)
app.on('window-all-closed', function () {
    // Sur OS X, il est courant que les applications puissent rester active jusqu'à ce que l'utilisateur quitte explicitement via la commande "Cmd + Q"
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', function () {
    // Sur OS X, il est courant de re-créer une fenêtre dans l'application lorsque l'icône du dock est cliqué et il n'y a pas d'autres fenêtres ouvertes.
    if (mainWindow === null) {
        createWindow()
    }
})