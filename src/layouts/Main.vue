<template>
    <q-layout view="hHh Lpr lFf">
        <q-layout-header>
            <q-toolbar
                color="primary"
            >
                <q-btn
                    flat
                    dense
                    round
                    @click="leftDrawerOpen = !leftDrawerOpen"
                    aria-label="Menu"
                >
                    <q-icon name="menu" />
                </q-btn>
                <q-btn-dropdown
                    class="full-width"
                    color="white"
                    text-color="blue"
                    :label="$route.params.cross_id"
                >
                    <q-list link>
                        <q-item to="/">
                        <q-item-side icon="settings" inverted color="primary" />
                        <q-item-main>
                            <q-item-tile label>Gestion des Cross</q-item-tile>
                            <q-item-tile sublabel>Nouveau, ouvrir, modifier, supprimer, importer, exporter...</q-item-tile>
                        </q-item-main>
                        </q-item>
                    </q-list>
                </q-btn-dropdown>
            </q-toolbar>
            <q-tabs class="shadow-2" align="justify">
                <q-route-tab
                    icon="settings"
                    label="Gestion du CROSS"
                    :to="'/cross/' + $route.params.cross_id + '/management'"
                    slot="title"
                />
                <q-route-tab
                    icon="directions_run"
                    label="Saisie des arrivées"
                    :to="'/cross/' + $route.params.cross_id + '/races'"
                    slot="title"
                />
                <q-route-tab
                    icon="equalizer"
                    label="Résultats"
                    to="/"
                    slot="title"
                />
            </q-tabs>
        </q-layout-header>
        <q-layout-drawer
            v-model="leftDrawerOpen"
            :content-class="$q.theme === 'mat' ? 'bg-grey-2' : null"
        >
            <router-view name="sidebar" />
        </q-layout-drawer>
        <q-page-container>
            <router-view />
        </q-page-container>
    </q-layout>
</template>

<script>

export default {
    name: 'Main',
    data () {
        return {
            leftDrawerOpen: this.$q.platform.is.desktop
        }
    }
}
</script>

<style>
</style>
