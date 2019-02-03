<template>
 	<q-list
        no-border
        link
        inset-delimiter
    >
        <q-item v-for="race in races" :key="race.id" :to="'/cross/' + $route.params.cross_id + '/races/race/' + race.id">
            <q-item-side icon="directions_run" />
            <q-item-main :label="race.title" :sublabel="'cross' + race.id" />
        </q-item>
    </q-list>
</template>

<script>
export default {
    name: 'Race_Sidebar',
    data () {
        return {
            races: [
              { id: 1, title: 'La course 1' },
              { id: 2, title: 'La course 2' },
              { id: 3, title: 'La course 3' }
            ]
        }
    }
}
</script>

<style>
</style>
