const { ipcRenderer } = require('electron');

// A la réception des informations concernant les dossards
ipcRenderer.on('datatransfer', (event, runners) => {
    var template = document.getElementById('template').innerHTML;
    var rendered = Mustache.render(template, { bibNumbers: runners });
    document.getElementById('target').innerHTML = rendered;
    // Envoi d'un message de fin de travail
    ipcRenderer.send('bibNumbersGenerated', '');
})