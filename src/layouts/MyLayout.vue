<template>
    <q-layout view="hHh LpR fFf">
        <q-header class="bg-primary text-white" height-hint="98" elevated>
            <q-banner v-if="bannerWarningBibNumbers" inline-actions class="text-white bg-red text-center">
                <template v-slot:avatar>
                    <q-icon name="warning" color="white" />
                </template>
                <b>Certains coureurs ont reçu le même numéro de dossard :</b>
                <div v-for="item in bibNumberRedundants" :key="item.bibNumber">
                    <q-chip outline square color="white" icon="account_box" :label="item.bibNumber" />
                    {{ item.runners }}
                </div>
            </q-banner>
            <q-toolbar class="row">
                <q-btn dense flat round icon="menu" @click="left = !left" />
                <q-tabs
                    v-model="tab"
                    class="col"
                    inline-label
                    align="justify"
                >
                    <q-tab name="management" label="Gestion du CROSS" icon="settings" />
                    <q-tab name="races" label="Saisie des arrivées" icon="directions_run" />
                    <q-tab name="results" label="Résultats" icon="equalizer" />
                </q-tabs>
            </q-toolbar>
        </q-header>

        <q-drawer :width="450" v-model="left" side="left" overlay behavior="mobile" elevated>
            <q-list padding>
                <q-item-label header>Ouvrir un cross</q-item-label>
                <q-item v-show="showLastFileOpened" clickable v-ripple @click="openLastFileOpened">
                    <q-item-section avatar>
                        <q-avatar color="primary" text-color="white" icon="directions_run" />
                    </q-item-section>
                    <q-item-section>{{ lastFileOpenedFilename }}</q-item-section>
                    <q-item-section side>
                        <q-icon name="alarm" color="primary" />
                    </q-item-section>
                </q-item>
                <q-item clickable v-ripple @click="openFile">
                    <q-item-section avatar>
                        <q-avatar color="primary" text-color="white" icon="directions_run" />
                    </q-item-section>
                    <q-item-section>Sélectionner un fichier</q-item-section>
                    <q-item-section side>
                        <q-icon name="folder" color="primary" />
                    </q-item-section>
                </q-item>
                <q-separator />
                <q-item-label header>Créer un cross</q-item-label>
                <q-item clickable v-ripple @click="newFile">
                    <q-item-section avatar>
                        <q-avatar color="positive" text-color="white" icon="add" />
                    </q-item-section>
                    <q-item-section>Préparer un nouveau Cross</q-item-section>
                </q-item>
            </q-list>
        </q-drawer>

        <q-page-container>
            <q-page>
                <div class="q-pa-md">
                    <q-tab-panels v-model="tab" animated>
                        <q-tab-panel name="management">
                            <div class="row">
                                <div class="col-2">
                                    <q-tabs
                                        v-model="tabManagement"
                                        vertical
                                        class="text-primary"
                                    >
                                        <q-tab name="runners" icon="group" label="Coureurs" />
                                        <q-tab name="races" icon="directions_run" label="Courses" />
                                        <div class="q-pa-md row items-start q-gutter-md">
                                            <q-card v-show="cardRunnersActions" style="margin-top: 40px;">
                                                <q-card-section class="bg-primary text-white">
                                                    Que faire avec les coureurs sélectionnés ?
                                                </q-card-section>
                                                <q-separator />
                                                <q-card-actions vertical>
                                                    <q-btn flat label="Supprimer" @click="showDelSelectedRunners" icon="delete_forever" color="negative" />
                                                    <q-space></q-space>
                                                    <q-btn flat @click="showAssignBibNumbers" style="margin-top: 40px;">
                                                        <div class="row items-center">
                                                            <q-icon left name="share" />
                                                            <div class="text-center">
                                                                Distribuer<br>les dossards
                                                            </div>
                                                        </div>
                                                    </q-btn>
                                                    <q-btn flat @click="exportBibNumbersPDF" style="margin-top: 20px;">
                                                        <div class="row items-center">
                                                            <q-icon left name="print" />
                                                            <div class="text-center">
                                                                Exporter les<br>dossards (PDF)
                                                            </div>
                                                        </div>
                                                    </q-btn>
                                                    <q-btn flat @click="exportBibNumbersCSV" style="margin-top: 20px;">
                                                        <div class="row items-center">
                                                            <q-icon left name="view_week" />
                                                            <div class="text-center">
                                                                Exporter les<br>dossards (CSV)
                                                            </div>
                                                        </div>
                                                    </q-btn>
                                                </q-card-actions>
                                            </q-card>
                                        </div>
                                    </q-tabs>
                                </div>
                                <div class="col-10">
                                    <q-tab-panels
                                        v-model="tabManagement"
                                        animated
                                        transition-prev="jump-up"
                                        transition-next="jump-up"
                                    >
                                        <q-tab-panel name="runners">
                                            <q-table
                                                class="tableRunners"
                                                virtual-scroll
                                                table-style="max-height: 67vh"
                                                no-data-label="Il n'y a aucun coureur dans ce fichier"
                                                no-results-label="Il n'y a aucun coureur répondant à ces critères de recherche."
                                                :pagination.sync="paginationRunners"
                                                :rows-per-page-options="[0]"
                                                :virtual-scroll-sticky-start="48"
                                                :filter="filterRunners"
                                                row-key="runnerID"
                                                title="Coureurs"
                                                :data="dataRunners"
                                                :columns="columnsRunners"
                                                :selected-rows-label="getSelectedRunnersString"
                                                selection="multiple"
                                                :selected.sync="selectedRunners"
                                                @selection="showActionsRunners"
                                                @row-click="showEditRunner"
                                            >
                                                <template v-slot:top>
                                                    <q-btn-group>
                                                        <q-btn color="positive" label="Coureur" icon="person_add" @click="showAddRunner" />
                                                        <q-btn color="positive" label="Importer CSV" icon="group_add" @click="showImportCSV" />
                                                    </q-btn-group>
                                                    <q-space ></q-space>
                                                    <q-input clearable class="col-6" outlined debounce="300" color="primary" v-model="filterRunners">
                                                        <template v-slot:prepend>
                                                            <q-icon name="search" ></q-icon>
                                                        </template>
                                                    </q-input>
                                                </template>
                                                <template v-slot:body-cell-gender="props">
                                                    <q-td :props="props">
                                                        <div>
                                                            <q-chip outline square :color="(props.value === 'M') ? 'blue' : 'purple-11'" :label="props.value" />
                                                        </div>
                                                    </q-td>
                                                </template>
                                                <template v-slot:body-cell-bibNumber="props">
                                                    <q-td :props="props">
                                                        <div>
                                                            <q-chip outline square color="positive" icon="account_box" :label="props.value" />
                                                        </div>
                                                    </q-td>
                                                </template>
                                            </q-table>
                                        </q-tab-panel>

                                        <q-tab-panel name="races">
                                            <q-table
                                                title=""
                                                :data="dataRaces"
                                                :columns="columnsRaces"
                                                row-key="raceID"
                                                no-data-label="Il n'y a aucune course dans ce fichier"
                                                @row-click="showEditRace"
                                            >
                                                <template v-slot:top>
                                                    <q-btn color="positive" label="Course" icon="add" @click="showAddRace" />
                                                </template>
                                                <template v-slot:body-cell-color="props">
                                                    <q-td :props="props">
                                                        <div>
                                                            <q-chip outline square :style="{color: props.value}" :label="props.value" />
                                                        </div>
                                                    </q-td>
                                                </template>
                                            </q-table>
                                        </q-tab-panel>
                                    </q-tab-panels>
                                </div>
                            </div>
                        </q-tab-panel>

                        <q-tab-panel name="races">
                            <div class="row">
                                <div class="col-2">
                                    <q-tabs
                                        v-model="tabRaces"
                                        vertical
                                        class="text-primary"
                                    >
                                        <q-tab v-for="race in dataRaces" :key="race.raceID" :name="race.raceID" icon="directions_run" :label="race.name" :style="{ color: race.color }" @click="refreshDataResults" />
                                    </q-tabs>
                                </div>
                                <div class="col-10" style="padding-left: 20px;">
                                    <div class="row" style="margin-bottom: 20px;">
                                        <q-btn outline color="primary" icon="help" icon-right="help" label="Dossard perdu" @click="showSelectRunner" style="margin-right: 20px;" />
                                        <q-input ref="inputRefResultBibNumber" class="col" outlined v-model="inputResultBibNumber" placeholder="Numéro de dossard" style="margin-right: 20px; font-size: 40px;" autofocus @keydown.enter="addResult">
                                            <template v-slot:prepend>
                                                <q-icon name="person" style="font-size: 40px;" />
                                            </template>
                                        </q-input>
                                        <q-btn color="primary" icon="add" label="Ajouter" size="lg" @click="addResult" />
                                    </div>
                                    <q-table
                                        class="tableRunners"
                                        virtual-scroll
                                        table-style="max-height: 63vh"
                                        no-data-label="Il n'y a aucun résultat pour cette course"
                                        no-results-label="Il n'y a aucun résultat répondant à ces critères de recherche."
                                        :pagination.sync="paginationResults"
                                        :rows-per-page-options="[0]"
                                        :virtual-scroll-sticky-start="48"
                                        :filter="filterResults"
                                        row-key="name"
                                        title="Résultats"
                                        separator="none"
                                        :data="dataResults"
                                        :columns="columnsResults"
                                    >
                                        <template v-slot:top>
                                            <q-btn-toggle
                                                v-model="modelResults"
                                                @click="refreshDataResults"
                                                :toggle-color="resultsBtnToggleColor"
                                                :options="[
                                                    {value: 'completed', slot: 'completed'},
                                                    {value: 'dropped', slot: 'dropped'},
                                                    {value: 'missing', slot: 'missing'}
                                                ]"
                                            >
                                                <template v-slot:completed>
                                                    <q-icon name="sentiment_very_satisfied" />
                                                    <div style='margin-left: 10px'>Arrivées</div>
                                                </template>
                                                <template v-slot:dropped>
                                                    <q-icon name="sentiment_very_dissatisfied" />
                                                    <div style='margin-left: 10px'>Abandons</div>
                                                </template>
                                                <template v-slot:missing>
                                                    <q-icon name="cancel" />
                                                    <div style='margin-left: 10px'>Absents</div>
                                                </template>
                                            </q-btn-toggle>
                                            <q-space></q-space>
                                            <q-input clearable class="col-6" outlined debounce="300" color="primary" v-model="filterResults">
                                                <template v-slot:prepend>
                                                    <q-icon name="search" ></q-icon>
                                                </template>
                                            </q-input>
                                        </template>
                                        <template v-slot:body-cell-rank="props">
                                            <q-td :props="props">
                                                <q-btn-group outline>
                                                    <q-btn outline @click="moveResultUp(props.row.runnerID, props.row.rank)" color="red" icon="keyboard_arrow_up"></q-btn>
                                                    <q-btn outline disabled text-bold text-color="black" :label="props.value" style='min-width: 60px;'></q-btn>
                                                    <q-btn outline @click="moveResultDown(props.row.runnerID, props.row.rank)" color="green" icon="keyboard_arrow_down"></q-btn>
                                                </q-btn-group>
                                            </q-td>
                                        </template>
                                        <template v-slot:body-cell-name="props">
                                            <q-td :props="props">
                                                <q-btn-group outline>
                                                    <q-btn disabled :color="(props.row.gender === 'M') ? 'blue' : 'pink'" :label="props.row.bibNumber" style='min-width: 70px;'></q-btn>
                                                    <q-btn outline disabled no-caps :color="(props.row.gender === 'M') ? 'blue' : 'pink'" :label="props.value"></q-btn>
                                                </q-btn-group>
                                            </q-td>
                                        </template>
                                        <template v-slot:body-cell-runnerID="props">
                                            <q-td :props="props">
                                                <q-btn flat color="negative" icon="delete_forever" @click="showDelResult(props.value)" />
                                            </q-td>
                                        </template>
                                    </q-table>
                                </div>
                            </div>
                        </q-tab-panel>

                        <q-tab-panel name="results">
                            <div class="text-h6">Résultats</div>
                            Lorem ipsum dolor sit amet consectetur adipisicing elit.
                        </q-tab-panel>
                    </q-tab-panels>
                </div>
            </q-page>

            <q-dialog v-model="dialogRunnerSave">
                <q-card>
                    <q-toolbar class="bg-positive text-white">
                        <q-icon name="person" ></q-icon>
                        <q-toolbar-title><span class="text-weight-bold">Informations sur le coureur</span></q-toolbar-title>
                        <q-btn flat round dense icon="close" v-close-popup />
                    </q-toolbar>

                    <q-card-section>
                        <table>
                            <tr>
                                <td>
                                    # ID :
                                </td>
                                <td width="350">
                                    <q-input outlined v-model="inputRunnerID" readonly />
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    Nom :
                                </td>
                                <td>
                                    <q-input autofocus outlined v-model="inputRunnerName" @keyup.enter="saveRunner" />
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    Genre :
                                </td>
                                <td>
                                    <q-btn-toggle
                                        v-model="inputRunnerGender"
                                        spread
                                        toggle-color="primary"
                                        :options="[
                                            {label: 'Masculin', value: 'M'},
                                            {label: 'Féminin', value: 'F'}
                                        ]"
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    Groupe :
                                </td>
                                <td>
                                    <q-input outlined v-model="inputRunnerGroup" @keyup.enter="saveRunner" />
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    Sous-groupe :
                                </td>
                                <td>
                                    <q-input outlined v-model="inputRunnerSubgroup" @keyup.enter="saveRunner" />
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    Dossard :
                                </td>
                                <td>
                                    <q-input outlined v-model="inputRunnerBibNumber" @keyup.enter="saveRunner" />
                                </td>
                            </tr>
                        </table>
                    </q-card-section>
                    <q-separator />
                    <q-card-actions>
                        <q-btn outline color="negative" icon="delete_forever" label="Supprimer" @click="showDelRunner" />
                        <q-space></q-space>
                        <q-btn color="positive" icon="save" label="Enregistrer" @click="saveRunner" />
                    </q-card-actions>
                </q-card>
            </q-dialog>
            <q-dialog v-model="dialogRaceSave">
                <q-card>
                    <q-toolbar class="bg-positive text-white">
                        <q-icon name="directions_run" ></q-icon>
                        <q-toolbar-title><span class="text-weight-bold">Informations sur la course</span></q-toolbar-title>
                        <q-btn flat round dense icon="close" v-close-popup />
                    </q-toolbar>

                    <q-card-section>
                        <table>
                            <tr>
                                <td>
                                    # ID :
                                </td>
                                <td width="250">
                                    <q-input outlined v-model="inputRaceID" readonly />
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    Nom :
                                </td>
                                <td>
                                    <q-input autofocus outlined v-model="inputRaceName" @keyup.enter="saveRace" />
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    Couleur :
                                </td>
                                <td>
                                    <q-input
                                        outlined
                                        v-model="inputRaceColor"
                                    >
                                        <template v-slot:append>
                                            <q-icon name="colorize" class="cursor-pointer">
                                                <q-popup-proxy transition-show="scale" transition-hide="scale">
                                                    <q-color
                                                        v-model="inputRaceColor"
                                                        no-header
                                                        no-footer
                                                        default-view="palette"
                                                    />
                                                </q-popup-proxy>
                                            </q-icon>
                                        </template>
                                    </q-input>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    Nombre de coureurs à<br>comptabiliser par groupe :
                                </td>
                                <td>
                                    <q-input outlined v-model.number="inputRaceNbRunnersToCount" type="number" @keyup.enter="saveRace" />
                                </td>
                            </tr>
                        </table>
                    </q-card-section>
                    <q-separator />
                    <q-card-actions>
                        <q-btn outline color="negative" icon="delete_forever" label="Supprimer" @click="showDelRace" />
                        <q-space></q-space>
                        <q-btn color="positive" icon="save" label="Enregistrer" @click="saveRace" />
                    </q-card-actions>
                </q-card>
            </q-dialog>
            <q-dialog v-model="dialogRunnerDel" persistent>
                <q-card>
                    <q-card-section class="row items-center">
                        <q-avatar icon="delete_forever" color="negative" text-color="white" />
                        <span class="q-ml-sm">Voulez-vous vraiment supprimer ce coureur ?</span>
                    </q-card-section>
                    <q-card-actions align="right">
                        <q-btn flat label="Annuler" color="primary" v-close-popup />
                        <q-btn flat label="Supprimer" color="negative" @click="delRunner" />
                    </q-card-actions>
                </q-card>
            </q-dialog>
            <q-dialog v-model="dialogRaceDel" persistent>
                <q-card>
                    <q-card-section class="row items-center">
                        <q-avatar icon="delete_forever" color="negative" text-color="white" />
                        <span class="q-ml-sm">Voulez-vous vraiment supprimer cette course ?</span>
                    </q-card-section>
                    <q-card-actions align="right">
                        <q-btn flat label="Annuler" color="primary" v-close-popup />
                        <q-btn flat label="Supprimer" color="negative" @click="delRace" />
                    </q-card-actions>
                </q-card>
            </q-dialog>
            <q-dialog v-model="dialogSelectedRunnersDel" persistent>
                <q-card>
                    <q-card-section class="row items-center">
                        <q-avatar icon="delete_forever" color="negative" text-color="white" />
                        <span class="q-ml-sm">Voulez-vous vraiment supprimer tous les coureurs sélectionnés ?</span>
                    </q-card-section>
                    <q-card-actions align="right">
                        <q-btn flat label="Annuler" color="primary" v-close-popup />
                        <q-btn flat label="Supprimer ces coureurs" color="negative" @click="delSelectedRunners" />
                    </q-card-actions>
                </q-card>
            </q-dialog>
            <q-dialog v-model="dialogImportCSV" full-width>
                <q-card>
                    <q-toolbar>
                        <q-avatar>
                            <q-icon name="group" />
                        </q-avatar>

                        <q-toolbar-title>Import de coureurs</q-toolbar-title>

                        <q-btn flat round dense icon="close" v-close-popup />
                    </q-toolbar>
                    <q-card-section>
                        <q-stepper
                            v-model="stepImport"
                            ref="stepper"
                            color="primary"
                            done-color="positive"
                            alternative-labels
                            animated
                        >
                            <q-step
                                :name="1"
                                title="Sélection des colonnes"
                                icon="view_week"
                                :done="stepImport > 1"
                            >
                                <table cellspacing="0" style="width:100%;">
                                    <tr>
                                        <td v-for="n in nbCsvColumns" :key="n" style="padding: 10px;">
                                            <q-select outlined v-model="selectColIdentification[n-1]" :options="optionsSelectColIdentification" @input="showButtonImportColumns" :bg-color="(selectColIdentification[n-1].value != 'noimport') ? 'positive' : ''" />
                                        </td>
                                    </tr>
                                    <tr align="center" :style="toggleImportFirstLine ? '' : 'color: #808080; background: #D3D3D3;'" style="height: 42px;">
                                        <td v-for="n in nbCsvColumns" :key="n">
                                            {{ dataCSV[0][n-1] }}
                                        </td>
                                        <td>
                                            <q-toggle
                                                v-model="toggleImportFirstLine"
                                                checked-icon="check"
                                                color="green"
                                                unchecked-icon="clear"
                                                size="xs"
                                            >
                                                <q-tooltip>
                                                    Importer la première ligne ?
                                                </q-tooltip>
                                            </q-toggle>
                                        </td>
                                    </tr>
                                    <tr align="center" style="height: 42px;">
                                        <td v-for="n in nbCsvColumns" :key="n">
                                            {{ dataCSV[1][n-1] }}
                                        </td>
                                    </tr>
                                    <tr align="center" style="height: 42px;">
                                        <td v-for="n in nbCsvColumns" :key="n">
                                            {{ dataCSV[2][n-1] }}
                                        </td>
                                    </tr>
                                    <tr align="center" style="height: 42px;">
                                        <td v-for="n in nbCsvColumns" :key="n">
                                            {{ dataCSV[3][n-1] }}
                                        </td>
                                    </tr>
                                    <tr align="center" style="height: 42px;">
                                        <td v-for="n in nbCsvColumns" :key="n">
                                            {{ dataCSV[4][n-1] }}
                                        </td>
                                    </tr>
                                    <tr align="center" style="height: 42px;">
                                        <td v-for="n in nbCsvColumns" :key="n">
                                            ...
                                        </td>
                                    </tr>
                                </table>
                            </q-step>

                            <q-step
                                :name="2"
                                title="Sélection des coureurs"
                                icon="group"
                            >
                                <q-table
                                    :data="dataImport"
                                    :columns="columnsImport"
                                    row-key="importID"
                                    class="tableRunners"
                                    virtual-scroll
                                    table-style="max-height: 40vh"
                                    no-data-label="Il n'y a aucun coureur dans ce fichier"
                                    :pagination.sync="paginationImport"
                                    :rows-per-page-options="[0]"
                                    :virtual-scroll-sticky-start="48"
                                    :selected-rows-label="getSelectedImportString"
                                    selection="multiple"
                                    :selected.sync="selectedImport"
                                ></q-table>
                            </q-step>

                            <template v-slot:navigation>
                                <q-stepper-navigation>
                                    <div class="row justify-end">
                                        <q-btn v-if="stepImport > 1" flat color="primary" @click="$refs.stepper.previous()" label="Précédent" style="margin-right: 20px;" />
                                        <q-btn v-if="stepImport > 1" color="primary" @click="importSelectedRunners" icon="group_add" label="Importer les coureurs sélectionnés" />
                                        <q-btn v-if="(!toggleButtonImportColumns)&&(stepImport < 2)" disable outline color="primary" icon="view_week" label="Identifier les colonnes avant de pouvoir importer les données..." />
                                        <q-btn v-if="(toggleButtonImportColumns)&&(stepImport < 2)" @click="importColumns(); $refs.stepper.next()" outline color="positive" icon="view_week" label="Importer ces données..." />
                                    </div>
                                </q-stepper-navigation>
                            </template>
                        </q-stepper>
                    </q-card-section>
                </q-card>
            </q-dialog>
            <q-dialog v-model="dialogAssignBibNumbers">
                <q-card>
                    <q-toolbar>
                        <q-avatar>
                            <q-icon name="share" />
                        </q-avatar>
                        <q-toolbar-title>1er Dossard :</q-toolbar-title>
                    </q-toolbar>
                    <q-card-section class="q-pt-none">
                        <q-input v-model.number="inputBibNumber" type="number" outlined autofocus @keyup.enter="assignBibNumbers" />
                    </q-card-section>
                    <q-card-actions>
                        <q-space></q-space>
                        <q-btn v-close-popup flat color="primary" label="Annuler" />
                        <q-btn color="primary" @click="assignBibNumbers" icon="share" label="Distribuer" />
                    </q-card-actions>
                </q-card>
            </q-dialog>
            <q-dialog v-model="dialogSelectRunner">
                <q-card style="width: 600px;">
                    <q-toolbar class="bg-primary text-white">
                        <q-icon name="person" ></q-icon>
                        <q-toolbar-title><span class="text-weight-bold">Cliquer sur le coureur recherché</span></q-toolbar-title>
                        <q-btn flat round dense icon="close" v-close-popup />
                    </q-toolbar>
                    <q-card-section class="q-pt-none">
                        <q-table
                            class="tableRunners"
                            virtual-scroll
                            table-style="min-height: 40vh"
                            no-data-label="Il n'y a aucun coureur dans ce fichier"
                            no-results-label="Il n'y a aucun résultat répondant à ces critères de recherche."
                            :pagination.sync="paginationSelectRunner"
                            :rows-per-page-options="[0]"
                            :virtual-scroll-sticky-start="48"
                            :filter="filterSelectRunner"
                            row-key="name"
                            title="Sélection d'un coureur"
                            separator="none"
                            :data="dataRunners"
                            :columns="columnsSelectRunner"
                            @row-click="selectRunner"
                        >
                            <template v-slot:top>
                                <q-input clearable ref="inputRefSelectRunner" class="col" outlined debounce="300" color="primary" v-model="filterSelectRunner">
                                    <template v-slot:prepend>
                                        <q-icon name="search" ></q-icon>
                                    </template>
                                </q-input>
                            </template>
                            <template v-slot:body-cell-name="props">
                                <q-td :props="props">
                                    <q-btn-group outline>
                                        <q-btn disabled :color="(props.row.gender === 'M') ? 'blue' : 'pink'" :label="props.row.bibNumber" style='min-width: 70px;'></q-btn>
                                        <q-btn outline disabled no-caps :color="(props.row.gender === 'M') ? 'blue' : 'pink'" :label="props.value"></q-btn>
                                    </q-btn-group>
                                </q-td>
                            </template>
                        </q-table>
                    </q-card-section>
                </q-card>
            </q-dialog>
            <q-dialog v-model="dialogResultDel" persistent>
                <q-card>
                    <q-card-section class="row items-center">
                        <q-avatar icon="delete_forever" color="negative" text-color="white" />
                        <span class="q-ml-sm">Voulez-vous vraiment supprimer ce résultat ?</span>
                    </q-card-section>
                    <q-card-section class="row items-center">
                        <q-btn-group outline>
                            <q-btn disabled :color="(resultToDelRunnerGender === 'M') ? 'blue' : 'pink'" :label="resultToDelRunnerBibNumber" style='min-width: 70px;'></q-btn>
                            <q-btn outline disabled no-caps :color="(resultToDelRunnerGender === 'M') ? 'blue' : 'pink'" :label="resultToDelRunnerName"></q-btn>
                        </q-btn-group>
                    </q-card-section>
                    <q-card-actions align="right">
                        <q-btn flat label="Annuler" color="primary" v-close-popup />
                        <q-btn flat label="Supprimer" color="negative" @click="delResult" />
                    </q-card-actions>
                </q-card>
            </q-dialog>
        </q-page-container>
    </q-layout>
