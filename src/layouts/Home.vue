<template>
    <q-layout>
        <q-page-container>
            <q-page padding class="row justify-center">
                <div style="width: 600px; max-width: 90vw;">
                    <q-list link>
                        <q-list-header inset>Créer un Cross</q-list-header>
                        <q-item :to="'/cross/new'">
                            <q-item-side icon="add" inverted color="green" />
                            <q-item-main>
                                <q-item-tile label>Préparer un nouveau Cross</q-item-tile>
                            </q-item-main>
                        </q-item>
                        <q-item-separator inset />
                        <q-list-header inset>Ouvrir un Cross</q-list-header>
                        <q-item v-for="cross in crosslist" :key="cross.id" :to="'/cross/' + cross.id + '/management'">
                            <q-item-side icon="directions_run" inverted color="primary" />
                            <q-item-main>
                                <q-item-tile label>{{ cross.title }}</q-item-tile>
                                <q-item-tile sublabel>{{ cross.id }}</q-item-tile>
                            </q-item-main>
                            <q-item-side right :icon="cross.icon" :color="cross.icon_color" />
                        </q-item>
                        <q-item-separator inset />
                        <q-list-header inset>Importer</q-list-header>
                        <q-item :to="'/cross/import'">
                            <q-item-side icon="unarchive" inverted color="light" />
                            <q-item-main>
                                <q-item-tile label>Importer un Cross</q-item-tile>
                            </q-item-main>
                        </q-item>
                        <q-item :to="'/cross/importbackup'">
                            <q-item-side icon="unarchive" inverted color="light" />
                            <q-item-main>
                                <q-item-tile label>Importer une sauvegarde complète</q-item-tile>
                            </q-item-main>
                        </q-item>
                        <q-item-separator inset />
                        <q-list-header inset>Exporter</q-list-header>
                        <q-item :to="'/cross/export'">
                            <q-item-side icon="archive" inverted color="light" />
                            <q-item-main>
                                <q-item-tile label>Exporter un Cross</q-item-tile>
                            </q-item-main>
                        </q-item>
                        <q-item :to="'/cross/exportbackup'">
                            <q-item-side icon="archive" inverted color="light" />
                            <q-item-main>
                                <q-item-tile label>Exporter une sauvegarde complète</q-item-tile>
                            </q-item-main>
                        </q-item>
                    </q-list>
                </div>
            </q-page>
        </q-page-container>
    </q-layout>
</template>

<script>

export default {
    name: 'Home',
    data () {
        return {
            crosslist: [
              { id: 1, title: 'Cross 1', icon: 'assignment', icon_color: 'primary' },
              { id: 2, title: 'Cross 2', icon: 'alarm', icon_color: 'secondary' },
              { id: 3, title: 'Cross 3', icon: 'check', icon_color: 'positive' }
            ]
        }
    }
}
</script>

<style>
</style>
