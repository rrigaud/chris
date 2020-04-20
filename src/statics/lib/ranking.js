const { ipcRenderer } = require('electron');

// A la réception des informations concernant les dossards
ipcRenderer.on('datatransfer', (event, data) => {
    var template = document.getElementById('template').innerHTML;
    var rendered = Mustache.render(template, { allRacesGroups: data.allRacesGroups,
        allRacesSubgroups: data.allRacesSubgroups,
        races: data.races,
        getPercentage: function () {
            return this.progressbar * 100;
        },
        getColor: function () {
            let color = '#4caf50';
            if (this.color === 'red') { color = '#f44336'; }
            if (this.color === 'orange') { color = '#ff9800'; }
            if (this.color === 'yellow') { color = '#ffeb3b'; }
            if (this.color === 'lime') { color = '#cddc39'; }
            if (this.color === 'green') { color = '#4caf50'; }
            if (this.color === 'teal') { color = '#009688'; }
            if (this.color === 'cyan') { color = '#00bcd4'; }
            if (this.color === 'blue') { color = '#2196f3'; }
            if (this.color === 'indigo') { color = '#3f51b5'; }
            if (this.color === 'deep-purple') { color = '#673ab7'; }
            if (this.color === 'brown') { color = '#795548'; }
            if (this.color === 'grey-10') { color = '#212121'; }
            return color;
        }
    });
    document.getElementById('target').innerHTML = rendered;
    // Envoi d'un message de fin de travail
    ipcRenderer.send('rankingGenerated', '');
})