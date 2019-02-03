<template>
 	<q-list
        no-border
        link
        inset-delimiter
    >
        <q-item :to="'/cross/' + $route.params.cross_id + '/management/runners'">
            <q-item-side icon="group" />
            <q-item-main label="Coureurs" sublabel="Informations, dossards..." />
        </q-item>
        <q-item :to="'/cross/' + $route.params.cross_id + '/management/races'">
            <q-item-side icon="directions_run" />
            <q-item-main label="Courses" sublabel="Les courses prévues" />
        </q-item>
        <q-item :to="'/cross/' + $route.params.cross_id + '/management/options'">
            <q-item-side icon="settings" />
            <q-item-main label="Préférences" sublabel="Calcul des points,..." />
        </q-item>
        <q-item :to="'/cross/' + $route.params.cross_id + '/management/admin'">
            <q-item-side icon="archive" />
            <q-item-main label="Import / Export" sublabel="Charger ou sauvegarder un Cross" />
        </q-item>
    </q-list>
</template>

<script>
export default {
  name: 'Management_Sidebar'
}
</script>

<style>
</style>