</template>

<script>

// const electron = require('electron');
const { BrowserWindow, dialog, shell } = require('electron').remote;
const fs = require('fs');
const path = require('path');
const DAO = require('../statics/lib/dao.js');
var csv = require('fast-csv');

export default {
    name: 'Main',
    data () {
        return {
            tab: 'management',
            tabManagement: 'runners',
            tabRaces: '',
            bibNumberRedundants: [],
            filterRunners: '',
            filterResults: '',
            filterSelectRunner: '',
            left: false,
            lastFileOpened: '',
            lastFileOpenedFilename: '',
            showLastFileOpened: true,
            inputRunnerID: '',
            inputRunnerName: '',
            inputRunnerGender: 'M',
            inputRunnerGroup: '',
            inputRunnerSubgroup: '',
            inputRunnerBibNumber: '',
            inputBibNumber: '',
            inputRaceID: '',
            inputRaceName: '',
            inputRaceColor: '',
            inputRaceNbRunnersToCount: '',
            inputResultBibNumber: '',
            dataRunners: DAO.data.runners,
            dataRaces: DAO.data.races,
            dataResults: [],
            modelResults: 'completed',
            resultToDelRunnerID: '',
            resultToDelRunnerIndex: '',
            resultToDelRunnerGender: '',
            resultToDelRunnerBibNumber: '',
            resultToDelRunnerName: '',
            stepImport: 1,
            nbCsvColumns: 0,
            nbCsvColumnsTemp: 0,
            toggleImportFirstLine: true,
            toggleButtonImportColumns: false,
            importColumn: {
                lastname: '',
                firstname: '',
                fullname: '',
                genderMF: '',
                genderGF: '',
                group: '',
                subgroup: ''
            },
            dataCSV: [],
            dataImport: [],
            selectedRunners: [],
            selectedImport: [],
            paginationRunners: {
                rowsPerPage: 0
            },
            paginationImport: {
                rowsPerPage: 0
            },
            paginationResults: {
                rowsPerPage: 0,
                sortBy: 'rank',
                descending: true
            },
            paginationSelectRunner: {
                rowsPerPage: 0
            },
            columnsRunners: [
                {
                    name: 'runnerID',
                    label: '#',
                    field: 'runnerID',
                    sortable: true,
                    sort: (a, b) => parseInt(a, 10) - parseInt(b, 10)
                },
                {
                    name: 'name',
                    required: true,
                    label: 'Nom du coureur',
                    align: 'left',
                    field: row => row.name,
                    format: val => `${val}`,
                    sortable: true
                },
                { name: 'gender', align: 'center', label: 'Genre', field: 'gender', sortable: true },
                { name: 'group', align: 'center', label: 'Groupe', field: 'group', sortable: true },
                { name: 'subgroup', align: 'center', label: 'Sous-Groupe', field: 'subgroup', sortable: true },
                { name: 'bibNumber', label: 'Dossard', field: 'bibNumber', sortable: true, sort: (a, b) => parseInt(a, 10) - parseInt(b, 10) }
            ],
            columnsImport: [
                {
                    name: 'importID',
                    label: '#',
                    field: 'importID',
                    sortable: true,
                    sort: (a, b) => parseInt(a, 10) - parseInt(b, 10)
                },
                {
                    name: 'name',
                    required: true,
                    label: 'NOM Prénom',
                    align: 'left',
                    field: row => row.name,
                    format: val => `${val}`,
                    sortable: true
                },
                { name: 'gender', align: 'center', label: 'Genre', field: 'gender', sortable: true },
                { name: 'group', align: 'center', label: 'Groupe', field: 'group', sortable: true },
                { name: 'subgroup', align: 'center', label: 'Sous-Groupe', field: 'subgroup', sortable: true }
            ],
            optionsSelectColIdentification: [
                {
                    label: 'Non importé...',
                    value: 'noimport'
                },
                {
                    label: 'NOM Prénom',
                    value: 'fullname'
                },
                {
                    label: 'NOM',
                    value: 'lastname'
                },
                {
                    label: 'Prénom',
                    value: 'firstname'
                },
                {
                    label: 'Genre (M/F)',
                    value: 'genderMF'
                },
                {
                    label: 'Genre (G/F)',
                    value: 'genderGF'
                },
                {
                    label: 'Groupe',
                    value: 'group'
                },
                {
                    label: 'Sous-Groupe',
                    value: 'subgroup'
                }
            ],
            columnsRaces: [
                {
                    name: 'raceID',
                    label: '#',
                    field: 'raceID',
                    sortable: true,
                    sort: (a, b) => parseInt(a, 10) - parseInt(b, 10)
                },
                {
                    name: 'name',
                    required: true,
                    label: 'Nom de la course',
                    align: 'left',
                    field: row => row.name,
                    format: val => `${val}`,
                    sortable: true
                },
                { name: 'color', align: 'center', label: 'Couleur', field: 'color', sortable: true },
                { name: 'nbRunnersToCount', align: 'center', label: 'Nombre de coureurs à prendre en compte', field: 'nbRunnersToCount', sortable: true, sort: (a, b) => parseInt(a, 10) - parseInt(b, 10) },
                { name: 'nbCompleted', align: 'center', label: 'Arrivés', field: 'completed', sortable: true, sort: (a, b) => parseInt(a, 10) - parseInt(b, 10), format: (val, row) => `${val.length}` },
                { name: 'nbDropped', align: 'center', label: 'Abandons', field: 'dropped', sortable: true, sort: (a, b) => parseInt(a, 10) - parseInt(b, 10), format: (val, row) => `${val.length}` },
                { name: 'nbMissing', align: 'center', label: 'Absents', field: 'missing', sortable: true, sort: (a, b) => parseInt(a, 10) - parseInt(b, 10), format: (val, row) => `${val.length}` }
            ],
            columnsResults: [
                {
                    name: 'rank',
                    align: 'center',
                    label: 'Classement',
                    field: 'rank',
                    sortable: true,
                    sort: (a, b) => parseInt(a, 10) - parseInt(b, 10)
                },
                {
                    name: 'name',
                    required: true,
                    label: 'Dossard / Coureur',
                    align: 'left',
                    field: row => row.name,
                    format: val => `${val}`,
                    sortable: true
                },
                { name: 'group', align: 'center', label: 'Groupe', field: 'group', sortable: true },
                { name: 'subgroup', align: 'center', label: 'Sous-Groupe', field: 'subgroup', sortable: true },
                { name: 'runnerID', align: 'center', label: 'Supprimer', field: 'runnerID', sortable: false }
            ],
            columnsSelectRunner: [
                {
                    name: 'name',
                    required: true,
                    label: 'Dossard / Coureur',
                    align: 'left',
                    field: row => row.name,
                    format: val => `${val}`,
                    sortable: true
                },
                { name: 'group', align: 'center', label: 'Groupe', field: 'group', sortable: true },
                { name: 'subgroup', align: 'center', label: 'Sous-Groupe', field: 'subgroup', sortable: true }
            ],
            selectColIdentification: [],
            dialogRunnerSave: false,
            dialogRaceSave: false,
            dialogRunnerDel: false,
            dialogRaceDel: false,
            dialogSelectedRunnersDel: false,
            dialogImportCSV: false,
            dialogAssignBibNumbers: false,
            dialogSelectRunner: false,
            dialogResultDel: false,
            bannerWarningBibNumbers: false,
            cardRunnersActions: false
        }
    },
    computed: {
        /***************************************************************************************************************
        *  Function : resultsBtnToggleColor
        *
        *  Retourne la couleur du btn-toggle de l'onglet "Résultats" selon le filtre Arrivées / Abandons / Absents
        */
        resultsBtnToggleColor () {
            let color = 'positive';
            if (this.modelResults === 'dropped') { color = 'red' }
            if (this.modelResults === 'missing') { color = 'primary' }
            return color
        }
    },
    methods: {
        /***************************************************************************************************************
        *  Function : getSelectedRunnersString
        *
        *  Retourne le texte du nombre de coureurs sélectionnés dans le tableau des Runners
        */
        getSelectedRunnersString: function () {
            return this.selectedRunners.length === 0 ? '' : `${this.selectedRunners.length} coureur${this.selectedRunners.length > 1 ? 's' : ''} sélectionné${this.selectedRunners.length > 1 ? 's' : ''} sur ${this.dataRunners.length}`
        },
        /***************************************************************************************************************
        *  Function : getSelectedImportString
        *
        *  Retourne le texte du nombre de coureurs sélectionnés dans le tableau des Import CSV
        */
        getSelectedImportString: function () {
            return this.selectedImport.length === 0 ? '' : `${this.selectedImport.length} coureur${this.selectedImport.length > 1 ? 's' : ''} sélectionné${this.selectedImport.length > 1 ? 's' : ''} sur ${this.dataCSV.length}`
        },
        /***************************************************************************************************************
        *  Function : loadLastFileOpened
        *
        *  Récupère et affiche le dernier fichier ouvert
        */
        loadLastFileOpened () {
            this.lastFileOpened = this.$q.localStorage.getItem('lastFileOpened');
            // Si aucun fichier JSON n'est enregistré dans les préférences
            if (this.lastFileOpened === null) {
                // on cache la ligne d'ouverture du dernier fichier ouvert
                this.showLastFileOpened = false;
            } else {
                // On vérifie que le fichier existe bien (il aurait pu être déplacé par exemple)
                fs.access(this.lastFileOpened, fs.F_OK, (err) => {
                    // S'il n'existe pas ou plus
                    if (err) {
                        // on cache la ligne d'ouverture du dernier fichier ouvert
                        this.showLastFileOpened = false;
                    } else {
                        // on affiche la ligne d'ouverture du dernier fichier ouvert
                        this.showLastFileOpened = true;
                        // On affiche le nom du dernier fichier ouvert
                        this.lastFileOpenedFilename = this.lastFileOpened.substring(this.lastFileOpened.lastIndexOf('/') + 1);
                    }
                });
            }
        },
        /***************************************************************************************************************
        *  Function : updateLastFileOpened
        *
        *  Met à jour le dernier fichier ouvert dans DAO et dans les préférences
        *
        *  Parameters :
        *    (String) fileJSON - URL d'un fichier JSON
        */
        updateLastFileOpened (fileJSON) {
            // Si on ouvre un autre fichier que le dernier ouvert
            if (fileJSON !== this.lastFileOpened) {
                // On enregistre le fichier dans les préférences pour l'ouvrir par défaut la prochaine fois
                this.$q.localStorage.set('lastFileOpened', fileJSON);
                // On met à jour les données de l'interface
                this.lastFileOpened = fileJSON;
                this.lastFileOpenedFilename = this.lastFileOpened.substring(this.lastFileOpened.lastIndexOf('/') + 1);
                this.showLastFileOpened = true;
            }
        },
        /***************************************************************************************************************
        *  Function : openLastFileOpened
        *
        *  Ouverture du dernier fichier JSON ouvert
        */
        openLastFileOpened () {
            this.open(this.lastFileOpened);
        },
        /***************************************************************************************************************
        *  Function : openFile
        *
        *  Sélection d'un fichier JSON existant
        */
        openFile () {
            // On sélectionne le fichier JSON à importer
            dialog.showOpenDialog({
                title: 'Sélectionner le fichier .json à charger',
                buttonLabel: 'Ouvrir ce fichier JSON',
                filters: [{ name: 'JSON', extensions: ['json'] }, { name: 'Tous les fichiers', extensions: ['*'] }],
                properties: ['openFile']
            }).then(result => {
                if (result.filePaths && result.filePaths.length > 0) {
                    this.open(result.filePaths[0]);
                }
            }).catch(err => {
                console.log(err)
            })
        },
        /***************************************************************************************************************
        *  Function : newFile
        *
        *  Création d'un nouveau fichier JSON
        */
        newFile () {
            // On sélectionne l'emplacement du fichier JSON à créer
            dialog.showSaveDialog({
                title: 'Créer un nouveau fichier .json',
                buttonLabel: 'Enregistrer',
                filters: [{ name: 'JSON', extensions: ['json'] }, { name: 'Tous les fichiers', extensions: ['*'] }]
            }).then(result => {
                if (result.filePath && result.filePath.length > 0) {
                    DAO.init(result.filePath);
                    DAO.data = { runners: [], races: [] };
                    DAO.save();
                    this.updateLastFileOpened(result.filePath);
                    // On affiche la page de gestion du cross
                    this.tab = 'management';
                    // Rafraichissement de l'interface
                    this.filterRunners = '';
                    this.filterResults = '';
                    this.refreshData();
                    // On cache le menu (drawer)
                    this.left = false;
                }
            }).catch(err => {
                console.log(err)
            })
        },
        /***************************************************************************************************************
        *  Function : open
        *
        *  Ouvre un fichier JSON en mémoire et affiche l'interface principale
        *
        *  Parameters :
        *    (String) fileJSON - URL d'un fichier JSON
        */
        open (fileJSON) {
            this.updateLastFileOpened(fileJSON);
            // On affiche la page de gestion du cross
            this.tab = 'management';
            // On charge les informations
            DAO.init(fileJSON);
            DAO.load();
            // Rafraichissement de l'interface
            this.filterRunners = '';
            this.filterResults = '';
            this.refreshData();
            // On cache le menu (drawer)
            this.left = false;
        },
        /***************************************************************************************************************
        *  Function : refreshData
        *
        *  Rafraichit les données dans les différents tableaux : dataRunners, dataRaces
        */
        refreshData () {
            this.refreshDataRunners();
            this.refreshDataRaces();
        },
        /***************************************************************************************************************
        *  Function : refreshDataRunners
        *
        *  Rafraichit les données du tableau dataRunners
        */
        refreshDataRunners () {
            this.dataRunners = DAO.data.runners;
            // Charge la liste de sélection filtrable de l'onglet "Saisie des résultats"
            this.loadSelectRunner();
            this.filterRunners = '';
            this.filterResults = '';
            // On vérifie qu'un dossard ne soit pas attribué à plusieurs coureurs
            this.checkBibNumbers();
        },
        /***************************************************************************************************************
        *  Function : refreshDataRaces
        *
        *  Rafraichit les données du tableau dataRaces
        */
        refreshDataRaces () {
            this.dataRaces = DAO.data.races;
            // S'il y a une course dans le fichier
            if (this.dataRaces.length > 0) {
                // Si aucun onglet n'était sélectionne ou si l'onglet actuel n'existe plus (suite à suppression)
                if ((this.tabRaces === '') || (!DAO.racesCheckExistence(this.tabRaces))) {
                    // On sélectionne la première dans l'onglet "Saisie des arrivées"
                    this.tabRaces = this.dataRaces[0].raceID;
                }
                this.loadDataResults();
            }
        },
        /***************************************************************************************************************
        *  Function : refreshDataResults
        *
        *  Rafraichit les données du tableau dataResults sur un clic de l'onglet d'une course
        *
        *  Parameters :
        *    (Event) evt - Evenènement du clic sur l'onglet de la course dans l'onglet des résultats
        */
        refreshDataResults (evt) {
            // On lance une MAJ un peu plus tard (car sinon l'onglet n'est pas encore sélectionné : tabRaces)
            setTimeout(this.loadDataResults, 200);
        },
        /***************************************************************************************************************
        *  Function : loadDataResults
        *
        *  Charge les résultats dans le tableau de l'onglet "Saisie des résultats"
        */
        loadDataResults () {
            this.dataResults = [];
            // Récupère les résultats d'une course (raceID) et d'un tableau (completed/dropped/missing)
            const dataResultsByIndex = DAO.racesGetDataResults(this.tabRaces, this.modelResults);
            const iMax = dataResultsByIndex.length;
            for (var i = 0; i < iMax; i++) {
                const rank = dataResultsByIndex[i].rank;
                const runnerIndex = dataResultsByIndex[i].runnerIndex;
                this.dataResults.push({
                    rank: rank,
                    runnerID: DAO.data.runners[runnerIndex].runnerID,
                    name: DAO.data.runners[runnerIndex].name,
                    gender: DAO.data.runners[runnerIndex].gender,
                    group: DAO.data.runners[runnerIndex].group,
                    subgroup: DAO.data.runners[runnerIndex].subgroup,
                    bibNumber: DAO.data.runners[runnerIndex].bibNumber
                });
            }
        },
        /***************************************************************************************************************
        *  Function : loadSelectRunner
        *
        *  Charge les coureurs dans la liste de sélection filtrable de l'onglet "Saisie des résultats"
        */
        loadSelectRunner () {
            this.optionsSelectRunnerAllRunners = [];
            var iMax = DAO.data.runners.length;
            for (var i = 0; i < iMax; i++) {
                this.optionsSelectRunnerAllRunners.push({
                    runnerID: DAO.data.runners[i].runnerID,
                    name: DAO.data.runners[i].name,
                    bibNumber: DAO.data.runners[i].bibNumber,
                    gender: DAO.data.runners[i].gender
                });
            }
        },
        /***************************************************************************************************************
        *  Function : showAddRunner
        *
        *  Ouverture de la fenêtre de dialogue pour ajouter un coureur
        */
        showAddRunner () {
            // On vide le formulaire
            this.inputRunnerID = '';
            this.inputRunnerName = '';
            this.inputRunnerGender = 'M';
            this.inputRunnerGroup = '';
            this.inputRunnerSubgroup = '';
            this.inputRunnerBibNumber = '';
            // On affiche la fenêtre de dialogue
            this.dialogRunnerSave = true;
        },
        /***************************************************************************************************************
        *  Function : showAddRace
        *
        *  Ouverture de la fenêtre de dialogue pour ajouter une course
        */
        showAddRace () {
            // On vide le formulaire
            this.inputRaceID = '';
            this.inputRaceName = '';
            this.inputRaceColor = '';
            this.inputRaceNbRunnersToCount = '';
            // On affiche la fenêtre de dialogue
            this.dialogRaceSave = true;
        },
        /***************************************************************************************************************
        *  Function : showActionsRunners
        *
        *  Affiche les boutons d'actions lorsque des coureurs sont sélectionnés
        *
        *  Parameters :
        *    (Objet) details - Objet contenant les détails de l'évènement sélection d'une ligne du tableau
        */
        showActionsRunners (details) {
            // Par défaut, on affiche la banner (sur une sélection)
            this.cardRunnersActions = true;
            // Et on lance une verification un peu plus tard (en différé car sinon le tableau selected.sync n'est pas à jour)
            setTimeout(this.checkActionsRunners, 200);
        },
        /***************************************************************************************************************
        *  Function : checkActionsRunners
        *
        *  S'il n'y a plus de coureurs sélectionnés, on cache la barre d'actions
        */
        checkActionsRunners () {
            if (this.selectedRunners.length !== 0) {
                this.cardRunnersActions = true;
            } else {
                this.cardRunnersActions = false;
            }
        },
        /***************************************************************************************************************
        *  Function : showEditRunner
        *
        *  Ouverture de la fenêtre de dialogue pour éditer un coureur
        *
        *  Parameters :
        *    (Event) evt - Evenènement du clic sur la ligne du tableau
        *    (Objet) row - Objet contenant la ligne cliquée
        */
        showEditRunner (evt, row) {
            // On remplit le formulaire
            this.inputRunnerID = row.runnerID;
            this.inputRunnerName = row.name;
            this.inputRunnerGender = row.gender;
            this.inputRunnerGroup = row.group;
            this.inputRunnerSubgroup = row.subgroup;
            this.inputRunnerBibNumber = row.bibNumber;
            // On affiche la fenêtre de dialogue
            this.dialogRunnerSave = true;
        },
        /***************************************************************************************************************
        *  Function : showEditRace
        *
        *  Ouverture de la fenêtre de dialogue pour éditer une course
        *
        *  Parameters :
        *    (Event) evt - Evenènement du clic sur la ligne du tableau
        *    (Objet) row - Objet contenant la ligne cliquée
        */
        showEditRace (evt, row) {
            // On remplit le formulaire
            this.inputRaceID = row.raceID;
            this.inputRaceName = row.name;
            this.inputRaceColor = row.color;
            this.inputRaceNbRunnersToCount = row.nbRunnersToCount;
            // On affiche la fenêtre de dialogue
            this.dialogRaceSave = true;
        },
        /***************************************************************************************************************
        *  Function : showDelRunner
        *
        *  Ouverture de la fenêtre de confirmation pour supprimer un coureur
        */
        showDelRunner () {
            this.dialogRunnerDel = true;
        },
        /***************************************************************************************************************
        *  Function : showDelRace
        *
        *  Ouverture de la fenêtre de confirmation pour supprimer une course
        */
        showDelRace () {
            this.dialogRaceDel = true;
        },
        /***************************************************************************************************************
        *  Function : showDelResult
        *
        *  Ouverture de la fenêtre de dialogue pour supprimer un résultat
        *
        *  Parameters :
        *    (String) runnerID - ID du coureur
        */
        showDelResult (runnerID) {
            // On sauvegarde le runnerIndex à supprimer en variable globale
            this.resultToDelRunnerID = runnerID;
            this.resultToDelRunnerIndex = DAO.runnersGetIndexFromRunnerID(runnerID);
            this.resultToDelRunnerGender = DAO.data.runners[this.resultToDelRunnerIndex].gender;
            this.resultToDelRunnerBibNumber = DAO.data.runners[this.resultToDelRunnerIndex].bibNumber;
            this.resultToDelRunnerName = DAO.data.runners[this.resultToDelRunnerIndex].name;
            // On affiche la fenêtre de dialogue
            this.dialogResultDel = true;
        },
        /***************************************************************************************************************
        *  Function : showSelectRunner
        *
        *  Ouverture de la fenêtre de recherche de coureur (dossard perdu)
        */
        showSelectRunner () {
            // On redonne le focus au formulaire de saisie
            setTimeout(() => {
                this.$refs.inputRefSelectRunner.focus()
            }, 200);
            // On affiche la fenêtre de recherche
            this.dialogSelectRunner = true;
        },
        /***************************************************************************************************************
        *  Function : delRunner
        *
        *  Supprime le coureur dont la boîte de dialogue est ouverte
        */
        delRunner () {
            // S'il y a bien un runnerID à supprimer
            if (this.inputRunnerID !== '') {
                // Suppression du coureur
                DAO.runnersDel(this.inputRunnerID.toString());
                // On enregistre le fichier
                DAO.save();
                // On rafraichit l'interface
                this.refreshData();
            }
            this.dialogRunnerDel = false;
            this.dialogRunnerSave = false;
        },
        /***************************************************************************************************************
        *  Function : delRace
        *
        *  Supprime la course dont la boîte de dialogue est ouverte
        */
        delRace () {
            // S'il y a bien un raceID à supprimer
            if (this.raceID !== '') {
                // Suppression d'une course
                DAO.racesDel(this.inputRaceID.toString());
                // On enregistre le fichier
                DAO.save();
                // On rafraichit l'interface
                this.refreshDataRaces();
            }
            this.dialogRaceDel = false;
            this.dialogRaceSave = false;
        },
        /***************************************************************************************************************
        *  Function : delResult
        *
        *  Supprime le résultat dont la boîte de dialogue est ouverte (et dont le runnerIndex est stocké dans les variables)
        */
        delResult () {
            // S'il y a bien un resultToDelRunnerID à supprimer
            if (this.resultToDelRunnerID !== '') {
                // Suppression d'un résultat d'une course
                DAO.racesDelResult(this.tabRaces.toString(), this.resultToDelRunnerID, this.modelResults);
                // On enregistre le fichier
                DAO.save();
                // On vide les variables de la fenêtre de dialogue
                this.resultToDelRunnerID = '';
                this.resultToDelRunnerIndex = '';
                this.resultToDelRunnerGender = '';
                this.resultToDelRunnerBibNumber = '';
                this.resultToDelRunnerName = '';
                // On rafraichit l'interface
                this.refreshDataRaces();
            }
            this.dialogResultDel = false;
        },
        /***************************************************************************************************************
        *  Function : saveRunner
        *
        *  Enregistre les informations du coureur
        */
        saveRunner () {
            // S'il n'y a pas de runnerID, c'est un nouveau coureur
            if (this.inputRunnerID === '') {
                // On lui attribue un nouveau runnerID
                this.inputRunnerID = DAO.runnersGetNewRunnerID();
                // Ajout du coureur
                DAO.runnersAdd(this.inputRunnerID.toString(), this.inputRunnerName, this.inputRunnerGender, this.inputRunnerGroup, this.inputRunnerSubgroup, this.inputRunnerBibNumber);
                // On rafraichit l'interface
                this.refreshData();
            } else {
                // On modifie le coureur
                DAO.runnersEdit(this.inputRunnerID.toString(), this.inputRunnerName, this.inputRunnerGender, this.inputRunnerGroup, this.inputRunnerSubgroup, this.inputRunnerBibNumber);
                // BUGFIX : Pour rafraichir l'interface sur une édition... obligé de filtrer n'importe quoi...
                this.filterRunners = 'Chargement...';
                this.filterResults = 'Chargement...';
                // Puis de rafraichir en laissant quelques millisecondes...
                setTimeout(this.refreshData, 200);
            }
            // On enregistre le fichier
            DAO.save();
            // On vide le formulaire
            this.inputRunnerID = '';
            this.inputRunnerName = '';
            this.inputRunnerGender = 'M';
            this.inputRunnerGroup = '';
            this.inputRunnerSubgroup = '';
            this.inputRunnerBibNumber = '';
            // On ferme la boîte de dialogue du coureur
            this.dialogRunnerSave = false;
        },
        /***************************************************************************************************************
        *  Function : saveRace
        *
        *  Enregistre les informations de la course
        */
        saveRace () {
            // S'il n'y a pas de raceID, c'est une nouvelle course
            if (this.inputRaceID === '') {
                // On lui attribue un nouveau raceID
                this.inputRaceID = DAO.racesGetNewRaceID();
                // Ajout de la course
                DAO.racesAdd(this.inputRaceID.toString(), this.inputRaceName, this.inputRaceColor, this.inputRaceNbRunnersToCount);
                // On rafraichit l'interface
                this.refreshDataRaces();
            } else {
                // On modifie la course
                DAO.racesEdit(this.inputRaceID.toString(), this.inputRaceName, this.inputRaceColor, this.inputRaceNbRunnersToCount);
                // BUGFIX : Pour rafraichir l'interface sur une édition... obligé de charger n'importe quoi...
                this.dataRaces = [];
                // Puis de rafraichir en laissant quelques millisecondes...
                setTimeout(this.refreshDataRaces, 200);
            }
            // On enregistre le fichier
            DAO.save();
            // On vide le formulaire
            this.inputRaceID = '';
            this.inputRaceName = '';
            this.inputRaceColor = '';
            this.inputRaceNbRunnersToCount = '';
            // On ferme la boîte de dialogue de la course
            this.dialogRaceSave = false;
        },
        /***************************************************************************************************************
        *  Function : showDelSelectedRunners
        *
        *  Ouverture de la fenêtre de confirmation pour supprimer tous les coureurs filtrés
        */
        showDelSelectedRunners () {
            this.dialogSelectedRunnersDel = true;
        },
        /***************************************************************************************************************
        *  Function : delSelectedRunners
        *
        *  Supprime tous les coueurs filtrés de la liste
        */
        delSelectedRunners () {
            // S'il y a bien au moins un coureur à supprimer
            if (this.selectedRunners.length > 0) {
                var iMax = this.selectedRunners.length;
                for (var i = 0; i < iMax; i++) {
                    // Suppression du coureur
                    DAO.runnersDel(this.selectedRunners[i].runnerID);
                }
                // On enregistre le fichier
                DAO.save();
                // On rafraichit l'interface
                this.selectedRunners = [];
                this.refreshData();
                this.dialogSelectedRunnersDel = false;
                this.cardRunnersActions = false;
            }
        },
        /***************************************************************************************************************
        *  Function : showImportCSV
        *
        *  Ouverture de la fenêtre de dialogue pour importer des coureurs
        */
        showImportCSV () {
            // On sélectionne le fichier CSV à importer
            dialog.showOpenDialog({
                title: 'Sélectionner le fichier .csv à importer',
                buttonLabel: 'Importer ce fichier CSV',
                filters: [{ name: 'CSV', extensions: ['csv'] }, { name: 'Tous les fichiers', extensions: ['*'] }],
                properties: ['openFile']
            }).then(result => {
                if (result.filePaths && result.filePaths.length > 0) {
                    this.importCSV(result.filePaths[0]);
                    this.dialogImportCSV = true;
                }
            }).catch(err => {
                console.log(err)
            })
        },
        /***************************************************************************************************************
        *  Function : importCSV
        *
        *  Ouvre un fichier CSV en mémoire et affiche les données à importer
        *
        *  Parameters :
        *    (String) fileCSV - URL d'un fichier CSV
        */
        importCSV (fileCSV) {
            // Initialisation du tableau d'import
            this.stepImport = 1;
            this.toggleImportFirstLine = true;
            this.nbCsvColumns = 0;
            this.nbCsvColumnsTemp = 0;
            this.toggleButtonImportColumns = false;
            this.importColumn = { lastname: '', firstname: '', fullname: '', genderMF: '', genderGF: '', group: '', subgroup: '' };
            this.dataCSV = [];
            this.dataImport = [];
            this.selectedImport = [];
            this.selectColIdentification = [];
            // Utilisation de fast-csv
            csv
                .parseFile(fileCSV, { headers: false })
                .on('error', error => console.error(error))
                .on('data', row => {
                    // Si aucune boite de sélection de colonne n'a encore été créée
                    if (this.selectColIdentification.length === 0) {
                        const jMax = row.length;
                        for (var j = 0; j < jMax; j++) {
                            // On crée l'information par défaut pour cette colonne d'informations
                            this.selectColIdentification[j] = { label: 'Non importé...', value: 'noimport' };
                        }
                        // Combien de colonnes dans une ligne du CSV ? (Que l'on n'affichera qu'une fois que l'on aura les données)
                        this.nbCsvColumnsTemp = jMax;
                    }
                    const runnerToImport = Object.assign({}, row);
                    this.dataCSV.push(runnerToImport);
                })
                .on('end', rowCount => {
                    // Combien de colonnes dans une ligne du CSV ? (pour afficher les informations dans la tableau)
                    this.nbCsvColumns = this.nbCsvColumnsTemp;
                });
        },
        /***************************************************************************************************************
        *  Function : showButtonImportColumns
        *
        *  Dans la fenêtre d'import : Affiche le bouton d'import des colonnes si elles ont bien été identifiées
        */
        showButtonImportColumns () {
            // console.log(this.selectColIdentification);
            // Initialisation : A chaque changement de sélection, on doit tout vider au cas où l'utilisateur en enlève un
            this.importColumn = { lastname: '', firstname: '', fullname: '', genderMF: '', genderGF: '', group: '', subgroup: '' };
            const iMax = this.selectColIdentification.length;
            for (var i = 0; i < iMax; i++) {
                if (this.selectColIdentification[i].value === 'lastname') { this.importColumn.lastname = i; }
                if (this.selectColIdentification[i].value === 'firstname') { this.importColumn.firstname = i; }
                if (this.selectColIdentification[i].value === 'fullname') { this.importColumn.fullname = i; }
                if (this.selectColIdentification[i].value === 'genderMF') { this.importColumn.genderMF = i; }
                if (this.selectColIdentification[i].value === 'genderGF') { this.importColumn.genderGF = i; }
                if (this.selectColIdentification[i].value === 'group') { this.importColumn.group = i; }
                if (this.selectColIdentification[i].value === 'subgroup') { this.importColumn.subgroup = i; }
            }
            // console.log(this.importColumn);
            // Pour passer à la sélection des coureurs, il faut au moins un NOM Prénom complet...
            if ((this.importColumn.fullname !== '') || ((this.importColumn.lastname !== '') && (this.importColumn.firstname !== ''))) {
                this.toggleButtonImportColumns = true;
            } else {
                this.toggleButtonImportColumns = false;
            }
        },
        /***************************************************************************************************************
        *  Function : importColumns
        *
        *  Importe les colonnes sélectionnées depuis le CSV dans le tableau final d'importation des coureurs
        */
        importColumns () {
            this.dataImport = [];
            // On rajoute une colonne importID pour avoir une colonne unique row-key pour la sélection des coureurs
            let dataImportID = 1;
            let dataName = '';
            let dataGender = '';
            let dataGroup = '';
            let dataSubgroup = '';
            var iMax = this.dataCSV.length;
            // Doit-on commencer à la 1ère ligne ou à la 2ème ?
            var iMin = (this.toggleImportFirstLine) ? 0 : 1;
            for (var i = iMin; i < iMax; i++) {
                // S'il y a une colonne NOM Prénom
                if (this.importColumn.fullname !== '') {
                    dataName = this.dataCSV[i][this.importColumn.fullname];
                } else {
                    // Sinon, on réunit NOM et Prénom
                    dataName = this.dataCSV[i][this.importColumn.lastname] + ' ' + this.dataCSV[i][this.importColumn.firstname];
                }
                // S'il y a une colonne Gender M/F
                if (this.importColumn.genderMF !== '') {
                    dataGender = this.dataCSV[i][this.importColumn.genderMF];
                } else {
                    // Sinon, s'il y a une colonne G/F
                    if (this.importColumn.genderGF !== '') {
                        // On transforme G en M
                        dataGender = (this.dataCSV[i][this.importColumn.genderGF] === 'G') ? 'M' : 'F';
                    } else {
                        // Sinon, on met M par défaut
                        dataGender = 'M';
                    }
                }
                // S'il y a une colonne Groupe
                if (this.importColumn.group !== '') {
                    dataGroup = this.dataCSV[i][this.importColumn.group];
                } else {
                    // Sinon, on ne met rien par défaut
                    dataGroup = '';
                }
                // S'il y a une colonne Sous-Groupe
                if (this.importColumn.subgroup !== '') {
                    dataSubgroup = this.dataCSV[i][this.importColumn.subgroup];
                } else {
                    // Sinon, on ne met rien par défaut
                    dataSubgroup = '';
                }
                this.dataImport.push({ importID: dataImportID, name: dataName, gender: dataGender, group: dataGroup, subgroup: dataSubgroup });
                dataImportID++;
            }
        },
        /***************************************************************************************************************
        *  Function : importSelectedRunners
        *
        *  Importe les coureurs sélectionnés depuis le CSV
        */
        importSelectedRunners () {
            // S'il y a bien au moins un coureur à importer
            if (this.selectedImport.length > 0) {
                const iMax = this.selectedImport.length;
                for (var i = 0; i < iMax; i++) {
                    // On récupère les bonnes colonnes
                    const name = this.selectedImport[i].name;
                    const gender = this.selectedImport[i].gender;
                    const group = this.selectedImport[i].group;
                    const subgroup = this.selectedImport[i].subgroup;
                    const bibNumber = '';
                    // On lui attribue un nouveau runnerID
                    const importRunnerID = DAO.runnersGetNewRunnerID();
                    // Ajout du coureur
                    DAO.runnersAdd(importRunnerID.toString(), name, gender, group, subgroup, bibNumber);
                    // On rafraichit l'interface
                    this.refreshDataRunners();
                }
                // On enregistre le fichier
                DAO.save();
                this.dialogImportCSV = false;
            }
        },
        /***************************************************************************************************************
        *  Function : showAssignBibNumbers
        *
        *  Ouverture de la fenêtre de dialogue pour distribuer les dossards
        */
        showAssignBibNumbers () {
            this.inputBibNumber = '';
            this.dialogAssignBibNumbers = true;
        },
        /***************************************************************************************************************
        *  Function : assignBibNumbers
        *
        *  Distribue les dossards à partir d'un numéro rentré par l'utilisateur
        */
        assignBibNumbers () {
            this.dialogAssignBibNumbers = false;
            this.cardRunnersActions = false;
            let bibNumber = this.inputBibNumber;
            const iMax = this.selectedRunners.length;
            for (var i = 0; i < iMax; i++) {
                DAO.runnersEdit(this.selectedRunners[i].runnerID, this.selectedRunners[i].name, this.selectedRunners[i].gender, this.selectedRunners[i].group, this.selectedRunners[i].subgroup, bibNumber);
                bibNumber++;
            }
            // On enregistre le fichier
            DAO.save();
            // On rafraichit l'interface
            this.selectedRunners = [];
            // BUGFIX : Pour rafraichir l'interface sur une édition... obligé de filtrer n'importe quoi...
            this.filterRunners = 'Chargement...';
            this.filterResults = 'Chargement...';
            this.$q.notify({
                message: `Nombre de dossards distribués : ${iMax}`,
                timeout: 3000,
                color: 'positive',
                icon: 'share',
                position: 'bottom'
            });
            // Puis de rafraichir en laissant quelques millisecondes...
            setTimeout(this.refreshData, 200);
        },
        /***************************************************************************************************************
        *  Function : checkBibNumbers
        *
        *  Vérifie qu'un même dossard n'est pas attribué à plusieurs coureurs
        */
        checkBibNumbers () {
            this.bibNumberRedundants = [];
            const redundantsIndexes = DAO.runnersGetRedundantsBibNumbers();
            // Les doublons arrivent... en double... les triplés... en triple... On réduit donc les réponses
            const redundantsIndexesReduced = Array.from(new Set(redundantsIndexes.map(JSON.stringify)), JSON.parse);
            const iMax = redundantsIndexesReduced.length;
            // Si on a au moins un doublon de dossards, on affiche la banner Warning tout en haut
            this.bannerWarningBibNumbers = (iMax > 0);
            // Pour chaque doublon trouvé
            for (var i = 0; i < iMax; i++) {
                // On affiche les coureurs affichant ce dossard dans la fenêtre d'information
                const bibNumber = DAO.data.runners[redundantsIndexesReduced[i][0]].bibNumber;
                const redundants = redundantsIndexesReduced[i].map(index => DAO.data.runners[index].name);
                this.bibNumberRedundants.push({ bibNumber: bibNumber, runners: redundants.join(', ') });
            }
        },
        /***************************************************************************************************************
        *  Function : exportBibNumbersPDF
        *
        *  Génère et exporte un PDF des dossards à partir d'un template (dans une fenêtre cachée)
        */
        exportBibNumbersPDF () {
            // Ouverture de la fenêtre pour générer les dossards au format HTML (mais cachée)
            const winBibNumbers = new BrowserWindow({ show: false, webPreferences: { nodeIntegration: true, devTools: false } });
            // Chargement du template pour les Dossards
            const templateBibNumbers = require('url').format({
                protocol: 'file',
                slashes: true,
                pathname: path.join(__statics, 'bibnumbers.html')
            })
            winBibNumbers.loadURL(templateBibNumbers);

            // Réception d'un message : Chargement terminé
            winBibNumbers.webContents.on('did-finish-load', () => {
                // Envoi des données vers la fenêtre de template des dossards
                winBibNumbers.webContents.send('datatransfer', this.selectedRunners);
            })

            // Réception d'un message : Dossards générés (avec Mustache dans la fenêtre cible)
            winBibNumbers.webContents.on('ipc-message', (event, channel, arg) => {
                // Si on a bien reçu le bon message
                if (channel === 'bibNumbersGenerated') {
                    // On sélectionne l'emplacement du fichier PDF à créer
                    dialog.showSaveDialog({
                        title: 'Exporter les dossards au format PDF',
                        buttonLabel: 'Enregistrer',
                        filters: [{ name: 'PDF', extensions: ['pdf'] }, { name: 'Tous les fichiers', extensions: ['*'] }]
                    }, (file) => {
                        if (file && file.length > 0) {
                            const pdfFile = file;
                            // Transformation HTML > PDF
                            winBibNumbers.webContents.printToPDF({ landscape: true }, (error, data) => {
                                if (error) return console.log(error.message);

                                fs.writeFile(pdfFile, data, err => {
                                    if (err) return console.log(err.message);
                                    console.log('Write PDF successfully: ' + pdfFile);
                                    this.$q.notify({
                                        message: `PDF exporté : ${pdfFile}`,
                                        timeout: 5000,
                                        color: 'positive',
                                        icon: 'print',
                                        position: 'bottom'
                                    });
                                    // On cache les actions pour les coureurs sélectionnés
                                    this.cardRunnersActions = false;
                                    // Fermeture de la fenêtre
                                    winBibNumbers.close();
                                    // Ouverture du PDF
                                    shell.openItem(pdfFile);
                                    // On rafraichit l'interface
                                    this.selectedRunners = [];
                                    // BUGFIX : Pour rafraichir l'interface sur une édition... obligé de filtrer n'importe quoi...
                                    this.filterRunners = 'Chargement...';
                                    // Puis de rafraichir en laissant quelques millisecondes...
                                    setTimeout(this.refreshData, 200);
                                })
                            })
                        }
                    });
                }
            })
        },
        /***************************************************************************************************************
        *  Function : exportBibNumbersCSV
        *
        *  Génère et exporte un CSV des dossards
        */
        exportBibNumbersCSV () {
            // On sélectionne l'emplacement du fichier CSV à créer
            dialog.showSaveDialog({
                title: 'Exporter les dossards au format CSV',
                buttonLabel: 'Enregistrer',
                filters: [{ name: 'CSV', extensions: ['csv'] }, { name: 'Tous les fichiers', extensions: ['*'] }]
            }, (file) => {
                if (file && file.length > 0) {
                    const csvFile = file;
                    const csvRows = [];
                    const iMax = this.selectedRunners.length;
                    for (var i = 0; i < iMax; i++) {
                        csvRows.push([this.selectedRunners[i].name, this.selectedRunners[i].gender, this.selectedRunners[i].group, this.selectedRunners[i].subgroup, this.selectedRunners[i].bibNumber]);
                    }
                    // Utilisation de fast-csv
                    csv.writeToPath(csvFile, csvRows)
                        .on('error', err => console.error(err))
                        .on('finish', () => {
                            this.$q.notify({
                                message: `CSV exporté : ${csvFile}`,
                                timeout: 5000,
                                color: 'positive',
                                icon: 'view_week',
                                position: 'bottom'
                            });
                            // On cache les actions pour les coureurs sélectionnés
                            this.cardRunnersActions = false;
                            // On rafraichit l'interface
                            this.selectedRunners = [];
                            // BUGFIX : Pour rafraichir l'interface sur une édition... obligé de filtrer n'importe quoi...
                            this.filterRunners = 'Chargement...';
                            // Puis de rafraichir en laissant quelques millisecondes...
                            setTimeout(this.refreshData, 200);
                        });
                }
            });
        },
        /***************************************************************************************************************
        *  Function : addResult
        *
        *  Ajoute un résultat (ajoute un runnerID à races.completed/dropped/missing)
        */
        addResult () {
            // S'il y a bien un Dossard à ajouter
            if (this.inputResultBibNumber !== '') {
                const raceID = this.tabRaces;
                const runnerIndexes = DAO.runnersGetIndexesFromBibNumber(this.inputResultBibNumber);
                // Si on trouve plus d'un coureur avec ce numéro de dossard
                if (runnerIndexes.length > 1) {
                    this.$q.notify({
                        message: 'Problème : Ce dossard est utilisé par plusieurs coureurs, ce ne devrait pas être possible',
                        timeout: 3000,
                        color: 'negative',
                        icon: 'warning',
                        position: 'bottom'
                    });
                // Sinon, s'il n'y a aucun coureur avec ce dossard
                } else if (runnerIndexes.length === 0) {
                    this.$q.notify({
                        message: 'Désolé, mais aucun coureur ne porte ce dossard !',
                        timeout: 2000,
                        color: 'negative',
                        icon: 'warning',
                        position: 'bottom'
                    });
                // Sinon, c'est qu'il y a bien un seul coureur avec ce dossard
                } else {
                    // On récupère donc son runnerIndex (c'est le seul résultat du tableau), puis son runnerID
                    const runnerIndex = runnerIndexes[0];
                    const runnerID = DAO.data.runners[runnerIndex].runnerID;
                    // Si ce coureur est déjà présent dans un tableau d'arrivée de cette course (completed ou dropped ou missing)
                    if (DAO.racesRunnerAlreadyPresent(raceID, runnerID)) {
                        // On ne peut pas le saisir une 2ème fois
                        this.$q.notify({
                            message: 'Attention, ce coureur a déjà été saisi !',
                            timeout: 2000,
                            color: 'negative',
                            icon: 'warning',
                            position: 'bottom'
                        });
                    } else {
                        // Ajout d'un résultat d'une course (raceID, runnerID, completed/dropped/missing)
                        DAO.racesAddResult(raceID.toString(), runnerID, this.modelResults);
                        // On enregistre le fichier
                        DAO.save();
                        // On rafraichit l'interface (gestion des courses et des résultats)
                        this.refreshDataRaces();
                        // On vide le formulaire de saisie
                        this.inputResultBibNumber = '';
                        // On rend le focus à l'input du dossard pour enchainer la saisie (mais il l'a déjà ?)
                        setTimeout(() => {
                            this.$refs.inputRefResultBibNumber.focus()
                        }, 200);
                    }
                }
            }
        },
        /***************************************************************************************************************
        *  Function : selectRunner
        *
        *  Ouverture de la fenêtre de dialogue pour éditer un coureur
        *
        *  Parameters :
        *    (Event) evt - Evenènement du clic sur la ligne du tableau
        *    (Objet) row - Objet contenant la ligne cliquée
        */
        selectRunner (evt, row) {
            // On remplit le formulaire
            this.inputResultBibNumber = row.bibNumber;
            // On vide le filtre de recherche
            this.filterSelectRunner = '';
            // On ferme la fenêtre de dialogue
            this.dialogSelectRunner = false;
            // On redonne le focus au formulaire de saisie
            setTimeout(() => {
                this.$refs.inputRefResultBibNumber.focus()
            }, 200);
            // this.$refs.inputRefResultBibNumber.$el.focus();
        },
        /***************************************************************************************************************
        *  Function : moveResultDown
        *
        *  Déplace un résultat vers le bas (le coureur gagne une place au classement)
        *
        *  Parameters :
        *    (String) runnerID - ID du coureur
        *    (String) rank - Classement du coureur
        */
        moveResultDown (runnerID, rank) {
            DAO.racesMoveResultDown(this.tabRaces.toString(), runnerID, this.modelResults, rank);
            // On rafraichit l'interface
            this.refreshDataRaces();
        },
        /***************************************************************************************************************
        *  Function : moveResultUp
        *
        *  Déplace un résultat vers le haut (le coureur perd une place au classement)
        *
        *  Parameters :
        *    (String) runnerID - ID du coureur
        *    (String) rank - Classement du coureur
        */
        moveResultUp (runnerID, rank) {
            DAO.racesMoveResultUp(this.tabRaces.toString(), runnerID, this.modelResults, rank);
            // On rafraichit l'interface
            this.refreshDataRaces();
        }
    },
    created () {
        this.loadLastFileOpened();
        this.left = true;
    }
}
</script>

<style lang="sass">
.tableRunners
  /* max height is important */
  .q-table__middle
    max-height: 200px
  .q-table__top,
  .q-table__bottom,
  thead tr:first-child th /* bg color is important for th; just specify one */
    background-color: #fff
  thead tr:first-child th
    position: sticky
    top: 0
    opacity: 1
    z-index: 1
</style>
